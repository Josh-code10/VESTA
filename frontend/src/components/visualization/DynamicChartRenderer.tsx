import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
  LineChart,
  Line,
  ComposedChart
} from 'recharts';

interface DynamicChartRendererProps {
  chartType: string;
  records: Array<Record<string, any>>;
  dimension?: string;
  metric?: string;
  height?: number;
}

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#0EA5E9', '#8B5CF6', '#EC4899'];

export const DynamicChartRenderer: React.FC<DynamicChartRendererProps> = ({
  chartType,
  records,
  dimension,
  metric,
  height = 220
}) => {
  if (!records || records.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '30px 0', fontSize: '12px' }}>
        No dimensional records available for chart visualization.
      </div>
    );
  }

  const keys = Object.keys(records[0]);
  const dimKey = dimension || keys.find(k => typeof records[0][k] === 'string') || keys[0];
  
  // Find primary numeric metric key
  const numericKeys = keys.filter(k => typeof records[0][k] === 'number');
  const metricKey = metric || numericKeys[0] || 'value';
  const secondaryMetricKey = numericKeys[1] || metricKey;

  // Format label for UI
  const formatLabel = (name: string) => {
    return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Format numeric tick values
  const formatNum = (val: number) => {
    if (Math.abs(val) >= 1_000_000_000) return `₦${(val / 1_000_000_000).toFixed(1)}B`;
    if (Math.abs(val) >= 1_000_000) return `₦${(val / 1_000_000).toFixed(1)}M`;
    if (Math.abs(val) >= 1_000) return `${(val / 1_000).toFixed(0)}k`;
    return String(val);
  };

  const normType = (chartType || 'bar').toLowerCase();

  // 1. SCATTER CHART (Discount vs Margin %, Target Attainment vs Margin %, ROI Scatter)
  if (normType === 'scatter') {
    const xKey = numericKeys.find(k => k.includes('discount') || k.includes('target') || k.includes('spend')) || numericKeys[0] || 'x';
    const yKey = numericKeys.find(k => k.includes('margin') || k.includes('profit') || k.includes('roas') || k.includes('roi')) || secondaryMetricKey || 'y';

    const scatterData = records.map(r => ({
      name: String(r[dimKey] || 'Segment'),
      x: Number(r[xKey] || 0),
      y: Number(r[yKey] || 0)
    }));

    return (
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              type="number"
              dataKey="x"
              name={formatLabel(xKey)}
              stroke="#64748B"
              fontSize={10}
              unit={xKey.includes('pct') || xKey.includes('rate') ? '%' : ''}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={formatLabel(yKey)}
              stroke="#64748B"
              fontSize={10}
              unit={yKey.includes('pct') || yKey.includes('margin') ? '%' : ''}
            />
            <ZAxis type="number" range={[60, 200]} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px', fontSize: '11px' }}
              formatter={(value: any, name: any) => [value, formatLabel(String(name))]}
            />
            <Scatter name="Segments" data={scatterData} fill="#6366F1">
              {scatterData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // 2. WATERFALL CHART (Profit Decline Variance Decomposition)
  if (normType === 'waterfall') {
    let runningTotal = 0;
    const waterfallData = records.slice(0, 7).map((r, idx) => {
      const val = Number(r[metricKey] || 0);
      const isNegative = val < 0;
      const start = runningTotal;
      runningTotal += val;
      return {
        name: String(r[dimKey] || `Step ${idx + 1}`),
        start: start,
        value: Math.abs(val),
        displayVal: val,
        isNegative
      };
    });

    return (
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="name" stroke="#64748B" fontSize={10} interval={0} angle={-15} textAnchor="end" />
            <YAxis stroke="#64748B" fontSize={10} tickFormatter={formatNum} />
            <Tooltip
              contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px', fontSize: '11px' }}
              formatter={(val: any, name: any, item: any) => [formatNum(item.payload.displayVal), formatLabel(metricKey)]}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {waterfallData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.isNegative ? '#EF4444' : '#10B981'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // 3. HORIZONTAL BAR CHART (Store Profitability / Lagos vs Abuja Executive Comparison)
  if (normType === 'horizontal_bar') {
    const data = records.slice(0, 8).map(r => ({
      name: String(r[dimKey] || 'Item'),
      value: Number(r[metricKey] || 0)
    }));

    return (
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis type="number" stroke="#64748B" fontSize={10} tickFormatter={formatNum} />
            <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={10} width={100} />
            <Tooltip
              contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px', fontSize: '11px' }}
              formatter={(val: any) => [formatNum(Number(val)), formatLabel(metricKey)]}
            />
            <Bar dataKey="value" fill="#6366F1" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // 4. HEATMAP GRID (Inventory Imbalance / Store-Category Matrix)
  if (normType === 'heatmap') {
    const topRecords = records.slice(0, 12);
    return (
      <div style={{ width: '100%', height, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', padding: '4px' }}>
        {topRecords.map((r, idx) => {
          const val = Number(r[metricKey] || 0);
          const name = String(r[dimKey] || `Item ${idx + 1}`);
          const statusBg = val < 0 ? '#FEE2E2' : (val > 100 ? '#FEF3C7' : '#DCFCE7');
          const statusColor = val < 0 ? '#991B1B' : (val > 100 ? '#92400E' : '#166534');
          return (
            <div
              key={idx}
              style={{
                backgroundColor: statusBg,
                color: statusColor,
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {name}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                {formatNum(val)}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // 5. TREEMAP / SEGMENTATION (Customer LTV / Segment Contribution)
  if (normType === 'treemap') {
    const totalVal = records.reduce((acc, r) => acc + Number(r[metricKey] || 0), 0);
    const topRecords = records.slice(0, 6);

    return (
      <div style={{ width: '100%', height, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
        {topRecords.map((r, idx) => {
          const val = Number(r[metricKey] || 0);
          const pct = totalVal > 0 ? ((val / totalVal) * 100).toFixed(1) : '0';
          const name = String(r[dimKey] || `Segment ${idx + 1}`);
          return (
            <div
              key={idx}
              style={{
                backgroundColor: COLORS[idx % COLORS.length],
                color: '#FFFFFF',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700 }}>{name}</div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{formatNum(val)}</div>
                <div style={{ fontSize: '10px', opacity: 0.9 }}>{pct}% of total</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // 6. DEFAULT / BAR CHART / PARETO CONTRIBUTION CHART
  const defaultData = records.slice(0, 10).map(r => ({
    name: String(r[dimKey] || 'Item'),
    value: Number(r[metricKey] || 0),
    cum_share: Number(r.cum_share_pct || r.share_pct || 0)
  }));

  const hasCumShare = defaultData.some(d => d.cum_share > 0);

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        {hasCumShare ? (
          <ComposedChart data={defaultData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="name" stroke="#64748B" fontSize={10} interval={0} angle={-20} textAnchor="end" />
            <YAxis yAxisId="left" stroke="#64748B" fontSize={10} tickFormatter={formatNum} />
            <YAxis yAxisId="right" orientation="right" stroke="#10B981" fontSize={10} unit="%" domain={[0, 100]} />
            <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px', fontSize: '11px' }} />
            <Bar yAxisId="left" dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="cum_share" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
          </ComposedChart>
        ) : (
          <BarChart data={defaultData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="name" stroke="#64748B" fontSize={10} interval={0} angle={-20} textAnchor="end" />
            <YAxis stroke="#64748B" fontSize={10} tickFormatter={formatNum} />
            <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px', fontSize: '11px' }} />
            <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]}>
              {defaultData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
