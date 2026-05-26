"use client";

import CinematicScrollEngine from "../components/CinematicScrollEngine";
import { useMouseGlow } from "../hooks/useMouseGlow";

export default function Home() {
  // Activate cursor-reactive CSS custom properties globally
  useMouseGlow();

  return (
    <main className="relative w-full h-full min-h-screen bg-[#050816]">
      {/* SEO Compliance: Single h1 heading per page */}
      <h1 className="sr-only">J.A.R.V.I.S. Neural Operating Environment - AI Consciousness Interface</h1>

      {/* Fullscreen cinematic holographic environment */}
      <CinematicScrollEngine />
    </main>
  );
}
