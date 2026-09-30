from typing import Dict, Optional, Tuple
from backend.models import WorkflowResponse

# In-memory workflow state repository
_WORKFLOW_STORE: Dict[str, WorkflowResponse] = {}

def save_workflow(workflow: WorkflowResponse) -> WorkflowResponse:
    _WORKFLOW_STORE[workflow.workflow_id] = workflow
    return workflow

def get_workflow(workflow_id: str) -> Optional[WorkflowResponse]:
    return _WORKFLOW_STORE.get(workflow_id)

def approve_workflow(workflow_id: str) -> Tuple[bool, Optional[WorkflowResponse], str]:
    workflow = _WORKFLOW_STORE.get(workflow_id)
    if not workflow:
        return False, None, f"Workflow ID '{workflow_id}' not found."

    if workflow.status == "REJECTED":
        return False, None, "Cannot approve a cancelled workflow. Please re-synthesize."

    workflow.status = "APPROVED"
    _WORKFLOW_STORE[workflow_id] = workflow
    return True, workflow, "Workflow successfully APPROVED by user."

def reject_workflow(workflow_id: str) -> Tuple[bool, Optional[WorkflowResponse], str]:
    workflow = _WORKFLOW_STORE.get(workflow_id)
    if not workflow:
        return False, None, f"Workflow ID '{workflow_id}' not found."

    workflow.status = "REJECTED"
    _WORKFLOW_STORE[workflow_id] = workflow
    return True, workflow, "Workflow CANCELLED by user."

def mark_simulated(workflow_id: str) -> Optional[WorkflowResponse]:
    workflow = _WORKFLOW_STORE.get(workflow_id)
    if workflow:
        workflow.status = "SIMULATED"
        _WORKFLOW_STORE[workflow_id] = workflow
    return workflow
