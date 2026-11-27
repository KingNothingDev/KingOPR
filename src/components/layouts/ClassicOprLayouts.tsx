import React from 'react';
import { Calendar, Clock, MapPin, Users, CalendarDays } from 'lucide-react';
import { OPR_LABELS, OprData, OprThemeConfig } from '../../types/opr';
import { getFontClasses, parseLines } from '../../data/presets';
import {
  BulletList,
  OrgCrest,
  PhotoSlot,
  SvgBackdrop,
  resolveDisplayPhotoSlots,
} from './LayoutPrimitives';

export interface LayoutRendererProps {
  data: OprData;
  theme: OprThemeConfig;
  onEmptyPhotoClick?: () => void;
}

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
 * 1. SIDEBAR RIBBON
 * Deep left sidebar with crest & metadata, full-width angled accent title ribbon,
 * adaptive mosaic photo gallery (1–6 photos), 2-column analysis, and stamped sign-off.
 */
export const SidebarRibbonLayout: React.FC<LayoutRendererProps> = ({
  data,
  theme,
  onEmptyPhotoClick,
}) => {
  const { palette, fontPair, photoFrame, pattern } = theme;
  const fonts = getFontClasses(fontPair);
  const labels = OPR_LABELS[data.language];
  const titles = getSectionTitles(data, theme);
  const slots = resolveDisplayPhotoSlots(data.photos, 4);

  const renderMosaic = () => {
    const count = slots.length;
    if (count === 1) {
      return (
        <div className="h-[250px] w-full">
          <PhotoSlot
            photo={slots[0]}
            index={0}
            frameStyle={photoFrame}
            palette={palette}
            borderColor={palette.primary}
            className="w-full h-full"
            onEmptyClick={onEmptyPhotoClick}
          />
        </div>
      );
    }
    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-3 h-[240px]">
          {slots.map((p, i) => (
            <PhotoSlot
              key={i}
              photo={p}
              index={i}
              frameStyle={photoFrame}
              palette={palette}
              borderColor={palette.primary}
              className="w-full h-full"
              onEmptyClick={onEmptyPhotoClick}
            />
          ))}
        </div>
      );
    }
    if (count === 3) {
      return (
        <div className="grid grid-cols-3 gap-2.5 h-[225px]">
          {slots.map((p, i) => (
            <PhotoSlot
              key={i}
              photo={p}
              index={i}
              frameStyle={photoFrame}
              palette={palette}
              borderColor={palette.primary}
              className="w-full h-full"
              onEmptyClick={onEmptyPhotoClick}
            />
          ))}
        </div>
      );
    }
    if (count === 4) {
      return (
        <div className="grid grid-cols-2 gap-2.5 h-[270px]">
          {slots.map((p, i) => (
            <PhotoSlot
              key={i}
              photo={p}
              index={i}
              frameStyle={photoFrame}
              palette={palette}
              borderColor={palette.primary}
              className="w-full h-full"
              onEmptyClick={onEmptyPhotoClick}
            />
          ))}
        </div>
      );
    }
    // 5 or 6 photos: 2 featured wide photos on top + 3 or 4 thumbnails below
    const topPhotos = slots.slice(0, 2);
    const bottomPhotos = slots.slice(2);
    return (
      <div className="flex flex-col gap-2.5">
        <div className="grid grid-cols-2 gap-2.5 h-[168px]">
          {topPhotos.map((p, i) => (
            <PhotoSlot
              key={i}
              photo={p}
              index={i}
              frameStyle={photoFrame}
              palette={palette}
              borderColor={palette.primary}
              className="w-full h-full"
              onEmptyClick={onEmptyPhotoClick}
            />
          ))}
        </div>
        <div
          className="grid gap-2 h-[112px]"
          style={{
            gridTemplateColumns: `repeat(${bottomPhotos.length}, minmax(0, 1fr))`,
          }}
        >
          {bottomPhotos.map((p, i) => (
            <PhotoSlot
              key={i + 2}
              photo={p}
              index={i + 2}
              frameStyle={photoFrame}
              palette={palette}
              borderColor={palette.primary}
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
      style={{ backgroundColor: palette.surface, color: palette.inkOnSurface }}
      className={`w-[794px] h-[1123px] relative overflow-hidden flex flex-col ${fonts.bodyClass}`}
    >
      <SvgBackdrop pattern={pattern} color={palette.primary} opacity={0.055} />

      {/* Top Masthead Band */}
      <div className="relative z-10 flex shrink-0">
        {/* Left Org Block */}
        <div
          style={{
            backgroundColor: palette.primary,
            color: palette.inkOnPrimary,
          }}
          className="w-[235px] px-5 py-5 flex flex-col justify-between shrink-0"
        >
          <div className="flex items-center gap-3">
            <OrgCrest
              logoUrl={data.logoUrl}
              orgName={data.organizationName}
              palette={palette}
              size={52}
              inverted
            />
            <div className="min-w-0">
              <div className="text-[11px] font-bold leading-snug tracking-wide">
                {data.organizationName}
              </div>
              {data.organizationSub && (
                <div className="text-[9.5px] opacity-80 leading-snug mt-0.5">
                  {data.organizationSub}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right OPR Display Header */}
        <div
          style={{ backgroundColor: palette.surfaceTint }}
          className="flex-1 px-7 py-5 flex flex-col justify-center relative overflow-hidden"
        >
          <div
            style={{ color: palette.primary }}
            className={`text-[48px] font-extrabold leading-none tracking-tight ${fonts.displayClass}`}
          >
            {data.reportBadge || 'OPR 2026'}
          </div>
          <div
            style={{ color: palette.mutedInk }}
            className="text-[12px] font-semibold tracking-[0.16em] mt-1.5 uppercase"
          >
            {data.organizationName}
          </div>
        </div>
      </div>

      {/* Angled Accent Title Ribbon */}
      <div className="relative z-20 shrink-0">
        <div
          style={{
            backgroundColor: palette.accent,
            color: palette.accentInk,
          }}
          className="px-7 py-3.5 flex items-center justify-between gap-4"
        >
          <div className="min-w-0">
            <h1
              className={`text-[24px] font-extrabold leading-tight tracking-tight ${fonts.displayClass}`}
            >
              {data.activityTitle}
            </h1>
            {data.subtitle && (
              <p className="text-[11.5px] font-medium opacity-85 mt-0.5 m-0">
                {data.subtitle}
              </p>
            )}
          </div>
          {data.organizerUnit && (
            <div
              style={{
                backgroundColor: palette.primary,
                color: palette.inkOnPrimary,
              }}
              className="shrink-0 px-3 py-1.5 rounded-md text-[10.5px] font-semibold whitespace-nowrap"
            >
              {labels.organizer}: {data.organizerUnit}
            </div>
          )}
        </div>
      </div>

      {/* Photo Gallery Showcase */}
      <div className="relative z-10 px-6 pt-4 pb-3 shrink-0">{renderMosaic()}</div>

      {/* Lower Split: Dark Left Metadata + Right Analysis Columns */}
      <div className="relative z-10 flex-1 flex min-h-0">
        {/* Left Metadata Sidebar */}
        <div
          style={{
            backgroundColor: palette.primary,
            color: palette.inkOnPrimary,
          }}
          className="w-[235px] px-5 py-5 flex flex-col justify-between shrink-0"
        >
          <div className="space-y-3">
            {[
              { icon: Calendar, label: labels.date, value: data.date },
              { icon: CalendarDays, label: labels.day, value: data.day },
              { icon: Clock, label: labels.time, value: data.time },
              { icon: MapPin, label: labels.venue, value: data.venue },
              { icon: Users, label: labels.targetGroup, value: data.targetGroup },
            ]
              .filter((item) => item.value.trim())
              .map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.14)',
                        color: palette.accent,
                      }}
                      className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div
                        style={{ color: palette.accent }}
                        className="text-[9.5px] font-bold uppercase tracking-wider"
                      >
                        {item.label}
                      </div>
                      <div className="text-[11px] font-medium leading-snug mt-0.5">
                        {item.value}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {data.reflection && (
            <div
              style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
              className="pt-3.5 mt-4"
            >
              <div
                style={{ color: palette.accent }}
                className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${fonts.displayClass}`}
              >
                {titles.reflection}
              </div>
              <p className="text-[10.5px] leading-relaxed opacity-95 m-0">
                {data.reflection}
              </p>
            </div>
          )}
        </div>

        {/* Right Narrative Content & Sign-Off */}
        <div className="flex-1 px-6 py-5 flex flex-col justify-between min-w-0">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <h2
                  style={{ color: palette.primary }}
                  className={`text-[13px] font-extrabold uppercase tracking-wide mb-2 pb-1 border-b-2 ${fonts.displayClass}`}
                >
                  {titles.objectives}
                </h2>
                <BulletList
                  text={data.objectives}
                  bulletColor={palette.accent}
                  textColor={palette.inkOnSurface}
                  fontSize={11}
                />
              </div>

              <div>
                <h2
                  style={{ color: palette.primary }}
                  className={`text-[13px] font-extrabold uppercase tracking-wide mb-2 pb-1 border-b-2 ${fonts.displayClass}`}
                >
                  {titles.impact}
                </h2>
                <BulletList
                  text={data.impact}
                  bulletColor={palette.primary}
                  textColor={palette.inkOnSurface}
                  fontSize={11}
                />
              </div>
            </div>

            {data.implementation && (
              <div
                style={{
                  backgroundColor: palette.surfaceTint,
                  border: `1px solid ${palette.primary}22`,
                }}
                className="rounded-lg px-4 py-3"
              >
                <h2
                  style={{ color: palette.primary }}
                  className={`text-[12px] font-extrabold uppercase tracking-wide mb-1.5 ${fonts.displayClass}`}
                >
                  {titles.implementation}
                </h2>
                <BulletList
                  text={data.implementation}
                  bulletColor={palette.accent}
                  textColor={palette.inkOnSurface}
                  fontSize={10.8}
                />
              </div>
            )}
          </div>

          {/* Signature Strip */}
          <div className="flex items-end justify-between gap-4 pt-3 border-t border-slate-200/80">
            <div>
              <div
                style={{ color: palette.mutedInk }}
                className="text-[9.5px] font-semibold uppercase tracking-wider"
              >
                {labels.preparedBy}
              </div>
              <div
                style={{ color: palette.inkOnSurface }}
                className="text-[12px] font-bold mt-3"
              >
                {data.preparedByName}
              </div>
              {data.preparedByRole && (
                <div style={{ color: palette.mutedInk }} className="text-[10px]">
                  {data.preparedByRole}
                </div>
              )}
            </div>

            {data.verifiedByName && (
              <div className="text-right">
                <div
                  style={{ color: palette.mutedInk }}
                  className="text-[9.5px] font-semibold uppercase tracking-wider"
                >
                  {labels.verifiedBy}
                </div>
                <div
                  style={{ color: palette.inkOnSurface }}
                  className="text-[12px] font-bold mt-3"
                >
                  {data.verifiedByName}
                </div>
                {data.verifiedByRole && (
                  <div style={{ color: palette.mutedInk }} className="text-[10px]">
                    {data.verifiedByRole}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Crisp Footer Bar */}
      <div
        style={{ backgroundColor: palette.accent, color: palette.accentInk }}
        className="relative z-10 px-6 py-2 flex items-center justify-between text-[10.5px] font-bold tracking-wide shrink-0"
      >
        <span>{data.organizerUnit || data.organizationName}</span>
        <span>{data.contactInfo || data.reportBadge}</span>
      </div>
    </div>
  );
};

/**
 * 2. DIAGONAL DIAMOND
 * Deep rich full-bleed color canvas with bold contrasting left column and rotated diamond photo cascade on the right.
 */
export const DiagonalDiamondLayout: React.FC<LayoutRendererProps> = ({
  data,
  theme,
  onEmptyPhotoClick,
}) => {
  const { palette, fontPair, pattern } = theme;
  const fonts = getFontClasses(fontPair);
  const labels = OPR_LABELS[data.language];
  const titles = getSectionTitles(data, theme);
  const slots = resolveDisplayPhotoSlots(data.photos, 3);

  // Render up to 6 photos in a crisp diamond or angled gallery column on the right
  const renderDiamondColumn = () => {
    if (slots.length <= 3) {
      return (
        <div className="flex flex-col items-center justify-center gap-6 py-4 h-full">
          {slots.map((photo, idx) => (
            <div
              key={idx}
              style={{
                width: slots.length === 1 ? 250 : slots.length === 2 ? 230 : 210,
                height: slots.length === 1 ? 250 : slots.length === 2 ? 230 : 210,
                transform: 'rotate(45deg)',
                border: `5px solid ${palette.accent}`,
                backgroundColor: '#FFFFFF',
                boxShadow: '0 10px 24px rgba(0,0,0,0.28)',
              }}
              className="rounded-2xl overflow-hidden shrink-0 flex items-center justify-center"
            >
              <div
                style={{
                  width: '142%',
                  height: '142%',
                  transform: 'rotate(-45deg)',
                }}
                className="shrink-0"
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
            </div>
          ))}
        </div>
      );
    }

    // 4-6 photos: staggered 2-column diamond/angled grid
    return (
      <div className="grid grid-cols-2 gap-x-5 gap-y-6 items-center content-center h-full px-3">
        {slots.map((photo, idx) => (
          <div
            key={idx}
            style={{
              width: 132,
              height: 132,
              transform: `rotate(45deg) translate(${idx % 2 === 1 ? '10px, 18px' : '0px, 0px'})`,
              border: `4px solid ${palette.accent}`,
              backgroundColor: '#FFFFFF',
              boxShadow: '0 8px 18px rgba(0,0,0,0.26)',
            }}
            className="rounded-xl overflow-hidden mx-auto flex items-center justify-center"
          >
            <div
              style={{
                width: '142%',
                height: '142%',
                transform: 'rotate(-45deg)',
              }}
              className="shrink-0"
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
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: palette.primary,
        color: palette.inkOnPrimary,
      }}
      className={`w-[794px] h-[1123px] relative overflow-hidden flex ${fonts.bodyClass}`}
    >
      <SvgBackdrop pattern={pattern} color="#FFFFFF" opacity={0.07} />

      {/* Decorative Right-Edge Bright Geometric Backing */}
      <svg
        aria-hidden="true"
        className="absolute right-0 top-0 h-full w-[340px] pointer-events-none"
        viewBox="0 0 340 1123"
        preserveAspectRatio="none"
      >
        <polygon points="150,0 340,0 340,1123 190,1123 70,560" fill="#FFFFFF" opacity="0.96" />
        <polygon points="135,0 156,0 76,560 196,1123 175,1123 55,560" fill={palette.accent} />
      </svg>

      {/* Left Main Report Column */}
      <div className="relative z-10 w-[472px] px-7 py-7 flex flex-col justify-between">
        <div>
          {/* Crest + Big OPR Title */}
          <div className="flex items-center gap-5 mb-5">
            <OrgCrest
              logoUrl={data.logoUrl}
              orgName={data.organizationName}
              palette={palette}
              size={66}
              inverted
            />
            <div>
              <div
                className={`text-[46px] font-extrabold leading-none tracking-tight ${fonts.displayClass}`}
              >
                {data.reportBadge || 'OPR'}
              </div>
              <div className="text-[11.5px] font-semibold opacity-90 mt-1">
                {data.organizationName}
              </div>
            </div>
          </div>

          {/* Highlight Title Capsule */}
          <div
            style={{
              backgroundColor: palette.accent,
              color: palette.accentInk,
            }}
            className="rounded-2xl px-5 py-3.5 mb-5 shadow-sm"
          >
            <h1
              className={`text-[19px] font-extrabold leading-snug ${fonts.displayClass}`}
            >
              {data.activityTitle}
            </h1>
            {data.subtitle && (
              <p className="text-[10.8px] font-medium opacity-85 mt-1 m-0">
                {data.subtitle}
              </p>
            )}
          </div>

          {/* Key Metadata Lines */}
          <div className="space-y-1.5 mb-5 text-[11.5px]">
            {[
              { label: labels.date, value: [data.date, data.day].filter(Boolean).join(' · ') },
              { label: labels.time, value: data.time },
              { label: labels.venue, value: data.venue },
              { label: labels.targetGroup, value: data.targetGroup },
            ]
              .filter((r) => r.value.trim())
              .map((row, idx) => (
                <div key={idx} className="flex items-baseline gap-2">
                  <span
                    style={{ color: palette.accent }}
                    className="font-bold uppercase text-[10.5px] tracking-wider shrink-0"
                  >
                    {row.label}:
                  </span>
                  <span className="font-medium opacity-95">{row.value}</span>
                </div>
              ))}
          </div>

          {/* Content Sections */}
          <div className="space-y-4">
            <div>
              <h2
                style={{ color: palette.accent }}
                className={`text-[13px] font-extrabold uppercase tracking-wider mb-1.5 ${fonts.displayClass}`}
              >
                {titles.objectives}
              </h2>
              <BulletList
                text={data.objectives}
                bulletColor={palette.accent}
                textColor={palette.inkOnPrimary}
                fontSize={11.2}
              />
            </div>

            <div>
              <h2
                style={{ color: palette.accent }}
                className={`text-[13px] font-extrabold uppercase tracking-wider mb-1.5 ${fonts.displayClass}`}
              >
                {titles.implementation}
              </h2>
              <BulletList
                text={data.implementation}
                bulletColor={palette.accent}
                textColor={palette.inkOnPrimary}
                fontSize={11.2}
              />
            </div>

            <div>
              <h2
                style={{ color: palette.accent }}
                className={`text-[13px] font-extrabold uppercase tracking-wider mb-1.5 ${fonts.displayClass}`}
              >
                {titles.impact}
              </h2>
              <BulletList
                text={data.impact}
                bulletColor={palette.accent}
                textColor={palette.inkOnPrimary}
                fontSize={11.2}
              />
            </div>

            {data.reflection && (
              <div
                style={{ backgroundColor: 'rgba(255,255,255,0.09)' }}
                className="rounded-xl px-4 py-2.5"
              >
                <div
                  style={{ color: palette.accent }}
                  className="text-[10.5px] font-bold uppercase tracking-wider mb-0.5"
                >
                  {titles.reflection}
                </div>
                <p className="text-[10.8px] leading-snug opacity-95 m-0">
                  {data.reflection}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Signature Cards */}
        <div className="grid grid-cols-2 gap-3.5 pt-4">
          <div
            style={{
              backgroundColor: palette.accent,
              color: palette.accentInk,
            }}
            className="rounded-xl px-3.5 py-3"
          >
            <div className="text-[9.5px] font-bold uppercase tracking-wider opacity-80">
              {labels.preparedBy}
            </div>
            <div className="border-b border-current/35 mt-6 mb-1.5" />
            <div className="text-[11px] font-extrabold leading-tight">
              {data.preparedByName}
            </div>
            {data.preparedByRole && (
              <div className="text-[9.5px] font-medium opacity-85 mt-0.5">
                {data.preparedByRole}
              </div>
            )}
          </div>

          {data.verifiedByName && (
            <div
              style={{
                backgroundColor: palette.accent,
                color: palette.accentInk,
              }}
              className="rounded-xl px-3.5 py-3"
            >
              <div className="text-[9.5px] font-bold uppercase tracking-wider opacity-80">
                {labels.verifiedBy}
              </div>
              <div className="border-b border-current/35 mt-6 mb-1.5" />
              <div className="text-[11px] font-extrabold leading-tight">
                {data.verifiedByName}
              </div>
              {data.verifiedByRole && (
                <div className="text-[9.5px] font-medium opacity-85 mt-0.5">
                  {data.verifiedByRole}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Diamond Photo Column */}
      <div className="relative z-10 flex-1 pr-4 py-6 flex items-center justify-center">
        {renderDiamondColumn()}
      </div>
    </div>
  );
};

/**
 * 3. HONEYCOMB WAVE
 * Soft tinted canvas with interlocking hexagonal photo cluster on the right & sculpted curved bottom wave footer.
 */
export const HoneycombWaveLayout: React.FC<LayoutRendererProps> = ({
  data,
  theme,
  onEmptyPhotoClick,
}) => {
  const { palette, fontPair, pattern } = theme;
  const fonts = getFontClasses(fontPair);
  const labels = OPR_LABELS[data.language];
  const titles = getSectionTitles(data, theme);
  const slots = resolveDisplayPhotoSlots(data.photos, 5);

  const hexPositions = [
    { top: 10, left: 0, size: 174 },
    { top: 10, left: 172, size: 174 },
    { top: 158, left: 86, size: 178 },
    { top: 308, left: 0, size: 174 },
    { top: 308, left: 172, size: 174 },
    { top: 456, left: 86, size: 176 },
  ];

  return (
    <div
      style={{
        backgroundColor: palette.surfaceTint,
        color: palette.inkOnSurface,
      }}
      className={`w-[794px] h-[1123px] relative overflow-hidden flex flex-col justify-between ${fonts.bodyClass}`}
    >
      <SvgBackdrop pattern={pattern} color={palette.primary} opacity={0.07} />

      {/* Top Content Area */}
      <div className="relative z-10 flex-1 flex px-7 pt-7 pb-4 gap-5 min-h-0">
        {/* Left Narrative Column */}
        <div className="w-[375px] flex flex-col shrink-0">
          <div className="mb-3">
            <div
              style={{ color: palette.primary }}
              className={`text-[15px] font-extrabold leading-tight ${fonts.displayClass}`}
            >
              {data.organizationName}
            </div>
            {data.organizationSub && (
              <div style={{ color: palette.mutedInk }} className="text-[10px] mt-0.5">
                {data.organizationSub}
              </div>
            )}
          </div>

          <div
            style={{
              backgroundColor: palette.primary,
              color: palette.inkOnPrimary,
            }}
            className="self-start px-5 py-1.5 rounded-full text-[13px] font-extrabold tracking-widest uppercase mb-3.5"
          >
            {data.reportBadge || 'MYOPR'}
          </div>

          <h1
            style={{ color: palette.inkOnSurface }}
            className={`text-[21px] font-extrabold leading-tight mb-3 ${fonts.displayClass}`}
          >
            {data.activityTitle}
          </h1>

          {/* Structured Metadata Card */}
          <div
            style={{
              backgroundColor: palette.surface,
              border: `1.5px solid ${palette.primary}25`,
            }}
            className="rounded-xl px-4 py-3 mb-4 space-y-1 text-[11px]"
          >
            {[
              { label: labels.date, value: data.date },
              { label: labels.day, value: data.day },
              { label: labels.time, value: data.time },
              { label: labels.venue, value: data.venue },
              { label: labels.targetGroup, value: data.targetGroup },
            ]
              .filter((r) => r.value.trim())
              .map((row, idx) => (
                <div key={idx} className="flex gap-2">
                  <span
                    style={{ color: palette.primary }}
                    className="font-bold uppercase text-[10px] w-[72px] shrink-0"
                  >
                    {row.label}
                  </span>
                  <span className="font-medium">{row.value}</span>
                </div>
              ))}
          </div>

          {/* Narrative Sections */}
          <div className="space-y-3.5 flex-1">
            <div>
              <div
                style={{ color: palette.primary }}
                className={`text-[12.5px] font-extrabold uppercase tracking-wide mb-1 ${fonts.displayClass}`}
              >
                {titles.objectives}
              </div>
              <BulletList
                text={data.objectives}
                bulletColor={palette.primary}
                textColor={palette.inkOnSurface}
                fontSize={10.8}
              />
            </div>

            <div>
              <div
                style={{ color: palette.primary }}
                className={`text-[12.5px] font-extrabold uppercase tracking-wide mb-1 ${fonts.displayClass}`}
              >
                {titles.implementation}
              </div>
              <BulletList
                text={data.implementation}
                bulletColor={palette.accent}
                textColor={palette.inkOnSurface}
                fontSize={10.8}
              />
            </div>

            <div>
              <div
                style={{ color: palette.primary }}
                className={`text-[12.5px] font-extrabold uppercase tracking-wide mb-1 ${fonts.displayClass}`}
              >
                {titles.impact}
              </div>
              <BulletList
                text={data.impact}
                bulletColor={palette.primary}
                textColor={palette.inkOnSurface}
                fontSize={10.8}
              />
            </div>

            {data.reflection && (
              <div>
                <div
                  style={{ color: palette.primary }}
                  className={`text-[12px] font-extrabold uppercase tracking-wide mb-1 ${fonts.displayClass}`}
                >
                  {titles.reflection}
                </div>
                <p className="text-[10.5px] leading-snug m-0 opacity-90">
                  {data.reflection}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Crest + Honeycomb Hex Photo Cluster */}
        <div className="flex-1 flex flex-col items-end">
          <div className="flex items-center gap-3 mb-3">
            {data.organizerUnit && (
              <div className="text-right">
                <div
                  style={{ color: palette.mutedInk }}
                  className="text-[9.5px] uppercase tracking-wider font-semibold"
                >
                  {labels.organizer}
                </div>
                <div
                  style={{ color: palette.primary }}
                  className="text-[12px] font-bold"
                >
                  {data.organizerUnit}
                </div>
              </div>
            )}
            <OrgCrest
              logoUrl={data.logoUrl}
              orgName={data.organizationName}
              palette={palette}
              size={58}
            />
          </div>

          <div className="relative w-[348px] h-[645px] mt-2">
            {slots.map((photo, idx) => {
              const pos = hexPositions[idx] || hexPositions[0];
              return (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    top: pos.top,
                    left: pos.left,
                    width: pos.size,
                    height: pos.size,
                    backgroundColor: palette.primary,
                    clipPath:
                      'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
                    padding: 5,
                  }}
                >
                  <PhotoSlot
                    photo={photo}
                    index={idx}
                    frameStyle="sharp"
                    palette={palette}
                    shape="hexagon"
                    className="w-full h-full"
                    onEmptyClick={onEmptyPhotoClick}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sculpted Curved Bottom Wave Footer */}
      <div className="relative z-10 h-[175px] shrink-0">
        <svg
          aria-hidden="true"
          viewBox="0 0 794 175"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <path
            d="M0,42 C180,105 460,-20 794,48 L794,175 L0,175 Z"
            fill={palette.accent}
            opacity="0.35"
          />
          <path
            d="M0,26 C220,96 520,-8 794,54 L794,175 L0,175 Z"
            fill={palette.primary}
          />
        </svg>

        <div
          style={{ color: palette.inkOnPrimary }}
          className="relative z-10 h-full px-8 pt-14 pb-4 flex flex-col justify-between"
        >
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-[10px] uppercase tracking-wider opacity-80">
                {labels.preparedBy}:
              </div>
              <div className="text-[13px] font-bold mt-4">
                {data.preparedByName}
              </div>
              {data.preparedByRole && (
                <div className="text-[10.5px] opacity-85">{data.preparedByRole}</div>
              )}
            </div>

            {data.verifiedByName && (
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider opacity-80">
                  {labels.verifiedBy}:
                </div>
                <div className="text-[13px] font-bold mt-4">
                  {data.verifiedByName}
                </div>
                {data.verifiedByRole && (
                  <div className="text-[10.5px] opacity-85">
                    {data.verifiedByRole}
                  </div>
                )}
              </div>
            )}
          </div>

          {data.contactInfo && (
            <div className="text-[10.5px] opacity-85 font-medium flex items-center justify-between border-t border-white/20 pt-2">
              <span>{data.organizationName}</span>
              <span>{data.contactInfo}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * 4. GEOMETRIC CIRCLES
 * Crisp white editorial sheet with bold diagonal corner stripes, circular right photo gallery,
 * and stepped chevron/hexagon numbered objectives.
 */
export const GeometricCirclesLayout: React.FC<LayoutRendererProps> = ({
  data,
  theme,
  onEmptyPhotoClick,
}) => {
  const { palette, fontPair, pattern } = theme;
  const fonts = getFontClasses(fontPair);
  const labels = OPR_LABELS[data.language];
  const titles = getSectionTitles(data, theme);
  const slots = resolveDisplayPhotoSlots(data.photos, 3);
  const objectiveItems = parseLines(data.objectives).slice(0, 3);

  return (
    <div
      style={{ backgroundColor: palette.surface, color: palette.inkOnSurface }}
      className={`w-[794px] h-[1123px] relative overflow-hidden flex flex-col ${fonts.bodyClass}`}
    >
      <SvgBackdrop pattern={pattern} color={palette.primary} opacity={0.04} />

      {/* Top-Right Geometric Diagonal Stripes */}
      <svg
        aria-hidden="true"
        className="absolute top-0 right-0 w-[380px] h-[240px] pointer-events-none"
        viewBox="0 0 380 240"
      >
        <polygon points="110,0 190,0 380,190 380,240 330,240" fill={palette.primary} />
        <polygon points="220,0 300,0 380,80 380,150" fill={palette.accent} />
        <polygon points="295,0 380,0 380,60" fill={palette.primary} />
      </svg>

      {/* Bottom-Right Geometric Diagonal Stripes */}
      <svg
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-[340px] h-[220px] pointer-events-none"
        viewBox="0 0 340 220"
      >
        <polygon points="140,220 340,20 340,100 220,220" fill={palette.primary} />
        <polygon points="240,220 340,120 340,220" fill={palette.accent} />
      </svg>

      <div className="relative z-10 flex-1 flex px-8 py-8 gap-6 min-h-0">
        {/* Left Main Content Column */}
        <div className="w-[425px] flex flex-col justify-between shrink-0">
          <div>
            <div
              style={{ color: palette.primary }}
              className="text-[13px] font-bold tracking-widest uppercase mb-3"
            >
              {data.reportBadge || 'One Page Report'}
            </div>

            <div className="flex items-center gap-3.5 mb-5">
              <OrgCrest
                logoUrl={data.logoUrl}
                orgName={data.organizationName}
                palette={palette}
                size={54}
              />
              <div>
                <div
                  style={{ color: palette.primary }}
                  className={`text-[18px] font-extrabold leading-tight ${fonts.displayClass}`}
                >
                  {data.organizationName}
                </div>
                {data.organizationSub && (
                  <div style={{ color: palette.mutedInk }} className="text-[10.5px]">
                    {data.organizationSub}
                  </div>
                )}
              </div>
            </div>

            {/* Warm Accent Title Block */}
            <div
              style={{
                backgroundColor: palette.accent,
                color: palette.accentInk,
              }}
              className="rounded-2xl px-5 py-4 mb-5"
            >
              <h1
                className={`text-[23px] font-extrabold leading-tight ${fonts.displayClass}`}
              >
                {data.activityTitle}
              </h1>
              {data.subtitle && (
                <p className="text-[11px] font-medium opacity-85 mt-1 m-0">
                  {data.subtitle}
                </p>
              )}
            </div>

            {/* Rounded Metadata Card */}
            <div
              style={{
                backgroundColor: palette.surfaceTint,
                border: `2px solid ${palette.accent}`,
              }}
              className="rounded-3xl px-5 py-3.5 mb-5 space-y-1.5 text-[11.5px]"
            >
              {[
                { label: labels.date, value: [data.date, data.day].filter(Boolean).join(' · ') },
                { label: labels.time, value: data.time },
                { label: labels.venue, value: data.venue },
                { label: labels.targetGroup, value: data.targetGroup },
              ]
                .filter((r) => r.value.trim())
                .map((row, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span
                      style={{ color: palette.primary }}
                      className="font-extrabold uppercase text-[10.5px] min-w-[68px] shrink-0"
                    >
                      {row.label}:
                    </span>
                    <span className="font-semibold">{row.value}</span>
                  </div>
                ))}
            </div>

            {/* Stepped Hexagon-Numbered Objectives */}
            <div className="mb-5">
              <h2
                style={{ color: palette.primary }}
                className={`text-[14px] font-extrabold uppercase tracking-wider mb-2.5 ${fonts.displayClass}`}
              >
                {titles.objectives}
              </h2>
              <div className="space-y-2.5">
                {objectiveItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div
                      style={{
                        backgroundColor: palette.primary,
                        color: palette.inkOnPrimary,
                        clipPath:
                          'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)',
                      }}
                      className="w-10 h-9 flex items-center justify-center font-extrabold text-[13px] shrink-0 font-mono-tabular"
                    >
                      0{idx + 1}
                    </div>
                    <div
                      style={{
                        backgroundColor: palette.surfaceTint,
                        border: `1px solid ${palette.primary}20`,
                      }}
                      className="flex-1 rounded-r-xl rounded-l-md px-3.5 py-2 text-[11px] leading-snug font-medium"
                    >
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Implementation + Impact */}
            <div className="grid grid-cols-1 gap-3">
              {data.implementation && (
                <div>
                  <h2
                    style={{ color: palette.primary }}
                    className={`text-[12.5px] font-extrabold uppercase tracking-wider mb-1 ${fonts.displayClass}`}
                  >
                    {titles.implementation}
                  </h2>
                  <BulletList
                    text={data.implementation}
                    bulletColor={palette.accent}
                    textColor={palette.inkOnSurface}
                    fontSize={10.8}
                    maxItems={3}
                  />
                </div>
              )}

              {data.impact && (
                <div>
                  <h2
                    style={{ color: palette.primary }}
                    className={`text-[12.5px] font-extrabold uppercase tracking-wider mb-1 ${fonts.displayClass}`}
                  >
                    {titles.impact}
                  </h2>
                  <BulletList
                    text={data.impact}
                    bulletColor={palette.primary}
                    textColor={palette.inkOnSurface}
                    fontSize={10.8}
                    maxItems={3}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Signature Row */}
          <div className="grid grid-cols-2 gap-5 pt-4 mt-2">
            <div>
              <div
                style={{
                  backgroundColor: palette.accent,
                  color: palette.accentInk,
                }}
                className="px-3 py-1 rounded-md text-[10px] font-bold inline-block"
              >
                {labels.preparedBy}:
              </div>
              <div className="text-[11.5px] font-bold mt-5">
                {data.preparedByName}
              </div>
              {data.preparedByRole && (
                <div style={{ color: palette.mutedInk }} className="text-[9.8px]">
                  {data.preparedByRole}
                </div>
              )}
            </div>

            {data.verifiedByName && (
              <div>
                <div
                  style={{
                    backgroundColor: palette.accent,
                    color: palette.accentInk,
                  }}
                  className="px-3 py-1 rounded-md text-[10px] font-bold inline-block"
                >
                  {labels.verifiedBy}:
                </div>
                <div className="text-[11.5px] font-bold mt-5">
                  {data.verifiedByName}
                </div>
                {data.verifiedByRole && (
                  <div style={{ color: palette.mutedInk }} className="text-[9.8px]">
                    {data.verifiedByRole}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Circular Photo Gallery Column */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 pt-6 pb-8">
          {slots.length <= 3 ? (
            slots.map((photo, idx) => {
              const size =
                slots.length === 1 ? 280 : slots.length === 2 ? 265 : idx === 0 ? 275 : 235;
              return (
                <div
                  key={idx}
                  style={{
                    width: size,
                    height: size,
                    border: `6px solid ${palette.primary}`,
                    borderRadius: '9999px',
                    boxShadow: '0 10px 26px rgba(15, 23, 42, 0.14)',
                    backgroundColor: '#FFFFFF',
                  }}
                  className="overflow-hidden shrink-0"
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
            })
          ) : (
            <div className="grid grid-cols-2 gap-3.5 items-center content-center">
              {slots.map((photo, idx) => (
                <div
                  key={idx}
                  style={{
                    width: 146,
                    height: 146,
                    border: `5px solid ${idx % 2 === 0 ? palette.primary : palette.accent}`,
                    borderRadius: '9999px',
                    boxShadow: '0 8px 18px rgba(15, 23, 42, 0.12)',
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

          {data.reflection && (
            <div
              style={{
                backgroundColor: palette.surface,
                border: `1.5px solid ${palette.primary}30`,
              }}
              className="w-full rounded-xl px-4 py-3 mt-2 shadow-xs"
            >
              <div
                style={{ color: palette.primary }}
                className="text-[10.5px] font-extrabold uppercase tracking-wider mb-1"
              >
                {titles.reflection}
              </div>
              <p className="text-[10.5px] leading-snug m-0">{data.reflection}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
