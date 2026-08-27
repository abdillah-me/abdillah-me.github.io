# Portfolio Next.js Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **GSAP tasks:** before writing GSAP code (Tasks 9, 11), invoke the `gsap-skills:gsap-core` and `gsap-skills:gsap-react` skills; invoke `gsap-skills:gsap-scrolltrigger` additionally for any scroll-triggered task (Tasks 9, 11, 12, 13, 14, 15, 18).

**Goal:** Rebuild the "Raka Pratama" personal-branding portfolio (currently a Claude Design HTML handoff) as a responsive, SEO-optimized Next.js + TypeScript site, with all content externalized to a single editable `data/data.json`.

**Architecture:** Next.js App Router with four routes (`/`, `/work`, `/blog`, `/contact`) sharing `Nav`/`Footer` components. All content is read from `data/data.json` through a typed `lib/data.ts` loader. Presentational components live under `components/`, pure/testable logic (filtering, formatting, typewriter state) is extracted into small functions under `lib/`, and animation (typing, counters, scroll-reveal) is wired with GSAP + `@gsap/react` on top of those pure functions.

**Tech Stack:** Next.js (App Router) + TypeScript, Tailwind CSS v4, `next/font/google` (JetBrains Mono, Space Grotesk), GSAP + `@gsap/react` + `ScrollTrigger`, Vitest + React Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-26-portfolio-nextjs-migration-design.md`

## Global Constraints

- Single content source: `data/data.json` — no other file may hardcode profile/stats/skills/experience/projects/blog/testimonials text.
- Contact form is UI-only (client-side simulated success), no API route, no email provider.
- Blog is list-only — no `/blog/[slug]` detail route.
- Nav has no hamburger menu — 4 links, `flex-wrap` only.
- `next/image` used for any image with a non-null `image` path in `data.json`; a placeholder block renders when `image` is `null`.
- All pages must export `generateMetadata` using values from `data.seo`.
- No dead `href="#"` links — omit the link entirely when a project has no `liveUrl`/`codeUrl`.

---

## Task 1: Project Scaffolding

**Files:**
- Create: whole Next.js project at repo root (`package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `postcss.config.mjs`, `.eslintrc`/`eslint.config.mjs`)

**Interfaces:**
- Produces: a running Next.js dev server, the `@/*` import alias (from `tsconfig.json`), and the base `app/` directory later tasks add files into.

- [ ] **Step 1: Scaffold the app**

Run in the project root (`/Users/abdillah/Documents/Code/Projects/Personal Portofolio Website`):

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --turbopack --use-npm
```

When prompted about the current directory not being empty (it contains the `personal-branding-website-design/` folder and `docs/`), confirm proceeding — it will only add project files, not touch existing folders.

- [ ] **Step 2: Verify the dev server runs**

Run: `npm run dev -- --port 4001 &` then `curl -sf http://localhost:4001 > /dev/null && echo OK`
Expected: `OK` printed, then stop the dev server (`kill %1`).

- [ ] **Step 3: Install runtime dependencies**

```bash
npm install gsap @gsap/react
```

- [ ] **Step 4: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js + TypeScript + Tailwind project"
```

(This is the first commit — `git init` is required since the directory is not yet a git repo.)

---

## Task 2: Testing Infrastructure

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `lib/sample.test.ts` (throwaway smoke test, deleted at end of task)
- Modify: `package.json` (add `test`/`test:watch` scripts)

**Interfaces:**
- Produces: `npm test` running Vitest with jsdom + Testing Library matchers available to every later task's tests.

- [ ] **Step 1: Install test dependencies**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Create Vitest config**

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

`vitest.setup.ts`:
```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 3: Add npm scripts**

In `package.json` `"scripts"`, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Write a smoke test to prove the setup works**

`lib/sample.test.ts`:
```ts
import { describe, it, expect } from 'vitest';

describe('vitest setup', () => {
  it('runs a basic assertion', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: Run it and verify it passes**

Run: `npm test`
Expected: `lib/sample.test.ts` passes (1 test).

- [ ] **Step 6: Delete the smoke test**

```bash
rm lib/sample.test.ts
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: set up Vitest + React Testing Library"
```

---

## Task 3: Design Tokens & Fonts

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx` (font loading only in this task — metadata/JSON-LD come in Task 8)

**Interfaces:**
- Produces: Tailwind utility classes `bg-cream`, `bg-ink`, `text-ink`, `text-cream`, `bg-accent-green`, `text-accent-green`, `bg-accent-orange`, `text-accent-orange`, `border-ink`, plus `font-mono` (JetBrains Mono) and `font-sans` (Space Grotesk), usable by every component task below.

- [ ] **Step 1: Replace `app/globals.css` theme tokens**

```css
@import "tailwindcss";

@theme {
  --color-cream: oklch(97% 0.015 85);
  --color-cream-dim: oklch(93% 0.02 85);
  --color-ink: oklch(20% 0.02 85);
  --color-ink-dim: oklch(35% 0.02 85);
  --color-accent-green: oklch(55% 0.15 150);
  --color-accent-green-soft: oklch(90% 0.06 150);
  --color-accent-orange: oklch(70% 0.15 55);

  --font-mono: var(--font-jetbrains-mono);
  --font-sans: var(--font-space-grotesk);
}

@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes floaty {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

body {
  background: var(--color-cream);
  color: var(--color-ink);
  font-family: var(--font-sans);
}
```

- [ ] **Step 2: Load fonts in `app/layout.tsx`**

```tsx
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-jetbrains-mono',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${jetbrainsMono.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Verify build succeeds**

Run: `npm run build`
Expected: build completes with no errors (metadata is still the CRA default at this point — that's expected, Task 8 replaces it).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add design tokens and self-hosted fonts"
```

---

## Task 4: Data Types & Loader

**Files:**
- Create: `lib/types.ts`
- Create: `data/data.json`
- Create: `lib/data.ts`
- Test: `lib/data.test.ts`

**Interfaces:**
- Produces: `import { data } from '@/lib/data'` — a fully-typed `PortfolioData` object every later component reads from. This is the interface every subsequent task depends on.

- [ ] **Step 1: Write failing test for the data loader**

`lib/data.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { data } from './data';

describe('portfolio data', () => {
  it('has all required top-level sections', () => {
    expect(data.profile).toBeDefined();
    expect(Array.isArray(data.stats)).toBe(true);
    expect(data.about).toBeDefined();
    expect(data.skills).toBeDefined();
    expect(Array.isArray(data.education)).toBe(true);
    expect(Array.isArray(data.experience)).toBe(true);
    expect(Array.isArray(data.projects)).toBe(true);
    expect(Array.isArray(data.blog)).toBe(true);
    expect(Array.isArray(data.testimonials)).toBe(true);
    expect(data.footer).toBeDefined();
    expect(data.seo).toBeDefined();
  });

  it('has at least one featured project', () => {
    expect(data.projects.some((p) => p.featured)).toBe(true);
  });

  it('has three stats matching the hero counters', () => {
    expect(data.stats).toHaveLength(3);
  });
});
```

- [ ] **Step 2: Run it and verify it fails**

Run: `npm test -- lib/data.test.ts`
Expected: FAIL — `Cannot find module './data'`.

- [ ] **Step 3: Write `lib/types.ts`**

```ts
export interface Profile {
  name: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  openToWork: boolean;
  terminalLines: { prefix: string; text: string }[];
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface SkillItem {
  name: string;
  level: 1 | 2 | 3 | 4;
}

export interface SkillGroup {
  title: string;
  color: string;
  items: SkillItem[];
}

export interface EducationEntry {
  year: string;
  school: string;
  degree: string;
}

export interface ExperienceEntry {
  role: string;
  company: string;
  location: string;
  period: string;
  points: string[];
  tags: string[];
  dotColor: string;
}

export type ProjectCategory = 'web' | 'mobile' | 'backend' | 'ai' | 'automation';

export interface Project {
  name: string;
  category: ProjectCategory;
  desc: string;
  tags: string[];
  image: string | null;
  liveUrl: string | null;
  codeUrl: string | null;
  featured: boolean;
}

export interface BlogPost {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface FooterData {
  tagline: string;
  socialLinks: { github: string; linkedin: string; email: string };
}

export interface SeoData {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  ogImage: string;
  twitterHandle: string;
  locale: string;
  keywords: string[];
}

export interface PortfolioData {
  profile: Profile;
  stats: Stat[];
  about: { paragraphs: string[]; traits: string[] };
  skills: { groups: SkillGroup[]; tools: string[] };
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: Project[];
  blog: BlogPost[];
  testimonials: Testimonial[];
  footer: FooterData;
  seo: SeoData;
}
```

- [ ] **Step 4: Write `data/data.json`**

