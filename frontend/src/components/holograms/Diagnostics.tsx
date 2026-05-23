"use client";

import React, { useEffect, useState } from "react";
import HolographicPanel from "./HolographicPanel";
import { motion } from "framer-motion";
import { DURATION } from "@/lib/motionConstants";

export default function Diagnostics() {
  const [telemetry, setTelemetry] = useState({
    cpu1: 45,
    cpu2: 32,
    cpu3: 78,
    ram: 62.4,
    temp: 36.8,
    networkStatus: "SYNCHRONIZED",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(() => ({
        cpu1: Math.max(10, Math.min(95, 45 + (Math.random() - 0.5) * 30)),
        cpu2: Math.max(10, Math.min(95, 32 + (Math.random() - 0.5) * 30)),
        cpu3: Math.max(10, Math.min(95, 78 + (Math.random() - 0.5) * 20)),
        ram: Math.max(30, Math.min(85, 62.4 + (Math.random() - 0.5) * 8)),
        temp: Math.max(30, Math.min(75, 36.8 + (Math.random() - 0.5) * 5)),
        networkStatus: Math.random() > 0.95 ? "CALIBRATING" : "SYNCHRONIZED",
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <HolographicPanel 
      title="A.I. SYSTEM DIAGNOSTICS" 
      subtitle="CORE_SYSTEM_METRICS // CORE.V8"
      glassPreset="standard"
      animateGlow={true}
      interactive={true}
    >
      <div className="flex flex-col space-y-3.5">
        {/* Core Stats Progress Bars */}
        <div className="space-y-2">
          {/* CPU 1 */}
          <div className="space-y-1">
            <div className="flex justify-between text-[8px] tracking-widest text-cyan-400/70 font-share-mono">
              <span>CPU_CORE_01</span>
              <span>{telemetry.cpu1.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 w-full bg-cyan-950/40 border border-cyan-500/10 rounded-sm overflow-hidden p-[1px]">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-400 to-cyan-300 shadow-[0_0_8px_#00e5ff] rounded-sm"
                style={{ width: `${telemetry.cpu1}%` }}
                animate={{ width: `${telemetry.cpu1}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* CPU 2 */}
          <div className="space-y-1">
            <div className="flex justify-between text-[8px] tracking-widest text-cyan-400/70 font-share-mono">
              <span>CPU_CORE_02</span>
              <span>{telemetry.cpu2.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 w-full bg-cyan-950/40 border border-cyan-500/10 rounded-sm overflow-hidden p-[1px]">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#00b2ff] to-[#0088dd] shadow-[0_0_8px_#00b2ff] rounded-sm"
                style={{ width: `${telemetry.cpu2}%` }}
                animate={{ width: `${telemetry.cpu2}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* CPU 3 */}
          <div className="space-y-1">
            <div className="flex justify-between text-[8px] tracking-widest text-[#b6f7ff]/80 font-share-mono">
              <span>QUANTUM_CORE_03</span>
              <span>{telemetry.cpu3.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 w-full bg-cyan-950/45 border border-cyan-500/15 rounded-sm overflow-hidden p-[1px]">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#b6f7ff] to-[#88d4ff] shadow-[0_0_8px_#b6f7ff] rounded-sm"
                style={{ width: `${telemetry.cpu3}%` }}
                animate={{ width: `${telemetry.cpu3}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Diagnostic grid of numeric status values */}
        <div className="grid grid-cols-2 gap-2 border-t border-cyan-500/10 pt-2.5 font-share-mono text-[9px]">
          <motion.div 
            className="flex justify-between items-center bg-[#07111f]/40 border border-cyan-500/10 p-1.5 rounded"
            animate={{
              boxShadow: [
                "0 0 10px rgba(0, 229, 255, 0.1)",
                "0 0 15px rgba(0, 229, 255, 0.2)",
                "0 0 10px rgba(0, 229, 255, 0.1)",
              ]
            }}
            transition={{ duration: DURATION.glow, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-cyan-500/40">SYS_TEMP</span>
            <span className={`font-semibold ${telemetry.temp > 50 ? "text-[#b6f7ff] glow-text-cyan animate-pulse" : "text-cyan-300 glow-text-cyan"}`}>
              {telemetry.temp.toFixed(1)} C
            </span>
          </motion.div>

          <motion.div 
            className="flex justify-between items-center bg-[#07111f]/40 border border-cyan-500/10 p-1.5 rounded"
            animate={{
              boxShadow: [
                "0 0 10px rgba(0, 229, 255, 0.1)",
                "0 0 15px rgba(0, 229, 255, 0.2)",
                "0 0 10px rgba(0, 229, 255, 0.1)",
              ]
            }}
            transition={{ duration: DURATION.glow, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          >
            <span className="text-cyan-500/40">RAM_USED</span>
            <span className="text-cyan-300 font-semibold glow-text-cyan">{telemetry.ram.toFixed(1)} GB</span>
          </motion.div>

          <motion.div 
            className="col-span-2 flex justify-between items-center bg-[#07111f]/40 border border-cyan-500/10 p-1.5 rounded"
            animate={{
              boxShadow: [
                "0 0 10px rgba(0, 229, 255, 0.1)",
                "0 0 15px rgba(0, 229, 255, 0.2)",
                "0 0 10px rgba(0, 229, 255, 0.1)",
              ]
            }}
            transition={{ duration: DURATION.glow, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          >
            <span className="text-cyan-500/40">NET_STATUS</span>
            <span className={`font-bold tracking-widest ${telemetry.networkStatus === "SYNCHRONIZED" ? "text-cyan-300" : "text-[#00b2ff] animate-pulse"}`}>
              {telemetry.networkStatus}
            </span>
          </motion.div>
        </div>

        {/* Hex sector decrypt visualization */}
        <div className="flex items-center space-x-2 border-t border-cyan-500/10 pt-2 text-[8px] font-share-mono text-[#00e5ff]/50">
          <motion.span 
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: DURATION.pulse, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_4px_#00e5ff]" 
          />
          <span className="tracking-wider uppercase">DECRYPTING PACKETS // SECTOR_F3</span>
        </div>
      </div>
    </HolographicPanel>
  );
}
