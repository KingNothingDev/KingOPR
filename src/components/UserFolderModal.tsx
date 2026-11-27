import React from 'react';
import { User } from 'firebase/auth';
import {
  ExternalLink,
  FileText,
  FolderOpen,
  Loader2,
  LogOut,
  RefreshCw,
  X,
} from 'lucide-react';
import {
  getUserFolderName,
  UserDriveFolderState,
} from '../utils/googleDrive';

interface UserFolderModalProps {
  isOpen: boolean;
  user: User | null;
  isLoading: boolean;
  folderState: UserDriveFolderState | null;
  errorMessage: string | null;
  onClose: () => void;
  onRefresh: () => void;
  onLogout: () => void;
}

function formatFileSize(sizeStr?: string): string {
  const bytes = sizeStr ? parseInt(sizeStr, 10) : NaN;
  if (Number.isNaN(bytes) || bytes <= 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatModified(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export const UserFolderModal: React.FC<UserFolderModalProps> = ({
  isOpen,
  user,
  isLoading,
  folderState,
  errorMessage,
  onClose,
  onRefresh,
  onLogout,
}) => {
  if (!isOpen) return null;

  const folderName =
    folderState?.folderName ||
    getUserFolderName(user?.email, user?.displayName);

  return (
    <div
      onClick={onClose}
      className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-[2px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="My OPR Drive Folder"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[460px] rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
      >
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <FolderOpen className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="text-[14px] font-bold text-slate-900 truncate">
              My Drive Folder
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh folder"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="rounded-xl bg-emerald-50/70 border border-emerald-200/80 px-3.5 py-2.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-emerald-700 uppercase tracking-wide">
                Your Folder (Email)
              </div>
              <div className="text-[13px] font-semibold text-slate-900 truncate">
                {folderName}
              </div>
            </div>
            {folderState?.folderUrl && (
              <a
                href={folderState.folderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-[12px] font-semibold hover:bg-emerald-800 transition-colors shrink-0"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Open in Drive</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {errorMessage && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-[12.5px] text-red-800">
              {errorMessage}
            </div>
          )}

          {isLoading ? (
            <div className="py-10 flex flex-col items-center justify-center gap-2 text-slate-500 text-[12.5px]">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
              <span>Loading your OPR PDFs...</span>
            </div>
          ) : folderState && folderState.files.length > 0 ? (
            <div className="max-h-[260px] overflow-y-auto workspace-scroll divide-y divide-slate-100 border border-slate-200 rounded-xl">
              {folderState.files.map((file) => {
                const metaParts = [
                  formatModified(file.modifiedTime),
                  formatFileSize(file.size),
                ].filter(Boolean);
                return (
                  <a
                    key={file.id}
                    href={file.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[12.5px] font-medium text-slate-900 truncate group-hover:text-blue-700">
                          {file.name}
                        </div>
                        {metaParts.length > 0 && (
                          <div className="text-[11px] text-slate-500">
                            {metaParts.join(' · ')}
                          </div>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700 shrink-0" />
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4">
              <p className="text-[12.5px] text-slate-600">
                No PDF reports saved in <strong>{folderName}</strong> yet.
              </p>
              <p className="text-[11.5px] text-slate-500 mt-1">
                Click <strong>Download PDF</strong> to save a copy into your
                folder.
              </p>
            </div>
          )}

          <div className="pt-1 border-t border-slate-100 flex items-center justify-between gap-2 text-[12px]">
            <span className="text-slate-500 truncate">
              Signed in as{' '}
              <strong className="text-slate-800">
                {user?.email || user?.displayName || 'Google User'}
              </strong>
            </span>
            <button
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