```json
{
  "profile": {
    "name": "Raka Pratama",
    "role": "Software Engineer",
    "tagline": "Software engineer fullstack yang senang mengubah ide berantakan jadi produk yang jalan. Fokus di web, mobile, dan otomasi berbasis AI.",
    "location": "Jakarta, Indonesia (remote-friendly)",
    "email": "hello@rakapratama.dev",
    "github": "https://github.com/rakapratama",
    "linkedin": "https://linkedin.com/in/rakapratama",
    "openToWork": true,
    "terminalLines": [
      { "prefix": "$ ", "text": "whoami" },
      { "prefix": "", "text": "Raka Pratama — Software Engineer" },
      { "prefix": "$ ", "text": "stack --primary" },
      { "prefix": "", "text": "TypeScript · React · Node.js · Python" },
      { "prefix": "$ ", "text": "location" },
      { "prefix": "", "text": "Jakarta, Indonesia (remote-friendly)" },
      { "prefix": "$ ", "text": "status" }
    ]
  },
  "stats": [
    { "value": 4, "suffix": "+", "label": "tahun pengalaman" },
    { "value": 30, "suffix": "+", "label": "proyek diselesaikan" },
    { "value": 12, "suffix": "", "label": "teknologi dikuasai" }
  ],
  "about": {
    "paragraphs": [
      "Saya Raka, software engineer yang mulai belajar coding dari mengutak-atik forum game waktu SMA — dan sampai sekarang belum berhenti penasaran. Sekarang fokus membangun produk web & mobile yang cepat, rapi, dan enak dipakai.",
      "Beberapa tahun terakhir banyak berkutat dengan sistem yang harus scale, integrasi API yang berantakan, dan belakangan mulai serius eksplorasi automasi berbasis AI untuk mempercepat kerja tim.",
      "Di luar layar: ngopi, baca komik, dan sesekali nulis di blog soal hal-hal teknis yang baru dipelajari."
    ],
    "traits": ["problem solver", "detail-oriented", "suka automasi", "team player"]
  },
  "skills": {
    "groups": [
      {
        "title": "Frontend",
        "color": "oklch(55% 0.15 150)",
        "items": [
          { "name": "React / Next.js", "level": 4 },
          { "name": "TypeScript", "level": 4 },
          { "name": "CSS / Tailwind", "level": 4 },
          { "name": "React Native", "level": 3 }
        ]
      },
      {
        "title": "Backend",
        "color": "oklch(60% 0.14 85)",
        "items": [
          { "name": "Node.js / Express", "level": 4 },
          { "name": "PostgreSQL", "level": 3 },
          { "name": "REST & GraphQL API", "level": 4 },
          { "name": "Redis", "level": 3 }
        ]
      },
      {
        "title": "AI & Automasi",
        "color": "oklch(70% 0.15 55)",
        "items": [
          { "name": "LLM API Integration", "level": 3 },
          { "name": "Python", "level": 4 },
          { "name": "Workflow Automation", "level": 3 },
          { "name": "Prompt Engineering", "level": 3 }
        ]
      },
      {
        "title": "Infra & Tools",
        "color": "oklch(45% 0.02 85)",
        "items": [
          { "name": "Docker", "level": 3 },
          { "name": "AWS", "level": 3 },
          { "name": "CI/CD", "level": 3 },
          { "name": "Git", "level": 4 }
        ]
      }
    ],
    "tools": ["VS Code", "Figma", "Postman", "Linear", "Notion", "Vercel", "GitHub Actions", "Supabase", "n8n"]
  },
  "education": [
    { "year": "2016–2020", "school": "Universitas Indonesia", "degree": "S.Kom, Teknik Informatika" },
    { "year": "2021", "school": "Dicoding Academy", "degree": "Sertifikasi Backend & Cloud Engineer" }
  ],
  "experience": [
    {
      "role": "Senior Software Engineer",
      "company": "Vela Teknologi",
      "location": "Jakarta",
      "period": "2023 — sekarang",
      "dotColor": "oklch(55% 0.15 150)",
      "points": [
        "Memimpin migrasi monolith ke microservices, menurunkan latency API rata-rata 40%.",
        "Membangun pipeline automasi berbasis LLM untuk triage tiket support, hemat ~15 jam/minggu tim ops.",
        "Mentoring 3 engineer junior dan menstandarkan code review process."
      ],
      "tags": ["TypeScript", "Node.js", "AWS", "PostgreSQL"]
    },
    {
      "role": "Software Engineer",
      "company": "Nimbus Labs",
      "location": "Jakarta (remote)",
      "period": "2021 — 2023",
      "dotColor": "oklch(60% 0.14 85)",
      "points": [
        "Membangun dashboard analytics realtime dipakai 200+ pengguna internal harian.",
        "Mengembangkan REST & WebSocket API untuk fitur kolaborasi live.",
        "Menulis test suite yang menaikkan coverage dari 32% ke 78%."
      ],
      "tags": ["React", "Express", "WebSocket", "Docker"]
    },
    {
      "role": "Frontend Engineer",
      "company": "Studio Kecil",
      "location": "Bandung",
      "period": "2020 — 2021",
      "dotColor": "oklch(70% 0.15 55)",
      "points": [
        "Membangun 6+ landing page & aplikasi web untuk klien UMKM.",
        "Menyusun component library internal untuk mempercepat delivery proyek."
      ],
      "tags": ["React", "Figma", "Tailwind"]
    },
    {
      "role": "Software Engineering Intern",
      "company": "Startup Pagi",
      "location": "Jakarta",
      "period": "2019 — 2020",
      "dotColor": "oklch(50% 0.02 85)",
      "points": [
        "Membantu membangun fitur checkout untuk aplikasi marketplace UMKM.",
        "Belajar dasar CI/CD dan code review process di tim produksi."
      ],
      "tags": ["JavaScript", "MySQL"]
    }
  ],
  "projects": [
    { "name": "Nimbus Analytics Dashboard", "category": "web", "desc": "Dashboard realtime untuk tim ops dengan visualisasi live metrics.", "tags": ["React", "WebSocket", "D3"], "image": null, "liveUrl": null, "codeUrl": null, "featured": true },
    { "name": "Loop AI Assistant", "category": "ai", "desc": "Asisten LLM untuk triage & auto-response tiket support internal.", "tags": ["Python", "OpenAI API", "FastAPI"], "image": null, "liveUrl": null, "codeUrl": null, "featured": true },
    { "name": "Pasar Lokal App", "category": "mobile", "desc": "Marketplace UMKM dengan katalog, chat, dan pembayaran terintegrasi.", "tags": ["React Native", "Node.js"], "image": null, "liveUrl": null, "codeUrl": null, "featured": true },
    { "name": "DevFlow CLI", "category": "backend", "desc": "CLI internal untuk scaffolding service baru dalam hitungan detik.", "tags": ["Go", "Cobra"], "image": null, "liveUrl": null, "codeUrl": null, "featured": false },
    { "name": "Resep Rumahan", "category": "web", "desc": "Platform berbagi resep dengan pencarian berbasis bahan yang ada.", "tags": ["Next.js", "Postgres"], "image": null, "liveUrl": null, "codeUrl": null, "featured": false },
    { "name": "AutoInvoice", "category": "automation", "desc": "Automasi pembuatan & pengiriman invoice bulanan dari data spreadsheet.", "tags": ["Python", "Zapier", "GCP"], "image": null, "liveUrl": null, "codeUrl": null, "featured": false },
    { "name": "FitTrack Mobile", "category": "mobile", "desc": "Aplikasi pelacak kebugaran dengan sinkronisasi wearable.", "tags": ["Flutter", "Firebase"], "image": null, "liveUrl": null, "codeUrl": null, "featured": false },
    { "name": "Kode Bareng", "category": "web", "desc": "Platform belajar coding kolaboratif dengan editor realtime.", "tags": ["React", "Socket.io", "Redis"], "image": null, "liveUrl": null, "codeUrl": null, "featured": false },
    { "name": "Notif Cerdas", "category": "ai", "desc": "Sistem prioritas notifikasi berbasis machine learning ringan.", "tags": ["Python", "scikit-learn"], "image": null, "liveUrl": null, "codeUrl": null, "featured": false }
  ],
  "blog": [
    { "title": "Belajar dari Migrasi Monolith ke Microservices", "date": "Jun 2026", "excerpt": "Hal-hal yang saya harap tahu sebelum mulai memecah sistem lama jadi service kecil.", "tags": ["backend", "arsitektur"] },
    { "title": "Membangun Asisten Support dengan LLM di Produksi", "date": "Apr 2026", "excerpt": "Catatan praktis soal prompt, guardrail, dan evaluasi ketika AI menyentuh pelanggan asli.", "tags": ["ai", "produksi"] },
    { "title": "Kenapa Saya Berhenti Over-engineering Komponen React", "date": "Feb 2026", "excerpt": "Pelajaran soal abstraksi dini yang justru memperlambat tim.", "tags": ["frontend"] },
    { "title": "Automasi Kecil yang Menghemat 10 Jam Sebulan", "date": "Des 2025", "excerpt": "Script sederhana sering lebih berdampak daripada tool mahal.", "tags": ["automasi"] },
    { "title": "Panduan Onboarding Engineer Baru ala Tim Kami", "date": "Okt 2025", "excerpt": "Checklist yang kami pakai supaya hari pertama tidak membingungkan.", "tags": ["tim", "proses"] }
  ],
  "testimonials": [
    { "quote": "Raka bikin fitur kompleks kerasa sederhana. Kualitas kode dan komunikasinya konsisten.", "name": "Dewi Anggraini", "role": "Product Manager, Vela Teknologi" },
    { "quote": "Salah satu engineer paling reliable yang pernah saya kerja sama. Selalu tepat waktu, jarang ada bug lolos.", "name": "Bimo Santoso", "role": "Engineering Lead, Nimbus Labs" },
    { "quote": "Ide automasinya menghemat waktu tim kami berjam-jam tiap minggu. Sangat direkomendasikan.", "name": "Clara Wijaya", "role": "Ops Manager, Studio Kecil" }
  ],
  "footer": {
    "tagline": "Software engineer di Jakarta. Fullstack, occasionally automasi hal-hal yang tidak seharusnya perlu diotomasi.",
    "socialLinks": {
      "github": "https://github.com/rakapratama",
      "linkedin": "https://linkedin.com/in/rakapratama",
      "email": "hello@rakapratama.dev"
    }
  },
  "seo": {
    "siteName": "Raka Pratama — Portfolio",
    "siteUrl": "https://rakapratama.dev",
    "defaultTitle": "Raka Pratama — Software Engineer",
    "defaultDescription": "Software engineer fullstack berbasis di Jakarta, fokus di web, mobile, dan otomasi berbasis AI.",
    "ogImage": "/images/og-image.png",
    "twitterHandle": "@rakapratama",
    "locale": "id_ID",
    "keywords": ["software engineer", "fullstack developer", "react developer", "next.js developer", "jakarta", "portfolio"]
  }
}
```

