
import { OSPACandidate } from '../types';

const STORAGE_KEY = 'ospa_candidates';

export const saveCandidate = (candidate: OSPACandidate) => {
  const candidates = getCandidates();
  const index = candidates.findIndex(c => c.id === candidate.id);
  
  if (index >= 0) {
    candidates[index] = candidate;
  } else {
    candidates.push(candidate);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
  
  // Note: For actual Google Sheets integration on Vercel:
  // We would call a serverless function here that uses 'google-spreadsheet'
  // using credentials from process.env.
  console.log('Candidate saved successfully to local storage. Ready for Google Sheets syncing.');
};

export const getCandidates = (): OSPACandidate[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const deleteCandidate = (id: string) => {
  const candidates = getCandidates().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
};

export const exportToCSV = (candidates: OSPACandidate[]) => {
  if (candidates.length === 0) return;
  
  const headers = ['ID', 'Name', 'School', 'Division', 'Level', 'Total Score', 'Timestamp'];
  const rows = candidates.map(c => [
    c.id, c.name, c.school, c.division, c.level, c.totalScore.toFixed(2), c.timestamp
  ]);
  
  const csvContent = "data:text/csv;charset=utf-8," 
    + headers.join(",") + "\n"
    + rows.map(e => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "ospa_candidates_export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
