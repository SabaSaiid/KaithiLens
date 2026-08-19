import React, { useState } from 'react';
import { Keyboard, X, Sparkles, Copy, Check } from 'lucide-react';

const KEYBOARD_GROUPS = [
  {
    category: "Vowels (स्वर)",
    keys: [
      { char: "𑂃", deva: "अ", name: "A" },
      { char: "𑂄", deva: "आ", name: "AA" },
      { char: "𑂅", deva: "इ", name: "I" },
      { char: "𑂆", deva: "ई", name: "II" },
      { char: "𑂇", deva: "उ", name: "U" },
      { char: "𑂈", deva: "ऊ", name: "UU" },
      { char: "𑂉", deva: "ए", name: "E" },
      { char: "𑂊", deva: "ऐ", name: "AI" },
      { char: "𑂋", deva: "ओ", name: "O" },
      { char: "𑂌", deva: "औ", name: "AU" },
    ]
  },
  {
    category: "Consonants (व्यंजन)",
    keys: [
      { char: "𑂍", deva: "क", name: "KA" },
      { char: "𑂎", deva: "ख", name: "KHA" },
      { char: "𑂏", deva: "ग", name: "GA" },
      { char: "𑂐", deva: "घ", name: "GHA" },
      { char: "𑂑", deva: "ङ", name: "NGA" },
      { char: "𑂒", deva: "च", name: "CA" },
      { char: "𑂓", deva: "छ", name: "CHA" },
      { char: "𑂔", deva: "ज", name: "JA" },
      { char: "𑂕", deva: "झ", name: "JHA" },
      { char: "𑂖", deva: "ञ", name: "NYA" },
      { char: "𑂗", deva: "ट", name: "TTA" },
      { char: "𑂘", deva: "ठ", name: "TTHA" },
      { char: "𑂙", deva: "ड", name: "DDA" },
      { char: "𑂚", deva: "ढ", name: "DDHA" },
      { char: "𑂛", deva: "ड़", name: "RRA" },
      { char: "𑂜", deva: "ण", name: "NNA" },
      { char: "𑂝", deva: "त", name: "TA" },
      { char: "𑂞", deva: "थ", name: "THA" },
      { char: "𑂟", deva: "द", name: "DA" },
      { char: "𑂠", deva: "ध", name: "DHA" },
      { char: "𑂡", deva: "न", name: "NA" },
      { char: "𑂢", deva: "प", name: "PA" },
      { char: "𑂣", deva: "फ", name: "PHA" },
      { char: "𑂤", deva: "ब", name: "BA" },
      { char: "𑂥", deva: "भ", name: "BHA" },
      { char: "𑂦", deva: "म", name: "MA" },
      { char: "𑂧", deva: "य", name: "YA" },
      { char: "𑂨", deva: "र", name: "RA" },
      { char: "𑂩", deva: "ल", name: "LA" },
      { char: "𑂪", deva: "व", name: "VA" },
      { char: "𑂫", deva: "श", name: "SHA" },
      { char: "𑂬", deva: "ष", name: "SSA" },
      { char: "𑂭", deva: "स", name: "SA" },
      { char: "𑂮", deva: "ह", name: "HA" },
    ]
  },
  {
    category: "Matras & Signs (मात्रा एवं चिह्न)",
    keys: [
      { char: "𑂯", deva: "ा", name: "AA" },
      { char: "𑂰", deva: "ि", name: "I" },
      { char: "𑂱", deva: "ी", name: "II" },
      { char: "𑂲", deva: "ु", name: "U" },
      { char: "𑂳", deva: "ू", name: "UU" },
      { char: "𑂴", deva: "े", name: "E" },
      { char: "𑂵", deva: "ै", name: "AI" },
      { char: "𑂶", deva: "ो", name: "O" },
      { char: "𑂷", deva: "ौ", name: "AU" },
      { char: "𑂸", deva: "्", name: "VIRAMA" },
      { char: "𑂁", deva: "ं", name: "ANUSVARA" },
      { char: "𑂀", deva: "ँ", name: "CANDRABINDU" },
      { char: "𑂂", deva: "ः", name: "VISARGA" },
      { char: "𑂹", deva: "़", name: "NUKTA" },
      { char: "𑂾", deva: "।", name: "DANDA" },
      { char: "𑂿", deva: "॥", name: "DOUBLE DANDA" },
      { char: "𑂺", deva: "॰", name: "ABBR" },
    ]
  }
];

export default function VirtualKeyboard({ onInsertChar, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState(0);
  const [copiedChar, setCopiedChar] = useState(null);

  if (!isOpen) return null;

  const handleKeyClick = (char) => {
    if (onInsertChar) {
      onInsertChar(char);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-xl glass-panel-gold rounded-2xl p-4 shadow-2xl border border-amber-500/30 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-cinzel text-amber-200 text-sm font-semibold tracking-wide">
              Kaithi (𑂍𑂶𑂟𑂲) Virtual Script Keyboard
            </h3>
            <p className="text-xs text-slate-400">Click any glyph to insert at cursor position</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-1.5 my-3 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
        {KEYBOARD_GROUPS.map((group, idx) => (
          <button
            key={group.category}
            onClick={() => setActiveTab(idx)}
            className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
              activeTab === idx
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {group.category}
          </button>
        ))}
      </div>

      {/* Key Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 max-h-56 overflow-y-auto p-1">
        {KEYBOARD_GROUPS[activeTab].keys.map((k) => (
          <button
            key={k.char + k.name}
            onClick={() => handleKeyClick(k.char)}
            className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-800/80 hover:bg-amber-500/25 border border-slate-700/60 hover:border-amber-400/60 active:scale-95 transition-all group shadow-sm"
            title={`Kaithi: ${k.char} | Devanagari: ${k.deva} (${k.name})`}
          >
            <span className="font-kaithi text-xl text-amber-100 group-hover:text-amber-300 group-hover:scale-110 transition-transform">
              {k.char}
            </span>
            <span className="font-devanagari text-[10px] text-slate-400 group-hover:text-amber-200">
              {k.deva}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span>Unicode Range: <code className="text-amber-400/90 font-mono">U+11080–U+110CF</code></span>
        <span className="text-slate-500">Noto Sans Kaithi Engine</span>
      </div>
    </div>
  );
}
