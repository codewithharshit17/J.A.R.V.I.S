"use client";

import { GLASS, GLOW } from "@/lib/designConstants";

/**
 * JARVIS Glassmorphism Effect System
 * Unified approach to creating holographic glass effects
 * Combines backdrop blur, transparency, and neon glowing
 */

export interface GlassmorphismOptions {
  blur?: "light" | "medium" | "heavy" | "ultra";
  glowIntensity?: "light" | "medium" | "heavy";
  neon?: boolean;
  inset?: boolean;
  color?: "cyan" | "blue" | "light";
}

/**
 * Generate glassmorphism CSS properties
 */
export function getGlassmorphismStyle(options: GlassmorphismOptions = {}) {
  const {
    blur = "medium",
    glowIntensity = "medium",
    neon = true,
    inset = false,
    color = "cyan",
  } = options;

  const backdropFilter = GLASS.backdrop[blur];
  const baseOpacity = GLASS.opacity[glowIntensity === "heavy" ? "heavy" : glowIntensity === "light" ? "light" : "medium"];
  const sizeMap: Record<string, string> = { light: "sm", medium: "md", heavy: "lg" };
  const size = sizeMap[glowIntensity] || "md";
  const colorKey = color as "cyan" | "blue" | "light";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const glowEffect = (GLOW[colorKey] as any)[size];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const insetGlow = inset ? (GLOW.inset as any)[size] : "";

  return {
    backdropFilter,
    backgroundColor: `rgba(7, 17, 31, ${baseOpacity})`,
    boxShadow: neon ? `${glowEffect}${insetGlow ? ", " + insetGlow : ""}` : "none",
    border: neon ? "1px solid rgba(0, 229, 255, 0.2)" : "1px solid rgba(0, 229, 255, 0.1)",
  };
}

/**
 * Common glassmorphism presets
 */
export const GLASSMORPHISM_PRESETS = {
  // Subtle background panels
  subtle: {
    backdropFilter: GLASS.backdrop.light,
    backgroundColor: "rgba(7, 17, 31, 0.4)",
    boxShadow: GLOW.cyan.sm,
    border: "1px solid rgba(0, 229, 255, 0.1)",
  },

  // Standard holographic panels
  standard: {
    backdropFilter: GLASS.backdrop.medium,
    backgroundColor: "rgba(7, 17, 31, 0.6)",
    boxShadow: GLOW.cyan.md,
    border: "1px solid rgba(0, 229, 255, 0.2)",
  },

  // Heavy/prominent panels
  heavy: {
    backdropFilter: GLASS.backdrop.heavy,
    backgroundColor: "rgba(7, 17, 31, 0.8)",
    boxShadow: `${GLOW.cyan.lg}, inset 0 0 20px rgba(0, 229, 255, 0.2)`,
    border: "1px solid rgba(0, 229, 255, 0.3)",
  },

  // Ultra heavy (opaque-looking but glassy)
  ultra: {
    backdropFilter: GLASS.backdrop.ultra,
    backgroundColor: "rgba(7, 17, 31, 0.9)",
    boxShadow: `${GLOW.cyan.xl}, inset 0 0 30px rgba(0, 229, 255, 0.3)`,
    border: "2px solid rgba(0, 229, 255, 0.4)",
  },

  // Neon edge glow (no fill)
  neonEdge: {
    backdropFilter: GLASS.backdrop.light,
    backgroundColor: "rgba(7, 17, 31, 0.2)",
    boxShadow: `0 0 20px rgba(0, 229, 255, 0.5), inset 0 0 10px rgba(0, 229, 255, 0.1)`,
    border: "2px solid rgba(0, 229, 255, 0.6)",
  },

  // Blue variant (heavy)
  blueHeavy: {
    backdropFilter: GLASS.backdrop.heavy,
    backgroundColor: "rgba(7, 17, 31, 0.8)",
    boxShadow: `${GLOW.blue.lg}, inset 0 0 20px rgba(0, 178, 255, 0.2)`,
    border: "1px solid rgba(0, 178, 255, 0.3)",
  },

  // Light variant (heavy)
  lightHeavy: {
    backdropFilter: GLASS.backdrop.heavy,
    backgroundColor: "rgba(7, 17, 31, 0.8)",
    boxShadow: `${GLOW.light.lg}, inset 0 0 20px rgba(182, 247, 255, 0.2)`,
    border: "1px solid rgba(182, 247, 255, 0.3)",
  },

  // Minimal floating (for small UI elements)
  minimal: {
    backdropFilter: GLASS.backdrop.light,
    backgroundColor: "rgba(7, 17, 31, 0.3)",
    boxShadow: GLOW.cyan.sm,
    border: "1px solid rgba(0, 229, 255, 0.15)",
  },

  // Command input (focused)
  commandInput: {
    backdropFilter: GLASS.backdrop.medium,
    backgroundColor: "rgba(7, 17, 31, 0.7)",
    boxShadow: `${GLOW.cyan.md}, inset 0 0 15px rgba(0, 229, 255, 0.15)`,
    border: "2px solid rgba(0, 229, 255, 0.3)",
  },

  // Modal overlay
  modal: {
    backdropFilter: GLASS.backdrop.ultra,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    boxShadow: "none",
    border: "none",
  },
};

