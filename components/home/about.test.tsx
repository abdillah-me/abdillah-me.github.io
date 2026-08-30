import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { About } from './about';
import { data } from '@/lib/data';

describe('About', () => {
  it('renders every paragraph and trait from data.json', () => {
    render(<About />);
    for (const paragraph of data.about.paragraphs) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
    for (const trait of data.about.traits) {
      expect(screen.getByText(trait)).toBeInTheDocument();
    }
  });
});
