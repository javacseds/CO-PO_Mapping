import React, { useState } from 'react';
import { useMapping } from '../context/MappingContext';
import { extractTextFromFile } from '../utils/fileParsers';
import { 
  ArrowLeft, Sparkles, Plus, Trash2, ArrowUp, ArrowDown, 
  Upload, Check, FileText, Info, AlertCircle, Loader2, Save, Award
} from 'lucide-react';
import type { CourseOutcome, Outcome } from '../utils/templates';

type FormTab = 'metadata' | 'cos' | 'pos' | 'syllabus';

export const MappingForm: React.FC = () => {
  const {
    activeDoc,
    updateActiveField,
    triggerAIGeneration,
    saveActiveDocument,
    goBackToDashboard
  } = useMapping();

  const [activeTab, setActiveTab] = useState<FormTab>('metadata');
  
  // File upload states
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseSuccess, setParseSuccess] = useState(false);

  // Custom PO / PSO additions local states
  const [customPoName, setCustomPoName] = useState('');
  const [customPoDesc, setCustomPoDesc] = useState('');

  if (!activeDoc) return null;

  const handleFieldChange = (key: keyof typeof activeDoc, value: any) => {
    updateActiveField(key, value);
  };

  // --- Course Outcomes Operations ---
  const handleAddCO = () => {
    const nextNum = activeDoc.courseOutcomes.length + 1;
    const newCO: CourseOutcome = {
      id: `CO${nextNum}`,
      description: ''
    };
    handleFieldChange('courseOutcomes', [...activeDoc.courseOutcomes, newCO]);
  };

  const handleUpdateCO = (index: number, val: string) => {
    const updated = [...activeDoc.courseOutcomes];
    updated[index].description = val;
    handleFieldChange('courseOutcomes', updated);
  };

  const handleDeleteCO = (index: number) => {
    const filtered = activeDoc.courseOutcomes.filter((_, idx) => idx !== index);
    // Re-index IDs so they are sequential (CO1, CO2, etc.)
    const reindexed = filtered.map((co, idx) => ({
      ...co,
      id: `CO${idx + 1}`
    }));
    handleFieldChange('courseOutcomes', reindexed);
  };

  const handleMoveCO = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= activeDoc.courseOutcomes.length) return;

    const updated = [...activeDoc.courseOutcomes];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Re-index sequential IDs
    const reindexed = updated.map((co, idx) => ({
      ...co,
      id: `CO${idx + 1}`
    }));
    handleFieldChange('courseOutcomes', reindexed);
  };

  // --- Program Outcomes Operations ---
  const handleUpdatePO = (index: number, field: 'name' | 'description', val: string) => {
    const updated = [...activeDoc.programOutcomes];
    updated[index] = {
      ...updated[index],
      [field]: val
    };
    handleFieldChange('programOutcomes', updated);
  };

  const handleAddCustomPO = () => {
    if (!customPoName.trim() || !customPoDesc.trim()) return;
    
    // Find next numerical PO if standard naming, or use custom
    const nextNum = activeDoc.programOutcomes.length + 1;
    const poId = `PO${nextNum}`;
    
    const newPO: Outcome = {
      id: poId,
      name: customPoName.trim(),
      description: customPoDesc.trim()
    };

    handleFieldChange('programOutcomes', [...activeDoc.programOutcomes, newPO]);
    setCustomPoName('');
    setCustomPoDesc('');
  };

  const handleDeletePO = (id: string) => {
    const filtered = activeDoc.programOutcomes.filter(po => po.id !== id);
    handleFieldChange('programOutcomes', filtered);
  };

  // --- Program Specific Outcomes (PSOs) Operations ---
  const handleUpdatePSO = (index: number, field: 'name' | 'description', val: string) => {
    const updated = [...activeDoc.psos];
    updated[index] = {
      ...updated[index],
      [field]: val
    };
    handleFieldChange('psos', updated);
  };

  const handleAddPSO = () => {
    const nextNum = activeDoc.psos.length + 1;
    const newPSO: Outcome = {
      id: `PSO${nextNum}`,
      name: `Program Specific Outcome ${nextNum}`,
      description: ''
    };
    handleFieldChange('psos', [...activeDoc.psos, newPSO]);
  };

  const handleDeletePSO = (index: number) => {
    const filtered = activeDoc.psos.filter((_, idx) => idx !== index);
    // Re-index PSOs
    const reindexed = filtered.map((pso, idx) => ({
      ...pso,
      id: `PSO${idx + 1}`,
      name: pso.name.startsWith('Program Specific Outcome') 
        ? `Program Specific Outcome ${idx + 1}` 
        : pso.name
    }));
    handleFieldChange('psos', reindexed);
  };

  // --- Client Side File Extraction ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setParseError(null);
    setParseSuccess(false);

    try {
      const extractedText = await extractTextFromFile(file);
      if (extractedText.trim()) {
        const currentSyllabus = activeDoc.syllabus;
        const divider = currentSyllabus ? '\n\n--- Extracted Uploaded Syllabus ---\n' : '';
        handleFieldChange('syllabus', currentSyllabus + divider + extractedText);
        setParseSuccess(true);
      } else {
        setParseError('The file appears to be empty.');
      }
    } catch (err: any) {
      setParseError(err.message || 'Failed to extract text from file.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleSaveAndNotify = () => {
    saveActiveDocument();
    alert('Document saved successfully!');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button 
            onClick={goBackToDashboard}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition text-slate-600 dark:text-slate-300"
            title="Go back to Dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-md font-bold text-slate-900 dark:text-white truncate max-w-xs md:max-w-md">
              {activeDoc.subjectName || "New Mapping Worksheet"}
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              {activeDoc.subjectCode || "NO CODE"} • {activeDoc.regulation}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={handleSaveAndNotify}
            className="flex items-center space-x-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold transition"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Draft</span>
          </button>
          
          <button 
            onClick={triggerAIGeneration}
            disabled={activeDoc.subjectName.trim() === '' || activeDoc.courseOutcomes.filter(co => co.description.trim() !== '').length === 0}
            className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-400 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 disabled:shadow-none transition duration-200 disabled:cursor-not-allowed"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Generate Mapping</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Tabs Navigator */}
        <aside className="md:w-64 flex-shrink-0">
          <div className="sticky top-24 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-1 shadow-sm">
            <button
              onClick={() => setActiveTab('metadata')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition flex items-center space-x-3 ${
                activeTab === 'metadata' 
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400'
              }`}
            >
              <Info className="h-4.5 w-4.5" />
              <span>1. General Details</span>
            </button>
            <button
              onClick={() => setActiveTab('cos')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition flex items-center space-x-3 ${
                activeTab === 'cos' 
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400'
              }`}
            >
              <FileText className="h-4.5 w-4.5" />
              <span>2. Course Outcomes ({activeDoc.courseOutcomes.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('pos')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition flex items-center space-x-3 ${
                activeTab === 'pos' 
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400'
              }`}
            >
              <Award className="h-4.5 w-4.5" />
              <span>3. PO & PSO Setup</span>
            </button>
            <button
              onClick={() => setActiveTab('syllabus')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition flex items-center space-x-3 ${
                activeTab === 'syllabus' 
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400'
              }`}
            >
              <Upload className="h-4.5 w-4.5" />
              <span>4. Syllabus & Context</span>
            </button>
          </div>
        </aside>

        {/* Right Side: Tab Work Area */}
        <section className="flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 shadow-sm">
          
          {/* TAB 1: METADATA */}
          {activeTab === 'metadata' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Subject Metadata</h3>
                <p className="text-xs text-slate-400 mt-1">Configure standard identifiers required for mapping cover pages.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Subject Name *</label>
                  <input
                    type="text"
                    required
                    value={activeDoc.subjectName}
                    onChange={(e) => handleFieldChange('subjectName', e.target.value)}
                    placeholder="e.g. Data Structures and Algorithms"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Subject Code</label>
                  <input
                    type="text"
                    value={activeDoc.subjectCode}
                    onChange={(e) => handleFieldChange('subjectCode', e.target.value)}
                    placeholder="e.g. 20A05301T"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-900 text-sm font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Department</label>
                  <input
                    type="text"
                    value={activeDoc.department}
                    onChange={(e) => handleFieldChange('department', e.target.value)}
                    placeholder="e.g. Computer Science & Engineering"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Regulation</label>
                  <input
                    type="text"
                    value={activeDoc.regulation}
                    onChange={(e) => handleFieldChange('regulation', e.target.value)}
                    placeholder="e.g. R20"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Program</label>
                  <input
                    type="text"
                    value={activeDoc.program}
                    onChange={(e) => handleFieldChange('program', e.target.value)}
                    placeholder="e.g. B.Tech"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Faculty Name</label>
                  <input
                    type="text"
                    value={activeDoc.facultyName}
                    onChange={(e) => handleFieldChange('facultyName', e.target.value)}
                    placeholder="e.g. Dr. A. Ramakrishna"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-900 text-sm"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-2">Year</label>
                    <select
                      value={activeDoc.year}
                      onChange={(e) => handleFieldChange('year', e.target.value)}
                      className="w-full px-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none dark:bg-slate-900 text-xs"
                    >
                      <option value="I">I</option>
                      <option value="II">II</option>
                      <option value="III">III</option>
                      <option value="IV">IV</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-2">Semester</label>
                    <select
                      value={activeDoc.semester}
                      onChange={(e) => handleFieldChange('semester', e.target.value)}
                      className="w-full px-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none dark:bg-slate-900 text-xs"
                    >
                      <option value="I">I</option>
                      <option value="II">II</option>
                      <option value="III">III</option>
                      <option value="IV">IV</option>
                      <option value="V">V</option>
                      <option value="VI">VI</option>
                      <option value="VII">VII</option>
                      <option value="VIII">VIII</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-2">Credits</label>
                    <input
                      type="number"
                      value={activeDoc.credits}
                      onChange={(e) => handleFieldChange('credits', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none dark:bg-slate-900 text-xs text-center"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Academic Year</label>
                    <input
                      type="text"
                      value={activeDoc.academicYear}
                      onChange={(e) => handleFieldChange('academicYear', e.target.value)}
                      placeholder="e.g. 2026-27"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none dark:bg-slate-900 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COURSE OUTCOMES */}
          {activeTab === 'cos' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Course Outcomes (COs)</h3>
                  <p className="text-xs text-slate-400 mt-1">Specify detailed outcomes. Start each outcome with an action verb (e.g. <em>Analyze</em>, <em>Design</em>).</p>
                </div>
                <button
                  onClick={handleAddCO}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add CO</span>
                </button>
              </div>

              <div className="space-y-4">
                {activeDoc.courseOutcomes.map((co, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-4 p-4 border border-slate-100 dark:border-slate-700/60 rounded-xl hover:border-slate-200 dark:hover:border-slate-600/80 transition bg-slate-50/30 dark:bg-slate-900/10"
                  >
                    <div className="flex flex-col items-center justify-center pt-2">
                      <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">
                        {co.id}
                      </span>
                    </div>

                    <div className="flex-1">
                      <textarea
                        value={co.description}
                        onChange={(e) => handleUpdateCO(index, e.target.value)}
                        placeholder={`Enter Course Outcome description (e.g. Design dynamic arrays and analyze space allocations...)`}
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
                      />
                    </div>

                    {/* Move and delete controls */}
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => handleMoveCO(index, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-30 disabled:hover:bg-transparent text-slate-500"
                        title="Move Up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveCO(index, 'down')}
                        disabled={index === activeDoc.courseOutcomes.length - 1}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-30 disabled:hover:bg-transparent text-slate-500"
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCO(index)}
                        className="p-1 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 rounded text-slate-400 transition"
                        title="Delete Course Outcome"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {activeDoc.courseOutcomes.length === 0 && (
                <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                  <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500 text-xs">No Course Outcomes added yet. Click Add CO to start.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: POs & PSOs */}
          {activeTab === 'pos' && (
            <div className="space-y-8">
              
              {/* SECTION: PROGRAM OUTCOMES */}
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Program Outcomes (POs)</h3>
                    <p className="text-xs text-slate-400 mt-1">Default PO1–PO12 follow Graduate Attributes. You can edit names or descriptions if necessary.</p>
                  </div>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 border border-slate-100 dark:border-slate-700/60 p-4 rounded-xl">
                  {activeDoc.programOutcomes.map((po, index) => (
                    <div 
                      key={po.id}
                      className="border-b border-slate-100 dark:border-slate-700/40 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-bold text-xs bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400">
                          {po.id}
                        </span>
                        <button
                          onClick={() => handleDeletePO(po.id)}
                          className="text-[10px] text-slate-400 hover:text-rose-600 font-semibold transition"
                        >
                          Remove PO
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <input
                          type="text"
                          value={po.name}
                          onChange={(e) => handleUpdatePO(index, 'name', e.target.value)}
                          placeholder="Outcome Name"
                          className="sm:col-span-1 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold focus:outline-none dark:bg-slate-900"
                        />
                        <textarea
                          value={po.description}
                          onChange={(e) => handleUpdatePO(index, 'description', e.target.value)}
                          placeholder="Outcome description"
                          rows={2}
                          className="sm:col-span-3 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none dark:bg-slate-900 resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Custom PO */}
                <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 p-4 rounded-xl mt-4">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center space-x-1">
                    <Plus className="h-3.5 w-3.5 text-blue-600" />
                    <span>Add Custom Program Outcome (e.g. PO13)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                    <div className="sm:col-span-1">
                      <label className="block text-[10px] text-slate-400 mb-1">Outcome Name</label>
                      <input
                        type="text"
                        value={customPoName}
                        onChange={(e) => setCustomPoName(e.target.value)}
                        placeholder="e.g. Complex Systems"
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none dark:bg-slate-800"
                      />
                    </div>
                    <div className="sm:col-span-2 flex gap-3">
                      <div className="flex-1">
                        <label className="block text-[10px] text-slate-400 mb-1">Description</label>
                        <input
                          type="text"
                          value={customPoDesc}
                          onChange={(e) => setCustomPoDesc(e.target.value)}
                          placeholder="Apply advanced methodologies to..."
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none dark:bg-slate-800"
                        />
                      </div>
                      <button
                        onClick={handleAddCustomPO}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition h-[34px]"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: PROGRAM SPECIFIC OUTCOMES */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Program Specific Outcomes (PSOs)</h3>
                    <p className="text-xs text-slate-400 mt-1">Enable mapping to department-specific specialties (e.g. Software Systems, VLSI).</p>
                  </div>
                  
                  {/* Toggle PSO */}
                  <button
                    onClick={() => handleFieldChange('psoEnabled', !activeDoc.psoEnabled)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition duration-200 ${
                      activeDoc.psoEnabled 
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-200 dark:border-emerald-900' 
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}
                  >
                    <span>{activeDoc.psoEnabled ? 'PSOs Enabled' : 'PSOs Disabled'}</span>
                  </button>
                </div>

                {activeDoc.psoEnabled && (
                  <div className="space-y-4 animate-in slide-in-from-top-4 duration-200">
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                      {activeDoc.psos.map((pso, index) => (
                        <div 
                          key={pso.id}
                          className="flex items-start space-x-4 p-4 border border-slate-100 dark:border-slate-700/60 rounded-xl"
                        >
                          <div className="pt-2">
                            <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">
                              {pso.id}
                            </span>
                          </div>
                          
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <input
                              type="text"
                              value={pso.name}
                              onChange={(e) => handleUpdatePSO(index, 'name', e.target.value)}
                              placeholder="PSO Title"
                              className="sm:col-span-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold focus:outline-none dark:bg-slate-900"
                            />
                            <textarea
                              value={pso.description}
                              onChange={(e) => handleUpdatePSO(index, 'description', e.target.value)}
                              placeholder="PSO detailed definition..."
                              rows={2}
                              className="sm:col-span-3 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none dark:bg-slate-900 resize-none"
                            />
                          </div>

                          <button
                            onClick={() => handleDeletePSO(index)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                            title="Delete PSO"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleAddPSO}
                      className="flex items-center space-x-1.5 px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition"
                    >
                      <Plus className="h-4.5 w-4.5 text-slate-500" />
                      <span>Add PSO Column</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SYLLABUS & ANALYSIS */}
          {activeTab === 'syllabus' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Syllabus Context (Optional)</h3>
                <p className="text-xs text-slate-400 mt-1">Providing syllabus content allows the AI semantic engine to detect specific keywords and technical tools, refining calculations.</p>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-900/30 text-center relative transition">
                <input
                  type="file"
                  accept=".txt,.pdf,.docx"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isParsing}
                />
                
                {isParsing ? (
                  <div className="flex flex-col items-center justify-center space-y-2 py-4">
                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Extracting text offline...</p>
                    <p className="text-xs text-slate-400">Loading external parser libraries client-side.</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2 py-2">
                    <Upload className="h-10 w-10 text-slate-400" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      Upload Course Syllabus File
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Supports PDF, DOCX, or Plain Text (.txt) up to 5MB
                    </p>
                  </div>
                )}
              </div>

              {/* Messages */}
              {parseError && (
                <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 p-3.5 rounded-xl flex items-start space-x-2 text-xs text-rose-600 dark:text-rose-400">
                  <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}

              {parseSuccess && (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 p-3 rounded-xl flex items-center space-x-2 text-xs text-emerald-600 dark:text-emerald-400">
                  <Check className="h-4 w-4" />
                  <span>Syllabus file parsed successfully and appended below!</span>
                </div>
              )}

              {/* Syllabus Textbox */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Syllabus Content (Text)</label>
                <textarea
                  value={activeDoc.syllabus}
                  onChange={(e) => handleFieldChange('syllabus', e.target.value)}
                  placeholder="Paste Units/Topics or edit uploaded content..."
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-900 text-sm font-mono"
                />
              </div>

              {/* OBE AI engine notice banner */}
              <div className="bg-blue-50 dark:bg-slate-900/50 border border-blue-100 dark:border-slate-800 p-4 rounded-xl flex items-start space-x-3 text-xs text-slate-600 dark:text-slate-300">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">Bloom's Taxonomy Semantic Engine</p>
                  <p>
                    When you click <strong>Generate Mapping</strong>, the offline parser scans course outcomes for cognitive action verbs (L1-L6) and performs structural checks against PO definitions to prevent overmapping. General guidelines suggest maintaining some blank cells (no correlation) to ensure NBA compliance.
                  </p>
                </div>
              </div>

              {/* Bottom Generate Trigger */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                <button
                  onClick={triggerAIGeneration}
                  disabled={activeDoc.subjectName.trim() === '' || activeDoc.courseOutcomes.filter(co => co.description.trim() !== '').length === 0}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-400 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 disabled:shadow-none transition duration-200"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Generate AI Mapping Matrix</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
