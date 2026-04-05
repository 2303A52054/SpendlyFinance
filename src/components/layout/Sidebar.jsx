import React from 'react';
import { LayoutDashboard, ArrowLeftRight, Lightbulb, Moon, Sun, TrendingUp, CalendarClock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar({ mobileOpen, onClose }) {
  const { state, dispatch } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
    { id: 'scheduled', label: 'Upcoming', icon: CalendarClock },
  ];

  return (
    <>
      <div className={`sidebar-overlay ${mobileOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-mark"><TrendingUp size={14} /></div>
          <span>Spendly</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${state.activeTab === id ? 'active' : ''}`}
              onClick={() => { dispatch({ type: 'SET_TAB', payload: id }); onClose(); }}
            >
              <Icon />
              {label}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="role-selector">
            <span className="role-label">Role</span>
            <select className="role-select" value={state.role} onChange={e => dispatch({ type: 'SET_ROLE', payload: e.target.value })}>
              <option value="admin">👑 Admin</option>
              <option value="viewer">👁 Viewer</option>
            </select>
            <span className={`role-badge ${state.role}`}>{state.role === 'admin' ? 'Full Access' : 'Read Only'}</span>
          </div>
          <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => dispatch({ type: 'TOGGLE_DARK' })}>
            {state.darkMode ? <Sun size={14} /> : <Moon size={14} />}
            {state.darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>
    </>
  );
}
