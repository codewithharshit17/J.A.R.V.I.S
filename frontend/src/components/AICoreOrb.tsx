"use client";

import { motion, useTransform, useMotionTemplate, MotionValue } from "framer-motion";

interface AICoreOrbProps {
  scrollYProgress: MotionValue<number>;
}

export default function AICoreOrb({ scrollYProgress }: AICoreOrbProps) {
  // Scene 1: 0.0 -> 0.2 (faint, booting)
  // Scene 2: 0.2 -> 0.4 (converging, forming)
  // Scene 3: 0.4 -> 0.6 (fully active, expanding HUD)
  // Scene 4: 0.6 -> 0.8 (zooming through the core)
  // Scene 5: 0.8 -> 1.0 (stabilized and awakened)

  // Map scroll progress to scale of the orb
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.58, 0.72, 0.85, 1],
    [0.4, 0.8, 1, 1.2, 5.5, 0.9, 0.9] // Scale spikes to 5.5 in Scene 4 zoom-through, then returns to 0.9
  );

  // Map scroll progress to opacity of the core
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.3, 0.58, 0.72, 0.8, 0.85, 1],
    [0.08, 0.2, 0.85, 0.9, 0.0, 0.0, 0.95, 0.95] // Fades out during zoom-through, then reactivates in Scene 5
  );

  // Inner core glow intensity
  const glowRadius = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.85, 1],
    [5, 15, 25, 30, 20, 25]
  );

  // Ring outer expansion
  const ringScale1 = useTransform(
    scrollYProgress,
    [0, 0.35, 0.55, 0.85, 1],
    [0.6, 0.85, 1.1, 1.0, 1.0]
  );

  const ringScale2 = useTransform(
    scrollYProgress,
    [0, 0.35, 0.55, 0.85, 1],
    [0.4, 0.7, 1.25, 1.0, 1.0]
  );

  const shadowFilter = useMotionTemplate`drop-shadow(0 0 ${glowRadius}px rgba(0, 229, 255, 0.85))`;

  return (
    <motion.div
      className="absolute flex items-center justify-center z-20 pointer-events-none"
      style={{
        scale,
        opacity,
        filter: shadowFilter,
      }}
    >
      <div className="relative w-[320px] h-[320px] md:w-[450px] md:h-[450px] flex items-center justify-center">
        {/* SVG Core Visualizer */}
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          <defs>
            {/* Holographic Gradients */}
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#B6F7FF" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#00E5FF" stopOpacity="0.42" />
              <stop offset="68%" stopColor="#00B2FF" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#050816" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="awakenedGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="20%" stopColor="#B6F7FF" stopOpacity="0.85" />
              <stop offset="58%" stopColor="#00B2FF" stopOpacity="0.42" />
              <stop offset="100%" stopColor="#07111F" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* BACKGROUND ENERGY FIELD (Scene 2+) */}
          <motion.circle
            cx="250"
            cy="250"
            r="110"
            fill={scrollYProgress.get() > 0.8 ? "url(#awakenedGlow)" : "url(#coreGlow)"}
            animate={{
              r: [105, 118, 105],
              opacity: [0.7, 0.9, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* INNER SHIELD RING */}
          <motion.circle
            cx="250"
            cy="250"
            r="125"
            stroke="rgba(0, 229, 255, 0.4)"
            strokeWidth="1.5"
            fill="transparent"
            strokeDasharray="4 8"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          />

          {/* TACTICAL COMPASS RING (Middle Layer) */}
          <motion.g
            style={{ scale: ringScale1, originX: "250px", originY: "250px" }}
          >
            <motion.circle
              cx="250"
              cy="250"
              r="160"
              stroke="rgba(0, 229, 255, 0.35)"
              strokeWidth="2.5"
              fill="transparent"
              strokeDasharray="20 10 5 10 40 15"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
            {/* Degree ticks */}
            <motion.circle
              cx="250"
              cy="250"
              r="170"
              stroke="rgba(0, 178, 255, 0.24)"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray="1 11"
              animate={{ rotate: 180 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />
          </motion.g>

          {/* OUTER TELEMETRY RINGS (Scene 3+) */}
          <motion.g
            style={{ scale: ringScale2, originX: "250px", originY: "250px" }}
          >
            {/* Bracket style outer bounds */}
            <motion.circle
              cx="250"
              cy="250"
              r="200"
              stroke="rgba(0, 229, 255, 0.5)"
              strokeWidth="2"
              fill="transparent"
              strokeDasharray="80 170"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
              cx="250"
              cy="250"
              r="215"
              stroke="rgba(182, 247, 255, 0.22)"
              strokeWidth="1"
              fill="transparent"
              strokeDasharray="10 30 50 10"
              animate={{ rotate: -180 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          </motion.g>

          {/* CENTRAL CORE GEOMETRY / DOT ARRAY */}
          <g transform="translate(250, 250)">
            {[...Array(6)].map((_, i) => {
              const x2 = Math.cos((i * Math.PI) / 3) * 90;
              const y2 = Math.sin((i * Math.PI) / 3) * 90;
              return (
                <line
                  key={i}
                  x1="0"
                  y1="0"
                  x2={x2}
                  y2={y2}
                  stroke="rgba(0, 229, 255, 0.12)"
                  strokeWidth="1"
                />
              );
            })}
            {/* Floating orbital node dots */}
            {[...Array(3)].map((_, i) => {
              const cx = Math.cos((i * Math.PI * 2) / 3) * 80;
              const cy = Math.sin((i * Math.PI * 2) / 3) * 80;
              return (
                <motion.circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r="3.5"
                  fill="#00e5ff"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.6,
                    repeat: Infinity,
                  }}
                />
              );
            })}
          </g>
        </svg>

        {/* Small floating HUD values attached to the Core */}
        <div className="absolute top-4 left-4 text-[9px] font-mono tracking-widest text-cyan-400/60 bg-black/40 backdrop-blur-sm border border-cyan-400/20 px-2 py-0.5 rounded">
          CORE ID // J5-881
        </div>
        <div className="absolute bottom-4 right-4 text-[9px] font-mono tracking-widest text-[#b6f7ff]/60 bg-black/40 backdrop-blur-sm border border-[#00b2ff]/20 px-2 py-0.5 rounded-sm">
          FREQ // 43.82 MHz
        </div>
      </div>
    </motion.div>
  );
}
