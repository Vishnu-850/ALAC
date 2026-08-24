// Speech synthesis and recognition utilities for multilingual voice support

export const LANGUAGE_VOICE_MAP: Record<string, string[]> = {
  te: ['te-IN', 'te_IN', 'tel'],
  hi: ['hi-IN', 'hi_IN', 'hin'],
  ta: ['ta-IN', 'ta_IN', 'tam'],
  kn: ['kn-IN', 'kn_IN', 'kan'],
  mr: ['mr-IN', 'mr_IN', 'mar'],
  bn: ['bn-IN', 'bn_IN', 'ben'],
  gu: ['gu-IN', 'gu_IN', 'guj'],
  ml: ['ml-IN', 'ml_IN', 'mal'],
  pa: ['pa-IN', 'pa_IN', 'pan'],
  ur: ['ur-IN', 'ur-PK', 'urd'],
  es: ['es-ES', 'es-MX', 'es-US', 'spa'],
  fr: ['fr-FR', 'fr-CA', 'fre'],
  de: ['de-DE', 'de-AT', 'ger'],
  ja: ['ja-JP', 'jpn'],
  zh: ['zh-CN', 'zh-TW', 'zho'],
  ar: ['ar-SA', 'ar-AE', 'ara'],
  ru: ['ru-RU', 'rus'],
  pt: ['pt-BR', 'pt-PT', 'por'],
  en: ['en-US', 'en-GB', 'en-IN'],
  'hi-Latn': ['hi-IN', 'en-IN']
};

export function speakText(
  text: string,
  langCode: string = 'en',
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis is not supported in this browser.');
    return () => {};
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip markdown formatting before speaking
  const plainText = text
    .replace(/[#*_`~[\]]/g, '')
    .replace(/https?:\/\/[^\s]+/g, '')
    .trim();

  if (!plainText) return () => {};

  const utterance = new SpeechSynthesisUtterance(plainText);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  // Find best matching voice
  const voices = window.speechSynthesis.getVoices();
  const targetCodes = LANGUAGE_VOICE_MAP[langCode] || ['en-US'];

  let matchedVoice = voices.find(v => targetCodes.some(code => v.lang.toLowerCase().includes(code.toLowerCase())));
  if (!matchedVoice) {
    // try finding by language prefix
    const prefix = langCode.split('-')[0];
    matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
  }

  if (matchedVoice) {
    utterance.voice = matchedVoice;
    utterance.lang = matchedVoice.lang;
  } else {
    utterance.lang = targetCodes[0] || 'en-US';
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  if (onError) utterance.onerror = onError;

  window.speechSynthesis.speak(utterance);

  // Return cancel function
  return () => {
    window.speechSynthesis.cancel();
    if (onEnd) onEnd();
  };
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

export function createSpeechRecognizer(
  langCode: string = 'en-US',
  onResult: (transcript: string, isFinal: boolean) => void,
  onError: (err: any) => void,
  onEnd: () => void
) {
  if (!isSpeechRecognitionSupported()) {
    throw new Error('Speech recognition not supported in this browser.');
  }

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognizer = new SpeechRecognition();

  recognizer.continuous = false;
  recognizer.interimResults = true;
  
  // Set recognition language
  const targetCodes = LANGUAGE_VOICE_MAP[langCode] || ['en-US'];
  recognizer.lang = targetCodes[0] || 'en-US';

  recognizer.onresult = (event: any) => {
    let interim = '';
    let final = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final += event.results[i][0].transcript;
      } else {
        interim += event.results[i][0].transcript;
      }
    }

    if (final) {
      onResult(final, true);
    } else if (interim) {
      onResult(interim, false);
    }
  };

  recognizer.onerror = onError;
  recognizer.onend = onEnd;

  return recognizer;
}
