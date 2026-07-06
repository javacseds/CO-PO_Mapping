import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_POS, DEPARTMENT_TEMPLATES } from '../utils/templates';
import type { CourseOutcome, Outcome } from '../utils/templates';
import { generateAIMapping } from '../utils/aiEngine';
import type { MappingValue } from '../utils/aiEngine';

export interface MappingDocument {
  id: string;
  subjectName: string;
  subjectCode: string;
  regulation: string;
  department: string;
  program: string;
  semester: string;
  year: string;
  credits: number;
  academicYear: string;
  facultyName: string;
  courseOutcomes: CourseOutcome[];
  programOutcomes: Outcome[];
  psos: Outcome[];
  psoEnabled: boolean;
  syllabus: string;
  matrix: Record<string, Record<string, MappingValue>>;
  justifications: Record<string, Record<string, string>>;
  lastModified: number;
}

type ViewState = 'dashboard' | 'form' | 'table';

interface MappingContextType {
  documents: MappingDocument[];
  activeDoc: MappingDocument | null;
  currentView: ViewState;
  darkMode: boolean;
  setView: (view: ViewState) => void;
  setDarkMode: (dark: boolean) => void;
  createNewDocument: (templateKey?: string) => void;
  loadDocument: (id: string) => void;
  deleteDocument: (id: string) => void;
  duplicateDocument: (id: string) => void;
  renameDocument: (id: string, newSubjectName: string) => void;
  updateActiveField: (key: keyof MappingDocument, value: any) => void;
  triggerAIGeneration: () => void;
  updateCellMapping: (coId: string, poId: string, value: MappingValue) => void;
  updateCellJustification: (coId: string, poId: string, justification: string) => void;
  saveActiveDocument: () => void;
  goBackToDashboard: () => void;
}

const MappingContext = createContext<MappingContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'copo_mapping_documents_v1';
const THEME_STORAGE_KEY = 'copo_mapping_theme_dark';

const createEmptyDoc = (): MappingDocument => {
  const defaultCOs: CourseOutcome[] = [
    { id: 'CO1', description: '' },
    { id: 'CO2', description: '' },
    { id: 'CO3', description: '' }
  ];
  const defaultPSOs: Outcome[] = [
    { id: 'PSO1', name: 'Software Skills', description: 'Design and develop industrial computer applications.' },
    { id: 'PSO2', name: 'Analysis Skills', description: 'Solve engineering problems using standard computational software.' }
  ];

  return {
    id: `doc_${Date.now()}`,
    subjectName: '',
    subjectCode: '',
    regulation: 'R20',
    department: 'Computer Science & Engineering',
    program: 'B.Tech',
    semester: 'I',
    year: 'I',
    credits: 3,
    academicYear: '2026-27',
    facultyName: '',
    courseOutcomes: defaultCOs,
    programOutcomes: [...DEFAULT_POS],
    psos: defaultPSOs,
    psoEnabled: false,
    syllabus: '',
    matrix: {},
    justifications: {},
    lastModified: Date.now()
  };
};

