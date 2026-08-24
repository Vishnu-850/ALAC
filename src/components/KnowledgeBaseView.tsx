import React, { useState, useEffect } from 'react';
import { KnowledgeDocument, RagSource } from '../types';
import { BookOpen, Plus, Search, Trash2, Tag, Calendar, Sparkles, Check, AlertCircle, Layers } from 'lucide-react';

export const KnowledgeBaseView: React.FC = () => {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Document Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<KnowledgeDocument['category']>('Admissions');
  const [newContent, setNewContent] = useState('');
  const [newKeywords, setNewKeywords] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // RAG Search Preview Tester
  const [ragTestQuery, setRagTestQuery] = useState('');
  const [ragResults, setRagResults] = useState<RagSource[]>([]);
  const [isTestingRag, setIsTestingRag] = useState(false);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/knowledge-base');
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error('Failed to fetch knowledge base:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/knowledge-base', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          category: newCategory,
          content: newContent.trim(),
          keywords: newKeywords.split(',').map(k => k.trim()).filter(Boolean)
        })
      });

      if (res.ok) {
        const created = await res.json();
        setDocuments([created, ...documents]);
        setShowAddModal(false);
        setNewTitle('');
        setNewContent('');
        setNewKeywords('');
        setActionSuccess('Document added to RAG knowledge index successfully!');
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err) {
      console.error('Add doc error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Are you sure you want to remove this document from the knowledge base?')) return;

    try {
      const res = await fetch(`/api/knowledge-base/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDocuments(documents.filter(d => d.id !== id));
        setActionSuccess('Document deleted from knowledge index.');
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleTestRag = async () => {
    if (!ragTestQuery.trim()) return;
    setIsTestingRag(true);
    try {
      const res = await fetch('/api/rag-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: ragTestQuery.trim(), limit: 4 })
      });
      const data = await res.json();
      setRagResults(data.sources || []);
    } catch (err) {
      console.error('RAG test error:', err);
    } finally {
      setIsTestingRag(false);
    }
  };

  const categories = ['All', 'Admissions', 'Courses', 'Fees & Scholarships', 'Examinations', 'Campus & Hostel', 'Placements & Careers', 'General Services'];

  const filteredDocs = documents.filter(doc => {
    const matchesCat = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch = searchTerm === '' ||
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div id="kb-view-container" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Banner Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>RAG Knowledge Base & Grounding Index</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Institutional Knowledge Repository
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Verified policies, syllabi, fee schedules, and student regulations. The chatbot cross-lingually indexes these documents to answer queries accurately in any native language.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-add-doc-modal"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Knowledge Document</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {actionSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Interactive RAG Search Simulator */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Live Cross-Lingual RAG Retrieval Tester
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Test how queries in Telugu, Hindi, Spanish, or English trigger semantic and keyword retrieval against the knowledge index.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              id="rag-tester-input"
              value={ragTestQuery}
              onChange={(e) => setRagTestQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTestRag()}
              placeholder="e.g. 'కళాశాలలో హాస్టల్ ఫీజు ఎంత?' or 'B.Tech CSE fees' or 'Revaluation rules'"
              className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 outline-hidden"
            />
            <button
              type="button"
              id="btn-run-rag-test"
              onClick={handleTestRag}
              disabled={isTestingRag || !ragTestQuery.trim()}
              className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-semibold disabled:opacity-50 transition-colors"
            >
              {isTestingRag ? 'Matching...' : 'Run RAG Search'}
            </button>
          </div>

          {ragResults.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-semibold text-slate-700 block">
                Retrieved Chunks ({ragResults.length} matches):
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {ragResults.map((r, i) => (
                  <div key={i} className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-900 mb-1">
                      <span>{r.title}</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-mono">
                        Score: {r.score}
                      </span>
                    </div>
                    <span className="text-[10px] text-indigo-700 font-medium block mb-1">
                      {r.category}
                    </span>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {r.snippet}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search knowledge base..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 outline-hidden"
            />
          </div>
        </div>

        {/* Document Grid */}
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading knowledge base...</div>
        ) : filteredDocs.length === 0 ? (
          <div className="p-12 bg-white border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
            No knowledge documents matched your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                id={`doc-card-${doc.id}`}
                className="bg-white border border-slate-200 hover:border-indigo-200 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      <Tag className="w-2.5 h-2.5" />
                      {doc.category}
                    </span>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mb-2 leading-snug">
                    {doc.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-5 mb-4">
                    {doc.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {doc.keywords.slice(0, 4).map((kw, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        #{kw}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Updated: {doc.lastUpdated}
                    </span>
                    <span className="font-mono">{doc.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Document Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900">
                  Add Document to RAG Knowledge Base
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddDocument} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Merit Scholarship Eligibility & Deadlines"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 outline-hidden"
                  >
                    <option value="Admissions">Admissions</option>
                    <option value="Courses">Courses</option>
                    <option value="Fees & Scholarships">Fees & Scholarships</option>
                    <option value="Examinations">Examinations</option>
                    <option value="Campus & Hostel">Campus & Hostel</option>
                    <option value="Placements & Careers">Placements & Careers</option>
                    <option value="General Services">General Services</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Document Content (Facts, Rules, Policies)
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Enter the detailed official information here. The multilingual chatbot will retrieve this to answer user questions accurately."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 outline-hidden resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Keywords (comma-separated for indexing)
                  </label>
                  <input
                    type="text"
                    value={newKeywords}
                    onChange={(e) => setNewKeywords(e.target.value)}
                    placeholder="scholarship, deadline, merit, waiver, fee"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-2xs"
                  >
                    {isSubmitting ? 'Indexing...' : 'Save & Index Document'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
