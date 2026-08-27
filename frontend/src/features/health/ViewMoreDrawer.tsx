import React from 'react';
import { X, AlertTriangle, ArrowRight } from 'lucide-react';
import { HealthIssue } from '../../types/api';

interface ViewMoreDrawerProps {
  isOpen: boolean;
  issues: HealthIssue[];
  onClose: () => void;
  onInvestigateIssue: (issue: HealthIssue) => void;
}

export const ViewMoreDrawer: React.FC<ViewMoreDrawerProps> = ({
  isOpen,
  issues,
  onClose,
  onInvestigateIssue
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      display: 'flex',
      justifyContent: 'flex-end',
      zIndex: 50,
      backdropFilter: 'blur(2px)'
    }}>
      <div style={{
        width: '440px',
        backgroundColor: 'var(--bg-surface)',
        borderLeft: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} color="var(--color-warning)" />
            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.02em', color: 'var(--text-primary)' }}>
              ADDITIONAL BUSINESS ANOMALIES ({issues.length})
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
          {issues.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '40px 0', fontSize: '12px' }}>
              No secondary anomalies detected across active dimensions.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {issues.map((issue, idx) => (
                <div
                  key={issue.issue_id || idx}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      padding: '2px 5px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-warning-bg)',
                      color: 'var(--color-warning)'
                    }}>
                      {issue.severity}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      Priority: {issue.normalized_priority_score}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {issue.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    Driver: {issue.primary_driver}
                  </div>

                  <button
                    onClick={() => {
                      onInvestigateIssue(issue);
                      onClose();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--brand-primary)',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <span>Investigate</span>
                    <ArrowRight size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
