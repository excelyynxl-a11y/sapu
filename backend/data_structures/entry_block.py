from datetime import date
from typing import TypeVar, Generic, Optional

T = TypeVar('T')

class EntryBlock(Generic[T]):
    """
    Represents a block of [event, date, net_charge].
    - date: when the charge occurs (using python date type)
    - net_charge: amount (+ or -)
    - event: name of the income / expense (e.g. "gym", "salary")

    Comparison by date in ascending. If happens on the same date, +
    sorted before -.
    """

    def __init__(self, date: date, net_charge: float, event: Optional[str] = None):
        self.date = date
        self.net_charge = net_charge
        self.event = event

    def __lt__(self, other: 'EntryBlock') -> bool:
        if not isinstance(other, EntryBlock):
            return NotImplemented
        
        if self.date == other.date:
            # if same day: higher net_charge comes first
            return self.net_charge > other.net_charge
        return self.date < other.date

    def __le__(self, other: 'EntryBlock') -> bool:
        return self == other or self < other

    def __gt__(self, other: 'EntryBlock') -> bool:
        return not self <= other

    def __ge__(self, other: 'EntryBlock') -> bool:
        return not self < other

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, EntryBlock):
            return NotImplemented
        
        return self.date == other.date and self.net_charge == other.net_charge

    def __str__(self) -> str:
        return f"EntryBlock(event={self.event}, date={self.date}, net_charge={self.net_charge})"

    def __repr__(self) -> str:
        return self.__str__()


# Sentinel EntryBlock — always sorts to the bottom of a min-heap.
# Used as the last element of each ArraySortedList so that when a list's
# pointer is exhausted, that list sinks to the bottom of the heap.
SENTINEL = EntryBlock(date.max, 0, None)


# my_block = EntryBlock(date(2026, 8, 7), 100, "Gym membership")
# print(my_block)
