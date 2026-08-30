import type { MetadataRoute } from 'next';
import { data } from '@/lib/data';

// Required by `output: 'export'`: no request-time input, so pin it static.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const { siteUrl } = data.seo;

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
