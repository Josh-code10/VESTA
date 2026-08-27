from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class AuthUser(BaseModel):
    uid: str = "usr_executive_01"
    email: str = "ceo@nexasphere.com"
    display_name: str = "Executive Leadership"
    photo_url: Optional[str] = None
    is_authenticated: bool = True

@router.get("/me", response_model=AuthUser)
async def get_current_user():
    return AuthUser()

@router.post("/login", response_model=AuthUser)
async def mock_login():
    return AuthUser()
