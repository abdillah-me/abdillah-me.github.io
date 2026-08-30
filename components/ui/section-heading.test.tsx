import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SectionHeading } from './section-heading';

describe('SectionHeading', () => {
  it('renders eyebrow and title', () => {
    render(<SectionHeading eyebrow="/ / keahlian teknis" title="Skill" />);
    expect(screen.getByText('/ / keahlian teknis')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Skill' })).toBeInTheDocument();
  });

  it('promotes the eyebrow to the heading when no title is given, so the section is never unlabelled', () => {
    render(<SectionHeading eyebrow="/ / pendidikan" />);
    expect(screen.getByRole('heading', { level: 2, name: '/ / pendidikan' })).toBeInTheDocument();
  });
});
