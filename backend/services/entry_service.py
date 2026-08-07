from fastapi import HTTPException, status

from models.entry import RecurringEntry, OneTimeEntry
from services.forecast_engine import Cycle

class EntryService:
    """
    Service class to create and delete entries.
    """

    @staticmethod
    async def create_recurring_entry(user_id: str, entry_data) -> dict:
        # Validate custom_days
        if entry_data.cycle == Cycle.CUSTOM:
            if entry_data.custom_days is None or entry_data.custom_days <= 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="custom_days must be a positive integer when cycle is 'custom'",
                )
        elif entry_data.custom_days is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="custom_days should only be set when cycle is 'custom'",
            )

        entry = RecurringEntry(
            user_id=user_id,
            name=entry_data.name.strip(),
            amount=entry_data.amount,
            cycle=entry_data.cycle,
            start_date=entry_data.start_date,
            direction=entry_data.direction,
            custom_days=entry_data.custom_days,
        )
        await entry.insert()
        return {
            "message": "Recurring entry created",
            "entry_id": str(entry.id),
            "user_id": entry.user_id,
            "name": entry.name,
            "amount": entry.amount,
            "cycle": entry.cycle.value,
            "start_date": entry.start_date.isoformat(),
            "direction": entry.direction.value,
            "custom_days": entry.custom_days,
        }

    @staticmethod
    async def create_onetime_entry(user_id: str, entry_data) -> dict:
        entry = OneTimeEntry(
            user_id=user_id,
            name=entry_data.name.strip(),
            amount=entry_data.amount,
            date=entry_data.date,
            direction=entry_data.direction,
        )
        await entry.insert()
        return {
            "message": "One-time entry created",
            "entry_id": str(entry.id),
            "user_id": entry.user_id,
            "name": entry.name,
            "amount": entry.amount,
            "date": entry.date.isoformat(),
            "direction": entry.direction.value,
        }

    @staticmethod
    async def get_my_entries(user_id: str) -> dict:
        recurring = await RecurringEntry.find(RecurringEntry.user_id == user_id).to_list()
        onetime = await OneTimeEntry.find(OneTimeEntry.user_id == user_id).to_list()
        return {
            "recurring": [
                {
                    "entry_id": str(e.id),
                    "name": e.name,
                    "amount": e.amount,
                    "cycle": e.cycle.value,
                    "start_date": e.start_date.isoformat(),
                    "direction": e.direction.value,
                    "custom_days": e.custom_days,
                }
                for e in recurring
            ],
            "onetime": [
                {
                    "entry_id": str(e.id),
                    "name": e.name,
                    "amount": e.amount,
                    "date": e.date.isoformat(),
                    "direction": e.direction.value,
                }
                for e in onetime
            ],
        }

    @staticmethod
    async def delete_entry(user_id: str, entry_id: str) -> dict:
        entry = await RecurringEntry.get(entry_id)
        if entry is None:
            entry = await OneTimeEntry.get(entry_id)
        if entry is None or entry.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Entry not found",
            )
        
        await entry.delete()
        return {"message": "Entry deleted"}
