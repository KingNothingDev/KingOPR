import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { OprData, OprThemeConfig } from '../types/opr';
import {
  DiagonalDiamondLayout,
  GeometricCirclesLayout,
  HoneycombWaveLayout,
  SidebarRibbonLayout,
} from './layouts/ClassicOprLayouts';
import {
  ArchivalSplitLayout,
  BentoShowcaseLayout,
  BroadsheetBlocksLayout,
  SwissEditorialLayout,
} from './layouts/EditorialOprLayouts';
import {
  NumberedDashboardLayout,
  PosterInfographicLayout,
  SwooshCirclesLayout,
  TriColumnGalleryLayout,
} from './layouts/InfographicOprLayouts';
import { AiVibrantPosterLayout } from './layouts/AiVibrantPosterLayout';

interface OprSheetProps {
  data: OprData;
  theme: OprThemeConfig;
  onEmptyPhotoClick?: () => void;
}

interface SavedTextNode {
  el: HTMLElement;
  origFs: number;
  origLh: number;
}

function resetAutoFitOverrides(root: HTMLElement) {
  const modified = root.querySelectorAll<HTMLElement>('[data-sheetfit-orig-fs]');
  modified.forEach((el) => {
    el.style.fontSize = el.dataset.sheetfitPrevFs || '';
    el.style.lineHeight = el.dataset.sheetfitPrevLh || '';
    delete el.dataset.sheetfitOrigFs;
    delete el.dataset.sheetfitPrevFs;
    delete el.dataset.sheetfitPrevLh;
  });
}

function saveAndCollectTextNodes(container: HTMLElement): SavedTextNode[] {
  const results: SavedTextNode[] = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT);
  let node = walker.nextNode() as HTMLElement | null;

  while (node) {
    if (
      !node.closest('svg') &&
      !node.closest('[data-empty-slot="true"]') &&
      !node.closest('[data-autofit-box="true"]') &&
      node.dataset.autofitManaged !== 'true'
    ) {
      const hasDirectText = Array.from(node.childNodes).some(
        (c) => c.nodeType === Node.TEXT_NODE && (c.textContent?.trim().length ?? 0) > 0
      );
      if (hasDirectText) {
        const cs = window.getComputedStyle(node);
        const fs = parseFloat(cs.fontSize);
        const lh = parseFloat(cs.lineHeight);
        if (!Number.isNaN(fs) && fs > 7.5) {
          if (!node.dataset.sheetfitOrigFs) {
            node.dataset.sheetfitPrevFs = node.style.fontSize;
            node.dataset.sheetfitPrevLh = node.style.lineHeight;
            node.dataset.sheetfitOrigFs = String(fs);
          }
          results.push({
            el: node,
            origFs: parseFloat(node.dataset.sheetfitOrigFs) || fs,
            origLh: Number.isNaN(lh) ? fs * 1.32 : lh,
          });
        }
      }
    }
    node = walker.nextNode() as HTMLElement | null;
  }

  return results;
}

/**
 * Sheet-wide Auto-Fit Text Engine:
 * Runs after every data/theme update and font load across all 13 A4 layouts.
 * 1) Shrinks any single-line/truncated heading or badge that overflows horizontally.
 * 2) Shrinks any card/column or whole A4 sheet that overflows vertically beyond 794x1123.
 */
