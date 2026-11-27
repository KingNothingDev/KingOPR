import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel, type Schema } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '5mb' }));

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please check your API key in Settings > Secrets.'
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function extractReadableError(err: unknown): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err || 'Unknown error');
  let status = 500;
  let message = raw;

  try {
    const parsed = JSON.parse(raw);
    const inner = parsed?.error || parsed;
    if (typeof inner?.code === 'number') {
      status = inner.code;
    }
    if (typeof inner?.message === 'string') {
      message = inner.message;
    }
  } catch {
    if (raw.includes('503') || raw.includes('UNAVAILABLE')) status = 503;
    else if (raw.includes('429') || raw.includes('RESOURCE_EXHAUSTED')) status = 429;
    else if (raw.includes('403') || raw.includes('PERMISSION_DENIED')) status = 403;
    else if (raw.includes('400') || raw.includes('API_KEY_INVALID')) status = 400;
  }

  if (status === 403 || status === 400) {
    message = `${message} Please check your API key in Settings > Secrets.`;
  } else if (raw.includes('ETIMEDOUT')) {
    status = 504;
    message = `AI request timed out waiting for Gemini (${raw}). Please try again.`;
  } else if (status === 503) {
    message =
      'Gemini is temporarily experiencing high demand (503). Please try again in a few seconds, or use Random Format for instant designs.';
  } else if (status === 429) {
    message =
      'Free-tier daily AI quota reached (429). Select a billing-enabled API key in Settings > Secrets for higher quota, or use Random Format for instant designs.';
  }

  return { status, message };
}

function isTransientError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes('503') ||
    msg.includes('UNAVAILABLE') ||
    msg.includes('429') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('overloaded') ||
    msg.includes('high demand') ||
    msg.includes('ECONNRESET') ||
    msg.includes('ETIMEDOUT')
  );
}

const modelQuotaCooldownUntil = new Map<string, number>();

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`ETIMEDOUT: ${label} exceeded ${Math.round(timeoutMs / 1000)}s`)),
      timeoutMs
    );
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function generateStructuredJson(
  ai: GoogleGenAI,
  contents: string,
  responseSchema: Schema
): Promise<string> {
  const deadline = Date.now() + 62000;
  const attempts: {
    model: string;
    thinkingLevel?: ThinkingLevel;
    timeoutMs: number;
    delayMs: number;
  }[] = [
    {
      model: 'gemini-3.1-flash-lite',
      thinkingLevel: ThinkingLevel.MINIMAL,
      timeoutMs: 22000,
      delayMs: 0,
    },
    {
      model: 'gemini-4-hydrogen',
      thinkingLevel: ThinkingLevel.LOW,
      timeoutMs: 38000,
      delayMs: 250,
    },
  ];

  let lastError: unknown;
  for (const attempt of attempts) {
    const cooldown = modelQuotaCooldownUntil.get(attempt.model) ?? 0;
    if (cooldown > Date.now()) {
      continue;
    }
    const remaining = deadline - Date.now();
    if (remaining < 6000) {
      break;
    }
    if (attempt.delayMs > 0) {
      await sleep(attempt.delayMs);
    }
    const perAttemptTimeout = Math.min(attempt.timeoutMs, deadline - Date.now());
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: attempt.model,
          contents,
          config: {
            systemInstruction:
              'Return concise, strictly valid JSON matching the requested schema. Keep every bullet short and punchy.',
            ...(attempt.thinkingLevel
              ? { thinkingConfig: { thinkingLevel: attempt.thinkingLevel } }
              : {}),
            responseMimeType: 'application/json',
            responseSchema,
          },
        }),
        perAttemptTimeout,
        attempt.model
      );
      const text = (response.text ?? '').trim();
      if (!text) {
        throw new Error('Model returned an empty response.');
      }
      return text;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`Gemini attempt failed (${attempt.model}): ${msg}`);
      if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
        modelQuotaCooldownUntil.set(attempt.model, Date.now() + 5 * 60 * 1000);
      }
      lastError = err;
      if (!isTransientError(err)) {
        throw err;
      }
    }
  }
  throw lastError ?? new Error('429 RESOURCE_EXHAUSTED: Free-tier daily quota exceeded.');
}

