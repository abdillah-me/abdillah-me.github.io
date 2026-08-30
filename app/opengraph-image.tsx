import { ImageResponse } from 'next/og';
import { data } from '@/lib/data';

const { profile, seo } = data;

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Hex equivalents of the oklch tokens in globals.css. Satori (the renderer
// behind ImageResponse) has no oklch support, so the palette is duplicated
// here rather than imported from the stylesheet.
const CREAM = '#faf6ef';
const INK = '#2b2721';
const INK_DIM = '#4c463d';
const GREEN = '#2f9c62';
const ORANGE = '#e59a4d';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: CREAM,
          color: INK,
          padding: '72px 80px',
          borderBottom: `24px solid ${ORANGE}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 30, color: INK_DIM }}>
          <div style={{ width: 20, height: 20, borderRadius: 4, background: GREEN, marginRight: 18 }} />
          <div style={{ display: 'flex' }}>
            {profile.handle}@portfolio
            <span style={{ color: GREEN, marginLeft: 4 }}>:~$</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.05 }}>
            {profile.name}
          </div>
          <div style={{ fontSize: 44, color: INK_DIM, marginTop: 18 }}>{profile.role}</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 28, color: INK_DIM }}>
          <div style={{ display: 'flex' }}>{profile.location}</div>
          <div style={{ display: 'flex', color: GREEN }}>{seo.siteUrl.replace('https://', '')}</div>
        </div>
      </div>
    ),
    size
  );
}
