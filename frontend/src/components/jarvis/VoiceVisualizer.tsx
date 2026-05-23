"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChamberState } from "./InteractionChamber";

interface VoiceVisualizerProps {
  chamberState: ChamberState;
}

const STATE_CONFIGS = {
  idle: {
    color: "0, 229, 255",
    ringCount: 3,
    baseRadius: 270,
    amplitude: 6,
    speed: 0.4,
    opacity: 0.08,
    barCount: 48,
    barHeight: 8,
  },
  listening: {
    color: "182, 247, 255",
    ringCount: 5,
    baseRadius: 280,
    amplitude: 22,
    speed: 1.4,
    opacity: 0.22,
    barCount: 64,
    barHeight: 28,
  },
  processing: {
    color: "0, 178, 255",
    ringCount: 6,
    baseRadius: 275,
    amplitude: 18,
    speed: 2.2,
    opacity: 0.18,
    barCount: 64,
    barHeight: 22,
  },
  speaking: {
    color: "0, 229, 255",
    ringCount: 5,
    baseRadius: 285,
    amplitude: 26,
    speed: 1.8,
    opacity: 0.2,
    barCount: 56,
    barHeight: 32,
  },
};

export default function VoiceVisualizer({ chamberState }: VoiceVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animIdRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 700;
    const H = 700;
    canvas.width = W;
    canvas.height = H;
    const cx = W / 2;
    const cy = H / 2;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const cfg = STATE_CONFIGS[chamberState];
      const t = timeRef.current;

      // --- Radial frequency bars ---
      const barCount = cfg.barCount;
      for (let i = 0; i < barCount; i++) {
        const angle = (i / barCount) * Math.PI * 2;
        const noise =
          Math.sin(t * cfg.speed + i * 0.4) * 0.5 +
          Math.sin(t * cfg.speed * 1.7 + i * 0.9) * 0.3 +
          Math.sin(t * cfg.speed * 0.5 + i * 1.4) * 0.2;
        const barLen = cfg.barHeight * (0.3 + Math.abs(noise)) + 4;

        const innerR = cfg.baseRadius - 12;
        const outerR = innerR + barLen;

        const x1 = cx + Math.cos(angle) * innerR;
        const y1 = cy + Math.sin(angle) * innerR;
        const x2 = cx + Math.cos(angle) * outerR;
        const y2 = cy + Math.sin(angle) * outerR;

        const alpha = cfg.opacity * (0.5 + Math.abs(noise) * 1.5);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${cfg.color}, ${Math.min(alpha, 0.6)})`;
        ctx.lineWidth = 1.5;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // --- Concentric breathing rings ---
      for (let r = 0; r < cfg.ringCount; r++) {
        const ringRadius =
          cfg.baseRadius - r * 28 + Math.sin(t * cfg.speed * 0.6 + r * 1.1) * cfg.amplitude;
        const ringAlpha = cfg.opacity * (1 - r * 0.18);

        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${cfg.color}, ${Math.max(0, ringAlpha)})`;
        ctx.lineWidth = r === 0 ? 1.5 : 0.8;
        ctx.stroke();
      }

      // --- Outer radial pulse waves ---
      if (chamberState === "listening" || chamberState === "speaking") {
        for (let p = 0; p < 3; p++) {
          const phase = ((t * 0.6 + p * 0.33) % 1);
          const pulseR = cfg.baseRadius + phase * 80;
          const pulseAlpha = (1 - phase) * 0.12;
          ctx.beginPath();
          ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${cfg.color}, ${pulseAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // --- Processing rotation arcs ---
      if (chamberState === "processing") {
        const arcAngle = t * 3;
        ctx.beginPath();
        ctx.arc(cx, cy, cfg.baseRadius + 20, arcAngle, arcAngle + Math.PI * 0.8);
        ctx.strokeStyle = `rgba(${cfg.color}, 0.25)`;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, cfg.baseRadius + 35, -arcAngle * 1.3, -arcAngle * 1.3 + Math.PI * 0.6);
        ctx.strokeStyle = `rgba(${cfg.color}, 0.15)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      timeRef.current += 0.016;
      animIdRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animIdRef.current);
  }, [chamberState]);

  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ width: 700, height: 700, marginLeft: -350, marginTop: -350 }}
      animate={{
        opacity: chamberState === "idle" ? 0.5 : 1,
        scale: chamberState === "processing" ? [1, 1.02, 1] : 1,
      }}
      transition={{
        opacity: { duration: 0.8 },
        scale: { duration: 0.8, repeat: chamberState === "processing" ? Infinity : 0 },
      }}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </motion.div>
  );
}
