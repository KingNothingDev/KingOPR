import {
  FontPairId,
  LayoutId,
  OprData,
  OprPalette,
  OprThemeConfig,
  PatternStyle,
  PhotoFrameStyle,
} from '../types/opr';

export interface LayoutMeta {
  id: LayoutId;
  name: string;
  tagline: string;
}

export const LAYOUT_OPTIONS: LayoutMeta[] = [
  {
    id: 'sidebar-ribbon',
    name: 'Sidebar Ribbon',
    tagline: 'Deep left metadata bar, angled title banner & mosaic gallery',
  },
  {
    id: 'diagonal-diamond',
    name: 'Diamond Cascade',
    tagline: 'Full-bleed rich backdrop with rotated diamond photo frames',
  },
  {
    id: 'honeycomb-wave',
    name: 'Honeycomb Wave',
    tagline: 'Hexagonal photo cluster with sculpted bottom wave footer',
  },
  {
    id: 'geometric-circles',
    name: 'Geometric Circles',
    tagline: 'Corner diagonal ribbons, circular gallery & chevron steps',
  },
  {
    id: 'broadsheet-blocks',
    name: 'Broadsheet Ledger',
    tagline: 'Authoritative left column, boxed sections & rounded photo matrix',
  },
  {
    id: 'bento-showcase',
    name: 'Structured Bento',
    tagline: 'Full-width masthead, photo strip & color-coded summary cards',
  },
  {
    id: 'swiss-editorial',
    name: 'Swiss Editorial',
    tagline: 'Magazine masthead, hairline grid, hero feature photo & pull quote',
  },
  {
    id: 'archival-split',
    name: 'Archival Split',
    tagline: 'Dramatic dark upper showcase paired with crisp white lower ledger',
  },
  {
    id: 'swoosh-circles',
    name: 'Swoosh Circles',
    tagline: 'Sweeping right curve ribbon, dark pill headers & overlapping circles',
  },
  {
    id: 'tri-column-gallery',
    name: 'Tri-Column Gallery',
    tagline: 'Three pillar cards, mid-page photo documentation & curved wave frame',
  },
  {
    id: 'poster-infographic',
    name: 'Poster Infographic',
    tagline: 'Bold poster masthead, 4 highlight tiles, numbered bands & gallery',
  },
  {
    id: 'numbered-dashboard',
    name: 'Numbered Dashboard',
    tagline: 'Icon-badged 1-to-5 structured modules with bottom photo showcase',
  },
];

export const COLOR_PALETTES: OprPalette[] = [
  {
    id: 'emerald-gold',
    name: 'Emerald & Gold',
    primary: '#0F4C2E',
    secondary: '#09331E',
    accent: '#EAB308',
    surface: '#FFFFFF',
    surfaceTint: '#F2F8F5',
    inkOnPrimary: '#FFFFFF',
    inkOnSurface: '#0F172A',
    mutedInk: '#475569',
    accentInk: '#0F172A',
  },
  {
    id: 'crimson-ink',
    name: 'Crimson & Charcoal',
    primary: '#8B151B',
    secondary: '#5C0D12',
    accent: '#18181B',
    surface: '#FFFFFF',
    surfaceTint: '#FDF4F4',
    inkOnPrimary: '#FFFFFF',
    inkOnSurface: '#18181B',
    mutedInk: '#52525B',
    accentInk: '#FFFFFF',
  },
  {
    id: 'navy-saffron',
    name: 'Royal Navy & Saffron',
    primary: '#1E3A8A',
    secondary: '#172554',
    accent: '#F59E0B',
    surface: '#FFFFFF',
    surfaceTint: '#F0F5FF',
    inkOnPrimary: '#FFFFFF',
    inkOnSurface: '#0F172A',
    mutedInk: '#475569',
    accentInk: '#0F172A',
  },
  {
    id: 'violet-iris',
    name: 'Deep Violet & Iris',
    primary: '#5B21B6',
    secondary: '#3B0764',
    accent: '#A78BFA',
    surface: '#FAF8FF',
    surfaceTint: '#F3EEFF',
    inkOnPrimary: '#FFFFFF',
    inkOnSurface: '#1E1B4B',
    mutedInk: '#5B5476',
    accentInk: '#1E1B4B',
  },
  {
    id: 'teal-coral',
    name: 'Deep Teal & Coral',
    primary: '#0F5257',
    secondary: '#09373B',
    accent: '#F97316',
    surface: '#FFFFFF',
    surfaceTint: '#F0FAFA',
    inkOnPrimary: '#FFFFFF',
    inkOnSurface: '#0F172A',
    mutedInk: '#475569',
    accentInk: '#FFFFFF',
  },
  {
    id: 'cobalt-sky',
    name: 'Cobalt & Sunburst',
    primary: '#1D4ED8',
    secondary: '#1E3A8A',
    accent: '#FACC15',
    surface: '#FFFFFF',
    surfaceTint: '#EFF6FF',
    inkOnPrimary: '#FFFFFF',
    inkOnSurface: '#0F172A',
    mutedInk: '#475569',
    accentInk: '#0F172A',
  },
  {
    id: 'obsidian-ochre',
    name: 'Obsidian & Ochre',
    primary: '#18181B',
    secondary: '#09090B',
    accent: '#D97706',
    surface: '#FAFAF9',
    surfaceTint: '#F4F4F5',
    inkOnPrimary: '#FAFAFA',
    inkOnSurface: '#18181B',
    mutedInk: '#52525B',
    accentInk: '#FFFFFF',
  },
  {
    id: 'forest-sage',
    name: 'Botanical Forest',
    primary: '#1B4332',
    secondary: '#081C15',
    accent: '#52B788',
    surface: '#FFFFFF',
    surfaceTint: '#F0F7F4',
    inkOnPrimary: '#FFFFFF',
    inkOnSurface: '#111827',
    mutedInk: '#4B5563',
    accentInk: '#081C15',
  },
  {
    id: 'burgundy-sand',
    name: 'Burgundy & Gold Sand',
    primary: '#6B1D3B',
    secondary: '#4A1026',
    accent: '#E2B466',
    surface: '#FFFDF9',
    surfaceTint: '#FAF3F6',
    inkOnPrimary: '#FFFFFF',
    inkOnSurface: '#1F161B',
    mutedInk: '#5C4A52',
    accentInk: '#1F161B',
  },
  {
    id: 'indigo-mint',
    name: 'Midnight Indigo & Mint',
    primary: '#1E293B',
    secondary: '#0F172A',
    accent: '#10B981',
    surface: '#FFFFFF',
    surfaceTint: '#F1F5F9',
    inkOnPrimary: '#FFFFFF',
    inkOnSurface: '#0F172A',
    mutedInk: '#475569',
    accentInk: '#FFFFFF',
  },
];

