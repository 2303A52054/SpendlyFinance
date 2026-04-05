import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { formatCurrency } from '../../utils/helpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card" style={{ padding: '12px 16px', minWidth: 180 }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 13, marginBottom: 4 }}>
          <span style={{ color: p.color }}>{p.name}</span>
          <span style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{formatCurrency(p.value, true)}</span>
        </div>
      ))}
    </div>
  );
};

export default function BalanceTrend({ data }) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Balance Trend</div>
          <div className="card-subtitle">Income vs expenses over time</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--green)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="var(--green)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--red)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="var(--red)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => v.split(' ')[0]}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'DM Mono' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, fontFamily: 'DM Sans', paddingTop: 8 }}
            iconType="circle"
            iconSize={8}
          />
          <Area
            type="monotone"
            dataKey="income"
            name="Income"
            stroke="var(--green)"
            strokeWidth={2}
            fill="url(#incomeGrad)"
            dot={{ fill: 'var(--green)', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke="var(--red)"
            strokeWidth={2}
            fill="url(#expenseGrad)"
            dot={{ fill: 'var(--red)', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
