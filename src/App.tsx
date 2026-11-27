import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toJpeg, toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { FileDown, FolderOpen, Loader2, X } from 'lucide-react';
import { OprData, OprLanguage, OprThemeConfig } from './types/opr';
import {
  DEFAULT_BM_DATA,
  DEFAULT_EN_DATA,
  createInitialTheme,
  generateRandomTheme,
} from './data/presets';
import { OprForm } from './components/OprForm';
import { OprSheet } from './components/OprSheet';
import { PreviewToolbar } from './components/PreviewToolbar';
import { User } from 'firebase/auth';
import {
  clearAccessToken,
  getAccessToken,
  googleSignIn,
  incrementGlobalOprCount,
  initAuth,
  logout,
  subscribeToGlobalOprCount,
} from './firebase';
import {
  buildClientAiPoster,
  pickClientAiSample,
} from './utils/clientAiFallback';
import {
  DriveAuthExpiredError,
  DriveUploadedFile,
  UserDriveFolderState,
  listUserFolderContents,
  uploadPdfCopyToDriveFolder,
} from './utils/googleDrive';
import {
  DriveSaveModal,
  GoogleSignInButton,
} from './components/DriveSaveModal';
import { UserFolderModal } from './components/UserFolderModal';

class StaticBackendUnavailableError extends Error {
  constructor() {
    super('STATIC_BACKEND_UNAVAILABLE');
  }
}

const STORAGE_KEY = 'opr-studio-draft-v1';
const COUNT_STORAGE_KEY = 'opr-studio-generate-count-v1';

function loadInitialCount(): number {
  try {
    const raw = localStorage.getItem(COUNT_STORAGE_KEY);
    if (raw) {
      const parsed = parseInt(raw, 10);
      if (!Number.isNaN(parsed) && parsed >= 1) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage read issues
  }
  return 1;
}

function loadInitialData(): OprData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<OprData>;
      if (parsed && typeof parsed === 'object' && 'activityTitle' in parsed) {
        return {
          ...DEFAULT_BM_DATA,
          ...parsed,
          photos: Array.isArray(parsed.photos) ? parsed.photos.slice(0, 6) : [],
        };
      }
    }
  } catch {
    // Ignore storage read issues
  }
  return DEFAULT_BM_DATA;
}

