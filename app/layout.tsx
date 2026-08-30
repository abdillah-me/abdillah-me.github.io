import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { data } from "@/lib/data";
import { sharedOpenGraph, sharedTwitter } from "@/lib/shared-metadata";
import { JsonLd } from "@/components/json-ld";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-jetbrains-mono",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const { seo } = data;

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: { default: seo.defaultTitle, template: `%s — ${seo.siteName}` },
  description: seo.defaultDescription,
  keywords: seo.keywords,
  openGraph: {
    ...sharedOpenGraph,
    url: seo.siteUrl,
    title: seo.defaultTitle,
    description: seo.defaultDescription,
  },
  twitter: {
    ...sharedTwitter,
    title: seo.defaultTitle,
    description: seo.defaultDescription,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${jetbrainsMono.variable} ${spaceGrotesk.variable}`}
    >
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: seo.siteName,
            url: seo.siteUrl,
          }}
        />
        {children}
      </body>
    </html>
  );
}
