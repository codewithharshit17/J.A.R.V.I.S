"use client";

import React, { useEffect, useState } from "react";
import HolographicPanel from "./HolographicPanel";
import { motion } from "framer-motion";

export default function NeuralActivity() {
  const [synapseRate, setSynapseRate] = useState(94.2);
  const [nodesActive, setNodesActive] = useState(256);
  const [retrievalTime, setRetrievalTime] = useState(0.04);
  const [logFeed, setLogFeed] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSynapseRate(+(92 + Math.random() * 6).toFixed(1));
      setNodesActive(Math.floor(240 + Math.random() * 32));
      setRetrievalTime(+(0.03 + Math.random() * 0.03).toFixed(3));

      // Append random synapse triggers
      const nodes = ["CTX-4", "FRN-2", "OCC-9", "TMP-1", "THL-5", "BS-8"];
      const states = ["SYNAPSE_INIT", "SIGNAL_RELAY", "MEM_RETRIEVE", "CALCULATING"];
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
      const randomState = states[Math.floor(Math.random() * states.length)];
      
      setLogFeed(prev => [
        `[${new Date().toLocaleTimeString().split(" ")[0]}] ${randomNode}::${randomState} // OK`,
        ...prev.slice(0, 2)
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <HolographicPanel title="NEURAL ACTIVITY" subtitle="SYNAPTIC_MAPPING // A.I.CORE">
      <div className="flex flex-col space-y-4">
        {/* Animated Synapse Circular Graph */}
        <div className="relative w-full h-36 flex items-center justify-center border border-cyan-500/10 rounded bg-[#050816]/20 overflow-hidden">
          {/* Static circle grid */}
          <div className="absolute w-28 h-28 border border-dashed border-cyan-500/10 rounded-full" />
          <div className="absolute w-16 h-16 border border-dashed border-cyan-500/10 rounded-full" />
          
          {/* SVG paths for connection lines */}
          <svg className="absolute w-32 h-32" viewBox="0 0 100 100">
            {/* Connection lines from center to outer ring */}
            <line x1="50" y1="50" x2="50" y2="10" stroke="rgba(0, 229, 255, 0.15)" strokeWidth="0.75" />
            <line x1="50" y1="50" x2="85" y2="30" stroke="rgba(0, 229, 255, 0.15)" strokeWidth="0.75" />
            <line x1="50" y1="50" x2="85" y2="70" stroke="rgba(0, 229, 255, 0.15)" strokeWidth="0.75" />
            <line x1="50" y1="50" x2="50" y2="90" stroke="rgba(0, 229, 255, 0.15)" strokeWidth="0.75" />
            <line x1="50" y1="50" x2="15" y2="70" stroke="rgba(0, 229, 255, 0.15)" strokeWidth="0.75" />
            <line x1="50" y1="50" x2="15" y2="30" stroke="rgba(0, 229, 255, 0.15)" strokeWidth="0.75" />

            {/* Pulsing signal markers (Framer motion path animations) */}
            <motion.circle 
              cx="50" cy="50" r="1.5" fill="#00e5ff"
              animate={{ cy: [50, 10], opacity: [1, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.circle 
              cx="50" cy="50" r="1.5" fill="#00e5ff"
              animate={{ cx: [50, 85], cy: [50, 30], opacity: [1, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
            />
            <motion.circle 
              cx="50" cy="50" r="1.5" fill="#00e5ff"
              animate={{ cx: [50, 15], cy: [50, 70], opacity: [1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
            />
          </svg>

          {/* Core Consciousness Sync Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute w-24 h-24 border border-t-[#00e5ff] border-r-transparent border-b-[#00e5ff] border-l-transparent rounded-full opacity-35" 
          />

          {/* Node Points */}
          <div className="absolute top-[8px] left-[61px] w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#00e5ff]" />
          <div className="absolute top-[32px] right-[10px] w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#00e5ff]" />
          <div className="absolute bottom-[32px] right-[10px] w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#00e5ff]" />
          <div className="absolute bottom-[8px] left-[61px] w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#00e5ff]" />
          <div className="absolute bottom-[32px] left-[10px] w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#00e5ff]" />
          <div className="absolute top-[32px] left-[10px] w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#00e5ff]" />
          
          <div className="absolute w-3 h-3 bg-cyan-500 rounded-full opacity-20 animate-ping" />
          <div className="absolute w-1.5 h-1.5 bg-[#00e5ff] rounded-full shadow-[0_0_6px_#00e5ff]" />
          
          {/* Overlay scanning sweep grid inside panel */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.015)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
        </div>

        {/* Telemetry Numbers */}
        <div className="grid grid-cols-3 gap-2 border-t border-cyan-500/10 pt-2 font-share-mono">
          <div className="text-center">
            <span className="block text-[8px] text-cyan-400/40">SYNAPSE RATE</span>
            <span className="text-xs font-bold text-cyan-300 glow-text-cyan">{synapseRate}%</span>
          </div>
          <div className="text-center border-x border-cyan-500/10">
            <span className="block text-[8px] text-cyan-400/40">ACTIVE CORES</span>
            <span className="text-xs font-bold text-cyan-300 glow-text-cyan">{nodesActive}</span>
          </div>
          <div className="text-center">
            <span className="block text-[8px] text-cyan-400/40">RETRIEVAL</span>
            <span className="text-xs font-bold text-cyan-300 glow-text-cyan">{retrievalTime}s</span>
          </div>
        </div>

        {/* Synaptic activity log streams */}
        <div className="bg-[#07111f]/40 border border-cyan-500/10 p-2 rounded flex flex-col space-y-1 h-[54px] justify-center overflow-hidden">
          {logFeed.length === 0 ? (
            <div className="text-[8px] text-cyan-500/30 text-center animate-pulse">MONITORING SYNAPSE CHANNELS...</div>
          ) : (
            logFeed.map((log, i) => (
              <div key={i} className="text-[8px] text-cyan-300/80 font-share-mono truncate">
                <span className="text-[#00e5ff]/50 mr-1.5">&gt;&gt;</span>
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </HolographicPanel>
  );
}
