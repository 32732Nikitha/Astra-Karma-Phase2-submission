from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.worker_service import create_worker, get_worker_by_id, update_worker
from app.schemas.common import APIResponse
from app.schemas.worker import WorkerBasicResponse, WorkerFullResponse

router = APIRouter(prefix="/api/v1/workers", tags=["Workers"])


@router.post("/register")
def register_worker(data: dict, db: Session = Depends(get_db)):
    worker = create_worker(data, db)

    return {
        "success": True,
        "message": "Worker created",
        "data": worker
    }


@router.get("/me/{worker_id}", response_model=APIResponse[WorkerBasicResponse])
def get_me(worker_id: int, db: Session = Depends(get_db)):
    worker = get_worker_by_id(worker_id, db)

    return {
        "success": True,
        "message": "Worker fetched",
        "data": worker
    }

@router.get("/{worker_id}", response_model=APIResponse[WorkerFullResponse])
def get_worker(worker_id: int, db: Session = Depends(get_db)):
    worker = get_worker_by_id(worker_id, db)

    return {
        "success": True,
        "message": "Worker fetched",
        "data": worker
    }


@router.patch("/me/{worker_id}")
def update_me(worker_id: int, data: dict, db: Session = Depends(get_db)):
    worker = update_worker(worker_id, data, db)

    return {
        "success": True,
        "message": "Worker updated",
        "data": worker
    }