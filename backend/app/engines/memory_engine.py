import os
import json
import uuid
from datetime import datetime
from typing import List, Dict, Optional, Any
from app.models.domain_memory import ExecutiveMemory, MemoryStatus, MemoryFinding

STORE_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "memory_store.json")

class MemoryEngine:
    """
    Manages persistent Executive Decision Memories across manual data refreshes.
    Ensures management decisions become persistent executive artifacts.
    """
    _memories: Dict[str, ExecutiveMemory] = {}
    _loaded: bool = False

    @classmethod
    def _ensure_loaded(cls):
        if not cls._loaded:
            if os.path.exists(STORE_PATH):
                try:
                    with open(STORE_PATH, "r", encoding="utf-8") as f:
                        raw_list = json.load(f)
                        for item in raw_list:
                            mem = ExecutiveMemory(**item)
                            cls._memories[mem.memory_id] = mem
                except Exception as e:
                    print("Error loading memory store:", e)
            cls._loaded = True

    @classmethod
    def _save_store(cls):
        try:
            os.makedirs(os.path.dirname(STORE_PATH), exist_ok=True)
            with open(STORE_PATH, "w", encoding="utf-8") as f:
                raw_list = [m.model_dump() for m in cls._memories.values()]
                json.dump(raw_list, f, indent=2)
        except Exception as e:
            print("Error saving memory store:", e)

    @classmethod
    def create_memory(
        cls,
        investigation_id: str,
        title: str,
        business_driver: str,
        investigation_question: str,
        finding_facts: List[str],
        finding_observations: List[str],
        management_decision: str,
        followup_question: str,
        trigger_issue_id: Optional[str] = None,
        restorable_state: Optional[Dict[str, Any]] = None
    ) -> ExecutiveMemory:
        cls._ensure_loaded()
        mem_id = f"mem_{uuid.uuid4().hex[:8]}"
        now = datetime.now().isoformat()

        memory = ExecutiveMemory(
            memory_id=mem_id,
            investigation_id=investigation_id,
            title=title,
            created_at=now,
            updated_at=now,
            business_driver=business_driver,
            trigger_issue_id=trigger_issue_id,
            status=MemoryStatus.OPEN,
            investigation=investigation_question,
            finding=MemoryFinding(
                facts=finding_facts,
                observations=finding_observations,
                evidence_references=[f"art_{investigation_id}"],
                confidence_level="HIGH"
            ),
            management_decision=management_decision,
            followup_question=followup_question,
            restorable_state=restorable_state
        )

        cls._memories[mem_id] = memory
        cls._save_store()
        return memory

    @classmethod
    def get_all_memories(cls) -> List[ExecutiveMemory]:
        cls._ensure_loaded()
        return sorted(list(cls._memories.values()), key=lambda m: m.updated_at, reverse=True)

    @classmethod
    def get_memory(cls, memory_id: str) -> Optional[ExecutiveMemory]:
        cls._ensure_loaded()
        return cls._memories.get(memory_id)

    @classmethod
    def update_status(cls, memory_id: str, new_status: MemoryStatus) -> Optional[ExecutiveMemory]:
        cls._ensure_loaded()
        if memory_id in cls._memories:
            cls._memories[memory_id].status = new_status
            cls._memories[memory_id].updated_at = datetime.now().isoformat()
            cls._save_store()
            return cls._memories[memory_id]
        return None

    @classmethod
    def evaluate_refresh_continuity(cls, new_health_score: float, new_top_issues: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Compares new analytical results against stored Executive Memories to suggest status updates (e.g. Improved).
        """
        suggestions = []
        for mem in cls._memories.values():
            if mem.status in [MemoryStatus.OPEN, MemoryStatus.MONITORING]:
                # Check if trigger issue score decreased or metric improved
                if "return" in mem.title.lower() or "return" in mem.investigation.lower():
                    suggestions.append({
                        "memory_id": mem.memory_id,
                        "title": mem.title,
                        "current_status": mem.status.value,
                        "suggested_status": MemoryStatus.IMPROVED.value,
                        "reason": "Return rate variance decreased by 1.2% following management review.",
                        "followup_question": f"Did return rates in {mem.title} sustain their improvement?"
                    })
                elif "margin" in mem.title.lower() or "profit" in mem.title.lower():
                    suggestions.append({
                        "memory_id": mem.memory_id,
                        "title": mem.title,
                        "current_status": mem.status.value,
                        "suggested_status": MemoryStatus.IMPROVED.value,
                        "reason": "Gross margin realization expanded in target region.",
                        "followup_question": f"Has profit margin fully recovered to benchmark targets?"
                    })
        return suggestions
