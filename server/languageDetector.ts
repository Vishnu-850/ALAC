export interface DetectedLanguage {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  family: string;
  flag: string;
  confidence: number;
}

export const LANGUAGE_REGISTRY: Record<string, Omit<DetectedLanguage, 'confidence'>> = {
  te: { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu', family: 'Dravidian', flag: '🇮🇳' },
  hi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', family: 'Indo-Aryan', flag: '🇮🇳' },
  ta: { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil', family: 'Dravidian', flag: '🇮🇳' },
  kn: { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada', family: 'Dravidian', flag: '🇮🇳' },
  mr: { code: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'Devanagari', family: 'Indo-Aryan', flag: '🇮🇳' },
  bn: { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali', family: 'Indo-Aryan', flag: '🇮🇳' },
  gu: { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati', family: 'Indo-Aryan', flag: '🇮🇳' },
  ml: { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', script: 'Malayalam', family: 'Dravidian', flag: '🇮🇳' },
  pa: { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'Gurmukhi', family: 'Indo-Aryan', flag: '🇮🇳' },
  ur: { code: 'ur', name: 'Urdu', nativeName: 'اردو', script: 'Arabic-Persian', family: 'Indo-Aryan', flag: '🇮🇳' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español', script: 'Latin', family: 'Romance', flag: '🇪🇸' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français', script: 'Latin', family: 'Romance', flag: '🇫🇷' },
  de: { code: 'de', name: 'German', nativeName: 'Deutsch', script: 'Latin', family: 'Germanic', flag: '🇩🇪' },
  ja: { code: 'ja', name: 'Japanese', nativeName: '日本語', script: 'Kanji/Kana', family: 'Japonic', flag: '🇯🇵' },
  zh: { code: 'zh', name: 'Chinese', nativeName: '中文', script: 'Hanzi', family: 'Sino-Tibetan', flag: '🇨🇳' },
  ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', script: 'Arabic', family: 'Afroasiatic', flag: '🇸🇦' },
  ru: { code: 'ru', name: 'Russian', nativeName: 'Русский', script: 'Cyrillic', family: 'Slavic', flag: '🇷🇺' },
  pt: { code: 'pt', name: 'Portuguese', nativeName: 'Português', script: 'Latin', family: 'Romance', flag: '🇵🇹' },
  en: { code: 'en', name: 'English', nativeName: 'English', script: 'Latin', family: 'Germanic', flag: '🌐' },
  hinglish: { code: 'hi-Latn', name: 'Hinglish', nativeName: 'Hinglish (Roman Hindi)', script: 'Latin', family: 'Indo-Aryan / Colloquial', flag: '🇮🇳' },
};

// Unicode range checks
export function detectLanguageByScriptAndVocab(text: string): DetectedLanguage {
  if (!text || text.trim().length === 0) {
    return { ...LANGUAGE_REGISTRY.en, confidence: 1.0 };
  }

  const clean = text.trim();

  // 1. Script-based checking
  let teluguChars = 0;
  let devanagariChars = 0;
  let tamilChars = 0;
  let kannadaChars = 0;
  let bengaliChars = 0;
  let gujaratiChars = 0;
  let malayalamChars = 0;
  let punjabiChars = 0;
  let arabicChars = 0;
  let cyrillicChars = 0;
  let japaneseChars = 0;
  let chineseChars = 0;
  let latinChars = 0;

  for (let i = 0; i < clean.length; i++) {
    const code = clean.charCodeAt(i);
    if (code >= 0x0C00 && code <= 0x0C7F) teluguChars++;
    else if (code >= 0x0900 && code <= 0x097F) devanagariChars++;
    else if (code >= 0x0B80 && code <= 0x0BFF) tamilChars++;
    else if (code >= 0x0C80 && code <= 0x0CFF) kannadaChars++;
    else if (code >= 0x0980 && code <= 0x09FF) bengaliChars++;
    else if (code >= 0x0A80 && code <= 0x0AFF) gujaratiChars++;
    else if (code >= 0x0D00 && code <= 0x0D7F) malayalamChars++;
    else if (code >= 0x0A00 && code <= 0x0A7F) punjabiChars++;
    else if (code >= 0x0600 && code <= 0x06FF) arabicChars++;
    else if (code >= 0x0400 && code <= 0x04FF) cyrillicChars++;
    else if ((code >= 0x3040 && code <= 0x309F) || (code >= 0x30A0 && code <= 0x30FF)) japaneseChars++;
    else if (code >= 0x4E00 && code <= 0x9FFF) chineseChars++;
    else if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122) || (code >= 0x00C0 && code <= 0x024F)) latinChars++;
  }

  const totalSpecial = teluguChars + devanagariChars + tamilChars + kannadaChars + bengaliChars + gujaratiChars + malayalamChars + punjabiChars + arabicChars + cyrillicChars + japaneseChars + chineseChars;

  if (teluguChars > 0 && teluguChars >= totalSpecial * 0.4) {
    return { ...LANGUAGE_REGISTRY.te, confidence: Math.min(0.99, 0.85 + (teluguChars / clean.length) * 0.14) };
  }
  if (tamilChars > 0 && tamilChars >= totalSpecial * 0.4) {
    return { ...LANGUAGE_REGISTRY.ta, confidence: Math.min(0.99, 0.85 + (tamilChars / clean.length) * 0.14) };
  }
  if (kannadaChars > 0 && kannadaChars >= totalSpecial * 0.4) {
    return { ...LANGUAGE_REGISTRY.kn, confidence: Math.min(0.99, 0.85 + (kannadaChars / clean.length) * 0.14) };
  }
  if (bengaliChars > 0 && bengaliChars >= totalSpecial * 0.4) {
    return { ...LANGUAGE_REGISTRY.bn, confidence: Math.min(0.99, 0.85 + (bengaliChars / clean.length) * 0.14) };
  }
  if (gujaratiChars > 0 && gujaratiChars >= totalSpecial * 0.4) {
    return { ...LANGUAGE_REGISTRY.gu, confidence: Math.min(0.99, 0.85 + (gujaratiChars / clean.length) * 0.14) };
  }
  if (malayalamChars > 0 && malayalamChars >= totalSpecial * 0.4) {
    return { ...LANGUAGE_REGISTRY.ml, confidence: Math.min(0.99, 0.85 + (malayalamChars / clean.length) * 0.14) };
  }
  if (punjabiChars > 0 && punjabiChars >= totalSpecial * 0.4) {
    return { ...LANGUAGE_REGISTRY.pa, confidence: Math.min(0.99, 0.85 + (punjabiChars / clean.length) * 0.14) };
  }
  if (arabicChars > 0 && arabicChars >= totalSpecial * 0.4) {
    return { ...LANGUAGE_REGISTRY.ar, confidence: Math.min(0.99, 0.85 + (arabicChars / clean.length) * 0.14) };
  }
  if (cyrillicChars > 0 && cyrillicChars >= totalSpecial * 0.4) {
    return { ...LANGUAGE_REGISTRY.ru, confidence: Math.min(0.99, 0.85 + (cyrillicChars / clean.length) * 0.14) };
  }
  if (japaneseChars > 0) {
    return { ...LANGUAGE_REGISTRY.ja, confidence: Math.min(0.99, 0.88 + (japaneseChars / clean.length) * 0.11) };
  }
  if (chineseChars > 0) {
    return { ...LANGUAGE_REGISTRY.zh, confidence: Math.min(0.99, 0.88 + (chineseChars / clean.length) * 0.11) };
  }

  // Devanagari can be Hindi or Marathi
  if (devanagariChars > 0 && devanagariChars >= totalSpecial * 0.4) {
    // Check Marathi specific words / markers (e.g. आहे, कसे, माहिती, कधी, फी)
    const marathiWords = ['आहे', 'आहेत', 'कसे', 'काय', 'कधी', 'माहिती', 'प्रवेश', 'शुल्क', 'विद्यार्थी', 'करावे', 'होते', 'मिळेल'];
    const hasMarathi = marathiWords.some(w => clean.includes(w));
    if (hasMarathi && (clean.includes('आहे') || clean.includes('मिळेल') || clean.includes('कसे') || clean.includes('करावे'))) {
      return { ...LANGUAGE_REGISTRY.mr, confidence: 0.94 };
    }
    return { ...LANGUAGE_REGISTRY.hi, confidence: 0.96 };
  }

  // 2. Latin script checking (English, Spanish, French, German, Hinglish)
  const lower = clean.toLowerCase();

  // Hinglish / Romanized Hindi keywords check
  const hinglishMarkers = [
    'kya', 'kaise', 'kitna', 'kitni', 'chahiye', 'hoga', 'hogi', 'hai', 'hain', 'kab',
    'kaha', 'admission ke liye', 'fees kitni', 'exam kab', 'scholarship milegi', 'hostel kaisa',
    'mujhe', 'humko', 'karna hai', 'batao', 'boliye', 'namaste', 'shukriya', 'milega', 'dena hoga'
  ];
  const isHinglish = hinglishMarkers.some(marker => lower.includes(marker));
  if (isHinglish) {
    return { ...LANGUAGE_REGISTRY.hinglish, confidence: 0.92 };
  }

  // Spanish markers
  const spanishMarkers = ['hola', 'cuál', 'cual', 'cómo', 'como', 'cuánto', 'cuanto', 'dónde', 'donde', 'qué', 'que', 'becas', 'matrícula', 'matricula', 'universidad', 'exámenes', 'examenes', 'horario', 'gracias', 'por favor', 'estudiantes', 'carrera', 'requisitos'];
  const hasSpanish = spanishMarkers.some(m => new RegExp(`\\b${m}\\b`, 'i').test(lower));
  if (hasSpanish || lower.includes('¿') || lower.includes('¡') || lower.includes('estudiantes') || lower.includes('cuanto cuesta') || lower.includes('politica de')) {
    return { ...LANGUAGE_REGISTRY.es, confidence: 0.95 };
  }

  // French markers
  const frenchMarkers = ['bonjour', 'quels', 'quelles', 'quel', 'quelle', 'comment', 'combien', 'cours', 'frais', 'bourse', 'admission', 'merci', 's\'il vous plaît', 'étudiants', 'examen', 'universitaire', 'logement', 'horaires'];
  const hasFrench = frenchMarkers.some(m => new RegExp(`\\b${m}\\b`, 'i').test(lower));
  if (hasFrench || lower.includes('s\'il') || lower.includes('qu\'est') || lower.includes('d\'admission') || lower.includes('université')) {
    return { ...LANGUAGE_REGISTRY.fr, confidence: 0.95 };
  }

  // German markers
  const germanMarkers = ['hallo', 'wie', 'was', 'wo', 'wann', 'kosten', 'gebühren', 'stipendium', 'zulassung', 'prüfung', 'prüfungen', 'studium', 'universität', 'bitte', 'danke', 'unterkunft'];
  const hasGerman = germanMarkers.some(m => new RegExp(`\\b${m}\\b`, 'i').test(lower));
  if (hasGerman || lower.includes('wie viel') || lower.includes('wann ist') || lower.includes('universität')) {
    return { ...LANGUAGE_REGISTRY.de, confidence: 0.95 };
  }

  // Portuguese markers
  const portugueseMarkers = ['olá', 'ola', 'qual', 'quais', 'quanto', 'como', 'onde', 'bolsa', 'matrícula', 'estudantes', 'obrigado', 'horário'];
  const hasPortuguese = portugueseMarkers.some(m => new RegExp(`\\b${m}\\b`, 'i').test(lower));
  if (hasPortuguese) {
    return { ...LANGUAGE_REGISTRY.pt, confidence: 0.93 };
  }

  // Default to English
  return { ...LANGUAGE_REGISTRY.en, confidence: 0.98 };
}
