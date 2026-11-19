export const projects = [
  {
    id: "tesda-track",
    number: "01",
    category: "AI-driven recommendations",
    title: "TESDA-TRACK",
    summary: "Matches a learner's goal, in English, Filipino or Taglish, to TESDA qualifications and nearby centers, with an explained score.",
    tags: ["FastAPI + PostgreSQL", "pgvector embeddings", "React 19"],
    steps: 4,
    tone: "recruitment",
  },
  {
    id: "application-exam-management",
    number: "02",
    category: "Recruitment & assessment",
    title: "Application Exam Management",
    summary: "Question bank to randomized exams to auto-scored results.",
    tags: ["Laravel 12 + Nova", "Vue 3 + Inertia", "Excel import"],
    steps: 4,
    tone: "recruitment",
  },
  {
    id: "hris-process",
    number: "03",
    category: "People & operations",
    title: "HRIS Process",
    summary: "Offices, plantilla, employee records and time logs in one workflow.",
    tags: ["Laravel 12", "Vue 3", "MySQL"],
    steps: 4,
    tone: "hris",
  },
  {
    id: "job-application",
    number: "04",
    category: "Talent acquisition",
    title: "Job Application",
    summary: "From job opening to appointment, with assessment in between.",
    tags: ["Laravel 12", "Vue 3", "Scoring engine"],
    steps: 4,
    tone: "recruitment",
  },
  {
    id: "pcr-management",
    number: "05",
    category: "Performance management",
    title: "PCR Management",
    summary: "Commitments, monthly accomplishments, ratings and final approval.",
    tags: ["Laravel 12", "Vue 3 + Pinia", "Reverb live sync"],
    steps: 4,
    tone: "performance",
  },
  {
    id: "pds-generation",
    number: "06",
    category: "Document automation",
    title: "PDS Generation",
    summary: "Employee records in, print-ready Personal Data Sheet out.",
    tags: ["Laravel 12 + Vue 3", "PDF generation", "QR verification"],
    steps: 4,
    tone: "records",
  },
  {
    id: "arta-client-survey",
    number: "07",
    category: "Client satisfaction",
    title: "ARTA Client Survey",
    summary: "QR-linked client feedback, rolled up into regional and national reports.",
    tags: ["Laravel 12", "Inertia + Vue", "Laravel Excel"],
    steps: 5,
    tone: "hris",
  },
] as const;

export const personalProjects = [
  {
    id: "zepimon",
    number: "01",
    category: "Wearable game",
    title: "Zepimon",
    summary: "A walking game for Amazfit watches. Eggs hatch at 5 km; a phone app holds the Dex.",
    tags: ["Zepp OS watch app", "Expo / React Native", "Supabase sync"],
    steps: 4,
    tone: "hris",
  },
] as const;

export type Project = (typeof projects)[number] | (typeof personalProjects)[number];

export function projectPreviewUrl(project: Project) {
  return `/project-previews/${project.id}/index.html`;
}

/** Portrait cover composed from the project's own walkthrough screens. */
export function projectCoverUrl(project: Project) {
  return `/project-previews/${project.id}/cover.webp`;
}

export const showcase = [
  ...projects.map(project => ({ project: project as Project, personal: false })),
  ...personalProjects.map(project => ({ project: project as Project, personal: true })),
];
