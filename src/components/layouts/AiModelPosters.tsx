import React from 'react';
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Calculator,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Cog,
  Coins,
  Cpu,
  FileText,
  FlaskConical,
  Globe,
  Heart,
  Lightbulb,
  MapPin,
  Rocket,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react';
import { OprData, OprThemeConfig } from '../../types/opr';
import { AutoFitBox, AutoFitText } from './AutoFitText';
import pastelStickerBg from '../../assets/images/ai_poster_bg_pastel_sticker_1795762550762.jpg';
import emeraldCampusBg from '../../assets/images/ai_poster_bg_emerald_campus_1795762551191.jpg';
import editorialIndigoBg from '../../assets/images/ai_poster_bg_editorial_indigo_1795762552796.jpg';

interface AiPosterProps {
  data: OprData;
  theme: OprThemeConfig;
  onEmptyPhotoClick?: () => void;
}

function parseLines(text: string | undefined, max: number): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[\s•\-*0-9.)]+/, '').trim())
    .filter(Boolean)
    .slice(0, max);
}

function splitHeroYear(rawTitle: string): { main: string; year: string } {
  const cleaned = (rawTitle || 'PROGRAM SEKOLAH 2026').trim();
  const match = cleaned.match(/^(.*?)(\b20\d{2}\b)$/);
  if (match && match[1].trim().length > 0) {
    return { main: match[1].trim(), year: match[2].trim() };
  }
  const words = cleaned.split(/\s+/);
  if (words.length >= 3) {
    return { main: words.slice(0, -1).join(' '), year: words[words.length - 1] };
  }
  return { main: cleaned, year: '' };
}

