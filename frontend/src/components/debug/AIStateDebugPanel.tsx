"use client";

import { useState } from "react";
import {
  AI_STATES,
  AIState,
  getAIStateDefinition,
  getAIStateTestEndpoint,
} from "@/lib/aiState";
import { useJarvisStore } from "@/store/useJarvisStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AIStateDebugPanel() {
  const connected = useJarvisStore((s) => s.connected);
  const currentState = useJarvisStore((s) => s.currentState);
  const lastEvent = useJarvisStore((s) => s.events[0]);
  const [pendingState, setPendingState] = useState<AIState | null>(null);
  const stateDefinition = getAIStateDefinition(currentState);

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const triggerState = async (state: AIState) => {
    setPendingState(state);
    try {
      await fetch(`${API_BASE_URL}${getAIStateTestEndpoint(state)}`, {
        method: "GET",
      });
    } catch (error) {
      console.error("[JARVIS DEBUG] Failed to trigger AI state:", error);
    } finally {
      setPendingState(null);
    }
  };

  const lastEventLabel = lastEvent
    ? `${lastEvent.event} // ${String(lastEvent.payload.state ?? "NO_STATE")}`
    : "NO EVENTS";

  return (
    <div className="fixed right-4 top-24 z-[70] w-[292px] pointer-events-auto rounded-sm border border-white/10 bg-[#02040a]/85 p-3 font-mono text-[10px] text-cyan-100/80 shadow-[0_0_24px_rgba(0,229,255,0.14)] backdrop-blur-xl">
      <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2">
        <span className="tracking-[0.22em] text-cyan-300">AI STATE DEBUG</span>
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: connected ? stateDefinition.visual.primary : "#475569" }}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between gap-3">
          <span className="text-cyan-500/55">CONNECTED</span>
          <span className={connected ? "text-emerald-300" : "text-slate-400"}>
            {connected ? "TRUE" : "FALSE"}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-cyan-500/55">CURRENT STATE</span>
          <span style={{ color: stateDefinition.visual.primary }}>{currentState}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-cyan-500/55">STATUS</span>
          <span className="truncate text-right" style={{ color: stateDefinition.visual.primary }}>
            {stateDefinition.statusText}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-cyan-500/55">LAST EVENT</span>
          <span className="max-w-[150px] truncate text-right text-cyan-200/70">{lastEventLabel}</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {AI_STATES.map((state) => {
          const definition = getAIStateDefinition(state);
          const isActive = state === currentState;
          const isPending = state === pendingState;

          return (
            <button
              key={state}
              type="button"
              onClick={() => triggerState(state)}
              disabled={pendingState !== null}
              className="rounded-sm border px-2 py-1.5 text-left text-[9px] tracking-[0.16em] transition-opacity disabled:cursor-wait disabled:opacity-50"
              style={{
                borderColor: isActive ? definition.visual.primary : "rgba(255,255,255,0.12)",
                backgroundColor: isActive ? `rgba(${definition.visual.rgb}, 0.16)` : "rgba(255,255,255,0.04)",
                color: isActive ? definition.visual.primary : "rgba(224,242,254,0.76)",
              }}
            >
              {isPending ? "SENDING" : definition.shortCode}{" // "}{state}
            </button>
          );
        })}
      </div>
    </div>
  );
}
