from typing import Optional

from pydantic import BaseModel


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    role: Optional[str] = None
    worker_id: Optional[int] = None


class RefreshResponse(BaseModel):
    access_token: str