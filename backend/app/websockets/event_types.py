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
    PROCESSING = "PROCESSING"
    RESPONDING = "RESPONDING"
    ERROR = "ERROR"


VALID_STATE_TRANSITIONS = {
    JarvisState.IDLE: {JarvisState.LISTENING, JarvisState.ERROR},
    JarvisState.LISTENING: {JarvisState.THINKING, JarvisState.ERROR},
    JarvisState.THINKING: {JarvisState.PROCESSING, JarvisState.ERROR},
    JarvisState.PROCESSING: {JarvisState.RESPONDING, JarvisState.ERROR},
    JarvisState.RESPONDING: {JarvisState.IDLE, JarvisState.ERROR},
    JarvisState.ERROR: {JarvisState.ERROR},
}


def can_transition(from_state: JarvisState, to_state: JarvisState) -> bool:
    """Return whether a state transition is allowed by the Phase 2B model."""
    return from_state == to_state or to_state in VALID_STATE_TRANSITIONS[from_state]
