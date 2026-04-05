from fastapi import APIRouter, WebSocket
from app.websocket.manager import manager
import asyncio
from app.core.redis_client import redis_client

router = APIRouter()


@router.websocket("/ws/events")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)

    try:
        if redis_client is None:
            while True:
                await asyncio.sleep(30)
        else:
            pubsub = redis_client.pubsub()
            pubsub.subscribe("events")
            while True:
                message = pubsub.get_message(ignore_subscribe_messages=True)
                if message:
                    await manager.broadcast(message["data"])
                await asyncio.sleep(1)
    except Exception:
        pass
    finally:
        manager.disconnect(websocket)