const VALID_LAYOUTS = [
  'sidebar-ribbon',
  'diagonal-diamond',
  'honeycomb-wave',
  'geometric-circles',
  'broadsheet-blocks',
  'bento-showcase',
  'swiss-editorial',
  'archival-split',
  'swoosh-circles',
  'tri-column-gallery',
  'poster-infographic',
  'numbered-dashboard',
] as const;

const VALID_FONTS = ['jakarta', 'oswald', 'editorial', 'bricolage'] as const;
const VALID_FRAMES = ['rounded', 'sharp', 'framed', 'soft-shadow'] as const;
const VALID_PATTERNS = ['none', 'dots', 'grid', 'diagonal', 'waves'] as const;

function sanitizeHex(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  const trimmed = value.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) return trimmed;
  return fallback;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function darkenHex(hex: string, factor = 0.72): string {
  const [r, g, b] = hexToRgb(hex).map((v) =>
    Math.max(0, Math.min(255, Math.round(v * factor)))
  );
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function tintHex(hex: string, mixWhite = 0.92): string {
  const [r, g, b] = hexToRgb(hex).map((v) =>
    Math.max(0, Math.min(255, Math.round(v * (1 - mixWhite) + 255 * mixWhite)))
  );
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function pickContrastInk(bgHex: string): string {
  return relativeLuminance(bgHex) > 0.36 ? '#0F172A' : '#FFFFFF';
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/opr/ai-random', async (req, res) => {
  try {
    const { data, currentLayout, polishContent } = req.body as {
      data?: Record<string, unknown>;
      currentLayout?: string;
      polishContent?: boolean;
    };

    if (!data || typeof data !== 'object') {
      res.status(400).json({ error: 'Missing report data.' });
      return;
    }

    const ai = getGeminiClient();
    const language = data.language === 'en' ? 'English' : 'Bahasa Melayu';
    const availableLayouts = VALID_LAYOUTS.filter((l) => l !== currentLayout);

    const prompt = `Design a fresh One Page Report (OPR) format in ${language}.
Activity: ${String(data.activityTitle || 'School Activity')} | Org: ${String(data.organizationName || '')}
Objectives: ${String(data.objectives || '')}
Implementation: ${String(data.implementation || '')}
Impact: ${String(data.impact || '')}
Reflection: ${String(data.reflection || '')}

1) Pick a layout from: ${availableLayouts.join(', ')}.
2) Pick fontPair (${VALID_FONTS.join(', ')}), photoFrame (${VALID_FRAMES.join(', ')}), pattern (${VALID_PATTERNS.join(', ')}).
3) Pick a rich dark primaryHex (#RRGGBB) and vivid complementary accentHex (#RRGGBB), plus a 2-3 word themeLabel and short 1-sentence designNote.
4) Provide crisp 1-3 word section titles in ${language} for objectives, implementation, impact, reflection.
${
  polishContent
    ? `5) Polish subtitle (8-12 words), objectives (2-3 newline bullets, no symbols), implementation (2-3 newline points), impact (2-3 newline points), and reflection (2 concise sentences) in ${language} keeping facts accurate.`
    : `5) Leave polished fields empty strings.`
}`;

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        themeLabel: { type: Type.STRING },
        designNote: { type: Type.STRING },
        layout: { type: Type.STRING },
        fontPair: { type: Type.STRING },
        photoFrame: { type: Type.STRING },
        pattern: { type: Type.STRING },
        primaryHex: { type: Type.STRING },
        accentHex: { type: Type.STRING },
        sectionObjectives: { type: Type.STRING },
        sectionImplementation: { type: Type.STRING },
        sectionImpact: { type: Type.STRING },
        sectionReflection: { type: Type.STRING },
        subtitle: { type: Type.STRING },
        objectives: { type: Type.STRING },
        implementation: { type: Type.STRING },
        impact: { type: Type.STRING },
        reflection: { type: Type.STRING },
      },
      required: [
        'themeLabel',
        'designNote',
        'layout',
        'fontPair',
        'photoFrame',
        'pattern',
        'primaryHex',
        'accentHex',
      ],
    };

    const raw = await generateStructuredJson(ai, prompt, schema);
    const parsed = JSON.parse(raw);

    const layout = VALID_LAYOUTS.includes(parsed.layout)
      ? parsed.layout
      : availableLayouts[Math.floor(Math.random() * availableLayouts.length)];
    const fontPair = VALID_FONTS.includes(parsed.fontPair)
      ? parsed.fontPair
      : 'jakarta';
    const photoFrame = VALID_FRAMES.includes(parsed.photoFrame)
      ? parsed.photoFrame
      : 'rounded';
    const pattern = VALID_PATTERNS.includes(parsed.pattern)
      ? parsed.pattern
      : 'dots';

    const primary = sanitizeHex(parsed.primaryHex, '#0F4C2E');
    const accent = sanitizeHex(parsed.accentHex, '#EAB308');

    const sanitizedTheme = {
      id: `ai-${Date.now()}`,
      themeLabel: String(parsed.themeLabel || 'AI Curated Style').slice(0, 40),
      layout,
      fontPair,
      photoFrame,
      pattern,
      palette: {
        id: `ai-pal-${Date.now()}`,
        name: String(parsed.themeLabel || 'AI Custom Palette').slice(0, 32),
        primary,
        secondary: darkenHex(primary, 0.72),
        accent,
        surface: '#FFFFFF',
        surfaceTint: tintHex(primary, 0.93),
        inkOnPrimary: pickContrastInk(primary),
        inkOnSurface: '#0F172A',
        mutedInk: '#475569',
        accentInk: pickContrastInk(accent),
      },
      customSectionTitles: {
        objectives: parsed.sectionObjectives || undefined,
        implementation: parsed.sectionImplementation || undefined,
        impact: parsed.sectionImpact || undefined,
        reflection: parsed.sectionReflection || undefined,
      },
      aiGenerated: true,
      aiDesignNote: String(parsed.designNote || ''),
    };

    res.json({
      theme: sanitizedTheme,
      polished: polishContent
        ? {
            subtitle: parsed.subtitle || '',
            objectives: parsed.objectives || '',
            implementation: parsed.implementation || '',
            impact: parsed.impact || '',
            reflection: parsed.reflection || '',
          }
        : null,
    });
  } catch (err: unknown) {
    console.error('Error in /api/opr/ai-random:', err);
    const { status, message } = extractReadableError(err);
    res.status(status).json({ error: message });
  }
});

