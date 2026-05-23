"use client";

import React, { useEffect, useRef } from "react";
import { ChamberState } from "./InteractionChamber";

interface NeuralStreamProps {
  chamberState: ChamberState;
}

const STATE_COLORS: Record<ChamberState, string> = {
  idle: "0, 229, 255",
  listening: "182, 247, 255",
  processing: "0, 178, 255",
  speaking: "0, 229, 255",
};

const STATE_INTENSITY: Record<ChamberState, number> = {
  idle: 0.06,
  listening: 0.15,
  processing: 0.28,
  speaking: 0.2,
};

interface StreamParticle {
  t: number;      // progress along path (0–1)
  speed: number;
  alpha: number;
  pathIdx: number;
}

export default function NeuralStream({ chamberState }: NeuralStreamProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<StreamParticle[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);

    const getCenter = () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
    });

    const getInputPos = () => ({
      x: canvas.width / 2,
      y: canvas.height - 80,
    });

    const getResponsePos = () => ({
      x: canvas.width / 2,
      y: 180,
    });

    // Initialize particles
    particlesRef.current = Array.from({ length: 40 }, (_, i) => ({
      t: Math.random(),
      speed: 0.003 + Math.random() * 0.003,
      alpha: Math.random() * 0.5 + 0.2,
      pathIdx: i % 4,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const center = getCenter();
      const inputPos = getInputPos();
      const responsePos = getResponsePos();
      const color = STATE_COLORS[chamberState];
      const intensity = STATE_INTENSITY[chamberState];
      const t = timeRef.current;

      // ---- Define bezier path segments ----
      const paths = [
        // Center → Input (left arc)
        {
          p0: { x: center.x - 20, y: center.y + 250 },
          cp1: { x: center.x - 120, y: center.y + 340 },
          cp2: { x: inputPos.x - 160, y: inputPos.y - 40 },
          p3: { x: inputPos.x - 200, y: inputPos.y },
        },
        // Center → Input (right arc)
        {
          p0: { x: center.x + 20, y: center.y + 250 },
          cp1: { x: center.x + 120, y: center.y + 340 },
          cp2: { x: inputPos.x + 160, y: inputPos.y - 40 },
          p3: { x: inputPos.x + 200, y: inputPos.y },
        },
        // Center → Response (left arc)
        {
          p0: { x: center.x - 20, y: center.y - 250 },
          cp1: { x: center.x - 160, y: center.y - 340 },
          cp2: { x: responsePos.x - 200, y: responsePos.y + 60 },
          p3: { x: responsePos.x - 100, y: responsePos.y + 20 },
        },
        // Center → Response (right arc)
        {
          p0: { x: center.x + 20, y: center.y - 250 },
          cp1: { x: center.x + 160, y: center.y - 340 },
          cp2: { x: responsePos.x + 200, y: responsePos.y + 60 },
          p3: { x: responsePos.x + 100, y: responsePos.y + 20 },
        },
      ];

      // Filter active paths by state
      const activePaths =
        chamberState === "idle"
          ? [0, 1]
          : chamberState === "listening"
          ? [0, 1]
          : chamberState === "processing"
          ? [0, 1, 2, 3]
          : [2, 3];

      // Draw path lines
      activePaths.forEach((pi) => {
        const p = paths[pi];
        ctx.beginPath();
        ctx.moveTo(p.p0.x, p.p0.y);
        ctx.bezierCurveTo(p.cp1.x, p.cp1.y, p.cp2.x, p.cp2.y, p.p3.x, p.p3.y);
        const pathAlpha = intensity * (0.5 + Math.sin(t * 1.5 + pi) * 0.3);
        ctx.strokeStyle = `rgba(${color}, ${pathAlpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // ---- Bezier interpolation helper ----
      const bezierPoint = (
        p: { p0: { x: number; y: number }; cp1: { x: number; y: number }; cp2: { x: number; y: number }; p3: { x: number; y: number } },
        t: number
      ) => {
        const mt = 1 - t;
        return {
          x: mt * mt * mt * p.p0.x + 3 * mt * mt * t * p.cp1.x + 3 * mt * t * t * p.cp2.x + t * t * t * p.p3.x,
          y: mt * mt * mt * p.p0.y + 3 * mt * mt * t * p.cp1.y + 3 * mt * t * t * p.cp2.y + t * t * t * p.p3.y,
        };
      };

      // Draw particles along paths
      particlesRef.current.forEach((particle) => {
        if (!activePaths.includes(particle.pathIdx)) return;

        const path = paths[particle.pathIdx];
        const pos = bezierPoint(path, particle.t);

        // Particle glow
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 3);
        gradient.addColorStop(0, `rgba(${color}, ${particle.alpha * intensity * 6})`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Advance particle
        particle.t += particle.speed;
        if (particle.t > 1) {
          particle.t = 0;
          particle.alpha = Math.random() * 0.5 + 0.2;
        }
      });

      // Subtle radial arcs at center connection point
      if (chamberState === "processing" || chamberState === "speaking") {
        const arcR = 255 + Math.sin(t * 2) * 8;
        ctx.beginPath();
        ctx.arc(center.x, center.y, arcR, Math.PI * 0.3, Math.PI * 0.7);
        ctx.strokeStyle = `rgba(${color}, ${intensity * 0.6})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      timeRef.current += 0.016;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", setSize);
    };
  }, [chamberState]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-30"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
