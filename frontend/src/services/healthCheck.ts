/**
 * Health check utilities for verifying backend connectivity and API availability.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface HealthCheckResult {
  isHealthy: boolean;
  apiUrl: string;
  statusCode?: number;
  error?: string;
  timestamp: string;
}

/**
 * Check if the backend API is accessible.
 * Attempts to call the /api/v1/system/status endpoint.
 */
export async function checkAPIHealth(): Promise<HealthCheckResult> {
  const timestamp = new Date().toISOString();
  const healthEndpoint = `${API_BASE_URL}/api/v1/system/status`;

  try {
    console.log(`[HEALTH CHECK] Checking API at ${healthEndpoint}`);
    
    const response = await fetch(healthEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (response.ok) {
      console.log(`[HEALTH CHECK] API is healthy (${response.status})`);
      return {
        isHealthy: true,
        apiUrl: API_BASE_URL,
        statusCode: response.status,
        timestamp,
      };
    } else {
      console.warn(`[HEALTH CHECK] API returned ${response.status}`);
      return {
        isHealthy: false,
        apiUrl: API_BASE_URL,
        statusCode: response.status,
        error: `HTTP ${response.status}: ${response.statusText}`,
        timestamp,
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[HEALTH CHECK] Failed to connect to API:", errorMessage);
    
    return {
      isHealthy: false,
      apiUrl: API_BASE_URL,
      error: errorMessage,
      timestamp,
    };
  }
}

/**
 * Attempt to validate WebSocket connectivity.
 */
export async function checkWebSocketHealth(): Promise<HealthCheckResult> {
  const timestamp = new Date().toISOString();
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws";

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.warn("[HEALTH CHECK] WebSocket connection timed out");
      resolve({
        isHealthy: false,
        apiUrl: wsUrl,
        error: "Connection timeout",
        timestamp,
      });
    }, 5000);

    try {
      console.log(`[HEALTH CHECK] Checking WebSocket at ${wsUrl}`);
      
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        clearTimeout(timeout);
        console.log("[HEALTH CHECK] WebSocket is healthy");
        ws.close();
        resolve({
          isHealthy: true,
          apiUrl: wsUrl,
          statusCode: 101, // Switching Protocols
          timestamp,
        });
      };

      ws.onerror = (event) => {
        clearTimeout(timeout);
        const errorMsg = "WebSocket error";
        console.error(`[HEALTH CHECK] ${errorMsg}:`, event);
        resolve({
          isHealthy: false,
          apiUrl: wsUrl,
          error: errorMsg,
          timestamp,
        });
      };
    } catch (error) {
      clearTimeout(timeout);
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("[HEALTH CHECK] Failed to create WebSocket:", errorMessage);
      
      resolve({
        isHealthy: false,
        apiUrl: wsUrl,
        error: errorMessage,
        timestamp,
      });
    }
  });
}

/**
 * Run comprehensive health checks for both API and WebSocket.
 */
export async function runFullHealthCheck(): Promise<{
  api: HealthCheckResult;
  websocket: HealthCheckResult;
  allHealthy: boolean;
}> {
  console.log("[HEALTH CHECK] Running full diagnostic...");
  
  const api = await checkAPIHealth();
  const websocket = await checkWebSocketHealth();

  const allHealthy = api.isHealthy && websocket.isHealthy;
  
  console.log("[HEALTH CHECK] Results:", {
    api: api.isHealthy ? "✓ Healthy" : `✗ Failed: ${api.error}`,
    websocket: websocket.isHealthy ? "✓ Healthy" : `✗ Failed: ${websocket.error}`,
  });

  return { api, websocket, allHealthy };
}