app.post('/api/opr/ai-sample', async (req, res) => {
  try {
    const { language } = req.body as { language?: string };
    const langLabel = language === 'en' ? 'English' : 'Bahasa Melayu';
    const ai = getGeminiClient();

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        reportBadge: { type: Type.STRING },
        organizationName: { type: Type.STRING },
        organizationSub: { type: Type.STRING },
        organizerUnit: { type: Type.STRING },
        activityTitle: { type: Type.STRING },
        subtitle: { type: Type.STRING },
        date: { type: Type.STRING },
        day: { type: Type.STRING },
        time: { type: Type.STRING },
        venue: { type: Type.STRING },
        targetGroup: { type: Type.STRING },
        objectives: { type: Type.STRING },
        implementation: { type: Type.STRING },
        impact: { type: Type.STRING },
        reflection: { type: Type.STRING },
        preparedByName: { type: Type.STRING },
        preparedByRole: { type: Type.STRING },
        verifiedByName: { type: Type.STRING },
        verifiedByRole: { type: Type.STRING },
        contactInfo: { type: Type.STRING },
      },
      required: [
        'reportBadge',
        'organizationName',
        'activityTitle',
        'date',
        'venue',
        'targetGroup',
        'objectives',
        'implementation',
        'impact',
        'reflection',
        'preparedByName',
      ],
    };

    const raw = await generateStructuredJson(
      ai,
      `Generate a concise, realistic One Page Report (OPR) sample activity in ${langLabel} (e.g., STEM Robotics Day, Digital Literacy Camp, School Eco-Garden, or Leadership Workshop). Keep all text crisp for a single A4 page. Use 2-3 newline-separated points without bullet symbols for objectives, implementation, and impact.`,
      schema
    );

    const sample = JSON.parse(raw);
    res.json({ sample });
  } catch (err: unknown) {
    console.error('Error in /api/opr/ai-sample:', err);
    const { status, message } = extractReadableError(err);
    res.status(status).json({ error: message });
  }
});

