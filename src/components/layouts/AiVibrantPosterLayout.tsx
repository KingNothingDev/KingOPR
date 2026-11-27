import React from 'react';
import {
  AlertCircle,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Cog,
  Lightbulb,
  MapPin,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  AiPosterStyleModifier,
  OprData,
  OprThemeConfig,
} from '../../types/opr';
import { AutoFitBox, AutoFitText } from './AutoFitText';
import vibrantSkyBg from '../../assets/images/ai_poster_bg_vibrant_sky_1795762549038.jpg';
import {
  AiCampusTriColumnPoster,
  AiEditorial3dPoster,
  AiStickerCloudPoster,
} from './AiModelPosters';

function parseBullets(text: string | undefined, max: number): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[\s•\-*0-9.)]+/, '').trim())
    .filter(Boolean)
    .slice(0, max);
}

interface LayoutProps {
  data: OprData;
  theme: OprThemeConfig;
  onEmptyPhotoClick?: () => void;
}

/** 3D glossy circular icon badge + ribbon-style gradient section header */
const EditorialRibbonHeader: React.FC<{
  numberLabel?: string;
  title: string;
  fromColor: string;
  toColor: string;
  textColor?: string;
  circleFrom: string;
  circleTo: string;
  icon: React.ReactNode;
  isFuturistic?: boolean;
}> = ({
  numberLabel,
  title,
  fromColor,
  toColor,
  textColor = '#FFFFFF',
  circleFrom,
  circleTo,
  icon,
  isFuturistic = false,
}) => (
  <div className="relative flex items-center -mt-4 -ml-1.5 mb-1.5 z-20">
    {/* Glossy 3D circular medallion badge with specular highlight */}
    <div
      className="relative w-8.5 h-8.5 rounded-full flex items-center justify-center shrink-0 border-[2.5px] border-white z-20 overflow-hidden"
      style={{
        background: `linear-gradient(145deg, ${circleFrom} 0%, ${circleTo} 100%)`,
        color: '#FFFFFF',
        boxShadow: isFuturistic
          ? `0 4px 12px ${circleFrom}66, inset 0 1px 2px rgba(255,255,255,0.6)`
          : '0 4px 10px rgba(15,23,42,0.22), inset 0 1.5px 2px rgba(255,255,255,0.55)',
      }}
    >
      {/* Top-left glossy specular sheen */}
      <span
        aria-hidden="true"
        className="absolute top-0.5 left-1.5 w-4 h-2 rounded-full pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.34)' }}
      />
      <span className="relative z-10">{icon}</span>
    </div>

    {/* Layered ribbon bar */}
    <div
      className="relative -ml-2.5 pl-4 pr-3.5 py-1 rounded-r-full flex items-center gap-1.5 min-w-0"
      style={{
        background: `linear-gradient(90deg, ${fromColor} 0%, ${toColor} 100%)`,
        color: textColor,
        boxShadow: isFuturistic
          ? `0 4px 12px ${fromColor}40`
          : '0 3px 8px rgba(15,23,42,0.14)',
      }}
    >
      {numberLabel && (
        <span
          className="font-poster-heading text-[11.5px] font-bold leading-none px-1.5 py-0.5 rounded-full shrink-0"
          style={{
            backgroundColor: 'rgba(255,255,255,0.24)',
            color: textColor,
          }}
        >
          {numberLabel}
        </span>
      )}
      <span className="font-poster-heading text-[10.8px] font-bold uppercase tracking-[0.05em] leading-none truncate">
        {title}
      </span>
    </div>
  </div>
);

/** 3D-shaded open glowing book + colorful stacked textbooks & pencil cup (Top Right) */
const TopRightEditorialVector: React.FC<{ isDarkHeader?: boolean }> = ({
  isDarkHeader = false,
}) => (
  <svg
    viewBox="0 0 118 66"
    className="w-[96px] h-[52px] shrink-0 overflow-visible"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="bookGlow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FACC15" stopOpacity="0.0" />
      </linearGradient>
    </defs>
    {/* Soft glow halo behind open book */}
    <ellipse cx="28" cy="24" rx="18" ry="12" fill="url(#bookGlow)" />
    {/* Sparkle rays */}
    <g stroke="#FACC15" strokeWidth="2.2" strokeLinecap="round">
      <line x1="28" y1="4" x2="28" y2="10" />
      <line x1="15" y1="8" x2="19" y2="13" />
      <line x1="41" y1="8" x2="37" y2="13" />
    </g>
    {/* Open book shadow */}
    <ellipse cx="28" cy="54" rx="20" ry="3.5" fill="rgba(15,23,42,0.16)" />
    {/* Open glowing book */}
    <path
      d="M8 31 C16 25, 24 26, 28 31 C32 26, 40 25, 48 31 L48 51 C40 46, 32 47, 28 51 C24 47, 16 46, 8 51 Z"
      fill="#FFFFFF"
      stroke={isDarkHeader ? '#38BDF8' : '#1E3A8A'}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M28 31 L28 51"
      stroke={isDarkHeader ? '#0EA5E9' : '#1E3A8A'}
      strokeWidth="1.8"
    />
    <path
      d="M12 37 C17 34, 22 35, 25 37 M12 42 C17 39, 22 40, 25 42 M31 37 C34 35, 39 34, 44 37 M31 42 C34 40, 39 39, 44 42"
      stroke="#38BDF8"
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
    />
    {/* 3D Colorful stack of textbooks */}
    <ellipse cx="78" cy="56" rx="25" ry="3.5" fill="rgba(15,23,42,0.16)" />
    <rect x="54" y="45" width="47" height="9.5" rx="3" fill="#2563EB" stroke="#0F172A" strokeWidth="1.3" />
    <rect x="58" y="47.5" width="38" height="3.5" rx="1" fill="#DBEAFE" />
    <rect x="57" y="36" width="43" height="9.5" rx="3" fill="#10B981" stroke="#0F172A" strokeWidth="1.3" />
    <rect x="61" y="38.5" width="34" height="3.5" rx="1" fill="#ECFDF5" />
    <rect x="55" y="27" width="45" height="9.5" rx="3" fill="#EC4899" stroke="#0F172A" strokeWidth="1.3" />
    <rect x="59" y="29.5" width="36" height="3.5" rx="1" fill="#FCE7F3" />
    {/* Pencil cup on top */}
    <path d="M97 22 L101 11 L104 22 Z" fill="#FACC15" stroke="#0F172A" strokeWidth="1.2" />
    <rect x="103" y="13" width="4" height="14" rx="1" fill="#EF4444" stroke="#0F172A" strokeWidth="1.2" />
    <rect x="94" y="24" width="16" height="17" rx="3.5" fill="#06B6D4" stroke="#0F172A" strokeWidth="1.3" />
    <rect x="94" y="28" width="16" height="3.5" fill="#FACC15" />
  </svg>
);

