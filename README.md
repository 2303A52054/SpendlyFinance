# Spendly — Finance Dashboard

A clean, interactive personal finance dashboard built with React 18, Context API, Recharts, and localStorage.

---

## Features

### Core Requirements 
| Requirement | Implementation |
|---|---|
| Dashboard Overview | Summary cards (Balance, Income, Expenses, Savings Rate) + Balance Trend chart + Spending Breakdown pie chart |
| Transactions Section | Full table with date, amount, category, type, account — with search, filter, sort, and export |
| Role-Based UI | Admin (add/edit/delete) vs Viewer (read-only) — switchable via sidebar dropdown |
| Insights Section | Top spending category, monthly comparison, avg savings, category bar chart, net savings chart |
| State Management | React Context API + useReducer — transactions, filters, role, dark mode all managed globally |
| Responsive Design | Mobile sidebar overlay, responsive grids, hide columns on small screens |

### Optional Enhancements 
-  **Dark Mode** — one-click toggle, persisted in localStorage
-  **Data Persistence** — all state saved to localStorage across sessions
-  **Export** — CSV (Excel-safe with BOM + date formatting) and JSON export
-  **Scheduled/Upcoming Transactions** — unique 4th tab: see future recurring bills, confirm when paid, add new scheduled entries
-  **Recurring transaction markers** — salary, rent, Netflix, gym pre-seeded as monthly recurring

---

## Data Range

- **Historical data:** April 2025 → April 2, 2026 (13 months)
- **Demo date locked to:** April 2, 2026 (no transactions beyond today)
- **Upcoming tab:** Shows 3 months of future scheduled transactions

---

## Project Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── Dashboard.jsx        # Main dashboard layout
│   │   ├── SummaryCards.jsx     # 4 KPI cards
│   │   ├── BalanceTrend.jsx     # Line/area chart
│   │   ├── SpendingBreakdown.jsx # Pie chart
│   │   └── RecentTransactions.jsx
│   ├── transactions/
│   │   ├── Transactions.jsx     # Full transactions table
│   │   └── TransactionModal.jsx # Add/edit modal
│   ├── scheduled/
│   │   ├── Scheduled.jsx        # Upcoming transactions page
│   │   └── ScheduledModal.jsx   # Schedule new transaction
│   ├── insights/
│   │   └── Insights.jsx         # Insights & analytics
│   └── layout/
│       ├── Sidebar.jsx          # Navigation + role switcher
│       └── Topbar.jsx           # Header bar
├── context/
│   └── AppContext.jsx           # Global state (Context + useReducer)
├── data/
│   └── mockData.js              # Seeded mock transactions + scheduled
└── utils/
    └── helpers.js               # Filters, formatters, CSV/JSON export
```

---

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start
# Opens at http://localhost:3000

# 3. Build for production
npm run build
```

---

##  Deploy to GitHub Pages

```bash
# 1. Update package.json — replace YOUR-USERNAME:
#    "homepage": "https://YOUR-USERNAME.github.io/spendly"

# 2. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/spendly.git
git push -u origin main

# 3. Deploy
npm run deploy

# 4. In GitHub repo → Settings → Pages → select gh-pages branch → Save
# Live at: https://YOUR-USERNAME.github.io/spendly
```

---

## Tech Stack

- **React 18** — UI framework
- **Context API + useReducer** — state management
- **Recharts** — charts and visualizations
- **date-fns** — date utilities
- **lucide-react** — icons
- **CSS Variables** — theming and dark mode
- **localStorage** — data persistence
- **gh-pages** — deployment

---

## Role-Based UI

Switch roles using the dropdown in the sidebar:

| Role | Capabilities |
|---|---|
| Admin | View + Add + Edit + Delete transactions, schedule future transactions |
| Viewer | View-only — all add/edit/delete buttons hidden |

---

## Filters Available

- **Date Range:** This Month / Last Month / Last 3M / Last 6M / Last Year / All Time
- **Type:** Income / Expense / All
- **Category:** All 13 categories
- **Search:** Full-text across description, category, amount
- **Sort:** By date, amount, or category (asc/desc)

---

*Built by Varshitha Gangula · SR University · School of CS & AI*
