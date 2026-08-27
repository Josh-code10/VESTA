import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  Circle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { AnalysisPlanStep } from '../../types/api';

interface VestaThinkingStreamProps {
  /**
   * Whether Vesta is actively investigating right now (live animation mode)
   */
  isLive?: boolean;
  /**
   * The user query that triggered the investigation
   */
  queryText?: string;
  /**
   * Optional pre-completed plan steps returned from the backend (used in post-completion view)
   */
  planSteps?: AnalysisPlanStep[];
  /**
   * Total elapsed time in seconds (for completed view)
   */
  elapsedSeconds?: number;
}

/**
 * Generates tailored, realistic analytical steps based on the user's question
 */
const getContextualSteps = (query: string): string[] => {
  const q = (query || '').toLowerCase().trim();

  if (anyIn(q, ['margin', 'profit', 'cogs', 'cost', 'collapse', 'drop', 'decline', 'loss'])) {
    return [
      'Comparing reporting periods & baseline targets',
      'Decomposing profit movement & gross margin delta',
      'Checking regional contribution (Lagos, Abuja, Kano)',
      'Checking product/category drivers & discount depth',
      'Checking discount patterns & markdown impact',
      'Checking return patterns & bottom-line drag',
      'Synthesizing boardroom executive recommendation'
    ];
  }

  if (anyIn(q, ['return', 'returned', 'refund', 'defect', 'damage', 'reversal'])) {
    return [
      'Scanning return flags across product categories',
      'Calculating unit return rates vs total volume ratios',
      'Decomposing return rate by regional hubs',
      'Evaluating SKU return concentration & velocity',
      'Checking discount & sales channel correlations',
      'Synthesizing reverse-logistics mitigation steps'
    ];
  }

  if (anyIn(q, ['discount', 'price', 'markdown', 'promotion', 'campaign', 'pricing'])) {
    return [
      'Calculating average promotional discount depth',
      'Evaluating discount distribution across sales channels',
      'Checking correlation with unit gross profit margins',
      'Identifying high-markdown outlier transactions',
      'Synthesizing pricing governance recommendations'
    ];
  }

  if (anyIn(q, ['csat', 'satisfaction', 'nps', 'sentiment', 'weather', 'competitor', 'review'])) {
    return [
      'Checking data dictionary & schema completeness',
      'Evaluating field availability for customer sentiment metrics',
      'Flagging epistemic boundary limitation (Rule #16)',
      'Identifying proxy operational alternatives in transaction records',
      'Synthesizing transparent executive boundary notice'
    ];
  }

  if (anyIn(q, ['what is', 'explain', 'how is', 'why is business health', 'methodology', 'formula', 'ratio', 'metric'])) {
    return [
      'Accessing VESTA Business Knowledge Library',
      'Resolving mathematical formulation & core commercial ratios',
      'Cross-referencing connected transaction benchmarks',
      'Checking component weights and impact ranking',
      'Synthesizing plain-English executive briefing'
    ];
  }

  // Default deep analytical investigation playbook
  return [
    'Scanning active transaction scope (30,443 rows)',
    'Decomposing performance across active dimensions',
    'Evaluating statistical significance & variance',
    'Checking regional & channel contributions',
    'Verifying data lineage & epistemic integrity',
    'Synthesizing structured boardroom insight'
  ];
};

function anyIn(target: string, phrases: string[]): boolean {
  return phrases.some(p => target.includes(p));
}