export default function App() {
  const [data, setData] = useState<OprData>(loadInitialData);
  const [oprCount, setOprCount] = useState<number>(loadInitialCount);
  const [themeHistory, setThemeHistory] = useState<OprThemeConfig[]>(() => [
    createInitialTheme(),
  ]);
  const [polishWithAi, setPolishWithAi] = useState<boolean>(true);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isSampleLoading, setIsSampleLoading] = useState<boolean>(false);
  const [isExportingPng, setIsExportingPng] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [zoomMode, setZoomMode] = useState<'fit' | 'actual'>('fit');
  const [fitScale, setFitScale] = useState<number>(0.72);
  const [notice, setNotice] = useState<{
    type: 'error' | 'info';
    text: string;
  } | null>(null);
  const [mobilePane, setMobilePane] = useState<'form' | 'preview'>('form');
  const [qrHovered, setQrHovered] = useState<boolean>(false);
  const [qrPinned, setQrPinned] = useState<boolean>(false);
  const [needsDriveAuth, setNeedsDriveAuth] = useState<boolean>(true);
  const [driveUser, setDriveUser] = useState<User | null>(null);
  const [isLoggingInDrive, setIsLoggingInDrive] = useState<boolean>(false);
  const [driveModalOpen, setDriveModalOpen] = useState<boolean>(false);
  const [pendingPdfBlob, setPendingPdfBlob] = useState<Blob | null>(null);
  const [pendingPdfName, setPendingPdfName] = useState<string>('');
  const [isUploadingDrive, setIsUploadingDrive] = useState<boolean>(false);
  const [driveUploadedFile, setDriveUploadedFile] =
    useState<DriveUploadedFile | null>(null);
  const [driveError, setDriveError] = useState<string | null>(null);
  const [userFolderModalOpen, setUserFolderModalOpen] = useState<boolean>(false);
  const [isLoadingUserFolder, setIsLoadingUserFolder] = useState<boolean>(false);
  const [userFolderState, setUserFolderState] =
    useState<UserDriveFolderState | null>(null);
  const [userFolderError, setUserFolderError] = useState<string | null>(null);

  const sheetRef = useRef<HTMLDivElement | null>(null);
  const canvasHostRef = useRef<HTMLDivElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const qrCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isQrOpen = qrHovered || qrPinned;

  const openQrOnHover = () => {
    if (qrCloseTimerRef.current) {
      clearTimeout(qrCloseTimerRef.current);
      qrCloseTimerRef.current = null;
    }
    setQrHovered(true);
  };

  const closeQrOnLeave = () => {
    if (qrCloseTimerRef.current) {
      clearTimeout(qrCloseTimerRef.current);
    }
    qrCloseTimerRef.current = setTimeout(() => {
      setQrHovered(false);
    }, 180);
  };

  const closeQrModal = () => {
    if (qrCloseTimerRef.current) {
      clearTimeout(qrCloseTimerRef.current);
      qrCloseTimerRef.current = null;
    }
    setQrHovered(false);
    setQrPinned(false);
  };

  useEffect(() => {
    if (!isQrOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeQrModal();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isQrOpen]);

  const currentTheme = themeHistory[themeHistory.length - 1];

  // Auto-save draft locally (photos included if within quota)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // If quota exceeded due to large base64 photos, store text-only draft
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...data, photos: [] })
        );
      } catch {
        // Ignore storage errors
      }
    }
  }, [data]);

  // Compute responsive A4 fit scale for the preview stage
  const recomputeScale = useCallback(() => {
    const host = canvasHostRef.current;
    if (!host) return;
    const availW = Math.max(300, host.clientWidth - 48);
    const availH = Math.max(360, host.clientHeight - 48);
    const scaleW = availW / 794;
    const scaleH = availH / 1123;
    const next = Math.min(scaleW, scaleH, 0.96);
    setFitScale(Math.max(0.32, Number(next.toFixed(3))));
  }, []);

  useEffect(() => {
    recomputeScale();
    const host = canvasHostRef.current;
    if (!host || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => recomputeScale());
    observer.observe(host);
    return () => observer.disconnect();
  }, [recomputeScale, mobilePane]);

  // Initialize Google Auth state listener (in-memory token only)
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setDriveUser(user);
        setNeedsDriveAuth(false);
      },
      (user) => {
        setDriveUser(user);
        setNeedsDriveAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  const oprCountRef = useRef<number>(oprCount);
  useEffect(() => {
    oprCountRef.current = oprCount;
  }, [oprCount]);

  // Real-time Firestore subscription to sync Total OPR Generate across devices
  useEffect(() => {
    const initialLocal = loadInitialCount();
    const unsubscribe = subscribeToGlobalOprCount(
      initialLocal,
      (remoteCount) => {
        oprCountRef.current = remoteCount;
        setOprCount(remoteCount);
        try {
          localStorage.setItem(COUNT_STORAGE_KEY, String(remoteCount));
        } catch {
          // Ignore storage errors
        }
      }
    );
    return () => unsubscribe();
  }, []);

  const incrementOprCount = useCallback(() => {
    const prev = oprCountRef.current;
    const next = prev + 1;
    oprCountRef.current = next;
    setOprCount(next);
    try {
      localStorage.setItem(COUNT_STORAGE_KEY, String(next));
    } catch {
      // Ignore storage errors
    }
    void incrementGlobalOprCount(prev);
  }, []);

  const pushTheme = (nextTheme: OprThemeConfig) => {
    setThemeHistory((prev) => [...prev.slice(-14), nextTheme]);
  };

  const handleInstantRandom = () => {
    setNotice(null);
    const next = generateRandomTheme(currentTheme);
    pushTheme(next);
    incrementOprCount();
  };

  const handleUndoTheme = () => {
    setThemeHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const handleUpdateTheme = (partial: Partial<OprThemeConfig>) => {
    const updated: OprThemeConfig = {
      ...currentTheme,
      ...partial,
      id: `custom-${Date.now()}`,
    };
    pushTheme(updated);
  };

  const parseApiResponse = async (response: Response) => {
    const rawText = await response.text();
    let parsed: Record<string, unknown> | null = null;
    try {
      parsed = rawText ? (JSON.parse(rawText) as Record<string, unknown>) : null;
    } catch {
      parsed = null;
    }

    if (!response.ok) {
      const serverMsg =
        parsed && typeof parsed.error === 'string' ? parsed.error : null;
      if (!serverMsg && (response.status === 404 || response.status === 405)) {
        throw new StaticBackendUnavailableError();
      }
      throw new Error(
        serverMsg ||
          `AI service returned an unexpected response (HTTP ${response.status}). Please try again.`
      );
    }

    if (!parsed) {
      throw new StaticBackendUnavailableError();
    }

    return parsed;
  };

  const applyAiPosterResult = (
    theme: OprThemeConfig | undefined,
    polished: Partial<OprData> | null | undefined
  ) => {
    if (theme) {
      pushTheme(theme);
    }

    if (polishWithAi && polished) {
      setData((prev) => ({
        ...prev,
        subtitle: polished.subtitle?.trim() || prev.subtitle,
        objectives: polished.objectives?.trim() || prev.objectives,
        implementation: polished.implementation?.trim() || prev.implementation,
        impact: polished.impact?.trim() || prev.impact,
        reflection: polished.reflection?.trim() || prev.reflection,
      }));
    }

    setNotice({
      type: 'info',
      text: polishWithAi
        ? `Generated AI Poster "${theme?.themeLabel || 'AI Creative Poster'}" and refined your report copy. Click again for another AI poster style.`
        : `Generated AI Poster "${theme?.themeLabel || 'AI Creative Poster'}". Click again for another AI poster style.`,
    });
    incrementOprCount();
  };

  const handleAiCreativeRandom = async () => {
    setNotice(null);
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/opr/ai-poster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          data: {
            language: data.language,
            organizationName: data.organizationName,
            organizerUnit: data.organizerUnit,
            activityTitle: data.activityTitle,
            subtitle: data.subtitle,
            date: data.date,
            time: data.time,
            venue: data.venue,
            targetGroup: data.targetGroup,
            objectives: data.objectives,
            implementation: data.implementation,
            impact: data.impact,
            reflection: data.reflection,
          },
          previousVariant: currentTheme.aiPoster?.variant,
          polishContent: polishWithAi,
          variationSeed: Date.now() % 10000,
          previousStyle: currentTheme.aiPoster?.styleModifier,
        }),
      });

      const result = (await parseApiResponse(response)) as {
        theme?: OprThemeConfig;
        polished?: Partial<OprData> | null;
      };

      applyAiPosterResult(result.theme, result.polished);
    } catch (err: unknown) {
      console.warn('Falling back to client-side AI poster generator:', err);
      const fallback = buildClientAiPoster(
        data,
        currentTheme.aiPoster?.variant,
        polishWithAi
      );
      applyAiPosterResult(fallback.theme, fallback.polished);
    } finally {
      setIsAiLoading(false);
    }
  };

  const applySampleResult = (sample: Partial<OprData>) => {
    setData((prev) => ({
      ...prev,
      ...sample,
      language: prev.language,
      logoUrl: prev.logoUrl,
      photos: prev.photos,
    }));
    pushTheme(generateRandomTheme(currentTheme));
    setNotice({
      type: 'info',
      text: 'Loaded a fresh sample activity.',
    });
    incrementOprCount();
  };

  const handleAiSample = async () => {
    setNotice(null);
    setIsSampleLoading(true);
    try {
      const response = await fetch('/api/opr/ai-sample', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ language: data.language }),
      });
      const result = (await parseApiResponse(response)) as {
        sample?: Partial<OprData>;
      };
      if (result.sample) {
        applySampleResult(result.sample);
      } else {
        throw new StaticBackendUnavailableError();
      }
    } catch (err: unknown) {
      console.warn('Falling back to client-side sample generator:', err);
      const fallbackSample = pickClientAiSample(
        data.language,
        data.activityTitle
      );
      applySampleResult(fallbackSample);
    } finally {
      setIsSampleLoading(false);
    }
  };

  const handleLanguageSwitch = (lang: OprLanguage) => {
    setData((prev) => ({ ...prev, language: lang }));
  };

  const handleLoadPreset = (lang: OprLanguage) => {
    setNotice(null);
    const preset = lang === 'bm' ? DEFAULT_BM_DATA : DEFAULT_EN_DATA;
    setData((prev) => ({
      ...preset,
      logoUrl: prev.logoUrl,
      photos: prev.photos,
    }));
  };

  const handleClearForm = () => {
    setNotice(null);
    setData((prev) => ({
      ...prev,
      organizationName: '',
      organizationSub: '',
      organizerUnit: '',
      activityTitle: '',
      subtitle: '',
      date: '',
      day: '',
      time: '',
      venue: '',
      targetGroup: '',
      objectives: '',
      implementation: '',
      impact: '',
      reflection: '',
      preparedByName: '',
      preparedByRole: '',
      verifiedByName: '',
      verifiedByRole: '',
      contactInfo: '',
      photos: [],
      logoUrl: null,
    }));
  };

  const renderSheetDataUrl = async (): Promise<string> => {
    if (sheetRef.current && sheetRef.current.offsetWidth === 0) {
      setMobilePane('preview');
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      );
    }

    const node = sheetRef.current;
    if (!node) {
      throw new Error('Report preview is not ready yet.');
    }

    const baseOptions = {
      pixelRatio: 2,
      width: 794,
      height: 1123,
      backgroundColor: '#ffffff',
      style: {
        transform: 'none',
        margin: '0',
      },
      filter: (el: HTMLElement) => {
        if (el instanceof HTMLElement && el.dataset.emptySlot === 'true') {
          return false;
        }
        return true;
      },
    };

    try {
      return await toPng(node, { ...baseOptions, cacheBust: true });
    } catch {
      try {
        return await toPng(node, {
          ...baseOptions,
          cacheBust: false,
          skipFonts: true,
        });
      } catch {
        return await toJpeg(node, {
          ...baseOptions,
          cacheBust: false,
          skipFonts: true,
          pixelRatio: 1.5,
          quality: 0.94,
          imagePlaceholder:
            'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        });
      }
    }
  };

  const getSafeFileName = () =>
    (data.activityTitle || 'OPR_Report')
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 42) || 'OPR_Report';

  const handleDownloadPng = async () => {
    setIsExportingPng(true);
    setNotice(null);
    try {
      const dataUrl = await renderSheetDataUrl();
      const link = document.createElement('a');
      const isJpeg = dataUrl.startsWith('data:image/jpeg');
      link.download = `${getSafeFileName()}_OPR.${isJpeg ? 'jpg' : 'png'}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      incrementOprCount();
    } catch (err: unknown) {
      console.error('PNG export failed:', err);
      setNotice({
        type: 'error',
        text:
          err instanceof Error && err.message
            ? `Could not export image: ${err.message}`
            : 'Could not export PNG. Please try again.',
      });
    } finally {
      setIsExportingPng(false);
    }
  };

  const handleGoogleDriveLogin = async () => {
    setDriveError(null);
    setIsLoggingInDrive(true);
    try {
      const result = await googleSignIn();
      setDriveUser(result.user);
      setNeedsDriveAuth(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to sign in with Google. Please try again.';
      setDriveError(message);
    } finally {
      setIsLoggingInDrive(false);
    }
  };

  const handleGoogleDriveLogout = async () => {
    await logout();
    setDriveUser(null);
    setNeedsDriveAuth(true);
    setUserFolderState(null);
    setUserFolderModalOpen(false);
  };

  const loadUserFolder = useCallback(async () => {
    setUserFolderError(null);
    setIsLoadingUserFolder(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        setNeedsDriveAuth(true);
        setUserFolderModalOpen(false);
        return;
      }
      const state = await listUserFolderContents(
        token,
        driveUser?.email,
        driveUser?.displayName
      );
      setUserFolderState(state);
    } catch (err: unknown) {
      if (err instanceof DriveAuthExpiredError) {
        clearAccessToken();
        setNeedsDriveAuth(true);
        setUserFolderModalOpen(false);
      }
      setUserFolderError(
        err instanceof Error
          ? err.message
          : 'Unable to load your Google Drive folder.'
      );
    } finally {
      setIsLoadingUserFolder(false);
    }
  }, [driveUser?.displayName, driveUser?.email]);

  const handleOpenUserFolder = async () => {
    setUserFolderModalOpen(true);
    await loadUserFolder();
  };

  const handleConfirmDriveUpload = async () => {
    if (!pendingPdfBlob || !pendingPdfName) return;
    setDriveError(null);
    setIsUploadingDrive(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        setNeedsDriveAuth(true);
        setDriveError('Please sign in with Google to save a copy to Drive.');
        return;
      }
      const uploaded = await uploadPdfCopyToDriveFolder(
        pendingPdfBlob,
        pendingPdfName,
        token,
        driveUser?.email,
        driveUser?.displayName
      );
      setDriveUploadedFile(uploaded);
      setNotice({
        type: 'info',
        text: `PDF downloaded and saved to Google Drive folder "${uploaded.folderName}" (${uploaded.name}).`,
      });
    } catch (err: unknown) {
      if (err instanceof DriveAuthExpiredError) {
        clearAccessToken();
        setNeedsDriveAuth(true);
      }
      setDriveError(
        err instanceof Error
          ? err.message
          : 'Failed to save PDF copy to Google Drive.'
      );
    } finally {
      setIsUploadingDrive(false);
    }
  };

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    setNotice(null);
    try {
      const dataUrl = await renderSheetDataUrl();
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });
      const imageFormat = dataUrl.startsWith('data:image/jpeg')
        ? 'JPEG'
        : 'PNG';
      pdf.addImage(dataUrl, imageFormat, 0, 0, 210, 297, undefined, 'FAST');
      const fileName = `${getSafeFileName()}_OPR.pdf`;
      const pdfBlob = pdf.output('blob');
      pdf.save(fileName);
      incrementOprCount();
      setPendingPdfBlob(pdfBlob);
      setPendingPdfName(fileName);
      setDriveUploadedFile(null);
      setDriveError(null);
      setDriveModalOpen(true);
      setNotice({
        type: 'info',
        text: 'A4 PDF downloaded successfully.',
      });
    } catch (err: unknown) {
      console.error('PDF export failed:', err);
      setNotice({
        type: 'error',
        text:
          err instanceof Error && err.message
            ? `Could not generate PDF: ${err.message}`
            : 'Could not generate PDF. Please try Download PNG instead.',
      });
    } finally {
      setIsExportingPdf(false);
    }
  };

  const activeScale = zoomMode === 'fit' ? fitScale : 1;

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#F4F5F7] text-slate-900">
      {/* Strict 3-Zone Top Bar */}
      <header className="no-print h-14 px-6 bg-white border-b border-slate-200 flex items-center justify-between gap-8 shrink-0">
        {/* Zone 1: Brand wordmark & Total OPR Generated counter */}
        <div className="flex flex-col justify-center shrink-0">
          <span className="font-display-bricolage text-[17px] font-extrabold tracking-tight text-slate-900 leading-tight whitespace-nowrap">
            OPR Studio
          </span>
          <span className="font-mono-tabular text-[10.5px] font-semibold text-slate-500 leading-tight whitespace-nowrap mt-0.5">
            Total OPR Generate : {String(oprCount).padStart(4, '0')}
          </span>
        </div>

        {/* Zone 2: Concise single-line text nav/utility links */}
        <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-slate-600">
          <button
            type="button"
            onClick={() => handleLoadPreset('bm')}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Sample BM
          </button>
          <button
            type="button"
            onClick={() => handleLoadPreset('en')}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Sample EN
          </button>
          <button
            type="button"
            disabled={isSampleLoading}
            onClick={handleAiSample}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 disabled:opacity-50 cursor-pointer"
          >
            {isSampleLoading ? 'Generating Sample...' : 'AI Sample'}
          </button>
          <button
            type="button"
            onClick={handleClearForm}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Clear All
          </button>
        </nav>

        {/* Zone 3: Support graphic & Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            role="button"
            tabIndex={0}
            aria-label="Buy Me a Coffee QR Code"
            onMouseEnter={openQrOnHover}
            onMouseLeave={closeQrOnLeave}
            onClick={() => setQrPinned((prev) => !prev)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setQrPinned((prev) => !prev);
              }
            }}
            className="h-10 w-[132px] overflow-hidden rounded-lg bg-white flex items-center justify-center shrink-0 cursor-pointer transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            <img
              src={`${import.meta.env.BASE_URL}assets/aistudio/buy-me-a-coffee-logo-6100_247c69aa.jpg`}
              alt="Buy Me a Coffee"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover scale-[1.65]"
            />
          </div>
          <button
            type="button"
            disabled={isExportingPdf}
            onClick={handleExportPdf}
            className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 disabled:opacity-60 cursor-pointer"
          >
            {isExportingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4" />
            )}
            <span>
              {isExportingPdf ? 'Generating PDF...' : 'Download PDF'}
            </span>
          </button>
          {needsDriveAuth ? (
            <div className="hidden sm:block">
              <GoogleSignInButton
                compact
                onClick={handleGoogleDriveLogin}
                disabled={isLoggingInDrive}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOpenUserFolder}
              title={`Open your Drive folder (${driveUser?.email || 'My Folder'})`}
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 text-[12px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="max-w-[130px] truncate">
                {driveUser?.email || 'My Folder'}
              </span>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Pane Switcher (visible below lg) */}
      <div className="no-print lg:hidden px-4 py-2 bg-white border-b border-slate-200 flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => setMobilePane('form')}
          className={`flex-1 py-2 text-[13px] font-semibold rounded-lg transition-colors ${
            mobilePane === 'form'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 bg-slate-100'
          }`}
        >
          Edit Form ({data.photos.length}/6 Photos)
        </button>
        <button
          type="button"
          onClick={() => setMobilePane('preview')}
          className={`flex-1 py-2 text-[13px] font-semibold rounded-lg transition-colors ${
            mobilePane === 'preview'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 bg-slate-100'
          }`}
        >
          Live A4 Preview
        </button>
      </div>

      {/* Main Split Studio Workspace */}
      <main className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Form Sidebar */}
        <aside
          className={`no-print w-full lg:w-[430px] xl:w-[460px] shrink-0 h-full overflow-hidden ${
            mobilePane === 'form' ? 'block' : 'hidden lg:block'
          }`}
        >
          <OprForm
            data={data}
            onChange={setData}
            onLanguageSwitch={handleLanguageSwitch}
            photoInputRef={photoInputRef}
          />
        </aside>

        {/* Right Live A4 Preview Pane */}
        <section
          className={`flex-1 flex flex-col min-w-0 h-full overflow-hidden ${
            mobilePane === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <PreviewToolbar
            theme={currentTheme}
            canUndo={themeHistory.length > 1}
            isAiLoading={isAiLoading}
            isExportingPng={isExportingPng}
            polishWithAi={polishWithAi}
            zoomMode={zoomMode}
            onTogglePolishWithAi={setPolishWithAi}
            onInstantRandom={handleInstantRandom}
            onAiCreativeRandom={handleAiCreativeRandom}
            onUndoTheme={handleUndoTheme}
            onUpdateTheme={handleUpdateTheme}
            onDownloadPng={handleDownloadPng}
            onToggleZoom={() =>
              setZoomMode((z) => (z === 'fit' ? 'actual' : 'fit'))
            }
          />

          {/* Subtle Inline Feedback Banner (error or AI note) */}
          {notice && (
            <div
              className={`no-print px-5 py-2.5 text-[12.5px] flex items-center justify-between gap-3 border-b shrink-0 ${
                notice.type === 'error'
                  ? 'bg-red-50 text-red-800 border-red-200'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-200'
              }`}
            >
              <span>{notice.text}</span>
              <button
                type="button"
                onClick={() => setNotice(null)}
                aria-label="Close notice"
                className="opacity-70 hover:opacity-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Centered A4 Preview Stage */}
          <div
            ref={canvasHostRef}
            id="opr-print-root"
            className="flex-1 overflow-auto workspace-scroll bg-[#EAECEF] flex items-start justify-center p-6"
          >
            <div
              style={{
                width: Math.round(794 * activeScale),
                height: Math.round(1123 * activeScale),
              }}
              className="relative shrink-0 mx-auto my-auto"
            >
              <div
                id="opr-print-scale-wrapper"
                style={{
                  transform: `scale(${activeScale})`,
                  transformOrigin: 'top left',
                  width: 794,
                  height: 1123,
                }}
                className="transition-transform duration-200 ease-out"
              >
                <OprSheet
                  ref={sheetRef}
                  data={data}
                  theme={currentTheme}
                  onEmptyPhotoClick={() => photoInputRef.current?.click()}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Center-Screen QR Code Popup on Hover or Click */}
      {isQrOpen && (
        <div
          onClick={closeQrModal}
          className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-[2px]"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Buy Me a Coffee QR Code"
            onMouseEnter={openQrOnHover}
            onMouseLeave={closeQrOnLeave}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[360px] rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[14px] font-bold text-slate-900">
                Buy Me a Coffee
              </span>
              <button
                type="button"
                onClick={closeQrModal}
                aria-label="Close QR popup"
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-slate-50 flex flex-col items-center">
              <img
                src={`${import.meta.env.BASE_URL}assets/aistudio/IMAGE_2026-11-26_20_31_43_8622c06c.jpg`}
                alt="DuitNow QR Code"
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[70vh] object-contain rounded-xl shadow-xs"
              />
              <p className="text-[12px] text-slate-500 mt-3 mb-0 text-center">
                Scan the DuitNow QR code to support OPR Studio
              </p>
            </div>
          </div>
        </div>
      )}
      <DriveSaveModal
        isOpen={driveModalOpen}
        fileName={pendingPdfName}
        needsAuth={needsDriveAuth}
        user={driveUser}
        isLoggingIn={isLoggingInDrive}
        isUploading={isUploadingDrive}
        uploadedFile={driveUploadedFile}
        errorMessage={driveError}
        onClose={() => setDriveModalOpen(false)}
        onGoogleLogin={handleGoogleDriveLogin}
        onLogout={handleGoogleDriveLogout}
        onConfirmUpload={handleConfirmDriveUpload}
      />
      <UserFolderModal
        isOpen={userFolderModalOpen}
        user={driveUser}
        isLoading={isLoadingUserFolder}
        folderState={userFolderState}
        errorMessage={userFolderError}
        onClose={() => setUserFolderModalOpen(false)}
        onRefresh={loadUserFolder}
        onLogout={handleGoogleDriveLogout}
      />
    </div>
  );
}
