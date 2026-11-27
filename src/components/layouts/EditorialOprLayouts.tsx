import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { OPR_LABELS, OprData, OprThemeConfig } from '../../types/opr';
import { getFontClasses } from '../../data/presets';
import {
  BulletList,
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
 * 5. BROADSHEET LEDGER
 * Authoritative deep sidebar with dark-bar labeled cards on the left, bold masthead + rounded photo matrix
 * + structured horizontal reflection bands on the right.
 */
export const BroadsheetBlocksLayout: React.FC<LayoutRendererProps> = ({
  data,
  theme,
  onEmptyPhotoClick,
}) => {
  const { palette, fontPair, photoFrame, pattern } = theme;
  const fonts = getFontClasses(fontPair);
  const labels = OPR_LABELS[data.language];
  const titles = getSectionTitles(data, theme);
  const slots = resolveDisplayPhotoSlots(data.photos, 6);

  const gridCols = slots.length === 1 ? 1 : slots.length <= 4 ? 2 : 3;
  const gridHeight = slots.length <= 3 ? 255 : 355;

  return (
    <div
      style={{ backgroundColor: palette.surface, color: palette.inkOnSurface }}
      className={`w-[794px] h-[1123px] relative overflow-hidden flex ${fonts.bodyClass}`}
    >
      {/* Left Authoritative Sidebar */}
      <div
        style={{
          backgroundColor: palette.primary,
          color: palette.inkOnPrimary,
        }}
        className="w-[272px] relative px-5 py-6 flex flex-col justify-between shrink-0 overflow-hidden"
      >
        <SvgBackdrop pattern={pattern === 'none' ? 'waves' : pattern} color="#FFFFFF" opacity={0.09} />

        <div className="relative z-10 space-y-3.5">
          {/* Crest + Org Identity */}
          <div className="flex items-center gap-3 pb-2">
            <OrgCrest
              logoUrl={data.logoUrl}
              orgName={data.organizationName}
              palette={palette}
              size={58}
              inverted
            />
            <div className="min-w-0">
              <div
                className={`text-[13.5px] font-extrabold leading-tight tracking-wide ${fonts.displayClass}`}
              >
                {data.organizationName}
              </div>
              {data.organizerUnit && (
                <div className="text-[10px] opacity-85 mt-0.5">{data.organizerUnit}</div>
              )}
            </div>
          </div>

          {/* Boxed Sidebar Cards */}
          {[
            {
              header: labels.date,
              body: [data.date, data.day, data.time].filter(Boolean).join('\n'),
            },
            {
              header: labels.venue,
              body: data.venue,
            },
            {
              header: labels.targetGroup,
              body: data.targetGroup,
            },
            {
              header: titles.objectives,
              body: data.objectives,
              isList: true,
            },
            {
              header: titles.implementation,
              body: data.implementation,
              isList: true,
            },
          ]
            .filter((block) => block.body.trim())
            .map((block, idx) => (
              <div key={idx} className="overflow-hidden rounded-md shadow-xs">
                <div
                  style={{
                    backgroundColor: palette.secondary,
                    color: palette.inkOnPrimary,
                  }}
                  className={`px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-center ${fonts.displayClass}`}
                >
                  {block.header}
                </div>
                <div
                  style={{
                    backgroundColor: palette.surface,
                    color: palette.inkOnSurface,
                  }}
                  className="px-3.5 py-2.5 text-[10.8px] leading-snug"
                >
                  {block.isList ? (
                    <BulletList
                      text={block.body}
                      bulletColor={palette.primary}
                      textColor={palette.inkOnSurface}
                      fontSize={10.5}
                      maxItems={4}
                    />
                  ) : (
                    <div className="whitespace-pre-line font-medium text-center">
                      {block.body}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Footer Signature inside Sidebar */}
        <div
          style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
          className="relative z-10 pt-3 text-[10px] opacity-90"
        >
          <div className="uppercase tracking-wider opacity-75 text-[9px]">
            {labels.preparedBy}
          </div>
          <div className="font-bold text-[11px] mt-0.5">{data.preparedByName}</div>
          {data.preparedByRole && <div className="opacity-80">{data.preparedByRole}</div>}
        </div>
      </div>

      {/* Right Main White Broadsheet */}
      <div className="flex-1 flex flex-col justify-between px-6 py-6 min-w-0">
        {/* Bold Masthead */}
        <div>
          <div className="text-center pb-4">
            <div
              style={{ color: palette.inkOnSurface }}
              className={`text-[40px] font-extrabold leading-none tracking-tight ${fonts.displayClass}`}
            >
              {data.reportBadge || 'LAPORAN SEMUKA'}
            </div>
            <h1
              style={{ color: palette.primary }}
              className={`text-[18px] font-extrabold leading-snug mt-1.5 uppercase ${fonts.displayClass}`}
            >
              {data.activityTitle}
            </h1>
            {data.organizationSub && (
              <div style={{ color: palette.mutedInk }} className="text-[10.5px] mt-1">
                {data.organizationSub}
              </div>
            )}
          </div>

          {/* Photo Section Band */}
          <div
            style={{
              backgroundColor: palette.primary,
              color: palette.inkOnPrimary,
            }}
            className={`px-4 py-1.5 text-[12px] font-extrabold uppercase tracking-wider text-center rounded-sm mb-3 ${fonts.displayClass}`}
          >
            {labels.gallery}
          </div>

          <div
            className="grid gap-2.5 mb-5"
            style={{
              gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
              height: gridHeight,
            }}
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

          {/* Impact / Outcomes Band */}
          <div className="mb-4">
            <div
              style={{
                backgroundColor: palette.primary,
                color: palette.inkOnPrimary,
              }}
              className={`px-4 py-1.5 text-[12px] font-extrabold uppercase tracking-wider text-center rounded-sm mb-2.5 ${fonts.displayClass}`}
            >
              {titles.impact}
            </div>
            <div className="px-1">
              <BulletList
                text={data.impact}
                bulletColor={palette.primary}
                textColor={palette.inkOnSurface}
                fontSize={11.2}
                maxItems={4}
              />
            </div>
          </div>

          {/* Reflection / Summary Band */}
          {data.reflection && (
            <div>
              <div
                style={{
                  backgroundColor: palette.primary,
                  color: palette.inkOnPrimary,
                }}
                className={`px-4 py-1.5 text-[12px] font-extrabold uppercase tracking-wider text-center rounded-sm mb-2.5 ${fonts.displayClass}`}
              >
                {titles.reflection}
              </div>
              <p className="text-[11.2px] leading-relaxed px-1 m-0">
                {data.reflection}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Verification Line */}
        <div className="flex items-end justify-between border-t border-slate-200 pt-3 text-[10.5px]">
          <span style={{ color: palette.mutedInk }}>{data.contactInfo}</span>
          {data.verifiedByName && (
            <div className="text-right">
              <span style={{ color: palette.mutedInk }}>{labels.verifiedBy}: </span>
              <span className="font-bold">{data.verifiedByName}</span>
              {data.verifiedByRole && (
                <span style={{ color: palette.mutedInk }}> · {data.verifiedByRole}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * 6. STRUCTURED BENTO
 * Full-width bright header banner, metadata strip, adaptive gallery showcase,
 * and 2×2 color-accented structured summary cards.
 */
export const BentoShowcaseLayout: React.FC<LayoutRendererProps> = ({
  data,
  theme,
  onEmptyPhotoClick,
}) => {
  const { palette, fontPair, photoFrame, pattern } = theme;
  const fonts = getFontClasses(fontPair);
  const labels = OPR_LABELS[data.language];
  const titles = getSectionTitles(data, theme);
  const slots = resolveDisplayPhotoSlots(data.photos, 5);

  const renderGallery = () => {
    const count = slots.length;
    if (count <= 3) {
      return (
        <div
          className="grid gap-3 h-[250px]"
          style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
        >
          {slots.map((photo, idx) => (
            <PhotoSlot
              key={idx}
              photo={photo}
              index={idx}
              frameStyle={photoFrame}
              palette={palette}
              borderColor={`${palette.primary}30`}
              className="w-full h-full"
              onEmptyClick={onEmptyPhotoClick}
            />
          ))}
        </div>
      );
    }
    const top = slots.slice(0, 3);
    const bottom = slots.slice(3);
    return (
      <div className="flex flex-col gap-2.5">
        <div className="grid grid-cols-3 gap-2.5 h-[165px]">
          {top.map((photo, idx) => (
            <PhotoSlot
              key={idx}
              photo={photo}
              index={idx}
              frameStyle={photoFrame}
              palette={palette}
              borderColor={`${palette.primary}30`}
              className="w-full h-full"
              onEmptyClick={onEmptyPhotoClick}
            />
          ))}
        </div>
        <div
          className="grid gap-2.5 h-[155px]"
          style={{ gridTemplateColumns: `repeat(${bottom.length}, minmax(0, 1fr))` }}
        >
          {bottom.map((photo, idx) => (
            <PhotoSlot
              key={idx + 3}
              photo={photo}
              index={idx + 3}
              frameStyle={photoFrame}
              palette={palette}
              borderColor={`${palette.primary}30`}
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
      className={`w-[794px] h-[1123px] relative overflow-hidden flex flex-col justify-between ${fonts.bodyClass}`}
    >
      <SvgBackdrop pattern={pattern} color={palette.primary} opacity={0.04} />

      <div className="relative z-10 flex-1 flex flex-col px-7 pt-6 pb-4">
        {/* Top Masthead Card */}
        <div
          style={{
            backgroundColor: palette.primary,
            color: palette.inkOnPrimary,
          }}
          className="rounded-2xl px-6 py-5 mb-4 flex items-center justify-between gap-5 relative overflow-hidden"
        >
          <div className="flex items-center gap-4 min-w-0">
            <OrgCrest
              logoUrl={data.logoUrl}
              orgName={data.organizationName}
              palette={palette}
              size={60}
              inverted
            />
            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-widest opacity-85">
                {data.organizationName}
              </div>
              <h1
                className={`text-[24px] font-extrabold leading-tight mt-0.5 ${fonts.displayClass}`}
              >
                {data.activityTitle}
              </h1>
              {data.subtitle && (
                <p className="text-[11px] opacity-90 mt-1 m-0">{data.subtitle}</p>
              )}
            </div>
          </div>

          <div
            style={{
              backgroundColor: palette.accent,
              color: palette.accentInk,
            }}
            className={`shrink-0 px-4 py-2 rounded-xl text-[15px] font-extrabold tracking-wide ${fonts.displayClass}`}
          >
            {data.reportBadge || 'OPR'}
          </div>
        </div>

        {/* 4-Item Metadata Ribbon */}
        <div className="grid grid-cols-4 gap-2.5 mb-4">
          {[
            { icon: Calendar, label: labels.date, value: data.date },
            { icon: Clock, label: labels.time, value: data.time || data.day },
            { icon: MapPin, label: labels.venue, value: data.venue },
            { icon: Users, label: labels.targetGroup, value: data.targetGroup },
          ].map((meta, idx) => {
            const Icon = meta.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: palette.surfaceTint,
                  border: `1.5px solid ${palette.primary}20`,
                }}
                className="rounded-xl px-3 py-2.5 flex items-start gap-2"
              >
                <Icon
                  style={{ color: palette.primary }}
                  className="w-4 h-4 shrink-0 mt-0.5"
                />
                <div className="min-w-0">
                  <div
                    style={{ color: palette.primary }}
                    className="text-[9.5px] font-extrabold uppercase tracking-wider"
                  >
                    {meta.label}
                  </div>
                  <div className="text-[10.8px] font-semibold leading-snug mt-0.5">
                    {meta.value || '—'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Photo Gallery */}
        <div className="mb-4">{renderGallery()}</div>

        {/* 2x2 Bento Summary Grid */}
        <div className="grid grid-cols-2 gap-3.5 flex-1 min-h-0">
          {[
            {
              title: titles.objectives,
              content: data.objectives,
              headerBg: palette.primary,
              headerInk: palette.inkOnPrimary,
              isBullet: true,
            },
            {
              title: titles.implementation,
              content: data.implementation,
              headerBg: palette.secondary,
              headerInk: palette.inkOnPrimary,
              isBullet: true,
            },
            {
              title: titles.impact,
              content: data.impact,
              headerBg: palette.accent,
              headerInk: palette.accentInk,
              isBullet: true,
            },
            {
              title: titles.reflection,
              content: data.reflection,
              headerBg: palette.primary,
              headerInk: palette.inkOnPrimary,
              isBullet: false,
            },
          ].map((card, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: palette.surface,
                border: `1.5px solid ${palette.primary}25`,
              }}
              className="rounded-xl overflow-hidden flex flex-col"
            >
              <div
                style={{
                  backgroundColor: card.headerBg,
                  color: card.headerInk,
                }}
                className={`px-4 py-1.5 text-[11.5px] font-extrabold uppercase tracking-wider shrink-0 ${fonts.displayClass}`}
              >
                {card.title}
              </div>
              <div className="p-3.5 flex-1">
                {card.isBullet ? (
                  <BulletList
                    text={card.content}
                    bulletColor={palette.primary}
                    textColor={palette.inkOnSurface}
                    fontSize={10.8}
                    maxItems={4}
                  />
                ) : (
                  <p className="text-[11px] leading-relaxed m-0">
                    {card.content}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Accent Wave / Verification Bar */}
      <div
        style={{
          backgroundColor: palette.surfaceTint,
          borderTop: `3px solid ${palette.primary}`,
        }}
        className="relative z-10 px-7 py-3 flex items-center justify-between text-[11px] shrink-0"
      >
        <div className="flex items-center gap-6">
          <div>
            <span
              style={{
                backgroundColor: palette.primary,
                color: palette.inkOnPrimary,
              }}
              className="px-2 py-0.5 rounded text-[9.5px] font-bold uppercase mr-2"
            >
              {labels.preparedBy}
            </span>
            <span className="font-bold">{data.preparedByName}</span>
            {data.preparedByRole && (
              <span style={{ color: palette.mutedInk }}> · {data.preparedByRole}</span>
            )}
          </div>
          {data.verifiedByName && (
            <div>
              <span
                style={{
                  backgroundColor: palette.accent,
                  color: palette.accentInk,
                }}
                className="px-2 py-0.5 rounded text-[9.5px] font-bold uppercase mr-2"
              >
                {labels.verifiedBy}
              </span>
              <span className="font-bold">{data.verifiedByName}</span>
            </div>
          )}
        </div>
        <div style={{ color: palette.mutedInk }} className="text-[10px] font-medium">
          {data.organizerUnit || data.contactInfo}
        </div>
      </div>
    </div>
  );
};

/**
 * 7. SWISS EDITORIAL
 * Contemporary magazine broadsheet — oversized editorial masthead, razor hairline grid,
 * asymmetric hero photo + supporting strip, pull-quote impact block, Swiss typography.
 */
export const SwissEditorialLayout: React.FC<LayoutRendererProps> = ({
  data,
  theme,
  onEmptyPhotoClick,
}) => {
  const { palette, fontPair, photoFrame } = theme;
  const fonts = getFontClasses(fontPair);
  const labels = OPR_LABELS[data.language];
  const titles = getSectionTitles(data, theme);
  const slots = resolveDisplayPhotoSlots(data.photos, 4);

  const heroPhoto = slots[0];
  const secondaryPhotos = slots.slice(1);

  return (
    <div
      style={{ backgroundColor: palette.surface, color: palette.inkOnSurface }}
      className={`w-[794px] h-[1123px] relative overflow-hidden flex flex-col justify-between px-9 py-8 ${fonts.bodyClass}`}
    >
      {/* Top Color Bar */}
      <div
        style={{ backgroundColor: palette.primary }}
        className="absolute top-0 inset-x-0 h-2"
      />

      <div>
        {/* Editorial Running Header */}
        <div
          style={{ borderBottom: `1px solid ${palette.inkOnSurface}22` }}
          className="flex items-center justify-between pb-3 mb-5 text-[10.5px] font-semibold tracking-wider uppercase"
        >
          <div className="flex items-center gap-3">
            <OrgCrest
              logoUrl={data.logoUrl}
              orgName={data.organizationName}
              palette={palette}
              size={34}
            />
            <span>{data.organizationName}</span>
          </div>
          <div style={{ color: palette.mutedInk }} className="flex items-center gap-3">
            {data.organizerUnit && <span>{data.organizerUnit}</span>}
            <span>/</span>
            <span style={{ color: palette.primary }} className="font-extrabold">
              {data.reportBadge || 'OPR 2026'}
            </span>
          </div>
        </div>

        {/* Display Masthead */}
        <div className="grid grid-cols-12 gap-6 items-end pb-5 mb-5 border-b border-slate-900/15">
          <div className="col-span-8">
            <h1
              style={{ color: palette.inkOnSurface }}
              className={`text-[32px] font-extrabold leading-[1.08] tracking-tight ${fonts.displayClass}`}
            >
              {data.activityTitle}
            </h1>
            {data.subtitle && (
              <p
                style={{ color: palette.mutedInk }}
                className="text-[12.5px] leading-snug mt-2 m-0"
              >
                {data.subtitle}
              </p>
            )}
          </div>

          <div className="col-span-4 space-y-1.5 text-[10.5px] border-l border-slate-900/15 pl-4">
            {[
              { l: labels.date, v: data.date },
              { l: labels.time, v: data.time },
              { l: labels.venue, v: data.venue },
              { l: labels.targetGroup, v: data.targetGroup },
            ]
              .filter((i) => i.v.trim())
              .map((item, idx) => (
                <div key={idx}>
                  <span
                    style={{ color: palette.mutedInk }}
                    className="uppercase tracking-wider text-[9px] font-bold block"
                  >
                    {item.l}
                  </span>
                  <span className="font-semibold leading-tight block">{item.v}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Asymmetric Editorial Photo Showcase */}
        <div className="mb-6">
          {secondaryPhotos.length === 0 ? (
            <div className="h-[290px]">
              <PhotoSlot
                photo={heroPhoto}
                index={0}
                frameStyle={photoFrame === 'framed' ? 'sharp' : photoFrame}
                palette={palette}
                borderColor={`${palette.inkOnSurface}18`}
                className="w-full h-full"
                onEmptyClick={onEmptyPhotoClick}
              />
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-7 h-[270px]">
                <PhotoSlot
                  photo={heroPhoto}
                  index={0}
                  frameStyle={photoFrame === 'framed' ? 'sharp' : photoFrame}
                  palette={palette}
                  borderColor={`${palette.inkOnSurface}18`}
                  className="w-full h-full"
                  onEmptyClick={onEmptyPhotoClick}
                />
              </div>
              <div
                className="col-span-5 grid gap-2.5 h-[270px]"
                style={{
                  gridTemplateColumns:
                    secondaryPhotos.length >= 4 ? 'repeat(2, minmax(0, 1fr))' : '1fr',
                  gridTemplateRows:
                    secondaryPhotos.length === 1
                      ? '1fr'
                      : secondaryPhotos.length === 2
                      ? 'repeat(2, minmax(0, 1fr))'
                      : secondaryPhotos.length === 3
                      ? 'repeat(3, minmax(0, 1fr))'
                      : 'repeat(3, minmax(0, 1fr))',
                }}
              >
                {secondaryPhotos.map((photo, idx) => (
                  <PhotoSlot
                    key={idx + 1}
                    photo={photo}
                    index={idx + 1}
                    frameStyle={photoFrame === 'framed' ? 'sharp' : photoFrame}
                    palette={palette}
                    borderColor={`${palette.inkOnSurface}18`}
                    className={`w-full h-full ${
                      secondaryPhotos.length === 5 && idx === 4 ? 'col-span-2' : ''
                    }`}
                    onEmptyClick={onEmptyPhotoClick}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3-Column Swiss Content Ledger */}
        <div className="grid grid-cols-3 gap-6 mb-5">
          <div>
            <div
              style={{ color: palette.primary }}
              className="font-mono-tabular text-[10px] font-bold mb-1"
            >
              01
            </div>
            <h2
              className={`text-[13.5px] font-extrabold tracking-tight pb-1.5 mb-2 border-b border-slate-900/15 ${fonts.displayClass}`}
            >
              {titles.objectives}
            </h2>
            <BulletList
              text={data.objectives}
              bulletColor={palette.primary}
              textColor={palette.inkOnSurface}
              fontSize={10.8}
              maxItems={4}
            />
          </div>

          <div>
            <div
              style={{ color: palette.primary }}
              className="font-mono-tabular text-[10px] font-bold mb-1"
            >
              02
            </div>
            <h2
              className={`text-[13.5px] font-extrabold tracking-tight pb-1.5 mb-2 border-b border-slate-900/15 ${fonts.displayClass}`}
            >
              {titles.implementation}
            </h2>
            <BulletList
              text={data.implementation}
              bulletColor={palette.accent}
              textColor={palette.inkOnSurface}
              fontSize={10.8}
              maxItems={4}
            />
          </div>

          <div>
            <div
              style={{ color: palette.primary }}
              className="font-mono-tabular text-[10px] font-bold mb-1"
            >
              03
            </div>
            <h2
              className={`text-[13.5px] font-extrabold tracking-tight pb-1.5 mb-2 border-b border-slate-900/15 ${fonts.displayClass}`}
            >
              {titles.impact}
            </h2>
            <BulletList
              text={data.impact}
              bulletColor={palette.primary}
              textColor={palette.inkOnSurface}
              fontSize={10.8}
              maxItems={4}
            />
          </div>
        </div>

        {/* Editorial Reflection Callout */}
        {data.reflection && (
          <div
            style={{
              backgroundColor: palette.surfaceTint,
              borderTop: `2px solid ${palette.primary}`,
            }}
            className="px-5 py-3.5"
          >
            <div
              style={{ color: palette.primary }}
              className={`text-[11px] font-extrabold uppercase tracking-wider mb-1 ${fonts.displayClass}`}
            >
              {titles.reflection}
            </div>
            <p className="text-[11.5px] leading-relaxed m-0">{data.reflection}</p>
          </div>
        )}
      </div>

      {/* Clean Editorial Colophon Footer */}
      <div
        style={{ borderTop: `1px solid ${palette.inkOnSurface}20` }}
        className="pt-4 flex items-end justify-between text-[10.5px]"
      >
        <div className="flex gap-10">
          <div>
            <div
              style={{ color: palette.mutedInk }}
              className="text-[9.5px] uppercase tracking-wider font-semibold"
            >
              {labels.preparedBy}
            </div>
            <div className="font-bold text-[12px] mt-1">{data.preparedByName}</div>
            {data.preparedByRole && (
              <div style={{ color: palette.mutedInk }}>{data.preparedByRole}</div>
            )}
          </div>
          {data.verifiedByName && (
            <div>
              <div
                style={{ color: palette.mutedInk }}
                className="text-[9.5px] uppercase tracking-wider font-semibold"
              >
                {labels.verifiedBy}
              </div>
              <div className="font-bold text-[12px] mt-1">{data.verifiedByName}</div>
              {data.verifiedByRole && (
                <div style={{ color: palette.mutedInk }}>{data.verifiedByRole}</div>
              )}
            </div>
          )}
        </div>
        <div style={{ color: palette.mutedInk }} className="text-right text-[10px]">
          <div>{data.organizationSub}</div>
          {data.contactInfo && <div className="font-medium">{data.contactInfo}</div>}
        </div>
      </div>
    </div>
  );
};

/**
 * 8. ARCHIVAL SPLIT
 * High-contrast two-tone horizontal split — deep dark dramatic upper showcase (masthead + metadata + gallery)
 * transitioning into a luminous white lower half with structured 3-column summary & verification.
 */
export const ArchivalSplitLayout: React.FC<LayoutRendererProps> = ({
  data,
  theme,
  onEmptyPhotoClick,
}) => {
  const { palette, fontPair, photoFrame, pattern } = theme;
  const fonts = getFontClasses(fontPair);
  const labels = OPR_LABELS[data.language];
  const titles = getSectionTitles(data, theme);
  const slots = resolveDisplayPhotoSlots(data.photos, 4);

  return (
    <div
      style={{ backgroundColor: palette.surface, color: palette.inkOnSurface }}
      className={`w-[794px] h-[1123px] relative overflow-hidden flex flex-col ${fonts.bodyClass}`}
    >
      {/* Upper Deep Archival Band */}
      <div
        style={{
          backgroundColor: palette.primary,
          color: palette.inkOnPrimary,
        }}
        className="relative px-8 pt-7 pb-6 shrink-0 overflow-hidden"
      >
        <SvgBackdrop pattern={pattern} color="#FFFFFF" opacity={0.07} />

        <div className="relative z-10">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-3.5">
              <OrgCrest
                logoUrl={data.logoUrl}
                orgName={data.organizationName}
                palette={palette}
                size={52}
                inverted
              />
              <div>
                <div className="text-[12px] font-bold tracking-wide">
                  {data.organizationName}
                </div>
                {data.organizationSub && (
                  <div className="text-[10px] opacity-80 mt-0.5">
                    {data.organizationSub}
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                backgroundColor: palette.accent,
                color: palette.accentInk,
              }}
              className={`px-3.5 py-1.5 rounded-md text-[12px] font-extrabold tracking-wider uppercase ${fonts.displayClass}`}
            >
              {data.reportBadge || 'OPR 2026'}
            </div>
          </div>

          {/* Big Display Title */}
          <h1
            className={`text-[30px] font-extrabold leading-tight tracking-tight mb-2 ${fonts.displayClass}`}
          >
            {data.activityTitle}
          </h1>
          {data.subtitle && (
            <p className="text-[12px] opacity-85 mb-4 m-0 max-w-[620px]">
              {data.subtitle}
            </p>
          )}

          {/* Crisp Metadata Bar */}
          <div
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            className="rounded-xl px-4 py-2.5 mb-5 grid grid-cols-4 gap-3 text-[10.5px]"
          >
            {[
              { label: labels.date, value: data.date },
              { label: labels.time, value: data.time || data.day },
              { label: labels.venue, value: data.venue },
              { label: labels.targetGroup, value: data.targetGroup },
            ].map((item, idx) => (
              <div key={idx} className="min-w-0">
                <div
                  style={{ color: palette.accent }}
                  className="text-[9px] font-bold uppercase tracking-wider"
                >
                  {item.label}
                </div>
                <div className="font-semibold leading-snug mt-0.5 truncate">
                  {item.value || '—'}
                </div>
              </div>
            ))}
          </div>

          {/* Showcase Photo Strip / Grid */}
          <div
            className="grid gap-2.5"
            style={{
              gridTemplateColumns:
                slots.length === 1
                  ? '1fr'
                  : slots.length === 2
                  ? 'repeat(2, 1fr)'
                  : slots.length === 3
                  ? 'repeat(3, 1fr)'
                  : slots.length === 4
                  ? 'repeat(4, 1fr)'
                  : 'repeat(3, 1fr)',
              height: slots.length <= 4 ? 195 : 265,
            }}
          >
            {slots.map((photo, idx) => (
              <PhotoSlot
                key={idx}
                photo={photo}
                index={idx}
                frameStyle={photoFrame}
                palette={palette}
                borderColor="rgba(255,255,255,0.35)"
                className="w-full h-full"
                onEmptyClick={onEmptyPhotoClick}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Accent Divider Line */}
      <div style={{ backgroundColor: palette.accent }} className="h-1.5 shrink-0" />

      {/* Lower Luminous White Report Section */}
      <div className="flex-1 px-8 py-6 flex flex-col justify-between min-h-0">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2
                style={{ color: palette.primary }}
                className={`text-[13.5px] font-extrabold uppercase tracking-wider mb-2 ${fonts.displayClass}`}
              >
                {titles.objectives}
              </h2>
              <BulletList
                text={data.objectives}
                bulletColor={palette.accent}
                textColor={palette.inkOnSurface}
                fontSize={11.2}
                maxItems={4}
              />
            </div>

            <div>
              <h2
                style={{ color: palette.primary }}
                className={`text-[13.5px] font-extrabold uppercase tracking-wider mb-2 ${fonts.displayClass}`}
              >
                {titles.implementation}
              </h2>
              <BulletList
                text={data.implementation}
                bulletColor={palette.primary}
                textColor={palette.inkOnSurface}
                fontSize={11.2}
                maxItems={4}
              />
            </div>
          </div>

          <div
            style={{
              backgroundColor: palette.surfaceTint,
              border: `1px solid ${palette.primary}20`,
            }}
            className="rounded-xl p-4 grid grid-cols-12 gap-5"
          >
            <div className={data.reflection ? 'col-span-7' : 'col-span-12'}>
              <h2
                style={{ color: palette.primary }}
                className={`text-[13px] font-extrabold uppercase tracking-wider mb-1.5 ${fonts.displayClass}`}
              >
                {titles.impact}
              </h2>
              <BulletList
                text={data.impact}
                bulletColor={palette.primary}
                textColor={palette.inkOnSurface}
                fontSize={11}
                maxItems={4}
              />
            </div>

            {data.reflection && (
              <div
                style={{ borderLeft: `1px solid ${palette.primary}25` }}
                className="col-span-5 pl-5"
              >
                <h2
                  style={{ color: palette.primary }}
                  className={`text-[13px] font-extrabold uppercase tracking-wider mb-1.5 ${fonts.displayClass}`}
                >
                  {titles.reflection}
                </h2>
                <p className="text-[11px] leading-relaxed m-0">{data.reflection}</p>
              </div>
            )}
          </div>
        </div>

        {/* Formal Sign-Off Strip */}
        <div className="flex items-end justify-between border-t border-slate-200 pt-4">
          <div className="flex gap-12">
            <div>
              <div
                style={{ color: palette.mutedInk }}
                className="text-[9.5px] uppercase tracking-wider font-semibold"
              >
                {labels.preparedBy}
              </div>
              <div className="text-[12.5px] font-bold mt-4">
                {data.preparedByName}
              </div>
              {data.preparedByRole && (
                <div style={{ color: palette.mutedInk }} className="text-[10.5px]">
                  {data.preparedByRole}
                </div>
              )}
            </div>

            {data.verifiedByName && (
              <div>
                <div
                  style={{ color: palette.mutedInk }}
                  className="text-[9.5px] uppercase tracking-wider font-semibold"
                >
                  {labels.verifiedBy}
                </div>
                <div className="text-[12.5px] font-bold mt-4">
                  {data.verifiedByName}
                </div>
                {data.verifiedByRole && (
                  <div style={{ color: palette.mutedInk }} className="text-[10.5px]">
                    {data.verifiedByRole}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-right text-[10.5px]" style={{ color: palette.mutedInk }}>
            {data.organizerUnit && (
              <div style={{ color: palette.primary }} className="font-bold">
                {data.organizerUnit}
              </div>
            )}
            {data.contactInfo && <div>{data.contactInfo}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
