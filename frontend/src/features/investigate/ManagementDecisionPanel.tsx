import React, { useState } from 'react';
import { Bookmark, CheckCircle2, Edit3, Save, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { createMemory } from '../../services/api';

interface ManagementDecisionPanelProps {
  investigationId: string;
  initialDraftDecision?: string;
  questionTitle?: string;
}

export const ManagementDecisionPanel: React.FC<ManagementDecisionPanelProps> = ({
  investigationId,
  initialDraftDecision,
  questionTitle = 'Investigation Decision'
}) => {
  const fallbackDraft = initialDraftDecision || "Initiate quality audit on high-return product SKUs and review regional discount depth thresholds to preserve gross profit margin.";
  const [decisionText, setDecisionText] = useState<string>(fallbackDraft);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleSaveDecision = async () => {
    if (!decisionText.trim() || isSaving) return;
    setIsSaving(true);
    try {
      await createMemory({
        investigation_id: investigationId,
        title: questionTitle,
        business_driver: 'Finance',
        finding_summary: 'Analytical finding verified via deterministic data engine.',
        management_decision: decisionText.trim(),
        status: 'Monitoring'
      });
      setSaveStatus('saved');
      setIsEditing(false);
      setTimeout(() => setSaveStatus('idle'), 4000);
    } catch (err) {
      console.error('Failed to save decision memory', err);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setDecisionText(fallbackDraft);
    setIsEditing(false);
  };

  return (
    <div
      style={{
        backgroundColor: '#F8FAFC',
        border: '1px solid #CBD5E1',
        borderRadius: '12px',
        padding: isExpanded ? '16px 20px' : '12px 18px',
        marginTop: '16px',
        marginBottom: '16px',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}
        >
          <Bookmark size={17} style={{ color: 'var(--brand-primary)' }} />
          <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-main)' }}>
            Management Decision Panel
          </h4>
          <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--brand-primary)', fontWeight: 600 }}>
            Executive Memory Candidate
          </span>
          {isExpanded ? <ChevronUp size={15} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={15} style={{ color: 'var(--text-muted)' }} />}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!isEditing && isExpanded && (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#FFFFFF',
                color: 'var(--text-main)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Edit3 size={13} />
              Edit Decision
            </button>
          )}

          {saveStatus === 'saved' ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--status-healthy)', fontWeight: 700 }}>
              <CheckCircle2 size={15} /> Saved to Executive Memory!
            </span>
          ) : (
            <button
              onClick={handleSaveDecision}
              disabled={isSaving}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                backgroundColor: 'var(--brand-primary)',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Save size={14} />
              {isSaving ? 'Saving...' : 'Save as Decision Memory'}
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
          {isEditing ? (
            <div>
              <textarea
                value={decisionText}
                onChange={(e) => setDecisionText(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--brand-primary)',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  lineHeight: '1.5',
                  color: 'var(--text-main)',
                  outline: 'none',
                  marginBottom: '10px'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  onClick={handleDiscard}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--text-muted)',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={13} /> Discard Edits
                </button>
              </div>
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.6', fontWeight: 500, backgroundColor: '#FFFFFF', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              "{decisionText}"
            </p>
          )}
        </div>
      )}
    </div>
  );
};
