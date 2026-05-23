"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChamberState } from "./InteractionChamber";

interface AIResponseProjectionProps {
  response: string;
  chamberState: ChamberState;
}

const STATE_COLORS: Record<ChamberState, string> = {
  idle: "#00e5ff",
  listening: "#b6f7ff",
  processing: "#00e5ff",
  speaking: "#00b2ff",
};

const PROCESSING_GLYPHS = [
  "###---...   COGNITIVE MATRIX ACTIVE",
  "SYNC // NEURAL PATHWAYS SYNCHRONIZING...",
  "ENERGY // QUANTUM ANALYSIS IN PROGRESS",
  "NODE // PARSING SEMANTIC INTENT VECTORS",
  "XREF // CROSS-REFERENCING KNOWLEDGE BASE",
  "INIT // INITIALIZING RESPONSE PROTOCOL",
];

export default function AIResponseProjection({
  response,
  chamberState,
}: AIResponseProjectionProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isRevealing, setIsRevealing] = useState(false);
  const [scanLine, setScanLine] = useState(0);
  const [processingGlyph, setProcessingGlyph] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateColor = STATE_COLORS[chamberState];

  // Typewriter reveal when response changes
  useEffect(() => {
    if (!response) {
      const resetTimer = setTimeout(() => {
        setDisplayedText("");
        setIsRevealing(false);
      }, 0);
      return () => clearTimeout(resetTimer);
    }

    let idx = 0;
    const startTimer = setTimeout(() => {
      setDisplayedText("");
      setIsRevealing(true);

      intervalRef.current = setInterval(() => {
        if (idx < response.length) {
          setDisplayedText(response.slice(0, idx + 1));
          idx++;
        } else {
          setIsRevealing(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, 28);
    }, 0);

    return () => {
      clearTimeout(startTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [response]);

  // Processing glyph cycling
  useEffect(() => {
    if (chamberState !== "processing") return;
    const interval = setInterval(() => {
      setProcessingGlyph((p) => (p + 1) % PROCESSING_GLYPHS.length);
    }, 600);
    return () => clearInterval(interval);
  }, [chamberState]);

  // Scanning line animation
  useEffect(() => {
    if (!isRevealing) return;
    const interval = setInterval(() => {
      setScanLine((s) => (s + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, [isRevealing]);

  const isActive = chamberState === "processing" || chamberState === "speaking";

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          className="relative w-full max-w-2xl"
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Outer holographic frame */}
          <div
            className="relative rounded-sm overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(2,4,14,0.94) 0%, rgba(4,8,20,0.97) 100%)",
              border: `1px solid ${stateColor}30`,
              backdropFilter: "blur(24px)",
              boxShadow: `0 0 40px ${stateColor}15, inset 0 0 30px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Top projection bar */}
            <div
              className="flex items-center justify-between px-4 py-2"
              style={{
                borderBottom: `1px solid ${stateColor}20`,
                background: `linear-gradient(90deg, ${stateColor}08, transparent, ${stateColor}08)`,
              }}
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: stateColor }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                />
                <span
                  className="text-[8px] font-mono tracking-[0.4em] uppercase"
                  style={{ color: `${stateColor}90` }}
                >
                  {chamberState === "processing"
                    ? "NEURAL OUTPUT STREAM - PROCESSING"
                    : "HOLOGRAPHIC RESPONSE PROJECTION"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                {/* Signal strength indicators */}
                {[0.3, 0.5, 0.7, 1].map((h, i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 rounded-full"
                    style={{
                      height: `${h * 14}px`,
                      background: stateColor,
                      opacity: 0.6,
                    }}
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
                  />
                ))}
              </div>
            </div>

            {/* Content area */}
            <div className="relative px-5 py-4 min-h-[80px]">
              {/* Scanning line overlay during reveal */}
              {isRevealing && (
                <motion.div
                  className="absolute left-0 right-0 h-[1px] pointer-events-none z-10"
                  style={{
                    top: `${scanLine}%`,
                    background: `linear-gradient(90deg, transparent, ${stateColor}60, transparent)`,
                  }}
                />
              )}

              {/* Processing state */}
              <AnimatePresence mode="wait">
                {chamberState === "processing" && !response && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2"
                  >
                    {/* Processing animation bars */}
                    <div className="flex items-center space-x-3 mb-3">
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="flex-1 rounded-full"
                          style={{ background: stateColor, height: 2 }}
                          animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
                          transition={{
                            duration: 1.2,
                            delay: i * 0.08,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>

                    {/* Glyph line */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={processingGlyph}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.3 }}
                        className="text-xs font-mono tracking-wider"
                        style={{ color: `${stateColor}80` }}
                      >
                        {PROCESSING_GLYPHS[processingGlyph]}
                      </motion.div>
                    </AnimatePresence>

                    {/* Data stream lines */}
                    <div className="space-y-1 mt-2">
                      {[0.7, 0.5, 0.35].map((w, i) => (
                        <motion.div
                          key={i}
                          className="h-px rounded-full"
                          style={{
                            width: `${w * 100}%`,
                            background: `linear-gradient(90deg, ${stateColor}40, transparent)`,
                          }}
                          animate={{ opacity: [0.4, 0.9, 0.4] }}
                          transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Speaking / response text */}
                {chamberState === "speaking" && (
                  <motion.div
                    key="speaking"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* JARVIS label */}
                    <div className="flex items-center space-x-2 mb-3">
                      <motion.div
                        className="w-1 h-1 rounded-full"
                        style={{ background: stateColor }}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                      <span
                        className="text-[8px] font-mono tracking-[0.5em] uppercase"
                        style={{ color: `${stateColor}70` }}
                      >
                        J.A.R.V.I.S. RESPONSE
                      </span>
                    </div>

                    {/* Response text */}
                    <p
                      className="text-sm leading-relaxed font-mono tracking-wide"
                      style={{
                        color: "#d4f9ff",
                        textShadow: `0 0 20px ${stateColor}40`,
                        fontFamily: "'Share Tech Mono', monospace",
                      }}
                    >
                      {displayedText}
                      {isRevealing && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          style={{ color: stateColor }}
                        >
                          |
                        </motion.span>
                      )}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom bar */}
            <div
              className="flex items-center justify-between px-4 py-1.5"
              style={{ borderTop: `1px solid ${stateColor}15` }}
            >
              <motion.span
                className="text-[7px] font-mono tracking-[0.3em]"
                style={{ color: `${stateColor}40` }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                NEURAL LINK: SYNCHRONIZED
              </motion.span>
              <span
                className="text-[7px] font-mono tracking-[0.3em]"
                style={{ color: `${stateColor}40` }}
              >
                CONFIDENCE: 97.3% // SECURE CHANNEL
              </span>
            </div>
          </div>

          {/* Holographic projection lines */}
          {[0, 1].map((side) => (
            <motion.div
              key={side}
              className="absolute top-0 h-full w-px pointer-events-none"
              style={{
                [side === 0 ? "left" : "right"]: -1,
                background: `linear-gradient(180deg, transparent, ${stateColor}40, transparent)`,
              }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: side * 0.9 }}
            />
          ))}

          {/* Corner brackets */}
          {(["tl", "tr", "bl", "br"] as const).map((c) => (
            <ProjectionCorner key={c} corner={c} color={stateColor} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProjectionCorner({
  corner,
  color,
}: {
  corner: "tl" | "tr" | "bl" | "br";
  color: string;
}) {
  const size = 10;
  const styles: Record<string, React.CSSProperties> = {
    tl: { position: "absolute", top: -2, left: -2, width: size, height: size, borderTop: `2px solid ${color}70`, borderLeft: `2px solid ${color}70` },
    tr: { position: "absolute", top: -2, right: -2, width: size, height: size, borderTop: `2px solid ${color}70`, borderRight: `2px solid ${color}70` },
    bl: { position: "absolute", bottom: -2, left: -2, width: size, height: size, borderBottom: `2px solid ${color}70`, borderLeft: `2px solid ${color}70` },
    br: { position: "absolute", bottom: -2, right: -2, width: size, height: size, borderBottom: `2px solid ${color}70`, borderRight: `2px solid ${color}70` },
  };
  return <div style={styles[corner]} />;
}
