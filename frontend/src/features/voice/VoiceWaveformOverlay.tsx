import React from 'react';
import { Mic, Square } from 'lucide-react';
import { voiceService } from '../../services/ExecutiveVoiceService';

interface VoiceWaveformOverlayProps {
  isActive: boolean;
  transcriptText: string;
  onClose: () => void;
}

export const VoiceWaveformOverlay: React.FC<VoiceWaveformOverlayProps> = ({
  isActive,
  transcriptText,
  onClose
}) => {
  if (!isActive) return null;

  const handleStop = () => {
    voiceService.stopListening();
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#0F172A',
      color: '#FFFFFF',
      borderRadius: '24px',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
      zIndex: 900,
      maxWidth: '640px',
      width: '90%',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(8px)'
    }}>
      {/* Mic Icon Indicator */}
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: 'rgba(239, 68, 68, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#F87171'
      }}>
        <Mic size={16} />
      </div>

      {/* Waveform Pulse Animation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '18px' }}>
        {[40, 80, 50, 100, 60, 90, 30].map((h, idx) => (
          <div
            key={idx}
            style={{
              width: '3px',
              height: `${h}%`,
              backgroundColor: '#F87171',
              borderRadius: '2px',
              animation: `pulse 0.8s ease-in-out ${idx * 0.1}s infinite alternate`
            }}
          />
        ))}
      </div>

      {/* Live Listening Transcript */}
      <div style={{
        flex: 1,
        fontSize: '12px',
        fontWeight: 500,
        color: '#E2E8F0',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        lineHeight: '1.4'
      }}>
        <strong style={{ color: '#FCA5A5', marginRight: '6px' }}>Listening...</strong>
        {transcriptText || 'Say your business query...'}
      </div>

      {/* Stop Listening Button */}
      <button
        onClick={handleStop}
        title="Stop Listening"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          color: '#FFFFFF',
          padding: '6px 10px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        <Square size={10} fill="currentColor" />
        <span>Stop</span>
      </button>
    </div>
  );
};
