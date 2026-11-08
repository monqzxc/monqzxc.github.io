import { personalProjects, projects } from "./projects.ts";

export type CvEntry = { title: string; organization: string; period: string; details: string; url?: string };
export type CvData = {
  name: string; role: string; email: string; phone: string; location: string; website: string;
  summary: string; skills: string; eligibility: string; interests: string;
  experience: CvEntry[]; projects: CvEntry[]; education: CvEntry[]; certifications: CvEntry[]; training: CvEntry[]; awards: CvEntry[];
};
export const blankEntry = (): CvEntry => ({ title: "", organization: "", period: "", details: "" });
export const blankCv = (): CvData => ({
  name: "", role: "", email: "", phone: "", location: "", website: "", summary: "", skills: "", eligibility: "", interests: "",
  experience: [blankEntry()], projects: [], education: [blankEntry()], certifications: [], training: [], awards: [],
});
export const monCv: CvData = {
  name: "Anthony Cabigayan", role: "Software Engineer", email: "suppmon27@gmail.com", phone: "", location: "Manila, Philippines", website: "github.com/monqzxc",
  summary: "Software engineer focused on dependable enterprise systems and clear digital workflows. Builds Laravel and Vue applications for public-sector performance management, recruitment, personnel records, and document automation.",
  skills: "PHP / Laravel\nVue.js / Inertia.js\nJavaScript / React / Next.js\nMySQL\nDocker / Git\nPDF generation / Workflow design\nAI-assisted app building\nAI for brainstorming and planning\nData analysis fundamentals",
  eligibility: "Career Service Professional\nMarch 13, 2022 · Muntinlupa\nRating: 82.5%",
  interests: "Traveling, running, watching anime, gaming, and reading.",
  experience: [
    { title: "Programmer (Back-end Developer)", organization: "TESDA", period: "November 2022 - Present", details: "Develop enterprise applications using Laravel, Vue, and Inertia.\nBuild performance management, recruitment, and HRIS workflows.\nAutomate Personal Data Sheets and supporting employee documents." },
    { title: "Freelance work", organization: "Independent", period: "April 2022 - October 2022", details: "" },
    { title: "IT Support Staff", organization: "TESDA Region IV-A", period: "January 2020 - March 2022", details: "" },
  ],
  projects: [
    ...projects.map(project => ({ title: project.title, organization: project.tags.join(" · "), period: "", details: project.summary })),
    ...personalProjects.map(project => ({ title: `${project.title} (personal project)`, organization: project.tags.join(" · "), period: "", details: project.summary })),
  ],
  education: [
    { title: "BS in Computer Science", organization: "St. Nicolas College of Business and Technology", period: "June 2016 - March 2019", details: "" },
    { title: "2-year Computer Programming", organization: "St. Nicolas College of Business and Technology", period: "June 2014 - April 2016", details: "" },
  ],
  certifications: [
    { title: "AI for Brainstorming and Planning", organization: "Google · Coursera", period: "", details: "", url: "https://www.credly.com/badges/532d2afd-c52d-4d2d-b1e6-65ea3b84f17a/public_url" },
    { title: "AI Fundamentals", organization: "Google · Coursera", period: "", details: "", url: "https://www.credly.com/badges/5a8a5a26-4b14-4862-bc84-cef03e076c53/public_url" },
    { title: "AI for App Building", organization: "Google · Coursera", period: "", details: "", url: "https://www.credly.com/badges/7d7e3443-3fb6-45be-b898-c6b859b4c9c1/public_url" },
    { title: "Foundations: Data, Data, Everywhere", organization: "Google · Coursera", period: "", details: "" },
  ],
  training: [
    { title: "Responsible and Ethical Use of Generative AI", organization: "DICT Region 5", period: "October 13, 2025 · 2 hours", details: "" },
    { title: "Introduction to IT Acquisition", organization: "University of the Philippines System - ITDC", period: "September 3, 2025 · 2 hours", details: "" },
    { title: "Introduction to IT Project Management", organization: "University of the Philippines System - ITDC", period: "August 6, 2025 · 2 hours", details: "" },
    { title: "Architecting on AWS", organization: "Trainocate", period: "January 22-24, 2025 · 24 hours", details: "" },
    { title: "Technical Essentials on AWS", organization: "Trainocate", period: "January 20, 2025 · 8 hours", details: "" },
  ],
  awards: [
    { title: "WorldSkills Kazan", organization: "Team Philippines · IT Software Solutions for Business", period: "2019", details: "", url: "https://www.credly.com/badges/07a81712-0ffb-459b-934c-f68c680caa93/public_url" },
    { title: "Medallion for Excellence · ITSSB", organization: "WorldSkills ASEAN Bangkok", period: "2018", details: "" },
    { title: "Silver Medal · ITSSB", organization: "Zonal Skills Competition", period: "2017", details: "" },
    { title: "Gold Medals · ITSSB", organization: "Regional and Provincial Skills Competitions", period: "2017", details: "" },
  ],
};
