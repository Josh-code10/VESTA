import React from 'react';
import { HelpCircle, ArrowRight } from 'lucide-react';

interface QuestionsBusinessIsAskingCardProps {
  onSelectQuestion: (question: string) => void;
}

export const QuestionsBusinessIsAskingCard: React.FC<QuestionsBusinessIsAskingCardProps> = ({
  onSelectQuestion
}) => {
  const questions = [
    "Why is revenue growing while margin is shrinking?",
    "Which products are driving returns in South South?",
    "Why did gross profit margin collapse in Lagos in July?",
    "What is the average discount depth by channel?"
  ];

  return (
    <div style={{
      backgroundColor: '#F8FAFC',
      border: '1.5px solid #E2E8F0',
      borderRadius: 'var(--radius-card)',
      padding: '24px 28px',
      boxShadow: 'var(--shadow-card)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '8px',
          backgroundColor: 'rgba(99, 102, 241, 0.12)',
          color: '#4F46E5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <HelpCircle size={16} />
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
          Questions Your Business Is Asking
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelectQuestion(q)}
            style={{
              textAlign: 'left',
              background: 'none',
              border: 'none',
              color: '#4F46E5',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '4px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.15s ease'
            }}
            className="question-link-btn"
          >
            <span>• {q}</span>
            <ArrowRight size={14} style={{ opacity: 0.7 }} />
          </button>
        ))}
      </div>
    </div>
  );
};
