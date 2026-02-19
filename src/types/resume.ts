export type PersonalDetails = {
  name: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
  summary: string;
};

export type EducationItem = {
  degree: string;
  institution: string;
  year: string;
  score: string;
};

export type ExperienceItem = {
  company: string;
  role: string;
  duration: string;
  description: string;
};

export type ProjectItem = {
  name: string;
  link: string;
  description: string;
  tech: string;
};

export type CertificationItem = {
  name: string;
  issuer: string;
  year: string;
};

export type ResumeData = {
  personal: PersonalDetails;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: string[];
  certifications: CertificationItem[];
};

export type TemplateId =
  | "classic"
  | "modern"
  | "minimal"
  | "slate"
  | "emerald"
  | "indigo"
  | "amber"
  | "rose"
  | "graphite"
  | "serif"
  | "executive"
  | "aurora"
  | "cobalt"
  | "mono"
  | "clean"
  | "bold"
  | "airy"
  | "contrast"
  | "skyline"
  | "horizon"
  | "ink"
  | "sand"
  | "ocean"
  | "forest";

export type SectionKey =
  | "summary"
  | "education"
  | "experience"
  | "projects"
  | "skills"
  | "certifications";