export const FONT_PAIRS: { id: FontPairId; name: string; displayClass: string; bodyClass: string }[] = [
  {
    id: 'jakarta',
    name: 'Modern Geometric',
    displayClass: 'font-display-jakarta',
    bodyClass: 'font-body-dm',
  },
  {
    id: 'oswald',
    name: 'Bold Condensed',
    displayClass: 'font-display-oswald',
    bodyClass: 'font-body-dm',
  },
  {
    id: 'editorial',
    name: 'Classic Editorial',
    displayClass: 'font-display-playfair',
    bodyClass: 'font-body-dm',
  },
  {
    id: 'bricolage',
    name: 'Expressive Studio',
    displayClass: 'font-display-bricolage',
    bodyClass: 'font-body-dm',
  },
];

export const PHOTO_FRAME_OPTIONS: PhotoFrameStyle[] = [
  'rounded',
  'sharp',
  'framed',
  'soft-shadow',
];

export const PATTERN_OPTIONS: PatternStyle[] = [
  'none',
  'dots',
  'grid',
  'diagonal',
  'waves',
];

export function getFontClasses(fontPair: FontPairId) {
  return FONT_PAIRS.find((f) => f.id === fontPair) || FONT_PAIRS[0];
}

export function createInitialTheme(): OprThemeConfig {
  return {
    id: 'preset-initial',
    themeLabel: 'Emerald Sidebar',
    layout: 'sidebar-ribbon',
    palette: COLOR_PALETTES[0],
    fontPair: 'oswald',
    photoFrame: 'framed',
    pattern: 'dots',
  };
}

