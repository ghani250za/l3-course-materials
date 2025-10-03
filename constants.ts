
import { Chapter, Group } from './types';

export const SUBJECTS_LIST = [
  { id: 'civ', name: 'CIV' },
  { id: 'mrs', name: 'MRS' },
  { id: 'didactique', name: 'Didactique' },
  { id: 'litterature', name: 'Littérature' },
  { id: 'ceo', name: 'CEO' },
  { id: 'atelier', name: 'Atelier' },
  { id: 'linguistique', name: 'Linguistique' },
  { id: 'langue-de-spe', name: 'Langue de spé' },
  { id: 'traduction', name: 'Traduction' },
  { id: 'entrepreneuriat', name: 'Entrepreneuriat' },
];

export const CHAPTERS: Chapter[] = [
  {
    id: 'chapter5',
    name: 'الفصل الخامس',
    subjects: SUBJECTS_LIST,
  },
  {
    id: 'chapter6',
    name: 'الفصل السادس',
    subjects: SUBJECTS_LIST,
  },
];

// In a real application, these would be stored securely on a server.
export const ADMIN_PASSWORDS: Record<Group, string> = {
  [Group.G1]: 'adminG1pass',
  [Group.G2]: 'adminG2pass',
  [Group.G3]: 'adminG3pass',
};
