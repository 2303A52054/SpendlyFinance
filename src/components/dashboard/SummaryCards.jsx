import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Percent } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const cards = [
  {
    key: 'balance',
    label: 'Total Balance',
    icon: Wallet,
    colorVar: '--blue',
    bgVar: '--blue-bg',
    format: v => formatCurrency(v),
  },
  {
    key: 'income',
    label: 'Total Income',
    icon: TrendingUp,
    colorVar: '--green',
    bgVar: '--green-bg',
    format: v => formatCurrency(v),
  },
  {
    key: 'expenses',
    label: 'Total Expenses',
    icon: TrendingDown,
    colorVar: '--red',
    bgVar: '--red-bg',
    format: v => formatCurrency(v),
  },
  {
    key: 'savingsRate',
    label: 'Savings Rate',
    icon: Percent,
    colorVar: '--amber',
    bgVar: '--amber-bg',
    format: v => `${v}%`,
  },
];

export default function SummaryCards({ summary }) {
  return (
    <div className="summary-grid">
      {cards.map(({ key, label, icon: Icon, colorVar, bgVar, format }, i) => (
        <div
          key={key}
          className={`summary-card animate-in stagger-${i + 1}`}
        >
          <div className="label">{label}</div>
          <div
            className="value"
            style={{ color: `var(${colorVar})` }}
          >
            {format(summary[key] || 0)}
          </div>
          <div className="change">
            {key === 'balance' && (summary.balance >= 0 ? '↑ Positive balance' : '↓ Negative balance')}
            {key === 'income' && `${summary.savingsRate}% saved`}
            {key === 'expenses' && `vs ₹${(summary.income / 100000).toFixed(1)}L income`}
            {key === 'savingsRate' && (summary.savingsRate >= 30 ? '✓ Healthy rate' : '↑ Room to improve')}
          </div>
          <div
            className="icon-wrap"
            style={{ background: `var(${bgVar})`, color: `var(${colorVar})` }}
          >
            <Icon />
          </div>
        </div>
      ))}
    </div>
  );
}
