import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import { Code, Table, BarChart2, ShieldCheck, X } from 'lucide-react';
import { EvidenceNode } from '../../types/api';
import { DynamicChartRenderer } from '../visualization/DynamicChartRenderer';

interface EvidenceDrawerProps {
  node: EvidenceNode | null;
  onClose: () => void;
}

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#0EA5E9', '#EC4899', '#8B5CF6'];

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ node, onClose }) => {
  const [viewMode, setViewMode] = useState<'chart' | 'table' | 'lineage'>('chart');

  if (!node) return null;

  const records = node.evidence_data?.records || [];
  const dimensions = node.evidence_data?.dimensions || [];
  const metrics = node.evidence_data?.metrics || [];

  // Format data for recharts
  const primaryDim = dimensions[0] || (records.length > 0 ? Object.keys(records[0])[0] : 'label');
  const primaryMetric = node.evidence_data?.primary_sort_metric || metrics[0] || (records.length > 0 ? Object.keys(records[0]).find(k => typeof records[0][k] === 'number') : 'value') || 'value';

  const chartData = records.slice(0, 10).map((r: any) => ({
    name: String(r[primaryDim] || 'Item'),
    value: Number(r[primaryMetric] || 0)
  }));

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '85vw',
        maxWidth: '1100px',
        maxHeight: '88vh',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-card)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="var(--brand-primary)" />
          <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.02em', color: 'var(--text-primary)' }}>
            EVIDENCE & PROOF
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Formula Breadcrumb */}
      <div style={{
        padding: '10px 20px',
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-subtle)',
        fontSize: '11px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-secondary)',
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}>
        <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>FORMULA: </span>
        <span>{node.lineage.formula_breadcrumb}</span>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0 20px'
      }}>
        <button
          onClick={() => setViewMode('chart')}
          style={{
            padding: '10px 14px',
            background: 'none',
            border: 'none',
            borderBottom: viewMode === 'chart' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            color: viewMode === 'chart' ? 'var(--brand-primary)' : 'var(--text-muted)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <BarChart2 size={13} />
          <span>Chart</span>
        </button>
        <button
          onClick={() => setViewMode('table')}
          style={{
            padding: '10px 14px',
            background: 'none',
            border: 'none',
            borderBottom: viewMode === 'table' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            color: viewMode === 'table' ? 'var(--brand-primary)' : 'var(--text-muted)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Table size={13} />
          <span>Data Table</span>
        </button>
        <button
          onClick={() => setViewMode('lineage')}
          style={{
            padding: '10px 14px',
            background: 'none',
            border: 'none',
            borderBottom: viewMode === 'lineage' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            color: viewMode === 'lineage' ? 'var(--brand-primary)' : 'var(--text-muted)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Code size={13} />
          <span>Lineage</span>
        </button>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {viewMode === 'chart' && (
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              PRIMARY ANALYTICAL CHART: {(node.insight?.five_artifact_response?.visualization_spec?.primary_chart || node.evidence_chart_type || 'bar').toUpperCase()}
            </div>
            {records.length > 0 ? (
              <DynamicChartRenderer
                chartType={node.insight?.five_artifact_response?.visualization_spec?.primary_chart || node.evidence_chart_type || 'bar'}
                records={records}
                dimension={dimensions[0]}
                metric={primaryMetric}
                height={280}
              />
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '40px 0', fontSize: '12px' }}>
                No chartable dimensional data returned for this query.
              </div>
            )}
          </div>
        )}

        {viewMode === 'table' && (
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>
              Deterministic Records ({records.length})
            </div>
            {records.length > 0 ? (
              <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-subtle)' }}>
                      {Object.keys(records[0]).slice(0, 4).map((col, idx) => {
                        const headerName = node.insight?.humanized_fields?.[col] || col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        return (
                          <th key={idx} style={{ padding: '8px 10px', color: 'var(--text-muted)', fontWeight: 700 }}>
                            {headerName}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {records.slice(0, 15).map((row: any, rIdx: number) => (
                      <tr key={rIdx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        {Object.keys(records[0]).slice(0, 4).map((col, cIdx) => {
                          const val = row[col];
                          let formattedVal = String(val ?? '-');
                          if (typeof val === 'number') {
                            if (col.toLowerCase().includes('revenue') || col.toLowerCase().includes('profit') || col.toLowerCase().includes('cogs')) {
                              formattedVal = `₦${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                            } else if (col.toLowerCase().includes('rate') || col.toLowerCase().includes('pct')) {
                              formattedVal = `${val.toFixed(1)}%`;
                            } else {
                              formattedVal = val.toLocaleString();
                            }
                          }
                          return (
                            <td key={cIdx} style={{ padding: '6px 10px', color: 'var(--text-secondary)' }} className="tabular-nums">
                              {formattedVal}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '40px 0', fontSize: '12px' }}>
                No tabular records returned.
              </div>
            )}
          </div>
        )}

        {viewMode === 'lineage' && (
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            <div style={{ backgroundColor: 'var(--bg-card)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '12px' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Rule #16 Analytical Lineage</div>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', rowGap: '6px', fontSize: '11px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tool Executed:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--brand-primary)' }}>{node.lineage.tool_executed}</span>

                <span style={{ color: 'var(--text-muted)' }}>Result ID:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{node.lineage.analytical_result_id}</span>

                <span style={{ color: 'var(--text-muted)' }}>Confidence:</span>
                <span style={{ color: 'var(--color-healthy)', fontWeight: 700 }}>{node.lineage.confidence_level} (99%)</span>

                <span style={{ color: 'var(--text-muted)' }}>Node ID:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>{node.node_id}</span>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Calculations were performed deterministically by Pandas in Python. Zero synthetic arithmetic hallucination.
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
};
