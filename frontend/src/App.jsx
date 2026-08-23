import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ManuscriptUploader from './components/ManuscriptUploader';
import PipelineViewer from './components/PipelineViewer';
import EditorModal from './components/EditorModal';
import HistoricalGlossaryModal from './components/HistoricalGlossaryModal';
import ExportModal from './components/ExportModal';
import VirtualKeyboard from './components/VirtualKeyboard';
import KaithiPrimerModal from './components/KaithiPrimerModal';
import CommandPalette from './components/CommandPalette';
import HistoryDrawer from './components/HistoryDrawer';
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
  Command,
  GraduationCap,
} from 'lucide-react';

export default function App() {
  // Theme State: Nocturne Dark (default) vs Heritage Parchment Light
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('kaithilens_theme');
    if (saved) return saved === 'dark';
    return true; // Default to Nocturne Dark
  });

  const [samples, setSamples] = useState([]);
  const [selectedSampleId, setSelectedSampleId] = useState('sample_land_deed_1');
  const [pipelineResult, setPipelineResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState('');
  const [backendHealth, setBackendHealth] = useState(null);
  const [glossaryData, setGlossaryData] = useState({});
  const [originalImagePreview, setOriginalImagePreview] = useState(null);

  // Modals & Drawers state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isPrimerOpen, setIsPrimerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Session History State
  const [historyItems, setHistoryItems] = useState(() => {
    try {
      const saved = localStorage.getItem('kaithilens_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync theme class to document root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('kaithilens_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('kaithilens_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
    showToast(`Switched to ${!isDark ? 'Nocturne Dark' : 'Heritage Parchment'} Mode`);
  };

  // Global Keyboard Shortcuts (Cmd+K, etc.)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsHistoryOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save to Session History
  const saveSessionToHistory = (title, result) => {
    try {
      const newItem = {
        id: Date.now().toString(),
        title,
        timestamp: new Date().toISOString(),
        pipelineResult: result,
      };
      const updated = [newItem, ...historyItems.slice(0, 15)];
      setHistoryItems(updated);
      localStorage.setItem('kaithilens_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save session history:', e);
    }
  };

  const handleClearHistory = () => {
    setHistoryItems([]);
    localStorage.removeItem('kaithilens_history');
    showToast('Session history cleared');
  };

  const handleRestoreHistoryItem = (item) => {
    setPipelineResult(item.pipelineResult);
    setSelectedSampleId(null);
    setOriginalImagePreview(null);
    showToast(`Restored: ${item.title}`);
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
      const title = samples.find((s) => s.id === sampleId)?.title || 'Historical Document';
      showToast(`Loaded ${title}`);
      saveSessionToHistory(title, data);
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
      const title = file.name || 'Uploaded Historical Manuscript';
      showToast('Manuscript digitized & translated successfully!');
      saveSessionToHistory(title, data);
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
    <div className="min-h-screen flex flex-col bg-grid-pattern relative transition-colors duration-300">
      {/* Background ambient radial glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-amber-500/10 dark:bg-amber-500/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Header */}
      <Header
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenKeyboard={() => setIsKeyboardOpen(!isKeyboardOpen)}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onOpenPrimer={() => setIsPrimerOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        backendHealth={backendHealth}
        historyCount={historyItems.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 z-10">
        {/* Hero Section */}
        <section className="text-center space-y-3.5 max-w-3xl mx-auto pt-2 pb-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-semibold shadow-sm">
            <Landmark className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Digital Humanities & South Asian Archive Preservation</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            Restoring Forgotten Manuscripts with{' '}
            <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 dark:from-amber-300 dark:via-amber-400 dark:to-amber-200 bg-clip-text text-transparent">
              AI Intelligence
            </span>
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400 font-light leading-relaxed">
            Extract, transliterate, and decipher centuries-old land deeds, court parwanas, and cadastral survey registers written in the historical{' '}
            <span className="font-kaithi text-lg text-amber-700 dark:text-amber-300 font-bold">𑂍𑂶𑂟𑂲</span>{' '}
            (Kaithi) script across Bihar, Uttar Pradesh, and Jharkhand archives.
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
                <FileCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-cinzel text-base font-bold text-slate-900 dark:text-slate-100">
                  Manuscript Workspace: <span className="text-amber-700 dark:text-amber-300 font-semibold">{getActiveTitle()}</span>
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
      <footer className="w-full border-t border-slate-300 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-950/90 py-6 px-6 text-center text-xs text-slate-500 dark:text-slate-400 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            KaithiLens • Preserving South Asian Cultural Heritage & Linguistic Archives
          </p>
          <div className="flex items-center space-x-4 text-slate-600 dark:text-slate-400">
            <button onClick={() => setIsPrimerOpen(true)} className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors">
              Script Primer
            </button>
            <span>•</span>
            <button onClick={() => setIsGlossaryOpen(true)} className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors">
              Lexicon
            </button>
            <span>•</span>
            <button onClick={() => setIsKeyboardOpen(true)} className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors">
              Keyboard
            </button>
            <span>•</span>
            <a
              href="https://github.com/SabaSaiid/KaithiLens"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
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

      <KaithiPrimerModal
        isOpen={isPrimerOpen}
        onClose={() => setIsPrimerOpen(false)}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        samples={samples}
        onSelectSample={(id) => setSelectedSampleId(id)}
        onOpenEditor={() => setIsEditorOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onOpenPrimer={() => setIsPrimerOpen(true)}
        onOpenKeyboard={() => setIsKeyboardOpen(true)}
        onToggleTheme={toggleTheme}
        isDark={isDark}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={historyItems}
        onSelectHistoryItem={handleRestoreHistoryItem}
        onClearHistory={handleClearHistory}
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
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
              : 'bg-slate-900/95 border-amber-500/50 text-amber-200 shadow-gold-glow'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          )}
          <span className="text-xs font-medium">{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
