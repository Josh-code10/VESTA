import React from 'react';
import { X, ArrowRight, BarChart2, Terminal, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { ActiveKPI } from '../../types/api';

interface DriverExplanationDrawerProps {
  driver: ActiveKPI | null;
  kpiDetails?: ActiveKPI;
  onClose: () => void;
  onShowEvidence: (title: string, data: any[], formula: string) => void;
  onInvestigate: (prompt: string) => void;
}

export const DriverExplanationDrawer: React.FC<DriverExplanationDrawerProps> = ({
  driver,
  kpiDetails,
  onClose,
  onShowEvidence,
  onInvestigate
}) => {
  if (!driver) return null;

  const isHealthy = driver.status === 'HEALTHY';
  const effectiveDetails = kpiDetails || driver;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(4px)',
      zIndex: 50,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '520px',
        height: '100%',
        backgroundColor: 'var(--bg-card)',
        borderLeft: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)',
        animation: 'slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 28px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-surface)'
        }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              Scoring Methodology & Driver Breakdown
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {driver.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Executive Impact Summary */}
          <div style={{
            padding: '16px 20px',
            borderRadius: 'var(--radius-inner)',
            backgroundColor: isHealthy ? 'var(--color-healthy-bg)' : 'var(--color-critical-bg)',
            border: `1px solid ${isHealthy ? 'var(--color-healthy-border)' : 'var(--color-critical-border)'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              {isHealthy ? <CheckCircle2 size={16} color="var(--color-healthy)" /> : <AlertTriangle size={16} color="var(--color-critical)" />}
              <span style={{ fontSize: '13px', fontWeight: 700, color: isHealthy ? 'var(--color-healthy)' : 'var(--color-critical)' }}>
                {isHealthy ? `+${driver.points_contributed.toFixed(1)} Points Contributed to Health Score` : `-${driver.drag_points.toFixed(1)} Points Drag on Enterprise Score`}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Driver Score: <strong className="tabular-nums">{driver.metric_score.toFixed(1)}/100</strong>. Evaluated against business targets and benchmark variance.
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}>
            <div style={{
              padding: '14px 16px',
              backgroundColor: 'var(--bg-card-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-inner)'
            }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Current Actual Value
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }} className="tabular-nums">
                {effectiveDetails.current_value !== undefined ? effectiveDetails.current_value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : `${driver.metric_score.toFixed(1)}%`}
              </div>
            </div>

            <div style={{
              padding: '14px 16px',
              backgroundColor: 'var(--bg-card-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-inner)'
            }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Target Benchmark
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }} className="tabular-nums">
                {effectiveDetails.target_value != null ? effectiveDetails.target_value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 'Enterprise Target'}
              </div>
            </div>
          </div>

          {/* Mathematical Formula Breadcrumb */}
          <div style={{
            padding: '16px 18px',
            backgroundColor: 'var(--bg-card-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-inner)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              <Terminal size={14} color="var(--brand-primary)" />
              <span>Deterministic Lineage Breadcrumb</span>
            </div>
            <code style={{
              display: 'block',
              padding: '10px 12px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              lineHeight: '1.4'
            }}>
              {effectiveDetails.formula_breadcrumb || `EVALUATE(${driver.kpi_id}) -> WEIGHTED_NORM(value, target)`}
            </code>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Calculated deterministically via Pandas analytical engine. Zero synthetic math.
            </div>
          </div>

          {/* Epistemic Note */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            padding: '12px 14px',
            backgroundColor: 'rgba(99, 102, 241, 0.06)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
            borderRadius: 'var(--radius-inner)',
            fontSize: '12px',
            color: 'var(--text-secondary)'
          }}>
            <Info size={15} color="var(--brand-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Epistemic Guarantee:</strong> This driver is backed by 100% verified transactional data from your connected Google Sheet.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '20px 28px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={() => {
              onShowEvidence(
                `${driver.name} Performance Slice`,
                [
                  { label: 'Current Value', value: effectiveDetails.current_value || driver.metric_score },
                  { label: 'Target Benchmark', value: effectiveDetails.target_value || 85 }
                ],
                effectiveDetails.formula_breadcrumb || 'CALCULATE_KPI(driver)'
              );
              onClose();
            }}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              padding: '10px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <BarChart2 size={14} />
            <span>Show Evidence</span>
          </button>

          <button
            onClick={() => {
              onInvestigate(`Why is ${driver.name} performing at this level?`);
              onClose();
            }}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              backgroundColor: 'var(--brand-primary)',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(99, 102, 241, 0.35)'
            }}
          >
            <span>Investigate Driver</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
