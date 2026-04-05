from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import os

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s"
)

app = FastAPI(title="BHIMA ASTRA API", version="1.0.0")


@app.on_event("startup")
def _db_create_and_seed():
    from app.db.database import Base, engine, SessionLocal
    from app.services.auth_service import (
        ensure_demo_staff_accounts,
        ensure_demo_worker_phone,
    )

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        ensure_demo_staff_accounts(db)
        ensure_demo_worker_phone(db)
    finally:
        db.close()


# ── CORS: set ALLOWED_ORIGINS on Render (comma-separated), e.g. https://your-app.onrender.com
_default_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]
_extra = os.getenv("ALLOWED_ORIGINS", "").strip()
_extra_list = [o.strip() for o in _extra.split(",") if o.strip()] if _extra else []
# Merge Render/production origins with local dev defaults (deduped)
_cors_origins = list(dict.fromkeys(_extra_list + _default_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
from app.routers import events, payouts, dashboard, workers, policies
from app.routers import triggers, ml, auth, fraud, analytics, ws, agents, metrics

app.include_router(events.router)
app.include_router(payouts.router)
app.include_router(dashboard.router)
app.include_router(workers.router)
app.include_router(policies.router)
app.include_router(triggers.router)
app.include_router(ml.router)
app.include_router(auth.router)
app.include_router(fraud.router)
app.include_router(analytics.router)
app.include_router(ws.router)
app.include_router(agents.router)
app.include_router(metrics.router)

# ── Merged from backend2 ──────────────────────────────────────────────────────
from app.routers import incidents, deliveries, risk_zones, admin

app.include_router(incidents.router)
app.include_router(deliveries.router)
app.include_router(risk_zones.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {"message": "BHIMA ASTRA API is running", "version": "1.0.0"}
