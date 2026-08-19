import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ManuscriptUploader from './components/ManuscriptUploader';
import PipelineViewer from './components/PipelineViewer';
import EditorModal from './components/EditorModal';
import HistoricalGlossaryModal from './components/HistoricalGlossaryModal';
import ExportModal from './components/ExportModal';
import VirtualKeyboard from './components/VirtualKeyboard';
import {
  Sparkles,
  Scroll,
  BookOpen,
  HelpCircle,
  FileCheck,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Landmark,
  Languages,
} from 'lucide-react';

export default function App() {
  const [samples, setSamples] = useState([]);
  const [selectedSampleId, setSelectedSampleId] = useState('sample_land_deed_1');
  const [pipelineResult, setPipelineResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState('');
  const [backendHealth, setBackendHealth] = useState(null);
  const [glossaryData, setGlossaryData] = useState({});
  const [originalImagePreview, setOriginalImagePreview] = useState(null);

  // Modals state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch initial data: Health, Samples, Glossary
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const healthRes = await fetch('/api/health');
        if (healthRes.ok) {
          const healthData = await healthRes.json();
          setBackendHealth(healthData);
        }

        const samplesRes = await fetch('/api/samples');
        if (samplesRes.ok) {
          const sData = await samplesRes.json();
          setSamples(sData.samples || []);
        }

        const glossRes = await fetch('/api/glossary');
        if (glossRes.ok) {
          const gData = await glossRes.json();
          setGlossaryData(gData.glossary || {});
        }
      } catch (err) {
        console.error('Initial API fetch error:', err);
      }
    };

    fetchInitialData();
  }, []);

  // Process sample or default document on load
  useEffect(() => {
    if (selectedSampleId) {
      processSampleDocument(selectedSampleId);
    }
  }, [selectedSampleId]);

  const processSampleDocument = async (sampleId) => {
    setIsProcessing(true);
    setCurrentStage('Loading sample manuscript & running OpenCV pipeline...');

    try {
      const formData = new FormData();
      formData.append('sample_id', sampleId);

      setCurrentStage('Running Kaithi OCR & Unicode Transliteration...');
      const res = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Pipeline conversion failed');
      }

      const data = await res.json();
      setPipelineResult(data);
      setOriginalImagePreview(null);
      showToast(`Loaded ${samples.find((s) => s.id === sampleId)?.title || 'Sample Document'}`);
    } catch (err) {
      console.error('Pipeline error:', err);
      showToast('Error processing manuscript. Using fallback data.', 'error');
    } finally {
      setIsProcessing(false);
      setCurrentStage('');
    }
  };

  const handleFileUpload = async (file) => {
    setIsProcessing(true);
    setSelectedSampleId(null);
    setCurrentStage('Preprocessing image (Deskew, CLAHE contrast, Binarization)...');

    // Create local image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('file', file);

      setCurrentStage('Extracting Kaithi characters & neural transliteration...');
      const res = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Document conversion failed');
      }

      const data = await res.json();
      setPipelineResult(data);
      showToast('Manuscript digitized & translated successfully!');
    } catch (err) {
      console.error('Upload conversion error:', err);
      showToast('Failed to process image file.', 'error');
    } finally {
      setIsProcessing(false);
      setCurrentStage('');
    }
  };

  const handleApplyEditorChanges = ({ raw_kaithi, devanagari, english }) => {
    if (!pipelineResult) return;

    setPipelineResult((prev) => ({
      ...prev,
      ocr: {
        ...prev.ocr,
        raw_kaithi,
      },
      transliteration: {
        ...prev.transliteration,
        devanagari,
      },
      translation: {
        ...prev.translation,
        english,
      },
    }));

    showToast('Applied archivist corrections to workspace');
  };

  const handleSubmitFeedback = async (payload) => {
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showToast('Feedback submitted! Dataset updated.');
      }
    } catch (e) {
      console.error('Feedback submit error:', e);
    }
  };

  const getActiveTitle = () => {
    if (selectedSampleId) {
      const s = samples.find((x) => x.id === selectedSampleId);
      return s ? s.title : 'Historical Manuscript';
    }
    return 'Uploaded Historical Document';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 bg-grid-pattern relative">
      {/* Background radial glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Header */}
      <Header
        onOpenKeyboard={() => setIsKeyboardOpen(!isKeyboardOpen)}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        backendHealth={backendHealth}
        onSelectSample={setSelectedSampleId}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 z-10">
        {/* Hero Banner */}
        <section className="text-center space-y-3 max-w-3xl mx-auto pt-2 pb-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
            <Landmark className="w-3.5 h-3.5" />
            <span>South Asian Heritage Digitization Suite</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Restoring Forgotten Manuscripts with <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 bg-clip-text text-transparent">AI Intelligence</span>
          </h2>

          <p className="text-sm text-slate-400 font-light leading-relaxed">
            Extract, transliterate, and translate centuries-old legal deeds, cadastral land surveys, and administrative registers written in the historical <span className="font-kaithi text-amber-300">𑂍𑂶𑂟𑂲</span> (Kaithi) script across Bihar, Uttar Pradesh, and adjoining regions.
          </p>
        </section>

        {/* Uploader & Sample Explorer */}
        <section>
          <ManuscriptUploader
            onFileUpload={handleFileUpload}
            onSelectSample={(id) => setSelectedSampleId(id)}
            isProcessing={isProcessing}
            currentStage={currentStage}
            samples={samples}
            selectedSampleId={selectedSampleId}
          />
        </section>

        {/* Pipeline Workspace */}
        {pipelineResult && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-cinzel text-base font-bold text-slate-100">
                  Manuscript Workspace: <span className="text-amber-300 font-semibold">{getActiveTitle()}</span>
                </h3>
              </div>
            </div>

            <PipelineViewer
              pipelineResult={pipelineResult}
              originalImagePreview={originalImagePreview}
              onOpenEditor={() => setIsEditorOpen(true)}
              onOpenExport={() => setIsExportOpen(true)}
              onOpenGlossary={() => setIsGlossaryOpen(true)}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 py-6 px-6 text-center text-xs text-slate-500 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            KaithiLens • Preserving South Asian Cultural Heritage & Linguistic Archives
          </p>
          <div className="flex items-center space-x-4 text-slate-400">
            <button onClick={() => setIsGlossaryOpen(true)} className="hover:text-amber-300 transition-colors">
              Lexicon
            </button>
            <span>•</span>
            <button onClick={() => setIsKeyboardOpen(true)} className="hover:text-amber-300 transition-colors">
              Virtual Keyboard
            </button>
            <span>•</span>
            <a href="https://github.com/SabaSaiid/KaithiLens" target="_blank" rel="noreferrer" className="hover:text-amber-300 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>

      {/* Modals & Popovers */}
      <EditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialKaithi={pipelineResult?.ocr?.raw_kaithi}
        initialDevanagari={pipelineResult?.transliteration?.devanagari}
        initialEnglish={pipelineResult?.translation?.english}
        sampleId={selectedSampleId}
        onApplyChanges={handleApplyEditorChanges}
        onSubmitFeedback={handleSubmitFeedback}
      />

      <HistoricalGlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        glossaryData={glossaryData}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        pipelineResult={pipelineResult}
        documentTitle={getActiveTitle()}
      />

      <VirtualKeyboard
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        onInsertChar={(char) => {
          if (pipelineResult) {
            handleApplyEditorChanges({
              raw_kaithi: (pipelineResult?.ocr?.raw_kaithi || '') + char,
              devanagari: pipelineResult?.transliteration?.devanagari || '',
              english: pipelineResult?.translation?.english || '',
            });
            showToast(`Inserted glyph: ${char}`);
          }
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md border animate-in fade-in slide-in-from-bottom-2 ${
            toastMessage.type === 'error'
              ? 'bg-red-950/90 border-red-500/50 text-red-200'
              : 'bg-slate-900/90 border-amber-500/40 text-amber-200 shadow-gold-glow'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          )}
          <span className="text-xs font-medium">{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
