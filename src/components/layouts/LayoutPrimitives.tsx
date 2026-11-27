import React from 'react';
import { ImagePlus } from 'lucide-react';
import { OprPalette, OprPhoto, PatternStyle, PhotoFrameStyle } from '../../types/opr';
import { parseLines } from '../../data/presets';

interface OrgCrestProps {
  logoUrl: string | null;
  orgName: string;
  palette: OprPalette;
  size?: number;
  inverted?: boolean;
}

export const OrgCrest: React.FC<OrgCrestProps> = ({
  logoUrl,
  orgName,
  palette,
  size = 56,
  inverted = false,
}) => {
  const initials = orgName
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .slice(0, 3)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('') || 'OPR';

  if (logoUrl) {
    return (
      <div
        style={{
          width: size,
          height: size,
          backgroundColor: '#FFFFFF',
          borderColor: inverted ? 'rgba(255,255,255,0.35)' : 'rgba(15,23,42,0.12)',
        }}
        className="shrink-0 rounded-xl border p-1 flex items-center justify-center overflow-hidden shadow-xs"
      >
        <img
          src={logoUrl}
          alt="Organization logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: inverted ? palette.accent : palette.primary,
        color: inverted ? palette.accentInk : palette.inkOnPrimary,
        borderColor: inverted ? 'rgba(255,255,255,0.28)' : palette.accent,
      }}
      className="shrink-0 rounded-xl border-2 flex flex-col items-center justify-center font-bold tracking-tight select-none"
    >
      <span style={{ fontSize: Math.max(12, Math.round(size * 0.28)), lineHeight: 1 }}>
        {initials}
      </span>
    </div>
  );
};

interface PhotoFrameProps {
  photo?: OprPhoto;
  index: number;
  frameStyle: PhotoFrameStyle;
  palette: OprPalette;
  className?: string;
  style?: React.CSSProperties;
  borderColor?: string;
  shape?: 'rect' | 'circle' | 'hexagon';
  onEmptyClick?: () => void;
}

export const PhotoSlot: React.FC<PhotoFrameProps> = ({
  photo,
  index,
  frameStyle,
  palette,
  className = '',
  style,
  borderColor,
  shape = 'rect',
  onEmptyClick,
}) => {
  const radius =
    shape === 'circle'
      ? '9999px'
      : shape === 'hexagon'
      ? '0px'
      : frameStyle === 'sharp'
      ? '2px'
      : frameStyle === 'framed'
      ? '10px'
      : '12px';

  const clipPath =
    shape === 'hexagon'
      ? 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)'
      : undefined;

  const frameBorder =
    frameStyle === 'framed'
      ? `3px solid ${borderColor || palette.primary}`
      : frameStyle === 'rounded' || frameStyle === 'soft-shadow'
      ? `2px solid ${borderColor || 'rgba(15,23,42,0.1)'}`
      : `1px solid ${borderColor || 'rgba(15,23,42,0.18)'}`;

  const shadow =
    frameStyle === 'soft-shadow'
      ? '0 8px 18px rgba(15, 23, 42, 0.14)'
      : frameStyle === 'framed'
      ? '0 4px 10px rgba(15, 23, 42, 0.1)'
      : 'none';

  if (!photo) {
    return (
      <button
        type="button"
        onClick={onEmptyClick}
        data-empty-slot="true"
        style={{
          borderRadius: radius,
          clipPath,
          backgroundColor: palette.surfaceTint,
          border: `1.5px dashed ${palette.mutedInk}55`,
          color: palette.mutedInk,
          ...style,
        }}
        className={`print-hide-empty relative overflow-hidden flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition-opacity hover:opacity-80 ${className}`}
      >
        <ImagePlus className="w-5 h-5 opacity-60" />
        <span className="text-[10px] font-medium opacity-75 px-2">
          Photo {index + 1}
        </span>
      </button>
    );
  }

  return (
    <div
      style={{
        borderRadius: radius,
        clipPath,
        border: shape === 'hexagon' ? 'none' : frameBorder,
        boxShadow: shape === 'hexagon' ? 'none' : shadow,
        backgroundColor: '#FFFFFF',
        padding: frameStyle === 'framed' && shape === 'rect' ? '3px' : '0px',
        ...style,
      }}
      className={`relative overflow-hidden ${className}`}
    >
      <img
        src={photo.dataUrl}
        alt={photo.caption || `Activity photo ${index + 1}`}
        referrerPolicy="no-referrer"
        style={{
          borderRadius:
            frameStyle === 'framed' && shape === 'rect' ? '6px' : undefined,
        }}
        className="w-full h-full object-cover block"
      />
      {photo.caption && shape === 'rect' && (
        <div
          style={{
            background:
              'linear-gradient(to top, rgba(15,23,42,0.82) 0%, rgba(15,23,42,0.45) 70%, transparent 100%)',
          }}
          className="absolute inset-x-0 bottom-0 px-2.5 py-1.5 text-[10px] leading-tight text-white font-medium truncate"
        >
          {photo.caption}
        </div>
      )}
    </div>
  );
};

