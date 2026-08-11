import { useState } from 'react'
import { X } from 'lucide-react'

const CYCLES = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Biweekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'annual', label: 'Annually' },
    { value: 'custom', label: 'Custom' },
];

function parseAmount(raw) {
    if (typeof raw !== 'string') return Number(raw);
    const cleaned = raw.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    if (Number.isNaN(parsed)) return NaN;
    return Math.round(parsed * 100) / 100;
}

function AddIncomeForm({
    onCreate,
    onClose
}) {
    const [values, setValues] = useState({
        name: '',
        entry_type: 'recurring',
        date: '',
        amount: '',
        direction: 'in',
        cycle: 'monthly',
        custom_days: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (key) => (e) => {
        setValues(prev => ({ ...prev, [key]: e.target.value }));
        if (errors[key]) {
            setErrors(prev => ({ ...prev, [key]: '' }));
        }
    };

    const validate = () => {
        const nextErrors = {};

        if (!values.name.trim()) {
            nextErrors.name = 'Name is required';
        }

        if (values.date === '') {
            nextErrors.date = 'Date is required';
        }

        const amount = parseAmount(values.amount);
        if (values.amount === '' || Number.isNaN(amount) || amount <= 0) {
            nextErrors.amount = 'Amount must be a positive number';
        }

        if (!['in', 'out'].includes(values.direction)) {
            nextErrors.direction = 'Direction is required';
        }

        if (values.entry_type === 'recurring') {
            if (!values.cycle) {
                nextErrors.cycle = 'Cycle is required';
            }
            if (values.cycle === 'custom') {
                const customDays = Number(values.custom_days);
                if (values.custom_days === '' || Number.isNaN(customDays) || !Number.isInteger(customDays) || customDays <= 0) {
                    nextErrors.custom_days = 'Custom days must be a positive integer';
                }
            }
        }

        return nextErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        const payload = {
            name: values.name.trim(),
            entry_type: values.entry_type,
            amount: parseAmount(values.amount),
            direction: values.direction,
        };

        if (values.entry_type === 'recurring') {
            payload.start_date = values.date;
            payload.cycle = values.cycle;
            if (values.cycle === 'custom') {
                payload.custom_days = Number(values.custom_days);
            }
        } else {
            payload.date = values.date;
        }

        onCreate(payload);
    };

    return (
        <form className="income-form" onSubmit={handleSubmit}>
            {/* add income / recurring bill header */}
            <div className="income-form-header">
                <h3>Add Income / Recurring Bill</h3>
                <button type="button" className="income-form-close" onClick={onClose}>
                    <X size={18} />
                </button>
            </div>

            {/* name input */}
            <div className="income-field">
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    type="text"
                    value={values.name}
                    onChange={handleChange('name')}
                    className={`income-input ${errors.name ? 'error' : ''}`}
                    placeholder="e.g. Salary"
                />
                {errors.name && <span className="income-error">{errors.name}</span>}
            </div>

            {/* recurring / one-time selection */}
            {/* REMARK: if uncomment this section if the app is catered for both one-time and recurring bill / income */}
            {/* <div className="income-field">
                <label>Type</label>
                <div className="income-toggle-group">
                    <button
                        type="button"
                        className={`income-toggle-btn ${values.entry_type === 'recurring' ? 'active' : ''}`}
                        onClick={() => setValues(prev => ({ ...prev, entry_type: 'recurring' }))}
                    >
                        Recurring
                    </button>
                    <button
                        type="button"
                        className={`income-toggle-btn ${values.entry_type === 'onetime' ? 'active' : ''}`}
                        onClick={() => setValues(prev => ({ ...prev, entry_type: 'onetime' }))}
                    >
                        One-Time
                    </button>
                </div>
            </div> */}

            {/* date input */}
            <div className="income-field">
                <label htmlFor="date">
                    {values.entry_type === 'recurring' ? 'Start Date' : 'Date'}
                </label>
                <input
                    id="date"
                    type="date"
                    value={values.date}
                    onChange={handleChange('date')}
                    className={`income-input ${errors.date ? 'error' : ''}`}
                />
                {errors.date && <span className="income-error">{errors.date}</span>}
            </div>

            {/* amount input */}
            <div className="income-field">
                <label htmlFor="amount">Amount</label>
                <input
                    id="amount"
                    type="number"
                    step="any"
                    value={values.amount}
                    onChange={handleChange('amount')}
                    className={`income-input ${errors.amount ? 'error' : ''}`}
                    placeholder="e.g. 1000"
                />
                {errors.amount && <span className="income-error">{errors.amount}</span>}
            </div>

            {/* flow selection */}
            <div className="income-field">
                <label>Flow</label>
                <div className="income-toggle-group">
                    <button
                        type="button"
                        className={`income-toggle-btn ${values.direction === 'in' ? 'active' : ''}`}
                        onClick={() => setValues(prev => ({ ...prev, direction: 'in' }))}
                    >
                        In
                    </button>
                    <button
                        type="button"
                        className={`income-toggle-btn ${values.direction === 'out' ? 'active' : ''}`}
                        onClick={() => setValues(prev => ({ ...prev, direction: 'out' }))}
                    >
                        Out
                    </button>
                </div>
                {errors.direction && <span className="income-error">{errors.direction}</span>}
            </div>

            {/* billing cycle input */}
            {values.entry_type === 'recurring' && (
                <>
                    <div className="income-field">
                        <label htmlFor="cycle">Billing Cycle</label>
                        <select
                            id="cycle"
                            value={values.cycle}
                            onChange={handleChange('cycle')}
                            className={`income-input ${errors.cycle ? 'error' : ''}`}
                        >
                            {CYCLES.map(cycle => (
                                <option key={cycle.value} value={cycle.value}>
                                    {cycle.label}
                                </option>
                            ))}
                        </select>
                        {errors.cycle && <span className="income-error">{errors.cycle}</span>}
                    </div>

                    {values.cycle === 'custom' && (
                        <div className="income-field">
                            <label htmlFor="custom_days">Custom Days</label>
                            <input
                                id="custom_days"
                                type="number"
                                value={values.custom_days}
                                onChange={handleChange('custom_days')}
                                className={`income-input ${errors.custom_days ? 'error' : ''}`}
                                placeholder="e.g. 15"
                            />
                            {errors.custom_days && <span className="income-error">{errors.custom_days}</span>}
                        </div>
                    )}
                </>
            )}

            {/* add button  */}
            <button type="submit" className="income-submit-btn">
                Add
            </button>
        </form>
    )
}

export default AddIncomeForm
