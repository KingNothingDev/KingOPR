import {
  AiPosterPillar,
  AiPosterStyleModifier,
  AiPosterVariant,
  OprData,
  OprLanguage,
  OprThemeConfig,
} from '../types/opr';
import { parseLines } from '../data/presets';

const VARIANT_ORDER: AiPosterVariant[] = [
  'vibrant-bento',
  'sticker-cloud',
  'campus-tricolumn',
  'editorial-3d',
];

interface VariantPalettePreset {
  variant: AiPosterVariant;
  name: string;
  styleModifier: AiPosterStyleModifier;
  paletteLabel: string;
  primary: string;
  secondary: string;
  accent: string;
  surfaceTint: string;
  inkOnPrimary: string;
  accentInk: string;
}

const VARIANT_PRESETS: VariantPalettePreset[] = [
  {
    variant: 'vibrant-bento',
    name: 'AI Vibrant Sky Bento',
    styleModifier: 'playful-illustrated',
    paletteLabel: 'Cobalt Blue & Gold',
    primary: '#0F2C67',
    secondary: '#1D4ED8',
    accent: '#FACC15',
    surfaceTint: '#EBF6FF',
    inkOnPrimary: '#FFFFFF',
    accentInk: '#0F172A',
  },
  {
    variant: 'sticker-cloud',
    name: 'AI Sticker Cloud Infographic',
    styleModifier: 'playful-illustrated',
    paletteLabel: 'Sky Azure & Sunny Gold',
    primary: '#0C2D6B',
    secondary: '#0284C7',
    accent: '#FACC15',
    surfaceTint: '#EFF8FF',
    inkOnPrimary: '#FFFFFF',
    accentInk: '#0F172A',
  },
  {
    variant: 'campus-tricolumn',
    name: 'AI Emerald Campus 3-Column',
    styleModifier: 'corporate-ed',
    paletteLabel: 'Lush Emerald & Amber',
    primary: '#065F46',
    secondary: '#047857',
    accent: '#F59E0B',
    surfaceTint: '#ECFDF5',
    inkOnPrimary: '#FFFFFF',
    accentInk: '#0F172A',
  },
  {
    variant: 'editorial-3d',
    name: 'AI Editorial 3D Indigo',
    styleModifier: 'futuristic-tech',
    paletteLabel: 'Royal Indigo & Cyan',
    primary: '#1E1B4B',
    secondary: '#4338CA',
    accent: '#06B6D4',
    surfaceTint: '#EEF2FF',
    inkOnPrimary: '#FFFFFF',
    accentInk: '#0F172A',
  },
];

