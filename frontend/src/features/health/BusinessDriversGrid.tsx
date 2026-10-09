import React, { useState } from 'react';
import { ArrowUpRight, TrendingUp, TrendingDown, BarChart2, CheckCircle2, AlertTriangle, AlertCircle, ShieldAlert } from 'lucide-react';
import type { ActiveKPI, KPIStatus, ExecutiveHealthStatus } from '../../types/api';

interface BusinessDriversGridProps {
  kpis: ActiveKPI[];
  availableCategories?: string[];
  onInvestigateKPI: (kpi: ActiveKPI) => void;
  onShowEvidence: (title: string, data: any[], formula: string) => void;
}

export const BusinessDriversGrid: React.FC<BusinessDriversGridProps> = ({
  kpis,
  availableCategories = [],
  onInvestigateKPI,
  onShowEvidence
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const getStatusBadge = (kpi: ActiveKPI) => {
    const execStatus = kpi.executive_status || (kpi.status === 'HEALTHY' ? 'HEALTHY' : kpi.status === 'WARNING' ? 'NEEDS_ATTENTION' : 'CRITICAL_ATTENTION_REQUIRED');

    switch (execStatus) {
      case 'EXCELLENT':
        return {
          label: 'Excellent',
          bg: 'var(--color-healthy-bg)',
          color: 'var(--color-healthy)',
          border: 'var(--color-healthy-border)',
          icon: <CheckCircle2 size={11} />
        };
      case 'HEALTHY':
        return {
          label: 'Healthy',
          bg: 'var(--color-healthy-bg)',
          color: 'var(--color-healthy)',
          border: 'var(--color-healthy-border)',
          icon: <CheckCircle2 size={11} />
        };
      case 'NEEDS_ATTENTION':
        return {
          label: 'Needs Attention',
          bg: 'var(--color-warning-bg)',
          color: 'var(--color-warning)',
          border: 'var(--color-warning-border)',
          icon: <AlertTriangle size={11} />
        };
      case 'AT_RISK':
        return {
          label: 'At Risk',
          bg: '#FFF7ED',
          color: '#EA580C',
          border: '#FED7AA',
          icon: <AlertTriangle size={11} />
        };
      case 'CRITICAL_ATTENTION_REQUIRED':
        return {
          label: 'Critical',
          bg: 'var(--color-critical-bg)',
          color: 'var(--color-critical)',
          border: 'var(--color-critical-border)',
          icon: <AlertCircle size={11} />
        };
      default:
        return {
          label: 'Tracking',
          bg: 'var(--bg-input)',
          color: 'var(--text-muted)',
          border: 'var(--border-subtle)',
          icon: null
        };
    }
  };

  const getCategoryFromKPI = (kpi: ActiveKPI) => {
    if (kpi.category) {
      const cat = kpi.category.toUpperCase();
      if (cat.includes('FINANCE') || cat.includes('FINANCIAL')) return 'FINANCE';
      if (cat.includes('SALES') || cat.includes('COMMERCIAL')) return 'SALES';
      if (cat.includes('OPERAT') || cat.includes('DELIVERY') || cat.includes('RETURN')) return 'OPERATIONS';
      if (cat.includes('CUSTOMER')) return 'CUSTOMER';
      if (cat.includes('MARKET')) return 'MARKETING';
    }
    const name = (kpi.name + ' ' + kpi.kpi_id).toLowerCase();
    if (name.includes('revenue') || name.includes('margin') || name.includes('profit') || name.includes('cogs')) return 'FINANCE';
    if (name.includes('unit') || name.includes('order') || name.includes('aov') || name.includes('discount')) return 'SALES';
    if (name.includes('return') || name.includes('delivery') || name.includes('shipping') || name.includes('inventory')) return 'OPERATIONS';
    if (name.includes('csat') || name.includes('nps') || name.includes('customer')) return 'CUSTOMER';
    if (name.includes('campaign') || name.includes('marketing') || name.includes('roas')) return 'MARKETING';
    return 'FINANCE';
  };

  // Only present category tabs that actually contain available KPIs
  const populatedCategories = Array.from(new Set(kpis.filter(k => k.is_available).map(k => getCategoryFromKPI(k))));
  const displayTabs = ['ALL', ...populatedCategories];

  const filteredKPIs = selectedCategory === 'ALL'
    ? kpis
    : kpis.filter(kpi => getCategoryFromKPI(kpi) === selectedCategory);

  return (
    <div style={{ marginTop: '32px' }}>
      {/* Header & Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Operational Business Drivers
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Empirically verified business metrics mapped across active enterprise capabilities
          </p>
        </div>

        {/* Dynamic Category Tabs (Empty categories hidden) */}
        {displayTabs.length > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            padding: '4px',
            borderRadius: 'var(--radius-full)'
          }}>
            {displayTabs.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: selectedCategory === cat ? 'var(--brand-primary)' : 'transparent',
                  color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-secondary)',
                  border: 'none',
                  padding: '4px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Drivers Cards Grid */}
      {filteredKPIs.length === 0 ? (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-muted)'
        }}>
          No business drivers detected in this operational category.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {filteredKPIs.map((kpi) => {
            const badge = getStatusBadge(kpi);
            const isPositiveTrend = (kpi.variance_pct || 0) >= 0;

            return (
              <div
                key={kpi.kpi_id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-card)',
                  padding: '20px 22px',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  opacity: kpi.is_available ? 1 : 0.6
                }}
                className="executive-card"
              >
                <div>
                  {/* Top Row: Name & Status */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--brand-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {getCategoryFromKPI(kpi)}
                      </span>
                      <h3 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                        {kpi.name}
                      </h3>
                    </div>

                    {kpi.is_available ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: badge.bg,
                        color: badge.color,
                        border: `1px solid ${badge.border}`,
                        fontSize: '10px',
                        fontWeight: 700
                      }}>
                        {badge.icon}
                        {badge.label}
                      </span>
                    ) : (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'var(--text-dim)',
                        backgroundColor: 'var(--bg-input)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        NOT CONNECTED
                      </span>
                    )}
                  </div>

                  {/* Metric Value & Target Variance */}
                  {kpi.is_available ? (
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }} className="tabular-nums">
                        {kpi.current_value !== undefined ? kpi.current_value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—'}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        {kpi.variance_pct != null && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: isPositiveTrend ? 'var(--color-healthy)' : 'var(--color-critical)'
                          }}>
                            {isPositiveTrend ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            <span className="tabular-nums">{Math.abs(kpi.variance_pct).toFixed(1)}%</span>
                          </div>
                        )}

                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          vs target: {kpi.target_value ? kpi.target_value.toLocaleString() : 'Benchmark'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      padding: '12px',
                      backgroundColor: 'var(--bg-card-secondary)',
                      borderRadius: 'var(--radius-inner)',
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      marginBottom: '14px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '2px' }}>
                        <ShieldAlert size={12} color="var(--color-warning)" />
                        <span>Data Not Recorded</span>
                      </div>
                      Required field(s) missing from connected sheet.
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {kpi.is_available && (
                  <div style={{ display: 'flex', gap: '6px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                    <button
                      onClick={() => {
                        onShowEvidence(
                          `${kpi.name} Empirical Breakdown`,
                          [
                            { label: 'Current Value', value: kpi.current_value },
                            { label: 'Target Benchmark', value: kpi.target_value || 85 }
                          ],
                          kpi.formula_breadcrumb
                        );
                      }}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        background: 'none',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: 'var(--text-secondary)',
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <BarChart2 size={12} />
                      <span>Evidence</span>
                    </button>

                    <button
                      onClick={() => onInvestigateKPI(kpi)}
                      style={{
                        flex: 1.2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        backgroundColor: 'rgba(99, 102, 241, 0.08)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        borderRadius: '6px',
                        color: 'var(--brand-primary)',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <span>Investigate</span>
                      <ArrowUpRight size={12} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
