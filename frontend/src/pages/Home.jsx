import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useEntryStore } from '../store/useEntryStore'
import { useForecastStore } from '../store/useForecastStore'
import CheckForecastForm from '../components/CheckForecastForm'
import Forecast from '../components/Forecast'
import AddIncomeForm from '../components/AddIncomeForm'
import RecurringEntryCard from '../components/RecurringEntryCard'
import OneTimeEntryCard from '../components/OneTimeEntryCard'
import './home.css'

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
    window_days,
    starting_balance,
    threshold,
    forecastList,
    riskPeriodList,
    getMyForecast, 
    getMyRiskPeriod
  } = useForecastStore();

  const [filter, setFilter] = useState('all');
  const [showForecastForm, setShowForecastForm] = useState(false);
  const [showForecast, setShowForecast] = useState(false);

  useEffect(() => {
    getAllEntries();
  }, [getAllEntries]);

  const merged = [
    ...entries.recurring.map(e => ({ ...e, type: 'recurring', sortDate: e.start_date })),
    ...entries.onetime.map(e => ({ ...e, type: 'onetime', sortDate: e.date })),
  ].sort((a, b) => new Date(a.sortDate) - new Date(b.sortDate));

  const filtered = filter === 'all'
    ? merged
    : merged.filter(e => e.type === filter);

  const handleDelete = (entry_id) => {
    deleteEntry(entry_id);
  };

  const handleForecastCheck = async ({ window_days, threshold, starting_balance }) => {
    try {
      await Promise.all([
        getMyForecast(window_days, starting_balance, threshold),
        getMyRiskPeriod(window_days, starting_balance, threshold),
      ]);
      setShowForecastForm(false);
      setShowForecast(true);
    } catch (error) {
      console.log("Error fetching forecast:", error);
    }
  };

  const toggleForecastForm = () => {
    if (showForecast) {
      setShowForecast(false);
    }
    setShowForecastForm(prev => !prev);
  };

  return (
    <div>
      
      {/* check forecast button */}
      <button className="forecast-toggle-btn" onClick={toggleForecastForm}>
        Check Balance Forecast
      </button>

      {/* if check forecast button clicked, render CheckForecastForm */}
      {showForecastForm && (
        <CheckForecastForm 
          onCheck={handleForecastCheck}
          onClose={() => setShowForecastForm(false)}
        />
      )}

      {/* when the check button of CheckForecastForm clicked, render Forecast */}
      {showForecast && (
        <Forecast 
          window_days={window_days}
          threshold={threshold}
          starting_balance={starting_balance}
          balance_series={forecastList}
          risk_period_list={riskPeriodList}
          onClose={() => setShowForecast(false)}
        />
      )}

      {/* create entry button */}
      <div>
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

      {/* display all previous entries in sorted date order*/}
      <div className="entry-section">
        {/* filter by recurring/onetime section with clear all */}
        <div className="entry-section-header">
          <h2>Your Entries</h2>
          <div className="entry-filters">
            <button
              className={`entry-filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`entry-filter-btn ${filter === 'recurring' ? 'active' : ''}`}
              onClick={() => setFilter('recurring')}
            >
              Recurring
            </button>
            <button
              className={`entry-filter-btn ${filter === 'onetime' ? 'active' : ''}`}
              onClick={() => setFilter('onetime')}
            >
              One-time
            </button>
          </div>
        </div>

        <div className="entry-list">
          {filtered.length === 0 ? (
            <div className="entry-empty">No entries yet. Add an income or recurring bill to get started.</div>
          ) : (
            filtered.map(e => e.type === 'recurring' ? (
              <RecurringEntryCard
                key={e.entry_id}
                id={e.entry_id}
                name={e.name}
                amount={e.amount}
                cycle={e.cycle}
                start_date={e.start_date}
                direction={e.direction}
                custom_days={e.custom_days}
                onDelete={handleDelete}
              />
            ) : (
              <OneTimeEntryCard
                key={e.entry_id}
                id={e.entry_id}
                name={e.name}
                amount={e.amount}
                date={e.date}
                direction={e.direction}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
