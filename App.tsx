
import React, { useState, useEffect } from 'react';
import CandidateList from './components/CandidateList';
import OSPAScoringForm from './components/OSPAScoringForm';
import { OSPACandidate } from './types';
import * as storage from './services/storage';

const App: React.FC = () => {
  const [candidates, setCandidates] = useState<OSPACandidate[]>([]);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingCandidate, setEditingCandidate] = useState<OSPACandidate | undefined>(undefined);

  useEffect(() => {
    setCandidates(storage.getCandidates());
  }, []);

  const handleAddNew = () => {
    setEditingCandidate(undefined);
    setView('form');
  };

  const handleEdit = (candidate: OSPACandidate) => {
    setEditingCandidate(candidate);
    setView('form');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this candidate?')) {
      storage.deleteCandidate(id);
      setCandidates(storage.getCandidates());
    }
  };

  const handleSave = (candidate: OSPACandidate) => {
    storage.saveCandidate(candidate);
    setCandidates(storage.getCandidates());
    setView('list');
    setEditingCandidate(undefined);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-indigo-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">OSPA <span className="text-indigo-600 font-medium">Scorer</span></h1>
              </div>
            </div>
            
            <nav className="flex items-center space-x-6">
               <button onClick={() => setView('list')} className={`text-sm font-bold ${view === 'list' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>DepEd NCR</button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {view === 'list' ? (
          <CandidateList 
            candidates={candidates} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onAddNew={handleAddNew} 
          />
        ) : (
          <OSPAScoringForm 
            candidate={editingCandidate} 
            onSave={handleSave} 
            onCancel={() => setView('list')} 
          />
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200 text-center">
        <p className="text-slate-400 text-sm font-medium">
          Official OSPA Scoring Tool • Accumulative Point Registry
        </p>
      </footer>
    </div>
  );
};

export default App;
