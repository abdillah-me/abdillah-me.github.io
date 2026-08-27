import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SectionHeading } from './section-heading';

describe('SectionHeading', () => {
  it('renders eyebrow and title', () => {
    render(<SectionHeading eyebrow="/ / keahlian teknis" title="Skill" />);
    expect(screen.getByText('/ / keahlian teknis')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Skill' })).toBeInTheDocument();
  });
});
