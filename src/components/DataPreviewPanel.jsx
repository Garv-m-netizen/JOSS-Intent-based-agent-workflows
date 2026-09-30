import React, { useState } from 'react';
import { Table, FileSpreadsheet, Plus, Sparkles, Eye, Download, Upload, CheckCircle2, User, Award } from 'lucide-react';

export default function DataPreviewPanel({ 
  excelData, 
  onAddStudent, 
  onPreviewReportCard, 
  onFileUpload 
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    roll: '10-A-06',
    math: 85,
    science: 90,
    english: 82,
    cs: 95,
    attendance: '95%',
    parentName: '',
    parentEmail: '',
    comments: 'Great enthusiastic learner with strong analytical skills.'
  });

  const handleCreateStudent = (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.parentEmail) return;
    onAddStudent({
      ...newStudent,
      id: `STU-${Math.floor(100 + Math.random() * 900)}`
    });
    setNewStudent({
      name: '',
      roll: `10-A-0${excelData.length + 2}`,
      math: 85,
      science: 90,
      english: 82,
      cs: 95,
      attendance: '95%',
      parentName: '',
      parentEmail: '',
      comments: 'Great enthusiastic learner with strong analytical skills.'
    });
    setShowAddForm(false);
  };

  const calculateGradeInfo = (student) => {
    const math = Number(student.math) || 0;
    const science = Number(student.science) || 0;
    const english = Number(student.english) || 0;
    const cs = Number(student.cs) || 0;
    const total = math + science + english + cs;
    const percentage = Math.round((total / 400) * 100);
    let grade = 'B';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B+';

    return { total, percentage, grade };
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      
      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#67e8f9' }}>
            <FileSpreadsheet size={20} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Source Excel Data & Report Card Synthesizer
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Class 10 science & math student roster ({excelData.length} records active)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{
            cursor: 'pointer',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-main)',
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Upload size={14} /> Import Custom Excel (.xlsx)
            <input type="file" accept=".xlsx, .xls, .csv" onChange={onFileUpload} style={{ display: 'none' }} />
          </label>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.8rem' }}
          >
            <Plus size={14} /> Add Student Entry
          </button>
        </div>
      </div>

      {/* Optional Add Student Drawer Form */}
      {showAddForm && (
        <form onSubmit={handleCreateStudent} style={{
          background: 'rgba(15, 21, 35, 0.8)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          marginBottom: '20px'
        }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '12px' }}>
            ➕ Add New Student Mark Record
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Student Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Maya Lin"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', padding: '8px 10px', borderRadius: '6px', color: 'var(--text-main)', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Parent Email</label>
              <input
                type="email"
                required
                placeholder="parent@example.com"
                value={newStudent.parentEmail}
                onChange={(e) => setNewStudent({ ...newStudent, parentEmail: e.target.value })}
                style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', padding: '8px 10px', borderRadius: '6px', color: 'var(--text-main)', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Math (100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newStudent.math}
                onChange={(e) => setNewStudent({ ...newStudent, math: e.target.value })}
                style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', padding: '8px 10px', borderRadius: '6px', color: 'var(--text-main)', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Science (100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newStudent.science}
                onChange={(e) => setNewStudent({ ...newStudent, science: e.target.value })}
                style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', padding: '8px 10px', borderRadius: '6px', color: 'var(--text-main)', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>English (100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newStudent.english}
                onChange={(e) => setNewStudent({ ...newStudent, english: e.target.value })}
                style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', padding: '8px 10px', borderRadius: '6px', color: 'var(--text-main)', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>CS (100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newStudent.cs}
                onChange={(e) => setNewStudent({ ...newStudent, cs: e.target.value })}
                style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', padding: '8px 10px', borderRadius: '6px', color: 'var(--text-main)', fontSize: '0.85rem' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifySelf: 'end', gap: '8px' }}>
            <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>Save & Compute</button>
          </div>
        </form>
      )}

      {/* Main Data Table */}
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'rgba(15, 21, 35, 0.9)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>Roll No / ID</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>Student Name</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>Math</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>Science</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>English</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>CS</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>Total / Grade</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>Parent Email</th>
              <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {excelData.map((row) => {
              const { total, percentage, grade } = calculateGradeInfo(row);
              return (
                <tr 
                  key={row.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                    {row.roll || row.id}
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-main)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                        {row.name.charAt(0)}
                      </div>
                      {row.name}
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#67e8f9' }}>{row.math}</td>
                  <td style={{ padding: '12px 14px', color: '#67e8f9' }}>{row.science}</td>
                  <td style={{ padding: '12px 14px', color: '#67e8f9' }}>{row.english}</td>
                  <td style={{ padding: '12px 14px', color: '#67e8f9' }}>{row.cs}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700, color: '#f3f4f6' }}>{total}/400 ({percentage}%)</span>
                      <span className={`badge-pill ${grade === 'A+' ? 'badge-emerald' : 'badge-indigo'}`} style={{ padding: '2px 6px', fontSize: '0.7rem' }}>
                        {grade}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                    {row.parentEmail}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <button
                      onClick={() => onPreviewReportCard(row, { total, percentage, grade })}
                      className="btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '0.75rem', borderRadius: '6px' }}
                      title="Preview generated Report Card PDF template"
                    >
                      <Eye size={13} color="#a5b4fc" /> Preview Card
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
