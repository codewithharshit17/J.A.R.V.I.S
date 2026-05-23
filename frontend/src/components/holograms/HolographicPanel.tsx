"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { glassClass } from "@/lib/glassmorphism";
import { SPRING_CONFIG, DURATION } from "@/lib/motionConstants";

interface HolographicPanelProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
  glassPreset?: "subtle" | "standard" | "heavy" | "ultra" | "neonEdge" | "minimal";
  animateGlow?: boolean;
  interactive?: boolean;
}

export default function HolographicPanel({
  children,
  title,
  subtitle = "SYS.STAT // SECURE",
  className = "",
  glassPreset = "standard",
  animateGlow = true,
  interactive = true,
}: HolographicPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for mouse coordinates (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Map mouse positions to 3D rotations (max 12deg tilt)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), SPRING_CONFIG.interactive);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), SPRING_CONFIG.interactive);

  // Map mouse position to glow spot position
  const glowX = useSpring(useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]), SPRING_CONFIG.interactive);
  const glowY = useSpring(useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]), SPRING_CONFIG.interactive);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative position from center: -0.5 to 0.5
    const relX = (e.clientX - rect.left) / width - 0.5;
    const relY = (e.clientY - rect.top) / height - 0.5;
    
    mouseX.set(relX);
    mouseY.set(relY);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: interactive ? rotateX : 0,
        rotateY: interactive ? rotateY : 0,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      whileHover={interactive ? {
        scale: 1.02,
        transition: { duration: 0.3, ...SPRING_CONFIG.hover }
      } : {}}
      animate={animateGlow ? {
        boxShadow: [
          "0 0 20px rgba(0, 229, 255, 0.25), inset 0 0 15px rgba(0, 229, 255, 0.12)",
          "0 0 40px rgba(0, 229, 255, 0.45), inset 0 0 25px rgba(0, 229, 255, 0.2)",
          "0 0 20px rgba(0, 229, 255, 0.25), inset 0 0 15px rgba(0, 229, 255, 0.12)",
        ]
      } : {}}
      transition={animateGlow ? { duration: DURATION.breathe, repeat: Infinity, ease: "easeInOut" } : {}}
      className={`relative p-5 rounded pointer-events-auto select-none transition-shadow duration-300 ${glassClass(glassPreset)} ${className}`}
    >
      {/* 3D Inner Layer for Depth separation */}
      <div style={{ transform: "translateZ(25px)" }} className="relative z-10 w-full h-full flex flex-col">
        {/* Panel Header */}
        <div className="flex justify-between items-center border-b border-cyan-500/15 pb-2 mb-3">
          <div className="flex flex-col">
            <h3 className="text-xs font-orbitron font-bold tracking-[0.2em] text-[#00e5ff] glow-text-cyan uppercase">
              {title}
            </h3>
            <span className="text-[7.5px] font-share-mono text-cyan-400/40 tracking-wider">
              {subtitle}
            </span>
          </div>
          {/* Decorative blinker dot */}
          <div className="flex items-center space-x-1">
            <span className="w-1 h-1 bg-[#00e5ff]/50 rounded-full" />
            <motion.span 
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: DURATION.pulse, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-[#00e5ff] rounded-full shadow-[0_0_4px_#00e5ff]" 
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 w-full text-xs font-rajdhani text-gray-300">
          {children}
        </div>
        
        {/* Panel Footer / Decorative lines */}
        <div className="mt-3 pt-1.5 flex justify-between items-center text-[7px] text-cyan-500/30 font-share-mono border-t border-cyan-500/10">
          <span>STARK.OS.V2.4</span>
          <div className="flex space-x-0.5">
            <span className="w-1 h-1 bg-cyan-500/30" />
            <span className="w-2 h-1 bg-cyan-500/20" />
            <span className="w-4 h-1 bg-cyan-500/10" />
          </div>
        </div>
      </div>

      {/* Interactive hover spotlight layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([x, y]) => `radial-gradient(120px circle at ${x} ${y}, rgba(0, 229, 255, 0.08), transparent 80%)`
          ),
        }}
      />

      {/* Decorative Sci-fi Corner Brackets */}
      {/* Top Left Bracket */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-[1.5px] border-l-[1.5px] border-[#00e5ff]/70" />
      <div className="absolute top-0 left-0 w-[1px] h-4 bg-[#00e5ff]/20" />
      <div className="absolute top-0 left-0 w-4 h-[1px] bg-[#00e5ff]/20" />

      {/* Top Right Bracket */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t-[1.5px] border-r-[1.5px] border-[#00e5ff]/70" />
      <div className="absolute top-0 right-0 w-[1px] h-4 bg-[#00e5ff]/20" />
      <div className="absolute top-0 right-0 w-4 h-[1px] bg-[#00e5ff]/20" />

      {/* Bottom Left Bracket */}
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-[1.5px] border-l-[1.5px] border-[#00e5ff]/70" />
      <div className="absolute bottom-0 left-0 w-[1px] h-4 bg-[#00e5ff]/20" />
      <div className="absolute bottom-0 left-0 w-4 h-[1px] bg-[#00e5ff]/20" />

      {/* Bottom Right Bracket */}
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-[1.5px] border-r-[1.5px] border-[#00e5ff]/70" />
      <div className="absolute bottom-0 right-0 w-[1px] h-4 bg-[#00e5ff]/20" />
      <div className="absolute bottom-0 right-0 w-4 h-[1px] bg-[#00e5ff]/20" />

      {/* Diagonal grid notch design in background */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-8 bg-[#00e5ff]/20" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-8 bg-[#00e5ff]/20" />
    </motion.div>
  );
}
