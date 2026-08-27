import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skills } from './skills';

describe('Skills', () => {
  it('renders each skill group title and item name', () => {
    render(<Skills />);
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('React / Next.js')).toBeInTheDocument();
  });
});
