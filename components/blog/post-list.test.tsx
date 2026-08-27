import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PostList } from './post-list';

describe('PostList', () => {
  it('renders every post title, date, and tag from data.json', () => {
    render(<PostList />);
    expect(screen.getByText('Belajar dari Migrasi Monolith ke Microservices')).toBeInTheDocument();
    expect(screen.getByText('Jun 2026')).toBeInTheDocument();
    expect(screen.getByText('arsitektur')).toBeInTheDocument();
  });
});
