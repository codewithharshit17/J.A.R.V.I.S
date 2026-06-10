"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export type JarvisState =
  | "booting" | "idle" | "listening" | "processing"
  | "speaking" | "analyzing" | "warning" | "executing"
  | "disconnected" | "error";

export interface StateConfig {
  color: string;
  rgb: string;
  pulseDuration: number;
  ringSpeedClockwise: number;
  ringSpeedCounter: number;
  particleCount: number;
  particleSpeed: number;
  particleStyle: "drift" | "orbit" | "converge" | "pulse" | "chaotic" | "glitch" | "booting";
  scale: number;
  glowIntensity: string;
}

export const STATE_CONFIGS: Record<JarvisState, StateConfig> = {
  booting: {
    color: "#00b2ff", rgb: "0, 178, 255", pulseDuration: 2.0,
    ringSpeedClockwise: 20, ringSpeedCounter: -25, particleCount: 100,
    particleSpeed: 2.2, particleStyle: "booting", scale: 0.85,
    glowIntensity: "0 0 40px rgba(0,178,255,0.4), inset 0 0 30px rgba(0,178,255,0.3)"
  },
  idle: {
    color: "#00e5ff", rgb: "0, 229, 255", pulseDuration: 4.0,
    ringSpeedClockwise: 35, ringSpeedCounter: -45, particleCount: 70,
    particleSpeed: 0.8, particleStyle: "orbit", scale: 1.0,
    glowIntensity: "0 0 50px rgba(0,229,255,0.5), inset 0 0 40px rgba(0,229,255,0.4)"
  },
  listening: {
    color: "#22d3ee", rgb: "34, 211, 238", pulseDuration: 1.2,
    ringSpeedClockwise: 25, ringSpeedCounter: -30, particleCount: 90,
    particleSpeed: 1.6, particleStyle: "pulse", scale: 1.08,
    glowIntensity: "0 0 60px rgba(34,211,238,0.6), inset 0 0 45px rgba(34,211,238,0.5)"
  },
  processing: {
    color: "#3b82f6", rgb: "59, 130, 246", pulseDuration: 0.7,
    ringSpeedClockwise: 10, ringSpeedCounter: -12, particleCount: 140,
    particleSpeed: 3.8, particleStyle: "converge", scale: 1.02,
    glowIntensity: "0 0 70px rgba(59,130,246,0.7), inset 0 0 50px rgba(59,130,246,0.6)"
  },
  speaking: {
    color: "#22c55e", rgb: "34, 197, 94", pulseDuration: 1.0,
    ringSpeedClockwise: 30, ringSpeedCounter: -38, particleCount: 100,
    particleSpeed: 2.5, particleStyle: "pulse", scale: 1.15,
    glowIntensity: "0 0 65px rgba(34,197,94,0.65), inset 0 0 45px rgba(34,197,94,0.55)"
  },
  analyzing: {
    color: "#00b2ff", rgb: "0, 178, 255", pulseDuration: 2.5,
    ringSpeedClockwise: 40, ringSpeedCounter: -50, particleCount: 70,
    particleSpeed: 1.0, particleStyle: "drift", scale: 0.98,
    glowIntensity: "0 0 50px rgba(0,178,255,0.5), inset 0 0 35px rgba(0,178,255,0.4)"
  },
  warning: {
    color: "#b6f7ff", rgb: "182, 247, 255", pulseDuration: 1.8,
    ringSpeedClockwise: 50, ringSpeedCounter: -60, particleCount: 50,
    particleSpeed: 1.2, particleStyle: "drift", scale: 0.92,
    glowIntensity: "0 0 55px rgba(182,247,255,0.55), inset 0 0 35px rgba(182,247,255,0.45)"
  },
  executing: {
    color: "#a855f7", rgb: "168, 85, 247", pulseDuration: 0.4,
    ringSpeedClockwise: 5, ringSpeedCounter: -7, particleCount: 160,
    particleSpeed: 4.8, particleStyle: "converge", scale: 1.05,
    glowIntensity: "0 0 75px rgba(168,85,247,0.8), inset 0 0 55px rgba(168,85,247,0.7)"
  },
  disconnected: {
    color: "#002244", rgb: "0, 34, 68", pulseDuration: 5.0,
    ringSpeedClockwise: 90, ringSpeedCounter: -120, particleCount: 25,
    particleSpeed: 0.4, particleStyle: "glitch", scale: 0.8,
    glowIntensity: "0 0 20px rgba(0,34,68,0.2), inset 0 0 15px rgba(0,34,68,0.15)"
  },
  error: {
    color: "#ef4444", rgb: "239, 68, 68", pulseDuration: 0.5,
    ringSpeedClockwise: 4, ringSpeedCounter: -5, particleCount: 150,
    particleSpeed: 4.2, particleStyle: "chaotic", scale: 1.18,
    glowIntensity: "0 0 80px rgba(239,68,68,0.85), inset 0 0 55px rgba(239,68,68,0.75)"
  }
};

