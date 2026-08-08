import { ArrowDownLeft, ArrowUpRight, Trash2 } from 'lucide-react'

function RecurringEntryCard({
    id,
    name,
    amount,
    cycle,
    start_date,
    direction,
    custom_days,
    onDelete
}) {
  const isIn = direction === 'in'

  const cycleLabel = cycle === 'custom'
    ? `Every ${custom_days} days`
    : cycle.charAt(0).toUpperCase() + cycle.slice(1)

  return (
    <div className={`entry-card ${isIn ? 'entry-in' : 'entry-out'}`}>
      <div className="entry-direction">
        {isIn ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
      </div>
      <div className="entry-body">
        <div className="entry-name">{name}</div>
        <div className="entry-meta">
          <span className="entry-badge">Recurring</span>
          <span className="entry-cycle">{cycleLabel}</span>
          <span className="entry-date">{start_date}</span>
        </div>
      </div>
      <div className={`entry-amount ${isIn ? 'amount-in' : 'amount-out'}`}>
        {isIn ? '+' : '-'}${amount.toFixed(2)}
      </div>
      {onDelete && (
        <button className="entry-delete" onClick={() => onDelete(id)}>
          <Trash2 size={16} />
        </button>
      )}
    </div>
  )
}

export default RecurringEntryCard
