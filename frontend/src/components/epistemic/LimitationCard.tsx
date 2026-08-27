import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface LimitationCardProps {
  available: string[];
  missing: string[];
  investigableAlternatives?: string[];
  onSelectAlternative?: (alt: string) => void;
}

export const LimitationCard: React.FC<LimitationCardProps> = ({
  available,
  missing,
  investigableAlternatives,
  onSelectAlternative
}) => {
  return (
    <div style={{
      backgroundColor: 'rgba(239, 68, 68, 0.05)',
      border: '1px solid rgba(239, 68, 68, 0.25)',
      borderRadius: 'var(--radius-md)',
      padding: '16px',
      marginTop: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <AlertTriangle size={16} color="var(--color-critical)" />
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-critical)', letterSpacing: '0.02em' }}>
          DATA BOUNDARY DISCLOSURE
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
        {/* Available in Dataset */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: 'var(--color-healthy)', marginBottom: '8px' }}>
            <CheckCircle size={12} />
            <span>AVAILABLE IN DATASET</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
            {available.slice(0, 5).map((field, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--color-healthy)', fontSize: '10px' }}>•</span>
                <span>{field}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Missing from Dataset */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: 'var(--color-critical)', marginBottom: '8px' }}>
            <XCircle size={12} />
            <span>MISSING FROM DATASET</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
            {missing.map((field, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--color-critical)', fontSize: '10px' }}>✕</span>
                <span style={{ textDecoration: 'line-through' }}>{field}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Investigable Alternatives */}
      {investigableAlternatives && investigableAlternatives.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '6px', textTransform: 'uppercase' }}>
            What Can Still Be Investigated:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {investigableAlternatives.map((alt, idx) => (
              <button
                key={idx}
                onClick={() => onSelectAlternative && onSelectAlternative(alt)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <span>{alt}</span>
                <ArrowRight size={10} color="var(--brand-primary)" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
