from typing import Annotated
from pydantic import EmailStr
from beanie import Document, Indexed


class User(Document):
    
    username: Annotated[str, Indexed(unique=True)]
    email: Annotated[EmailStr, Indexed(unique=True)]
    password: str

    class Settings:
        name = "users"
