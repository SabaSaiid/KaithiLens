import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Keyboard,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  ArrowRightLeft,
  BookOpen,
} from 'lucide-react';
import VirtualKeyboard from './VirtualKeyboard';

export default function ScriptSandboxModal({ isOpen, onClose }) {
  const [inputText, setInputText] = useState('𑂍𑂶𑂟𑂲 𑂩𑂵𑂎𑂰 𑂥𑂰𑂥𑂞 𑂫𑂱𑂍𑂹𑂩𑂨');
  const [direction, setDirection] = useState('kaithi_to_deva'); // 'kaithi_to_deva' | 'deva_to_kaithi'
  const [transliteratedText, setTransliteratedText] = useState('');
  const [iastText, setIastText] = useState('');
  const [breakdown, setBreakdown] = useState([]);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [copiedSection, setCopiedSection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    performTransliteration(inputText, direction);
  }, [inputText, direction, isOpen]);

  if (!isOpen) return null;

  const performTransliteration = async (text, dir) => {
    if (!text.trim()) {
      setTransliteratedText('');
      setIastText('');
      setBreakdown([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/transliterate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, direction: dir }),
      });
      if (res.ok) {
        const data = await res.json();
        setTransliteratedText(data.transliterated_text || '');
        setIastText(data.iast_text || '');
        setBreakdown(data.character_breakdown || []);
      }
    } catch (err) {
      console.error('Sandbox transliteration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handlePlayTTS = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'hi-IN';
      window.speechSynthesis.speak(u);
    }
  };

  const handleSwapDirection = () => {
    const newDir = direction === 'kaithi_to_deva' ? 'deva_to_kaithi' : 'kaithi_to_deva';
    setDirection(newDir);
    setInputText(transliteratedText || '');
  };

  const handleInsertKey = (char) => {
    setInputText((prev) => prev + char);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] glass-panel-gold rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-amber-500/40">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-500/20 bg-slate-100/90 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 flex items-center justify-center font-kaithi text-xl font-bold">
              𑂍𑂶
            </div>
            <div>
              <h2 className="font-cinzel text-base sm:text-lg font-bold text-slate-900 dark:text-amber-200 tracking-wide">
                Bidirectional Kaithi Script Sandbox
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live character-by-character scratchpad: Kaithi ⇄ Devanagari ⇄ IAST
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsKeyboardOpen(!isKeyboardOpen)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isKeyboardOpen
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-gold-glow'
                  : 'bg-slate-200/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Virtual Keyboard</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workspace Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Direction Swap Ribbon */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center space-x-2 font-medium text-slate-700 dark:text-slate-300">
              <span>Mode:</span>
              <span className="font-semibold text-amber-700 dark:text-amber-300">
                {direction === 'kaithi_to_deva'
                  ? 'Kaithi (𑂍𑂶𑂟𑂲) → Devanagari (देवनागरी)'
                  : 'Devanagari (देवनागरी) → Kaithi (𑂍𑂶𑂟𑂲)'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleSwapDirection}
                className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs transition-colors font-medium"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Swap Script Direction</span>
              </button>

              <button
                onClick={() => setInputText('')}
                className="p-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs"
                title="Clear Text"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2-Column Live Sandbox Input/Output */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Box */}
            <div className="p-4 rounded-xl parchment-card-dark border border-amber-500/30 space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-400 font-medium">
                <span>
                  {direction === 'kaithi_to_deva' ? 'Input Kaithi (𑂍𑂶𑂟𑂲)' : 'Input Devanagari (देवनागरी)'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {inputText.length} chars
                </span>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  direction === 'kaithi_to_deva'
                    ? 'Type or paste Kaithi text (or use keyboard below)...'
                    : 'देवनागरी यहाँ लिखें या पेस्ट करें...'
                }
                rows={4}
                className={`w-full bg-transparent border-0 resize-none focus:outline-none leading-relaxed text-slate-900 dark:text-slate-100 ${
                  direction === 'kaithi_to_deva'
                    ? 'font-kaithi text-2xl'
                    : 'font-devanagari text-lg'
                }`}
              />
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => handleCopy(inputText, 'input')}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-amber-500 flex items-center gap-1"
                >
                  {copiedSection === 'input' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSection === 'input' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Transliterated Output Box */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                <span>
                  {direction === 'kaithi_to_deva'
                    ? 'Devanagari Transliteration (देवनागरी)'
                    : 'Kaithi Script (𑂍𑂶𑂟𑂲)'}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                  Rule Synchronized
                </span>
              </div>
              <div
                className={`flex-1 min-h-[100px] leading-relaxed text-slate-900 dark:text-slate-100 select-text ${
                  direction === 'kaithi_to_deva'
                    ? 'font-devanagari text-xl'
                    : 'font-kaithi text-2xl'
                }`}
              >
                {transliteratedText || (
                  <span className="text-slate-400 text-sm italic font-sans">
                    Live transliteration will appear here...
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800/80">
                <button
                  onClick={() =>
                    handlePlayTTS(
                      direction === 'kaithi_to_deva'
                        ? transliteratedText
                        : inputText
                    )
                  }
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-amber-500 flex items-center gap-1"
                >
                  <Volume2 className="w-3 h-3 text-amber-500" />
                  <span>Pronounce</span>
                </button>

                <button
                  onClick={() => handleCopy(transliteratedText, 'output')}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-amber-500 flex items-center gap-1"
                >
                  {copiedSection === 'output' ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedSection === 'output' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* IAST Romanization Row */}
          {iastText && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-0.5">
                  Academic IAST Romanization (ISO 15919)
                </span>
                <span className="font-serif italic text-base text-slate-900 dark:text-amber-200">
                  {iastText}
                </span>
              </div>
              <button
                onClick={() => handleCopy(iastText, 'iast')}
                className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 text-xs"
                title="Copy IAST text"
              >
                {copiedSection === 'iast' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {/* Live Glyph Breakdown Inspector */}
          {breakdown.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <span>Glyph Character Breakdown ({breakdown.length} characters)</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-200/50 dark:bg-slate-950/70 rounded-xl border border-slate-300 dark:border-slate-800">
                {breakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex items-center space-x-1.5 text-xs shadow-sm"
                  >
                    <span className="font-kaithi text-amber-600 dark:text-amber-300 font-bold text-sm">
                      {item.char}
                    </span>
                    <span className="text-slate-400">→</span>
                    <span className="font-devanagari text-slate-800 dark:text-slate-200 font-medium">
                      {item.devanagari}
                    </span>
                    {item.iast && (
                      <span className="text-[10px] text-amber-700 dark:text-amber-400/90 font-serif italic">
                        ({item.iast})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Embedded Virtual Keyboard Drawer */}
        {isKeyboardOpen && (
          <div className="border-t border-amber-500/30 p-3 bg-slate-200/95 dark:bg-slate-950/95 animate-in slide-in-from-bottom-2">
            <VirtualKeyboard
              isOpen={true}
              onClose={() => setIsKeyboardOpen(false)}
              onInsertChar={handleInsertKey}
            />
          </div>
        )}
      </div>
    </div>
  );
}
