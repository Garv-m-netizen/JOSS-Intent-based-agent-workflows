import React from 'react';
import { 
  FileSpreadsheet, 
  Table, 
  Calculator, 
  FileText, 
  UserCheck, 
  Mail, 
  Zap, 
  Filter, 
  Sparkles, 
  FolderSync, 
  ShieldAlert, 
  Send, 
  CheckCircle2, 
  Clock, 
  Play, 
  Settings, 
  Plus, 
  ChevronRight,
  ArrowDown
} from 'lucide-react';

const ICON_MAP = {
  FileSpreadsheet,
  Table,
  Calculator,
  FileText,
  UserCheck,
  Mail,
  Zap,
  Filter,
  Sparkles,
  FolderSync,
  ShieldAlert,
  Send
};

export default function WorkflowCanvas({ 
  nodes, 
  activeNodeId, 
  completedNodeIds, 
  onSelectNode, 
  onConfigureNode, 
  isVerified, 
  onToggleVerify,
  isExecuting 
}) {

  const getNodeBadgeColor = (type) => {
    switch (type) {
      case 'trigger': return 'badge-amber';
      case 'datasource': return 'badge-cyan';
      case 'transform': return 'badge-indigo';
      case 'generate': return 'badge-indigo';
      case 'verify': return isVerified ? 'badge-emerald' : 'badge-amber';
      case 'action': return 'badge-emerald';
      default: return 'badge-indigo';
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      
      {/* Canvas Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Synthesized Agent Workflow Prototype
            </h3>
            <span className="badge-pill badge-indigo">
              {nodes.length} Connected Steps
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Verify step details, data schemas, and decision gateways before starting execution.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={onToggleVerify}
            className={isVerified ? "btn-success" : "btn-secondary"}
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            <UserCheck size={14} />
            {isVerified ? 'Verified & Approved' : 'Click to Verify & Approve'}
          </button>
        </div>
      </div>

      {/* Visual Workflow Nodes Diagram Flow */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        position: 'relative'
      }}>
        {nodes.map((node, idx) => {
          const IconComponent = ICON_MAP[node.icon] || Zap;
          const isActive = node.id === activeNodeId;
          const isDone = completedNodeIds.includes(node.id);
          const badgeClass = getNodeBadgeColor(node.type);

          return (
            <div key={node.id} style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
              
              {/* Node Card */}
              <div
                onClick={() => onSelectNode(node)}
                className={`glass-panel ${isActive ? 'glass-panel-active' : ''}`}
                style={{
                  padding: '18px',
                  borderRadius: '16px',
                  border: isActive 
                    ? '2px solid #6366f1' 
                    : isDone 
                      ? '1px solid rgba(16, 185, 129, 0.4)' 
                      : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isActive 
                    ? 'rgba(99, 102, 241, 0.12)' 
                    : isDone 
                      ? 'rgba(16, 185, 129, 0.05)' 
                      : 'rgba(18, 24, 38, 0.8)',
                  boxShadow: isActive 
                    ? '0 0 25px rgba(99, 102, 241, 0.3)' 
                    : isDone 
                      ? '0 4px 20px rgba(16, 185, 129, 0.15)' 
                      : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >

                {/* Node Active Running Pulse Bar */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #6366f1, #06b6d4, #8b5cf6)',
                    animation: 'shimmer 2s linear infinite',
                    backgroundSize: '200% 100%'
                  }} />
                )}

                {/* Node Header Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: isDone 
                        ? 'rgba(16, 185, 129, 0.2)' 
                        : isActive 
                          ? 'rgba(99, 102, 241, 0.3)' 
                          : 'rgba(255, 255, 255, 0.06)',
                      color: isDone 
                        ? '#34d399' 
                        : isActive 
                          ? '#818cf8' 
                          : 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconComponent size={18} />
                    </div>

                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Step {idx + 1}
                      </span>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
                        {node.title}
                      </h4>
                    </div>
                  </div>

                  <span className={`badge-pill ${badgeClass}`} style={{ textTransform: 'capitalize' }}>
                    {node.type}
                  </span>
                </div>

                {/* Node Description */}
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '14px' }}>
                  {node.description}
                </p>

                {/* Node Footer / Configuration Quick Specs */}
                <div style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background: 'rgba(15, 21, 35, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  fontSize: '0.75rem',
                  color: 'var(--text-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {isDone ? (
                      <CheckCircle2 size={13} color="#10b981" />
                    ) : isActive ? (
                      <Clock size={13} color="#818cf8" className="animate-spin" style={{ animation: 'spinSlow 2s linear infinite' }} />
                    ) : (
                      <Clock size={13} color="#6b7280" />
                    )}
                    {isDone ? 'Execution Verified' : isActive ? 'Processing Step...' : 'Standby / Ready'}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onConfigureNode(node);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#a5b4fc',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Settings size={12} /> Inspect
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
