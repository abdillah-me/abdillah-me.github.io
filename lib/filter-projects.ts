import type { Project, ProjectCategory } from './types';

export type ProjectFilter = ProjectCategory | 'semua';

export function filterProjects(projects: Project[], category: ProjectFilter): Project[] {
  if (category === 'semua') return projects;
  return projects.filter((p) => p.category === category);
}
