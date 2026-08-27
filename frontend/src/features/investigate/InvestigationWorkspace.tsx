import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Layers,
  Filter,
  ArrowLeft,
  ShieldCheck,
  Code,
  FileText,
  HelpCircle,
  Clock,
  ChevronRight,
  Database,
  PlusCircle,
  Trash2,
  Mic
} from 'lucide-react';
import { EvidenceNode, EpistemicTag, AnswerabilityStatus } from '../../types/api';
import { EpistemicBadge } from '../../components/epistemic/EpistemicBadge';
import { LimitationCard } from '../../components/epistemic/LimitationCard';
import { EvidenceDrawer } from '../../components/evidence/EvidenceDrawer';
import { ExecutiveInsightCard } from './ExecutiveInsightCard';
import { InvestigationRoadmap } from './InvestigationRoadmap';
import { VestaThinkingStream } from './VestaThinkingStream';
import { submitInvestigationQuery } from '../../services/api';
import { voiceService } from '../../services/ExecutiveVoiceService';

interface InvestigationWorkspaceProps {
  initialQuestion?: string;
  nodes: EvidenceNode[];
  onUpdateNodes: (updater: (prev: EvidenceNode[]) => EvidenceNode[]) => void;
  investigationId: string;
  onUpdateInvestigationId: (id: string) => void;
  activeNode: EvidenceNode | null;
  onSetActiveNode: (node: EvidenceNode | null) => void;
  onBackToDashboard: () => void;
  onOpenReportModal: () => void;
  onClearInvestigation: () => void;
}

