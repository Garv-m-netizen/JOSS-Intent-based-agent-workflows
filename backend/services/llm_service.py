import os
import json
import uuid
import logging
from typing import Dict, Any
from dotenv import load_dotenv
from backend.models import WorkflowResponse, NodeModel

# Load environment variables from .env
load_dotenv()

logger = logging.getLogger("joss.llm_service")

SUPPORTED_DOMAINS = [
    "assignment",
    "reminder",
    "notification",
    "task",
    "report card",
    "homework",
    "quiz",
    "schedule",
    "announce",
    "alert"
]

def is_intent_supported(prompt_text: str) -> tuple[bool, str]:
    """
    Validates whether the user's intent falls within Joss's supported automation scope:
    - Creating an assignment / homework
    - Scheduling a reminder
    - Sending a notification / announcement
    - Creating tasks / todo items
    """
    lower = prompt_text.lower()
    
    # Check for explicitly unsupported / high-risk operations
    unsupported_keywords = ["hack", "stock", "trade", "crypto", "bank", "passport", "illegal", "exploit", "weapon", "rocket"]
    for word in unsupported_keywords:
        if word in lower:
            return False, f"Request contains unsupported operation ('{word}'). Joss currently supports creating assignments, scheduling reminders, sending notifications, and task management."

    # Check if intent matches any supported domain
    matched = any(domain in lower for domain in SUPPORTED_DOMAINS)
    if not matched:
        return False, "This request is outside Joss's supported automation scope. Joss currently supports: 1) Creating assignments, 2) Scheduling reminders, 3) Sending notifications, and 4) Creating tasks."
    
    return True, ""

