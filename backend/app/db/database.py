import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

_raw_url = os.getenv("DATABASE_URL")
if not _raw_url:
    raise ValueError("DATABASE_URL not set in .env")

# Render / Heroku sometimes use postgres:// — SQLAlchemy expects postgresql://
if _raw_url.startswith("postgres://"):
    _raw_url = "postgresql://" + _raw_url[len("postgres://") :]

DATABASE_URL = _raw_url

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def import_models():
    """Register all ORM models so relationship() resolution works on first query."""
    from app.db.models import daily_operations  # noqa: F401
    from app.db.models import policy_claims  # noqa: F401
    from app.db.models import portal_staff  # noqa: F401
    from app.db.models import worker  # noqa: F401


import_models()