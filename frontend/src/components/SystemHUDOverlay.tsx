"use client";

import { motion, MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Terminal, Cpu, Shield, Wifi } from "lucide-react";
import { useJarvisStore } from "@/store/useJarvisStore";
import { getAIStateDefinition } from "@/lib/aiState";

interface SystemHUDOverlayProps {
  scrollYProgress: MotionValue<number>;
  onStageClick?: (stageIdx: number) => void;
}

interface LogEntry {
  progress: number;
  code: string;
  msg: string;
}

const TELEMETRY_LOGS: LogEntry[] = [
  { progress: 0.00, code: "SYS_INIT", msg: "RUNNING DIAGNOSTIC BOOT SECTOR..." },
  { progress: 0.04, code: "LINK_SYNC", msg: "ESTABLISHING HANDSHAKE WITH QUANTUM RECEPTOR..." },
  { progress: 0.08, code: "COMP_CORE", msg: "SYNCHRONIZING CLOCK SHA-256 PARITY CHECK..." },
  { progress: 0.12, code: "PHYS_LINK", msg: "LINK ESTABLISHED ON FIBER ADAPTER 4" },
  
  { progress: 0.22, code: "CORE_ACTV", msg: "DETECTING ENERGY SIGNATURE CONVERGENCE..." },
  { progress: 0.26, code: "ORB_SYNC", msg: "NEURAL SHELL POLARITY STABILIZED" },
  { progress: 0.32, code: "RAD_FLD", msg: "CONVERGING DRIFT NODES AT CENTER MASS" },
  { progress: 0.38, code: "COMP_SYNC", msg: "SYSTEM CORE VOLTAGE NOMINAL (1.18V)" },
  
  { progress: 0.44, code: "HUD_EXP", msg: "INITIATING HOLOGRAPHIC FRAMEWORK..." },
  { progress: 0.48, code: "RINGS_ON", msg: "ACTIVATING ROTATIONAL BEAM COORDINATES" },
  { progress: 0.52, code: "TELEMETRY", msg: "STREAMING LOCAL CORE FREQ DIAGNOSTICS" },
  { progress: 0.56, code: "GRAPH_MAP", msg: "CALIBRATING SYSTEM VIEWFINDER MATRIX" },
  
  { progress: 0.62, code: "NEUR_IMM", msg: "DEPTH LEVEL D-9 EXCEEDED. CAMERA PUSH ACTIVE" },
  { progress: 0.66, code: "TUNN_FLOW", msg: "WARPING SPACETIME PERCEPTUAL MATRIX" },
  { progress: 0.72, code: "GLOW_SYNC", msg: "MAXIMUM RADIAL BLOOM INTENSITY REGISTERED" },
  { progress: 0.76, code: "SYNC_LOCK", msg: "CHROMATIC DISPERSION RATIO 1.48" },
  
  { progress: 0.84, code: "AWAKENED", msg: "J.A.R.V.I.S CONSCIOUSNESS ONLINE" },
  { progress: 0.88, code: "COM_CHAMB", msg: "STABILIZING USER COMMUNICATIONS LAYER" },
  { progress: 0.92, code: "RES_READY", msg: "VOICE MODULATION PATTERNS ESTABLISHED" },
  { progress: 0.98, code: "CORE_LIVE", msg: "ALL SYSTEMS OPERATING AT MAXIMUM CAPACITY" },
];

