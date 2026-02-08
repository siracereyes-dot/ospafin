
import { OSPACandidate } from '../types';
import { calculateOSPAInstance } from '../constants';

const STORAGE_KEY = 'ospa_candidates';

/**
 * GOOGLE APPS SCRIPT CONFIGURATION
 * Spreadsheet ID: 1B4cEi_jta_LQhV7mewsul2GhCLNnV1HqrPKjjJKPrgk
 * Sheet Name: ospa
 */
const SYNC_URL = 'https://script.google.com/macros/s/AKfycbyar3ji86tD3WubBdAq8aR_zFp-gkzhcyYFtayBuTdFZpoCxpZmyR-7B5Wpbg_9M20D/exec';
const AUTH_TOKEN = 'OSPA-SECRET-2025-NCR';

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

/**
 * Maps the internal candidate object to the JSON structure 
 * expected by the GAS doPost(e) script with authorization.
 */
const mapCandidateToSheetData = (c: OSPACandidate) => {
  const individual = c.achievements.individual.reduce((s, i) => s + calculateOSPAInstance('INDIVIDUAL', i.level, i.rank), 0);
  const group = c.achievements.group.reduce((s, i) => s + calculateOSPAInstance('GROUP', i.level, i.rank), 0);
  const special = c.achievements.specialAwards.reduce((s, i) => s + calculateOSPAInstance('SPECIAL', i.level, i.rank), 0);
  const pubLead = c.achievements.publication.reduce((s, i) => s + calculateOSPAInstance('PUBLICATION', i.level, i.rank), 0);
  
  const guildLead = c.professional.leadership.reduce((s, i) => s + calculateOSPAInstance('LEADERSHIP', i.level, undefined, i.type), 0);
  const community = c.professional.extension.reduce((s, i) => s + calculateOSPAInstance('EXTENSION', i.level, undefined, i.type), 0);
  const innovation = c.professional.innovations.reduce((s, i) => s + calculateOSPAInstance('INNOVATIONS', i.level), 0);
  const trainings = c.professional.speakership.reduce((s, i) => s + calculateOSPAInstance('TIERED_SERVICES', i.level), 0);
  
  const published = 
    c.professional.books.reduce((s, i) => s + calculateOSPAInstance('TIERED_SERVICES', i.level), 0) +
    c.professional.articles.reduce((s, i) => s + calculateOSPAInstance('ARTICLES', i.level), 0);

  const interviewTotal = Object.values(c.interview).reduce((s, v) => s + v, 0);

  return {
    authToken: AUTH_TOKEN, // Included for server-side verification
    name: c.name,
    school: c.school,
    division: c.division,
    academic: c.performanceRating ? "Qualified (VS)" : "Not Qualified",
    individual: individual,
    group: group,
    special: special,
    pubLead: pubLead,
    guildLead: guildLead,
    innovation: innovation,
    community: community,
    published: published,
    trainings: trainings,
    interviewTotal: interviewTotal,
    grandTotal: c.totalScore
  };
};

/**
 * Synchronizes candidates to Google Sheets using a secure POST request.
 */
export const syncToGoogleSheets = async (candidateData: OSPACandidate | OSPACandidate[]): Promise<boolean> => {
  if (!SYNC_URL) return false;

  try {
    const candidates = Array.isArray(candidateData) ? candidateData : [candidateData];
    
    for (const candidate of candidates) {
      const payload = mapCandidateToSheetData(candidate);
      
      await fetch(SYNC_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });
    }
    
    localStorage.setItem('ospa_last_sync', new Date().toISOString());
    return true;
  } catch (error) {
    console.error('Secure sync failed:', error);
    return false;
  }
};

export const getLastSync = (): string | null => {
  return localStorage.getItem('ospa_last_sync');
};

export const exportToCSV = (candidates: OSPACandidate[]) => {
  if (!candidates || candidates.length === 0) return;

  const headers = ['Name', 'School', 'Division', 'Academic', 'Individual', 'Group', 'Special', 'Pub Lead', 'Guild Lead', 'Innovation', 'Community', 'Published', 'Trainings', 'Interview Total', 'Grand Total'];
  const csvRows = [
    headers.join(','),
    ...candidates.map(c => {
      const data = mapCandidateToSheetData(c);
      return [
        `"${data.name.replace(/"/g, '""')}"`,
        `"${data.school.replace(/"/g, '""')}"`,
        `"${data.division.replace(/"/g, '""')}"`,
        data.academic,
        data.individual,
        data.group,
        data.special,
        data.pubLead,
        data.guildLead,
        data.innovation,
        data.community,
        data.published,
        data.trainings,
        data.interviewTotal,
        data.grandTotal
      ].join(',');
    })
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ospa_backup_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
