"use client";

import { motion, useTransform, MotionValue } from "framer-motion";

interface TacticalGrid3DProps {
  scrollYProgress: MotionValue<number>;
  mouseX: MotionValue<number>;
}

export default function TacticalGrid3D({ scrollYProgress, mouseX }: TacticalGrid3DProps) {

  // Scene stage map: S1=0-0.2, S2=0.2-0.4, S3=0.4-0.6, S4=0.6-0.8, S5=0.8-1.0
  // Grid starts far and steeply angled, approaches as scenes progress, warps in S4, settles in S5.

  // Grid pitch (X-axis tilt): starts very steep, levels slightly as the 3D floor becomes apparent
  const rotateX = useTransform(
    scrollYProgress,
    [0,   0.20, 0.40, 0.60, 0.76, 0.86, 1  ],
    [76,  70,   64,   80,   88,   60,   60]
  );

  // Grid depth on Z-axis: pulls toward viewer then slams forward in S4
  const translateZ = useTransform(
    scrollYProgress,
    [0,   0.20, 0.40, 0.60, 0.76, 0.86, 1  ],
    [-200,-100,  0,   160,  420, -50,  -50]
  );

  // Overall grid opacity: faint at start, fades out during zoom-through
  const opacity = useTransform(
    scrollYProgress,
    [0,   0.15, 0.40, 0.60, 0.76, 0.86, 1  ],
    [0.15, 0.35, 0.42, 0.18, 0.04, 0.32, 0.32]
  );

  // Scale expansion: grows as camera approaches in S3
  const scale = useTransform(
    scrollYProgress,
    [0,   0.40, 0.60, 0.76, 0.86, 1  ],
    [0.85, 1.0,  1.22, 1.85, 1.0,  1.0]
  );

  // Interactive mouse tilt (subtle parallax)
  const mouseRotateY = useTransform(mouseX, [-0.5, 0.5], [-4, 4]);  // Yaw adjustment

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-5"
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      {/* 3D Grid Wrapper */}
      <motion.div
        className="absolute inset-0 w-full h-full flex items-center justify-center"
        style={{
          rotateX,
          translateZ,
          scale,
          opacity,
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateY: mouseRotateY,
          // We combine scroll rotateX and mouse rotateX in styles or let framer motion handle it
        }}
        transition={{ type: "spring", stiffness: 60, damping: 15, mass: 0.5 }}
      >
        {/* Double layered grids for deep parallax */}
        {/* Bottom grid (coarser) */}
        <div
          className="absolute w-[300%] h-[300%] -top-[100%] -left-[100%] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 229, 255, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 229, 255, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            backgroundPosition: "center",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          }}
        />

        {/* Top grid (finer, with neon glow) */}
        <div
          className="absolute w-[300%] h-[300%] -top-[100%] -left-[100%] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 229, 255, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 178, 255, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            backgroundPosition: "center",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
          }}
        />

        {/* Moving scanning lines on the grid */}
        <motion.div
          className="absolute w-full h-[5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40 blur-[2px]"
          animate={{
            y: ["-150%", "150%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Ambient coordinate indicators */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-[800px] border border-cyan-500/10 rounded-full flex items-center justify-center">
            <div className="w-[600px] h-[600px] border border-[#00b2ff]/10 rounded-full border-dashed" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
