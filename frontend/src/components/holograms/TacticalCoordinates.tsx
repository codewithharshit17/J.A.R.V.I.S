"use client";

import React, { useEffect, useState } from "react";
import HolographicPanel from "./HolographicPanel";
import { motion } from "framer-motion";

export default function TacticalCoordinates() {
  const [coords, setCoords] = useState({
    lat: "34.0736 N",
    lng: "118.4004 W",
    alt: "482m",
    azimuth: "142.5 deg",
    deviation: "+0.002",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate micro drift in coordinate values
      const latVal = (34.0736 + (Math.random() - 0.5) * 0.008).toFixed(4);
      const lngVal = (118.4004 + (Math.random() - 0.5) * 0.008).toFixed(4);
      const altVal = Math.floor(470 + Math.random() * 25);
      const azVal = (140 + Math.random() * 5).toFixed(1);
      const devVal = ((Math.random() - 0.5) * 0.005).toFixed(4);

      setCoords({
        lat: `${latVal} N`,
        lng: `${lngVal} W`,
        alt: `${altVal}m`,
        azimuth: `${azVal} deg`,
        deviation: `${devVal > "0" ? "+" : ""}${devVal}`,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <HolographicPanel title="TACTICAL COORDINATES" subtitle="TARGETING_MATRIX // ORBITAL_LOCK">
      <div className="flex flex-col space-y-3">
        {/* Concentric Rotating Coordinate Rings */}
        <div className="relative w-full h-32 flex items-center justify-center border border-cyan-500/10 rounded bg-[#02040a]/20 overflow-hidden">
          {/* Target Reticle Crosshair */}
          <div className="absolute w-full h-[0.5px] bg-cyan-500/10" />
          <div className="absolute h-full w-[0.5px] bg-cyan-500/10" />
          
          {/* Concentric SVG Rings */}
          <svg className="absolute w-28 h-28" viewBox="0 0 100 100">
            {/* Compass ticks outer ring */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0, 229, 255, 0.12)" strokeWidth="0.5" strokeDasharray="1, 4" />
            
            {/* Center targeting rings */}
            <motion.circle 
              cx="50" cy="50" r="30" fill="none" stroke="rgba(0, 229, 255, 0.2)" strokeWidth="0.75" 
              strokeDasharray="15, 8"
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle 
              cx="50" cy="50" r="20" fill="none" stroke="rgba(0, 229, 255, 0.25)" strokeWidth="1" 
              strokeDasharray="40, 10"
              animate={{ rotate: -360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Solid rings */}
            <circle cx="50" cy="50" r="8" fill="none" stroke="rgba(0, 229, 255, 0.4)" strokeWidth="0.5" />
            
            {/* Animated locking markers */}
            <motion.rect 
              x="47" y="47" width="6" height="6" fill="none" stroke="#b6f7ff" strokeWidth="0.5"
              animate={{ scale: [1, 1.4, 1], rotate: [0, 90, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </svg>
          
          {/* Overlay grid lines */}
          <div className="absolute top-2 left-2 text-[6.5px] text-cyan-400/40 font-share-mono">LOCK: SYS.GEO</div>
          <div className="absolute bottom-2 right-2 text-[6.5px] text-[#b6f7ff]/70 font-share-mono animate-pulse">LOCKING ACTIVE</div>
        </div>

        {/* Coordinate Text Outputs */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-share-mono text-[9px] border-t border-cyan-500/10 pt-2.5">
          <div className="flex justify-between">
            <span className="text-cyan-400/35">LATITUDE:</span>
            <span className="text-cyan-300 font-semibold">{coords.lat}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cyan-400/35">AZIMUTH:</span>
            <span className="text-cyan-300 font-semibold">{coords.azimuth}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cyan-400/35">LONGITUDE:</span>
            <span className="text-cyan-300 font-semibold">{coords.lng}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cyan-400/35">DEV_CAL:</span>
            <span className="text-cyan-300 font-semibold">{coords.deviation}</span>
          </div>
          <div className="col-span-2 flex justify-between border-t border-cyan-500/5 pt-1.5 text-[8.5px]">
            <span className="text-cyan-400/35">ALTITUDE:</span>
            <span className="text-cyan-300 font-bold glow-text-cyan">{coords.alt} OVER MSL</span>
          </div>
        </div>
      </div>
    </HolographicPanel>
  );
}
