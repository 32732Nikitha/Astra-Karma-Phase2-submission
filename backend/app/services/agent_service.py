from app.agents.tasks import (
    monitor_agent,
    trigger_agent,
    fraud_agent,
    payout_agent
)
from app.core.redis_client import redis_client


def run_agent(agent_name: str):

    if agent_name == "monitor":
        monitor_agent.delay()

    elif agent_name == "trigger":
        trigger_agent.delay()

    elif agent_name == "fraud":
        fraud_agent.delay()

    elif agent_name == "payout":
        payout_agent.delay()

    else:
        return {"error": "Invalid agent"}

    return {"message": f"{agent_name} task queued"}


def get_agents_health():
    agents = ["monitor", "trigger", "fraud", "payout"]

    data = {}
    if redis_client is None:
        for a in agents:
            data[a] = {}
        return data
    for a in agents:
        state = redis_client.hgetall(f"agent:{a}")
        data[a] = state

    return data