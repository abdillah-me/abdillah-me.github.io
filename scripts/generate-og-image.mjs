// Renders the Open Graph card to a real .png in public/.
//
// The app/opengraph-image.tsx file convention would be the idiomatic route,
// but its static export lands at out/opengraph-image with no file extension,
// and GitHub Pages types responses purely by extension — social platforms then
// reject the image. Emitting a normal asset sidesteps that and works on any
// host. Wired to `prebuild`, so the card follows data.json automatically.

import { createElement as h } from 'react';
// `next/og` has no ESM subpath export; the .js specifier is the importable one.
import { ImageResponse } from 'next/og.js';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { profile, seo } = JSON.parse(await readFile(join(root, 'data/data.json'), 'utf8'));

// Hex equivalents of the oklch tokens in globals.css; satori has no oklch.
const CREAM = '#faf6ef';
const INK = '#2b2721';
const INK_DIM = '#4c463d';
const GREEN = '#2f9c62';
const ORANGE = '#e59a4d';

const card = h(
  'div',
  {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: CREAM,
      color: INK,
      padding: '72px 80px',
      borderBottom: `24px solid ${ORANGE}`,
    },
  },
  h('div', { style: { display: 'flex', alignItems: 'center', fontSize: 30, color: INK_DIM } }, [
    h('div', { key: 'dot', style: { width: 20, height: 20, borderRadius: 4, background: GREEN, marginRight: 18 } }),
    h('div', { key: 'handle', style: { display: 'flex' } }, [
      `${profile.handle}@portfolio`,
      h('span', { key: 'p', style: { color: GREEN, marginLeft: 4 } }, ':~$'),
    ]),
  ]),
  h('div', { style: { display: 'flex', flexDirection: 'column' } }, [
    h('div', { key: 'n', style: { fontSize: 88, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.05 } }, profile.name),
    h('div', { key: 'r', style: { fontSize: 44, color: INK_DIM, marginTop: 18 } }, profile.role),
  ]),
  h('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 28, color: INK_DIM } }, [
    h('div', { key: 'l', style: { display: 'flex' } }, profile.location),
    h('div', { key: 'u', style: { display: 'flex', color: GREEN } }, seo.siteUrl.replace('https://', '')),
  ]),
);

const png = Buffer.from(
  await new ImageResponse(card, { width: 1200, height: 630 }).arrayBuffer()
);

const out = join(root, 'public/images/og-image.png');
await mkdir(dirname(out), { recursive: true });
await writeFile(out, png);
console.log(`og image: ${out} (${png.length} bytes)`);
