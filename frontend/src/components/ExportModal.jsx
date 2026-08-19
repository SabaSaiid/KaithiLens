import React, { useState } from 'react';
import { Download, FileText, Code2, Printer, X, Check, Copy } from 'lucide-react';

export default function ExportModal({ isOpen, onClose, pipelineResult, documentTitle }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !pipelineResult) return null;

  const { preprocessing, ocr, transliteration, translation } = pipelineResult;
  const docTitle = documentTitle || 'KaithiLens_Transcription_Record';

  const generatePlainText = () => {
    return `===============================================================
KAITHILENS HISTORICAL MANUSCRIPT ARCHIVAL REPORT
===============================================================
Document: ${docTitle}
OCR Confidence: ${(ocr?.confidence * 100).toFixed(0)}%
OCR Engine: ${ocr?.engine}
Generated: ${new Date().toISOString()}

---------------------------------------------------------------
1. ORIGINAL KAITHI TRANSCRIPTION (𑂍𑂶𑂟𑂲)
---------------------------------------------------------------
${ocr?.raw_kaithi}

---------------------------------------------------------------
2. DEVANAGARI TRANSLITERATION (देवनागरी)
---------------------------------------------------------------
${transliteration?.devanagari}

---------------------------------------------------------------
3. ENGLISH SEMANTIC TRANSLATION
---------------------------------------------------------------
${translation?.english}

---------------------------------------------------------------
4. DETECTED HISTORICAL & LEGAL GLOSSARY TERMS
---------------------------------------------------------------
${(translation?.glossary_terms || [])
  .map(
    (t) => `• ${t.term_en} (${t.devanagari}) [${t.category}]: ${t.definition}`
  )
  .join('\n')}

===============================================================
Preserved with KaithiLens — Restoring South Asian Heritage
===============================================================
`;
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([generatePlainText()], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${docTitle.replace(/\s+/g, '_')}_KaithiLens.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadJson = () => {
    const element = document.createElement('a');
    const jsonStr = JSON.stringify(
      {
        metadata: {
          title: docTitle,
          export_date: new Date().toISOString(),
          app: 'KaithiLens v1.0',
        },
        pipeline_data: pipelineResult,
      },
      null,
      2
    );
    const file = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${docTitle.replace(/\s+/g, '_')}_KaithiLens.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generatePlainText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel-gold rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-amber-500/30">
        {/* Header */}
        <div className="p-5 border-b border-amber-500/20 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg font-bold text-amber-200 tracking-wide">
                Export Archival Record
              </h2>
              <p className="text-xs text-slate-400">
                Download verified transcription, transliteration, and translation data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handleDownloadTxt}
              className="p-4 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 border border-slate-700/80 hover:border-amber-500/50 flex flex-col items-center justify-center text-center space-y-2 transition-all group"
            >
              <FileText className="w-7 h-7 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-200 group-hover:text-amber-200">
                Plain Text (.txt)
              </span>
              <span className="text-[10px] text-slate-400">Formatted report</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="p-4 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 border border-slate-700/80 hover:border-amber-500/50 flex flex-col items-center justify-center text-center space-y-2 transition-all group"
            >
              <Code2 className="w-7 h-7 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-200 group-hover:text-amber-200">
                JSON Data (.json)
              </span>
              <span className="text-[10px] text-slate-400">Full metadata & boxes</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-4 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 border border-slate-700/80 hover:border-amber-500/50 flex flex-col items-center justify-center text-center space-y-2 transition-all group"
            >
              <Printer className="w-7 h-7 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-200 group-hover:text-amber-200">
                Print / Save PDF
              </span>
              <span className="text-[10px] text-slate-400">Archival certificate</span>
            </button>
          </div>

          {/* Preview Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Report Preview</span>
              <button
                onClick={handleCopyReport}
                className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {generatePlainText()}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
