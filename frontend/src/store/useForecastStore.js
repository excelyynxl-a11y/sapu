import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

export const useForecastStore = create((set) => ({
    window_days: null,
    starting_balance: null,
    threshold: null,
    forecastList: [],
    riskPeriodList: [],

    getMyForecast: async (window_days, starting_balance, threshold) => {
        try {
            const res = await axiosInstance.get("/forecast/me", {
                params: { window_days, starting_balance, threshold }
            });
            set({
                window_days,
                starting_balance,
                threshold,
                forecastList: res.data.balance_series,
            });
            // console.log(res.data.balance_series);
        } catch (error) {
            console.log("Error in getMyForecast:", error);
            throw error;
        }
    },

    getMyRiskPeriod: async (window_days, starting_balance, threshold) => {
        try {
            const res = await axiosInstance.get("/forecast/me/risk", {
                params: { window_days, starting_balance, threshold }
            });
            set({
                riskPeriodList: res.data.risk_periods,
            });
        } catch (error) {
            console.log("Error in getMyRiskPeriod:", error);
            throw error;
        }
    },

    clearForecast: () => set({
        window_days: null,
        starting_balance: null,
        threshold: null,
        forecastList: [],
        riskPeriodList: [],
    })
}))
