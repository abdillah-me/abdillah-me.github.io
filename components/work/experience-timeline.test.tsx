import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExperienceTimeline } from './experience-timeline';
import { data } from '@/lib/data';

describe('ExperienceTimeline', () => {
  it('renders every job from data.json', () => {
    render(<ExperienceTimeline />);
    for (const job of data.experience) {
      // Roles and companies repeat across entries, so assert on occurrences
      // rather than uniqueness.
      expect(screen.getAllByText(job.role).length).toBeGreaterThan(0);
      expect(screen.getAllByText(new RegExp(job.company.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))).length)
        .toBeGreaterThan(0);
    }
    expect(screen.getAllByText(data.experience[0].period).length).toBeGreaterThan(0);
  });
});
