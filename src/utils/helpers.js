import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns';

export const formatCurrency = (amount, compact = false) => {
  if (compact && amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (compact && amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const filterTransactions = (transactions, filters) => {
  let result = [...transactions];

  // Date range filter
  // "this_month" = 1st of current month → today
  // "last_month" = full previous calendar month
  // "3m" / "6m" / "1y" = last N calendar months including current
  if (filters.dateRange && filters.dateRange !== 'all') {
    const today = new Date();
    if (filters.dateRange === 'this_month') {
      const from = format(startOfMonth(today), 'yyyy-MM-dd');
      const to = format(today, 'yyyy-MM-dd');
      result = result.filter(t => t.date >= from && t.date <= to);
    } else if (filters.dateRange === 'last_month') {
      const prevMonth = subMonths(today, 1);
      const from = format(startOfMonth(prevMonth), 'yyyy-MM-dd');
      const to = format(endOfMonth(prevMonth), 'yyyy-MM-dd');
      result = result.filter(t => t.date >= from && t.date <= to);
    } else {
      const months = { '3m': 3, '6m': 6, '1y': 12 }[filters.dateRange] || 6;
      const cutoff = format(startOfMonth(subMonths(today, months - 1)), 'yyyy-MM-dd');
      result = result.filter(t => t.date >= cutoff);
    }
  }

  // Type filter
  if (filters.type !== 'all') {
    result = result.filter(t => t.type === filters.type);
  }

  // Category filter
  if (filters.category !== 'all') {
    result = result.filter(t => t.category === filters.category);
  }

  // Search
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(t =>
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.amount.toString().includes(q)
    );
  }

  // Sort
  result.sort((a, b) => {
    let cmp = 0;
    if (filters.sortBy === 'date') cmp = new Date(a.date) - new Date(b.date);
    if (filters.sortBy === 'amount') cmp = a.amount - b.amount;
    if (filters.sortBy === 'category') cmp = a.category.localeCompare(b.category);
    return filters.sortDir === 'desc' ? -cmp : cmp;
  });

  return result;
};

export const getSummary = (transactions) => {
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  return {
    balance: income - expenses,
    income,
    expenses,
    savingsRate: income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0,
  };
};

// Escape a CSV cell value safely
const escapeCSV = (val) => {
  const str = String(val ?? '');
  // Quote any field that contains commas, quotes, or newlines
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

// Convert yyyy-MM-dd → DD-MMM-YYYY (e.g. 04-Apr-2026)
// This format is always treated as plain text by Excel — never converted
// to a date serial number — so it never shows ###### regardless of column width.
const formatDateForCSV = (dateStr) => {
  const [year, month, day] = dateStr.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${day}-${months[parseInt(month, 10) - 1]}-${year}`;
};

export const exportToCSV = (transactions) => {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount (INR)', 'Account'];
  const rows = transactions.map(t => [
    formatDateForCSV(t.date),   // e.g. 04-Apr-2026 — plain text, never ######
    t.description,
    t.category,
    t.type,
    t.amount,
    t.account,
  ]);
  // BOM ensures Excel opens the file in UTF-8 (fixes ₹ and special chars)
  const BOM = '\uFEFF';
  const csv = BOM + [headers, ...rows]
    .map(r => r.map(escapeCSV).join(','))
    .join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const exportToJSON = (transactions) => {
  const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transactions.json';
  a.click();
  URL.revokeObjectURL(url);
};
