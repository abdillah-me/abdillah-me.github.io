import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Stats } from './stats';
import { data } from '@/lib/data';

describe('Stats', () => {
  it('renders every stat label from data.json', () => {
    render(<Stats />);
    for (const stat of data.stats) {
      expect(screen.getByText(stat.label)).toBeInTheDocument();
    }
  });
});
