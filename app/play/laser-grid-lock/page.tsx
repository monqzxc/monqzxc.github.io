import type { Metadata } from "next";
import LaserGridLock from "@/components/laser-grid-lock";
import "./laser-grid-lock.css";

export const metadata: Metadata = {
  title: "Laser Grid Lock — Mon's Playground",
  description: "Shift mirrors, guide Deoxys through a laser maze, and escape into the black hole. A Pokémon-inspired sci-fi puzzle game.",
};

export default function LaserGridLockPage() {
  return <LaserGridLock />;
}
