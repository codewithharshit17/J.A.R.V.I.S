"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate, useSpring, useMotionValue } from "framer-motion";
import ParticleField from "./ParticleField";
import TacticalGrid3D from "./TacticalGrid3D";
import AICoreOrb from "./AICoreOrb";
import SystemHUDOverlay from "./SystemHUDOverlay";
import { ChevronDown, RefreshCw, Eye, Volume2 } from "lucide-react";

// Import Holographic Sub-panels
import Diagnostics from "./holograms/Diagnostics";
import NeuralActivity from "./holograms/NeuralActivity";
import TacticalCoordinates from "./holograms/TacticalCoordinates";
import EnvironmentalScan from "./holograms/EnvironmentalScan";
import QuantumMetrics from "./holograms/QuantumMetrics";
import VoiceVisualizer from "./holograms/VoiceVisualizer";

import InteractionChamber from "./jarvis/InteractionChamber";
import HolographicHud from "./jarvis/HolographicHud";
import { JarvisState } from "./jarvis/JarvisCore";

export default function CinematicScrollEngine() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [bootState, setBootState] = useState<"dark" | "dot" | "line" | "expand" | "ready">("dark");
  const [isCoreEntered, setIsCoreEntered] = useState(false);
  const [hudState, setHudState] = useState<JarvisState>("idle");

  // Track scroll position of the entire runway
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth out scroll value using a spring to avoid mechanical stiffness
  // Higher stiffness & damping = snappier, less lag, no overshoot on release
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    mass: 0.5,
  });

  // 1. Virtual Camera Transformations
  // Stages map to: S1=0-0.2, S2=0.2-0.4, S3=0.4-0.6, S4=0.6-0.8, S5=0.8-1.0
  // Camera zoom: zooms THROUGH the core during Stage 4 (0.60-0.76), then settles in Stage 5
  const cameraScale = useTransform(
    smoothScrollProgress,
    [0,   0.4,  0.60, 0.72, 0.82, 0.9,  1  ],
    [1,   1.04, 1.22, 4.5,  0.92, 0.96, 0.96]
  );

  // Camera offset panning — gentle drift through each stage
  const cameraX = useTransform(
    smoothScrollProgress,
    [0,   0.2,  0.4,  0.60, 0.74, 0.88, 1  ],
    [0,   -18,  26,  -45,   0,    0,    0  ]
  );

  const cameraY = useTransform(
    smoothScrollProgress,
    [0,   0.2,  0.4,  0.60, 0.74, 0.88, 1  ],
    [0,   12,  -12,   26,   0,    0,    0  ]
  );

  // Camera blur — only during the warp-through moment in Stage 4
  const cameraBlur = useTransform(
    smoothScrollProgress,
    [0,   0.60, 0.67, 0.74, 0.82, 1  ],
    [0,   0,    4,    8,    0,    0  ]
  );

  // Mouse tilt offsets (combined for 3D parallax)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfigMouse = { damping: 30, stiffness: 150 };
  const mouseRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfigMouse);
  const mouseRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfigMouse);

  const cameraTransform = useMotionTemplate`translate3d(${cameraX}px, ${cameraY}px, 0) scale(${cameraScale}) rotateX(${mouseRotateX}deg) rotateY(${mouseRotateY}deg)`;
  const cameraFilter = useMotionTemplate`blur(${cameraBlur}px)`;

  // 2. Stage Narrative Text Opacity mappings (Cross-fades)
  // Each stage gets a generous window: fade-in over ~4%, hold for ~12%, fade-out over ~4%
  // S1: 0.00 – 0.20  |  S2: 0.20 – 0.40  |  S3: 0.40 – 0.60  |  S4: 0.60 – 0.80  |  S5: 0.80 – 1.0
  const textOpacity1 = useTransform(smoothScrollProgress, [0,    0.14, 0.21], [1, 1, 0]);
  const textOpacity2 = useTransform(smoothScrollProgress, [0.14, 0.22, 0.36, 0.43], [0, 1, 1, 0]);
  const textOpacity3 = useTransform(smoothScrollProgress, [0.36, 0.44, 0.56, 0.63], [0, 1, 1, 0]);
  const textOpacity4 = useTransform(smoothScrollProgress, [0.56, 0.64, 0.76, 0.83], [0, 1, 1, 0]);
  const textOpacity5 = useTransform(smoothScrollProgress, [0.76, 0.84, 0.94], [0, 1, 1]);

  // Stage vertical shifts (subtle floating)
  const textY = useTransform(
    smoothScrollProgress,
    [0, 1],
    [0, -80] // gentle upward drift as scroll advances
  );

  // Panel Coordinates Transforms (3D Parallax cockpit alignment)
  // Stage pacing: S1=0-0.2, S2=0.2-0.4, S3=0.4-0.6, S4=0.6-0.8, S5=0.8-1.0

  // 1. Diagnostics Panel — LEFT UPPER — visible in S1+S2, pulls away for S3/S4, returns in S5
  const diagX = useTransform(smoothScrollProgress, [0, 0.22, 0.42, 0.82, 1.0], [-380, -320, -80,  -420, -420]);
  const diagY = useTransform(smoothScrollProgress, [0, 0.22, 0.42, 0.82, 1.0], [-200, -200, -200, -220, -220]);
  const diagZ = useTransform(smoothScrollProgress, [0, 0.22, 0.42, 0.82, 1.0], [0,    180,  650,  -80,  -80]);
  const diagOpacity = useTransform(smoothScrollProgress,  [0,    0.22, 0.40, 0.78, 0.88], [0.95, 0.95, 0.0, 0.0, 0.95]);

  // 2. Neural Activity Panel — LEFT LOWER — same timing as diag, different Y
  const neuralX = useTransform(smoothScrollProgress, [0, 0.22, 0.42, 0.82, 1.0], [-380, -320, -80,  -420, -420]);
  const neuralY = useTransform(smoothScrollProgress, [0, 0.22, 0.42, 0.82, 1.0], [170,  170,  170,  115,  115]);
  const neuralZ = useTransform(smoothScrollProgress, [0, 0.22, 0.42, 0.82, 1.0], [0,    180,  650,  -80,  -80]);
  const neuralOpacity = useTransform(smoothScrollProgress, [0,    0.22, 0.40, 0.78, 0.88], [0.95, 0.95, 0.0, 0.0, 0.95]);

  // 3. Tactical Coordinates Panel — RIGHT UPPER — fades in during S2, exits by S4, returns in S5
  const coordsX = useTransform(smoothScrollProgress, [0, 0.22, 0.44, 0.82, 1.0], [310, 400, 430,  95,   430]);
  const coordsY = useTransform(smoothScrollProgress, [0, 0.22, 0.44, 0.82, 1.0], [-200,-200,-200,-200, -220]);
  const coordsZ = useTransform(smoothScrollProgress, [0, 0.22, 0.44, 0.82, 1.0], [-480,-90,  180,  650, -80]);
  const coordsOpacity = useTransform(smoothScrollProgress, [0, 0.18, 0.22, 0.42, 0.78, 0.88], [0.0, 0.0, 0.95, 0.95, 0.0, 0.95]);

  // 4. Environmental Scan Panel — RIGHT LOWER — same timing as coords
  const scanX = useTransform(smoothScrollProgress, [0, 0.22, 0.44, 0.82, 1.0], [310, 400, 430,  95,   430]);
  const scanY = useTransform(smoothScrollProgress, [0, 0.22, 0.44, 0.82, 1.0], [170, 170, 170,  170,  115]);
  const scanZ = useTransform(smoothScrollProgress, [0, 0.22, 0.44, 0.82, 1.0], [-480,-90,  180,  650, -80]);
  const scanOpacity = useTransform(smoothScrollProgress,  [0, 0.18, 0.22, 0.42, 0.78, 0.88], [0.0, 0.0, 0.95, 0.95, 0.0, 0.95]);

  // 5. Quantum Metrics Panel — BOTTOM LEFT — emerges in S3, stays through S5
  const quantumX = useTransform(smoothScrollProgress, [0, 0.42, 0.60, 0.82, 1.0], [-90, -190, -310, -310, -310]);
  const quantumY = useTransform(smoothScrollProgress, [0, 0.42, 0.60, 0.82, 1.0], [290, 290,  255,  255,  255]);
  const quantumZ = useTransform(smoothScrollProgress, [0, 0.42, 0.60, 0.82, 1.0], [-800,-480, -130, -40,  -40]);
  const quantumOpacity = useTransform(smoothScrollProgress, [0, 0.38, 0.50, 0.60, 1.0], [0.0, 0.0, 0.95, 0.95, 0.95]);

  // 6. Voice Frequency Visualizer — BOTTOM RIGHT — emerges in S3, stays through S5
  const voiceX = useTransform(smoothScrollProgress, [0, 0.42, 0.60, 0.82, 1.0], [90,  190,  310,  310,  310]);
  const voiceY = useTransform(smoothScrollProgress, [0, 0.42, 0.60, 0.82, 1.0], [290, 290,  255,  255,  255]);
  const voiceZ = useTransform(smoothScrollProgress, [0, 0.42, 0.60, 0.82, 1.0], [-800,-480, -130, -40,  -40]);
  const voiceOpacity = useTransform(smoothScrollProgress, [0, 0.38, 0.50, 0.60, 1.0], [0.0, 0.0, 0.95, 0.95, 0.95]);

  // Scene 5 interactive panel (bottom-right action panel)
  const panelOpacity = useTransform(smoothScrollProgress, [0.80, 0.88, 1], [0, 1, 1]);
  const panelScale   = useTransform(smoothScrollProgress, [0.80, 0.88, 1], [0.94, 1, 1]);

  // Scroll helper hint fades out as soon as user starts scrolling
  const helperOpacity = useTransform(smoothScrollProgress, [0, 0.10], [1, 0]);

  // Wakeup cinematic sequence
  useEffect(() => {
    const timer1 = setTimeout(() => setBootState("dot"), 1200);
    const timer2 = setTimeout(() => setBootState("line"), 2200);
    const timer3 = setTimeout(() => setBootState("expand"), 2900);
    const timer4 = setTimeout(() => setBootState("ready"), 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  // Lock scrolling during boot sequence or when core is entered
  useEffect(() => {
    if (bootState !== "ready" || isCoreEntered) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [bootState, isCoreEntered]);

  // Force scroll to top ONLY once on mount to ensure cinematic starts at the beginning
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // Scroll back to top handler for Scene 5 reset
  const handleReset = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    mouseX.set(e.clientX / width - 0.5);
    mouseY.set(e.clientY / height - 0.5);
  };

  return (
    <div 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="relative w-full h-[700vh] bg-[#02040a]"
    >
      {/* Pinned Cinematic Viewport */}
      <div 
        className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center"
        style={{ perspective: "1000px" }}
      >
        {/* Persistent environmental cinema layers */}
        <div className="atmospheric-fog" />
        <div className="cursor-glow-layer" />
        <div className="hologram-grid" />
        <div className="data-stream" />
        <div className="energy-pulse" />
        <div className="energy-pulse" style={{ animationDelay: "4s" }} />
        <div className="scanning-laser" />
        <div className="holo-noise" />
        <div className="chromatic-edge" />
        <div className="depth-blur-edge" />
        <div className="vignette" />
        <div className="scanlines" />
        <motion.div
          className="absolute inset-0 z-[4] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at calc(var(--glow-nx) * 100%) calc(var(--glow-ny) * 100%), rgba(0, 229, 255, 0.08), transparent 24%), linear-gradient(120deg, rgba(0,178,255,0.04), transparent 45%, rgba(182,247,255,0.025))",
          }}
          animate={{ opacity: [0.45, 0.75, 0.45] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Full-Screen HUD Overlay */}
        {bootState === "ready" && !isCoreEntered && (
          <SystemHUDOverlay scrollYProgress={smoothScrollProgress} />
        )}

        {/* Cinematic Camera Frame Container */}
        {bootState === "ready" && (
          <motion.div
            className="absolute inset-0 w-full h-full flex items-center justify-center"
            style={{
              transform: cameraTransform,
              filter: cameraFilter,
              transformStyle: "preserve-3d",
            }}
          >
            {/* 3D Grid */}
            <TacticalGrid3D scrollYProgress={smoothScrollProgress} />

            {/* Particles */}
            <ParticleField />

            {/* AI Energy Core */}
            {!isCoreEntered && (
              <AICoreOrb scrollYProgress={smoothScrollProgress} />
            )}

            {/* ================= 3D HOLOGRAPHIC FLOATING HUD SUB-PANELS ================= */}
            {!isCoreEntered && (
              <>
                {/* Panel 1: Diagnostics Panel */}
                <motion.div
                  className="jarvis-floating-panel"
                  style={{
                    x: diagX,
                    y: diagY,
                    z: diagZ,
                    opacity: diagOpacity,
                    position: "absolute",
                    transformStyle: "preserve-3d",
                    width: "290px",
                  }}
                >
                  <Diagnostics />
                </motion.div>

                {/* Panel 2: Neural Activity Monitor */}
                <motion.div
                  className="jarvis-floating-panel"
                  style={{
                    x: neuralX,
                    y: neuralY,
                    z: neuralZ,
                    opacity: neuralOpacity,
                    position: "absolute",
                    transformStyle: "preserve-3d",
                    width: "290px",
                  }}
                >
                  <NeuralActivity />
                </motion.div>

                {/* Panel 3: Tactical Coordinate Display */}
                <motion.div
                  className="jarvis-floating-panel"
                  style={{
                    x: coordsX,
                    y: coordsY,
                    z: coordsZ,
                    opacity: coordsOpacity,
                    position: "absolute",
                    transformStyle: "preserve-3d",
                    width: "290px",
                  }}
                >
                  <TacticalCoordinates />
                </motion.div>

                {/* Panel 4: Environmental Scan Radar */}
                <motion.div
                  className="jarvis-floating-panel"
                  style={{
                    x: scanX,
                    y: scanY,
                    z: scanZ,
                    opacity: scanOpacity,
                    position: "absolute",
                    transformStyle: "preserve-3d",
                    width: "290px",
                  }}
                >
                  <EnvironmentalScan />
                </motion.div>

                {/* Panel 5: Quantum Processing Metrics */}
                <motion.div
                  className="jarvis-floating-panel"
                  style={{
                    x: quantumX,
                    y: quantumY,
                    z: quantumZ,
                    opacity: quantumOpacity,
                    position: "absolute",
                    transformStyle: "preserve-3d",
                    width: "290px",
                  }}
                >
                  <QuantumMetrics />
                </motion.div>

                {/* Panel 6: Voice Frequency Visualizer */}
                <motion.div
                  className="jarvis-floating-panel"
                  style={{
                    x: voiceX,
                    y: voiceY,
                    z: voiceZ,
                    opacity: voiceOpacity,
                    position: "absolute",
                    transformStyle: "preserve-3d",
                    width: "290px",
                  }}
                >
                  <VoiceVisualizer />
                </motion.div>
              </>
            )}
          </motion.div>
        )}

        {/* 3. SCENE STORYTELLING TEXT OVERLAY (Left Side) */}
        {bootState === "ready" && !isCoreEntered && (
          <div className="absolute left-5 right-5 md:right-auto md:left-16 top-[28%] md:top-[40%] -translate-y-1/2 max-w-[340px] md:w-[420px] pointer-events-none z-20">
            
            {/* Stage 1: Dark System Initialization */}
            <motion.div
              style={{ opacity: textOpacity1, y: textY }}
              className="absolute inset-x-0"
            >
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-[11px] tracking-[0.2em] font-bold">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                STAGE 01 // SYSTEM INITIALIZATION
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-3 leading-tight uppercase font-sans">
                Dark System <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Initialization
                </span>
              </h2>
              <p className="text-sm text-gray-400 font-sans leading-relaxed mt-4">
                J.A.R.V.I.S is starting diagnostics. Establishing primary data conduits, aligning core quantum matrices, and testing network grid interfaces.
              </p>
              <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                <ChevronDown className="w-4 h-4 animate-bounce" />
                SCROLL DOWN TO INITIALIZE QUANTUM CORE
              </div>
            </motion.div>

            {/* Stage 2: AI Core Activation */}
            <motion.div
              style={{ opacity: textOpacity2, y: textY }}
              className="absolute inset-x-0"
            >
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-[11px] tracking-[0.2em] font-bold">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                STAGE 02 // CORE CONVERGENCE
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-3 leading-tight uppercase font-sans">
                AI Core <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Activation
                </span>
              </h2>
              <p className="text-sm text-gray-400 font-sans leading-relaxed mt-4">
                Quantum particles converge. Floating nodes gather at the center center coordinates, and the electromagnetic containment field begins forming.
              </p>
            </motion.div>

            {/* Stage 3: Holographic System Expansion */}
            <motion.div
              style={{ opacity: textOpacity3, y: textY }}
              className="absolute inset-x-0"
            >
              <div className="flex items-center gap-2 text-blue-400 font-mono text-[11px] tracking-[0.2em] font-bold">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                STAGE 03 // HUD SYNC
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-3 leading-tight uppercase font-sans">
                Holographic <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
                  Expansion
                </span>
              </h2>
              <p className="text-sm text-gray-400 font-sans leading-relaxed mt-4">
                Secondary telemetry systems deploy. Rotating orbital HUD rings map physical depth levels, scanning lines sweep coordinates, and telemetry lights up the frame.
              </p>
            </motion.div>

            {/* Stage 4: Deep AI Immersion */}
            <motion.div
              style={{ opacity: textOpacity4, y: textY }}
              className="absolute inset-x-0"
            >
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-[11px] tracking-[0.2em] font-bold">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                STAGE 04 // NEURAL PENETRATION
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-3 leading-tight uppercase font-sans">
                Deep Neural <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Immersion
                </span>
              </h2>
              <p className="text-sm text-gray-400 font-sans leading-relaxed mt-4">
                Camera scale exceeds D-9 threshold. Traversing inside the core matrix, grid elements fly past the camera, entering the neural AI subconscious chamber.
              </p>
            </motion.div>

            {/* Stage 5: Awakened J.A.R.V.I.S Communication Chamber */}
            <motion.div
              style={{ opacity: textOpacity5, y: textY }}
              className="absolute inset-x-0"
            >
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-[11px] tracking-[0.2em] font-bold">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                STAGE 05 // SYSTEM AWAKENED
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-3 leading-tight uppercase font-sans">
                COGNITIVE <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
                  CHAMBER ONLINE
                </span>
              </h2>
              <p className="text-sm text-gray-400 font-sans leading-relaxed mt-4">
                J.A.R.V.I.S has stabilized. All systems are fully coordinated, synchronized, and ready to respond. Interactive command console is now operational.
              </p>
            </motion.div>

          </div>
        )}

        {/* 4. SCENE 5 AWAKENED INTERFACE PANEL (Right/Center bottom) */}
        {bootState === "ready" && !isCoreEntered && (
          <motion.div
            className="absolute bottom-24 md:bottom-12 left-5 right-5 md:left-auto md:right-16 md:w-[400px] z-40 pointer-events-auto"
            style={{
              opacity: panelOpacity,
              scale: panelScale,
            }}
          >
            <div className="bg-[#02040a]/55 backdrop-blur-[18px] border border-cyan-500/25 rounded-sm p-4 md:p-5 shadow-[0_0_40px_rgba(0,229,255,0.12)] flex flex-col gap-4">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Volume2 className="w-4 h-4" />
                  <span className="font-mono text-xs font-bold tracking-wider">COGNITIVE INTERFACE</span>
                </div>
                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded font-mono font-bold glow-text-cyan">
                  READY
                </span>
              </div>

              {/* Simulated Voice Pattern Waves */}
              <div className="h-10 w-full flex items-center justify-between px-2 bg-black/40 border border-white/5 rounded-md">
                {[...Array(24)].map((_, idx) => (
                  <motion.div
                    key={idx}
                    className="w-1 bg-gradient-to-t from-blue-500 via-cyan-400 to-transparent rounded"
                    animate={{
                      height: [
                        "15%",
                        idx % 3 === 0 ? "80%" : idx % 2 === 0 ? "40%" : "25%",
                        "15%"
                      ]
                    }}
                    transition={{
                      duration: 1.2 + (idx % 5) * 0.12,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: idx * 0.05
                    }}
                  />
                ))}
              </div>

              {/* Futuristic action button */}
              <button 
                onClick={() => setIsCoreEntered(true)}
                className="relative w-full py-3 bg-gradient-to-r from-cyan-500/20 to-[#00b2ff]/20 hover:from-cyan-500/30 hover:to-[#00b2ff]/30 border border-cyan-500/50 hover:border-cyan-400 rounded-sm font-mono text-xs text-cyan-400 hover:text-white tracking-widest uppercase transition-all duration-300 shadow-[0_0_15px_rgba(0,229,255,0.15)] flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Eye className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                ENTER CORE SYSTEM
              </button>

              {/* Restart scroll path */}
              <button
                onClick={handleReset}
                className="w-full py-2 bg-transparent hover:bg-white/5 border border-white/10 rounded-sm font-mono text-[10px] text-[#b6f7ff]/55 hover:text-white tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin-reverse-slow" />
                REBOOT CINEMATIC RUN
              </button>
              
            </div>
          </motion.div>
        )}

        {/* Ambient bottom scroll helper (disappears as you scroll) */}
        {bootState === "ready" && !isCoreEntered && (
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 font-mono text-[9px] text-gray-500 pointer-events-none"
            style={{
              opacity: helperOpacity,
            }}
          >
            <span>CINEMATIC NAV ACTIVE</span>
            <motion.div
              className="w-1.5 h-4 border border-gray-500 rounded-full flex justify-center p-0.5"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-0.5 h-1 bg-gray-500 rounded-full" />
            </motion.div>
          </motion.div>
        )}

        {/* ================= CINEMATIC BOOT SEQUENCE LAYER ================= */}
        <AnimatePresence>
          {bootState !== "ready" && (
            <div className="absolute inset-0 flex items-center justify-center z-50 bg-[#02040a]">
              {bootState === "dot" && (
                <motion.div 
                  className="w-2.5 h-2.5 bg-[#00e5ff] rounded-full shadow-[0_0_15px_#00e5ff]"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 2.5, 1], opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                />
              )}

              {bootState === "line" && (
                <motion.div 
                  className="h-[1.5px] bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "80%", opacity: 1 }}
                  exit={{ width: "100%", opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                />
              )}

              {bootState === "expand" && (
                <motion.div 
                  className="w-full h-full flex flex-col justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="w-full h-[1px] bg-[#00e5ff]/45 shadow-[0_0_6px_#00e5ff]" />
                  <div className="text-center self-center text-cyan-400 text-xs tracking-[0.6em] font-orbitron animate-pulse">
                    J.A.R.V.I.S. SYSTEM INITIALIZING...
                  </div>
                  <div className="w-full h-[1px] bg-[#00e5ff]/45 shadow-[0_0_6px_#00e5ff]" />
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>

        {/* ================= ACTIVE INTERACTIVE CONSCIOUSNESS STATE ================= */}
        {bootState === "ready" && isCoreEntered && (
          <>
            {/* Immersive AI Interaction Chamber (takes over the screen) */}
            <InteractionChamber onStateChange={setHudState} immediate={true} />

            {/* Holographic HUD dashboard panels */}
            <HolographicHud state={hudState} scrollProgress={0} />

            {/* Floating Exit Button to return to scroll story */}
            <motion.button
              onClick={() => setIsCoreEntered(false)}
              className="fixed top-6 right-6 z-50 pointer-events-auto p-2 px-3 bg-black/60 hover:bg-white/5 border border-cyan-500/30 hover:border-cyan-400 rounded font-mono text-[9px] text-cyan-400 hover:text-white tracking-wider flex items-center gap-1.5 transition-all duration-300 cursor-pointer shadow-[0_0_10px_rgba(0,229,255,0.15)]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              EXIT CONSCIOUSNESS CORE
            </motion.button>
          </>
        )}

      </div>
    </div>
  );
}
