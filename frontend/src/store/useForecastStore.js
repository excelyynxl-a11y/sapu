import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

export const useForecastStore = create((set, get) => ({
    
    starting_balance: null,
    threshold: null,
    forecastList: [],
    riskPeriodList: [],

    getMyForecast: () => {

    },

    getMyRiskPeriod: () => {
        
    }
}))