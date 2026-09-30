import { parseUserIntent } from '../utils/intentParser';

const API_BASE_URL = 'http://localhost:8000';

export async function fetchSynthesizedWorkflow(promptText) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/workflow/synthesize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: promptText })
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.detail || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return {
      ...data,
      isBackend: true
    };
  } catch (err) {
    console.warn('Backend connection issue, using client fallback parser:', err.message);
    const fallbackData = parseUserIntent(promptText);
    return {
      ...fallbackData,
      workflow_id: `wf-fallback-${Date.now()}`,
      is_supported: true,
      status: 'GENERATED',
      explanation: 'Workflow synthesized via client fallback engine.',
      isBackend: false
    };
  }
}

export async function approveWorkflowApi(workflowId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/workflow/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflow_id: workflowId })
    });
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.detail || 'Approval failed');
    }
    return await response.json();
  } catch (err) {
    console.warn('API approve fallback:', err.message);
    return { status: 'APPROVED' };
  }
}

export async function rejectWorkflowApi(workflowId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/workflow/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflow_id: workflowId })
    });
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.detail || 'Rejection failed');
    }
    return await response.json();
  } catch (err) {
    console.warn('API reject fallback:', err.message);
    return { status: 'REJECTED' };
  }
}

export async function simulateWorkflowApi(workflowId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/workflow/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflow_id: workflowId })
    });
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.detail || 'Simulation failed');
    }
    return await response.json();
  } catch (err) {
    console.warn('API simulate fallback:', err.message);
    return null;
  }
}
