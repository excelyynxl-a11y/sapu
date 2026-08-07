from fastapi import APIRouter, Depends, status
from pydantic import BaseModel

from models.user import User
from services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


class UserRegister(BaseModel):
    """
    Request body for POST /auth/register.
    """
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    """
    Request body for POST /auth/login.
    """
    email: str
    password: str


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    return await AuthService.register_user(user_data)


@router.post("/login")
async def login(user_data: UserLogin):
    return await AuthService.authenticate_user(user_data)


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout():
    return {"message": "Logged out successfully"}


@router.get("/me")
async def get_me(user: User = Depends(AuthService.get_current_user)):
    return {
        "user_id": str(user.id),
        "username": user.username,
        "email": user.email,
    }
