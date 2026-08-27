import React from 'react';
import { Sliders, HelpCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ActiveKPI, KPIStatus } from '../../types/api';

interface KPIGridProps {
  kpis: ActiveKPI[];
  onInvestigateKPI: (kpi: ActiveKPI) => void;
  onOpenCustomizer: () => void;
}

export const KPIGrid: React.FC<KPIGridProps> = ({ kpis, onInvestigateKPI, onOpenCustomizer }) => {
  const formatValue = (kpi: ActiveKPI) => {
    const val = kpi.current_value;
    if (kpi.kpi_id.includes('revenue') || kpi.kpi_id.includes('aov') || kpi.category === 'Financial') {
      if (val >= 1000000) {
        return `₦${(val / 1000000).toFixed(2)}M`;
      }
      return `₦${val.toLocaleString()}`;
    }
    if (kpi.kpi_id.includes('rate') || kpi.kpi_id.includes('margin') || kpi.kpi_id.includes('pct') || kpi.kpi_id.includes('depth')) {
      return `${val.toFixed(1)}%`;
    }
    return val.toLocaleString();
  };

  const getStatusBadge = (status: KPIStatus) => {
    switch (status) {
      case 'HEALTHY':
        return { color: 'var(--color-healthy)', bg: 'var(--color-healthy-bg)', label: 'HEALTHY' };
      case 'WARNING':
        return { color: 'var(--color-warning)', bg: 'var(--color-warning-bg)', label: 'WARNING' };
      case 'CRITICAL':
      default:
        return { color: 'var(--color-critical)', bg: 'var(--color-critical-bg)', label: 'CRITICAL' };
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.06em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
          ADAPTIVE BUSINESS MEASURES ({kpis.length} ACTIVE)
        </span>
        <button
          onClick={onOpenCustomizer}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            padding: '5px 10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <Sliders size={12} />
          <span>Configure KPIs</span>
        </button>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {kpis.map((kpi) => {
          const status = getStatusBadge(kpi.status);
          const hasVariance = kpi.variance_pct !== undefined && kpi.variance_pct !== null;
          const isPos = (kpi.variance_pct || 0) > 0;

          return (
            <div
              key={kpi.kpi_id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E5E7EB',
                borderRadius: 'var(--radius-card)',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                {/* Category & Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
                    {kpi.category}
                  </span>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    padding: '2px 5px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: status.bg,
                    color: status.color
                  }}>
                    {status.label}
                  </span>
                </div>

                {/* Name */}
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {kpi.name}
                </div>

                {/* Big Number */}
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }} className="tabular-nums">
                  {formatValue(kpi)}
                </div>

                {/* Variance Chip */}
                {hasVariance && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: isPos ? 'var(--color-healthy)' : 'var(--color-critical)', marginBottom: '12px' }}>
                    {isPos ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    <span className="tabular-nums">{isPos ? `+${kpi.variance_pct}%` : `${kpi.variance_pct}%`}</span>
                    <span style={{ color: 'var(--text-dim)' }}>vs baseline</span>
                  </div>
                )}
              </div>

              {/* Investigation Trigger */}
              <button
                onClick={() => onInvestigateKPI(kpi)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--brand-primary)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0
                }}
              >
                <HelpCircle size={11} />
                <span>Why is this {status.label}?</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
