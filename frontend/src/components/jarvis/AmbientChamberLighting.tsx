"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChamberState } from "./InteractionChamber";

interface AmbientChamberLightingProps {
  chamberState: ChamberState;
}

const STATE_GLOW: Record<
  ChamberState,
  { top: string; bottom: string; center: string; opacity: number }
> = {
  idle: {
    top: "rgba(0, 229, 255, 0.04)",
    bottom: "rgba(0, 178, 255, 0.06)",
    center: "rgba(0, 229, 255, 0.03)",
    opacity: 0.8,
  },
  listening: {
    top: "rgba(182, 247, 255, 0.08)",
    bottom: "rgba(182, 247, 255, 0.12)",
    center: "rgba(182, 247, 255, 0.06)",
    opacity: 1,
  },
  processing: {
    top: "rgba(0, 178, 255, 0.1)",
    bottom: "rgba(0, 178, 255, 0.14)",
    center: "rgba(0, 178, 255, 0.08)",
    opacity: 1,
  },
  speaking: {
    top: "rgba(0, 229, 255, 0.08)",
    bottom: "rgba(0, 229, 255, 0.12)",
    center: "rgba(0, 229, 255, 0.06)",
    opacity: 1,
  },
};

export default function AmbientChamberLighting({
  chamberState,
}: AmbientChamberLightingProps) {
  const glow = STATE_GLOW[chamberState];

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {/* Top ambient glow sphere */}
      <motion.div
        className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[80%] h-[60%] rounded-full"
        style={{
          background: `radial-gradient(ellipse at center, ${glow.top} 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
        animate={{ opacity: [glow.opacity * 0.7, glow.opacity, glow.opacity * 0.7] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bottom ambient glow sphere */}
      <motion.div
        className="absolute -bottom-1/4 left-1/2 -translate-x-1/2 w-[70%] h-[50%] rounded-full"
        style={{
          background: `radial-gradient(ellipse at center, ${glow.bottom} 0%, transparent 70%)`,
          filter: "blur(50px)",
        }}
        animate={{ opacity: [glow.opacity * 0.6, glow.opacity * 0.9, glow.opacity * 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Center core glow (expands with state) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={chamberState}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: `radial-gradient(circle, ${glow.center} 0%, transparent 65%)`,
            filter: "blur(30px)",
          }}
          initial={{ width: "30%", height: "30%", opacity: 0 }}
          animate={{
            width: chamberState === "processing" ? "55%" : chamberState === "idle" ? "35%" : "50%",
            height: chamberState === "processing" ? "55%" : chamberState === "idle" ? "35%" : "50%",
            opacity: [0.6, 1, 0.6],
          }}
          exit={{ opacity: 0 }}
          transition={{
            width: { duration: 1 },
            height: { duration: 1 },
            opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      </AnimatePresence>

      {/* Processing flicker effect */}
      {chamberState === "processing" && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: "rgba(0, 178, 255, 0.025)",
          }}
          animate={{ opacity: [0, 1, 0, 0.5, 0] }}
          transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 1.8 }}
        />
      )}

      {/* Listening pulse rings */}
      {chamberState === "listening" && (
        <div className="absolute inset-0 flex items-center justify-center">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border"
              style={{
                borderColor: "rgba(182, 247, 255, 0.08)",
                width: `${20 + i * 15}%`,
                height: `${20 + i * 15}%`,
              }}
              animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Edge vignette reactive glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 120px ${glow.top}`,
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
