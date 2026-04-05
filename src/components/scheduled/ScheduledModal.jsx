import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

const defaultForm = { description: '', amount: '', type: 'expense', category: 'Food & Dining', date: '', account: 'HDFC Savings', recurringFreq: 'monthly' };

export default function ScheduledModal({ onClose }) {
  const { dispatch } = useApp();
  const [form, setForm] = useState(defaultForm);

  const set = (field, val) => setForm(f => {
    const next = { ...f, [field]: val };
    if (field === 'type') next.category = val === 'income' ? 'Salary' : 'Food & Dining';
    return next;
  });

  const handleSubmit = () => {
    if (!form.description.trim() || !form.amount || !form.date) return;
    dispatch({
      type: 'ADD_SCHEDULED',
      payload: { ...form, amount: parseFloat(form.amount), id: Date.now(), scheduled: true, status: 'pending' }
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div className="modal-title" style={{ marginBottom: 0 }}>Schedule Transaction</div>
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="form-row">
          <label className="form-label">Type</label>
          <div className="tab-bar">
            <button className={`tab-item ${form.type === 'expense' ? 'active' : ''}`} onClick={() => set('type', 'expense')}>Expense</button>
            <button className={`tab-item ${form.type === 'income' ? 'active' : ''}`} onClick={() => set('type', 'income')}>Income</button>
          </div>
        </div>
        <div className="form-row">
          <label className="form-label">Description</label>
          <input className="input" placeholder="e.g. House Rent" value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-row">
            <label className="form-label">Amount (₹)</label>
            <input className="input" type="number" min="0" placeholder="0" value={form.amount} onChange={e => set('amount', e.target.value)} />
          </div>
          <div className="form-row">
            <label className="form-label">Due Date</label>
            <input className="input" type="date" value={form.date} min="2026-04-03" onChange={e => set('date', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <label className="form-label">Category</label>
          <select className="select" style={{ width: '100%' }} value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES[form.type].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-row">
            <label className="form-label">Account</label>
            <select className="select" style={{ width: '100%' }} value={form.account} onChange={e => set('account', e.target.value)}>
              <option>HDFC Savings</option>
              <option>ICICI Current</option>
            </select>
          </div>
          <div className="form-row">
            <label className="form-label">Frequency</label>
            <select className="select" style={{ width: '100%' }} value={form.recurringFreq} onChange={e => set('recurringFreq', e.target.value)}>
              <option value="once">One-time</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Add Scheduled</button>
        </div>
      </div>
    </div>
  );
}
