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
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    setKaithiText(initialKaithi || '');
    setDevanagariText(initialDevanagari || '');
    setEnglishText(initialEnglish || '');
    setFeedbackSent(false);
  }, [initialKaithi, initialDevanagari, initialEnglish, isOpen]);

  if (!isOpen) return null;

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
      }
    } catch (e) {
      console.error('Transliteration failed', e);
    } finally {
      setIsTransliterating(false);
    }
  };

  const handleReTranslate = async () => {
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: devanagariText, target_lang: 'en' }),
      });
      const data = await res.json();
      if (data.translated_text) {
        setEnglishText(data.translated_text);
      }
    } catch (e) {
      console.error('Translation failed', e);
    }
  };

  const handleInsertChar = (char) => {
    setKaithiText((prev) => prev + char);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] glass-panel-gold rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-amber-500/30">
        {/* Header */}
        <div className="p-5 border-b border-amber-500/20 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg font-bold text-amber-200 tracking-wide">
                Human-in-the-Loop Archivist Correction Editor
              </h2>
              <p className="text-xs text-slate-400">
                Review OCR transcriptions, fix character errors, and contribute to the Kaithi training corpus
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsKeyboardOpen(!isKeyboardOpen)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-xs text-amber-300 border border-slate-700 transition-colors"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>{isKeyboardOpen ? 'Hide Keyboard' : 'Open Keyboard'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Editor Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Kaithi Script Box */}
            <div className="space-y-2 flex flex-col">
              <div className="flex items-center justify-between">
                <label className="font-cinzel text-xs font-bold text-amber-300">
                  Kaithi Script Text (𑂍𑂶𑂟𑂲)
                </label>
                <button
                  onClick={handleTransliterateKaithiToDeva}
                  disabled={isTransliterating}
                  className="flex items-center space-x-1 text-[11px] text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  <ArrowRightLeft className="w-3 h-3" />
                  <span>Sync to Devanagari →</span>
                </button>
              </div>

              <textarea
                value={kaithiText}
                onChange={(e) => setKaithiText(e.target.value)}
                rows={6}
                className="w-full p-4 rounded-xl font-kaithi text-lg bg-slate-900/90 border border-amber-500/30 text-amber-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 leading-relaxed resize-y"
                placeholder="Enter Kaithi script characters (e.g. 𑂍𑂶𑂟𑂲)..."
              />
              <span className="text-[10px] text-slate-500 font-mono">
                {kaithiText.length} characters
              </span>
            </div>

            {/* Devanagari Box */}
            <div className="space-y-2 flex flex-col">
              <div className="flex items-center justify-between">
                <label className="font-devanagari text-xs font-bold text-slate-200">
                  देवनागरी लिप्यंतरण (Devanagari Transliteration)
                </label>
                <button
                  onClick={handleTransliterateDevaToKaithi}
                  disabled={isTransliterating}
                  className="flex items-center space-x-1 text-[11px] text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  <ArrowRightLeft className="w-3 h-3" />
                  <span>← Sync to Kaithi</span>
                </button>
              </div>

              <textarea
                value={devanagariText}
                onChange={(e) => setDevanagariText(e.target.value)}
                rows={6}
                className="w-full p-4 rounded-xl font-devanagari text-base bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 leading-relaxed resize-y"
                placeholder="देवनागरी पाठ यहाँ संपादित करें..."
              />
              <span className="text-[10px] text-slate-500 font-mono">
                {devanagariText.length} characters
              </span>
            </div>
          </div>

          {/* English Translation Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-cinzel text-xs font-bold text-amber-300">
                English Translation
              </label>
              <button
                onClick={handleReTranslate}
                className="flex items-center space-x-1 text-[11px] text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>Re-Translate from Devanagari</span>
              </button>
            </div>
            <textarea
              value={englishText}
              onChange={(e) => setEnglishText(e.target.value)}
              rows={3}
              className="w-full p-4 rounded-xl text-sm bg-slate-900/90 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 leading-relaxed resize-y"
              placeholder="English translation..."
            />
          </div>

          {/* Archivist Notes */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Archivist Verification Notes (Optional)
            </label>
            <input
              type="text"
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="e.g. Cross-referenced with 1894 Shahabad revenue settlement ledger roll..."
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-900/90 border border-slate-800 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSubmitArchivistFeedback}
              disabled={feedbackSent}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-xs font-medium text-amber-300 hover:text-amber-200 transition-all active:scale-95"
            >
              {feedbackSent ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Feedback Saved to Model!</span>
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
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndApply}
              className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-gold-glow transition-all active:scale-95"
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
