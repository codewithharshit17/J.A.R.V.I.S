"use client";

import React from "react";
import { motion } from "framer-motion";
import { JarvisState, STATE_CONFIGS } from "./JarvisCore";

interface StatusSelectorProps {
  currentState: JarvisState;
  onChangeState: (state: JarvisState) => void;
}

interface StateNode {
  id: JarvisState;
  shortCode: string;
  label: string;
  desc: string;
}

const STATE_NODES: StateNode[] = [
  { id: "booting", shortCode: "BOT", label: "BOOT_SEQUENCE", desc: "Initialize core reactors & synapse links" },
  { id: "idle", shortCode: "IDL", label: "STANDBY_IDLE", desc: "Calm neural baseline; ambient breathing" },
  { id: "listening", shortCode: "LIS", label: "AUDIO_INGEST", desc: "Acoustic signal listening & threshold sweep" },
  { id: "processing", shortCode: "PRC", label: "HEURISTIC_CALC", desc: "Fast deconvolution & thread calculation" },
  { id: "speaking", shortCode: "SPK", label: "VOCAL_EMIT", desc: "Modulate DAC wave converters and synthesizers" },
  { id: "analyzing", shortCode: "ANL", label: "SPECTRAL_SCAN", desc: "Radar raycast scan & recon coefficient sync" },
  { id: "warning", shortCode: "WRN", label: "THERMAL_WARN", desc: "Thermal spikes & containment valve monitoring" },
  { id: "executing", shortCode: "EXC", label: "ENGINE_EXEC", desc: "Max velocity arc reactors engaged" },
  { id: "disconnected", shortCode: "DSC", label: "LINK_OFFLINE", desc: "Ping timeouts, static noise gateway" },
  { id: "error", shortCode: "ERR", label: "FATAL_HALT", desc: "Stack overflow, hardware register collapse" }
];

export default function StatusSelector({ currentState, onChangeState }: StatusSelectorProps) {
  const currentConfig = STATE_CONFIGS[currentState];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto select-none flex flex-col items-center space-y-3">
      {/* Selector Header info */}
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="flex items-center space-x-1.5 opacity-60">
          <span className="text-[7px] animate-pulse" style={{ color: currentConfig.color }}>*</span>
          <span className="text-[9px] font-orbitron tracking-[0.25em] text-white">DIAGNOSTIC OVERRIDE DOCK</span>
          <span className="text-[7px] animate-pulse" style={{ color: currentConfig.color }}>*</span>
        </div>
        <div className="h-[1px] w-24 my-0.5" style={{ background: `linear-gradient(90deg, transparent, ${currentConfig.color}, transparent)` }} />
        {/* State description */}
        <span 
          className="text-[11px] font-share-mono transition-colors duration-300 tracking-wider truncate max-w-xs"
          style={{ color: currentConfig.color }}
        >
          {STATE_NODES.find(n => n.id === currentState)?.label}{" // "}{STATE_NODES.find(n => n.id === currentState)?.desc}
        </span>
      </div>

      {/* Cybernetic Node Controller */}
      <div className="flex items-center space-x-2.5 p-2 px-3 rounded-full bg-black/60 border border-white/5 backdrop-blur-lg shadow-[0_15px_30px_rgba(0,0,0,0.8)] relative">
        
        {/* Glow glow glow behind dock */}
        <div 
          className="absolute inset-0 rounded-full filter blur-xl opacity-15 pointer-events-none transition-all duration-500"
          style={{
            background: `radial-gradient(circle, ${currentConfig.color} 0%, transparent 80%)`,
          }}
        />

        {STATE_NODES.map((node) => {
          const nodeConfig = STATE_CONFIGS[node.id];
          const isActive = node.id === currentState;

          return (
            <div key={node.id} className="relative group">
              
              {/* Outer Selection Reticle */}
              {isActive && (
                <motion.div 
                  className="absolute inset-[-4px] rounded-full border border-dashed z-0"
                  layoutId="activeReticle"
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                  animate={{ rotate: 360 }}
                  // Infinite rotation of active reticle
                  style={{ 
                    borderColor: nodeConfig.color,
                    borderWidth: "1.2px",
                    animation: "spin 12s linear infinite"
                  }}
                />
              )}

              {/* Node Button */}
              <button
                onClick={() => onChangeState(node.id)}
                className="w-10 h-10 rounded-full flex flex-col items-center justify-center relative z-10 cursor-pointer transition-all duration-300 border focus:outline-none"
                style={{
                  backgroundColor: isActive ? `rgba(${nodeConfig.rgb}, 0.25)` : "rgba(255,255,255,0.02)",
                  borderColor: isActive ? nodeConfig.color : "rgba(255,255,255,0.1)",
                  boxShadow: isActive ? `0 0 15px rgba(${nodeConfig.rgb}, 0.5)` : "none"
                }}
              >
                {/* Shortcode text */}
                <span 
                  className="text-[9px] font-orbitron tracking-tight font-black transition-colors duration-300"
                  style={{ color: isActive ? "#ffffff" : "rgba(255,255,255,0.6)" }}
                >
                  {node.shortCode}
                </span>

                {/* Status beacon under button */}
                <div 
                  className={`w-1 h-1 rounded-full mt-0.5 transition-all duration-300 ${isActive ? "scale-100" : "scale-50 opacity-40"}`}
                  style={{ backgroundColor: nodeConfig.color }}
                />
              </button>

              {/* Holographic Tooltip Hover Info */}
              <div className="absolute bottom-14 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex flex-col items-center w-48 z-40">
                <div className="bg-black/90 border border-white/10 p-2 rounded text-center relative shadow-[0_10px_20px_rgba(0,0,0,0.6)] backdrop-blur-md">
                  {/* Tooltip Corner Brackets */}
                  <div className="absolute top-0 left-0 w-1.5 h-1.5 border-l border-t" style={{ borderColor: nodeConfig.color }} />
                  <div className="absolute top-0 right-0 w-1.5 h-1.5 border-r border-t" style={{ borderColor: nodeConfig.color }} />
                  <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-l border-b" style={{ borderColor: nodeConfig.color }} />
                  <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-r border-b" style={{ borderColor: nodeConfig.color }} />

                  <span className="text-[10px] font-orbitron font-bold block" style={{ color: nodeConfig.color }}>
                    {node.label}
                  </span>
                  <span className="text-[8px] font-share-mono text-white/70 block leading-tight mt-1">
                    {node.desc}
                  </span>
                </div>
                {/* Tooltip anchor line */}
                <div className="w-[1px] h-3 bg-white/20 mt-[2px]" style={{ backgroundColor: nodeConfig.color }} />
              </div>

            </div>
          );
        })}
      </div>
      
      {/* Styles insertion for spin keyframes */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
