"use client";

import React, { useEffect, useState } from "react";
import HolographicPanel from "./HolographicPanel";
import { motion } from "framer-motion";

export default function EnvironmentalScan() {
  const [distance, setDistance] = useState(142.8);
  const [threatCount, setThreatCount] = useState(0);
  const [scanSector, setScanSector] = useState("SEC_DELTA");
  const [radarTargets, setRadarTargets] = useState<Array<{ x: number; y: number; r: number; id: string }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDistance(+(120 + Math.random() * 50).toFixed(1));
      setThreatCount(Math.random() > 0.85 ? 1 : 0);
      
      const sectors = ["SEC_ALPHA", "SEC_BETA", "SEC_GAMMA", "SEC_DELTA", "SEC_EPSILON"];
      setScanSector(sectors[Math.floor(Math.random() * sectors.length)]);

      // Randomly populate targets in radar coordinate system
      const targets = [];
      const count = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < count; i++) {
        targets.push({
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 60,
          r: 2 + Math.random() * 3,
          id: `T-${Math.floor(100 + Math.random() * 900)}`,
        });
      }
      setRadarTargets(targets);
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  return (
    <HolographicPanel title="ENVIRONMENTAL SCAN" subtitle="RADAR_SWEEP // SENSOR_ARRAY">
      <div className="flex flex-col space-y-3.5">
        {/* Radar Scanner Layout */}
        <div className="relative w-full h-32 flex items-center justify-center border border-cyan-500/10 rounded bg-[#02040a]/20 overflow-hidden">
          {/* Concentric rings */}
          <div className="absolute w-28 h-28 border border-cyan-500/10 rounded-full" />
          <div className="absolute w-20 h-20 border border-cyan-500/10 rounded-full" />
          <div className="absolute w-12 h-12 border border-cyan-500/10 rounded-full" />
          
          {/* Radar Sweep overlay bar (rotating) */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute w-28 h-28 rounded-full origin-center pointer-events-none"
            style={{
              background: "conic-gradient(from 0deg, rgba(0, 229, 255, 0.15) 0deg, rgba(0, 229, 255, 0.08) 60deg, transparent 180deg)",
            }}
          />

          {/* Targets inside radar (framer-motion nodes) */}
          <svg className="absolute w-28 h-28" viewBox="0 0 100 100">
            {radarTargets.map((target, idx) => (
              <g key={target.id}>
                {/* Target Dot */}
                <motion.circle 
                  cx={target.x} 
                  cy={target.y} 
                  r={target.r} 
                  fill={threatCount > 0 && idx === 0 ? "#b6f7ff" : "#00e5ff"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.4, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                {/* Ping ring */}
                <motion.circle 
                  cx={target.x} 
                  cy={target.y} 
                  r={target.r * 2.5} 
                  fill="none" 
                  stroke={threatCount > 0 && idx === 0 ? "rgba(182, 247, 255, 0.3)" : "rgba(0, 229, 255, 0.3)"} 
                  strokeWidth="0.5"
                  animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                {/* Target label ID */}
                <text x={target.x + target.r + 2} y={target.y + 2} fill="rgba(0, 229, 255, 0.5)" fontSize="4.5" fontFamily="monospace">
                  {target.id}
                </text>
              </g>
            ))}
          </svg>

          {/* Radar details */}
          <div className="absolute top-2 left-2 text-[6.5px] text-cyan-400/40 font-share-mono">SWEEPING: ACTIVE</div>
          <div className="absolute bottom-2 right-2 text-[6.5px] text-[#00e5ff]/50 font-share-mono">{scanSector}</div>
        </div>

        {/* Scan Telemetry */}
        <div className="grid grid-cols-2 gap-2 border-t border-cyan-500/10 pt-2.5 font-share-mono text-[9px]">
          <div className="flex justify-between items-center bg-[#02040a]/40 border border-cyan-500/10 p-1.5 rounded">
            <span className="text-cyan-500/40">PROXIMITY</span>
            <span className="text-cyan-300 font-semibold">{distance}m</span>
          </div>

          <div className={`flex justify-between items-center bg-[#02040a]/40 border p-1.5 rounded ${threatCount > 0 ? "border-white/25 bg-white/5 text-white" : "border-cyan-500/10 text-cyan-300"}`}>
            <span className={threatCount > 0 ? "text-white/50" : "text-cyan-500/40"}>OBJECTS</span>
            <span className="font-bold glow-text-cyan">{radarTargets.length} DETECTED</span>
          </div>
        </div>
      </div>
    </HolographicPanel>
  );
}
