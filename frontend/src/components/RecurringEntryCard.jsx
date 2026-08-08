import React from 'react'

function RecurringEntryCard({
    id,
    name,
    amount,
    cycle,
    start_date,
    direction,
    custom_days
}) {

  return (
    // if direction="in", RecurringEntryCard is green 
    // if direction="out", RecurringEntryCard is red 
    <div>
        <div>
            direction logo
        </div>
        <div>
            name
        </div>
        <div>
            amount 
        </div>
        <div>
            cycle / custome day
        </div>
        <div>
            start date 
        </div>
    </div>
  )
}

export default RecurringEntryCard