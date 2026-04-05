"""
Deliveries router — ported from backend2 Node.js to FastAPI.
"""
import math
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional
from pydantic import BaseModel
from app.db.database import get_db

router = APIRouter(prefix="/api/v1/deliveries", tags=["Deliveries"])


def haversine_metres(lat1, lng1, lat2, lng2) -> float:
    R = 6371000
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlng / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


class DeliveryCreate(BaseModel):
    order_id: str
    worker_id: int
    dest_lat: float
    dest_lng: float
    dest_address: Optional[str] = None


class DeliveryStatusUpdate(BaseModel):
    status: str
    worker_decision: Optional[str] = None
    notes: Optional[str] = None


@router.get("/")
def list_deliveries(
    status: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    try:
        sql = """
            SELECT d.*, w.worker_name
            FROM deliveries d
            LEFT JOIN workers w ON w.worker_id = d.worker_id
            WHERE 1=1
        """
        params = {}
        if status:
            sql += " AND d.status = :status"
            params["status"] = status
        sql += " ORDER BY d.created_at DESC LIMIT :limit"
        params["limit"] = limit

        rows = db.execute(text(sql), params).mappings().all()
        return {"success": True, "data": [dict(r) for r in rows]}
    except Exception as e:
        return {"success": True, "data": [], "note": str(e)}


@router.get("/{delivery_id}")
def get_delivery(delivery_id: int, db: Session = Depends(get_db)):
    try:
        row = db.execute(
            text("""
                SELECT d.*, w.worker_name FROM deliveries d
                LEFT JOIN workers w ON w.worker_id = d.worker_id
                WHERE d.id = :id LIMIT 1
            """),
            {"id": delivery_id}
        ).mappings().first()
        if not row:
            raise HTTPException(status_code=404, detail="Delivery not found")
        return {"success": True, "data": dict(row)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/")
def create_delivery(data: DeliveryCreate, db: Session = Depends(get_db)):
    try:
        # Check risk zones proximity
        zones = db.execute(
            text("SELECT * FROM risk_zones WHERE is_active = true")
        ).mappings().all()

        in_risk_zone = False
        risk_zone_id = None
        for zone in zones:
            dist = haversine_metres(
                data.dest_lat, data.dest_lng,
                float(zone["lat"]), float(zone["lng"])
            )
            if dist <= float(zone.get("radius_m", 500)):
                in_risk_zone = True
                risk_zone_id = zone["id"]
                break

        result = db.execute(
            text("""
                INSERT INTO deliveries (order_id, worker_id, dest_lat, dest_lng, dest_address, in_risk_zone, risk_zone_id)
                VALUES (:order_id, :worker_id, :dest_lat, :dest_lng, :dest_address, :in_risk_zone, :risk_zone_id)
                RETURNING id
            """),
            {
                "order_id": data.order_id,
                "worker_id": data.worker_id,
                "dest_lat": data.dest_lat,
                "dest_lng": data.dest_lng,
                "dest_address": data.dest_address,
                "in_risk_zone": in_risk_zone,
                "risk_zone_id": risk_zone_id,
            }
        )
        db.commit()
        new_id = result.scalar()
        return {
            "success": True,
            "data": {"id": new_id, "in_risk_zone": in_risk_zone, "risk_zone_id": risk_zone_id}
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{delivery_id}/status")
def update_delivery_status(delivery_id: int, data: DeliveryStatusUpdate, db: Session = Depends(get_db)):
    allowed = ["in_progress", "delivered", "failed", "cancelled"]
    if data.status not in allowed:
        raise HTTPException(status_code=400, detail=f"status must be one of {allowed}")
    try:
        db.execute(
            text("UPDATE deliveries SET status = :status, worker_decision = :wd, notes = :notes WHERE id = :id"),
            {"status": data.status, "wd": data.worker_decision, "notes": data.notes, "id": delivery_id}
        )
        db.commit()
        return {"success": True, "message": "Updated"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