function inferPillars(data: OprData): AiPosterPillar[] {
  const isEn = data.language === 'en';
  const haystack = `${data.activityTitle} ${data.subtitle} ${data.objectives} ${data.implementation}`.toLowerCase();

  const candidates: { match: RegExp; bm: string; en: string; icon: string }[] = [
    { match: /baca|read|literasi|bahasa|story|book/, bm: 'Literasi', en: 'Literacy', icon: 'book' },
    { match: /sains|science|stem|makmal|lab|eksperimen/, bm: 'Sains & STEM', en: 'Science & STEM', icon: 'flask' },
    { match: /matematik|math|kira|logik|numeric/, bm: 'Matematik', en: 'Mathematics', icon: 'calculator' },
    { match: /kewangan|financ|niaga|usahawan|ekonomi/, bm: 'Kewangan', en: 'Financial', icon: 'coins' },
    { match: /digital|ict|komputer|ai|coding|robot|teknologi|tech/, bm: 'Teknologi ICT', en: 'Digital Tech', icon: 'cpu' },
    { match: /sukan|sport|olahraga|pertandingan|juara|kecemerlangan/, bm: 'Kecemerlangan', en: 'Excellence', icon: 'trophy' },
    { match: /kepimpinan|leader|sahabat|kerjasama|komuniti|murid/, bm: 'Kolaborasi', en: 'Teamwork', icon: 'users' },
    { match: /alam|hijau|eco|sustain|kitar|kebersihan/, bm: 'Kelestarian', en: 'Sustainability', icon: 'globe' },
    { match: /disiplin|keselamatan|sahsiah|adab|integriti/, bm: 'Sahsiah', en: 'Character', icon: 'shield' },
    { match: /inovasi|kreatif|inovatif|cipta|rekacipta/, bm: 'Inovasi', en: 'Innovation', icon: 'rocket' },
    { match: /kebajikan|prihatin|kesihatan|kesejahteraan/, bm: 'Kesejahteraan', en: 'Wellbeing', icon: 'heart' },
  ];

  const picked: AiPosterPillar[] = [];
  for (const item of candidates) {
    if (item.match.test(haystack)) {
      picked.push({ label: isEn ? item.en : item.bm, icon: item.icon });
    }
    if (picked.length === 4) break;
  }

  const defaults: AiPosterPillar[] = isEn
    ? [
        { label: 'Knowledge', icon: 'book' },
        { label: 'Innovation', icon: 'rocket' },
        { label: 'Collaboration', icon: 'users' },
        { label: 'Excellence', icon: 'trophy' },
      ]
    : [
        { label: 'Ilmu & Literasi', icon: 'book' },
        { label: 'Inovasi', icon: 'rocket' },
        { label: 'Kolaborasi', icon: 'users' },
        { label: 'Kecemerlangan', icon: 'trophy' },
      ];

  for (const def of defaults) {
    if (picked.length >= 4) break;
    if (!picked.some((p) => p.icon === def.icon)) {
      picked.push(def);
    }
  }

  return picked.slice(0, 4);
}

function splitActivityLine(line: string, index: number, isEn: boolean) {
  const colonIdx = line.indexOf(':');
  if (colonIdx > 1 && colonIdx < 36) {
    return {
      title: line.slice(0, colonIdx).trim(),
      description: line.slice(colonIdx + 1).trim() || line.trim(),
    };
  }
  const words = line.split(/\s+/).filter(Boolean);
  if (words.length >= 5) {
    return {
      title: words.slice(0, 2).join(' '),
      description: line.trim(),
    };
  }
  return {
    title: isEn ? `Phase ${index + 1}` : `Fasa ${index + 1}`,
    description: line.trim(),
  };
}

function splitImpactLine(line: string, index: number, isEn: boolean) {
  const defaultVerbs = isEn
    ? ['ACHIEVED', 'ENHANCED', 'EMPOWERED', 'BUILT']
    : ['MENCAPAI', 'MENINGKATKAN', 'MEMPERKASA', 'MEMBINA'];
  const words = line.trim().split(/\s+/);
  const first = words[0] || '';
  if (words.length >= 3 && /^[A-Za-z0-9%+\-]{3,16}$/.test(first)) {
    return {
      leadVerb: first.toUpperCase(),
      detail: words.slice(1).join(' '),
    };
  }
  return {
    leadVerb: defaultVerbs[index % defaultVerbs.length],
    detail: line.trim(),
  };
}

