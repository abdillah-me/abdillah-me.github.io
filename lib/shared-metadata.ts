import { data } from '@/lib/data';

const { seo } = data;

const OG_IMAGE_PATH = '/images/og-image.png';

// Next.js merges metadata *shallowly*: a segment that defines `openGraph` or
// `twitter` replaces the parent's object wholesale instead of merging it field
// by field. Any field that must survive on every route therefore has to be
// re-applied by each segment that touches these objects, so keep them here and
// spread them in both the root layout and `pageMetadata()`.
//
// The image is generated into public/ by scripts/generate-og-image.mjs at
// prebuild. It lives here rather than behind the app/opengraph-image.tsx file
// convention because that convention only attaches to its own segment (nested
// routes that define `openGraph` drop it), and because its static export has
// no file extension for GitHub Pages to type. `metadataBase` makes it absolute.
export const sharedOpenGraph = {
  type: 'website' as const,
  locale: seo.locale,
  siteName: seo.siteName,
  images: [OG_IMAGE_PATH],
};

export const sharedTwitter = {
  card: 'summary_large_image' as const,
  images: [OG_IMAGE_PATH],
};
