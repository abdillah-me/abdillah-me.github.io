import { describe, it, expect } from 'vitest';
import { filterProjects } from './filter-projects';
import type { Project } from './types';

const projects: Project[] = [
  { name: 'A', category: 'web', desc: '', tags: [], image: null, liveUrl: null, codeUrl: null, featured: false },
  { name: 'B', category: 'ai', desc: '', tags: [], image: null, liveUrl: null, codeUrl: null, featured: false },
];

describe('filterProjects', () => {
  it('returns all projects for category "semua"', () => {
    expect(filterProjects(projects, 'semua')).toEqual(projects);
  });

  it('returns only projects matching the given category', () => {
    expect(filterProjects(projects, 'ai')).toEqual([projects[1]]);
  });
});
