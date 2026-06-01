from pydantic import BaseModel
from typing import Any, Dict

from app.websockets.event_types import EventType, JarvisState


class WebSocketEvent(BaseModel):
    """Standard WebSocket message frame.

    Every message on the wire must conform to:
    {
        "event": "STATE_CHANGE",
        "payload": { ... }
    }
    """

    event: EventType
    payload: Dict[str, Any] = {}


class StateChangeRequest(BaseModel):
    """Request body for POST /api/test/state."""

    state: JarvisState