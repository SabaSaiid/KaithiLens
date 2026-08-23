import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  BookOpen,
  Keyboard,
  Download,
  Edit3,
  GraduationCap,
  Sun,
  Moon,
  Scroll,
  ArrowRight,
  Sparkles,
  X,
  Scale,
} from 'lucide-react';

export default function CommandPalette({
  isOpen,
  onClose,
  samples = [],
  onSelectSample,
  onOpenEditor,
  onOpenExport,
  onOpenGlossary,
  onOpenPrimer,
  onOpenKeyboard,
  onOpenLicense,
  onToggleTheme,
  isDark,
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'editor',
      title: 'Open Archivist Correction Studio',
      subtitle: 'Review & correct OCR extractions and submit to dataset',
      icon: Edit3,
      action: () => {
        onOpenEditor();
        onClose();
      },
    },
    {
      id: 'primer',
      title: 'Open Kaithi Script Academy',
      subtitle: 'Explore Brahmi-to-Kaithi evolution, stroke guides & timeline',
      icon: GraduationCap,
      action: () => {
        onOpenPrimer();
        onClose();
      },
    },
    {
      id: 'glossary',
      title: 'Search Legal & Cadastral Lexicon',
      subtitle: 'Archaic terms (Mauza, Khatiyan, Zamindar, Bigha)',
      icon: BookOpen,
      action: () => {
        onOpenGlossary();
        onClose();
      },
    },
    {
      id: 'keyboard',
      title: 'Toggle Kaithi Virtual Keyboard',
      subtitle: 'Type Unicode Kaithi glyphs with phonetic help',
      icon: Keyboard,
      action: () => {
        onOpenKeyboard();
        onClose();
      },
    },
    {
      id: 'export',
      title: 'Export Archival Dossier & Certificates',
      subtitle: 'Download TEI-XML, Markdown, JSON, or print PDF',
      icon: Download,
      action: () => {
        onOpenExport();
        onClose();
      },
    },
    {
      id: 'theme',
      title: isDark ? 'Switch to Heritage Parchment Mode (Light)' : 'Switch to Nocturne Archival Mode (Dark)',
      subtitle: 'Toggle between handmade paper and glowing dark slate',
      icon: isDark ? Sun : Moon,
      action: () => {
        onToggleTheme();
        onClose();
      },
    },
    {
      id: 'license',
      title: 'Open Source MIT License & Legal Terms',
      subtitle: 'View permissive rights, conditions, and scholarly ethics',
      icon: Scale,
      action: () => {
        if (onOpenLicense) onOpenLicense();
        onClose();
      },
    },
  ];

  // Also include samples in the searchable commands
  const sampleActions = samples.map((s) => ({
    id: `sample-${s.id}`,
    title: `Load Sample: ${s.title}`,
    subtitle: `${s.region} (${s.date})`,
    icon: Scroll,
    action: () => {
      onSelectSample(s.id);
      onClose();
    },
  }));

  const allItems = [...actions, ...sampleActions];

  const filteredItems = allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault();
      filteredItems[selectedIndex].action();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl glass-panel-gold rounded-2xl overflow-hidden shadow-2xl border border-amber-500/40 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-amber-500/20 flex items-center space-x-3 bg-slate-100/90 dark:bg-slate-900/80">
          <Search className="w-5 h-5 text-amber-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search (e.g. 'export', 'editor', 'land deed')..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-amber-500/20 dark:bg-amber-500/25 border border-amber-500/40 text-amber-900 dark:text-amber-200'
                      : 'hover:bg-slate-200/60 dark:hover:bg-slate-900/50 text-slate-800 dark:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-amber-600 dark:text-amber-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">{item.title}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.subtitle}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 opacity-60" />
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching actions or documents found.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 border-t border-slate-300 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-amber-600 dark:text-amber-400 font-mono">KaithiLens Quick Actions</span>
        </div>
      </div>
    </div>
  );
}
