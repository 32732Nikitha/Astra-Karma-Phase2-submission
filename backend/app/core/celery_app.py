from celery import Celery
import os

CELERY_BROKER = os.getenv("REDIS_URL", "redis://localhost:6379/0")
CELERY_BACKEND = CELERY_BROKER

celery_app = Celery(
    "bhima_astra",
    broker=CELERY_BROKER,
    backend=CELERY_BACKEND
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)