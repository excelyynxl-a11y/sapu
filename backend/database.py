import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from models.user import User
from models.entry import RecurringEntry, OneTimeEntry


async def init_db():
    """
    Connect to MongoDB Atlas and initialise Beanie with all document models.
    """
    client = AsyncIOMotorClient(os.environ["MONGO_URI"])
    await init_beanie(
        database=client["sapu"],
        document_models=[User, RecurringEntry, OneTimeEntry],
    )
