export const AI_STATES = [
  "IDLE",
  "LISTENING",
  "THINKING",
  "PROCESSING",
  "RESPONDING",
  "ERROR",
] as const;

export type AIState = (typeof AI_STATES)[number];

export type AIChamberState = "idle" | "listening" | "processing" | "speaking";

export type JarvisCoreVisualState =
  | "idle"
  | "listening"
  | "processing"
  | "speaking"
  | "executing"
  | "error";

export interface AIStateVisual {
  primary: string;
  secondary: string;
  accent: string;
  rgb: string;
  glow: string;
  ringOpacity: number;
  pulseDuration: number;
  rotationMultiplier: number;
}

export interface AIStateDefinition {
  state: AIState;
  shortCode: string;
  label: string;
  statusText: string;
  description: string;
  visual: AIStateVisual;
  chamberState: AIChamberState;
  coreState: JarvisCoreVisualState;
}

export const DEFAULT_AI_STATE: AIState = "IDLE";

export const AI_STATE_DEFINITIONS: Record<AIState, AIStateDefinition> = {
  IDLE: {
    state: "IDLE",
    shortCode: "IDL",
    label: "Idle",
    statusText: "Idle",
    description: "Low intensity baseline with calm ambient motion.",
    chamberState: "idle",
    coreState: "idle",
    visual: {
      primary: "#00E5FF",
      secondary: "#00B2FF",
      accent: "#B6F7FF",
      rgb: "0, 229, 255",
      glow: "rgba(0, 229, 255, 0.55)",
      ringOpacity: 0.34,
      pulseDuration: 3.6,
      rotationMultiplier: 0.8,
    },
  },
  LISTENING: {
    state: "LISTENING",
    shortCode: "LIS",
    label: "Listening",
    statusText: "Listening...",
    description: "Cyan receptive pulse for active input capture.",
    chamberState: "listening",
    coreState: "listening",
    visual: {
      primary: "#22D3EE",
      secondary: "#67E8F9",
      accent: "#F0FDFF",
      rgb: "34, 211, 238",
      glow: "rgba(34, 211, 238, 0.86)",
      ringOpacity: 0.58,
      pulseDuration: 1.35,
      rotationMultiplier: 1.05,
    },
  },
  THINKING: {
    state: "THINKING",
    shortCode: "THK",
    label: "Thinking",
    statusText: "Thinking...",
    description: "Blue accelerated reasoning motion.",
    chamberState: "processing",
    coreState: "processing",
    visual: {
      primary: "#3B82F6",
      secondary: "#38BDF8",
      accent: "#DBEAFE",
      rgb: "59, 130, 246",
      glow: "rgba(59, 130, 246, 0.92)",
      ringOpacity: 0.68,
      pulseDuration: 0.9,
      rotationMultiplier: 1.55,
    },
  },
  PROCESSING: {
    state: "PROCESSING",
    shortCode: "PRC",
    label: "Processing",
    statusText: "Processing...",
    description: "Purple high-energy compute state.",
    chamberState: "processing",
    coreState: "executing",
    visual: {
      primary: "#A855F7",
      secondary: "#7C3AED",
      accent: "#F3E8FF",
      rgb: "168, 85, 247",
      glow: "rgba(168, 85, 247, 0.96)",
      ringOpacity: 0.78,
      pulseDuration: 0.62,
      rotationMultiplier: 2.1,
    },
  },
  RESPONDING: {
    state: "RESPONDING",
    shortCode: "RSP",
    label: "Responding",
    statusText: "Responding...",
    description: "Green stable pulse for response output.",
    chamberState: "speaking",
    coreState: "speaking",
    visual: {
      primary: "#22C55E",
      secondary: "#86EFAC",
      accent: "#F0FDF4",
      rgb: "34, 197, 94",
      glow: "rgba(34, 197, 94, 0.9)",
      ringOpacity: 0.64,
      pulseDuration: 1.25,
      rotationMultiplier: 1.0,
    },
  },
  ERROR: {
    state: "ERROR",
    shortCode: "ERR",
    label: "System Error",
    statusText: "System Error",
    description: "Red warning animation for fault state.",
    chamberState: "idle",
    coreState: "error",
    visual: {
      primary: "#EF4444",
      secondary: "#F87171",
      accent: "#FEE2E2",
      rgb: "239, 68, 68",
      glow: "rgba(239, 68, 68, 0.98)",
      ringOpacity: 0.82,
      pulseDuration: 0.48,
      rotationMultiplier: 2.4,
    },
  },
};

export const AI_STATE_TRANSITIONS: Record<AIState, readonly AIState[]> = {
  IDLE: ["LISTENING", "ERROR"],
  LISTENING: ["THINKING", "ERROR"],
  THINKING: ["PROCESSING", "ERROR"],
  PROCESSING: ["RESPONDING", "ERROR"],
  RESPONDING: ["IDLE", "ERROR"],
  ERROR: ["ERROR"],
};

export function isAIState(value: unknown): value is AIState {
  return typeof value === "string" && value in AI_STATE_DEFINITIONS;
}

export function normalizeAIState(value: unknown): AIState | null {
  if (typeof value !== "string") return null;

  const normalized = value.toUpperCase();
  return isAIState(normalized) ? normalized : null;
}

export function getAIStateDefinition(state: AIState): AIStateDefinition {
  return AI_STATE_DEFINITIONS[state];
}

export function canTransitionAIState(from: AIState, to: AIState): boolean {
  return from === to || AI_STATE_TRANSITIONS[from].includes(to);
}

export function getNextAIState(state: AIState): AIState {
  switch (state) {
    case "IDLE":
      return "LISTENING";
    case "LISTENING":
      return "THINKING";
    case "THINKING":
      return "PROCESSING";
    case "PROCESSING":
      return "RESPONDING";
    case "RESPONDING":
    case "ERROR":
      return "IDLE";
  }
}

export function mapAIStateToChamberState(state: AIState): AIChamberState {
  return AI_STATE_DEFINITIONS[state].chamberState;
}

export function mapAIStateToCoreState(state: AIState): JarvisCoreVisualState {
  return AI_STATE_DEFINITIONS[state].coreState;
}

export function getAIStateTestEndpoint(state: AIState): string {
  return `/api/test/${state.toLowerCase()}`;
}
