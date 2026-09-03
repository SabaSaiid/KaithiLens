import React, { useState } from 'react';
import {
  FileDiff,
  X,
  ArrowRightLeft,
  Check,
  Copy,
  RotateCcw,
  Sparkles,
  GitCompare,
} from 'lucide-react';

export default function DocumentDiffModal({
  isOpen,
  onClose,
  originalText,
  editedText,
  documentTitle,
  onRestoreOriginal,
}) {
  const [diffMode, setDiffMode] = useState('split'); // 'split' | 'unified'
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const origLines = (originalText || '').split('\n');
  const editLines = (editedText || '').split('\n');
  const maxLines = Math.max(origLines.length, editLines.length);

  // Simple token-level difference calculation
  const computeWordDiff = (line1 = '', line2 = '') => {
    const words1 = line1.split(/\s+/).filter(Boolean);
    const words2 = line2.split(/\s+/).filter(Boolean);

    // If identical
    if (line1 === line2) {
      return { status: 'unchanged', words1, words2 };
    }

    return {
      status: 'modified',
      words1: words1.map((w) => ({
        word: w,
        removed: !words2.includes(w),
      })),
      words2: words2.map((w) => ({
        word: w,
        added: !words1.includes(w),
      })),
    };
  };

  const lineDiffs = [];
  let additionsCount = 0;
  let deletionsCount = 0;

  for (let i = 0; i < maxLines; i++) {
    const l1 = origLines[i] || '';
    const l2 = editLines[i] || '';
    const diff = computeWordDiff(l1, l2);
    if (diff.status === 'modified') {
      diff.words1?.forEach((w) => w.removed && deletionsCount++);
      diff.words2?.forEach((w) => w.added && additionsCount++);
    }
    lineDiffs.push({ lineNum: i + 1, l1, l2, diff });
  }

  const handleCopy = () => {
    const text = `--- Original OCR ---\n${originalText}\n\n+++ Archivist Edit +++\n${editedText}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] glass-panel-gold rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-amber-500/40">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-500/20 bg-slate-100/90 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 flex items-center justify-center">
              <FileDiff className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-cinzel text-base sm:text-lg font-bold text-slate-900 dark:text-amber-200 tracking-wide">
                  Transcription Revision Diff
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  {documentTitle || 'Manuscript Record'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visual delta comparing original AI vision extraction vs archivist refinement
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            {/* Diff Mode Toggle */}
            <div className="flex bg-slate-200 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-300 dark:border-slate-800 text-[11px]">
              <button
                onClick={() => setDiffMode('split')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  diffMode === 'split'
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Side-by-Side
              </button>
              <button
                onClick={() => setDiffMode('unified')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  diffMode === 'unified'
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Unified
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 hover:bg-amber-500/20 text-slate-700 dark:text-slate-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Delta Metrics Bar */}
        <div className="p-3 border-b border-slate-300 dark:border-slate-800/80 bg-slate-200/50 dark:bg-slate-950/60 flex items-center justify-between text-xs px-6">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>+{additionsCount} Additions</span>
            </span>
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>-{deletionsCount} Deletions</span>
            </span>
          </div>

          {onRestoreOriginal && (
            <button
              onClick={() => {
                onRestoreOriginal();
                onClose();
              }}
              className="text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Revert to Original AI Extraction</span>
            </button>
          )}
        </div>

        {/* Diff Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {diffMode === 'split' ? (
            /* Split View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              {/* Left: Original AI OCR */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Original AI Vision Model Output</span>
                  <span>(Baseline)</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 space-y-3">
                  {lineDiffs.map((row) => (
                    <div key={row.lineNum} className="flex items-start space-x-2">
                      <span className="text-slate-400 select-none w-6 shrink-0 text-right">
                        {row.lineNum}
                      </span>
                      <div className="flex-1 font-kaithi text-lg leading-relaxed">
                        {row.diff.status === 'unchanged' ? (
                          <span className="text-slate-800 dark:text-slate-200">
                            {row.l1 || ' '}
                          </span>
                        ) : (
                          row.diff.words1?.map((w, idx) => (
                            <span
                              key={idx}
                              className={`mr-1 inline-block ${
                                w.removed
                                  ? 'bg-rose-500/25 text-rose-800 dark:text-rose-300 rounded px-1 line-through'
                                  : 'text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              {w.word}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Archivist Corrections */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Archivist Corrected Version</span>
                  <span>(Refined)</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 space-y-3">
                  {lineDiffs.map((row) => (
                    <div key={row.lineNum} className="flex items-start space-x-2">
                      <span className="text-slate-400 select-none w-6 shrink-0 text-right">
                        {row.lineNum}
                      </span>
                      <div className="flex-1 font-kaithi text-lg leading-relaxed">
                        {row.diff.status === 'unchanged' ? (
                          <span className="text-slate-800 dark:text-slate-200">
                            {row.l2 || ' '}
                          </span>
                        ) : (
                          row.diff.words2?.map((w, idx) => (
                            <span
                              key={idx}
                              className={`mr-1 inline-block ${
                                w.added
                                  ? 'bg-emerald-500/25 text-emerald-800 dark:text-emerald-300 font-bold rounded px-1'
                                  : 'text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              {w.word}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Unified Line Diff View */
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 font-mono text-xs space-y-2">
              {lineDiffs.map((row) => (
                <div key={row.lineNum} className="space-y-1 py-1 border-b border-slate-200 dark:border-slate-800/60 last:border-0">
                  {row.diff.status === 'unchanged' ? (
                    <div className="flex items-start space-x-2 text-slate-700 dark:text-slate-300">
                      <span className="text-slate-400 w-8 select-none">{row.lineNum}</span>
                      <span className="font-kaithi text-lg">{row.l1}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start space-x-2 bg-rose-500/15 text-rose-800 dark:text-rose-300 p-1 rounded">
                        <span className="text-rose-500 w-8 select-none">-{row.lineNum}</span>
                        <span className="font-kaithi text-lg">{row.l1}</span>
                      </div>
                      <div className="flex items-start space-x-2 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 p-1 rounded">
                        <span className="text-emerald-500 w-8 select-none">+{row.lineNum}</span>
                        <span className="font-kaithi text-lg font-bold">{row.l2}</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
