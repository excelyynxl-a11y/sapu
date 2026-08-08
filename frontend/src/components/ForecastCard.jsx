function ForecastCard({
    date,
    balance,
    threshold
}) {
    const isRisk = balance < threshold;

    return (
        <div className={`forecast-card ${isRisk ? 'forecast-risk' : 'forecast-safe'}`}>
            {/* date  */}
            <div className="forecast-card-date">
                {date}
            </div>
            {/* balance */}
            <div className="forecast-card-balance">
                ${balance.toFixed(2)}
            </div>
        </div>
    )
}

export default ForecastCard