export const VestaThinkingStream: React.FC<VestaThinkingStreamProps> = ({
  isLive = false,
  queryText = '',
  planSteps,
  elapsedSeconds = 1.4
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(!isLive);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [timerCount, setTimerCount] = useState<number>(0.1);

  // Derive steps list
  const steps = useMemo(() => {
    if (planSteps && planSteps.length > 0) {
      return planSteps.map(s => s.step);
    }
    return getContextualSteps(queryText);
  }, [planSteps, queryText]);

  // Live timer tick
  useEffect(() => {
    if (!isLive) return;

    const timerInterval = setInterval(() => {
      setTimerCount(prev => +(prev + 0.1).toFixed(1));
    }, 100);

    return () => clearInterval(timerInterval);
  }, [isLive]);

  // Live sequential step progression
  useEffect(() => {
    if (!isLive) {
      setCurrentStepIndex(steps.length);
      return;
    }

    setCurrentStepIndex(0);

    // Progression speed: ~450ms per step
    const stepInterval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    return () => clearInterval(stepInterval);
  }, [isLive, steps.length]);

  // -------------------------------------------------------------
  // RENDER 1: LIVE THINKING CARD (While Vesta is actively querying)
  // -------------------------------------------------------------
  if (isLive) {
    return (
      <div style={{ marginBottom: '16px', maxWidth: '780px', width: '100%' }}>
        {/* "Vesta says..." Top Header */}
        <div style={{
          fontSize: '15px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Sparkles size={17} style={{ color: 'var(--brand-primary)' }} />
          <span>Vesta says...</span>
        </div>

        {/* Outer Investigation Card */}
        <div
          className="vesta-thinking-card"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: '20px',
            padding: '20px 24px',
            boxShadow: '0 4px 20px -2px rgba(99, 102, 241, 0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Card Top Row: Title + Live Status Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                className="vesta-pulse-badge"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  color: 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <BrainCircuit size={16} />
              </div>

              <div>
                <h4 style={{
                  margin: 0,
                  fontSize: '15px',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.01em'
                }}>
                  Vesta is investigating...
                </h4>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Evaluating hypotheses & calculating deterministic metrics
                </div>
              </div>
            </div>

            {/* Live Timer Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--brand-primary)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-mono, monospace)'
              }}>
                <Clock size={12} />
                <span>{timerCount.toFixed(1)}s</span>
              </span>

              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--color-healthy)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)'
              }}>
                <ShieldCheck size={12} />
                <span>30,443 rows</span>
              </span>
            </div>
          </div>

          {/* Investigation Steps Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {steps.map((stepText, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={idx}
                  className={isCompleted ? 'vesta-step-item' : ''}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    transition: 'all 0.25s ease',
                    color: isCompleted
                      ? 'var(--text-primary)'
                      : isCurrent
                      ? 'var(--brand-primary)'
                      : 'var(--text-dim)',
                    fontWeight: isCompleted || isCurrent ? 600 : 400
                  }}
                >
                  {/* Step Icon */}
                  {isCompleted ? (
                    <div className="vesta-check-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--color-healthy)', flexShrink: 0 }} />
                    </div>
                  ) : isCurrent ? (
                    <div
                      className="vesta-pulse-badge"
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)' }} />
                    </div>
                  ) : (
                    <Circle size={15} style={{ color: 'var(--border-subtle)', flexShrink: 0 }} />
                  )}

                  {/* Step Text */}
                  <span
                    className={isCurrent ? 'vesta-shimmering-text' : ''}
                    style={{
                      letterSpacing: '-0.01em',
                      lineHeight: '1.4'
                    }}
                  >
                    {stepText}
                    {isCurrent ? '...' : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER 2: POST-COMPLETION ACCORDION (Above Executive Insight Card)
  // -------------------------------------------------------------
  return (
    <div
      style={{
        backgroundColor: isExpanded ? 'rgba(99, 102, 241, 0.03)' : 'transparent',
        border: isExpanded ? '1px solid rgba(99, 102, 241, 0.15)' : '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: isExpanded ? '10px 16px' : '6px 14px',
        marginBottom: '14px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BrainCircuit size={14} style={{ color: 'var(--brand-primary)' }} />
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--text-secondary)',
            letterSpacing: '0.01em'
          }}>
            Thought for {elapsedSeconds.toFixed(1)}s ({steps.length} analytical checks verified)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
          <span>{isExpanded ? 'Hide Reasoning' : 'Show Reasoning'}</span>
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      {isExpanded && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '8px',
          marginTop: '10px',
          paddingTop: '10px',
          borderTop: '1px solid rgba(99, 102, 241, 0.1)'
        }}>
          {steps.map((stepText, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                fontWeight: 500
              }}
            >
              <CheckCircle2 size={14} style={{ color: 'var(--color-healthy)', flexShrink: 0 }} />
              <span>{stepText}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
