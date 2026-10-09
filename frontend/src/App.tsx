import React, { useState, useEffect } from 'react';
import { ExecutiveHeader } from './components/layout/ExecutiveHeader';
import { StorylineHero } from './features/health/StorylineHero';
import { HealthScoreHero } from './features/health/HealthScoreHero';
import { BusinessDriversTable } from './features/health/BusinessDriversTable';
import { DriverExplanationDrawer } from './features/health/DriverExplanationDrawer';
import { Top3IssuesBanner } from './features/health/Top3IssuesBanner';
import { BusinessDriversGrid } from './features/health/BusinessDriversGrid';
import { RecentInvestigations } from './features/health/RecentInvestigations';
import { RefreshSummaryToast } from './features/health/RefreshSummaryToast';
import { ViewMoreDrawer } from './features/health/ViewMoreDrawer';
import { KPICustomizerModal } from './features/health/KPICustomizerModal';
import { ConnectSheetModal } from './features/onboarding/ConnectSheetModal';
import { ExecutiveReportModal } from './features/reporting/ExecutiveReportModal';
import { EvidenceDrawer } from './components/evidence/EvidenceDrawer';
import { QuestionsBusinessIsAskingCard } from './features/health/QuestionsBusinessIsAskingCard';
import { VoiceWaveformOverlay } from './features/voice/VoiceWaveformOverlay';
import { ExecutiveMemoryTimeline } from './features/memory/ExecutiveMemoryTimeline';
import { SinceLastBriefingBanner } from './features/health/SinceLastBriefingBanner';
import { voiceService } from './services/ExecutiveVoiceService';
import { InvestigationWorkspace } from './features/investigate/InvestigationWorkspace';
import { getHealthDashboard, refreshDataSource, updateKPIConfig, API_BASE_URL } from './services/api';
import { DEFAULT_DASHBOARD_SNAPSHOT } from './data/defaultDashboardSnapshot';
import type { HealthDashboardResponse, ActiveKPI, HealthIssue, EvidenceNode, ExecutiveMemory } from './types/api';

