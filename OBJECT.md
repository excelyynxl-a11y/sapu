# Object: DSA and Model

## Data Structures

### `EntryBlock`
Represents a dated financial event for algorithmic processing.

- **Fields**
  - `date: date` — date the charge or income occurs
  - `net_charge: float` — signed amount (`+` for income, `-` for expense)
  - `event: Optional[str]` — name of the income/expense
- **Methods**
  - `__lt__`, `__le__`, `__gt__`, `__ge__`, `__eq__` — comparison by date ascending; on same date, higher amount sorts first
  - `__str__`, `__repr__` — human-readable string representation

### `ArraySortedList`
Sorted list that holds `EntryBlock` items in ascending order by date, with a movable pointer used during k-way merges.

- **Fields**
  - `__array: list` — internal storage
  - `__length: int` — number of items
  - `__pointer: int` — current merge pointer
- **Methods**
  - `add(item)` — insert in sorted order
  - `add_sentinel()` — append `SENTINEL` to the end
  - `delete_at_index(index)` — delete and return item at index
  - `increment_pointer()` — advance the pointer
  - `peek_pointer()` — return item at pointer, or `SENTINEL` if exhausted
  - `reset_pointer()` — reset pointer to start
  - `index(item)` — find position of an item
  - `clear()` — remove all items
  - `__lt__`, `__le__`, `__gt__`, `__ge__`, `__eq__` — compare based on `peek_pointer()`
  - `__len__`, `__getitem__`, `__str__`

### `ArrayMinHeap`
Minimum heap backed by an array. In the forecast engine, each node is an `ArraySortedList` ordered by its current pointer value.

- **Fields**
  - `__array: list` — 1-indexed heap storage
  - `__length: int` — current heap size
- **Methods**
  - `add(item)` — insert item and restore heap property
  - `extract_root()` / `extract_min()` — remove and return the smallest item
  - `peek()` — return root without removing
  - `is_full()` — check capacity
  - `heapify(items)` — build heap from iterable using bottom-up construction
  - `values()` — return heap values unordered
  - `__len__`, `__str__`
  - `_rise(k)`, `_sink(k)` — mechanism to maintain heap property

---

## Models

### `User`
Beanie/MongoDB document representing an application user.

- **Fields**
  - `username: str` — unique username
  - `email: EmailStr` — unique email address
  - `password: str` — bcrypt-hashed password
- **Settings**
  - collection name: `users`

### `RecurringEntry`
Beanie/MongoDB document representing a repeating financial entry.

- **Fields**
  - `user_id: str` — owner reference
  - `name: str` — entry name
  - `amount: float` — monetary amount
  - `cycle: Cycle` — recurrence cycle (`weekly`, `biweekly`, `monthly`, `annual`, `custom`)
  - `start_date: date` — first occurrence
  - `direction: Direction` — `in` (income) or `out` (expense)
  - `custom_days: Optional[int]` — interval in days when `cycle == CUSTOM`
- **Settings**
  - collection name: `recurring_entries`

### `OneTimeEntry`
Beanie/MongoDB document representing a single financial entry.

- **Fields**
  - `user_id: str` — owner reference
  - `name: str` — entry name
  - `amount: float` — monetary amount
  - `date: date` — occurrence date
  - `direction: Direction` — `in` or `out`
- **Settings**
  - collection name: `onetime_entries`

---

## Services

### `AuthService`
Handles registration, authentication, and current-user resolution.

- **Methods**
  - `get_current_user(credentials)` — decode JWT and return the authenticated `User`
  - `register_user(user_data)` — validate input, hash password, and insert a new `User`
  - `authenticate_user(user_data)` — verify credentials and return a JWT plus user details

Helper functions:
- `hash_password(plain)` — bcrypt password hash
- `verify_password(plain, hashed)` — bcrypt password verify
- `create_access_token(data)` — sign a JWT with expiration

### `EntryService`
CRUD operations for recurring and one-time entries.

- **Methods**
  - `create_recurring_entry(user_id, entry_data)` — validate `custom_days` and insert a `RecurringEntry`
  - `create_onetime_entry(user_id, entry_data)` — insert a `OneTimeEntry`
  - `get_my_entries(user_id)` — fetch all entries owned by the user
  - `delete_entry(user_id, entry_id)` — delete an entry if it belongs to the user

### `ForecastService`
Orchestrates forecast queries using `ForecastEngine`.

- **Methods**
  - `get_my_forecast(user_id, window_days, starting_balance, threshold)` — return a daily balance series
  - `get_my_risk_period(user_id, window_days, starting_balance, threshold)` — return periods where balance falls below the threshold

### `ForecastEngine`
Core algorithm class that projects future balances and detects risk periods.

- **Fields**
  - `entries: list` — list of `RecurringEntry` and `OneTimeEntry` objects
  - `starting_balance: float` — initial balance
  - `threshold: float` — warning threshold
  - `window_days: int` — forecast horizon
  - `from_date: date` — start date (defaults to today)
- **Methods**
  - `generate_events()` — build sorted `EntryBlock` list for the forecast window
  - `compute_balance_series()` — produce `(date, balance)` pairs
  - `find_risk_periods()` — identify contiguous stretches below the threshold
  - `determine_charge_date(event, to_date)` — generate recurring dates for an entry
  - `k_sorted_list_merge(sorted_lists)` — merge k sorted `ArraySortedList` instances
  - `determine_balance(events)` — sweep line to compute running balance per date
  - `_next_occurrence(current, cycle, custom_days)` — compute next date for a cycle
  - `_add_months(start, months)` — add months while clamping to month-end

### `RiskPeriod`
Represents a continuous period where the balance is below the threshold.

- **Fields**
  - `start_date: date`
  - `end_date: date`
  - `min_balance: float`
  - `days_below_threshold: int`
- **Methods**
  - `__str__`, `__repr__`

### Enums

- `Cycle` — `WEEKLY`, `BIWEEKLY`, `MONTHLY`, `ANNUAL`, `CUSTOM`
- `Direction` — `IN`, `OUT`
