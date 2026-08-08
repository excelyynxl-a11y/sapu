import React from 'react'
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
    <div>
        <div>
            {/* close button */}
            X
        </div>
        <div>
            {/* header */}
            With starting_balance as starting balance,
            the next window_days forecast looks like:
        </div>

        <div>
            {/* render each item in balance_series onto a ForecastCard */}
            {balance_series.map((key, item) => (
                <ForecastCard 
                    date={item.date}
                    balance={item.balance}
                    threshold={threshold}
                />
            ))}
            
        </div>

        <div>
            {/* risk summary */}
            Risk Summary 
        </div>

        <div>
            {/* render each item in risk_period_list onto a RiskCard */}
            {risk_period_list.map((key, item) => (
                <RiskCard 
                    start_date={item.start_date}
                    end_date={item.end_date}
                    min_balance={item.min_balance}
                    days_below_threshold={item.days_below_threshold}
                />
            ))}
        </div>
        
    </div>
  )
}

export default Forecast