import React from 'react';
import { RefreshCw, Database, FileText, CheckCircle2, AlertCircle, Clock, Link2, Sun, Moon } from 'lucide-react';
import { VestaLogo } from '../common/VestaLogo';
import type { SyncStatus } from '../../types/api';

interface ExecutiveHeaderProps {
  datasetTitle: string;
  rowCount: number;
  lastSyncedAt: string;
  syncStatus: SyncStatus;
  isRefreshing: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onRefresh: () => void;
  onOpenConnectModal: () => void;
  onOpenReportModal: () => void;
}

export const ExecutiveHeader: React.FC<ExecutiveHeaderProps> = ({
  datasetTitle,
  rowCount,
  lastSyncedAt,
  syncStatus,
  isRefreshing,
  theme,
  onToggleTheme,
  onRefresh,
  onOpenConnectModal,
  onOpenReportModal
}) => {
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  return (
    <header style={{
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
    }}>
      {/* Brand & Context */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <VestaLogo size={30} />
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              VESTA
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                backgroundColor: 'rgba(99, 102, 241, 0.10)',
                color: 'var(--brand-primary)',
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                CEO BI
              </span>
            </div>
          </div>
        </div>

        <div style={{ height: '20px', width: '1px', backgroundColor: 'var(--border-subtle)' }} />

        {/* Dataset Pill */}
        <div 
          onClick={onOpenConnectModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-card-secondary)',
            border: '1px solid var(--border-subtle)',
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="Click to change or reconnect data source"
        >
          <Database size={13} color="var(--brand-primary)" />
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{datasetTitle}</span>
          <span style={{ color: 'var(--text-dim)' }}>•</span>
          <span style={{ color: 'var(--text-muted)' }} className="tabular-nums">{rowCount.toLocaleString()} rows</span>
          <Link2 size={12} color="var(--text-dim)" />
        </div>
      </div>

      {/* Telemetry & Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Sync Telemetry */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <Clock size={13} color="var(--text-dim)" />
          <span>Last synced: <strong style={{ color: 'var(--text-secondary)' }}>{formatTime(lastSyncedAt)}</strong></span>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            fontSize: '11px',
            fontWeight: 700,
            backgroundColor: syncStatus === 'READY' || syncStatus === 'UPDATED' ? 'var(--color-healthy-bg)' : 'var(--color-warning-bg)',
            color: syncStatus === 'READY' || syncStatus === 'UPDATED' ? 'var(--color-healthy)' : 'var(--color-warning)',
            border: `1px solid ${syncStatus === 'READY' || syncStatus === 'UPDATED' ? 'var(--color-healthy-border)' : 'var(--color-warning-border)'}`
          }}>
            {syncStatus === 'READY' || syncStatus === 'UPDATED' ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
            {syncStatus}
          </div>
        </div>

        {/* Manual Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            padding: '7px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: isRefreshing ? 'not-allowed' : 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s ease'
          }}
        >
          <RefreshCw size={13} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
          <span>{isRefreshing ? 'Syncing...' : 'Refresh Data'}</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '34px',
            height: '34px',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s ease'
          }}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
        </button>

        {/* Executive Report Button */}
        <button
          onClick={onOpenReportModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--brand-primary)',
            color: '#FFFFFF',
            border: 'none',
            padding: '7px 16px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(99, 102, 241, 0.35)',
            transition: 'all 0.2s ease'
          }}
        >
          <FileText size={13} />
          <span>Executive Briefing</span>
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
};
