import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, LanguageInfo } from '../types';
import { MessageItem } from './MessageItem';
import { QuickPrompts } from './QuickPrompts';
import { Send, Mic, MicOff, Trash2, Sparkles, Loader2, Globe, ShieldCheck } from 'lucide-react';
import { createSpeechRecognizer, isSpeechRecognitionSupported, speakText } from '../utils/speechUtils';

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onClearChat: () => void;
  autoSpeak: boolean;
  onDetectedLangChange?: (lang: LanguageInfo) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onClearChat,
  autoSpeak,
  onDetectedLangChange
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [liveLang, setLiveLang] = useState<LanguageInfo | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRecognizerRef = useRef<any>(null);
  const debounceTimerRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Live language detection as user types
  useEffect(() => {
    if (!inputText.trim()) {
      setLiveLang(null);
      return;
    }

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/detect-language', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputText })
        });
        if (res.ok) {
          const data = await res.json();
          setLiveLang(data);
          if (onDetectedLangChange) onDetectedLangChange(data);
        }
      } catch (e) {
        // silent fail
      }
    }, 250);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [inputText, onDetectedLangChange]);

  // Auto-speak latest assistant message if autoSpeak is enabled
  useEffect(() => {
    if (!autoSpeak || messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role === 'assistant') {
      speakText(lastMsg.content, lastMsg.detectedLanguage?.code || 'en');
    }
  }, [messages, autoSpeak]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const query = inputText;
    setInputText('');
    setLiveLang(null);
    if (isListening && speechRecognizerRef.current) {
      speechRecognizerRef.current.stop();
      setIsListening(false);
    }
    await onSendMessage(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleVoiceInput = () => {
    if (!isSpeechRecognitionSupported()) {
      setSpeechError('Speech recognition is not supported in your browser. Please type your query.');
      setTimeout(() => setSpeechError(null), 4000);
      return;
    }

    if (isListening) {
      if (speechRecognizerRef.current) {
        speechRecognizerRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      setSpeechError(null);
      // If live language was detected, listen in that dialect or default multi
      const langCode = liveLang?.code || 'en-IN';
      const recognizer = createSpeechRecognizer(
        langCode,
        (transcript, isFinal) => {
          setInputText(transcript);
          if (isFinal) {
            setIsListening(false);
          }
        },
        (err) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
          if (err.error !== 'no-speech') {
            setSpeechError(`Voice input: ${err.error || 'Check microphone permissions'}`);
            setTimeout(() => setSpeechError(null), 4000);
          }
        },
        () => {
          setIsListening(false);
        }
      );

      speechRecognizerRef.current = recognizer;
      recognizer.start();
      setIsListening(true);
    } catch (err: any) {
      setSpeechError(err.message || 'Microphone access failed.');
      setIsListening(false);
      setTimeout(() => setSpeechError(null), 4000);
    }
  };

  return (
    <div id="chat-view-container" className="flex-1 flex flex-col min-h-0 bg-slate-50/60 relative overflow-hidden">
      {/* Quick Regional Prompts Carousel */}
      <QuickPrompts onSelectPrompt={(text) => onSendMessage(text)} disabled={isLoading} />

      {/* Messages Scroll Area */}
      <div id="chat-messages-area" className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-5 md:p-6 max-w-4xl w-full mx-auto space-y-4">
        {messages.length === 0 && (
          <div id="empty-state-card" className="my-6 p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl shadow-xs text-center max-w-xl mx-auto">
            <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-3">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5">
              Language-Agnostic College Information Desk
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
              Ask your questions in <strong>any language or script</strong> (Telugu, Hindi, Tamil, Kannada, Marathi, Bengali, Spanish, French, German, Hinglish, or English). No language setting change is required.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="font-semibold text-xs text-slate-900 mb-0.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Auto-Detect
                </div>
                <p className="text-[11px] text-slate-500">
                  Instant identification of script & dialect.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="font-semibold text-xs text-slate-900 mb-0.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  RAG Grounded
                </div>
                <p className="text-[11px] text-slate-500">
                  Verified college policies & fee structures.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="font-semibold text-xs text-slate-900 mb-0.5 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-blue-600" />
                  Voice (TTS)
                </div>
                <p className="text-[11px] text-slate-500">
                  Native speech recognition & voice playback.
                </p>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div id="chat-loading-indicator" className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-2xl max-w-md shadow-xs animate-pulse">
            <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
            <div className="text-xs text-slate-600 min-w-0">
              <p className="font-semibold text-slate-800">Processing Language & Knowledge Pipeline...</p>
              <p className="text-[11px] text-slate-500 truncate">Detecting language • Searching RAG database • Synthesizing response</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input & Control Box */}
      <div id="chat-input-container" className="bg-white border-t border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3 shrink-0 shadow-xs">
        <div className="max-w-4xl mx-auto">
          {/* Error Banner */}
          {speechError && (
            <div className="mb-2 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center justify-between">
              <span>{speechError}</span>
              <button onClick={() => setSpeechError(null)} className="font-bold ml-2">×</button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative flex flex-col gap-1.5">
            <div className="relative flex items-center">
              <textarea
                id="chat-input-textarea"
                rows={2}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type or speak query in Telugu, Hindi, Tamil, Spanish, Hinglish, English, etc..."
                className="w-full pl-3.5 pr-20 py-2.5 bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 resize-none transition-all outline-hidden min-h-[50px] max-h-[120px]"
              />

              {/* In-Input Buttons (Mic & Send) */}
              <div className="absolute right-2.5 flex items-center gap-1.5">
                {/* Voice Input Button */}
                <button
                  type="button"
                  id="btn-voice-input"
                  onClick={toggleVoiceInput}
                  title={isListening ? 'Stop listening' : 'Speak your query in your language'}
                  className={`p-1.5 sm:p-2 rounded-lg border transition-all ${
                    isListening
                      ? 'bg-rose-500 text-white border-rose-600 animate-bounce'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-indigo-600'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  id="btn-send-message"
                  disabled={!inputText.trim() || isLoading}
                  className="p-1.5 sm:p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Bar: Live Detection Pill & Chat Controls */}
            <div className="flex items-center justify-between px-1 text-[11px]">
              <div className="flex items-center gap-2 min-w-0">
                {liveLang && inputText.trim().length > 2 && (
                  <span
                    id="live-input-lang-badge"
                    className="inline-flex items-center gap-1 text-indigo-700 font-medium bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 animate-fadeIn truncate"
                  >
                    <span>{liveLang.flag}</span>
                    <span className="truncate">Detected: <strong>{liveLang.name}</strong> ({liveLang.script} Script)</span>
                  </span>
                )}
                {isListening && (
                  <span className="text-rose-600 font-medium flex items-center gap-1 animate-pulse truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0"></span>
                    Listening to voice...
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {messages.length > 0 && (
                  <button
                    type="button"
                    id="btn-clear-chat"
                    onClick={onClearChat}
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
                <span className="text-slate-400 hidden sm:inline">Enter ↵ to send</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
