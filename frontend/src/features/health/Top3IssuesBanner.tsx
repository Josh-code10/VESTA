import React from 'react';
import { AlertCircle, AlertTriangle, ArrowRight, BarChart2, DollarSign, ChevronRight, Zap } from 'lucide-react';
import type { HealthIssue } from '../../types/api';

interface Top3IssuesBannerProps {
  issues: HealthIssue[];
  onInvestigateIssue: (issue: HealthIssue) => void;
  onShowEvidence: (issue: HealthIssue) => void;
  onViewMoreIssues: () => void;
}

export const Top3IssuesBanner: React.FC<Top3IssuesBannerProps> = ({
  issues,
  onInvestigateIssue,
  onShowEvidence,
  onViewMoreIssues
}) => {
  if (!issues || issues.length === 0) return null;

  const getSeverityBadge = (severity: 'CRITICAL' | 'WARNING') => {
    switch (severity) {
      case 'CRITICAL':
        return {
          label: 'Critical Issue',
          bg: 'var(--color-critical-bg)',
          color: 'var(--color-critical)',
          border: 'var(--color-critical-border)',
          icon: <AlertCircle size={13} />
        };
      case 'WARNING':
        return {
          label: 'Attention Needed',
          bg: 'var(--color-warning-bg)',
          color: 'var(--color-warning)',
          border: 'var(--color-warning-border)',
          icon: <AlertTriangle size={13} />
        };
      default:
        return {
          label: 'Operational Note',
          bg: 'var(--brand-light)',
          color: 'var(--brand-primary)',
          border: 'rgba(99, 102, 241, 0.2)',
          icon: <AlertCircle size={13} />
        };
    }
  };

  return (
    <div style={{
      marginTop: '28px',
      backgroundColor: '#FFFBEB',
      border: '1.5px solid #FBBF24',
      borderRadius: 'var(--radius-card)',
      padding: '24px 28px',
      boxShadow: 'var(--shadow-card)'
    }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#B45309', letterSpacing: '-0.02em', margin: 0 }}>
            Management Attention
          </h2>
          <p style={{ fontSize: '12px', color: '#92400E', margin: '4px 0 0 0' }}>
            Ranked deterministically by financial impact, target divergence, and business criticality
          </p>
        </div>

        <button
          onClick={onViewMoreIssues}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            color: '#B45309',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <span>View All Operational Anomalies</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Top 3 Executive Action Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '16px'
      }}>
        {issues.slice(0, 3).map((issue, idx) => {
          const badge = getSeverityBadge(issue.severity);

          return (
            <div
              key={issue.issue_id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                borderRadius: 'var(--radius-inner)',
                padding: '20px 22px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              className="executive-card"
            >
              <div>
                {/* Card Top: Rank & Severity */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: 'var(--text-dim)',
                      backgroundColor: 'var(--bg-input)',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      #{idx + 1} PRIORITY
                    </span>
                    
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: badge.bg,
                      color: badge.color,
                      border: `1px solid ${badge.border}`,
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      {badge.icon}
                      {badge.label}
                    </span>
                  </div>

                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }} className="tabular-nums">
                    Score: {issue.normalized_priority_score.toFixed(3)}
                  </span>
                </div>

                {/* Issue Title */}
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: '1.3', marginBottom: '8px' }}>
                  {issue.title}
                </h3>

                {/* Why Management Should Care */}
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '14px' }}>
                  {issue.ranking_reason}
                </p>

                {/* Financial Impact Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-card-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-inner)',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  marginBottom: '16px'
                }}>
                  <DollarSign size={14} color="var(--color-critical)" />
                  <span>{issue.financial_impact_label}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <button
                  onClick={() => onShowEvidence(issue)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <BarChart2 size={13} />
                  <span>Show Evidence</span>
                </button>

                <button
                  onClick={() => onInvestigateIssue(issue)}
                  style={{
                    flex: 1.2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    backgroundColor: 'var(--brand-primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(99, 102, 241, 0.25)'
                  }}
                >
                  <Zap size={13} />
                  <span>Investigate</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
