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
