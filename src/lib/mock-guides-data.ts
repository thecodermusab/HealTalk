export interface GuideItem {
  id: string;
  title: string;
  coverTitle?: string; // If different from main title
  theme: "lavender" | "green" | "cream" | "blue";
  href: string;
}

export const GUIDES: GuideItem[] = [
  {
    id: "1",
    title: "The Amby Method",
    coverTitle: "The Amby method.",
    theme: "lavender",
    href: "/resources/guides/amby-method",
  },
  {
    id: "2",
    title: "Remote Hiring Guide",
    coverTitle: "Remote hiring guide.",
    theme: "green",
    href: "/resources/guides/remote-hiring",
  },
  {
    id: "3",
    title: "Company Culture 101",
    coverTitle: "Company culture 101.",
    theme: "cream",
    href: "/resources/guides/company-culture",
  },
  {
    id: "4",
    title: "Writing a Great Job Description",
    coverTitle: "Writing a great job description.",
    theme: "blue",
    href: "/resources/guides/job-description",
  },
  {
    id: "5",
    title: "Recruitment ROI Report",
    coverTitle: "Recruitment ROI report.",
    theme: "green",
    href: "/resources/guides/roi-report",
  },
  {
    id: "6",
    title: "Creating a Candidate Persona",
    coverTitle: "Creating a candidate persona.",
    theme: "cream",
    href: "/resources/guides/candidate-persona",
  },
  {
    id: "7",
    title: "Talent Flow: Tech Consulting",
    coverTitle: "Talent Flow: Tech consulting.",
    theme: "blue",
    href: "/resources/guides/talent-flow",
  },
  {
    id: "8",
    title: "Diversity & Inclusion Handbook",
    coverTitle: "D&I Handbook.",
    theme: "lavender",
    href: "/resources/guides/diversity",
  },
  {
    id: "9",
    title: "The Startup Hiring Kit",
    coverTitle: "Startup hiring kit.",
    theme: "cream",
    href: "/resources/guides/startup-kit",
  },
  {
    id: "10",
    title: "Onboarding Best Practices 2026",
    coverTitle: "Onboarding 2026.",
    theme: "green",
    href: "/resources/guides/onboarding",
  },
  {
    id: "11",
    title: "Executive Search Guide",
    coverTitle: "Executive search.",
    theme: "blue",
    href: "/resources/guides/executive-search",
  },
  {
    id: "12",
    title: "Global Talent Trends",
    coverTitle: "Global trends.",
    theme: "lavender",
    href: "/resources/guides/global-trends",
  },
];
