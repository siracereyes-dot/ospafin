
import { OSPACandidate } from '../types';

const STORAGE_KEY = 'ospa_candidates';

/**
 * GOOGLE APPS SCRIPT CONFIGURATION
 * Spreadsheet: 1hnkTyZaj7CARVlK0fhqLxk2pQ83oaQfdWqjVnEEXBFw
 * Sheet Name: ospa
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

// Added exportToCSV to fix the missing member error in CandidateList.tsx
export const exportToCSV = (candidates: OSPACandidate[]) => {
  if (!candidates || candidates.length === 0) return;

  const headers = ['ID', 'Name', 'School', 'Division', 'Level', 'Total Score', 'Timestamp'];
  const csvRows = [
    headers.join(','),
    ...candidates.map(c => [
      c.id,
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${(c.school || '').replace(/"/g, '""')}"`,
      `"${(c.division || '').replace(/"/g, '""')}"`,
      c.level,
      c.totalScore,
      c.timestamp
    ].join(','))
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ospa_candidates_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const syncToGoogleSheets = async (data: OSPACandidate | OSPACandidate[]): Promise<boolean> => {
  if (!SYNC_URL) return false;

  try {
    // We send the data using a standard POST. 
    // GAS Web Apps handle CORS redirects automatically if deployed correctly.
    const response = await fetch(SYNC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Using text/plain avoids some CORS preflight issues with GAS
      },
      body: JSON.stringify(data),
    });
    
    // Note: With GAS, even if success, response.status might be 0 or 200 depending on redirects.
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