/**
 * Hook for applying glassmorphism to React component
 */
export function useGlassmorphism(preset: keyof typeof GLASSMORPHISM_PRESETS = "standard") {
  return GLASSMORPHISM_PRESETS[preset];
}

/**
 * Tailwind class generator for glassmorphism
 */
export function glassClass(preset: keyof typeof GLASSMORPHISM_PRESETS = "standard"): string {
  const baseClasses = "backdrop-blur-md bg-opacity-60 border border-cyan-500/20";
  
  const presetClasses: Record<string, string> = {
    subtle: "backdrop-blur-sm bg-cyan-950/40 border border-cyan-500/10",
    standard: "backdrop-blur-md bg-cyan-950/60 border border-cyan-500/20 shadow-lg shadow-cyan-500/10",
    heavy: "backdrop-blur-xl bg-cyan-950/80 border border-cyan-500/30 shadow-xl shadow-cyan-500/20",
    ultra: "backdrop-blur-3xl bg-cyan-950/90 border-2 border-cyan-500/40 shadow-2xl shadow-cyan-500/30",
    neonEdge: "backdrop-blur-sm bg-cyan-950/20 border-2 border-cyan-500/60 shadow-lg shadow-cyan-500/50",
    blueHeavy: "backdrop-blur-xl bg-cyan-950/80 border border-blue-500/30 shadow-xl shadow-blue-500/20",
    lightHeavy: "backdrop-blur-xl bg-cyan-950/80 border border-cyan-300/30 shadow-xl shadow-cyan-300/20",
    minimal: "backdrop-blur-sm bg-cyan-950/30 border border-cyan-500/15 shadow-md shadow-cyan-500/10",
    commandInput: "backdrop-blur-md bg-cyan-950/70 border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/20",
    modal: "backdrop-blur-3xl bg-black/70",
  };

  return presetClasses[preset] || baseClasses;
}

/**
 * Extended glassmorphism with animation
 * Returns motion props combined with glass styling
 */
export function getAnimatedGlassmorphism(
  preset: keyof typeof GLASSMORPHISM_PRESETS = "standard",
  animateGlow = true
) {
  const baseStyle = GLASSMORPHISM_PRESETS[preset];

  if (!animateGlow) return baseStyle;

  return {
    ...baseStyle,
    animate: {
      boxShadow: [
        baseStyle.boxShadow,
        baseStyle.boxShadow?.includes("inset")
          ? baseStyle.boxShadow.replace(/0 0 \d+px/g, (match) => {
              const num = parseInt(match.match(/\d+/)![0]);
              return `0 0 ${num * 1.2}px`;
            })
          : baseStyle.boxShadow,
        baseStyle.boxShadow,
      ],
    },
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  };
}
