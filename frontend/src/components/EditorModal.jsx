import React, { useState, useEffect } from 'react';
import {
  Edit3,
  X,
  Sparkles,
  ArrowRightLeft,
  Check,
  Send,
  Keyboard,
  RotateCcw,
  Save,
  Undo2,
  Redo2,
  FileDiff,
  AlertTriangle,
} from 'lucide-react';
import VirtualKeyboard from './VirtualKeyboard';

export default function EditorModal({
  isOpen,
  onClose,
  initialKaithi,
  initialDevanagari,
  initialEnglish,
  sampleId,
  onApplyChanges,
  onSubmitFeedback,
}) {
  const [kaithiText, setKaithiText] = useState(initialKaithi || '');
  const [devanagariText, setDevanagariText] = useState(initialDevanagari || '');
  const [englishText, setEnglishText] = useState(initialEnglish || '');
  const [userNotes, setUserNotes] = useState('');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isTransliterating, setIsTransliterating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [showDiff, setShowDiff] = useState(false);

  // Undo/Redo history stack
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    setKaithiText(initialKaithi || '');
    setDevanagariText(initialDevanagari || '');
    setEnglishText(initialEnglish || '');
    setFeedbackSent(false);
    setShowDiff(false);
    if (initialKaithi) {
      setHistory([{ kaithi: initialKaithi, deva: initialDevanagari, en: initialEnglish }]);
      setHistoryIndex(0);
    }
  }, [initialKaithi, initialDevanagari, initialEnglish, isOpen]);

  if (!isOpen) return null;

  const pushState = (newKaithi, newDeva, newEn) => {
    const newEntry = { kaithi: newKaithi, deva: newDeva, en: newEn };
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(newEntry);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setKaithiText(prev.kaithi);
      setDevanagariText(prev.deva);
      setEnglishText(prev.en);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setKaithiText(next.kaithi);
      setDevanagariText(next.deva);
      setEnglishText(next.en);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleTransliterateKaithiToDeva = async () => {
    setIsTransliterating(true);
    try {
      const res = await fetch('/api/transliterate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: kaithiText, direction: 'kaithi_to_deva' }),
      });
      const data = await res.json();
      if (data.transliterated_text) {
        setDevanagariText(data.transliterated_text);
        pushState(kaithiText, data.transliterated_text, englishText);
      }
    } catch (e) {
      console.error('Transliteration failed', e);
    } finally {
      setIsTransliterating(false);
    }
  };

  const handleTransliterateDevaToKaithi = async () => {
    setIsTransliterating(true);
    try {
      const res = await fetch('/api/transliterate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: devanagariText, direction: 'deva_to_kaithi' }),
      });
      const data = await res.json();
      if (data.transliterated_text) {
        setKaithiText(data.transliterated_text);
        pushState(data.transliterated_text, devanagariText, englishText);
      }
    } catch (e) {
      console.error('Transliteration failed', e);
    } finally {
      setIsTransliterating(false);
    }
  };

  const handleReTranslate = async () => {
    setIsTranslating(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: devanagariText, target_lang: 'en' }),
      });
      const data = await res.json();
      if (data.translated_text) {
        setEnglishText(data.translated_text);
        pushState(kaithiText, devanagariText, data.translated_text);
      }
    } catch (e) {
      console.error('Translation failed', e);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleInsertChar = (char) => {
    const updated = kaithiText + char;
    setKaithiText(updated);
    pushState(updated, devanagariText, englishText);
  };

  const handleSaveAndApply = () => {
    if (onApplyChanges) {
      onApplyChanges({
        raw_kaithi: kaithiText,
        devanagari: devanagariText,
        english: englishText,
      });
    }
    onClose();
  };

  const handleSubmitArchivistFeedback = async () => {
    if (onSubmitFeedback) {
      await onSubmitFeedback({
        sample_id: sampleId,
        original_kaithi: initialKaithi,
        corrected_kaithi: kaithiText,
        original_devanagari: initialDevanagari,
        corrected_devanagari: devanagariText,
        user_notes: userNotes,
      });
      setFeedbackSent(true);
      setTimeout(() => setFeedbackSent(false), 3500);
    }
  };

  const hasKaithiChanged = kaithiText !== initialKaithi;
  const hasDevaChanged = devanagariText !== initialDevanagari;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] glass-panel-gold rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-amber-500/30">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-500/20 flex items-center justify-between bg-slate-100/90 dark:bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-cinzel text-base sm:text-lg font-bold text-slate-900 dark:text-amber-200 tracking-wide">
                  Archivist Correction Studio
                </h2>
                {(hasKaithiChanged || hasDevaChanged) && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                    Unsaved Edits
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Refine OCR extractions, resolve damaged strokes, and train the Kaithi model
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Undo / Redo */}
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-500/20 disabled:opacity-40 transition-colors"
              title="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-500/20 disabled:opacity-40 transition-colors"
              title="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>

            {/* Toggle Keyboard */}
            <button
              onClick={() => setIsKeyboardOpen(!isKeyboardOpen)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-amber-500/20 text-xs text-amber-700 dark:text-amber-300 border border-slate-300 dark:border-slate-700 transition-colors"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>{isKeyboardOpen ? 'Hide Keyboard' : 'Virtual Keyboard'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Editor Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Kaithi Script Box */}
            <div className="space-y-2 flex flex-col">
              <div className="flex items-center justify-between">
                <label className="font-cinzel text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                  <span>Kaithi Script (𑂍𑂶𑂟𑂲)</span>
                  {hasKaithiChanged && (
                    <span className="text-[10px] text-amber-500">• Modified</span>
                  )}
                </label>
                <button
                  onClick={handleTransliterateKaithiToDeva}
                  disabled={isTransliterating}
                  className="flex items-center space-x-1 text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-medium transition-colors"
                >
                  <ArrowRightLeft className="w-3 h-3" />
                  <span>Sync to Devanagari →</span>
                </button>
              </div>

              <textarea
                value={kaithiText}
                onChange={(e) => {
                  setKaithiText(e.target.value);
                  pushState(e.target.value, devanagariText, englishText);
                }}
                rows={6}
                className="w-full p-4 rounded-xl font-kaithi text-lg bg-slate-100 dark:bg-slate-900/90 border border-amber-500/30 text-slate-900 dark:text-amber-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 leading-relaxed resize-y shadow-inner"
                placeholder="Enter or paste Kaithi glyphs (𑂍𑂶𑂟𑂲)..."
              />
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>{kaithiText.length} characters</span>
                <span>Unicode U+11080–U+110CF</span>
              </div>
            </div>

            {/* Devanagari Transliteration Box */}
            <div className="space-y-2 flex flex-col">
              <div className="flex items-center justify-between">
                <label className="font-devanagari text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span>देवनागरी लिप्यंतरण (Devanagari)</span>
                  {hasDevaChanged && (
                    <span className="text-[10px] text-amber-500">• Modified</span>
                  )}
                </label>
                <button
                  onClick={handleTransliterateDevaToKaithi}
                  disabled={isTransliterating}
                  className="flex items-center space-x-1 text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-medium transition-colors"
                >
                  <ArrowRightLeft className="w-3 h-3" />
                  <span>← Sync to Kaithi</span>
                </button>
              </div>

              <textarea
                value={devanagariText}
                onChange={(e) => {
                  setDevanagariText(e.target.value);
                  pushState(kaithiText, e.target.value, englishText);
                }}
                rows={6}
                className="w-full p-4 rounded-xl font-devanagari text-base bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 leading-relaxed resize-y shadow-inner"
                placeholder="देवनागरी पाठ यहाँ संपादित करें..."
              />
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>{devanagariText.length} characters</span>
                <span>NFC Normalized</span>
              </div>
            </div>
          </div>

          {/* English Translation Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-cinzel text-xs font-bold text-amber-700 dark:text-amber-300">
                English Translation (Semantic Interpretation)
              </label>
              <button
                onClick={handleReTranslate}
                disabled={isTranslating}
                className="flex items-center space-x-1 text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-medium transition-colors"
              >
                {isTranslating ? (
                  <RotateCcw className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                <span>Re-Translate from Devanagari</span>
              </button>
            </div>
            <textarea
              value={englishText}
              onChange={(e) => {
                setEnglishText(e.target.value);
                pushState(kaithiText, devanagariText, e.target.value);
              }}
              rows={3}
              className="w-full p-4 rounded-xl text-sm bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-500 leading-relaxed resize-y"
              placeholder="English translation..."
            />
          </div>

          {/* Archivist Notes */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Archivist Annotation / Ground Truth Source (Optional)
            </label>
            <input
              type="text"
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="e.g. Cross-referenced with 1894 Shahabad revenue settlement ledger roll, plot #22..."
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-300 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSubmitArchivistFeedback}
              disabled={feedbackSent}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 border border-amber-500/30 text-xs font-medium text-amber-800 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-200 transition-all active:scale-95 shadow-sm"
            >
              {feedbackSent ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">Correction Saved to Model Corpus!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Contribute Correction to Dataset</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndApply}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-gold-glow transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Apply Changes to Viewer</span>
            </button>
          </div>
        </div>

        {/* Virtual Keyboard popover */}
        <VirtualKeyboard
          isOpen={isKeyboardOpen}
          onClose={() => setIsKeyboardOpen(false)}
          onInsertChar={handleInsertChar}
        />
      </div>
    </div>
  );
}
