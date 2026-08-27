import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Clock,
  Zap,
  CheckCircle2,
  Play,
  Pause,
  Loader2,
  Volume2,
  VolumeX,
  User
} from 'lucide-react';
import type { BusinessStoryline, ExecutiveHealthStatus } from '../../types/api';

interface StorylineHeroProps {
  storyline: BusinessStoryline;
  executiveStatus?: ExecutiveHealthStatus;
  lastSyncedAt: string;
  datasetTitle?: string;
  onOpenInvestigation: (initialPrompt?: string) => void;
}

export const StorylineHero: React.FC<StorylineHeroProps> = ({
  storyline,
  executiveStatus = 'HEALTHY',
  lastSyncedAt,
  datasetTitle = 'Retail Enterprise',
  onOpenInvestigation
}) => {
  // Voice preferences & playback state
  const [selectedVoice, setSelectedVoice] = useState<'adam' | 'sarah'>(() => {
    return (localStorage.getItem('vesta_preferred_voice') as 'adam' | 'sarah') || 'adam';
  });
  const [autoPlayEnabled, setAutoPlayEnabled] = useState<boolean>(() => {
    return localStorage.getItem('vesta_auto_play_voice') !== 'false';
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioUrlRef = useRef<string | null>(null);
  const lastAutoPlayedSyncRef = useRef<string>('');

  const getExecutiveBadge = (status: ExecutiveHealthStatus) => {
    switch (status) {
      case 'EXCELLENT':
        return {
          label: 'Excellent Performance',
          bg: 'var(--color-healthy-bg)',
          color: 'var(--color-healthy)',
          border: 'var(--color-healthy-border)',
          icon: <CheckCircle2 size={14} />
        };
      case 'HEALTHY':
        return {
          label: 'Healthy Performance',
          bg: 'var(--color-healthy-bg)',
          color: 'var(--color-healthy)',
          border: 'var(--color-healthy-border)',
          icon: <ShieldCheck size={14} />
        };
      case 'NEEDS_ATTENTION':
        return {
          label: 'Needs Attention',
          bg: 'var(--color-warning-bg)',
          color: 'var(--color-warning)',
          border: 'var(--color-warning-border)',
          icon: <AlertTriangle size={14} />
        };
      case 'AT_RISK':
        return {
          label: 'At Risk',
          color: '#EA580C',
          bg: '#FFF7ED',
          border: '#FED7AA',
          icon: <AlertTriangle size={14} />
        };
      case 'CRITICAL_ATTENTION_REQUIRED':
        return {
          label: 'Critical Attention Required',
          bg: 'var(--color-critical-bg)',
          color: 'var(--color-critical)',
          border: 'var(--color-critical-border)',
          icon: <AlertTriangle size={14} />
        };
      case 'UNAVAILABLE':
        return {
          label: 'Data Unavailable',
          bg: 'var(--bg-input)',
          color: 'var(--text-muted)',
          border: 'var(--border-subtle)',
          icon: <AlertTriangle size={14} />
        };
      default:
        return {
          label: 'Active Tracking',
          bg: 'var(--color-healthy-bg)',
          color: 'var(--color-healthy)',
          border: 'var(--color-healthy-border)',
          icon: <ShieldCheck size={14} />
        };
    }
  };

  const badge = getExecutiveBadge(executiveStatus);

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  // Play / Pause Narration Handler
  const handleTogglePlay = async (overrideVoice?: 'adam' | 'sarah') => {
    const voiceToUse = overrideVoice || selectedVoice;

    if (isPlaying && audioRef.current && !overrideVoice) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (audioRef.current && !audioRef.current.ended && audioRef.current.src && !overrideVoice) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
      return;
    }

    setIsLoadingAudio(true);
    setAudioError(null);

    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (currentAudioUrlRef.current) {
        URL.revokeObjectURL(currentAudioUrlRef.current);
        currentAudioUrlRef.current = null;
      }

      const res = await fetch('http://127.0.0.1:8000/api/v1/voice/storyline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: datasetTitle || 'Retail Enterprise',
          overall_status: storyline.overall_status,
          biggest_win: storyline.biggest_win,
          biggest_risk: storyline.biggest_risk,
          next_actions: storyline.next_actions,
          voice: voiceToUse
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Voice synthesis failed: ${errText || res.statusText}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      currentAudioUrlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = (e) => {
        console.error('Audio playback error', e);
        setIsPlaying(false);
        setAudioError('Audio playback failed');
      };

      await audio.play();
    } catch (err: any) {
      console.error('Failed to play storyline narration', err);
      setAudioError(err.message || 'Voice error');
      setIsPlaying(false);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  // Change Voice
  const handleChangeVoice = (voice: 'adam' | 'sarah') => {
    setSelectedVoice(voice);
    localStorage.setItem('vesta_preferred_voice', voice);
    if (isPlaying || isLoadingAudio) {
      handleTogglePlay(voice);
    }
  };

  // Toggle Auto-Play on Refresh
  const handleToggleAutoPlay = (enabled: boolean) => {
    setAutoPlayEnabled(enabled);
    localStorage.setItem('vesta_auto_play_voice', enabled ? 'true' : 'false');
  };

  // Auto-play when data refreshes
  useEffect(() => {
    if (autoPlayEnabled && lastSyncedAt && lastAutoPlayedSyncRef.current !== lastSyncedAt) {
      lastAutoPlayedSyncRef.current = lastSyncedAt;
      // Slight delay to allow layout to settle
      const timeout = setTimeout(() => {
        handleTogglePlay(selectedVoice);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [lastSyncedAt, autoPlayEnabled]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (currentAudioUrlRef.current) {
        URL.revokeObjectURL(currentAudioUrlRef.current);
      }
    };
  }, []);

  return (
    <div style={{
      backgroundColor: '#EEF2FF',
      border: '1.5px solid #818CF8',
      borderRadius: 'var(--radius-card)',
      padding: '24px 28px',
      boxShadow: 'var(--shadow-card)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.2s ease'
    }}>
      {/* Top Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            backgroundColor: 'rgba(99, 102, 241, 0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4338CA'
          }}>
            <Sparkles size={18} />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#4338CA', letterSpacing: '-0.02em', margin: 0 }}>
              Today's Business Storyline
            </h1>
            <div style={{ fontSize: '12px', color: '#6366F1', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <Clock size={11} />
              <span>Refreshed at {formatTime(lastSyncedAt)} · ~{storyline.reading_time_seconds || 20}s executive read</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Status Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: badge.bg,
            color: badge.color,
            border: `1px solid ${badge.border}`,
            fontSize: '12px',
            fontWeight: 800
          }}>
            {badge.icon}
            <span>{badge.label}</span>
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => onOpenInvestigation(storyline.biggest_risk)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--brand-primary)',
              color: '#FFFFFF',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(99, 102, 241, 0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            <Zap size={14} />
            <span>Open Investigation</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Executive Voice Narration Player Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(129, 140, 248, 0.35)',
          borderRadius: '14px',
          padding: '10px 16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 2px 8px -2px rgba(99, 102, 241, 0.08)'
        }}
      >
        {/* Left: Play/Pause Button & Equalizer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => handleTogglePlay()}
            disabled={isLoadingAudio}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: isPlaying ? 'rgba(99, 102, 241, 0.12)' : 'var(--brand-primary)',
              color: isPlaying ? 'var(--brand-primary)' : '#FFFFFF',
              border: isPlaying ? '1px solid var(--brand-primary)' : 'none',
              padding: '7px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {isLoadingAudio ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Generating Voice...</span>
              </>
            ) : isPlaying ? (
              <>
                <Pause size={14} />
                <span>Pause Narration</span>
              </>
            ) : (
              <>
                <Play size={14} style={{ fill: 'currentColor' }} />
                <span>Listen to Briefing ({selectedVoice === 'adam' ? 'Adam' : 'Sarah'})</span>
              </>
            )}
          </button>

          {/* Soundwave Equalizer when playing */}
          {isPlaying && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '18px', padding: '0 4px' }}>
              <div className="vesta-soundwave-bar" style={{ animation: 'vesta-soundwave-1 0.8s infinite ease-in-out' }} />
              <div className="vesta-soundwave-bar" style={{ animation: 'vesta-soundwave-2 0.9s infinite ease-in-out' }} />
              <div className="vesta-soundwave-bar" style={{ animation: 'vesta-soundwave-3 0.7s infinite ease-in-out' }} />
              <div className="vesta-soundwave-bar" style={{ animation: 'vesta-soundwave-4 1.0s infinite ease-in-out' }} />
            </div>
          )}

          {audioError && (
            <span style={{ fontSize: '11px', color: 'var(--color-critical)', fontWeight: 600 }}>
              {audioError}
            </span>
          )}
        </div>

        {/* Right: Voice Selector & Auto-play Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* Voice Switcher Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-app)',
            padding: '3px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => handleChangeVoice('adam')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: selectedVoice === 'adam' ? '#FFFFFF' : 'transparent',
                color: selectedVoice === 'adam' ? 'var(--brand-primary)' : 'var(--text-muted)',
                fontSize: '11px',
                fontWeight: selectedVoice === 'adam' ? 700 : 500,
                boxShadow: selectedVoice === 'adam' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <span>👨 Adam (Male)</span>
            </button>

            <button
              onClick={() => handleChangeVoice('sarah')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: selectedVoice === 'sarah' ? '#FFFFFF' : 'transparent',
                color: selectedVoice === 'sarah' ? 'var(--brand-primary)' : 'var(--text-muted)',
                fontSize: '11px',
                fontWeight: selectedVoice === 'sarah' ? 700 : 500,
                boxShadow: selectedVoice === 'sarah' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <span>👩 Sarah (Lady)</span>
            </button>
          </div>

          {/* Auto-read Toggle */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11.5px',
            color: 'var(--text-secondary)',
            fontWeight: 600,
            cursor: 'pointer',
            userSelect: 'none'
          }}>
            <input
              type="checkbox"
              checked={autoPlayEnabled}
              onChange={(e) => handleToggleAutoPlay(e.target.checked)}
              style={{ cursor: 'pointer', accentColor: 'var(--brand-primary)' }}
            />
            <span>Auto-read on refresh</span>
          </label>
        </div>
      </div>

      {/* One-Line Verdict / Summary */}
      <div style={{
        fontSize: '14px',
        fontWeight: 600,
        color: '#4338CA',
        lineHeight: '1.5',
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        border: '1px solid rgba(129, 140, 248, 0.3)',
        borderRadius: 'var(--radius-inner)',
        padding: '12px 18px',
        marginBottom: '16px'
      }}>
        {storyline.overall_status}
      </div>

      {/* Detailed Executive Narrative Paragraph */}
      {storyline.executive_narrative && (
        <div style={{
          fontSize: '13px',
          color: 'var(--text-primary)',
          lineHeight: '1.6',
          backgroundColor: 'rgba(99, 102, 241, 0.04)',
          border: '1px solid rgba(99, 102, 241, 0.15)',
          borderRadius: 'var(--radius-inner)',
          padding: '14px 18px',
          marginBottom: '20px'
        }}>
          <strong style={{ color: 'var(--brand-primary)' }}>Executive Briefing Summary: </strong>
          {storyline.executive_narrative}
        </div>
      )}

      {/* Key Commercial & Channel Highlights Grid */}
      {storyline.channel_highlights && storyline.channel_highlights.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}>
          {storyline.channel_highlights.map((h, idx) => (
            <div key={idx} style={{
              backgroundColor: 'var(--bg-card-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-inner)',
              padding: '10px 14px'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {h.label}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                {h.value}
              </div>
              {h.detail && (
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                  {h.detail}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 3-4 Deterministic Storyline Bullets */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '14px'
      }}>
        {/* Win / Positive Movement */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-inner)',
          padding: '14px 16px',
          display: 'flex',
          gap: '12px',
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
          onClick={() => onOpenInvestigation(storyline.biggest_win)}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-healthy-bg)',
            color: 'var(--color-healthy)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <TrendingUp size={16} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-healthy)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Strongest Win
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px', lineHeight: '1.4' }}>
              {storyline.biggest_win}
            </div>
          </div>
        </div>

        {/* Primary Risk / Financial Drag */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-inner)',
          padding: '14px 16px',
          display: 'flex',
          gap: '12px',
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
          onClick={() => onOpenInvestigation(storyline.biggest_risk)}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-warning-bg)',
            color: 'var(--color-warning)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <AlertTriangle size={16} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-warning)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Primary Risk / Friction
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px', lineHeight: '1.4' }}>
              {storyline.biggest_risk}
            </div>
          </div>
        </div>

        {/* Strategic Next Action */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-inner)',
          padding: '14px 16px',
          display: 'flex',
          gap: '12px',
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
          onClick={() => onOpenInvestigation(storyline.next_actions?.[0] || 'Investigate operational priorities')}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            color: 'var(--brand-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ArrowRight size={16} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Strategic Next Action
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px', lineHeight: '1.4' }}>
              {storyline.next_actions?.[0] || 'Maintain monitored operational controls.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
