/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatView } from './components/ChatView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { PipelineInspector } from './components/PipelineInspector';
import { ChatMessage, LanguageInfo } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'knowledge' | 'pipeline'>('chat');
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [liveDetectedLang, setLiveDetectedLang] = useState<LanguageInfo | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // Initial welcome message from the Language Agnostic system
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-01',
      role: 'assistant',
      content: `నమస్కారం! / नमस्ते! / Welcome! 
నేను మీ కాలేజీ సమాచార సహాయకుడిని. మీరు ఏ భాషలోనైనా (తెలుగు, हिन्दी, தமிழ், ಕನ್ನಡ, मराठी, বাংলা, English, Español, Français, etc.) అడగవచ్చు. 

I am your Language-Agnostic College Assistant. Ask me anything about Admissions, Fees, Scholarships, Exam Schedules, Hostel, or Placements without selecting any language!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      detectedLanguage: {
        code: 'multilingual',
        name: 'Multilingual / Universal',
        nativeName: 'బహుభాషా / बहुभाषी',
        script: 'Devanagari / Telugu / Latin',
        family: 'Cross-Lingual',
        flag: '🌐',
        confidence: 1.0
      },
      englishTranslation: 'Welcome to the Language-Agnostic College Assistant. Ask any question in your preferred language without changing settings.',
      intent: 'Greeting & Instructions',
      sentiment: 'positive',
      processingTimeMs: 120,
      sources: [
        {
          docId: 'kb-gen-001',
          title: 'Student Information Desk & Services',
          category: 'General Services',
          snippet: 'Access real-time answers for admissions, fees, hostel, exams, scholarships, and campus facilities.',
          score: 1.0
        }
      ]
    }
  ]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content }))
        })
      });

      if (response.ok) {
        const assistantMsg: ChatMessage = await response.json();
        setMessages((prev) => [...prev, assistantMsg]);
        if (assistantMsg.detectedLanguage) {
          setLiveDetectedLang(assistantMsg.detectedLanguage);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        const fallbackMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: errorData.error || 'The system could not process your query at this moment. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          intent: 'Error Response',
          sentiment: 'neutral'
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const networkErrorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Unable to connect to the language server. Please ensure the backend is running.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: 'Network Error',
        sentiment: 'neutral'
      };
      setMessages((prev) => [...prev, networkErrorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div id="app-root" className="h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Universal Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        autoSpeak={autoSpeak}
        setAutoSpeak={setAutoSpeak}
        liveDetectedLang={liveDetectedLang}
      />

      {/* Main Tab Views */}
      <main id="main-content" className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        {activeTab === 'chat' && (
          <ChatView
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onClearChat={handleClearChat}
            autoSpeak={autoSpeak}
            onDetectedLangChange={(lang) => setLiveDetectedLang(lang)}
          />
        )}

        {activeTab === 'knowledge' && <KnowledgeBaseView />}

        {activeTab === 'pipeline' && <PipelineInspector />}
      </main>
    </div>
  );
}
