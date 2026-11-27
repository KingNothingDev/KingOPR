import React, { useState } from 'react';
import {
  Download,
  Loader2,
  Palette,
  Shuffle,
  SlidersHorizontal,
  Sparkles,
  Undo2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  AiPosterStyleModifier,
  AiPosterVariant,
  FontPairId,
  LayoutId,
  OprPalette,
  OprThemeConfig,
  PhotoFrameStyle,
} from '../types/opr';
import {
  COLOR_PALETTES,
  FONT_PAIRS,
  LAYOUT_OPTIONS,
  PHOTO_FRAME_OPTIONS,
} from '../data/presets';

interface PreviewToolbarProps {
  theme: OprThemeConfig;
  canUndo: boolean;
  isAiLoading: boolean;
  isExportingPng: boolean;
  polishWithAi: boolean;
  zoomMode: 'fit' | 'actual';
  onTogglePolishWithAi: (next: boolean) => void;
  onInstantRandom: () => void;
  onAiCreativeRandom: () => void;
  onUndoTheme: () => void;
  onUpdateTheme: (partial: Partial<OprThemeConfig>) => void;
  onDownloadPng: () => void;
  onToggleZoom: () => void;
}

export const PreviewToolbar: React.FC<PreviewToolbarProps> = ({
  theme,
  canUndo,
  isAiLoading,
  isExportingPng,
  polishWithAi,
  zoomMode,
  onTogglePolishWithAi,
  onInstantRandom,
  onAiCreativeRandom,
  onUndoTheme,
  onUpdateTheme,
  onDownloadPng,
  onToggleZoom,
}) => {
  const [showCustomize, setShowCustomize] = useState(false);

  const currentLayoutMeta =
    LAYOUT_OPTIONS.find((l) => l.id === theme.layout) ||
    (theme.layout === 'ai-vibrant-poster'
      ? { id: 'ai-vibrant-poster', name: theme.themeLabel || 'AI Vibrant OPR Poster' }
      : LAYOUT_OPTIONS[0]);

  return (
    <div className="no-print border-b border-slate-200 bg-white shrink-0">
      {/* Primary Action Strip */}
      <div className="px-5 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Instant Random Format */}
          <button
            type="button"
            onClick={onInstantRandom}
            className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Shuffle className="w-4 h-4" />
            <span>Random Format</span>
          </button>

          {/* AI Creative Remix — Generates random Gemini/ChatGPT-style illustrated OPR posters */}
          <button
            type="button"
            disabled={isAiLoading}
            onClick={onAiCreativeRandom}
            className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg hover:from-emerald-700 hover:to-teal-700 shadow-xs active:scale-[0.99] transition-all whitespace-nowrap shrink-0 disabled:opacity-60 cursor-pointer"
          >
            {isAiLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{isAiLoading ? 'Creating AI Poster...' : 'AI Creative Remix'}</span>
          </button>

          {/* Toggle whether AI Remix also polishes copy */}
          <label className="inline-flex items-center gap-1.5 pl-1.5 pr-2 py-1.5 text-[12px] font-medium text-slate-600 cursor-pointer select-none whitespace-nowrap">
            <input
              type="checkbox"
              checked={polishWithAi}
              onChange={(e) => onTogglePolishWithAi(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
            />
            <span>Polish text</span>
          </label>

          {canUndo && (
            <button
              type="button"
              onClick={onUndoTheme}
              title="Revert to previous style"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-[12.5px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          )}
        </div>

        {/* Right Controls: Customize, Zoom, Download PNG */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCustomize((s) => !s)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-[12.5px] font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              showCustomize
                ? 'bg-slate-100 border-slate-300 text-slate-900'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Customize</span>
          </button>

          <button
            type="button"
            onClick={onToggleZoom}
            title={zoomMode === 'fit' ? 'View at 100% scale' : 'Fit page to screen'}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-[12.5px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {zoomMode === 'fit' ? (
              <ZoomIn className="w-3.5 h-3.5" />
            ) : (
              <ZoomOut className="w-3.5 h-3.5" />
            )}
            <span>{zoomMode === 'fit' ? '100%' : 'Fit'}</span>
          </button>

          <button
            type="button"
            disabled={isExportingPng}
            onClick={onDownloadPng}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[12.5px] font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 disabled:opacity-60 cursor-pointer"
          >
            {isExportingPng ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isExportingPng ? 'Saving...' : 'Download PNG'}</span>
          </button>
        </div>
      </div>

      {/* Quiet Unboxed Active Style Metadata Row */}
      <div className="px-5 py-2 bg-slate-50/75 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[12px] text-slate-500">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-slate-800 truncate">
            {currentLayoutMeta.name}
          </span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{theme.palette.name}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">
            {FONT_PAIRS.find((f) => f.id === theme.fontPair)?.name}
          </span>
          {theme.aiDesignNote && (
            <>
              <span aria-hidden="true" className="hidden xl:inline">
                ·
              </span>
              <span className="hidden xl:inline text-emerald-700 truncate max-w-[380px]">
                {theme.aiDesignNote}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {theme.layout === 'ai-vibrant-poster' && (
            <div className="flex items-center gap-1 text-[11px]">
              {(
                [
                  { id: 'vibrant-bento', label: 'Vibrant Sky' },
                  { id: 'sticker-cloud', label: 'Sticker Cloud' },
                  { id: 'campus-tricolumn', label: 'Emerald 3-Col' },
                  { id: 'editorial-3d', label: 'Editorial 3D' },
                ] as { id: AiPosterVariant; label: string }[]
              ).map((v) => {
                const active = (theme.aiPoster?.variant || 'vibrant-bento') === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() =>
                      onUpdateTheme({
                        layout: 'ai-vibrant-poster',
                        themeLabel: `AI ${v.label}`,
                        aiGenerated: true,
                        aiPoster: {
                          schoolMotto:
                            theme.aiPoster?.schoolMotto || 'Ilmu • Disiplin • Jaya',
                          heroTitle: theme.aiPoster?.heroTitle || '',
                          objectives: theme.aiPoster?.objectives || [],
                          activities: theme.aiPoster?.activities || [],
                          impacts: theme.aiPoster?.impacts || [],
                          challenges: theme.aiPoster?.challenges || [],
                          recommendations: theme.aiPoster?.recommendations || [],
                          closingSlogan: theme.aiPoster?.closingSlogan || '',
                          ...theme.aiPoster,
                          variant: v.id,
                        },
                      })
                    }
                    className={`px-2 py-0.5 rounded font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-emerald-700 text-white'
                        : 'text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    {v.label}
                  </button>
                );
              })}
            </div>
          )}
          {theme.aiGenerated && theme.layout !== 'ai-vibrant-poster' && (
            <div className="flex items-center gap-1 text-[11px]">
              {(
                [
                  { id: 'playful-illustrated', label: 'Playful' },
                  { id: 'corporate-ed', label: 'Corporate-Ed' },
                  { id: 'futuristic-tech', label: 'Futuristic' },
                ] as { id: AiPosterStyleModifier; label: string }[]
              ).map((mod) => {
                const active =
                  (theme.aiPoster?.styleModifier || 'playful-illustrated') === mod.id;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() =>
                      onUpdateTheme({
                        aiGenerated: true,
                        aiPoster: {
                          schoolMotto:
                            theme.aiPoster?.schoolMotto || 'Ilmu • Disiplin • Jaya',
                          heroTitle: theme.aiPoster?.heroTitle || '',
                          objectives: theme.aiPoster?.objectives || [],
                          activities: theme.aiPoster?.activities || [],
                          impacts: theme.aiPoster?.impacts || [],
                          challenges: theme.aiPoster?.challenges || [],
                          recommendations: theme.aiPoster?.recommendations || [],
                          closingSlogan: theme.aiPoster?.closingSlogan || '',
                          ...theme.aiPoster,
                          styleModifier: mod.id,
                        },
                      })
                    }
                    className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                      active
                        ? 'bg-emerald-700 text-white'
                        : 'text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    {mod.label}
                  </button>
                );
              })}
            </div>
          )}
          <span className="font-mono-tabular text-[11.5px] text-slate-500 shrink-0">
            A4 Portrait · 210 × 297 mm
          </span>
        </div>
      </div>

      {/* Collapsible Manual Fine-Tune Drawer */}
      {showCustomize && (
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 space-y-4">
          {/* Layout Selector */}
          <div>
            <div className="text-[11.5px] font-semibold text-slate-600 mb-2">
              Layout Format ({LAYOUT_OPTIONS.length} Designs)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {LAYOUT_OPTIONS.map((layout) => {
                const active = theme.layout === layout.id;
                return (
                  <button
                    key={layout.id}
                    type="button"
                    onClick={() =>
                      onUpdateTheme({ layout: layout.id as LayoutId })
                    }
                    className={`px-3 py-2 text-left rounded-lg border transition-colors cursor-pointer ${
                      active
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-[12px] font-semibold leading-tight truncate">
                      {layout.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Color Palette Swatches */}
            <div className="md:col-span-6">
              <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-600 mb-2">
                <Palette className="w-3.5 h-3.5" />
                <span>Color Theme</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {COLOR_PALETTES.map((pal: OprPalette) => {
                  const active = theme.palette.id === pal.id;
                  return (
                    <button
                      key={pal.id}
                      type="button"
                      title={pal.name}
                      onClick={() => onUpdateTheme({ palette: pal })}
                      className={`h-8 px-2 rounded-lg border flex items-center gap-1.5 bg-white transition-all cursor-pointer ${
                        active
                          ? 'border-slate-900 ring-2 ring-slate-900/15'
                          : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-sm shrink-0"
                        style={{ backgroundColor: pal.primary }}
                      />
                      <span
                        className="w-2.5 h-4 rounded-sm shrink-0"
                        style={{ backgroundColor: pal.accent }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Typography & Photo Frame */}
            <div className="md:col-span-6 grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="opr-font-select"
                  className="block text-[11.5px] font-semibold text-slate-600 mb-2"
                >
                  Typography
                </label>
                <select
                  id="opr-font-select"
                  value={theme.fontPair}
                  onChange={(e) =>
                    onUpdateTheme({ fontPair: e.target.value as FontPairId })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12.5px] text-slate-800 focus:border-slate-900 focus:outline-none"
                >
                  {FONT_PAIRS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="opr-frame-select"
                  className="block text-[11.5px] font-semibold text-slate-600 mb-2"
                >
                  Photo Frame
                </label>
                <select
                  id="opr-frame-select"
                  value={theme.photoFrame}
                  onChange={(e) =>
                    onUpdateTheme({
                      photoFrame: e.target.value as PhotoFrameStyle,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12.5px] text-slate-800 focus:border-slate-900 focus:outline-none capitalize"
                >
                  {PHOTO_FRAME_OPTIONS.map((frame) => (
                    <option key={frame} value={frame}>
                      {frame.replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
