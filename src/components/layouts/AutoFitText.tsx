import React, { useLayoutEffect, useRef } from 'react';

interface AutoFitTextProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div' | 'span';
  maxFontSize: number;
  minFontSize: number;
  maxHeight?: number;
  singleLine?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Automatically binary-searches the largest font size between minFontSize and maxFontSize
 * that fits cleanly inside the container without horizontal or vertical clipping.
 */
export const AutoFitText: React.FC<AutoFitTextProps> = ({
  children,
  as: Tag = 'div',
  maxFontSize,
  minFontSize,
  maxHeight,
  singleLine = false,
  className = '',
  style,
}) => {
  const elRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const fit = () => {
      if (!elRef.current) return;
      const target = elRef.current;

      const overflows = () => {
        const hLimit = maxHeight ?? target.clientHeight;
        const verticalOverflow = hLimit > 0 && target.scrollHeight > hLimit + 1;
        const horizontalOverflow =
          target.clientWidth > 0 && target.scrollWidth > target.clientWidth + 1;
        return singleLine
          ? horizontalOverflow || verticalOverflow
          : verticalOverflow || horizontalOverflow;
      };

      // Quick check at maxFontSize first
      target.style.fontSize = `${maxFontSize}px`;
      if (!overflows()) return;

      let low = minFontSize;
      let high = maxFontSize;
      let best = minFontSize;

      // Binary search to 0.5px precision (max ~7 iterations)
      while (high - low > 0.4) {
        const mid = Math.round(((low + high) / 2) * 2) / 2;
        target.style.fontSize = `${mid}px`;
        if (overflows()) {
          high = mid - 0.5;
        } else {
          best = mid;
          low = mid;
        }
      }

      target.style.fontSize = `${best}px`;
    };

    fit();

    let cancelled = false;
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) fit();
      });
    }

    return () => {
      cancelled = true;
    };
  }, [children, maxFontSize, minFontSize, maxHeight, singleLine]);

  const Component = Tag as React.ElementType;

  return (
    <Component
      ref={elRef}
      data-autofit-managed="true"
      className={className}
      style={{
        ...style,
        fontSize: `${maxFontSize}px`,
        ...(maxHeight ? { maxHeight: `${maxHeight}px` } : {}),
        ...(singleLine ? { whiteSpace: 'nowrap' } : {}),
      }}
    >
      {children}
    </Component>
  );
};

interface AutoFitBoxProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  minScale?: number;
  watchKey?: string | number;
}

/**
 * Scales down text inside a bounded card/section container when its content overflows vertically
 * so all bullet points and descriptions remain completely legible with zero ellipsis truncation.
 */
export const AutoFitBox: React.FC<AutoFitBoxProps> = ({
  children,
  className = '',
  style,
  minScale = 0.66,
  watchKey,
}) => {
  const boxRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const fit = () => {
      const container = boxRef.current;
      if (!container) return;

      // Restore any previous scaling before measuring
      const previouslyScaled = container.querySelectorAll<HTMLElement>(
        '[data-boxfit-orig-fs]'
      );
      previouslyScaled.forEach((node) => {
        node.style.fontSize = node.dataset.boxfitPrevFs || '';
        node.style.lineHeight = node.dataset.boxfitPrevLh || '';
        delete node.dataset.boxfitOrigFs;
        delete node.dataset.boxfitPrevFs;
        delete node.dataset.boxfitPrevLh;
      });

      if (
        container.clientHeight <= 0 ||
        container.scrollHeight <= container.clientHeight + 1
      ) {
        return;
      }

      // Collect text-bearing elements inside the box
      const textEls: { el: HTMLElement; origFs: number; origLh: number }[] = [];
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT);
      let current = walker.nextNode() as HTMLElement | null;
      while (current) {
        if (
          !current.closest('svg') &&
          current.dataset.autofitManaged !== 'true'
        ) {
          const hasDirectText = Array.from(current.childNodes).some(
            (n) => n.nodeType === Node.TEXT_NODE && (n.textContent?.trim().length ?? 0) > 0
          );
          if (hasDirectText) {
            const cs = window.getComputedStyle(current);
            const fs = parseFloat(cs.fontSize);
            const lh = parseFloat(cs.lineHeight);
            if (!Number.isNaN(fs) && fs > 7) {
              current.dataset.boxfitPrevFs = current.style.fontSize;
              current.dataset.boxfitPrevLh = current.style.lineHeight;
              current.dataset.boxfitOrigFs = String(fs);
              textEls.push({
                el: current,
                origFs: fs,
                origLh: Number.isNaN(lh) ? fs * 1.32 : lh,
              });
            }
          }
        }
        current = walker.nextNode() as HTMLElement | null;
      }

      if (textEls.length === 0) return;

      for (let scale = 0.94; scale >= minScale; scale -= 0.04) {
        const rounded = Math.round(scale * 100) / 100;
        textEls.forEach(({ el, origFs, origLh }) => {
          const nextFs = Math.max(7.2, origFs * rounded);
          const nextLh = Math.max(nextFs * 1.15, origLh * (rounded * 0.97));
          el.style.fontSize = `${nextFs.toFixed(2)}px`;
          el.style.lineHeight = `${nextLh.toFixed(2)}px`;
        });
        if (container.scrollHeight <= container.clientHeight + 1) {
          break;
        }
      }
    };

    fit();

    let cancelled = false;
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) fit();
      });
    }

    return () => {
      cancelled = true;
    };
  }, [children, minScale, watchKey]);

  return (
    <div
      ref={boxRef}
      data-autofit-box="true"
      className={className}
      style={style}
    >
      {children}
    </div>
  );
};
