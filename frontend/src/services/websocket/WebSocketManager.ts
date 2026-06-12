import { useJarvisStore } from "@/store/useJarvisStore";
import { normalizeAIState } from "@/lib/aiState";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws";
const RECONNECT_INTERVAL_MS = 3000;
const MAX_RECONNECT_ATTEMPTS = 20;

/**
 * Centralized WebSocket client manager for the J.A.R.V.I.S. realtime protocol.
 *
 * - Singleton pattern — only one connection at a time.
 * - Automatic reconnection with capped retries.
 * - Parses typed { event, payload } frames and dispatches to Zustand.
 */
class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private intentionalClose = false;

  /** Open a connection (idempotent — will not duplicate). */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING) {
      return;
    }

    this.intentionalClose = false;

    try {
      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => {
        console.log("[JARVIS WS] Connected to", WS_URL);
        this.reconnectAttempts = 0;
        useJarvisStore.getState().setConnected(true);
      };

      this.ws.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch {
          console.warn("[JARVIS WS] Non-JSON message received:", event.data);
        }
      };

      this.ws.onclose = () => {
        const reason = this.ws?.code === 1000 ? "Normal closure" : `Code ${this.ws?.code || "unknown"}`;
        console.log("[JARVIS WS] Connection closed:", {
          reason,
          code: this.ws?.code,
          timestamp: new Date().toISOString(),
        });
        useJarvisStore.getState().setConnected(false);
        this.ws = null;

        if (!this.intentionalClose) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (err) => {
        const errorDetail = err instanceof Event 
          ? `WebSocket error event (${this.ws?.readyState})`
          : String(err);
        console.error("[JARVIS WS] Error:", {
          message: errorDetail,
          readyState: this.ws?.readyState,
          url: WS_URL,
          timestamp: new Date().toISOString(),
        });
        // onclose will fire next and handle reconnect
      };
    } catch (err) {
      console.error("[JARVIS WS] Failed to create WebSocket:", err);
      this.scheduleReconnect();
    }
  }

  /** Cleanly close the connection (no auto-reconnect). */
  disconnect(): void {
    this.intentionalClose = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    useJarvisStore.getState().setConnected(false);
  }

  /** Process a parsed message frame from the server. */
  private handleMessage(data: { event?: string; payload?: Record<string, unknown> }): void {
    if (!data.event) return;

    const store = useJarvisStore.getState();
    const timestamp = new Date().toISOString();

    // Push every event into the timeline
    store.pushEvent({
      timestamp: (data.payload?.timestamp as string) || timestamp,
      event: data.event,
      payload: data.payload || {},
    });

    // React to specific event types
    switch (data.event) {
      case "STATE_CHANGE":
        if (data.payload?.state) {
          const nextState = normalizeAIState(data.payload.state);
          if (!nextState) {
            console.warn(`[JARVIS WS] ${timestamp} Ignoring unknown AI state:`, data.payload.state);
            break;
          }

          const currentState = store.currentState;
          store.setCurrentState(nextState);
          console.log(
            `[JARVIS WS] ${timestamp} STATE_CHANGE: ${currentState} -> ${nextState}`
          );
        }
        break;

      case "CONNECTION_ACK":
        console.log(`[JARVIS WS] ${timestamp} CONNECTION_ACK:`, data.payload?.message);
        break;

      default:
        console.log(`[JARVIS WS] ${timestamp} Event:`, data.event, data.payload);
    }
  }

  /** Schedule a reconnection attempt with a fixed interval. */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.warn("[JARVIS WS] Max reconnect attempts reached. Giving up.");
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `[JARVIS WS] Reconnecting in ${RECONNECT_INTERVAL_MS}ms (attempt ${this.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`
    );

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, RECONNECT_INTERVAL_MS);
  }

  /** Get current connection status information. */
  getStatus(): { connected: boolean; url: string; readyState?: number } {
    return {
      connected: this.ws?.readyState === WebSocket.OPEN,
      url: WS_URL,
      readyState: this.ws?.readyState,
    };
  }
}

// Singleton export
export const wsManager = new WebSocketManager();
