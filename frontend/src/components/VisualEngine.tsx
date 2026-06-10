"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Cpu, Shield, Wifi } from "lucide-react";
import HolographicHud from "./jarvis/HolographicHud";
import InteractionChamber from "./jarvis/InteractionChamber";

const BOOT_LOGS = [
  "CONNECTING TO GLOBAL NETWORKS...",
  "ESTABLISHING PROTOCOL QUANTUM-9...",
  "LOADING NEURAL SCHEMATICS...",
  "SYNCHRONIZING ORBITAL SATELLITES...",
  "BYPASSING LOCAL SECURITY NODES...",
  "GRID STABILIZATION ACTIVE...",
  "CALIBRATING OPTICAL HUD CHANNELS...",
  "SECURITY PROFILE: ADMIN APPROVED",
  "A.I. SYSTEM ON STANDBY...",
];

type BootState = "dark" | "dot" | "line" | "expand" | "flash" | "ready";

export default function VisualEngine() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [bootState, setBootState] = useState<BootState>("dark");
  const [activeLogs, setActiveLogs] = useState<string[]>([]);
  const [telemetryVal, setTelemetryVal] = useState({ cpu: 1.2, ram: 24, temp: 34.2, nodes: 88 });

  // Boot cinematic sequence with refined timing
  useEffect(() => {
    const timers = [
      setTimeout(() => setBootState("dot"), 1000),
      setTimeout(() => setBootState("line"), 2100),
      setTimeout(() => setBootState("expand"), 2800),
      setTimeout(() => setBootState("flash"), 3800),
      setTimeout(() => setBootState("ready"), 4200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Boot log typing
  useEffect(() => {
    if (bootState !== "ready") return;
    let logIdx = 0;
    const iv = setInterval(() => {
      if (logIdx < BOOT_LOGS.length) {
        setActiveLogs(prev => [...prev.slice(-5), BOOT_LOGS[logIdx]]);
        logIdx++;
      } else {
        const rnd = [
          `SYS_PING: ${(Math.random() * 40 + 10).toFixed(1)}ms`,
          `PACKET_RX: ${Math.floor(Math.random() * 1000)}B/s`,
          `SYS_STABILITY: ${(99 + Math.random() * 0.9).toFixed(2)}%`,
          `DRIVE_HEALTH: EXCELLENT`,
        ];
        setActiveLogs(prev => [...prev.slice(-5), `[OK] ${rnd[Math.floor(Math.random() * rnd.length)]}`]);
      }
    }, 2000);
    return () => clearInterval(iv);
  }, [bootState]);

  // Telemetry fluctuation
  useEffect(() => {
    if (bootState !== "ready") return;
    const iv = setInterval(() => {
      setTelemetryVal(p => ({
        cpu: +(p.cpu + (Math.random() - 0.5) * 0.4).toFixed(1),
        ram: Math.floor(p.ram + (Math.random() - 0.5) * 3),
        temp: +(p.temp + (Math.random() - 0.5) * 0.2).toFixed(1),
        nodes: Math.floor(p.nodes + (Math.random() - 0.5) * 2),
      }));
    }, 1500);
    return () => clearInterval(iv);
  }, [bootState]);

  // Track mouse for particle interaction
  useEffect(() => {
    const h = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, []);

  // Canvas particles with cursor reactivity & neural pulse
  useEffect(() => {
    if (bootState !== "ready" && bootState !== "expand" && bootState !== "flash") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    interface P {
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; baseOpacity: number;
    }

    const particles: P[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const count = 75;
    for (let i = 0; i < count; i++) {
      const o = Math.random() * 0.3 + 0.08;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        size: Math.random() * 1.6 + 0.5,
        opacity: o,
        baseOpacity: o,
      });
    }

    let pulsePhase = 0;

    const draw = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.67, 3);
      lastTime = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pulsePhase += 0.008 * dt;
      const pulseRadius = (Math.sin(pulsePhase) * 0.5 + 0.5) * Math.max(canvas.width, canvas.height) * 0.6;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Connection lines
      ctx.lineWidth = 0.4;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = dx * dx + dy * dy;
          if (d < 16900) { // 130^2
            const alpha = (1 - Math.sqrt(d) / 130) * 0.065;
            ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        // Cursor proximity effect
        const dxM = p.x - mx;
        const dyM = p.y - my;
        const distMouse = Math.sqrt(dxM * dxM + dyM * dyM);
        const cursorInfluence = distMouse < 150 ? (1 - distMouse / 150) : 0;

        // Neural pulse influence
        const distCenter = Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2);
        const pulseDelta = Math.abs(distCenter - pulseRadius);
        const pulseInfluence = pulseDelta < 50 ? (1 - pulseDelta / 50) * 0.15 : 0;

        // Cursor repulsion
        if (cursorInfluence > 0 && distMouse > 1) {
          p.vx += (dxM / distMouse) * cursorInfluence * 0.02 * dt;
          p.vy += (dyM / distMouse) * cursorInfluence * 0.02 * dt;
        }

        p.opacity = p.baseOpacity + cursorInfluence * 0.3 + pulseInfluence;

        // Draw glow halo for cursor-nearby particles
        if (cursorInfluence > 0.3) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(0, 229, 255, ${cursorInfluence * 0.06})`;
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw particle
        ctx.beginPath();
        ctx.fillStyle = `rgba(0, 229, 255, ${p.opacity})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Update position
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.997;
        p.vy *= 0.997;

        // Wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, [bootState]);

  const isReady = bootState === "ready";

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050816] select-none text-white font-mono flex items-center justify-center">

      {/* === ATMOSPHERIC BACKGROUND LAYERS === */}
      <div className="atmospheric-fog" />
      <div className="cursor-glow-layer" />

      {/* Ambient pulsing glow spheres */}
      <motion.div
        className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)" }}
        animate={{ opacity: [0.25, 0.5, 0.25], scale: [1, 1.06, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-[15%] -right-[15%] w-[60%] h-[60%] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(0,100,255,0.05) 0%, transparent 65%)" }}
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.12, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Core glow (appears on ready) */}
      {isReady && (
        <motion.div
          className="absolute w-[35%] h-[35%] rounded-full pointer-events-none z-0"
          style={{ background: "radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)" }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: [0.15, 0.3, 0.15], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* === TACTICAL GRIDS === */}
      {bootState !== "dark" && bootState !== "dot" && (
        <>
          <motion.div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: "linear-gradient(rgba(0,229,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.02) 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 2 }}
          />
          <motion.div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: "linear-gradient(rgba(0,229,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.025) 1px, transparent 1px)",
              backgroundSize: "60px 60px"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            transition={{ duration: 2.5 }}
          />
        </>
      )}

      {/* Perspective floor grid */}
      {isReady && (
        <div className="absolute inset-x-0 bottom-0 h-[30%] pointer-events-none opacity-20 z-0"
          style={{ perspective: "400px" }}>
          <div className="w-full h-full"
            style={{
              backgroundImage: "linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              transform: "rotateX(65deg)",
              transformOrigin: "bottom center"
            }} />
        </div>
      )}

      {/* === CANVAS PARTICLES === */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[5] block" />

      {/* === OVERLAYS === */}
      <div className="holo-noise" />
      <div className="scanlines" />
      <div className="chromatic-edge" />
      <div className="data-stream" />

      {/* Energy pulses */}
      {isReady && (
        <>
          <div className="energy-pulse" />
          <div className="energy-pulse" style={{ animationDelay: "4s" }} />
        </>
      )}

      {/* Scanning laser */}
      {isReady && <div className="scanning-laser" />}

      {/* Depth blur on edges */}
      <div className="depth-blur-edge" />

      {/* Vignette */}
      <div className="vignette" />

      {/* === BOOT SEQUENCE === */}
      <AnimatePresence mode="wait">
        {!isReady && bootState !== "flash" && (
          <motion.div
            key={bootState}
            className="absolute inset-0 flex items-center justify-center z-50"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {bootState === "dark" && (
              <motion.div
                className="w-[2px] h-[2px] bg-[#00e5ff] rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
            {bootState === "dot" && (
              <motion.div
                className="w-1.5 h-1.5 bg-[#00e5ff] rounded-full"
                style={{ boxShadow: "0 0 20px #00e5ff, 0 0 40px rgba(0,229,255,0.4)" }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 2.2, 1], opacity: 1 }}
                exit={{ scale: 3, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
              />
            )}
            {bootState === "line" && (
              <motion.div
                className="h-[1px] bg-[#00e5ff]"
                style={{ boxShadow: "0 0 12px #00e5ff, 0 0 30px rgba(0,229,255,0.3)" }}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "75%", opacity: 1 }}
                exit={{ width: "100%", opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              />
            )}
            {bootState === "expand" && (
              <motion.div
                className="w-full h-full flex flex-col justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-full h-[1px] bg-[#00e5ff]/30" style={{ boxShadow: "0 0 8px #00e5ff" }} />
                <div className="text-center self-center">
                  <motion.span
                    className="text-cyan-400 text-xs tracking-[0.5em] font-orbitron"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    J.A.R.V.I.S. WAKING UP...
                  </motion.span>
                </div>
                <div className="w-full h-[1px] bg-[#00e5ff]/30" style={{ boxShadow: "0 0 8px #00e5ff" }} />
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Screen flash on transition to ready */}
        {bootState === "flash" && (
          <motion.div
            key="flash"
            className="absolute inset-0 z-50 bg-[#00e5ff]/10"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* === IMMERSIVE AI INTERACTION CHAMBER === */}
      {isReady && (
        <InteractionChamber />
      )}

      {/* === HOLOGRAPHIC HUD === */}
      {isReady && (
        <HolographicHud scrollProgress={0} />
      )}

      {/* === HUD TELEMETRY OVERLAY === */}
      {isReady && (
        <motion.div
          className="absolute inset-0 p-5 md:p-6 z-30 pointer-events-none flex flex-col justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        >
          {/* TOP HUD */}
          <div className="w-full flex justify-between items-start">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <motion.span
                  className="w-2 h-2 rounded-full bg-cyan-400"
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-[10px] font-bold tracking-[0.3em] text-[#b6f7ff]/85 font-orbitron">
                  SYSTEM STATUS // ACTIVE_
                </span>
              </div>
              <div className="text-[9px] text-[#00b2ff]/60 tracking-wider font-share-mono">
                LOC: SEC_C8 // PROTOCOL: STARK_OS_9
              </div>
            </div>

            <div className="flex space-x-6 text-right text-[9px] text-[#00b2ff]/55 tracking-widest font-share-mono">
              <div>CPU: <span className="text-cyan-400 glow-text-cyan">{telemetryVal.cpu}%</span></div>
              <div>CORES: <span className="text-cyan-400">{telemetryVal.nodes}/128</span></div>
              <div>TEMP: <span className="text-cyan-400">{telemetryVal.temp} C</span></div>
            </div>
          </div>

          {/* CENTRAL FOCUS MATRIX */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            {/* Focus brackets */}
            <div className="absolute w-[400px] h-[400px] border border-[#00e5ff]/[0.03] flex justify-between p-2">
              <div className="w-4 h-4 border-t border-l border-[#00e5ff]/20" />
              <div className="w-4 h-4 border-t border-r border-[#00e5ff]/20" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#00e5ff]/20" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#00e5ff]/20" />
            </div>

            <div className="absolute -bottom-28 text-center">
              <motion.div
                className="text-[10px] tracking-[0.4em] text-cyan-400/60 uppercase font-orbitron text-flicker"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                SYSTEM CORE ONLINE
              </motion.div>
              <div className="text-[8px] tracking-[0.1em] text-[#00b2ff]/30 mt-1 font-share-mono">
                SECURE ACCESS GRANTED // ADMIN_PORTAL
              </div>
            </div>
          </div>

          {/* TERMINAL FEED LOGS */}
          <div className="w-[300px] flex flex-col space-y-1.5 text-left z-30">
            <div className="flex items-center space-x-1.5 text-[#00e5ff]/40 text-[9px] font-semibold border-b border-cyan-500/10 pb-1 mb-1 tracking-widest font-orbitron">
              <Activity size={10} className="text-flicker" />
              <span>TERMINAL FEED LOGS</span>
            </div>
            <div className="space-y-0.5 text-[8px] text-[#00b2ff]/70 font-share-mono tracking-wider">
              {activeLogs.map((log, i) => (
                <motion.div
                  key={`${log}-${i}`}
                  className="flex items-center space-x-1"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <span className="text-cyan-400/50 font-semibold">{'>'}</span>
                  <span>{log}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* EDGE RULERS */}
          <div className="absolute left-5 top-1/4 bottom-1/4 w-[1px] bg-cyan-500/8 flex flex-col justify-between items-center text-[7px] text-cyan-500/25 py-4 font-share-mono">
            {["90", "", "70", "", "50", "", "30", "", "10"].map((v, i) => (
              v ? <span key={i}>{v}</span> : <div key={i} className="w-1.5 h-[1px] bg-cyan-500/15" />
            ))}
          </div>
          <div className="absolute right-5 top-1/4 bottom-1/4 w-[1px] bg-cyan-500/8 flex flex-col justify-between items-center text-[7px] text-cyan-500/25 py-4 font-share-mono">
            {["MAX", "", "800", "", "600", "", "400", "", "000"].map((v, i) => (
              v ? <span key={i}>{v}</span> : <div key={i} className="w-1.5 h-[1px] bg-cyan-500/15" />
            ))}
          </div>

          {/* FOOTER STATUS */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center space-x-10 text-[8px] tracking-[0.25em] text-[#00b2ff]/35 font-share-mono">
            <div className="flex items-center space-x-1.5">
              <Shield size={9} className="text-cyan-400/45" />
              <span>SECURE LAYER ACTIVE</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Wifi size={9} className="text-cyan-400/45" />
              <span>NET_CONN: SYNCHRONIZED</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Cpu size={9} className="text-cyan-400/45 text-flicker" />
              <span>A.I. MATRIX LEVEL 1 WOKEN</span>
            </div>
          </div>

          {/* CORNER LABELS */}
          {[
            { pos: "top-5 left-5", border: "border-t-[1.5px] border-l-[1.5px]", label: "SYS.INIT", align: "justify-start items-start" },
            { pos: "top-5 right-5", border: "border-t-[1.5px] border-r-[1.5px]", label: "CAL.8.4", align: "justify-start items-end" },
            { pos: "bottom-5 left-5", border: "border-b-[1.5px] border-l-[1.5px]", label: "DEC.NET", align: "justify-end items-start" },
            { pos: "bottom-5 right-5", border: "border-b-[1.5px] border-r-[1.5px]", label: "STARK.OS", align: "justify-end items-end" },
          ].map((c, i) => (
            <div key={i} className={`absolute ${c.pos} w-11 h-11 ${c.border} border-cyan-500/25 flex flex-col ${c.align} p-1.5`}>
              <span className="text-[6px] text-cyan-500/35 font-share-mono">{c.label}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
