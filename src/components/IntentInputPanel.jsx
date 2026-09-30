import React, { useState } from 'react';
import { Sparkles, ArrowRight, Wand2, Lightbulb, CheckCircle, FileSpreadsheet, Bot, X, RotateCcw } from 'lucide-react';

export default function IntentInputPanel({ 
  currentPrompt, 
  onPromptChange, 
  onSynthesize, 
  isSynthesizing, 
  onSelectExample,
  onClearInput
}) {
  const [isFocused, setIsFocused] = useState(false);

  const examplePrompts = [
    {
      label: '🎓 Telegram Class 10 Assignment',
      prompt: "Create the assignment for class 10 students and notify the students tomorrow in a particular Telegram group or in their particular chat group"
    },
    {
      label: '📜 Student Marks & Report Card',
      prompt: "Take students' marks from the Excel sheet, calculate totals & letter grades, populate report card templates, and email parents with the PDF attachment."
    },
    {
      label: '💼 Lead Qualification & CRM',
      prompt: "Import incoming leads from CSV, filter leads with budget > $5000, draft personalized email outreach, send email and ping Slack."
    }
  ];

  return (
    <div className="glass-panel fade-in-up" style={{ padding: '24px', marginBottom: '28px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Ambient Radial Background Glow */}
      <div style={{
        position: 'absolute',
        top: '-60px',
        right: '-60px',
        width: '280px',
        height: '280px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)' }}>
            <Wand2 size={20} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Describe What You Want to Automate
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Type your intent in normal language &rarr; Joss synthesizes an interactive agent workflow
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {currentPrompt.trim() && (
            <button
              onClick={onClearInput}
              className="btn-secondary"
              style={{ padding: '5px 10px', fontSize: '0.75rem', borderRadius: '6px' }}
              title="Clear input text"
            >
              <X size={12} /> Clear Text
            </button>
          )}
          <span className="badge-pill badge-cyan">
            <Bot size={12} /> Live Intent Engine
          </span>
        </div>
      </div>

      {/* Hero Textarea Bar */}
      <div style={{
        position: 'relative',
        borderRadius: '16px',
        border: isFocused ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: isFocused ? '0 0 25px rgba(99, 102, 241, 0.25)' : 'none',
        background: 'rgba(15, 21, 35, 0.85)',
        transition: 'all 0.25s ease',
        padding: '6px'
      }}>
        <textarea
          value={currentPrompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="e.g. Create the assignment for class 10 students and notify the students tomorrow in a particular Telegram group..."
          rows={3}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-main)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            padding: '12px 16px',
            resize: 'none',
            lineHeight: 1.5
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={13} color="#10b981" /> Intent Parsing
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FileSpreadsheet size={13} color="#06b6d4" /> Target Mapping
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Bot size={13} color="#fcd34d" /> Approval Gate Enforced
            </span>
          </div>

          <button
            onClick={onSynthesize}
            disabled={isSynthesizing || !currentPrompt.trim()}
            className="btn-primary"
            style={{ padding: '9px 20px', fontSize: '0.88rem' }}
          >
            {isSynthesizing ? (
              <>
                <Sparkles size={16} className="animate-spin" style={{ animation: 'spinSlow 1.5s linear infinite' }} />
                Synthesizing Workflow...
              </>
            ) : (
              <>
                <Wand2 size={16} />
                Generate Agent Flow
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Suggested Example Pills */}
      <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Lightbulb size={13} color="#f59e0b" /> Click to test example intents:
        </span>
        {examplePrompts.map((ex, idx) => (
          <button
            key={idx}
            onClick={() => onSelectExample(ex.prompt)}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'var(--text-muted)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.12)';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            {ex.label}
          </button>
        ))}
      </div>

    </div>
  );
}
