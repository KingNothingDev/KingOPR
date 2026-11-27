import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { FileDown, Loader2, X } from 'lucide-react';
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
import {
  incrementGlobalOprCount,
  subscribeToGlobalOprCount,
} from './firebase';

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

  // Real-time Firestore subscription to sync Total OPR Generate across devices
  useEffect(() => {
    const initialLocal = loadInitialCount();
    const unsubscribe = subscribeToGlobalOprCount(
      initialLocal,
      (remoteCount) => {
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
    setOprCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem(COUNT_STORAGE_KEY, String(next));
      } catch {
        // Ignore storage errors
      }
      void incrementGlobalOprCount(prev);
      return next;
    });
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
      throw new Error(
        serverMsg ||
          `AI service returned an unexpected response (HTTP ${response.status}). Please try again.`
      );
    }

    if (!parsed) {
      throw new Error(
        'Received an unexpected non-JSON response from the server. Please try again.'
      );
    }

    return parsed;
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

      if (result.theme) {
        pushTheme(result.theme);
      }

      if (polishWithAi && result.polished) {
        const p = result.polished;
        setData((prev) => ({
          ...prev,
          subtitle: p.subtitle?.trim() || prev.subtitle,
          objectives: p.objectives?.trim() || prev.objectives,
          implementation: p.implementation?.trim() || prev.implementation,
          impact: p.impact?.trim() || prev.impact,
          reflection: p.reflection?.trim() || prev.reflection,
        }));
      }

      setNotice({
        type: 'info',
        text: polishWithAi
          ? `Generated AI Poster "${result.theme?.themeLabel || 'AI Creative Poster'}" and refined your report copy. Click again for another AI poster style.`
          : `Generated AI Poster "${result.theme?.themeLabel || 'AI Creative Poster'}". Click again for another AI poster style.`,
      });
      incrementOprCount();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unable to generate AI OPR poster.';
      setNotice({ type: 'error', text: message });
    } finally {
      setIsAiLoading(false);
    }
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
        setData((prev) => ({
          ...prev,
          ...result.sample,
          language: prev.language,
          logoUrl: prev.logoUrl,
          photos: prev.photos,
        }));
        pushTheme(generateRandomTheme(currentTheme));
        setNotice({
          type: 'info',
          text: 'Loaded a fresh AI-generated sample activity.',
        });
        incrementOprCount();
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Could not load AI sample.';
      setNotice({ type: 'error', text: message });
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

    const exportOptions = {
      cacheBust: true,
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
      return await toPng(node, exportOptions);
    } catch {
      return await toPng(node, { ...exportOptions, skipFonts: true });
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
      link.download = `${getSafeFileName()}_OPR.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      incrementOprCount();
    } catch {
      setNotice({
        type: 'error',
        text: 'Could not export PNG. Please try again.',
      });
    } finally {
      setIsExportingPng(false);
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
      pdf.addImage(dataUrl, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
      pdf.save(`${getSafeFileName()}_OPR.pdf`);
      incrementOprCount();
      setNotice({
        type: 'info',
        text: 'A4 PDF downloaded successfully.',
      });
    } catch {
      setNotice({
        type: 'error',
        text: 'Could not generate PDF. Please try Download PNG instead.',
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
              src="/assets/aistudio/buy-me-a-coffee-logo-6100_247c69aa.jpg"
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
            <span>{isExportingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>
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
                src="/assets/aistudio/IMAGE_2026-11-26_20_31_43_8622c06c.jpg"
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
    </div>
  );
}
