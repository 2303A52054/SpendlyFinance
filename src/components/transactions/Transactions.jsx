import React, { useMemo, useState } from 'react';
import { Search, Plus, Pencil, Trash2, ArrowUpDown, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { filterTransactions, formatCurrency, exportToCSV, exportToJSON } from '../../utils/helpers';
import { CATEGORIES, CATEGORY_COLORS } from '../../data/mockData';
import { format, parseISO } from 'date-fns';
import TransactionModal from './TransactionModal';

export default function Transactions() {
  const { state, dispatch } = useApp();
  const { filters, transactions, role } = state;
  const isAdmin = role === 'admin';

  const [modal, setModal] = useState(null); // null | 'add' | transaction object
  const [deleteId, setDeleteId] = useState(null);

  const filtered = useMemo(() => filterTransactions(transactions, filters), [transactions, filters]);

  const allCategories = [...CATEGORIES.income, ...CATEGORIES.expense];

  const setFilter = (key, value) => dispatch({ type: 'SET_FILTER', payload: { [key]: value } });

  const handleSort = (col) => {
    if (filters.sortBy === col) {
      setFilter('sortDir', filters.sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      dispatch({ type: 'SET_FILTER', payload: { sortBy: col, sortDir: 'desc' } });
    }
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    setDeleteId(null);
  };

  const SortIcon = ({ col }) => (
    <ArrowUpDown
      size={10}
      style={{
        marginLeft: 4,
        opacity: filters.sortBy === col ? 1 : 0.3,
        display: 'inline',
      }}
    />
  );

  return (
    <div>
      {/* Filters */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="filters-bar" style={{ marginBottom: 0 }}>
          {/* Search */}
          <div className="input-wrap" style={{ flex: '1 1 200px', minWidth: 180 }}>
            <Search className="input-icon" />
            <input
              className="input"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={e => setFilter('search', e.target.value)}
            />
          </div>

          <select className="select" value={filters.type} onChange={e => setFilter('type', e.target.value)}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select className="select" value={filters.category} onChange={e => setFilter('category', e.target.value)}>
            <option value="all">All Categories</option>
            {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select className="select" value={filters.dateRange} onChange={e => setFilter('dateRange', e.target.value)}>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last Year</option>
            <option value="all">All Time</option>
          </select>

          <button className="btn btn-ghost btn-sm" onClick={() => dispatch({ type: 'RESET_FILTERS' })}>
            Reset
          </button>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="btn btn-outline btn-sm" onClick={() => exportToCSV(filtered)}>
              <Download size={13} /> CSV
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => exportToJSON(filtered)}>
              <Download size={13} /> JSON
            </button>
            {isAdmin && (
              <button className="btn btn-primary btn-sm" onClick={() => setModal('add')}>
                <Plus size={13} /> Add
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
        Showing {filtered.length} of {transactions.length} transactions
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <Search />
            <h3>No transactions found</h3>
            <p>Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="tx-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('date')}>
                    Date <SortIcon col="date" />
                  </th>
                  <th>Description</th>
                  <th onClick={() => handleSort('category')} className="hide-mobile">
                    Category <SortIcon col="category" />
                  </th>
                  <th className="hide-mobile">Type</th>
                  <th className="hide-mobile">Account</th>
                  <th onClick={() => handleSort('amount')} style={{ textAlign: 'right' }}>
                    Amount <SortIcon col="amount" />
                  </th>
                  {isAdmin && <th style={{ width: 80 }}></th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map(tx => (
                  <tr key={tx.id}>
                    <td>
                      <span className="tx-date">{format(parseISO(tx.date), 'dd MMM yy')}</span>
                    </td>
                    <td>
                      <span className="tx-desc">{tx.description}</span>
                    </td>
                    <td className="hide-mobile">
                      <span className="cat-tag">
                        <span className="cat-dot" style={{ background: CATEGORY_COLORS[tx.category] || 'var(--text-muted)' }} />
                        {tx.category}
                      </span>
                    </td>
                    <td className="hide-mobile">
                      <span className={`badge ${tx.type}`}>{tx.type}</span>
                    </td>
                    <td className="hide-mobile" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {tx.account}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`tx-amount ${tx.type}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, true)}
                      </span>
                    </td>
                    {isAdmin && (
                      <td>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                          <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => setModal(tx)}>
                            <Pencil size={12} />
                          </button>
                          <button
                            className="icon-btn"
                            style={{ width: 28, height: 28, color: 'var(--red)' }}
                            onClick={() => setDeleteId(tx.id)}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <TransactionModal
          transaction={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
        />
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div className="modal-title">Delete Transaction?</div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>
              This action cannot be undone.
            </p>
            <div className="form-actions">
              <button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
