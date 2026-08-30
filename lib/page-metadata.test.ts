import { describe, it, expect } from 'vitest';
import { pageMetadata } from './page-metadata';
import { data } from './data';

const subject = pageMetadata({
  title: 'Kontak',
  description: 'Hubungi saya.',
  path: '/contact',
});

describe('pageMetadata', () => {
  it('sets the per-page title, description and canonical path', () => {
    expect(subject.title).toBe('Kontak');
    expect(subject.description).toBe('Hubungi saya.');
    expect(subject.alternates?.canonical).toBe('/contact');
  });

  // Next.js merges metadata shallowly, so a page that defines `openGraph` drops
  // every openGraph field the root layout set. These two tests pin the fields
  // that must be re-applied here; without them the loss is invisible until you
  // inspect the built HTML.
  it('keeps the shared openGraph fields alongside the per-page ones', () => {
    expect(subject.openGraph).toMatchObject({
      type: 'website',
      locale: data.seo.locale,
      siteName: data.seo.siteName,
      title: 'Kontak',
      url: `${data.seo.siteUrl}/contact`,
      images: ['/opengraph-image'],
    });
  });

  it('keeps the large-image twitter card', () => {
    expect(subject.twitter).toMatchObject({
      card: 'summary_large_image',
      title: 'Kontak',
      images: ['/opengraph-image'],
    });
  });
});
