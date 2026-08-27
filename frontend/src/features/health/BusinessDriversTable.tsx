import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, AlertTriangle, ChevronRight, AlertCircle, BarChart3, Layers } from 'lucide-react';
import type { ActiveKPI, ExecutiveHealthStatus } from '../../types/api';

interface BusinessDriversTableProps {
  contributions: ActiveKPI[];
  onSelectDriver: (driver: ActiveKPI) => void;
  onInvestigateDriver: (driverName: string) => void;
}

export const BusinessDriversTable: React.FC<BusinessDriversTableProps> = ({
  contributions,
  onSelectDriver,
  onInvestigateDriver
}) => {
  const [viewMode, setViewMode] = useState<'business' | 'decomposition'>('business');

  const getExecutiveStatusBadge = (kpi: ActiveKPI) => {
    const status = kpi.executive_status || (kpi.status === 'HEALTHY' ? 'HEALTHY' : kpi.status === 'WARNING' ? 'NEEDS_ATTENTION' : 'CRITICAL_ATTENTION_REQUIRED');

    switch (status) {
      case 'EXCELLENT':
        return {
          label: 'Excellent',
          bg: 'var(--color-healthy-bg)',
          color: 'var(--color-healthy)',
          border: 'var(--color-healthy-border)',
          icon: <CheckCircle2 size={12} />
        };
      case 'HEALTHY':
        return {
          label: 'Healthy',
          bg: 'var(--color-healthy-bg)',
          color: 'var(--color-healthy)',
          border: 'var(--color-healthy-border)',
          icon: <CheckCircle2 size={12} />
        };
      case 'NEEDS_ATTENTION':
        return {
          label: 'Needs Attention',
          bg: 'var(--color-warning-bg)',
          color: 'var(--color-warning)',
          border: 'var(--color-warning-border)',
          icon: <AlertTriangle size={12} />
        };
      case 'AT_RISK':
        return {
          label: 'At Risk',
          bg: '#FFF7ED',
          color: '#EA580C',
          border: '#FED7AA',
          icon: <AlertTriangle size={12} />
        };
      case 'CRITICAL_ATTENTION_REQUIRED':
        return {
          label: 'Critical',
          bg: 'var(--color-critical-bg)',
          color: 'var(--color-critical)',
          border: 'var(--color-critical-border)',
          icon: <AlertCircle size={12} />
        };
      default:
        return {
          label: 'Tracking',
          bg: 'var(--bg-input)',
          color: 'var(--text-secondary)',
          border: 'var(--border-subtle)',
          icon: <CheckCircle2 size={12} />
        };
    }
  };

  const formatValue = (val: number, kpiId: string) => {
    if (kpiId.includes('revenue') || kpiId.includes('profit') || kpiId.includes('cogs')) {
      if (val >= 1_000_000_000) return `₦${(val / 1_000_000_000).toFixed(2)}B`;
      if (val >= 1_000_000) return `₦${(val / 1_000_000).toFixed(2)}M`;
      return `₦${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (kpiId.includes('rate') || kpiId.includes('margin') || kpiId.includes('discount')) {
      return `${val.toFixed(1)}%`;
    }
    if (kpiId.includes('units') || kpiId.includes('quantity')) {
      return `${val.toLocaleString()} units`;
    }
    return val.toLocaleString();
  };

  const getVarianceLabel = (kpi: ActiveKPI) => {
    if (kpi.variance_pct === null || kpi.variance_pct === undefined) return 'Benchmark Baseline';
    const isHigherBetter = kpi.directionality === 'HIGHER_IS_BETTER';
    const isPositive = isHigherBetter ? kpi.variance_pct >= 0 : kpi.variance_pct <= 0;
    const sign = kpi.variance_pct > 0 ? '+' : '';
    return `${sign}${kpi.variance_pct.toFixed(1)}% (${isPositive ? 'Ahead of target' : 'Behind target'})`;
  };

  const availableDrivers = contributions.filter(c => c.is_available);

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-card)',
      padding: '24px 28px',
      boxShadow: 'var(--shadow-card)'
    }}>
      {/* Header & View Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em', margin: 0 }}>
            Operational Business Drivers
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Deterministic performance across all verified dataset measures
          </p>
        </div>

        {/* View Mode Toggle */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-surface)',
          padding: '3px',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setViewMode('business')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              backgroundColor: viewMode === 'business' ? 'var(--bg-card)' : 'transparent',
              color: viewMode === 'business' ? 'var(--brand-primary)' : 'var(--text-muted)',
              boxShadow: viewMode === 'business' ? 'var(--shadow-sm)' : 'none',
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <BarChart3 size={13} />
            <span>Executive View</span>
          </button>

          <button
            onClick={() => setViewMode('decomposition')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              backgroundColor: viewMode === 'decomposition' ? 'var(--bg-card)' : 'transparent',
              color: viewMode === 'decomposition' ? 'var(--brand-primary)' : 'var(--text-muted)',
              boxShadow: viewMode === 'decomposition' ? 'var(--shadow-sm)' : 'none',
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            title="Inspect health score mathematical weights and points"
          >
            <Layers size={13} />
            <span>Score Decomposition</span>
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '11px', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <th style={{ padding: '10px 12px', fontWeight: 700 }}>Driver Name</th>
              <th style={{ padding: '10px 12px', fontWeight: 700 }}>Category</th>
              <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'right' }}>Current Actual</th>
              <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'right' }}>
                {viewMode === 'business' ? 'Target / Benchmark' : 'Weight'}
              </th>
              <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: viewMode === 'business' ? 'left' : 'right' }}>
                {viewMode === 'business' ? 'Operational Variance' : 'Score Impact'}
              </th>
              <th style={{ padding: '10px 12px', fontWeight: 700 }}>Status</th>
              <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {availableDrivers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No active business drivers available in the connected dataset.
                </td>
              </tr>
            ) : (
              availableDrivers.map((contrib) => {
                const badge = getExecutiveStatusBadge(contrib);
                const isPositive = contrib.drag_points === 0;

                return (
                  <tr
                    key={contrib.kpi_id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background-color 0.15s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => onSelectDriver(contrib)}
                  >
                    {/* Driver Name */}
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {contrib.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                        {contrib.formula_breadcrumb}
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{
                        fontSize: '11px',
                        backgroundColor: 'var(--bg-surface)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        color: 'var(--text-secondary)',
                        fontWeight: 600
                      }}>
                        {contrib.category}
                      </span>
                    </td>

                    {/* Current Actual Value */}
                    <td style={{ padding: '14px 12px', textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                      {formatValue(contrib.current_value, contrib.kpi_id)}
                    </td>

                    {/* Target / Weight */}
                    <td style={{ padding: '14px 12px', textAlign: 'right', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      {viewMode === 'business' ? (
                        contrib.target_value !== null && contrib.target_value !== undefined ? (
                          formatValue(contrib.target_value, contrib.kpi_id)
                        ) : (
                          <span style={{ color: 'var(--text-dim)' }}>Baseline</span>
                        )
                      ) : (
                        `${contrib.weight_pct.toFixed(0)}%`
                      )}
                    </td>

                    {/* Operational Variance / Score Impact */}
                    <td style={{ padding: '14px 12px', textAlign: viewMode === 'business' ? 'left' : 'right' }}>
                      {viewMode === 'business' ? (
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: isPositive ? 'var(--color-healthy)' : 'var(--color-warning)'
                        }}>
                          {getVarianceLabel(contrib)}
                        </span>
                      ) : (
                        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span style={{
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            color: isPositive ? 'var(--color-healthy)' : 'var(--color-critical)'
                          }}>
                            {isPositive ? `+${contrib.points_contributed.toFixed(1)} pts` : `-${contrib.drag_points.toFixed(1)} drag`}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '3px 9px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: badge.bg,
                        color: badge.color,
                        border: `1px solid ${badge.border}`,
                        fontSize: '11px',
                        fontWeight: 700
                      }}>
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>
                    </td>

                    {/* Action */}
                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onInvestigateDriver(contrib.name);
                        }}
                        style={{
                          backgroundColor: 'transparent',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          padding: '5px 10px',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: 'var(--brand-primary)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title={`Investigate ${contrib.name}`}
                      >
                        <span>Investigate</span>
                        <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