const POSTER_STYLE_ORDER = [
  'playful-illustrated',
  'corporate-ed',
  'futuristic-tech',
] as const;

type PosterStyleModifier = (typeof POSTER_STYLE_ORDER)[number];

const POSTER_STYLE_META: Record<
  PosterStyleModifier,
  {
    label: string;
    paletteName: string;
    promptDirective: string;
    primary: string;
    secondary: string;
    accent: string;
    surfaceTint: string;
  }
> = {
  'playful-illustrated': {
    label: 'AI Poster · Playful & Illustrated',
    paletteName: 'Royal Blue, Yellow, Magenta & Teal',
    promptDirective:
      'Playful & Illustrated: Energetic pastel-and-primary color palette, thick marker brushstrokes, hand-drawn educational doodle icons, rounded bubbly display tone, friendly and approachable youth-focused aesthetic.',
    primary: '#0F2C67',
    secondary: '#1D4ED8',
    accent: '#FACC15',
    surfaceTint: '#EBF6FF',
  },
  'corporate-ed': {
    label: 'AI Poster · Bold Corporate-Ed',
    paletteName: 'Royal Navy & Metallic Gold',
    promptDirective:
      'Bold & Dynamic Corporate-Ed: High-contrast royal blue and gold executive tone, sharp diagonal energy, structured authoritative 2-column infographic messaging, crisp and impactful.',
    primary: '#0A1F52',
    secondary: '#1E3A8A',
    accent: '#F59E0B',
    surfaceTint: '#F1F5F9',
  },
  'futuristic-tech': {
    label: 'AI Poster · Futuristic AI-Tech',
    paletteName: 'Deep Indigo, Neon Cyan & Violet',
    promptDirective:
      'Futuristic / AI-Tech Upgrade: Modern glassmorphism aesthetic, forward-looking digital innovation tone, sleek neon cyan & violet accents, ultra-clean executive clarity.',
    primary: '#0F172A',
    secondary: '#4F46E5',
    accent: '#06B6D4',
    surfaceTint: '#EEF2FF',
  },
};

const POSTER_VARIANT_ORDER = [
  'vibrant-bento',
  'sticker-cloud',
  'campus-tricolumn',
  'editorial-3d',
] as const;

type PosterVariant = (typeof POSTER_VARIANT_ORDER)[number];

const POSTER_VARIANT_META: Record<
  PosterVariant,
  {
    name: string;
    styleModifier: PosterStyleModifier;
    paletteName: string;
    promptDirective: string;
    primary: string;
    secondary: string;
    accent: string;
    surfaceTint: string;
  }