export function buildClientAiPoster(
  data: OprData,
  previousVariant?: AiPosterVariant,
  polishContent?: boolean
): { theme: OprThemeConfig; polished: Partial<OprData> | null } {
  const isEn = data.language === 'en';
  const candidates = VARIANT_ORDER.filter((v) => v !== previousVariant);
  const nextVariant =
    candidates[Math.floor(Math.random() * candidates.length)] || VARIANT_ORDER[0];
  const preset =
    VARIANT_PRESETS.find((p) => p.variant === nextVariant) || VARIANT_PRESETS[0];

  const objLines = parseLines(data.objectives).slice(0, 4);
  const impLines = parseLines(data.implementation).slice(0, 4);
  const impactLines = parseLines(data.impact).slice(0, 4);

  const objectives =
    objLines.length > 0
      ? objLines
      : isEn
        ? [
            'Strengthen core competencies and active participation among all participants.',
            'Cultivate critical thinking, teamwork, and practical problem-solving skills.',
            'Measure progress systematically to guide continuous improvement.',
          ]
        : [
            'Memperkasa penguasaan kemahiran teras serta penglibatan aktif peserta.',
            'Memupuk pemikiran kritis, kerja berpasukan dan penyelesaian masalah.',
            'Menilai tahap pencapaian secara sistematik bagi tindakan susulan.',
          ];

  const activities = (
    impLines.length > 0
      ? impLines
      : isEn
        ? [
            'Briefing & Setup: Coordinated schedule, venue readiness, and participant onboarding.',
            'Core Execution: Guided participants through structured hands-on sessions.',
            'Review & Wrap-up: Consolidated findings and documented program outcomes.',
          ]
        : [
            'Taklimat & Persiapan: Penyelarasan jadual, lokasi dan taklimat peserta.',
            'Pelaksanaan Teras: Bimbingan aktiviti berstruktur secara berpusat.',
            'Penilaian & Rumusan: Pengumpulan dapatan serta dokumentasi program.',
          ]
  ).map((line, idx) => splitActivityLine(line, idx, isEn));

  const impacts = (
    impactLines.length > 0
      ? impactLines
      : isEn
        ? [
            'ACHIEVED 100% scheduled participation across the target cohort.',
            'ENHANCED digital confidence and collaborative problem-solving readiness.',
            'DELIVERED clear diagnostic insights for next-cycle planning.',
          ]
        : [
            'MENCAPAI 100% penyertaan kumpulan sasaran mengikut jadual ditetapkan.',
            'MENINGKATKAN keyakinan serta kemahiran aplikasi ilmu dalam kalangan murid.',
            'MENGHASILKAN data dapatan yang jelas bagi perancangan intervensi susulan.',
          ]
  ).map((line, idx) => splitImpactLine(line, idx, isEn));

  const reflectionSentences = data.reflection
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const challenges =
    reflectionSentences.length > 1
      ? [reflectionSentences[0]]
      : isEn
        ? ['Managing schedule transitions and participant pacing within allocated slots.']
        : ['Pengurusan masa peralihan sesi serta tahap kesediaan awal peserta.'];

  const recommendations =
    reflectionSentences.length > 1
      ? reflectionSentences.slice(1, 3)
      : reflectionSentences.length === 1
        ? [reflectionSentences[0]]
        : isEn
          ? [
              'Provide a brief pre-session orientation kit to accelerate participant onboarding.',
              'Maintain continuous follow-up workshops for sustained skill mastery.',
            ]
          : [
              'Menyediakan sesi bimbingan awal sebelum program dilaksanakan.',
              'Meneruskan aktiviti pengukuhan berkala bagi mengekalkan momentum.',
            ];

  const summaryText =
    data.reflection.trim() ||
    (isEn
      ? 'The program was executed smoothly through strong teamwork and clear coordination.'
      : 'Program berjaya dilaksanakan dengan lancar hasil kerjasama padu semua pihak.');

  const outcomeText =
    impacts[0]
      ? `${impacts[0].leadVerb} ${impacts[0].detail}`
      : isEn
        ? 'Positive learning outcomes achieved across the cohort.'
        : 'Impak positif tercapai secara menyeluruh.';

  const yearMatch = `${data.activityTitle} ${data.date}`.match(/\b20\d{2}\b/);
  const heroBadge = yearMatch ? yearMatch[0] : 'OPR';

  const subtitle =
    data.subtitle.trim() ||
    (isEn
      ? `Comprehensive One Page Report for ${data.activityTitle || 'School Program'}`
      : `Laporan Ringkas Satu Muka Surat bagi ${data.activityTitle || 'Program Sekolah'}`);

  const theme: OprThemeConfig = {
    id: `ai-poster-${preset.variant}-${Date.now()}`,
    themeLabel: preset.name,
    layout: 'ai-vibrant-poster',
    fontPair: preset.variant === 'campus-tricolumn' ? 'oswald' : 'bricolage',
    photoFrame: 'framed',
    pattern: 'dots',
    palette: {
      id: `ai-pal-${preset.variant}-${Date.now()}`,
      name: preset.paletteLabel,
      primary: preset.primary,
      secondary: preset.secondary,
      accent: preset.accent,
      surface: '#FFFFFF',
      surfaceTint: preset.surfaceTint,
      inkOnPrimary: preset.inkOnPrimary,
      inkOnSurface: '#0F172A',
      mutedInk: '#475569',
      accentInk: preset.accentInk,
    },
    aiGenerated: true,
    aiDesignNote: `Poster layout generated in ${preset.name} style.`,
    aiPoster: {
      variant: preset.variant,
      styleModifier: preset.styleModifier,
      reportSubtitle: 'ONE PAGE REPORT (OPR)',
      heroBadge,
      schoolMotto: isEn ? 'Learn • Innovate • Excel' : 'Ilmu • Disiplin • Jaya',
      heroTitle: (data.activityTitle || 'PROGRAM SEKOLAH 2026').trim(),
      pillarsTitle: isEn ? '4 Core Focus Areas' : '4 Teras Utama',
      pillars: inferPillars(data),
      objectives,
      activities,
      impacts,
      challenges,
      recommendations,
      summaryText,
      outcomeText,
      closingSlogan: isEn
        ? 'Empowering Future-Ready Learners Through Meaningful Innovation'
        : 'Bersama Membina Generasi Berilmu, Berakhlak dan Berdaya Saing',
    },
  };

  const polished: Partial<OprData> | null = polishContent
    ? {
        subtitle,
        objectives: objectives.join('\n'),
        implementation: activities.map((a) => `${a.title}: ${a.description}`).join('\n'),
        impact: impacts.map((i) => `${i.leadVerb} ${i.detail}`).join('\n'),
        reflection: summaryText,
      }
    : null;

  return { theme, polished };
}

