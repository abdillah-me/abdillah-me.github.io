# Migrasi Personal Portfolio ke Next.js + TypeScript

**Tanggal:** 2026-08-26
**Status:** Disetujui, siap masuk tahap implementation plan

## Latar belakang

Sumber desain: `personal-branding-website-design/project/*.dc.html` (handoff dari Claude Design). Ini portfolio bertema terminal/developer untuk "Raka Pratama" (nama & konten adalah placeholder yang akan diganti user sendiri lewat `data.json`).

Halaman & komponen di desain sumber:
- `Nav.dc.html` — nav sticky, 4 link (Home/Work/Blog/Contact), state active.
- `Home.dc.html` — hero (headline, CTA, terminal window dengan efek mengetik), marquee skill ticker, stats counter, about, skills (progress bar per kategori), education timeline, featured projects.
- `Work.dc.html` — timeline riwayat kerja, grid proyek dengan filter kategori (client-side).
- `Blog.dc.html` — daftar tulisan (judul, tanggal, excerpt, tag).
- `Contact.dc.html` — testimonial grid, form kontak (UI only, tanpa backend).
- `Footer.dc.html` — tagline, nav link, social link, copyright.

Desain pakai warna oklch, font JetBrains Mono (mono/kode) + Space Grotesk (sans), animasi: typing effect, marquee infinite scroll, counter number, scroll-reveal, tilt parallax pada hero terminal.

## Keputusan yang sudah disepakati

| Area | Keputusan |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS v4, token warna oklch dipetakan ke CSS variable |
| Font | `next/font/google` (self-hosted JetBrains Mono + Space Grotesk) |
| Animasi | GSAP (+ `@gsap/react` `useGSAP` hook, `ScrollTrigger`) untuk scroll-reveal, typing effect, counter. Marquee & hover state tetap CSS murni. |
| Konten | Satu file `data/data.json` sebagai single source of truth, semua teks/angka bisa diedit user tanpa sentuh kode |
| Contact form | UI-only, simulasi sukses saat submit (tidak ada backend/API key) |
| Blog | Hanya daftar tulisan (list), tanpa halaman detail per post |
| Nav mobile | Tetap flex-wrap, tanpa hamburger menu (cuma 4 link) |

## Struktur proyek

```
app/
  layout.tsx        # root layout: font, metadata default, JSON-LD Person+WebSite
  page.tsx           # Home
  work/page.tsx
  blog/page.tsx
  contact/page.tsx
  sitemap.ts
  robots.ts
components/
  nav.tsx
  footer.tsx
  home/
    hero.tsx           # headline + CTA + terminal window (typing effect GSAP)
    marquee.tsx         # skill ticker (CSS animation)
    stats.tsx           # counter angka (GSAP + ScrollTrigger)
    about.tsx
    skills.tsx          # progress bar per kategori (GSAP width reveal)
    education.tsx
    featured-projects.tsx
  work/
    experience-timeline.tsx
    project-grid.tsx     # client component: filter kategori
  blog/
    post-list.tsx
  contact/
    testimonials.tsx
    contact-form.tsx     # client component: local state sukses/gagal
  ui/
    terminal-window.tsx  # shared "code editor" chrome (dot merah/kuning/hijau)
    chip.tsx
    section-heading.tsx
lib/
  types.ts            # tipe TS untuk seluruh shape data.json
  data.ts              # helper import + type-cast data.json
data/
  data.json
public/
  images/              # folder kosong dengan struktur siap diisi (avatar, screenshot proyek)
```

## Struktur `data.json`

