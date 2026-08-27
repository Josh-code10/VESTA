import React, { useState } from 'react';
import { CheckCircle2, Circle, Cpu, ChevronDown, ChevronUp, BrainCircuit } from 'lucide-react';
import { AnalysisPlanStep } from '../../types/api';

interface AnalysisPlanProgressProps {
  planSteps?: AnalysisPlanStep[];
}

export const AnalysisPlanProgress: React.FC<AnalysisPlanProgressProps> = ({ planSteps }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!planSteps || planSteps.length === 0) return null;

  const completedCount = planSteps.filter(s => s.status === 'COMPLETED').length;

  return (
    <div
      style={{
        backgroundColor: '#F8FAFC',
        border: '1px solid var(--border-subtle)',
        borderRadius: '10px',
        padding: isExpanded ? '12px 16px' : '8px 14px',
        marginBottom: '12px',
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          textAlign: 'left'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 700, color: 'var(--brand-primary)', letterSpacing: '0.03em' }}>
          <BrainCircuit size={14} style={{ color: '#6366F1' }} />
          <span>VESTA ANALYTICAL STEPS ({completedCount}/{planSteps.length} COMPLETED)</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
          <span>{isExpanded ? 'Hide Thinking' : 'Show Thinking'}</span>
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      {isExpanded && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #E2E8F0' }}>
          {planSteps.map((stepItem, idx) => {
            const isCompleted = stepItem.status === 'COMPLETED';
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: isCompleted ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight: isCompleted ? 600 : 400
                }}
              >
                {isCompleted ? (
                  <CheckCircle2 size={14} style={{ color: 'var(--status-healthy)', flexShrink: 0 }} />
                ) : (
                  <Circle size={14} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
                )}
                <span style={{ textDecoration: isCompleted ? 'none' : 'line-through' }}>
                  {stepItem.step}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
