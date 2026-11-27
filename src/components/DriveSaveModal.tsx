import React from 'react';
import { User } from 'firebase/auth';
import {
  CheckCircle2,
  ExternalLink,
  FolderUp,
  Loader2,
  LogOut,
  X,
} from 'lucide-react';
import {
  DriveUploadedFile,
  getUserFolderName,
} from '../utils/googleDrive';

interface GoogleSignInButtonProps {
  onClick: () => void;
  disabled?: boolean;
  compact?: boolean;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onClick,
  disabled = false,
  compact = false,
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2.5 bg-white text-[#1F1F1F] border border-[#747775] rounded-[4px] font-medium hover:bg-[#F8FAFD] hover:shadow-xs active:bg-[#EEF2F6] transition-colors disabled:opacity-60 cursor-pointer shrink-0 whitespace-nowrap ${
      compact ? 'h-9 px-3 text-[13px]' : 'h-10 px-4 text-[14px] w-full'
    }`}
    style={{ fontFamily: "'DM Sans', Roboto, sans-serif" }}
  >
    <span className="w-[18px] h-[18px] shrink-0 block">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="w-full h-full block"
      >
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
        />
        <path
          fill="#FBBC05"
          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
        />
        <path fill="none" d="M0 0h48v48H0z" />
      </svg>
    </span>
    <span>{disabled ? 'Signing in...' : 'Sign in with Google'}</span>
  </button>
);

interface DriveSaveModalProps {
  isOpen: boolean;
  fileName: string;
  needsAuth: boolean;
  user: User | null;
  isLoggingIn: boolean;
  isUploading: boolean;
  uploadedFile: DriveUploadedFile | null;
  errorMessage: string | null;
  onClose: () => void;
  onGoogleLogin: () => void;
  onLogout: () => void;
  onConfirmUpload: () => void;
}

export const DriveSaveModal: React.FC<DriveSaveModalProps> = ({
  isOpen,
  fileName,
  needsAuth,
  user,
  isLoggingIn,
  isUploading,
  uploadedFile,
  errorMessage,
  onClose,
  onGoogleLogin,
  onLogout,
  onConfirmUpload,
}) => {
  if (!isOpen) return null;

  const targetSubfolderName = user
    ? getUserFolderName(user.email, user.displayName)
    : null;

  return (
    <div
      onClick={onClose}
      className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-[2px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Save PDF Copy to Google Drive"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
      >
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderUp className="w-4 h-4 text-slate-800" />
            <span className="text-[14px] font-bold text-slate-900">
              Save PDF Copy to Google Drive
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 space-y-2 text-[12.5px]">
            <div className="flex items-start justify-between gap-2">
              <span className="text-slate-500 shrink-0">PDF File:</span>
              <span className="font-semibold text-slate-900 text-right break-all">
                {fileName}
              </span>
            </div>
            {targetSubfolderName && (
              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-500 shrink-0">Your Folder:</span>
                <span className="font-semibold text-slate-900 text-right break-all">
                  {targetSubfolderName}
                </span>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-[12.5px] text-red-800">
              {errorMessage}
            </div>
          )}

          {uploadedFile ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-900 text-[13px] font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Saved in folder &ldquo;{uploadedFile.folderName}&rdquo;</span>
              </div>
              <p className="text-[12px] text-emerald-800 break-all">
                {uploadedFile.name}
              </p>
              <div className="flex items-center gap-2 pt-1">
                {uploadedFile.webViewLink && (
                  <a
                    href={uploadedFile.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-[12px] font-semibold hover:bg-emerald-800 transition-colors"
                  >
                    <span>Open File in Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <a
                  href={uploadedFile.folderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-900 text-[12px] font-semibold hover:bg-emerald-100 transition-colors"
                >
                  <span>Open Sub-folder</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : needsAuth ? (
            <div className="space-y-3">
              <p className="text-[12.5px] text-slate-600">
                Your PDF has been downloaded locally. Sign in with your Google
                account to save a copy into the shared Drive folder.
              </p>
              <GoogleSignInButton
                onClick={onGoogleLogin}
                disabled={isLoggingIn}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {user && (
                <div className="flex items-center justify-between gap-2 text-[12px] text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/70">
                  <span className="truncate">
                    Signed in as{' '}
                    <strong className="text-slate-900">
                      {user.email || user.displayName || 'Google User'}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 shrink-0 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
              <p className="text-[12.5px] text-slate-600">
                Confirm saving a copy of <strong>{fileName}</strong> into the
                Google Drive folder above?
              </p>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isUploading}
                  className="px-3.5 py-2 text-[13px] font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={onConfirmUpload}
                  className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FolderUp className="w-4 h-4" />
                  )}
                  <span>
                    {isUploading ? 'Saving to Drive...' : 'Save Copy to Drive'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
