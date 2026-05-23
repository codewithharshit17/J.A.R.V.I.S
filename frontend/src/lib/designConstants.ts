/**
 * JARVIS Design System Constants
 * Unified color palette, spacing, typography, and visual properties
 */

// ============================================================
// COLOR PALETTE
// ============================================================

export const COLORS = {
  // Primary backgrounds
  background: {
    primary: "#050816",      // Deep black void
    secondary: "#07111F",    // Dark navy
    tertiary: "#0a1420",     // Slightly lighter navy
  },

  // Primary glow colors
  glow: {
    cyan: "#00E5FF",         // Electric cyan (primary)
    blue: "#00B2FF",         // Holographic blue
    light: "#B6F7FF",        // Soft holographic white
    white: "#FFFFFF",        // Pure white
  },

  // Secondary colors
  accent: {
    cyan: "rgba(0, 229, 255, 1)",
    blue: "rgba(0, 178, 255, 1)",
    light: "rgba(182, 247, 255, 1)",
  },

  // Transparency variants (cyan based)
  transparency: {
    glow_10: "rgba(0, 229, 255, 0.1)",
    glow_15: "rgba(0, 229, 255, 0.15)",
    glow_20: "rgba(0, 229, 255, 0.2)",
    glow_30: "rgba(0, 229, 255, 0.3)",
    glow_40: "rgba(0, 229, 255, 0.4)",
    glow_50: "rgba(0, 229, 255, 0.5)",
    glow_60: "rgba(0, 229, 255, 0.6)",
    glow_70: "rgba(0, 229, 255, 0.7)",
  },

  // State colors
  state: {
    success: "#00E5FF",
    warning: "#B6F7FF",
    error: "#FF6B9D",
    info: "#00B2FF",
    neutral: "#666666",
  },
};

// ============================================================
// SPACING SYSTEM
// ============================================================

export const SPACING = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  xxl: "32px",
  xxxl: "48px",
};

// ============================================================
// TYPOGRAPHY
// ============================================================

export const TYPOGRAPHY = {
  fontFamily: {
    orbitron: "'Orbitron', sans-serif",
    mono: "'Share Tech Mono', monospace",
    rajdhani: "'Rajdhani', sans-serif",
  },

  fontSize: {
    xs: "10px",
    sm: "12px",
    md: "14px",
    lg: "16px",
    xl: "18px",
    xxl: "24px",
    xxxl: "32px",
    massive: "48px",
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    bold: 700,
    heavy: 900,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },

  letterSpacing: {
    tight: "-0.05em",
    normal: "0em",
    wide: "0.05em",
    veryWide: "0.1em",
    widest: "0.2em",
  },
};

// ============================================================
// BLUR & GLASS VALUES
// ============================================================

export const GLASS = {
  blur: {
    light: "8px",
    medium: "12px",
    heavy: "20px",
    ultra: "30px",
  },

  backdrop: {
    light: "blur(8px)",
    medium: "blur(12px)",
    heavy: "blur(20px)",
    ultra: "blur(30px)",
  },

  opacity: {
    light: 0.5,
    medium: 0.6,
    heavy: 0.8,
  },
};

// ============================================================
// GLOW & SHADOW EFFECTS
// ============================================================

export const GLOW = {
  cyan: {
    sm: "0 0 12px rgba(0, 229, 255, 0.4)",
    md: "0 0 24px rgba(0, 229, 255, 0.5)",
    lg: "0 0 40px rgba(0, 229, 255, 0.6)",
    xl: "0 0 60px rgba(0, 229, 255, 0.7)",
  },

  blue: {
    sm: "0 0 12px rgba(0, 178, 255, 0.4)",
    md: "0 0 24px rgba(0, 178, 255, 0.5)",
    lg: "0 0 40px rgba(0, 178, 255, 0.6)",
    xl: "0 0 60px rgba(0, 178, 255, 0.7)",
  },

  light: {
    sm: "0 0 12px rgba(182, 247, 255, 0.4)",
    md: "0 0 24px rgba(182, 247, 255, 0.5)",
    lg: "0 0 40px rgba(182, 247, 255, 0.6)",
    xl: "0 0 60px rgba(182, 247, 255, 0.7)",
  },

  inset: {
    sm: "inset 0 0 12px rgba(0, 229, 255, 0.2)",
    md: "inset 0 0 24px rgba(0, 229, 255, 0.3)",
    lg: "inset 0 0 40px rgba(0, 229, 255, 0.4)",
  },
};

// ============================================================
// BORDER EFFECTS
// ============================================================

export const BORDER = {
  glow: {
    sm: "1px solid rgba(0, 229, 255, 0.2)",
    md: "2px solid rgba(0, 229, 255, 0.3)",
    lg: "3px solid rgba(0, 229, 255, 0.4)",
  },

  neon: {
    sm: "1px solid rgba(0, 229, 255, 0.5), inset 0 0 8px rgba(0, 229, 255, 0.2)",
    md: "2px solid rgba(0, 229, 255, 0.6), inset 0 0 12px rgba(0, 229, 255, 0.3)",
  },
};

// ============================================================
// DEPTH & PERSPECTIVE
// ============================================================

export const DEPTH = {
  perspective: {
    near: "800px",
    medium: "1200px",
    far: "1600px",
  },

  blur: {
    near: "2px",
    medium: "4px",
    far: "8px",
  },

  scale: {
    foreground: 1.05,
    midground: 1.0,
    background: 0.95,
  },
};

// ============================================================
// BREAKPOINTS
// ============================================================

export const BREAKPOINT = {
  mobile: "480px",
  tablet: "768px",
  desktop: "1024px",
  ultrawide: "1440px",
};

// ============================================================
// Z-INDEX HIERARCHY
// ============================================================

export const ZINDEX = {
  background: 1,
  grid: 5,
  particles: 10,
  orb: 20,
  hud: 30,
  panels: 35,
  overlay: 40,
  modal: 50,
  debug: 99,
  scanlines: 100,
};

// ============================================================
// ANIMATION TIMINGS
// ============================================================

export const TIMING = {
  boot: 4200,        // Startup sequence
  enter: 1000,       // Enter system
  transition: 600,   // Standard transition
  hover: 300,        // Hover response
  stagger: 100,      // Stagger delay
};