export const App: React.FC = () => {
  // Theme management
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('vesta-theme') as 'light' | 'dark') || 'light';
  });

  const [dashboard, setDashboard] = useState<HealthDashboardResponse | null>(DEFAULT_DASHBOARD_SNAPSHOT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'health' | 'investigate'>('health');
  const [investigationSeedQuery, setInvestigationSeedQuery] = useState<string>('');

  // Refresh summary toast
  const [showRefreshToast, setShowRefreshToast] = useState<boolean>(false);
  const [scoreDelta, setScoreDelta] = useState<number>(0);

  // Modals & Drawers
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isViewMoreOpen, setIsViewMoreOpen] = useState<boolean>(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [selectedDriverForExplanation, setSelectedDriverForExplanation] = useState<ActiveKPI | null>(null);

  // Evidence drawer state on dashboard
  const [dashboardEvidenceNode, setDashboardEvidenceNode] = useState<EvidenceNode | null>(null);

  // Active Investigation State (Persisted across screen transitions)
  const [investigationNodes, setInvestigationNodes] = useState<EvidenceNode[]>([]);
  const [activeInvestigationId, setActiveInvestigationId] = useState<string>('inv_default');
  const [activeInvestigationNode, setActiveInvestigationNode] = useState<EvidenceNode | null>(null);

  // Recent investigation sessions cache
  const [recentInvestigations, setRecentInvestigations] = useState<EvidenceNode[]>([]);

  // Voice Command Listening State
  const [isVoiceOverlayActive, setIsVoiceOverlayActive] = useState<boolean>(false);
  const [voiceCaption, setVoiceCaption] = useState<string>('');

  // Executive Decision Memory State
  const [executiveMemories, setExecutiveMemories] = useState<ExecutiveMemory[]>([]);

  useEffect(() => {
    // Fetch initial Executive Memories
    fetch(`${API_BASE_URL}/memory/list`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setExecutiveMemories(data);
      })
      .catch(() => {});

    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vesta-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const fetchDashboard = async () => {
    try {
      const data = await getHealthDashboard();
      setDashboard(data);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const prevScore = dashboard?.health_score?.overall_score ?? 85;
    try {
      await refreshDataSource();
      const updatedData = await getHealthDashboard();
      setDashboard(updatedData);
      const newScore = updatedData?.health_score?.overall_score ?? 85;
      setScoreDelta(newScore - prevScore);
      setShowRefreshToast(true);
    } catch (err) {
      console.error('Refresh failed', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleStartInvestigation = (question: string) => {
    setInvestigationSeedQuery(question);
    setActiveView('investigate');
  };

  const handleClearInvestigation = () => {
    setInvestigationNodes([]);
    setActiveInvestigationNode(null);
    setInvestigationSeedQuery('');
    setActiveInvestigationId(`inv_${Date.now()}`);
  };

  const handleShowEvidence = (title: string, data: any[], formula: string) => {
    const syntheticNode: EvidenceNode = {
      node_id: `dash_ev_${Date.now()}`,
      investigation_id: 'dashboard_preview',
      user_question: title,
      epistemic_status: 'FACT',
      executive_finding: `Deterministic performance slice for ${title}.`,
      evidence_chart_type: 'bar',
      evidence_data: {
        dimensions: data.length > 0 && typeof data[0] === 'object' ? Object.keys(data[0]).filter(k => typeof data[0][k] !== 'number') : ['Entity'],
        metrics: data.length > 0 && typeof data[0] === 'object' ? Object.keys(data[0]).filter(k => typeof data[0][k] === 'number') : ['Value'],
        records: data
      },
      lineage: {
        tool_executed: 'group_and_aggregate',
        parameters: { dataset: 'connected_sheet' },
        formula_breadcrumb: formula || 'AGGREGATE(dataset)',
        analytical_result_id: 'res_dash_ev',
        evidence_artifact_ids: ['art_dash_ev_1'],
        confidence_level: 'HIGH'
      },
      created_at: new Date().toISOString()
    };

    setDashboardEvidenceNode(syntheticNode);
  };

  const handleShowIssueEvidence = (issue: HealthIssue) => {
    handleShowEvidence(
      issue.title,
      [{ label: issue.primary_driver, value: issue.current_value }, { label: 'Baseline Target', value: issue.baseline_target || 85 }],
      `ANOMALY_DETECTION(${issue.kpi_id})`
    );
  };

  const handleSaveKPITarget = async (kpiId: string, targetVal: number) => {
    try {
      await updateKPIConfig(kpiId, targetVal);
      await fetchDashboard();
    } catch (err) {
      console.error('Failed to update target', err);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      maxHeight: '100vh',
      backgroundColor: 'var(--bg-app)',
      color: 'var(--text-primary)',
      overflow: activeView === 'investigate' ? 'hidden' : 'auto'
    }}>
      {/* Executive Header */}
      <ExecutiveHeader
        datasetTitle={dashboard?.dataset_title || 'NexaSphere Enterprise Dataset'}
        rowCount={dashboard?.row_count ?? 30443}
        lastSyncedAt={dashboard?.last_synced_at || new Date().toISOString()}
        syncStatus={dashboard?.sync_status || 'READY'}
        isRefreshing={isRefreshing}
        theme={theme}
        onToggleTheme={toggleTheme}
        onRefresh={handleRefresh}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Main Screen Router */}
      {activeView === 'investigate' ? (
        <InvestigationWorkspace
          initialQuestion={investigationSeedQuery}
          nodes={investigationNodes}
          onUpdateNodes={(updater) => {
            setInvestigationNodes(prev => {
              const next = updater(prev);
              setRecentInvestigations(next.slice(-5));
              return next;
            });
          }}
          investigationId={activeInvestigationId}
          onUpdateInvestigationId={setActiveInvestigationId}
          activeNode={activeInvestigationNode}
          onSetActiveNode={setActiveInvestigationNode}
          onBackToDashboard={() => setActiveView('health')}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onClearInvestigation={handleClearInvestigation}
        />
      ) : (
        <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '32px 24px', boxSizing: 'border-box' }}>
          {/* Post-Refresh Telemetry Summary */}
          {showRefreshToast && dashboard && (
            <RefreshSummaryToast
              score={dashboard.health_score.overall_score ?? 85}
              scoreDelta={scoreDelta}
              issueCount={dashboard.top_3_issues.length}
              kpiCount={dashboard.kpis.length}
              onDismiss={() => setShowRefreshToast(false)}
            />
          )}

          {isLoading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '120px 0', fontSize: '15px' }}>
              Synthesizing executive business health...
            </div>
          ) : dashboard ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* 1. Full-Width Storyline Hero (Top of Home) */}
              <StorylineHero
                storyline={dashboard.business_storyline}
                executiveStatus={dashboard.health_score.executive_status}
                lastSyncedAt={dashboard.last_synced_at}
                datasetTitle={dashboard.dataset_title}
                onOpenInvestigation={(prompt) => handleStartInvestigation(prompt || dashboard.business_storyline.biggest_risk)}
              />

              {/* 2. Business Health Hero & Business Drivers Table */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(340px, 420px) 1fr',
                gap: '24px',
                alignItems: 'stretch'
              }}>
                <HealthScoreHero
                  healthScore={dashboard.health_score}
                  onOpenWhyScoreDrawer={() => {
                    const primary = dashboard.health_score.contributions.find(c => c.is_available);
                    if (primary) setSelectedDriverForExplanation(primary);
                  }}
                  onOpenCustomizer={() => setIsCustomizerOpen(true)}
                />

                <BusinessDriversTable
                  contributions={dashboard.health_score.contributions}
                  onSelectDriver={(driver) => setSelectedDriverForExplanation(driver)}
                  onInvestigateDriver={(prompt) => handleStartInvestigation(prompt)}
                />
              </div>

              {/* Post-Refresh Continuity Banner */}
              {showRefreshToast && dashboard && (
                <SinceLastBriefingBanner
                  scoreDelta={scoreDelta}
                  lastSyncedAt={dashboard.last_synced_at}
                />
              )}

              {/* Questions Your Business Is Asking */}
              <QuestionsBusinessIsAskingCard
                questions={dashboard?.inferred_questions}
                onSelectQuestion={(q) => handleStartInvestigation(q)}
              />

              {/* 3. Management Attention (Ranked Top 3 Issues) */}
              <Top3IssuesBanner
                issues={dashboard.top_3_issues}
                onInvestigateIssue={(issue) =>
                  handleStartInvestigation(`Investigate root causes of ${issue.title} in ${issue.primary_driver}`)
                }
                onShowEvidence={handleShowIssueEvidence}
                onViewMoreIssues={() => setIsViewMoreOpen(true)}
              />

              {/* Executive Decision Memory Timeline */}
              {executiveMemories.length > 0 && (
                <ExecutiveMemoryTimeline
                  memories={executiveMemories}
                  onResumeInvestigation={(mem) => {
                    handleStartInvestigation(mem.investigation);
                  }}
                />
              )}

              {/* 4. Categorized Operational Business Drivers Grid */}
              <BusinessDriversGrid
                kpis={dashboard.kpis}
                availableCategories={dashboard.available_categories}
                onInvestigateKPI={(kpi) =>
                  handleStartInvestigation(`Investigate variance and performance drivers for ${kpi.name}`)
                }
                onShowEvidence={handleShowEvidence}
              />

              {/* 5. Recent Active Investigations */}
              {recentInvestigations.length > 0 && (
                <RecentInvestigations
                  nodes={recentInvestigations}
                  onContinueInvestigation={(node) => {
                    handleStartInvestigation(node.user_question);
                  }}
                  onNewInvestigation={() => {
                    handleStartInvestigation('Provide an executive summary of current business performance.');
                  }}
                />
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '100px 0' }}>
              No business health data loaded. Click "Connect Sheet" to connect your live dataset.
            </div>
          )}
        </main>
      )}

      {/* Driver Explanation Drawer ("Why this score?") */}
      {selectedDriverForExplanation && (
        <DriverExplanationDrawer
          driver={selectedDriverForExplanation}
          kpiDetails={dashboard?.kpis.find(k => k.kpi_id === selectedDriverForExplanation.kpi_id)}
          onClose={() => setSelectedDriverForExplanation(null)}
          onShowEvidence={handleShowEvidence}
          onInvestigate={(prompt) => {
            setSelectedDriverForExplanation(null);
            handleStartInvestigation(prompt);
          }}
        />
      )}

      {/* Dashboard Evidence Drawer */}
      {dashboardEvidenceNode && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 50,
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <EvidenceDrawer
            node={dashboardEvidenceNode}
            onClose={() => setDashboardEvidenceNode(null)}
          />
        </div>
      )}

      {/* Modals */}
      <ConnectSheetModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onConnectedSuccess={() => fetchDashboard()}
      />

      <ExecutiveReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        investigationId={activeInvestigationId}
      />

      {dashboard && (
        <>
          <ViewMoreDrawer
            isOpen={isViewMoreOpen}
            issues={dashboard.view_more_issues}
            onClose={() => setIsViewMoreOpen(false)}
            onInvestigateIssue={(issue) =>
              handleStartInvestigation(`Investigate root causes of ${issue.title}`)
            }
          />

          <KPICustomizerModal
            isOpen={isCustomizerOpen}
            activeKPIs={dashboard.kpis}
            catalog={dashboard.available_kpi_catalog}
            onClose={() => setIsCustomizerOpen(false)}
            onSaveTarget={handleSaveKPITarget}
          />
        </>
      )}

      {/* Voice Investigation Command Waveform Overlay */}
      <VoiceWaveformOverlay
        isActive={isVoiceOverlayActive}
        transcriptText={voiceCaption}
        onClose={() => setIsVoiceOverlayActive(false)}
      />
    </div>
  );
};

export default App;