- [ ] **Step 5: Write `lib/data.ts`**

```ts
import rawData from '@/data/data.json';
import type { PortfolioData } from './types';

export const data: PortfolioData = rawData as PortfolioData;
```

- [ ] **Step 6: Run the test and verify it passes**

Run: `npm test -- lib/data.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add typed data.json content layer"
```

---

## Task 5: UI Primitives (SectionHeading, Chip, TerminalWindow)

**Files:**
- Create: `components/ui/section-heading.tsx`
- Create: `components/ui/chip.tsx`
- Create: `components/ui/terminal-window.tsx`
- Test: `components/ui/section-heading.test.tsx`
- Test: `components/ui/chip.test.tsx`
- Test: `components/ui/terminal-window.test.tsx`

**Interfaces:**
- Produces: `<SectionHeading eyebrow="/ / keahlian teknis" title="..." />`, `<Chip>label</Chip>`, `<TerminalWindow title="whoami.sh">children</TerminalWindow>` — used by every Home/Work/Blog/Contact component below.

- [ ] **Step 1: Write failing tests**

`components/ui/section-heading.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SectionHeading } from './section-heading';

describe('SectionHeading', () => {
  it('renders eyebrow and title', () => {
    render(<SectionHeading eyebrow="/ / keahlian teknis" title="Skill" />);
    expect(screen.getByText('/ / keahlian teknis')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Skill' })).toBeInTheDocument();
  });
});
```

`components/ui/chip.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Chip } from './chip';

describe('Chip', () => {
  it('renders its label', () => {
    render(<Chip>TypeScript</Chip>);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });
});
```

`components/ui/terminal-window.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TerminalWindow } from './terminal-window';

describe('TerminalWindow', () => {
  it('renders the title bar and children', () => {
    render(<TerminalWindow title="whoami.sh">hello</TerminalWindow>);
    expect(screen.getByText('whoami.sh')).toBeInTheDocument();
    expect(screen.getByText('hello')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests and verify they fail**

Run: `npm test -- components/ui`
Expected: FAIL — modules don't exist yet.

- [ ] **Step 3: Implement the components**

`components/ui/section-heading.tsx`:
```tsx
export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <div className="font-mono text-xs uppercase tracking-[0.08em] text-ink-dim mb-2">{eyebrow}</div>
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
    </div>
  );
}
```

`components/ui/chip.tsx`:
```tsx
import type { ReactNode } from 'react';

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-xs font-semibold bg-cream-dim rounded-lg px-3 py-1.5">
      {children}
    </span>
  );
}
```

`components/ui/terminal-window.tsx`:
```tsx
import type { ReactNode } from 'react';

export function TerminalWindow({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-ink rounded-xl overflow-hidden shadow-[8px_8px_0_var(--color-accent-orange)]">
      <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-ink/90">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        <span className="ml-2 font-mono text-[11px] text-cream-dim">{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests and verify they pass**

Run: `npm test -- components/ui`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add SectionHeading, Chip, TerminalWindow UI primitives"
```

---

## Task 6: Nav

**Files:**
- Create: `lib/is-active-link.ts`
- Create: `components/nav.tsx`
- Test: `lib/is-active-link.test.ts`
- Test: `components/nav.test.tsx`

**Interfaces:**
- Consumes: `data.profile` (not used directly by Nav — Nav's links are structural, not content, so they're a local constant, not `data.json`).
- Produces: `<Nav />` (a client component reading `usePathname()`), and `isActiveLink(pathname, href)` pure function.

- [ ] **Step 1: Write failing test for the pure link-matching function**

`lib/is-active-link.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { isActiveLink } from './is-active-link';

describe('isActiveLink', () => {
  it('matches the home route exactly', () => {
    expect(isActiveLink('/', '/')).toBe(true);
    expect(isActiveLink('/work', '/')).toBe(false);
  });

  it('matches non-home routes by prefix', () => {
    expect(isActiveLink('/work', '/work')).toBe(true);
    expect(isActiveLink('/blog', '/work')).toBe(false);
  });
});
```

- [ ] **Step 2: Run it and verify it fails**

Run: `npm test -- lib/is-active-link.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/is-active-link.ts`**

```ts
export function isActiveLink(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href;
}
```

- [ ] **Step 4: Run it and verify it passes**

Run: `npm test -- lib/is-active-link.test.ts`
Expected: PASS.

- [ ] **Step 5: Write failing test for Nav**

`components/nav.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/work' }));

import { Nav } from './nav';

describe('Nav', () => {
  it('renders all four links with the active one marked', () => {
    render(<Nav />);
    const workLink = screen.getByRole('link', { name: /\.\/work/ });
    expect(workLink).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cd home/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cd blog/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cd contact/ })).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run it and verify it fails**

Run: `npm test -- components/nav.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement `components/nav.tsx`**

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isActiveLink } from '@/lib/is-active-link';

const LINKS = [
  { href: '/', label: 'home' },
  { href: '/work', label: 'work' },
  { href: '/blog', label: 'blog' },
  { href: '/contact', label: 'contact' },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-50 bg-cream border-b-2 border-ink font-mono">
      <div className="max-w-[1100px] mx-auto px-6 py-3.5 flex items-center justify-between gap-4 flex-wrap">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-base hover:text-accent-green transition-colors">
          <span className="w-2.5 h-2.5 rounded-sm bg-accent-green inline-block" />
          raka@portfolio<span className="text-accent-green">:~$</span>
        </Link>
        <div className="flex gap-1 flex-wrap text-sm">
          {LINKS.map((item) => {
            const active = isActiveLink(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`no-underline px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  active ? 'bg-ink text-cream font-bold' : 'text-ink hover:bg-cream-dim'
                }`}
              >
                {active ? `./${item.label}` : `cd ${item.label}`}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Run it and verify it passes**

Run: `npm test -- components/nav.test.tsx`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add Nav component with active-link detection"
```

---

## Task 7: Footer

**Files:**
- Create: `components/footer.tsx`
- Test: `components/footer.test.tsx`

**Interfaces:**
- Consumes: `data.footer` (tagline, socialLinks).
- Produces: `<Footer />`.

- [ ] **Step 1: Write failing test**

`components/footer.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from './footer';

describe('Footer', () => {
  it('renders the tagline and social links from data.json', () => {
    render(<Footer />);
    expect(screen.getByText(/Software engineer di Jakarta/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'github' })).toHaveAttribute(
      'href',
      'https://github.com/rakapratama'
    );
    expect(screen.getByRole('link', { name: 'email' })).toHaveAttribute(
      'href',
      'mailto:hello@rakapratama.dev'
    );
  });
});
```

- [ ] **Step 2: Run it and verify it fails**

Run: `npm test -- components/footer.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `components/footer.tsx`**

```tsx
import Link from 'next/link';
import { data } from '@/lib/data';

export function Footer() {
  const { footer, profile } = data;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-cream font-mono px-6 pt-12 pb-7">
      <div className="max-w-[1100px] mx-auto flex justify-between gap-8 flex-wrap">
        <div className="max-w-[360px]">
          <div className="font-extrabold text-lg mb-2">
            raka@portfolio<span className="text-accent-green">:~$</span> echo &quot;let&apos;s build something&quot;
          </div>
          <div className="text-sm opacity-70 leading-relaxed">{footer.tagline}</div>
        </div>
        <div className="flex gap-12 flex-wrap">
          <div>
            <div className="text-[11px] opacity-50 tracking-[0.08em] mb-2.5">// navigate</div>
            <div className="flex flex-col gap-1.5 text-sm">
              <Link href="/" className="opacity-85 hover:opacity-100 hover:text-accent-green transition-colors">home</Link>
              <Link href="/work" className="opacity-85 hover:opacity-100 hover:text-accent-green transition-colors">work</Link>
              <Link href="/blog" className="opacity-85 hover:opacity-100 hover:text-accent-green transition-colors">blog</Link>
            </div>
          </div>
          <div>
            <div className="text-[11px] opacity-50 tracking-[0.08em] mb-2.5">// connect</div>
            <div className="flex flex-col gap-1.5 text-sm">
              <a href={footer.socialLinks.github} target="_blank" rel="noopener" className="opacity-85 hover:opacity-100 hover:text-accent-green transition-colors">github</a>
              <a href={footer.socialLinks.linkedin} target="_blank" rel="noopener" className="opacity-85 hover:opacity-100 hover:text-accent-green transition-colors">linkedin</a>
              <a href={`mailto:${footer.socialLinks.email}`} className="opacity-85 hover:opacity-100 hover:text-accent-green transition-colors">email</a>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1100px] mx-auto mt-8 pt-5 border-t border-cream/20 text-xs opacity-50 flex justify-between flex-wrap gap-2">
        <span>© {year} {profile.name} — process exited with code 0</span>
        <span>built with too much coffee</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Run it and verify it passes**

Run: `npm test -- components/footer.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Footer component"
```

---

## Task 8: Root Layout — Metadata & JSON-LD

**Files:**
- Modify: `app/layout.tsx`
- Create: `components/json-ld.tsx`
- Test: `components/json-ld.test.tsx`

**Interfaces:**
- Consumes: `data.seo`, `data.profile`, `data.footer.socialLinks`.
- Produces: `metadata` export on root layout used as the fallback/template for every page; `<JsonLd data={...} />` reusable script-tag component used here and in Task 16 (Home page Person schema).

- [ ] **Step 1: Write failing test for `JsonLd`**

`components/json-ld.test.tsx`:
```tsx
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { JsonLd } from './json-ld';

describe('JsonLd', () => {
  it('renders a script tag with the serialized JSON', () => {
    const { container } = render(<JsonLd data={{ '@type': 'WebSite', name: 'Test' }} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    expect(JSON.parse(script!.textContent!)).toEqual({ '@type': 'WebSite', name: 'Test' });
  });
});
```

- [ ] **Step 2: Run it and verify it fails**

Run: `npm test -- components/json-ld.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `components/json-ld.tsx`**

```tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

- [ ] **Step 4: Run it and verify it passes**

Run: `npm test -- components/json-ld.test.tsx`
Expected: PASS.

- [ ] **Step 5: Add metadata and `WebSite` JSON-LD to `app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { data } from '@/lib/data';
import { JsonLd } from '@/components/json-ld';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-jetbrains-mono',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
});

const { seo } = data;

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: { default: seo.defaultTitle, template: `%s — ${seo.siteName}` },
  description: seo.defaultDescription,
  keywords: seo.keywords,
  openGraph: {
    type: 'website',
    locale: seo.locale,
    url: seo.siteUrl,
    siteName: seo.siteName,
    title: seo.defaultTitle,
    description: seo.defaultDescription,
    images: [{ url: seo.ogImage }],
  },
  twitter: {
    card: 'summary_large_image',
    site: seo.twitterHandle,
    title: seo.defaultTitle,
    description: seo.defaultDescription,
    images: [seo.ogImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${jetbrainsMono.variable} ${spaceGrotesk.variable}`}>
      <body>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: seo.siteName,
            url: seo.siteUrl,
          }}
        />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Verify build succeeds**

