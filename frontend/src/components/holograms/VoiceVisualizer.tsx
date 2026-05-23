"use client";

import React, { useEffect, useState } from "react";
import HolographicPanel from "./HolographicPanel";
import { motion } from "framer-motion";

export default function VoiceVisualizer() {
  const [decibels, setDecibels] = useState(-42);
  const [frequency, setFrequency] = useState(2400);
  const [wavePoints, setWavePoints] = useState<number[]>([15, 12, 18, 30, 45, 10, 8, 22, 35, 20, 12, 14]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate voice fluctuations
      setDecibels(Math.floor(-48 + Math.random() * 20));
      setFrequency(Math.floor(2200 + Math.random() * 600));
      setWavePoints(prev => prev.map(() => Math.floor(5 + Math.random() * 35)));
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // Compute SVG wave path based on wavePoints
  const generatePath = (points: number[]) => {
    if (!points || points.length === 0) {
      return { top: "M 0 50", bottom: "M 0 50" };
    }
    return points.reduce((acc, val, idx) => {
      const x = (idx / (points.length - 1)) * 100;
      const y = 50 - val;
      const yMirror = 50 + val;
      if (idx === 0) {
        return { top: `M 0 ${y}`, bottom: `M 0 ${yMirror}` };
      }
      return {
        top: `${acc.top} L ${x} ${y}`,
        bottom: `${acc.bottom} L ${x} ${yMirror}`,
      };
    }, { top: "", bottom: "" });
  };

  const pathResult = generatePath(wavePoints);

  return (
    <HolographicPanel title="VOICE INTEGRATION FEED" subtitle="AUDIO_COGNITION // VOCAL_SPECTRUM">
      <div className="flex flex-col space-y-4">
        {/* Waveform Visualization Box */}
        <div className="relative w-full h-24 border border-cyan-500/10 rounded bg-[#050816]/20 overflow-hidden flex items-center justify-center">
          {/* Centered waveform grid lines */}
          <div className="absolute w-full h-[0.5px] bg-cyan-500/10" />
          
          <svg className="absolute w-full h-full px-2" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Top Wave */}
            <motion.path 
              d={pathResult.top || "M 0 50"} 
              fill="none" 
              stroke="rgba(0, 229, 255, 0.7)" 
              strokeWidth="1.5"
              animate={{ d: pathResult.top || "M 0 50" }}
              transition={{ duration: 0.15 }}
            />
            {/* Bottom Mirrored Wave */}
            <motion.path 
              d={pathResult.bottom || "M 0 50"} 
              fill="none" 
              stroke="rgba(0, 229, 255, 0.35)" 
              strokeWidth="1"
              animate={{ d: pathResult.bottom || "M 0 50" }}
              transition={{ duration: 0.15 }}
            />
            
            {/* Faint secondary wave for depth */}
            <path 
              d={pathResult.top.replace(/L/g, "L ").split(" ").map(chunk => {
                if (chunk.includes("L") || chunk.includes("M")) return chunk;
                const val = parseFloat(chunk);
                return isNaN(val) ? chunk : (val * 0.7 + 10).toFixed(0);
              }).join(" ")} 
              fill="none" 
              stroke="rgba(0, 178, 255, 0.25)" 
              strokeWidth="0.75" 
            />
          </svg>

          {/* Radial voice pulse visualizer (overlay) */}
          <div className="absolute right-4 top-4 flex items-center justify-center w-8 h-8">
            <motion.div 
              animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
              className="absolute w-full h-full rounded-full border border-cyan-400/40"
            />
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00e5ff]" />
          </div>
        </div>

        {/* Vocal Telemetry */}
        <div className="grid grid-cols-2 gap-2 border-t border-cyan-500/10 pt-2 font-share-mono text-[9px]">
          <div className="flex justify-between items-center bg-[#07111f]/40 border border-cyan-500/10 p-1.5 rounded">
            <span className="text-cyan-500/40">VOCAL_DB</span>
            <span className="text-cyan-300 font-bold glow-text-cyan">{decibels} dB</span>
          </div>

          <div className="flex justify-between items-center bg-[#07111f]/40 border border-cyan-500/10 p-1.5 rounded">
            <span className="text-cyan-500/40">FREQ_HZ</span>
            <span className="text-cyan-300 font-bold glow-text-cyan">{frequency} Hz</span>
          </div>
        </div>
      </div>
    </HolographicPanel>
  );
}
