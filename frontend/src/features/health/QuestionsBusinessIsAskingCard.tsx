import React from 'react';
import { HelpCircle, ArrowRight, Sparkles } from 'lucide-react';

interface QuestionsBusinessIsAskingCardProps {
  questions?: string[];
  onSelectQuestion: (question: string) => void;
}

const DEFAULT_QUESTIONS = [
  "Why is revenue growing while margin is shrinking?",
  "Which products are driving returns in South South?",
  "Why did gross profit margin collapse in Lagos in July?",
  "What is the average discount depth by channel?"
];

export const QuestionsBusinessIsAskingCard: React.FC<QuestionsBusinessIsAskingCardProps> = ({
  questions,
  onSelectQuestion
}) => {
  const activeQuestions = questions && questions.length > 0 ? questions : DEFAULT_QUESTIONS;
  const isInferred = Boolean(questions && questions.length > 0);

  return (
    <div style={{
      backgroundColor: '#F8FAFC',
      border: '1.5px solid #E2E8F0',
      borderRadius: 'var(--radius-card)',
      padding: '24px 28px',
      boxShadow: 'var(--shadow-card)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

        {isInferred && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 9px',
            borderRadius: '12px',
            backgroundColor: 'rgba(99, 102, 241, 0.12)',
            color: '#4F46E5',
            letterSpacing: '0.02em'
          }}>
            <Sparkles size={12} />
            <span>Inferred from Dataset</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {activeQuestions.map((q, idx) => (
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
              padding: '6px 0',
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
