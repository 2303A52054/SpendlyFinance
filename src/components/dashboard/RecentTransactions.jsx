import React from 'react';
import { formatCurrency } from '../../utils/helpers';
import { CATEGORY_COLORS } from '../../data/mockData';
import { format, parseISO } from 'date-fns';
import { useApp } from '../../context/AppContext';

export default function RecentTransactions({ transactions }) {
  const { dispatch } = useApp();
  const recent = transactions.slice(0, 8);

  return (
    <div className="card" style={{ marginBottom: 0 }}>
      <div className="card-header">
        <div>
          <div className="card-title">Recent Transactions</div>
          <div className="card-subtitle">Latest activity</div>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => dispatch({ type: 'SET_TAB', payload: 'transactions' })}
        >
          View all →
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="empty-state" style={{ padding: '30px 0' }}>
          <p>No transactions yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {recent.map(tx => (
            <div
              key={tx.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 4px',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: `${CATEGORY_COLORS[tx.category]}22`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                {getCategoryEmoji(tx.category)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {tx.description}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  {tx.category} · {format(parseISO(tx.date), 'dd MMM')}
                </div>
              </div>
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 13,
                  fontWeight: 700,
                  color: tx.type === 'income' ? 'var(--green)' : 'var(--red)',
                  flexShrink: 0,
                }}
              >
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, true)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getCategoryEmoji(cat) {
  const map = {
    'Salary': '💼', 'Freelance': '💻', 'Investments': '📈',
    'Rental': '🏠', 'Bonus': '🎁',
    'Food & Dining': '🍽️', 'Transport': '🚗', 'Shopping': '🛍️',
    'Entertainment': '🎬', 'Health': '💊', 'Utilities': '⚡',
    'Rent': '🏡', 'Education': '📚',
  };
  return map[cat] || '💰';
}
