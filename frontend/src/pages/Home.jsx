
import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useEntryStore } from '../store/useEntryStore'
import { useForecastStore } from '../store/useForecastStore'
import CheckForecastForm from '../components/CheckForecastForm'
import Forecast from '../components/Forecast'
import AddIncomeForm from '../components/AddIncomeForm'

function Home() {

  const {
    authUser
  } = useAuthStore();

  const {
    entries,
    getAllEntries,
    createEntry,
    deleteEntry
  } = useEntryStore();

  const { 
    risk_period_list, 
    balance_series, 
    getMyForecast, 
    getMyRiskPeriod
  } = useForecastStore();

  return (
    <div>
      <div>
        {/* check forecast button */}
        Check Balance Forecast 
      </div>

      {/* if check froecast button clicked, render CheckForecastForm */}
      <CheckForecastForm 
        onCheck={() => {}}
      />

      {/* when the check button of CheckForecastForm clicked, render Forecast */}
      <Forecast 
        window_days={100}
        threshold={1000}
        starting_balance={1000}
        balance_series={[]}
        risk_period_list={[]}
        onClose={() => {}}
      />

      <div>
        {/* create entry button */}
        Add Income / Recurring Bill 
        <div>
          Plug in your income or recurring bill
        </div>
      </div>

      {/* if create entry button clicked, render AddIncomeForm */}
      <AddIncomeForm 
        onCreate={() => {}}
        onClose={() => {}}
      />
    </div>
  )
}

export default Home