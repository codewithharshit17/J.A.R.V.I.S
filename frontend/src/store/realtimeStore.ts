import { create } from "zustand";

export type AIState =
  | "IDLE"
  | "LISTENING"
  | "THINKING"
  | "RESPONDING"
  | "ERROR";

interface RealtimeStore {
  connected: boolean;
  currentState: AIState;

  setConnected: (value: boolean) => void;
  setState: (state: AIState) => void;
}

export const useRealtimeStore = create<RealtimeStore>((set) => ({
  connected: false,

  currentState: "IDLE",

  setConnected: (value) =>
    set({
      connected: value,
    }),

  setState: (state) =>
    set({
      currentState: state,
    }),
}));