export default function SystemHUDOverlay({ scrollYProgress, onStageClick }: SystemHUDOverlayProps) {
  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const terminalContainerRef = useRef<HTMLDivElement | null>(null);
  const currentState = useJarvisStore((s) => s.currentState);
  const stateDefinition = getAIStateDefinition(currentState);
  const [currentLogs, setCurrentLogs] = useState<LogEntry[]>([]);
  const [depth, setDepth] = useState(0);
  const [syncPercent, setSyncPercent] = useState(0);

  // Hook into scroll changes to update state values
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Calculate depth (0m to 10,000m)
      setDepth(Math.floor(latest * 10000));
      // Calculate Sync Percent (0% to 100%)
      setSyncPercent(Math.floor(latest * 100));

      // Filter logs based on current scroll position
      const visibleLogs = TELEMETRY_LOGS.filter((log) => latest >= log.progress);
      setCurrentLogs(visibleLogs);
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  // Autoscroll terminal container internally without affecting window scroll
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [currentLogs]);

  // Determine current system phase label
  const getPhaseLabel = (pct: number) => {
    if (pct < 20) return { title: "BOOTING_CORE", color: "text-cyan-400 border-cyan-400/30" };
    if (pct < 40) return { title: "CORE_ACTIVE", color: "text-cyan-300 border-cyan-300/40" };
    if (pct < 60) return { title: "HUD_EXPANSION", color: "text-[#00b2ff] border-[#00b2ff]/40" };
    if (pct < 80) return { title: "DEEP_IMMERSION", color: "text-[#b6f7ff] border-[#b6f7ff]/40 animate-pulse" };
    return { title: "J.A.R.V.I.S_ONLINE", color: "text-cyan-300 border-cyan-300/50" };
  };

  const phase = getPhaseLabel(syncPercent);

  // Animated background scanline sweep
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-30 select-none flex flex-col justify-between p-6">
      
      {/* 1. TOP STATUS PANEL */}
      <div className="hidden md:flex justify-between items-start w-full">
        {/* Left Stats */}
        <div className="flex gap-4">
          <div className="bg-[#02040a]/60 backdrop-blur-[16px] border border-cyan-500/15 px-4 py-3 rounded-sm flex items-center gap-3">
            <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div>
              <p className="text-[10px] text-gray-500 font-mono leading-none">SYSTEM PROFILE</p>
              <h3 className="text-xs font-bold text-white font-mono mt-0.5 tracking-wider">J.A.R.V.I.S v3.5</h3>
            </div>
          </div>

          <div className={`bg-[#02040a]/60 backdrop-blur-[16px] border px-4 py-3 rounded-sm flex items-center gap-3 transition-colors duration-500 ${phase.color}`}>
            <Shield className="w-5 h-5" />
            <div>
              <p className="text-[10px] text-gray-500 font-mono leading-none">SECURITY ENVELOPE</p>
              <h3 className="text-xs font-bold font-mono mt-0.5 tracking-wider">{phase.title}</h3>
            </div>
          </div>

          <div
            className="bg-[#02040a]/60 backdrop-blur-[16px] border px-4 py-3 rounded-sm flex items-center gap-3 transition-colors duration-500"
            style={{ borderColor: `${stateDefinition.visual.primary}55`, color: stateDefinition.visual.primary }}
          >
            <Wifi className="w-5 h-5" />
            <div>
              <p className="text-[10px] text-gray-500 font-mono leading-none">AI STATE</p>
              <h3 className="text-xs font-bold font-mono mt-0.5 tracking-wider">
                {stateDefinition.statusText.toUpperCase()}
              </h3>
            </div>
          </div>
        </div>

        {/* Right Stats */}
        <div className="flex gap-4 items-center">
          <div className="bg-[#02040a]/60 backdrop-blur-[16px] border border-cyan-500/15 px-4 py-3 rounded-sm text-right font-mono">
            <p className="text-[10px] text-gray-500 leading-none">SYNC LEVEL</p>
            <h3 className="text-sm font-bold text-cyan-400 mt-0.5">{syncPercent}%</h3>
          </div>
          <div className="bg-[#02040a]/60 backdrop-blur-[16px] border border-cyan-500/15 px-4 py-3 rounded-sm text-right font-mono">
            <p className="text-[10px] text-gray-500 leading-none">CORE DEPTH</p>
            <h3 className="text-sm font-bold text-[#b6f7ff] mt-0.5">{depth.toLocaleString()}m</h3>
          </div>
        </div>
      </div>

      <div className="md:hidden absolute top-4 left-4 right-4 flex items-center justify-between font-mono text-[9px] tracking-[0.22em] text-cyan-300/80">
        <div className="border border-cyan-500/20 bg-[#02040a]/55 backdrop-blur-[14px] rounded-sm px-3 py-2">
          {phase.title}
        </div>
        <div className="border border-cyan-500/20 bg-[#02040a]/55 backdrop-blur-[14px] rounded-sm px-3 py-2 text-right">
          {currentState}{" // "}SYNC {syncPercent}%
        </div>
      </div>

      {/* 2. SIDEBAR NAVIGATION LADDER */}
      <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col gap-6 font-mono text-[10px] items-end pointer-events-auto z-40">
        {[
          { label: "INITIALIZATION", min: 0, max: 20 },
          { label: "CORE ACTIVATION", min: 20, max: 40 },
          { label: "HUD EXPANSION", min: 40, max: 60 },
          { label: "NEURAL IMMERSION", min: 60, max: 80 },
          { label: "COMM CHAMBER", min: 80, max: 100 },
        ].map((item, idx) => {
          const isActive = syncPercent >= item.min && syncPercent <= item.max;
          const isPassed = syncPercent > item.max;

          return (
            <button
              key={idx}
              onClick={() => onStageClick?.(idx)}
              className="flex items-center gap-3 group cursor-pointer border-none bg-transparent outline-none focus:outline-none p-0"
            >
              <span
                className={`transition-all duration-300 tracking-widest group-hover:text-cyan-300 group-hover:scale-105 ${
                  isActive ? "text-cyan-400 font-bold scale-105" : isPassed ? "text-cyan-700/60" : "text-gray-600"
                }`}
              >
                {item.label}
              </span>
              <div
                className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:border-cyan-400 group-hover:scale-110 ${
                  isActive
                    ? "border-cyan-400 bg-cyan-400/30 scale-125"
                    : isPassed
                    ? "border-cyan-800 bg-cyan-900/40"
                    : "border-gray-700 bg-transparent"
                }`}
              >
                {isActive && (
                  <motion.div
                    className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                    layoutId="activeDot"
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. DIAGNOSTICS TERMINAL PANEL (Bottom Left) */}
      <div className="flex justify-between items-end w-full">
        {/* Terminal Logs Box */}
        <div className="hidden md:flex w-[420px] bg-[#02040a]/60 backdrop-blur-[16px] border border-cyan-500/15 rounded-sm p-4 font-mono text-[11px] leading-relaxed flex-col h-[150px] shadow-[0_0_32px_rgba(0,229,255,0.08)] pointer-events-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <Terminal className="w-3.5 h-3.5" />
              <span className="font-bold tracking-wider text-[10px]">TELEMETRY FEED</span>
            </div>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            </div>
          </div>

          <div 
            ref={terminalContainerRef}
            className="flex-1 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar scroll-smooth"
          >
            {currentLogs.length === 0 ? (
              <p className="text-gray-500 italic">Initiate scroll sequence to sync diagnostics...</p>
            ) : (
              currentLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2.5 text-gray-300">
                  <span className="text-cyan-500/70 font-bold shrink-0">[{log.code}]</span>
                  <span>{log.msg}</span>
                </div>
              ))
            )}
            <div ref={terminalEndRef} />
          </div>
        </div>

        {/* Tactical UI Decals (Bottom Right) */}
        <div className="hidden md:flex flex-col items-end gap-1 text-right font-mono text-[9px] text-gray-600">
          <p>LOC_COORD // LAT: 45.109 // LON: -122.680</p>
          <p>PING // 12ms // SOCKET // SECURE_WSS</p>
          <div className="flex items-center gap-1.5 mt-1 text-[10px] text-cyan-500/50">
            <Wifi className="w-3 h-3 animate-pulse" />
            <span>ENCRYPTED CONNECTION ESTABLISHED</span>
          </div>
        </div>
      </div>

      {/* Screen Effects Elements (Vignette, scanlines, scanning sweep) */}
      <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden">
        {/* Holographic Scanline Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(0, 178, 255, 0.04), rgba(0, 229, 255, 0.02), rgba(182, 247, 255, 0.04))",
            backgroundSize: "100% 4px, 6px 100%",
          }}
        />

        {/* Ambient glow sweep */}
        <div className="absolute w-[200vw] h-[200vh] -top-[50%] -left-[50%] bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.02)_0%,transparent_60%)] animate-pulse" />

        {/* Laser scanline vertical sweep */}
        <motion.div
          className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
          style={{ top: "0%" }}
          animate={{
            y: ["0vh", "100vh"],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
}