export function generateRandomTheme(prev?: OprThemeConfig): OprThemeConfig {
  const layouts = LAYOUT_OPTIONS.filter((l) => !prev || l.id !== prev.layout);
  const pickedLayout = layouts[Math.floor(Math.random() * layouts.length)];

  const palettes = COLOR_PALETTES.filter((p) => !prev || p.id !== prev.palette.id);
  const pickedPalette = palettes[Math.floor(Math.random() * palettes.length)];

  const pickedFont = FONT_PAIRS[Math.floor(Math.random() * FONT_PAIRS.length)].id;
  const pickedFrame =
    PHOTO_FRAME_OPTIONS[Math.floor(Math.random() * PHOTO_FRAME_OPTIONS.length)];
  const pickedPattern =
    PATTERN_OPTIONS[Math.floor(Math.random() * PATTERN_OPTIONS.length)];

  return {
    id: `rnd-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    themeLabel: `${pickedPalette.name.split(' ')[0]} ${pickedLayout.name.split(' ')[0]}`,
    layout: pickedLayout.id,
    palette: pickedPalette,
    fontPair: pickedFont,
    photoFrame: pickedFrame,
    pattern: pickedPattern,
    aiGenerated: false,
  };
}

export const DEFAULT_BM_DATA: OprData = {
  language: 'bm',
  reportBadge: 'OPR 2026',
  organizationName: 'SEKOLAH KEBANGSAAN SERI AMAN',
  organizationSub: 'ABA6010 · Jalan Pokok Assam, 34000 Taiping, Perak',
  organizerUnit: 'Unit Kurikulum & ICT',
  logoUrl: null,
  activityTitle: 'Pentaksiran Kompetensi dan Literasi (PKL) 2026',
  subtitle: 'Memperkasa kemahiran berfikir aras tinggi serta literasi digital murid Tahap 2',
  date: '17 – 19 Ogos 2026',
  day: 'Isnin – Rabu',
  time: '8.00 pagi – 1.00 tengah hari',
  venue: 'Makmal Komputer & Bilik ICT',
  targetGroup: 'Semua Murid Tahap 2 (Tahun 4, 5 & 6)',
  objectives:
    'Menilai tahap penguasaan murid dalam Literasi Bacaan, Matematik, Sains dan Kewangan.\nMelatih murid berfikir secara kritis dan kreatif dalam menyelesaikan masalah situasi dunia sebenar.\nMengenal pasti murid yang memerlukan bimbingan susulan dan intervensi berfokus.',
  implementation:
    'Pentaksiran dilaksanakan secara berpusat di makmal komputer mengikut jadual giliran kelas.\nMurid menjawab empat domain literasi secara dalam talian dengan pemantauan guru penyelaras.\nBimbingan teknikal diberikan sepanjang sesi bagi memastikan kelancaran capaian peranti.',
  impact:
    '100% kehadiran murid Tahap 2 berjaya melengkapkan pentaksiran mengikut tempoh ditetapkan.\nMeningkatkan keyakinan serta kemahiran literasi digital murid dalam menjawab soalan bertaraf TIMSS dan PISA.\nData dapatan menjadi panduan utama guru merancang program pemulihan dan pengayaan.',
  reflection:
    'Pelaksanaan PKL 2026 berjalan lancar hasil kerjasama warga sekolah. Cadangan penambahbaikan termasuk memperkukuh latihan asas navigasi komputer sebelum sesi pentaksiran akan datang.',
  preparedByName: 'Puan Nurul Ainsyifa binti Rosnan',
  preparedByRole: 'Penyelaras PKL & Guru ICT',
  verifiedByName: 'Encik Zaini bin Idris',
  verifiedByRole: 'Guru Besar',
  contactInfo: 'aba6010@moe.edu.my · 05-807 6199',
  photos: [],
};

export const DEFAULT_EN_DATA: OprData = {
  language: 'en',
  reportBadge: 'ONE PAGE REPORT',
  organizationName: 'MERIDIAN INTERNATIONAL ACADEMY',
  organizationSub: 'STEM & Innovation Division · Campus North',
  organizerUnit: 'Academic Curriculum Unit',
  logoUrl: null,
  activityTitle: 'Competency & Digital Literacy Assessment 2026',
  subtitle: 'Benchmarking critical thinking, scientific reasoning, and real-world problem solving',
  date: '17 – 19 August 2026',
  day: 'Monday – Wednesday',
  time: '8:00 AM – 1:00 PM',
  venue: 'ICT Innovation Lab & Computer Suites',
  targetGroup: 'Upper Primary Cohort (Grades 4, 5 & 6)',
  objectives:
    'Evaluate student proficiency across Reading, Mathematics, Science, and Financial Literacy domains.\nCultivate critical, analytical, and creative problem-solving skills aligned with international benchmarks.\nIdentify targeted learning gaps early to guide structured intervention programs.',
  implementation:
    'Conducted scheduled assessment sessions across two fully equipped computer laboratories.\nStudents completed interactive online modules covering four core competency pillars.\nFaculty coordinators provided live onboarding and technical guidance throughout each slot.',
  impact:
    'Achieved 100% cohort participation with zero disruption across all three scheduled assessment days.\nBuilt student confidence in navigating digital assessment tools and multi-step analytical tasks.\nGenerated actionable cohort diagnostics to inform next term curriculum planning.',
  reflection:
    'The program ran smoothly through strong cross-department coordination. Future cycles will add a 15-minute warm-up navigation tutorial for younger participants prior to assessment day.',
  preparedByName: 'Ms. Hannah Lim',
  preparedByRole: 'ICT & Assessment Coordinator',
  verifiedByName: 'Mr. Daniel Tan',
  verifiedByRole: 'School Principal',
  contactInfo: 'curriculum@meridian.edu · +605-807 6199',
  photos: [],
};

export function parseLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.replace(/^[\s•\-–—*]+/, '').trim())
    .filter(Boolean);
}
