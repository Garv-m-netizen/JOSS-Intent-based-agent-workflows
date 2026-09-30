export const PRESET_WORKFLOWS = [
  {
    id: 'teacher_report_cards',
    title: '🎓 Student Report Card Automation',
    category: 'Education',
    badge: 'Popular Prototype',
    shortDesc: 'Parse Excel marks, calculate grades, populate report card templates, and email parents.',
    prompt: "Take the students' marks from the Class 10 Excel sheet, calculate total marks & grades, populate each student's report card template, and email the report card PDF to their parents once verified.",
    
    excelData: [
      { id: 'STU-101', name: 'Sophia Chen', roll: '10-A-01', math: 95, science: 92, english: 88, cs: 98, attendance: '96%', parentName: 'David Chen', parentEmail: 'david.chen@example.com', comments: 'Outstanding performance in CS and Math. Demonstrated leadership in group projects.' },
      { id: 'STU-102', name: 'Marcus Johnson', roll: '10-A-02', math: 78, science: 84, english: 90, cs: 82, attendance: '91%', parentName: 'Elena Johnson', parentEmail: 'elena.j@example.com', comments: 'Good overall consistency. Expresses great creativity in English literature.' },
      { id: 'STU-103', name: 'Aarav Sharma', roll: '10-A-03', math: 98, science: 96, english: 94, cs: 100, attendance: '99%', parentName: 'Rajesh Sharma', parentEmail: 'rajesh.sharma@example.com', comments: 'Class topper in Science and CS. Exceptional problem-solving speed.' },
      { id: 'STU-104', name: 'Emma Watson', roll: '10-A-04', math: 64, science: 71, english: 85, cs: 79, attendance: '88%', parentName: 'Sarah Watson', parentEmail: 'sarah.w@example.com', comments: 'Strong verbal communicator. Needs extra practice in algebra and geometry.' },
      { id: 'STU-105', name: 'Liam Patel', roll: '10-A-05', math: 88, science: 89, english: 79, cs: 91, attendance: '94%', parentName: 'Vikram Patel', parentEmail: 'vikram.p@example.com', comments: 'Well-rounded student with steady analytical growth in computer science.' }
    ],

    template: {
      schoolName: 'Greenwood International Academy',
      academicYear: '2025 - 2026',
      termName: 'Mid-Term Comprehensive Assessment',
      headerGradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      signatureName: 'Dr. Evelyn Vance (Principal)'
    },

    nodes: [
      {
        id: 'node_1',
        title: 'File Listener / Upload',
        type: 'trigger',
        icon: 'FileSpreadsheet',
        description: 'Detects Class_10_Marks.xlsx file upload or scheduled trigger',
        status: 'idle',
        config: {
          fileSource: 'Class_10_Marks.xlsx',
          sheetName: 'Term_1_Marks',
          recordCount: 5,
          columnsDetected: ['Roll No', 'Student Name', 'Math', 'Science', 'English', 'CS', 'Attendance', 'Parent Email']
        }
      },
      {
        id: 'node_2',
        title: 'Excel Data Parser',
        type: 'datasource',
        icon: 'Table',
        description: 'Extracts rows and structures raw student data array',
        status: 'idle',
        config: {
          parserEngine: 'Spreadsheet-Native',
          dataValidation: 'Strict (No missing marks)',
          recordsExtracted: 5
        }
      },
      {
        id: 'node_3',
        title: 'Grade & Percentage Logic',
        type: 'transform',
        icon: 'Calculator',
        description: 'Computes total out of 400, percentage, letter grades (A+, A, B), and honors flag',
        status: 'idle',
        config: {
          gradingScale: 'A+ (90%+), A (80%+), B (70%+), C (60%+)',
          customRules: 'Flag distinction if CS > 95'
        }
      },
      {
        id: 'node_4',
        title: 'Report Card PDF Generator',
        type: 'generate',
        icon: 'FileText',
        description: 'Binds student variables into school report card template canvas',
        status: 'idle',
        config: {
          templateId: 'tpl_greenwood_std',
          outputFormat: 'PDF Vector Document',
          embedSchoolLogo: true
        }
      },
      {
        id: 'node_5',
        title: 'Teacher Verification Gateway',
        type: 'verify',
        icon: 'UserCheck',
        description: 'Human-in-the-loop check: Teacher reviews synthesized cards before email dispatch',
        status: 'idle',
        config: {
          requiresApproval: true,
          approverRole: 'Class Teacher / Admin',
          status: 'Pending Verification'
        }
      },
      {
        id: 'node_6',
        title: 'Email Dispatch & Archival',
        type: 'action',
        icon: 'Mail',
        description: 'Sends personalized PDF email to parent & archives copy in Google Drive',
        status: 'idle',
        config: {
          smtpService: 'School SendGrid Gateway',
          subjectTemplate: 'Report Card for {{studentName}} - Term 1',
          driveFolder: '/School_Archives/2025/Term_1/'
        }
      }
    ]
  },

  {
    id: 'sales_leads',
    title: '💼 Sales Lead Qualification & Outreach',
    category: 'Sales & CRM',
    badge: 'CRM Automation',
    shortDesc: 'Qualify raw incoming leads, enrich profile, draft personalized email & ping Slack.',
    prompt: "Import incoming leads from CSV, filter leads with budget > $5,000, draft a personalized email proposal using their industry context, and send to lead while notifying the sales team on Slack.",
    
    excelData: [
      { id: 'LEAD-01', name: 'Rachel Green', company: 'Apex Tech Solutions', budget: 12000, industry: 'SaaS', parentEmail: 'rachel@apextech.io', comments: 'High urgency for automation' },
      { id: 'LEAD-02', name: 'David Miller', company: 'Nexus Bio-Health', budget: 8500, industry: 'Healthcare', parentEmail: 'dmiller@nexusbio.com', comments: 'Wants GDPR compliance' },
      { id: 'LEAD-03', name: 'Carlos Rodriguez', company: 'Urban Retail', budget: 3500, industry: 'E-commerce', parentEmail: 'carlos@urbanretail.co', comments: 'Budget below threshold' }
    ],

    template: {
      schoolName: 'Joss Sales Engine',
      academicYear: 'Q4 2025',
      termName: 'Lead Qualification Run',
      headerGradient: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
      signatureName: 'Joss Sales Orchestrator'
    },

    nodes: [
      {
        id: 'node_1',
        title: 'Webhook Lead Capture',
        type: 'trigger',
        icon: 'Zap',
        description: 'Captures new lead form submissions in real-time',
        status: 'idle',
        config: { source: 'Typeform / Hubspot Webhook' }
      },
      {
        id: 'node_2',
        title: 'Lead Filter & Score',
        type: 'transform',
        icon: 'Filter',
        description: 'Evaluates criteria: Budget >= $5,000 & Valid Business Domain',
        status: 'idle',
        config: { rule: 'Budget > 5000' }
      },
      {
        id: 'node_3',
        title: 'AI Intro Email Writer',
        type: 'generate',
        icon: 'Sparkles',
        description: 'Generates customized value proposition email tailored to lead industry',
        status: 'idle',
        config: { tone: 'Professional & Direct' }
      },
      {
        id: 'node_4',
        title: 'Sales Rep Approval',
        type: 'verify',
        icon: 'UserCheck',
        description: 'Sales representative verifies outreach message before dispatch',
        status: 'idle',
        config: { approvalRequired: true }
      },
      {
        id: 'node_5',
        title: 'Send Outreach & Notify Slack',
        type: 'action',
        icon: 'Send',
        description: 'Dispatches email & posts message to #sales-leads channel',
        status: 'idle',
        config: { channel: '#sales-leads' }
      }
    ]
  },

  {
    id: 'invoice_processing',
    title: '📄 Automated PDF Invoice Extraction',
    category: 'Finance',
    badge: 'Document AI',
    shortDesc: 'Extract line items & totals from PDF invoices, append to accounting sheet, flag high amounts.',
    prompt: "Scan incoming PDF invoices in Google Drive, extract vendor name, invoice date, and total amount, log rows into Finance Excel sheet, and notify manager if amount > $2,000.",
    
    excelData: [
      { id: 'INV-901', name: 'CloudScale Hosting', roll: 'INV-2025-09', math: 1450, science: 0, english: 0, cs: 0, attendance: 'Paid', parentName: 'Accounts Payables', parentEmail: 'billing@cloudscale.net', comments: 'Monthly infrastructure servers' },
      { id: 'LEAD-02', name: 'DesignWorks Studio', roll: 'INV-2025-12', math: 3200, science: 0, english: 0, cs: 0, attendance: 'Pending', parentName: 'Finance Manager', parentEmail: 'finance@designworks.io', comments: 'High Amount Flagged ($3,200)' }
    ],

    template: {
      schoolName: 'Enterprise Finance Gateway',
      academicYear: 'FY 2025-26',
      termName: 'Invoice Processing Automation',
      headerGradient: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)',
      signatureName: 'Chief Financial Controller'
    },

    nodes: [
      {
        id: 'node_1',
        title: 'Folder File Monitor',
        type: 'trigger',
        icon: 'FolderSync',
        description: 'Monitors /Invoices/Incoming/ for new PDF documents',
        status: 'idle',
        config: { watchPath: '/Invoices/Incoming/' }
      },
      {
        id: 'node_2',
        title: 'PDF Document OCR & Parser',
        type: 'datasource',
        icon: 'FileText',
        description: 'Extracts invoice metadata: Vendor, Date, Tax, Total Amount',
        status: 'idle',
        config: { ocrEngine: 'Joss Structural Parser' }
      },
      {
        id: 'node_3',
        title: 'Excel / Sheets Row Append',
        type: 'action',
        icon: 'Table',
        description: 'Appends extracted invoice row to Master_Finance_2025.xlsx',
        status: 'idle',
        config: { targetSheet: 'Master_Finance_2025' }
      },
      {
        id: 'node_4',
        title: 'High Amount Alert Guard',
        type: 'verify',
        icon: 'ShieldAlert',
        description: 'If Invoice Total > $2,000, trigger manager review before payout',
        status: 'idle',
        config: { threshold: 2000 }
      }
    ]
  }
];
