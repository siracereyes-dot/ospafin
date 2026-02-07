
import React, { useState, useEffect } from 'react';
import { OSPACandidate } from '../types';
import { exportToCSV, syncToGoogleSheets, getLastSync } from '../services/storage';

interface Props {
  candidates: OSPACandidate[];
  onEdit: (candidate: OSPACandidate) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

const CandidateList: React.FC<Props> = ({ candidates, onEdit, onDelete, onAddNew }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setLastSync(getLastSync());
  }, []);

  const handleSync = async () => {
    if (candidates.length === 0) return;
    setIsSyncing(true);
    const success = await syncToGoogleSheets(candidates);
    setIsSyncing(false);
    
    if (success) {
      setLastSync(new Date().toISOString());
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } else {
      alert("Note: To sync with Google Sheets, you must deploy the Google Apps Script Web App and add its URL to storage.ts. Currently exporting locally instead.");
      exportToCSV(candidates);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-black uppercase tracking-widest">Database Synced Successfully</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">OSPA Dashboard</h2>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-slate-500 text-sm font-medium">Registry of {candidates.length} Assessments</p>
            {lastSync && (
              <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-1 rounded-full font-black uppercase tracking-tighter">
                Last Sync: {new Date(lastSync).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleSync}
            disabled={isSyncing || candidates.length === 0}
            className={`flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-sm border ${
              isSyncing 
              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-wait' 
              : 'bg-white text-indigo-600 border-indigo-100 hover:bg-indigo-50 active:scale-95'
            }`}
          >
            <svg className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {isSyncing ? 'Synchronizing...' : 'Sync to Cloud'}
          </button>

          <button 
            onClick={onAddNew}
            className="flex items-center px-8 py-3 text-xs font-black text-white bg-slate-900 rounded-xl shadow-xl hover:bg-indigo-600 transition-all active:scale-95 uppercase tracking-widest"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            New Nominee
          </button>
        </div>
      </div>

      {candidates.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-sm">
          <div className="max-w-xs mx-auto space-y-6">
            <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Registry Empty</p>
              <p className="text-slate-400 text-sm mt-1">Start by scoring your first candidate.</p>
            </div>
            <button onClick={onAddNew} className="bg-indigo-600/10 text-indigo-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Begin Assessment</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {candidates.map(candidate => (
            <div key={candidate.id} className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl border border-slate-100 overflow-hidden transition-all group relative">
              <div className="absolute top-6 right-6">
                 <div className="bg-indigo-50 text-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner border border-indigo-100/50">
                   {candidate.totalScore}
                 </div>
              </div>
              
              <div className="p-8">
                <div className="mb-6">
                  <span className={`px-3 py-1 text-[9px] font-black rounded-lg uppercase tracking-[0.15em] ${candidate.level === 'Secondary' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {candidate.level}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-4 leading-tight truncate pr-12">{candidate.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">{candidate.school}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-end text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <span>Performance Rating</span>
                    <span className={candidate.performanceRating ? "text-emerald-500" : "text-amber-500"}>
                      {candidate.performanceRating ? "Qualified" : "Review Needed"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5">
                    <div className="bg-indigo-600 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(candidate.totalScore, 100)}%` }}></div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                  <button 
                    onClick={() => onEdit(candidate)}
                    className="flex-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                  >
                    Edit Assessment
                  </button>
                  <button 
                    onClick={() => onDelete(candidate.id)}
                    className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100"
                    title="Delete Candidate"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateList;
