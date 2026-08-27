import type { Metadata } from 'next';
import { data } from '@/lib/data';

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const { seo } = data;
  const url = `${seo.siteUrl}${path}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url },
    twitter: { title, description },
  };
}
