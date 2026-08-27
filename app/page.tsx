import type { Metadata } from 'next';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { JsonLd } from '@/components/json-ld';
import { Hero } from '@/components/home/hero';
import { Marquee } from '@/components/home/marquee';
import { Stats } from '@/components/home/stats';
import { About } from '@/components/home/about';
import { Skills } from '@/components/home/skills';
import { Education } from '@/components/home/education';
import { FeaturedProjects } from '@/components/home/featured-projects';
import { data } from '@/lib/data';
import { pageMetadata } from '@/lib/page-metadata';

const { profile, seo } = data;

export const metadata: Metadata = pageMetadata({
  title: seo.defaultTitle,
  description: seo.defaultDescription,
  path: '/',
});

export default function HomePage() {
  return (
    <div className="font-sans text-ink min-h-screen overflow-x-hidden">
      <Nav />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: profile.name,
          jobTitle: profile.role,
          url: seo.siteUrl,
          sameAs: [profile.github, profile.linkedin],
        }}
      />
      <main>
        <Hero />
        <Marquee />
        <div className="max-w-[1100px] mx-auto px-6 pt-16">
          <Stats />
          <About />
          <Skills />
          <Education />
          <FeaturedProjects />
        </div>
      </main>
      <Footer />
    </div>
  );
}
