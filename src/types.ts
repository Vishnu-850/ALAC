export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  family: string;
  flag: string;
  confidence: number;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'Admissions' | 'Courses' | 'Fees & Scholarships' | 'Examinations' | 'Campus & Hostel' | 'Placements & Careers' | 'General Services';
  content: string;
  keywords: string[];
  lastUpdated: string;
}

export interface RagSource {
  docId: string;
  title: string;
  category: string;
  snippet: string;
  score: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  detectedLanguage?: LanguageInfo;
  englishTranslation?: string;
  romanizedText?: string;
  sources?: RagSource[];
  intent?: string;
  sentiment?: 'positive' | 'neutral' | 'inquisitive' | 'urgent';
  processingTimeMs?: number;
  tokensUsed?: number;
  pipelineSteps?: {
    step: string;
    description: string;
    outputSnippet: string;
    durationMs: number;
  }[];
}

export interface SystemStats {
  totalQueries: number;
  languagesHandled: Record<string, number>;
  averageResponseTimeMs: number;
  knowledgeBaseHits: number;
}
