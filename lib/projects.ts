export const projects = [
  {
    id: "tesda-track",
    number: "01",
    category: "AI-driven recommendations",
    title: "TESDA-TRACK",
    summary: "AI-driven training and assessment center recommendations. Match a learner's goal, in English, Filipino or Taglish, to TESDA qualifications, then rank nearby training and assessment centers with an explained score.",
    tags: ["FastAPI + PostgreSQL", "pgvector embeddings", "React 19"],
    steps: 4,
    tone: "recruitment",
  },
  {
    id: "application-exam-management",
    number: "02",
    category: "Recruitment & assessment",
    title: "Application Exam Management",
    summary: "From a competency-based question bank to randomized applicant exams and automatically scored results.",
    tags: ["Laravel 12 + Nova", "Vue 3 + Inertia", "Excel import"],
    steps: 4,
    tone: "recruitment",
  },
  {
    id: "hris-process",
    number: "03",
    category: "People & operations",
    title: "HRIS Process",
    summary: "Connect offices, plantilla positions, employee records, and daily time records in one personnel workflow.",
    tags: ["Laravel 12", "Vue 3", "MySQL"],
    steps: 4,
    tone: "hris",
  },
  {
    id: "job-application",
    number: "04",
    category: "Talent acquisition",
    title: "Job Application",
    summary: "Follow an applicant from finding an opening and submitting requirements through assessment and appointment.",
    tags: ["Laravel 12", "Vue 3", "Scoring engine"],
    steps: 4,
    tone: "recruitment",
  },
  {
    id: "pcr-management",
    number: "05",
    category: "Performance management",
    title: "PCR Management",
    summary: "Set office commitments, track monthly accomplishments, rate performance, and approve the final report.",
    tags: ["Laravel 12", "Vue 3 + Pinia", "Reverb live sync"],
    steps: 4,
    tone: "performance",
  },
  {
    id: "pds-generation",
    number: "06",
    category: "Document automation",
    title: "PDS Generation",
    summary: "Turn personal information, education, work history, and training records into a print-ready Personal Data Sheet.",
    tags: ["Laravel 12 + Vue 3", "PDF generation", "QR verification"],
    steps: 4,
    tone: "records",
  },
  {
    id: "arta-client-survey",
    number: "07",
    category: "Client satisfaction",
    title: "ARTA Client Survey",
    summary: "Collect client feedback through office QR links, monitor responses, and generate regional or nationwide satisfaction reports.",
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
    summary: "A Pokémon walking game for Amazfit watches. Eggs hatch at 5 km and evolve as you go, with a phone app for the Dex, missions and expeditions.",
    tags: ["Zepp OS watch app", "Expo / React Native", "Supabase sync"],
    steps: 4,
    tone: "hris",
  },
] as const;

export type Project = (typeof projects)[number] | (typeof personalProjects)[number];

export function projectPreviewUrl(project: Project) {
  return `/project-previews/${project.id}/index.html`;
}
