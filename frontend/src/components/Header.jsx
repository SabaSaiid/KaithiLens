import React from 'react';
import {
  BookOpen,
  Keyboard,
  Sun,
  Moon,
  Command,
  GraduationCap,
  History,
  Github,
  Sparkles,
  Search,
  Terminal,
  HelpCircle,
} from 'lucide-react';

export default function Header({
  isDark,
  onToggleTheme,
  onOpenKeyboard,
  onOpenGlossary,
  onOpenPrimer,
  onOpenHistory,
  onOpenCommandPalette,
  onOpenSandbox,
  onOpenShortcuts,
  backendHealth,
  historyCount = 0,
}) {

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-amber-500/20 px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Script Emblem */}
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-700/40 border border-amber-500/50 flex items-center justify-center shadow-gold-glow group cursor-pointer hover:scale-105 transition-all">
            <span className="font-kaithi text-2xl text-amber-300 dark:text-amber-200 select-none group-hover:rotate-6 transition-transform">
              𑂍𑂶
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="font-cinzel text-2xl font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 dark:from-amber-200 dark:via-amber-400 dark:to-amber-100 bg-clip-text text-transparent tracking-wide">
                KaithiLens
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 tracking-wider uppercase">
                v1.0 AI Pipeline
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light flex items-center gap-1.5 flex-wrap">
              <span>Historical Manuscript Digitization</span>
              <span className="text-amber-500/60">•</span>
              <span className="font-kaithi text-amber-600 dark:text-amber-300">𑂍𑂶𑂟𑂲</span>
              <span className="text-amber-500/60">→</span>
              <span className="font-devanagari text-slate-700 dark:text-slate-300">देवनागरी</span>
              <span className="text-amber-500/60">→</span>
              <span>English</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Utilities */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
          {/* Quick Command Palette Button */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-200/70 hover:bg-amber-500/20 dark:bg-slate-900/80 dark:hover:bg-amber-500/20 border border-slate-300/80 dark:border-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-200 transition-all shadow-sm group"
            title="Command Palette (Cmd/Ctrl + K)"
          >
            <Command className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Search & Actions</span>
            <kbd className="hidden lg:inline text-[10px] bg-slate-300/60 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Kaithi Academy / Primer */}
          <button
            onClick={onOpenPrimer}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-200/70 hover:bg-amber-500/20 dark:bg-slate-900/80 dark:hover:bg-amber-500/20 border border-slate-300/80 dark:border-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-200 transition-all shadow-sm"
            title="Kaithi Script Learning Academy & Evolution Primer"
          >
            <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">Script Academy</span>
          </button>

          {/* Virtual Keyboard Toggle */}
          <button
            onClick={onOpenKeyboard}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-200/70 hover:bg-amber-500/20 dark:bg-slate-900/80 dark:hover:bg-amber-500/20 border border-slate-300/80 dark:border-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-200 transition-all shadow-sm"
            title="Virtual Kaithi Script Keyboard"
          >
            <Keyboard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">Keyboard</span>
          </button>

          {/* Script Sandbox */}
          {onOpenSandbox && (
            <button
              onClick={onOpenSandbox}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-200/70 hover:bg-amber-500/20 dark:bg-slate-900/80 dark:hover:bg-amber-500/20 border border-slate-300/80 dark:border-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-200 transition-all shadow-sm"
              title="Interactive Kaithi Script Sandbox (Scratchpad)"
            >
              <Terminal className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">Sandbox</span>
            </button>
          )}

          {/* Lexicon / Glossary */}
          <button
            onClick={onOpenGlossary}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-200/70 hover:bg-amber-500/20 dark:bg-slate-900/80 dark:hover:bg-amber-500/20 border border-slate-300/80 dark:border-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-200 transition-all shadow-sm"
            title="Historical Land Record & Legal Lexicon"
          >
            <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">Lexicon</span>
          </button>

          {/* Shortcuts Guide */}
          {onOpenShortcuts && (
            <button
              onClick={onOpenShortcuts}
              className="p-2 rounded-xl bg-slate-200/70 hover:bg-amber-500/20 dark:bg-slate-900/80 dark:hover:bg-amber-500/20 border border-slate-300/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
              title="Keyboard Shortcuts Guide (?)"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          )}


          {/* Session History Drawer */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-200/70 hover:bg-amber-500/20 dark:bg-slate-900/80 dark:hover:bg-amber-500/20 border border-slate-300/80 dark:border-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-200 transition-all shadow-sm"
            title="Recent Document Sessions"
          >
            <History className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </button>

          {/* Theme Switcher: Parchment Light <-> Nocturne Dark */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-200/70 hover:bg-amber-500/25 dark:bg-slate-900/80 dark:hover:bg-amber-500/20 border border-slate-300/80 dark:border-slate-700/80 text-slate-700 dark:text-amber-300 transition-colors"
            title={isDark ? "Switch to Heritage Parchment Mode (Light)" : "Switch to Nocturne Archival Mode (Dark)"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* API Health Pill */}
          <div
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-200/80 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 text-xs"
            title={backendHealth?.status === 'healthy' ? 'FastAPI Backend Engine Online' : 'Connecting to API...'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                backendHealth?.status === 'healthy'
                  ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                  : 'bg-amber-500 animate-pulse'
              }`}
            />
            <span className="text-slate-600 dark:text-slate-300 font-mono text-[10px] hidden md:inline">
              {backendHealth?.status === 'healthy' ? 'API Online' : 'Connecting...'}
            </span>
          </div>

          {/* GitHub Link */}
          <a
            href="https://github.com/SabaSaiid/KaithiLens"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors"
            title="View on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
