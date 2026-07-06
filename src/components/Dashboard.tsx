import React, { useState } from 'react';
import { useMapping } from '../context/MappingContext';
import type { MappingDocument } from '../context/MappingContext';
import { 
  Plus, Search, ArrowUpDown, Copy, Edit2, Trash2, 
  BookOpen, Calendar, Award, GraduationCap, Sun, Moon, 
  HelpCircle, FileSpreadsheet, ChevronRight, X 
} from 'lucide-react';
import { DEPARTMENT_TEMPLATES } from '../utils/templates';

export const Dashboard: React.FC = () => {
  const {
    documents,
    createNewDocument,
    loadDocument,
    deleteDocument,
    duplicateDocument,
    renameDocument,
    darkMode,
    setDarkMode
  } = useMapping();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'name-asc' | 'name-desc'>('date-desc');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  
  // Document Renaming Local State
  const [renameDocId, setRenameDocId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // Filtering documents
  const filteredDocs = documents.filter(doc => 
    doc.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sorting documents
  const sortedDocs = [...filteredDocs].sort((a, b) => {
    if (sortBy === 'date-desc') return b.lastModified - a.lastModified;
    if (sortBy === 'date-asc') return a.lastModified - b.lastModified;
    if (sortBy === 'name-asc') return a.subjectName.localeCompare(b.subjectName);
    if (sortBy === 'name-desc') return b.subjectName.localeCompare(a.subjectName);
    return 0;
  });

  const handleOpenRename = (doc: MappingDocument) => {
    setRenameDocId(doc.id);
    setRenameValue(doc.subjectName);
  };

  const handleSaveRename = () => {
    if (renameDocId && renameValue.trim()) {
      renameDocument(renameDocId, renameValue.trim());
      setRenameDocId(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 dark:bg-blue-500 text-white p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              OBE-MapAI
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              NBA/NAAC CO-PO Semantic Mapping System
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsHelpModalOpen(true)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </button>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        
        {/* Welcome Section */}
        <section className="mb-10 text-center md:text-left flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Academic Dashboard
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Create balanced, explainable CO–PO matrices matching Bloom's Taxonomy levels using client-side AI analysis.
            </p>
          </div>
          <div className="flex justify-center md:justify-end gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div className="bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              <span>Fully Offline Inference</span>
            </div>
            <div className="bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center space-x-2">
              <span>{documents.length} Saved Sheets</span>
            </div>
          </div>
        </section>

        {/* Action Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Start Blank */}
          <div 
            onClick={() => createNewDocument()}
            className="group cursor-pointer bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 transform hover:-translate-y-1 transition duration-300 flex flex-col justify-between min-h-[180px]"
          >
            <div className="flex justify-between items-start">
              <div className="bg-white/10 p-3 rounded-xl">
                <Plus className="h-6 w-6" />
              </div>
              <ChevronRight className="h-5 w-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Create Blank Mapping</h3>
              <p className="text-white/80 text-xs mt-1">
                Enter your course outcomes, syllabus, and customize POs/PSOs manually from scratch.
              </p>
            </div>
          </div>

          {/* Card 2: Curriculum Templates */}
          <div 
            onClick={() => setIsTemplateModalOpen(true)}
            className="group cursor-pointer bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300 flex flex-col justify-between min-h-[180px]"
          >
            <div className="flex justify-between items-start">
              <div className="bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 p-3 rounded-xl">
                <BookOpen className="h-6 w-6" />
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white group-hover:translate-x-1 transition" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Curriculum Templates</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                Load preset subjects for CSE, ECE, EEE, Mechanical, Civil, AI, Data Science, and Cybersecurity.
              </p>
            </div>
          </div>

          {/* Card 3: Guide/Manual */}
          <div 
            onClick={() => setIsHelpModalOpen(true)}
            className="group cursor-pointer bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300 flex flex-col justify-between min-h-[180px]"
          >
            <div className="flex justify-between items-start">
              <div className="bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 p-3 rounded-xl">
                <Award className="h-6 w-6" />
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white group-hover:translate-x-1 transition" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">NBA/OBE Guidelines</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                Read about Bloom's taxonomy mapping rules, correlation ranges, and accreditation requirements.
              </p>
            </div>
          </div>
        </section>

        {/* Saved Sheets Area */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 shadow-sm">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <FileSpreadsheet className="h-5 w-5 text-slate-400" />
              <span>Saved Mapping Sheets</span>
            </h3>
            
            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search subject or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-300 cursor-pointer font-medium"
                >
                  <option value="date-desc">Recent Modified</option>
                  <option value="date-asc">Oldest Modified</option>
                  <option value="name-asc">Subject Name (A-Z)</option>
                  <option value="name-desc">Subject Name (Z-A)</option>
                </select>
                <ArrowUpDown className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Saved Files List */}
          {documents.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
              <FileSpreadsheet className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">No saved documents found</p>
              <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
                Create a blank sheet or load a curriculum template to get started.
              </p>
            </div>
          ) : sortedDocs.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-500 dark:text-slate-400">No documents matches your search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                    <th className="py-4 px-4">Subject Information</th>
                    <th className="py-4 px-4 hidden md:table-cell">Regulation & Sem</th>
                    <th className="py-4 px-4 hidden sm:table-cell">Last Modified</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {sortedDocs.map((doc) => (
                    <tr 
                      key={doc.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-700/20 transition group"
                    >
                      {/* Name & Code */}
                      <td className="py-4 px-4">
                        {renameDocId === doc.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              className="px-2 py-1 border border-blue-500 rounded focus:outline-none dark:bg-slate-800 text-slate-900 dark:text-white"
                              autoFocus
                            />
                            <button 
                              onClick={handleSaveRename}
                              className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                            >
                              Save
                            </button>
                            <button 
                              onClick={() => setRenameDocId(null)}
                              className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div>
                            <button 
                              onClick={() => loadDocument(doc.id)}
                              className="text-left font-semibold text-blue-600 dark:text-blue-400 hover:underline group-hover:text-blue-700 dark:group-hover:text-blue-300 transition"
                            >
                              {doc.subjectName || "Untitled Subject"}
                            </button>
                            <div className="flex items-center space-x-2 text-xs text-slate-400 dark:text-slate-500 mt-1">
                              <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px] text-slate-600 dark:text-slate-300 uppercase">
                                {doc.subjectCode || "N/A"}
                              </span>
                              <span>•</span>
                              <span>{doc.department}</span>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Regulation & Sem */}
                      <td className="py-4 px-4 hidden md:table-cell">
                        <div className="text-slate-600 dark:text-slate-300 font-medium">
                          {doc.regulation} / {doc.program}
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                          Year {doc.year}, Sem {doc.semester} ({doc.credits} Credits)
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 hidden sm:table-cell text-slate-500 dark:text-slate-400">
                        <div className="flex items-center space-x-1 text-xs">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>{formatDate(doc.lastModified)}</span>
                        </div>
                      </td>

                      {/* Actions Buttons */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => loadDocument(doc.id)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                            title="Open Mapping Sheet"
                          >
                            <ChevronRight className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => duplicateDocument(doc.id)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                            title="Duplicate Sheet"
                          >
                            <Copy className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => handleOpenRename(doc)}
                            className="p-1.5 text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                            title="Rename Subject"
                          >
                            <Edit2 className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this mapping record?')) {
                                deleteDocument(doc.id);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                            title="Delete Sheet"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-6 md:px-12 text-center text-xs text-slate-400 dark:text-slate-500">
        OBE-MapAI Framework v2.0 • Offline Browser WebGPU-Free Semantic Inference • Compliant with JNTUA & NBA Standards
      </footer>

      {/* TEMPLATE SELECTION DIALOG MODAL */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto border border-slate-200 dark:border-slate-700 shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Load Standard Curriculum Template
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-400 mt-1">
                  Choose a department course template below to pre-populate syllabus, course outcomes, and PSOs instantly.
                </p>
              </div>
              <button 
                onClick={() => setIsTemplateModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(DEPARTMENT_TEMPLATES).map(([key, template]) => (
                <div
                  key={key}
                  onClick={() => {
                    createNewDocument(key);
                    setIsTemplateModalOpen(false);
                  }}
                  className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50/20 dark:hover:bg-blue-900/10 cursor-pointer transition duration-200 group flex flex-col justify-between"
                >
                  <div>
                    <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-md mb-2">
                      {key}
                    </span>
                    <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm">
                      {template.subjectName}
                    </h4>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
                      {template.subjectCode} • Reg: {template.regulation}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 mt-4 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                    <span>{template.courseOutcomes.length} COs</span>
                    <span>•</span>
                    <span>{template.psos.length} PSOs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HELP AND GUIDE DIALOG MODAL */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-slate-200 dark:border-slate-700 shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  NBA/OBE Guidelines & Semantic AI
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-400 mt-1">
                  Understanding the rules of Outcomes-Based Education mapping.
                </p>
              </div>
              <button 
                onClick={() => setIsHelpModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">1. Mapping Strength Definitions</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong className="text-blue-600 dark:text-blue-400">Level 3 (High Correlation):</strong> The CO directly demands highest cognitive level solutions, engineering frameworks, or structural designs matching the PO definition.</li>
                <li><strong className="text-blue-600 dark:text-blue-400">Level 2 (Moderate Correlation):</strong> The CO requires application or analysis of concepts matching the PO criteria, supporting larger system designs.</li>
                <li><strong className="text-blue-600 dark:text-blue-400">Level 1 (Low Correlation):</strong> The CO covers introductory aspects, definitions, or basic interpretations, representing limited exposure.</li>
                <li><strong>Blank (No Mapping):</strong> No semantic overlap exists between the CO technical context and the PO definition.</li>
              </ul>

              <h4 className="font-bold text-sm text-slate-900 dark:text-white">2. Semantic AI Engine Strategy</h4>
              <p>
                The mapping engine operates entirely inside your browser. It tokenizes text from the Subject Name, Subject Code, Course Outcomes, and optional Syllabus, then:
              </p>
              <ul className="list-decimal pl-5 space-y-1">
                <li>Parses active verbs (e.g. <em>design</em>, <em>analyze</em>, <em>identify</em>) and labels them with Bloom's Taxonomy cognitive levels (L1 Remember to L6 Create).</li>
                <li>Calculates match densities against standard PO1-PO12 keyword clusters.</li>
                <li>Prunes unrealistic mappings (e.g., preventing general programming courses from mapping to PO7 Environment or PO8 Ethics unless explicit sustainability or integrity keywords are found).</li>
                <li>Builds deterministic natural language justifications for every cell mapping.</li>
              </ul>

              <h4 className="font-bold text-sm text-slate-900 dark:text-white">3. NBA Compliance Tips</h4>
              <p>
                Academics should avoid "overmapping" (assigning 3 to every cell). A realistic, high-quality sheet typically has 25% to 50% blank cells. For instance, PO6 (Society), PO7 (Environment), and PO8 (Ethics) are only mapped if there is clear, corresponding curricular evidence.
              </p>
            </div>
            
            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-end">
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-xs shadow-md transition"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
