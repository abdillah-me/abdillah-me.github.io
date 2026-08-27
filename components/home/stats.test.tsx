import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Stats } from './stats';

describe('Stats', () => {
  it('renders every stat label from data.json', () => {
    render(<Stats />);
    expect(screen.getByText('tahun pengalaman')).toBeInTheDocument();
    expect(screen.getByText('proyek diselesaikan')).toBeInTheDocument();
    expect(screen.getByText('teknologi dikuasai')).toBeInTheDocument();
  });
});