> = {
  'vibrant-bento': {
    name: 'AI Vibrant Sky Bento',
    styleModifier: 'playful-illustrated',
    paletteName: 'Cobalt Blue, Sunshine Gold & Magenta',
    promptDirective:
      'Vibrant Sky Bento Poster (Google Gemini infographic style): Luminous sky-blue campus banner, 3D brush-stroke hero title with white sticker outline, 5 numbered colorful ribbon bento cards, energetic educational tone.',
    primary: '#0F2C67',
    secondary: '#1D4ED8',
    accent: '#FACC15',
    surfaceTint: '#EBF6FF',
  },
  'sticker-cloud': {
    name: 'AI Sticker Cloud Infographic',
    styleModifier: 'playful-illustrated',
    paletteName: 'Sky Azure, Sunny Yellow & Rose Pink',
    promptDirective:
      'Illustrated Sticker Cloud Poster (ChatGPT illustrated poster style): Playful bright pastel sky backdrop, chunky white-outlined 3D sticker hero title, 4 colorful illustrated focus pillar tiles, pastel brushstroke numbered objective strips, lively youth-centered tone.',
    primary: '#0C2D6B',
    secondary: '#0284C7',
    accent: '#FACC15',
    surfaceTint: '#EFF8FF',
  },
  'campus-tricolumn': {
    name: 'AI Emerald Campus 3-Column',
    styleModifier: 'corporate-ed',
    paletteName: 'Lush Emerald & Sunlit Gold',
    promptDirective:
      'Sunlit Emerald Campus 3-Column Poster (Gemini school infographic style): Radiant emerald and sunlit gold organic swoosh header, executive floating metadata bar, 3 equal vertical numbered columns (Objectives, Implementation, Impact), full-width photo documentation showcase, and 3 bottom summary cards (Recommendations, Summary, Outcome).',
    primary: '#065F46',
    secondary: '#047857',
    accent: '#F59E0B',
    surfaceTint: '#ECFDF5',
  },
  'editorial-3d': {
    name: 'AI Editorial 3D Indigo',
    styleModifier: 'futuristic-tech',
    paletteName: 'Royal Indigo, Neon Cyan & Amber',
    promptDirective:
      'Modern Executive 3D Editorial Poster (ChatGPT / Gemini studio infographic style): Deep royal indigo architectural 3D header with glowing cyan and amber light beams, floating frosted metadata strip, connected vertical milestone timeline, bold impact callouts, and sleek executive clarity.',
    primary: '#1E1B4B',
    secondary: '#4338CA',
    accent: '#06B6D4',
    surfaceTint: '#EEF2FF',
  },
};

const VALID_PILLAR_ICONS = [
  'book',
  'flask',
  'calculator',
  'coins',
  'cpu',
  'trophy',
  'heart',
  'globe',
  'sparkles',
  'shield',
  'rocket',
  'users',
] as const;

