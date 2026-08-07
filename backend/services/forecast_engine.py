"""
Core algorithm class.

1. generate_events()         — build EntryBlocks for all recurring + one-time entries
2. k_sorted_list_merge()     — merge k ArraySortedList using an ArrayMinHeap
3. compute_balance_series()  — sweep line: running balance per date
4. find_risk_periods()       — identify when balance drops below threshold
"""

import calendar
from datetime import date, timedelta
from enum import Enum
from typing import List, Optional, Tuple

from data_structures.array_min_heap import ArrayMinHeap
from data_structures.array_sorted_list import ArraySortedList
from data_structures.entry_block import EntryBlock, SENTINEL


class Cycle(str, Enum):
    WEEKLY = "weekly"
    BIWEEKLY = "biweekly"
    MONTHLY = "monthly"
    ANNUAL = "annual"
    CUSTOM = "custom"


class Direction(str, Enum):
    IN = "in"
    OUT = "out"


class RiskPeriod:
    """
    A stretch of days where balance < threshold, signaling danger zone.
    """
    def __init__(
        self,
        start_date: date,
        end_date: date,
        min_balance: float,
        days_below_threshold: int,
    ):
        self.start_date = start_date
        self.end_date = end_date
        self.min_balance = min_balance
        self.days_below_threshold = days_below_threshold

    def __str__(self) -> str:
        return (
            f"RiskPeriod(start={self.start_date}, end={self.end_date}, "
            f"min_balance={self.min_balance}, days_below={self.days_below_threshold})"
        )

    def __repr__(self) -> str:
        return self.__str__()


