import React from 'react';
import { Sparkles, Globe2 } from 'lucide-react';

interface QuickPromptsProps {
  onSelectPrompt: (promptText: string) => void;
  disabled?: boolean;
}

interface PromptSample {
  lang: string;
  flag: string;
  query: string;
  englishMeaning: string;
  category: string;
}

const SAMPLE_PROMPTS: PromptSample[] = [
  {
    lang: 'Telugu',
    flag: '🇮🇳',
    query: 'కళాశాలలో B.Tech కంప్యూటర్ సైన్స్ వార్షిక ఫీజు ఎంత?',
    englishMeaning: 'What is the annual fee for B.Tech Computer Science in the college?',
    category: 'Fees'
  },
  {
    lang: 'Hindi',
    flag: '🇮🇳',
    query: 'छात्रवृत्ति (Scholarship) और शुल्क प्रतिपूर्ति के लिए पात्रता क्या है?',
    englishMeaning: 'What is the eligibility for scholarship and fee reimbursement?',
    category: 'Scholarships'
  },
  {
    lang: 'Tamil',
    flag: '🇮🇳',
    query: 'செமஸ்டர் தேர்வு அட்டவணை மற்றும் ஹால் டிக்கெட் எப்போது கிடைக்கும்?',
    englishMeaning: 'When will the semester exam schedule and hall ticket be available?',
    category: 'Examinations'
  },
  {
    lang: 'Kannada',
    flag: '🇮🇳',
    query: 'ಹಾಸ್ಟೆಲ್ ಸೌಲಭ್ಯಗಳು, ಊಟದ ವ್ಯವಸ್ಥೆ ಮತ್ತು ಶುಲ್ಕದ ವಿವರಗಳು ತಿಳಿಸಿ.',
    englishMeaning: 'Tell me hostel facilities, mess arrangements, and fee details.',
    category: 'Hostel'
  },
  {
    lang: 'Marathi',
    flag: '🇮🇳',
    query: 'B.Tech प्रवेशासाठी आवश्यक कागदपत्रे आणि किमान टक्केवारी किती आहे?',
    englishMeaning: 'What are the required documents and minimum percentage for B.Tech admission?',
    category: 'Admissions'
  },
  {
    lang: 'Bengali',
    flag: '🇮🇳',
    query: 'কলেজের প্লেসমেন্ট রেকর্ড এবং সর্বোচ্চ প্যাকেজ কত?',
    englishMeaning: 'What is the college placement record and highest package?',
    category: 'Placements'
  },
  {
    lang: 'Hinglish',
    flag: '🇮🇳',
    query: 'B.Tech admission ke liye documents kya chahiye aur counseling kab start hogi?',
    englishMeaning: 'What documents are needed for B.Tech admission and when does counseling start?',
    category: 'Admissions'
  },
  {
    lang: 'Spanish',
    flag: '🇪🇸',
    query: '¿Cuáles son los requisitos de admisión y la política de reembolso de matrícula?',
    englishMeaning: 'What are the admission requirements and tuition refund policy?',
    category: 'Admissions & Refund'
  },
  {
    lang: 'French',
    flag: '🇫🇷',
    query: 'Quels sont les programmes d\'ingénierie disponibles et les options d\'hébergement?',
    englishMeaning: 'What engineering programs are available and what are the housing options?',
    category: 'Courses & Campus'
  },
  {
    lang: 'German',
    flag: '🇩🇪',
    query: 'Wie hoch sind die Studiengebühren und welche Stipendien werden angeboten?',
    englishMeaning: 'How high are the tuition fees and what scholarships are offered?',
    category: 'Fees & Aid'
  },
  {
    lang: 'English',
    flag: '🌐',
    query: 'What is the grading scale (CGPA) and revaluation procedure for semester exams?',
    englishMeaning: 'What is the grading scale (CGPA) and revaluation procedure for semester exams?',
    category: 'Examinations'
  }
];

export const QuickPrompts: React.FC<QuickPromptsProps> = ({ onSelectPrompt, disabled }) => {
  return (
    <div id="quick-prompts-container" className="py-2.5 px-4 bg-slate-50/80 border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Globe2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Test Language-Agnostic Regional Prompts:</span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            (Click any query to see zero-configuration automatic detection & response)
          </span>
        </div>

        <div id="prompt-chips-carousel" className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {SAMPLE_PROMPTS.map((sample, idx) => (
            <button
              key={idx}
              id={`quick-prompt-${sample.lang.toLowerCase()}`}
              disabled={disabled}
              onClick={() => onSelectPrompt(sample.query)}
              title={`${sample.lang}: ${sample.englishMeaning}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left text-xs text-slate-800 transition-all shrink-0 shadow-2xs hover:shadow-xs group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-sm">{sample.flag}</span>
              <span className="font-semibold text-indigo-700 text-[11px] group-hover:underline">
                {sample.lang}
              </span>
              <span className="text-slate-400 text-[10px]">|</span>
              <span className="truncate max-w-[200px] text-slate-600 group-hover:text-slate-900">
                {sample.query}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