def parse_intent_fallback(prompt_text: str, is_supported: bool, unsupported_reason: str) -> WorkflowResponse:
    """
    Deterministic LLM schema synthesizer fallback when Gemini API key is missing or API call fails.
    Produces identical predictable JSON structure.
    """
    workflow_id = f"wf-{uuid.uuid4().hex[:8]}"
    text = prompt_text.strip()
    lower = text.lower()

    if not is_supported:
        return WorkflowResponse(
            workflow_id=workflow_id,
            rawPrompt=text,
            taskTitle="Unsupported Intent",
            audience="None",
            channel="None",
            schedule="None",
            assetType="None",
            explanation=unsupported_reason,
            architecture="Unsupported Request Handler",
            parameters={},
            is_supported=False,
            unsupported_reason=unsupported_reason,
            status="GENERATED",
            nodes=[],
            validation_error=unsupported_reason
        )

    # 1. Target Audience
    audience = "Class 10 Students"
    if "class 10" in lower or "grade 10" in lower or "10th" in lower:
        audience = "Class 10th Section A & B Students"
    elif "reminder" in lower:
        audience = "Registered Course Attendees"
    elif "task" in lower:
        audience = "Assigned Team Members"
    elif "parent" in lower:
        audience = "Parents & Guardians"

    # 2. Delivery Channel
    channel = "Telegram Group (@class10_announcements)"
    if "telegram" in lower:
        channel = "Telegram Group (@class10_announcements)"
    elif "slack" in lower:
        channel = "Slack #announcements Channel"
    elif "whatsapp" in lower:
        channel = "WhatsApp Broadcast Group"
    elif "email" in lower or "mail" in lower:
        channel = "Student & Parent Email Addresses"

    # 3. Schedule
    schedule = "Immediate Execution"
    if "tomorrow" in lower:
        schedule = "Scheduled for Tomorrow at 09:00 AM"
    elif "reminder" in lower:
        schedule = "Scheduled Automated Reminder"
    elif "schedule" in lower:
        schedule = "Scheduled Dispatch"

    # 4. Task & Asset Type
    task_title = "Assignment Creation & Notification"
    asset_type = "Class 10 Homework & Practice Sheet PDF"

    if "assignment" in lower or "homework" in lower:
        task_title = "Class Assignment Dispatch"
        asset_type = "Class 10 Homework & Practice Sheet PDF"
    elif "reminder" in lower:
        task_title = "Automated Event Reminder"
        asset_type = "Event Reminder Notice & Alert Payload"
    elif "task" in lower:
        task_title = "Team Task Creation & Assignment"
        asset_type = "Structured Task List & Checklist Item"
    elif "notification" in lower or "announce" in lower:
        task_title = "Broadcast Notification Dispatch"
        asset_type = "Formatted Group Announcement Message"

    nodes = [
        NodeModel(
            id="step_1",
            stepNumber=1,
            title="Intent & Target Audience Extractor",
            type="trigger",
            icon="Zap",
            summary=f"Audience: {audience}",
            description=f"Validates request intent and identifies recipient audience ({audience}).",
            status="idle",
            details={"audienceTarget": audience, "scheduleTiming": schedule}
        ),
        NodeModel(
            id="step_2",
            stepNumber=2,
            title=f"Draft & Generate Asset ({asset_type.split()[0]})",
            type="generate",
            icon="Sparkles",
            summary=f"Asset: {asset_type}",
            description=f"Synthesizes structured content and materials for {audience}.",
            status="idle",
            details={"assetName": asset_type, "format": "PDF Document & Plain Text"}
        ),
        NodeModel(
            id="step_3",
            stepNumber=3,
            title=f"Channel Payload Formatter ({channel.split()[0]})",
            type="transform",
            icon="MessageSquare",
            summary=f"Formatted for {channel}",
            description=f"Applies markup styling, attachments, and call-to-action buttons for {channel}.",
            status="idle",
            details={"targetChannel": channel}
        ),
        NodeModel(
            id="step_4",
            stepNumber=4,
            title="Human Review & Approval Gateway",
            type="verify",
            icon="ShieldAlert",
            summary="Mandatory approval required",
            description="Pauses execution until the user explicitly reviews and approves the preview.",
            status="idle",
            details={"approvalStatus": "Pending Approval", "enforceApproval": True}
        ),
        NodeModel(
            id="step_5",
            stepNumber=5,
            title=f"Dispatch Action ({channel.split()[0]})",
            type="action",
            icon="Send",
            summary=f"Broadcast to {channel}",
            description=f"Dispatches final payload to {channel} according to schedule: {schedule}.",
            status="idle",
            details={"destination": channel, "scheduleMode": schedule}
        )
    ]

    explanation = f"Joss will generate the {asset_type} for {audience}, format the payload for {channel}, pause for your explicit review & approval, and then schedule dispatch for {schedule}."

    return WorkflowResponse(
        workflow_id=workflow_id,
        rawPrompt=text,
        taskTitle=task_title,
        audience=audience,
        channel=channel,
        schedule=schedule,
        assetType=asset_type,
        explanation=explanation,
        architecture="Standard 5-Node Agent Pipeline with Approval Gateway",
        parameters={
            "audience": audience,
            "channel": channel,
            "schedule": schedule,
            "assetType": asset_type
        },
        is_supported=True,
        unsupported_reason=None,
        status="GENERATED",
        nodes=nodes,
        validation_error=None
    )

