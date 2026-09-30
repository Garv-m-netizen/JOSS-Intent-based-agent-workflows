import React, { useState } from 'react';
import { X, Settings, Check, Sliders, Database, FileSpreadsheet, Code } from 'lucide-react';

export default function NodeEditModal({ node, onSave, onClose }) {
  if (!node) return null;

  const [title, setTitle] = useState(node.title);
  const [description, setDescription] = useState(node.description);
  const [config, setConfig] = useState(JSON.stringify(node.config, null, 2));
  const [jsonError, setJsonError] = useState('');

  const handleSave = () => {
    try {
      const parsedConfig = JSON.parse(config);
      onSave({
        ...node,
        title,
        description,
        config: parsedConfig
      });
      setJsonError('');
      onClose();
    } catch (err) {
      setJsonError('Invalid JSON format in node configuration.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1050,
      padding: '20px'
    }}>
      <div style={{
        background: '#0f172a',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        width: '100%',
        maxWidth: '560px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        color: '#f8fafc',
        padding: '24px'
      }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="#818cf8" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700 }}>
              Configure Step Node: {node.title}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Form Controls */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            Step Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              padding: '8px 12px',
              borderRadius: '8px',
              color: 'var(--text-main)',
              fontSize: '0.88rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              padding: '8px 12px',
              borderRadius: '8px',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              resize: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Code size={14} /> Node Parameters & JSON Config
            </label>
            {jsonError && <span style={{ color: '#f43f5e', fontSize: '0.75rem', fontWeight: 600 }}>{jsonError}</span>}
          </div>
          <textarea
            value={config}
            onChange={(e) => {
              setConfig(e.target.value);
              setJsonError('');
            }}
            rows={6}
            style={{
              width: '100%',
              background: '#090d16',
              border: jsonError ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.15)',
              padding: '12px',
              borderRadius: '8px',
              color: '#38bdf8',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              resize: 'none'
            }}
          />
        </div>

        {/* Modal Buttons */}
        <div style={{ display: 'flex', justifySelf: 'end', gap: '10px' }}>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
            <Check size={14} /> Update Node
          </button>
        </div>

      </div>
    </div>
  );
}
