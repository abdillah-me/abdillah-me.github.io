export interface Profile {
  name: string;
  handle: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  openToWork: boolean;
  terminalLines: { prefix: string; text: string }[];
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface SkillItem {
  name: string;
  level: 1 | 2 | 3 | 4;
}

export interface SkillGroup {
  title: string;
  color: string;
  items: SkillItem[];
}

export interface EducationEntry {
  year: string;
  school: string;
  degree: string;
}

export interface ExperienceEntry {
  role: string;
  company: string;
  location: string;
  period: string;
  points: string[];
  tags: string[];
  dotColor: string;
}

export type ProjectCategory = 'web' | 'mobile' | 'backend' | 'ai' | 'automation';

export interface Project {
  name: string;
  category: ProjectCategory;
  desc: string;
  tags: string[];
  image: string | null;
  liveUrl: string | null;
  codeUrl: string | null;
  featured: boolean;
}

export interface BlogPost {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface FooterData {
  tagline: string;
  socialLinks: { github: string; linkedin: string; email: string };
}

export interface ContactContent {
  intro: string;
}

export interface SeoData {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  ogImage: string;
  twitterHandle: string;
  locale: string;
  keywords: string[];
}

export interface PortfolioData {
  profile: Profile;
  stats: Stat[];
  about: { paragraphs: string[]; traits: string[] };
  skills: { groups: SkillGroup[]; tools: string[] };
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: Project[];
  blog: BlogPost[];
  testimonials: Testimonial[];
  footer: FooterData;
  contact: ContactContent;
  seo: SeoData;
}
