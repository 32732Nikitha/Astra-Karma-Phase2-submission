from sqlalchemy.orm import Session
from app.db.models.worker import Worker


def create_worker(data: dict, db: Session):
    worker = Worker(**data)

    db.add(worker)
    db.commit()
    db.refresh(worker)

    return worker


def get_worker_by_id(worker_id: int, db: Session):
    return db.query(Worker).filter(Worker.worker_id == worker_id).first()


def update_worker(worker_id: int, data: dict, db: Session):
    worker = get_worker_by_id(worker_id, db)

    for key, value in data.items():
        setattr(worker, key, value)

    db.commit()
    db.refresh(worker)

    return worker