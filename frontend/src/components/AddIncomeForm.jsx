import React from 'react'

function AddIncomeForm(
    onCreate,
    onClose
) {
  return (
    <div>
        <div>
            {/* close button  */}
            X
        </div>
        <div>
            {/* name */}
            Name: 
        </div>

        <div>
            {/* type */}
            <div>
                Recurring 
            </div>
            <div>
                One-Time
            </div>
        </div>

        <div>
            {/* start date */}
            Start Date:
        </div>

        <div>
            {/* amount */}
            Amount: 
        </div>

        <div>
            {/* flow */}
            <div>
                In 
            </div>
            <div>
                Out
            </div>
        </div>

        <div>
            {/* cycle  */}
            Biling Cycle
            {/* weekly, biweekly, monthly, anually, custom */}

        </div>

        <div>
            {/* add button */}
            Add 
        </div>
    </div>
  )
}

export default AddIncomeForm