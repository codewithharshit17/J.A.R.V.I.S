import logging
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect

from app.websockets.manager import manager
from app.websockets.schemas import WebSocketEvent, StateChangeRequest
from app.websockets.event_types import EventType, JarvisState, can_transition, VALID_STATE_TRANSITIONS

logger = logging.getLogger("jarvis.websocket")

router = APIRouter()

# Track current state for transition validation
_current_state: JarvisState = JarvisState.IDLE


async def broadcast_state_change(
    state: JarvisState,
    *,
    include_timestamp: bool = False,
    validate_transition: bool = True,
) -> WebSocketEvent:
    """Broadcast a STATE_CHANGE event through the existing realtime manager.
    
    Args:
        state: Target state to transition to
        include_timestamp: Whether to include server timestamp in payload
        validate_transition: Whether to enforce valid state transitions
    
    Returns:
        WebSocketEvent that was broadcast
    
    Raises:
        ValueError: If validate_transition=True and transition is invalid
    """
    global _current_state
    
    # Validate transition if requested
    if validate_transition and not can_transition(_current_state, state):
        valid_next = VALID_STATE_TRANSITIONS.get(_current_state, set())
        logger.warning(
            f"[TRANSITION BLOCKED] {_current_state.value} -> {state.value} (valid: {[s.value for s in valid_next]})"
        )
        raise ValueError(f"Cannot transition from {_current_state.value} to {state.value}")
    
    # Log state transition with timestamp
    timestamp_str = datetime.now(timezone.utc).isoformat()
    logger.info(
        f"[STATE CHANGE] {_current_state.value} -> {state.value} [{timestamp_str}]"
    )
    
    _current_state = state
    payload = {"state": state.value}
    if include_timestamp:
        payload["timestamp"] = timestamp_str

    event = WebSocketEvent(event=EventType.STATE_CHANGE, payload=payload)
    await manager.broadcast(event.model_dump())
    return event


# ---------------------------------------------------------------------------
# WebSocket endpoint — /ws
# ---------------------------------------------------------------------------
@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """Primary realtime channel for the J.A.R.V.I.S. frontend."""

    await manager.connect(websocket)

    # Send a CONNECTION_ACK so the frontend knows it's live
    ack = WebSocketEvent(
        event=EventType.CONNECTION_ACK,
        payload={
            "message": "J.A.R.V.I.S. realtime link established",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "clients": manager.active_count,
        },
    )
    await manager.send_json(websocket, ack.model_dump())

    try:
        while True:
            # Keep the connection alive; process any inbound messages
            data = await websocket.receive_text()
            logger.debug("Received from client: %s", data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info("WebSocket client disconnected gracefully")
    except Exception as exc:
        manager.disconnect(websocket)
        logger.error("WebSocket error: %s", exc)


# ---------------------------------------------------------------------------
# Test HTTP endpoint — POST /api/test/state
# ---------------------------------------------------------------------------
@router.post("/api/test/state")
async def test_state_change(body: StateChangeRequest):
    """Trigger a STATE_CHANGE broadcast for testing the realtime pipeline.

    Body: { "state": "THINKING" }
    """

    event = await broadcast_state_change(body.state, include_timestamp=True)

    return {
        "success": True,
        "broadcast_to": manager.active_count,
        "event": event.model_dump(),
    }


# ---------------------------------------------------------------------------
# Test HTTP endpoints - GET /api/test/{state}
# ---------------------------------------------------------------------------
@router.get("/api/test/{state_name}")
async def test_state_name(state_name: str):
    """Trigger a Phase 2B STATE_CHANGE broadcast by state name."""
    try:
        state = JarvisState(state_name.upper())
    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=f"Unsupported AI state: {state_name}",
        ) from exc

    await broadcast_state_change(state)

    return {"success": True}