app.post('/api/opr/ai-poster', async (req, res) => {
  try {
    const {
      data,
      polishContent,
      variationSeed,
      previousVariant,
      previousStyle,
    } = req.body as {
      data?: Record<string, unknown>;
      polishContent?: boolean;
      variationSeed?: number;
      previousVariant?: string;
      previousStyle?: string;
    };

    if (!data || typeof data !== 'object') {
      res.status(400).json({ error: 'Missing report data.' });
      return;
    }

    const ai = getGeminiClient();
    const isEn = data.language === 'en';
    const language = isEn ? 'English' : 'Bahasa Melayu';

    // Pick a random AI Poster architecture guaranteed different from the previous one
    const candidates = POSTER_VARIANT_ORDER.filter((v) => v !== previousVariant);
    const seedNum = Math.abs(Number(variationSeed || Date.now()));
    const nextVariant: PosterVariant =
      candidates[seedNum % candidates.length] || POSTER_VARIANT_ORDER[0];
    const variantMeta = POSTER_VARIANT_META[nextVariant];

    const prevStyleIdx = POSTER_STYLE_ORDER.indexOf(
      previousStyle as PosterStyleModifier
    );
    const nextStyle: PosterStyleModifier =
      variantMeta.styleModifier ||
      POSTER_STYLE_ORDER[(prevStyleIdx + 1) % POSTER_STYLE_ORDER.length];

    const prompt = `Generate concise A4 One Page Report (OPR) infographic poster JSON strictly in ${language} for style "${variantMeta.name}".
Org: ${String(data.organizationName || 'Sekolah Kebangsaan Malaysia')} | Title: ${String(data.activityTitle || 'Program Kecemerlangan 2026')} | Unit: ${String(data.organizerUnit || '')}
Meta: ${String(data.date || '')} | ${String(data.time || '')} | ${String(data.venue || '')} | ${String(data.targetGroup || '')}
Objectives: ${String(data.objectives || '')}
Implementation: ${String(data.implementation || '')}
Impact: ${String(data.impact || '')}
Reflection: ${String(data.reflection || '')}
Seed: ${seedNum}

Rules (keep every item 6–10 words max, no bullet symbols):
- paletteLabel (2-3 words), primaryHex (#RRGGBB dark), accentHex (#RRGGBB vivid)
- heroBadge (1 short word like "OPR" or "2026"), schoolMotto (3-5 words), subtitle (7-10 words)
- pillarsTitle (2-3 words), pillars (4 items: 1-2 word label + icon from ${VALID_PILLAR_ICONS.join(', ')})
- objectives (3 concise points), activities (4 steps: 2-3 word title + 6-8 word description)
- impacts (4 points: 1-word UPPERCASE leadVerb + 6-8 word detail)
- challenges (2 points), recommendations (3 points)
- summaryText (2 short sentences), outcomeText (1 short sentence), closingSlogan (6-8 words), designNote (1 short sentence).`;

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        paletteLabel: { type: Type.STRING },
        primaryHex: { type: Type.STRING },
        accentHex: { type: Type.STRING },
        heroBadge: { type: Type.STRING },
        schoolMotto: { type: Type.STRING },
        subtitle: { type: Type.STRING },
        pillarsTitle: { type: Type.STRING },
        pillars: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              icon: { type: Type.STRING },
            },
            required: ['label', 'icon'],
          },
        },
        objectives: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        activities: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ['title', 'description'],
          },
        },
        impacts: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              leadVerb: { type: Type.STRING },
              detail: { type: Type.STRING },
            },
            required: ['leadVerb', 'detail'],
          },
        },
        challenges: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        recommendations: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        summaryText: { type: Type.STRING },
        outcomeText: { type: Type.STRING },
        closingSlogan: { type: Type.STRING },
        designNote: { type: Type.STRING },
      },
      required: [
        'paletteLabel',
        'primaryHex',
        'accentHex',
        'heroBadge',
        'schoolMotto',
        'subtitle',
        'pillarsTitle',
        'pillars',
        'objectives',
        'activities',
        'impacts',
        'challenges',
        'recommendations',
        'summaryText',
        'outcomeText',
        'closingSlogan',
        'designNote',
      ],
    };

    const raw = await generateStructuredJson(ai, prompt, schema);
    const parsed = JSON.parse(raw);

    const primary = sanitizeHex(parsed.primaryHex, variantMeta.primary);
    const accent = sanitizeHex(parsed.accentHex, variantMeta.accent);
    const fontPair =
      nextVariant === 'campus-tricolumn' ? 'oswald' : 'bricolage';
    const photoFrame = 'framed';
    const pattern = 'dots';

    const objectives = Array.isArray(parsed.objectives)
      ? parsed.objectives.map((s: unknown) => String(s).trim()).filter(Boolean).slice(0, 4)
      : [];
    const activities = Array.isArray(parsed.activities)
      ? parsed.activities
          .map((item: { title?: unknown; description?: unknown }, idx: number) => ({
            title: String(item?.title || (isEn ? `Step ${idx + 1}` : `Fasa ${idx + 1}`)).trim(),
            description: String(item?.description || '').trim(),
          }))
          .filter((a: { description: string }) => a.description.length > 0)
          .slice(0, 4)
      : [];
    const impacts = Array.isArray(parsed.impacts)
      ? parsed.impacts
          .map((item: { leadVerb?: unknown; detail?: unknown }) => ({
            leadVerb: String(
              item?.leadVerb || (isEn ? 'ENHANCED' : 'MENINGKATKAN')
            )
              .trim()
              .toUpperCase(),
            detail: String(item?.detail || '').trim(),
          }))
          .filter((i: { detail: string }) => i.detail.length > 0)
          .slice(0, 4)
      : [];
    const challenges = Array.isArray(parsed.challenges)
      ? parsed.challenges.map((s: unknown) => String(s).trim()).filter(Boolean).slice(0, 3)
      : [];
    const recommendations = Array.isArray(parsed.recommendations)
      ? parsed.recommendations.map((s: unknown) => String(s).trim()).filter(Boolean).slice(0, 4)
      : [];
    const pillars = Array.isArray(parsed.pillars)
      ? parsed.pillars
          .map((p: { label?: unknown; icon?: unknown }, idx: number) => {
            const rawIcon = String(p?.icon || '').trim().toLowerCase();
            const icon = (VALID_PILLAR_ICONS as readonly string[]).includes(rawIcon)
              ? rawIcon
              : VALID_PILLAR_ICONS[idx % VALID_PILLAR_ICONS.length];
            return {
              label: String(p?.label || (isEn ? `Focus ${idx + 1}` : `Teras ${idx + 1}`)).trim(),
              icon,
            };
          })
          .filter((p: { label: string }) => p.label.length > 0)
          .slice(0, 4)
      : [];

    const aiPoster = {
      variant: nextVariant,
      styleModifier: nextStyle,
      reportSubtitle: 'ONE PAGE REPORT (OPR)',
      heroBadge: String(parsed.heroBadge || 'OPR').trim().slice(0, 14),
      schoolMotto: String(
        parsed.schoolMotto || (isEn ? 'Learn • Innovate • Excel' : 'Ilmu • Disiplin • Jaya')
      ).trim(),
      heroTitle: String(data.activityTitle || 'PROGRAM SEKOLAH 2026').trim(),
      pillarsTitle: String(
        parsed.pillarsTitle || (isEn ? '4 Core Focus Areas' : '4 Teras Utama')
      ).trim(),
      pillars,
      objectives,
      activities,
      impacts,
      challenges,
      recommendations,
      summaryText: String(parsed.summaryText || '').trim(),
      outcomeText: String(parsed.outcomeText || '').trim(),
      closingSlogan: String(
        parsed.closingSlogan ||
          (isEn
            ? 'Empowering Future-Ready Learners Through Meaningful Innovation'
            : 'Bersama Membina Generasi Berilmu, Berakhlak dan Berdaya Saing')
      ).trim(),
    };

    const paletteTitle = String(parsed.paletteLabel || variantMeta.paletteName).slice(0, 30);

    const enhancedTheme = {
      id: `ai-poster-${nextVariant}-${Date.now()}`,
      themeLabel: variantMeta.name,
      layout: 'ai-vibrant-poster',
      fontPair,
      photoFrame,
      pattern,
      palette: {
        id: `ai-pal-${nextVariant}-${Date.now()}`,
        name: paletteTitle,
        primary,
        secondary: darkenHex(primary, 0.76),
        accent,
        surface: '#FFFFFF',
        surfaceTint: tintHex(primary, 0.93),
        inkOnPrimary: pickContrastInk(primary),
        inkOnSurface: '#0F172A',
        mutedInk: '#475569',
        accentInk: pickContrastInk(accent),
      },
      aiGenerated: true,
      aiDesignNote: String(
        parsed.designNote || `AI Poster generated in ${variantMeta.name} style.`
      ),
      aiPoster,
    };

    res.json({
      theme: enhancedTheme,
      polished: polishContent
        ? {
            subtitle: String(parsed.subtitle || '').trim(),
            objectives: objectives.join('\n'),
            implementation: activities
              .map((a: { title: string; description: string }) => `${a.title}: ${a.description}`)
              .join('\n'),
            impact: impacts
              .map((i: { leadVerb: string; detail: string }) => `${i.leadVerb} ${i.detail}`)
              .join('\n'),
            reflection:
              String(parsed.summaryText || '').trim() ||
              [...challenges.slice(0, 1), ...recommendations.slice(0, 2)].join(' '),
          }
        : null,
    });
  } catch (err: unknown) {
    console.error('Error in /api/opr/ai-poster:', err);
    const { status, message } = extractReadableError(err);
    res.status(status).json({ error: message });
  }
});

// Ensure unknown /api/* routes always return JSON instead of HTML
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API endpoint not found.' });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OPR Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
