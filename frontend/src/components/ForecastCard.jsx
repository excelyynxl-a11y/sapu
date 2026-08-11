import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

function ForecastCard({
    date,
    balance,
    threshold,
    entries = []
}) {
    const isRisk = balance < threshold;

    const [isExpand, setIsExpand] = useState(false);

    return (
        <div className={`forecast-card ${isRisk ? 'forecast-risk' : 'forecast-safe'}`}>
            <div className="forecast-card-header" onClick={() => setIsExpand(!isExpand)}>
                <div className="forecast-card-top-row">
                    {/* arrow icon onclick to expand */}
                    <div className="forecast-card-arrow">
                        {isExpand ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                    {/* date  */}
                    <div className="forecast-card-date">
                        {date}
                    </div>
                </div>
                {/* balance */}
                <div className="forecast-card-balance">
                    ${balance.toFixed(2)}
                </div>
            </div>

            {/* entries list after expanding */}
            {isExpand && (
                <div className="forecast-card-entries">
                    {entries.length === 0 ? (
                        <div className="forecast-card-no-entries">No entries on this day.</div>
                    ) : (
                        <ul className="forecast-card-entry-list">
                            {entries.map((entry, index) => (
                                <li key={index} className="forecast-card-entry">
                                    <span className="entry-name">{entry.name}</span>
                                    <span className={`entry-charge ${entry.net_charge >= 0 ? 'positive' : 'negative'}`}>
                                        {entry.net_charge >= 0 ? '+' : ''}{entry.net_charge.toFixed(2)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}

export default ForecastCard
