import React from 'react';
import { Grid, Table } from 'lucide-react';

interface PivotTableViewProps {
  pivotSpec: {
    title: string;
    row_dimension: string;
    col_dimension: string;
    metric: string;
    rows: string[];
    columns: string[];
    matrix: Record<string, Record<string, number>>;
    row_totals: Record<string, number>;
    col_totals: Record<string, number>;
    grand_total: number;
  };
}

export const PivotTableView: React.FC<PivotTableViewProps> = ({ pivotSpec }) => {
  if (!pivotSpec || !pivotSpec.rows || !pivotSpec.columns) return null;

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-card)',
      padding: '16px 20px',
      marginTop: '16px',
      overflowX: 'auto'
    }}>
      {/* Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <Grid size={16} color="var(--brand-primary)" />
        <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          {pivotSpec.title}
        </h4>
      </div>

      {/* Pivot Table Matrix */}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '11.5px',
        textAlign: 'left'
      }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-subtle)' }}>
            <th style={{ padding: '8px 12px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {pivotSpec.row_dimension} \ {pivotSpec.col_dimension}
            </th>
            {pivotSpec.columns.map(col => (
              <th key={col} style={{ padding: '8px 12px', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>
                {col}
              </th>
            ))}
            <th style={{ padding: '8px 12px', fontWeight: 800, color: 'var(--brand-primary)', textAlign: 'right' }}>
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {pivotSpec.rows.map(rowKey => {
            const rowTotal = pivotSpec.row_totals[rowKey] || 0;
            return (
              <tr key={rowKey} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '8px 12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {rowKey}
                </td>
                {pivotSpec.columns.map(colKey => {
                  const val = pivotSpec.matrix[rowKey]?.[colKey] ?? 0;
                  return (
                    <td key={colKey} style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                      {val !== 0 ? val.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-'}
                    </td>
                  );
                })}
                <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: 'var(--brand-primary)' }}>
                  {rowTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </td>
              </tr>
            );
          })}
          {/* Grand Totals Row */}
          <tr style={{ backgroundColor: 'var(--bg-card)', fontWeight: 800 }}>
            <td style={{ padding: '8px 12px', color: 'var(--text-primary)' }}>
              Total
            </td>
            {pivotSpec.columns.map(colKey => (
              <td key={colKey} style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-primary)' }}>
                {(pivotSpec.col_totals[colKey] || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </td>
            ))}
            <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--brand-primary)' }}>
              {(pivotSpec.grand_total || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
