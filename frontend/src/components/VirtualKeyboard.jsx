import React, { useState } from 'react';
import { Keyboard, X, Sparkles, Copy, Check, Search } from 'lucide-react';

const KEYBOARD_GROUPS = [
  {
    category: "Vowels (स्वर)",
    keys: [
      { char: "𑂃", deva: "अ", name: "A", phonetic: "a" },
      { char: "𑂄", deva: "आ", name: "AA", phonetic: "aa" },
      { char: "𑂅", deva: "इ", name: "I", phonetic: "i" },
      { char: "𑂆", deva: "ई", name: "II", phonetic: "ii" },
      { char: "𑂇", deva: "उ", name: "U", phonetic: "u" },
      { char: "𑂈", deva: "ऊ", name: "UU", phonetic: "uu" },
      { char: "𑂉", deva: "ए", name: "E", phonetic: "e" },
      { char: "𑂊", deva: "ऐ", name: "AI", phonetic: "ai" },
      { char: "𑂋", deva: "ओ", name: "O", phonetic: "o" },
      { char: "𑂌", deva: "औ", name: "AU", phonetic: "au" },
    ]
  },
  {
    category: "Consonants (व्यंजन)",
    keys: [
      { char: "𑂍", deva: "क", name: "KA", phonetic: "k" },
      { char: "𑂎", deva: "ख", name: "KHA", phonetic: "kh" },
      { char: "𑂏", deva: "ग", name: "GA", phonetic: "g" },
      { char: "𑂐", deva: "घ", name: "GHA", phonetic: "gh" },
      { char: "𑂑", deva: "ङ", name: "NGA", phonetic: "ng" },
      { char: "𑂒", deva: "च", name: "CA", phonetic: "ch" },
      { char: "𑂓", deva: "छ", name: "CHA", phonetic: "chh" },
      { char: "𑂔", deva: "ज", name: "JA", phonetic: "j" },
      { char: "𑂕", deva: "झ", name: "JHA", phonetic: "jh" },
      { char: "𑂖", deva: "ञ", name: "NYA", phonetic: "ny" },
      { char: "𑂗", deva: "ट", name: "TTA", phonetic: "t" },
      { char: "𑂘", deva: "ठ", name: "TTHA", phonetic: "th" },
      { char: "𑂙", deva: "ड", name: "DDA", phonetic: "d" },
      { char: "𑂚", deva: "ढ", name: "DDHA", phonetic: "dh" },
      { char: "𑂛", deva: "ड़", name: "RRA", phonetic: "r" },
      { char: "𑂜", deva: "ण", name: "NNA", phonetic: "n" },
      { char: "𑂝", deva: "त", name: "TA", phonetic: "t" },
      { char: "𑂞", deva: "थ", name: "THA", phonetic: "th" },
      { char: "𑂟", deva: "द", name: "DA", phonetic: "d" },
      { char: "𑂠", deva: "ध", name: "DHA", phonetic: "dh" },
      { char: "𑂡", deva: "न", name: "NA", phonetic: "n" },
      { char: "𑂢", deva: "प", name: "PA", phonetic: "p" },
      { char: "𑂣", deva: "फ", name: "PHA", phonetic: "ph" },
      { char: "𑂤", deva: "ब", name: "BA", phonetic: "b" },
      { char: "𑂥", deva: "भ", name: "BHA", phonetic: "bh" },
      { char: "𑂦", deva: "म", name: "MA", phonetic: "m" },
      { char: "𑂧", deva: "य", name: "YA", phonetic: "y" },
      { char: "𑂨", deva: "र", name: "RA", phonetic: "r" },
      { char: "𑂩", deva: "ल", name: "LA", phonetic: "l" },
      { char: "𑂪", deva: "व", name: "VA", phonetic: "v" },
      { char: "𑂫", deva: "श", name: "SHA", phonetic: "sh" },
      { char: "𑂬", deva: "ष", name: "SSA", phonetic: "sh" },
      { char: "𑂭", deva: "स", name: "SA", phonetic: "s" },
      { char: "𑂮", deva: "ह", name: "HA", phonetic: "h" },
    ]
  },
  {
    category: "Matras & Signs (मात्रा एवं चिह्न)",
    keys: [
      { char: "𑂯", deva: "ा", name: "AA", phonetic: "aa" },
      { char: "𑂰", deva: "ि", name: "I", phonetic: "i" },
      { char: "𑂱", deva: "ी", name: "II", phonetic: "ii" },
      { char: "𑂲", deva: "ु", name: "U", phonetic: "u" },
      { char: "𑂳", deva: "ू", name: "UU", phonetic: "uu" },
      { char: "𑂴", deva: "े", name: "E", phonetic: "e" },
      { char: "𑂵", deva: "ै", name: "AI", phonetic: "ai" },
      { char: "𑂶", deva: "ो", name: "O", phonetic: "o" },
      { char: "𑂷", deva: "ौ", name: "AU", phonetic: "au" },
      { char: "𑂸", deva: "्", name: "VIRAMA", phonetic: "halant" },
      { char: "𑂁", deva: "ं", name: "ANUSVARA", phonetic: "m" },
      { char: "𑂀", deva: "ँ", name: "CANDRABINDU", phonetic: "n" },
      { char: "𑂂", deva: "ः", name: "VISARGA", phonetic: "h" },
      { char: "𑂹", deva: "़", name: "NUKTA", phonetic: "dot" },
      { char: "𑂾", deva: "।", name: "DANDA", phonetic: "." },
      { char: "𑂿", deva: "॥", name: "DOUBLE DANDA", phonetic: ".." },
      { char: "𑂺", deva: "॰", name: "ABBR", phonetic: "o" },
    ]
  }
];

