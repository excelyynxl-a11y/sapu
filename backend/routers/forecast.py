from fastapi import APIRouter, Depends, Query, status
from models.user import User
from services.forecast_service import ForecastService
from services.auth_service import AuthService

router = APIRouter(prefix="/forecast", tags=["Forecast"])


@router.get("/me")
async def get_my_forecast(
    user: User = Depends(AuthService.get_current_user),
    window_days: int = Query(..., gt=0, description="Forecast horizon in days"),
    starting_balance: float = Query(..., description="Current account balance"),
    threshold: float = Query(..., description="Minimum balance the user wants to stay above"),
):
    return await ForecastService.get_my_forecast(
        str(user.id), window_days, starting_balance, threshold
    )


@router.get("/me/risk")
async def get_my_risk_period(
    user: User = Depends(AuthService.get_current_user),
    window_days: int = Query(..., gt=0, description="Forecast horizon in days"),
    starting_balance: float = Query(..., description="Current account balance"),
    threshold: float = Query(..., description="Minimum balance the user wants to stay above"),
):
    return await ForecastService.get_my_risk_period(
        str(user.id), window_days, starting_balance, threshold
    )