const BM_SAMPLES: Partial<OprData>[] = [
  {
    reportBadge: 'OPR 2026',
    organizationName: 'SEKOLAH MENENGAH KEBANGSAAN TUN PERAK',
    organizationSub: 'AEA4082 · Jalan Tun Perak, 30200 Ipoh, Perak',
    organizerUnit: 'Unit Kokurikulum & Kelab STEM',
    activityTitle: 'Karnival Inovasi STEM & Robotik Peringkat Sekolah 2026',
    subtitle: 'Memupuk kreativiti kejuruteraan, pengekodan dan penyelesaian masalah masa hadapan',
    date: '14 Oktober 2026',
    day: 'Rabu',
    time: '8.00 pagi – 2.00 petang',
    venue: 'Dewan Perdana & Makmal Reka Cipta',
    targetGroup: 'Murid Tingkatan 1 hingga Tingkatan 4 (180 Peserta)',
    objectives:
      'Mendedahkan murid kepada asas reka bentuk robotik, sensor pintar dan pengekodan blok.\nMenggalakkan budaya kerja berpasukan dalam menghasilkan prototaip inovasi lestari.\nMencungkil bakat murid untuk mewakili sekolah ke pertandingan STEM peringkat daerah.',
    implementation:
      'Taklimat & Pendaftaran: Pembahagian kumpulan serta penyerahan kit mikropengawal.\nBengkel Prototaip: Murid membina dan menguji robot pengikut garisan selama 3 jam.\nPameran & Penilaian: Setiap pasukan membentangkan fungsi projek kepada barisan juri.',
    impact:
      'MENCAPAI penyertaan penuh 36 pasukan dengan 100% prototaip berjaya diuji di litar.\nMENINGKATKAN minat dan kefahaman murid terhadap aplikasi sains serta teknologi automasi.\nMELAYAKKAN tiga pasukan terbaik ke peringkat saringan Pertandingan Inovasi Daerah.',
    reflection:
      'Karnival mendapat sambutan amat menggalakkan daripada murid dan guru pembimbing. Cadangan penambahbaikan ialah menyediakan bengkel pra-pengekodan seminggu lebih awal.',
    preparedByName: 'Encik Hafizuddin bin Mansor',
    preparedByRole: 'Ketua Penasihat Kelab STEM',
    verifiedByName: 'Puan Hajah Rohana binti Yusof',
    verifiedByRole: 'Pengetua Cemerlang',
    contactInfo: 'aea4082@moe.edu.my · 05-254 8812',
  },
  {
    reportBadge: 'OPR 2026',
    organizationName: 'SEKOLAH KEBANGSAAN TAMAN MELATI',
    organizationSub: 'WBA0091 · Setapak, 53100 Kuala Lumpur',
    organizerUnit: 'Unit Hal Ehwal Murid & Kelab Alam Sekitar',
    activityTitle: 'Program Sekolah Lestari & Kempen Kitar Semula Hijau 2026',
    subtitle: 'Membina kesedaran kelestarian alam dan amalan hijau dalam komuniti sekolah',
    date: '5 November 2026',
    day: 'Khamis',
    time: '7.45 pagi – 12.30 tengah hari',
    venue: 'Dataran Wawasan & Taman Herba Sekolah',
    targetGroup: 'Semua Warga Sekolah & Persatuan Ibu Bapa',
    objectives:
      'Menanam sikap tanggungjawab terhadap pemeliharaan alam sekitar sejak bangku sekolah.\nMengurangkan sisa pepejal harian melalui pengasingan bahan kitar semula di setiap kelas.\nMengindahkan kawasan taman herba dengan kerjasama komuniti setempat.',
    implementation:
      'Pelancaran Kempen: Ucapan perasmian dan penyerahan tong pengasingan sisa mengikut kelas.\nGotong-Royong Hijau: Penanaman 40 anak pokok herba serta pembersihan zon kompos.\nPertandingan Reka Cipta: Penghasilan bahan bantu belajar menggunakan barangan terpakai.',
    impact:
      'MENGUMPUL lebih 320 kilogram bahan kitar semula kertas, plastik dan aluminium dalam satu hari.\nMENINGKATKAN keceriaan Taman Herba serta kesedaran kebersihan persekitaran kelas.\nMEMUPUK kerjasama erat antara murid, guru dan ibu bapa dalam aktiviti komuniti.',
    reflection:
      'Program berlangsung dalam suasana ceria dan teratur. Jadual kutipan mingguan akan diteruskan setiap hari Jumaat bagi memastikan kelestarian kempen.',
    preparedByName: 'Puan Siti Aishah binti Kamal',
    preparedByRole: 'Penyelaras Program 3K',
    verifiedByName: 'Encik Azman bin Razak',
    verifiedByRole: 'Guru Besar',
    contactInfo: 'wba0091@moe.edu.my · 03-4107 3320',
  },
  {
    reportBadge: 'OPR 2026',
    organizationName: 'SEKOLAH JENIS KEBANGSAAN (C) CHUNG HUA',
    organizationSub: 'PBC1045 · Jalan Sungai Ujong, 70000 Seremban',
    organizerUnit: 'Panitia Bahasa & Pusat Sumber Sekolah',
    activityTitle: 'Minggu Dekad Membaca & Kem Literasi Kreatif 2026',
    subtitle: 'Menyemarakkan budaya membaca, bercerita dan penghasilan karya kreatif murid',
    date: '22 – 24 September 2026',
    day: 'Selasa – Khamis',
    time: '8.00 pagi – 1.00 tengah hari',
    venue: 'Pusat Sumber Bestari & Dewan Mini',
    targetGroup: 'Murid Tahun 1 hingga Tahun 6',
    objectives:
      'Memupuk minat membaca bahan fiksyen dan bukan fiksyen secara konsisten.\nMeningkatkan kemahiran bertutur serta keyakinan murid melalui aktiviti bercerita.\nMemperkenalkan penggunaan platform buku digital Nilam kepada semua murid.',
    implementation:
      'Jom Baca 15 Minit: Sesi bacaan serentak seluruh sekolah pada waktu pagi.\nBengkel Bercerita: Latihan intonasi, ekspresi dan persembahan pentas mengikut tahap.\nPameran Buku Digital: Murid merekod ulasan buku secara interaktif di stesen ICT.',
    impact:
      'MENCATAT peningkatan rekod bacaan Nilam sebanyak 42% berbanding bulan sebelumnya.\nMELAHIRKAN 18 orang pemidato cilik yang berani tampil di hadapan khalayak.\nMEMPERKAYA penguasaan kosa kata dwibahasa murid melalui ulasan kreatif.',
    reflection:
      'Penyertaan murid sangat memberangsangkan sepanjang tiga hari penganjuran. Penambahan koleksi buku bergambar interaktif dicadangkan untuk fasa seterusnya.',
    preparedByName: 'Cik Tan Mei Ling',
    preparedByRole: 'Guru Perpustakaan & Media',
    verifiedByName: 'Puan Lim Siew Hoon',
    verifiedByRole: 'Guru Besar',
    contactInfo: 'pbc1045@moe.edu.my · 06-762 4190',
  },
];

