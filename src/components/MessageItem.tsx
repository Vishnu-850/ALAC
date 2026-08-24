import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { ChatMessage } from '../types';
import { Volume2, VolumeX, Globe, BookOpen, Layers, CheckCircle2, ChevronDown, ChevronUp, Clock, Tag, Copy, Check } from 'lucide-react';
import { speakText } from '../utils/speechUtils';

interface MessageItemProps {
  message: ChatMessage;
  onOpenKnowledgeDoc?: (docId: string) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showEnglishTranslation, setShowEnglishTranslation] = useState(false);
  const [showRomanized, setShowRomanized] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [showPipelineDetails, setShowPipelineDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const isUser = message.role === 'user';
  const lang = message.detectedLanguage;

  const handleSpeak = () => {
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const langCode = lang?.code || 'en';
    setIsPlayingAudio(true);
    speakText(
      message.content,
      langCode,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id={`chat-message-${message.id}`}
      className={`flex flex-col mb-3.5 w-full ${isUser ? 'items-end' : 'items-start'} transition-all`}
    >
      {/* Sender Header & Language Detection Badge */}
      <div className="flex items-center gap-2 mb-1 px-1 max-w-full overflow-hidden flex-wrap">
        <span className="text-[11px] font-semibold text-slate-500 shrink-0">
          {isUser ? 'You' : 'College AI Assistant'}
        </span>

        {lang && (
          <span
            id={`lang-badge-${message.id}`}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 border border-slate-200 text-slate-700 shadow-2xs truncate"
            title={`Detected Language: ${lang.name} (${lang.nativeName}) - Script: ${lang.script} - Family: ${lang.family}`}
          >
            <span>{lang.flag}</span>
            <span className="truncate">{lang.name}</span>
            {lang.confidence && (
              <span className="text-slate-400 font-mono text-[9px]">
                {Math.round(lang.confidence * 100)}%
              </span>
            )}
          </span>
        )}

        <span className="text-[10px] text-slate-400 shrink-0">{message.timestamp}</span>
      </div>

      {/* Message Bubble Card */}
      <div
        id={`bubble-${message.id}`}
        className={`w-auto max-w-[92%] sm:max-w-3xl rounded-2xl p-3.5 sm:p-4 transition-all shadow-xs break-words overflow-hidden ${
          isUser
            ? 'bg-indigo-600 text-white rounded-tr-xs'
            : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs'
        }`}
      >
        {/* Main Text Content */}
        {isUser ? (
          <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-normal break-words">
            {message.content}
          </div>
        ) : (
          <div className="markdown-body text-xs sm:text-sm leading-relaxed text-slate-800 break-words">
            <Markdown>{message.content}</Markdown>
          </div>
        )}

        {/* Assistant-Only Features (TTS, Translation, Transliteration, RAG Sources, Pipeline) */}
        {!isUser && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-2">
            {/* Quick Action Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                {/* Text-to-Speech Button */}
                <button
                  id={`btn-tts-${message.id}`}
                  onClick={handleSpeak}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors border ${
                    isPlayingAudio
                      ? 'bg-indigo-100 text-indigo-700 border-indigo-300 animate-pulse'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                  title="Listen in native pronunciation (TTS)"
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Listen</span>
                    </>
                  )}
                </button>

                {/* Translate to English Button */}
                {message.englishTranslation && lang?.code !== 'en' && (
                  <button
                    id={`btn-trans-${message.id}`}
                    onClick={() => setShowEnglishTranslation(!showEnglishTranslation)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors border ${
                      showEnglishTranslation
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{showEnglishTranslation ? 'Hide English' : 'English View'}</span>
                  </button>
                )}

                {/* Romanized Text Pronunciation Button */}
                {message.romanizedText && (
                  <button
                    id={`btn-roman-${message.id}`}
                    onClick={() => setShowRomanized(!showRomanized)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors border ${
                      showRomanized
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>Phonetic</span>
                  </button>
                )}

                {/* Sources Count Badge */}
                {message.sources && message.sources.length > 0 && (
                  <button
                    id={`btn-sources-${message.id}`}
                    onClick={() => setShowSources(!showSources)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{message.sources.length} RAG Source{message.sources.length > 1 ? 's' : ''}</span>
                    {showSources ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                )}

                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  title="Copy text"
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Telemetry info */}
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                {message.intent && (
                  <span className="inline-flex items-center gap-0.5 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 text-slate-600 truncate max-w-[120px]">
                    <Tag className="w-2.5 h-2.5" />
                    <span className="truncate">{message.intent}</span>
                  </span>
                )}
                {message.processingTimeMs && (
                  <span className="inline-flex items-center gap-0.5 font-mono">
                    <Clock className="w-2.5 h-2.5" />
                    {message.processingTimeMs}ms
                  </span>
                )}
                {message.pipelineSteps && message.pipelineSteps.length > 0 && (
                  <button
                    onClick={() => setShowPipelineDetails(!showPipelineDetails)}
                    className="text-indigo-600 hover:underline inline-flex items-center gap-0.5 font-medium"
                  >
                    <Layers className="w-2.5 h-2.5" />
                    Trace
                  </button>
                )}
              </div>
            </div>

            {/* Expandable English Translation Drawer */}
            {showEnglishTranslation && message.englishTranslation && (
              <div id={`drawer-trans-${message.id}`} className="mt-2 p-3 bg-blue-50/80 border border-blue-100 rounded-xl text-xs text-slate-700 break-words">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-900 mb-1">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>English Translation (Cross-Lingual Bridge)</span>
                </div>
                <p className="leading-relaxed text-slate-800">
                  {message.englishTranslation}
                </p>
              </div>
            )}

            {/* Expandable Romanized Pronunciation Drawer */}
            {showRomanized && message.romanizedText && (
              <div id={`drawer-roman-${message.id}`} className="mt-2 p-3 bg-amber-50/80 border border-amber-100 rounded-xl text-xs text-slate-700 break-words">
                <div className="text-[11px] font-semibold text-amber-900 mb-1">
                  Phonetic English Transliteration (Pronunciation Guide)
                </div>
                <p className="italic text-slate-700 font-mono text-[11px] leading-relaxed">
                  "{message.romanizedText}"
                </p>
              </div>
            )}

            {/* Expandable Verified Sources Cards */}
            {showSources && message.sources && (
              <div id={`drawer-sources-${message.id}`} className="mt-2 space-y-2">
                <div className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Retrieved Knowledge Base Grounding Documents:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {message.sources.map((src, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs flex flex-col justify-between break-words"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-semibold text-slate-900 truncate">
                            {src.title}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-mono shrink-0">
                            Match: {src.score}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium block mb-1">
                          Category: {src.category}
                        </span>
                        <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                          {src.snippet}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expandable Pipeline Execution Trace */}
            {showPipelineDetails && message.pipelineSteps && (
              <div id={`drawer-pipeline-${message.id}`} className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono break-words overflow-x-auto">
                <div className="flex items-center justify-between text-[11px] text-indigo-400 font-semibold mb-2 pb-1 border-b border-slate-800">
                  <span>Language Agnostic NLP Step Trace</span>
                  <span>Total: {message.processingTimeMs}ms</span>
                </div>
                <div className="space-y-2">
                  {message.pipelineSteps.map((step, idx) => (
                    <div key={idx} className="border-l-2 border-indigo-500 pl-2 text-[11px]">
                      <div className="flex items-center justify-between text-slate-200 font-semibold">
                        <span>{step.step}</span>
                        <span className="text-slate-400 text-[10px]">{step.durationMs}ms</span>
                      </div>
                      <p className="text-slate-400 text-[10px] mt-0.5">{step.description}</p>
                      <p className="text-emerald-400 text-[10px] mt-0.5 truncate">{step.outputSnippet}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

