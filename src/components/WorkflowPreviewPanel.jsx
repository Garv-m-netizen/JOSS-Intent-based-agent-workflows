import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Send, 
  Sparkles, 
  Zap, 
  MessageSquare, 
  Calendar, 
  Users, 
  FileText, 
  Play, 
  Bot,
  Check,
  AlertTriangle,
  Info,
  ShieldCheck
} from 'lucide-react';

export default function WorkflowPreviewPanel({ 
  parsedWorkflow, 
  approvalStatus, // 'pending' | 'approved' | 'rejected'
  onApprove, 
  onReject, 
  onStartSimulation, 
  isExecuting,
  isSynthesizing,
  activeStepId,
  completedStepIds,
  simulationResult,
  errorMessage
}) {

  // Loading skeleton state during synthesis
  if (isSynthesizing) {
    return (
      <div className="glass-panel fade-in" style={{ padding: '28px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div className="skeleton-box" style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton-box" style={{ width: '220px', height: '20px', marginBottom: '6px' }} />
            <div className="skeleton-box" style={{ width: '340px', height: '14px' }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton-box" style={{ height: '60px', borderRadius: '10px' }} />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="skeleton-box" style={{ height: '54px', borderRadius: '10px' }} />
          ))}
        </div>
      </div>
    );
  }

  // Error Banner State
  if (errorMessage) {
    return (
      <div className="glass-panel fade-in" style={{ padding: '24px', marginBottom: '28px', border: '1px solid rgba(244, 63, 94, 0.4)', background: 'rgba(244, 63, 94, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle size={24} color="#f43f5e" />
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fda4af' }}>Workflow Request Error</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{errorMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (!parsedWorkflow) {
    return (
      <div className="glass-panel fade-in" style={{ padding: '40px 24px', marginBottom: '28px', textAlign: 'center' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'rgba(99, 102, 241, 0.12)',
          color: '#818cf8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto'
        }}>
          <Bot size={28} />
        </div>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
          No Workflow Synthesized Yet
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 16px auto' }}>
          Describe what you want to automate in plain language above (e.g. creating assignments, reminders, notifications, or tasks).
        </p>
      </div>
    );
  }

  // Unsupported Intent Card
  if (parsedWorkflow.is_supported === false) {
    return (
      <div className="glass-panel fade-in-up" style={{ padding: '24px', marginBottom: '28px', border: '1px solid rgba(245, 158, 11, 0.4)', background: 'rgba(245, 158, 11, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <ShieldAlert size={28} color="#fcd34d" style={{ marginTop: '2px' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: '#fcd34d' }}>
                Unsupported Intent Request
              </h3>
              <span className="badge-pill badge-amber">Out of Scope</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '12px' }}>
              {parsedWorkflow.unsupported_reason || "This request falls outside Joss's supported automation scope."}
            </p>
            <div style={{ background: 'rgba(15, 21, 35, 0.7)', padding: '12px 14px', borderRadius: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: '#a5b4fc' }}>Supported Automation Scope in Joss:</strong>
              <ul style={{ paddingLeft: '20px', marginTop: '6px', lineHeight: 1.6 }}>
                <li>🎓 Creating & scheduling assignments / homework sheets</li>
                <li>⏰ Setting automated reminders & event alerts</li>
                <li>📢 Sending broadcast notifications to Telegram, Slack, WhatsApp, or Email</li>
                <li>📋 Creating & assigning structured task checklists</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { taskTitle, audience, channel, schedule, assetType, nodes, explanation, architecture } = parsedWorkflow;

  return (
    <div className="glass-panel fade-in-up" style={{
      padding: '28px',
      marginBottom: '28px',
      border: approvalStatus === 'approved' 
        ? '1px solid rgba(16, 185, 129, 0.4)' 
        : approvalStatus === 'rejected'
          ? '1px solid rgba(244, 63, 94, 0.4)'
          : '1px solid rgba(245, 158, 11, 0.4)'
    }}>
      
      {/* Top Approval Status Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderRadius: '14px',
        background: approvalStatus === 'approved' 
          ? 'rgba(16, 185, 129, 0.12)' 
          : approvalStatus === 'rejected' 
            ? 'rgba(244, 63, 94, 0.12)' 
            : 'rgba(245, 158, 11, 0.12)',
        border: approvalStatus === 'approved' 
          ? '1px solid rgba(16, 185, 129, 0.3)' 
          : approvalStatus === 'rejected' 
            ? '1px solid rgba(244, 63, 94, 0.3)' 
            : '1px solid rgba(245, 158, 11, 0.3)',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {approvalStatus === 'approved' ? (
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
              <CheckCircle2 size={24} />
            </div>
          ) : approvalStatus === 'rejected' ? (
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e' }}>
              <XCircle size={24} />
            </div>
          ) : (
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', color: '#fcd34d' }}>
              <ShieldAlert size={24} />
            </div>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {taskTitle}
              </h3>
              <span className={`badge-pill ${approvalStatus === 'approved' ? 'badge-emerald' : approvalStatus === 'rejected' ? 'badge-rose' : 'badge-amber'}`}>
                {approvalStatus === 'approved' ? 'APPROVED & READY' : approvalStatus === 'rejected' ? 'WORKFLOW CANCELLED' : 'REQUIRES APPROVAL'}
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {approvalStatus === 'approved' 
                ? 'Workflow has been approved in FastAPI backend. Click Run Simulation Mode to watch step execution.'
                : approvalStatus === 'rejected'
                  ? 'Workflow review was cancelled. Execution is blocked in backend.'
                  : 'Review the step-by-step preview below. The workflow will NEVER execute until you explicitly click Approve.'}
            </p>
          </div>
        </div>

        {/* Approval Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {approvalStatus === 'pending' && (
            <>
              <button
                onClick={onReject}
                className="btn-secondary"
                style={{ padding: '9px 16px', fontSize: '0.85rem', borderColor: 'rgba(244, 63, 94, 0.3)', color: '#f87171' }}
              >
                <XCircle size={15} /> Cancel Workflow
              </button>
              <button
                onClick={onApprove}
                className="btn-success"
                style={{ padding: '9px 20px', fontSize: '0.88rem' }}
              >
                <CheckCircle2 size={16} /> Approve Workflow
              </button>
            </>
          )}

          {approvalStatus === 'approved' && (
            <button
              onClick={onStartSimulation}
              disabled={isExecuting}
              className="btn-primary"
              style={{ padding: '10px 22px', fontSize: '0.9rem' }}
            >
              {isExecuting ? (
                <>
                  <Sparkles size={16} className="animate-spin" style={{ animation: 'spinSlow 1.5s linear infinite' }} />
                  Simulating Backend Steps...
                </>
              ) : (
                <>
                  <Play size={16} fill="white" />
                  Run Simulation Mode
                </>
              )}
            </button>
          )}

          {approvalStatus === 'rejected' && (
            <button
              onClick={onApprove}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.82rem' }}
            >
              Re-open & Approve
            </button>
          )}
        </div>
      </div>

      {/* Explanation Banner */}
      {explanation && (
        <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.2)', marginBottom: '18px', fontSize: '0.84rem', color: '#c7d2fe', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={16} color="#818cf8" />
          <span>{explanation}</span>
        </div>
      )}

      {/* Summary Metadata Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{ background: 'rgba(15, 21, 35, 0.7)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Users size={12} color="#a5b4fc" /> Target Audience
          </span>
          <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f3f4f6', marginTop: '2px' }}>{audience}</p>
        </div>

        <div style={{ background: 'rgba(15, 21, 35, 0.7)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MessageSquare size={12} color="#67e8f9" /> Output Channel
          </span>
          <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#67e8f9', marginTop: '2px' }}>{channel}</p>
        </div>

        <div style={{ background: 'rgba(15, 21, 35, 0.7)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={12} color="#fcd34d" /> Schedule Mode
          </span>
          <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fcd34d', marginTop: '2px' }}>{schedule}</p>
        </div>

        <div style={{ background: 'rgba(15, 21, 35, 0.7)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FileText size={12} color="#6ee7b7" /> Generated Asset
          </span>
          <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#6ee7b7', marginTop: '2px' }}>{assetType}</p>
        </div>
      </div>

      {/* Step List */}
      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Bot size={18} color="#818cf8" /> Validated Workflow Steps ({nodes ? nodes.length : 0} Steps)
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {nodes && nodes.map((node, idx) => {
          const isActive = activeStepId === node.id;
          const isDone = completedStepIds.includes(node.id);
          const isApprovalStep = node.type === 'verify';

          return (
            <div
              key={node.id}
              style={{
                background: isActive 
                  ? 'rgba(99, 102, 241, 0.15)' 
                  : isDone 
                    ? 'rgba(16, 185, 129, 0.08)' 
                    : isApprovalStep 
                      ? 'rgba(245, 158, 11, 0.08)' 
                      : 'rgba(15, 21, 35, 0.6)',
                border: isActive 
                  ? '2px solid #6366f1' 
                  : isDone 
                    ? '1px solid rgba(16, 185, 129, 0.35)' 
                    : isApprovalStep 
                      ? '1px solid rgba(245, 158, 11, 0.35)' 
                      : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                transition: 'all 0.25s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isDone 
                    ? '#10b981' 
                    : isActive 
                      ? '#6366f1' 
                      : isApprovalStep 
                        ? '#f59e0b' 
                        : 'rgba(255, 255, 255, 0.1)',
                  color: isDone || isActive || isApprovalStep ? '#ffffff' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 800
                }}>
                  {isDone ? <Check size={16} /> : idx + 1}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {node.title}
                    </h5>
                    {isApprovalStep && (
                      <span className="badge-pill badge-amber" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                        Approval Gate
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {node.description}
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'right', minWidth: '170px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, display: 'block' }}>
                  {node.summary}
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: isDone ? '#34d399' : isActive ? '#818cf8' : 'var(--text-muted)'
                }}>
                  {isDone ? '✓ Completed' : isActive ? '⏳ Simulating...' : 'Ready'}
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {/* Backend Simulation Results */}
      {simulationResult && (
        <div className="fade-in-up" style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '14px',
          padding: '20px',
          marginTop: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <CheckCircle2 size={22} color="#34d399" />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#6ee7b7' }}>
              Backend Simulation Mode Execution Complete
            </h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '0.85rem' }}>
            <div style={{ background: 'rgba(15, 21, 35, 0.6)', padding: '10px 12px', borderRadius: '8px' }}>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', display: 'block' }}>Simulated Action</span>
              <strong style={{ color: '#f3f4f6' }}>{simulationResult.summary?.actionExecuted || simulationResult.actionExecuted}</strong>
            </div>

            <div style={{ background: 'rgba(15, 21, 35, 0.6)', padding: '10px 12px', borderRadius: '8px' }}>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', display: 'block' }}>Target Channel</span>
              <strong style={{ color: '#67e8f9' }}>{simulationResult.summary?.targetChannel || simulationResult.targetChannel}</strong>
            </div>

            <div style={{ background: 'rgba(15, 21, 35, 0.6)', padding: '10px 12px', borderRadius: '8px' }}>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', display: 'block' }}>Scheduled Timing</span>
              <strong style={{ color: '#fcd34d' }}>{simulationResult.summary?.dispatchTime || simulationResult.dispatchTime}</strong>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
