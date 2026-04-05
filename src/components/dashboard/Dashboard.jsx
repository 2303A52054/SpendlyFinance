import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getSummary, filterTransactions } from '../../utils/helpers';
import { getBalanceTrend, getSpendingByCategory } from '../../data/mockData';
import SummaryCards from './SummaryCards';
import BalanceTrend from './BalanceTrend';
import SpendingBreakdown from './SpendingBreakdown';
import RecentTransactions from './RecentTransactions';

export default function Dashboard() {
  const { state } = useApp();
  const { transactions } = state;

  const summary = useMemo(() => getSummary(transactions), [transactions]);
  const trendData = useMemo(() => getBalanceTrend(transactions), [transactions]);
  const spendingData = useMemo(() => getSpendingByCategory(transactions), [transactions]);

  return (
    <div>
      <SummaryCards summary={summary} />

      <div className="charts-grid">
        <BalanceTrend data={trendData} />
        <SpendingBreakdown data={spendingData} />
      </div>

      <RecentTransactions transactions={transactions} />
    </div>
  );
}
