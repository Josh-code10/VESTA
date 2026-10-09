import React, { useState } from 'react';
import { X, Check, AlertTriangle, Sliders, Shield } from 'lucide-react';
import { ActiveKPI } from '../../types/api';

interface KPICustomizerModalProps {
  isOpen: boolean;
  activeKPIs: ActiveKPI[];
  catalog: Array<{
    kpi_id: string;
    name: string;
    category: string;
    is_available: boolean;
    description: string;
    missing_fields: string[];
  }>;
  onClose: () => void;
  onSaveTarget: (kpiId: string, targetVal: number) => void;
}

export const KPICustomizerModal: React.FC<KPICustomizerModalProps> = ({
  isOpen,
  activeKPIs,
  catalog,
  onClose,
  onSaveTarget
}) => {
  const [editingTargetId, setEditingTargetId] = useState<string | null>(null);
  const [targetInput, setTargetInput] = useState<string>('');

  if (!isOpen) return null;

  const handleStartEdit = (kpiId: string, currentTarget?: number | null) => {
    setEditingTargetId(kpiId);
    setTargetInput(currentTarget != null ? String(currentTarget) : '');
  };

  const handleSave = (kpiId: string) => {
    const val = parseFloat(targetInput);
    if (!isNaN(val)) {
      onSaveTarget(kpiId, val);
    }
    setEditingTargetId(null);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      backdropFilter: 'blur(3px)'
    }}>
      <div style={{
        width: '600px',
        maxHeight: '85vh',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
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
            <Sliders size={16} color="var(--brand-primary)" />
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              KPI Registry & Target Configuration
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        {/* Catalog List */}
        <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            VESTA only activates KPIs supported by verified fields in your connected Google Sheet.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {catalog.map((item) => {
              const activeKpi = activeKPIs.find(k => k.kpi_id === item.kpi_id);

              return (
                <div
                  key={item.kpi_id}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    opacity: item.is_available ? 1 : 0.65
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>({item.category})</span>
                    </div>

                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: item.is_available ? 'var(--color-healthy-bg)' : 'var(--color-critical-bg)',
                      color: item.is_available ? 'var(--color-healthy)' : 'var(--color-critical)'
                    }}>
                      {item.is_available ? 'ACTIVE' : 'UNAVAILABLE'}
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {item.description}
                  </div>

                  {item.is_available ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', marginTop: '6px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Target: <strong style={{ color: 'var(--text-primary)' }}>{activeKpi?.target_value ? activeKpi.target_value.toLocaleString() : 'Unconfigured'}</strong>
                      </div>

                      {editingTargetId === item.kpi_id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="number"
                            value={targetInput}
                            onChange={(e) => setTargetInput(e.target.value)}
                            placeholder="Target value"
                            style={{
                              width: '100px',
                              backgroundColor: 'var(--bg-app)',
                              border: '1px solid var(--border-active)',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--text-primary)',
                              padding: '3px 6px',
                              fontSize: '11px'
                            }}
                          />
                          <button
                            onClick={() => handleSave(item.kpi_id)}
                            style={{
                              backgroundColor: 'var(--brand-primary)',
                              border: 'none',
                              color: '#fff',
                              padding: '3px 8px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '11px',
                              cursor: 'pointer'
                            }}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(item.kpi_id, activeKpi?.target_value)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--brand-primary)',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Set Target
                        </button>
                      )}
                    </div>
                  ) : (
                    <div style={{ fontSize: '11px', color: 'var(--color-critical)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <AlertTriangle size={11} />
                      <span>Not available — required fields [{item.missing_fields.join(', ')}] missing.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              padding: '6px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
