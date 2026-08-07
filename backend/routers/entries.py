from datetime import date
from enum import Enum

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, Field

from models.user import User
from services.auth_service import AuthService
from services.entry_service import EntryService
from services.forecast_engine import Cycle, Direction

router = APIRouter(prefix="/entries", tags=["Entries"])


class RecurringEntryCreate(BaseModel):
    """
    Request body for POST /entries/recurring
    """
    name: str
    amount: float = Field(gt=0)
    cycle: Cycle
    start_date: date
    direction: Direction


class OneTimeEntryCreate(BaseModel):
    """
    Request body for POST /entries/onetime
    """
    name: str
    amount: float = Field(gt=0)
    date: date
    direction: Direction


@router.post("/recurring", status_code=status.HTTP_201_CREATED)
async def create_recurring_entry(
    entry_data: RecurringEntryCreate,
    user: User = Depends(AuthService.get_current_user),
):
    return await EntryService.create_recurring_entry(str(user.id), entry_data)


@router.post("/onetime", status_code=status.HTTP_201_CREATED)
async def create_onetime_entry(
    entry_data: OneTimeEntryCreate,
    user: User = Depends(AuthService.get_current_user),
):
    return await EntryService.create_onetime_entry(str(user.id), entry_data)

@router.get("/me")
async def get_my_entries(user: User = Depends(AuthService.get_current_user)):
    return await EntryService.get_my_entries(str(user.id))

@router.delete("/{entry_id}", status_code=status.HTTP_200_OK)
async def delete_entry(entry_id: str, user: User = Depends(AuthService.get_current_user)):
    return await EntryService.delete_entry(str(user.id), entry_id)