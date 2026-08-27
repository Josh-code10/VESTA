import type {
  DataDictionary,
  EvidenceNode,
  GenerateReportResponse,
  HealthDashboardResponse,
  InvestigateQueryResponse,
  SyncStatus
} from '../types/api';

export const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');
export const API_BASE_URL = `${API_ORIGIN}/api/v1`;

export async function connectSheet(sheetUrl?: string): Promise<{ status: string; data_dictionary: DataDictionary }> {
  const response = await fetch(`${API_BASE_URL}/data-source/connect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sheet_url: sheetUrl })
  });
  if (!response.ok) {
    throw new Error(`Failed to connect data source: ${response.statusText}`);
  }
  return response.json();
}

export async function refreshDataSource(): Promise<{ status: string; sync_status: SyncStatus; last_synced_at: string }> {
  const response = await fetch(`${API_BASE_URL}/data-source/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) {
    throw new Error(`Failed to refresh data: ${response.statusText}`);
  }
  return response.json();
}

export async function getDataDictionary(): Promise<DataDictionary> {
  const response = await fetch(`${API_BASE_URL}/data-source/dictionary`);
  if (!response.ok) {
    throw new Error(`Failed to fetch data dictionary: ${response.statusText}`);
  }
  return response.json();
}

export async function getHealthDashboard(): Promise<HealthDashboardResponse> {
  const response = await fetch(`${API_BASE_URL}/health/dashboard`);
  if (!response.ok) {
    throw new Error(`Failed to fetch health dashboard: ${response.statusText}`);
  }
  return response.json();
}

export async function updateKPIConfig(kpiId: string, targetValue?: number): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE_URL}/health/kpi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kpi_id: kpiId, target_value: targetValue })
  });
  if (!response.ok) {
    throw new Error(`Failed to update KPI: ${response.statusText}`);
  }
  return response.json();
}

export async function submitInvestigationQuery(
  question: string,
  investigationId?: string,
  parentNodeId?: string
): Promise<InvestigateQueryResponse> {
  const response = await fetch(`${API_BASE_URL}/investigate/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question,
      investigation_id: investigationId,
      parent_node_id: parentNodeId
    })
  });
  if (!response.ok) {
    throw new Error(`Failed to submit query: ${response.statusText}`);
  }
  return response.json();
}

export async function getInvestigationTree(investigationId?: string): Promise<{ nodes: EvidenceNode[] }> {
  const url = investigationId
    ? `${API_BASE_URL}/investigate/tree?investigation_id=${investigationId}`
    : `${API_BASE_URL}/investigate/tree`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch tree: ${response.statusText}`);
  }
  return response.json();
}

export async function generateExecutiveReport(
  investigationId: string,
  reportTitle?: string,
  selectedNodeIds?: string[]
): Promise<GenerateReportResponse> {
  const response = await fetch(`${API_BASE_URL}/reports/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      investigation_id: investigationId,
      report_title: reportTitle,
      selected_node_ids: selectedNodeIds
    })
  });
  if (!response.ok) {
    throw new Error(`Failed to generate report: ${response.statusText}`);
  }
  return response.json();
}

export async function createMemory(payload: {
  investigation_id: string;
  title: string;
  business_driver?: string;
  trigger_issue_id?: string;
  finding_summary?: string;
  management_decision?: string;
  status?: string;
}): Promise<{ status: string; memory_id: string }> {
  const response = await fetch(`${API_BASE_URL}/memory/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error(`Failed to save decision memory: ${response.statusText}`);
  }
  return response.json();
}
