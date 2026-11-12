import type { Metadata } from "next";
import BentoBoard from "@/components/bento-board";

export const metadata: Metadata = {
  title: "Trainer Card — Mon · Anthony Cabigayan",
  description: "Anthony Cabigayan's portfolio at a glance: selected work, awards, CV, and Pokémon mini-games on one board.",
};

export default function BentoPage() {
  return <BentoBoard />;
}
