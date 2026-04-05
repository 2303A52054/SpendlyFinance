import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Dashboard from './components/dashboard/Dashboard';
import Transactions from './components/transactions/Transactions';
import Insights from './components/insights/Insights';
import Scheduled from './components/scheduled/Scheduled';
import './index.css';

function AppInner() {
  const { state } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode);
  }, [state.darkMode]);

  const content = {
    dashboard: <Dashboard />,
    transactions: <Transactions />,
    insights: <Insights />,
    scheduled: <Scheduled />,
  }[state.activeTab] || <Dashboard />;

  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="main-content">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="page-content">{content}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
