"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { JarvisState, STATE_CONFIGS } from "./JarvisCore";

interface HolographicHudProps {
  state: JarvisState;
  scrollProgress: number;
}

export default function HolographicHud({ state, scrollProgress }: HolographicHudProps) {
  const config = STATE_CONFIGS[state];
  const audioCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 32 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 32 });
  const hudX = useTransform(springX, [-0.5, 0.5], [-6, 6]);
  const hudY = useTransform(springY, [-0.5, 0.5], [-6, 6]);

  const [coreTemp, setCoreTemp] = useState(36.4);
  const [syncRate, setSyncRate] = useState(99.98);
  const [load, setLoad] = useState([24, 18, 32, 11]);
  const [timeStr, setTimeStr] = useState("");
  const [logs, setLogs] = useState<string[]>([
    "SYS // INITIALIZING NEURAL PATHWAYS",
    "CORE // GLOW BLOOM SYSTEM ARMED",
    "HUD // RADIAL TELEMETRY ENABLED"
  ]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX - window.innerWidth / 2) / window.innerWidth);
      mouseY.set((e.clientY - window.innerHeight / 2) / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Clock & metric updates
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeStr(
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
          now.getSeconds()
        ).padStart(2, "0")}.${String(now.getMilliseconds()).slice(0, 2)}`
      );

      if (state === "executing" || state === "processing") {
        setCoreTemp(p => Math.min(68.5, p + (Math.random() - 0.3) * 0.8));
        setSyncRate(p => Math.min(100, Math.max(99.0, p + (Math.random() - 0.5) * 0.05)));
        setLoad([
          Math.floor(Math.random() * 20 + 75), Math.floor(Math.random() * 20 + 70),
          Math.floor(Math.random() * 25 + 65), Math.floor(Math.random() * 15 + 80)
        ]);
      } else if (state === "error" || state === "warning") {
        setCoreTemp(p => Math.min(84.0, p + (Math.random() - 0.4) * 1.5));
        setSyncRate(p => Math.max(62.4, p - (Math.random() - 0.1) * 0.8));
        setLoad([
          Math.floor(Math.random() * 30 + 60), Math.floor(Math.random() * 30 + 55),
          Math.floor(Math.random() * 20 + 70), Math.floor(Math.random() * 40 + 50)
        ]);
      } else if (state === "disconnected") {
        setCoreTemp(p => Math.max(22.0, p - 0.2));
        setSyncRate(0.0);
        setLoad([0, 0, 0, 0]);
      } else {
        setCoreTemp(p => p > 37 ? p - 0.1 : p < 35 ? p + 0.1 : p + (Math.random() - 0.5) * 0.2);
        setSyncRate(p => Math.min(100, Math.max(99.8, p + (Math.random() - 0.5) * 0.01)));
        setLoad([
          Math.floor(Math.random() * 10 + 15), Math.floor(Math.random() * 10 + 12),
          Math.floor(Math.random() * 12 + 10), Math.floor(Math.random() * 8 + 8)
        ]);
      }
    }, 300);
    return () => clearInterval(timer);
  }, [state]);

  // Rolling logs
  useEffect(() => {
    const messages: Record<JarvisState, string[]> = {
      booting: ["BOOT // STARTING SUBSYSTEM KERNELS", "STARK_OS // AUTHENTICATING SECURE CORES", "ENERGY // CHARGING ARC GRID CAPACITORS", "NEURAL // CALIBRATING SYNAPSE THREADS"],
      idle: ["SYS // STATE MONITOR: STANDBY IDLE", "AMB_OSC // WINDING FREQUENCY REGULATORS", "NEURAL // ALL CHANNELS OPERATING AT 100%"],
      listening: ["AUDIO // INGESTION MICROPHONE STREAM ACTIVE", "STARK_NET // SPECTRAL ANALYZER RUNNING", "DECIBEL // DEVIATION THRESHOLD MONITORED"],
      processing: ["CALC // HEURISTIC PIPELINE DISPATCHED", "CORE // SYLVESTER MATRIX DECONVOLUTION", "VECTOR // ROTATION TRANSFORM APPLIED"],
      speaking: ["VOCAL // FREQUENCY OUTPUT REGULATION", "AUDIO // SPEECH ENVELOPE MODULATION", "DAC // WAVEFORM CONVERSION BUFFER FLUSH"],
      analyzing: ["SCAN // DEPTH RAYCAST GEOMETRY INGESTION", "SATELLITE // ENCRYPTED RADAR LINK ESTABLISHED", "RECON // CORRELATION COEFFICIENT CALC"],
      warning: ["WARN // THERMAL ELEVATION NODE 3", "VOLTAGE // INTRUSION SPIKE DETECTED", "GRID // SECURING EXTERNAL PORTS"],
      executing: ["EXEC // DISPATCHING CORE COMMANDS", "ARC // CONVERGING REACTOR BEAM", "STARK // COMBAT SUIT SYNC SEQUENCES"],
      disconnected: ["ERR // SHIFT BUFFER LOSS", "LINK // LOCAL HOST DISCONNECTED", "PING // ROUTING HOP FAILURE"],
      error: ["HALT // CRITICAL EXCEPTION", "OVERFLOW // MEMORY DUMP STACK TRACE", "HARDWARE // SYNC COLLAPSE 0xF3C2"]
    };
    const interval = setInterval(() => {
      const msgs = messages[state];
      setLogs(prev => [msgs[Math.floor(Math.random() * msgs.length)], prev[0], prev[1]].slice(0, 3));
    }, 1500);
    return () => clearInterval(interval);
  }, [state]);

  // Soundwave canvas with bezier smoothing & glow
  useEffect(() => {
    const canvas = audioCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animFrame: number;
    canvas.width = canvas.offsetWidth * 2; // 2x for retina
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    const dw = canvas.offsetWidth;
    const dh = canvas.offsetHeight;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, dw, dh);
      const c = STATE_CONFIGS[state];
      let waves = 3, amp = 15, freq = 0.05, speed = 0.12;

      if (state === "speaking") { waves = 4; amp = 28 + Math.sin(phase * 4) * 8; freq = 0.04; speed = 0.18; }
      else if (state === "listening") { waves = 2; amp = 4 + Math.sin(phase) * 2; freq = 0.08; speed = 0.06; }
      else if (state === "processing") { waves = 5; amp = 20 + Math.random() * 8; freq = 0.14; speed = 0.25; }
      else if (state === "executing") { waves = 4; amp = 32; freq = 0.08; speed = 0.32; }
      else if (state === "error") { waves = 6; amp = 35 * (Math.random() > 0.85 ? 0.2 : 1); freq = 0.22; speed = 0.4; }
      else if (state === "disconnected") { waves = 1; amp = 0.5 + Math.random() * 1.5; freq = 0.4; speed = 0.02; }
      else if (state === "analyzing") { waves = 3; amp = 12; freq = 0.06; speed = 0.08; }
      else { waves = 3; amp = 8; freq = 0.03; speed = 0.05; }

      phase += speed;

      for (let wi = 0; wi < waves; wi++) {
        ctx.beginPath();
        ctx.lineWidth = wi === 0 ? 1.5 : 0.7;
        const opacity = wi === 0 ? 0.8 : 0.35 - wi * 0.08;
        ctx.strokeStyle = `rgba(${c.rgb}, ${opacity})`;
        // Add subtle glow via shadow
        if (wi === 0) {
          ctx.shadowColor = `rgba(${c.rgb}, 0.4)`;
          ctx.shadowBlur = 6;
        } else {
          ctx.shadowBlur = 0;
        }

        const wShift = wi * 45;
        const wFreq = freq + wi * 0.01;

        for (let x = 0; x < dw; x += 2) {
          const edgeFade = Math.sin((x / dw) * Math.PI);
          let y = dh / 2;
          if (state === "error") {
            const noise = Math.random() > 0.98 ? (Math.random() - 0.5) * 18 : 0;
            y += Math.sin(x * wFreq + phase + wShift) * amp * edgeFade + noise;
          } else {
            y += Math.sin(x * wFreq + phase + wShift) * amp * edgeFade;
          }
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Gradient fill under primary wave
      ctx.beginPath();
      const wFreq0 = freq;
      for (let x = 0; x < dw; x += 2) {
        const edgeFade = Math.sin((x / dw) * Math.PI);
        const y = dh / 2 + Math.sin(x * wFreq0 + phase) * amp * edgeFade;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.lineTo(dw, dh);
      ctx.lineTo(0, dh);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, dh / 2, 0, dh);
      grad.addColorStop(0, `rgba(${c.rgb}, 0.08)`);
      grad.addColorStop(1, `rgba(${c.rgb}, 0)`);
      ctx.fillStyle = grad;
      ctx.fill();

      animFrame = requestAnimationFrame(render);
    };

    animFrame = requestAnimationFrame(render);

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    window.addEventListener("resize", handleResize);
    return () => { cancelAnimationFrame(animFrame); window.removeEventListener("resize", handleResize); };
  }, [state]);

  const scrollHudScale = 1 - scrollProgress * 0.04;

  // Staggered panel entry
  const panelVariants = {
    hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
    visible: (i: number) => ({
      opacity: 1, y: 0, filter: "blur(0px)",
      transition: { delay: i * 0.15, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }
    })
  };

  return (
    <motion.div
      className="fixed inset-0 w-full h-full pointer-events-none select-none z-10 flex flex-col justify-between p-5 md:p-6"
      style={{ x: hudX, y: hudY, scale: scrollHudScale }}
    >
      {/* ---- TOP ROW ---- */}
      <div className="flex justify-between items-start w-full relative z-20">

        {/* TOP LEFT: DIAGNOSTICS */}
        <motion.div
          className="glass-panel flex flex-col space-y-2 p-3 max-w-[270px] border-l-2 border-t-2"
          style={{ borderColor: `rgba(${config.rgb}, 0.2)` }}
          custom={0} initial="hidden" animate="visible" variants={panelVariants}
        >
          <div className="flex justify-between items-center border-b pb-1" style={{ borderColor: `rgba(${config.rgb}, 0.1)` }}>
            <span className="text-[11px] font-orbitron tracking-widest text-flicker" style={{ color: `rgba(${config.rgb}, 0.7)` }}>
              TACTICAL_MONITOR
            </span>
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: config.color }}
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="font-share-mono text-[11px] space-y-0.5" style={{ color: config.color }}>
            {[
              ["SYSTEM STATE", state.toUpperCase()],
              ["CORE TEMP", `${coreTemp.toFixed(1)} C`],
              ["SYNC SPEED", `${(syncRate * 8.4).toFixed(1)} T/S`],
              ["LINK SYNC", `${syncRate.toFixed(2)}%`],
              ["NODE_ADDR", "192.168.100.80:8080"]
            ].map(([label, value], i) => (
              <div key={i} className="flex justify-between">
                <span className="opacity-50">{label}:</span>
                <span className={i === 0 ? "font-bold glow-text-cyan uppercase" : ""}>{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* TOP RIGHT: PROCESSOR LOAD */}
        <motion.div
          className="glass-panel flex flex-col space-y-2 p-3 min-w-[230px] border-r-2 border-t-2"
          style={{ borderColor: `rgba(${config.rgb}, 0.2)` }}
          custom={1} initial="hidden" animate="visible" variants={panelVariants}
        >
          <div className="flex justify-between items-center border-b pb-1" style={{ borderColor: `rgba(${config.rgb}, 0.1)` }}>
            <span className="text-[11px] font-orbitron tracking-widest text-flicker" style={{ color: `rgba(${config.rgb}, 0.7)` }}>
              PROCESSOR_LOAD
            </span>
            <span className="font-share-mono text-[10px] text-white/40">{timeStr}</span>
          </div>
          <div className="space-y-1.5 font-share-mono text-[11px]" style={{ color: config.color }}>
            {load.map((cpuLoad, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="opacity-50 text-[10px] w-12">CORE_{idx}:</span>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div
                    className="h-full rounded-full relative overflow-hidden"
                    style={{
                      backgroundImage: `linear-gradient(90deg, ${config.color}, rgba(${config.rgb}, 0.25))`,
                      width: `${cpuLoad}%`
                    }}
                    transition={{ type: "spring", stiffness: 120, damping: 14 }}
                  >
                    {/* Shine sweep */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                      style={{ animation: "border-shimmer 3s ease-in-out infinite" }} />
                  </motion.div>
                </div>
                <span className="text-[10px] w-8 text-right">{cpuLoad}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ---- CORNER BRACKETS ---- */}
      <div className="absolute inset-0 m-5 md:m-6 pointer-events-none">
        {[
          { pos: "top-0 left-0", border: "border-l border-t" },
          { pos: "top-0 right-0", border: "border-r border-t" },
          { pos: "bottom-0 left-0", border: "border-l border-b" },
          { pos: "bottom-0 right-0", border: "border-r border-b" },
        ].map((b, i) => (
          <motion.div
            key={i}
            className={`absolute ${b.pos} w-7 h-7 ${b.border}`}
            style={{ borderColor: config.color }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
          />
        ))}
        {/* Tactical chevrons */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 flex flex-col space-y-1 opacity-35">
          <span className="text-[6px] rotate-90" style={{ color: config.color }}>^</span>
          <span className="text-[6px] rotate-90" style={{ color: config.color }}>^</span>
        </div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 flex flex-col space-y-1 opacity-35">
          <span className="text-[6px] -rotate-90" style={{ color: config.color }}>^</span>
          <span className="text-[6px] -rotate-90" style={{ color: config.color }}>^</span>
        </div>
      </div>

      {/* ---- BOTTOM ROW ---- */}
      <div className="flex justify-between items-end w-full relative z-20">

        {/* BOTTOM LEFT: RADAR */}
        <motion.div
          className="glass-panel flex space-x-3 items-center p-3 max-w-[270px] border-l-2 border-b-2"
          style={{ borderColor: `rgba(${config.rgb}, 0.2)` }}
          custom={2} initial="hidden" animate="visible" variants={panelVariants}
        >
          <div className="relative w-14 h-14 rounded-full border border-dashed flex items-center justify-center overflow-hidden"
            style={{ borderColor: config.color }}>
            <motion.div
              className="absolute inset-0 origin-center"
              style={{ background: `conic-gradient(from 0deg, rgba(${config.rgb}, 0.3) 0deg, transparent 80deg, transparent 360deg)` }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
            />
            <div className="w-8 h-8 rounded-full border border-dotted" style={{ borderColor: `rgba(${config.rgb}, 0.25)` }} />
            <div className="absolute w-full h-[0.5px] top-1/2" style={{ backgroundColor: `rgba(${config.rgb}, 0.15)` }} />
            <div className="absolute h-full w-[0.5px] left-1/2" style={{ backgroundColor: `rgba(${config.rgb}, 0.15)` }} />
            {/* Blinking targets */}
            <motion.div className="absolute w-1.5 h-1.5 rounded-full top-3 left-4"
              style={{ backgroundColor: config.color }}
              animate={{ opacity: [0.15, 0.9, 0.15] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }} />
            <motion.div className="absolute w-1 h-1 rounded-full bottom-4 right-3"
              style={{ backgroundColor: config.color }}
              animate={{ opacity: [0.1, 0.7, 0.1] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.5 }} />
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] font-orbitron tracking-widest text-flicker" style={{ color: `rgba(${config.rgb}, 0.5)` }}>RADAR_SWEEP</span>
            <div className="font-share-mono text-[10px] space-y-0.5" style={{ color: config.color }}>
              <div className="flex space-x-2"><span className="opacity-50">LAT:</span><span>45.0392.A</span></div>
              <div className="flex space-x-2"><span className="opacity-50">LNG:</span><span>-93.2491.D</span></div>
              <div className="flex space-x-2"><span className="opacity-50">SYNC:</span><span>LOCKED</span></div>
            </div>
          </div>
        </motion.div>

        {/* BOTTOM RIGHT: NEURAL SPECTRUM */}
        <motion.div
          className="glass-panel flex flex-col space-y-1.5 p-3 min-w-[270px] border-r-2 border-b-2"
          style={{ borderColor: `rgba(${config.rgb}, 0.2)` }}
          custom={3} initial="hidden" animate="visible" variants={panelVariants}
        >
          <div className="flex justify-between items-center border-b pb-0.5" style={{ borderColor: `rgba(${config.rgb}, 0.1)` }}>
            <span className="text-[11px] font-orbitron tracking-widest text-flicker" style={{ color: `rgba(${config.rgb}, 0.7)` }}>
              NEURAL_SPECTRUM
            </span>
            <span className="font-share-mono text-[9px] text-white/35">FREQ_HZ: 44.1K</span>
          </div>
          <div className="h-10 w-full relative">
            <canvas ref={audioCanvasRef} className="w-full h-full block" />
          </div>
          <div className="font-share-mono text-[9px] space-y-0.5 overflow-hidden h-9 text-right" style={{ color: config.color }}>
            {logs.map((log, idx) => (
              <motion.div
                key={`${log}-${idx}`}
                className="truncate"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 0.65, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                {log} <span className="opacity-25">| {timeStr}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
