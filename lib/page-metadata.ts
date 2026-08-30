import type { Metadata } from 'next';
import { data } from '@/lib/data';
import { sharedOpenGraph, sharedTwitter } from '@/lib/shared-metadata';

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
    openGraph: { ...sharedOpenGraph, title, description, url },
    twitter: { ...sharedTwitter, title, description },
  };
}
