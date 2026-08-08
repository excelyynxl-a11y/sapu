import React from 'react'

function CheckForecastForm({
    onCheck
}) {
  return (
    <div>
        <div>
            {/* window days input */}
            Window Days:
        </div>

        <div>
            {/* threshold input */}
            Threshold:
        </div>

        <div>
            {/* strating balance input */}
            Starting balance:
        </div>

        <div>
            {/* check button */}
            Check
        </div>
    </div>
  )
}

export default CheckForecastForm