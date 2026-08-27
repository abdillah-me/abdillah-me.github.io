import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Education } from './education';

describe('Education', () => {
  it('renders every education entry from data.json', () => {
    render(<Education />);
    expect(screen.getByText('Universitas Indonesia')).toBeInTheDocument();
    expect(screen.getByText('S.Kom, Teknik Informatika')).toBeInTheDocument();
  });
});
