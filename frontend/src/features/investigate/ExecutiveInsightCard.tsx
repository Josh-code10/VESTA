import React, { useState } from 'react';
import {
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Layers,
  Code,
  CheckCircle2,
  HelpCircle,
  BarChart2,
  Trash2,
  Maximize2,
  Minimize2,
  Bookmark
} from 'lucide-react';
import { EvidenceNode, EpistemicTag } from '../../types/api';
import { API_BASE_URL } from '../../services/api';
import { EpistemicBadge } from '../../components/epistemic/EpistemicBadge';
import { VisualizationRenderer } from '../../components/visualization/VisualizationRenderer';
import { BusinessImplicationCard } from './BusinessImplicationCard';
import { ManagementDecisionPanel } from './ManagementDecisionPanel';
import { VestaThinkingStream } from './VestaThinkingStream';
import { DynamicChartRenderer } from '../../components/visualization/DynamicChartRenderer';

interface ExecutiveInsightCardProps {
  node: EvidenceNode;
  stageNumber: number;
  onSelectNextQuery: (query: string) => void;
  onOpenEvidenceDrawer: () => void;
  onRemoveNode?: (nodeId: string) => void;
  isEvidenceOpen?: boolean;
}

export const ExecutiveInsightCard: React.FC<ExecutiveInsightCardProps> = ({
  node,
  stageNumber,
  onSelectNextQuery,
  onOpenEvidenceDrawer,
  onRemoveNode,
  isEvidenceOpen = false
}) => {
  const [showCalculationDetails, setShowCalculationDetails] = useState<boolean>(false);
  const [cardSize, setCardSize] = useState<'compact' | 'standard' | 'expanded'>('standard');
  const insight = node.insight;
  const records = node.evidence_data?.records || [];

  // Helper to format values cleanly
  const formatVal = (val: any, key: string = '') => {
    if (typeof val !== 'number') return String(val);
    if (key.toLowerCase().includes('revenue') || key.toLowerCase().includes('profit') || key.toLowerCase().includes('cost') || key.toLowerCase().includes('cogs')) {
      if (val >= 1_000_000_000) return `₦${(val / 1_000_000_000).toFixed(2)}B`;
      if (val >= 1_000_000) return `₦${(val / 1_000_000).toFixed(2)}M`;
      return `₦${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (key.toLowerCase().includes('rate') || key.toLowerCase().includes('pct') || key.toLowerCase().includes('margin') || key.toLowerCase().includes('discount')) {
      return `${val.toFixed(1)}%`;
    }
    if (key.toLowerCase().includes('quantity') || key.toLowerCase().includes('units') || key.toLowerCase().includes('returns') || key.toLowerCase().includes('flag')) {
      return `${val.toLocaleString()} units`;
    }
    return val.toLocaleString();
  };

  // Humanized headline fallback
  const headline = insight?.headline || node.user_question;
  const summary = insight?.executive_summary || node.executive_finding.replace(/\*\*/g, '').replace(/•/g, '').trim();

  // Find primary numeric measure for mini visual
  const numericKeys = records.length > 0
    ? Object.keys(records[0]).filter(k => typeof records[0][k] === 'number' && !['share_pct', 'delta_pct', 'delta_abs'].includes(k))
    : [];
  const backendSortMetric = node.evidence_data?.primary_sort_metric;
  const primaryMetricKey = (backendSortMetric && numericKeys.includes(backendSortMetric))
    ? backendSortMetric
    : (numericKeys[0] || 'value');
  const maxMetricVal = records.length > 0 ? Math.max(...records.map((r: any) => r[primaryMetricKey] || 0)) : 1;

  // Clean dimension name
  const getRecordLabel = (r: any) => {
    const stringKeys = Object.keys(r).filter(k => typeof r[k] !== 'number' && !['share_pct', 'delta_pct'].includes(k));
    return stringKeys.map(k => r[k]).join(' · ') || 'Segment';
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-card)',
      overflow: 'auto',
      resize: 'vertical',
      minHeight: '280px',
      maxHeight: '850px',
      position: 'relative',
      transition: 'box-shadow 0.2s ease'
    }}>
      {/* 1. Header Row */}
      <div style={{
        padding: '14px 22px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-surface)',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <EpistemicBadge tag={node.epistemic_status} />
          
          {/* Source Intent Badges */}
          {insight?.intent_type === 'EXPLAIN' && (
            <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#8B5CF6' }}>
              🧠 Business Knowledge
            </span>
          )}
          {insight?.intent_type === 'CLARIFY' && (
            <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: 'var(--color-healthy)' }}>
              📐 Dashboard Methodology
            </span>
          )}
          {insight?.intent_type === 'HYBRID' && (
            <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: 'var(--brand-primary)' }}>
              🧠 Knowledge + 📊 Live Data
            </span>
          )}
          {(insight?.intent_type === 'INVESTIGATE' || (!insight?.intent_type && records.length > 0)) && (
            <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(14, 165, 233, 0.12)', color: '#0EA5E9' }}>
              📊 Live Business Data
            </span>
          )}

          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Stage #{stageNumber}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => {
              fetch(`${API_BASE_URL}/memory/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  investigation_id: node.investigation_id,
                  title: headline,
                  business_driver: 'Commercial Core',
                  investigation_question: node.user_question,
                  finding_facts: insight?.what_is_known || [],
                  finding_observations: [summary],
                  management_decision: insight?.practical_recommendations?.[0] || 'Enforce operational monitoring.',
                  followup_question: insight?.suggested_investigations?.[0] || 'Track performance variance across next window.'
                })
              }).then(() => alert('Saved as Executive Decision Memory!'));
            }}
            title="Save as Executive Decision Memory"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-card)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              fontWeight: 600,
              color: '#8B5CF6',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <Bookmark size={12} />
            <span>Save as Decision Memory</span>
          </button>

          <button
            onClick={onOpenEvidenceDrawer}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: '1px solid var(--border-subtle)',
              backgroundColor: isEvidenceOpen ? 'rgba(99,102,241,0.1)' : 'var(--bg-card)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              fontWeight: 600,
              color: isEvidenceOpen ? 'var(--brand-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <BarChart2 size={12} />
            <span>{isEvidenceOpen ? 'Close Evidence Modal' : 'Inspect Evidence & Proof'}</span>
          </button>

          {/* Remove Node Button */}
          {onRemoveNode && (
            <button
              onClick={() => onRemoveNode(node.node_id)}
              title="Remove this stage from evidence trail"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-card)',
                padding: '5px 8px',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-critical)',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Content Body */}
      <div style={{ padding: cardSize === 'compact' ? '14px' : (cardSize === 'expanded' ? '28px' : '20px'), display: 'flex', flexDirection: 'column', gap: cardSize === 'compact' ? '12px' : '18px' }}>
        {/* Vesta Collapsible Reasoning Tray */}
        <VestaThinkingStream
          isLive={false}
          queryText={node.user_question}
          planSteps={insight?.five_artifact_response?.analysis_plan as any}
          elapsedSeconds={1.4}
        />

        {/* Level 1: Executive Headline & Finding */}
        <div>
          <h2 style={{
            fontSize: cardSize === 'compact' ? '15px' : (cardSize === 'expanded' ? '21px' : '18px'),
            fontWeight: 800,
            color: 'var(--text-primary)',
            margin: '0 0 6px 0',
            lineHeight: '1.35',
            letterSpacing: '-0.01em'
          }}>
            {headline}
          </h2>
          <p style={{
            fontSize: cardSize === 'compact' ? '12px' : '13.5px',
            lineHeight: '1.5',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            {summary}
          </p>
        </div>

        {/* HYBRID Section A: Business Knowledge */}
        {insight?.knowledge_concept && (
          <div style={{
            backgroundColor: 'rgba(139, 92, 246, 0.04)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: 'var(--radius-inner)',
            padding: '14px 18px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#8B5CF6', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
              🧠 Section A: Business Knowledge
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {insight.knowledge_concept.title}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '8px' }}>
              {insight.knowledge_concept.definition}
            </div>
            {insight.knowledge_concept.formula && (
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#8B5CF6', backgroundColor: 'var(--bg-card)', padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                Formula: {insight.knowledge_concept.formula}
              </div>
            )}
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              <strong>Executive Importance:</strong> {insight.knowledge_concept.business_importance}
            </div>
          </div>
        )}

        {/* Level 2: Key Metric Hero & Why It Matters (Only for Data Queries) */}
        {insight?.metric_highlight && !insight?.is_conceptual && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: cardSize === 'compact' ? '1fr' : 'minmax(200px, 1fr) 2fr',
            gap: '12px',
            alignItems: 'stretch'
          }}>
            {/* Metric Box */}
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: cardSize === 'compact' ? '10px 14px' : '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>
                {insight.metric_highlight.label}
              </span>
              <div style={{ fontSize: cardSize === 'compact' ? '18px' : '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {insight.metric_highlight.value}
              </div>
              {insight.metric_highlight.benchmark && (
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
                  {insight.metric_highlight.benchmark}
                </span>
              )}
            </div>

            {/* Why This Matters Callout */}
            <div style={{
              backgroundColor: 'rgba(99, 102, 241, 0.04)',
              borderLeft: '3px solid var(--brand-primary)',
              borderRadius: '0 var(--radius-md) var(--radius-md) 0',
              padding: cardSize === 'compact' ? '10px 14px' : '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={12} />
                <span>Why This Matters</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: '1.45', margin: 0 }}>
                {insight.why_it_matters}
              </p>
            </div>
          </div>
        )}

        {/* Level 3: Dynamic Analytical Intelligence Chart */}
        {records.length > 0 && (
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Primary Analytical Chart: {(insight?.five_artifact_response?.visualization_spec?.primary_chart || node.evidence_chart_type || 'bar').toUpperCase()} ({records.length} Segments Analyzed)
              </div>
            </div>

            <DynamicChartRenderer
              chartType={insight?.five_artifact_response?.visualization_spec?.primary_chart || node.evidence_chart_type || 'bar'}
              records={records}
              dimension={node.evidence_data?.dimensions?.[0]}
              metric={primaryMetricKey}
              height={cardSize === 'compact' ? 140 : (cardSize === 'expanded' ? 240 : 190)}
            />
          </div>
        )}

        {/* 5-Artifact Analytical Intelligence Engine Renderer */}
        {insight?.five_artifact_response && (
          <VisualizationRenderer fiveArtifactResponse={insight.five_artifact_response as any} />
        )}

        {/* Section 4: Management Attention Callout */}
        {insight?.five_artifact_response?.management_attention && (
          <div style={{
            backgroundColor: 'rgba(245, 158, 11, 0.05)',
            borderLeft: '3px solid #F59E0B',
            borderRadius: '0 var(--radius-md) var(--radius-md) 0',
            padding: '12px 16px',
            margin: '4px 0'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.03em' }}>
              <AlertTriangle size={13} />
              <span>Management Attention</span>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-primary)', margin: 0, lineHeight: '1.5', fontWeight: 500 }}>
              {insight.five_artifact_response.management_attention}
            </p>
          </div>
        )}

        {/* Section 4B: Questions Your Dataset Is Asking (Suggested Next Investigations) */}
        {insight?.suggested_investigations && insight.suggested_investigations.length > 0 && (
          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            margin: '4px 0'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.03em' }}>
              <Sparkles size={13} color="var(--brand-primary)" />
              <span>Questions Your Dataset Is Asking</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {insight.suggested_investigations.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectNextQuery(q)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-subtle)',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--brand-primary)';
                    e.currentTarget.style.color = 'var(--brand-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <span>{q}</span>
                  <ArrowRight size={12} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Level 4: Epistemic Clarity (Only for Empirical Data Queries) */}
        {insight && !insight.is_conceptual && (insight.what_is_known.length > 0 || insight.what_data_does_not_tell_us) && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '14px'
          }}>
            {/* What is Known */}
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.04)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: 'var(--color-healthy)', marginBottom: '8px', textTransform: 'uppercase' }}>
                <CheckCircle2 size={12} />
                <span>Directly Demonstrated</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {insight.what_is_known.map((fact, i) => (
                  <li key={i}>{fact}</li>
                ))}
              </ul>
            </div>

            {/* What Data Does Not Tell Us (No Overclaiming) */}
            <div style={{
              backgroundColor: 'rgba(245, 158, 11, 0.04)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: 'var(--color-warning)', marginBottom: '8px', textTransform: 'uppercase' }}>
                <AlertTriangle size={12} />
                <span>What Data Does Not Establish</span>
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {insight.what_data_does_not_tell_us || "Causes outside the connected transactional records cannot be inferred without additional operational measures."}
              </p>
            </div>
          </div>
        )}

        {/* Section 6: Management Decision Panel */}
        <ManagementDecisionPanel
          investigationId={node.investigation_id}
          initialDraftDecision={insight?.five_artifact_response?.draft_decision}
          questionTitle={node.user_question}
        />

        {/* Level 6: Progressive Disclosure (Audit & Lineage) */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
          <button
            onClick={() => setShowCalculationDetails(!showCalculationDetails)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: 'var(--text-dim)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0
            }}
          >
            {showCalculationDetails ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            <span>{showCalculationDetails ? 'Hide calculation & audit lineage' : 'How this was calculated (Audit Lineage)'}</span>
          </button>

          {showCalculationDetails && (
            <div style={{
              marginTop: '10px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 16px',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div><strong>Formula:</strong> {node.lineage.formula_breadcrumb}</div>
              <div><strong>Tool Executed:</strong> {node.lineage.tool_executed}</div>
              <div><strong>Confidence:</strong> {node.lineage.confidence_level} (Zero synthetic estimation)</div>
              <div><strong>Result ID:</strong> {node.lineage.analytical_result_id}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
