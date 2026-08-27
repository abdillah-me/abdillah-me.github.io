import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TerminalWindow } from './terminal-window';

describe('TerminalWindow', () => {
  it('renders the title bar and children', () => {
    render(<TerminalWindow title="whoami.sh">hello</TerminalWindow>);
    expect(screen.getByText('whoami.sh')).toBeInTheDocument();
    expect(screen.getByText('hello')).toBeInTheDocument();
  });
});