export const MappingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<MappingDocument[]>([]);
  const [activeDoc, setActiveDoc] = useState<MappingDocument | null>(null);
  const [currentView, setView] = useState<ViewState>('dashboard');
  const [darkMode, setDarkModeState] = useState<boolean>(false);

  // Load documents and theme on mount
  useEffect(() => {
    const storedDocs = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedDocs) {
      try {
        setDocuments(JSON.parse(storedDocs));
      } catch (e) {
        console.error('Error loading documents from local storage:', e);
      }
    }

    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === 'true' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkModeState(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkModeState(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const setDarkMode = (dark: boolean) => {
    setDarkModeState(dark);
    localStorage.setItem(THEME_STORAGE_KEY, String(dark));
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Helper to save documents state
  const persistDocuments = (updatedDocs: MappingDocument[]) => {
    setDocuments(updatedDocs);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedDocs));
  };

  const createNewDocument = (templateKey?: string) => {
    let newDoc = createEmptyDoc();

    if (templateKey && DEPARTMENT_TEMPLATES[templateKey]) {
      const template = DEPARTMENT_TEMPLATES[templateKey];
      newDoc = {
        ...newDoc,
        subjectName: template.subjectName,
        subjectCode: template.subjectCode,
        department: template.department,
        regulation: template.regulation,
        program: template.program,
        semester: template.semester,
        year: template.year,
        credits: template.credits,
        academicYear: template.academicYear,
        facultyName: template.facultyName,
        courseOutcomes: JSON.parse(JSON.stringify(template.courseOutcomes)),
        psos: JSON.parse(JSON.stringify(template.psos)),
        psoEnabled: template.psoEnabled,
        syllabus: template.syllabus,
        matrix: {},
        justifications: {}
      };
    }

    setActiveDoc(newDoc);
    setView('form');
  };

  const loadDocument = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc) {
      // Deep copy to prevent mutating loaded state before save
      setActiveDoc(JSON.parse(JSON.stringify(doc)));
      // Route appropriately: if it has mapping, go to table, else go to form
      if (Object.keys(doc.matrix).length > 0) {
        setView('table');
      } else {
        setView('form');
      }
    }
  };

  const deleteDocument = (id: string) => {
    const updated = documents.filter(d => d.id !== id);
    persistDocuments(updated);
    if (activeDoc?.id === id) {
      setActiveDoc(null);
      setView('dashboard');
    }
  };

  const duplicateDocument = (id: string) => {
    const original = documents.find(d => d.id === id);
    if (original) {
      const duplicated: MappingDocument = {
        ...JSON.parse(JSON.stringify(original)),
        id: `doc_${Date.now()}`,
        subjectName: `${original.subjectName} (Copy)`,
        lastModified: Date.now()
      };
      persistDocuments([duplicated, ...documents]);
    }
  };

  const renameDocument = (id: string, newSubjectName: string) => {
    const updated = documents.map(doc => {
      if (doc.id === id) {
        return { ...doc, subjectName: newSubjectName, lastModified: Date.now() };
      }
      return doc;
    });
    persistDocuments(updated);
    if (activeDoc?.id === id) {
      setActiveDoc(prev => prev ? { ...prev, subjectName: newSubjectName } : null);
    }
  };

  const updateActiveField = (key: keyof MappingDocument, value: any) => {
    setActiveDoc(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [key]: value,
        lastModified: Date.now()
      };
    });
  };

  const triggerAIGeneration = () => {
    if (!activeDoc) return;

    // Filter out blank course outcomes to avoid mapping empty objects
    const cleanedCOs = activeDoc.courseOutcomes.filter(co => co.description.trim() !== '');

    const { matrix, justifications } = generateAIMapping(
      activeDoc.subjectName,
      activeDoc.subjectCode,
      cleanedCOs,
      activeDoc.programOutcomes,
      activeDoc.psos,
      activeDoc.psoEnabled,
      activeDoc.syllabus
    );

    setActiveDoc(prev => {
      if (!prev) return null;
      return {
        ...prev,
        matrix,
        justifications,
        lastModified: Date.now()
      };
    });

    setView('table');
  };

  const updateCellMapping = (coId: string, poId: string, value: MappingValue) => {
    setActiveDoc(prev => {
      if (!prev) return null;
      const updatedMatrix = { ...prev.matrix };
      if (!updatedMatrix[coId]) updatedMatrix[coId] = {};
      updatedMatrix[coId][poId] = value;

      // Update justification dynamically when user manually edits a cell
      const updatedJustifications = { ...prev.justifications };
      if (!updatedJustifications[coId]) updatedJustifications[coId] = {};
      
      const targetPOName = prev.programOutcomes.find(po => po.id === poId)?.name || poId;
      
      if (value === '') {
        updatedJustifications[coId][poId] = `User adjusted mapping: No correlation established for ${targetPOName} (${poId}).`;
      } else {
        const strengthLabel = value === 3 ? 'high (3)' : value === 2 ? 'moderate (2)' : 'low (1)';
        updatedJustifications[coId][poId] = `User adjusted mapping: Manually assigned a ${strengthLabel} correlation to ${targetPOName} (${poId}) based on local syllabus expectations.`;
      }

      return {
        ...prev,
        matrix: updatedMatrix,
        justifications: updatedJustifications,
        lastModified: Date.now()
      };
    });
  };

  const updateCellJustification = (coId: string, poId: string, justification: string) => {
    setActiveDoc(prev => {
      if (!prev) return null;
      const updatedJust = { ...prev.justifications };
      if (!updatedJust[coId]) updatedJust[coId] = {};
      updatedJust[coId][poId] = justification;
      return {
        ...prev,
        justifications: updatedJust,
        lastModified: Date.now()
      };
    });
  };

  const saveActiveDocument = () => {
    if (!activeDoc) return;
    
    const existingIndex = documents.findIndex(d => d.id === activeDoc.id);
    let updatedDocs = [...documents];
    
    const docToSave = {
      ...activeDoc,
      lastModified: Date.now()
    };

    if (existingIndex > -1) {
      updatedDocs[existingIndex] = docToSave;
    } else {
      updatedDocs = [docToSave, ...updatedDocs];
    }
    
    persistDocuments(updatedDocs);
    setActiveDoc(docToSave);
  };

  const goBackToDashboard = () => {
    saveActiveDocument();
    setActiveDoc(null);
    setView('dashboard');
  };

  return (
    <MappingContext.Provider value={{
      documents,
      activeDoc,
      currentView,
      darkMode,
      setView,
      setDarkMode,
      createNewDocument,
      loadDocument,
      deleteDocument,
      duplicateDocument,
      renameDocument,
      updateActiveField,
      triggerAIGeneration,
      updateCellMapping,
      updateCellJustification,
      saveActiveDocument,
      goBackToDashboard
    }}>
      {children}
    </MappingContext.Provider>
  );
};

export const useMapping = () => {
  const context = useContext(MappingContext);
  if (context === undefined) {
    throw new Error('useMapping must be used within a MappingProvider');
  }
  return context;
};
