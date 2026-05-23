"use client";

import { ReactNode } from "react";
import { DURATION } from "@/lib/motionConstants";

/**
 * JARVIS Ambient Animation System
 * Provides unified breathing, pulsing, and environmental glow effects
 * Ensures the entire interface feels alive and reactive
 */

export const AMBIENT_ANIMATIONS = {
  // Breathing glow (slow, zen-like)
  breathingGlow: {
    animate: {
      boxShadow: [
        "0 0 20px rgba(0, 229, 255, 0.3), inset 0 0 20px rgba(0, 229, 255, 0.1)",
        "0 0 50px rgba(0, 229, 255, 0.6), inset 0 0 30px rgba(0, 229, 255, 0.2)",
        "0 0 20px rgba(0, 229, 255, 0.3), inset 0 0 20px rgba(0, 229, 255, 0.1)",
      ],
    },
    transition: { duration: DURATION.breathe, repeat: Infinity, ease: "easeInOut" },
  },

  // Pulse glow (faster, more energetic)
  pulsingGlow: {
    animate: {
      boxShadow: [
        "0 0 15px rgba(0, 229, 255, 0.2)",
        "0 0 40px rgba(0, 229, 255, 0.5)",
        "0 0 15px rgba(0, 229, 255, 0.2)",
      ],
    },
    transition: { duration: DURATION.pulse, repeat: Infinity, ease: "easeInOut" },
  },

  // Text glow breathing
  textGlowBreathe: {
    animate: {
      textShadow: [
        "0 0 6px rgba(0, 229, 255, 0.4), 0 0 16px rgba(0, 229, 255, 0.2)",
        "0 0 12px rgba(0, 229, 255, 0.7), 0 0 30px rgba(0, 229, 255, 0.4)",
        "0 0 6px rgba(0, 229, 255, 0.4), 0 0 16px rgba(0, 229, 255, 0.2)",
      ],
    },
    transition: { duration: DURATION.breathe, repeat: Infinity, ease: "easeInOut" },
  },

  // Gentle opacity breathing
  opacityBreathe: {
    animate: { opacity: [0.6, 1, 0.6] },
    transition: { duration: DURATION.breathe, repeat: Infinity, ease: "easeInOut" },
  },

  // Scale breathing (subtle size pulsing)
  scaleBreathe: {
    animate: { scale: [0.98, 1.02, 0.98] },
    transition: { duration: DURATION.breathe, repeat: Infinity, ease: "easeInOut" },
  },

  // Glow bloom effect (quick pulse)
  bloomPulse: {
    animate: {
      filter: [
        "drop-shadow(0 0 15px rgba(0, 229, 255, 0.3))",
        "drop-shadow(0 0 40px rgba(0, 229, 255, 0.6))",
        "drop-shadow(0 0 15px rgba(0, 229, 255, 0.3))",
      ],
    },
    transition: { duration: DURATION.pulse, repeat: Infinity, ease: "easeInOut" },
  },

  // Rotation (slow, ambient)
  slowRotate: {
    animate: { rotate: 360 },
    transition: { duration: DURATION.rotate, repeat: Infinity, ease: "linear" },
  },

  // Rotation (medium speed)
  mediumRotate: {
    animate: { rotate: 360 },
    transition: { duration: 15000, repeat: Infinity, ease: "linear" },
  },

  // Rotation (fast)
  fastRotate: {
    animate: { rotate: 360 },
    transition: { duration: 8000, repeat: Infinity, ease: "linear" },
  },

  // Drift animation (horizontal/vertical movement)
  driftX: {
    animate: { x: [-15, 15, -15] },
    transition: { duration: DURATION.drift, repeat: Infinity, ease: "easeInOut" },
  },

  driftY: {
    animate: { y: [-10, 10, -10] },
    transition: { duration: DURATION.drift, repeat: Infinity, ease: "easeInOut" },
  },

  // Flickering effect (holographic)
  flicker: {
    animate: { opacity: [0.8, 0.95, 0.85, 1, 0.88] },
    transition: { duration: 0.15, repeat: Infinity, repeatType: "loop" },
  },

  // Gentle flicker (more subtle)
  gentleFlicker: {
    animate: { opacity: [0.9, 0.98, 0.95, 1, 0.97] },
    transition: { duration: 0.3, repeat: Infinity, repeatType: "loop" },
  },

  // Scanning line effect (top to bottom)
  scanlineTop: {
    animate: { y: ["0%", "100%"] },
    transition: { duration: DURATION.sweep, repeat: Infinity, ease: "linear" },
  },

  // Neon edge flicker
  neonFlicker: {
    animate: {
      boxShadow: [
        "0 0 10px rgba(0, 229, 255, 0.3), inset 0 0 8px rgba(0, 229, 255, 0.15)",
        "0 0 20px rgba(0, 229, 255, 0.6), inset 0 0 15px rgba(0, 229, 255, 0.3)",
        "0 0 10px rgba(0, 229, 255, 0.3), inset 0 0 8px rgba(0, 229, 255, 0.15)",
      ],
    },
    transition: { duration: 2000, repeat: Infinity, ease: "easeInOut" },
  },

  // Holographic shimmer (opacity + slight color shift)
  shimmer: {
    animate: {
      opacity: [0.7, 1, 0.7],
      filter: [
        "brightness(1) hue-rotate(0deg)",
        "brightness(1.1) hue-rotate(5deg)",
        "brightness(1) hue-rotate(0deg)",
      ],
    },
    transition: { duration: 3000, repeat: Infinity, ease: "easeInOut" },
  },

  // Data stream effect
  dataStream: {
    animate: {
      backgroundPosition: ["0% 0%", "0% 100%"],
      opacity: [0.5, 1, 0.5],
    },
    transition: { duration: 4000, repeat: Infinity, ease: "linear" },
  },

  // Orbiting satellites (use with rotate transform)
  orbitSpin: {
    animate: { rotate: [0, 360] },
    transition: { duration: 25000, repeat: Infinity, ease: "linear" },
  },

  // Reverse orbiting
  orbitSpinReverse: {
    animate: { rotate: [0, -360] },
    transition: { duration: 25000, repeat: Infinity, ease: "linear" },
  },

  // Bounce animation (subtle)
  subtleBounce: {
    animate: { y: [0, -5, 0] },
    transition: { duration: 2000, repeat: Infinity, ease: "easeInOut" },
  },

  // Hover lift
  hoverLift: {
    initial: { y: 0 },
    whileHover: { y: -8, transition: { duration: 0.3 } },
  },

  // Pulse on state change
  statePulse: {
    animate: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 20px rgba(0, 229, 255, 0.3)",
        "0 0 40px rgba(0, 229, 255, 0.6)",
        "0 0 20px rgba(0, 229, 255, 0.3)",
      ],
    },
    transition: { duration: 0.8, times: [0, 0.5, 1] },
  },
};

