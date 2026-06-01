"use client";

import { useEffect } from "react";
import { wsManager } from "@/services/websocket/WebSocketManager";

/**
 * React hook that manages the WebSocket lifecycle.
 *
 * Mount once at a high level (e.g. CinematicScrollEngine or layout).
 * Connects on mount, disconnects on unmount.
 */
export function useJarvisWebSocket(): void {
  useEffect(() => {
    wsManager.connect();

    return () => {
      wsManager.disconnect();
    };
  }, []);
}
