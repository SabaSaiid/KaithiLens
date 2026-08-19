import React, { useRef, useState } from 'react';
import { Upload, FileImage, Sparkles, Scroll, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';

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
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative group cursor-pointer rounded-2xl p-8 transition-all duration-300 border-2 border-dashed ${
          isDragOver
            ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
            : 'border-amber-500/30 hover:border-amber-400/60 glass-panel-gold'
        } ${isProcessing ? 'pointer-events-none opacity-80' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/30 border border-amber-500/40 flex items-center justify-center text-amber-300 group-hover:scale-110 group-hover:text-amber-200 transition-all shadow-gold-glow">
            {isProcessing ? (
              <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
            ) : (
              <Upload className="w-8 h-8" />
            )}
          </div>

          <div className="space-y-1.5">
            <h3 className="font-cinzel text-lg font-bold text-slate-100 group-hover:text-amber-200 transition-colors">
              {isProcessing
                ? 'Digitizing & Translating Manuscript...'
                : 'Upload Kaithi Manuscript Image'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Drag & drop scanned land deeds, court parwanas, or revenue registers (JPG, PNG, TIFF)
            </p>
          </div>

          {isProcessing ? (
            <div className="w-full max-w-md space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-amber-300 font-medium">
                <span>{currentStage || 'Processing document...'}</span>
                <span className="font-mono">Stage Active</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-amber-500/20">
                <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 animate-pulse rounded-full w-3/4" />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 pt-2 text-[11px] text-amber-400/90 font-medium bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Automatic Binarization, OCR & Devanagari Translation</span>
            </div>
          )}
        </div>
      </div>

      {/* Sample Historical Manuscripts Gallery */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scroll className="w-4 h-4 text-amber-400" />
            <h4 className="font-cinzel text-sm font-semibold text-amber-200 tracking-wide">
              Sample Historical Manuscripts
            </h4>
          </div>
          <span className="text-xs text-slate-400">Click any document to test instantly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {(samples || []).map((sample) => {
            const isSelected = selectedSampleId === sample.id;
            return (
              <button
                key={sample.id}
                onClick={() => onSelectSample(sample.id)}
                disabled={isProcessing}
                className={`text-left p-4 rounded-xl transition-all duration-200 flex flex-col justify-between border ${
                  isSelected
                    ? 'glass-panel-gold border-amber-400 shadow-gold-glow scale-[1.01]'
                    : 'glass-panel hover:bg-slate-900/90 border-slate-800 hover:border-amber-500/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-cinzel text-xs font-bold text-amber-300 line-clamp-1">
                      {sample.title}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 mb-3">
                    <span>{sample.region}</span>
                    <span>•</span>
                    <span className="text-amber-400/80 font-mono">{sample.date}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <div className="font-kaithi text-xs text-amber-200/90 line-clamp-1">
                    {sample.kaithi_snippet}
                  </div>
                  <div className="font-devanagari text-[11px] text-slate-400 line-clamp-1">
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
