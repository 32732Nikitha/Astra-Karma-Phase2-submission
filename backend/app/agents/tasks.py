from app.core.celery_app import celery_app
from app.core.redis_client import redis_client
from datetime import datetime


def update_state(agent, status):
    redis_client.hset(f"agent:{agent}", mapping={
        "status": status,
        "last_run": str(datetime.utcnow())
    })


# 🔥 MONITOR AGENT
@celery_app.task
def monitor_agent():
    update_state("monitor", "running")

    # simulate API polling
    redis_client.set("zone:1:score", 75)

    update_state("monitor", "idle")


# 🔥 TRIGGER AGENT
@celery_app.task
def trigger_agent():
    update_state("trigger", "running")

    score = redis_client.get("zone:1:score")

    if score and int(score) > 70:
        redis_client.publish("events", "TRIGGER_FIRED")

    update_state("trigger", "idle")


# 🔥 FRAUD AGENT
@celery_app.task
def fraud_agent():
    update_state("fraud", "running")
    update_state("fraud", "idle")


# 🔥 PAYOUT AGENT
@celery_app.task
def payout_agent():
    update_state("payout", "running")

    redis_client.publish("events", "PAYOUT_DONE")

    update_state("payout", "idle")