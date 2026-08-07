from typing import Annotated
from datetime import date
from beanie import Document, Indexed
from pydantic import Field
from bson import ObjectId

from services.forecast_engine import Cycle, Direction


class RecurringEntry(Document):
    user_id: Annotated[str, Indexed()] # referring to the user who created this recurringentry
    name: str
    amount: float
    cycle: Cycle
    start_date: date
    direction: Direction

    class Settings:
        name = "recurring_entries"


class OneTimeEntry(Document):
    user_id: Annotated[str, Indexed()] # referring to the user who created this nonrecurringentry
    name: str
    amount: float
    date: date
    direction: Direction

    class Settings:
        name = "onetime_entries"