function renderPillarIcon(iconKey: string, className = 'w-8 h-8') {
  switch (iconKey) {
    case 'book':
      return <BookOpen className={className} />;
    case 'flask':
      return <FlaskConical className={className} />;
    case 'calculator':
      return <Calculator className={className} />;
    case 'coins':
      return <Coins className={className} />;
    case 'cpu':
      return <Cpu className={className} />;
    case 'trophy':
      return <Trophy className={className} />;
    case 'heart':
      return <Heart className={className} />;
    case 'globe':
      return <Globe className={className} />;
    case 'shield':
      return <Shield className={className} />;
    case 'rocket':
      return <Rocket className={className} />;
    case 'users':
      return <Users className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

const CrestFallback: React.FC<{ ringColor?: string }> = ({ ringColor = '#FACC15' }) => (
  <svg viewBox="0 0 76 76" className="w-full h-full" aria-hidden="true">
    <defs>
      <linearGradient id="aiPosterCrest" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1D4ED8" />
        <stop offset="100%" stopColor="#0F2C67" />
      </linearGradient>
    </defs>
    <circle cx="38" cy="38" r="34" fill="url(#aiPosterCrest)" stroke={ringColor} strokeWidth="3.5" />
    <circle cx="38" cy="38" r="25" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5" />
    <path
      d="M24 38 C29 33.5, 34.5 34.5, 38 38.5 C41.5 34.5, 47 33.5, 52 38 L52 50 C47 47, 41.5 48, 38 51 C34.5 48, 29 47, 24 50 Z"
      fill="#FACC15"
      stroke="#1E3A8A"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <polygon points="38,18 40.5,24.5 47.5,24.8 42,29 44,35.5 38,31.6 32,35.5 34,29 28.5,24.8 35.5,24.5" fill="#EC4899" />
  </svg>
);

const Mini3DBooksStack: React.FC<{ className?: string }> = ({ className = 'w-[80px] h-[58px]' }) => (
  <svg viewBox="0 0 92 66" className={className} aria-hidden="true">
    <ellipse cx="46" cy="59" rx="34" ry="4" fill="rgba(15,23,42,0.22)" />
    <rect x="10" y="44" width="66" height="12" rx="3.5" fill="#2563EB" stroke="#0F172A" strokeWidth="1.6" />
    <rect x="16" y="48" width="54" height="3.5" rx="1.5" fill="#DBEAFE" />
    <rect x="14" y="32" width="60" height="12" rx="3.5" fill="#10B981" stroke="#0F172A" strokeWidth="1.6" />
    <rect x="20" y="36" width="48" height="3.5" rx="1.5" fill="#D1FAE5" />
    <rect x="11" y="20" width="62" height="12" rx="3.5" fill="#F43F5E" stroke="#0F172A" strokeWidth="1.6" />
    <rect x="17" y="24" width="50" height="3.5" rx="1.5" fill="#FFE4E6" />
    <path d="M72 16 L76 4 L80 16 Z" fill="#FACC15" stroke="#0F172A" strokeWidth="1.3" />
    <rect x="79" y="7" width="4.5" height="14" rx="1.2" fill="#EF4444" stroke="#0F172A" strokeWidth="1.3" />
    <rect x="68" y="18" width="18" height="20" rx="4" fill="#06B6D4" stroke="#0F172A" strokeWidth="1.5" />
    <rect x="68" y="22.5" width="18" height="4" fill="#FACC15" />
  </svg>
);

const Mini3DLightbulb: React.FC<{ className?: string }> = ({ className = 'w-[56px] h-[54px]' }) => (
  <svg viewBox="0 0 68 62" className={className} aria-hidden="true">
    <defs>
      <radialGradient id="aiBulbBody" cx="38%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#FEF9C3" />
        <stop offset="60%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#EA580C" />
      </radialGradient>
    </defs>
    <g stroke="#FDE047" strokeWidth="2.4" strokeLinecap="round">
      <line x1="34" y1="3" x2="34" y2="9" />
      <line x1="15" y1="10" x2="19.5" y2="14.5" />
      <line x1="53" y1="10" x2="48.5" y2="14.5" />
      <line x1="9" y1="26" x2="15" y2="26" />
      <line x1="59" y1="26" x2="53" y2="26" />
    </g>
    <path
      d="M21.5 26 C21.5 16, 46.5 16, 46.5 26 C46.5 31.8, 42.2 35, 40.5 40.2 L27.5 40.2 C25.8 35, 21.5 31.8, 21.5 26 Z"
      fill="url(#aiBulbBody)"
      stroke="#FFFFFF"
      strokeWidth="2"
    />
    <ellipse cx="29" cy="22.5" rx="3.8" ry="2" fill="#FFFFFF" fillOpacity="0.72" transform="rotate(-24 29 22.5)" />
    <rect x="27.5" y="41" width="13" height="5.5" rx="2" fill="#E2E8F0" stroke="#0B2358" strokeWidth="1.4" />
    <rect x="30" y="47" width="8" height="4" rx="1.5" fill="#94A3B8" />
  </svg>
);

/* ============================================================================
 * VARIANT 2: AI STICKER CLOUD INFOGRAPHIC (ChatGPT / SMK Sayong Inspired)
 * ============================================================================ */
export const AiStickerCloudPoster: React.FC<AiPosterProps> = ({
  data,
  theme,
  onEmptyPhotoClick,
}) => {
  const poster = theme.aiPoster;
  const isEn = data.language === 'en';
  const schoolName = (data.organizationName || 'SEKOLAH KEBANGSAAN MALAYSIA').toUpperCase();
  const schoolMotto =
    poster?.schoolMotto || (isEn ? 'Learn • Discipline • Excel' : 'Ilmu • Disiplin • Jaya');
  const heroBadge = poster?.heroBadge || 'OPR';
  const { main: heroMain, year: heroYear } = splitHeroYear(
    poster?.heroTitle || data.activityTitle || 'Program Kecemerlangan 2026'
  );

  const pillarsTitle =
    poster?.pillarsTitle || (isEn ? '4 Core Highlights' : '4 Teras Utama');
  const defaultPillars = isEn
    ? [
        { label: 'Literacy', icon: 'book' },
        { label: 'Innovation', icon: 'flask' },
        { label: 'Numeracy', icon: 'calculator' },
        { label: 'Leadership', icon: 'trophy' },
      ]
    : [
        { label: 'Bahasa', icon: 'book' },
        { label: 'Saintifik', icon: 'flask' },
        { label: 'Matematik', icon: 'calculator' },
        { label: 'Kewangan', icon: 'coins' },
      ];
  const pillars = poster?.pillars?.length === 4 ? poster.pillars : defaultPillars;

  const objectives = poster?.objectives?.length
    ? poster.objectives.slice(0, 3)
    : parseLines(data.objectives, 3);
  const impacts = poster?.impacts?.length
    ? poster.impacts.slice(0, 2).map((i) => `${i.leadVerb} ${i.detail}`)
    : parseLines(data.impact, 2);

  const combinedPoints = [
    ...(objectives.length ? objectives : [
      isEn
        ? 'Strengthen higher-order thinking and practical digital competency.'
        : 'Mengukur keberkesanan pembelajaran melalui kemahiran berfikir aras tinggi.',
      isEn
        ? 'Prepare learners for structured school and national benchmarks.'
        : 'Menyediakan murid bagi menghadapi pentaksiran bertaraf kebangsaan.',
    ]),
    ...impacts.slice(0, Math.max(0, 3 - objectives.length)),
  ].slice(0, 3);

  const closingSlogan =
    poster?.closingSlogan ||
    (isEn
      ? 'Together Building Knowledgeable and Future-Ready Learners'
      : 'Bersama Membina Generasi Berilmu, Berakhlak dan Berdaya Saing');

  const pillarStyles = [
    { bg: '#FFE4EC', circleFrom: '#F43F5E', circleTo: '#BE123C', text: '#9F1239' },
    { bg: '#DCFCE7', circleFrom: '#22C55E', circleTo: '#15803D', text: '#166534' },
    { bg: '#DBEAFE', circleFrom: '#0EA5E9', circleTo: '#1D4ED8', text: '#1E3A8A' },
    { bg: '#F3E8FF', circleFrom: '#A855F7', circleTo: '#6D28D9', text: '#581C87' },
  ];

  const stripColors = [
    { bg: 'linear-gradient(90deg, #DBEAFE 0%, #EFF6FF 100%)', numFrom: '#0EA5E9', numTo: '#1D4ED8' },
    { bg: 'linear-gradient(90deg, #F3E8FF 0%, #FAF5FF 100%)', numFrom: '#A855F7', numTo: '#6D28D9' },
    { bg: 'linear-gradient(90deg, #DCFCE7 0%, #F0FDF4 100%)', numFrom: '#10B981', numTo: '#047857' },
  ];

  const photoSlots = data.photos.length >= 3 ? [0, 1, 2] : [0, 1];
  const watchKey = `sticker|${schoolName}|${heroMain}|${combinedPoints.join('|')}|${closingSlogan}`;

  return (
    <div className="relative w-[794px] h-[1123px] overflow-hidden flex flex-col select-text bg-[#EAF6FF]">
      {/* Real AI-generated illustrated pastel sky + shard + navy wave poster canvas */}
      <img
        src={pastelStickerBg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
      />

      {/* Top Illustrated Header Row */}
      <header className="relative z-10 px-7 pt-5 pb-1 shrink-0">
        <div className="flex items-start justify-between gap-3">
          {/* Crest */}
          <div className="w-[82px] h-[82px] rounded-full bg-white p-1.5 shadow-[0_8px_20px_rgba(12,45,107,0.22)] border-[3px] border-white shrink-0 flex items-center justify-center">
            {data.logoUrl ? (
              <img
                src={data.logoUrl}
                alt="School Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded-full"
              />
            ) : (
              <CrestFallback />
            )}
          </div>

          {/* Center Stacked Bold School Name + Cursive Motto */}
          <div className="flex-1 min-w-0 flex flex-col items-center text-center pt-0.5">
            <AutoFitText
              as="h2"
              maxFontSize={24}
              minFontSize={13}
              maxHeight={56}
              className="w-full font-poster-heading font-bold uppercase tracking-tight leading-[1.06] text-[#0C2D6B] break-words"
              style={{ textShadow: '0 2px 0 rgba(255,255,255,0.95)' }}
            >
              {schoolName}
            </AutoFitText>
            <AutoFitText
              as="p"
              maxFontSize={19}
              minFontSize={12}
              singleLine
              className="w-full font-poster-cursive font-bold text-[#1E3A8A] mt-0.5 m-0"
            >
              {schoolMotto}
            </AutoFitText>
          </div>

          {/* Top Right 3D Books & Pencil Cup */}
          <div className="w-[88px] shrink-0 flex justify-end">
            <Mini3DBooksStack className="w-[84px] h-[64px]" />
          </div>
        </div>

        {/* Giant Chunky 3D Sticker-Outlined Yellow Brushstroke Hero Banner */}
        <div className="relative mt-2.5 flex items-center justify-center">
          <div className="relative w-full max-w-[710px] min-h-[120px] px-7 py-3 flex items-center justify-center gap-4">
            {/* Yellow paint-brush splash SVG behind hero */}
            <svg
              viewBox="0 0 720 132"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
              aria-hidden="true"
            >
              <path
                d="M26,24 C150,4 360,2 560,12 C648,16 698,10 712,32 C724,54 716,96 696,114 C600,130 390,132 184,126 C92,123 28,125 14,102 C2,78 8,36 26,24 Z"
                fill="#FACC15"
              />
              <path
                d="M18,38 C98,20 260,16 470,22 C595,25 685,22 708,42 C718,56 712,92 692,106 C600,120 385,122 175,116 C88,113 30,114 14,94 C4,78 6,48 18,38 Z"
                fill="#FDE047"
              />
              {/* Energy burst ink marks */}
              <g stroke="#0C2D6B" strokeWidth="4" strokeLinecap="round">
                <line x1="-2" y1="42" x2="12" y2="48" />
                <line x1="-6" y1="66" x2="10" y2="66" />
                <line x1="0" y1="88" x2="14" y2="82" />
                <line x1="722" y1="42" x2="708" y2="48" />
                <line x1="726" y1="66" x2="710" y2="66" />
                <line x1="720" y1="88" x2="706" y2="82" />
              </g>
            </svg>

            {/* Chunky White-Sticker Left Badge ("OPR") */}
            <div
              className="relative z-10 shrink-0 px-4 py-2 rounded-2xl bg-[#0C2D6B] border-[5px] border-white -rotate-[3deg]"
              style={{
                boxShadow: '0 8px 18px rgba(12,45,107,0.3)',
              }}
            >
              <span className="font-poster-heading text-[42px] font-bold leading-none tracking-tight text-white block">
                {heroBadge}
              </span>
            </div>

            {/* White-Sticker Bubbly Title Pill */}
            <div
              className="relative z-10 flex-1 min-w-0 bg-white rounded-3xl px-5 py-2.5 border-[4px] border-[#0C2D6B]/10 shadow-[0_8px_18px_rgba(12,45,107,0.16)]"
            >
              <AutoFitText
                as="h1"
                maxFontSize={31}
                minFontSize={16}
                maxHeight={82}
                className="w-full font-poster-heading font-bold leading-[1.08] tracking-tight text-[#0C2D6B] break-words"
              >
                <span>{heroMain}</span>
                {heroYear && (
                  <>
                    {' '}
                    <span
                      className="inline-block"
                      style={{
                        color: '#E11D74',
                        textShadow: '0 2px 0 rgba(255,255,255,0.9)',
                      }}
                    >
                      {heroYear}
                    </span>
                  </>
                )}
              </AutoFitText>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-8 pt-2.5 flex-1 flex flex-col gap-3 min-h-0">
        {/* 2 Large Pastel Rounded Meta Boxes (Tarikh & Sasaran/Tempat) */}
        <div className="grid grid-cols-2 gap-4 shrink-0">
          <div className="rounded-2xl bg-[#FEF9C3]/95 border-[2.5px] border-[#0C2D6B]/75 px-4 py-2.5 flex items-center gap-3.5 shadow-[0_6px_14px_rgba(12,45,107,0.12)]">
            <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#0C2D6B] flex items-center justify-center shrink-0 shadow-xs">
              <Calendar className="w-7 h-7 text-[#E11D48]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="inline-block px-3 py-0.5 rounded-full bg-[#0C2D6B] text-white font-poster-heading text-[11px] font-bold tracking-wide">
                {isEn ? 'Date & Time' : 'Tarikh & Masa'}
              </div>
              <div className="font-poster-heading text-[13.5px] font-bold text-[#0C2D6B] leading-tight mt-1 truncate">
                {data.date || '—'}
              </div>
              {data.time && (
                <div className="text-[11px] font-semibold text-[#1E40AF] truncate">
                  {data.time}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-[#E0F2FE]/95 border-[2.5px] border-[#0C2D6B]/75 px-4 py-2.5 flex items-center gap-3.5 shadow-[0_6px_14px_rgba(12,45,107,0.12)]">
            <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#0C2D6B] flex items-center justify-center shrink-0 shadow-xs">
              <Users className="w-7 h-7 text-[#1D4ED8]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="inline-block px-3 py-0.5 rounded-full bg-[#1D4ED8] text-white font-poster-heading text-[11px] font-bold tracking-wide">
                {isEn ? 'Participants & Venue' : 'Pelajar Terlibat'}
              </div>
              <div className="font-poster-heading text-[13.5px] font-bold text-[#0C2D6B] leading-tight mt-1 truncate">
                {data.targetGroup || '—'}
              </div>
              {data.venue && (
                <div className="text-[11px] font-semibold text-[#1E40AF] truncate">
                  {data.venue}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Brushstroke Section Title + 4 Colorful Illustrated Pillar Tiles */}
        <div className="shrink-0">
          <div className="flex items-center justify-center gap-2.5 mb-2.5">
            <span className="h-1 w-6 rounded-full bg-[#FACC15]" />
            <div className="px-6 py-1 rounded-xl bg-[#0C2D6B] text-white font-poster-heading text-[16px] font-bold tracking-wide shadow-[0_4px_12px_rgba(12,45,107,0.24)] -rotate-[0.8deg]">
              {pillarsTitle}
            </div>
            <span className="h-1 w-6 rounded-full bg-[#FACC15]" />
          </div>

          <div className="grid grid-cols-4 gap-3.5">
            {pillars.map((pillar, idx) => {
              const st = pillarStyles[idx % pillarStyles.length];
              return (
                <div
                  key={idx}
                  className="rounded-3xl p-3 flex flex-col items-center justify-center text-center shadow-[0_8px_18px_rgba(15,23,42,0.1)] border-[3px] border-white"
                  style={{ backgroundColor: st.bg }}
                >
                  <div
                    className="w-[62px] h-[62px] rounded-full border-[3.5px] border-white flex items-center justify-center text-white shadow-[0_6px_14px_rgba(15,23,42,0.2)] mb-2"
                    style={{
                      background: `linear-gradient(145deg, ${st.circleFrom} 0%, ${st.circleTo} 100%)`,
                    }}
                  >
                    {renderPillarIcon(pillar.icon, 'w-7 h-7')}
                  </div>
                  <AutoFitText
                    as="span"
                    maxFontSize={15}
                    minFontSize={10.5}
                    singleLine
                    className="w-full font-poster-heading font-bold text-center leading-tight"
                    style={{ color: st.text }}
                  >
                    {pillar.label}
                  </AutoFitText>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full-Width Cream Illustrated Card with Target Badge & Numbered Paint Strips */}
        <div className="relative rounded-3xl bg-[#FFFDF2]/95 border-[2.5px] border-[#0C2D6B]/60 px-5 pt-4 pb-3.5 shadow-[0_10px_22px_rgba(12,45,107,0.12)] flex-1 min-h-0 flex flex-col">
          {/* Overlapping Target Icon + Yellow Brush Header */}
          <div className="flex items-center gap-3 -mt-7 mb-2.5 shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FACC15] to-[#F59E0B] border-[3px] border-white shadow-[0_6px_14px_rgba(12,45,107,0.24)] flex items-center justify-center text-[#0C2D6B] shrink-0">
              <Target className="w-7 h-7" />
            </div>
            <div className="px-5 py-1.5 rounded-full bg-[#FDE047] border-2 border-white shadow-sm">
              <span className="font-poster-heading text-[15px] font-bold text-[#0C2D6B]">
                {isEn ? 'Program Objectives & Key Impact:' : 'Objektif & Fokus Pelaksanaan:'}
              </span>
            </div>
          </div>

          <AutoFitBox watchKey={watchKey} className="flex-1 min-h-0 overflow-hidden">
            <div className="space-y-2.5">
              {combinedPoints.map((pt, idx) => {
                const sc = stripColors[idx % stripColors.length];
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 rounded-2xl px-3.5 py-2 border border-white/90 shadow-xs"
                    style={{ background: sc.bg }}
                  >
                    <div
                      className="w-9 h-9 rounded-full border-[2.5px] border-white text-white font-poster-heading text-[18px] font-bold flex items-center justify-center shrink-0 shadow-md"
                      style={{
                        background: `linear-gradient(145deg, ${sc.numFrom} 0%, ${sc.numTo} 100%)`,
                      }}
                    >
                      {idx + 1}
                    </div>
                    <p className="text-[12.5px] font-semibold text-[#0F2557] leading-[1.35] m-0 break-words">
                      {pt}
                    </p>
                  </div>
                );
              })}
            </div>
          </AutoFitBox>
        </div>

        {/* Tilted White-Bordered Photo Gallery Row */}
        <div
          className={`grid gap-4 h-[196px] shrink-0 ${
            photoSlots.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
          }`}
        >
          {photoSlots.map((slotIdx) => {
            const photo = data.photos[slotIdx];
            const tilt = slotIdx % 2 === 0 ? '-rotate-[1.1deg]' : 'rotate-[1.1deg]';
            return (
              <div
                key={slotIdx}
                className={`relative rounded-2xl overflow-hidden bg-white border-[5px] border-white shadow-[0_12px_24px_rgba(12,45,107,0.24)] ${tilt}`}
              >
                {photo ? (
                  <img
                    src={photo.dataUrl}
                    alt={photo.caption || `Activity ${slotIdx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <button
                    type="button"
                    data-empty-slot="true"
                    onClick={onEmptyPhotoClick}
                    className="print-hide-empty w-full h-full flex flex-col items-center justify-center gap-1.5 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1D4ED8] transition-colors cursor-pointer"
                  >
                    <Camera className="w-6 h-6" />
                    <span className="font-poster-heading text-[11px] font-bold">
                      {isEn ? `Upload Photo ${slotIdx + 1}` : `Muat Naik Gambar ${slotIdx + 1}`}
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Navy Wave Footer Zone overlaying generated poster wave */}
      <footer className="relative z-10 h-[84px] px-5 pt-4 pb-2 flex items-center justify-between gap-3 shrink-0">
        <Mini3DBooksStack className="w-[74px] h-[54px] -mt-3 shrink-0" />
        <div className="flex-1 min-w-0 text-center">
          <AutoFitText
            as="p"
            maxFontSize={18}
            minFontSize={11.5}
            singleLine
            className="w-full font-poster-heading font-bold text-white tracking-wide m-0"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.45)' }}
          >
            {closingSlogan}
          </AutoFitText>
        </div>
        <Mini3DLightbulb className="w-[56px] h-[54px] -mt-3 shrink-0" />
      </footer>
    </div>
  );
};

/* ============================================================================
 * VARIANT 3: AI EMERALD CAMPUS 3-COLUMN (Gemini / SMK Tun Perak Inspired)
 * ============================================================================ */
export const AiCampusTriColumnPoster: React.FC<AiPosterProps> = ({
  data,
  theme,
  onEmptyPhotoClick,
}) => {
  const poster = theme.aiPoster;
  const isEn = data.language === 'en';
  const schoolName = (data.organizationName || 'SEKOLAH MENENGAH KEBANGSAAN').toUpperCase();
  const schoolMotto =
    poster?.schoolMotto || (isEn ? 'Learn • Strive • Excel' : 'Belajar • Usaha • Jaya');
  const { main: heroMain, year: heroYear } = splitHeroYear(
    poster?.heroTitle || data.activityTitle || 'Pentaksiran Kompetensi dan Literasi 2026'
  );

  const objectives = poster?.objectives?.length
    ? poster.objectives.slice(0, 4)
    : parseLines(data.objectives, 4);
  const activities = poster?.activities?.length
    ? poster.activities.slice(0, 4).map((a) => `${a.title}: ${a.description}`)
    : parseLines(data.implementation, 4);
  const impacts = poster?.impacts?.length
    ? poster.impacts.slice(0, 4).map((i) => `${i.leadVerb} ${i.detail}`)
    : parseLines(data.impact, 4);
  const recommendations = poster?.recommendations?.length
    ? poster.recommendations.slice(0, 4)
    : parseLines(data.reflection, 4);

  const summaryText =
    poster?.summaryText ||
    data.reflection ||
    (isEn
      ? 'This program provided meaningful hands-on digital experience and strengthened collaborative learning across all participating cohorts.'
      : 'Pelaksanaan program ini telah memberikan pengalaman bermakna kepada murid serta membantu pengumpulan data pencapaian secara lebih sistematik.');

  const outcomeText =
    poster?.outcomeText ||
    (isEn
      ? 'Successfully executed according to schedule with full participation and measurable student engagement.'
      : 'Pelaksanaan program berjaya dijalankan secara teratur melibatkan semua kumpulan sasaran dalam tempoh yang ditetapkan.');

  const photoSlots = data.photos.length >= 4 ? [0, 1, 2, 3, 4, 5].slice(0, Math.max(3, data.photos.length)) : [0, 1, 2];
  const watchKey = `campus|${heroMain}|${objectives.join('|')}|${activities.join('|')}|${impacts.join('|')}|${summaryText}`;

  return (
    <div className="relative w-[794px] h-[1123px] overflow-hidden flex flex-col select-text bg-[#F2FBF6]">
      {/* Real AI-generated sunlit emerald campus + gold organic swoosh backdrop */}
      <img
        src={emeraldCampusBg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
      />
      {/* Clean soft translucent veil over header center for crisp WCAG contrast */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[196px] pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.68) 65%, rgba(255,255,255,0) 100%)',
        }}
      />

      {/* Sunlit Campus Hero Header */}
      <header className="relative z-10 px-6 pt-4 pb-2 shrink-0 flex items-center gap-4">
        {/* School Crest with Golden Laurel Aura */}
        <div className="w-[104px] h-[104px] rounded-full bg-white p-2 border-[4px] border-[#FACC15] shadow-[0_10px_24px_rgba(6,95,70,0.26)] shrink-0 flex items-center justify-center">
          {data.logoUrl ? (
            <img
              src={data.logoUrl}
              alt="School Crest"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-full"
            />
          ) : (
            <CrestFallback ringColor="#10B981" />
          )}
        </div>

        {/* Center-Right Bold Emerald Stacked Typography + Gold Highlight Ribbon */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-poster-heading text-[11px] font-bold tracking-[0.22em] uppercase text-[#065F46]">
              ONE PAGE REPORT (OPR)
            </span>
            <span className="text-[10.5px] font-bold text-[#047857] bg-white/90 px-2.5 py-0.5 rounded-md border border-[#10B981]/30 truncate max-w-[240px]">
              {schoolName}
            </span>
          </div>

          <div className="flex items-end gap-2 mt-1">
            <div className="flex-1 min-w-0">
              <AutoFitText
                as="h1"
                maxFontSize={30}
                minFontSize={16}
                maxHeight={56}
                className="w-full font-display-oswald font-bold uppercase tracking-tight leading-[1.02] text-[#054A37] break-words"
                style={{ textShadow: '0 2px 0 rgba(255,255,255,0.92)' }}
              >
                {heroMain}
              </AutoFitText>
              <div className="inline-block mt-1 px-3 py-0.5 bg-[#FACC15] text-[#064E3B] font-poster-heading text-[11.5px] font-bold tracking-wide rounded-xs shadow-xs max-w-full truncate">
                {data.subtitle || data.organizerUnit || schoolName}
              </div>
            </div>
            {heroYear && (
              <span
                className="font-poster-cursive text-[46px] font-bold leading-none text-[#065F46] shrink-0 -rotate-[6deg] pr-1"
                style={{ textShadow: '0 2px 0 #FFFFFF, 0 4px 10px rgba(6,95,70,0.2)' }}
              >
                {heroYear}
              </span>
            )}
          </div>

          <p className="font-poster-cursive text-[14px] font-bold text-[#065F46] mt-1 mb-0 truncate">
            “{poster?.closingSlogan || schoolMotto}”
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pt-1.5 pb-4 flex-1 flex flex-col gap-3 min-h-0">
        {/* Floating White 4-Icon Meta Bar */}
        <div className="rounded-2xl bg-white/95 border border-[#10B981]/30 shadow-[0_6px_18px_rgba(6,95,70,0.12)] px-4 py-2 grid grid-cols-4 divide-x divide-[#FACC15]/70 shrink-0">
          {[
            { icon: <Calendar className="w-5 h-5 text-[#059669]" />, label: isEn ? 'DATE' : 'TARIKH', val: data.date || '—' },
            { icon: <Clock className="w-5 h-5 text-[#059669]" />, label: isEn ? 'TIME' : 'MASA', val: data.time || '—' },
            { icon: <MapPin className="w-5 h-5 text-[#059669]" />, label: isEn ? 'VENUE' : 'TEMPAT', val: data.venue || '—' },
            { icon: <Users className="w-5 h-5 text-[#059669]" />, label: isEn ? 'TARGET' : 'SASARAN', val: data.targetGroup || '—' },
          ].map((meta) => (
            <div key={meta.label} className="px-2.5 flex items-center gap-2 min-w-0">
              <div className="shrink-0">{meta.icon}</div>
              <div className="min-w-0">
                <div className="text-[8.5px] font-extrabold tracking-wider text-[#065F46] uppercase">
                  {meta.label}
                </div>
                <div className="text-[10px] font-bold text-slate-800 leading-tight truncate">
                  {meta.val}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3 Equal Infographic Columns: Objektif | Pelaksanaan | Impak Program */}
        <div className="grid grid-cols-3 gap-3 h-[268px] shrink-0">
          {/* Column 1: OBJEKTIF */}
          <div className="rounded-2xl bg-white/95 border border-[#10B981]/35 shadow-[0_8px_18px_rgba(6,95,70,0.1)] p-3 flex flex-col min-h-0">
            <div className="flex items-center gap-2 -mt-1 mb-2 shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#047857] to-[#064E3B] border-2 border-[#FACC15] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Target className="w-4 h-4" />
              </div>
              <div className="flex-1 px-3 py-1 rounded-r-full bg-gradient-to-r from-[#065F46] to-[#10B981] text-white font-poster-heading text-[11px] font-bold uppercase tracking-wider truncate">
                {isEn ? 'OBJECTIVES' : 'OBJEKTIF'}
              </div>
            </div>
            <AutoFitBox watchKey={watchKey} className="flex-1 min-h-0 overflow-hidden">
              <ul className="space-y-1.5">
                {objectives.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[10px] leading-[1.32] font-medium text-slate-800">
                    <span className="w-4.5 h-4.5 rounded-full bg-[#10B981] text-white font-bold text-[9.5px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="break-words min-w-0">{item}</span>
                  </li>
                ))}
              </ul>
            </AutoFitBox>
          </div>

          {/* Column 2: PELAKSANAAN */}
          <div className="rounded-2xl bg-white/95 border border-[#F59E0B]/40 shadow-[0_8px_18px_rgba(6,95,70,0.1)] p-3 flex flex-col min-h-0">
            <div className="flex items-center gap-2 -mt-1 mb-2 shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] border-2 border-white text-white flex items-center justify-center shrink-0 shadow-sm">
                <Cog className="w-4 h-4" />
              </div>
              <div className="flex-1 px-3 py-1 rounded-r-full bg-gradient-to-r from-[#047857] to-[#0D9488] text-white font-poster-heading text-[11px] font-bold uppercase tracking-wider truncate">
                {isEn ? 'IMPLEMENTATION' : 'PELAKSANAAN'}
              </div>
            </div>
            <AutoFitBox watchKey={watchKey} className="flex-1 min-h-0 overflow-hidden">
              <ul className="space-y-1.5">
                {activities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[10px] leading-[1.32] font-medium text-slate-800">
                    <span className="w-4.5 h-4.5 rounded-full bg-[#FACC15] text-[#064E3B] font-extrabold text-[9.5px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="break-words min-w-0">{item}</span>
                  </li>
                ))}
              </ul>
            </AutoFitBox>
          </div>

          {/* Column 3: IMPAK PROGRAM */}
          <div className="rounded-2xl bg-white/95 border border-[#10B981]/35 shadow-[0_8px_18px_rgba(6,95,70,0.1)] p-3 flex flex-col min-h-0">
            <div className="flex items-center gap-2 -mt-1 mb-2 shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#065F46] to-[#059669] border-2 border-[#FACC15] text-white flex items-center justify-center shrink-0 shadow-sm">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="flex-1 px-3 py-1 rounded-r-full bg-gradient-to-r from-[#064E3B] to-[#059669] text-white font-poster-heading text-[11px] font-bold uppercase tracking-wider truncate">
                {isEn ? 'IMPACT' : 'IMPAK PROGRAM'}
              </div>
            </div>
            <AutoFitBox watchKey={watchKey} className="flex-1 min-h-0 overflow-hidden">
              <ul className="space-y-1.5">
                {impacts.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[10px] leading-[1.32] font-medium text-slate-800">
                    <span className="w-4.5 h-4.5 rounded-full bg-[#059669] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                    <span className="break-words min-w-0">{item}</span>
                  </li>
                ))}
              </ul>
            </AutoFitBox>
          </div>
        </div>

        {/* Full-Width Dokumentasi Aktiviti Photo Gallery */}
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex items-center gap-2 mb-2 shrink-0">
            <div className="w-7 h-7 rounded-full bg-[#064E3B] border-2 border-[#FACC15] text-white flex items-center justify-center shrink-0">
              <Camera className="w-3.5 h-3.5" />
            </div>
            <div className="px-4 py-1 rounded-r-full bg-gradient-to-r from-[#064E3B] to-[#059669] text-white font-poster-heading text-[11px] font-bold uppercase tracking-wider">
              {isEn ? 'ACTIVITY DOCUMENTATION' : 'DOKUMENTASI AKTIVITI'}
            </div>
          </div>

          <div
            className={`grid gap-2.5 flex-1 min-h-0 ${
              photoSlots.length > 3 ? 'grid-cols-3 grid-rows-2' : 'grid-cols-3 grid-rows-1'
            }`}
          >
            {photoSlots.map((slotIdx) => {
              const photo = data.photos[slotIdx];
              return (
                <div
                  key={slotIdx}
                  className="relative rounded-xl overflow-hidden bg-white border-[3px] border-white shadow-[0_6px_14px_rgba(6,95,70,0.18)]"
                >
                  {photo ? (
                    <img
                      src={photo.dataUrl}
                      alt={photo.caption || `Documentation ${slotIdx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <button
                      type="button"
                      data-empty-slot="true"
                      onClick={onEmptyPhotoClick}
                      className="print-hide-empty w-full h-full flex flex-col items-center justify-center gap-1 bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#047857] transition-colors cursor-pointer"
                    >
                      <Camera className="w-5 h-5" />
                      <span className="text-[10px] font-bold">
                        {isEn ? `Photo ${slotIdx + 1}` : `Gambar ${slotIdx + 1}`}
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom 3-Card Summary Row: Cadangan | Rumusan | Hasil */}
        <div className="grid grid-cols-12 gap-3 h-[196px] shrink-0 pb-3">
          {/* Card A: Cadangan Penambahbaikan */}
          <div className="col-span-5 rounded-2xl bg-white/95 border border-[#F59E0B]/45 shadow-[0_8px_16px_rgba(6,95,70,0.12)] p-3 flex flex-col min-h-0">
            <div className="flex items-center gap-1.5 mb-1.5 shrink-0">
              <div className="w-7 h-7 rounded-full bg-[#FACC15] text-[#064E3B] flex items-center justify-center shrink-0">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div className="flex-1 px-2.5 py-0.5 rounded-r-full bg-gradient-to-r from-[#FACC15] to-[#FDE047] text-[#064E3B] font-poster-heading text-[10px] font-bold uppercase truncate">
                {isEn ? 'RECOMMENDATIONS' : 'CADANGAN PENAMBAHBAIKAN'}
              </div>
            </div>
            <AutoFitBox watchKey={watchKey} className="flex-1 min-h-0 overflow-hidden">
              <ul className="space-y-1">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[9.5px] leading-[1.3] font-medium text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                    <span className="break-words min-w-0">{rec}</span>
                  </li>
                ))}
              </ul>
            </AutoFitBox>
          </div>

          {/* Card B: Rumusan */}
          <div className="col-span-4 rounded-2xl bg-white/95 border border-[#10B981]/40 shadow-[0_8px_16px_rgba(6,95,70,0.12)] p-3 flex flex-col min-h-0">
            <div className="flex items-center gap-1.5 mb-1.5 shrink-0">
              <div className="w-7 h-7 rounded-full bg-[#065F46] text-white flex items-center justify-center shrink-0">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 px-2.5 py-0.5 rounded-r-full bg-gradient-to-r from-[#065F46] to-[#10B981] text-white font-poster-heading text-[10px] font-bold uppercase truncate">
                {isEn ? 'SUMMARY' : 'RUMUSAN'}
              </div>
            </div>
            <AutoFitBox watchKey={watchKey} className="flex-1 min-h-0 overflow-hidden">
              <p className="text-[9.8px] leading-[1.38] font-medium text-slate-700 m-0 break-words">
                {summaryText}
              </p>
            </AutoFitBox>
          </div>

          {/* Card C: Hasil + Signature */}
          <div className="col-span-3 rounded-2xl bg-white/95 border border-[#F59E0B]/45 shadow-[0_8px_16px_rgba(6,95,70,0.12)] p-3 flex flex-col min-h-0">
            <div className="flex items-center gap-1.5 mb-1.5 shrink-0">
              <div className="w-7 h-7 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shrink-0">
                <Trophy className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 px-2.5 py-0.5 rounded-r-full bg-gradient-to-r from-[#F59E0B] to-[#FDE047] text-[#064E3B] font-poster-heading text-[10px] font-bold uppercase truncate">
                {isEn ? 'OUTCOME' : 'HASIL'}
              </div>
            </div>
            <AutoFitBox watchKey={watchKey} className="flex-1 min-h-0 overflow-hidden">
              <p className="text-[9.5px] leading-[1.32] font-medium text-slate-700 m-0 break-words">
                {outcomeText}
              </p>
              <div className="mt-2 pt-1.5 border-t border-slate-200/80 text-right">
                <div className="font-poster-cursive text-[13px] font-bold text-[#065F46] leading-tight truncate">
                  {schoolMotto}
                </div>
                {data.preparedByName && (
                  <div className="text-[8.5px] font-semibold text-slate-600 mt-0.5 truncate">
                    {isEn ? 'Prepared by:' : 'Disediakan oleh:'}{' '}
                    <span className="font-bold text-slate-900">{data.preparedByName}</span>
                  </div>
                )}
              </div>
            </AutoFitBox>
          </div>
        </div>
      </main>
    </div>
  );
};

/* ============================================================================
 * VARIANT 4: AI EDITORIAL 3D INDIGO (ChatGPT / Gemini Executive 3D Poster)
 * ============================================================================ */
export const AiEditorial3dPoster: React.FC<AiPosterProps> = ({
  data,
  theme,
  onEmptyPhotoClick,
}) => {
  const poster = theme.aiPoster;
  const isEn = data.language === 'en';
  const schoolName = (data.organizationName || 'SEKOLAH KEBANGSAAN MALAYSIA').toUpperCase();
  const schoolMotto =
    poster?.schoolMotto || (isEn ? 'Innovate • Inspire • Lead' : 'Inovasi • Ilmu • Kecemerlangan');
  const { main: heroMain, year: heroYear } = splitHeroYear(
    poster?.heroTitle || data.activityTitle || 'Program Kecemerlangan 2026'
  );

  const objectives = poster?.objectives?.length
    ? poster.objectives.slice(0, 3)
    : parseLines(data.objectives, 3);
  const activities = poster?.activities?.length
    ? poster.activities.slice(0, 4)
    : parseLines(data.implementation, 4).map((desc, idx) => ({
        title: isEn ? `Phase 0${idx + 1}` : `Fasa 0${idx + 1}`,
        description: desc,
      }));
  const impacts = poster?.impacts?.length
    ? poster.impacts.slice(0, 4)
    : parseLines(data.impact, 4).map((line) => {
        const parts = line.split(/\s+/);
        return { leadVerb: (parts[0] || 'IMPAK').toUpperCase(), detail: parts.slice(1).join(' ') || line };
      });
  const challenges = poster?.challenges?.length
    ? poster.challenges.slice(0, 2)
    : parseLines(data.reflection, 2);
  const recommendations = poster?.recommendations?.length
    ? poster.recommendations.slice(0, 2)
    : parseLines(data.reflection, 4).slice(2, 4);

  const pillars = poster?.pillars?.length === 4
    ? poster.pillars
    : [
        { label: isEn ? 'Digital' : 'Digital', icon: 'cpu' },
        { label: isEn ? 'Excellence' : 'Cemerlang', icon: 'trophy' },
        { label: isEn ? 'Teamwork' : 'Kerjasama', icon: 'users' },
        { label: isEn ? 'Future' : 'Inovasi', icon: 'rocket' },
      ];

  const closingSlogan =
    poster?.closingSlogan ||
    (isEn
      ? 'Driving Excellence Through Modern Education & Vision'
      : 'Memacu Kecemerlangan Pendidikan Melalui Inovasi Berterusan');

  const photoSlots = data.photos.length >= 3 ? [0, 1, 2] : [0, 1];
  const watchKey = `ed3d|${heroMain}|${objectives.join('|')}|${activities.map((a) => a.title + a.description).join('|')}`;

  return (
    <div className="relative w-[794px] h-[1123px] overflow-hidden flex flex-col select-text bg-[#F5F7FF]">
      {/* Real AI-generated Deep Indigo 3D Architectural Paper-Cut Poster Backdrop */}
      <img
        src={editorialIndigoBg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
      />

      {/* Deep Indigo Executive 3D Header */}
      <header className="relative z-10 px-7 pt-5 pb-3 h-[214px] flex flex-col justify-between shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-[68px] h-[68px] rounded-full bg-white p-1.5 border-[3px] border-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.45)] shrink-0 flex items-center justify-center">
              {data.logoUrl ? (
                <img
                  src={data.logoUrl}
                  alt="Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-full"
                />
              ) : (
                <CrestFallback ringColor="#38BDF8" />
              )}
            </div>
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#06B6D4] to-[#6366F1] text-white font-poster-heading text-[10px] font-bold tracking-[0.16em] uppercase shadow-sm">
                ONE PAGE REPORT (OPR)
              </div>
              <AutoFitText
                as="h2"
                maxFontSize={16}
                minFontSize={11}
                singleLine
                className="font-display-bricolage font-bold text-white uppercase tracking-wide mt-1"
              >
                {schoolName}
              </AutoFitText>
            </div>
          </div>

          <div className="text-right shrink-0 max-w-[180px]">
            <div className="font-poster-cursive text-[17px] font-bold text-[#FDE047] leading-tight truncate">
              {schoolMotto}
            </div>
            {data.organizerUnit && (
              <div className="text-[9.5px] font-semibold text-cyan-200 truncate mt-0.5">
                {data.organizerUnit}
              </div>
            )}
          </div>
        </div>

        {/* Bold 3D Extruded Headline */}
        <div className="mt-1">
          <AutoFitText
            as="h1"
            maxFontSize={32}
            minFontSize={17}
            maxHeight={74}
            className="w-full font-display-bricolage font-extrabold uppercase tracking-tight leading-[1.06] text-white break-words"
            style={{
              textShadow: '0 4px 0 #1E1B4B, 0 8px 20px rgba(6,182,212,0.42)',
            }}
          >
            <span>{heroMain}</span>
            {heroYear && (
              <>
                {' '}
                <span className="text-[#38BDF8]">{heroYear}</span>
              </>
            )}
          </AutoFitText>
          {data.subtitle && (
            <p className="text-[11px] font-medium text-indigo-100/95 truncate mt-1 mb-0">
              {data.subtitle}
            </p>
          )}
        </div>
      </header>

      {/* Main Content Floating Bento Grid */}
      <main className="relative z-10 px-7 -mt-3 pb-2 flex-1 flex flex-col gap-3 min-h-0">
        {/* Frosted 4-Column Metadata Strip Overlapping Header Seam */}
        <div
          className="rounded-2xl bg-white/95 border border-indigo-200/80 px-4 py-2.5 grid grid-cols-4 gap-3 shrink-0"
          style={{ boxShadow: '0 12px 28px -10px rgba(30,27,75,0.22)' }}
        >
          {[
            { icon: <Calendar className="w-4 h-4 text-white" />, from: '#4F46E5', to: '#06B6D4', label: isEn ? 'DATE' : 'TARIKH', val: data.date || '—' },
            { icon: <Clock className="w-4 h-4 text-white" />, from: '#7C3AED', to: '#EC4899', label: isEn ? 'TIME' : 'MASA', val: data.time || '—' },
            { icon: <MapPin className="w-4 h-4 text-white" />, from: '#0284C7', to: '#2DD4BF', label: isEn ? 'VENUE' : 'TEMPAT', val: data.venue || '—' },
            { icon: <Users className="w-4 h-4 text-white" />, from: '#EA580C', to: '#FACC15', label: isEn ? 'TARGET' : 'SASARAN', val: data.targetGroup || '—' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ background: `linear-gradient(135deg, ${item.from}, ${item.to})` }}
              >
                {item.icon}
              </div>
              <div className="min-w-0">
                <div className="text-[8.5px] font-extrabold tracking-widest text-indigo-600 uppercase">
                  {item.label}
                </div>
                <div className="text-[10px] font-bold text-slate-900 leading-tight truncate">
                  {item.val}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 2-Column 3D Infographic Core */}
        <div className="grid grid-cols-12 gap-3.5 h-[364px] shrink-0">
          {/* Left 5 Cols: Objektif + 4 Focus Pillars */}
          <div className="col-span-5 flex flex-col gap-3 min-h-0">
            <div className="flex-1 rounded-2xl bg-white/95 border border-indigo-200/80 shadow-[0_10px_22px_-10px_rgba(49,46,129,0.2)] p-3.5 flex flex-col min-h-0">
              <div className="flex items-center gap-2 mb-2 shrink-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#EC4899] to-[#7C3AED] text-white flex items-center justify-center shadow-sm">
                  <Target className="w-3.5 h-3.5" />
                </div>
                <span className="font-display-bricolage text-[12px] font-extrabold uppercase tracking-wider text-[#1E1B4B]">
                  {isEn ? 'Key Objectives' : 'Objektif Program'}
                </span>
              </div>
              <AutoFitBox watchKey={watchKey} className="flex-1 min-h-0 overflow-hidden">
                <ul className="space-y-2">
                  {objectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[10.5px] leading-[1.34] font-medium text-slate-800">
                      <span className="w-4 h-4 rounded-full bg-[#4F46E5] text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span className="break-words min-w-0">{obj}</span>
                    </li>
                  ))}
                </ul>
              </AutoFitBox>
            </div>

            {/* 2x2 Mini Focus Pillar Grid */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1E1B4B] to-[#312E81] p-3 text-white shadow-[0_10px_20px_-8px_rgba(30,27,75,0.4)] shrink-0">
              <div className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-cyan-300 mb-2">
                {poster?.pillarsTitle || (isEn ? '4 Strategic Pillars' : '4 Teras Fokus')}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {pillars.map((p, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-white/10 border border-white/15 px-2.5 py-1.5 flex items-center gap-2 min-w-0"
                  >
                    <span className="text-[#38BDF8] shrink-0">
                      {renderPillarIcon(p.icon, 'w-4 h-4')}
                    </span>
                    <span className="text-[10.5px] font-bold truncate">{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Connected Vertical Timeline + Impact Highlights */}
          <div className="col-span-7 flex flex-col gap-3 min-h-0">
            <div className="flex-1 rounded-2xl bg-white/95 border border-cyan-200/90 shadow-[0_10px_22px_-10px_rgba(6,182,212,0.2)] p-3.5 flex flex-col min-h-0">
              <div className="flex items-center gap-2 mb-2 shrink-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#06B6D4] to-[#2563EB] text-white flex items-center justify-center shadow-sm">
                  <Cog className="w-3.5 h-3.5" />
                </div>
                <span className="font-display-bricolage text-[12px] font-extrabold uppercase tracking-wider text-[#1E1B4B]">
                  {isEn ? 'Execution Timeline' : 'Pengisian & Pelaksanaan'}
                </span>
              </div>
              <AutoFitBox watchKey={watchKey} className="flex-1 min-h-0 overflow-hidden">
                <div className="relative pl-1 space-y-1.5">
                  {activities.map((act, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 rounded-xl bg-slate-50/90 border border-slate-200/70 px-2.5 py-1.5">
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] text-white font-mono-tabular text-[10px] font-bold flex items-center justify-center shrink-0">
                        0{idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-extrabold uppercase text-[#1E1B4B] leading-tight">
                          {act.title}
                        </div>
                        <div className="text-[9.8px] font-medium text-slate-600 leading-[1.28] break-words">
                          {act.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AutoFitBox>
            </div>

            <div className="h-[142px] rounded-2xl bg-white/95 border border-purple-200/90 shadow-[0_10px_22px_-10px_rgba(124,58,237,0.2)] p-3 flex flex-col shrink-0">
              <div className="flex items-center gap-2 mb-1.5 shrink-0">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-white flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <span className="font-display-bricolage text-[11.5px] font-extrabold uppercase tracking-wider text-[#1E1B4B]">
                  {isEn ? 'Measurable Impact' : 'Impak & Pencapaian'}
                </span>
              </div>
              <AutoFitBox watchKey={watchKey} className="flex-1 min-h-0 overflow-hidden">
                <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {impacts.map((imp, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[9.6px] leading-[1.26] text-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#7C3AED] shrink-0 mt-0.5" />
                      <span className="break-words min-w-0">
                        <strong className="text-[#4C1D95]">{imp.leadVerb}</strong> {imp.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </AutoFitBox>
            </div>
          </div>
        </div>

        {/* Full-Width Split Challenges vs Recommendations Glass Card */}
        <div className="rounded-2xl bg-white/95 border border-indigo-200/80 shadow-[0_8px_18px_-8px_rgba(30,27,75,0.16)] px-4 py-2.5 grid grid-cols-2 divide-x divide-slate-200 shrink-0 h-[106px]">
          <div className="pr-3.5 flex flex-col min-h-0">
            <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase text-[#DC2626] mb-1 shrink-0">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{isEn ? 'Challenges' : 'Kekangan'}</span>
            </div>
            <AutoFitBox watchKey={watchKey} className="flex-1 min-h-0 overflow-hidden">
              <ul className="space-y-1">
                {(challenges.length ? challenges : [isEn ? 'Tight session schedule across groups.' : 'Kekangan masa pelaksanaan antara sesi.']).map((c, idx) => (
                  <li key={idx} className="text-[9.6px] leading-[1.3] font-medium text-slate-700 break-words">
                    • {c}
                  </li>
                ))}
              </ul>
            </AutoFitBox>
          </div>
          <div className="pl-3.5 flex flex-col min-h-0">
            <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase text-[#059669] mb-1 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isEn ? 'Improvements' : 'Cadangan Penambahbaikan'}</span>
            </div>
            <AutoFitBox watchKey={watchKey} className="flex-1 min-h-0 overflow-hidden">
              <ul className="space-y-1">
                {(recommendations.length ? recommendations : [isEn ? 'Conduct earlier technical checks and briefings.' : 'Menyelaras semakan teknikal dan taklimat lebih awal.']).map((r, idx) => (
                  <li key={idx} className="text-[9.6px] leading-[1.3] font-medium text-slate-700 break-words">
                    • {r}
                  </li>
                ))}
              </ul>
            </AutoFitBox>
          </div>
        </div>

        {/* Crisp Framed Photo Showcase */}
        <div
          className={`grid gap-3.5 flex-1 min-h-0 ${
            photoSlots.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
          }`}
        >
          {photoSlots.map((slotIdx) => {
            const photo = data.photos[slotIdx];
            return (
              <div
                key={slotIdx}
                className="relative rounded-2xl overflow-hidden bg-white border-[4px] border-white shadow-[0_12px_24px_-10px_rgba(30,27,75,0.3)]"
              >
                {photo ? (
                  <img
                    src={photo.dataUrl}
                    alt={photo.caption || `Highlight ${slotIdx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <button
                    type="button"
                    data-empty-slot="true"
                    onClick={onEmptyPhotoClick}
                    className="print-hide-empty w-full h-full flex flex-col items-center justify-center gap-1.5 bg-indigo-50/90 hover:bg-indigo-100 text-indigo-700 transition-colors cursor-pointer"
                  >
                    <Camera className="w-5 h-5" />
                    <span className="text-[10.5px] font-bold">
                      {isEn ? `Upload Photo ${slotIdx + 1}` : `Muat Naik Gambar ${slotIdx + 1}`}
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Deep Indigo Wave Footer */}
      <footer className="relative z-10 h-[76px] px-7 pt-4 pb-2 flex items-center justify-between gap-4 shrink-0 text-white">
        <AutoFitText
          as="p"
          maxFontSize={15.5}
          minFontSize={11}
          singleLine
          className="font-poster-cursive font-bold text-[#FDE047] m-0 flex-1 min-w-0"
        >
          “{closingSlogan}”
        </AutoFitText>
        {data.preparedByName && (
          <div className="text-right shrink-0 text-[10px] text-cyan-100">
            <span className="opacity-80">{isEn ? 'Prepared by:' : 'Disediakan oleh:'}</span>{' '}
            <strong className="text-white">{data.preparedByName}</strong>
          </div>
        )}
      </footer>
    </div>
  );
};
