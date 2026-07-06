import React from 'react';
import { MappingProvider, useMapping } from './context/MappingContext';
import { Dashboard } from './components/Dashboard';
import { MappingForm } from './components/MappingForm';
import { MappingTable } from './components/MappingTable';

const AppContent: React.FC = () => {
  const { currentView } = useMapping();

  switch (currentView) {
    case 'dashboard':
      return <Dashboard />;
    case 'form':
      return <MappingForm />;
    case 'table':
      return <MappingTable />;
    default:
      return <Dashboard />;
  }
};

const App: React.FC = () => {
  return (
    <MappingProvider>
      <AppContent />
    </MappingProvider>
  );
};

export default App;
