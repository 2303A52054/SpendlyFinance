import React from 'react';
import { Menu } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const tabTitles = {
  dashboard: { title: 'Spendly', subtitle: 'Your financial overview' },
  transactions: { title: 'Transactions', subtitle: 'All your financial activity' },
  insights: { title: 'Insights', subtitle: 'Patterns and analysis' },
  scheduled: { title: 'Upcoming', subtitle: 'Scheduled & recurring transactions' },
};

export default function Topbar({ onMenuClick }) {
  const { state } = useApp();
  const { title, subtitle } = tabTitles[state.activeTab] || tabTitles.dashboard;
  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="hamburger icon-btn" onClick={onMenuClick}><Menu size={16} /></button>
        <div className="topbar-left">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="topbar-actions">
        <span className={`role-badge ${state.role}`} style={{ fontSize: 12, padding: '4px 10px' }}>
          {state.role === 'admin' ? '👑 Admin' : '👁 Viewer'}
        </span>
      </div>
    </header>
  );
}
