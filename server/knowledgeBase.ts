import { KnowledgeDocument, RagSource } from '../src/types';

// In-memory persistent knowledge base store for the college domain
let knowledgeDocuments: KnowledgeDocument[] = [
  {
    id: 'kb-adm-001',
    title: 'Undergraduate B.Tech Admissions & Eligibility',
    category: 'Admissions',
    content: `Eligibility for B.Tech programs requires a minimum of 60% aggregate marks (55% for reserved categories) in 10+2 (Physics, Chemistry, Mathematics). Admissions are conducted through State Entrance Tests (EAMCET/CET), JEE Main scores, and Management Quota counseling. Application forms open in May each year with counseling beginning in July. Key documents needed: 10th & 12th marks memos, Transfer Certificate (TC), Conduct Certificate, Caste/Income Certificate (if applicable), and Passport-size photos.`,
    keywords: ['btech', 'admission', 'eligibility', 'jee', 'eamcet', 'criteria', 'documents', 'marks', 'percentage', 'apply', 'counseling', '10+2', 'pravesh', 'dakhila'],
    lastUpdated: '2026-06-15'
  },
  {
    id: 'kb-adm-002',
    title: 'Postgraduate M.Tech, MBA & MCA Admissions',
    category: 'Admissions',
    content: `Postgraduate admissions require a valid Bachelor's degree (B.Tech/BE for M.Tech, any graduate degree with 50% for MBA, and BCA/B.Sc Computer Science or Mathematics for MCA). Qualified GATE, TS ICET, CAT, or MAT scores are accepted. Applications open from April through July. Sponsored category seats are also available for working professionals with at least 2 years of industrial experience.`,
    keywords: ['mtech', 'mba', 'mca', 'postgraduate', 'pg', 'gate', 'icet', 'cat', 'mat', 'degree', 'masters'],
    lastUpdated: '2026-06-10'
  },
  {
    id: 'kb-fee-001',
    title: 'Tuition Fee Structure and Installment Schedule',
    category: 'Fees & Scholarships',
    content: `Annual tuition fee for B.Tech (CSE, AI & ML, Data Science) is ₹1,25,000 per year. For Core branches (ECE, EEE, Mechanical, Civil), the fee is ₹95,000 per year. M.Tech tuition fee is ₹80,000 per annum, and MBA/MCA is ₹75,000 per annum. Additional fees: One-time admission & library deposit is ₹10,000 (refundable). Examination fees are ₹1,500 per semester. Fees can be paid in two equal installments (Semester 1 in July, Semester 2 in December) via the online student portal (UPI/Net Banking/Cards) or demand draft.`,
    keywords: ['fee', 'tuition', 'cost', 'installment', 'payment', 'btech fee', 'cse fee', 'charges', 'online payment', 'shulk', 'feezu', 'kharch'],
    lastUpdated: '2026-07-01'
  },
  {
    id: 'kb-fee-002',
    title: 'Scholarships, Fee Reimbursement & Financial Aid',
    category: 'Fees & Scholarships',
    content: `1. Merit Scholarship: 50% tuition waiver for students scoring >95% in 10+2 or top 500 in entrance exams. 25% waiver for 90-94.9%. 
2. Government Fee Reimbursement: 100% tuition coverage for eligible SC/ST/BC/EBC students through ePASS / State portals with parental income < ₹2,00,000/annum.
3. Need-based Financial Aid: Up to ₹40,000 stipend per year for economically weaker students upon application to the Dean of Student Affairs before August 31.
4. Sports & Cultural Excellence: 20% concession for national/state level players.`,
    keywords: ['scholarship', 'waiver', 'fee reimbursement', 'epass', 'concession', 'financial aid', 'merit', 'stipend', 'chhatravritti', 'sahayata'],
    lastUpdated: '2026-06-20'
  },
  {
    id: 'kb-fee-003',
    title: 'Fee Refund and Cancellation Policy',
    category: 'Fees & Scholarships',
    content: `If a student cancels admission:
- 15 days or more before formal closure of admissions: 100% refund of tuition fees deducting ₹1,000 processing fee.
- Less than 15 days before closure: 90% refund.
- Up to 15 days after commencement of classes: 80% refund.
- More than 30 days after class start: Only security and caution deposits are refundable.
Refund requests must be submitted online through the admissions desk portal with proof of bank account details.`,
    keywords: ['refund', 'cancellation', 'withdraw', 'money back', 'reimbursement policy', 'return fee'],
    lastUpdated: '2026-05-12'
  },
  {
    id: 'kb-exm-001',
    title: 'Examination Schedule, Timetable & Hall Tickets',
    category: 'Examinations',
    content: `Odd Semester Mid-term exams (Mid-1) are held in October, Mid-2 in December, and End-Semester Final Exams in January.
Even Semester Mid-1 is in March, Mid-2 in May, and Semester Finals in June.
Exam timetables are published on the college ERP portal 3 weeks prior to commencement.
Hall Tickets can be downloaded online 5 days before the exams once student attendance is verified (minimum 75% attendance mandatory).`,
    keywords: ['exam', 'timetable', 'schedule', 'hall ticket', 'admit card', 'semester exam', 'mid term', 'pariksha', 'theeruvu'],
    lastUpdated: '2026-07-15'
  },
  {
    id: 'kb-exm-002',
    title: 'Grading System (CGPA), Passing Criteria & Revaluation',
    category: 'Examinations',
    content: `The college follows a 10-point relative grading scale:
- O (Outstanding): 10 grade points (90-100%)
- A+ (Excellent): 9 points (80-89%)
- A (Very Good): 8 points (70-79%)
- B+ (Good): 7 points (60-69%)
- B (Above Average): 6 points (50-59%)
- C (Pass): 5 points (40-49%)
- F (Fail/Backlog): <40%
Passing requirement is 40% in end-semester exams and 40% overall in continuous evaluation. Revaluation/Recounting fee is ₹600 per subject, applicable within 10 days of result announcement.`,
    keywords: ['cgpa', 'grading', 'pass mark', 'passing marks', 'revaluation', 'recounting', 'backlog', 'grade', 'percentage calculation'],
    lastUpdated: '2026-06-25'
  },
  {
    id: 'kb-hst-001',
    title: 'Hostel Accommodation, Amenities & Mess Details',
    category: 'Campus & Hostel',
    content: `Separate on-campus hostels for boys and girls with 24/7 security, Wi-Fi, air-conditioned and non-AC rooms (2-sharing and 3-sharing).
Hostel Fees: Non-AC 3-sharing is ₹75,000/year (including 4-meal daily hygienic South & North Indian mess). AC 2-sharing is ₹1,10,000/year.
Amenities include 24/7 power backup, solar hot water, laundry service, study rooms, gym, indoor badminton court, and medical first-aid center. Hostel gate curfew is 9:00 PM for safety.`,
    keywords: ['hostel', 'room', 'mess', 'food', 'accommodation', 'living', 'curfew', 'gym', 'wifi', 'rent', 'vasathi'],
    lastUpdated: '2026-07-02'
  },
  {
    id: 'kb-plc-001',
    title: 'Training, Placement Cell & Campus Recruitment',
    category: 'Placements & Careers',
    content: `The Career Development & Placement Cell (CDPC) has achieved a 94% placement rate in the 2025-26 academic cycle.
Highest Package offered: ₹44 LPA (International / Tier 1 Product).
Average Package: ₹7.8 LPA.
Top Recruiters include Google, Microsoft, Amazon, Infosys, TCS, Cognizant, L&T, Deloitte, Accenture, and Qualcomm.
Pre-placement training includes mock coding contests, technical interview preparation, soft-skills workshops, and resume building starting from 5th semester.`,
    keywords: ['placement', 'jobs', 'recruiters', 'package', 'salary', 'lpa', 'companies', 'internship', 'training', 'career', 'udyogam', 'naukri'],
    lastUpdated: '2026-08-01'
  },
  {
    id: 'kb-crs-001',
    title: 'Engineering Programs & Department Offerings',
    category: 'Courses',
    content: `The college offers accredited B.Tech degrees in:
1. Computer Science & Engineering (CSE) - 240 seats
2. Artificial Intelligence & Machine Learning (AI & ML) - 180 seats
3. Data Science & Cyber Security - 120 seats
4. Electronics & Communication Engineering (ECE) - 180 seats
5. Electrical & Electronics Engineering (EEE) - 60 seats
6. Mechanical & Automation Engineering - 60 seats
7. Civil Engineering - 60 seats
All programs feature hands-on laboratory modules, industry-guided electives, IoT labs, and mandatory 6-month final-year capstone projects.`,
    keywords: ['courses', 'programs', 'branches', 'engineering', 'cse', 'aiml', 'ece', 'syllabus', 'departments', 'curriculum', 'seats'],
    lastUpdated: '2026-07-10'
  },
  {
    id: 'kb-gen-001',
    title: 'Library, Digital Portal & Student Services',
    category: 'General Services',
    content: `The Central Central Library holds over 85,000 volumes, 200 print journals, and subscriptions to IEEE Xplore, ScienceDirect, and SpringerLink.
Open hours: 8:00 AM to 10:00 PM (extended till midnight during exam weeks).
Student Portal / ERP credentials provide access to digital attendance, grade cards, fee receipts, bus transport tracking, and bonafide certificate requests.
Helpdesk email: support@college.edu | Contact: +91 040 2345 6789 (Mon-Sat, 9 AM - 5 PM).`,
    keywords: ['library', 'portal', 'erp', 'books', 'timing', 'bonafide', 'certificate', 'bus', 'transport', 'contact', 'support', 'helpdesk'],
    lastUpdated: '2026-06-18'
  }
];

