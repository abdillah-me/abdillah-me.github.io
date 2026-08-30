import type { MetadataRoute } from 'next';
import { data } from '@/lib/data';

// Required by `output: 'export'`: no request-time input, so pin it static.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const { siteUrl } = data.seo;
  const routes = ['', '/work', '/blog', '/contact'];

  // trailingSlash is on, so canonical URLs end in a slash; keep the sitemap
  // pointing at the same URLs rather than their redirecting counterparts.
  return routes.map((route) => ({
    url: `${siteUrl}${route}/`,
    lastModified: new Date(),
  }));
}
