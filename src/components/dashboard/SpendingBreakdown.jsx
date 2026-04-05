import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/helpers';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="card" style={{ padding: '10px 14px' }}>
      <div style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 14, color: item.payload.color, fontWeight: 700 }}>
        {formatCurrency(item.value)}
      </div>
    </div>
  );
};

export default function SpendingBreakdown({ data }) {
  const [active, setActive] = useState(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const top5 = data.slice(0, 6);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Spending Breakdown</div>
          <div className="card-subtitle">By category</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={top5}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={72}
            paddingAngle={3}
            dataKey="value"
            onMouseEnter={(_, i) => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            {top5.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.color}
                opacity={active === null || active === i ? 1 : 0.5}
                style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
        {top5.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              opacity: active === null || active === i ? 1 : 0.5,
              transition: 'opacity 0.2s',
              cursor: 'default',
            }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, flex: 1, color: 'var(--text-muted)' }}>{item.name}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 600 }}>
              {((item.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
