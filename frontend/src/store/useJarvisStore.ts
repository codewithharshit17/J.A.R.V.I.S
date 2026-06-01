import { create } from "zustand";

export interface JarvisEvent {
  timestamp: string;
  event: string;
  payload: Record<string, unknown>;
}

interface JarvisStoreState {
  /** Whether the WebSocket link is currently connected */
  connected: boolean;
  /** Current J.A.R.V.I.S. state received from the backend */
  currentState: string;
  /** Rolling buffer of the last 100 realtime events */
  events: JarvisEvent[];

  // Actions
  setConnected: (value: boolean) => void;
  setCurrentState: (state: string) => void;
  pushEvent: (event: JarvisEvent) => void;
}

export const useJarvisStore = create<JarvisStoreState>((set) => ({
  connected: false,
  currentState: "IDLE",
  events: [],

  setConnected: (value) => set({ connected: value }),

  setCurrentState: (state) => set({ currentState: state }),

  pushEvent: (event) =>
    set((prev) => ({
      events: [event, ...prev.events].slice(0, 100),
    })),
}));
