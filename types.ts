
export enum Level {
  NATIONAL = 'National',
  REGIONAL = 'Regional',
  DIVISION = 'Division',
  DISTRICT = 'District',
  SCHOOL = 'School'
}

export enum Rank {
  FIRST = '1st',
  SECOND = '2nd',
  THIRD = '3rd',
  FOURTH = '4th',
  FIFTH = '5th',
  SIXTH = '6th',
  SEVENTH = '7th'
}

export interface Instance {
  id: string;
  level: Level;
  type?: string; // e.g., 'President', 'Resource Speaker', etc.
  rank?: Rank;
}

export interface OSPACandidate {
  id: string;
  name: string;
  school: string;
  division: string;
  level: 'Elementary' | 'Secondary';
  performanceRating: boolean;
  achievements: {
    individual: Instance[];
    group: Instance[];
    specialAwards: Instance[];
    publication: Instance[];
  };
  professional: {
    leadership: Instance[];
    extension: Instance[];
    innovations: Instance[];
    speakership: Instance[];
    books: Instance[];
    articles: Instance[];
  };
  interview: {
    principles: number;
    leadership: number;
    experience: number;
    growth: number;
    communication: number;
  };
  totalScore: number;
  timestamp: string;
}
