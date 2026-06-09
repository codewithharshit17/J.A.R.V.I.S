import logging
from datetime import datetime, timezone

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.websockets.manager import manager
from app.websockets.schemas import WebSocketEvent, StateChangeRequest
from app.websockets.event_types import EventType

logger = logging.getLogger("jarvis.websocket")

router = APIRouter()


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

    event = WebSocketEvent(
        event=EventType.STATE_CHANGE,
        payload={
            "state": body.state.value,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )

    await manager.broadcast(event.model_dump())

    return {
        "success": True,
        "broadcast_to": manager.active_count,
        "event": event.model_dump(),
    }


# ---------------------------------------------------------------------------
# Test HTTP endpoint - GET /api/test/thinking
# ---------------------------------------------------------------------------
@router.get("/api/test/thinking")
async def test_thinking_state():
    """Trigger the Phase 2A THINKING state broadcast."""

    event = WebSocketEvent(
        event=EventType.STATE_CHANGE,
        payload={
            "state": "THINKING",
        },
    )

    await manager.broadcast(event.model_dump())

    return {"success": True}
