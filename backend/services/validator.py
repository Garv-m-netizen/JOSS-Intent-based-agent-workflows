from backend.models import WorkflowResponse
from typing import Tuple

def validate_workflow_safety(workflow: WorkflowResponse) -> Tuple[bool, str]:
    """
    Backend Safety Validation Layer.
    Validates LLM-generated workflow structure before storing or sending to frontend.
    
    Guarantees:
    1. Rejects malformed or unsupported workflows.
    2. Checks required parameters (audience, channel, schedule).
    3. Enforces presence of a Human Approval Gateway (verify node).
    4. Never permits direct auto-execution (forces GENERATED status).
    """
    if not workflow.is_supported:
        return False, workflow.unsupported_reason or "Intent is outside Joss supported automation scope."

    # 1. Structure Validation
    if not workflow.nodes or len(workflow.nodes) == 0:
        return False, "Workflow is malformed: contains zero workflow steps."

    # 2. Parameter Validation
    missing_params = []
    if not workflow.audience or workflow.audience == "None":
        missing_params.append("Target Audience")
    if not workflow.channel or workflow.channel == "None":
        missing_params.append("Output Channel")
    if not workflow.schedule or workflow.schedule == "None":
        missing_params.append("Schedule Mode")

    if missing_params:
        return False, f"Missing required workflow parameters: {', '.join(missing_params)}."

    # 3. Human Approval Gate Enforcement
    has_approval_gate = any(node.type == "verify" for node in workflow.nodes)
    if not has_approval_gate:
        return False, "Safety Violation: Workflow lacks mandatory Human Approval Gateway node."

    # 4. Strict Non-Auto-Execution Protection
    if workflow.status != "GENERATED":
        return False, "Safety Violation: Newly synthesized workflow cannot be initialized in an auto-executed state."

    return True, "Workflow passed all safety and parameter validation checks."
