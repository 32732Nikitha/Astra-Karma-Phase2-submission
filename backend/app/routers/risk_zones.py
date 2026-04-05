"""
Risk Zones router — ported from backend2 Node.js to FastAPI.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional
from pydantic import BaseModel
from app.db.database import get_db

router = APIRouter(prefix="/api/v1/risk-zones", tags=["RiskZones"])


class RiskZoneCreate(BaseModel):
    name: str
    lat: float
    lng: float
    severity: str = "medium"
    radius_m: float = 500.0
    description: Optional[str] = None


@router.get("/")
def list_risk_zones(
    active_only: bool = False,
    db: Session = Depends(get_db)
):
    try:
        sql = "SELECT * FROM risk_zones WHERE 1=1"
        params = {}
        if active_only:
            sql += " AND is_active = true"
        sql += " ORDER BY created_at DESC"
        rows = db.execute(text(sql), params).mappings().all()
        return {"success": True, "data": [dict(r) for r in rows]}
    except Exception as e:
        return {"success": True, "data": [], "note": str(e)}


@router.get("/{zone_id}")
def get_risk_zone(zone_id: int, db: Session = Depends(get_db)):
    try:
        row = db.execute(
            text("SELECT * FROM risk_zones WHERE id = :id LIMIT 1"),
            {"id": zone_id}
        ).mappings().first()
        if not row:
            raise HTTPException(status_code=404, detail="Risk zone not found")
        return {"success": True, "data": dict(row)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/")
def create_risk_zone(data: RiskZoneCreate, db: Session = Depends(get_db)):
    try:
        result = db.execute(
            text("""
                INSERT INTO risk_zones (name, lat, lng, severity, radius_m, description)
                VALUES (:name, :lat, :lng, :severity, :radius_m, :description)
                RETURNING id
            """),
            data.dict()
        )
        db.commit()
        return {"success": True, "data": {"id": result.scalar()}}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{zone_id}/deactivate")
def deactivate_zone(zone_id: int, db: Session = Depends(get_db)):
    try:
        db.execute(
            text("UPDATE risk_zones SET is_active = false WHERE id = :id"),
            {"id": zone_id}
        )
        db.commit()
        return {"success": True, "message": "Zone deactivated"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
