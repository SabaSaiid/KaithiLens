import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Edit3,
  Download,
  Eye,
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Flame,
  ExternalLink,
  GitCompare,
  Columns,
  Rows,
  SplitSquareVertical,
  Terminal,
} from 'lucide-react';
import DocumentMetrics from './DocumentMetrics';
import ManuscriptCanvas from './ManuscriptCanvas';
import InterlinearViewer from './InterlinearViewer';
import StructuredMetadataCard from './StructuredMetadataCard';

export default function PipelineViewer({
  pipelineResult,
  onOpenEditor,
  onOpenExport,
  onOpenGlossary,
  onOpenDiff,
  onOpenSandbox,
  originalImagePreview,
  documentTitle,
}) {
  const [viewMode, setViewMode] = useState('tri_column'); // 'tri_column' | 'interlinear' | 'bilingual' | 'zen'
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [copiedSection, setCopiedSection] = useState(null);
  const [selectedChar, setSelectedChar] = useState(null);
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState(null);
  const [hoveredWordIndex, setHoveredWordIndex] = useState(null);

  // Audio Speech Synthesis state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentAudioSection, setCurrentAudioSection] = useState(null); // 'deva' | 'en'

  if (!pipelineResult) return null;

  const { preprocessing, ocr, transliteration, translation, structured_metadata } = pipelineResult;

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleCopy = (text, sectionName) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Text to Speech playback
  const handlePlayTTS = (text, lang, section) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlayingAudio && currentAudioSection === section) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setCurrentAudioSection(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.9;

    utterance.onstart = () => {
      setIsPlayingAudio(true);
      setCurrentAudioSection(section);
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setCurrentAudioSection(null);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setCurrentAudioSection(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Tokenize lines & words for synchronized reading
  const kaithiWords = (ocr?.raw_kaithi || '').split(/\s+/).filter(Boolean);
  const devaWords = (transliteration?.devanagari || '').split(/\s+/).filter(Boolean);
  const englishLines = (translation?.english || '').split('\n').filter(Boolean);

  return (
    <div
      className={`w-full space-y-6 ${
        viewMode === 'zen'
          ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto'
          : ''
      }`}
    >
      {/* Document Metrics Bar */}
      {viewMode !== 'zen' && (
        <DocumentMetrics pipelineResult={pipelineResult} activeTitle={documentTitle} />
      )}

      {/* Top Action Ribbon with View Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl glass-panel-gold border border-amber-500/30">
        <div className="flex items-center space-x-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div>
            <h3 className="font-cinzel font-bold text-slate-800 dark:text-amber-200 text-sm">
              Archival Workspace Active
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive Multi-Mode Inspection Studio
            </p>
          </div>
        </div>

        {/* View Mode Pills */}
        <div className="flex bg-slate-200/80 dark:bg-slate-950/80 p-1 rounded-xl border border-slate-300 dark:border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('tri_column')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
              viewMode === 'tri_column'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-amber-500'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Studio</span>
          </button>
          <button
            onClick={() => setViewMode('interlinear')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
              viewMode === 'interlinear'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-amber-500'
            }`}
          >
            <Rows className="w-3.5 h-3.5" />
            <span>Interlinear</span>
          </button>
          <button
            onClick={() => setViewMode('bilingual')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
              viewMode === 'bilingual'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-amber-500'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Bilingual Split</span>
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'zen' ? 'tri_column' : 'zen')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
              viewMode === 'zen'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-amber-500'
            }`}
            title="Toggle Fullscreen Focus Mode"
          >
            {viewMode === 'zen' ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit Zen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Zen Mode</span>
              </>
            )}
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Heatmap Toggle */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              showHeatmap
                ? 'bg-amber-500/30 text-amber-700 dark:text-amber-200 border-amber-500/60 shadow-sm'
                : 'bg-slate-200/70 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700/80 hover:border-amber-500/40'
            }`}
            title="Toggle OCR Confidence Heatmap"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Heatmap</span>
          </button>

          {/* Revision Diff Comparator */}
          {onOpenDiff && (
            <button
              onClick={onOpenDiff}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-200/80 dark:bg-slate-900/80 hover:bg-slate-300 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all"
              title="Compare Original AI OCR vs Archivist Corrections"
            >
              <GitCompare className="w-3.5 h-3.5 text-amber-500" />
              <span>Diff</span>
            </button>
          )}

          {/* Script Sandbox Trigger */}
          {onOpenSandbox && (
            <button
              onClick={onOpenSandbox}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-200/80 dark:bg-slate-900/80 hover:bg-slate-300 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all"
              title="Open Bidirectional Script Sandbox"
            >
              <Terminal className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Sandbox</span>
            </button>
          )}

          {/* Archivist Correction Editor */}
          <button
            onClick={onOpenEditor}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-xs font-semibold text-amber-800 dark:text-amber-200 hover:text-amber-950 dark:hover:text-white transition-all shadow-sm active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Editor</span>
          </button>

          {/* Export Dossier */}
          <button
            onClick={onOpenExport}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-200/80 dark:bg-slate-900/80 hover:bg-slate-300 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-black dark:hover:text-white transition-all"
          >
            <Download className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Structured Deed Intelligence Card */}
      {structured_metadata && (
        <StructuredMetadataCard
          structuredMetadata={structured_metadata}
          documentTitle={documentTitle}
        />
      )}

      {/* VIEW MODE 1: INTERLINEAR GLOSSING READER */}
      {viewMode === 'interlinear' && (
        <InterlinearViewer
          pipelineResult={pipelineResult}
          onOpenGlossary={onOpenGlossary}
          onOpenEditor={onOpenEditor}
        />
      )}

      {/* VIEW MODE 2: BILINGUAL SPLIT SCREEN */}
      {viewMode === 'bilingual' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left 6 cols: Manuscript Canvas */}
          <div className="lg:col-span-6 h-[550px]">
            <ManuscriptCanvas
              preprocessing={preprocessing}
              originalImagePreview={originalImagePreview}
              hoveredWordIndex={hoveredWordIndex}
              onHoverBox={setHoveredWordIndex}
            />
          </div>

          {/* Right 6 cols: Synchronized Translation & Reading */}
          <div className="lg:col-span-6 space-y-4 max-h-[550px] overflow-y-auto p-2">
            {/* Kaithi text */}
            <div className="p-4 rounded-xl parchment-card-dark border border-amber-500/25 space-y-2">
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase">
                Kaithi Script (𑂍𑂶𑂟𑂲)
              </span>
              <div className="font-kaithi text-2xl text-slate-900 dark:text-amber-100 leading-relaxed">
                {ocr?.raw_kaithi}
              </div>
            </div>

            {/* IAST text */}
            {transliteration?.iast && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                <span className="text-[10px] font-semibold uppercase text-amber-700 dark:text-amber-400">
                  IAST Romanization
                </span>
                <div className="font-serif italic text-base text-slate-800 dark:text-amber-200 leading-relaxed">
                  {transliteration.iast}
                </div>
              </div>
            )}

            {/* Devanagari text */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Devanagari (देवनागरी)
              </span>
              <div className="font-devanagari text-lg text-slate-900 dark:text-slate-100 leading-relaxed">
                {transliteration?.devanagari}
              </div>
            </div>

            {/* English translation */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                English Translation
              </span>
              <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-light">
                {translation?.english}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: TRI-COLUMN STUDIO & ZEN MODE */}
      {(viewMode === 'tri_column' || viewMode === 'zen') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Column 1: Image & Preprocessing Studio (4 cols) */}
          <div className="lg:col-span-4 min-h-[480px]">
            <ManuscriptCanvas
              preprocessing={preprocessing}
              originalImagePreview={originalImagePreview}
              hoveredWordIndex={hoveredWordIndex}
              onHoverBox={setHoveredWordIndex}
            />
          </div>

          {/* Column 2: Kaithi Script & Devanagari Transliteration (4 cols) */}
          <div className="lg:col-span-4 flex flex-col glass-panel rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-800">
            <div className="p-3.5 border-b border-slate-300 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-kaithi text-amber-600 dark:text-amber-300 text-base">𑂍𑂶</span>
                <h4 className="font-cinzel text-xs font-bold text-slate-800 dark:text-amber-200 tracking-wide">
                  Transliteration Hub
                </h4>
              </div>

              <div className="flex items-center space-x-2">
                {/* Audio TTS Button */}
                <button
                  onClick={() => handlePlayTTS(transliteration?.devanagari, 'hi', 'deva')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                    isPlayingAudio && currentAudioSection === 'deva'
                      ? 'bg-amber-500 text-slate-950 font-bold animate-pulse'
                      : 'bg-slate-200/80 dark:bg-slate-800/80 hover:bg-amber-500/20 text-slate-700 dark:text-slate-300'
                  }`}
                  title="Listen to Devanagari Pronunciation"
                >
                  {isPlayingAudio && currentAudioSection === 'deva' ? (
                    <>
                      <VolumeX className="w-3 h-3" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3 h-3 text-amber-500" />
                      <span>Pronounce</span>
                    </>
                  )}
                </button>

                {/* Copy Button */}
                <button
                  onClick={() => handleCopy(transliteration?.devanagari, 'deva')}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 hover:bg-amber-500/20 text-slate-700 dark:text-slate-300 text-[11px] transition-colors"
                >
                  {copiedSection === 'deva' ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {/* Kaithi OCR Box with Interactive Words */}
              <div className="p-4 rounded-xl parchment-card-dark border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                  <span>Kaithi Unicode (𑂍𑂶𑂟𑂲)</span>
                  <span className="font-mono">{ocr?.word_count || kaithiWords.length} words</span>
                </div>
                <div className="font-kaithi text-xl text-slate-900 dark:text-amber-100/95 leading-relaxed tracking-wide whitespace-pre-line select-text">
                  {kaithiWords.map((word, wIdx) => {
                    const isHovered = hoveredWordIndex === wIdx;
                    return (
                      <span
                        key={wIdx}
                        onMouseEnter={() => setHoveredWordIndex(wIdx)}
                        onMouseLeave={() => setHoveredWordIndex(null)}
                        className={`inline-block mr-1.5 transition-all cursor-pointer rounded px-0.5 ${
                          isHovered
                            ? 'sync-highlight font-bold scale-105'
                            : showHeatmap
                            ? 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-300'
                            : 'hover:bg-amber-500/20'
                        }`}
                      >
                        {word}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* IAST Romanization Box */}
              {transliteration?.iast && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-amber-700 dark:text-amber-400 font-semibold uppercase">
                    <span>Academic IAST Romanization (ISO 15919)</span>
                    <button
                      onClick={() => handleCopy(transliteration.iast, 'iast')}
                      className="hover:underline flex items-center gap-1 lowercase font-normal"
                    >
                      {copiedSection === 'iast' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="font-serif italic text-sm text-slate-800 dark:text-amber-200 leading-relaxed whitespace-pre-line select-text">
                    {transliteration.iast}
                  </div>
                </div>
              )}

              {/* Devanagari Transliteration Box with Interactive Words */}
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <span className="font-devanagari font-semibold">देवनागरी लिप्यंतरण (Transliteration)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-[10px] uppercase font-semibold">
                    Rule Verified
                  </span>
                </div>
                <div className="font-devanagari text-base text-slate-900 dark:text-slate-100 leading-loose whitespace-pre-line select-text">
                  {devaWords.map((word, wIdx) => {
                    const isHovered = hoveredWordIndex === wIdx;
                    return (
                      <span
                        key={wIdx}
                        onMouseEnter={() => setHoveredWordIndex(wIdx)}
                        onMouseLeave={() => setHoveredWordIndex(null)}
                        className={`inline-block mr-1.5 transition-all cursor-pointer rounded px-0.5 ${
                          isHovered
                            ? 'sync-highlight font-bold scale-105'
                            : 'hover:bg-amber-500/20'
                        }`}
                      >
                        {word}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Glyph Inspector */}
              {transliteration?.character_breakdown && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                    <span>Glyph Inspector (Click to inspect)</span>
                    <span className="font-mono">{transliteration.character_breakdown.length} Glyphs</span>
                  </div>

                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1.5 bg-slate-200/60 dark:bg-slate-950/80 rounded-lg border border-slate-300 dark:border-slate-800">
                    {transliteration.character_breakdown.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedChar(item)}
                        className={`px-1.5 py-0.5 rounded text-xs transition-all ${
                          selectedChar?.char === item.char
                            ? 'bg-amber-500 text-slate-950 font-bold scale-110 shadow-sm'
                            : 'bg-slate-300/80 dark:bg-slate-800/80 text-slate-800 dark:text-amber-200 hover:bg-amber-500/30'
                        }`}
                        title={`${item.char} -> ${item.devanagari} (${item.codepoint})`}
                      >
                        <span className="font-kaithi">{item.char}</span>
                      </button>
                    ))}
                  </div>

                  {selectedChar && (
                    <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs flex items-center justify-between animate-in fade-in">
                      <div>
                        <span className="font-kaithi text-2xl text-amber-700 dark:text-amber-300 mr-3 inline-block">
                          {selectedChar.char}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          Devanagari:{' '}
                          <strong className="font-devanagari text-base text-slate-900 dark:text-amber-200">
                            {selectedChar.devanagari}
                          </strong>
                          {selectedChar.iast && (
                            <span className="font-serif italic ml-2 text-amber-600 dark:text-amber-400">
                              ({selectedChar.iast})
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[10px] text-amber-700 dark:text-amber-400 font-bold block">
                          {selectedChar.codepoint}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px] block">
                          {selectedChar.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Column 3: English Translation & Legal Glossary (4 cols) */}
          <div className="lg:col-span-4 flex flex-col glass-panel rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-800">
            <div className="p-3.5 border-b border-slate-300 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h4 className="font-cinzel text-xs font-bold text-slate-800 dark:text-amber-200 tracking-wide">
                  English Translation
                </h4>
              </div>

              <div className="flex items-center space-x-2">
                {/* Audio TTS Button */}
                <button
                  onClick={() => handlePlayTTS(translation?.english, 'en', 'en')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                    isPlayingAudio && currentAudioSection === 'en'
                      ? 'bg-amber-500 text-slate-950 font-bold animate-pulse'
                      : 'bg-slate-200/80 dark:bg-slate-800/80 hover:bg-amber-500/20 text-slate-700 dark:text-slate-300'
                  }`}
                  title="Listen to English Translation"
                >
                  {isPlayingAudio && currentAudioSection === 'en' ? (
                    <>
                      <VolumeX className="w-3 h-3" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3 h-3 text-amber-500" />
                      <span>Read</span>
                    </>
                  )}
                </button>

                {/* Copy Button */}
                <button
                  onClick={() => handleCopy(translation?.english, 'en')}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 hover:bg-amber-500/20 text-slate-700 dark:text-slate-300 text-[11px] transition-colors"
                >
                  {copiedSection === 'en' ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex-1 p-5 overflow-y-auto space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                {/* English Output Box */}
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    <span>English Semantic Translation</span>
                    <span className="text-amber-700 dark:text-amber-400 text-[10px] font-mono">
                      Dialect-Aware
                    </span>
                  </div>
                  <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line select-text font-light">
                    {englishLines.map((line, lIdx) => (
                      <p key={lIdx} className="mb-2 p-1 rounded">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Detected Legal Terms */}
                {translation?.glossary_terms && translation.glossary_terms.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        Archaic Terms Detected ({translation.glossary_terms.length})
                      </span>
                      <button
                        onClick={onOpenGlossary}
                        className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5"
                      >
                        View Lexicon <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {translation.glossary_terms.map((term, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedGlossaryTerm(term)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                            selectedGlossaryTerm?.devanagari === term.devanagari
                              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                              : 'bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          <span className="font-devanagari mr-1">{term.devanagari}</span>
                          <span className="text-slate-600 dark:text-slate-300">({term.term_en})</span>
                        </button>
                      ))}
                    </div>

                    {selectedGlossaryTerm && (
                      <div className="p-3.5 rounded-xl bg-slate-200/70 dark:bg-slate-950 border border-amber-500/30 text-xs space-y-1.5 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-800 dark:text-amber-300">
                            {selectedGlossaryTerm.term_en} ({selectedGlossaryTerm.devanagari})
                          </span>
                          <span className="text-[10px] uppercase font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded">
                            {selectedGlossaryTerm.category}
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {selectedGlossaryTerm.definition}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Translation Engine Info */}
              <div className="p-3 rounded-xl bg-slate-200/50 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>
                  NMT Engine: <strong className="text-slate-800 dark:text-slate-300 font-normal">{translation?.engine_used}</strong>
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-mono">Bhojpuri / Awadhi → EN</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
