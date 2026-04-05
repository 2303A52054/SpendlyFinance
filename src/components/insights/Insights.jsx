import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/helpers';
import { getSpendingByCategory, getBalanceTrend } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, subMonths, parseISO } from 'date-fns';

export default function Insights() {
  const { state } = useApp();
  const { transactions } = state;

  const spending = useMemo(() => getSpendingByCategory(transactions), [transactions]);
  const trend = useMemo(() => getBalanceTrend(transactions), [transactions]);

  // Monthly comparison
  const currentMonth = format(new Date(), 'yyyy-MM');
  const lastMonth = format(subMonths(new Date(), 1), 'yyyy-MM');

  const currentMonthExpenses = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((s, t) => s + t.amount, 0);

  const lastMonthExpenses = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(lastMonth))
    .reduce((s, t) => s + t.amount, 0);

  const currentMonthIncome = transactions
    .filter(t => t.type === 'income' && t.date.startsWith(currentMonth))
    .reduce((s, t) => s + t.amount, 0);

  const expenseChange = lastMonthExpenses > 0
    ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses * 100).toFixed(1)
    : 0;

  const topCategory = spending[0];
  const totalExpenses = spending.reduce((s, d) => s + d.value, 0);

  const avgMonthlyExpense = trend.length > 0
    ? Math.round(trend.reduce((s, t) => s + t.expenses, 0) / trend.length)
    : 0;

  const avgMonthlySavings = trend.length > 0
    ? Math.round(trend.reduce((s, t) => s + t.net, 0) / trend.length)
    : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="card" style={{ padding: '10px 14px', minWidth: 160 }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 700 }}>
          {formatCurrency(payload[0].value)}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
          {((payload[0].value / totalExpenses) * 100).toFixed(1)}% of total
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Key metrics */}
      <div className="insights-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="insight-card">
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
            Top Spending Category
          </div>
          {topCategory ? (
            <>
              <div className="insight-number" style={{ color: topCategory.color, fontSize: 22 }}>
                {topCategory.name}
              </div>
              <div className="insight-label">{formatCurrency(topCategory.value)} spent</div>
              <div className="progress-bar" style={{ marginTop: 12 }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${(topCategory.value / totalExpenses * 100).toFixed(0)}%`,
                    background: topCategory.color,
                  }}
                />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                {(topCategory.value / totalExpenses * 100).toFixed(1)}% of total spend
              </div>
            </>
          ) : <div className="insight-label">No data</div>}
        </div>

        <div className="insight-card">
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
            Monthly Comparison
          </div>
          <div className="insight-number" style={{ color: parseFloat(expenseChange) > 0 ? 'var(--red)' : 'var(--green)', fontSize: 28 }}>
            {expenseChange > 0 ? '↑' : '↓'} {Math.abs(expenseChange)}%
          </div>
          <div className="insight-label">
            {parseFloat(expenseChange) > 0 ? 'More' : 'Less'} spending vs last month
          </div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>This month</span>
              <span style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{formatCurrency(currentMonthExpenses, true)}</span>
            </div>
            <div style={{ fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Last month</span>
              <span style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{formatCurrency(lastMonthExpenses, true)}</span>
            </div>
          </div>
        </div>

        <div className="insight-card">
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
            Avg Monthly Savings
          </div>
          <div className="insight-number" style={{ color: avgMonthlySavings >= 0 ? 'var(--green)' : 'var(--red)' }}>
            {formatCurrency(Math.abs(avgMonthlySavings), true)}
          </div>
          <div className="insight-label">
            {avgMonthlySavings >= 0 ? 'saved on average' : 'deficit on average'}
          </div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Avg expenses/mo</span>
              <span style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{formatCurrency(avgMonthlyExpense, true)}</span>
            </div>
            <div style={{ fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>This month income</span>
              <span style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{formatCurrency(currentMonthIncome, true)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category breakdown bar chart */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Spending by Category</div>
            <div className="card-subtitle">All time breakdown</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={spending} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'DM Mono' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'DM Sans' }}
              axisLine={false}
              tickLine={false}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22}>
              {spending.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Net savings per month */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Net Savings per Month</div>
            <div className="card-subtitle">Income minus expenses</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={trend} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'DM Sans' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => v.split(' ')[0]}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'DM Mono' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`}
              width={55}
            />
            <Tooltip
              formatter={v => [formatCurrency(v), 'Net']}
              contentStyle={{ fontFamily: 'DM Sans', fontSize: 13, border: '1px solid var(--border)', borderRadius: 10, background: 'var(--bg-card)', color: 'var(--text)' }}
            />
            <Bar dataKey="net" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {trend.map((entry, i) => (
                <Cell key={i} fill={entry.net >= 0 ? 'var(--green)' : 'var(--red)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
