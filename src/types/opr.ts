export type OprLanguage = 'bm' | 'en';

export type LayoutId =
  | 'sidebar-ribbon'
  | 'diagonal-diamond'
  | 'honeycomb-wave'
  | 'geometric-circles'
  | 'broadsheet-blocks'
  | 'bento-showcase'
  | 'swiss-editorial'
  | 'archival-split'
  | 'swoosh-circles'
  | 'tri-column-gallery'
  | 'poster-infographic'
  | 'numbered-dashboard'
  | 'ai-vibrant-poster';

export type FontPairId = 'jakarta' | 'oswald' | 'editorial' | 'bricolage';

export type PhotoFrameStyle = 'rounded' | 'sharp' | 'framed' | 'soft-shadow';

export type PatternStyle = 'none' | 'dots' | 'grid' | 'diagonal' | 'waves';

export interface OprPhoto {
  id: string;
  dataUrl: string;
  caption: string;
  name: string;
}

export interface OprData {
  language: OprLanguage;
  reportBadge: string;
  organizationName: string;
  organizationSub: string;
  organizerUnit: string;
  logoUrl: string | null;
  activityTitle: string;
  subtitle: string;
  date: string;
  day: string;
  time: string;
  venue: string;
  targetGroup: string;
  objectives: string;
  implementation: string;
  impact: string;
  reflection: string;
  preparedByName: string;
  preparedByRole: string;
  verifiedByName: string;
  verifiedByRole: string;
  contactInfo: string;
  photos: OprPhoto[];
}

export interface OprPalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  surface: string;
  surfaceTint: string;
  inkOnPrimary: string;
  inkOnSurface: string;
  mutedInk: string;
  accentInk: string;
}

export interface AiPosterActivityStep {
  title: string;
  description: string;
}

export interface AiPosterImpactItem {
  leadVerb: string;
  detail: string;
}

export type AiPosterStyleModifier =
  | 'playful-illustrated'
  | 'corporate-ed'
  | 'futuristic-tech';

export type AiPosterVariant =
  | 'vibrant-bento'
  | 'sticker-cloud'
  | 'campus-tricolumn'
  | 'editorial-3d';

export interface AiPosterPillar {
  label: string;
  icon: string;
}

export interface AiPosterData {
  variant?: AiPosterVariant;
  styleModifier?: AiPosterStyleModifier;
  reportSubtitle?: string;
  heroBadge?: string;
  schoolMotto: string;
  heroTitle: string;
  pillarsTitle?: string;
  pillars?: AiPosterPillar[];
  objectives: string[];
  activities: AiPosterActivityStep[];
  impacts: AiPosterImpactItem[];
  challenges: string[];
  recommendations: string[];
  summaryText?: string;
  outcomeText?: string;
  closingSlogan: string;
  sectionTitles?: {
    objectives?: string;
    details?: string;
    activities?: string;
    impacts?: string;
    challengesAndImprovements?: string;
    gallery?: string;
  };
}

export interface OprThemeConfig {
  id: string;
  themeLabel: string;
  layout: LayoutId;
  palette: OprPalette;
  fontPair: FontPairId;
  photoFrame: PhotoFrameStyle;
  pattern: PatternStyle;
  customSectionTitles?: {
    objectives?: string;
    implementation?: string;
    impact?: string;
    reflection?: string;
  };
  aiGenerated?: boolean;
  aiDesignNote?: string;
  aiPoster?: AiPosterData;
}

export interface OprLabels {
  date: string;
  day: string;
  time: string;
  venue: string;
  targetGroup: string;
  organizer: string;
  objectives: string;
  implementation: string;
  impact: string;
  reflection: string;
  gallery: string;
  preparedBy: string;
  verifiedBy: string;
}

export const OPR_LABELS: Record<OprLanguage, OprLabels> = {
  bm: {
    date: 'Tarikh',
    day: 'Hari',
    time: 'Masa',
    venue: 'Tempat',
    targetGroup: 'Sasaran',
    organizer: 'Anjuran',
    objectives: 'Objektif',
    implementation: 'Pelaksanaan / Aktiviti',
    impact: 'Impak / Dapatan',
    reflection: 'Rumusan / Cadangan',
    gallery: 'Gambar Aktiviti',
    preparedBy: 'Disediakan oleh',
    verifiedBy: 'Disahkan oleh',
  },
  en: {
    date: 'Date',
    day: 'Day',
    time: 'Time',
    venue: 'Venue',
    targetGroup: 'Target Group',
    organizer: 'Organized By',
    objectives: 'Objectives',
    implementation: 'Implementation / Activities',
    impact: 'Outcomes & Impact',
    reflection: 'Summary & Next Steps',
    gallery: 'Activity Highlights',
    preparedBy: 'Prepared by',
    verifiedBy: 'Verified by',
  },
};
