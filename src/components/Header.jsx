import React from 'react';
import { Sparkles, Play, CheckCircle2, RotateCcw, FileSpreadsheet, Bot, HelpCircle, Layers } from 'lucide-react';

export default function Header({ 
  currentPreset, 
  onSelectPreset, 
  presets, 
  isVerified, 
  onToggleVerify, 
  isExecuting, 
  onRunExecution, 
  onReset 
}) {
  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '14px 28px', marginBottom: '24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* Brand Logo & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
            fontSize: '1.4rem'
          }}>
            ⚡
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #ffffff, #c7d2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Joss
              </h1>
              <span className="badge-pill badge-indigo">
                <Bot size={12} /> Intent-Driven Engine v1.0
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1px' }}>
              Describe what you want &rarr; Joss builds & executes verified agent workflows
            </p>
          </div>
        </div>

        {/* Preset Workflow Selectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 21, 35, 0.6)', padding: '6px 10px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Layers size={13} /> Demo Presets:
          </span>
          {presets.map((preset) => {
            const isActive = preset.id === currentPreset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                disabled={isExecuting}
                style={{
                  background: isActive ? 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.2))' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  border: isActive ? '1px solid rgba(99,102,241,0.4)' : '1px solid transparent',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: isExecuting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {preset.title.split(' ')[0]} {preset.title.split(' ').slice(1, 3).join(' ')}
              </button>
            );
          })}
        </div>

        {/* Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Verification Badge Toggle */}
          <button
            onClick={onToggleVerify}
            disabled={isExecuting}
            style={{
              background: isVerified ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              border: isVerified ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(245, 158, 11, 0.35)',
              color: isVerified ? '#6ee7b7' : '#fcd34d',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: isExecuting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            title="Click to toggle teacher verification approval state"
          >
            <CheckCircle2 size={15} />
            {isVerified ? 'Verified & Ready' : 'Pending Verification'}
          </button>

          {/* Reset Button */}
          <button 
            onClick={onReset}
            disabled={isExecuting}
            className="btn-secondary"
            style={{ padding: '8px 12px', fontSize: '0.82rem' }}
            title="Reset simulation state"
          >
            <RotateCcw size={14} /> Reset
          </button>

          {/* Run Execution Button */}
          <button
            onClick={onRunExecution}
            disabled={isExecuting}
            className="btn-success"
            style={{
              opacity: isExecuting ? 0.7 : 1,
              cursor: isExecuting ? 'wait' : 'pointer'
            }}
          >
            {isExecuting ? (
              <>
                <Sparkles size={16} className="animate-spin" style={{ animation: 'spinSlow 2s linear infinite' }} />
                Executing Joss Flow...
              </>
            ) : (
              <>
                <Play size={16} fill="white" />
                Run Prototype
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
