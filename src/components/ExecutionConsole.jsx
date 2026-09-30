import React, { useEffect, useRef } from 'react';
import { Terminal, CheckCircle2, AlertCircle, Play, Sparkles, RefreshCw, Mail, Check, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ExecutionConsole({ 
  logs, 
  isExecuting, 
  executionProgress, 
  processedCount, 
  totalCount, 
  isCompleted, 
  onRunExecution, 
  onReset,
  isVerified,
  currentPresetTitle
}) {
  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    if (isCompleted) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log('Confetti error:', err);
      }
    }
  }, [isCompleted]);

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      
      {/* Console Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7' }}>
            <Terminal size={20} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Live Execution Engine & Log Stream
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Real-time multi-agent execution pipeline outputs for {currentPresetTitle}
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isCompleted ? (
            <span className="badge-pill badge-emerald">
              <CheckCircle2 size={13} /> Prototype Run Completed Successfully
            </span>
          ) : isExecuting ? (
            <span className="badge-pill badge-indigo">
              <Sparkles size={13} className="animate-spin" style={{ animation: 'spinSlow 2s linear infinite' }} />
              Executing Steps ({executionProgress}%)
            </span>
          ) : (
            <span className="badge-pill badge-amber">
              <ShieldCheck size={13} /> {isVerified ? 'Verified & Ready to Run' : 'Awaiting Teacher Approval'}
            </span>
          )}
        </div>
      </div>

      {/* Execution Progress Bar */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '6px', fontWeight: 600 }}>
          <span>Overall Workflow Progress ({processedCount} of {totalCount} Items Processed)</span>
          <span>{executionProgress}%</span>
        </div>
        <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'rgba(15, 21, 35, 0.8)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${executionProgress}%`,
            background: isCompleted 
              ? 'linear-gradient(90deg, #10b981, #059669)' 
              : 'linear-gradient(90deg, #6366f1, #06b6d4)',
            transition: 'width 0.4s ease',
            borderRadius: '4px'
          }} />
        </div>
      </div>

      {/* Log Output Console Terminal */}
      <div style={{
        background: '#090d16',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '16px',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.82rem',
        height: '240px',
        overflowY: 'auto',
        color: '#e2e8f0',
        lineHeight: 1.6
      }}>
        {logs.length === 0 ? (
          <div style={{ color: 'var(--text-dim)', fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            No logs yet. Click "Run Prototype" to start live execution stream.
          </div>
        ) : (
          logs.map((log, index) => {
            let color = '#94a3b8';
            if (log.type === 'success') color = '#34d399';
            if (log.type === 'info') color = '#60a5fa';
            if (log.type === 'warn') color = '#fbbf24';
            if (log.type === 'action') color = '#c084fc';

            return (
              <div key={index} style={{ marginBottom: '6px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', minWidth: '70px' }}>[{log.timestamp}]</span>
                <span style={{ color, fontWeight: log.type === 'success' ? 600 : 400 }}>{log.message}</span>
              </div>
            );
          })
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Completion Summary Card */}
      {isCompleted && (
        <div style={{
          marginTop: '16px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={24} color="#34d399" />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#6ee7b7' }}>
                Workflow Prototype Executed Successfully!
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Generated {totalCount} report cards, computed grade metrics, and simulated parent email dispatches.
              </p>
            </div>
          </div>

          <button onClick={onReset} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
            <RefreshCw size={13} /> Reset Execution
          </button>
        </div>
      )}

    </div>
  );
}
