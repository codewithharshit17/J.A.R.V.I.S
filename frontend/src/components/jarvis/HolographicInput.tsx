"use client";

import React, { useRef, useState, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Zap, ChevronRight } from "lucide-react";
import { ChamberState } from "./InteractionChamber";

interface HolographicInputProps {
  chamberState: ChamberState;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onVoiceToggle: () => void;
  isVoiceActive: boolean;
}

const STATE_COLORS: Record<ChamberState, string> = {
  idle: "#00e5ff",
  listening: "#b6f7ff",
  processing: "#00e5ff",
  speaking: "#00b2ff",
};

const PLACEHOLDER_TEXTS = [
  "Enter command or speak directive...",
  "Query the neural matrix...",
  "Transmit instruction to J.A.R.V.I.S...",
  "Initialize command sequence...",
];

export default function HolographicInput({
  chamberState,
  value,
  onChange,
  onSubmit,
  onVoiceToggle,
  isVoiceActive,
}: HolographicInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const isDisabled = chamberState === "processing" || chamberState === "speaking";
  const stateColor = STATE_COLORS[chamberState];
  const charCount = value.length;

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFocused && !value) {
        setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_TEXTS.length);
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [isFocused, value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isDisabled) {
        onSubmit(value);
      }
    }
  };

  const glowIntensity = isFocused ? "0 0 30px" : "0 0 12px";
  const glowOpacity = isFocused ? "0.6" : "0.25";

  return (
    <motion.div
      className="w-full max-w-3xl relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
    >
      {/* Command label */}
      <motion.div
        className="flex items-center space-x-3 mb-2 px-1"
        animate={{ opacity: isDisabled ? 0.3 : 0.7 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-1.5">
          <ChevronRight size={10} style={{ color: stateColor }} />
          <span
            className="text-[8px] tracking-[0.4em] font-mono"
            style={{ color: stateColor }}
          >
            {isDisabled ? "COMMAND LOCKED - AI ACTIVE" : "COMMAND INTERFACE READY"}
          </span>
        </div>
        <div className="flex-1 h-[1px]" style={{ background: `linear-gradient(90deg, ${stateColor}30, transparent)` }} />
        <span className="text-[8px] font-mono" style={{ color: `${stateColor}60` }}>
          {charCount} / 512
        </span>
      </motion.div>

      {/* Main input container */}
      <div className="relative">
        {/* Outer scanning frame */}
        <motion.div
          className="absolute inset-0 rounded-sm pointer-events-none z-10"
          style={{
            boxShadow: `${glowIntensity} rgba(${stateColor}, ${glowOpacity}), inset 0 0 15px rgba(0,0,0,0.6)`,
            border: `1px solid ${stateColor}${isFocused ? "60" : "25"}`,
            transition: "all 0.4s ease",
          }}
        />

        {/* Corner brackets */}
        {(["tl", "tr", "bl", "br"] as const).map((corner) => (
          <CornerBracket
            key={corner}
            corner={corner}
            color={stateColor}
            isFocused={isFocused}
          />
        ))}

        {/* Scanning line (active on focus) */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              className="absolute top-0 left-0 right-0 h-[1px] z-20 pointer-events-none"
              style={{
                background: `linear-gradient(90deg, transparent, ${stateColor}80, transparent)`,
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: [0, 1, 1, 0],
                x: ["-100%", "0%", "0%", "100%"],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        {/* Background glass */}
        <div
          className="relative flex items-center px-4 py-3 rounded-sm overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(2,4,10,0.92) 0%, rgba(5,10,24,0.95) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Left side: voice button */}
          <motion.button
            id="jarvis-voice-btn"
            onClick={onVoiceToggle}
            disabled={isDisabled}
            className="relative flex-shrink-0 w-8 h-8 flex items-center justify-center mr-4 rounded-sm transition-all"
            style={{
              border: `1px solid ${isVoiceActive ? "#b6f7ff" : stateColor}40`,
              background: isVoiceActive
                ? "rgba(182,247,255,0.15)"
                : "rgba(0,229,255,0.05)",
              cursor: isDisabled ? "not-allowed" : "pointer",
            }}
            whileHover={{ scale: isDisabled ? 1 : 1.1 }}
            whileTap={{ scale: isDisabled ? 1 : 0.95 }}
          >
            {isVoiceActive ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                <Mic size={14} color="#b6f7ff" />
              </motion.div>
            ) : (
              <MicOff size={14} style={{ color: `${stateColor}80` }} />
            )}

            {/* Voice pulse rings */}
            <AnimatePresence>
              {isVoiceActive && (
                <>
                  {[1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-sm border border-cyan-400/40"
                      initial={{ opacity: 0.8, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.8 + i * 0.4 }}
                      transition={{ duration: 1.2, delay: i * 0.3, repeat: Infinity }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Divider */}
          <div className="h-6 w-[1px] mr-4 flex-shrink-0" style={{ background: `${stateColor}20` }} />

          {/* Command prefix */}
          <motion.span
            className="text-xs font-mono mr-3 flex-shrink-0 select-none"
            style={{ color: `${stateColor}70` }}
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            J:&gt;
          </motion.span>

          {/* Input field */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              id="jarvis-command-input"
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isDisabled}
              maxLength={512}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              className="w-full bg-transparent outline-none border-none text-sm font-mono tracking-wider"
              style={{
                color: isFocused ? "#ffffff" : "#b6f7ff99",
                caretColor: stateColor,
                fontFamily: "'Share Tech Mono', monospace",
                cursor: isDisabled ? "not-allowed" : "text",
              }}
            />

            {/* Animated placeholder */}
            <AnimatePresence mode="wait">
              {!value && !isFocused && (
                <motion.span
                  key={placeholderIdx}
                  className="absolute inset-0 flex items-center text-sm font-mono tracking-wider pointer-events-none"
                  style={{ color: `${stateColor}35`, fontFamily: "'Share Tech Mono', monospace" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {PLACEHOLDER_TEXTS[placeholderIdx]}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="h-6 w-[1px] mx-4 flex-shrink-0" style={{ background: `${stateColor}20` }} />

          {/* Right side: submit */}
          <motion.button
            id="jarvis-submit-btn"
            onClick={() => !isDisabled && value.trim() && onSubmit(value)}
            disabled={isDisabled || !value.trim()}
            className="flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-sm transition-all"
            style={{
              border: `1px solid ${value.trim() && !isDisabled ? stateColor + "50" : stateColor + "15"}`,
              background: value.trim() && !isDisabled ? `${stateColor}10` : "transparent",
              cursor: isDisabled || !value.trim() ? "not-allowed" : "pointer",
              opacity: isDisabled ? 0.3 : value.trim() ? 1 : 0.4,
            }}
            whileHover={{ scale: !isDisabled && value.trim() ? 1.05 : 1 }}
            whileTap={{ scale: !isDisabled && value.trim() ? 0.97 : 1 }}
          >
            <Zap size={11} style={{ color: stateColor }} />
            <span
              className="text-[9px] font-mono tracking-[0.2em]"
              style={{ color: stateColor }}
            >
              TRANSMIT
            </span>
          </motion.button>
        </div>

        {/* Processing lock overlay */}
        <AnimatePresence>
          {isDisabled && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="flex items-center space-x-2 px-3 py-1 rounded-sm text-[9px] font-mono tracking-[0.3em]"
                style={{
                  color: stateColor,
                  background: "rgba(2,4,10,0.8)",
                  border: `1px solid ${stateColor}30`,
                }}
              >
                <motion.div
                  className="w-1 h-1 rounded-full"
                  style={{ background: stateColor }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <span>
                  {chamberState === "processing"
                    ? "NEURAL MATRIX ACTIVE - COMMAND LOCKED"
                    : "JARVIS TRANSMITTING - STANDBY"}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom status row */}
      <div className="flex items-center justify-between px-1 mt-1.5">
        <span className="text-[7px] font-mono tracking-[0.3em]" style={{ color: `${stateColor}40` }}>
          STARK INDUSTRIES // NEURAL COMMAND PROTOCOL v9.4
        </span>
        <span className="text-[7px] font-mono tracking-[0.3em]" style={{ color: `${stateColor}40` }}>
          PRESS ENTER TO TRANSMIT // MIC FOR VOICE
        </span>
      </div>
    </motion.div>
  );
}

function CornerBracket({
  corner,
  color,
  isFocused,
}: {
  corner: "tl" | "tr" | "bl" | "br";
  color: string;
  isFocused: boolean;
}) {
  const posStyle: React.CSSProperties = {
    position: "absolute",
    width: 12,
    height: 12,
    zIndex: 20,
    pointerEvents: "none",
    transition: "all 0.4s ease",
  };

  const cornerStyles: Record<string, React.CSSProperties> = {
    tl: { ...posStyle, top: -1, left: -1, borderTop: `2px solid ${color}${isFocused ? "aa" : "40"}`, borderLeft: `2px solid ${color}${isFocused ? "aa" : "40"}` },
    tr: { ...posStyle, top: -1, right: -1, borderTop: `2px solid ${color}${isFocused ? "aa" : "40"}`, borderRight: `2px solid ${color}${isFocused ? "aa" : "40"}` },
    bl: { ...posStyle, bottom: -1, left: -1, borderBottom: `2px solid ${color}${isFocused ? "aa" : "40"}`, borderLeft: `2px solid ${color}${isFocused ? "aa" : "40"}` },
    br: { ...posStyle, bottom: -1, right: -1, borderBottom: `2px solid ${color}${isFocused ? "aa" : "40"}`, borderRight: `2px solid ${color}${isFocused ? "aa" : "40"}` },
  };

  return <div style={cornerStyles[corner]} />;
}
