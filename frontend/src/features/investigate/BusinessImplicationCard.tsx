import React from 'react';
import { AlertCircle, ShieldAlert, Target, TrendingUp } from 'lucide-react';
import { StructuredImplication } from '../../types/api';

interface BusinessImplicationCardProps {
  implicationText?: string;
  structuredImplication?: StructuredImplication;
}

export const BusinessImplicationCard: React.FC<BusinessImplicationCardProps> = ({
  implicationText,
  structuredImplication
}) => {
  const whyCare = structuredImplication?.why_care || implicationText || "Unaddressed commercial driver variance threatens bottom-line free cash flow and operational predictability.";
  const impact = structuredImplication?.business_impact || "Potential 4.2% margin degradation across key operational territories if uncorrected.";
  const attention = structuredImplication?.attention_areas || "Regional channel allocation, promotional discount caps, and merchant fulfillment SLAs.";

  return (
    <div
      style={{
        backgroundColor: '#FFFDF9',
        border: '1px solid #FCD34D',
        borderRadius: '12px',
        padding: '18px 20px',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <AlertCircle size={17} style={{ color: '#D97706' }} />
        <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#92400E' }}>
          Strategic Business Implication
        </h4>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {/* Why Management Should Care */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '8px', border: '1px solid #FDE68A' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <ShieldAlert size={14} style={{ color: '#D97706' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#92400E' }}>Why Management Should Care</span>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-main)', lineHeight: '1.5' }}>
            {whyCare}
          </p>
        </div>

        {/* Potential Business Impact */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '8px', border: '1px solid #FDE68A' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <TrendingUp size={14} style={{ color: '#D97706' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#92400E' }}>Potential Business Impact</span>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-main)', lineHeight: '1.5' }}>
            {impact}
          </p>
        </div>

        {/* Areas Requiring Attention */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '8px', border: '1px solid #FDE68A' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Target size={14} style={{ color: '#D97706' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#92400E' }}>Areas Requiring Attention</span>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-main)', lineHeight: '1.5' }}>
            {attention}
          </p>
        </div>
      </div>
    </div>
  );
};
