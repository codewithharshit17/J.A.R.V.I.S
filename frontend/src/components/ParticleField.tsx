"use client";

import { useEffect, useRef } from "react";
import { useScroll, useVelocity } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  z: number;
  ox: number; // original coordinates
  oy: number;
  oz: number;
  theta: number; // spherical angles
  phi: number;
  radius: number;
  size: number;
  color: string;
  speedZ: number;
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { scrollYProgress } = useScroll();
  const scrollVelocity = useVelocity(scrollYProgress);

  // We keep a reference to current scroll and velocity values to read in the loop without re-rendering
  const scrollInfoRef = useRef({ progress: 0, velocity: 0 });

  useEffect(() => {
    const unsubscribeProgress = scrollYProgress.on("change", (latest) => {
      scrollInfoRef.current.progress = latest;
    });
    const unsubscribeVelocity = scrollVelocity.on("change", (latest) => {
      scrollInfoRef.current.velocity = latest;
    });

    return () => {
      unsubscribeProgress();
      unsubscribeVelocity();
    };
  }, [scrollYProgress, scrollVelocity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Initialize particles
    const particleCount = window.innerWidth < 768 ? 95 : 180;
    const particles: Particle[] = [];
    const colors = [
      "rgba(0, 229, 255, 0.72)",
      "rgba(0, 178, 255, 0.58)",
      "rgba(182, 247, 255, 0.78)",
      "rgba(255, 255, 255, 0.62)",
    ];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 1200;
      const y = (Math.random() - 0.5) * 1200;
      const z = Math.random() * 1000;

      // Spherical coordinates mapping (used for core convergence in Scene 2)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 100 + Math.random() * 40; // orb radius

      particles.push({
        x,
        y,
        z,
        ox: x,
        oy: y,
        oz: z,
        theta,
        phi,
        radius,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedZ: Math.random() * 0.5 + 0.2,
      });
    }

    const perspective = 400;
    const centerX = width / 2;
    const centerY = height / 2;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const progress = scrollInfoRef.current.progress;
      const velocity = Math.abs(scrollInfoRef.current.velocity);

      // Determine scene status to interpolate particle states
      // Scene 2 convergence (between scrollProgress 0.18 and 0.42)
      let convergenceFactor = 0;
      if (progress >= 0.18 && progress <= 0.42) {
        // T-factor rises from 0 to 1 and back to 0 (or stays high until deep zoom)
        convergenceFactor = Math.sin(((progress - 0.18) / 0.24) * Math.PI);
      } else if (progress > 0.42 && progress <= 0.65) {
        // Hold some convergence but let it expand slightly
        convergenceFactor = Math.max(0, 1 - (progress - 0.42) * 4);
      }

      // Scene 4 Warp speed zoom (between scrollProgress 0.60 and 0.82)
      let warpFactor = 0;
      if (progress >= 0.58 && progress <= 0.82) {
        warpFactor = Math.sin(((progress - 0.58) / 0.24) * Math.PI) * 4;
      }

      // Add scroll velocity to warp speed effect
      const currentSpeedMultiplier = 1 + velocity * 15 + warpFactor * 8;

      // Ambient rotation angle (slowly rotates all particles for alive feeling)
      const time = Date.now() * 0.0003;
      const cosAngle = Math.cos(0.003);
      const sinAngle = Math.sin(0.003);

      particles.forEach((p) => {
        // 1. Ambient rotation around Y axis
        const rx = p.x * cosAngle - p.z * sinAngle;
        const rz = p.x * sinAngle + p.z * cosAngle;
        p.x = rx;
        p.z = rz;

        // 2. Depth motion
        // Scroll speed moves particles closer (decrement z)
        p.z -= p.speedZ * currentSpeedMultiplier;

        // Reset particle if it flies past the camera (z < 0) or goes too far
        if (p.z <= 0) {
          p.z = 1000;
          p.x = (Math.random() - 0.5) * 1200;
          p.y = (Math.random() - 0.5) * 1200;
        }

        // 3. Spherical convergence logic (Scene 2)
        // Target spherical coords in world coordinates
        const targetX = p.radius * Math.sin(p.phi) * Math.cos(p.theta + time * 3);
        const targetY = p.radius * Math.cos(p.phi);
        const targetZ = 300 + p.radius * Math.sin(p.phi) * Math.sin(p.theta + time * 3);

        // Interpolate current position with target sphere position
        const currentX = p.x * (1 - convergenceFactor) + targetX * convergenceFactor;
        const currentY = p.y * (1 - convergenceFactor) + targetY * convergenceFactor;
        const currentZ = p.z * (1 - convergenceFactor) + targetZ * convergenceFactor;

        // 4. Perspective projection
        if (currentZ + perspective > 0) {
          const scale = perspective / (perspective + currentZ);
          const screenX = centerX + currentX * scale;
          const screenY = centerY + currentY * scale;
          const rSize = p.size * scale * (1 + velocity * 2);

          // Draw particle
          ctx.beginPath();
          ctx.fillStyle = p.color;

          // If moving fast, draw tail (motion blur)
          if (currentSpeedMultiplier > 2) {
            const prevScale = perspective / (perspective + currentZ + p.speedZ * currentSpeedMultiplier * 1.5);
            const prevScreenX = centerX + currentX * prevScale;
            const prevScreenY = centerY + currentY * prevScale;

            ctx.moveTo(screenX, screenY);
            ctx.lineTo(prevScreenX, prevScreenY);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = rSize;
            ctx.stroke();
          } else {
            ctx.arc(screenX, screenY, rSize, 0, Math.PI * 2);
            ctx.fill();

            // Add faint glow to white highlight particles
            if (p.color.includes("255, 255, 255") && scale > 0.8) {
              ctx.shadowColor = "rgba(0, 229, 255, 0.8)";
              ctx.shadowBlur = 8;
              ctx.arc(screenX, screenY, rSize * 1.2, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(0, 178, 255, 0.4)";
              ctx.fill();
              ctx.shadowBlur = 0; // reset
            }
          }
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
