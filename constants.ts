
import { Rank, Level } from './types';

// ANNEX J-1: OSPA POINT TABLES
export const OSPA_POINTS = {
  // Individual & Group (Page 7 & 8)
  CONTESTS: {
    [Level.NATIONAL]: { '1st': 20, '2nd': 19, '3rd': 18, '4th': 17, '5th': 16, '6th': 15, '7th': 14 },
    [Level.REGIONAL]: { '1st': 12, '2nd': 11, '3rd': 10 },
    [Level.DIVISION]: { '1st': 7, '2nd': 6, '3rd': 5 }
  },
  // Special Awards (Page 8 & 9)
  SPECIAL_AWARDS: {
    [Level.NATIONAL]: { '1st': 15, '2nd': 14, '3rd': 13, '4th': 12, '5th': 11, '6th': 10, '7th': 9 },
    [Level.REGIONAL]: { '1st': 7, '2nd': 6, '3rd': 5 },
    [Level.DIVISION]: { '1st': 4, '2nd': 3, '3rd': 2 }
  },
  // School Publication (Page 9)
  PUBLICATION: {
    [Level.NATIONAL]: { '1st': 13, '2nd': 12, '3rd': 11, '4th': 10, '5th': 9, '6th': 8, '7th': 7 },
    [Level.REGIONAL]: { '1st': 6, '2nd': 5, '3rd': 4 },
    [Level.DIVISION]: { '1st': 3, '2nd': 2, '3rd': 1 }
  },
  // Leadership (Page 10)
  LEADERSHIP: {
    'President': { [Level.NATIONAL]: 25, [Level.REGIONAL]: 20, [Level.DIVISION]: 15 },
    'Vice President': { [Level.NATIONAL]: 20, [Level.REGIONAL]: 15, [Level.DIVISION]: 10 },
    'Other': { [Level.NATIONAL]: 18, [Level.REGIONAL]: 12, [Level.DIVISION]: 8 }
  },
  // Extension Services (Page 10)
  EXTENSION: {
    'Chairperson': { [Level.NATIONAL]: 10, [Level.REGIONAL]: 8, [Level.DIVISION]: 6 },
    'Facilitator': { [Level.NATIONAL]: 8, [Level.REGIONAL]: 6, [Level.DIVISION]: 4 }
  },
  // Innovations (Page 10)
  INNOVATIONS: {
    [Level.NATIONAL]: 15,
    [Level.REGIONAL]: 12,
    [Level.DIVISION]: 10,
    [Level.DISTRICT]: 8,
    [Level.SCHOOL]: 6
  },
  // Speakership (Page 11) & Books (Page 11)
  TIERED_SERVICES: {
    [Level.NATIONAL]: 10,
    [Level.REGIONAL]: 7,
    [Level.DIVISION]: 5
  },
  // Articles (Page 11)
  ARTICLES: {
    [Level.NATIONAL]: 5,
    [Level.REGIONAL]: 3,
    [Level.DIVISION]: 1
  }
};

export const calculateOSPAInstance = (
  category: keyof typeof OSPA_POINTS | 'INDIVIDUAL' | 'GROUP' | 'SPECIAL' | 'PUBLICATION',
  level: Level,
  rank?: string,
  type?: string
): number => {
  if (category === 'INDIVIDUAL' || category === 'GROUP') {
    return (OSPA_POINTS.CONTESTS as any)[level]?.[rank || '1st'] || 0;
  }
  if (category === 'SPECIAL') {
    return (OSPA_POINTS.SPECIAL_AWARDS as any)[level]?.[rank || '1st'] || 0;
  }
  if (category === 'PUBLICATION') {
    return (OSPA_POINTS.PUBLICATION as any)[level]?.[rank || '1st'] || 0;
  }
  if (category === 'LEADERSHIP') {
    return (OSPA_POINTS.LEADERSHIP as any)[type || 'President']?.[level] || 0;
  }
  if (category === 'EXTENSION') {
    return (OSPA_POINTS.EXTENSION as any)[type || 'Chairperson']?.[level] || 0;
  }
  if (category === 'INNOVATIONS') {
    return (OSPA_POINTS.INNOVATIONS as any)[level] || 0;
  }
  if (category === 'TIERED_SERVICES') {
    return (OSPA_POINTS.TIERED_SERVICES as any)[level] || 0;
  }
  if (category === 'ARTICLES') {
    return (OSPA_POINTS.ARTICLES as any)[level] || 0;
  }
  return 0;
};
