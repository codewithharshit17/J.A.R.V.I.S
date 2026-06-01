from enum import Enum


class EventType(str, Enum):
    """Standard WebSocket event types for the J.A.R.V.I.S. realtime protocol."""

    STATE_CHANGE = "STATE_CHANGE"
    CONNECTION_ACK = "CONNECTION_ACK"
    HEARTBEAT = "HEARTBEAT"
    ERROR = "ERROR"


class JarvisState(str, Enum):
    """Valid J.A.R.V.I.S. orb states that the frontend can render."""

    IDLE = "IDLE"
    LISTENING = "LISTENING"
    THINKING = "THINKING"
    RESPONDING = "RESPONDING"
    ERROR = "ERROR"
