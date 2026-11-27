import React from 'react';
import {
  Award,
  BarChart3,
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  Cog,
  FileText,
  Lightbulb,
  MapPin,
  Target,
  Users,
} from 'lucide-react';
import { OPR_LABELS, OprData, OprThemeConfig } from '../../types/opr';
import { getFontClasses, parseLines } from '../../data/presets';
import {
  OrgCrest,
  PhotoSlot,
  SvgBackdrop,
  resolveDisplayPhotoSlots,
} from './LayoutPrimitives';
import { LayoutRendererProps } from './ClassicOprLayouts';

function getSectionTitles(data: OprData, theme: OprThemeConfig) {
  const base = OPR_LABELS[data.language];
  return {
    objectives: theme.customSectionTitles?.objectives || base.objectives,
    implementation:
      theme.customSectionTitles?.implementation || base.implementation,
    impact: theme.customSectionTitles?.impact || base.impact,
    reflection: theme.customSectionTitles?.reflection || base.reflection,
  };
}

/**
 * 9. SWOOSH CIRCLES (Inspired by SK Chenein OPR)
 * Sweeping right-edge curved band, dark pill section bars, crisp rounded title ribbon,
 * checkmarked & arrow-stepped content on the left, and cascading circular photos on the right.
 */
export const SwooshCirclesLayout: React.FC<LayoutRendererProps> = ({
  data,
  theme,
  onEmptyPhotoClick,
}) => {
  const { palette, fontPair, pattern } = theme;
  const fonts = getFontClasses(fontPair);
  const labels = OPR_LABELS[data.language];
  const titles = getSectionTitles(data, theme);
  const slots = resolveDisplayPhotoSlots(data.photos, 3);

  const objectiveLines = parseLines(data.objectives).slice(0, 3);
  const implementationLines = parseLines(data.implementation).slice(0, 3);
  const impactLines = parseLines(data.impact).slice(0, 3);

  return (
    <div
      style={{ backgroundColor: palette.surface, color: palette.inkOnSurface }}
      className={`w-[794px] h-[1123px] relative overflow-hidden flex flex-col justify-between ${fonts.bodyClass}`}
    >
      <SvgBackdrop pattern={pattern} color={palette.primary} opacity={0.04} />

      {/* Sweeping Right-Side Curved S-Ribbon */}
      <svg
        aria-hidden="true"
        viewBox="0 0 794 1123"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <path
          d="M420,0 C690,10 794,160 760,360 C725,560 540,700 620,960 C650,1050 710,1100 794,1123 L794,0 Z"
          fill={palette.secondary}
        />
        <path
          d="M455,0 C705,20 778,165 735,365 C692,565 440,680 415,960 C405,1055 435,1105 460,1123 L794,1123 L794,0 Z"
          fill={palette.primary}
          opacity="0.92"
        />
        <path
          d="M455,0 C705,20 778,165 735,365 C692,565 440,680 415,960 C405,1055 435,1105 460,1123"
          fill="none"
          stroke={palette.surface}
          strokeWidth="8"
        />
        {/* Soft left lower diagonal grey-tint sweep */}
        <path
          d="M0,490 Q240,560 440,940 L440,1123 L0,1123 Z"
          fill={palette.surfaceTint}
          opacity="0.85"
        />
      </svg>

      {/* Top Masthead */}
      <div className="relative z-10 px-7 pt-6 pb-3 flex items-start justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3.5 max-w-[445px]">
          <OrgCrest
            logoUrl={data.logoUrl}
            orgName={data.organizationName}
            palette={palette}
            size={66}
          />
          <div className="min-w-0">
            <div
              style={{ color: palette.inkOnSurface }}
              className={`text-[24px] font-extrabold leading-tight tracking-tight ${fonts.displayClass}`}
            >
              {data.organizationName}
            </div>
            {data.organizationSub && (
              <div
                style={{ color: palette.mutedInk }}
                className="text-[11px] font-medium mt-0.5 leading-snug"
              >
                {data.organizationSub}
              </div>
            )}
            <div
              style={{ color: palette.primary }}
              className="font-display-playfair italic font-bold text-[22px] leading-tight mt-1"
            >
              One Page Report
            </div>
          </div>
        </div>

        {/* Right Pill Unit + Report Badge */}
        <div className="flex flex-col items-end shrink-0 pt-1">
          <div
            style={{
              backgroundColor: palette.accent,
              color: palette.accentInk,
              border: `3px solid ${palette.secondary}`,
            }}
            className={`px-6 py-1.5 rounded-full text-[15px] font-extrabold tracking-wider uppercase shadow-xs ${fonts.displayClass}`}
          >
            {data.organizerUnit || 'KURIKULUM'}
          </div>
          <div
            style={{
              color: palette.inkOnPrimary,
              textShadow: '0 2px 6px rgba(0,0,0,0.35)',
            }}
            className={`text-[28px] font-extrabold tracking-wide mt-2 pr-1 ${fonts.displayClass}`}
          >
            {data.reportBadge || '2026'}
          </div>
        </div>
      </div>

      {/* Left-Attached Rounded Accent Title Banner */}
      <div className="relative z-10 pr-24 mb-4 shrink-0">
        <div
          style={{
            backgroundColor: palette.accent,
            color: palette.accentInk,
            borderTop: `3px solid ${palette.secondary}`,
            borderRight: `3px solid ${palette.secondary}`,
            borderBottom: `3px solid ${palette.secondary}`,
          }}
          className="rounded-r-full pl-7 pr-9 py-3.5 shadow-xs"
        >
          <h1
            className={`text-[19px] font-extrabold leading-tight uppercase tracking-tight ${fonts.displayClass}`}
          >
            {data.activityTitle}
          </h1>
          {data.subtitle && (
            <p className="text-[10.8px] font-medium opacity-85 mt-0.5 m-0">
              {data.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Main Split: Left Dark Pill Sections + Right Cascading Circles */}
      <div className="relative z-10 flex-1 flex px-0 pb-3 min-h-0">
        {/* Left Content Column */}
        <div className="w-[455px] flex flex-col justify-between pr-4 shrink-0">
          <div className="space-y-4">
            {/* Program Details */}
            <div>
              <div
                style={{
                  backgroundColor: palette.secondary,
                  color: palette.accent,
                }}
                className={`inline-block rounded-r-full pl-7 pr-8 py-1.5 text-[14px] font-extrabold uppercase tracking-wider mb-2.5 ${fonts.displayClass}`}
              >
                {data.language === 'bm' ? 'Butiran Program :' : 'Program Details :'}
              </div>
              <div className="pl-7 space-y-1.5 text-[11.5px]">
                {[
                  {
                    l: labels.date,
                    v: [data.date, data.day].filter(Boolean).join(' · '),
                  },
                  { l: labels.venue, v: data.venue },
                  { l: labels.time, v: data.time },
                  { l: labels.targetGroup, v: data.targetGroup },
                ]
                  .filter((r) => r.v.trim())
                  .map((row, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-1">
                      <span className="col-span-4 font-extrabold uppercase text-[10.5px]">
                        {row.l}
                      </span>
                      <span className="col-span-1 font-bold text-center">:</span>
                      <span className="col-span-7 font-semibold leading-snug">
                        {row.v}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Objectives */}
            {objectiveLines.length > 0 && (
              <div>
                <div
                  style={{
                    backgroundColor: palette.secondary,
                    color: palette.accent,
                  }}
                  className={`inline-block rounded-r-full pl-7 pr-8 py-1.5 text-[14px] font-extrabold uppercase tracking-wider mb-2.5 ${fonts.displayClass}`}
                >
                  {titles.objectives} :
                </div>
                <div className="pl-7 space-y-2">
                  {objectiveLines.map((line, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-[11.2px] leading-snug">
                      <CheckCircle2
                        style={{ color: palette.primary }}
                        className="w-4 h-4 shrink-0 mt-0.5"
                      />
                      <span className="font-medium">{line}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Implementation */}
            {implementationLines.length > 0 && (
              <div>
                <div
                  style={{
                    backgroundColor: palette.secondary,
                    color: palette.accent,
                  }}
                  className={`inline-block rounded-r-full pl-7 pr-8 py-1.5 text-[14px] font-extrabold uppercase tracking-wider mb-2.5 ${fonts.displayClass}`}
                >
                  {titles.implementation} :
                </div>
                <div className="pl-7 space-y-2">
                  {implementationLines.map((line, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-[11.2px] leading-snug">
                      <span
                        style={{
                          backgroundColor: palette.primary,
                          color: palette.inkOnPrimary,
                        }}
                        className="w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5 font-mono-tabular"
                      >
                        {i + 1}
                      </span>
                      <span className="font-medium">{line}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Impact / Summary */}
            {(impactLines.length > 0 || data.reflection) && (
              <div>
                <div
                  style={{
                    backgroundColor: palette.secondary,
                    color: palette.accent,
                  }}
                  className={`inline-block rounded-r-full pl-7 pr-8 py-1.5 text-[14px] font-extrabold uppercase tracking-wider mb-2 ${fonts.displayClass}`}
                >
                  {titles.impact} :
                </div>
                <div className="pl-7 space-y-1.5 text-[10.8px] leading-snug">
                  {impactLines.slice(0, 2).map((line, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span
                        style={{ backgroundColor: palette.primary }}
                        className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                      />
                      <span className="font-medium">{line}</span>
                    </div>
                  ))}
                  {data.reflection && (
                    <p
                      style={{ color: palette.mutedInk }}
                      className="text-[10.5px] italic pt-1 m-0"
                    >
                      {data.reflection}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Overlapping Circular Photo Cascade */}
        <div className="flex-1 relative pr-4 flex flex-col items-center justify-center">
          {slots.length <= 3 ? (
            <div className="relative w-full h-[640px]">
              {slots.map((photo, idx) => {
                const configs = [
                  { size: 196, top: 0, right: 0 },
                  { size: 288, top: 175, right: 6 },
                  { size: 184, top: 445, right: 34 },
                ];
                const singleConfig = [{ size: 295, top: 155, right: 12 }];
                const twoConfig = [
                  { size: 255, top: 38, right: 10 },
                  { size: 255, top: 325, right: 20 },
                ];
                const active =
                  slots.length === 1
                    ? singleConfig[0]
                    : slots.length === 2
                    ? twoConfig[idx]
                    : configs[idx];

                return (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      top: active.top,
                      right: active.right,
                      width: active.size,
                      height: active.size,
                      borderRadius: '9999px',
                      border: `7px solid ${palette.primary}`,
                      boxShadow: `0 0 0 3px ${palette.surface}, 0 12px 24px rgba(15,23,42,0.22)`,
                      backgroundColor: '#FFFFFF',
                    }}
                    className="overflow-hidden"
                  >
                    <PhotoSlot
                      photo={photo}
                      index={idx}
                      frameStyle="sharp"
                      palette={palette}
                      shape="circle"
                      borderColor="transparent"
                      className="w-full h-full"
                      onEmptyClick={onEmptyPhotoClick}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5 items-center content-center py-4">
              {slots.map((photo, idx) => (
                <div
                  key={idx}
                  style={{
                    width: 146,
                    height: 146,
                    borderRadius: '9999px',
                    border: `6px solid ${idx % 2 === 0 ? palette.primary : palette.accent}`,
                    boxShadow: `0 0 0 2px ${palette.surface}, 0 8px 18px rgba(15,23,42,0.2)`,
                    backgroundColor: '#FFFFFF',
                  }}
                  className="overflow-hidden mx-auto"
                >
                  <PhotoSlot
                    photo={photo}
                    index={idx}
                    frameStyle="sharp"
                    palette={palette}
                    shape="circle"
                    borderColor="transparent"
                    className="w-full h-full"
                    onEmptyClick={onEmptyPhotoClick}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Rounded Pill Sign-off Bar */}
      <div className="relative z-10 px-10 pb-5 pt-1 shrink-0">
        <div
          style={{
            backgroundColor: palette.accent,
            color: palette.accentInk,
          }}
          className="rounded-full px-6 py-2.5 flex items-center justify-between text-[11px] font-bold shadow-xs"
        >
          <span>
            {labels.preparedBy.toUpperCase()} : {data.preparedByName}
            {data.preparedByRole ? ` (${data.preparedByRole})` : ''}
          </span>
          {data.verifiedByName && (
            <span>
              {labels.verifiedBy.toUpperCase()} : {data.verifiedByName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * 10. TRI-COLUMN GALLERY (Inspired by SMK Tun Perak OPR)
 * Sweeping curved wave frame, clean centered hero title + white 3-column metadata ribbon,
 * 3 side-by-side icon-header pillar cards, full-width mid-page photo documentation strip,
 * and structured bottom summary + verification strip.
 */
export const TriColumnGalleryLayout: React.FC<LayoutRendererProps> = ({
  data,
  theme,
  onEmptyPhotoClick,
}) => {
  const { palette, fontPair, photoFrame, pattern } = theme;
  const fonts = getFontClasses(fontPair);
  const labels = OPR_LABELS[data.language];
  const titles = getSectionTitles(data, theme);
  const slots = resolveDisplayPhotoSlots(data.photos, 6);

  const objLines = parseLines(data.objectives).slice(0, 4);
  const impLines = parseLines(data.implementation).slice(0, 4);
  const outLines = parseLines(data.impact).slice(0, 4);

  const renderDocsGallery = () => {
    const count = slots.length;
    if (count <= 3) {
      return (
        <div
          className="grid gap-2.5 h-[225px]"
          style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
        >
          {slots.map((photo, idx) => (
            <PhotoSlot
              key={idx}
              photo={photo}
              index={idx}
              frameStyle={photoFrame}
              palette={palette}
              borderColor={`${palette.primary}35`}
              className="w-full h-full"
              onEmptyClick={onEmptyPhotoClick}
            />
          ))}
        </div>
      );
    }
    const topRow = slots.slice(0, 3);
    const bottomRow = slots.slice(3);
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2.5 h-[130px]">
          {topRow.map((photo, idx) => (
            <PhotoSlot
              key={idx}
              photo={photo}
              index={idx}
              frameStyle={photoFrame}
              palette={palette}
              borderColor={`${palette.primary}35`}
              className="w-full h-full"
              onEmptyClick={onEmptyPhotoClick}
            />
          ))}
        </div>
        <div
          className="grid gap-2.5 h-[130px]"
          style={{ gridTemplateColumns: `repeat(${bottomRow.length}, minmax(0, 1fr))` }}
        >
          {bottomRow.map((photo, idx) => (
            <PhotoSlot
              key={idx + 3}
              photo={photo}
              index={idx + 3}
              frameStyle={photoFrame}
              palette={palette}
              borderColor={`${palette.primary}35`}
              className="w-full h-full"
              onEmptyClick={onEmptyPhotoClick}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: palette.surfaceTint,
        color: palette.inkOnSurface,
      }}
      className={`w-[794px] h-[1123px] relative overflow-hidden flex flex-col justify-between ${fonts.bodyClass}`}
    >
      <SvgBackdrop pattern={pattern} color={palette.primary} opacity={0.05} />

      {/* Organic Sweeping Top-Left & Top-Right Accent Waves */}
      <svg
        aria-hidden="true"
        viewBox="0 0 794 210"
        preserveAspectRatio="none"
        className="absolute top-0 inset-x-0 w-full h-[210px] pointer-events-none"
      >
        <path d="M0,0 L240,0 Q130,90 0,190 Z" fill={palette.primary} opacity="0.16" />
        <path d="M0,0 L160,0 Q75,70 0,140 Z" fill={palette.accent} opacity="0.35" />
        <path d="M560,0 L794,0 L794,165 Q690,105 560,0 Z" fill={palette.primary} opacity="0.18" />
      </svg>

      {/* Bottom Sweeping Wave Footer Backdrop */}
      <svg
        aria-hidden="true"
        viewBox="0 0 794 110"
        preserveAspectRatio="none"
        className="absolute bottom-0 inset-x-0 w-full h-[95px] pointer-events-none"
      >
        <path d="M0,55 Q240,10 520,68 T794,28 L794,110 L0,110 Z" fill={palette.primary} />
        <path d="M440,85 Q620,18 794,40 L794,110 L440,110 Z" fill={palette.accent} />
      </svg>

      <div className="relative z-10 flex-1 flex flex-col px-6 pt-5 pb-3 min-h-0">
        {/* Top Masthead Row */}
        <div className="flex items-center gap-4 mb-3.5">
          <OrgCrest
            logoUrl={data.logoUrl}
            orgName={data.organizationName}
            palette={palette}
            size={84}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span
                style={{ color: palette.primary }}
                className="text-[11px] font-bold tracking-[0.22em] uppercase"
              >
                {data.reportBadge || 'ONE PAGE REPORT (OPR)'}
              </span>
              <span
                style={{ color: palette.mutedInk }}
                className="text-[10.5px] font-bold uppercase truncate"
              >
                {data.organizationName}
              </span>
            </div>
            <h1
              style={{ color: palette.primary }}
              className={`text-[28px] font-extrabold leading-[1.08] tracking-tight mt-0.5 uppercase ${fonts.displayClass}`}
            >
              {data.activityTitle}
            </h1>
            {data.subtitle && (
              <div className="mt-1 flex items-center gap-2">
                <span
                  style={{
                    backgroundColor: palette.accent,
                    color: palette.accentInk,
                  }}
                  className="px-2.5 py-0.5 rounded text-[10.5px] font-extrabold"
                >
                  {data.organizerUnit || labels.organizer}
                </span>
                <span
                  style={{ color: palette.secondary }}
                  className="font-display-playfair italic text-[12px] font-semibold truncate"
                >
                  “{data.subtitle}”
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Crisp White 3-Column Metadata Strip */}
        <div
          style={{
            backgroundColor: palette.surface,
            border: `1.5px solid ${palette.primary}28`,
          }}
          className="rounded-2xl px-4 py-2.5 mb-3.5 grid grid-cols-3 divide-x divide-slate-200 shadow-xs"
        >
          {[
            {
              icon: Calendar,
              label: labels.date,
              value: [data.date, data.time].filter(Boolean).join(' · '),
            },
            { icon: MapPin, label: labels.venue, value: data.venue },
            { icon: Users, label: labels.targetGroup, value: data.targetGroup },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-2.5 ${idx > 0 ? 'pl-3.5' : ''} ${
                  idx < 2 ? 'pr-3' : ''
                }`}
              >
                <div
                  style={{
                    backgroundColor: palette.surfaceTint,
                    color: palette.primary,
                  }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div
                    style={{ color: palette.primary }}
                    className="text-[9.5px] font-extrabold uppercase tracking-wider"
                  >
                    {item.label}
                  </div>
                  <div className="text-[11px] font-bold leading-snug">
                    {item.value || '—'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 Side-by-Side Pillar Cards (Objectives | Implementation | Impact) */}
        <div className="grid grid-cols-3 gap-3 mb-3.5">
          {[
            {
              title: titles.objectives,
              icon: Target,
              items: objLines,
              badgeBg: palette.primary,
              badgeInk: palette.inkOnPrimary,
              mode: 'number' as const,
            },
            {
              title: titles.implementation,
              icon: Cog,
              items: impLines,
              badgeBg: palette.accent,
              badgeInk: palette.accentInk,
              mode: 'number' as const,
            },
            {
              title: titles.impact,
              icon: BarChart3,
              items: outLines,
              badgeBg: palette.primary,
              badgeInk: palette.inkOnPrimary,
              mode: 'check' as const,
            },
          ].map((col, idx) => {
            const Icon = col.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: palette.surface,
                  border: `1.5px solid ${palette.primary}22`,
                }}
                className="rounded-2xl p-3 shadow-xs flex flex-col"
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <div
                    style={{
                      backgroundColor: palette.secondary,
                      color: palette.accent,
                    }}
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div
                    style={{
                      backgroundColor: palette.primary,
                      color: palette.inkOnPrimary,
                    }}
                    className={`flex-1 px-2.5 py-1 rounded-r-full rounded-l-md text-[11px] font-extrabold uppercase tracking-wide truncate ${fonts.displayClass}`}
                  >
                    {col.title}
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  {col.items.map((line, i) => (
                    <div key={i} className="flex items-start gap-2 text-[10.2px] leading-snug">
                      {col.mode === 'number' ? (
                        <span
                          style={{
                            backgroundColor: col.badgeBg,
                            color: col.badgeInk,
                          }}
                          className="w-4 h-4 rounded-full text-[9.5px] font-extrabold flex items-center justify-center shrink-0 mt-0.5 font-mono-tabular"
                        >
                          {i + 1}
                        </span>
                      ) : (
                        <CheckCircle2
                          style={{ color: palette.primary }}
                          className="w-4 h-4 shrink-0 mt-0.5"
                        />
                      )}
                      <span className="font-medium">{line}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mid-Page Photo Documentation Section */}
        <div className="mb-3.5">
          <div className="flex items-center gap-2 mb-2">
            <div
              style={{
                backgroundColor: palette.secondary,
                color: palette.inkOnPrimary,
              }}
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            >
              <Camera className="w-3.5 h-3.5" />
            </div>
            <div
              style={{
                backgroundColor: palette.primary,
                color: palette.inkOnPrimary,
              }}
              className={`px-4 py-1 rounded-r-full rounded-l-md text-[11.5px] font-extrabold uppercase tracking-wider ${fonts.displayClass}`}
            >
              {labels.gallery}
            </div>
          </div>
          {renderDocsGallery()}
        </div>

        {/* Bottom 2-Card Summary & Outcomes Row */}
        <div className="grid grid-cols-12 gap-3 flex-1 min-h-0">
          <div
            style={{
              backgroundColor: palette.surface,
              border: `1.5px solid ${palette.primary}25`,
            }}
            className="col-span-8 rounded-2xl p-3.5 shadow-xs flex flex-col"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                style={{
                  backgroundColor: palette.primary,
                  color: palette.inkOnPrimary,
                }}
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
              >
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div
                style={{
                  backgroundColor: palette.primary,
                  color: palette.inkOnPrimary,
                }}
                className={`px-3.5 py-0.5 rounded-r-full rounded-l-md text-[11px] font-extrabold uppercase tracking-wider ${fonts.displayClass}`}
              >
                {titles.reflection}
              </div>
            </div>
            <p className="text-[11px] leading-relaxed m-0 flex-1">
              {data.reflection || data.impact}
            </p>
          </div>

          <div
            style={{
              backgroundColor: palette.surface,
              border: `1.5px solid ${palette.accent}`,
            }}
            className="col-span-4 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div
                style={{
                  backgroundColor: palette.accent,
                  color: palette.accentInk,
                }}
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
              >
                <Award className="w-3.5 h-3.5" />
              </div>
              <span
                style={{ color: palette.primary }}
                className={`text-[11px] font-extrabold uppercase tracking-wider ${fonts.displayClass}`}
              >
                {labels.verifiedBy}
              </span>
            </div>
            <div className="text-[11.5px] font-extrabold leading-tight">
              {data.verifiedByName || data.organizationName}
            </div>
            <div style={{ color: palette.mutedInk }} className="text-[10px]">
              {data.verifiedByRole || data.organizationSub}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Footer Sign-Off */}
      <div className="relative z-10 px-7 py-3 flex items-end justify-between text-[11px] shrink-0">
        <div style={{ color: palette.inkOnPrimary }} className="font-semibold opacity-95">
          {data.contactInfo || data.organizationSub}
        </div>
        <div style={{ color: palette.accentInk }} className="text-right">
          <div className="text-[9.5px] font-bold uppercase opacity-80">
            {labels.preparedBy},
          </div>
          <div className="text-[12.5px] font-extrabold leading-tight">
            {data.preparedByName}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 11. POSTER INFOGRAPHIC (Inspired by SMK Sayong OPR)
 * Energetic centered poster layout with oversized OPR + activity hero badge, 2 bold info cards,
 * 4 color-accented highlight tiles, framed numbered objective & outcome bands, and tilted gallery.
 */
export const PosterInfographicLayout: React.FC<LayoutRendererProps> = ({
  data,
  theme,
  onEmptyPhotoClick,
}) => {
  const { palette, fontPair, pattern } = theme;
  const fonts = getFontClasses(fontPair);
  const labels = OPR_LABELS[data.language];
  const titles = getSectionTitles(data, theme);
  const slots = resolveDisplayPhotoSlots(data.photos, 2);

  const objLines = parseLines(data.objectives).slice(0, 3);
  const impLines = parseLines(data.implementation).slice(0, 2);
  const outLines = parseLines(data.impact).slice(0, 2);
  const combinedSteps = [...objLines.slice(0, 2), ...outLines.slice(0, 2)].slice(0, 4);

  const pillarCards = [
    {
      icon: Calendar,
      label: labels.date,
      value: data.date || '—',
      bg: '#FFE4E6',
      circle: '#E11D48',
    },
    {
      icon: Clock,
      label: labels.time,
      value: data.time || data.day || '—',
      bg: '#DCFCE7',
      circle: '#15803D',
    },
    {
      icon: MapPin,
      label: labels.venue,
      value: data.venue || '—',
      bg: '#DBEAFE',
      circle: '#1D4ED8',
    },
    {
      icon: Users,
      label: labels.targetGroup,
      value: data.targetGroup || '—',
      bg: '#F3E8FF',
      circle: '#7E22CE',
    },
  ];

  return (
    <div
      style={{
        backgroundColor: palette.surfaceTint,
        color: palette.inkOnSurface,
      }}
      className={`w-[794px] h-[1123px] relative overflow-hidden flex flex-col justify-between ${fonts.bodyClass}`}
    >
      <SvgBackdrop pattern={pattern === 'none' ? 'dots' : pattern} color={palette.primary} opacity={0.07} />

      {/* Energetic Corner Geometric Sweeps */}
      <svg
        aria-hidden="true"
        viewBox="0 0 794 1123"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <polygon points="0,0 135,0 0,130" fill={palette.accent} opacity="0.35" />
        <polygon points="794,0 675,0 794,125" fill={palette.primary} opacity="0.2" />
        <polygon points="0,420 42,460 0,580" fill={palette.accent} opacity="0.45" />
        <polygon points="794,480 748,540 794,650" fill={palette.primary} opacity="0.22" />
      </svg>

      <div className="relative z-10 flex-1 flex flex-col px-7 pt-6 pb-3 min-h-0">
        {/* Centered Poster School Header */}
        <div className="flex items-center justify-center gap-5 mb-4">
          <OrgCrest
            logoUrl={data.logoUrl}
            orgName={data.organizationName}
            palette={palette}
            size={74}
          />
          <div className="text-center">
            <div
              style={{ color: palette.primary }}
              className={`text-[24px] font-extrabold leading-tight tracking-tight uppercase ${fonts.displayClass}`}
            >
              {data.organizationName}
            </div>
            {data.organizationSub && (
              <div
                style={{ color: palette.secondary }}
                className="font-display-playfair italic text-[13.5px] font-semibold mt-0.5"
              >
                {data.organizationSub}
              </div>
            )}
          </div>
        </div>

        {/* Bold Highlight OPR + Title Splash Banner */}
        <div
          style={{
            backgroundColor: palette.accent,
            border: `3px solid ${palette.primary}`,
          }}
          className="rounded-3xl px-5 py-3.5 mb-4 flex items-center gap-4 shadow-sm"
        >
          <div
            style={{
              backgroundColor: palette.primary,
              color: palette.inkOnPrimary,
            }}
            className={`px-5 py-2 rounded-2xl text-[36px] font-extrabold leading-none tracking-tight shrink-0 ${fonts.displayClass}`}
          >
            {data.reportBadge || 'OPR'}
          </div>
          <div
            style={{
              backgroundColor: palette.surface,
              color: palette.primary,
            }}
            className="flex-1 rounded-2xl px-4 py-2.5 shadow-xs min-w-0"
          >
            <h1
              className={`text-[21px] font-extrabold leading-tight ${fonts.displayClass}`}
            >
              {data.activityTitle}
            </h1>
            {data.subtitle && (
              <p
                style={{ color: palette.mutedInk }}
                className="text-[10.8px] font-medium mt-0.5 m-0 truncate"
              >
                {data.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* 4 Colorful Icon Pillar Cards */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {pillarCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: card.bg,
                  border: '2px solid #FFFFFF',
                }}
                className="rounded-2xl p-3 flex flex-col items-center text-center shadow-xs"
              >
                <div
                  style={{ backgroundColor: card.circle, color: '#FFFFFF' }}
                  className="w-11 h-11 rounded-full flex items-center justify-center mb-2 shadow-xs"
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div
                  style={{ color: card.circle }}
                  className={`text-[11px] font-extrabold uppercase tracking-wide ${fonts.displayClass}`}
                >
                  {card.label}
                </div>
                <div className="text-[10.5px] font-bold text-slate-800 leading-snug mt-0.5 line-clamp-2">
                  {card.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Framed Numbered Objective & Outcome Showcase Card */}
        <div
          style={{
            backgroundColor: palette.surface,
            border: `2.5px solid ${palette.primary}`,
          }}
          className="rounded-3xl px-5 pt-4 pb-4 mb-4 shadow-xs"
        >
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div
                style={{
                  backgroundColor: palette.primary,
                  color: palette.accent,
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              >
                <Target className="w-5 h-5" />
              </div>
              <div
                style={{
                  backgroundColor: palette.accent,
                  color: palette.accentInk,
                }}
                className={`px-4 py-1 rounded-full text-[13.5px] font-extrabold tracking-wide ${fonts.displayClass}`}
              >
                {titles.objectives} & {titles.impact}
              </div>
            </div>
            {data.organizerUnit && (
              <span
                style={{ color: palette.primary }}
                className="text-[11px] font-bold"
              >
                {data.organizerUnit}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {combinedSteps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: idx % 2 === 0 ? palette.surfaceTint : '#F5F3FF',
                }}
                className="rounded-2xl px-3.5 py-2 flex items-center gap-3"
              >
                <div
                  style={{
                    backgroundColor: idx % 2 === 0 ? palette.primary : palette.secondary,
                    color: palette.inkOnPrimary,
                  }}
                  className="w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-[13px] shrink-0 font-mono-tabular shadow-xs"
                >
                  {idx + 1}
                </div>
                <span className="text-[11.2px] font-semibold leading-snug text-slate-800">
                  {step}
                </span>
              </div>
            ))}
          </div>

          {impLines.length > 0 && (
            <div
              style={{ borderTop: `1px dashed ${palette.primary}35` }}
              className="mt-3 pt-2.5 text-[10.8px] text-slate-700 flex items-start gap-2"
            >
              <span
                style={{ color: palette.primary }}
                className="font-extrabold uppercase shrink-0"
              >
                {titles.implementation}:
              </span>
              <span className="leading-snug">{impLines.join(' · ')}</span>
            </div>
          )}
        </div>

        {/* Bottom Framed Photo Showcase */}
        <div
          className="grid gap-3.5 flex-1 min-h-[210px]"
          style={{
            gridTemplateColumns:
              slots.length === 1
                ? '1fr'
                : slots.length === 2 || slots.length === 4
                ? 'repeat(2, minmax(0, 1fr))'
                : 'repeat(3, minmax(0, 1fr))',
          }}
        >
          {slots.map((photo, idx) => (
            <div
              key={idx}
              style={{
                border: `4px solid ${palette.surface}`,
                boxShadow: '0 8px 18px rgba(15, 23, 42, 0.14)',
              }}
              className="rounded-2xl overflow-hidden bg-white h-full"
            >
              <PhotoSlot
                photo={photo}
                index={idx}
                frameStyle="sharp"
                palette={palette}
                borderColor="transparent"
                className="w-full h-full"
                onEmptyClick={onEmptyPhotoClick}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Deep Curved Bottom Ribbon Footer */}
      <div
        style={{
          backgroundColor: palette.primary,
          color: palette.inkOnPrimary,
          borderTop: `4px solid ${palette.accent}`,
        }}
        className="relative z-10 px-7 py-3.5 flex items-center justify-between gap-4 shrink-0"
      >
        <div className="font-display-playfair italic text-[13px] font-semibold truncate max-w-[440px]">
          {data.reflection || data.subtitle || data.organizationName}
        </div>
        <div className="text-right text-[10.5px] shrink-0">
          <span className="opacity-80">{labels.preparedBy}: </span>
          <span className="font-extrabold">{data.preparedByName}</span>
          {data.verifiedByName && (
            <span className="opacity-90"> · {data.verifiedByName}</span>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * 12. NUMBERED DASHBOARD (Inspired by SJK(C) Sungai Rotan OPR)
 * High-impact top banner with angled title, icon-medallion numbered modules (1 to 5),
 * crisp 4-icon implementation details box, and full-width bottom photo showcase.
 */
export const NumberedDashboardLayout: React.FC<LayoutRendererProps> = ({
  data,
  theme,
  onEmptyPhotoClick,
}) => {
  const { palette, fontPair, photoFrame, pattern } = theme;
  const fonts = getFontClasses(fontPair);
  const labels = OPR_LABELS[data.language];
  const titles = getSectionTitles(data, theme);
  const slots = resolveDisplayPhotoSlots(data.photos, 2);

  const objLines = parseLines(data.objectives).slice(0, 3);
  const impLines = parseLines(data.implementation).slice(0, 4);
  const outLines = parseLines(data.impact).slice(0, 4);

  return (
    <div
      style={{
        backgroundColor: palette.surfaceTint,
        color: palette.inkOnSurface,
      }}
      className={`w-[794px] h-[1123px] relative overflow-hidden flex flex-col justify-between ${fonts.bodyClass}`}
    >
      {/* Dramatic Deep Header Banner */}
      <div
        style={{
          backgroundColor: palette.primary,
          color: palette.inkOnPrimary,
        }}
        className="relative px-7 pt-5 pb-6 shrink-0 overflow-hidden"
      >
        <SvgBackdrop pattern={pattern === 'none' ? 'diagonal' : pattern} color="#FFFFFF" opacity={0.08} />
        <div
          style={{ backgroundColor: palette.accent }}
          className="absolute bottom-0 inset-x-0 h-1.5"
        />

        <div className="relative z-10 flex items-center gap-4">
          <OrgCrest
            logoUrl={data.logoUrl}
            orgName={data.organizationName}
            palette={palette}
            size={74}
            inverted
          />
          <div className="flex-1 text-center min-w-0">
            <div className={`text-[18px] font-extrabold tracking-wide uppercase ${fonts.displayClass}`}>
              {data.organizationName}
            </div>
            <div
              style={{
                backgroundColor: palette.accent,
                color: palette.accentInk,
              }}
              className="inline-block px-4 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider mt-1"
            >
              {data.reportBadge || 'ONE PAGE REPORT (OPR)'}
            </div>
            <h1
              className={`text-[25px] font-extrabold leading-tight uppercase tracking-tight mt-1.5 ${fonts.displayClass}`}
            >
              {data.activityTitle}
            </h1>
          </div>
          {data.organizerUnit && (
            <div
              style={{ borderColor: 'rgba(255,255,255,0.28)' }}
              className="w-[105px] text-right border-l pl-3 text-[10.5px] font-semibold leading-snug shrink-0 opacity-95"
            >
              {data.organizerUnit}
            </div>
          )}
        </div>
      </div>

      {/* Main Numbered 1–5 Modules + Photo Showcase */}
      <div className="relative z-10 flex-1 flex flex-col px-6 py-4 gap-3.5 min-h-0">
        {/* Row 1: Module 1 (Objectives) + Module 2 (Details 4-col icons) */}
        <div className="grid grid-cols-12 gap-3.5">
          {/* Card 1: Objectives */}
          <div
            style={{
              backgroundColor: palette.surface,
              border: `2px solid ${palette.primary}`,
            }}
            className="col-span-6 rounded-2xl p-3.5 relative shadow-xs"
          >
            <div className="flex items-center gap-2 mb-2.5">
              <div
                style={{
                  backgroundColor: palette.primary,
                  color: palette.inkOnPrimary,
                }}
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              >
                <Target className="w-4 h-4" />
              </div>
              <div
                style={{
                  backgroundColor: palette.primary,
                  color: palette.inkOnPrimary,
                }}
                className={`px-3 py-1 rounded-r-full rounded-l-md text-[11.5px] font-extrabold uppercase tracking-wide flex items-center gap-1.5 ${fonts.displayClass}`}
              >
                <span className="font-mono-tabular opacity-85">1</span>
                <span>{titles.objectives}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              {objLines.map((line, i) => (
                <div key={i} className="flex items-start gap-2 text-[10.6px] leading-snug">
                  <CheckCircle2
                    style={{ color: palette.primary }}
                    className="w-3.5 h-3.5 shrink-0 mt-0.5"
                  />
                  <span className="font-medium">{line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Implementation Metadata Grid */}
          <div
            style={{
              backgroundColor: palette.surface,
              border: `2px solid ${palette.secondary}`,
            }}
            className="col-span-6 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 mb-2.5">
              <div
                style={{
                  backgroundColor: palette.secondary,
                  color: palette.inkOnPrimary,
                }}
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              >
                <Calendar className="w-4 h-4" />
              </div>
              <div
                style={{
                  backgroundColor: palette.secondary,
                  color: palette.inkOnPrimary,
                }}
                className={`px-3 py-1 rounded-r-full rounded-l-md text-[11.5px] font-extrabold uppercase tracking-wide flex items-center gap-1.5 ${fonts.displayClass}`}
              >
                <span className="font-mono-tabular opacity-85">2</span>
                <span>
                  {data.language === 'bm' ? 'Butiran Pelaksanaan' : 'Event Details'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 divide-x divide-slate-200 text-center flex-1 items-center">
              {[
                { icon: Calendar, label: labels.date, value: data.date },
                { icon: Clock, label: labels.time, value: data.time || data.day },
                { icon: MapPin, label: labels.venue, value: data.venue },
                { icon: Users, label: labels.targetGroup, value: data.targetGroup },
              ].map((m, idx) => {
                const Icon = m.icon;
                return (
                  <div key={idx} className="px-1.5 flex flex-col items-center">
                    <Icon
                      style={{ color: palette.primary }}
                      className="w-5 h-5 mb-1 shrink-0"
                    />
                    <div
                      style={{ color: palette.primary }}
                      className="text-[9px] font-extrabold uppercase tracking-wider"
                    >
                      {m.label}
                    </div>
                    <div className="text-[9.8px] font-semibold leading-tight mt-0.5 line-clamp-3">
                      {m.value || '—'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 2: Module 3 (Numbered Activities) + Module 4 (Checkmarked Impact) */}
        <div className="grid grid-cols-12 gap-3.5">
          {/* Card 3: Activities 01, 02, 03 */}
          <div
            style={{
              backgroundColor: palette.surface,
              border: `2px solid ${palette.primary}`,
            }}
            className="col-span-6 rounded-2xl p-3.5 shadow-xs"
          >
            <div className="flex items-center gap-2 mb-2.5">
              <div
                style={{
                  backgroundColor: palette.primary,
                  color: palette.inkOnPrimary,
                }}
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              >
                <Cog className="w-4 h-4" />
              </div>
              <div
                style={{
                  backgroundColor: palette.primary,
                  color: palette.inkOnPrimary,
                }}
                className={`px-3 py-1 rounded-r-full rounded-l-md text-[11.5px] font-extrabold uppercase tracking-wide flex items-center gap-1.5 ${fonts.displayClass}`}
              >
                <span className="font-mono-tabular opacity-85">3</span>
                <span>{titles.implementation}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              {impLines.map((line, i) => (
                <div
                  key={i}
                  style={{ backgroundColor: palette.surfaceTint }}
                  className="rounded-lg px-2.5 py-1.5 flex items-start gap-2.5"
                >
                  <span
                    style={{
                      backgroundColor: palette.primary,
                      color: palette.inkOnPrimary,
                    }}
                    className="w-5 h-5 rounded-full text-[9.5px] font-extrabold flex items-center justify-center shrink-0 font-mono-tabular mt-0.5"
                  >
                    0{i + 1}
                  </span>
                  <span className="text-[10.4px] font-medium leading-snug">
                    {line}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Impact */}
          <div
            style={{
              backgroundColor: palette.surface,
              border: `2px solid ${palette.secondary}`,
            }}
            className="col-span-6 rounded-2xl p-3.5 shadow-xs"
          >
            <div className="flex items-center gap-2 mb-2.5">
              <div
                style={{
                  backgroundColor: palette.secondary,
                  color: palette.inkOnPrimary,
                }}
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              >
                <BarChart3 className="w-4 h-4" />
              </div>
              <div
                style={{
                  backgroundColor: palette.secondary,
                  color: palette.inkOnPrimary,
                }}
                className={`px-3 py-1 rounded-r-full rounded-l-md text-[11.5px] font-extrabold uppercase tracking-wide flex items-center gap-1.5 ${fonts.displayClass}`}
              >
                <span className="font-mono-tabular opacity-85">4</span>
                <span>{titles.impact}</span>
              </div>
            </div>

            <div className="space-y-2">
              {outLines.map((line, i) => (
                <div key={i} className="flex items-start gap-2 text-[10.6px] leading-snug">
                  <CheckCircle2
                    style={{ color: palette.primary }}
                    className="w-4 h-4 shrink-0 mt-0.5"
                  />
                  <span className="font-medium">{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Module 5 (Reflection & Sign-Off Band) */}
        <div
          style={{
            backgroundColor: palette.surface,
            border: `2px solid ${palette.accent}`,
          }}
          className="rounded-2xl p-3.5 shadow-xs"
        >
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div
                style={{
                  backgroundColor: palette.accent,
                  color: palette.accentInk,
                }}
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              >
                <Lightbulb className="w-4 h-4" />
              </div>
              <div
                style={{
                  backgroundColor: palette.accent,
                  color: palette.accentInk,
                }}
                className={`px-3.5 py-1 rounded-r-full rounded-l-md text-[11.5px] font-extrabold uppercase tracking-wide flex items-center gap-1.5 ${fonts.displayClass}`}
              >
                <span className="font-mono-tabular">5</span>
                <span>{titles.reflection}</span>
              </div>
            </div>

            <div className="text-[10.5px] text-right">
              <span style={{ color: palette.mutedInk }}>{labels.preparedBy}: </span>
              <span className="font-bold">{data.preparedByName}</span>
              {data.verifiedByName && (
                <>
                  <span style={{ color: palette.mutedInk }}> · {labels.verifiedBy}: </span>
                  <span className="font-bold">{data.verifiedByName}</span>
                </>
              )}
            </div>
          </div>

          <p className="text-[11px] leading-relaxed m-0 text-slate-700">
            {data.reflection || data.subtitle}
          </p>
        </div>

        {/* Row 4: Full-Width Bottom Photo Gallery */}
        <div className="flex-1 flex flex-col min-h-[210px]">
          <div className="flex items-center gap-2 mb-2 shrink-0">
            <div
              style={{
                backgroundColor: palette.primary,
                color: palette.inkOnPrimary,
              }}
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            >
              <Camera className="w-4 h-4" />
            </div>
            <div
              style={{
                backgroundColor: palette.accent,
                color: palette.accentInk,
              }}
              className={`px-4 py-1 rounded-r-full rounded-l-md text-[11.5px] font-extrabold uppercase tracking-wider ${fonts.displayClass}`}
            >
              {labels.gallery}
            </div>
          </div>

          <div
            className="grid gap-3 flex-1 min-h-0"
            style={{
              gridTemplateColumns:
                slots.length === 1
                  ? '1fr'
                  : slots.length === 2 || slots.length === 4
                  ? 'repeat(2, minmax(0, 1fr))'
                  : 'repeat(3, minmax(0, 1fr))',
            }}
          >
            {slots.map((photo, idx) => (
              <PhotoSlot
                key={idx}
                photo={photo}
                index={idx}
                frameStyle={photoFrame}
                palette={palette}
                borderColor={palette.primary}
                className="w-full h-full"
                onEmptyClick={onEmptyPhotoClick}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Solid Quote / Footer Strip */}
      <div
        style={{
          backgroundColor: palette.primary,
          color: palette.inkOnPrimary,
        }}
        className="relative z-10 px-7 py-2.5 flex items-center justify-between text-[11.5px] shrink-0"
      >
        <span className="font-display-playfair italic font-semibold truncate">
          {data.subtitle ? `“${data.subtitle}”` : data.organizationName}
        </span>
        <span className="text-[10.5px] opacity-85 shrink-0">
          {data.contactInfo || data.organizationSub}
        </span>
      </div>
    </div>
  );
};
