import { describe, it, expect } from 'vitest';
import { getFeaturedProjects } from './get-featured-projects';
import type { Project } from './types';

const projects: Project[] = [
  { name: 'A', category: 'web', desc: '', tags: [], image: null, liveUrl: null, codeUrl: null, featured: true },
  { name: 'B', category: 'web', desc: '', tags: [], image: null, liveUrl: null, codeUrl: null, featured: false },
];

describe('getFeaturedProjects', () => {
  it('returns only projects with featured: true', () => {
    expect(getFeaturedProjects(projects)).toEqual([projects[0]]);
  });
});