class ForecastEngine:
    """
    Fields:
        entries          — list of RecurringEntry / OneTimeEntry objects
        starting_balance — user's current balance (day zero)
        threshold        — minimum balance the user wants to stay above
        window_days      — forecast horizon (7, 14, 30, 90, …)
        from_date        — date to start forecasting from (default: today)
    """

    def __init__(
        self,
        entries: list,
        starting_balance: float,
        threshold: float,
        window_days: int,
        from_date: Optional[date] = None,
    ):
        self.entries = entries
        self.starting_balance = starting_balance
        self.threshold = threshold
        self.window_days = window_days
        self.from_date = from_date or date.today()

    def generate_events(self) -> List[EntryBlock]:
        """
        Generate all EntryBlocks within the forecast window.
        1. For each recurring entry, determine_charge_date() to obtain ArraySortedList of EntryBlocks
        2. For each one-time entry, single EntryBlock in an ArraySortedList
        3. Add SENTINEL to each list
        4. k_sorted_list_merge() all lists to obtain single sorted list of EntryBlocks
        """
        to_date = self.from_date + timedelta(days=self.window_days)
        sorted_lists: List[ArraySortedList] = []

        for entry in self.entries: # O(k)
            sl = ArraySortedList()

            if hasattr(entry, 'cycle'):
                # RecurringEntry
                dates = self.determine_charge_date(entry, to_date)
                for d in dates: # O(d)
                    amount = entry.amount if entry.direction == Direction.IN else -entry.amount
                    sl.add(EntryBlock(d, amount, entry.name)) # O(logN)
            else:
                # OneTimeEntry
                if self.from_date <= entry.date <= to_date:
                    amount = entry.amount if entry.direction == Direction.IN else -entry.amount
                    sl.add(EntryBlock(entry.date, amount, entry.name)) # O(logN)

            if len(sl) > 0:
                sl.add_sentinel()
                sorted_lists.append(sl)

        if not sorted_lists:
            return []

        return self.k_sorted_list_merge(sorted_lists)

    def compute_balance_series(self) -> List[Tuple[date, float]]:
        """
        Sweep line: iterate sorted EntryBlocks and compute running balance.
        Returns: list of (date, balance). 
        The first entry is always (from_date, starting_balance).
        """
        events = self.generate_events()
        return self.determine_balance(events)

    def find_risk_periods(self) -> List[RiskPeriod]:
        """
        Scan the balance series for contiguous stretches where balance < threshold.
        Returns a list of RiskPeriod objects.
        """
        series = self.compute_balance_series()
        if not series:
            return []

        risk_periods: List[RiskPeriod] = []
        in_risk = False
        risk_start = None
        risk_min = None
        days_below = 0

        for d, balance in series:
            if balance < self.threshold:
                if not in_risk:
                    in_risk = True
                    risk_start = d
                    risk_min = balance
                    days_below = 1
                else:
                    risk_min = min(risk_min, balance)
                    days_below += 1
            else:
                if in_risk:
                    risk_periods.append(
                        RiskPeriod(risk_start, d - timedelta(days=1), risk_min, days_below)
                    )
                    in_risk = False

        # Handle risk that extends to the end of the window
        if in_risk:
            last_date = series[-1][0]
            risk_periods.append(
                RiskPeriod(risk_start, last_date, risk_min, days_below)
            )

        return risk_periods

    def determine_charge_date(self, event, to_date: date) -> List[date]:
        """
        Generate all recurring dates for an event within the forecast window.
        Uses the event's cycle (week, biweek, monthly, anually) and start_date.
        """
        dates: List[date] = []

        if event.cycle in (Cycle.WEEKLY, Cycle.BIWEEKLY):
            # Step forward by weeks — no month-end edge cases
            step = timedelta(weeks=1 if event.cycle == Cycle.WEEKLY else 2)
            current = event.start_date
            while current < self.from_date:
                current += step
            while current <= to_date:
                dates.append(current)
                current += step

        elif event.cycle == Cycle.MONTHLY:
            # Calculate from original start_date to preserve anchor day
            n = 0
            current = self._add_months(event.start_date, n)
            while current < self.from_date:
                n += 1
                current = self._add_months(event.start_date, n)
            while current <= to_date:
                dates.append(current)
                n += 1
                current = self._add_months(event.start_date, n)

        elif event.cycle == Cycle.ANNUAL:
            # Calculate from original start_date to preserve anchor day
            n = 0
            current = self._add_months(event.start_date, n * 12)
            while current < self.from_date:
                n += 1
                current = self._add_months(event.start_date, n * 12)
            while current <= to_date:
                dates.append(current)
                n += 1
                current = self._add_months(event.start_date, n * 12)

        elif event.cycle == Cycle.CUSTOM:
            # Step forward by custom_days 
            step = timedelta(days=event.custom_days)
            current = event.start_date
            while current < self.from_date:
                current += step
            while current <= to_date:
                dates.append(current)
                current += step

        return dates

    def k_sorted_list_merge(self, sorted_lists: List[ArraySortedList]) -> List[EntryBlock]:
        """
        K-way merge of sorted lists using ArrayMinHeap.
        Each ArraySortedList has its pointer at the first element.
        ArrayMinHeap stores ArraySortedList objects, 
        heap property maintained by pointer of EntryBlock.

        Complexity: O(N log K),
        N 
        = total time reccuring charge + recurring money in 
        = eg: [1,8,15,22,29,5,12,19,26] + [3,17,31,14,28] + [4,14,24,3,13,23] + [18,18] + [7,7]
        K 
        = number of recurring event 
        = eg: [gym, spotify, monthly salary, xhs income, car loan]
        """
        k = len(sorted_lists)
        heap = ArrayMinHeap(max_items=k)

        # Add all sorted lists to the heap (pointer already at 0)
        for sl in sorted_lists:
            heap.add(sl)

        result: List[EntryBlock] = []

        while len(heap) > 0:
            top_list = heap.peek()
            current_entry = top_list.peek_pointer()

            # If the top list points to SENTINEL, all lists are exhausted
            if current_entry is SENTINEL or current_entry.date == date.max:
                break

            # Extract the top list (smallest element)
            top_list = heap.extract_root()
            result.append(top_list.peek_pointer())
            # Increment pointer
            top_list.increment_pointer()
            # Add back ArraySortedList to ArrayMinHeap with incremented pointer
            heap.add(top_list)

        return result

    def determine_balance(self, events: List[EntryBlock]) -> List[Tuple[date, float]]:
        """
        Compute running balance per unique date.
        Multiple events on the same day are summed.
        Series starts with (from_date, starting_balance).
        """
        if not events:
            return [(self.from_date, self.starting_balance)]

        # start with (from_date, starting_balance)
        balance_series: List[Tuple[date, float]] = [(self.from_date, self.starting_balance)]
        running_balance = self.starting_balance
        current_date = events[0].date
        day_total = 0.0

        for event in events: # O(k)
            if event.date != current_date:
                running_balance += day_total
                balance_series.append((current_date, running_balance))
                current_date = event.date
                day_total = 0.0
            day_total += event.net_charge

        running_balance += day_total
        balance_series.append((current_date, running_balance))

        return balance_series

    def _next_occurrence(self, current: date, cycle: Cycle, custom_days: int = None) -> Optional[date]:
        """
        Return the next date after current for the given cycle, or None if invalid.
        """
        if cycle == Cycle.WEEKLY:
            return current + timedelta(weeks=1)
        elif cycle == Cycle.BIWEEKLY:
            return current + timedelta(weeks=2)
        elif cycle == Cycle.MONTHLY:
            return self._add_months(current, 1)
        elif cycle == Cycle.ANNUAL:
            return self._add_months(current, 12)
        elif cycle == Cycle.CUSTOM and custom_days is not None:
            return current + timedelta(days=custom_days)
        return None

    @staticmethod
    def _add_months(start: date, months: int) -> date:
        """
        Add months to a date, rolling to the last day of the month if needed.
        Take into account that each month have different number of days (eg: Jan 31 days, Feb 28/29 days, Apr 30 days)
        """
        year = start.year + (start.month - 1 + months) // 12
        month = (start.month - 1 + months) % 12 + 1
        day = start.day
        last_day = calendar.monthrange(year, month)[1]
        return date(year, month, min(day, last_day))