interface JarvisCoreProps {
  state: JarvisState;
  scrollProgress?: number;
}

export default function JarvisCore({ state, scrollProgress = 0 }: JarvisCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const config = STATE_CONFIGS[state];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 28 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);

  const scrollScale = 1 + scrollProgress * 0.2;
  const scrollSpeedMult = 1 + scrollProgress * 1.2;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX - window.innerWidth / 2) / window.innerWidth);
      mouseY.set((e.clientY - window.innerHeight / 2) / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Canvas particle system with delta-time
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);
    let lastTime = performance.now();

    interface P {
      x: number; y: number; vx: number; vy: number;
      radius: number; angle: number; speed: number;
      dist: number; alpha: number; seed: number;
    }

    let particles: P[] = [];
    const create = () => {
      particles = [];
      const c = STATE_CONFIGS[state];
      for (let i = 0; i < c.particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 160 + 25;
        particles.push({
          x: w / 2 + Math.cos(angle) * dist,
          y: h / 2 + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * c.particleSpeed,
          vy: (Math.random() - 0.5) * c.particleSpeed,
          radius: Math.random() * 1.6 + 0.5,
          angle, speed: (Math.random() * 0.018 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
          dist, alpha: Math.random() * 0.55 + 0.15, seed: Math.random() * 100
        });
      }
    };
    create();

    let time = 0;
    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.67, 3); // normalize to ~60fps
      lastTime = now;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const c = STATE_CONFIGS[state];
      time += 0.01 * dt;

      // Background glow
      const g = ctx.createRadialGradient(cx, cy, 4, cx, cy, 160);
      g.addColorStop(0, `rgba(${c.rgb}, 0.1)`);
      g.addColorStop(0.5, `rgba(${c.rgb}, 0.03)`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Neural connections
      if (state !== "disconnected" && state !== "error") {
        ctx.beginPath();
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const d = dx * dx + dy * dy;
            if (d < 1764) { // 42^2
              const alpha = (1 - Math.sqrt(d) / 42) * particles[i].alpha * 0.2;
              ctx.strokeStyle = `rgba(${c.rgb}, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
            }
          }
        }
        ctx.stroke();
      }

      // Update & render particles
      const pSpeed = c.particleSpeed * scrollSpeedMult;
      particles.forEach((p) => {
        const style = c.particleStyle;
        if (style === "orbit") {
          p.angle += p.speed * pSpeed * 0.8 * dt;
          const wave = Math.sin(time + p.seed) * 7;
          p.x = cx + Math.cos(p.angle) * (p.dist + wave);
          p.y = cy + Math.sin(p.angle) * (p.dist + wave);
        } else if (style === "converge") {
          p.angle += p.speed * pSpeed * 0.7 * dt;
          p.dist -= pSpeed * 0.35 * dt;
          if (p.dist < 10) { p.dist = Math.random() * 110 + 90; p.angle = Math.random() * Math.PI * 2; }
          p.x = cx + Math.cos(p.angle) * p.dist;
          p.y = cy + Math.sin(p.angle) * p.dist;
        } else if (style === "booting") {
          p.dist += pSpeed * 0.7 * dt;
          if (p.dist > 160) { p.dist = Math.random() * 12; p.angle = Math.random() * Math.PI * 2; }
          p.x = cx + Math.cos(p.angle) * p.dist;
          p.y = cy + Math.sin(p.angle) * p.dist;
          p.alpha = Math.max(0, 1 - p.dist / 160) * 0.7;
        } else if (style === "pulse") {
          p.angle += p.speed * pSpeed * 0.5 * dt;
          const pw = Math.sin(time * 5 + p.seed) * 14;
          p.x = cx + Math.cos(p.angle) * (p.dist + pw);
          p.y = cy + Math.sin(p.angle) * (p.dist + pw);
        } else if (style === "drift") {
          p.vx += (Math.random() - 0.5) * 0.08 * pSpeed * dt;
          p.vy += (Math.random() - 0.5) * 0.08 * pSpeed * dt;
          p.vx *= 0.98; p.vy *= 0.98;
          p.x += p.vx * dt; p.y += p.vy * dt;
          const dx = p.x - cx, dy = p.y - cy, d = Math.sqrt(dx * dx + dy * dy);
          if (d > 140) { p.vx -= (dx / d) * 0.04 * pSpeed; p.vy -= (dy / d) * 0.04 * pSpeed; }
        } else if (style === "chaotic") {
          p.angle += p.speed * pSpeed * 1.8 * dt;
          p.dist += (Math.random() - 0.5) * 12 * pSpeed * dt;
          if (p.dist > 180 || p.dist < 4) p.dist = Math.random() * 140 + 18;
          p.x = cx + Math.cos(p.angle) * p.dist + (Math.random() - 0.5) * 2;
          p.y = cy + Math.sin(p.angle) * p.dist + (Math.random() - 0.5) * 2;
        } else if (style === "glitch") {
          p.x += (Math.random() - 0.5) * pSpeed * 1.5 * dt;
          p.y += (Math.random() - 0.5) * pSpeed * 1.5 * dt;
          const dx = p.x - cx, dy = p.y - cy, d = Math.sqrt(dx * dx + dy * dy);
          if (d > 120) { p.x = cx + (dx / d) * 110; p.y = cy + (dy / d) * 110; }
          p.alpha = Math.random() > 0.93 ? 0 : Math.random() * 0.35 + 0.08;
        }

        // Draw particle with glow halo
        ctx.beginPath();
        ctx.fillStyle = `rgba(${c.rgb}, ${p.alpha})`;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Occasional spark for high-energy states
        if ((state === "executing" || state === "processing" || state === "error") && Math.random() > 0.8) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(255,255,255,${p.alpha * 0.6})`;
          ctx.arc(p.x, p.y, p.radius * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      create();
    };
    window.addEventListener("resize", handleResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", handleResize); };
  }, [state, scrollSpeedMult]);

  const rCW = config.ringSpeedClockwise / scrollSpeedMult;
  const rCC = Math.abs(config.ringSpeedCounter / scrollSpeedMult);

  return (
    <div className="relative w-[480px] h-[480px] flex items-center justify-center pointer-events-none select-none gpu-accelerate">
      <motion.div
        className="w-full h-full relative flex items-center justify-center"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      >
        {/* Canvas particles */}
        <div className="absolute inset-0" style={{ transform: "translateZ(-30px)" }}>
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        {/* Ring 1: Outer coordinate ring */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: "translateZ(-20px)" }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: rCW, ease: "linear" }}
        >
          <svg className="w-[460px] h-[460px]" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="96" fill="none" stroke={config.color}
              strokeWidth="0.35" strokeDasharray="4 8 1 2 1 2" opacity="0.22" />
            <circle cx="100" cy="100" r="93" fill="none" stroke={config.color}
              strokeWidth="1" strokeDasharray="0.3 3" opacity="0.25" />
            <path d="M100,2 L102,5 98,5Z" fill={config.color} opacity="0.6" />
            <path d="M100,198 L102,195 98,195Z" fill={config.color} opacity="0.6" />
            <path d="M2,100 L5,102 5,98Z" fill={config.color} opacity="0.6" />
            <path d="M198,100 L195,102 195,98Z" fill={config.color} opacity="0.6" />
          </svg>
        </motion.div>

        {/* Ring 2: Segmented medium ring */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: "translateZ(-10px)" }}
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: rCC, ease: "linear" }}
        >
          <svg className="w-[390px] h-[390px]" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="84" fill="none" stroke={config.color}
              strokeWidth="1.3" strokeDasharray="40 10 15 5 55 12" opacity="0.4" />
            <circle cx="100" cy="100" r="80" fill="none" stroke={config.color}
              strokeWidth="0.4" strokeDasharray="2 3" opacity="0.25" />
            <text x="100" y="15" fill={config.color} fontSize="3" opacity="0.5"
              className="font-share-mono" style={{ textAnchor: "middle" }}>SYS_LNK_001</text>
            <text x="100" y="188" fill={config.color} fontSize="3" opacity="0.5"
              className="font-share-mono" style={{ textAnchor: "middle" }}>SEC_ROT_99A</text>
          </svg>
        </motion.div>

        {/* Ring 3: Hexagonal reticle */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: "translateZ(5px)" }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: rCW * 1.4, ease: "linear" }}
        >
          <svg className="w-[310px] h-[310px]" viewBox="0 0 200 200">
            <polygon points="100,32 158.8,66 158.8,134 100,168 41.2,134 41.2,66"
              fill="none" stroke={config.color} strokeWidth="0.7"
              opacity="0.25" strokeDasharray="10 4 2 4" />
            {[
              [100, 32], [158.8, 66], [158.8, 134],
              [100, 168], [41.2, 134], [41.2, 66]
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="1.3" fill={config.color} opacity="0.7" />
            ))}
          </svg>
        </motion.div>

        {/* Ring 4: Tactical arc ring */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: "translateZ(15px)" }}
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: rCC * 0.7, ease: "linear" }}
        >
          <svg className="w-[230px] h-[230px]" viewBox="0 0 200 200">
            <path d="M40 100 A60 60 0 0 1 160 100" fill="none" stroke={config.color}
              strokeWidth="1.8" strokeDasharray="5 15 2 2" opacity="0.55" />
            <path d="M160 100 A60 60 0 0 1 40 100" fill="none" stroke={config.color}
              strokeWidth="0.5" strokeDasharray="20 10" opacity="0.35" />
            <line x1="100" y1="34" x2="100" y2="44" stroke={config.color} strokeWidth="0.4" opacity="0.5" />
            <line x1="100" y1="156" x2="100" y2="166" stroke={config.color} strokeWidth="0.4" opacity="0.5" />
            <line x1="34" y1="100" x2="44" y2="100" stroke={config.color} strokeWidth="0.4" opacity="0.5" />
            <line x1="156" y1="100" x2="166" y2="100" stroke={config.color} strokeWidth="0.4" opacity="0.5" />
          </svg>
        </motion.div>

        {/* Ring 5: Inner tracker ring */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: "translateZ(25px)" }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: rCW * 0.4, ease: "linear" }}
        >
          <svg className="w-[170px] h-[170px]" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="40" fill="none" stroke={config.color}
              strokeWidth="1" strokeDasharray="18 4 6 12" opacity="0.7" />
            <circle cx="100" cy="100" r="35" fill="none" stroke={config.color}
              strokeWidth="0.35" strokeDasharray="1 1" opacity="0.4" />
          </svg>
        </motion.div>

        {/* Core: Outer corona glow */}
        <motion.div
          className="absolute w-[100px] h-[100px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, rgba(${config.rgb},0.3) 0%, rgba(${config.rgb},0.08) 50%, transparent 70%)`,
            transform: "translateZ(28px)",
            filter: "blur(8px)",
          }}
          animate={{
            scale: [1 * config.scale * scrollScale, 1.2 * config.scale * scrollScale, 1 * config.scale * scrollScale],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: config.pulseDuration * 1.2, ease: "easeInOut", repeat: Infinity }}
        />

        {/* Core: Bloom backer */}
        <motion.div
          className="absolute w-[76px] h-[76px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, rgba(${config.rgb},0.75) 0%, rgba(${config.rgb},0.18) 55%, transparent 100%)`,
            transform: "translateZ(32px)",
            boxShadow: config.glowIntensity,
            filter: "blur(3px)",
          }}
          animate={{
            scale: [1 * config.scale * scrollScale, 1.1 * config.scale * scrollScale, 1 * config.scale * scrollScale],
            opacity: [0.75, 1, 0.75]
          }}
          transition={{ duration: config.pulseDuration, ease: "easeInOut", repeat: Infinity }}
        />

        {/* Core: Energy sphere */}
        <motion.div
          className="absolute w-[66px] h-[66px] rounded-full flex items-center justify-center cursor-pointer pointer-events-auto"
          style={{
            background: `radial-gradient(circle at 38% 35%, #ffffff 0%, rgba(${config.rgb},0.9) 20%, rgba(${config.rgb},0.45) 55%, rgba(5,8,22,0.92) 100%)`,
            boxShadow: config.glowIntensity,
            transform: "translateZ(45px)",
            border: `1.5px solid rgba(${config.rgb}, 0.6)`
          }}
          animate={{
            scale: [1 * config.scale * scrollScale, 1.06 * config.scale * scrollScale, 1 * config.scale * scrollScale]
          }}
          transition={{ duration: config.pulseDuration, ease: [0.4, 0, 0.2, 1], repeat: Infinity }}
        >
          <div className="w-[85%] h-[85%] rounded-full opacity-60 flex items-center justify-center relative overflow-hidden bg-black/20">
            <motion.div
              className="absolute inset-1 border border-dashed rounded-full"
              style={{ borderColor: `rgba(${config.rgb},0.4)`, borderWidth: "0.7px" }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-2 border border-dotted rounded-full"
              style={{ borderColor: `rgba(${config.rgb},0.6)`, borderWidth: "1px" }}
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
            />
            {/* Inner core node */}
            <div
              className="w-2.5 h-2.5 rounded-full bg-white relative z-10"
              style={{ boxShadow: `0 0 12px #fff, 0 0 25px rgba(${config.rgb},0.8)` }}
            />
            {/* Sweep bar */}
            <motion.div
              className="absolute w-[200%] h-[1px] top-1/2 left-[-50%]"
              style={{ background: `linear-gradient(90deg, transparent, rgba(${config.rgb},0.7), transparent)` }}
              animate={{ rotate: 360, translateY: [-1.5, 1.5, -1.5] }}
              transition={{
                rotate: { repeat: Infinity, duration: 1.8, ease: "linear" },
                translateY: { repeat: Infinity, duration: 3.5, ease: "easeInOut" }
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
