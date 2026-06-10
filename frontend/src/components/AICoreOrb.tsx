"use client";

import { motion, useTransform, useMotionTemplate, MotionValue } from "framer-motion";
import { useJarvisStore } from "@/store/useJarvisStore";
import { getAIStateDefinition } from "@/lib/aiState";

interface AICoreOrbProps {
  scrollYProgress: MotionValue<number>;
}

export default function AICoreOrb({ scrollYProgress }: AICoreOrbProps) {
  // Scene stage map: S1=0-0.2, S2=0.2-0.4, S3=0.4-0.6, S4=0.6-0.8, S5=0.8-1.0
  const currentState = useJarvisStore((s) => s.currentState);
  const stateVisual = getAIStateDefinition(currentState).visual;

  // Map scroll progress to scale of the orb
  // S1: 0.4 (faint/tiny), S2: 0.8 (converging), S3: 1.0 (full), S4: 5.5 (zoom-through spike), S5: 0.9 (settled)
  const scale = useTransform(
    scrollYProgress,
    [0,   0.20, 0.40, 0.60, 0.72, 0.86, 1  ],
    [0.4, 0.8,  1.0,  1.2,  5.5,  0.90, 0.90]
  );

  // Map scroll progress to opacity of the core
  // Fades in through S1, fully visible in S2+S3, vanishes during zoom-through in S4, reactivates in S5
  const opacity = useTransform(
    scrollYProgress,
    [0,    0.15, 0.30, 0.60, 0.72, 0.80, 0.86, 1   ],
    [0.08, 0.2,  0.85, 0.9,  0.0,  0.0,  0.95, 0.95]
  );

  // Inner core glow intensity — brightens as system powers up
  const glowRadius = useTransform(
    scrollYProgress,
    [0,   0.20, 0.40, 0.60, 0.86, 1  ],
    [5,   15,   26,   32,   22,   26]
  );

  // Ring outer expansion — rings grow as HUD expands in S3
  const ringScale1 = useTransform(
    scrollYProgress,
    [0,   0.35, 0.55, 0.86, 1  ],
    [0.6, 0.85, 1.12, 1.0,  1.0]
  );

  const ringScale2 = useTransform(
    scrollYProgress,
    [0,   0.35, 0.55, 0.86, 1  ],
    [0.4, 0.7,  1.28, 1.0,  1.0]
  );

  const shadowFilter = useMotionTemplate`drop-shadow(0 0 ${glowRadius}px ${stateVisual.glow})`;

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
              <stop offset="0%" stopColor={stateVisual.accent} stopOpacity="0.95" />
              <stop offset="35%" stopColor={stateVisual.primary} stopOpacity="0.42" />
              <stop offset="68%" stopColor={stateVisual.secondary} stopOpacity="0.16" />
              <stop offset="100%" stopColor="#050816" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="awakenedGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="20%" stopColor={stateVisual.accent} stopOpacity="0.85" />
              <stop offset="58%" stopColor={stateVisual.secondary} stopOpacity="0.42" />
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
              duration: stateVisual.pulseDuration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* INNER SHIELD RING */}
          <motion.circle
            cx="250"
            cy="250"
            r="125"
            stroke={stateVisual.primary}
            opacity={stateVisual.ringOpacity}
            strokeWidth="1.5"
            fill="transparent"
            strokeDasharray="4 8"
            animate={{ rotate: 360 }}
            transition={{ duration: 18 / stateVisual.rotationMultiplier, repeat: Infinity, ease: "linear" }}
          />

          {/* TACTICAL COMPASS RING (Middle Layer) */}
          <motion.g
            style={{ scale: ringScale1, originX: "250px", originY: "250px" }}
          >
            <motion.circle
              cx="250"
              cy="250"
              r="160"
              stroke={stateVisual.primary}
              opacity={stateVisual.ringOpacity * 0.9}
              strokeWidth="2.5"
              fill="transparent"
              strokeDasharray="20 10 5 10 40 15"
              animate={{ rotate: -360 }}
              transition={{ duration: 25 / stateVisual.rotationMultiplier, repeat: Infinity, ease: "linear" }}
            />
            {/* Degree ticks */}
            <motion.circle
              cx="250"
              cy="250"
              r="170"
              stroke={stateVisual.secondary}
              opacity={stateVisual.ringOpacity * 0.65}
              strokeWidth="4"
              fill="transparent"
              strokeDasharray="1 11"
              animate={{ rotate: 180 }}
              transition={{ duration: 40 / stateVisual.rotationMultiplier, repeat: Infinity, ease: "linear" }}
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
              stroke={stateVisual.primary}
              opacity={stateVisual.ringOpacity}
              strokeWidth="2"
              fill="transparent"
              strokeDasharray="80 170"
              animate={{ rotate: 360 }}
              transition={{ duration: 12 / stateVisual.rotationMultiplier, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
              cx="250"
              cy="250"
              r="215"
              stroke={stateVisual.accent}
              opacity={stateVisual.ringOpacity * 0.45}
              strokeWidth="1"
              fill="transparent"
              strokeDasharray="10 30 50 10"
              animate={{ rotate: -180 }}
              transition={{ duration: 15 / stateVisual.rotationMultiplier, repeat: Infinity, ease: "linear" }}
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
                  stroke={stateVisual.primary}
                  opacity="0.18"
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
                  fill={stateVisual.primary}
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
