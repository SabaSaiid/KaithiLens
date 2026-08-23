import React from 'react';
import {
  Sparkles,
  Award,
  Hash,
  Layers,
  MapPin,
  Calendar,
  ShieldAlert,
  FileCheck2,
  Cpu,
} from 'lucide-react';

export default function DocumentMetrics({ pipelineResult, activeTitle }) {
  if (!pipelineResult) return null;

  const { preprocessing, ocr, transliteration, translation } = pipelineResult;

  const confidence = ocr?.confidence ? Math.round(ocr.confidence * 100) : 95;
  const wordCount = ocr?.word_count || (ocr?.raw_kaithi ? ocr.raw_kaithi.split(/\s+/).length : 0);
  const charCount = ocr?.raw_kaithi ? ocr.raw_kaithi.replace(/\s+/g, '').length : 0;
  const regionsCount = preprocessing?.total_regions_detected || preprocessing?.bounding_boxes?.length || 18;
  const skewAngle = preprocessing?.skew_angle || 0;
  const glossaryTerms = translation?.glossary_terms || [];

  // Extract detected categories
  const categories = [...new Set(glossaryTerms.map((t) => t.category))];

  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-4 rounded-2xl glass-panel-gold border border-amber-500/30">
      {/* 1. OCR Confidence */}
      <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-200/50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
            confidence >= 90
              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : confidence >= 75
              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
              : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
          }`}
        >
          {confidence}%
        </div>
        <div className="overflow-hidden">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
            Confidence
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
            {confidence >= 90 ? 'High Precision' : 'Moderate'}
          </div>
        </div>
      </div>

      {/* 2. Word & Glyph Count */}
      <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-200/50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800">
        <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center">
          <Hash className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
            Lexical Size
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
            {wordCount} words <span className="text-[10px] text-slate-400">({charCount} glyphs)</span>
          </div>
        </div>
      </div>

      {/* 3. Preprocessing Vision Metrics */}
      <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-200/50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800">
        <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
            Segments
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
            {regionsCount} lines <span className="text-[10px] text-slate-400">({skewAngle}° skew)</span>
          </div>
        </div>
      </div>

      {/* 4. Historical Terms Found */}
      <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-200/50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800">
        <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center">
          <Award className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
            Lexicon Match
          </div>
          <div className="text-xs font-bold text-amber-600 dark:text-amber-300">
            {glossaryTerms.length} Archaic Terms
          </div>
        </div>
      </div>

      {/* 5. Script & Dialect */}
      <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-200/50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800">
        <div className="w-9 h-9 rounded-lg bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30 flex items-center justify-center">
          <span className="font-kaithi text-xs font-bold">𑂍</span>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
            Script System
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
            Kaithi (Bhojpuri/Maithili)
          </div>
        </div>
      </div>

      {/* 6. Active OCR Engine */}
      <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-200/50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800">
        <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 flex items-center justify-center">
          <Cpu className="w-4 h-4" />
        </div>
        <div className="overflow-hidden">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
            Vision Model
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate" title={ocr?.engine}>
            {ocr?.engine?.includes('Tesseract') ? 'Tesseract 5' : 'Neural Vision'}
          </div>
        </div>
      </div>
    </div>
  );
}
