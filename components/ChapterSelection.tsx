
import React from 'react';
import { Chapter } from '../types';
import { CHAPTERS } from '../constants';

interface ChapterSelectionProps {
  onSelectChapter: (chapter: Chapter) => void;
}

const ChapterCard: React.FC<{ chapter: Chapter, onClick: () => void }> = ({ chapter, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-slate-800 rounded-lg p-8 cursor-pointer transform hover:-translate-y-2 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-cyan-500/20 border border-slate-700"
  >
    <h3 className="text-2xl font-bold text-center text-white">{chapter.name}</h3>
  </div>
);

const ChapterSelection: React.FC<ChapterSelectionProps> = ({ onSelectChapter }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-8 text-slate-200">اختر الفصل الدراسي</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {CHAPTERS.map(chapter => (
          <ChapterCard key={chapter.id} chapter={chapter} onClick={() => onSelectChapter(chapter)} />
        ))}
      </div>
    </div>
  );
};

export default ChapterSelection;
