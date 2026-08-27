import React from 'react';
import { CheckCircle2, Clock, PlayCircle, ChevronRight, Layers } from 'lucide-react';
import { EvidenceNode } from '../../types/api';

interface InvestigationRoadmapProps {
  nodes: EvidenceNode[];
  activeNodeId?: string;
  onSelectStage: (node: EvidenceNode) => void;
}

export const InvestigationRoadmap: React.FC<InvestigationRoadmapProps> = ({
  nodes,
  activeNodeId,
  onSelectStage
}) => {
  if (nodes.length === 0) return null;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '14px 18px',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <Layers size={16} style={{ color: 'var(--brand-primary)' }} />
        <h4 style={{ margin: 0, fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
          Investigation Roadmap (Case Analytical Progression)
        </h4>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
        {nodes.map((node, idx) => {
          const isSelected = activeNodeId === node.node_id || (!activeNodeId && idx === nodes.length - 1);
          const isLatest = idx === nodes.length - 1;
          const stageName = node.insight?.five_artifact_response?.visualization_spec?.analysis_type || `Stage #${idx + 1}`;
          const qSnippet = node.user_question.length > 25 ? `${node.user_question.substring(0, 25)}...` : node.user_question;

          return (
            <React.Fragment key={node.node_id}>
              <div
                onClick={() => onSelectStage(node)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.08)' : '#F8FAFC',
                  border: isSelected ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isLatest ? (
                    <PlayCircle size={15} style={{ color: 'var(--brand-primary)' }} />
                  ) : (
                    <CheckCircle2 size={15} style={{ color: 'var(--status-healthy)' }} />
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: isSelected ? 'var(--brand-primary)' : 'var(--text-main)' }}>
                    Stage #{idx + 1}: {stageName}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {qSnippet}
                  </span>
                </div>

                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    padding: '2px 5px',
                    borderRadius: '4px',
                    backgroundColor: isLatest ? 'var(--brand-primary)' : '#E2E8F0',
                    color: isLatest ? '#FFFFFF' : 'var(--text-secondary)'
                  }}
                >
                  {isLatest ? 'ACTIVE' : 'COMPLETED'}
                </span>
              </div>

              {idx < nodes.length - 1 && (
                <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
