import type { Metadata } from "next";
import Portfolio from "@/components/portfolio";

export const metadata: Metadata = {
  title: "Portfolio — Mon · Anthony Cabigayan",
  description: "Selected work, journey, certifications, and side projects by Anthony Cabigayan (Mon), a full-stack software engineer.",
};

export default function PortfolioPage() {
  return <Portfolio />;
}
