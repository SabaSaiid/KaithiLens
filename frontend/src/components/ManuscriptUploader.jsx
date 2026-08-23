import React, { useRef, useState, useEffect } from 'react';
import {
  Upload,
  FileImage,
  Sparkles,
  Scroll,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Landmark,
  FileText,
  Gavel,
  ClipboardPaste,
} from 'lucide-react';

const PIPELINE_STAGES = [
  { id: 1, name: 'Preprocessing', desc: 'Deskew, CLAHE contrast & Otsu binarization' },
  { id: 2, name: 'Kaithi Vision OCR', desc: 'Extracting historical Unicode glyphs' },
  { id: 3, name: 'Transliteration', desc: '1:1 Mapping to Devanagari script' },
  { id: 4, name: 'Neural Translation', desc: 'Bhojpuri / Awadhi legal semantic translation' },
];

export default function ManuscriptUploader({
  onFileUpload,
  onSelectSample,
  isProcessing,
  currentStage,
  samples,
  selectedSampleId,
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [activeStageIndex, setActiveStageIndex] = useState(1);

  // Cycle stage indices during processing for visual delight
  useEffect(() => {
    let interval;
    if (isProcessing) {
      interval = setInterval(() => {
        setActiveStageIndex((prev) => (prev % 4) + 1);
      }, 1200);
    } else {
      setActiveStageIndex(1);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  // Support pasting image from clipboard anywhere in the dropzone
  const handlePaste = (e) => {
    if (e.clipboardData && e.clipboardData.files && e.clipboardData.files[0]) {
      onFileUpload(e.clipboardData.files[0]);
    }
  };

  const filteredSamples = (samples || []).filter((s) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'DEED') return s.id.includes('deed');
    if (activeFilter === 'COURT') return s.id.includes('court');
    if (activeFilter === 'KHATIYAN') return s.id.includes('khatiyan');
    return true;
  });

  return (
    <div className="w-full space-y-6">
      {/* Upload Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onPaste={handlePaste}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative group cursor-pointer rounded-2xl p-8 transition-all duration-300 border-2 border-dashed ${
          isDragOver
            ? 'border-amber-400 bg-amber-500/10 scale-[1.01] shadow-gold-glow'
            : 'border-amber-500/30 hover:border-amber-400/70 glass-panel-gold'
        } ${isProcessing ? 'pointer-events-none opacity-90' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/30 border border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-300 group-hover:scale-110 group-hover:text-amber-500 dark:group-hover:text-amber-200 transition-all shadow-gold-glow">
            {isProcessing ? (
              <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
            ) : (
              <Upload className="w-8 h-8" />
            )}
          </div>

          <div className="space-y-1.5">
            <h3 className="font-cinzel text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-200 transition-colors">
              {isProcessing
                ? 'Digitizing & Deciphering Manuscript...'
                : 'Upload Kaithi Historical Manuscript Scan'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Drag & drop scanned land deeds, court parwanas, cadastral surveys (JPG, PNG, WebP, TIFF) or paste from clipboard
            </p>
          </div>

          {/* Multi-Stage Visual Stepper */}
          {isProcessing ? (
            <div className="w-full max-w-2xl space-y-3 pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PIPELINE_STAGES.map((stage) => {
                  const isCurrent = stage.id === activeStageIndex;
                  const isDone = stage.id < activeStageIndex;
                  return (
                    <div
                      key={stage.id}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isCurrent
                          ? 'bg-amber-500/20 border-amber-400 shadow-gold-glow scale-105'
                          : isDone
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-200/50 dark:bg-slate-900/40 border-slate-300 dark:border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                        <span>Stage {stage.id}</span>
                        {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                        {isCurrent && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />}
                      </div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {stage.name}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-300 font-medium pt-1">
                <span>{currentStage || 'Running AI recognition pipeline...'}</span>
                <span className="font-mono text-slate-400">Step {activeStageIndex} of 4</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 pt-2 text-[11px] text-amber-700 dark:text-amber-300 font-medium bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/25">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Full Pipeline: CLAHE Contrast + OCR + Transliteration + Translation</span>
            </div>
          )}
        </div>
      </div>

      {/* Sample Historical Manuscripts Gallery */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Scroll className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h4 className="font-cinzel text-sm font-semibold text-slate-900 dark:text-amber-200 tracking-wide">
              Curated Historical Manuscript Archive
            </h4>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 text-xs">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                activeFilter === 'ALL'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-200 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-amber-500'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('DEED')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                activeFilter === 'DEED'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-200 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-amber-500'
              }`}
            >
              Land Deeds
            </button>
            <button
              onClick={() => setActiveFilter('COURT')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                activeFilter === 'COURT'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-200 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-amber-500'
              }`}
            >
              Court Orders
            </button>
            <button
              onClick={() => setActiveFilter('KHATIYAN')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                activeFilter === 'KHATIYAN'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-200 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-amber-500'
              }`}
            >
              Khatiyans
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {filteredSamples.map((sample) => {
            const isSelected = selectedSampleId === sample.id;
            return (
              <button
                key={sample.id}
                onClick={() => onSelectSample(sample.id)}
                disabled={isProcessing}
                className={`text-left p-4 rounded-xl transition-all duration-200 flex flex-col justify-between border ${
                  isSelected
                    ? 'glass-panel-gold border-amber-500 shadow-gold-glow scale-[1.01]'
                    : 'glass-panel hover:bg-slate-200/50 dark:hover:bg-slate-900/90 border-slate-300 dark:border-slate-800 hover:border-amber-500/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-cinzel text-xs font-bold text-slate-900 dark:text-amber-300 line-clamp-1">
                      {sample.title}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                    <span>{sample.region}</span>
                    <span>•</span>
                    <span className="text-amber-600 dark:text-amber-400 font-mono font-medium">
                      {sample.date}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-200/70 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-800/80 space-y-1">
                  <div className="font-kaithi text-xs text-amber-800 dark:text-amber-200/90 line-clamp-1">
                    {sample.kaithi_snippet}
                  </div>
                  <div className="font-devanagari text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">
                    {sample.devanagari_snippet}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
