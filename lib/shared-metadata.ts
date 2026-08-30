import { data } from '@/lib/data';

const { seo } = data;

const OG_IMAGE_PATH = '/opengraph-image';

// Next.js merges metadata *shallowly*: a segment that defines `openGraph` or
// `twitter` replaces the parent's object wholesale instead of merging it field
// by field. Any field that must survive on every route therefore has to be
// re-applied by each segment that touches these objects, so keep them here and
// spread them in both the root layout and `pageMetadata()`.
//
// The image is rendered by the `app/opengraph-image.tsx` file convention, but
// that only attaches itself to its own segment: nested routes that define
// `openGraph` drop it along with everything else. Pointing at the generated
// route by path puts it back on every page. `metadataBase` makes it absolute.
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