Run: `npm run build`
Expected: build completes; no TypeScript errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add root metadata, Open Graph, and WebSite JSON-LD"
```

---

## Task 9: Home — Hero (typewriter + decorative parallax)

**Files:**
- Create: `lib/get-typed-text.ts`
- Create: `components/home/hero.tsx`
- Test: `lib/get-typed-text.test.ts`
- Test: `components/home/hero.test.tsx`

**Interfaces:**
- Consumes: `data.profile` (tagline, terminalLines, openToWork).
- Produces: `getTypedText(lines, lineIndex, charIndex)` pure function; `<Hero />` client component (uses GSAP for the typing/scroll-driven effects — invoke `gsap-skills:gsap-core`, `gsap-skills:gsap-react`, and `gsap-skills:gsap-scrolltrigger` before Step 5).

- [ ] **Step 1: Write failing test for the pure typewriter logic**

`lib/get-typed-text.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { getTypedText } from './get-typed-text';

const lines = [
  { prefix: '$ ', text: 'whoami' },
  { prefix: '', text: 'Raka Pratama' },
];

describe('getTypedText', () => {
  it('reveals full previous lines and partial current line', () => {
    const result = getTypedText(lines, 0, 3);
    expect(result).toEqual([
      { prefix: '$ ', text: 'who', showCursor: true },
      { prefix: '', text: '', showCursor: false },
    ]);
  });

  it('shows full text with no cursor once a line is complete and index has moved on', () => {
    const result = getTypedText(lines, 1, 5);
    expect(result[0]).toEqual({ prefix: '$ ', text: 'whoami', showCursor: false });
    expect(result[1]).toEqual({ prefix: '', text: 'Raka ', showCursor: true });
  });
});
```

- [ ] **Step 2: Run it and verify it fails**

Run: `npm test -- lib/get-typed-text.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/get-typed-text.ts`**

```ts
export interface TerminalLine {
  prefix: string;
  text: string;
}

export interface TypedLine {
  prefix: string;
  text: string;
  showCursor: boolean;
}

export function getTypedText(lines: TerminalLine[], lineIndex: number, charIndex: number): TypedLine[] {
  return lines.map((line, i) => {
    if (i < lineIndex) return { prefix: line.prefix, text: line.text, showCursor: false };
    if (i === lineIndex) return { prefix: line.prefix, text: line.text.slice(0, charIndex), showCursor: true };
    return { prefix: '', text: '', showCursor: false };
  });
}
```

- [ ] **Step 4: Run it and verify it passes**

Run: `npm test -- lib/get-typed-text.test.ts`
Expected: PASS.

- [ ] **Step 5: Write failing test for `Hero`**

`components/home/hero.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Hero } from './hero';