export function getAllDocuments(): KnowledgeDocument[] {
  return [...knowledgeDocuments];
}

export function addDocument(doc: Omit<KnowledgeDocument, 'id' | 'lastUpdated'>): KnowledgeDocument {
  const newDoc: KnowledgeDocument = {
    ...doc,
    id: `kb-custom-${Date.now()}`,
    lastUpdated: new Date().toISOString().split('T')[0]
  };
  knowledgeDocuments.unshift(newDoc);
  return newDoc;
}

export function deleteDocument(id: string): boolean {
  const initialLen = knowledgeDocuments.length;
  knowledgeDocuments = knowledgeDocuments.filter(d => d.id !== id);
  return knowledgeDocuments.length < initialLen;
}

// RAG Search Algorithm: Token matching + keyword boosting + intent matching
export function retrieveRagSources(query: string, limit: number = 3): RagSource[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const cleanQuery = query.toLowerCase();
  const queryTokens = cleanQuery
    .replace(/[^\w\s\u0C00-\u0C7F\u0900-\u097F\u0B80-\u0BFF\u0C80-\u0CFF\u0980-\u09FF]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);

  // Common cross-lingual mapping for college domain terms
  const crossLingualMap: Record<string, string[]> = {
    'fee': ['fee', 'tuition', 'cost', 'charges', 'installment', 'refund', 'shulk', 'feezu', 'kharch', 'ధర', 'ఫీజు', 'शुल्क', 'खर्च', 'कटाव'],
    'admission': ['admission', 'admissions', 'apply', 'eligibility', 'criteria', '10+2', 'pravesh', 'dakhila', 'ప్రవేశం', 'दाखिला', 'प्रवेश', 'சேர்க்கை'],
    'exam': ['exam', 'exams', 'examination', 'timetable', 'schedule', 'hall ticket', 'cgpa', 'grading', 'pass mark', 'pariksha', 'theeruvu', 'పరీక్ష', 'परीक', 'தேர்வு'],
    'scholarship': ['scholarship', 'waiver', 'concession', 'epass', 'aid', 'chhatravritti', 'స్కాలర్‌షిప్', 'छात्रवृत्ति', 'உதவித்தொகை'],
    'hostel': ['hostel', 'mess', 'food', 'room', 'accommodation', 'vasathi', 'హాస్టల్', 'छात्रावास', 'விடுதி'],
    'placement': ['placement', 'placements', 'jobs', 'salary', 'lpa', 'recruiters', 'package', 'career', 'నౌకరి', 'ఉద్యోగం', 'प्लेसमेंट', 'नौकरी', 'வேலை'],
    'courses': ['course', 'courses', 'branch', 'btech', 'mtech', 'mba', 'mca', 'cse', 'ai', 'కోర్సులు', 'पाठ्यक्रम', 'பாடநெறி']
  };

  const scoredDocs = knowledgeDocuments.map(doc => {
    let score = 0;
    const docFullText = `${doc.title} ${doc.category} ${doc.content} ${doc.keywords.join(' ')}`.toLowerCase();

    // 1. Direct token matching
    for (const token of queryTokens) {
      if (doc.title.toLowerCase().includes(token)) {
        score += 3.5;
      }
      if (doc.keywords.some(k => k.toLowerCase().includes(token) || token.includes(k.toLowerCase()))) {
        score += 2.5;
      }
      if (doc.content.toLowerCase().includes(token)) {
        score += 1.0;
      }
    }

    // 2. Cross-lingual mapping enrichment
    for (const [concept, variants] of Object.entries(crossLingualMap)) {
      const queryMatchesConcept = variants.some(v => cleanQuery.includes(v.toLowerCase()));
      const docMatchesConcept = variants.some(v => docFullText.includes(v.toLowerCase()));
      if (queryMatchesConcept && docMatchesConcept) {
        score += 4.0;
      }
    }

    // Snippet extraction
    let snippet = doc.content.slice(0, 220) + '...';
    // Find best match line
    const sentences = doc.content.split(/\.\s+/);
    for (const sentence of sentences) {
      const sentenceLower = sentence.toLowerCase();
      if (queryTokens.some(t => sentenceLower.includes(t))) {
        snippet = sentence.trim() + '...';
        break;
      }
    }

    return {
      docId: doc.id,
      title: doc.title,
      category: doc.category,
      snippet,
      score: Math.round(score * 10) / 10
    };
  });

  // Filter and sort by highest relevance
  const filtered = scoredDocs
    .filter(d => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  // If score is 0 on all due to high language divergence, provide top 2 general admissions/services as fallback
  if (filtered.length === 0 && knowledgeDocuments.length > 0) {
    return knowledgeDocuments.slice(0, 2).map(doc => ({
      docId: doc.id,
      title: doc.title,
      category: doc.category,
      snippet: doc.content.slice(0, 200) + '...',
      score: 1.0
    }));
  }

  return filtered;
}
