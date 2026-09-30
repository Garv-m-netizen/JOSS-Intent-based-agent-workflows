from fastapi import APIRouter, HTTPException, status
from backend.models import IntentRequest, WorkflowResponse, WorkflowStateRequest, SimulationResponse
from backend.services.llm_service import synthesize_intent_with_gemini
from backend.services.validator import validate_workflow_safety
from backend.services.state_manager import save_workflow, get_workflow, approve_workflow, reject_workflow
from backend.services.simulation_engine import execute_simulation_engine

router = APIRouter(prefix="/api/workflow", tags=["workflow"])

@router.post("/synthesize", response_model=WorkflowResponse)
async def synthesize_workflow(request: IntentRequest):
    """
    Synthesizes user intent via Gemini LLM (with fallback).
    Applies backend safety validation layer.
    Saves state as GENERATED.
    """
    if not request.prompt or not request.prompt.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt text cannot be empty. Please describe what you want to automate."
        )

    # 1. LLM Synthesis
    workflow = await synthesize_intent_with_gemini(request.prompt)

    # 2. Safety Validation Layer
    is_valid, validation_msg = validate_workflow_safety(workflow)
    if not is_valid:
        workflow.validation_error = validation_msg
        # Store even if invalid so user can inspect error reason
        save_workflow(workflow)
        return workflow

    # 3. Save to State Manager
    save_workflow(workflow)
    return workflow

@router.post("/approve", response_model=WorkflowResponse)
async def approve_workflow_endpoint(request: WorkflowStateRequest):
    """
    Explicitly approves a generated workflow by workflow_id.
    Transitions status to APPROVED.
    """
    success, wf, msg = approve_workflow(request.workflow_id)
    if not success or not wf:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=msg)
    return wf

@router.post("/reject", response_model=WorkflowResponse)
async def reject_workflow_endpoint(request: WorkflowStateRequest):
    """
    Cancels/rejects a workflow by workflow_id.
    Transitions status to REJECTED.
    """
    success, wf, msg = reject_workflow(request.workflow_id)
    if not success or not wf:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=msg)
    return wf

@router.post("/simulate", response_model=SimulationResponse)
async def simulate_workflow_endpoint(request: WorkflowStateRequest):
    """
    Runs simulation mode for an APPROVED workflow step-by-step.
    Fails if workflow is not in APPROVED state.
    """
    success, response, msg = execute_simulation_engine(request.workflow_id)
    if not success or not response:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=msg)
    return response

@router.get("/{workflow_id}", response_model=WorkflowResponse)
async def get_workflow_endpoint(workflow_id: str):
    """
    Returns workflow details and current state.
    """
    wf = get_workflow(workflow_id)
    if not wf:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Workflow '{workflow_id}' not found.")
    return wf
