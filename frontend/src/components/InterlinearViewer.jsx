import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  ArrowRight,
  Search,
  ExternalLink,
} from 'lucide-react';

export default function InterlinearViewer({
  pipelineResult,
  onOpenGlossary,
  onOpenEditor,
}) {
  const [copiedLine, setCopiedLine] = useState(null);
  const [activeAudioLine, setActiveAudioLine] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (!pipelineResult) return null;

  const { ocr, transliteration, translation } = pipelineResult;

  const kaithiLines = (ocr?.raw_kaithi || '').split('\n').filter(Boolean);
  const devaLines = (transliteration?.devanagari || '').split('\n').filter(Boolean);
  const iastLines = (transliteration?.iast || '').split('\n').filter(Boolean);
  const englishLines = (translation?.english || '').split('\n').filter(Boolean);

  const maxLines = Math.max(
    kaithiLines.length,
    devaLines.length,
    englishLines.length
  );

  const handleCopy = (text, identifier) => {
    navigator.clipboard.writeText(text);
    setCopiedLine(identifier);
    setTimeout(() => setCopiedLine(null), 2000);
  };

  const handlePlayLineTTS = (text, lang, lineIdx) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (activeAudioLine === lineIdx) {
      window.speechSynthesis.cancel();
      setActiveAudioLine(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.85;

    utterance.onstart = () => setActiveAudioLine(lineIdx);
    utterance.onend = () => setActiveAudioLine(null);
    utterance.onerror = () => setActiveAudioLine(null);

    window.speechSynthesis.speak(utterance);
  };

  const linesList = [];
  for (let i = 0; i < maxLines; i++) {
    linesList.push({
      lineNum: i + 1,
      kaithi: kaithiLines[i] || '',
      deva: devaLines[i] || '',
      iast: iastLines[i] || '',
      english: englishLines[i] || '',
    });
  }

  const filteredLines = linesList.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.kaithi.includes(term) ||
      item.deva.includes(term) ||
      item.iast.toLowerCase().includes(term) ||
      item.english.toLowerCase().includes(term)
    );
  });

  return (
    <div className="w-full space-y-4">
      {/* Search and Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 glass-panel-gold rounded-xl border border-amber-500/30">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <h4 className="font-cinzel text-xs font-bold text-slate-800 dark:text-amber-200">
            Leipzig-Style Interlinear Glossing Reader
          </h4>
          <span className="text-[10px] bg-amber-500/15 text-amber-700 dark:text-amber-300 font-mono px-2 py-0.5 rounded-full border border-amber-500/30">
            {filteredLines.length} of {maxLines} Lines
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter line text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 pr-3 py-1 bg-slate-200/70 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Interlinear Cards Stack */}
      <div className="space-y-4">
        {filteredLines.map((item, idx) => {
          const isAudioActive = activeAudioLine === item.lineNum;
          return (
            <div
              key={item.lineNum}
              className="interlinear-card glass-panel rounded-2xl p-5 border border-slate-300 dark:border-slate-800/90 space-y-3.5 shadow-sm"
            >
              {/* Line Metadata Bar */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2 text-[11px]">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                    Verse #{item.lineNum}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[10px]">
                    Kaithi Unicode Manuscript
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Pronounce Line TTS */}
                  <button
                    onClick={() =>
                      handlePlayLineTTS(item.deva || item.kaithi, 'hi', item.lineNum)
                    }
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs transition-colors ${
                      isAudioActive
                        ? 'bg-amber-500 text-slate-950 font-bold animate-pulse'
                        : 'bg-slate-200/80 dark:bg-slate-800/80 hover:bg-amber-500/20 text-slate-700 dark:text-slate-300'
                    }`}
                    title="Pronounce this verse in historical pronunciation"
                  >
                    {isAudioActive ? (
                      <>
                        <VolumeX className="w-3 h-3" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3 text-amber-500" />
                        <span>Listen</span>
                      </>
                    )}
                  </button>

                  {/* Copy Row */}
                  <button
                    onClick={() =>
                      handleCopy(
                        `Kaithi: ${item.kaithi}\nIAST: ${item.iast}\nDevanagari: ${item.deva}\nEnglish: ${item.english}`,
                        `row_${item.lineNum}`
                      )
                    }
                    className="p-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 hover:bg-amber-500/20 text-slate-700 dark:text-slate-300 text-xs"
                    title="Copy this interlinear verse"
                  >
                    {copiedLine === `row_${item.lineNum}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Interlinear 4-Tier Presentation Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start">
                {/* 1. Kaithi Script (Large, Distinctive) */}
                <div className="md:col-span-12 p-3 rounded-xl parchment-card-dark border border-amber-500/25">
                  <div className="text-[10px] text-amber-700 dark:text-amber-400 font-medium mb-1 uppercase tracking-wider flex items-center justify-between">
                    <span>1. Historical Kaithi Script (𑂍𑂶𑂟𑂲)</span>
                    <span className="font-kaithi text-xs text-amber-600">𑂍𑂶</span>
                  </div>
                  <div className="font-kaithi text-2xl text-slate-900 dark:text-amber-100 leading-relaxed select-text tracking-wide">
                    {item.kaithi || '—'}
                  </div>
                </div>

                {/* 2. IAST Romanization (Academic Indology) */}
                <div className="md:col-span-6 p-3 rounded-xl bg-slate-100 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-1 uppercase tracking-wider">
                    2. IAST Romanization (ISO 15919)
                  </div>
                  <div className="font-serif italic text-sm text-amber-700 dark:text-amber-300/90 leading-relaxed select-text">
                    {item.iast || '—'}
                  </div>
                </div>

                {/* 3. Devanagari Transliteration */}
                <div className="md:col-span-6 p-3 rounded-xl bg-slate-100 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-1 uppercase tracking-wider">
                    3. Devanagari Script (देवनागरी)
                  </div>
                  <div className="font-devanagari text-base text-slate-800 dark:text-slate-200 leading-relaxed select-text font-medium">
                    {item.deva || '—'}
                  </div>
                </div>

                {/* 4. English Semantic Translation */}
                <div className="md:col-span-12 p-3 rounded-xl bg-amber-500/5 dark:bg-slate-950/70 border border-amber-500/20">
                  <div className="text-[10px] text-amber-700 dark:text-amber-400 font-medium mb-1 uppercase tracking-wider">
                    4. English Translation & Meaning
                  </div>
                  <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed select-text font-light">
                    {item.english || '—'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
