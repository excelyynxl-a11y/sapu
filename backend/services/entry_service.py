from fastapi import HTTPException, status

from models.entry import RecurringEntry, OneTimeEntry

class EntryService:
    """
    Service class to create and delete entries.
    """

    @staticmethod
    async def create_recurring_entry(user_id: str, entry_data) -> dict:
        entry = RecurringEntry(
            user_id=user_id,
            name=entry_data.name.strip(),
            amount=entry_data.amount,
            cycle=entry_data.cycle,
            start_date=entry_data.start_date,
            direction=entry_data.direction,
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
