export enum Group {
  G1 = 'G1',
  G2 = 'G2',
  G3 = 'G3',
}

export interface Lesson {
  id: string;
  name: string;
  pdfUrl: string;
  storagePath: string;
  chapterId: string;
  subjectId: string;
  group: Group;
  createdAt: any;
}

export interface Subject {
  id: string;
  name: string;
}

export interface Chapter {
  id: string;
  name: string;
  subjects: Subject[];
}
