import datetime
from typing import Tuple, Optional
from backend.models import WorkflowResponse, SimulationResponse, SimulationStepResult
from backend.services.state_manager import get_workflow, mark_simulated

def execute_simulation_engine(workflow_id: str) -> Tuple[bool, Optional[SimulationResponse], str]:
    """
    Backend Simulation Engine.
    Validates that the workflow is explicitly in APPROVED state.
    Executes each step sequentially in simulation mode without making real external API calls.
    """
    workflow = get_workflow(workflow_id)
    if not workflow:
        return False, None, f"Workflow ID '{workflow_id}' not found."

    if workflow.status != "APPROVED":
        return False, None, f"Execution Blocked: Workflow status is '{workflow.status}'. Workflow must be explicitly APPROVED by user before simulation can run."

    step_results = []
    for node in workflow.nodes:
        timestamp = datetime.datetime.now().strftime("%H:%M:%S")
        
        if node.type == "trigger":
            msg = f"Audience Extractor validated: {workflow.audience}"
        elif node.type == "generate":
            msg = f"Asset Generator created mock file: {workflow.assetType}"
        elif node.type == "transform":
            msg = f"Channel Formatter rendered markup payload for {workflow.channel}"
        elif node.type == "verify":
            msg = "Human Approval Gateway verified consent record"
        elif node.type == "action":
            msg = f"Mock Dispatch broadcasted to {workflow.channel} ({workflow.schedule})"
        else:
            msg = f"Step '{node.title}' executed successfully in sandbox"

        step_results.append(SimulationStepResult(
            step_id=node.id,
            step_number=node.stepNumber,
            title=node.title,
            status="SUCCESS",
            message=msg,
            timestamp=timestamp
        ))

    # Mark state as SIMULATED
    mark_simulated(workflow_id)

    summary = {
        "actionExecuted": f"Simulated creation of {workflow.assetType}",
        "targetChannel": workflow.channel,
        "dispatchTime": workflow.schedule,
        "totalStepsExecuted": len(step_results),
        "executionMode": "Safe Backend Sandbox Simulation"
    }

    response = SimulationResponse(
        workflow_id=workflow_id,
        status="SIMULATED",
        steps=step_results,
        summary=summary
    )

    return True, response, "Simulation mode completed successfully."
