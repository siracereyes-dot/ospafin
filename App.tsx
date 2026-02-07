
import React, { useState, useEffect } from 'react';
import OSPAScoringForm from './components/OSPAScoringForm';
import SplashScreen from './components/SplashScreen';
import { OSPACandidate } from './types';
import * as storage from './services/storage';

const App: React.FC = () => {
  const [isSplashActive, setIsSplashActive] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [syncError, setSyncError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashActive(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = async (candidate: OSPACandidate) => {
    setSyncError(false);
    
    // 1. Save locally for backup
    storage.saveCandidate(candidate);
    
    // 2. Sync to Cloud (Google Sheets)
    // We send the current candidate for direct appending to the database
    const success = await storage.syncToGoogleSheets(candidate);
    
    if (success) {
      setIsSaved(true);
    } else {
      setSyncError(true);
      // Even if cloud fails, we show "saved" locally but notify user
      setIsSaved(true); 
    }
  };

  const handleNewNomination = () => {
    setIsSaved(false);
    setSyncError(false);
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
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9A5rNpllgwPRmxnmivFoeU4z-9XGBm8yK5Q&s" 
                  alt="Logo" 
                  referrerPolicy="no-referrer"
                  className="h-10 w-auto object-contain"
                />
                <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center">
                  OSPA <span className="text-indigo-600 font-medium ml-1">Scorer</span>
                </h1>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${syncError ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {syncError ? 'Sync Deferred' : 'Database Connected'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {isSaved ? (
            <div className="max-w-xl mx-auto mt-20 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-inner border ${syncError ? 'bg-amber-50 text-amber-500 border-amber-100' : 'bg-emerald-50 text-emerald-500 border-emerald-100'}`}>
                {syncError ? (
                   <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                ) : (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                )}
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900">{syncError ? 'Saved Locally' : 'Assessment Synced'}</h2>
                <p className="text-slate-500 font-medium">
                  {syncError 
                    ? "Data stored on this device. Please check your internet or Google Apps Script deployment to sync to the Cloud." 
                    : "The nomination data has been successfully pushed to the Google Sheet (ospa)."}
                </p>
              </div>
              <button 
                onClick={handleNewNomination}
                className="bg-slate-900 text-white px-10 py-5 rounded-[1.8rem] font-black shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 text-sm uppercase tracking-widest"
              >
                Start New Nomination
              </button>
            </div>
          ) : (
            <OSPAScoringForm 
              onSave={handleSave} 
              onCancel={() => {}} 
            />
          )}
        </main>

        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200 text-center">
          <p className="text-slate-400 text-sm font-medium">
            Official OSPA Scoring Tool • Spreadsheet ID: 1hnk...EEXBFw
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
