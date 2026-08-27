import React from 'react';
import { BarChart2, TrendingUp, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { PivotTableView } from './PivotTableView';

interface VisualizationRendererProps {
  fiveArtifactResponse?: {
    executive_answer: string;
    visualization_spec: {
      analysis_type: string;
      primary_chart: string;
      secondary_chart?: string;
      annotations: Array<{
        annotation_type: string;
        label: string;
        target_value?: number;
      }>;
    };
    pivot_table?: any;
    business_insight: string;
    business_implication: string;
  };
}

export const VisualizationRenderer: React.FC<VisualizationRendererProps> = ({ fiveArtifactResponse }) => {
  if (!fiveArtifactResponse) return null;

  const { visualization_spec } = fiveArtifactResponse;

  // Render only smart annotation badges if present, omitting heavy tables & implication banners to keep cards clean
  if (!visualization_spec.annotations || visualization_spec.annotations.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
      {visualization_spec.annotations.map((ann, idx) => (
        <div
          key={idx}
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#4338CA',
            backgroundColor: '#EEF2FF',
            border: '1px solid #C7D2FE',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Info size={12} color="#6366F1" />
          <span>{ann.label}</span>
        </div>
      ))}
    </div>
  );
};