const EN_SAMPLES: Partial<OprData>[] = [
  {
    reportBadge: 'ONE PAGE REPORT',
    organizationName: 'HORIZON STEM & INNOVATION ACADEMY',
    organizationSub: 'District Education Hub · Kuala Lumpur',
    organizerUnit: 'Robotics & Future Skills Department',
    activityTitle: 'Annual STEM & Autonomous Robotics Showcase 2026',
    subtitle: 'Empowering student engineers through hands-on prototyping and coding challenges',
    date: '14 October 2026',
    day: 'Wednesday',
    time: '8:00 AM – 2:00 PM',
    venue: 'Main Innovation Hall & Design Studio',
    targetGroup: 'Lower & Upper Secondary Students (160 Participants)',
    objectives:
      'Introduce students to microcontroller programming, sensor calibration, and mechanical assembly.\nFoster collaborative teamwork through timed engineering problem-solving sprints.\nSelect top student innovators to represent the academy at the regional robotics finals.',
    implementation:
      'Orientation & Kit Issue: Teams received challenge briefs and sensor hardware kits.\nBuild & Test Sprint: Students assembled and debugged autonomous line-following bots.\nDemo & Judging: Teams pitched prototype design choices to an industry judging panel.',
    impact:
      'ACHIEVED 100% completion across 32 student teams on the live test track.\nENHANCED student confidence in applied coding, electronics, and rapid iteration.\nQUALIFIED three top-scoring teams for the upcoming Regional STEM Championship.',
    reflection:
      'Strong mentorship from senior club members kept the build phase energetic and well-paced. Future editions will include a 30-minute pre-event sensor calibration clinic.',
    preparedByName: 'Mr. Amirul Hakim',
    preparedByRole: 'Lead STEM Coordinator',
    verifiedByName: 'Dr. Kavitha Nair',
    verifiedByRole: 'Principal',
    contactInfo: 'stem@horizonacademy.edu · +603-2284 9100',
  },
  {
    reportBadge: 'ONE PAGE REPORT',
    organizationName: 'GREENVALLEY INTERNATIONAL SCHOOL',
    organizationSub: 'Sustainability & Student Life Division · Penang',
    organizerUnit: 'Eco-Council & Community Outreach',
    activityTitle: 'Green Campus Sustainability & Zero-Waste Day 2026',
    subtitle: 'Driving practical environmental stewardship and community recycling habits',
    date: '5 November 2026',
    day: 'Thursday',
    time: '7:45 AM – 12:30 PM',
    venue: 'Central Courtyard & Campus Eco-Garden',
    targetGroup: 'All Students, Faculty & Parent Volunteers',
    objectives:
      'Build daily habits of waste sorting, composting, and plastic reduction across campus.\nRevitalize the school eco-garden with native herbs and drip-irrigation beds.\nEngage families and students in creative upcycling design workshops.',
    implementation:
      'Campus Pledge: Morning assembly launch and distribution of classroom sorting stations.\nEco-Garden Drive: Planted 45 native seedlings and established organic compost bins.\nUpcycle Studio: Students transformed recycled packaging into classroom organizers.',
    impact:
      'COLLECTED over 340 kg of sorted paper, aluminum, and plastic recyclables.\nREDUCED single-use canteen packaging across campus by 60% during event week.\nSTRENGTHENED community partnership with 40 active parent volunteers participating.',
    reflection:
      'Students showed remarkable ownership of the sorting stations throughout the day. Weekly eco-monitor check-ins will sustain momentum across the term.',
    preparedByName: 'Ms. Farah Nadia',
    preparedByRole: 'Eco-Council Advisor',
    verifiedByName: 'Mr. Raymond Chong',
    verifiedByRole: 'Head of Campus',
    contactInfo: 'eco@greenvalley.edu · +604-890 5521',
  },
  {
    reportBadge: 'ONE PAGE REPORT',
    organizationName: 'CRESTWOOD NATIONAL SECONDARY SCHOOL',
    organizationSub: 'Student Leadership & Co-Curricular Unit · Johor Bahru',
    organizerUnit: 'Prefectorial Board & Counseling Unit',
    activityTitle: 'Young Leaders Summit & Teamwork Bootcamp 2026',
    subtitle: 'Cultivating confident communication, ethical leadership, and peer mentorship',
    date: '24 September 2026',
    day: 'Thursday',
    time: '8:00 AM – 4:00 PM',
    venue: 'Multipurpose Hall & Outdoor Training Field',
    targetGroup: 'Student Prefects, Club Presidents & Class Monitors',
    objectives:
      'Develop effective public speaking, conflict resolution, and team coordination skills.\nStrengthen ethical decision-making and accountability among student leaders.\nDraft actionable student welfare initiatives for the upcoming academic semester.',
    implementation:
      'Leadership Forum: Interactive keynote on servant leadership and peer empathy.\nTeam Obstacles: Rotating outdoor problem-solving stations testing communication under pressure.\nAction Blueprint: Student committees presented 2027 campus initiatives to school management.',
    impact:
      'TRAINED 120 student leaders with a 98% positive post-workshop confidence rating.\nPRODUCED five actionable student-led welfare and peer-tutoring proposals.\nBUILT stronger cross-cohort camaraderie across club and class representatives.',
    reflection:
      'Participants responded enthusiastically to scenario-based roleplay exercises. A mid-year follow-up roundtable is scheduled to track implementation of each committee plan.',
    preparedByName: 'Ms. Priya Darshini',
    preparedByRole: 'Student Leadership Advisor',
    verifiedByName: 'Encik Razali bin Osman',
    verifiedByRole: 'Senior Assistant (Student Affairs)',
    contactInfo: 'leadership@crestwood.edu · +607-234 7780',
  },
];

export function pickClientAiSample(
  language: OprLanguage,
  currentActivityTitle?: string
): Partial<OprData> {
  const pool = language === 'en' ? EN_SAMPLES : BM_SAMPLES;
  const filtered = pool.filter(
    (s) => s.activityTitle && s.activityTitle !== currentActivityTitle
  );
  const candidates = filtered.length > 0 ? filtered : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
