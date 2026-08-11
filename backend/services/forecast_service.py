from typing import List, Tuple
from datetime import date

from models.entry import RecurringEntry, OneTimeEntry
from services.forecast_engine import ForecastEngine, RiskPeriod


class ForecastService:
    """
    Service class to forecast the balance of each day within the next window days.
    Complex algorithm is stored in forecast_engine.py.
    """

    @staticmethod
    async def get_my_forecast(
        user_id: str,
        window_days: int,
        starting_balance: float,
        threshold: float,
    ) -> dict:
        recurring = await RecurringEntry.find(RecurringEntry.user_id == user_id).to_list()
        onetime = await OneTimeEntry.find(OneTimeEntry.user_id == user_id).to_list()
        entries = recurring + onetime

        engine = ForecastEngine(
            entries=entries,
            starting_balance=starting_balance,
            threshold=threshold,
            window_days=window_days,
        )
        balance_series = engine.compute_balance_series()

        return {
            "window_days": window_days,
            "starting_balance": starting_balance,
            "threshold": threshold,
            "balance_series": [
                {"date": d.isoformat(), "balance": balance, "entries": entries}
                for d, balance, entries in balance_series
            ],
        }

    @staticmethod
    async def get_my_risk_period(
        user_id: str,
        window_days: int,
        starting_balance: float,
        threshold: float,
    ) -> dict:
        recurring = await RecurringEntry.find(RecurringEntry.user_id == user_id).to_list()
        onetime = await OneTimeEntry.find(OneTimeEntry.user_id == user_id).to_list()
        entries = recurring + onetime

        engine = ForecastEngine(
            entries=entries,
            starting_balance=starting_balance,
            threshold=threshold,
            window_days=window_days,
        )
        risk_periods = engine.find_risk_periods()

        return {
            "window_days": window_days,
            "starting_balance": starting_balance,
            "threshold": threshold,
            "risk_periods": [
                {
                    "start_date": rp.start_date.isoformat(),
                    "end_date": rp.end_date.isoformat(),
                    "min_balance": rp.min_balance,
                    "days_below_threshold": rp.days_below_threshold,
                }
                for rp in risk_periods
            ],
        }
