import React, { useState } from 'react';
import {
  GraduationCap,
  X,
  BookOpen,
  Volume2,
  Sparkles,
  Layers,
  History,
  Check,
  Search,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

const SCRIPT_EVOLUTION_EXAMPLES = [
  { braham: '𑀓', kaithi: '𑂍', deva: 'क', latin: 'ka', meaning: 'Velar unvoiced stop' },
  { braham: '𑀔', kaithi: '𑂎', deva: 'ख', latin: 'kha', meaning: 'Aspirated velar stop' },
  { braham: '𑀕', kaithi: '𑂏', deva: 'ग', latin: 'ga', meaning: 'Voiced velar stop' },
  { braham: '𑀘', kaithi: '𑂒', deva: 'च', latin: 'ca', meaning: 'Palatal stop' },
  { braham: '𑀚', kaithi: '𑂔', deva: 'ज', latin: 'ja', meaning: 'Voiced palatal stop' },
  { braham: '𑀢', kaithi: '𑂞', deva: 'त', latin: 'ta', meaning: 'Dental stop' },
  { braham: '𑀤', kaithi: '𑂠', deva: 'द', latin: 'da', meaning: 'Voiced dental stop' },
  { braham: '𑀦', kaithi: '𑂢', deva: 'न', latin: 'na', meaning: 'Dental nasal' },
  { braham: '𑀧', kaithi: '𑂣', deva: 'प', latin: 'pa', meaning: 'Bilabial stop' },
  { braham: '𑀫', kaithi: '𑂧', deva: 'म', latin: 'ma', meaning: 'Bilabial nasal' },
  { braham: '𑀭', kaithi: '𑂩', deva: 'र', latin: 'ra', meaning: 'Alveolar trill' },
  { braham: '𑀮', kaithi: '𑂪', deva: 'ल', latin: 'la', meaning: 'Lateral approximant' },
  { braham: '𑀲', kaithi: '𑂮', deva: 'स', latin: 'sa', meaning: 'Dental sibilant' },
  { braham: '𑀳', kaithi: '𑂯', deva: 'ह', latin: 'ha', meaning: 'Glottal fricative' },
];

const HISTORICAL_MILESTONES = [
  {
    year: '16th Century',
    era: 'Mughal Administration',
    title: 'Adoption by Kayastha Scribes',
    desc: 'Kaithi emerges as the swift, flowing cursive script for court scribes, land title deeds, and village revenue collection across Bihar and Awadh.',
  },
  {
    year: '1880–1894',
    era: 'British Raj Official Standardization',
    title: 'Official Court Script of Bihar',
    desc: 'Sir George Grierson and Bengal Presidency officially standardize Kaithi for all district magistrate courts, police stations, and revenue surveys in Bihar.',
  },
  {
    year: '1895–1920',
    era: 'Cadastral Land Surveys',
    title: 'The Great Survey & Settlement',
    desc: 'Cadastral survey maps and Khatiyan records (Record-of-Rights) of millions of farmers are handwritten in Kaithi across Shahabad, Patna, Saran, and Champaran.',
  },
  {
    year: '1950s',
    era: 'Post-Independence Shift',
    title: 'Transition to Devanagari',
    desc: 'Administrative reforms mandate Devanagari, creating an urgent need today to digitize millions of surviving historical Kaithi deeds.',
  },
];

export default function KaithiPrimerModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('evolution'); // 'evolution' | 'timeline' | 'features'
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const playPronunciation = (phonetic) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(phonetic);
      u.lang = 'hi-IN';
      window.speechSynthesis.speak(u);
    }
  };

  const filteredEvolution = SCRIPT_EVOLUTION_EXAMPLES.filter(
    (e) =>
      e.latin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.deva.includes(searchTerm) ||
      e.kaithi.includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[88vh] glass-panel-gold rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-amber-500/30">
        {/* Header */}
        <div className="p-5 border-b border-amber-500/20 flex items-center justify-between bg-slate-100/90 dark:bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg font-bold text-slate-900 dark:text-amber-200 tracking-wide">
                Kaithi Script Academy & Historical Primer
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Linguistic origins, paleography, and script evolution across South Asian archives
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-300 dark:border-slate-800 bg-slate-200/50 dark:bg-slate-950/40 p-2 gap-2">
          <button
            onClick={() => setActiveTab('evolution')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'evolution'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-300/50 dark:hover:bg-slate-800/50'
            }`}
          >
            🔤 Script Evolution Matrix
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'timeline'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-300/50 dark:hover:bg-slate-800/50'
            }`}
          >
            📜 Historical Timeline
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'features'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-300/50 dark:hover:bg-slate-800/50'
            }`}
          >
            💡 Paleographic Key Features
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'evolution' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Kaithi evolved from the ancient <strong>Brahmi</strong> and medieval <strong>Gupta/Sharada</strong> scripts. Unlike Devanagari, it was designed for rapid cursive writing without lifting the quill.
                </p>
                <div className="relative w-full sm:w-60">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search sound (e.g. ka, ta)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Comparative Table */}
              <div className="rounded-xl overflow-hidden border border-slate-300 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-200/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="p-3">Brahmi Root</th>
                      <th className="p-3 text-amber-700 dark:text-amber-300">Kaithi (𑂍𑂶𑂟𑂲)</th>
                      <th className="p-3">Devanagari</th>
                      <th className="p-3">Latin (IAST)</th>
                      <th className="p-3">Phonetic Detail</th>
                      <th className="p-3 text-right">Pronounce</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-slate-100/50 dark:bg-slate-950/50">
                    {filteredEvolution.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-amber-500/10 transition-colors group"
                      >
                        <td className="p-3 font-mono text-base text-slate-500">{row.braham}</td>
                        <td className="p-3 font-kaithi text-2xl font-bold text-amber-700 dark:text-amber-300">
                          {row.kaithi}
                        </td>
                        <td className="p-3 font-devanagari text-lg text-slate-900 dark:text-slate-100">
                          {row.deva}
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                          {row.latin}
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{row.meaning}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => playPronunciation(row.deva)}
                            className="p-1 rounded hover:bg-amber-500/20 text-slate-400 hover:text-amber-500 transition-colors"
                            title="Hear Pronunciation"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="relative border-l-2 border-amber-500/40 ml-4 pl-6 space-y-8">
                {HISTORICAL_MILESTONES.map((m, idx) => (
                  <div key={idx} className="relative group">
                    {/* Circle marker */}
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-slate-900 shadow-gold-glow group-hover:scale-125 transition-transform" />

                    <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 space-y-1.5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
                          {m.year} • {m.era}
                        </span>
                      </div>
                      <h4 className="font-cinzel text-sm font-bold text-slate-900 dark:text-slate-100">
                        {m.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 space-y-2">
                <div className="font-bold text-amber-700 dark:text-amber-300 text-sm flex items-center gap-1.5">
                  <span>1. Absence of Continuous Shirorekha (Top Line)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Unlike standard Devanagari which connects all letters with a continuous top bar (shirorekha), Kaithi is largely headless or written with distinct top strokes, facilitating speedy cursive clerical writing.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 space-y-2">
                <div className="font-bold text-amber-700 dark:text-amber-300 text-sm flex items-center gap-1.5">
                  <span>2. Distinctive Bhojpuri & Awadhi Orthography</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Vowels like short/long <em>I</em> (𑂰 vs 𑂱) are frequently interchangeable in colloquial deeds, with contextual markers indicating possession (e.g. <em>-ke</em>, <em>-ba</em>).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 space-y-2">
                <div className="font-bold text-amber-700 dark:text-amber-300 text-sm flex items-center gap-1.5">
                  <span>3. Cadastral Survey Fractions & Accounting Glyphs</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Kaithi historical records utilize a dedicated sub-numeral system for calculating Anna, Paisa, and Gandas in colonial land tax settlements.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 space-y-2">
                <div className="font-bold text-amber-700 dark:text-amber-300 text-sm flex items-center gap-1.5">
                  <span>4. Unicode Standard Range</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Standardized in Unicode 5.2 in the block <code>U+11080–U+110CF</code>, allowing digital preservation and AI transliteration across modern operating systems.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-300 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-950/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Curated from Linguistic Survey of India (Vol. V) by Sir George Grierson</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
          >
            Close Primer
          </button>
        </div>
      </div>
    </div>
  );
}
