import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExperienceTimeline } from './experience-timeline';

describe('ExperienceTimeline', () => {
  it('renders every job from data.json', () => {
    render(<ExperienceTimeline />);
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    expect(screen.getByText(/Vela Teknologi/)).toBeInTheDocument();
  });
});
