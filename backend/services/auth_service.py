import os
import re
from datetime import datetime, timedelta

import bcrypt
from jose import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from models.user import User

security = HTTPBearer()


def hash_password(plain: str) -> str:
    """
    Hash a plaintext password with bcrypt. 
    Returns the hashed string.
    """
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()

def verify_password(plain: str, hashed: str) -> bool:
    """
    Return True if plain matches the bcrypt hashed password.
    """
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def create_access_token(data: dict) -> str:
    """
    Create a signed JWT token from environment config.
    """
    secret = os.environ["JWT_SECRET"]
    algorithm = os.environ.get("JWT_ALGORITHM", "HS256")
    expire_minutes = int(os.environ.get("JWT_EXPIRE_MINUTES", 1440))
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=expire_minutes)
    return jwt.encode(payload, secret, algorithm=algorithm)

SPECIAL_CHARS = set("!@#$%^&*()_+-=[]{}|;':\",./<>?")


class AuthService:
    """
    Service class to register, login, logout, getme.
    """

    @staticmethod
    async def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(security),
    ) -> User:
        """
        Decode the JWT from the Authorization header and return the current User.
        """
        token = credentials.credentials
        try:
            secret = os.environ["JWT_SECRET"]
            algorithm = os.environ.get("JWT_ALGORITHM", "HS256")
            payload = jwt.decode(token, secret, algorithms=[algorithm])
            user_id: str = payload.get("sub")

            if user_id is None: 
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token",
                    headers={"WWW-Authenticate": "Bearer"},
                )
        except jwt.ExpiredSignatureError: 
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except jwt.JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user = await User.get(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return user

    @staticmethod
    async def register_user(user_data) -> dict:

        # username cannot be empty
        if not user_data.username or not user_data.username.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username cannot be empty"
            )

        # email cannot be empty
        if not user_data.email or not user_data.email.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email cannot be empty"
            )

        # email must match valid format
        email_pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
        if not re.match(email_pattern, user_data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid email format"
            )

        # password cannot be empty
        if not user_data.password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password cannot be empty"
            )

        # password must have uppercase
        if not any(c.isupper() for c in user_data.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must contain at least one uppercase letter"
            )

        # password must have lowercase
        if not any(c.islower() for c in user_data.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must contain at least one lowercase letter"
            )

        # password must have special character
        if not any(c in SPECIAL_CHARS for c in user_data.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must contain at least one special character (!@#$%^&* etc.)"
            )

        # email must not already exist in database
        existing = await User.find_one(User.email == user_data.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email already exists"
            )

        new_user = User(
            username=user_data.username.strip(),
            email=user_data.email.strip(),
            password=hash_password(user_data.password)
        )
        await new_user.insert()
        return {"message": "User registered successfully"}

    @staticmethod
    async def authenticate_user(user_data) -> dict:
        user = await User.find_one(User.email == user_data.email)
        if not user or not verify_password(user_data.password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"}
            )

        access_token = create_access_token(data={"sub": str(user.id)})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": str(user.id),
            "username": user.username,
            "email": user.email,
        }
