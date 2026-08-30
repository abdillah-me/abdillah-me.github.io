import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Education } from './education';
import { data } from '@/lib/data';

describe('Education', () => {
  it('renders every education entry from data.json', () => {
    render(<Education />);
    for (const entry of data.education) {
      expect(screen.getByText(entry.school)).toBeInTheDocument();
      expect(screen.getByText(entry.degree)).toBeInTheDocument();
    }
  });
});
