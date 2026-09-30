/**
 * Joss Natural Language Intent Parser & Workflow Synthesizer
 * Dynamic heuristic & structural parser that breaks any natural language request
 * into a structured, verifiable agent workflow.
 */

export function parseUserIntent(promptText) {
  const text = promptText.trim();
  const lower = text.toLowerCase();

  // 1. Detect target entity / audience
  let audience = 'Class 10 Students';
  if (lower.includes('class 10') || lower.includes('grade 10') || lower.includes('10th')) {
    audience = 'Class 10th Section A & B Students';
  } else if (lower.includes('parent')) {
    audience = 'Parents & Guardians';
  } else if (lower.includes('lead') || lower.includes('sales')) {
    audience = 'Qualified Sales Prospects';
  } else if (lower.includes('team') || lower.includes('staff')) {
    audience = 'Internal Team Members';
  }

  // 2. Detect channel / destination
  let channel = 'Telegram Group (@class10_announcements)';
  let channelType = 'Telegram';
  let channelIcon = 'Send';

  if (lower.includes('telegram')) {
    channel = lower.includes('chat') ? 'Telegram Chat Group (@class10_announcements)' : 'Telegram Broadcast Channel (@class10_official)';
    channelType = 'Telegram';
    channelIcon = 'Send';
  } else if (lower.includes('whatsapp')) {
    channel = 'WhatsApp Class Broadcast Group';
    channelType = 'WhatsApp';
    channelIcon = 'MessageSquare';
  } else if (lower.includes('slack')) {
    channel = 'Slack #announcements Channel';
    channelType = 'Slack';
    channelIcon = 'Slack';
  } else if (lower.includes('email') || lower.includes('mail')) {
    channel = 'Student & Parent Email Addresses';
    channelType = 'Email';
    channelIcon = 'Mail';
  }

  // 3. Detect schedule / timing
  let schedule = 'Immediate Execution';
  if (lower.includes('tomorrow')) {
    schedule = 'Scheduled for Tomorrow at 09:00 AM (Auto-Timer)';
  } else if (lower.includes('next week') || lower.includes('monday')) {
    schedule = 'Scheduled for Next Monday at 08:00 AM';
  } else if (lower.includes('schedule')) {
    schedule = 'Scheduled Batch Dispatch';
  }

  // 4. Detect core task action (Assignment, Report Cards, Quiz, Notice, Invoice, Lead)
  let taskTitle = 'Assignment Creation & Notification';
  let assetType = 'Class Assignment & Instructions PDF';

  if (lower.includes('assignment') || lower.includes('homework')) {
    taskTitle = 'Class Assignment Dispatch';
    assetType = 'Class 10 Homework & Practice Sheet PDF';
  } else if (lower.includes('report card') || lower.includes('mark')) {
    taskTitle = 'Student Report Card Generation';
    assetType = 'Official Term Assessment PDF Report Card';
  } else if (lower.includes('invoice') || lower.includes('bill')) {
    taskTitle = 'Invoice Processing & Sync';
    assetType = 'Extracted Invoice Metadata Sheet';
  } else if (lower.includes('quiz') || lower.includes('test')) {
    taskTitle = 'Online Assessment / Quiz Alert';
    assetType = 'Interactive Quiz Link & Study Instructions';
  }

  // 5. Construct Structured Step Nodes
  const nodes = [
    {
      id: 'step_1',
      stepNumber: 1,
      title: 'Intent & Target Audience Extractor',
      type: 'trigger',
      icon: 'Zap',
      summary: `Resolves intent for target audience: ${audience}`,
      description: `Validates prompt intent, identifies recipient list (${audience}), and configures trigger conditions.`,
      status: 'idle',
      details: {
        audienceTarget: audience,
        scheduleTiming: schedule,
        validationStatus: 'Verified Valid Intent'
      }
    },
    {
      id: 'step_2',
      stepNumber: 2,
      title: `Draft & Generate Content (${assetType.split(' ')[0]})`,
      type: 'generate',
      icon: 'Sparkles',
      summary: `Synthesizes asset content: ${assetType}`,
      description: `Generates learning materials, assignment guidelines, and formatted metadata for ${audience}.`,
      status: 'idle',
      details: {
        assetName: assetType,
        format: 'PDF Document + Plain Text Announcement',
        previewSnippet: `Class 10 Assignment Notice: Please find attached homework exercises due by Friday.`
      }
    },
    {
      id: 'step_3',
      stepNumber: 3,
      title: `Channel Message Formatting (${channelType})`,
      type: 'transform',
      icon: 'MessageSquare',
      summary: `Formats message layout for ${channel}`,
      description: `Applies markdown styling, call-to-action buttons, and file attachment payloads tailored for ${channelType}.`,
      status: 'idle',
      details: {
        targetChannel: channel,
        messageFormat: `🚨 *Assignment Notice for ${audience}*\n📅 *Due Date:* Tomorrow at 5:00 PM\n📎 *Attachment:* Class10_Assignment_Oct2026.pdf`
      }
    },
    {
      id: 'step_4',
      stepNumber: 4,
      title: 'Human Review & Approval Gateway',
      type: 'verify',
      icon: 'ShieldAlert',
      summary: 'Mandatory approval required before sending',
      description: 'Pauses workflow execution until the user inspects and explicitly approves the generated preview.',
      status: 'idle',
      details: {
        approvalStatus: 'Pending User Approval',
        enforceApproval: true,
        approver: 'Teacher / Account Administrator'
      }
    },
    {
      id: 'step_5',
      stepNumber: 5,
      title: `Dispatch to ${channelType} Group`,
      type: 'action',
      icon: 'Send',
      summary: `Executes broadcast to ${channel}`,
      description: `Dispatches final assignment package and message broadcast to ${channel} according to schedule: ${schedule}.`,
      status: 'idle',
      details: {
        destination: channel,
        scheduleMode: schedule,
        mockResult: 'Simulated API Success 200 OK'
      }
    }
  ];

  return {
    rawPrompt: text,
    taskTitle,
    audience,
    channel,
    schedule,
    assetType,
    nodes
  };
}
