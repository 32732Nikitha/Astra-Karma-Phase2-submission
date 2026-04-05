from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/agents", tags=["Agents"])


@router.get("/status")
def get_agent_status():
    agents = ["monitor", "trigger", "fraud", "payout", "manager", "insight"]
    result = []

    try:
        from app.core.redis_client import redis_client
        for agent in agents:
            try:
                state = redis_client.hgetall(f"agent:{agent}")
                result.append({
                    "name": agent.capitalize(),
                    "status": state.get("status", "idle"),
                })
            except Exception:
                result.append({"name": agent.capitalize(), "status": "idle"})
    except Exception:
        # Redis not available — return all idle
        for agent in agents:
            result.append({"name": agent.capitalize(), "status": "idle"})

    return {
        "success": True,
        "message": "Agent status fetched",
        "data": result
    }