export const InvestigationWorkspace: React.FC<InvestigationWorkspaceProps> = ({
  initialQuestion,
  nodes,
  onUpdateNodes,
  investigationId,
  onUpdateInvestigationId,
  activeNode,
  onSetActiveNode,
  onBackToDashboard,
  onOpenReportModal,
  onClearInvestigation
}) => {
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [activeThinkingQuery, setActiveThinkingQuery] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Guard against React.StrictMode double-invocations
  const lastExecutedQuestionRef = useRef<string>('');

  // Suggested follow-up prompt pills for fast executive interaction
  const suggestedPrompts = [
    "Which specific regions and products drove that variance?",
    "Show me the gross profit margin breakdown by category.",
    "What is our customer satisfaction CSAT score in Abuja?", // triggers epistemic boundary
    "Rank top 5 products by return rate volume."
  ];

  const handleRemoveNode = (nodeId: string) => {
    onUpdateNodes(prev => prev.filter(n => n.node_id !== nodeId));
    if (activeNode?.node_id === nodeId) {
      onSetActiveNode(null);
    }
  };

  const handleSendQuery = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isLoading) return;

    // Close the Evidence Drawer whenever a new query starts so the response is clearly visible
    onSetActiveNode(null);
    setActiveThinkingQuery(trimmed);
    setQueryError(null);
    setIsLoading(true);

    try {
      const parentId = nodes.length > 0 ? nodes[nodes.length - 1].node_id : undefined;
      const res = await submitInvestigationQuery(trimmed, investigationId || undefined, parentId);

      if (res.investigation_id && res.investigation_id !== investigationId) {
        onUpdateInvestigationId(res.investigation_id);
      }

      onUpdateNodes(prev => {
        // De-duplicate in case of any duplicate network callbacks
        if (prev.some(n => n.node_id === res.node.node_id)) {
          return prev;
        }
        return [...prev, res.node];
      });

      // Do NOT auto-open the Evidence Drawer — the CEO sees the card first.
      // User can explicitly click "Inspect Evidence Slice" to open it.
      setActiveFilters(res.active_filters || {});
      setInputQuery('');
    } catch (err: any) {
      console.error('Investigation query failed', err);
      setQueryError(err.message || 'Unable to execute investigation. Please check backend connection.');
    } finally {
      setIsLoading(false);
      setActiveThinkingQuery('');
    }
  };

  useEffect(() => {
    if (initialQuestion && initialQuestion.trim() && lastExecutedQuestionRef.current !== initialQuestion.trim()) {
      lastExecutedQuestionRef.current = initialQuestion.trim();
      handleSendQuery(initialQuestion.trim());
    }
  }, [initialQuestion]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [nodes, isLoading]);

  return (
    <div style={{
      display: 'flex',
      flex: 1,
      minHeight: 0,
      height: '100%',
      backgroundColor: 'var(--bg-app)',
      overflow: 'hidden'
    }}>
      {/* 1. Left Column: Investigation Trail & Active Scope */}
      <div style={{
        width: '300px',
        flexShrink: 0,
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto'
      }}>
        {/* Top Header & Navigation Actions */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={onBackToDashboard}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={14} />
            <span>Health Home</span>
          </button>

          <button
            onClick={onClearInvestigation}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: '1px solid var(--border-subtle)',
              padding: '3px 8px',
              borderRadius: '6px',
              color: 'var(--text-muted)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            title="Start fresh investigation session"
          >
            <PlusCircle size={12} />
            <span>New</span>
          </button>
        </div>

        {/* Active Filters / Scope */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
            <Filter size={11} />
            <span>Active Exploration Scope</span>
          </div>
          {Object.keys(activeFilters).length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {Object.entries(activeFilters).map(([k, v]) => (
                <span
                  key={k}
                  style={{
                    fontSize: '11px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--brand-primary)',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {k}: <strong>{String(v)}</strong>
                </span>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
              Full dataset scope (30,443 rows active)
            </div>
          )}
        </div>

        {/* Evidence Trail Nodes Hierarchy */}
        <div style={{ flex: 1, padding: '16px 18px', overflowY: 'auto' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.04em' }}>
            Evidence Trail ({nodes.length} Stages)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {nodes.length === 0 ? (
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', textAlign: 'center', padding: '20px 0' }}>
                No active investigation stages yet. Ask a question to begin.
              </div>
            ) : (
              nodes.map((node, idx) => {
                const isSelected = activeNode?.node_id === node.node_id;
                return (
                  <div
                    key={node.node_id}
                    onClick={() => onSetActiveNode(node)}
                    style={{
                      backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                      border: `1px solid ${isSelected ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: 700 }}>
                        Stage #{idx + 1}
                      </span>
                      <EpistemicBadge tag={node.epistemic_status} size="sm" />
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: '1.3' }}>
                      {node.user_question}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bottom Report Trigger */}
        <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={onOpenReportModal}
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
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(99, 102, 241, 0.25)'
            }}
          >
            <FileText size={13} />
            <span>Generate Executive Briefing Summary</span>
          </button>
        </div>
      </div>

      {/* 2. Center Column: Conversational Stream */}
      <div style={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--bg-app)'
      }}>
        {/* Persistent Investigation Header */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onBackToDashboard}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                padding: '6px 12px',
                borderRadius: '8px',
                color: 'var(--text-main)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to Executive Dashboard</span>
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                  Investigation: {nodes.length > 0 ? nodes[nodes.length - 1].user_question : 'Boardroom Case File'}
                </h2>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--brand-primary)' }}>
                  ACTIVE CASE FILE
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>Started: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span>Drivers: Finance, Sales, Operations</span>
                <span>Source: Connected Business Sheet (5,000 records)</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-healthy)' }}>
              <ShieldCheck size={13} /> 100% DETERMINISTIC CONFIDENCE
            </span>

            <button
              onClick={onClearInvestigation}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                padding: '6px 12px',
                borderRadius: '8px',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <PlusCircle size={13} />
              <span>New Case File</span>
            </button>
          </div>
        </div>

        {/* Chat Feed */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {/* Section 2: Investigation Roadmap */}
          <InvestigationRoadmap
            nodes={nodes}
            activeNodeId={activeNode?.node_id}
            onSelectStage={(node) => onSetActiveNode(node)}
          />
          {nodes.length === 0 && !isLoading && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px', marginBottom: '30px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                backgroundColor: 'rgba(99, 102, 241, 0.12)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px'
              }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                VESTA Dual Intelligence Hub
              </h3>
              <p style={{ fontSize: '13px', maxWidth: '520px', margin: '0 auto 28px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                I can investigate your business data, explain business concepts, and help you understand your dashboard.
              </p>

              {/* 3 Suggestion Cards Grouped */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', maxWidth: '860px', margin: '0 auto', textAlign: 'left' }}>
                {/* Group 1: Investigate */}
                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-card)', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.04em' }}>
                    📊 Investigate My Business
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button onClick={() => handleSendQuery("Why did gross profit margin collapse in Lagos in July?")} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: '4px 0' }}>
                      • Why did gross profit margin collapse in Lagos?
                    </button>
                    <button onClick={() => handleSendQuery("Which product categories have the highest return rate?")} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: '4px 0' }}>
                      • Which categories have the highest return rate?
                    </button>
                    <button onClick={() => handleSendQuery("Show average discount depth by channel")} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: '4px 0' }}>
                      • Show discount depth by channel
                    </button>
                  </div>
                </div>

                {/* Group 2: Learn Concepts */}
                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-card)', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#8B5CF6', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.04em' }}>
                    🧠 Understand Business Concepts
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button onClick={() => handleSendQuery("What is Gross Profit Margin %?")} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: '4px 0' }}>
                      • What is Gross Profit Margin %?
                    </button>
                    <button onClick={() => handleSendQuery("Explain Inventory Turnover Ratio")} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: '4px 0' }}>
                      • Explain Inventory Turnover Ratio
                    </button>
                    <button onClick={() => handleSendQuery("What is Return on Ad Spend (ROAS)?")} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: '4px 0' }}>
                      • What is Return on Ad Spend (ROAS)?
                    </button>
                  </div>
                </div>

                {/* Group 3: Understand Dashboard */}
                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-card)', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-healthy)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.04em' }}>
                    📐 Understand This Dashboard
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button onClick={() => handleSendQuery("Why is Business Health 69.7?")} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: '4px 0' }}>
                      • Why is Business Health 69.7?
                    </button>
                    <button onClick={() => handleSendQuery("How is the Health Score calculated?")} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: '4px 0' }}>
                      • How is the Health Score calculated?
                    </button>
                    <button onClick={() => handleSendQuery("Why is Return Rate marked yellow?")} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: '4px 0' }}>
                      • Why is Return Rate marked yellow?
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Render All Stages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {nodes.map((node, index) => (
              <div key={node.node_id} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* User Message Bubble */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{
                    backgroundColor: 'var(--brand-primary)',
                    color: '#FFFFFF',
                    padding: '10px 16px',
                    borderRadius: '16px 16px 4px 16px',
                    fontSize: '13px',
                    fontWeight: 600,
                    maxWidth: '80%',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {node.user_question}
                  </div>
                </div>

                {/* AI Assistant Executive Insight Card */}
                <ExecutiveInsightCard
                  node={node}
                  stageNumber={index + 1}
                  isEvidenceOpen={activeNode?.node_id === node.node_id}
                  onRemoveNode={handleRemoveNode}
                  onSelectNextQuery={(query) => {
                    // Scroll to bottom to show the new query bubble is being processed
                    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
                    handleSendQuery(query);
                  }}
                  onOpenEvidenceDrawer={() => {
                    // If this node's drawer is already open, close it; otherwise open it
                    if (activeNode?.node_id === node.node_id) {
                      onSetActiveNode(null);
                    } else {
                      onSetActiveNode(node);
                    }
                  }}
                />
              </div>
            ))}

            {/* Vesta Live Reasoning & Investigation Stream */}
            {isLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* User In-flight Message Bubble */}
                {activeThinkingQuery && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{
                      backgroundColor: 'var(--brand-primary)',
                      color: '#FFFFFF',
                      padding: '10px 16px',
                      borderRadius: '16px 16px 4px 16px',
                      fontSize: '13px',
                      fontWeight: 600,
                      maxWidth: '80%',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      {activeThinkingQuery}
                    </div>
                  </div>
                )}

                <VestaThinkingStream
                  isLive={true}
                  queryText={activeThinkingQuery}
                />
              </div>
            )}

            {/* Error Message Notice */}
            {queryError && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid var(--color-critical-border)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-critical)', fontSize: '13px', fontWeight: 600 }}>
                  <ShieldCheck size={16} />
                  <span>{queryError}</span>
                </div>
                <button
                  onClick={() => setQueryError(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Dismiss
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggested Follow-Up Prompts */}
        <div style={{ padding: '0 24px 10px', display: 'flex', gap: '8px', overflowX: 'auto', flexShrink: 0 }}>
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendQuery(prompt)}
              disabled={isLoading}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 14px',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s'
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', flexShrink: 0 }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery(inputQuery);
            }}
            style={{ display: 'flex', gap: '10px' }}
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask an executive question (e.g., 'Why did margin drop in Lagos in July?')..."
              disabled={isLoading}
              style={{
                flex: 1,
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '12px 16px',
                fontSize: '13px',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
            <button
              type="button"
              onClick={() => {
                if (voiceService.getIsListening()) {
                  voiceService.stopListening();
                } else {
                  voiceService.startListening((text, isFinal) => {
                    setInputQuery(text);
                    if (isFinal && text.trim()) {
                      handleSendQuery(text);
                    }
                  });
                }
              }}
              style={{
                backgroundColor: voiceService.getIsListening() ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-input)',
                color: voiceService.getIsListening() ? '#EF4444' : 'var(--brand-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '0 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Voice Investigation Command"
            >
              <Mic size={16} />
            </button>

            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              style={{
                backgroundColor: 'var(--brand-primary)',
                color: '#FFFFFF',
                border: 'none',
                padding: '0 20px',
                borderRadius: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                opacity: isLoading || !inputQuery.trim() ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Send size={15} />
              <span>Investigate</span>
            </button>
          </form>
        </div>
      </div>

      {/* 3. Right Column: Evidence Drawer */}
      {activeNode && (
        <div style={{
          width: '380px',
          borderLeft: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          <EvidenceDrawer
            node={activeNode}
            onClose={() => onSetActiveNode(null)}
          />
        </div>
      )}
    </div>
  );
};