function runSheetAutoFit(sheetEl: HTMLElement) {
  const layoutRoot = sheetEl.firstElementChild as HTMLElement | null;
  if (!layoutRoot) return;

  resetAutoFitOverrides(sheetEl);

  // Phase 1: Fit individually overflowing headings, badges, or truncated single-line text
  const allTextNodes = saveAndCollectTextNodes(layoutRoot);
  for (const item of allTextNodes) {
    const { el, origFs, origLh } = item;
    if (el.clientWidth <= 0 || el.clientHeight <= 0) continue;

    const cs = window.getComputedStyle(el);
    const isHorizontalClipped =
      (cs.whiteSpace === 'nowrap' || cs.textOverflow === 'ellipsis') &&
      el.scrollWidth > el.clientWidth + 2;
    const isVerticalClipped =
      (cs.overflowY === 'hidden' || cs.overflow === 'hidden') &&
      el.scrollHeight > el.clientHeight + 2;

    if (!isHorizontalClipped && !isVerticalClipped) continue;

    const minFs = Math.max(7.5, origFs * 0.58);
    let low = minFs;
    let high = origFs;
    let best = minFs;

    while (high - low > 0.45) {
      const mid = Math.round(((low + high) / 2) * 2) / 2;
      el.style.fontSize = `${mid}px`;
      el.style.lineHeight = `${Math.max(mid * 1.14, origLh * (mid / origFs)).toFixed(2)}px`;

      const stillOver =
        (isHorizontalClipped && el.scrollWidth > el.clientWidth + 1) ||
        (isVerticalClipped && el.scrollHeight > el.clientHeight + 1);

      if (stillOver) {
        high = mid - 0.5;
      } else {
        best = mid;
        low = mid;
      }
    }

    el.style.fontSize = `${best}px`;
    el.style.lineHeight = `${Math.max(best * 1.14, origLh * (best / origFs)).toFixed(2)}px`;
  }

  // Phase 2: Check for sheet-wide or clipped-panel vertical overflow inside the fixed 794x1123 A4 page
  const hasSheetOverflow = () => {
    if (layoutRoot.scrollHeight > 1125) return true;
    const containers = layoutRoot.querySelectorAll<HTMLElement>(
      'div, section, main, aside'
    );
    for (let i = 0; i < containers.length; i++) {
      const box = containers[i];
      if (
        box.clientHeight < 40 ||
        box.closest('[data-empty-slot="true"]') ||
        box.closest('[data-autofit-box="true"]') ||
        box.querySelector('img')
      ) {
        continue;
      }
      const cs = window.getComputedStyle(box);
      if (
        (cs.overflowY === 'hidden' || cs.overflow === 'hidden') &&
        box.scrollHeight > box.clientHeight + 4
      ) {
        return true;
      }
    }
    return false;
  };

  if (!hasSheetOverflow()) return;

  // Re-snapshot current fitted sizes so Phase 1 reductions are respected
  const sheetTextNodes = allTextNodes.map((item) => {
    const currentFs = parseFloat(window.getComputedStyle(item.el).fontSize) || item.origFs;
    const currentLh =
      parseFloat(window.getComputedStyle(item.el).lineHeight) || currentFs * 1.32;
    return { el: item.el, baseFs: currentFs, baseLh: currentLh };
  });

  for (let scale = 0.94; scale >= 0.66; scale -= 0.04) {
    const rounded = Math.round(scale * 100) / 100;
    for (const { el, baseFs, baseLh } of sheetTextNodes) {
      const nextFs = Math.max(7.5, baseFs * rounded);
      const nextLh = Math.max(nextFs * 1.14, baseLh * (rounded * 0.97));
      el.style.fontSize = `${nextFs.toFixed(2)}px`;
      el.style.lineHeight = `${nextLh.toFixed(2)}px`;
    }
    if (!hasSheetOverflow()) {
      break;
    }
  }
}

