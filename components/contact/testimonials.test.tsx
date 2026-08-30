import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Testimonials } from './testimonials';
import { data } from '@/lib/data';

describe('Testimonials', () => {
  it('renders every quote and author from data.json', () => {
    const { container } = render(<Testimonials />);

    if (data.testimonials.length === 0) {
      // Nothing to show yet: render nothing rather than an empty grid under a
      // heading. Fabricated quotes attributed to named people must not stand in.
      expect(container).toBeEmptyDOMElement();
      return;
    }

    for (const t of data.testimonials) {
      expect(screen.getByText(new RegExp(t.quote.slice(0, 30).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))).toBeInTheDocument();
      expect(screen.getByText(t.name)).toBeInTheDocument();
    }
  });
});
