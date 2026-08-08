function RiskCard({
    start_date,
    end_date,
    min_balance,
    days_below_threshold
}) {
  return (
        <div className="risk-card">
            {/* date frame */}
            <div className="risk-card-dates">
                <span>{start_date}</span>
                <span>→</span>
                <span>{end_date}</span>
            </div>

            {/* min balance */}
            <div className="risk-card-row">
                <span>Min balance:</span>
                <span className="risk-card-min">${min_balance.toFixed(2)}</span>
            </div>

            {/* day below threshold */}
            <div className="risk-card-row">
                <span>Days below threshold:</span>
                <span className="risk-card-days">{days_below_threshold}</span>
            </div>
        </div>
  )
}

export default RiskCard
