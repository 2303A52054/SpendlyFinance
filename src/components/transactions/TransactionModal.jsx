import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

const defaultForm = {
  description: '',
  amount: '',
  type: 'expense',
  category: 'Food & Dining',
  date: new Date().toISOString().split('T')[0],
  account: 'HDFC Savings',
};

export default function TransactionModal({ transaction, onClose }) {
  const { dispatch } = useApp();
  const [form, setForm] = useState(transaction ? {
    description: transaction.description,
    amount: transaction.amount,
    type: transaction.type,
    category: transaction.category,
    date: transaction.date,
    account: transaction.account,
  } : defaultForm);

  const isEdit = !!transaction;

  const set = (field, value) => {
    setForm(f => {
      const next = { ...f, [field]: value };
      // Auto-switch category when type changes
      if (field === 'type') {
        next.category = value === 'income' ? 'Salary' : 'Food & Dining';
      }
      return next;
    });
  };

  const handleSubmit = () => {
    if (!form.description.trim() || !form.amount || !form.date) return;
    const data = {
      ...form,
      amount: parseFloat(form.amount),
      id: isEdit ? transaction.id : Date.now(),
    };
    dispatch({ type: isEdit ? 'UPDATE_TRANSACTION' : 'ADD_TRANSACTION', payload: data });
    onClose();
  };

  const categories = CATEGORIES[form.type] || CATEGORIES.expense;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div className="modal-title" style={{ marginBottom: 0 }}>
            {isEdit ? 'Edit Transaction' : 'Add Transaction'}
          </div>
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Type toggle */}
        <div className="form-row">
          <label className="form-label">Type</label>
          <div className="tab-bar">
            <button
              className={`tab-item ${form.type === 'expense' ? 'active' : ''}`}
              onClick={() => set('type', 'expense')}
            >Expense</button>
            <button
              className={`tab-item ${form.type === 'income' ? 'active' : ''}`}
              onClick={() => set('type', 'income')}
            >Income</button>
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Description</label>
          <input
            className="input"
            placeholder="e.g. Swiggy Order"
            value={form.description}
            onChange={e => set('description', e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-row">
            <label className="form-label">Amount (₹)</label>
            <input
              className="input"
              type="number"
              placeholder="0"
              min="0"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Date</label>
            <input
              className="input"
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Category</label>
          <select
            className="select"
            style={{ width: '100%' }}
            value={form.category}
            onChange={e => set('category', e.target.value)}
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">Account</label>
          <select
            className="select"
            style={{ width: '100%' }}
            value={form.account}
            onChange={e => set('account', e.target.value)}
          >
            <option>HDFC Savings</option>
            <option>ICICI Current</option>
          </select>
        </div>

        <div className="form-actions">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {isEdit ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
}
