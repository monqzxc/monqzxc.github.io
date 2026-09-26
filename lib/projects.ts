export const projects = [
  {
    id: "application-exam-management",
    number: "01",
    category: "Recruitment & assessment",
    title: "Application Exam Management",
    summary: "From a competency-based question bank to randomized applicant exams and automatically scored results.",
    tags: ["Laravel Nova", "Vue 3 + Inertia", "Excel import"],
    steps: 4,
    tone: "recruitment",
  },
  {
    id: "hris-process",
    number: "02",
    category: "People & operations",
    title: "HRIS Process",
    summary: "Connect offices, plantilla positions, employee records, and daily time records in one personnel workflow.",
    tags: ["Laravel 11", "Vue 3", "MySQL"],
    steps: 4,
    tone: "hris",
  },
  {
    id: "job-application",
    number: "03",
    category: "Talent acquisition",
    title: "Job Application",
    summary: "Follow an applicant from finding an opening and submitting requirements through assessment and appointment.",
    tags: ["Laravel 11", "Vue 3", "Scoring engine"],
    steps: 4,
    tone: "recruitment",
  },
  {
    id: "pcr-management",
    number: "04",
    category: "Performance management",
    title: "PCR Management",
    summary: "Set office commitments, track monthly accomplishments, rate performance, and approve the final report.",
    tags: ["Laravel 11", "Vue 3 + Pinia", "Reverb live sync"],
    steps: 4,
    tone: "performance",
  },
  {
    id: "pds-generation",
    number: "05",
    category: "Document automation",
    title: "PDS Generation",
    summary: "Turn personal information, education, work history, and training records into a print-ready Personal Data Sheet.",
    tags: ["Laravel 11 + Vue 3", "PDF generation", "QR verification"],
    steps: 4,
    tone: "records",
  },
  {
    id: "arta-client-survey",
    number: "06",
    category: "Client satisfaction",
    title: "ARTA Client Survey",
    summary: "Collect client feedback through office QR links, monitor responses, and generate regional or nationwide satisfaction reports.",
    tags: ["Laravel 11", "Inertia + Vue", "Laravel Excel"],
    steps: 5,
    tone: "hris",
  },
] as const;

export type Project = (typeof projects)[number];

export function projectPreviewUrl(project: Project) {
  return `/project-previews/${project.id}/index.html`;
}
