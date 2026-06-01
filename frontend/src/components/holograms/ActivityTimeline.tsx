"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useJarvisStore, JarvisEvent } from "@/store/useJarvisStore";
import HolographicPanel from "./HolographicPanel";

/**
 * Holographic Activity Timeline
 *
 * Renders a scrolling feed of the last 100 realtime events received
 * over the WebSocket connection. Each entry shows timestamp, event
 * type, and a formatted payload summary.
 */
export default function ActivityTimeline() {
  const events = useJarvisStore((s) => s.events);
  const connected = useJarvisStore((s) => s.connected);

  return (
    <HolographicPanel
      title="ACTIVITY TIMELINE"
      subtitle={`WS_LINK // ${connected ? "CONNECTED" : "OFFLINE"}`}
      glassPreset="standard"
      animateGlow={true}
      interactive={true}
    >
      <div className="flex flex-col space-y-1 max-h-[200px] overflow-y-auto scrollbar-hide">
        {/* Connection status beacon */}
        <div className="flex items-center space-x-2 pb-1.5 mb-1 border-b border-cyan-500/10">
          <motion.div
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: connected ? "#00e5ff" : "#334155" }}
            animate={{
              scale: connected ? [1, 1.4, 1] : 1,
              opacity: connected ? [0.6, 1, 0.6] : 0.3,
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-[8px] font-share-mono tracking-widest text-cyan-400/60">
            {connected ? "REALTIME STREAM ACTIVE" : "AWAITING CONNECTION"}
          </span>
        </div>

        {events.length === 0 ? (
          <div className="text-[9px] font-share-mono text-cyan-400/30 text-center py-4 tracking-wider">
            NO EVENTS RECEIVED
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {events.slice(0, 15).map((evt: JarvisEvent, idx: number) => (
              <motion.div
                key={`${evt.timestamp}-${idx}`}
                initial={{ opacity: 0, x: -8, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: 8, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start space-x-2 py-1 border-b border-cyan-500/5 last:border-b-0"
              >
                {/* Timestamp */}
                <span className="text-[7px] font-share-mono text-cyan-400/35 flex-shrink-0 w-[52px] pt-[1px]">
                  {formatTimestamp(evt.timestamp)}
                </span>

                {/* Event badge */}
                <span
                  className={`text-[7px] font-orbitron tracking-wider flex-shrink-0 px-1 py-[1px] rounded-sm border ${getEventBadgeClass(
                    evt.event
                  )}`}
                >
                  {evt.event}
                </span>

                {/* Payload summary */}
                <span className="text-[8px] font-share-mono text-cyan-300/50 truncate">
                  {formatPayload(evt.payload)}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Event count indicator */}
        {events.length > 0 && (
          <div className="text-[7px] font-share-mono text-cyan-400/20 text-right pt-1 tracking-wider">
            {events.length} / 100 EVENTS BUFFERED
          </div>
        )}
      </div>
    </HolographicPanel>
  );
}

// ── Helpers ──────────────────────────────────────────────────────

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return "??:??:??";
  }
}

function formatPayload(payload: Record<string, unknown>): string {
  const entries = Object.entries(payload).filter(([k]) => k !== "timestamp");
  if (entries.length === 0) return "—";
  return entries.map(([k, v]) => `${k}: ${v}`).join(" | ");
}

function getEventBadgeClass(event: string): string {
  switch (event) {
    case "STATE_CHANGE":
      return "bg-cyan-500/15 border-cyan-500/30 text-cyan-300";
    case "CONNECTION_ACK":
      return "bg-emerald-500/15 border-emerald-500/30 text-emerald-300";
    case "ERROR":
      return "bg-red-500/15 border-red-500/30 text-red-300";
    default:
      return "bg-white/5 border-white/10 text-white/50";
  }
}
