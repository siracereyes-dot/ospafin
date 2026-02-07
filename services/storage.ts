
import { OSPACandidate } from '../types';

const STORAGE_KEY = 'ospa_candidates';

/**
 * GOOGLE APPS SCRIPT BRIDGE
 * Your URL: https://script.google.com/macros/s/AKfycbyar3ji86tD3WubBdAq8aR_zFp-gkzhcyYFtayBuTdFZpoCxpZmyR-7B5Wpbg_9M20D/exec
 */

const SYNC_URL = 'https://script.google.com/macros/s/AKfycbyar3ji86tD3WubBdAq8aR_zFp-gkzhcyYFtayBuTdFZpoCxpZmyR-7B5Wpbg_9M20D/exec';

export const saveCandidate = (candidate: OSPACandidate) => {
  const candidates = getCandidates();
  const index = candidates.findIndex(c => c.id === candidate.id);
  
  if (index >= 0) {
    candidates[index] = candidate;
  } else {
    candidates.push(candidate);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
};

export const getCandidates = (): OSPACandidate[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const deleteCandidate = (id: string) => {
  const candidates = getCandidates().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
};

export const syncToGoogleSheets = async (candidates: OSPACandidate[]): Promise<boolean> => {
  if (!SYNC_URL) return false;

  try {
    // Note: Apps Script Web Apps require no-cors for simple browser POSTs 
    // to avoid complex CORS preflight issues with redirects.
    await fetch(SYNC_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(candidates),
    });
    
    localStorage.setItem('ospa_last_sync', new Date().toISOString());
    return true;
  } catch (error) {
    console.error('Sync failed:', error);
    return false;
  }
};

export const getLastSync = (): string | null => {
  return localStorage.getItem('ospa_last_sync');
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
  link.setAttribute("download", `ospa_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
