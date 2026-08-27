import React, { useState } from 'react';
import { X, Database, Sparkles, CheckCircle2, ArrowRight, Shield } from 'lucide-react';
import { connectSheet } from '../../services/api';

interface ConnectSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectedSuccess: () => void;
}

export const ConnectSheetModal: React.FC<ConnectSheetModalProps> = ({
  isOpen,
  onClose,
  onConnectedSuccess
}) => {
  const [sheetUrl, setSheetUrl] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = async (urlToUse?: string) => {
    setIsConnecting(true);
    setErrorMsg(null);

    try {
      await connectSheet(urlToUse || undefined);
      onConnectedSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect dataset.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      backdropFilter: 'blur(3px)'
    }}>
      <div style={{
        width: '540px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Database size={16} color="var(--brand-primary)" />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Connect Business Dataset
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Google Sheets API v4 Ingestion & Automated Profiling
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        {/* 1-Click Demo Preset Banner */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '18px'
        }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            1-Click Live Demonstration Preset
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.4' }}>
            Connect NexaSphere Retail Ltd. omnichannel dataset (5,000 transactions, retail, web, regional margin & return variances).
          </div>
          <button
            onClick={() => handleConnect()}
            disabled={isConnecting}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              width: '100%',
              backgroundColor: 'var(--brand-primary)',
              color: '#FFFFFF',
              border: 'none',
              padding: '9px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: isConnecting ? 'not-allowed' : 'pointer'
            }}
          >
            <Sparkles size={14} />
            <span>{isConnecting ? 'Profiling Dataset...' : 'Connect Live Demo Dataset'}</span>
          </button>
        </div>

        <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-dim)', margin: '14px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          — OR CONNECT CUSTOM GOOGLE SHEET —
        </div>

        {/* Custom URL Input */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Google Sheet URL (Public or Shared)
          </label>
          <input
            type="text"
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/..."
            disabled={isConnecting}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              padding: '9px 12px',
              fontSize: '12px',
              outline: 'none'
            }}
          />
        </div>

        {errorMsg && (
          <div style={{ fontSize: '12px', color: 'var(--color-critical)', marginBottom: '14px' }}>
            {errorMsg}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              padding: '7px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => handleConnect(sheetUrl)}
            disabled={!sheetUrl.trim() || isConnecting}
            style={{
              backgroundColor: 'var(--brand-primary)',
              border: 'none',
              color: '#FFFFFF',
              padding: '7px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: !sheetUrl.trim() || isConnecting ? 'not-allowed' : 'pointer'
            }}
          >
            {isConnecting ? 'Connecting...' : 'Connect & Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};
