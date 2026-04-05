import React, { useState } from 'react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { CalendarClock, CheckCircle2, Trash2, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/helpers';
import { CATEGORY_COLORS } from '../../data/mockData';
import ScheduledModal from './ScheduledModal';

const TODAY = new Date('2026-04-02');
const urgencyColor = (d) => d <= 3 ? 'var(--red)' : d <= 7 ? 'var(--amber)' : 'var(--green)';
const freqLabel = { monthly: '🔄 Monthly', yearly: '📅 Yearly', weekly: '📆 Weekly', once: '⚡ One-time' };

export default function Scheduled() {
  const { state, dispatch } = useApp();
  const { scheduledTransactions, role } = state;
  const isAdmin = role === 'admin';
  const [modal, setModal] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const upcoming = (scheduledTransactions || [])
    .filter(t => new Date(t.date) >= TODAY)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const next30 = upcoming.filter(t => differenceInDays(new Date(t.date), TODAY) <= 30);
  const incomeNext = next30.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenseNext = next30.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ borderLeft: '4px solid var(--blue)', paddingLeft: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Next 30 Days</div>
          <div style={{ fontSize: 22, fontFamily: 'var(--mono)', fontWeight: 700 }}>{next30.length} transactions</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--green)', paddingLeft: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Expected Income</div>
          <div style={{ fontSize: 22, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--green)' }}>{formatCurrency(incomeNext, true)}</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--red)', paddingLeft: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Expected Expenses</div>
          <div style={{ fontSize: 22, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--red)' }}>{formatCurrency(expenseNext, true)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CalendarClock size={18} style={{ color: 'var(--blue)' }} />
            Scheduled Transactions
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Know what is coming · Mark as done when paid or received</div>
        </div>
        {isAdmin && (
          <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}>
            <Plus size={13} /> Schedule
          </button>
        )}
      </div>

      {upcoming.length === 0 ? (
        <div className="card empty-state">
          <CalendarClock size={32} style={{ opacity: 0.3 }} />
          <h3>No upcoming transactions</h3>
          <p>Schedule recurring bills or expected payments</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {upcoming.map(tx => {
            const daysAway = differenceInDays(new Date(tx.date), TODAY);
            const color = urgencyColor(daysAway);
            return (
              <div key={tx.id} className="card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: CATEGORY_COLORS[tx.category] || 'var(--text-muted)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{tx.description}</span>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: tx.type === 'income' ? 'var(--green-bg)' : 'var(--red-bg)', color: tx.type === 'income' ? 'var(--green)' : 'var(--red)', fontWeight: 500 }}>{tx.type}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{freqLabel[tx.recurringFreq] || tx.recurringFreq}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{tx.category} · {tx.account}</div>
                </div>
                <div style={{ textAlign: 'center', minWidth: 80 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color }}>{daysAway === 0 ? 'Today' : daysAway === 1 ? 'Tomorrow' : `${daysAway}d away`}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{format(parseISO(tx.date), 'dd MMM yyyy')}</div>
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 15, color: tx.type === 'income' ? 'var(--green)' : 'var(--red)', minWidth: 90, textAlign: 'right' }}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, true)}
                </div>
                {isAdmin && (
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button className="icon-btn" title="Mark as done" style={{ width: 32, height: 32, color: 'var(--green)' }} onClick={() => setConfirmId(tx.id)}><CheckCircle2 size={14} /></button>
                    <button className="icon-btn" title="Remove" style={{ width: 32, height: 32, color: 'var(--red)' }} onClick={() => dispatch({ type: 'DELETE_SCHEDULED', payload: tx.id })}><Trash2 size={14} /></button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {confirmId && (
        <div className="modal-overlay" onClick={() => setConfirmId(null)}>
          <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="modal-title">Confirm Transaction?</div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>This will move the scheduled entry into your actual transactions.</p>
            <div className="form-actions">
              <button className="btn btn-outline" onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { dispatch({ type: 'CONFIRM_SCHEDULED', payload: confirmId }); setConfirmId(null); }}>
                <CheckCircle2 size={13} /> Confirm & Add
              </button>
            </div>
          </div>
        </div>
      )}

      {modal && <ScheduledModal onClose={() => setModal(false)} />}
    </div>
  );
}
