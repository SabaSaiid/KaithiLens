import React, { useState, useRef, useEffect } from 'react';
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
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  SplitSquareVertical,
  Flame,
  Info,
  ExternalLink,
  Contrast,
  RefreshCw,
} from 'lucide-react';
import DocumentMetrics from './DocumentMetrics';

export default function PipelineViewer({
  pipelineResult,
  onOpenEditor,
  onOpenExport,
  onOpenGlossary,
  originalImagePreview,
}) {
  const [imageMode, setImageMode] = useState('binarized'); // 'original' | 'binarized' | 'clahe' | 'split'
  const [splitPosition, setSplitPosition] = useState(50); // 0 - 100 percentage
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isInverted, setIsInverted] = useState(false);
  const [showBoxes, setShowBoxes] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [copiedSection, setCopiedSection] = useState(null);
  const [selectedChar, setSelectedChar] = useState(null);
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState(null);
  const [hoveredWordIndex, setHoveredWordIndex] = useState(null);
  const [activeBoxIndex, setActiveBoxIndex] = useState(null);

  // Audio Speech Synthesis state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentAudioSection, setCurrentAudioSection] = useState(null); // 'deva' | 'en'

  const canvasRef = useRef(null);

  if (!pipelineResult) return null;

  const { preprocessing, ocr, transliteration, translation } = pipelineResult;

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

  const getScanImageSrc = () => {
    return originalImagePreview || preprocessing?.clahe_image_base64 || preprocessing?.binarized_image_base64;
  };

  const getProcessedImageSrc = () => {
    if (imageMode === 'clahe' && preprocessing?.clahe_image_base64) {
      return preprocessing.clahe_image_base64;
    }
    return preprocessing?.binarized_image_base64 || getScanImageSrc();
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

  // Mouse pan handlers
  const handleMouseDown = (e) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetPanAndZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Tokenize lines & words for synchronized reading
  const kaithiLines = (ocr?.raw_kaithi || '').split('\n').filter(Boolean);
  const devaLines = (transliteration?.devanagari || '').split('\n').filter(Boolean);
  const englishLines = (translation?.english || '').split('\n').filter(Boolean);

  const kaithiWords = (ocr?.raw_kaithi || '').split(/\s+/).filter(Boolean);
  const devaWords = (transliteration?.devanagari || '').split(/\s+/).filter(Boolean);

  return (
    <div className="w-full space-y-6">
      {/* Document Metrics Bar */}
      <DocumentMetrics pipelineResult={pipelineResult} />

      {/* Top Action Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel-gold border border-amber-500/30">
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
              Interactive Triple-Sync Highlighting & Deep Inspection Studio
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
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
            <span>Confidence Heatmap</span>
          </button>

          {/* Archivist Correction Editor */}
          <button
            onClick={onOpenEditor}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-xs font-semibold text-amber-800 dark:text-amber-200 hover:text-amber-950 dark:hover:text-white transition-all shadow-sm active:scale-95"
          >
            <Edit3 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Archivist Correction Studio</span>
          </button>

          {/* Export Dossier */}
          <button
            onClick={onOpenExport}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-200/80 dark:bg-slate-900/80 hover:bg-slate-300 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-black dark:hover:text-white transition-all"
          >
            <Download className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Export Dossier</span>
          </button>
        </div>
      </div>

      {/* 3-Column Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Column 1: Image & Preprocessing Studio (4 cols) */}
        <div className="lg:col-span-4 flex flex-col glass-panel rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-800">
          {/* Panel Header */}
          <div className="p-3.5 border-b border-slate-300 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/60 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h4 className="font-cinzel text-xs font-bold text-slate-800 dark:text-amber-200 tracking-wide">
                Manuscript Canvas
              </h4>
            </div>

            {/* Filter Mode Switcher */}
            <div className="flex bg-slate-200 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-300 dark:border-slate-800 text-[10px]">
              <button
                onClick={() => setImageMode('original')}
                className={`px-2 py-1 rounded transition-colors ${
                  imageMode === 'original'
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Scan
              </button>
              <button
                onClick={() => setImageMode('clahe')}
                className={`px-2 py-1 rounded transition-colors ${
                  imageMode === 'clahe'
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                CLAHE
              </button>
              <button
                onClick={() => setImageMode('binarized')}
                className={`px-2 py-1 rounded transition-colors ${
                  imageMode === 'binarized'
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Binarized
              </button>
              <button
                onClick={() => setImageMode('split')}
                className={`px-2 py-1 rounded transition-colors ${
                  imageMode === 'split'
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
                title="Split Comparison Wipe"
              >
                Split
              </button>
            </div>
          </div>

          {/* Interactive Image Viewport */}
          <div
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`relative flex-1 min-h-[380px] bg-slate-900 dark:bg-slate-950/95 overflow-hidden flex items-center justify-center p-3 select-none ${
              zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : ''
            }`}
          >
            {/* Split Comparison Mode */}
            {imageMode === 'split' ? (
              <div className="relative w-full h-[340px] max-w-[400px] overflow-hidden rounded-lg border border-amber-500/30">
                {/* Background: Processed Image */}
                <img
                  src={getProcessedImageSrc()}
                  alt="Processed Scan"
                  className={`w-full h-full object-contain ${isInverted ? 'invert hue-rotate-180' : ''}`}
                />

                {/* Foreground: Original Scan with clip-path */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - splitPosition}% 0 0)` }}
                >
                  <img
                    src={getScanImageSrc()}
                    alt="Original Scan"
                    className={`w-full h-full object-contain ${isInverted ? 'invert hue-rotate-180' : ''}`}
                  />
                </div>

                {/* Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-amber-400 shadow-[0_0_10px_#f59e0b] cursor-ew-resize flex items-center justify-center"
                  style={{ left: `${splitPosition}%` }}
                >
                  <div className="w-5 h-5 -ml-2.5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-bold shadow-md">
                    ⇄
                  </div>
                </div>

                {/* Split Drag Range Slider */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={splitPosition}
                  onChange={(e) => setSplitPosition(Number(e.target.value))}
                  className="absolute bottom-2 left-4 right-4 z-20 accent-amber-500 opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ) : (
              /* Standard Pan & Zoom Canvas */
              <div
                className="relative transition-transform duration-100 ease-out origin-center"
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                }}
              >
                <img
                  src={
                    imageMode === 'original'
                      ? getScanImageSrc()
                      : getProcessedImageSrc()
                  }
                  alt="Historical manuscript scan"
                  className={`max-h-[340px] w-auto object-contain rounded-lg border border-amber-500/20 shadow-lg ${
                    isInverted ? 'invert hue-rotate-180 contrast-125' : ''
                  }`}
                />

                {/* Bounding Boxes Overlay */}
                {showBoxes && preprocessing?.bounding_boxes && (
                  <div className="absolute inset-0 pointer-events-auto">
                    {preprocessing.bounding_boxes.slice(0, 18).map((box, idx) => {
                      const isHovered = hoveredWordIndex === idx || activeBoxIndex === idx;
                      return (
                        <div
                          key={idx}
                          onMouseEnter={() => {
                            setActiveBoxIndex(idx);
                            setHoveredWordIndex(idx);
                          }}
                          onMouseLeave={() => {
                            setActiveBoxIndex(null);
                            setHoveredWordIndex(null);
                          }}
                          className={`absolute rounded-sm transition-all cursor-pointer ${
                            isHovered
                              ? 'border-2 border-amber-400 bg-amber-400/30 scale-105 z-20 shadow-[0_0_12px_#f59e0b]'
                              : 'border border-amber-400/40 bg-amber-400/10 hover:border-amber-400'
                          }`}
                          style={{
                            left: `${(box.x / (preprocessing.processed_dimensions?.[0] || 900)) * 100}%`,
                            top: `${(box.y / (preprocessing.processed_dimensions?.[1] || 550)) * 100}%`,
                            width: `${(box.w / (preprocessing.processed_dimensions?.[0] || 900)) * 100}%`,
                            height: `${(box.h / (preprocessing.processed_dimensions?.[1] || 550)) * 100}%`,
                          }}
                          title={`OCR Region #${idx + 1}`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Floating Controls Widget */}
            <div className="absolute bottom-3 right-3 flex items-center space-x-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 shadow-xl text-slate-300 z-30">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3))}
                className="p-1.5 hover:text-amber-300 hover:bg-slate-800 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.5))}
                className="p-1.5 hover:text-amber-300 hover:bg-slate-800 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsInverted(!isInverted)}
                className={`p-1.5 rounded transition-colors ${
                  isInverted ? 'text-amber-300 bg-slate-800' : 'hover:text-amber-300 hover:bg-slate-800'
                }`}
                title="Invert Polarity (High Contrast Ink)"
              >
                <Contrast className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={resetPanAndZoom}
                className="p-1.5 hover:text-amber-300 hover:bg-slate-800 rounded transition-colors"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Preprocessing Metadata Footer */}
          <div className="p-3 border-t border-slate-300 dark:border-slate-800 bg-slate-200/40 dark:bg-slate-950/60 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span>
              Deskew: <strong className="text-amber-600 dark:text-amber-400 font-mono">{preprocessing?.skew_angle}°</strong>
            </span>
            <span>
              Zoom: <strong className="text-slate-800 dark:text-slate-200 font-mono">{Math.round(zoomLevel * 100)}%</strong>
            </span>
            <button
              onClick={() => setShowBoxes(!showBoxes)}
              className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <Eye className="w-3 h-3" />
              <span>{showBoxes ? 'Hide Bounding Boxes' : 'Show Boxes'}</span>
            </button>
          </div>
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
                    : 'bg-slate-200/80 dark:bg-slate-800/80 hover:bg-amber-500/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-300'
                }`}
                title="Listen to Devanagari Pronunciation"
              >
                {isPlayingAudio && currentAudioSection === 'deva' ? (
                  <>
                    <VolumeX className="w-3 h-3" />
                    <span>Stop Audio</span>
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
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 hover:bg-amber-500/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-300 text-[11px] transition-colors"
              >
                {copiedSection === 'deva' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-500 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-5">
            {/* Audio Wave Visualizer Indicator */}
            {isPlayingAudio && currentAudioSection === 'deva' && (
              <div className="flex items-center justify-center space-x-1.5 p-2 bg-amber-500/15 rounded-xl border border-amber-500/30">
                <div className="w-1 bg-amber-500 rounded-full audio-bar"></div>
                <div className="w-1 bg-amber-500 rounded-full audio-bar"></div>
                <div className="w-1 bg-amber-500 rounded-full audio-bar"></div>
                <div className="w-1 bg-amber-500 rounded-full audio-bar"></div>
                <div className="w-1 bg-amber-500 rounded-full audio-bar"></div>
                <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 ml-2">
                  Pronouncing Historical Devanagari...
                </span>
              </div>
            )}

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
                    : 'bg-slate-200/80 dark:bg-slate-800/80 hover:bg-amber-500/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-300'
                }`}
                title="Listen to English Translation"
              >
                {isPlayingAudio && currentAudioSection === 'en' ? (
                  <>
                    <VolumeX className="w-3 h-3" />
                    <span>Stop Audio</span>
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
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 hover:bg-amber-500/20 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-300 text-[11px] transition-colors"
              >
                {copiedSection === 'en' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-500 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Audio Wave Visualizer Indicator for English */}
              {isPlayingAudio && currentAudioSection === 'en' && (
                <div className="flex items-center justify-center space-x-1.5 p-2 bg-amber-500/15 rounded-xl border border-amber-500/30">
                  <div className="w-1 bg-amber-500 rounded-full audio-bar"></div>
                  <div className="w-1 bg-amber-500 rounded-full audio-bar"></div>
                  <div className="w-1 bg-amber-500 rounded-full audio-bar"></div>
                  <div className="w-1 bg-amber-500 rounded-full audio-bar"></div>
                  <div className="w-1 bg-amber-500 rounded-full audio-bar"></div>
                  <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 ml-2">
                    Reading English Translation...
                  </span>
                </div>
              )}

              {/* English Output Box */}
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <span>English Semantic Translation</span>
                  <span className="text-amber-700 dark:text-amber-400 text-[10px] font-mono">
                    Dialect-Aware
                  </span>
                </div>
                <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line select-text font-light">
                  {englishLines.map((line, lIdx) => {
                    const isHovered = hoveredWordIndex !== null && Math.floor(hoveredWordIndex / 4) === lIdx;
                    return (
                      <p
                        key={lIdx}
                        onMouseEnter={() => setHoveredWordIndex(lIdx * 4)}
                        onMouseLeave={() => setHoveredWordIndex(null)}
                        className={`mb-2 p-1 rounded transition-colors ${
                          isHovered ? 'bg-amber-500/20 text-slate-950 dark:text-white' : ''
                        }`}
                      >
                        {line}
                      </p>
                    );
                  })}
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
              <span className="text-amber-600 dark:text-amber-400 font-mono">Hindi / Bhojpuri → English</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