export default function VirtualKeyboard({ onInsertChar, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState(0);
  const [searchKey, setSearchKey] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);

  if (!isOpen) return null;

  const handleKeyClick = (char) => {
    if (onInsertChar) {
      onInsertChar(char);
    }
  };

  const filteredKeys = KEYBOARD_GROUPS[activeTab].keys.filter(
    (k) =>
      !searchKey ||
      k.name.toLowerCase().includes(searchKey.toLowerCase()) ||
      k.deva.includes(searchKey) ||
      k.phonetic.toLowerCase().includes(searchKey.toLowerCase())
  );

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[95vw] sm:w-full max-w-xl glass-panel-gold rounded-2xl p-4 shadow-2xl border border-amber-500/30 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-cinzel text-slate-900 dark:text-amber-200 text-sm font-semibold tracking-wide">
              Kaithi (𑂍𑂶𑂟𑂲) Virtual Script Keyboard
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Click any glyph to insert at cursor position</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Category Tabs & Quick Search */}
      <div className="flex flex-col sm:flex-row items-center gap-2 my-3">
        <div className="flex space-x-1 w-full sm:w-auto flex-1 bg-slate-200/80 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-300 dark:border-slate-800">
          {KEYBOARD_GROUPS.map((group, idx) => (
            <button
              key={group.category}
              onClick={() => setActiveTab(idx)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all ${
                activeTab === idx
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-300/60 dark:hover:bg-slate-800/50'
              }`}
            >
              {group.category.split(' ')[0]}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-36">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sound..."
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="w-full pl-7 pr-2 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Key Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 max-h-52 overflow-y-auto p-1">
        {filteredKeys.map((k) => (
          <button
            key={k.char + k.name}
            onClick={() => handleKeyClick(k.char)}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-amber-500/25 border border-slate-300 dark:border-slate-700/60 hover:border-amber-500 active:scale-95 transition-all group shadow-sm"
            title={`Kaithi: ${k.char} | Devanagari: ${k.deva} (${k.name})`}
          >
            <span className="font-kaithi text-2xl text-slate-900 dark:text-amber-100 group-hover:text-amber-600 dark:group-hover:text-amber-300 group-hover:scale-110 transition-transform">
              {k.char}
            </span>
            <span className="font-devanagari text-[10px] text-slate-500 dark:text-slate-400 group-hover:text-amber-700 dark:group-hover:text-amber-200">
              {k.deva}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-3 pt-2 border-t border-slate-300 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>
          Unicode: <code className="text-amber-600 dark:text-amber-400 font-mono">U+11080–U+110CF</code>
        </span>
        <span className="text-slate-400">Noto Sans Kaithi</span>
      </div>
    </div>
  );
}
