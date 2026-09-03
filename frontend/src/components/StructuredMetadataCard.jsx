import React, { useState } from 'react';
import {
  Landmark,
  MapPin,
  FileCheck2,
  Users,
  Coins,
  Calendar,
  Layers,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Scroll,
} from 'lucide-react';

export default function StructuredMetadataCard({
  structuredMetadata,
  documentTitle,
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copiedKey, setCopiedKey] = useState(null);

  if (!structuredMetadata) return null;

  const {
    document_type,
    geographic_jurisdiction,
    cadastral_metrics,
    tenancy_parties,
    financial_terms,
    chronology,
  } = structuredMetadata;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const generateFormattedAbstract = () => {
    return `================================================
KAITHILENS ARCHIVAL DEED DOSSIER ABSTRACT
================================================
Document Classification: ${document_type}
Village (Mauza): ${geographic_jurisdiction?.village_mauza || 'N/A'}
Pargana: ${geographic_jurisdiction?.pargana || 'N/A'}
District (Zila): ${geographic_jurisdiction?.district_zila || 'N/A'}
Cadastral Plot (Khasra): ${cadastral_metrics?.khasra_plot || 'N/A'}
Khata Number: ${cadastral_metrics?.khata_number || 'N/A'}
Area: ${cadastral_metrics?.land_area || 'N/A'} (${cadastral_metrics?.converted_acres || 'Recorded'})
Annual Revenue (Lagaan): ${financial_terms?.annual_lagaan || 'N/A'}
Dating & Era: ${chronology?.date_era || 'N/A'}
Executing Parties:
${(tenancy_parties || []).map((p) => `  • [${p.role}] ${p.entity}`).join('\n')}
================================================`;
  };

  const handleDownloadCSV = () => {
    const headers = [
      'Document_Type',
      'District',
      'Pargana',
      'Mauza',
      'Khata_No',
      'Khasra_No',
      'Area',
      'Annual_Lagaan',
      'Chronology',
    ];
    const row = [
      `"${(document_type || '').replace(/"/g, '""')}"`,
      `"${(geographic_jurisdiction?.district_zila || '').replace(/"/g, '""')}"`,
      `"${(geographic_jurisdiction?.pargana || '').replace(/"/g, '""')}"`,
      `"${(geographic_jurisdiction?.village_mauza || '').replace(/"/g, '""')}"`,
      `"${(cadastral_metrics?.khata_number || '').replace(/"/g, '""')}"`,
      `"${(cadastral_metrics?.khasra_plot || '').replace(/"/g, '""')}"`,
      `"${(cadastral_metrics?.land_area || '').replace(/"/g, '""')}"`,
      `"${(financial_terms?.annual_lagaan || '').replace(/"/g, '""')}"`,
      `"${(chronology?.date_era || '').replace(/"/g, '""')}"`,
    ];
    const csvContent = [headers.join(','), row.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTitle = (documentTitle || 'Kaithi_Deed').replace(/[^\w\s-]/gi, '').replace(/\s+/g, '_');
    link.download = `${safeTitle}_Metadata.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel-gold rounded-2xl border border-amber-500/30 overflow-hidden shadow-lg transition-all">
      {/* Header Bar */}
      <div className="p-4 border-b border-amber-500/20 bg-slate-100/90 dark:bg-slate-900/80 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="seal-badge w-7 h-7 rounded-full flex items-center justify-center text-amber-200 font-kaithi text-xs font-bold shadow-md">
            𑂍𑂶
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-cinzel text-xs font-bold text-slate-800 dark:text-amber-200 tracking-wide">
                Structured Deed Intelligence & NER
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                {document_type}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Parsed legal deed ontology, revenue boundaries & cadastral entities
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          {/* Copy Abstract */}
          <button
            onClick={() => handleCopy(generateFormattedAbstract(), 'abstract')}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 hover:bg-amber-500/20 text-slate-700 dark:text-slate-300 transition-colors"
            title="Copy Formatted Archival Abstract"
          >
            {copiedKey === 'abstract' ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-500 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Abstract</span>
              </>
            )}
          </button>

          {/* Export CSV */}
          <button
            onClick={handleDownloadCSV}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 hover:bg-amber-500/20 text-slate-700 dark:text-slate-300 transition-colors"
            title="Download CSV for Spreadsheet analysis"
          >
            <Download className="w-3 h-3 text-amber-500" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          {/* Toggle Expand/Collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Structured Content Grid */}
      {isExpanded && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          {/* Card 1: Administrative Jurisdiction */}
          <div className="p-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 space-y-2">
            <div className="flex items-center space-x-1.5 text-amber-700 dark:text-amber-400 font-semibold text-[11px]">
              <MapPin className="w-3.5 h-3.5" />
              <span>Administrative Jurisdiction</span>
            </div>
            <div className="space-y-1 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Village / Mauza:</span>
                <span className="font-semibold text-right">
                  {geographic_jurisdiction?.village_mauza || '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pargana:</span>
                <span className="font-semibold text-right">
                  {geographic_jurisdiction?.pargana || '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">District / Zila:</span>
                <span className="font-semibold text-amber-600 dark:text-amber-300 text-right">
                  {geographic_jurisdiction?.district_zila || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Cadastral Survey & Area */}
          <div className="p-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 space-y-2">
            <div className="flex items-center space-x-1.5 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px]">
              <Layers className="w-3.5 h-3.5" />
              <span>Cadastral Survey Parcel</span>
            </div>
            <div className="space-y-1 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Plot / Khasra:</span>
                <span className="font-mono font-semibold text-right">
                  {cadastral_metrics?.khasra_plot || 'Survey Listed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Khata No:</span>
                <span className="font-mono font-semibold text-right">
                  {cadastral_metrics?.khata_number || 'RoR Record'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Holding Area:</span>
                <span className="font-semibold text-amber-600 dark:text-amber-300 text-right">
                  {cadastral_metrics?.land_area || 'Standard Parcel'}
                </span>
              </div>
              {cadastral_metrics?.converted_acres && (
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 text-right">
                  {cadastral_metrics.converted_acres}
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Tenancy & Executing Parties */}
          <div className="p-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 space-y-2">
            <div className="flex items-center space-x-1.5 text-teal-600 dark:text-teal-400 font-semibold text-[11px]">
              <Users className="w-3.5 h-3.5" />
              <span>Parties & Tenancy Roles</span>
            </div>
            <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
              {(tenancy_parties || []).map((party, pIdx) => (
                <div key={pIdx} className="flex items-start justify-between gap-1 text-[11px]">
                  <span className="text-slate-400 truncate max-w-[100px]">{party.role}:</span>
                  <span className="font-semibold text-right text-slate-900 dark:text-slate-100">
                    {party.entity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Financials & Chronology */}
          <div className="p-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 space-y-2">
            <div className="flex items-center space-x-1.5 text-amber-700 dark:text-amber-400 font-semibold text-[11px]">
              <Coins className="w-3.5 h-3.5" />
              <span>Revenue & Chronology</span>
            </div>
            <div className="space-y-1 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Assessed Lagaan:</span>
                <span className="font-semibold text-right">
                  {financial_terms?.annual_lagaan || 'Assessed by Law'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Historical Era:</span>
                <span className="font-semibold text-right text-amber-600 dark:text-amber-300">
                  {chronology?.date_era || 'Late 19th Century'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Calendar:</span>
                <span className="text-[10px] text-slate-400 text-right">
                  {chronology?.calendar_system || 'Vikrama Samvat'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
