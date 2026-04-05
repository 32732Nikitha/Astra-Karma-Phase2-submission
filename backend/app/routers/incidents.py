"""
Incidents router — ported from backend2 Node.js to FastAPI.
Uses PostgreSQL via SQLAlchemy (same DB as main backend).
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional
from pydantic import BaseModel
from app.db.database import get_db

router = APIRouter(prefix="/api/v1/incidents", tags=["Incidents"])


class IncidentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    lat: float
    lng: float
    severity: str = "medium"
    reported_by: Optional[str] = None


class IncidentApprove(BaseModel):
    notes: Optional[str] = None


@router.get("/")
def list_incidents(
    status: Optional[str] = None,
    severity: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """List all incidents with optional filters."""
    try:
        sql = """
            SELECT id, title, description, lat, lng, severity, status,
                   reported_by, created_at
            FROM incidents
            WHERE 1=1
        """
        params = {}
        if status:
            sql += " AND status = :status"
            params["status"] = status
        if severity:
            sql += " AND severity = :severity"
            params["severity"] = severity
        sql += " ORDER BY created_at DESC LIMIT :limit"
        params["limit"] = limit

        rows = db.execute(text(sql), params).mappings().all()
        return {"success": True, "data": [dict(r) for r in rows]}
    except Exception as e:
        # Table may not exist yet
        return {"success": True, "data": [], "note": str(e)}


@router.get("/{incident_id}")
def get_incident(incident_id: int, db: Session = Depends(get_db)):
    try:
        row = db.execute(
            text("SELECT * FROM incidents WHERE id = :id LIMIT 1"),
            {"id": incident_id}
        ).mappings().first()
        if not row:
            raise HTTPException(status_code=404, detail="Incident not found")
        return {"success": True, "data": dict(row)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/")
def create_incident(data: IncidentCreate, db: Session = Depends(get_db)):
    try:
        result = db.execute(
            text("""
                INSERT INTO incidents (title, description, lat, lng, severity, reported_by)
                VALUES (:title, :description, :lat, :lng, :severity, :reported_by)
                RETURNING id
            """),
            data.dict()
        )
        db.commit()
        new_id = result.scalar()
        return {"success": True, "data": {"id": new_id}}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{incident_id}/approve")
def approve_incident(incident_id: int, data: IncidentApprove = IncidentApprove(), db: Session = Depends(get_db)):
    try:
        # Get incident
        row = db.execute(
            text("SELECT * FROM incidents WHERE id = :id LIMIT 1"),
            {"id": incident_id}
        ).mappings().first()
        if not row:
            raise HTTPException(status_code=404, detail="Incident not found")

        incident = dict(row)
        # Create risk zone
        rz = db.execute(
            text("""
                INSERT INTO risk_zones (name, lat, lng, severity)
                VALUES (:name, :lat, :lng, :severity)
                RETURNING id
            """),
            {"name": incident["title"], "lat": incident["lat"],
             "lng": incident["lng"], "severity": incident["severity"]}
        )
        db.commit()
        rz_id = rz.scalar()

        # Update incident
        db.execute(
            text("UPDATE incidents SET status = 'approved', risk_zone_id = :rz_id WHERE id = :id"),
            {"rz_id": rz_id, "id": incident_id}
        )
        db.commit()
        return {"success": True, "message": "Approved and risk zone created", "risk_zone_id": rz_id}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{incident_id}/reject")
def reject_incident(incident_id: int, db: Session = Depends(get_db)):
    try:
        db.execute(
            text("UPDATE incidents SET status = 'rejected' WHERE id = :id"),
            {"id": incident_id}
        )
        db.commit()
        return {"success": True, "message": "Rejected"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
