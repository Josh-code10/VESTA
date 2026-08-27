import React from 'react';
import { Bookmark, Clock, ArrowRight, Play, CheckCircle2, AlertCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import type { ExecutiveMemory, MemoryStatus } from '../../types/api';

interface ExecutiveMemoryTimelineProps {
  memories: ExecutiveMemory[];
  onResumeInvestigation: (memory: ExecutiveMemory) => void;
  onUpdateStatus?: (memoryId: string, status: MemoryStatus) => void;
}

export const ExecutiveMemoryTimeline: React.FC<ExecutiveMemoryTimelineProps> = ({
  memories,
  onResumeInvestigation,
  onUpdateStatus
}) => {
  if (!memories || memories.length === 0) return null;

  const getStatusBadge = (status: MemoryStatus) => {
    switch (status) {
      case 'Improved':
        return { color: '#047857', bg: '#ECFDF5', border: '#A7F3D0', icon: <TrendingUp size={12} /> };
      case 'Resolved':
        return { color: '#166534', bg: '#F0FDF4', border: '#86EFAC', icon: <CheckCircle2 size={12} /> };
      case 'Monitoring':
        return { color: '#B45309', bg: '#FFFBEB', border: '#FDE68A', icon: <AlertCircle size={12} /> };
      case 'Escalated':
        return { color: '#B91C1C', bg: '#FEF2F2', border: '#FCA5A5', icon: <AlertTriangle size={12} /> };
      case 'Open':
      default:
        return { color: '#4F46E5', bg: '#EEF2FF', border: '#C7D2FE', icon: <Clock size={12} /> };
    }
  };

  return (
    <div style={{ marginTop: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            Executive Decision Memory
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Structured management decision log creating continuity across business refreshes
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {memories.map((mem) => {
          const badge = getStatusBadge(mem.status);
          return (
            <div
              key={mem.memory_id}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-card)',
                padding: '20px 24px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {/* Header: Driver, Status, Last Updated */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: 'var(--brand-primary)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {mem.business_driver}
                  </span>

                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: badge.color,
                    backgroundColor: badge.bg,
                    border: `1px solid ${badge.border}`,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {badge.icon}
                    <span>{mem.status}</span>
                  </span>
                </div>

                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Updated {new Date(mem.updated_at).toLocaleDateString()}
                </span>
              </div>

              {/* Title & Investigation Question */}
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                  {mem.title}
                </h3>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  "{mem.investigation}"
                </div>
              </div>

              {/* Management Decision Box */}
              <div style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-inner)',
                padding: '12px 16px',
                fontSize: '12px',
                lineHeight: '1.5'
              }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>
                  Recorded Management Decision:
                </strong>
                <span style={{ color: 'var(--text-secondary)' }}>{mem.management_decision}</span>
              </div>

              {/* Follow-up Question & CTA */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ fontSize: '12px', color: 'var(--brand-primary)', fontWeight: 600 }}>
                  Follow-up: {mem.followup_question}
                </div>

                <button
                  onClick={() => onResumeInvestigation(mem)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'var(--brand-primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <Play size={12} fill="currentColor" />
                  <span>Resume Investigation</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
