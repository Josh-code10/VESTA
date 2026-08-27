import React, { useState, useEffect } from 'react';
import { X, Printer, Copy, Check, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';
import { VestaLogo } from '../../components/common/VestaLogo';
import { GenerateReportResponse } from '../../types/api';
import { generateExecutiveReport } from '../../services/api';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  investigationId?: string;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({ isOpen, onClose, investigationId }) => {
  const [report, setReport] = useState<GenerateReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const invId = investigationId || 'inv_default';
      generateExecutiveReport(invId, 'Executive Management Briefing')
        .then(res => setReport(res))
        .catch(err => console.error('Failed to generate report', err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, investigationId]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    if (report?.markdown_content) {
      navigator.clipboard.writeText(report.markdown_content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
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
        width: '780px',
        maxHeight: '90vh',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }} className="no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} color="var(--brand-primary)" />
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Executive Management Report
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleCopyMarkdown}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {isCopied ? <Check size={13} color="var(--color-healthy)" /> : <Copy size={13} />}
              <span>{isCopied ? 'Copied Markdown' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--brand-primary)',
                color: '#FFFFFF',
                border: 'none',
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Printer size={13} />
              <span>Print / Export PDF</span>
            </button>

            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Report Document Content */}
        <div style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }} className="executive-report-container">
          {isLoading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0' }}>
              Synthesizing structured executive briefing...
            </div>
          ) : report ? (
            <div>
              {/* Document Title Header */}
              <div style={{ borderBottom: '2px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {report.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px', color: 'var(--text-dim)' }}>
                    <span>Generated: {new Date(report.generated_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Report ID: <strong style={{ fontFamily: 'var(--font-mono)' }}>{report.report_id}</strong></span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <VestaLogo size={28} />
                  <span style={{ fontSize: '16px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>VESTA</span>
                </div>
              </div>

              {/* Executive Briefing Summary Container */}
              <div style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-card)',
                padding: '24px 28px',
                boxShadow: 'var(--shadow-card)'
              }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--brand-primary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Executive Briefing Summary
                </div>
                
                <div style={{
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  lineHeight: '1.7',
                  whiteSpace: 'pre-line',
                  fontWeight: 500
                }}>
                  {report.executive_summary}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No report data.</div>
          )}
        </div>
      </div>
    </div>
  );
};
