
import React, { useState, useEffect } from 'react';
import CandidateList from './components/CandidateList';
import OSPAScoringForm from './components/OSPAScoringForm';
import SplashScreen from './components/SplashScreen';
import { OSPACandidate } from './types';
import * as storage from './services/storage';

const App: React.FC = () => {
  const [candidates, setCandidates] = useState<OSPACandidate[]>([]);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingCandidate, setEditingCandidate] = useState<OSPACandidate | undefined>(undefined);
  const [isSplashActive, setIsSplashActive] = useState(true);

  useEffect(() => {
    // Load data from storage
    setCandidates(storage.getCandidates());

    // Flash screen duration
    const timer = setTimeout(() => {
      setIsSplashActive(false);
    }, 2500);

    return () => clearTimeout(timer);
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
      {isSplashActive && <SplashScreen />}
      
      <div className={`transition-opacity duration-1000 ${isSplashActive ? 'opacity-0' : 'opacity-100'}`}>
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <img 
                  src="https://i.ibb.co/hxvXvtpJ/image.png" 
                  alt="Logo" 
                  className="h-10 w-auto object-contain"
                />
                <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center">
                  OSPA <span className="text-indigo-600 font-medium ml-1">Scorer</span>
                </h1>
              </div>
              
              <nav className="flex items-center space-x-6">
                 <button 
                  onClick={() => setView('list')} 
                  className={`text-sm font-bold transition-colors ${view === 'list' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  DepEd NCR
                </button>
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
    </div>
  );
};

export default App;
