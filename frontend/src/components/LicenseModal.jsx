import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  Copy,
  Check,
  Download,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  BookOpen,
  Heart,
  Layers,
  Code,
} from 'lucide-react';

export default function LicenseModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'text' | 'ethics' | 'ecosystem'
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const licenseText = `MIT License

Copyright (c) 2026 Saba Saeed (KaithiLens Project Contributors)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(licenseText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([licenseText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = 'LICENSE.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] glass-panel-gold rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-amber-500/40 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-amber-500/20 flex items-center justify-between bg-slate-100/90 dark:bg-slate-900/90">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-cinzel text-xl font-bold text-slate-900 dark:text-slate-100">
                  Open Source & MIT License
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                  OSI Approved
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
                KaithiLens is free, open-source software under the permissive MIT License.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
            title="Close (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-300 dark:border-slate-800 bg-slate-200/50 dark:bg-slate-950/60 px-4 sm:px-6 pt-2 gap-2 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2.5 rounded-t-xl transition-all flex items-center space-x-2 border-b-2 ${
              activeTab === 'overview'
                ? 'border-amber-500 text-amber-700 dark:text-amber-300 bg-slate-100 dark:bg-slate-900 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Permissions Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`px-3.5 py-2.5 rounded-t-xl transition-all flex items-center space-x-2 border-b-2 ${
              activeTab === 'text'
                ? 'border-amber-500 text-amber-700 dark:text-amber-300 bg-slate-100 dark:bg-slate-900 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Full Legal Text</span>
          </button>

          <button
            onClick={() => setActiveTab('ethics')}
            className={`px-3.5 py-2.5 rounded-t-xl transition-all flex items-center space-x-2 border-b-2 ${
              activeTab === 'ethics'
                ? 'border-amber-500 text-amber-700 dark:text-amber-300 bg-slate-100 dark:bg-slate-900 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Digital Humanities Ethics</span>
          </button>

          <button
            onClick={() => setActiveTab('ecosystem')}
            className={`px-3.5 py-2.5 rounded-t-xl transition-all flex items-center space-x-2 border-b-2 ${
              activeTab === 'ecosystem'
                ? 'border-amber-500 text-amber-700 dark:text-amber-300 bg-slate-100 dark:bg-slate-900 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Open Source Ecosystem</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[60vh] space-y-6">
          {/* TAB 1: OVERVIEW & PERMISSION MATRIX */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start space-x-3.5">
                <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                    The MIT License is a short and simple permissive license.
                  </strong>{' '}
                  It grants anyone full permission to use, modify, distribute, and commercialize the software,
                  subject only to preserving the original copyright notice and disclaimers.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Permissions */}
                <div className="p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Permissions</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>Commercial Use</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>Modification & Forking</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>Distribution & Publishing</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>Private & Academic Use</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>Sublicensing</span>
                    </li>
                  </ul>
                </div>

                {/* Conditions */}
                <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/30 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400 font-semibold text-xs uppercase tracking-wider">
                    <Info className="w-4 h-4" />
                    <span>Conditions</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    <li className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1" />
                      <span>
                        <strong>License & Copyright Notice:</strong> Must be included in all copies or substantial portions of the Software.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Limitations */}
                <div className="p-4 rounded-xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/30 space-y-3">
                  <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-400 font-semibold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Limitations</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>No Liability</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>No Warranty (Provided "AS IS")</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Quick Summary Banner */}
              <div className="p-4 rounded-xl bg-slate-200/60 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Free and open for researchers, archivists, historians, and AI engineers.</span>
                </div>
                <button
                  onClick={() => setActiveTab('text')}
                  className="text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center space-x-1"
                >
                  <span>View Raw Text</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: FULL LEGAL TEXT */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  LICENSE (MIT License, text/plain)
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-medium text-amber-800 dark:text-amber-200 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .txt</span>
                  </button>
                </div>
              </div>

              <div className="relative rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-900 text-slate-200 p-5 font-mono text-xs leading-relaxed overflow-x-auto selection:bg-amber-500/30">
                <pre className="whitespace-pre-wrap">{licenseText}</pre>
              </div>
            </div>
          )}

          {/* TAB 3: DIGITAL HUMANITIES ETHICS */}
          {activeTab === 'ethics' && (
            <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                <h4 className="font-cinzel font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Digital Humanities & Heritage Stewardship</span>
                </h4>
                <p>
                  KaithiLens was created to bridge historical South Asian palaeography with modern computer vision.
                  While the software source code is released under the permissive MIT License, we encourage users and
                  scholars to uphold the following principles of cultural stewardship:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-200/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800 space-y-1.5">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    📜 Respect Archival Provenance
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    When transcribing public records, land deeds, or literary texts, cite the primary archive,
                    repository, or family collection holding the physical artifact.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-200/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800 space-y-1.5">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    🤝 Open Access Transcriptions
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    We urge researchers to share digitized transcriptions and corrections back to open repositories to
                    accelerate scholarship for Bhojpuri, Magahi, and Maithili heritage.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-200/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800 space-y-1.5">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    ⚖️ Legal & Land Record Integrity
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    OCR outputs of revenue records (Khatiyans, Jamabandis) should always be verified by a qualified
                    archivist or revenue surveyor before legal reliance.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-200/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800 space-y-1.5">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    🌐 Open TEI-XML Standardization
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    All exported dossiers comply with the Text Encoding Initiative (TEI-P5) schema for long-term
                    interoperability across international university libraries.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: OPEN SOURCE ECOSYSTEM */}
          {activeTab === 'ecosystem' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                KaithiLens stands on the shoulders of remarkable open-source projects across the Python and JavaScript
                ecosystems:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { name: 'FastAPI', role: 'Modern, high-performance web framework for Python', license: 'MIT' },
                  { name: 'OpenCV', role: 'Computer vision library for manuscript binarization & deskewing', license: 'Apache 2.0' },
                  { name: 'Tesseract OCR', role: 'Neural network OCR engine with custom Kaithi traineddata', license: 'Apache 2.0' },
                  { name: 'React & Vite', role: 'Frontend UI component runtime and blazing fast build tooling', license: 'MIT' },
                  { name: 'Tailwind CSS', role: 'Utility-first styling framework powering themes', license: 'MIT' },
                  { name: 'Lucide Icons', role: 'Beautiful & consistent icon library', license: 'ISC' },
                  { name: 'Google Noto Fonts', role: 'Unicode Noto Sans Kaithi typography', license: 'OFL 1.1' },
                ].map((dep) => (
                  <div
                    key={dep.name}
                    className="p-3 rounded-xl bg-slate-200/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800 flex items-start justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">{dep.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{dep.role}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-300/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                      {dep.license}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-300 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
            <span>Official repository on</span>
            <a
              href="https://github.com/SabaSaiid/KaithiLens"
              target="_blank"
              rel="noreferrer"
              className="text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center space-x-1"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors font-medium"
            >
              {copied ? 'Copied to Clipboard' : 'Copy License'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-all shadow-md"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