/**
 * Hook to get ambient animation variants
 */
export function useAmbientAnimation(animationType: keyof typeof AMBIENT_ANIMATIONS) {
  return AMBIENT_ANIMATIONS[animationType];
}

/**
 * Common animation combinations for typical UI elements
 */
export const AMBIENT_PRESETS = {
  // For holographic panels
  holographicPanel: {
    boxShadow: AMBIENT_ANIMATIONS.breathingGlow.animate.boxShadow,
    transition: AMBIENT_ANIMATIONS.breathingGlow.transition,
  },

  // For AI core
  aiCorePulse: {
    scale: [0.98, 1.02, 0.98],
    boxShadow: [
      "0 0 30px rgba(0, 229, 255, 0.4), inset 0 0 30px rgba(0, 229, 255, 0.2)",
      "0 0 60px rgba(0, 229, 255, 0.7), inset 0 0 40px rgba(0, 229, 255, 0.4)",
      "0 0 30px rgba(0, 229, 255, 0.4), inset 0 0 30px rgba(0, 229, 255, 0.2)",
    ],
    transition: { duration: DURATION.pulse, repeat: Infinity, ease: "easeInOut" },
  },

  // For floating UI elements
  floatingElement: {
    y: [0, -8, 0],
    boxShadow: [
      "0 10px 30px rgba(0, 229, 255, 0.2)",
      "0 20px 50px rgba(0, 229, 255, 0.4)",
      "0 10px 30px rgba(0, 229, 255, 0.2)",
    ],
    transition: { duration: DURATION.breathe, repeat: Infinity, ease: "easeInOut" },
  },

  // For text elements
  glowingText: AMBIENT_ANIMATIONS.textGlowBreathe,

  // For rotating elements
  orbitingRing: AMBIENT_ANIMATIONS.slowRotate,
};
