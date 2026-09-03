import React from 'react';
import { Keyboard, X, Command, Sliders, Eye, Sparkles } from 'lucide-react';

export default function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcutSections = [
    {
      title: 'Global Navigation & Workspaces',
      items: [
        { key: '⌘ / Ctrl + K', desc: 'Open Universal Command Palette' },
        { key: '⌘ / Ctrl + E', desc: 'Open Archivist Correction Studio' },
        { key: '⌘ / Ctrl + S', desc: 'Open Live Script Sandbox' },
        { key: '?', desc: 'Toggle this Keyboard Shortcuts Guide' },
        { key: 'Esc', desc: 'Close any active modal or drawer' },
      ],
    },
    {
      title: 'Manuscript Canvas & Image Studio',
      items: [
        { key: '+  /  -', desc: 'Zoom In / Zoom Out on manuscript' },
        { key: '0', desc: 'Reset Pan, Zoom, and Rotation to default' },
        { key: 'L', desc: 'Toggle 3x Calligraphic Loupe Magnifier' },
        { key: 'C', desc: 'Toggle Region of Interest (ROI) Cropper' },
        { key: 'I', desc: 'Invert ink polarity (Chalk / Dark Ink)' },
        { key: 'B', desc: 'Show / Hide OCR Region Bounding Boxes' },
      ],
    },
    {
      title: 'Linguistics & Playback',
      items: [
        { key: 'Space', desc: 'Play / Stop TTS Audio Pronunciation' },
        { key: 'V', desc: 'Toggle On-Screen Kaithi Virtual Keyboard' },
        { key: 'Tab', desc: 'Cycle through view modes in workspace' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel-gold rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-amber-500/40">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-500/20 bg-slate-100/90 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 flex items-center justify-center">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-base sm:text-lg font-bold text-slate-900 dark:text-amber-200">
                Keyboard Shortcuts Reference
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Archivist speed shortcuts for rapid transcription and inspection
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

        {/* Shortcuts List */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[70vh]">
          {shortcutSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-2.5">
              <h3 className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                {sec.title}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {sec.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-200/50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 text-xs"
                  >
                    <span className="text-slate-700 dark:text-slate-300">{item.desc}</span>
                    <kbd className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-amber-300 font-mono text-[11px] font-semibold shadow-sm">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
