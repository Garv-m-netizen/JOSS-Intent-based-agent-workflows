from backend.models import WorkflowResponse, NodeModel

def parse_intent_to_workflow(prompt_text: str) -> WorkflowResponse:
    text = prompt_text.strip()
    lower = text.lower()

    # 1. Target Audience Identification
    audience = "Class 10 Students"
    if "class 10" in lower or "grade 10" in lower or "10th" in lower:
        audience = "Class 10th Section A & B Students"
    elif "parent" in lower:
        audience = "Parents & Guardians"
    elif "lead" in lower or "sales" in lower or "crm" in lower:
        audience = "Qualified Sales Prospects"
    elif "team" in lower or "staff" in lower:
        audience = "Internal Team Members"

    # 2. Channel Identification
    channel = "Telegram Group (@class10_announcements)"
    channel_type = "Telegram"

    if "telegram" in lower:
        channel = "Telegram Chat Group (@class10_announcements)" if "chat" in lower else "Telegram Broadcast (@class10_official)"
        channel_type = "Telegram"
    elif "whatsapp" in lower:
        channel = "WhatsApp Broadcast Group"
        channel_type = "WhatsApp"
    elif "slack" in lower:
        channel = "Slack #announcements Channel"
        channel_type = "Slack"
    elif "email" in lower or "mail" in lower:
        channel = "Student & Parent Email Addresses"
        channel_type = "Email"

    # 3. Schedule Identification
    schedule = "Immediate Execution"
    if "tomorrow" in lower:
        schedule = "Scheduled for Tomorrow at 09:00 AM"
    elif "next week" in lower or "monday" in lower:
        schedule = "Scheduled for Next Monday at 08:00 AM"
    elif "schedule" in lower:
        schedule = "Scheduled Batch Dispatch"

    # 4. Task & Asset Type
    task_title = "Assignment Creation & Notification"
    asset_type = "Class 10 Homework & Practice Sheet PDF"

    if "assignment" in lower or "homework" in lower:
        task_title = "Class Assignment Dispatch"
        asset_type = "Class 10 Homework & Practice Sheet PDF"
    elif "report card" in lower or "mark" in lower:
        task_title = "Student Report Card Generation"
        asset_type = "Official Term Assessment PDF Report Card"
    elif "invoice" in lower or "bill" in lower:
        task_title = "Invoice Processing & Sync"
        asset_type = "Extracted Invoice Metadata Sheet"
    elif "quiz" in lower or "test" in lower:
        task_title = "Online Assessment / Quiz Alert"
        asset_type = "Interactive Quiz Link & Study Guidelines"

    # 5. Modular Step Nodes Generation
    nodes = [
        NodeModel(
            id="step_1",
            stepNumber=1,
            title="Intent & Target Audience Extractor",
            type="trigger",
            icon="Zap",
            summary=f"Target Audience: {audience}",
            description=f"Validates request intent and identifies target recipient list ({audience}).",
            status="idle",
            details={
                "audienceTarget": audience,
                "scheduleTiming": schedule,
                "engine": "FastAPI Joss NLP Service"
            }
        ),
        NodeModel(
            id="step_2",
            stepNumber=2,
            title=f"Draft & Generate Asset ({asset_type.split()[0]})",
            type="generate",
            icon="Sparkles",
            summary=f"Synthesizes: {asset_type}",
            description=f"Generates educational materials and formatted content for {audience}.",
            status="idle",
            details={
                "assetName": asset_type,
                "format": "PDF Document + Text Payload"
            }
        ),
        NodeModel(
            id="step_3",
            stepNumber=3,
            title=f"Channel Message Formatter ({channel_type})",
            type="transform",
            icon="MessageSquare",
            summary=f"Formatted for {channel}",
            description=f"Applies markup styling, CTAs, and document attachment payloads for {channel_type}.",
            status="idle",
            details={
                "targetChannel": channel,
                "format": f"Formatted payload for {channel_type}"
            }
        ),
        NodeModel(
            id="step_4",
            stepNumber=4,
            title="Human Review & Approval Gateway",
            type="verify",
            icon="ShieldAlert",
            summary="Mandatory approval gate",
            description="Pauses workflow until the user explicitly reviews and approves execution.",
            status="idle",
            details={
                "approvalStatus": "Pending Approval",
                "enforceApproval": True
            }
        ),
        NodeModel(
            id="step_5",
            stepNumber=5,
            title=f"Dispatch Action ({channel_type})",
            type="action",
            icon="Send",
            summary=f"Broadcast to {channel}",
            description=f"Dispatches final payload to {channel} according to schedule: {schedule}.",
            status="idle",
            details={
                "destination": channel,
                "scheduleMode": schedule,
                "apiResponse": "FastAPI Simulated Dispatch 200 OK"
            }
        )
    ]

    return WorkflowResponse(
        rawPrompt=text,
        taskTitle=task_title,
        audience=audience,
        channel=channel,
        schedule=schedule,
        assetType=asset_type,
        nodes=nodes,
        status="pending"
    )
