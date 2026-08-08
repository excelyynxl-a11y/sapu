import { useState } from 'react'
import { X } from 'lucide-react'

function CheckForecastForm({
    onCheck,
    onClose
}) {
  const [values, setValues] = useState({
    window_days: '',
    threshold: '',
    starting_balance: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
        const nextErrors = {};

        ['window_days', 'threshold', 'starting_balance'].forEach((key) => {
        const raw = values[key];
        if (raw === '' || raw === null || raw === undefined) {
            nextErrors[key] = 'This field is required';
            return;
        }

        const num = Number(raw);
        if (Number.isNaN(num)) {
            nextErrors[key] = 'Must be a number';
            return;
        }

        if (!Number.isInteger(num)) {
            nextErrors[key] = 'Must be a positive integer';
            return;
        }

        if (num < 0) {
            nextErrors[key] = 'Must be a positive integer';
            return;
        }
        });

        return nextErrors;
  };

  const handleChange = (key) => (e) => {
        setValues(prev => ({ ...prev, [key]: e.target.value }));
        if (errors[key]) {
        setErrors(prev => ({ ...prev, [key]: '' }));
        }
  };

  const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        onCheck({
            window_days: Number(values.window_days),
            threshold: Number(values.threshold),
            starting_balance: Number(values.starting_balance),
        });
  };

  return (
    <form className="forecast-form" onSubmit={handleSubmit}>
        {/* check balance header */}
        <div className="forecast-form-header">
            <h3>
                Check Balance Forecast
            </h3>
            <button type="button" className="forecast-form-close" onClick={onClose}>
            <X size={18} />
            </button>
        </div>

        {/* windows day input */}
        <div className="forecast-field">
            <label htmlFor="window_days">
                Window Days
            </label>
            <input
                id="window_days"
                type="number"
                value={values.window_days}
                onChange={handleChange('window_days')}
                className={`forecast-input ${errors.window_days ? 'error' : ''}`}
                placeholder="e.g. 30"
            />
            {errors.window_days && <span className="forecast-error">{errors.window_days}</span>}
        </div>

        {/* threshold input */}
        <div className="forecast-field">
            <label htmlFor="threshold">
                Threshold
            </label>
            <input
                id="threshold"
                type="number"
                value={values.threshold}
                onChange={handleChange('threshold')}
                className={`forecast-input ${errors.threshold ? 'error' : ''}`}
                placeholder="e.g. 1000"
            />
            {errors.threshold && <span className="forecast-error">{errors.threshold}</span>}
        </div>

        {/* startinf balance input */}
        <div className="forecast-field">
            <label htmlFor="starting_balance">
                Starting Balance
            </label>
            <input
                id="starting_balance"
                type="number"
                value={values.starting_balance}
                onChange={handleChange('starting_balance')}
                className={`forecast-input ${errors.starting_balance ? 'error' : ''}`}
                placeholder="e.g. 5000"
            />
            {errors.starting_balance && <span className="forecast-error">{errors.starting_balance}</span>}
        </div>

        {/* check button  */}
        <button type="submit" className="forecast-submit-btn">
            Check
        </button>
    </form>
  )
}

export default CheckForecastForm
