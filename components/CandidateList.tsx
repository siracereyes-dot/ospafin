
import React from 'react';
import { OSPACandidate } from '../types';
import { exportToCSV } from '../services/storage';

interface Props {
  candidates: OSPACandidate[];
  onEdit: (candidate: OSPACandidate) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

const CandidateList: React.FC<Props> = ({ candidates, onEdit, onDelete, onAddNew }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">OSPA Candidates</h2>
          <p className="text-slate-500 text-sm">Reviewing {candidates.length} candidate assessments</p>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={() => exportToCSV(candidates)}
            className="hidden md:flex items-center px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50"
          >
            Export to Sheets/CSV
          </button>
          <button 
            onClick={onAddNew}
            className="flex items-center px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition-all active:scale-95"
          >
            <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Add Candidate
          </button>
        </div>
      </div>

      {candidates.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm">
          <div className="max-w-xs mx-auto space-y-3">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <p className="text-slate-400 font-medium">No candidates scored yet.</p>
            <button onClick={onAddNew} className="text-indigo-600 text-sm font-bold hover:underline">Begin scoring a candidate</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map(candidate => (
            <div key={candidate.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 overflow-hidden transition-all group">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${candidate.level === 'Secondary' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {candidate.level}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2 truncate">{candidate.name}</h3>
                    <p className="text-xs text-slate-500 truncate">{candidate.school} • {candidate.division}</p>
                  </div>
                  <div className="bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                    <span className="text-lg font-black text-indigo-700">{candidate.totalScore}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Status</span>
                    <span className="text-emerald-500 font-bold uppercase">Scored</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-indigo-600 h-full" style={{ width: `${candidate.totalScore}%` }}></div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onEdit(candidate)}
                    className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold py-2 rounded-lg border border-slate-200 transition-colors"
                  >
                    Edit Scores
                  </button>
                  <button 
                    onClick={() => onDelete(candidate.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Candidate"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