describe('Hero', () => {
  it('renders the profile name and tagline from data.json', () => {
    render(<Hero />);
    expect(screen.getByText(/Raka Pratama/)).toBeInTheDocument();
    expect(screen.getByText(/Fokus di web, mobile, dan otomasi berbasis AI/)).toBeInTheDocument();
  });

  it('shows the open-to-work badge when profile.openToWork is true', () => {
    render(<Hero />);
    expect(screen.getByText(/open to kolaborasi/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run it and verify it fails**

Run: `npm test -- components/home/hero.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement `components/home/hero.tsx`**

Invoke `gsap-skills:gsap-core` and `gsap-skills:gsap-react` (and `gsap-skills:gsap-scrolltrigger` for the scroll-cue fade) before writing this, then implement:

```tsx
'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { data } from '@/lib/data';
import { getTypedText } from '@/lib/get-typed-text';

export function Hero() {
  const { profile } = data;
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
      profile.terminalLines.forEach((line, i) => {
        tl.to(
          {},
          {
            duration: line.text.length * 0.028,
            onUpdate: function () {
              const progress = this.progress();
              setLineIndex(i);
              setCharIndex(Math.round(progress * line.text.length));
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  const typedLines = getTypedText(profile.terminalLines, lineIndex, charIndex);

  return (
    <div ref={containerRef} className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden bg-cream">
      <div className="relative max-w-[1100px] mx-auto px-6 w-full">
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            {profile.openToWork && (
              <div className="inline-flex items-center gap-2 bg-accent-green-soft border-[1.5px] border-ink rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-[blink_1.6s_ease-in-out_infinite]" />
                open to kolaborasi & full-time
              </div>
            )}
            <h1 className="text-[44px] md:text-[64px] leading-[1.02] font-bold mb-5 tracking-tight">
              Halo, saya<br />
              <span className="relative inline-block">{profile.name}</span>
            </h1>
            <p className="text-lg leading-relaxed text-ink-dim max-w-[520px] mb-7">{profile.tagline}</p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/work" className="no-underline bg-ink text-cream font-mono font-bold text-sm px-5 py-3.5 rounded-lg inline-block hover:bg-accent-green transition-colors">
                ./lihat-proyek.sh
              </Link>
              <Link href="/contact" className="no-underline bg-transparent text-ink font-mono font-bold text-sm px-5 py-3.5 rounded-lg border-2 border-ink inline-block hover:bg-cream-dim transition-colors">
                say hello --wave
              </Link>
            </div>
          </div>

          <div className="relative bg-ink rounded-xl overflow-hidden shadow-[8px_8px_0_var(--color-accent-orange)] animate-[floaty_5s_ease-in-out_infinite]">
            <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-ink/90">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              <span className="ml-2 font-mono text-[11px] text-cream-dim">whoami.sh</span>
            </div>
            <div className="px-5 pt-5 pb-6 font-mono text-[13.5px] leading-loose text-accent-green-soft min-h-[190px]">
              {typedLines.map((ln, i) => (
                <div key={i} className={ln.prefix === '$ ' && i > 0 ? 'mt-2.5' : ''}>
                  <span className="text-accent-orange">{ln.prefix}</span>
                  {ln.text}
                  {ln.showCursor && <span className="animate-[blink_1s_step-start_infinite]">▌</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Run tests and verify they pass**

Run: `npm test -- components/home/hero.test.tsx lib/get-typed-text.test.ts`
Expected: PASS (4 tests total).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add Hero component with GSAP typewriter effect"
```

---

## Task 10: Home — Marquee

**Files:**
- Create: `components/home/marquee.tsx`
- Test: `components/home/marquee.test.tsx`

**Interfaces:**
- Consumes: `data.skills.tools` (derived, no separate marquee data — per spec simplification).
- Produces: `<Marquee />`.

- [ ] **Step 1: Write failing test**

`components/home/marquee.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Marquee } from './marquee';

describe('Marquee', () => {
  it('renders each tool from data.skills.tools at least once', () => {
    render(<Marquee />);
    expect(screen.getAllByText('Vercel').length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run it and verify it fails**

Run: `npm test -- components/home/marquee.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `components/home/marquee.tsx`**

Duplicate the tools list once so the CSS `translateX(-50%)` loop is seamless:

```tsx
import { data } from '@/lib/data';

export function Marquee() {
  const items = [...data.skills.tools, ...data.skills.tools];

  return (
    <div className="border-y-2 border-ink bg-cream-dim py-4 overflow-hidden">
      <div className="flex w-max animate-[marquee_26s_linear_infinite]">
        {items.map((tool, i) => (
          <span
            key={`${tool}-${i}`}
            className="font-mono text-sm font-bold whitespace-nowrap px-5.5 border-r-[1.5px] border-ink/20"
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run it and verify it passes**

Run: `npm test -- components/home/marquee.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Marquee component derived from skills.tools"
```

---

## Task 11: Home — Stats (counter + scroll reveal)

**Files:**
- Create: `lib/compute-counts.ts`
- Create: `components/home/stats.tsx`
- Test: `lib/compute-counts.test.ts`
- Test: `components/home/stats.test.tsx`

**Interfaces:**
- Consumes: `data.stats`.
- Produces: `computeCounts(targets, progress)` pure function; `<Stats />` client component (GSAP `ScrollTrigger` drives `progress` — invoke `gsap-skills:gsap-scrolltrigger` before Step 5).

- [ ] **Step 1: Write failing test for the pure counting logic**

`lib/compute-counts.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { computeCounts } from './compute-counts';

describe('computeCounts', () => {
  it('returns all zeros at progress 0', () => {
    expect(computeCounts([4, 30, 12], 0)).toEqual([0, 0, 0]);
  });

  it('returns full targets at progress 1', () => {
    expect(computeCounts([4, 30, 12], 1)).toEqual([4, 30, 12]);
  });

  it('rounds intermediate progress', () => {
    expect(computeCounts([4, 30, 12], 0.5)).toEqual([2, 15, 6]);
  });
});
```

- [ ] **Step 2: Run it and verify it fails**

Run: `npm test -- lib/compute-counts.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/compute-counts.ts`**

```ts
export function computeCounts(targets: number[], progress: number): number[] {
  const clamped = Math.min(1, Math.max(0, progress));
  return targets.map((target) => Math.round(target * clamped));
}
```

- [ ] **Step 4: Run it and verify it passes**

Run: `npm test -- lib/compute-counts.test.ts`
Expected: PASS.

- [ ] **Step 5: Write failing test for `Stats`**

`components/home/stats.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Stats } from './stats';

describe('Stats', () => {
  it('renders every stat label from data.json', () => {
    render(<Stats />);
    expect(screen.getByText('tahun pengalaman')).toBeInTheDocument();
    expect(screen.getByText('proyek diselesaikan')).toBeInTheDocument();
    expect(screen.getByText('teknologi dikuasai')).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run it and verify it fails**

Run: `npm test -- components/home/stats.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement `components/home/stats.tsx`**

Invoke `gsap-skills:gsap-scrolltrigger` before writing this, then implement:

```tsx
'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { data } from '@/lib/data';
import { computeCounts } from '@/lib/compute-counts';

gsap.registerPlugin(ScrollTrigger);

export function Stats() {
  const { stats } = data;
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const obj = { value: 0 };
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            value: 1,
            duration: 0.9,
            ease: 'power1.out',
            onUpdate: () => setProgress(obj.value),
          });
        },
      });
    },
    { scope: sectionRef }
  );

  const counts = computeCounts(stats.map((s) => s.value), progress);

  return (
    <div ref={sectionRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <div key={stat.label} className="bg-white border-2 border-ink rounded-lg p-5">
          <div className="font-mono text-3xl font-extrabold text-accent-green">
            {counts[i]}
            {stat.suffix}
          </div>
          <div className="text-sm text-ink-dim mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 8: Run it and verify it passes**

Run: `npm test -- components/home/stats.test.tsx`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add Stats component with GSAP ScrollTrigger counter"
```

---

## Task 12: Home — About

**Files:**
- Create: `components/home/about.tsx`
- Test: `components/home/about.test.tsx`

**Interfaces:**
- Consumes: `data.about` (paragraphs, traits).
- Produces: `<About />`.

- [ ] **Step 1: Write failing test**

`components/home/about.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { About } from './about';

describe('About', () => {
  it('renders every paragraph and trait from data.json', () => {
    render(<About />);
    expect(screen.getByText(/mulai belajar coding dari mengutak-atik forum game/)).toBeInTheDocument();
    expect(screen.getByText('problem solver')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it and verify it fails**

Run: `npm test -- components/home/about.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `components/home/about.tsx`**

```tsx
import { SectionHeading } from '@/components/ui/section-heading';
import { Chip } from '@/components/ui/chip';
import { data } from '@/lib/data';

export function About() {
  const { about } = data;

  return (
    <div id="about" className="mt-22 scroll-mt-20">
      <SectionHeading eyebrow="$ cat about.md" title="Tentang saya" />
      <div className="grid md:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
        <div className="bg-ink rounded-xl overflow-hidden shadow-[6px_6px_0_var(--color-accent-green)] aspect-square flex items-center justify-center font-mono text-xs text-cream/70">
          foto profil
        </div>
        <div className="text-base leading-loose text-ink space-y-4">
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <div className="flex gap-2.5 flex-wrap pt-2">
            {about.traits.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run it and verify it passes**

Run: `npm test -- components/home/about.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add About component"
```

---

## Task 13: Home — Skills

**Files:**
- Create: `lib/level-to-percent.ts`
- Create: `components/home/skills.tsx`
- Test: `lib/level-to-percent.test.ts`
- Test: `components/home/skills.test.tsx`

**Interfaces:**
- Consumes: `data.skills.groups`.
- Produces: `levelToPercent(level)` pure function; `<Skills />`.

- [ ] **Step 1: Write failing test for the pure conversion**

`lib/level-to-percent.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { levelToPercent } from './level-to-percent';

describe('levelToPercent', () => {
  it('maps level 1-4 to 25-100 percent', () => {
    expect(levelToPercent(1)).toBe(25);
    expect(levelToPercent(4)).toBe(100);
  });
});
```

- [ ] **Step 2: Run it and verify it fails**

Run: `npm test -- lib/level-to-percent.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/level-to-percent.ts`**

```ts
export function levelToPercent(level: 1 | 2 | 3 | 4): number {
  return level * 25;
}
```

- [ ] **Step 4: Run it and verify it passes**

Run: `npm test -- lib/level-to-percent.test.ts`
Expected: PASS.

- [ ] **Step 5: Write failing test for `Skills`**

`components/home/skills.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skills } from './skills';

describe('Skills', () => {
  it('renders each skill group title and item name', () => {
    render(<Skills />);
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('React / Next.js')).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run it and verify it fails**

Run: `npm test -- components/home/skills.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement `components/home/skills.tsx`**

```tsx
import { SectionHeading } from '@/components/ui/section-heading';
import { Chip } from '@/components/ui/chip';
import { data } from '@/lib/data';
import { levelToPercent } from '@/lib/level-to-percent';

export function Skills() {
  const { skills } = data;

  return (
    <div className="mt-18">
      <SectionHeading eyebrow="/ / keahlian teknis" title="" />
      <div className="grid sm:grid-cols-2 gap-5">
        {skills.groups.map((group) => (
          <div key={group.title} className="bg-white border-2 border-ink rounded-lg p-5.5">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-2 h-2 rounded-sm" style={{ background: group.color }} />
              <div className="font-mono font-bold text-sm">{group.title}</div>
            </div>
            <div className="flex flex-col gap-3">
              {group.items.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-[13.5px] mb-1">
                    <span className="font-semibold">{item.name}</span>
                    <span className="font-mono text-ink-dim">
                      {['dasar', 'menengah', 'mahir', 'ahli'][item.level - 1]}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-cream-dim overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${levelToPercent(item.level)}%`, background: group.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2.5 flex-wrap mt-5">
        {skills.tools.map((tool) => (
          <Chip key={tool}>{tool}</Chip>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Run it and verify it passes**

Run: `npm test -- components/home/skills.test.tsx`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add Skills component"
```

---

## Task 14: Home — Education

**Files:**
- Create: `components/home/education.tsx`
- Test: `components/home/education.test.tsx`

**Interfaces:**
- Consumes: `data.education`.
- Produces: `<Education />`.

- [ ] **Step 1: Write failing test**

`components/home/education.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Education } from './education';

describe('Education', () => {
  it('renders every education entry from data.json', () => {
    render(<Education />);
    expect(screen.getByText('Universitas Indonesia')).toBeInTheDocument();
    expect(screen.getByText('S.Kom, Teknik Informatika')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it and verify it fails**

Run: `npm test -- components/home/education.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `components/home/education.tsx`**

```tsx
import { SectionHeading } from '@/components/ui/section-heading';
import { data } from '@/lib/data';

export function Education() {
  return (
    <div className="mt-14">
      <SectionHeading eyebrow="/ / pendidikan" title="" />
      <div className="flex flex-col">
        {data.education.map((e) => (
          <div key={e.school} className="flex gap-6 py-5 border-b-[1.5px] border-ink/15">
            <div className="font-mono text-[13px] text-accent-green w-[110px] shrink-0 font-bold">{e.year}</div>
            <div>
              <div className="font-bold text-[17px]">{e.school}</div>
              <div className="text-sm text-ink-dim mt-0.5">{e.degree}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run it and verify it passes**

Run: `npm test -- components/home/education.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Education component"
```

---

## Task 15: Home — Featured Projects

**Files:**
- Create: `lib/get-featured-projects.ts`
- Create: `components/home/featured-projects.tsx`
- Test: `lib/get-featured-projects.test.ts`
- Test: `components/home/featured-projects.test.tsx`

**Interfaces:**
- Consumes: `data.projects`.
- Produces: `getFeaturedProjects(projects)` pure function (the "derive, don't duplicate" simplification from the spec); `<FeaturedProjects />`.

- [ ] **Step 1: Write failing test for the pure filter**

`lib/get-featured-projects.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { getFeaturedProjects } from './get-featured-projects';
import type { Project } from './types';

const projects: Project[] = [
  { name: 'A', category: 'web', desc: '', tags: [], image: null, liveUrl: null, codeUrl: null, featured: true },
  { name: 'B', category: 'web', desc: '', tags: [], image: null, liveUrl: null, codeUrl: null, featured: false },
];

describe('getFeaturedProjects', () => {
  it('returns only projects with featured: true', () => {
    expect(getFeaturedProjects(projects)).toEqual([projects[0]]);
  });
});
```

- [ ] **Step 2: Run it and verify it fails**

Run: `npm test -- lib/get-featured-projects.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/get-featured-projects.ts`**

```ts
import type { Project } from './types';

export function getFeaturedProjects(projects: Project[]): Project[] {
  return projects.filter((p) => p.featured);
}
```

- [ ] **Step 4: Run it and verify it passes**

Run: `npm test -- lib/get-featured-projects.test.ts`
Expected: PASS.

- [ ] **Step 5: Write failing test for `FeaturedProjects`**

`components/home/featured-projects.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FeaturedProjects } from './featured-projects';

describe('FeaturedProjects', () => {
  it('renders only projects flagged as featured in data.json', () => {
    render(<FeaturedProjects />);
    expect(screen.getByText('Nimbus Analytics Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('DevFlow CLI')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run it and verify it fails**

Run: `npm test -- components/home/featured-projects.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement `components/home/featured-projects.tsx`**

```tsx
import Link from 'next/link';
import Image from 'next/image';
import { data } from '@/lib/data';
import { getFeaturedProjects } from '@/lib/get-featured-projects';

export function FeaturedProjects() {
  const featured = getFeaturedProjects(data.projects);

  return (
    <div className="mt-18 pb-20">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
        <h2 className="font-mono text-sm tracking-[0.08em] text-ink-dim uppercase">/ / kerja terbaru</h2>
        <Link href="/work" className="font-mono text-sm font-bold text-accent-green">lihat semua →</Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {featured.map((p) => (
          <Link
            key={p.name}
            href="/work"
            className="no-underline text-ink bg-white border-2 border-ink rounded-lg overflow-hidden block hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-accent-orange)] transition-transform"
          >
            <div className="aspect-video bg-cream-dim flex items-center justify-center font-mono text-xs text-ink-dim">
              {p.image ? (
                <Image src={p.image} alt={p.name} width={400} height={250} className="w-full h-full object-cover" />
              ) : (
                'screenshot proyek'
              )}
            </div>
            <div className="p-4">
              <div className="font-bold text-[15px] mb-1.5">{p.name}</div>
              <div className="text-[13px] text-ink-dim leading-snug">{p.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Run it and verify it passes**

Run: `npm test -- components/home/featured-projects.test.tsx`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add FeaturedProjects component"
```

---

## Task 16: Home Page Assembly

**Files:**
- Modify: `app/page.tsx`
- Test: `app/page.test.tsx`

**Interfaces:**
- Consumes: `Nav`, `Footer`, `Hero`, `Marquee`, `Stats`, `About`, `Skills`, `Education`, `FeaturedProjects`, `JsonLd`, `data.profile`, `data.seo`.
- Produces: the `/` route with `generateMetadata` and a `Person` JSON-LD block.

- [ ] **Step 1: Write failing test**

`app/page.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

import HomePage from './page';

describe('HomePage', () => {
  it('renders the hero heading and the about section', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: /Halo, saya/ })).toBeInTheDocument();
    expect(screen.getByText('Tentang saya')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it and verify it fails**

Run: `npm test -- app/page.test.tsx`
Expected: FAIL — `app/page.tsx` still has the CRA default content.

- [ ] **Step 3: Implement `app/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { JsonLd } from '@/components/json-ld';
import { Hero } from '@/components/home/hero';
import { Marquee } from '@/components/home/marquee';
import { Stats } from '@/components/home/stats';
import { About } from '@/components/home/about';
import { Skills } from '@/components/home/skills';
import { Education } from '@/components/home/education';
import { FeaturedProjects } from '@/components/home/featured-projects';
import { data } from '@/lib/data';

const { profile, seo } = data;

export const metadata: Metadata = {
  title: seo.defaultTitle,
  description: seo.defaultDescription,
};

export default function HomePage() {
  return (
    <div className="font-sans text-ink min-h-screen overflow-x-hidden">
      <Nav />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: profile.name,
          jobTitle: profile.role,
          url: seo.siteUrl,
          sameAs: [profile.github, profile.linkedin],
        }}
      />
      <Hero />
      <Marquee />
      <div className="max-w-[1100px] mx-auto px-6 pt-16">
        <Stats />
        <About />
        <Skills />
        <Education />
        <FeaturedProjects />
      </div>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 4: Run it and verify it passes**

Run: `npm test -- app/page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Verify production build**

Run: `npm run build`
Expected: build succeeds, `/` listed in the route output.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: assemble Home page with metadata and Person JSON-LD"
```

---

## Task 17: Work Page (timeline + filterable project grid)

**Files:**
- Create: `lib/filter-projects.ts`
- Create: `components/work/experience-timeline.tsx`
- Create: `components/work/project-grid.tsx`
- Create: `app/work/page.tsx`
- Test: `lib/filter-projects.test.ts`
- Test: `components/work/experience-timeline.test.tsx`
- Test: `components/work/project-grid.test.tsx`
- Test: `app/work/page.test.tsx`

**Interfaces:**
- Consumes: `data.experience`, `data.projects`.
- Produces: `filterProjects(projects, category)` pure function; `<ExperienceTimeline />`; `<ProjectGrid />` (client component owning the category filter state); the `/work` route.

- [ ] **Step 1: Write failing test for the pure filter**

`lib/filter-projects.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { filterProjects } from './filter-projects';
import type { Project } from './types';

const projects: Project[] = [
  { name: 'A', category: 'web', desc: '', tags: [], image: null, liveUrl: null, codeUrl: null, featured: false },
  { name: 'B', category: 'ai', desc: '', tags: [], image: null, liveUrl: null, codeUrl: null, featured: false },
];

describe('filterProjects', () => {
  it('returns all projects for category "semua"', () => {
    expect(filterProjects(projects, 'semua')).toEqual(projects);
  });

  it('returns only projects matching the given category', () => {
    expect(filterProjects(projects, 'ai')).toEqual([projects[1]]);
  });
});
```

- [ ] **Step 2: Run it and verify it fails**

Run: `npm test -- lib/filter-projects.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/filter-projects.ts`**

```ts
import type { Project, ProjectCategory } from './types';

export type ProjectFilter = ProjectCategory | 'semua';

export function filterProjects(projects: Project[], category: ProjectFilter): Project[] {
  if (category === 'semua') return projects;
  return projects.filter((p) => p.category === category);
}
```

- [ ] **Step 4: Run it and verify it passes**

Run: `npm test -- lib/filter-projects.test.ts`
Expected: PASS.

- [ ] **Step 5: Write failing test for `ExperienceTimeline`**

`components/work/experience-timeline.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExperienceTimeline } from './experience-timeline';

describe('ExperienceTimeline', () => {
  it('renders every job from data.json', () => {
    render(<ExperienceTimeline />);
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    expect(screen.getByText(/Vela Teknologi/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run it and verify it fails**

Run: `npm test -- components/work/experience-timeline.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement `components/work/experience-timeline.tsx`**

Invoke `gsap-skills:gsap-scrolltrigger` if adding scroll-reveal here; this task keeps it as a plain static list (the reveal pattern was already demonstrated in Task 11's Stats) to avoid repeating identical GSAP wiring three times — YAGNI:

```tsx
import { Chip } from '@/components/ui/chip';
import { data } from '@/lib/data';

export function ExperienceTimeline() {
  return (
    <div className="relative pl-7 max-w-[820px]">
      <div className="absolute left-1 top-2 bottom-2 w-0.5 bg-ink/15" />
      {data.experience.map((job) => (
        <div key={`${job.company}-${job.period}`} className="relative pb-9">
          <div
            className="absolute -left-7 top-1 w-3 h-3 rounded-full border-2 border-ink"
            style={{ background: job.dotColor }}
          />
          <div className="bg-white border-2 border-ink rounded-lg p-5.5">
            <div className="flex justify-between flex-wrap gap-2 mb-1.5">
              <div className="font-bold text-[17px]">{job.role}</div>
              <div className="font-mono text-xs text-ink-dim bg-cream-dim px-2.5 py-1 rounded-full whitespace-nowrap">
                {job.period}
              </div>
            </div>
            <div className="text-sm font-semibold text-accent-green mb-3">
              {job.company} · {job.location}
            </div>
            <ul className="list-disc pl-4.5 text-sm leading-relaxed text-ink-dim space-y-1">
              {job.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
            <div className="flex gap-2 flex-wrap mt-3">
              {job.tags.map((tag) => (
                <Chip key={tag}>{tag}</Chip>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 8: Run it and verify it passes**

Run: `npm test -- components/work/experience-timeline.test.tsx`
Expected: PASS.

- [ ] **Step 9: Write failing test for `ProjectGrid`**

`components/work/project-grid.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { ProjectGrid } from './project-grid';

describe('ProjectGrid', () => {
  it('shows all projects by default and filters when a category button is clicked', async () => {
    render(<ProjectGrid />);
    expect(screen.getByText('DevFlow CLI')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'ai/ml' }));
    expect(screen.queryByText('DevFlow CLI')).not.toBeInTheDocument();
    expect(screen.getByText('Loop AI Assistant')).toBeInTheDocument();
  });
});
```

- [ ] **Step 10: Run it and verify it fails**

Run: `npm test -- components/work/project-grid.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 11: Implement `components/work/project-grid.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { Chip } from '@/components/ui/chip';
import { data } from '@/lib/data';
import { filterProjects, type ProjectFilter } from '@/lib/filter-projects';

const CATEGORIES: { value: ProjectFilter; label: string }[] = [
  { value: 'semua', label: 'semua' },
  { value: 'web', label: 'web' },
  { value: 'mobile', label: 'mobile' },
  { value: 'backend', label: 'backend' },
  { value: 'ai', label: 'ai/ml' },
  { value: 'automation', label: 'automasi' },
];

export function ProjectGrid() {
  const [active, setActive] = useState<ProjectFilter>('semua');
  const filtered = filterProjects(data.projects, active);

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setActive(c.value)}
            className={`font-mono text-sm font-bold rounded-full px-4 py-2 border-2 border-ink transition-colors ${
              active === c.value ? 'bg-ink text-cream' : 'bg-transparent text-ink hover:bg-cream-dim'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((p) => (
          <div key={p.name} className="bg-white border-2 border-ink rounded-lg overflow-hidden flex flex-col">
            <div className="aspect-video bg-cream-dim flex items-center justify-center font-mono text-xs text-ink-dim">
              screenshot proyek
            </div>
            <div className="p-4.5 flex flex-col flex-1">
              <div className="font-mono text-xs font-bold text-accent-green uppercase mb-1.5">{p.category}</div>
              <div className="font-bold text-base mb-1.5">{p.name}</div>
              <div className="text-[13.5px] text-ink-dim leading-snug flex-1">{p.desc}</div>
              <div className="flex gap-1.5 flex-wrap my-3.5">
                {p.tags.map((tag) => (
                  <Chip key={tag}>{tag}</Chip>
                ))}
              </div>
              <div className="flex gap-3.5 font-mono text-xs font-bold">
                {p.liveUrl && <a href={p.liveUrl}>live →</a>}
                {p.codeUrl && <a href={p.codeUrl} className="text-ink">code →</a>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 12: Run it and verify it passes**

Run: `npm test -- components/work/project-grid.test.tsx`
Expected: PASS.

- [ ] **Step 13: Write failing test for the Work page**

`app/work/page.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/work' }));

import WorkPage from './page';

describe('WorkPage', () => {
  it('renders the page heading, timeline, and project grid', () => {
    render(<WorkPage />);
    expect(screen.getByRole('heading', { name: 'Pengalaman & proyek' })).toBeInTheDocument();
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('DevFlow CLI')).toBeInTheDocument();
  });
});
```

- [ ] **Step 14: Run it and verify it fails**

Run: `npm test -- app/work/page.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 15: Implement `app/work/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { ExperienceTimeline } from '@/components/work/experience-timeline';
import { ProjectGrid } from '@/components/work/project-grid';
import { data } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Pengalaman & Proyek',
  description: `Riwayat kerja dan proyek yang dikerjakan oleh ${data.profile.name}.`,
};

export default function WorkPage() {
  return (
    <div className="font-sans text-ink min-h-screen flex flex-col">
      <Nav />
      <div className="flex-1 max-w-[1100px] mx-auto px-6 py-14 w-full">
        <div className="font-mono text-sm text-accent-green mb-2">$ git log --experience</div>
        <h1 className="text-[42px] font-bold mb-10 tracking-tight">Pengalaman & proyek</h1>

        <h2 className="font-mono text-sm tracking-[0.08em] text-ink-dim uppercase mb-6">/ / riwayat kerja</h2>
        <ExperienceTimeline />

        <h2 className="font-mono text-sm tracking-[0.08em] text-ink-dim uppercase mt-12 mb-6">/ / proyek</h2>
        <ProjectGrid />
      </div>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 16: Run it and verify it passes**

Run: `npm test -- app/work/page.test.tsx`
Expected: PASS.

- [ ] **Step 17: Verify production build**

Run: `npm run build`
Expected: build succeeds, `/work` listed in the route output.

- [ ] **Step 18: Commit**

```bash
git add -A
git commit -m "feat: add Work page with experience timeline and filterable project grid"
```

---

## Task 18: Blog Page

**Files:**
- Create: `components/blog/post-list.tsx`
- Create: `app/blog/page.tsx`
- Test: `components/blog/post-list.test.tsx`
- Test: `app/blog/page.test.tsx`

**Interfaces:**
- Consumes: `data.blog`.
- Produces: `<PostList />`; the `/blog` route.

- [ ] **Step 1: Write failing test for `PostList`**

`components/blog/post-list.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PostList } from './post-list';

describe('PostList', () => {
  it('renders every post title, date, and tag from data.json', () => {
    render(<PostList />);
    expect(screen.getByText('Belajar dari Migrasi Monolith ke Microservices')).toBeInTheDocument();
    expect(screen.getByText('Jun 2026')).toBeInTheDocument();
    expect(screen.getByText('arsitektur')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it and verify it fails**

Run: `npm test -- components/blog/post-list.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `components/blog/post-list.tsx`**

```tsx
import { Chip } from '@/components/ui/chip';
import { data } from '@/lib/data';

export function PostList() {
  return (
    <div className="flex flex-col">
      {data.blog.map((post) => (
        <div key={post.title} className="block py-6 border-b-[1.5px] border-ink/15">
          <div className="flex justify-between items-baseline gap-3 flex-wrap">
            <div className="font-bold text-lg">{post.title}</div>
            <div className="font-mono text-xs text-ink-dim whitespace-nowrap">{post.date}</div>
          </div>
          <div className="text-[14.5px] text-ink-dim mt-2 leading-relaxed">{post.excerpt}</div>
          <div className="flex gap-2 mt-3">
            {post.tags.map((tag) => (
              <Chip key={tag}>{tag}</Chip>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run it and verify it passes**

Run: `npm test -- components/blog/post-list.test.tsx`
Expected: PASS.

- [ ] **Step 5: Write failing test for the Blog page**

`app/blog/page.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/blog' }));

import BlogPage from './page';

describe('BlogPage', () => {
  it('renders the page heading and the post list', () => {
    render(<BlogPage />);
    expect(screen.getByRole('heading', { name: 'Tulisan' })).toBeInTheDocument();
    expect(screen.getByText('Belajar dari Migrasi Monolith ke Microservices')).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run it and verify it fails**

Run: `npm test -- app/blog/page.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement `app/blog/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { PostList } from '@/components/blog/post-list';
import { data } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Tulisan',
  description: `Tulisan teknis dari ${data.profile.name} seputar software engineering dan otomasi.`,
};

export default function BlogPage() {
  return (
    <div className="font-sans text-ink min-h-screen flex flex-col">
      <Nav />
      <div className="flex-1 max-w-[800px] mx-auto px-6 py-14 w-full">
        <div className="font-mono text-sm text-accent-green mb-2">$ ls ./blog --recent</div>
        <h1 className="text-[42px] font-bold mb-10 tracking-tight">Tulisan</h1>
        <PostList />
      </div>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 8: Run it and verify it passes**

Run: `npm test -- app/blog/page.test.tsx`
Expected: PASS.

- [ ] **Step 9: Verify production build**

Run: `npm run build`
Expected: build succeeds, `/blog` listed in the route output.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add Blog page with post list"
```

---

## Task 19: Contact Page (testimonials + simulated contact form)

**Files:**
- Create: `components/contact/testimonials.tsx`
- Create: `components/contact/contact-form.tsx`
- Create: `app/contact/page.tsx`
- Test: `components/contact/testimonials.test.tsx`
- Test: `components/contact/contact-form.test.tsx`
- Test: `app/contact/page.test.tsx`

**Interfaces:**
- Consumes: `data.testimonials`, `data.profile` (email, github, linkedin).
- Produces: `<Testimonials />`; `<ContactForm />` (client component, local `submitted` state — no network call, per Global Constraints); the `/contact` route.

- [ ] **Step 1: Write failing test for `Testimonials`**

`components/contact/testimonials.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Testimonials } from './testimonials';

describe('Testimonials', () => {
  it('renders every quote and author from data.json', () => {
    render(<Testimonials />);
    expect(screen.getByText(/Raka bikin fitur kompleks kerasa sederhana/)).toBeInTheDocument();
    expect(screen.getByText('Dewi Anggraini')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it and verify it fails**

Run: `npm test -- components/contact/testimonials.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `components/contact/testimonials.tsx`**

```tsx
import { data } from '@/lib/data';

export function Testimonials() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4.5 mb-16">
      {data.testimonials.map((t) => (
        <div key={t.name} className="bg-white border-2 border-ink rounded-lg p-5 flex flex-col">
          <div className="text-sm leading-relaxed text-ink flex-1">&quot;{t.quote}&quot;</div>
          <div className="flex items-center gap-2.5 mt-4">
            <div className="w-8.5 h-8.5 rounded-full bg-cream-dim shrink-0" />
            <div>
              <div className="font-bold text-[13px]">{t.name}</div>
              <div className="font-mono text-[11.5px] text-ink-dim">{t.role}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run it and verify it passes**

Run: `npm test -- components/contact/testimonials.test.tsx`
Expected: PASS.

- [ ] **Step 5: Write failing test for `ContactForm`**

`components/contact/contact-form.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { ContactForm } from './contact-form';

describe('ContactForm', () => {
  it('shows a success message after submitting, without a network call', async () => {
    render(<ContactForm />);
    await userEvent.type(screen.getByLabelText(/name/i), 'Budi');
    await userEvent.type(screen.getByLabelText(/email/i), 'budi@example.com');
    await userEvent.type(screen.getByLabelText(/message/i), 'Halo!');
    await userEvent.click(screen.getByRole('button', { name: /kirim-pesan/ }));

    expect(screen.getByText(/pesan terkirim/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run it and verify it fails**

Run: `npm test -- components/contact/contact-form.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement `components/contact/contact-form.tsx`**

```tsx
'use client';

import { useId, useState } from 'react';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  if (submitted) {
    return (
      <div className="px-6 py-10 text-center font-mono text-accent-green-soft">
        <div className="text-3xl mb-3">✓</div>
        <div className="font-bold mb-1.5">pesan terkirim!</div>
        <div className="text-sm opacity-70">Terima kasih, saya akan balas secepatnya.</div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="px-5 pt-5.5 pb-6.5 flex flex-col gap-3.5"
    >
      <div>
        <label htmlFor={nameId} className="font-mono text-xs text-accent-green-soft block mb-1.5">
          name --value
        </label>
        <input
          id={nameId}
          required
          type="text"
          placeholder="nama kamu"
          className="w-full box-border px-3 py-2.5 rounded-md border-none bg-ink/60 text-cream text-sm"
        />
      </div>
      <div>
        <label htmlFor={emailId} className="font-mono text-xs text-accent-green-soft block mb-1.5">
          email --value
        </label>
        <input
          id={emailId}
          required
          type="email"
          placeholder="kamu@email.com"
          className="w-full box-border px-3 py-2.5 rounded-md border-none bg-ink/60 text-cream text-sm"
        />
      </div>
      <div>
        <label htmlFor={messageId} className="font-mono text-xs text-accent-green-soft block mb-1.5">
          message --value
        </label>
        <textarea
          id={messageId}
          required
          placeholder="ceritakan proyek atau idemu..."
          rows={4}
          className="w-full box-border px-3 py-2.5 rounded-md border-none bg-ink/60 text-cream text-sm resize-y font-sans"
        />
      </div>
      <button
        type="submit"
        className="mt-1 font-mono font-bold text-sm p-3 rounded-md border-none bg-accent-green text-ink cursor-pointer hover:brightness-105 transition"
      >
        ./kirim-pesan
      </button>
    </form>
  );
}
```

- [ ] **Step 8: Run it and verify it passes**

Run: `npm test -- components/contact/contact-form.test.tsx`
Expected: PASS.

- [ ] **Step 9: Write failing test for the Contact page**

`app/contact/page.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/contact' }));

import ContactPage from './page';

describe('ContactPage', () => {
  it('renders the heading, testimonials, and contact form', () => {
    render(<ContactPage />);
    expect(screen.getByRole('heading', { name: 'Mari mengobrol' })).toBeInTheDocument();
    expect(screen.getByText('Dewi Anggraini')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 10: Run it and verify it fails**

Run: `npm test -- app/contact/page.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 11: Implement `app/contact/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { TerminalWindow } from '@/components/ui/terminal-window';
import { Testimonials } from '@/components/contact/testimonials';
import { ContactForm } from '@/components/contact/contact-form';
import { data } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Kontak',
  description: `Hubungi ${data.profile.name} untuk kolaborasi, proyek freelance, atau sekadar menyapa.`,
};

export default function ContactPage() {
  const { profile } = data;

  return (
    <div className="font-sans text-ink min-h-screen flex flex-col">
      <Nav />
      <div className="flex-1 max-w-[1000px] mx-auto px-6 py-14 w-full">
        <div className="font-mono text-sm text-accent-green mb-2">$ cat testimonials.log</div>
        <h2 className="font-mono text-sm tracking-[0.08em] text-ink-dim uppercase mb-5">/ / kata mereka</h2>
        <Testimonials />

        <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
          <div>
            <div className="font-mono text-sm text-accent-green mb-2">$ send --message</div>
            <h1 className="text-[38px] font-bold mb-4 tracking-tight">Mari mengobrol</h1>
            <p className="text-base leading-relaxed text-ink-dim mb-6">
              Terbuka untuk kolaborasi, proyek freelance, atau ngobrol soal ide baru. Balas biasanya dalam 1–2 hari kerja.
            </p>
            <div className="flex flex-col gap-2.5 font-mono text-sm">
              <a href={`mailto:${profile.email}`} className="font-bold">{profile.email}</a>
              <a href={profile.linkedin} target="_blank" rel="noopener" className="text-ink">
                {profile.linkedin.replace('https://', '')}
              </a>
              <a href={profile.github} target="_blank" rel="noopener" className="text-ink">
                {profile.github.replace('https://', '')}
              </a>
            </div>
          </div>

          <TerminalWindow title="contact-form.sh">
            <ContactForm />
          </TerminalWindow>
        </div>
      </div>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 12: Run it and verify it passes**

Run: `npm test -- app/contact/page.test.tsx`
Expected: PASS.

- [ ] **Step 13: Verify production build**

Run: `npm run build`
Expected: build succeeds, `/contact` listed in the route output.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "feat: add Contact page with testimonials and simulated contact form"
```

---

## Task 20: Sitemap & Robots

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Test: `app/sitemap.test.ts`
- Test: `app/robots.test.ts`

**Interfaces:**
- Consumes: `data.seo.siteUrl`.
- Produces: `/sitemap.xml` and `/robots.txt` routes.

- [ ] **Step 1: Write failing test for the sitemap**

`app/sitemap.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import sitemap from './sitemap';

describe('sitemap', () => {
  it('lists all four routes under the configured site URL', () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toEqual([
      'https://rakapratama.dev',
      'https://rakapratama.dev/work',
      'https://rakapratama.dev/blog',
      'https://rakapratama.dev/contact',
    ]);
  });
});
```

- [ ] **Step 2: Run it and verify it fails**

Run: `npm test -- app/sitemap.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next';
import { data } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const { siteUrl } = data.seo;
  const routes = ['', '/work', '/blog', '/contact'];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
```

- [ ] **Step 4: Run it and verify it passes**

Run: `npm test -- app/sitemap.test.ts`
Expected: PASS.

- [ ] **Step 5: Write failing test for robots**

`app/robots.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import robots from './robots';

describe('robots', () => {
  it('allows all crawlers and points to the sitemap', () => {
    const result = robots();
    expect(result.rules).toEqual({ userAgent: '*', allow: '/' });
    expect(result.sitemap).toBe('https://rakapratama.dev/sitemap.xml');
  });
});
```

- [ ] **Step 6: Run it and verify it fails**

Run: `npm test -- app/robots.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement `app/robots.ts`**

```ts
import type { MetadataRoute } from 'next';
import { data } from '@/lib/data';

export default function robots(): MetadataRoute.Robots {
  const { siteUrl } = data.seo;

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
```

- [ ] **Step 8: Run it and verify it passes**

Run: `npm test -- app/robots.test.ts`
Expected: PASS.

- [ ] **Step 9: Verify production build**

Run: `npm run build`
Expected: build succeeds, `/sitemap.xml` and `/robots.txt` listed in the route output.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add dynamic sitemap and robots routes"
```

---

## Task 21: Final Responsive QA & Full Verification Pass

**Files:**
- No new files — this task verifies the completed site. Fix any bug found in the file that owns it.

**Interfaces:**
- Consumes: the whole app.
- Produces: a verified, production-ready build.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: every test across all previous tasks passes.

- [ ] **Step 2: Run a production build**

Run: `npm run build`
Expected: no TypeScript errors, no ESLint errors, all 7 routes (`/`, `/work`, `/blog`, `/contact`, `/sitemap.xml`, `/robots.txt`, plus Next's internal routes) listed in the output.

- [ ] **Step 3: Start the production server and smoke-test every route**

```bash
npm run start -- --port 4001 &
sleep 2
for path in / /work /blog /contact /sitemap.xml /robots.txt; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:4001$path")
  echo "$path -> $code"
done
kill %1
```

Expected: every path prints `200`.

- [ ] **Step 4: Visually verify responsiveness in a browser**

Open `http://localhost:4001` (start `npm run dev` again if the production server was stopped) and check each of `/`, `/work`, `/blog`, `/contact` at three widths: 375px (mobile), 768px (tablet), 1280px (desktop). Confirm:
- Hero grid collapses to one column below `md`.
- Stats grid collapses 3 → 1 column below `sm`.
- Skills grid collapses 2 → 1 column below `sm`.
- Project/featured grids collapse 3 → 2 → 1 column across breakpoints.
- Nav links wrap without overlapping at 375px.
- No horizontal scrollbar appears at any width.

Fix any issue found directly in the owning component file, re-run its test, and commit the fix separately (do not fold fixes into this task's commit).

- [ ] **Step 5: Verify `<head>` SEO output**

With the dev server running, view source (or use `curl -s http://localhost:4001 | grep -Eo '<title>.*</title>|<meta[^>]*>'`) on `/`, `/work`, `/blog`, `/contact` and confirm each has a distinct `<title>`, a `<meta name="description">`, and Open Graph tags inherited from the root layout.

- [ ] **Step 6: Commit the final verification note**

```bash
git add -A
git commit --allow-empty -m "chore: verify full test suite, production build, and responsive QA pass"
```

---

## Self-Review Notes

- **Spec coverage:** every section of the design spec (project structure, `data.json` shape, styling tokens, GSAP usage, SEO, responsive breakpoints, verification) maps to at least one task above (Tasks 1–3 infra/tokens, Task 4 data, Tasks 5–19 components/pages, Task 20 SEO routes, Task 21 verification).
- **Type consistency:** `Project`, `SkillGroup`, `SkillItem`, `ExperienceEntry`, `BlogPost`, `Testimonial`, and `PortfolioData` are defined once in Task 4 (`lib/types.ts`) and reused verbatim (same field names/casing) by every later task's test and implementation code.
- **No placeholders:** every step above contains runnable code or an exact shell command — none deferred to "later."
