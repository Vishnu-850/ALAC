import React from 'react';
import { Bot, Sparkles, BookOpen, Activity, Volume2, VolumeX, Globe } from 'lucide-react';

interface HeaderProps {
  activeTab: 'chat' | 'knowledge' | 'pipeline';
  setActiveTab: (tab: 'chat' | 'knowledge' | 'pipeline') => void;
  autoSpeak: boolean;
  setAutoSpeak: (val: boolean) => void;
  liveDetectedLang?: { name: string; flag: string; confidence: number };
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  autoSpeak,
  setAutoSpeak,
  liveDetectedLang
}) => {
  return (
    <header id="app-header" className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs shrink-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div id="bot-brand-icon" className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 id="app-title" className="text-xs sm:text-sm md:text-base font-bold text-slate-900 tracking-tight leading-none truncate">
                  Language Agnostic AI
                </h1>
                <span id="badge-rag" className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  RAG
                </span>
              </div>
              <p id="app-subtitle" className="text-[11px] text-slate-500 mt-0.5 hidden sm:flex items-center gap-1.5 truncate">
                <span>Zero-Barrier Multilingual College Services</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav id="header-nav" className="flex items-center gap-0.5 sm:gap-1 bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              id="tab-chat"
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>

            <button
              id="tab-knowledge"
              onClick={() => setActiveTab('knowledge')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                activeTab === 'knowledge'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Knowledge Base</span>
              <span className="sm:hidden">RAG</span>
            </button>

            <button
              id="tab-pipeline"
              onClick={() => setActiveTab('pipeline')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                activeTab === 'pipeline'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">NLP Inspector</span>
              <span className="sm:hidden">Trace</span>
            </button>
          </nav>

          {/* Controls: Auto-voice toggle & Live indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {liveDetectedLang && (
              <div id="live-lang-pill" className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-800 font-medium animate-fadeIn">
                <span>{liveDetectedLang.flag}</span>
                <span>Active: <strong>{liveDetectedLang.name}</strong></span>
              </div>
            )}

            <button
              id="btn-toggle-autospeak"
              onClick={() => setAutoSpeak(!autoSpeak)}
              title={autoSpeak ? 'Disable Auto Text-to-Speech' : 'Enable Auto Text-to-Speech'}
              className={`p-1.5 sm:p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                autoSpeak
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {autoSpeak ? (
                <>
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                  <span className="hidden md:inline text-[11px]">TTS On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span className="hidden md:inline text-[11px]">TTS Off</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