/** 3D-shaded glowing lightbulb above stacked books for Card 4 right edge */
const ImpactLightbulb3DVector: React.FC = () => (
  <svg
    viewBox="0 0 66 80"
    className="w-[54px] h-[66px] shrink-0 overflow-visible"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="cardBulbGlow" cx="42%" cy="38%" r="55%">
        <stop offset="0%" stopColor="#FEF9C3" />
        <stop offset="65%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#F59E0B" />
      </radialGradient>
    </defs>
    {/* Energy rays */}
    <g stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round">
      <line x1="33" y1="3" x2="33" y2="8" />
      <line x1="15" y1="10" x2="19.5" y2="14.5" />
      <line x1="51" y1="10" x2="46.5" y2="14.5" />
      <line x1="10" y1="24" x2="15" y2="24" />
      <line x1="56" y1="24" x2="51" y2="24" />
    </g>
    {/* 3D Bulb */}
    <path
      d="M22.5 25 C22.5 17, 43.5 17, 43.5 25 C43.5 29.8, 39.5 32.2, 38.5 36.5 L27.5 36.5 C26.5 32.2, 22.5 29.8, 22.5 25 Z"
      fill="url(#cardBulbGlow)"
      stroke="#1E3A8A"
      strokeWidth="1.8"
    />
    {/* Specular highlight on bulb */}
    <ellipse cx="28.5" cy="22.5" rx="3.2" ry="2" fill="#FFFFFF" fillOpacity="0.7" transform="rotate(-24 28.5 22.5)" />
    <path d="M29.5 28 L33 32 L36.5 28" stroke="#B45309" strokeWidth="1.7" fill="none" strokeLinecap="round" />
    <rect x="27.5" y="36.8" width="11" height="4.5" rx="1.5" fill="#CBD5E1" stroke="#1E3A8A" strokeWidth="1.3" />
    <rect x="29.5" y="41.3" width="7" height="3" rx="1" fill="#64748B" />
    {/* Books base with soft shadow */}
    <ellipse cx="33" cy="70" rx="22" ry="3" fill="rgba(15,23,42,0.14)" />
    <rect x="12" y="60" width="42" height="8.5" rx="2.5" fill="#7C3AED" stroke="#1E1B4B" strokeWidth="1.3" />
    <rect x="16" y="62.5" width="34" height="3" rx="1" fill="#EDE9FE" />
    <rect x="15" y="52" width="36" height="8.5" rx="2.5" fill="#06B6D4" stroke="#1E1B4B" strokeWidth="1.3" />
    <rect x="19" y="54.5" width="28" height="3" rx="1" fill="#ECFEFF" />
    <rect x="18" y="45.5" width="30" height="6.8" rx="2" fill="#EC4899" stroke="#1E1B4B" strokeWidth="1.3" />
  </svg>
);

/** Vibrant 3D-style stacked books vector for Footer Bottom Left */
const FooterBooks3DVector: React.FC = () => (
  <svg
    viewBox="0 0 86 60"
    className="w-[72px] h-[52px] shrink-0 overflow-visible"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="fbBlue" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
      <linearGradient id="fbTeal" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2DD4BF" />
        <stop offset="100%" stopColor="#0D9488" />
      </linearGradient>
      <linearGradient id="fbPink" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FB7185" />
        <stop offset="100%" stopColor="#E11D48" />
      </linearGradient>
      <linearGradient id="fbGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#EAB308" />
      </linearGradient>
    </defs>
    <ellipse cx="43" cy="54" rx="34" ry="4" fill="rgba(0,0,0,0.32)" />
    <rect x="7" y="40" width="70" height="12.5" rx="3.5" fill="url(#fbBlue)" stroke="#FFFFFF" strokeWidth="1.6" />
    <rect x="14" y="44" width="56" height="4" rx="1.5" fill="#DBEAFE" />
    <rect x="12" y="28" width="61" height="12.5" rx="3.5" fill="url(#fbTeal)" stroke="#FFFFFF" strokeWidth="1.6" />
    <rect x="19" y="32" width="47" height="4" rx="1.5" fill="#CCFBF1" />
    <rect x="9" y="16" width="63" height="12.5" rx="3.5" fill="url(#fbPink)" stroke="#FFFFFF" strokeWidth="1.6" />
    <rect x="16" y="20" width="49" height="4" rx="1.5" fill="#FFE4E6" />
    <rect x="19" y="5.5" width="46" height="10.5" rx="3" fill="url(#fbGold)" stroke="#FFFFFF" strokeWidth="1.6" />
    <rect x="25" y="9" width="34" height="3" rx="1" fill="#FEF9C3" />
  </svg>
);

/** Vibrant 3D-style glowing lightbulb vector for Footer Bottom Right */
const FooterBulb3DVector: React.FC = () => (
  <svg
    viewBox="0 0 68 62"
    className="w-[58px] h-[52px] shrink-0 overflow-visible"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="footerBulbHalo" cx="50%" cy="45%" r="50%">
        <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.65" />
        <stop offset="100%" stopColor="#FACC15" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="footerBulbBody" cx="38%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#FEF9C3" />
        <stop offset="60%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#EA580C" />
      </radialGradient>
    </defs>
    <circle cx="34" cy="27" r="24" fill="url(#footerBulbHalo)" />
    <g stroke="#FDE047" strokeWidth="2.4" strokeLinecap="round">
      <line x1="34" y1="3" x2="34" y2="9" />
      <line x1="15" y1="10" x2="19.5" y2="14.5" />
      <line x1="53" y1="10" x2="48.5" y2="14.5" />
      <line x1="9" y1="26" x2="15" y2="26" />
      <line x1="59" y1="26" x2="53" y2="26" />
    </g>
    <path
      d="M21.5 26 C21.5 16, 46.5 16, 46.5 26 C46.5 31.8, 42.2 35, 40.5 40.2 L27.5 40.2 C25.8 35, 21.5 31.8, 21.5 26 Z"
      fill="url(#footerBulbBody)"
      stroke="#FFFFFF"
      strokeWidth="2"
    />
    <ellipse cx="29" cy="22.5" rx="4" ry="2.2" fill="#FFFFFF" fillOpacity="0.72" transform="rotate(-24 29 22.5)" />
    <path d="M29.5 29 C31.5 26, 36.5 26, 38.5 29" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" />
    <rect x="27.5" y="41" width="13" height="5.5" rx="2" fill="#E2E8F0" stroke="#0B2358" strokeWidth="1.4" />
    <rect x="30" y="47" width="8" height="4" rx="1.5" fill="#94A3B8" />
  </svg>
);