interface BulletListProps {
  text: string;
  bulletColor: string;
  textColor: string;
  fontSize?: number;
  maxItems?: number;
}

export const BulletList: React.FC<BulletListProps> = ({
  text,
  bulletColor,
  textColor,
  fontSize = 11.5,
  maxItems = 5,
}) => {
  const lines = parseLines(text).slice(0, maxItems);
  if (lines.length === 0) return null;

  const totalChars = lines.reduce((sum, l) => sum + l.length, 0);
  const densityScale =
    totalChars > 340 || lines.length >= 5
      ? 0.82
      : totalChars > 240 || lines.length === 4
        ? 0.89
        : totalChars > 170
          ? 0.94
          : 1;
  const fittedSize = Math.max(8.5, Number((fontSize * densityScale).toFixed(2)));
  const fittedLineHeight = densityScale < 0.9 ? 1.3 : 1.42;

  if (lines.length === 1) {
    return (
      <p
        style={{
          color: textColor,
          fontSize: fittedSize,
          lineHeight: densityScale < 0.9 ? 1.34 : 1.46,
        }}
        className="m-0 break-words"
      >
        {lines[0]}
      </p>
    );
  }

  return (
    <ul
      className={`m-0 p-0 list-none ${
        densityScale < 0.9 ? 'space-y-1' : 'space-y-1.5'
      }`}
    >
      {lines.map((line, i) => (
        <li
          key={i}
          style={{ color: textColor, fontSize: fittedSize, lineHeight: fittedLineHeight }}
          className="flex items-start gap-2"
        >
          <span
            style={{ backgroundColor: bulletColor }}
            className="w-1.5 h-1.5 rounded-full shrink-0 mt-[5.5px]"
          />
          <span className="break-words min-w-0">{line}</span>
        </li>
      ))}
    </ul>
  );
};

interface SvgBackdropProps {
  pattern: PatternStyle;
  color: string;
  opacity?: number;
}

export const SvgBackdrop: React.FC<SvgBackdropProps> = ({
  pattern,
  color,
  opacity = 0.08,
}) => {
  if (pattern === 'none') return null;

  const patternId = `opr-pat-${pattern}-${color.replace('#', '')}`;

  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
    >
      <defs>
        {pattern === 'dots' && (
          <pattern id={patternId} width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.5" fill={color} />
          </pattern>
        )}
        {pattern === 'grid' && (
          <pattern id={patternId} width="24" height="24" patternUnits="userSpaceOnUse">
            <path
              d="M 24 0 L 0 0 0 24"
              fill="none"
              stroke={color}
              strokeWidth="0.9"
            />
          </pattern>
        )}
        {pattern === 'diagonal' && (
          <pattern
            id={patternId}
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="16" stroke={color} strokeWidth="2" />
          </pattern>
        )}
        {pattern === 'waves' && (
          <pattern id={patternId} width="44" height="22" patternUnits="userSpaceOnUse">
            <path
              d="M0 11 Q 11 2, 22 11 T 44 11"
              fill="none"
              stroke={color}
              strokeWidth="1.4"
            />
          </pattern>
        )}
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
};

/**
 * Helper to determine how many photo slots to render gracefully:
 * - If user uploaded 1..6 photos, show exact count (no empty slots!)
 * - If user uploaded 0 photos, show `defaultSlots` clickable preview placeholders.
 */
export function resolveDisplayPhotoSlots(
  photos: OprPhoto[],
  defaultSlots: number
): (OprPhoto | undefined)[] {
  if (photos.length === 0) {
    return Array.from({ length: defaultSlots }, () => undefined);
  }
  return photos.slice(0, 6);
}
