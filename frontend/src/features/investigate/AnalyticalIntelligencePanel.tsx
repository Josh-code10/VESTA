import React from 'react';
import { Cpu, BarChart2, ShieldCheck, HelpCircle } from 'lucide-react';
import { VisualizationSpec } from '../../types/api';

interface AnalyticalIntelligencePanelProps {
  intentType?: string;
  visSpec?: VisualizationSpec;
}

export const AnalyticalIntelligencePanel: React.FC<AnalyticalIntelligencePanelProps> = ({
  intentType = 'INVESTIGATE',
  visSpec
}) => {
  if (!visSpec) return null;

  const primaryLabel = visSpec.primary_chart.replace('_', ' ').toUpperCase();
  const secondaryLabel = visSpec.secondary_chart ? visSpec.secondary_chart.replace('_', ' ').toUpperCase() : null;

  return (
    <div
      style={{
        backgroundColor: '#FAFAFA',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '14px 18px',
        marginBottom: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={15} style={{ color: 'var(--brand-primary)' }} />
          <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            Analytical Intelligence Engine
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Intent Tag */}
          <span
            style={{
              padding: '3px 9px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: 'var(--brand-primary)'
            }}
          >
            INTENT: {intentType}
          </span>

          {/* Analysis Type */}
          <span
            style={{
              padding: '3px 9px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: 'var(--status-healthy)'
            }}
          >
            ANALYSIS: {visSpec.analysis_type}
          </span>

          {/* Primary Visualization */}
          <span
            style={{
              padding: '3px 9px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            VISUALIZATION: {primaryLabel} {secondaryLabel ? `+ ${secondaryLabel}` : ''}
          </span>
        </div>
      </div>

      {/* Router Selection Rationale */}
      {visSpec.rationale && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          <HelpCircle size={14} style={{ color: 'var(--brand-primary)', flexShrink: 0, marginTop: '2px' }} />
          <span>
            <strong>Router Selection Rationale:</strong> {visSpec.rationale}
          </span>
        </div>
      )}
    </div>
  );
};