/** Clean circular emblem placeholder when no school crest is uploaded */
const CircularEmblemPlaceholder: React.FC = () => (
  <svg viewBox="0 0 76 76" className="w-[58px] h-[58px]" aria-hidden="true">
    <defs>
      <linearGradient id="crestGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1D4ED8" />
        <stop offset="100%" stopColor="#0F2C67" />
      </linearGradient>
    </defs>
    <circle cx="38" cy="38" r="34" fill="url(#crestGrad)" stroke="#FACC15" strokeWidth="3.5" />
    <circle cx="38" cy="38" r="26" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5" />
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

function splitHeroTitle(rawTitle: string): { main: string; highlight: string } {
  const cleaned = (rawTitle || 'PROGRAM SEKOLAH 2026').trim();
  const yearMatch = cleaned.match(/^(.*?)(\b20\d{2}\b)$/);
  if (yearMatch && yearMatch[1].trim().length > 0) {
    return { main: yearMatch[1].trim(), highlight: yearMatch[2].trim() };
  }
  const words = cleaned.split(/\s+/);
  if (words.length >= 3) {
    return {
      main: words.slice(0, -1).join(' '),
      highlight: words[words.length - 1],
    };
  }
  return { main: cleaned, highlight: '' };
}

export const AiVibrantPosterLayout: React.FC<LayoutProps> = ({
  data,
  theme,
  onEmptyPhotoClick,
}) => {
  const variant = theme.aiPoster?.variant || 'vibrant-bento';
  if (variant === 'sticker-cloud') {
    return (
      <AiStickerCloudPoster
        data={data}
        theme={theme}
        onEmptyPhotoClick={onEmptyPhotoClick}
      />
    );
  }
  if (variant === 'campus-tricolumn') {
    return (
      <AiCampusTriColumnPoster
        data={data}
        theme={theme}
        onEmptyPhotoClick={onEmptyPhotoClick}
      />
    );
  }
  if (variant === 'editorial-3d') {
    return (
      <AiEditorial3dPoster
        data={data}
        theme={theme}
        onEmptyPhotoClick={onEmptyPhotoClick}
      />
    );
  }

  const { palette } = theme;
  const poster = theme.aiPoster;
  const styleModifier: AiPosterStyleModifier =
    poster?.styleModifier || 'playful-illustrated';
  const isCorporate = styleModifier === 'corporate-ed';
  const isFuturistic = styleModifier === 'futuristic-tech';
  const isEn = data.language === 'en';

  const titles = {
    objectives:
      poster?.sectionTitles?.objectives ||
      (isEn ? 'OBJECTIVES' : 'OBJEKTIF PROGRAM'),
    details:
      poster?.sectionTitles?.details ||
      (isEn ? 'IMPLEMENTATION DETAILS' : 'BUTIRAN PELAKSANAAN'),
    activities:
      poster?.sectionTitles?.activities ||
      (isEn ? 'KEY ACTIVITIES' : 'PENGISIAN / AKTIVITI'),
    impacts:
      poster?.sectionTitles?.impacts ||
      (isEn ? 'IMPACT & OUTCOMES' : 'IMPAK / PENCAPAIAN'),
    challengesAndImprovements:
      poster?.sectionTitles?.challengesAndImprovements ||
      (isEn ? 'CHALLENGES & IMPROVEMENTS' : 'KEKANGAN & CADANGAN PENAMBAHANBAIKAN'),
    gallery:
      poster?.sectionTitles?.gallery ||
      (isEn ? 'PROGRAM HIGHLIGHTS' : 'GAMBAR PROGRAM'),
  };

  const fallbackObjectives = parseBullets(data.objectives, 3);
  const objectives = poster?.objectives?.length
    ? poster.objectives.slice(0, 3)
    : fallbackObjectives.length
      ? fallbackObjectives
      : [
          'Meningkatkan tahap penguasaan dan kompetensi murid secara menyeluruh.',
          'Membudayakan pembelajaran aktif, kreatif dan berfikir aras tinggi.',
          'Memastikan pelaksanaan program berjalan teratur, sistematik dan berimpak.',
        ];

  const fallbackImpl = parseBullets(data.implementation, 4);
  const activities = poster?.activities?.length
    ? poster.activities.slice(0, 4)
    : (fallbackImpl.length
        ? fallbackImpl
        : [
            'Taklimat ringkas dan persediaan peserta sebelum sesi bermula.',
            'Pelaksanaan aktiviti utama mengikut jadual dan stesen ditetapkan.',
            'Bimbingan berterusan serta pemantauan oleh guru penyelaras.',
            'Rumusan pencapaian, penilaian dan dokumentasi rekod program.',
          ]
      ).map((item, idx) => ({
        title: isEn ? `Step ${idx + 1}` : `Fasa ${idx + 1}`,
        description: item,
      }));

  const fallbackImpacts = parseBullets(data.impact, 4);
  const impacts = poster?.impacts?.length
    ? poster.impacts.slice(0, 4)
    : (fallbackImpacts.length
        ? fallbackImpacts
        : [
            'MENINGKATKAN keyakinan dan kemahiran murid dalam aktiviti berfokus.',
            'MEMPERKASA budaya kerjasama antara guru dan murid sepanjang program.',
            'MENYEDIAKAN data pencapaian yang sistematik untuk tindakan susulan.',
            'MENGOPTIMUMKAN penggunaan kemudahan serta sumber pembelajaran sekolah.',
          ]
      ).map((line) => {
        const parts = line.trim().split(/\s+/);
        const first = (parts[0] || (isEn ? 'ENHANCED' : 'MENINGKATKAN')).toUpperCase();
        const rest = parts.slice(1).join(' ') || line;
        return { leadVerb: first, detail: rest };
      });

  const reflectionLines = parseBullets(data.reflection, 6);
  const challenges = poster?.challenges?.length
    ? poster.challenges.slice(0, 3)
    : [
        reflectionLines[0] || 'Kekangan masa pelaksanaan mengikut jadual giliran kelas.',
        'Keperluan penyelarasan awal peralatan dan capaian teknikal.',
        'Tahap penguasaan awal murid yang pelbagai memerlukan bimbingan tambahan.',
      ];

  const recommendations = poster?.recommendations?.length
    ? poster.recommendations.slice(0, 3)
    : [
        reflectionLines[1] || 'Menyediakan sesi taklimat serta latihan persediaan lebih awal.',
        'Menambah baik penjadualan ruang dan semakan peralatan sebelum program.',
        'Melaksanakan bimbingan susulan dan pengayaan berfokus selepas program.',
      ];

  const schoolName = (
    data.organizationName || 'SEKOLAH KEBANGSAAN MALAYSIA'
  ).toUpperCase();
  const reportSubtitle = poster?.reportSubtitle || 'ONE PAGE REPORT (OPR)';
  const schoolMotto =
    poster?.schoolMotto ||
    (isEn ? 'Learn • Innovate • Excel' : 'Ilmu • Disiplin • Jaya');
  const heroRaw =
    poster?.heroTitle || data.activityTitle || 'PROGRAM KECEMERLANGAN 2026';
  const { main: heroMain, highlight: heroHighlight } = splitHeroTitle(heroRaw);
  const closingSlogan =
    poster?.closingSlogan ||
    (isEn
      ? 'Empowering Future-Ready Learners Through Meaningful Innovation'
      : 'Bersama Membina Generasi Berilmu, Berakhlak dan Berdaya Saing');

  const stepBgColors = isFuturistic
    ? ['rgba(224,242,254,0.85)', 'rgba(237,233,254,0.85)', 'rgba(207,250,254,0.85)', 'rgba(252,231,243,0.85)']
    : isCorporate
      ? ['#EFF6FF', '#FEF9C3', '#F0FDFA', '#F8FAFC']
      : ['#E0F2FE', '#ECFDF5', '#FEF9C3', '#FCE7F3'];

  const gallerySlots = data.photos.length >= 3 ? [0, 1, 2] : [0, 1];
  const watchKey = `${styleModifier}|${data.organizationName}|${data.activityTitle}|${data.date}|${data.time}|${data.venue}|${data.targetGroup}|${objectives.join('')}|${activities.map((a) => a.title + a.description).join('')}|${impacts.map((i) => i.leadVerb + i.detail).join('')}|${challenges.join('')}|${recommendations.join('')}|${closingSlogan}`;

  // Style-modifier specific visual tokens blended with active theme.palette
  const canvasBackground = isFuturistic
    ? `linear-gradient(180deg, #0B1120 0%, ${palette.secondary} 18%, ${palette.surfaceTint} 30%, #F8FAFC 68%, ${palette.surfaceTint} 100%)`
    : isCorporate
      ? `linear-gradient(180deg, ${palette.primary} 0%, ${palette.secondary} 18%, #F1F5F9 26%, #FFFFFF 68%, ${palette.surfaceTint} 100%)`
      : `linear-gradient(180deg, ${palette.surfaceTint} 0%, #F2F9FF 26%, #FFFFFF 66%, ${palette.surfaceTint} 100%)`;

  const isDarkTopHeader = isFuturistic || isCorporate;

  const cardSurfaceStyle = (borderColor: string, glowTint: string): React.CSSProperties =>
    isFuturistic
      ? {
          background:
            'linear-gradient(145deg, rgba(255,255,255,0.86) 0%, rgba(248,250,252,0.78) 100%)',
          border: `1.8px solid ${borderColor}`,
          boxShadow: `0 10px 24px -8px ${glowTint}, 0 2px 0 ${borderColor}35, inset 0 1px 0 rgba(255,255,255,0.95)`,
          backdropFilter: 'blur(8px)',
        }
      : isCorporate
        ? {
            background: '#FFFFFF',
            border: `1.8px solid ${borderColor}`,
            boxShadow: `0 8px 20px -8px rgba(10,31,82,0.18), 0 3px 0 ${borderColor}40, inset 0 1px 0 #FFFFFF`,
          }
        : {
            background: 'rgba(255,255,255,0.96)',
            border: `2px solid ${borderColor}`,
            boxShadow: `0 10px 22px -10px rgba(15,44,103,0.18), 0 3px 0 ${borderColor}38, inset 0 1.5px 0 #FFFFFF`,
          };

  const detailLabels = isEn
    ? { date: 'DATE', time: 'TIME', venue: 'VENUE', target: 'TARGET' }
    : { date: 'TARIKH', time: 'MASA', venue: 'TEMPAT', target: 'SASARAN' };

  const bottomCardLabels = isEn
    ? { left: 'CHALLENGES:', right: 'IMPROVEMENTS:' }
    : { left: 'KEKANGAN:', right: 'CADANGAN:' };

  return (
    <div
      className="relative w-[794px] h-[1123px] overflow-hidden flex flex-col select-text"
      style={{
        background: canvasBackground,
        color: '#0F2557',
      }}
    >
      {/* Real AI-generated luminous sky + watercolor school campus + paper-cut ribbon poster artwork */}
      {!isDarkTopHeader && (
        <img
          src={vibrantSkyBg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none opacity-90"
        />
      )}

      {/* ==================== BACKGROUND LAYERED PAPER-CUT, HALFTONE DOTS & MARGIN DOODLES ==================== */}
      <svg
        viewBox="0 0 794 1123"
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          {/* Subtle halftone dot pattern */}
          <pattern
            id="editorialHalftone"
            width="12"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="3"
              cy="3"
              r="1.4"
              fill={isFuturistic ? '#6366F1' : '#1D4ED8'}
              fillOpacity={isFuturistic ? '0.14' : '0.1'}
            />
          </pattern>
          {/* Tech grid for futuristic style */}
          <pattern
            id="futuristicGrid"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 28 0 L 0 0 0 28"
              fill="none"
              stroke="#38BDF8"
              strokeOpacity="0.14"
              strokeWidth="0.8"
            />
          </pattern>
          <linearGradient id="paperCutBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.06" />
          </linearGradient>
          <linearGradient id="paperCutYellow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FACC15" stopOpacity="0.52" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="neonMeshOrb1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="neonMeshOrb2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EC4899" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="schoolBackdropFade" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={isDarkTopHeader ? '#FFFFFF' : '#1E40AF'}
              stopOpacity={isDarkTopHeader ? '0.09' : '0.11'}
            />
            <stop
              offset="100%"
              stopColor={isDarkTopHeader ? '#FFFFFF' : '#1E40AF'}
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {/* Halftone dot fields in opposing editorial zones */}
        <rect x="0" y="210" width="150" height="220" fill="url(#editorialHalftone)" />
        <rect x="644" y="610" width="150" height="230" fill="url(#editorialHalftone)" />

        {/* Style-specific header & background geometric architecture */}
        {isFuturistic && (
          <>
            <rect x="0" y="0" width="794" height="235" fill="url(#futuristicGrid)" />
            <circle cx="130" cy="70" r="140" fill="url(#neonMeshOrb1)" />
            <circle cx="670" cy="115" r="150" fill="url(#neonMeshOrb2)" />
            <circle cx="700" cy="560" r="160" fill="url(#neonMeshOrb1)" />
            <circle cx="80" cy="830" r="140" fill="url(#neonMeshOrb2)" />
            {/* Sleek neon angled divider wave under dark header */}
            <path
              d="M0,206 Q260,236 530,202 T794,218 L794,232 Q530,214 260,248 T0,220 Z"
              fill="#06B6D4"
              fillOpacity="0.45"
            />
          </>
        )}

        {isCorporate && (
          <>
            {/* Sharp royal-blue & metallic gold diagonal speed-lines in header */}
            <polygon points="0,0 240,0 135,212 0,212" fill="#1E3A8A" fillOpacity="0.55" />
            <polygon points="595,0 794,0 794,212 690,212" fill="#1D4ED8" fillOpacity="0.42" />
            <polygon points="212,0 228,0 124,212 108,212" fill="#FACC15" fillOpacity="0.72" />
            <polygon points="236,0 242,0 138,212 132,212" fill="#38BDF8" fillOpacity="0.55" />
            <polygon points="622,0 634,0 726,212 714,212" fill="#F59E0B" fillOpacity="0.55" />
            {/* Crisp golden bottom trim of corporate header */}
            <polygon points="0,206 794,196 794,210 0,218" fill="#F59E0B" />
          </>
        )}

        {!isCorporate && !isFuturistic && (
          <>
            {/* Faint architectural school building silhouette blended into top header */}
            <g fill="url(#schoolBackdropFade)">
              <polygon points="150,74 397,22 644,74" />
              <rect x="172" y="74" width="450" height="106" rx="4" />
              <polygon points="62,100 172,76 172,180 62,180" />
              <polygon points="622,76 732,100 732,180 622,180" />
              <g fill="#E8F5FF" fillOpacity="0.55">
                <rect x="206" y="90" width="32" height="24" rx="2" />
                <rect x="256" y="90" width="32" height="24" rx="2" />
                <rect x="306" y="90" width="32" height="24" rx="2" />
                <rect x="456" y="90" width="32" height="24" rx="2" />
                <rect x="506" y="90" width="32" height="24" rx="2" />
                <rect x="556" y="90" width="32" height="24" rx="2" />
                <rect x="366" y="86" width="62" height="72" rx="4" />
              </g>
            </g>
            {/* Layered paper-cut diagonal corner ribbons */}
            <polygon points="0,0 155,0 0,136" fill="#1D4ED8" fillOpacity="0.16" />
            <polygon points="0,0 112,0 0,98" fill="#0EA5E9" fillOpacity="0.2" />
            <polygon points="0,0 74,0 0,64" fill="#FACC15" fillOpacity="0.6" />
            <polygon points="794,0 645,0 794,126" fill="#0EA5E9" fillOpacity="0.18" />
            <polygon points="794,0 726,0 794,64" fill="#FACC15" fillOpacity="0.55" />
          </>
        )}

        {/* Dynamic diagonal geometric edge accents along left & right margins */}
        <polygon points="0,315 22,338 0,435" fill="url(#paperCutBlue)" />
        <polygon points="0,415 16,432 0,505" fill="url(#paperCutYellow)" />
        <polygon points="794,348 770,372 794,475" fill="url(#paperCutYellow)" />
        <polygon points="794,452 775,470 794,550" fill="#2563EB" fillOpacity="0.2" />
        <polygon points="0,780 24,802 0,895" fill="#06B6D4" fillOpacity="0.24" />
        <polygon points="794,755 770,782 794,880" fill="url(#paperCutYellow)" />

        {/* Subtle hand-drawn educational doodle accents in the margins (sparks, stars, squiggles) */}
        <g
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={isCorporate ? 0.45 : 0.72}
        >
          {/* Left margin hand-drawn 4-point spark */}
          <path
            d="M12,262 L14,270 L22,272 L14,274 L12,282 L10,274 L2,272 L10,270 Z"
            fill="#FACC15"
            stroke="#D97706"
            strokeWidth="1"
          />
          {/* Right margin hand-drawn spark */}
          <path
            d="M780,268 L782,274 L788,276 L782,278 L780,284 L778,278 L772,276 L778,274 Z"
            fill="#EC4899"
            stroke="#BE185D"
            strokeWidth="0.9"
          />
          {/* Left margin tiny wavy squiggle */}
          <path
            d="M5,590 Q12,596 6,604 T8,618 T6,632"
            stroke="#06B6D4"
            strokeWidth="2.2"
          />
          {/* Right margin tiny hand-drawn star burst */}
          <g stroke="#8B5CF6" strokeWidth="2">
            <line x1="780" y1="608" x2="780" y2="616" />
            <line x1="775" y1="612" x2="785" y2="612" />
            <line x1="776.5" y1="608.5" x2="783.5" y2="615.5" />
            <line x1="783.5" y1="608.5" x2="776.5" y2="615.5" />
          </g>
          {/* Left lower tiny floating diamond doodle */}
          <polygon
            points="12,728 18,735 12,742 6,735"
            fill="#F472B6"
            fillOpacity="0.45"
            stroke="#DB2777"
            strokeWidth="1.2"
          />
          {/* Right lower subtle circle rings */}
          <circle cx="781" cy="726" r="5" stroke="#0EA5E9" strokeWidth="1.8" />
          <circle cx="781" cy="726" r="1.5" fill="#FACC15" />
        </g>

        {/* Soft pastel ambient shapes behind bento cards */}
        <circle cx="95" cy="278" r="46" fill="#BAE6FD" fillOpacity="0.28" />
        <circle cx="715" cy="296" r="54" fill="#FEF08A" fillOpacity="0.24" />
        <circle cx="660" cy="740" r="64" fill="#E0F2FE" fillOpacity="0.38" />
        <circle cx="115" cy="872" r="50" fill="#FCE7F3" fillOpacity="0.32" />
      </svg>

      {/* ==================== 1. HEADER SECTION (TOP 20%) ==================== */}
      <header className="relative z-10 px-6 pt-4 pb-1 shrink-0">
        {/* Top Row: Circular Official Crest | Org Name + Subtitle Ribbon | Motto + 3D Books */}
        <div className="flex items-start justify-between gap-3">
          {/* Top-Left: Circular Official Emblem / Logo */}
          <div
            className="w-[74px] h-[74px] rounded-full bg-white flex items-center justify-center p-1.5 shrink-0"
            style={{
              border: isFuturistic
                ? '3px solid #38BDF8'
                : isCorporate
                  ? '3px solid #FACC15'
                  : '3px solid #FFFFFF',
              boxShadow: isFuturistic
                ? '0 0 18px rgba(56,189,248,0.45), 0 6px 14px rgba(15,23,42,0.28)'
                : '0 6px 16px rgba(15,44,103,0.22), 0 0 0 2px rgba(29,78,216,0.18)',
            }}
          >
            {data.logoUrl ? (
              <img
                src={data.logoUrl}
                alt="Organization Emblem"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded-full"
              />
            ) : (
              <CircularEmblemPlaceholder />
            )}
          </div>

          {/* Top-Center: Authoritative Org Title + Sleek Subtitle Ribbon */}
          <div className="flex-1 min-w-0 flex flex-col items-center text-center pt-0.5">
            <AutoFitText
              as="h2"
              maxFontSize={19}
              minFontSize={11.5}
              maxHeight={42}
              className="w-full font-poster-heading font-bold uppercase tracking-tight leading-[1.12] break-words"
              style={{
                color: isDarkTopHeader ? '#FFFFFF' : '#0B2559',
                textShadow: isDarkTopHeader
                  ? '0 2px 8px rgba(0,0,0,0.35)'
                  : '0 1.5px 0 rgba(255,255,255,0.95)',
              }}
            >
              {schoolName}
            </AutoFitText>
            {data.organizationSub && (
              <AutoFitText
                as="p"
                maxFontSize={9.5}
                minFontSize={7.5}
                singleLine
                className="w-full font-semibold mt-0.5 m-0"
                style={{
                  color: isDarkTopHeader ? 'rgba(224,242,254,0.88)' : 'rgba(30,64,175,0.82)',
                }}
              >
                {data.organizationSub}
              </AutoFitText>
            )}

            {/* Sleek 3D Folded Subtitle Ribbon */}
            <div className="relative inline-flex items-center justify-center mt-1.5">
              <svg
                viewBox="0 0 18 22"
                className="w-3.5 h-[22px] -mr-1 shrink-0"
                aria-hidden="true"
              >
                <polygon
                  points="18,0 0,0 7,11 0,22 18,22"
                  fill={isFuturistic ? '#0891B2' : '#CA8A04'}
                />
              </svg>
              <div
                className="px-4 py-[3.5px] rounded-xs z-10 font-poster-heading text-[10.8px] font-bold tracking-[0.13em] uppercase"
                style={{
                  background: isFuturistic
                    ? 'linear-gradient(90deg, #06B6D4 0%, #8B5CF6 100%)'
                    : 'linear-gradient(180deg, #FEF08A 0%, #FACC15 100%)',
                  color: isFuturistic ? '#FFFFFF' : '#0B2559',
                  border: '1.5px solid #FFFFFF',
                  boxShadow: '0 3px 8px rgba(15,23,42,0.18)',
                }}
              >
                {reportSubtitle}
              </div>
              <svg
                viewBox="0 0 18 22"
                className="w-3.5 h-[22px] -ml-1 shrink-0"
                aria-hidden="true"
              >
                <polygon
                  points="0,0 18,0 11,11 18,22 0,22"
                  fill={isFuturistic ? '#6D28D9' : '#CA8A04'}
                />
              </svg>
            </div>
          </div>

          {/* Top-Right: Stylized Motto + 3D Book Vector */}
          <div className="w-[154px] shrink-0 flex flex-col items-end text-right">
            <TopRightEditorialVector isDarkHeader={isDarkTopHeader} />
            <AutoFitText
              as="span"
              maxFontSize={15}
              minFontSize={10}
              singleLine
              className="w-full font-poster-cursive font-bold leading-tight -mt-0.5 text-right block"
              style={{
                color: isDarkTopHeader ? '#FDE047' : '#1D4ED8',
                textShadow: isDarkTopHeader ? '0 1px 4px rgba(0,0,0,0.4)' : 'none',
              }}
            >
              {schoolMotto}
            </AutoFitText>
          </div>
        </div>

        {/* Hero Title: Sticker-Outline Energetic Display Typography + Dynamic Paint-Brushstroke Splash */}
        <div className="relative mt-2.5 flex items-center justify-center">
          <div className="relative w-full max-w-[736px] h-[88px] py-2 px-9 flex items-center justify-center">
            <svg
              viewBox="0 0 740 108"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="heroBrushMain" x1="0" y1="0" x2="1" y2="0">
                  <stop
                    offset="0%"
                    stopColor={isFuturistic ? '#0F172A' : palette.primary}
                  />
                  <stop
                    offset="55%"
                    stopColor={isFuturistic ? '#312E81' : palette.secondary}
                  />
                  <stop
                    offset="100%"
                    stopColor={isFuturistic ? '#0E7490' : palette.primary}
                  />
                </linearGradient>
                <linearGradient id="heroSplashOuter" x1="0" y1="0" x2="1" y2="0">
                  <stop
                    offset="0%"
                    stopColor={isFuturistic ? '#06B6D4' : palette.accent}
                  />
                  <stop
                    offset="50%"
                    stopColor={isFuturistic ? '#8B5CF6' : '#FDE047'}
                  />
                  <stop
                    offset="100%"
                    stopColor={isFuturistic ? '#EC4899' : palette.accent}
                  />
                </linearGradient>
              </defs>

              {/* Soft paper-cut drop shadow underneath splash */}
              <path
                d="M32,28 C140,10 326,8 500,15 C610,19 696,14 726,31 C738,42 732,76 716,92 C624,106 414,108 206,103 C108,100 40,103 20,84 C8,68 16,38 32,28 Z"
                fill="rgba(15,23,42,0.22)"
              />
              {/* Outer vibrant paint-brushstroke splash */}
              <path
                d="M28,22 C135,4 320,2 495,9 C605,13 692,8 724,25 C736,36 730,72 714,88 C622,102 412,104 202,99 C104,96 36,99 16,80 C4,64 12,32 28,22 Z"
                fill="url(#heroSplashOuter)"
              />
              {/* Thick white sticker-outline layer */}
              <path
                d="M36,24 C145,10 340,10 510,16 C612,19 684,15 709,30 C720,40 715,69 700,82 C610,94 415,96 212,91 C116,89 48,91 28,75 C17,62 24,33 36,24 Z"
                fill="#FFFFFF"
              />
              {/* Inner rich brush-stroke core */}
              <path
                d="M42,27 C150,15 342,14 508,20 C606,23 676,20 701,33 C711,42 706,66 692,78 C604,89 412,91 215,86 C122,84 56,86 36,72 C26,60 32,35 42,27 Z"
                fill="url(#heroBrushMain)"
              />
              {/* Glossy top-edge highlight streak */}
              <path
                d="M78,24 C215,17 400,18 575,24"
                stroke="#38BDF8"
                strokeWidth="3"
                strokeLinecap="round"
                strokeOpacity="0.6"
                fill="none"
              />
              {/* Energetic doodle spark lines left & right */}
              <g
                stroke={isFuturistic ? '#22D3EE' : '#EC4899'}
                strokeWidth="3.5"
                strokeLinecap="round"
              >
                <line x1="6" y1="35" x2="18" y2="40" />
                <line x1="2" y1="54" x2="15" y2="54" />
                <line x1="8" y1="72" x2="19" y2="67" />
              </g>
              <g
                stroke={isFuturistic ? '#F472B6' : '#0EA5E9'}
                strokeWidth="3.5"
                strokeLinecap="round"
              >
                <line x1="734" y1="35" x2="722" y2="40" />
                <line x1="738" y1="54" x2="725" y2="54" />
                <line x1="732" y1="72" x2="721" y2="67" />
              </g>
            </svg>

            <AutoFitText
              as="h1"
              maxFontSize={32}
              minFontSize={15}
              maxHeight={62}
              className="relative z-10 w-full font-poster-heading font-bold uppercase text-center leading-[1.08] tracking-wide px-2 -rotate-[1deg] break-words"
            >
              <span
                style={{
                  color: '#FFFFFF',
                  textShadow:
                    '0 3px 0 #071A42, 2px 2px 0 #071A42, -1.5px -1.5px 0 #071A42, 0 5px 12px rgba(7,26,66,0.48)',
                }}
              >
                {heroMain}
              </span>
              {heroHighlight && (
                <>
                  {' '}
                  <span
                    style={{
                      color: isFuturistic ? '#67E8F9' : '#FDE047',
                      textShadow: isFuturistic
                        ? '0 3px 0 #312E81, 2px 2px 0 #7C3AED, -1.5px -1.5px 0 #0F172A, 0 5px 12px rgba(6,182,212,0.45)'
                        : '0 3px 0 #BE185D, 2px 2px 0 #BE185D, -1.5px -1.5px 0 #071A42, 0 5px 10px rgba(7,26,66,0.45)',
                    }}
                  >
                    {heroHighlight}
                  </span>
                </>
              )}
            </AutoFitText>
          </div>
        </div>
      </header>

      {/* ==================== 2. MAIN CONTENT BENTO GRID (MIDDLE 55%) ==================== */}
      <main className="relative z-10 px-6 pt-3.5 flex flex-col gap-3.5 shrink-0">
        {/* ROW 1: Card 1 (Objektif) & Card 2 (Butiran Pelaksanaan) */}
        <div className="grid grid-cols-12 gap-3.5">
          {/* Card 1 (Top Left): Magenta Ribbon + Glossy Target Badge */}
          <div
            className="col-span-6 h-[138px] rounded-2xl px-3.5 pb-2.5 pt-1 flex flex-col"
            style={cardSurfaceStyle('#EC4899', 'rgba(236,72,153,0.22)')}
          >
            <EditorialRibbonHeader
              numberLabel="1"
              title={titles.objectives}
              fromColor="#BE185D"
              toColor="#EC4899"
              circleFrom="#F472B6"
              circleTo="#BE185D"
              isFuturistic={isFuturistic}
              icon={<Target className="w-4 h-4" />}
            />
            <AutoFitBox
              watchKey={watchKey}
              className="flex-1 min-h-0 overflow-hidden mt-0.5"
            >
              <ul className="space-y-1.5">
                {objectives.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-[10.5px] leading-[1.32] font-medium text-[#0F2557]"
                  >
                    <span
                      className="w-4 h-4 rounded-full text-white flex items-center justify-center shrink-0 mt-[1px]"
                      style={{
                        background: 'linear-gradient(145deg, #2563EB 0%, #1E3A8A 100%)',
                        boxShadow: '0 2px 4px rgba(30,58,138,0.28)',
                      }}
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                    <span className="break-words min-w-0">{item}</span>
                  </li>
                ))}
              </ul>
            </AutoFitBox>
          </div>

          {/* Card 2 (Top Right): Royal Blue Ribbon + 4-Column Mini-Grid */}
          <div
            className="col-span-6 h-[138px] rounded-2xl px-3 pb-2.5 pt-1 flex flex-col"
            style={cardSurfaceStyle('#2563EB', 'rgba(37,99,235,0.22)')}
          >
            <EditorialRibbonHeader
              numberLabel="2"
              title={titles.details}
              fromColor="#1E3A8A"
              toColor="#3B82F6"
              circleFrom="#60A5FA"
              circleTo="#1D4ED8"
              isFuturistic={isFuturistic}
              icon={<Calendar className="w-4 h-4" />}
            />
            <AutoFitBox
              watchKey={watchKey}
              className="grid grid-cols-4 divide-x divide-[#BFDBFE] flex-1 min-h-0 overflow-hidden items-start pt-1"
            >
              {[
                {
                  label: detailLabels.date,
                  value: data.date || '—',
                  icon: <Calendar className="w-4 h-4 text-[#1D4ED8]" />,
                },
                {
                  label: detailLabels.time,
                  value: data.time || '—',
                  icon: <Clock className="w-4 h-4 text-[#1D4ED8]" />,
                },
                {
                  label: detailLabels.venue,
                  value: data.venue || '—',
                  icon: <MapPin className="w-4 h-4 text-[#1D4ED8]" />,
                },
                {
                  label: detailLabels.target,
                  value: data.targetGroup || '—',
                  icon: <Users className="w-4 h-4 text-[#1D4ED8]" />,
                },
              ].map((cell) => (
                <div
                  key={cell.label}
                  className="px-1.5 flex flex-col items-center text-center min-w-0"
                >
                  <div
                    className="w-7.5 h-7.5 rounded-xl flex items-center justify-center mb-1 shrink-0"
                    style={{
                      background: 'linear-gradient(145deg, #EFF6FF 0%, #DBEAFE 100%)',
                      boxShadow: 'inset 0 1px 0 #FFFFFF, 0 2px 5px rgba(37,99,235,0.14)',
                    }}
                  >
                    {cell.icon}
                  </div>
                  <div className="font-poster-heading text-[8.5px] font-bold tracking-wider uppercase text-[#1E40AF]">
                    {cell.label}
                  </div>
                  <div className="text-[9.5px] font-semibold leading-[1.24] text-[#0F2557] mt-0.5 break-words w-full">
                    {cell.value}
                  </div>
                </div>
              ))}
            </AutoFitBox>
          </div>
        </div>

        {/* ROW 2: Card 3 (Pengisian / Aktiviti) & Card 4 (Impak / Pencapaian) */}
        <div className="grid grid-cols-12 gap-3.5">
          {/* Card 3 (Middle Left): Teal Ribbon + 01-04 Soft Tinted Pills */}
          <div
            className="col-span-6 h-[196px] rounded-2xl px-3.5 pb-2.5 pt-1 flex flex-col"
            style={cardSurfaceStyle('#0D9488', 'rgba(13,148,136,0.22)')}
          >
            <EditorialRibbonHeader
              numberLabel="3"
              title={titles.activities}
              fromColor="#0F766E"
              toColor="#14B8A6"
              circleFrom="#2DD4BF"
              circleTo="#0F766E"
              isFuturistic={isFuturistic}
              icon={<Cog className="w-4 h-4" />}
            />
            <AutoFitBox
              watchKey={watchKey}
              className="flex-1 min-h-0 overflow-hidden mt-0.5"
            >
              <div className="space-y-1.5">
                {activities.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-xl px-2 py-1"
                    style={{
                      backgroundColor: stepBgColors[idx % stepBgColors.length],
                      border: '1px solid rgba(15,118,110,0.14)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-full text-white font-poster-heading text-[10px] font-bold flex items-center justify-center shrink-0"
                      style={{
                        background: 'linear-gradient(145deg, #14B8A6 0%, #0F766E 100%)',
                        boxShadow: '0 2px 5px rgba(15,118,110,0.32)',
                      }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="min-w-0 leading-[1.24] break-words">
                      <span className="font-poster-heading text-[10px] font-bold text-[#0F2557]">
                        {step.title}:{' '}
                      </span>
                      <span className="text-[9.8px] font-medium text-[#1E3A5F]">
                        {step.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </AutoFitBox>
          </div>

          {/* Card 4 (Middle Right): Purple Ribbon + Rising Chart + 3D Lightbulb & Books */}
          <div
            className="col-span-6 h-[196px] rounded-2xl px-3.5 pb-2.5 pt-1 flex flex-col relative"
            style={cardSurfaceStyle('#8B5CF6', 'rgba(139,92,246,0.22)')}
          >
            <EditorialRibbonHeader
              numberLabel="4"
              title={titles.impacts}
              fromColor="#5B21B6"
              toColor="#8B5CF6"
              circleFrom="#A78BFA"
              circleTo="#6D28D9"
              isFuturistic={isFuturistic}
              icon={<TrendingUp className="w-4 h-4" />}
            />
            <div className="flex items-stretch gap-1.5 flex-1 min-h-0 mt-0.5">
              <AutoFitBox
                watchKey={watchKey}
                className="flex-1 min-w-0 min-h-0 overflow-hidden"
              >
                <ul className="space-y-1.5">
                  {impacts.map((imp, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-1.5 text-[10px] leading-[1.28] text-[#0F2557]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#7C3AED] shrink-0 mt-[1px]" />
                      <span className="break-words min-w-0">
                        <strong className="font-poster-heading font-bold uppercase text-[#5B21B6]">
                          {imp.leadVerb}
                        </strong>{' '}
                        <span className="font-medium">{imp.detail}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </AutoFitBox>
              <div className="shrink-0 self-end -mr-1 -mb-1">
                <ImpactLightbulb3DVector />
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3: Card 5 (Full-Width Bottom Card) — Kekangan & Cadangan */}
        <div
          className="h-[144px] rounded-2xl px-4 pb-2.5 pt-1 flex flex-col"
          style={cardSurfaceStyle('#F97316', 'rgba(249,115,22,0.22)')}
        >
          <EditorialRibbonHeader
            numberLabel="5"
            title={titles.challengesAndImprovements}
            fromColor="#C2410C"
            toColor="#F59E0B"
            circleFrom="#FBBF24"
            circleTo="#EA580C"
            isFuturistic={isFuturistic}
            icon={<Lightbulb className="w-4 h-4" />}
          />
          <AutoFitBox
            watchKey={watchKey}
            className="grid grid-cols-2 divide-x divide-[#FED7AA] flex-1 min-h-0 overflow-hidden mt-0.5"
          >
            {/* Left Column: Red Exclamation Badge */}
            <div className="pr-3.5 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FEF2F2] border border-[#FECACA] shadow-2xs mb-1">
                <AlertCircle className="w-3.5 h-3.5 text-[#DC2626]" />
                <span className="font-poster-heading text-[10px] font-bold uppercase tracking-wide text-[#B91C1C]">
                  {bottomCardLabels.left}
                </span>
              </div>
              <ul className="space-y-1">
                {challenges.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-1.5 text-[10px] leading-[1.28] font-medium text-[#0F2557]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] shrink-0 mt-[5px]" />
                    <span className="break-words min-w-0">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Green Checkmark Badge */}
            <div className="pl-3.5 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] shadow-2xs mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                <span className="font-poster-heading text-[10px] font-bold uppercase tracking-wide text-[#047857]">
                  {bottomCardLabels.right}
                </span>
              </div>
              <ul className="space-y-1">
                {recommendations.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-1.5 text-[10px] leading-[1.28] font-medium text-[#0F2557]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669] shrink-0 mt-[5px]" />
                    <span className="break-words min-w-0">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AutoFitBox>
        </div>
      </main>

      {/* ==================== 3. PHOTO GALLERY & FOOTER (BOTTOM 25%) ==================== */}
      <section className="relative z-10 px-6 pt-3.5 pb-2 flex-1 flex flex-col min-h-0">
        <div
          className="rounded-2xl px-4 pb-3.5 pt-1 flex-1 flex flex-col min-h-0"
          style={cardSurfaceStyle(
            isFuturistic ? '#06B6D4' : '#EAB308',
            isFuturistic ? 'rgba(6,182,212,0.22)' : 'rgba(234,179,8,0.22)'
          )}
        >
          <EditorialRibbonHeader
            title={titles.gallery}
            fromColor={isFuturistic ? '#0284C7' : '#CA8A04'}
            toColor={isFuturistic ? '#06B6D4' : '#FACC15'}
            textColor={isFuturistic ? '#FFFFFF' : '#0B2559'}
            circleFrom={isFuturistic ? '#38BDF8' : '#FDE047'}
            circleTo={isFuturistic ? '#0369A1' : '#CA8A04'}
            isFuturistic={isFuturistic}
            icon={<Camera className="w-4 h-4" />}
          />

          {/* Side-by-side rounded rectangular photo frames with thick white borders, dynamic tilt & 3D paper-cut shadows */}
          <div
            className={`grid gap-4 flex-1 min-h-0 items-center px-1.5 pt-1 ${
              gallerySlots.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
            }`}
          >
            {gallerySlots.map((slotIndex) => {
              const photo = data.photos[slotIndex];
              const isLeft = slotIndex % 2 === 0;
              const tiltClass =
                gallerySlots.length === 3
                  ? slotIndex === 0
                    ? '-rotate-[1.5deg]'
                    : slotIndex === 2
                      ? 'rotate-[1.5deg]'
                      : 'rotate-[0.3deg]'
                  : isLeft
                    ? '-rotate-[1.5deg]'
                    : 'rotate-[1.5deg]';
              const outerRingColor = isFuturistic
                ? isLeft
                  ? '#06B6D4'
                  : '#8B5CF6'
                : isLeft
                  ? '#FACC15'
                  : '#06B6D4';

              if (!photo) {
                return (
                  <button
                    key={slotIndex}
                    type="button"
                    data-empty-slot="true"
                    onClick={onEmptyPhotoClick}
                    className={`print-hide-empty h-full max-h-[192px] w-full rounded-xl p-[4px] transition-transform hover:scale-[1.01] cursor-pointer ${tiltClass}`}
                    style={{
                      backgroundColor: outerRingColor,
                      boxShadow:
                        '0 12px 24px -10px rgba(15,23,42,0.28), 0 4px 8px -2px rgba(15,23,42,0.12)',
                    }}
                  >
                    <div className="w-full h-full rounded-[9px] bg-white p-[5px]">
                      <div className="w-full h-full rounded-[6px] border-2 border-dashed border-sky-300 bg-sky-50/75 flex flex-col items-center justify-center gap-1 text-sky-700">
                        <Camera className="w-5 h-5 opacity-75" />
                        <span className="font-poster-heading text-[10px] font-semibold">
                          {isEn
                            ? `Upload Photo ${slotIndex + 1}`
                            : `Muat Naik Gambar ${slotIndex + 1}`}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              }

              return (
                <div
                  key={photo.id}
                  className={`h-full max-h-[192px] w-full rounded-xl p-[4px] ${tiltClass}`}
                  style={{
                    backgroundColor: outerRingColor,
                    boxShadow:
                      '0 14px 26px -10px rgba(15,23,42,0.34), 0 4px 10px -2px rgba(15,23,42,0.14)',
                  }}
                >
                  <div className="relative w-full h-full rounded-[9px] bg-white p-[5px] overflow-hidden">
                    <img
                      src={photo.dataUrl}
                      alt={photo.caption || `Gambar Program ${slotIndex + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-[6px]"
                    />
                    {photo.caption && (
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 px-2.5 py-0.5 rounded-md bg-[#0B2559]/82 text-white text-[9px] font-medium truncate text-center">
                        {photo.caption}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 4. LAYERED PAPER-CUT CURVED WAVE FOOTER ==================== */}
      <footer className="relative z-10 h-[86px] shrink-0 mt-auto overflow-hidden">
        <svg
          viewBox="0 0 794 86"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="footerDeepWave" x1="0" y1="0" x2="1" y2="0">
              <stop
                offset="0%"
                stopColor={isFuturistic ? '#0B1120' : palette.secondary}
              />
              <stop
                offset="50%"
                stopColor={isFuturistic ? '#1E1B4B' : palette.primary}
              />
              <stop
                offset="100%"
                stopColor={isFuturistic ? '#0B1120' : palette.secondary}
              />
            </linearGradient>
          </defs>
          {/* Back layered paper-cut wave accent */}
          <path
            d="M0,12 Q210,-4 420,14 T794,6 L794,86 L0,86 Z"
            fill={isFuturistic ? '#8B5CF6' : '#38BDF8'}
            fillOpacity="0.4"
          />
          {/* Middle bright gold/cyan wave rim */}
          <path
            d="M0,19 Q198,2 397,16 T794,12 L794,86 L0,86 Z"
            fill={isFuturistic ? '#06B6D4' : palette.accent}
          />
          {/* Deep navy-blue foreground wave */}
          <path
            d="M0,26 Q198,8 397,22 T794,18 L794,86 L0,86 Z"
            fill="url(#footerDeepWave)"
          />
        </svg>

        <div className="relative z-10 h-full px-6 pt-3 pb-2 flex items-center justify-between gap-4">
          {/* Bottom-Left: 3D-style stacked books vector */}
          <FooterBooks3DVector />

          {/* Center: Stylized Script / Handwritten Closing Quote */}
          <div className="flex-1 min-w-0 text-center px-2">
            <AutoFitText
              as="p"
              maxFontSize={22}
              minFontSize={12}
              singleLine
              className="w-full font-poster-cursive font-bold text-white leading-tight m-0"
              style={{ textShadow: '0 2px 6px rgba(0,0,0,0.38)' }}
            >
              {closingSlogan}
            </AutoFitText>
            {(data.preparedByName || data.organizerUnit) && (
              <AutoFitText
                as="p"
                maxFontSize={8.5}
                minFontSize={7}
                singleLine
                className="w-full font-semibold uppercase tracking-[0.12em] text-sky-200/85 mt-0.5 m-0"
              >
                {[
                  data.organizerUnit,
                  data.preparedByName
                    ? `${isEn ? 'Prepared by' : 'Disediakan oleh'}: ${data.preparedByName}`
                    : '',
                ]
                  .filter(Boolean)
                  .join('  •  ')}
              </AutoFitText>
            )}
          </div>

          {/* Bottom-Right: 3D-style glowing lightbulb vector */}
          <FooterBulb3DVector />
        </div>
      </footer>
    </div>
  );
};