Top-level keys:
- `profile`: name, role, tagline/bio, location, email, github, linkedin, openToWork (bool), terminalLines (array {prefix, text} untuk efek mengetik whoami.sh)
- `stats`: array {value (number), suffix, label}
- `about`: paragraphs (string[]), traits (string[])
- `skills`: groups (array {title, color, items: {name, level 1-4}[]}), tools (string[])
- `education`: array {year, school, degree}
- `experience`: array {role, company, location, period, points: string[], tags: string[], dotColor}
- `projects`: array {name, category, desc, tags: string[], image (path, optional), liveUrl, codeUrl, featured (bool)}
- `blog`: array {title, date, excerpt, tags: string[]}
- `testimonials`: array {quote, name, role}
- `footer`: {tagline, socialLinks: {github, linkedin, email}}
- `seo`: {siteName, siteUrl, defaultTitle, defaultDescription, ogImage, twitterHandle, locale, keywords: string[]}

Penyederhanaan dari desain asli (menghindari duplikasi data — bukan penambahan scope, murni DRY):
- Home "featured projects" = filter `projects.filter(p => p.featured)`, bukan array terpisah.
- Marquee skill ticker Home = derive dari `skills.tools`, bukan array hardcode terpisah.

## Styling & desain token

`app/globals.css` mendefinisikan CSS variable dari warna oklch desain asli, dipetakan ke Tailwind theme (v4 `@theme`):
- `--color-bg` (krem, oklch 97% 0.015 85)
- `--color-ink` (hampir hitam, oklch 20% 0.02 85)
- `--color-accent-green` (oklch 55% 0.15 150)
- `--color-accent-orange` (oklch 70% 0.15 55)
- font family: `--font-mono` (JetBrains Mono), `--font-sans` (Space Grotesk)

## Animasi (GSAP)

- Typing effect terminal hero: GSAP timeline mengetik karakter per karakter dari `profile.terminalLines`.
- Counter stats: GSAP tween angka dari 0 ke value saat masuk viewport (`ScrollTrigger`, trigger sekali).
- Scroll-reveal (about, skills, education, featured, timeline pekerjaan): `ScrollTrigger` fade+translateY, trigger sekali per elemen.
- Skill progress bar: width animate saat section masuk viewport.
- Tilt parallax hero terminal: `onMouseMove` state React biasa (tidak perlu GSAP, cukup CSS transform).
- Marquee ticker: CSS `@keyframes` infinite scroll (tidak pakai GSAP — lebih ringan, tidak butuh interaktivitas).

## SEO

- `generateMetadata` per route (title template `%s — {siteName}`, description dari `data.json`).
- `app/layout.tsx`: `<html lang="id">`, `metadataBase`, Open Graph + Twitter card default, favicon/icons.
- JSON-LD: `Person` schema (nama, jobTitle, url, sameAs github/linkedin) di Home, `WebSite` schema di root layout.
- `app/sitemap.ts` dan `app/robots.ts` dinamis (base URL dari `seo.siteUrl`).
- Semantic HTML: satu `h1` per halaman, heading hierarchy rapi.
- `next/image` untuk avatar & screenshot proyek begitu path gambar tersedia di `data.json` (placeholder tetap ditampilkan kalau field `image` kosong).

## Responsive

Breakpoint Tailwind default (`sm` 640px, `md` 768px, `lg` 1024px):
- Hero grid `1.1fr/0.9fr` → 1 kolom di bawah `md`.
- Stats grid 3 kolom → 1 kolom di bawah `sm`.
- Skills grid 2 kolom → 1 kolom di bawah `sm`.
- Featured/project grid 3 kolom → 2 kolom di `sm`–`md`, 1 kolom di bawah `sm`.
- Nav: flex-wrap bawaan cukup untuk 4 link, tidak perlu hamburger.

## Verifikasi

- `npm run build` — pastikan type-check TypeScript lolos & tidak ada error metadata.
- `npm run dev` — cek visual tiap halaman di breakpoint mobile/tablet/desktop via browser.
- Cek `<head>` tiap halaman (title, meta description, OG tags) sesuai `data.json`.

## Di luar scope (eksplisit tidak dikerjakan)

- Backend/API untuk contact form (hanya simulasi sukses di client).
- Halaman detail per blog post (`/blog/[slug]`).
- CMS atau database — konten murni dari `data.json` statis.
