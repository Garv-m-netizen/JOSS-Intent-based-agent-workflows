import React from 'react';
import { X, Printer, Download, Mail, Award, CheckCircle2, School, User, Calendar } from 'lucide-react';

export default function ReportCardPreviewModal({ student, gradeInfo, templateInfo, onClose }) {
  if (!student) return null;

  const { total, percentage, grade } = gradeInfo || { total: 373, percentage: 93, grade: 'A+' };
  const template = templateInfo || {
    schoolName: 'Greenwood International Academy',
    academicYear: '2025 - 2026',
    termName: 'Mid-Term Comprehensive Assessment',
    signatureName: 'Dr. Evelyn Vance (Principal)'
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSimulatedDownload = () => {
    alert(`📄 Report Card PDF for ${student.name} downloaded successfully!`);
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
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#0f172a',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        width: '100%',
        maxWidth: '780px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        position: 'relative',
        color: '#f8fafc'
      }}>
        
        {/* Modal Top Bar */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.9)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="#a5b4fc" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700 }}>
              Generated Student Report Card Prototype
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={handleSimulatedDownload} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              <Download size={14} /> Download PDF
            </button>
            <button onClick={handlePrint} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              <Printer size={14} /> Print Card
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Report Card Canvas */}
        <div style={{ padding: '32px' }}>
          
          <div style={{
            background: '#ffffff',
            color: '#1e293b',
            borderRadius: '16px',
            padding: '36px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            fontFamily: 'Inter, sans-serif'
          }}>
            
            {/* School Header */}
            <div style={{
              textAlign: 'center',
              borderBottom: '2px dashed #cbd5e1',
              paddingBottom: '20px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '6px' }}>
                <School size={28} color="#4f46e5" />
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e1b4b', letterSpacing: '-0.02em' }}>
                  {template.schoolName}
                </h2>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                {template.termName} — Academic Session {template.academicYear}
              </p>
              <div style={{ display: 'inline-block', background: '#e0e7ff', color: '#4338ca', padding: '3px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, marginTop: '8px' }}>
                OFFICIAL VERIFIED ASSESSMENT RESULT
              </div>
            </div>

            {/* Student Info Metadata Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              background: '#f8fafc',
              padding: '16px 20px',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '1px solid #e2e8f0',
              fontSize: '0.88rem'
            }}>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Student Name</p>
                <p style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem' }}>{student.name}</p>
              </div>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Roll No / ID</p>
                <p style={{ fontWeight: 700, color: '#0f172a' }}>{student.roll || student.id}</p>
              </div>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Parent / Guardian</p>
                <p style={{ fontWeight: 600, color: '#334155' }}>{student.parentName || 'Parent'} ({student.parentEmail})</p>
              </div>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Attendance Record</p>
                <p style={{ fontWeight: 700, color: '#16a34a' }}>{student.attendance || '95%'}</p>
              </div>
            </div>

            {/* Subject Marks Breakdown Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#4f46e5', color: '#ffffff' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', borderRadius: '8px 0 0 0' }}>Subject</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Max Marks</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Marks Obtained</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', borderRadius: '0 8px 0 0' }}>Grade</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Mathematics</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', color: '#64748b' }}>100</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: '#0f172a' }}>{student.math}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: student.math >= 90 ? '#16a34a' : '#2563eb' }}>
                    {student.math >= 90 ? 'A+' : student.math >= 80 ? 'A' : 'B'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Science & Technology</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', color: '#64748b' }}>100</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: '#0f172a' }}>{student.science}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: student.science >= 90 ? '#16a34a' : '#2563eb' }}>
                    {student.science >= 90 ? 'A+' : student.science >= 80 ? 'A' : 'B'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>English Language & Literature</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', color: '#64748b' }}>100</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: '#0f172a' }}>{student.english}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: student.english >= 90 ? '#16a34a' : '#2563eb' }}>
                    {student.english >= 90 ? 'A+' : student.english >= 80 ? 'A' : 'B'}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>Computer Science</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', color: '#64748b' }}>100</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: '#0f172a' }}>{student.cs}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: student.cs >= 90 ? '#16a34a' : '#2563eb' }}>
                    {student.cs >= 90 ? 'A+' : student.cs >= 80 ? 'A' : 'B'}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Performance Summary Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
              color: '#ffffff',
              padding: '16px 20px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: '#c7d2fe', textTransform: 'uppercase', fontWeight: 700 }}>Total Calculated Marks</p>
                <p style={{ fontSize: '1.4rem', fontWeight: 800 }}>{total} / 400 Marks</p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem', color: '#c7d2fe', textTransform: 'uppercase', fontWeight: 700 }}>Overall Score</p>
                <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>{percentage}%</p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.8rem', color: '#c7d2fe', textTransform: 'uppercase', fontWeight: 700 }}>Final Grade</p>
                <span style={{ background: '#10b981', color: '#ffffff', padding: '4px 14px', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 800 }}>
                  Grade {grade}
                </span>
              </div>
            </div>

            {/* Teacher Remarks & Signatures */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '18px' }}>
              <p style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                Class Teacher Remarks
              </p>
              <p style={{ fontSize: '0.9rem', color: '#334155', fontStyle: 'italic', marginBottom: '24px', lineHeight: 1.4 }}>
                "{student.comments || 'Exemplary academic effort and consistent performance across science and technology modules.'}"
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px dashed #cbd5e1' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Class Coordinator</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Verified & Signed digitally</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4338ca' }}>{template.signatureName}</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Principal, Greenwood Academy</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
