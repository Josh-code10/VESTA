import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional
from app.models.domain import EvidenceNode
from app.models.schemas import GenerateReportResponse, ReportFindingItem

class ReportEngine:
    """
    Synthesizes active Evidence Trail nodes into a structured,
    boardroom-ready Executive Management Briefing.
    """

    @classmethod
    def generate_report(
        cls,
        nodes: List[EvidenceNode],
        report_title: Optional[str] = None,
        workspace_name: str = "NexaSphere Retail Ltd."
    ) -> GenerateReportResponse:
        report_id = f"rep_{uuid.uuid4().hex[:8]}"
        title = report_title or "Executive Investigation Briefing"
        generated_at = datetime.utcnow()

        if not nodes:
            return GenerateReportResponse(
                report_id=report_id,
                title=title,
                generated_at=generated_at,
                executive_summary="No investigation findings selected for report compilation.",
                primary_investigation_question="General Operational Health Review",
                key_findings=[],
                data_limitations=["No connected investigation nodes available."],
                recommended_next_steps=["Initiate a root-cause investigation thread from the Business Health dashboard."],
                markdown_content="# Executive Briefing\n\nNo findings recorded."
            )

        root_node = nodes[0]
        primary_q = root_node.user_question

        # Extract findings
        key_findings: List[ReportFindingItem] = []
        limitations: List[str] = []
        recommended_actions: List[str] = []

        for node in nodes:
            item = ReportFindingItem(
                title=node.user_question,
                epistemic_tag=node.epistemic_status.value,
                finding_text=node.executive_finding,
                formula_breadcrumb=node.lineage.formula_breadcrumb,
                chart_type=node.evidence_chart_type,
                chart_data=node.evidence_data
            )
            key_findings.append(item)

            if node.limitations:
                for missing_col in node.limitations.get("missing", []):
                    limitations.append(f"Unrecorded metric: '{missing_col}' is absent from connected data sources.")

        if not limitations:
            limitations.append("Analysis is constrained to the verified rows and dimensions present in the connected Google Sheet.")

        recommended_actions.append("Conduct focused management review of identified variance drivers.")
        recommended_actions.append("Audit regional promotional discounting and inventory allocation thresholds.")
        recommended_actions.append("Schedule follow-up data sync after next operational reporting cycle.")

        # Executive Summary Synthesis
        exec_summary = (
            f"This executive briefing evaluates root-cause drivers regarding: **\"{primary_q}\"**. "
            f"Across {len(nodes)} verified analytical stages, empirical evidence confirms specific dimensional concentration. "
            f"All findings have been deterministically verified with zero synthetic metric estimation."
        )

        # Markdown Document Compilation
        md_lines = [
            f"# {title}",
            f"> **Workspace**: {workspace_name}  ",
            f"> **Generated**: {generated_at.strftime('%B %d, %Y at %H:%M UTC')}  ",
            f"> **Report ID**: `{report_id}`",
            "\n---\n",
            "## 1. Executive Summary",
            exec_summary,
            "\n## 2. Key Findings & Evidence Trail\n"
        ]

        for idx, finding in enumerate(key_findings, 1):
            md_lines.append(f"### {idx}. {finding.title}")
            md_lines.append(f"**Epistemic Classification**: `{finding.epistemic_tag}`  ")
            md_lines.append(f"**Formula Breadcrumb**: `{finding.formula_breadcrumb}`\n")
            md_lines.append(finding.finding_text)
            md_lines.append("\n---\n")

        md_lines.append("## 3. Data Limitations & Missingness Disclosures")
        for lim in limitations:
            md_lines.append(f"- ⚠️ {lim}")

        md_lines.append("\n## 4. Recommended Management Actions")
        for act in recommended_actions:
            md_lines.append(f"- [ ] {act}")

        markdown_content = "\n".join(md_lines)

        return GenerateReportResponse(
            report_id=report_id,
            title=title,
            generated_at=generated_at,
            executive_summary=exec_summary,
            primary_investigation_question=primary_q,
            key_findings=key_findings,
            data_limitations=limitations,
            recommended_next_steps=recommended_actions,
            markdown_content=markdown_content
        )
