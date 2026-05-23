/**
 * JARVIS Unified Motion Constants
 * Ensures all animations follow the same cinematic spring configs
 * and easing patterns for premium, cohesive movement
 */

// ============================================================
// SPRING CONFIGURATIONS
// ============================================================

export const SPRING_CONFIG = {
  // Luxury cinematic springs
  cinematic: { stiffness: 45, damping: 15, mass: 0.8 },      // Smooth, flowing
  interactive: { stiffness: 80, damping: 28, mass: 0.6 },    // Responsive, smooth
  snappy: { stiffness: 150, damping: 30, mass: 0.5 },        // Quick feedback
  elastic: { stiffness: 200, damping: 20, mass: 0.4 },       // Bouncy, energetic
  
  // UI interactions
  hover: { stiffness: 100, damping: 25, mass: 0.5 },         // Subtle responsiveness
  focus: { stiffness: 120, damping: 28, mass: 0.4 },         // Medium response
  drag: { stiffness: 80, damping: 20, mass: 0.6 },           // Smooth dragging
  
  // Holographic effects
  hologram: { stiffness: 60, damping: 20, mass: 0.7 },       // Floaty hologram feel
  neural: { stiffness: 55, damping: 18, mass: 0.75 },        // Neural flow
  
  // Transitions
  appearance: { stiffness: 70, damping: 22, mass: 0.6 },     // Smooth entrance
  exit: { stiffness: 65, damping: 20, mass: 0.65 },          // Smooth exit
};

// ============================================================
// EASING FUNCTIONS
// ============================================================

export const EASING = {
  // Standard easing
  easeInOut: [0.42, 0, 0.58, 1],
  easeOut: [0, 0, 0.58, 1],
  easeIn: [0.42, 0, 1, 1],
  linear: [0, 0, 1, 1],
  
  // Cinematic easing
  cinematic: [0.25, 0.46, 0.45, 0.94],       // Smooth cinematic movement
  dramatic: [0.34, 1.56, 0.64, 1],           // Dramatic entrance
  holographic: [0.43, 0.13, 0.23, 0.96],     // Hologram floating feel
};

// ============================================================
// ANIMATION DURATIONS (milliseconds)
// ============================================================

export const DURATION = {
  // Quick interactions
  quick: 200,
  snap: 300,
  
  // Standard transitions
  normal: 500,
  smooth: 600,
  
  // Cinematic transitions
  cinematic: 1000,
  dramatic: 1200,
  epic: 1500,
  
  // Ambient/breathing
  breathe: 4000,
  pulse: 2000,
  glow: 3000,
  
  // Looping animations
  rotate: 20000,
  drift: 30000,
  sweep: 8000,
};

// ============================================================
// ANIMATION VARIANTS
// ============================================================

export const VARIANTS = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: DURATION.normal },
  },
  
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: DURATION.normal, ...SPRING_CONFIG.appearance },
  },
  
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: DURATION.normal, ...SPRING_CONFIG.appearance },
  },
  
  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.92 },
    transition: { duration: DURATION.smooth, ...SPRING_CONFIG.appearance },
  },
  
  // Holographic animations
  holographicAppear: {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 10 },
    transition: { duration: DURATION.cinematic, ...SPRING_CONFIG.hologram },
  },
  
  // Glow breathing
  breathingGlow: {
    animate: {
      boxShadow: [
        "0 0 20px rgba(0, 229, 255, 0.4)",
        "0 0 50px rgba(0, 229, 255, 0.7)",
        "0 0 20px rgba(0, 229, 255, 0.4)",
      ],
    },
    transition: { duration: DURATION.breathe, repeat: Infinity, ease: "easeInOut" },
  },
};

// ============================================================
// STAGGER ANIMATIONS
// ============================================================

export const STAGGER = {
  container: (staggerChildren: number = 0.1) => ({
    animate: { transition: { staggerChildren } },
  }),
  item: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  },
};

// ============================================================
// PARALLAX MULTIPLIERS
// ============================================================

export const PARALLAX = {
  slow: 0.3,
  medium: 0.5,
  fast: 0.8,
  veryFast: 1.2,
};

// ============================================================
// TRANSFORM RANGES
// ============================================================

export const TRANSFORM_RANGE = {
  tilt: { x: [-10, 10], y: [-10, 10] },
  rotation: [-360, 360],
  depth: [-100, 100],
  glow: [20, 80],
};
