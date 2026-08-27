import React from 'react';
import { TrendingUp, TrendingDown, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

interface SinceLastBriefingBannerProps {
  scoreDelta: number;
  lastSyncedAt: string;
}

export const SinceLastBriefingBanner: React.FC<SinceLastBriefingBannerProps> = ({
  scoreDelta,
  lastSyncedAt
}) => {
  const isPos = scoreDelta >= 0;

  return (
    <div style={{
      backgroundColor: '#F8FAFC',
      border: '1.5px solid #E2E8F0',
      borderRadius: 'var(--radius-card)',
      padding: '16px 22px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          backgroundColor: isPos ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          color: isPos ? 'var(--color-healthy)' : 'var(--color-critical)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {isPos ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
        </div>

        <div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
            Since Your Last Executive Briefing
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            • Business Health {isPos ? `improved by +${scoreDelta.toFixed(1)} pts` : `shifted by ${scoreDelta.toFixed(1)} pts`} · Return rate tracking within target benchmarks · 1 monitored issue flagged as <strong>Improved</strong>.
          </div>
        </div>
      </div>

      <div style={{
        fontSize: '11px',
        fontWeight: 700,
        color: 'var(--brand-primary)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        padding: '4px 10px',
        borderRadius: 'var(--radius-full)'
      }}>
        DETERMINISTIC COMPARISON
      </div>
    </div>
  );
};
