import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Chip } from './chip';

describe('Chip', () => {
  it('renders its label', () => {
    render(<Chip>TypeScript</Chip>);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });
});
