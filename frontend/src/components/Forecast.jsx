import { ChevronUp } from 'lucide-react'
import ForecastCard from './ForecastCard'
import RiskCard from './RiskCard'

function Forecast({
    window_days,
    threshold,
    starting_balance, 
    balance_series,
    risk_period_list,
    onClose
}) {
    return (
        <div className="forecast-section">

            {/* close button */}
            <button className="forecast-fold-btn" onClick={onClose}>
                <ChevronUp size={20} />
            </button>

            {/* statement */}
            <div className="forecast-header">
                With <strong>${starting_balance.toFixed(2)}</strong> as starting balance,
                the next <strong>{window_days}</strong> days forecast looks like:
            </div>

            {/* display ForecastCard */}
            <div className="forecast-list">
                {balance_series.map((item, index) => (
                    <ForecastCard 
                        key={index}
                        date={item.date}
                        balance={item.balance}
                        threshold={threshold}
                        entries={item.entries}
                    />
                ))}
            </div>

            {/* risk summary header */}
            <div className="forecast-risk-header">
                Risk Summary
            </div>

            {/* display RiskCard  */}
            <div className="risk-list">
                {risk_period_list.length === 0 ? (
                    <div className="risk-empty">No risk periods — your balance stays above the threshold.</div>
                ) : (
                    risk_period_list.map((item, index) => (
                        <RiskCard 
                        key={index}
                        start_date={item.start_date}
                        end_date={item.end_date}
                        min_balance={item.min_balance}
                        days_below_threshold={item.days_below_threshold}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default Forecast
