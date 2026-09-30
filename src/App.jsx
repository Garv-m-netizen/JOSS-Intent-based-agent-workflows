import React, { useState, useRef } from 'react';
import Header from './components/Header';
import IntentInputPanel from './components/IntentInputPanel';
import WorkflowPreviewPanel from './components/WorkflowPreviewPanel';
import WorkflowCanvas from './components/WorkflowCanvas';
import DataPreviewPanel from './components/DataPreviewPanel';
import ExecutionConsole from './components/ExecutionConsole';
import ReportCardPreviewModal from './components/ReportCardPreviewModal';
import NodeEditModal from './components/NodeEditModal';

import { PRESET_WORKFLOWS } from './data/presets';
import { parseUserIntent } from './utils/intentParser';
import { fetchSynthesizedWorkflow, approveWorkflowApi, rejectWorkflowApi, simulateWorkflowApi } from './services/api';
import * as XLSX from 'xlsx';

export default function App() {
  const [presets, setPresets] = useState(PRESET_WORKFLOWS);
  const [currentPreset, setCurrentPreset] = useState(PRESET_WORKFLOWS[0]);
  
  // Natural language intent input state
  const defaultPrompt = "Create the assignment for class 10 students and notify the students tomorrow in a particular Telegram group or in their particular chat group";
  const [currentPrompt, setCurrentPrompt] = useState(defaultPrompt);

  // Dynamic parsed workflow state from FastAPI / Gemini LLM
  const [parsedWorkflow, setParsedWorkflow] = useState(() => parseUserIntent(defaultPrompt));
  
  // Approval state: 'pending' | 'approved' | 'rejected'
  const [approvalStatus, setApprovalStatus] = useState('pending');
  
  // Execution / Simulation state
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const [activeStepId, setActiveStepId] = useState(null);
  const [completedStepIds, setCompletedStepIds] = useState([]);
  const [logs, setLogs] = useState([]);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [simulationResult, setSimulationResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Modals & Data
  const [excelData, setExcelData] = useState(PRESET_WORKFLOWS[0].excelData);
  const [previewStudent, setPreviewStudent] = useState(null);
  const [previewGradeInfo, setPreviewGradeInfo] = useState(null);
  const [editingNode, setEditingNode] = useState(null);

  const previewPanelRef = useRef(null);

  // 1. Synthesize Natural Language Prompt via FastAPI + Gemini LLM Service
  const handleSynthesizeIntent = async (overridePrompt) => {
    const textToParse = overridePrompt !== undefined ? overridePrompt : currentPrompt;
    if (!textToParse.trim()) {
      setParsedWorkflow(null);
      return;
    }

    setIsSynthesizing(true);
    setErrorMessage(null);
    setApprovalStatus('pending');
    setIsCompleted(false);
    setCompletedStepIds([]);
    setActiveStepId(null);
    setSimulationResult(null);

    try {
      const parsed = await fetchSynthesizedWorkflow(textToParse);
      setParsedWorkflow(parsed);
      setIsSynthesizing(false);

      if (parsed.validation_error) {
        setErrorMessage(parsed.validation_error);
      }

      const backendSource = parsed.isBackend ? '⚡ FastAPI Backend (http://localhost:8000)' : '💻 Client Fallback Parser';

      setLogs([
        { timestamp: new Date().toLocaleTimeString(), message: `🧠 Intent synthesized via ${backendSource}`, type: 'info' },
        { timestamp: new Date().toLocaleTimeString(), message: `🆔 Workflow ID: ${parsed.workflow_id || 'wf-local'}`, type: 'info' },
        { timestamp: new Date().toLocaleTimeString(), message: `⚠️ Workflow created in GENERATED state (Pending Approval). Execution is blocked until user consent.`, type: 'warn' }
      ]);

      previewPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (err) {
      setIsSynthesizing(false);
      setErrorMessage(err.message || 'An error occurred during workflow synthesis.');
    }
  };

  // 2. Select preset example
  const handleSelectPreset = (preset) => {
    setCurrentPreset(preset);
    setCurrentPrompt(preset.prompt);
    handleSynthesizeIntent(preset.prompt);
  };

  // 3. Backend Approval Flow Handlers
  const handleApproveWorkflow = async () => {
    if (!parsedWorkflow) return;
    try {
      const result = await approveWorkflowApi(parsedWorkflow.workflow_id);
      setApprovalStatus('approved');
      if (parsedWorkflow) {
        setParsedWorkflow({ ...parsedWorkflow, status: 'APPROVED' });
      }
      setLogs(prev => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString(), message: `✅ Workflow '${parsedWorkflow.workflow_id}' APPROVED in backend. Simulation Mode unlocked.`, type: 'success' }
      ]);
    } catch (err) {
      alert(`Approval error: ${err.message}`);
    }
  };

  const handleRejectWorkflow = async () => {
    if (!parsedWorkflow) return;
    try {
      await rejectWorkflowApi(parsedWorkflow.workflow_id);
      setApprovalStatus('rejected');
      if (parsedWorkflow) {
        setParsedWorkflow({ ...parsedWorkflow, status: 'REJECTED' });
      }
      setLogs(prev => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString(), message: `🛑 Workflow '${parsedWorkflow.workflow_id}' CANCELLED in backend.`, type: 'warn' }
      ]);
    } catch (err) {
      alert(`Rejection error: ${err.message}`);
    }
  };

  // 4. Backend Simulation Engine Execution
  const handleStartSimulation = async () => {
    if (approvalStatus !== 'approved' || isExecuting || !parsedWorkflow) return;

    setIsExecuting(true);
    setIsCompleted(false);
    setCompletedStepIds([]);
    setExecutionProgress(0);
    setProcessedCount(0);
    setSimulationResult(null);

    setLogs(prev => [
      ...prev,
      { timestamp: new Date().toLocaleTimeString(), message: `🚀 Calling FastAPI Backend Simulation Engine (/api/workflow/simulate)...`, type: 'info' }
    ]);

    // Call backend simulation endpoint
    const backendSim = await simulateWorkflowApi(parsedWorkflow.workflow_id);

    const steps = parsedWorkflow.nodes || [];
    const totalSteps = steps.length;

    for (let i = 0; i < totalSteps; i++) {
      const step = steps[i];
      setActiveStepId(step.id);

      const simMessage = backendSim && backendSim.steps && backendSim.steps[i]
        ? backendSim.steps[i].message
        : `Executing step '${step.title}' in backend sandbox...`;

      setLogs(prev => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString(), message: `▶️ Step ${i + 1}/${totalSteps}: ${step.title} — ${simMessage}`, type: 'info' }
      ]);

      await new Promise(res => setTimeout(res, 600));

      setCompletedStepIds(prev => [...prev, step.id]);
      setExecutionProgress(Math.round(((i + 1) / totalSteps) * 100));
      setProcessedCount(i + 1);
    }

    setActiveStepId(null);
    setIsExecuting(false);
    setIsCompleted(true);

    const finalResult = backendSim || {
      summary: {
        actionExecuted: `Created ${parsedWorkflow.assetType}`,
        targetChannel: parsedWorkflow.channel,
        dispatchTime: parsedWorkflow.schedule
      }
    };

    setSimulationResult(finalResult);

    setLogs(prev => [
      ...prev,
      { timestamp: new Date().toLocaleTimeString(), message: `🎉 Backend Simulation Engine completed! All mock actions executed safely without external calls.`, type: 'success' }
    ]);
  };

  // Reset execution
  const handleReset = () => {
    setIsExecuting(false);
    setIsCompleted(false);
    setActiveStepId(null);
    setCompletedStepIds([]);
    setExecutionProgress(0);
    setProcessedCount(0);
    setSimulationResult(null);
    setApprovalStatus('pending');
    setLogs([
      { timestamp: new Date().toLocaleTimeString(), message: '🔄 Reset workflow execution state. Ready for review.', type: 'info' }
    ]);
  };

  // Clear text input
  const handleClearInput = () => {
    setCurrentPrompt('');
    setParsedWorkflow(null);
    setApprovalStatus('pending');
    setIsCompleted(false);
    setCompletedStepIds([]);
    setActiveStepId(null);
    setSimulationResult(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navigation Header */}
      <Header
        currentPreset={currentPreset}
        onSelectPreset={handleSelectPreset}
        presets={presets}
        isVerified={approvalStatus === 'approved'}
        onToggleVerify={() => setApprovalStatus(approvalStatus === 'approved' ? 'pending' : 'approved')}
        isExecuting={isExecuting}
        onRunExecution={handleStartSimulation}
        onReset={handleReset}
      />

      <main style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '0 24px 40px 24px', flex: 1 }}>
        
        {/* Intent Hero Section */}
        <IntentInputPanel
          currentPrompt={currentPrompt}
          onPromptChange={setCurrentPrompt}
          onSynthesize={() => handleSynthesizeIntent()}
          isSynthesizing={isSynthesizing}
          onSelectExample={(pText) => {
            setCurrentPrompt(pText);
            handleSynthesizeIntent(pText);
          }}
          onClearInput={handleClearInput}
        />

        {/* Workflow Preview & Approval Gateway */}
        <div ref={previewPanelRef}>
          <WorkflowPreviewPanel
            parsedWorkflow={parsedWorkflow}
            approvalStatus={approvalStatus}
            onApprove={handleApproveWorkflow}
            onReject={handleRejectWorkflow}
            onStartSimulation={handleStartSimulation}
            isExecuting={isExecuting}
            isSynthesizing={isSynthesizing}
            activeStepId={activeStepId}
            completedStepIds={completedStepIds}
            simulationResult={simulationResult}
            errorMessage={errorMessage}
          />
        </div>

        {/* Synthesized Visual Flow Canvas */}
        {parsedWorkflow && parsedWorkflow.nodes && (
          <WorkflowCanvas
            nodes={parsedWorkflow.nodes}
            activeNodeId={activeStepId}
            completedNodeIds={completedStepIds}
            onSelectNode={(node) => setEditingNode(node)}
            onConfigureNode={(node) => setEditingNode(node)}
            isVerified={approvalStatus === 'approved'}
            onToggleVerify={() => setApprovalStatus(approvalStatus === 'approved' ? 'pending' : 'approved')}
            isExecuting={isExecuting}
          />
        )}

        {/* Data & Roster Preview Panel */}
        <DataPreviewPanel
          excelData={excelData}
          onAddStudent={(newStu) => setExcelData([...excelData, newStu])}
          onPreviewReportCard={(student, gradeInfo) => {
            setPreviewStudent(student);
            setPreviewGradeInfo(gradeInfo);
          }}
          onFileUpload={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
              try {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const data = XLSX.utils.sheet_to_json(ws);
                if (data.length > 0) {
                  const formatted = data.map((item, idx) => ({
                    id: `STU-${100 + idx}`,
                    name: item['Student Name'] || item['Name'] || `Student ${idx + 1}`,
                    roll: item['Roll No'] || `10-A-0${idx + 1}`,
                    math: Number(item['Math']) || 80,
                    science: Number(item['Science']) || 85,
                    english: Number(item['English']) || 82,
                    cs: Number(item['CS']) || 90,
                    attendance: '95%',
                    parentName: 'Parent',
                    parentEmail: item['Parent Email'] || item['Email'] || `parent${idx+1}@example.com`,
                    comments: 'Good student record imported from Excel.'
                  }));
                  setExcelData(formatted);
                }
              } catch (err) {
                alert('Invalid Excel file format.');
              }
            };
            reader.readAsBinaryString(file);
          }}
        />

        {/* Live Execution Console */}
        <ExecutionConsole
          logs={logs}
          isExecuting={isExecuting}
          executionProgress={executionProgress}
          processedCount={processedCount}
          totalCount={parsedWorkflow && parsedWorkflow.nodes ? parsedWorkflow.nodes.length : 5}
          isCompleted={isCompleted}
          onRunExecution={handleStartSimulation}
          onReset={handleReset}
          isVerified={approvalStatus === 'approved'}
          currentPresetTitle={parsedWorkflow ? parsedWorkflow.taskTitle : 'Workflow Engine'}
        />

      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '20px 24px',
        textAlign: 'center',
        color: 'var(--text-dim)',
        fontSize: '0.8rem',
        background: 'rgba(10, 13, 20, 0.9)'
      }}>
        ⚡ <strong>Joss</strong> — Gemini LLM + FastAPI Backend • API Key in `.env` • Connected to http://localhost:8000
      </footer>

      {/* Modals */}
      {previewStudent && (
        <ReportCardPreviewModal
          student={previewStudent}
          gradeInfo={previewGradeInfo}
          templateInfo={currentPreset.template}
          onClose={() => setPreviewStudent(null)}
        />
      )}

      {editingNode && (
        <NodeEditModal
          node={editingNode}
          onSave={(updated) => {
            if (parsedWorkflow && parsedWorkflow.nodes) {
              const updatedNodes = parsedWorkflow.nodes.map(n => n.id === updated.id ? updated : n);
              setParsedWorkflow({ ...parsedWorkflow, nodes: updatedNodes });
            }
            setEditingNode(null);
          }}
          onClose={() => setEditingNode(null)}
        />
      )}

    </div>
  );
}
