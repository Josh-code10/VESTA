import React from 'react';
import { Activity, ArrowRight, ShieldCheck } from 'lucide-react';
import { HealthScoreBreakdown, KPIStatus } from '../../types/api';

interface HealthScoreCardProps {
  healthScore: HealthScoreBreakdown;
  onInvestigateKPI: (kpiName: string, dragPoints: number) => void;
}

export const HealthScoreCard: React.FC<HealthScoreCardProps> = ({ healthScore, onInvestigateKPI }) => {
  const getStatusColor = (status: KPIStatus) => {
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

  const statusConfig = getStatusColor(healthScore.status);

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 24px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={16} color="var(--brand-primary)" />
          <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.06em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            EXPLAINABLE BUSINESS HEALTH SCORE
          </span>
        </div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '3px 8px',
          borderRadius: 'var(--radius-full)',
          fontSize: '11px',
          fontWeight: 700,
          backgroundColor: statusConfig.bg,
          color: statusConfig.color
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusConfig.color }} />
          <span>{statusConfig.label}</span>
        </div>
      </div>

      {/* Main Score & Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '24px', alignItems: 'center' }}>
        {/* Left: Big Score Display */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            fontSize: '44px',
            fontWeight: 800,
            color: statusConfig.color,
            lineHeight: 1
          }} className="tabular-nums">
            {healthScore.overall_score}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
            out of 100
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '8px' }}>
            {healthScore.active_kpi_count} Active KPIs
          </div>
        </div>

        {/* Right: Decomposable Breakdown Table */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
            Decomposable Point Contributions & Drag
          </div>

          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '6px 10px', color: 'var(--text-muted)', fontWeight: 600 }}>Metric</th>
                  <th style={{ padding: '6px 10px', color: 'var(--text-muted)', fontWeight: 600 }}>Weight</th>
                  <th style={{ padding: '6px 10px', color: 'var(--text-muted)', fontWeight: 600 }}>Points</th>
                  <th style={{ padding: '6px 10px', color: 'var(--text-muted)', fontWeight: 600 }}>Drag</th>
                  <th style={{ padding: '6px 10px', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {healthScore.contributions.map((kpi, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '6px 10px', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {kpi.name}
                    </td>
                    <td style={{ padding: '6px 10px', color: 'var(--text-muted)' }} className="tabular-nums">
                      {kpi.weight_pct}%
                    </td>
                    <td style={{ padding: '6px 10px', color: 'var(--color-healthy)', fontWeight: 600 }} className="tabular-nums">
                      +{kpi.points_contributed}
                    </td>
                    <td style={{ padding: '6px 10px', color: kpi.drag_points > 0 ? 'var(--color-critical)' : 'var(--text-dim)', fontWeight: 600 }} className="tabular-nums">
                      {kpi.drag_points > 0 ? `-${kpi.drag_points}` : '0'}
                    </td>
                    <td style={{ padding: '6px 10px', textAlign: 'right' }}>
                      <button
                        onClick={() => onInvestigateKPI(kpi.name, kpi.drag_points)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--brand-primary)',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}
                      >
                        <span>Investigate</span>
                        <ArrowRight size={10} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
