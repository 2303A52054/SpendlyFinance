import { format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, addDays } from 'date-fns';

export const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investments', 'Rental', 'Bonus'],
  expense: ['Food & Dining', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Utilities', 'Rent', 'Education'],
};

export const CATEGORY_COLORS = {
  'Salary': '#6366f1',
  'Freelance': '#8b5cf6',
  'Investments': '#a78bfa',
  'Rental': '#c4b5fd',
  'Bonus': '#ddd6fe',
  'Food & Dining': '#f59e0b',
  'Transport': '#ef4444',
  'Shopping': '#ec4899',
  'Entertainment': '#14b8a6',
  'Health': '#22c55e',
  'Utilities': '#3b82f6',
  'Rent': '#f97316',
  'Education': '#06b6d4',
};

// Seeded random so data is stable across renders
const seeded = (seed) => {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const getDescription = (category, rng) => {
  const descriptions = {
    'Food & Dining': ['Swiggy Order', 'Zomato Delivery', 'Restaurant Bill', 'Grocery Store', 'Cafe Coffee Day', 'Barbeque Nation', 'Dominos Pizza'],
    'Transport': ['Uber Ride', 'Rapido Bike', 'Metro Card Recharge', 'Petrol', 'Ola Cab', 'Auto Ride'],
    'Shopping': ['Amazon Purchase', 'Flipkart Order', 'Myntra Shopping', 'D-Mart', 'Reliance Smart', 'Meesho Order'],
    'Entertainment': ['PVR Cinemas', 'Spotify Premium', 'BookMyShow', 'YouTube Premium', 'Hotstar'],
    'Health': ['Apollo Pharmacy', 'Doctor Consultation', 'Health Insurance', 'Practo', 'Lab Test'],
    'Utilities': ['Gas Bill', 'Water Bill'],
    'Rent': ['House Rent', 'Office Rent'],
    'Education': ['Udemy Course', 'Books', 'Coursera Subscription', 'Skill Training', 'Workshop Fee'],
    'Freelance': ['Client Project Payment', 'Consulting Fee', 'Upwork Payment', 'Design Work'],
    'Investments': ['SIP Mutual Fund', 'Stock Purchase', 'FD Interest', 'PPF Deposit'],
    'Rental': ['Property Rental Income'],
    'Bonus': ['Performance Bonus', 'Annual Bonus', 'Referral Bonus'],
  };
  const list = descriptions[category] || [category];
  return list[Math.floor(rng() * list.length)];
};

const generateTransactions = () => {
  const transactions = [];
  let id = 1;
  const TODAY = new Date('2026-04-02');

  // 13 months back: April 2025 → April 2, 2026
  for (let m = 12; m >= 0; m--) {
    const monthStart = startOfMonth(subMonths(TODAY, m));
    const monthEnd = m === 0 ? TODAY : endOfMonth(subMonths(TODAY, m));
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const rng = seeded(monthStart.getTime() / 1000 | 0);

    // Salary on 1st
    transactions.push({ id: id++, date: format(monthStart, 'yyyy-MM-dd'), description: 'Monthly Salary', category: 'Salary', type: 'income', amount: 80000 + Math.round(rng() * 5000), account: 'HDFC Savings', recurring: true, recurringFreq: 'monthly', scheduled: false });

    // House rent on 5th
    const rentDay = new Date(monthStart); rentDay.setDate(5);
    if (rentDay <= monthEnd) transactions.push({ id: id++, date: format(rentDay, 'yyyy-MM-dd'), description: 'House Rent', category: 'Rent', type: 'expense', amount: 18000, account: 'HDFC Savings', recurring: true, recurringFreq: 'monthly', scheduled: false });

    // Netflix on 15th
    const netflixDay = new Date(monthStart); netflixDay.setDate(15);
    if (netflixDay <= monthEnd) transactions.push({ id: id++, date: format(netflixDay, 'yyyy-MM-dd'), description: 'Netflix', category: 'Entertainment', type: 'expense', amount: 649, account: 'ICICI Current', recurring: true, recurringFreq: 'monthly', scheduled: false });

    // Gym on 2nd
    const gymDay = new Date(monthStart); gymDay.setDate(2);
    if (gymDay <= monthEnd) transactions.push({ id: id++, date: format(gymDay, 'yyyy-MM-dd'), description: 'Gym Membership', category: 'Health', type: 'expense', amount: 1500, account: 'HDFC Savings', recurring: true, recurringFreq: 'monthly', scheduled: false });

    // Electricity on 10th
    const utilDay = new Date(monthStart); utilDay.setDate(10);
    if (utilDay <= monthEnd) transactions.push({ id: id++, date: format(utilDay, 'yyyy-MM-dd'), description: 'Electricity Bill', category: 'Utilities', type: 'expense', amount: 1200 + Math.round(rng() * 1800), account: 'HDFC Savings', recurring: false, scheduled: false });

    // Random transactions
    const count = 12 + Math.floor(rng() * 10);
    for (let i = 0; i < count; i++) {
      const day = days[Math.floor(rng() * days.length)];
      const isExpense = rng() > 0.25;
      const eligibleExpense = CATEGORIES.expense.filter(c => c !== 'Rent' && c !== 'Utilities');
      const category = isExpense
        ? eligibleExpense[Math.floor(rng() * eligibleExpense.length)]
        : CATEGORIES.income.filter(c => c !== 'Salary')[Math.floor(rng() * (CATEGORIES.income.length - 1))];
      const amounts = { 'Food & Dining': [200, 1500], 'Transport': [100, 800], 'Shopping': [500, 5000], 'Entertainment': [300, 2000], 'Health': [500, 3000], 'Education': [2000, 8000], 'Freelance': [10000, 40000], 'Investments': [5000, 20000], 'Rental': [8000, 15000], 'Bonus': [10000, 30000] };
      const [min, max] = amounts[category] || [500, 5000];
      transactions.push({ id: id++, date: format(day, 'yyyy-MM-dd'), description: getDescription(category, rng), category, type: isExpense ? 'expense' : 'income', amount: min + Math.round(rng() * (max - min)), account: rng() > 0.5 ? 'HDFC Savings' : 'ICICI Current', recurring: false, scheduled: false });
    }
  }

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const mockTransactions = generateTransactions();

// ─── SCHEDULED / UPCOMING TRANSACTIONS ──────────────────────────────────────
const TODAY = new Date('2026-04-02');

export const generateScheduledTransactions = () => {
  const upcoming = [];
  let uid = 9000;

  // Next 3 months of recurring bills
  for (let m = 1; m <= 3; m++) {
    const futureMonth = addMonths(startOfMonth(TODAY), m);

    upcoming.push({ id: uid++, date: format(futureMonth, 'yyyy-MM-dd'), description: 'Monthly Salary', category: 'Salary', type: 'income', amount: 80000, account: 'HDFC Savings', scheduled: true, recurringFreq: 'monthly', status: 'pending' });

    const rentDay = new Date(futureMonth); rentDay.setDate(5);
    upcoming.push({ id: uid++, date: format(rentDay, 'yyyy-MM-dd'), description: 'House Rent', category: 'Rent', type: 'expense', amount: 18000, account: 'HDFC Savings', scheduled: true, recurringFreq: 'monthly', status: 'pending' });

    const netflixDay = new Date(futureMonth); netflixDay.setDate(15);
    upcoming.push({ id: uid++, date: format(netflixDay, 'yyyy-MM-dd'), description: 'Netflix', category: 'Entertainment', type: 'expense', amount: 649, account: 'ICICI Current', scheduled: true, recurringFreq: 'monthly', status: 'pending' });

    const gymDay = new Date(futureMonth); gymDay.setDate(2);
    upcoming.push({ id: uid++, date: format(gymDay, 'yyyy-MM-dd'), description: 'Gym Membership', category: 'Health', type: 'expense', amount: 1500, account: 'HDFC Savings', scheduled: true, recurringFreq: 'monthly', status: 'pending' });

    const utilDay = new Date(futureMonth); utilDay.setDate(10);
    upcoming.push({ id: uid++, date: format(utilDay, 'yyyy-MM-dd'), description: 'Electricity Bill', category: 'Utilities', type: 'expense', amount: 2200, account: 'HDFC Savings', scheduled: true, recurringFreq: 'monthly', status: 'pending' });

    const sipDay = new Date(futureMonth); sipDay.setDate(20);
    upcoming.push({ id: uid++, date: format(sipDay, 'yyyy-MM-dd'), description: 'SIP Mutual Fund', category: 'Investments', type: 'expense', amount: 10000, account: 'HDFC Savings', scheduled: true, recurringFreq: 'monthly', status: 'pending' });
  }

  // One-off upcoming
  upcoming.push({ id: uid++, date: format(addDays(TODAY, 5), 'yyyy-MM-dd'), description: 'Coursera Annual Subscription', category: 'Education', type: 'expense', amount: 5000, account: 'ICICI Current', scheduled: true, recurringFreq: 'yearly', status: 'pending' });
  upcoming.push({ id: uid++, date: format(addDays(TODAY, 12), 'yyyy-MM-dd'), description: 'Client Project Payment', category: 'Freelance', type: 'income', amount: 25000, account: 'HDFC Savings', scheduled: true, recurringFreq: 'once', status: 'pending' });
  upcoming.push({ id: uid++, date: format(addDays(TODAY, 18), 'yyyy-MM-dd'), description: 'Amazon Purchase', category: 'Shopping', type: 'expense', amount: 3500, account: 'ICICI Current', scheduled: true, recurringFreq: 'once', status: 'pending' });

  return upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const mockScheduled = generateScheduledTransactions();

// ─── CHART HELPERS ───────────────────────────────────────────────────────────
export const getBalanceTrend = (transactions) => {
  const months = [];
  const TODAY_LOCKED = new Date('2026-04-02');
  for (let m = 11; m >= 0; m--) {
    const date = subMonths(TODAY_LOCKED, m);
    const label = format(date, 'MMM yyyy');
    const monthStr = format(date, 'yyyy-MM');
    const monthTx = transactions.filter(t => t.date.startsWith(monthStr) && !t.scheduled);
    const income = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    months.push({ month: label, income: Math.round(income), expenses: Math.round(expenses), net: Math.round(income - expenses) });
  }
  return months;
};

export const getSpendingByCategory = (transactions) => {
  const expenses = transactions.filter(t => t.type === 'expense' && !t.scheduled);
  const grouped = {};
  expenses.forEach(t => { grouped[t.category] = (grouped[t.category] || 0) + t.amount; });
  return Object.entries(grouped)
    .map(([name, value]) => ({ name, value: Math.round(value), color: CATEGORY_COLORS[name] || '#6366f1' }))
    .sort((a, b) => b.value - a.value);
};
