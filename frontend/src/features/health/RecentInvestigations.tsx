import React from 'react';
import { Compass, ArrowRight, Clock } from 'lucide-react';
import { EpistemicBadge } from '../../components/epistemic/EpistemicBadge';
import type { EvidenceNode } from '../../types/api';

interface RecentInvestigationsProps {
  nodes: EvidenceNode[];
  onContinueInvestigation: (node: EvidenceNode) => void;
  onNewInvestigation: () => void;
}

export const RecentInvestigations: React.FC<RecentInvestigationsProps> = ({
  nodes,
  onContinueInvestigation,
  onNewInvestigation
}) => {
  if (!nodes || nodes.length === 0) return null;

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div style={{ marginTop: '32px', marginBottom: '40px' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={16} color="var(--brand-primary)" />
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Active Root-Cause Investigations
          </h2>
        </div>

        <button
          onClick={onNewInvestigation}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--brand-primary)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          + Start New Investigation
        </button>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '14px'
      }}>
        {nodes.map((node, idx) => (
          <div
            key={node.node_id}
            onClick={() => onContinueInvestigation(node)}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-card)',
              padding: '18px 20px',
              boxShadow: 'var(--shadow-card)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.15s ease'
            }}
            className="executive-card"
          >
            <div>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 700 }}>
                  STAGE #{idx + 1}
                </span>
                <EpistemicBadge tag={node.epistemic_status} size="sm" />
              </div>

              {/* Question */}
              <h3 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: '1.4', marginBottom: '8px' }}>
                "{node.user_question}"
              </h3>

              {/* Finding Snippet */}
              <p style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                lineHeight: '1.4',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {node.executive_finding.replace(/\*\*/g, '').replace(/\[\w+\]/g, '')}
              </p>
            </div>

            {/* Bottom Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <Clock size={11} />
                <span>{formatTimestamp(node.created_at)}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: 'var(--brand-primary)' }}>
                <span>Continue</span>
                <ArrowRight size={12} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
