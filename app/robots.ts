import type { MetadataRoute } from 'next';
import { data } from '@/lib/data';

export default function robots(): MetadataRoute.Robots {
  const { siteUrl } = data.seo;

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
