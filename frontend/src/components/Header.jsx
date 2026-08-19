import React from 'react';
import { Sparkles, BookOpen, Keyboard, ShieldCheck, Github, ScrollText, Landmark } from 'lucide-react';

export default function Header({
  onOpenKeyboard,
  onOpenGlossary,
  backendHealth,
  onSelectSample,
}) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-amber-500/20 px-6 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Script Emblem */}
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-700/40 border border-amber-500/50 flex items-center justify-center shadow-gold-glow">
            <span className="font-kaithi text-2xl text-amber-200 select-none">𑂍𑂶</span>
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="font-cinzel text-2xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent tracking-wide">
                KaithiLens
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 tracking-wider uppercase">
                v1.0 AI Pipeline
              </span>
            </div>
            <p className="text-xs text-slate-400 font-light flex items-center gap-1.5">
              <span>Historical Manuscript Digitization</span>
              <span className="text-amber-500/60">•</span>
              <span className="font-kaithi text-amber-300/80">𑂍𑂶𑂟𑂲</span>
              <span className="text-amber-500/60">→</span>
              <span className="font-devanagari text-slate-300">देवनागरी</span>
              <span className="text-amber-500/60">→</span>
              <span>English</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Health status */}
        <div className="flex items-center space-x-3">
          {/* Virtual Keyboard Toggle */}
          <button
            onClick={onOpenKeyboard}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-amber-500/20 border border-slate-700/80 hover:border-amber-500/40 text-xs font-medium text-slate-200 hover:text-amber-200 transition-all shadow-sm"
          >
            <Keyboard className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Script Keyboard</span>
          </button>

          {/* Lexicon / Glossary */}
          <button
            onClick={onOpenGlossary}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-amber-500/20 border border-slate-700/80 hover:border-amber-500/40 text-xs font-medium text-slate-200 hover:text-amber-200 transition-all shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Legal Glossary</span>
          </button>

          {/* API Health Pill */}
          <div
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs"
            title={backendHealth?.status === 'healthy' ? 'Backend API Connected' : 'Checking connection...'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                backendHealth?.status === 'healthy'
                  ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                  : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="text-slate-300 font-mono text-[11px] hidden md:inline">
              {backendHealth?.status === 'healthy' ? 'API Online' : 'Connecting...'}
            </span>
          </div>

          {/* GitHub Repo */}
          <a
            href="https://github.com/SabaSaiid/KaithiLens"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
