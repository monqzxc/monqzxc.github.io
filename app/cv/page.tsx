import type { Metadata } from "next";
import CvBuilder from "@/components/cv/cv-builder";
import "./cv.css";
export const metadata: Metadata = {
  title: "CV Studio — Mon",
  description: "Download Anthony Cabigayan's CV, or create your own with a live preview and PDF export.",
};
export default function CvPage() { return <CvBuilder />; }