export const OprSheet = React.forwardRef<HTMLDivElement, OprSheetProps>(
  ({ data, theme, onEmptyPhotoClick }, forwardedRef) => {
    const localRef = useRef<HTMLDivElement | null>(null);

    const setMergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        localRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef]
    );

    useLayoutEffect(() => {
      const sheet = localRef.current;
      if (!sheet) return;

      runSheetAutoFit(sheet);

      let cancelled = false;
      if (typeof document !== 'undefined' && document.fonts?.ready) {
        document.fonts.ready.then(() => {
          if (!cancelled && localRef.current) {
            runSheetAutoFit(localRef.current);
          }
        });
      }

      return () => {
        cancelled = true;
      };
    }, [data, theme]);

    const renderLayout = () => {
      switch (theme.layout) {
        case 'sidebar-ribbon':
          return (
            <SidebarRibbonLayout
              data={data}
              theme={theme}
              onEmptyPhotoClick={onEmptyPhotoClick}
            />
          );
        case 'diagonal-diamond':
          return (
            <DiagonalDiamondLayout
              data={data}
              theme={theme}
              onEmptyPhotoClick={onEmptyPhotoClick}
            />
          );
        case 'honeycomb-wave':
          return (
            <HoneycombWaveLayout
              data={data}
              theme={theme}
              onEmptyPhotoClick={onEmptyPhotoClick}
            />
          );
        case 'geometric-circles':
          return (
            <GeometricCirclesLayout
              data={data}
              theme={theme}
              onEmptyPhotoClick={onEmptyPhotoClick}
            />
          );
        case 'broadsheet-blocks':
          return (
            <BroadsheetBlocksLayout
              data={data}
              theme={theme}
              onEmptyPhotoClick={onEmptyPhotoClick}
            />
          );
        case 'bento-showcase':
          return (
            <BentoShowcaseLayout
              data={data}
              theme={theme}
              onEmptyPhotoClick={onEmptyPhotoClick}
            />
          );
        case 'swiss-editorial':
          return (
            <SwissEditorialLayout
              data={data}
              theme={theme}
              onEmptyPhotoClick={onEmptyPhotoClick}
            />
          );
        case 'archival-split':
          return (
            <ArchivalSplitLayout
              data={data}
              theme={theme}
              onEmptyPhotoClick={onEmptyPhotoClick}
            />
          );
        case 'swoosh-circles':
          return (
            <SwooshCirclesLayout
              data={data}
              theme={theme}
              onEmptyPhotoClick={onEmptyPhotoClick}
            />
          );
        case 'tri-column-gallery':
          return (
            <TriColumnGalleryLayout
              data={data}
              theme={theme}
              onEmptyPhotoClick={onEmptyPhotoClick}
            />
          );
        case 'poster-infographic':
          return (
            <PosterInfographicLayout
              data={data}
              theme={theme}
              onEmptyPhotoClick={onEmptyPhotoClick}
            />
          );
        case 'numbered-dashboard':
          return theme.aiGenerated ? (
            <AiVibrantPosterLayout
              data={data}
              theme={theme}
              onEmptyPhotoClick={onEmptyPhotoClick}
            />
          ) : (
            <NumberedDashboardLayout
              data={data}
              theme={theme}
              onEmptyPhotoClick={onEmptyPhotoClick}
            />
          );
        case 'ai-vibrant-poster':
          return (
            <AiVibrantPosterLayout
              data={data}
              theme={theme}
              onEmptyPhotoClick={onEmptyPhotoClick}
            />
          );
        default:
          return (
            <SidebarRibbonLayout
              data={data}
              theme={theme}
              onEmptyPhotoClick={onEmptyPhotoClick}
            />
          );
      }
    };

    const aiStyleModifier =
      theme.aiGenerated &&
      theme.layout !== 'ai-vibrant-poster' &&
      theme.layout !== 'numbered-dashboard'
        ? theme.aiPoster?.styleModifier || 'playful-illustrated'
        : undefined;

    return (
      <div
        ref={setMergedRef}
        id="opr-printable-sheet"
        data-ai-style={aiStyleModifier || ''}
        className="relative w-[794px] h-[1123px] bg-white shadow-[0_14px_45px_rgba(15,23,42,0.14)] overflow-hidden select-text"
      >
        {renderLayout()}

        {/* Behance-grade editorial enhancement frame (paper-cut diagonals, halftone dots, margin doodles) */}
        {aiStyleModifier && (
          <svg
            aria-hidden="true"
            viewBox="0 0 794 1123"
            className="absolute inset-0 w-full h-full pointer-events-none z-30"
          >
            <defs>
              <pattern
                id={`ai-ht-${aiStyleModifier}`}
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="2.5"
                  cy="2.5"
                  r="1.2"
                  fill={theme.palette.primary}
                  fillOpacity="0.14"
                />
              </pattern>
              <radialGradient id="aiMeshGlowA" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="aiMeshGlowB" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Subtle editorial halftone dot fields along opposing margins */}
            <rect
              x="0"
              y="0"
              width="86"
              height="104"
              fill={`url(#ai-ht-${aiStyleModifier})`}
            />
            <rect
              x="708"
              y="1015"
              width="86"
              height="108"
              fill={`url(#ai-ht-${aiStyleModifier})`}
            />

            {/* Style 1: Playful & Illustrated — layered paper-cut corners + hand-drawn doodles (sparks, lightbulb, stacked books) */}
            {aiStyleModifier === 'playful-illustrated' && (
              <g>
                {/* Layered paper-cut diagonal corner ribbons */}
                <polygon
                  points="0,0 74,0 0,74"
                  fill={theme.palette.primary}
                  fillOpacity="0.14"
                />
                <polygon
                  points="0,0 44,0 0,44"
                  fill={theme.palette.accent}
                  fillOpacity="0.72"
                />
                <polygon
                  points="794,0 744,0 794,50"
                  fill={theme.palette.accent}
                  fillOpacity="0.58"
                />

                {/* Margin hand-drawn sparks */}
                <g fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.86">
                  <path
                    d="M14,258 L16.5,266 L24,268.5 L16.5,271 L14,279 L11.5,271 L4,268.5 L11.5,266 Z"
                    fill={theme.palette.accent}
                    stroke={theme.palette.primary}
                    strokeWidth="1"
                  />
                  <path
                    d="M778,495 L780,502 L787,504 L780,506 L778,513 L776,506 L769,504 L776,502 Z"
                    fill={theme.palette.accent}
                    stroke={theme.palette.primary}
                    strokeWidth="1"
                  />
                  {/* Left margin hand-drawn squiggle */}
                  <path
                    d="M6,650 Q14,657 7,665 T9,680 T7,694"
                    stroke={theme.palette.accent}
                    strokeWidth="2.4"
                  />
                  {/* Right margin miniature glowing lightbulb doodle */}
                  <g transform="translate(764, 240)">
                    <line x1="12" y1="0" x2="12" y2="3.5" stroke={theme.palette.accent} strokeWidth="1.8" />
                    <line x1="3.5" y1="4" x2="6" y2="6.5" stroke={theme.palette.accent} strokeWidth="1.8" />
                    <line x1="20.5" y1="4" x2="18" y2="6.5" stroke={theme.palette.accent} strokeWidth="1.8" />
                    <path
                      d="M7,12 C7,7.5 17,7.5 17,12 C17,14.5 15,16 14.5,18 L9.5,18 C9,16 7,14.5 7,12 Z"
                      fill="#FDE047"
                      stroke={theme.palette.primary}
                      strokeWidth="1.4"
                    />
                    <rect x="9.5" y="18.5" width="5" height="2.8" rx="1" fill="#CBD5E1" stroke={theme.palette.primary} strokeWidth="1" />
                  </g>
                  {/* Bottom-left margin miniature stacked books doodle */}
                  <g transform="translate(6, 985)">
                    <rect x="0" y="16" width="22" height="6" rx="1.5" fill={theme.palette.primary} stroke="#FFFFFF" strokeWidth="1" />
                    <rect x="2" y="10" width="20" height="6" rx="1.5" fill={theme.palette.accent} stroke="#FFFFFF" strokeWidth="1" />
                    <rect x="1" y="4" width="18" height="6" rx="1.5" fill="#EC4899" stroke="#FFFFFF" strokeWidth="1" />
                  </g>
                </g>
              </g>
            )}

            {/* Style 2: Bold & Dynamic Corporate-Ed — royal-gold sharp diagonal geometric speed-lines */}
            {aiStyleModifier === 'corporate-ed' && (
              <g>
                <polygon
                  points="0,0 82,0 0,82"
                  fill={theme.palette.accent}
                  fillOpacity="0.34"
                />
                <line
                  x1="0"
                  y1="92"
                  x2="92"
                  y2="0"
                  stroke={theme.palette.accent}
                  strokeWidth="3"
                />
                <line
                  x1="0"
                  y1="104"
                  x2="104"
                  y2="0"
                  stroke={theme.palette.primary}
                  strokeWidth="1.5"
                  strokeOpacity="0.45"
                />
                <polygon
                  points="794,1123 718,1123 794,1047"
                  fill={theme.palette.accent}
                  fillOpacity="0.34"
                />
                <line
                  x1="706"
                  y1="1123"
                  x2="794"
                  y2="1035"
                  stroke={theme.palette.accent}
                  strokeWidth="3"
                />
                <line
                  x1="794"
                  y1="400"
                  x2="778"
                  y2="460"
                  stroke={theme.palette.accent}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <line
                  x1="0"
                  y1="620"
                  x2="14"
                  y2="565"
                  stroke={theme.palette.accent}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* Style 3: Futuristic / AI-Tech Upgrade — subtle neon mesh orbs + isometric cyber brackets */}
            {aiStyleModifier === 'futuristic-tech' && (
              <g>
                <circle cx="48" cy="48" r="115" fill="url(#aiMeshGlowA)" />
                <circle cx="748" cy="1075" r="125" fill="url(#aiMeshGlowB)" />
                <g fill="none" strokeLinecap="round" opacity="0.82">
                  <path d="M10,10 L46,10 M10,10 L10,46" stroke="#06B6D4" strokeWidth="2.8" />
                  <path d="M784,10 L748,10 M784,10 L784,46" stroke="#8B5CF6" strokeWidth="2.8" />
                  <path d="M10,1113 L46,1113 M10,1113 L10,1077" stroke="#8B5CF6" strokeWidth="2.8" />
                  <path d="M784,1113 L748,1113 M784,1113 L784,1077" stroke="#06B6D4" strokeWidth="2.8" />
                </g>
              </g>
            )}
          </svg>
        )}
      </div>
    );
  }
);

OprSheet.displayName = 'OprSheet';