async def synthesize_intent_with_gemini(prompt_text: str) -> WorkflowResponse:
    """
    Synthesizes user natural language intent using Gemini API (via google-genai SDK).
    Falls back gracefully if key is missing or request fails.
    """
    is_supported, unsupported_reason = is_intent_supported(prompt_text)
    if not is_supported:
        return parse_intent_fallback(prompt_text, is_supported=False, unsupported_reason=unsupported_reason)

    api_key = os.getenv("GEMINI_API_KEY", "").strip()

    # If key is placeholder or missing, use robust LLM schema synthesizer fallback
    if not api_key or api_key == "your_gemini_api_key_here":
        logger.info("GEMINI_API_KEY is not set or placeholder. Using backend LLM schema parser fallback.")
        return parse_intent_fallback(prompt_text, is_supported=True, unsupported_reason="")

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        system_instruction = """
You are Joss, an intent-driven agent workflow synthesizer.
Your task is to analyze user natural language automation requests and output a predictable JSON matching this exact structure:

{
  "taskTitle": "Short Title of Automation Task",
  "audience": "Target Audience or Recipients",
  "channel": "Output Channel (Telegram, Slack, Email, WhatsApp)",
  "schedule": "Schedule Mode (Immediate, Tomorrow 9 AM, Weekly)",
  "assetType": "Generated Asset Type (PDF, Message, Checklist)",
  "explanation": "Clear 2-sentence user explanation of what will happen",
  "architecture": "Architecture Description",
  "parameters": {
    "audience": "...",
    "channel": "...",
    "schedule": "...",
    "assetType": "..."
  },
  "is_supported": true,
  "nodes": [
    {
      "id": "step_1",
      "stepNumber": 1,
      "title": "Intent & Target Extractor",
      "type": "trigger",
      "icon": "Zap",
      "summary": "Target Audience",
      "description": "Validation description",
      "status": "idle"
    },
    {
      "id": "step_2",
      "stepNumber": 2,
      "title": "Draft Asset",
      "type": "generate",
      "icon": "Sparkles",
      "summary": "Asset description",
      "description": "Content generation description",
      "status": "idle"
    },
    {
      "id": "step_3",
      "stepNumber": 3,
      "title": "Message Formatter",
      "type": "transform",
      "icon": "MessageSquare",
      "summary": "Formatted message",
      "description": "Payload formatting description",
      "status": "idle"
    },
    {
      "id": "step_4",
      "stepNumber": 4,
      "title": "Human Review & Approval Gateway",
      "type": "verify",
      "icon": "ShieldAlert",
      "summary": "Mandatory approval required",
      "description": "Pauses workflow until user approves",
      "status": "idle"
    },
    {
      "id": "step_5",
      "stepNumber": 5,
      "title": "Dispatch Action",
      "type": "action",
      "icon": "Send",
      "summary": "Broadcast dispatch",
      "description": "Sends payload to channel",
      "status": "idle"
    }
  ]
}

Supported domains: 1) Creating an assignment, 2) Scheduling a reminder, 3) Sending a notification, 4) Creating tasks.
If user asks for something unsupported or malicious, set is_supported: false and provide unsupported_reason.
Return ONLY valid JSON.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt_text,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                temperature=0.2
            )
        )

        data = json.loads(response.text)
        workflow_id = f"wf-{uuid.uuid4().hex[:8]}"

        raw_nodes = data.get("nodes", [])
        nodes = []
        for n in raw_nodes:
            nodes.append(NodeModel(
                id=n.get("id", f"step_{len(nodes)+1}"),
                stepNumber=n.get("stepNumber", len(nodes)+1),
                title=n.get("title", "Workflow Step"),
                type=n.get("type", "transform"),
                icon=n.get("icon", "Zap"),
                summary=n.get("summary", "Step Summary"),
                description=n.get("description", "Step Description"),
                status="idle",
                details=n.get("details", {})
            ))

        return WorkflowResponse(
            workflow_id=workflow_id,
            rawPrompt=prompt_text,
            taskTitle=data.get("taskTitle", "Synthesized Task"),
            audience=data.get("audience", "Target Recipients"),
            channel=data.get("channel", "Delivery Channel"),
            schedule=data.get("schedule", "Immediate Execution"),
            assetType=data.get("assetType", "Generated Asset"),
            explanation=data.get("explanation", "Workflow synthesized successfully."),
            architecture=data.get("architecture", "Standard Agent Architecture"),
            parameters=data.get("parameters", {}),
            is_supported=data.get("is_supported", True),
            unsupported_reason=data.get("unsupported_reason"),
            status="GENERATED",
            nodes=nodes,
            validation_error=None
        )

    except Exception as e:
        logger.error(f"Error calling Gemini API: {e}. Falling back to deterministic LLM schema parser.")
        return parse_intent_fallback(prompt_text, is_supported=True, unsupported_reason="")
