import React, { useState } from 'react';
import { BookOpen, Search, X, Tag, FileText, Globe, Landmark } from 'lucide-react';

export default function HistoricalGlossaryModal({ isOpen, onClose, glossaryData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  if (!isOpen) return null;

  const glossaryEntries = Object.entries(glossaryData || {}).map(([devanagari, item]) => ({
    devanagari,
    ...item,
  }));

  const categories = ['ALL', ...new Set(glossaryEntries.map((e) => e.category))];

  const filteredEntries = glossaryEntries.filter((item) => {
    const matchesSearch =
      item.term_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.devanagari.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[85vh] glass-panel-gold rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-amber-500/30">
        {/* Header */}
        <div className="p-6 border-b border-amber-500/20 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-cinzel text-xl font-bold text-amber-200 tracking-wide">
                Historical Land Record & Script Lexicon
              </h2>
              <p className="text-xs text-slate-400">
                Archaic legal terms, revenue designations, and administrative vocabulary from Bihar & UP archives
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search terms, English or Devanagari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-700/70 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/60 transition-colors"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <div
                key={entry.devanagari}
                className="p-4 rounded-xl bg-slate-900/70 hover:bg-slate-900/95 border border-slate-800 hover:border-amber-500/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-devanagari text-xl font-bold text-amber-300 mr-2">
                      {entry.devanagari}
                    </span>
                    <span className="font-semibold text-slate-200 text-sm">
                      ({entry.term_en})
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold tracking-wider bg-amber-500/15 text-amber-300/90 border border-amber-500/25">
                    {entry.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {entry.definition}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 text-slate-500">
              No matching historical terms found.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Landmark className="w-4 h-4 text-amber-400/80" />
            <span>Curated from British-India Cadastral Survey registers (1885–1920)</span>
          </div>
          <span className="text-amber-400/80 font-mono">{filteredEntries.length} terms</span>
        </div>
      </div>
    </div>
  );
}
