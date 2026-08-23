import React from 'react';
import {
  History,
  X,
  Trash2,
  Scroll,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function HistoryDrawer({
  isOpen,
  onClose,
  history = [],
  onSelectHistoryItem,
  onClearHistory,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md h-full glass-panel-gold border-l border-amber-500/30 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-amber-500/20 flex items-center justify-between bg-slate-100/90 dark:bg-slate-900/70">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-300">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-base font-bold text-slate-900 dark:text-amber-200">
                Recent Archival Sessions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cached manuscripts & archivist workspace states
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length > 0 ? (
            history.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelectHistoryItem(item);
                  onClose();
                }}
                className="p-4 rounded-xl bg-slate-100/90 dark:bg-slate-900/80 hover:bg-amber-500/15 border border-slate-300 dark:border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group flex flex-col justify-between space-y-2 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Scroll className="w-4 h-4 text-amber-500 shrink-0" />
                    <h4 className="font-cinzel text-xs font-bold text-slate-900 dark:text-amber-200 group-hover:text-amber-600 dark:group-hover:text-amber-300 line-clamp-1">
                      {item.title || 'Historical Document'}
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-slate-200/70 dark:bg-slate-950/70 text-[11px] font-kaithi text-amber-800 dark:text-amber-200/90 line-clamp-1">
                  {item.pipelineResult?.ocr?.raw_kaithi || ''}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                  <span>Confidence: {Math.round((item.pipelineResult?.ocr?.confidence || 0.95) * 100)}%</span>
                  <span className="text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    Restore <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-xs text-slate-500 space-y-2">
              <Scroll className="w-8 h-8 mx-auto text-slate-400 opacity-50" />
              <p>No previous document sessions found in local cache.</p>
              <p className="text-[10px] text-slate-400">Processed manuscripts will appear here automatically.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-slate-300 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-950/80 flex items-center justify-between">
            <button
              onClick={onClearHistory}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Session History</span>
            </button>
            <span className="text-xs text-slate-500">{history.length} items saved</span>
          </div>
        )}
      </div>
    </div>
  );
}
