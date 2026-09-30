from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class IntentRequest(BaseModel):
    prompt: str = Field(..., description="User natural language intent string")

class NodeModel(BaseModel):
    id: str
    stepNumber: int
    title: str
    type: str  # trigger | generate | transform | verify | action
    icon: str
    summary: str
    description: str
    status: str = "idle"
    details: Dict[str, Any] = Field(default_factory=dict)

class WorkflowResponse(BaseModel):
    workflow_id: str
    rawPrompt: str
    taskTitle: str
    audience: str
    channel: str
    schedule: str
    assetType: str
    explanation: str
    architecture: str
    parameters: Dict[str, Any] = Field(default_factory=dict)
    is_supported: bool = True
    unsupported_reason: Optional[str] = None
    status: str = "GENERATED"  # GENERATED | APPROVED | REJECTED | SIMULATED
    nodes: List[NodeModel]
    validation_error: Optional[str] = None

class WorkflowStateRequest(BaseModel):
    workflow_id: str

class SimulationStepResult(BaseModel):
    step_id: str
    step_number: int
    title: str
    status: str
    message: str
    timestamp: str

class SimulationResponse(BaseModel):
    workflow_id: str
    status: str
    steps: List[SimulationStepResult]
    summary: Dict[str, Any]
