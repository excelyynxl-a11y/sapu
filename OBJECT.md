# Object

```

User 
├── fields: userId, name, wallet, forecaseEngine
└── methods:

Wallet 
├── fields: walletId, amount
└── methods:

CashFlowEntry (abstract)
├── fields: name, amount
├── RecurringEntry
│   ├── fields: cycle (Cycle enum), start_date, direction (IN/OUT enum)
│   └── method: next_occurrences(from_date, to_date) → list[date]
└── OneTimeEntry
    └── fields: date, direction (IN/OUT)

Cycle (Enum): WEEKLY, BIWEEKLY, MONTHLY, ANNUAL

Direction (Enum): IN, OUT

ForecastEngine
├── fields: entries[], starting_balance, threshold, window_days
├── method: generate_events(window_days) → list[DatedEvent]   ← sweep line
├── method: compute_balance_series() → list[(date, balance)]
└── method: find_risk_periods() → list[RiskPeriod]

RiskPeriod
└── fields: start_date, end_date, min_balance, days_below_threshold

Chart 
├── fields: timeX [], balanceY []
└── methods: plot()
```