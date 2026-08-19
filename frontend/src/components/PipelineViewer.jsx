import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Copy,
  Check,
  Edit3,
  Download,
  Eye,
  Sliders,
  Layers,
  Sparkles,
  BookOpen,
  Info,
  ExternalLink,
} from 'lucide-react';

export default function PipelineViewer({
  pipelineResult,
  onOpenEditor,
  onOpenExport,
  onOpenGlossary,
  originalImagePreview,
}) {
  const [imageMode, setImageMode] = useState('binarized'); // 'original' | 'binarized' | 'clahe'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showBoxes, setShowBoxes] = useState(true);
  const [copiedSection, setCopiedSection] = useState(null);
  const [selectedChar, setSelectedChar] = useState(null);
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState(null);

  if (!pipelineResult) return null;

  const { preprocessing, ocr, transliteration, translation } = pipelineResult;

  const handleCopy = (text, sectionName) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getActiveImageSrc = () => {
    if (imageMode === 'binarized' && preprocessing?.binarized_image_base64) {
      return preprocessing.binarized_image_base64;
    }
    if (imageMode === 'clahe' && preprocessing?.clahe_image_base64) {
      return preprocessing.clahe_image_base64;
    }
    return originalImagePreview || preprocessing?.clahe_image_base64 || preprocessing?.binarized_image_base64;
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel-gold border border-amber-500/30">
        <div className="flex items-center space-x-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div>
            <h3 className="font-cinzel font-bold text-amber-200 text-sm">
              Document Digitization Complete
            </h3>
            <p className="text-xs text-slate-400">
              Engine: <span className="text-amber-400 font-mono">{ocr?.engine}</span> • Confidence: <span className="text-emerald-400 font-mono font-bold">{(ocr?.confidence * 100).toFixed(0)}%</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenEditor}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-xs font-semibold text-amber-200 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <Edit3 className="w-4 h-4 text-amber-400" />
            <span>Refine & Correct (Archivist Editor)</span>
          </button>

          <button
            onClick={onOpenExport}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 hover:text-white transition-all"
          >
            <Download className="w-4 h-4 text-slate-300" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 3-Column Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Column 1: Image & Preprocessing Preview (4 cols) */}
        <div className="lg:col-span-4 flex flex-col glass-panel rounded-2xl overflow-hidden border border-slate-800">
          {/* Panel Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h4 className="font-cinzel text-xs font-bold text-amber-200 tracking-wide">
                Manuscript Image
              </h4>
            </div>

            {/* Filter Mode Switcher */}
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px]">
              <button
                onClick={() => setImageMode('original')}
                className={`px-2 py-1 rounded transition-colors ${
                  imageMode === 'original' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400'
                }`}
              >
                Scan
              </button>
              <button
                onClick={() => setImageMode('clahe')}
                className={`px-2 py-1 rounded transition-colors ${
                  imageMode === 'clahe' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400'
                }`}
              >
                CLAHE
              </button>
              <button
                onClick={() => setImageMode('binarized')}
                className={`px-2 py-1 rounded transition-colors ${
                  imageMode === 'binarized' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400'
                }`}
              >
                Binarized
              </button>
            </div>
          </div>

          {/* Image Canvas Viewport */}
          <div className="relative flex-1 min-h-[360px] bg-slate-950/90 overflow-hidden flex items-center justify-center p-3">
            <div
              className="relative transition-transform duration-150 ease-out origin-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={getActiveImageSrc()}
                alt="Manuscript scan"
                className="max-h-[340px] w-auto object-contain rounded-lg border border-amber-500/20 shadow-lg"
              />

              {/* Bounding Boxes Overlay */}
              {showBoxes && preprocessing?.bounding_boxes && (
                <div className="absolute inset-0 pointer-events-none">
                  {preprocessing.bounding_boxes.slice(0, 15).map((box, idx) => (
                    <div
                      key={idx}
                      className="absolute border border-amber-400/50 bg-amber-400/10 rounded-sm"
                      style={{
                        left: `${(box.x / (preprocessing.processed_dimensions?.[0] || 900)) * 100}%`,
                        top: `${(box.y / (preprocessing.processed_dimensions?.[1] || 550)) * 100}%`,
                        width: `${(box.w / (preprocessing.processed_dimensions?.[0] || 900)) * 100}%`,
                        height: `${(box.h / (preprocessing.processed_dimensions?.[1] || 550)) * 100}%`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Floating Zoom & Controls Widget */}
            <div className="absolute bottom-3 right-3 flex items-center space-x-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-lg text-slate-300">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2.5))}
                className="p-1 hover:text-amber-300 hover:bg-slate-800 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.6))}
                className="p-1 hover:text-amber-300 hover:bg-slate-800 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 hover:text-amber-300 hover:bg-slate-800 rounded transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Preprocessing Metadata Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Deskew Angle: <strong className="text-amber-400 font-mono">{preprocessing?.skew_angle}°</strong></span>
            <span>Regions: <strong className="text-slate-200 font-mono">{preprocessing?.total_regions_detected}</strong></span>
          </div>
        </div>

        {/* Column 2: Kaithi Script & Devanagari Transliteration (4 cols) */}
        <div className="lg:col-span-4 flex flex-col glass-panel rounded-2xl overflow-hidden border border-slate-800">
          <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-kaithi text-amber-300 text-base">𑂍𑂶</span>
              <h4 className="font-cinzel text-xs font-bold text-amber-200 tracking-wide">
                Kaithi & Devanagari
              </h4>
            </div>

            <button
              onClick={() => handleCopy(transliteration?.devanagari, 'deva')}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 text-[11px] transition-colors"
            >
              {copiedSection === 'deva' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-5">
            {/* Kaithi OCR Box */}
            <div className="p-4 rounded-xl parchment-card-dark border border-amber-500/20 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-amber-400/80 font-medium">
                <span>Kaithi Unicode (𑂍𑂶𑂟𑂲)</span>
                <span className="font-mono">{ocr?.word_count} words</span>
              </div>
              <p className="font-kaithi text-xl text-amber-100/95 leading-relaxed tracking-wide whitespace-pre-line select-text">
                {ocr?.raw_kaithi}
              </p>
            </div>

            {/* Devanagari Transliteration Box */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span className="font-devanagari">देवनागरी लिप्यंतरण (Transliteration)</span>
                <span className="text-emerald-400 text-[10px] uppercase font-semibold">100% Rule Mapped</span>
              </div>
              <p className="font-devanagari text-base text-slate-100 leading-loose whitespace-pre-line select-text">
                {transliteration?.devanagari}
              </p>
            </div>

            {/* Character Inspector Pill Box */}
            {transliteration?.character_breakdown && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Interactive Glyph Inspector (Click to inspect)
                </div>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1.5 bg-slate-950/80 rounded-lg border border-slate-800">
                  {transliteration.character_breakdown.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedChar(item)}
                      className={`px-1.5 py-0.5 rounded text-xs transition-all ${
                        selectedChar?.char === item.char
                          ? 'bg-amber-500 text-slate-950 font-bold scale-110'
                          : 'bg-slate-800/80 text-amber-200 hover:bg-amber-500/30'
                      }`}
                      title={`${item.char} -> ${item.devanagari} (${item.codepoint})`}
                    >
                      <span className="font-kaithi">{item.char}</span>
                    </button>
                  ))}
                </div>

                {selectedChar && (
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs flex items-center justify-between animate-in fade-in">
                    <div>
                      <span className="font-kaithi text-lg text-amber-300 mr-2">{selectedChar.char}</span>
                      <span className="text-slate-300">Devanagari: <strong className="font-devanagari text-amber-200">{selectedChar.devanagari}</strong></span>
                    </div>
                    <span className="font-mono text-[10px] text-amber-400/90">{selectedChar.codepoint}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Column 3: English Translation & Legal Glossary (4 cols) */}
        <div className="lg:col-span-4 flex flex-col glass-panel rounded-2xl overflow-hidden border border-slate-800">
          <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="font-cinzel text-xs font-bold text-amber-200 tracking-wide">
                English Translation
              </h4>
            </div>

            <button
              onClick={() => handleCopy(translation?.english, 'en')}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 text-[11px] transition-colors"
            >
              {copiedSection === 'en' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              {/* English Output Box */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>English Semantic Translation</span>
                  <span className="text-amber-400/80 text-[10px] font-mono">Dialect-Aware</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line select-text font-light">
                  {translation?.english}
                </p>
              </div>

              {/* Detected Legal Terms */}
              {translation?.glossary_terms && translation.glossary_terms.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-amber-400/90 font-medium">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      Historical Terms Detected ({translation.glossary_terms.length})
                    </span>
                    <button
                      onClick={onOpenGlossary}
                      className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                    >
                      View All <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {translation.glossary_terms.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedGlossaryTerm(term)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-medium transition-all"
                      >
                        <span className="font-devanagari mr-1">{term.devanagari}</span>
                        <span className="text-slate-300">({term.term_en})</span>
                      </button>
                    ))}
                  </div>

                  {selectedGlossaryTerm && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 text-xs space-y-1 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300">
                          {selectedGlossaryTerm.term_en} ({selectedGlossaryTerm.devanagari})
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                          {selectedGlossaryTerm.category}
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {selectedGlossaryTerm.definition}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Translation Engine Info */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>NMT Engine: <strong className="text-slate-300 font-normal">{translation?.engine_used}</strong></span>
              <span className="text-amber-400/90 font-mono">Hindi / Bhojpuri → English</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
