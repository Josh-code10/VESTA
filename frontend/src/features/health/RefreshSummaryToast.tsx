import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface RefreshSummaryToastProps {
  score: number;
  scoreDelta?: number;
  issueCount: number;
  kpiCount: number;
  onDismiss: () => void;
}

export const RefreshSummaryToast: React.FC<RefreshSummaryToastProps> = ({
  score,
  scoreDelta = 0,
  issueCount,
  kpiCount,
  onDismiss
}) => {
  return (
    <div style={{
      backgroundColor: 'var(--color-healthy-bg)',
      border: '1px solid var(--color-healthy-border)',
      borderRadius: 'var(--radius-card)',
      padding: '16px 22px',
      marginBottom: '24px',
      boxShadow: 'var(--shadow-card)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      animation: 'slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-healthy)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <CheckCircle2 size={18} />
        </div>

        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-healthy)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Data Synchronization Complete</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>• Just now</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Enterprise Health Score: <strong>{score.toFixed(0)}/100</strong> ({scoreDelta >= 0 ? `+${scoreDelta.toFixed(1)} pts` : `${scoreDelta.toFixed(1)} pts`}) · <strong>{kpiCount}</strong> business drivers evaluated · <strong>{issueCount}</strong> management attention items prioritized.
          </div>
        </div>
      </div>

      <button
        onClick={onDismiss}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '6px',
          borderRadius: '6px'
        }}
      >
        <X size={16} />
      </button>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
