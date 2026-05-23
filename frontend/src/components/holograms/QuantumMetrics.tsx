"use client";

import React, { useEffect, useState } from "react";
import HolographicPanel from "./HolographicPanel";
import { motion } from "framer-motion";

export default function QuantumMetrics() {
  const [coherence, setCoherence] = useState(99.987);
  const [qubits, setQubits] = useState<number[]>([80, 60, 45, 90, 30, 70, 50, 85]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoherence(+(99.98 + Math.random() * 0.019).toFixed(5));
      setQubits(prev => prev.map(() => Math.floor(20 + Math.random() * 75)));
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <HolographicPanel title="QUANTUM METRICS" subtitle="COMPUTATIONAL_COHERENCE // QUBITS.X">
      <div className="flex flex-col space-y-4">
        {/* Qubit State Visualization Bars */}
        <div className="h-28 w-full border border-cyan-500/10 rounded bg-[#02040a]/20 flex justify-between items-end p-2.5 space-x-1.5 relative overflow-hidden">
          {qubits.map((val, idx) => (
            <div key={idx} className="flex-1 h-full flex flex-col justify-end items-center">
              <span className="text-[6.5px] text-cyan-400/40 font-share-mono mb-1">{val}</span>
              <div className="w-full bg-cyan-950/30 border border-cyan-500/5 rounded-t-sm h-full flex items-end">
                <motion.div 
                  className="w-full bg-gradient-to-t from-[#00b2ff] to-[#00e5ff] rounded-t-sm shadow-[0_0_8px_rgba(0,229,255,0.4)]"
                  style={{ height: `${val}%` }}
                  animate={{ height: `${val}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                />
              </div>
              <span className="text-[6px] text-cyan-400/30 font-share-mono mt-1">Q{idx}</span>
            </div>
          ))}
          
          {/* Subtle grid ticks on the left of chart */}
          <div className="absolute left-1 top-2 bottom-2 w-[1px] bg-cyan-500/5 flex flex-col justify-between text-[5px] text-cyan-500/20">
            <span>100</span>
            <span>50</span>
            <span>0</span>
          </div>
        </div>

        {/* Quantum Diagnostics */}
        <div className="border-t border-cyan-500/10 pt-2 font-share-mono text-[9px] space-y-1.5">
          <div className="flex justify-between items-center bg-[#02040a]/40 border border-cyan-500/10 p-1.5 rounded">
            <span className="text-cyan-500/40">COHERENCE RATE:</span>
            <span className="text-cyan-300 font-bold glow-text-cyan">{coherence}%</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[8px]">
            <div className="bg-[#02040a]/40 border border-cyan-500/10 p-1.5 rounded flex flex-col">
              <span className="text-cyan-500/30">ENTANGLE_FACTOR</span>
              <span className="text-cyan-300 font-semibold mt-0.5">X-109.432</span>
            </div>
            <div className="bg-[#02040a]/40 border border-cyan-500/10 p-1.5 rounded flex flex-col">
              <span className="text-cyan-500/30">COMPUTE_SPEED</span>
              <span className="text-cyan-300 font-semibold mt-0.5">482 T-FLOPS</span>
            </div>
          </div>
        </div>
      </div>
    </HolographicPanel>
  );
}
