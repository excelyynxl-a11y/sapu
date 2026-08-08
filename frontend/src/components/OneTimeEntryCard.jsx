import React from 'react'

function OneTimeEntryCard({
    id,
    name,
    amount,
    date,
    direction
}) {

  return (
    // if direction="in", OneTimeEntryCard is green (slighly darker than RecurringEntryCard)
    // if direction="out", OneTimeEntryCard is red (slighly darker than RecurringEntryCard)
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
            date 
        </div>
    </div>
  )
}

export default OneTimeEntryCard