import React, { useState } from 'react';
import { Activity, TrendingUp, TrendingDown, HelpCircle, ChevronRight, ShieldCheck, ShieldAlert, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import type { HealthScoreBreakdown, ExecutiveHealthStatus, ConfidenceLevel, ActiveKPI } from '../../types/api';

interface HealthScoreHeroProps {
  healthScore: HealthScoreBreakdown;
  onOpenWhyScoreDrawer: () => void;
  onOpenCustomizer: () => void;
}

export const HealthScoreHero: React.FC<HealthScoreHeroProps> = ({
  healthScore,
  onOpenWhyScoreDrawer,
  onOpenCustomizer
}) => {
  const [showConfidenceTooltip, setShowConfidenceTooltip] = useState<boolean>(false);

  // 1. Check for UNAVAILABLE state
  if (healthScore.calculation_state === 'UNAVAILABLE' || healthScore.overall_score === null) {
    return (
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-card)',
        padding: '28px 32px',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={16} color="var(--color-warning)" />
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Business Health Status
              </span>
            </div>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--color-warning)',
              backgroundColor: 'var(--color-warning-bg)',
              border: '1px solid var(--color-warning-border)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)'
            }}>
              DATA READINESS REQUIRED
            </span>
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Business Health Unavailable
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px' }}>
            {healthScore.confidence_reason || 'Required operational and revenue measures are not connected in the current dataset.'}
          </p>

          <div style={{
            padding: '14px',
            backgroundColor: 'var(--bg-card-secondary)',
            borderRadius: 'var(--radius-inner)',
            border: '1px solid var(--border-subtle)',
            fontSize: '12px',
            color: 'var(--text-muted)'
          }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Action Required:
            </div>
            Connect a tabular dataset containing commercial transactions (e.g. revenue, quantity, order date, returns) to activate automated CEO health scoring.
          </div>
        </div>

        <button
          onClick={onOpenCustomizer}
          style={{
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            padding: '10px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--brand-primary)',
            cursor: 'pointer'
          }}
        >
          <span>View Supported KPI Catalog</span>
          <ChevronRight size={14} />
        </button>
      </div>
    );
  }

  // 2. Map 5-Tier Executive Status
  const getExecutiveStatusConfig = (status: ExecutiveHealthStatus) => {
    switch (status) {
      case 'EXCELLENT':
        return {
          label: 'Excellent',
          color: 'var(--color-healthy)',
          bg: 'var(--color-healthy-bg)',
          border: 'var(--color-healthy-border)',
          description: 'Operating in an optimal benchmark state across all active business drivers.'
        };
      case 'HEALTHY':
        return {
          label: 'Healthy',
          color: 'var(--color-healthy)',
          bg: 'var(--color-healthy-bg)',
          border: 'var(--color-healthy-border)',
          description: 'Core operational indicators are tracking on target with solid enterprise momentum.'
        };
      case 'NEEDS_ATTENTION':
        return {
          label: 'Needs Attention',
          color: 'var(--color-warning)',
          bg: 'var(--color-warning-bg)',
          border: 'var(--color-warning-border)',
          description: 'Localized performance divergence detected in key business drivers.'
        };
      case 'AT_RISK':
        return {
          label: 'At Risk',
          color: '#EA580C',
          bg: '#FFF7ED',
          border: '#FED7AA',
          description: 'Substantial operational variance threatening target achievement.'
        };
      case 'CRITICAL_ATTENTION_REQUIRED':
        return {
          label: 'Critical Attention Required',
          color: 'var(--color-critical)',
          bg: 'var(--color-critical-bg)',
          border: 'var(--color-critical-border)',
          description: 'Severe negative variances identified requiring immediate executive intervention.'
        };
      default:
        return {
          label: 'Active Tracking',
          color: 'var(--brand-primary)',
          bg: 'var(--brand-light)',
          border: 'rgba(99, 102, 241, 0.2)',
          description: 'Evaluating connected operational metrics.'
        };
    }
  };

  const statusConfig = getExecutiveStatusConfig(healthScore.executive_status || 'HEALTHY');

  // Confidence Badge Config
  const getConfidenceConfig = (level: ConfidenceLevel) => {
    switch (level) {
      case 'HIGH':
        return { label: 'High Confidence', color: 'var(--color-healthy)', bg: 'var(--color-healthy-bg)', border: 'var(--color-healthy-border)' };
      case 'MEDIUM':
        return { label: 'Medium Confidence', color: 'var(--color-warning)', bg: 'var(--color-warning-bg)', border: 'var(--color-warning-border)' };
      case 'LIMITED':
        return { label: 'Limited Data', color: 'var(--text-muted)', bg: 'var(--bg-input)', border: 'var(--border-subtle)' };
    }
  };

  const confConfig = getConfidenceConfig(healthScore.confidence_level || 'HIGH');

  // Preview Contributors
  const contributions = healthScore.contributions || [];
  const highestPositive = healthScore.largest_positive_contributor || (contributions.length > 0 ? {
    name: contributions[0].name,
    points: contributions[0].points_contributed,
    current_value: contributions[0].current_value
  } : null);

  const biggestNegative = healthScore.largest_negative_contributor || (contributions.find(c => c.drag_points > 0) ? {
    name: contributions.find(c => c.drag_points > 0)!.name,
    drag: contributions.find(c => c.drag_points > 0)!.drag_points,
    current_value: contributions.find(c => c.drag_points > 0)!.current_value
  } : null);

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-card)',
      padding: '28px 32px',
      boxShadow: 'var(--shadow-card)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative'
    }}>
      {/* Top Header Row with Confidence Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={16} color="var(--brand-primary)" />
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Enterprise Business Health
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Analysis Confidence Badge */}
          <div
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: confConfig.bg,
              color: confConfig.color,
              border: `1px solid ${confConfig.border}`,
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'help'
            }}
            onMouseEnter={() => setShowConfidenceTooltip(true)}
            onMouseLeave={() => setShowConfidenceTooltip(false)}
          >
            <ShieldCheck size={12} />
            <span>{confConfig.label}</span>

            {showConfidenceTooltip && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                width: '260px',
                padding: '10px 12px',
                backgroundColor: 'var(--text-primary)',
                color: 'var(--bg-card)',
                borderRadius: '8px',
                fontSize: '11px',
                lineHeight: '1.4',
                zIndex: 60,
                boxShadow: 'var(--shadow-lg)',
                pointerEvents: 'none'
              }}>
                {healthScore.confidence_reason}
              </div>
            )}
          </div>

          <button
            onClick={onOpenCustomizer}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '12px',
              color: 'var(--brand-primary)',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '4px 6px',
              borderRadius: '6px'
            }}
          >
            Targets
          </button>
        </div>
      </div>

      {/* Main Score Display Area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {/* Big Score Number */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{
            fontSize: '56px',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            color: statusConfig.color,
            lineHeight: '1'
          }} className="tabular-nums">
            {healthScore.overall_score !== null ? healthScore.overall_score.toFixed(0) : '—'}
          </span>
          <span style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-dim)' }}>
            / 100
          </span>
        </div>

        {/* Executive Status Badge & Description */}
        <div style={{ flex: 1, minWidth: '180px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: statusConfig.bg,
            color: statusConfig.color,
            border: `1px solid ${statusConfig.border}`,
            fontSize: '12px',
            fontWeight: 800,
            marginBottom: '6px'
          }}>
            <span>●</span>
            <span>{statusConfig.label}</span>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            {statusConfig.description}
          </div>
        </div>
      </div>

      {/* Progress Bar / Benchmark Meter */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          height: '8px',
          width: '100%',
          backgroundColor: 'var(--bg-input)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          display: 'flex'
        }}>
          <div style={{
            width: `${Math.min(100, Math.max(0, healthScore.overall_score || 0))}%`,
            backgroundColor: statusConfig.color,
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: 'var(--text-dim)' }}>
          <span>0 (Critical)</span>
          <span>55 (At Risk)</span>
          <span>70 (Attention)</span>
          <span>80 (Healthy)</span>
          <span>90 (Excellent)</span>
        </div>
      </div>

      {/* Highlights: Top Positive Contributor vs Primary Drag */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        padding: '12px 14px',
        backgroundColor: 'var(--bg-card-secondary)',
        borderRadius: 'var(--radius-inner)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '16px'
      }}>
        {/* Highest Positive Contributor */}
        {highestPositive ? (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '6px',
              backgroundColor: 'var(--color-healthy-bg)',
              color: 'var(--color-healthy)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '1px'
            }}>
              <TrendingUp size={12} />
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Top Contributor
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {highestPositive.name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-healthy)', fontWeight: 700 }}>
                +{highestPositive.points.toFixed(1)} pts contributed
              </div>
            </div>
          </div>
        ) : null}

        {/* Biggest Negative Drag */}
        {biggestNegative ? (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '6px',
              backgroundColor: 'var(--color-critical-bg)',
              color: 'var(--color-critical)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '1px'
            }}>
              <TrendingDown size={12} />
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Primary Drag
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {biggestNegative.name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-critical)', fontWeight: 700 }}>
                -{biggestNegative.drag.toFixed(1)} pts drag
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={13} color="var(--color-healthy)" />
            <div style={{ fontSize: '11px', color: 'var(--color-healthy)', fontWeight: 600 }}>
              Zero performance drag
            </div>
          </div>
        )}
      </div>

      {/* "Why this score?" Action Trigger */}
      <button
        onClick={onOpenWhyScoreDrawer}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          backgroundColor: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-subtle)',
          padding: '9px 14px',
          borderRadius: '10px',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <HelpCircle size={14} color="var(--brand-primary)" />
          <span>Why this score? View methodology preview</span>
        </div>
        <ChevronRight size={14} color="var(--text-dim)" />
      </button>
    </div>
  );
};
