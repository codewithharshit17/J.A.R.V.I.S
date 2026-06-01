import logging
from typing import List

from fastapi import WebSocket

logger = logging.getLogger("jarvis.websocket")


class ConnectionManager:
    """Manages active WebSocket client connections.

    Supports:
    - Multiple concurrent client connections
    - Safe connect / disconnect lifecycle
    - Typed JSON broadcast to all connected clients
    - Individual message sending
    """

    def __init__(self) -> None:
        self._active_connections: List[WebSocket] = []

    @property
    def active_count(self) -> int:
        return len(self._active_connections)

    async def connect(self, websocket: WebSocket) -> None:
        """Accept a new WebSocket connection and register it."""
        await websocket.accept()
        self._active_connections.append(websocket)
        logger.info(
            "Client connected. Active connections: %d", self.active_count
        )

    def disconnect(self, websocket: WebSocket) -> None:
        """Remove a disconnected client from the pool."""
        if websocket in self._active_connections:
            self._active_connections.remove(websocket)
        logger.info(
            "Client disconnected. Active connections: %d", self.active_count
        )

    async def send_json(self, websocket: WebSocket, data: dict) -> None:
        """Send a JSON payload to a single client."""
        try:
            await websocket.send_json(data)
        except Exception as exc:
            logger.warning("Failed to send to client: %s", exc)
            self.disconnect(websocket)

    async def broadcast(self, data: dict) -> None:
        """Broadcast a JSON payload to every connected client.

        Silently removes clients that error during send.
        """
        stale: List[WebSocket] = []
        for connection in self._active_connections:
            try:
                await connection.send_json(data)
            except Exception as exc:
                logger.warning("Broadcast send failed, removing client: %s", exc)
                stale.append(connection)

        for ws in stale:
            self.disconnect(ws)


# Singleton instance — imported by router and any service that needs to push events
manager = ConnectionManager()