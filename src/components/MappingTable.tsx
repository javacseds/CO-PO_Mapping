import React, { useState } from 'react';
import { useMapping } from '../context/MappingContext';
import { 
  ArrowLeft, Copy, Download, Printer, Save, 
  X, Edit3, MessageSquare, ChevronDown, Check
} from 'lucide-react';
import { 
  copyTableToClipboard, 
  exportToCSV, exportToExcel, exportToWord 
} from '../utils/exporters';
import type { MappingValue } from '../utils/aiEngine';

export const MappingTable: React.FC = () => {
  const {
    activeDoc,
    setView,
    updateCellMapping,
    updateCellJustification,
    goBackToDashboard
  } = useMapping();

  // Highlight cells on hover
  const [hoveredCell, setHoveredCell] = useState<{ coId: string; poId: string } | null>(null);

  // Side Drawer Explanation states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ coId: string; poId: string } | null>(null);
  const [editJustificationText, setEditJustificationText] = useState('');
  const [isEditingJustification, setIsEditingJustification] = useState(false);

  // UI state for export buttons dropdowns
  const [copySuccessMsg, setCopySuccessMsg] = useState<string | null>(null);
  const [isCopyDropdownOpen, setIsCopyDropdownOpen] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  if (!activeDoc) return null;

  const activeCOs = activeDoc.courseOutcomes.filter(co => co.description.trim() !== '');
  const activePOs = activeDoc.programOutcomes;
  const activePSOs = activeDoc.psoEnabled ? activeDoc.psos : [];

  // Handles cycling of cell mappings on click
  const handleCellClick = (coId: string, poId: string) => {
    const currentValue = activeDoc.matrix[coId]?.[poId];
    let nextValue: MappingValue = '';

    if (currentValue === '') nextValue = 1;
    else if (currentValue === 1) nextValue = 2;
    else if (currentValue === 2) nextValue = 3;
    else nextValue = '';

    updateCellMapping(coId, poId, nextValue);
    
    // Auto focus in drawer
    setSelectedCell({ coId, poId });
    const currentJust = activeDoc.justifications[coId]?.[poId] || '';
    setEditJustificationText(currentJust);
    setIsEditingJustification(false);
  };

  const handleSelectCellForExplanation = (coId: string, poId: string) => {
    setSelectedCell({ coId, poId });
    const currentJust = activeDoc.justifications[coId]?.[poId] || '';
    setEditJustificationText(currentJust);
    setIsEditingJustification(false);
    setIsDrawerOpen(true);
  };

  const handleSaveJustification = () => {
    if (selectedCell) {
      updateCellJustification(selectedCell.coId, selectedCell.poId, editJustificationText);
      setIsEditingJustification(false);
    }
  };

  const triggerCopy = async (type: 'markdown' | 'word' | 'excel') => {
    setIsCopyDropdownOpen(false);
    const success = await copyTableToClipboard(activeDoc, type === 'markdown' ? 'markdown' : 'html');
    if (success) {
      setCopySuccessMsg(`Copied as ${type === 'markdown' ? 'Markdown' : 'Word/Excel table'}!`);
      setTimeout(() => setCopySuccessMsg(null), 3000);
    } else {
      setCopySuccessMsg('Copy failed.');
      setTimeout(() => setCopySuccessMsg(null), 3000);
    }
  };

  const triggerExport = (format: 'csv' | 'xls' | 'doc') => {
    setIsExportDropdownOpen(false);
    if (format === 'csv') exportToCSV(activeDoc);
    if (format === 'xls') exportToExcel(activeDoc);
    if (format === 'doc') exportToWord(activeDoc);
  };

  const getCellColor = (_val: MappingValue | number) => {
    return 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold border-slate-400 dark:border-slate-600';
  };

  // Helper: display value — '-' for no correlation
  const displayVal = (val: MappingValue | undefined): string => {
    if (val === 1 || val === 2 || val === 3) return String(val);
    return '-';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300 flex flex-col no-print">
      
      {/* Table Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 md:px-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setView('form')}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition text-slate-600 dark:text-slate-300"
            title="Edit Outcomes Form"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-md font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Mapping Matrix</span>
              <span className="text-xs bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                Generated
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              {activeDoc.subjectName} ({activeDoc.subjectCode})
            </p>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Explain Mapping Drawer Trigger */}
          <button 
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/20 border border-indigo-200/50 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-xl text-xs font-semibold transition"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{isDrawerOpen ? 'Hide Explanations' : 'Explain Mappings'}</span>
          </button>

          {/* Copy Table Trigger Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsCopyDropdownOpen(!isCopyDropdownOpen)}
              className="flex items-center space-x-1 px-3.5 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold transition"
            >
              <Copy className="h-3.5 w-3.5 text-slate-400" />
              <span>Copy Table</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
            {isCopyDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 p-1 animate-in fade-in slide-in-from-top-2 duration-150">
                <button 
                  onClick={() => triggerCopy('word')}
                  className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                >
                  Copy for Word/Excel
                </button>
                <button 
                  onClick={() => triggerCopy('markdown')}
                  className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                >
                  Copy as Markdown
                </button>
              </div>
            )}
          </div>

          {/* Export File Trigger Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
              className="flex items-center space-x-1 px-3.5 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold transition"
            >
              <Download className="h-3.5 w-3.5 text-slate-400" />
              <span>Export</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
            {isExportDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 p-1 animate-in fade-in slide-in-from-top-2 duration-150">
                <button 
                  onClick={() => triggerExport('doc')}
                  className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                >
                  Export to Word (.doc)
                </button>
                <button 
                  onClick={() => triggerExport('xls')}
                  className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                >
                  Export to Excel (.xls)
                </button>
                <button 
                  onClick={() => triggerExport('csv')}
                  className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                >
                  Export to CSV
                </button>
              </div>
            )}
          </div>

          {/* Print PDF Trigger */}
          <button 
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold transition"
          >
            <Printer className="h-3.5 w-3.5 text-slate-400" />
            <span>Print / PDF</span>
          </button>

          {/* Save & Dashboard Exit */}
          <button 
            onClick={goBackToDashboard}
            className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/10 transition"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save & Exit</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* Left Side: Table & General Stats */}
        <div className="flex-1 p-6 md:p-8 max-w-full overflow-x-auto">
          {copySuccessMsg && (
            <div className="fixed top-20 right-8 z-50 bg-emerald-500 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center space-x-2 text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-200">
              <Check className="h-4 w-4" />
              <span>{copySuccessMsg}</span>
            </div>
          )}

          {/* Header Metadata Display Card */}
          <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 md:p-6 mb-6 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Faculty In-charge</span>
                <span className="font-semibold">{activeDoc.facultyName || "Not Specified"}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Department & Program</span>
                <span className="font-semibold">{activeDoc.department} ({activeDoc.program})</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Regulation & Credits</span>
                <span className="font-semibold">Reg {activeDoc.regulation} / {activeDoc.credits} Credits</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Year / Sem / Academic Year</span>
                <span className="font-semibold">Year {activeDoc.year}, Sem {activeDoc.semester} ({activeDoc.academicYear})</span>
              </div>
            </div>
          </section>

          {/* TABLE CONTAINER */}
          <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 md:p-6 shadow-sm overflow-x-auto">
                     <h3 className="text-lg font-bold text-black dark:text-white font-serif mb-2.5">
              MAPPING OF CO’S& PO’S:
            </h3>

            <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
              <p className="italic">
                * Click on a cell to cycle correlation strength: [Blank] → 1 (Low) → 2 (Moderate) → 3 (High).
              </p>
              <p className="hidden md:block">
                Hover over headers to view descriptions.
              </p>
            </div>

            <table className="w-full border-collapse border border-slate-400 dark:border-slate-600 font-serif text-sm text-black dark:text-white">
              <thead>
                <tr className="bg-white dark:bg-slate-800 text-black dark:text-white font-bold border-b border-slate-400 dark:border-slate-600">
                  <th 
                    className="border border-slate-400 dark:border-slate-600 p-3 text-center font-bold bg-white dark:bg-slate-800"
                    title="Course Outcomes / Program Outcomes"
                  >
                    CO/PO
                  </th>
                  {activePOs.map(po => (
                    <th 
                      key={po.id}
                      className="border border-slate-400 dark:border-slate-600 p-3 text-center cursor-help min-w-[50px] bg-white dark:bg-slate-800"
                      title={`${po.id}: ${po.name}\n\n${po.description}`}
                    >
                      {po.id}
                    </th>
                  ))}
                  {activePSOs.map(pso => (
                    <th 
                      key={pso.id}
                      className="border border-slate-400 dark:border-slate-600 p-3 text-center cursor-help min-w-[50px] bg-white dark:bg-slate-800"
                      title={`${pso.id}: ${pso.name}\n\n${pso.description}`}
                    >
                      {pso.id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 dark:divide-slate-700">
                {activeCOs.map((co) => (
                  <tr 
                    key={co.id}
                    className="hover:bg-slate-100/50 dark:hover:bg-slate-700/30 transition"
                  >
                    {/* CO Label */}
                    <td 
                      className="border border-slate-400 dark:border-slate-600 p-3 font-bold text-center bg-white dark:bg-slate-800 cursor-help"
                      title={`${co.id}: ${co.description}`}
                    >
                      {co.id}
                    </td>

                    {/* PO Cells */}
                    {activePOs.map(po => {
                      const val = activeDoc.matrix[co.id]?.[po.id] ?? '';
                      const isHovered = hoveredCell?.coId === co.id || hoveredCell?.poId === po.id;
                      
                      return (
                        <td
                          key={po.id}
                          onClick={() => handleCellClick(co.id, po.id)}
                          onDoubleClick={() => handleSelectCellForExplanation(co.id, po.id)}
                          onMouseEnter={() => setHoveredCell({ coId: co.id, poId: po.id })}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`border border-slate-400 dark:border-slate-600 p-3 text-center cursor-pointer select-none transition-all duration-150 hover:bg-slate-100 dark:hover:bg-slate-700 relative ${getCellColor(val)} ${
                            isHovered ? 'ring-1 ring-blue-500/20 dark:ring-blue-400/20' : ''
                          }`}
                          title={`Click to cycle: - (no mapping) → 1 → 2 → 3 → -\nDouble-click to view explanation\n\n${activeDoc.justifications[co.id]?.[po.id] || 'No correlation mapped.'}`}
                        >
                          {displayVal(val)}
                        </td>
                      );
                    })}

                    {/* PSO Cells */}
                    {activePSOs.map(pso => {
                      const val = activeDoc.matrix[co.id]?.[pso.id] ?? '';
                      const isHovered = hoveredCell?.coId === co.id || hoveredCell?.poId === pso.id;

                      return (
                        <td
                          key={pso.id}
                          onClick={() => handleCellClick(co.id, pso.id)}
                          onDoubleClick={() => handleSelectCellForExplanation(co.id, pso.id)}
                          onMouseEnter={() => setHoveredCell({ coId: co.id, poId: pso.id })}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`border border-slate-400 dark:border-slate-600 p-3 text-center cursor-pointer select-none transition-all duration-150 hover:bg-slate-100 dark:hover:bg-slate-700 relative ${getCellColor(val)} ${
                            isHovered ? 'ring-1 ring-blue-500/20 dark:ring-blue-400/20' : ''
                          }`}
                          title={`Click to cycle: - (no mapping) → 1 → 2 → 3 → -\nDouble-click to view explanation\n\n${activeDoc.justifications[co.id]?.[pso.id] || 'No correlation mapped.'}`}
                        >
                          {displayVal(val)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {/* Right Side: Side Drawer for Mapping Explanations */}
        {isDrawerOpen && (
          <aside className="w-full md:w-[380px] flex-shrink-0 bg-white dark:bg-slate-800 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 flex flex-col h-[500px] md:h-auto z-30 animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/30">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">AI Mapping Explanation</h3>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Drawer Body content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {selectedCell ? (
                // Explaining single selected cell
                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-850 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">
                        {selectedCell.coId} → {selectedCell.poId}
                      </span>
                      <span className="font-semibold bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                        Mapping Level: {activeDoc.matrix[selectedCell.coId]?.[selectedCell.poId] || 'Blank (0)'}
                      </span>
                    </div>

                    <div className="text-[11px] border-t border-slate-100 dark:border-slate-700/60 pt-2 text-slate-400 leading-normal">
                      <strong>Outcome:</strong> {activeCOs.find(co => co.id === selectedCell.coId)?.description}
                    </div>

                    <div className="text-[11px] text-slate-400 leading-normal">
                      <strong>Criteria:</strong> {
                        activePOs.find(po => po.id === selectedCell.poId)?.description || 
                        activePSOs.find(pso => pso.id === selectedCell.poId)?.description
                      }
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Justification Analysis</h4>
                      {!isEditingJustification && (
                        <button
                          onClick={() => setIsEditingJustification(true)}
                          className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center space-x-1"
                        >
                          <Edit3 className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>

                    {isEditingJustification ? (
                      <div className="space-y-2">
                        <textarea
                          value={editJustificationText}
                          onChange={(e) => setEditJustificationText(e.target.value)}
                          rows={6}
                          className="w-full px-3 py-2 border border-blue-500 focus:outline-none dark:bg-slate-900 text-xs rounded-xl"
                        />
                        <div className="flex justify-end gap-2 text-[10px]">
                          <button
                            onClick={() => setIsEditingJustification(false)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveJustification}
                            className="px-2.5 py-1 bg-blue-600 text-white rounded font-bold hover:bg-blue-700"
                          >
                            Save Edit
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs bg-indigo-50/30 dark:bg-indigo-950/10 p-3.5 border border-indigo-100/50 dark:border-indigo-900/30 rounded-xl leading-relaxed">
                        {activeDoc.justifications[selectedCell.coId]?.[selectedCell.poId] || 'No justification available.'}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                // Multi outcome general collapsed overview list
                <div className="space-y-4">
                  <div className="bg-blue-50/50 dark:bg-blue-900/10 p-3.5 border border-blue-100 dark:border-blue-900/40 rounded-xl text-xs">
                    <p className="font-semibold text-blue-900 dark:text-blue-300">Interact with Cells</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-1">
                      Double-click or select any cell in the mapping table matrix on the left to see its customized semantic justification here.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Justifications Summary</h4>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                      {activeCOs.map(co => (
                        <div key={co.id} className="py-2.5 first:pt-0">
                          <p className="font-bold text-slate-800 dark:text-slate-200 font-mono text-[11px] mb-1">{co.id} Overview</p>
                          <p className="text-[10px] text-slate-400 truncate mb-2">{co.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {activePOs.slice(0, 6).map(po => {
                              const val = activeDoc.matrix[co.id]?.[po.id];
                              if (!val) return null;
                              return (
                                <button 
                                  key={po.id}
                                  onClick={() => handleSelectCellForExplanation(co.id, po.id)}
                                  className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 text-[10px] font-semibold text-slate-500 font-mono transition"
                                >
                                  {po.id}: {val}
                                </button>
                              );
                            })}
                            <button 
                              onClick={() => {
                                // Default to PO1
                                handleSelectCellForExplanation(co.id, 'PO1');
                              }}
                              className="px-1.5 py-0.5 rounded text-[10px] text-blue-600 hover:underline"
                            >
                              More...
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* PRINT-ONLY EMBEDDED RENDER LAYOUT */}
      {/* This DOM structure is hidden on screen (no-print in header), but shown when window.print() is fired */}
      <div className="hidden print:block p-12 bg-white text-black font-serif">
        <h1 className="text-center text-2xl font-bold uppercase tracking-wide border-b-2 border-black pb-3">
          NBA standard CO-PO & CO-PSO Mapping Report
        </h1>
        
        <table className="mt-8 border-collapse border border-black w-full text-sm">
          <tbody>
            <tr>
              <td className="border border-black p-3 font-bold text-left bg-gray-100 w-1/4">Subject Name:</td>
              <td className="border border-black p-3 text-left w-3/4">{activeDoc.subjectName}</td>
            </tr>
            <tr>
              <td className="border border-black p-3 font-bold text-left bg-gray-100">Subject Code:</td>
              <td className="border border-black p-3 text-left font-mono">{activeDoc.subjectCode || 'N/A'}</td>
            </tr>
            <tr>
              <td className="border border-black p-3 font-bold text-left bg-gray-100">Department / Program:</td>
              <td className="border border-black p-3 text-left">{activeDoc.department} ({activeDoc.program})</td>
            </tr>
            <tr>
              <td className="border border-black p-3 font-bold text-left bg-gray-100">Regulation / Sem:</td>
              <td className="border border-black p-3 text-left">Reg {activeDoc.regulation} / Semester {activeDoc.semester} (Year {activeDoc.year})</td>
            </tr>
            <tr>
              <td className="border border-black p-3 font-bold text-left bg-gray-100">Faculty In-charge:</td>
              <td className="border border-black p-3 text-left">{activeDoc.facultyName || 'Not Specified'}</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-8 text-lg font-bold border-b border-black pb-1">Course Outcomes (COs)</h3>
        <table className="mt-4 border-collapse border border-black w-full text-xs text-left">
          <thead>
            <tr className="bg-gray-100 font-bold">
              <th className="border border-black p-2 w-[10%] text-center">CO</th>
              <th className="border border-black p-2">Course Outcome Description</th>
            </tr>
          </thead>
          <tbody>
            {activeCOs.map(co => (
              <tr key={co.id}>
                <td className="border border-black p-2 text-center font-bold font-mono">{co.id}</td>
                <td className="border border-black p-2">{co.description}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="mt-8 text-lg font-bold font-serif border-b border-black pb-1">MAPPING OF CO’S& PO’S:</h3>
        <table className="mt-4 border-collapse border border-black w-full text-sm text-center font-serif font-bold">
          <thead>
            <tr className="bg-white text-black font-bold">
              <th className="border border-black p-2">CO/PO</th>
              {activePOs.map(po => (
                <th key={po.id} className="border border-black p-2">{po.id}</th>
              ))}
              {activePSOs.map(pso => (
                <th key={pso.id} className="border border-black p-2">{pso.id}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeCOs.map(co => (
              <tr key={co.id} className="bg-white text-black">
                <td className="border border-black p-2 font-bold">{co.id}</td>
                {activePOs.map(po => (
                  <td key={po.id} className="border border-black p-2 text-center">{activeDoc.matrix[co.id]?.[po.id] || '-'}</td>
                ))}
                {activePSOs.map(pso => (
                  <td key={pso.id} className="border border-black p-2 text-center">{activeDoc.matrix[co.id]?.[pso.id] || '-'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* PRINT ONLY: Complete detailed justifications annex list */}
        <div className="print-page-break"></div>
        <h3 className="mt-8 text-lg font-bold border-b border-black pb-1">AI Mapping Justification Annex</h3>
        <div className="mt-4 space-y-4 text-xs text-left">
          {activeCOs.map(co => (
            <div key={co.id} className="space-y-2">
              <h4 className="font-bold border-b border-gray-200 pb-0.5">{co.id}: {co.description}</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {activePOs.map(po => {
                  const val = activeDoc.matrix[co.id]?.[po.id];
                  if (!val) return null;
                  return (
                    <li key={po.id}>
                      <strong>{po.id} (Level {val}):</strong> {activeDoc.justifications[co.id]?.[po.id]}
                    </li>
                  );
                })}
                {activePSOs.map(pso => {
                  const val = activeDoc.matrix[co.id]?.[pso.id];
                  if (!val) return null;
                  return (
                    <li key={pso.id}>
                      <strong>{pso.id} (Level {val}):</strong> {activeDoc.justifications[co.id]?.[pso.id]}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
