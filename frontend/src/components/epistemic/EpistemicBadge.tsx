import React from 'react';
import { Lock, BarChart2, Lightbulb, HelpCircle, AlertTriangle } from 'lucide-react';
import { EpistemicTag } from '../../types/api';

interface EpistemicBadgeProps {
  tag: EpistemicTag;
  size?: 'sm' | 'md';
}

export const EpistemicBadge: React.FC<EpistemicBadgeProps> = ({ tag, size = 'sm' }) => {
  const getTagConfig = () => {
    switch (tag) {
      case 'FACT':
        return {
          label: 'FACT',
          color: 'var(--tag-fact)',
          bgColor: 'var(--tag-fact-bg)',
          icon: <Lock size={size === 'sm' ? 10 : 12} />
        };
      case 'OBSERVATION':
        return {
          label: 'OBSERVATION',
          color: 'var(--tag-obs)',
          bgColor: 'var(--tag-obs-bg)',
          icon: <BarChart2 size={size === 'sm' ? 10 : 12} />
        };
      case 'INFERENCE':
        return {
          label: 'INFERENCE',
          color: 'var(--tag-inf)',
          bgColor: 'var(--tag-inf-bg)',
          icon: <Lightbulb size={size === 'sm' ? 10 : 12} />
        };
      case 'HYPOTHESIS':
        return {
          label: 'HYPOTHESIS',
          color: 'var(--tag-hyp)',
          bgColor: 'var(--tag-hyp-bg)',
          icon: <HelpCircle size={size === 'sm' ? 10 : 12} />
        };
      case 'UNKNOWN':
      default:
        return {
          label: 'UNKNOWN',
          color: 'var(--tag-unk)',
          bgColor: 'var(--tag-unk-bg)',
          icon: <AlertTriangle size={size === 'sm' ? 10 : 12} />
        };
    }
  };

  const config = getTagConfig();

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: size === 'sm' ? '2px 6px' : '3px 8px',
      borderRadius: 'var(--radius-sm)',
      backgroundColor: config.bgColor,
      color: config.color,
      fontSize: size === 'sm' ? '10px' : '11px',
      fontWeight: 700,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      border: `1px solid ${config.color}30`
    }}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
