
import React from 'react';
import { Chapter, Subject, Group } from '../types';

interface SubjectSelectionProps {
  chapter: Chapter;
  onSelectSubject: (chapter: Chapter, subject: Subject, group: Group) => void;
  onBack: () => void;
  selectedGroup: Group;
  setSelectedGroup: (group: Group) => void;
}

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span>العودة إلى الفصول</span>
    </button>
);


const SubjectSelection: React.FC<SubjectSelectionProps> = ({ chapter, onSelectSubject, onBack, selectedGroup, setSelectedGroup }) => {
  return (
    <div>
        <BackButton onClick={onBack} />
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-200">{chapter.name}</h2>
            <p className="text-slate-400 mt-2">اختر المادة لعرض الدروس</p>
        </div>

        <div className="flex justify-center mb-8">
            <div className="bg-slate-800 p-2 rounded-lg flex gap-2 border border-slate-700">
                {Object.values(Group).map(group => (
                    <button
                        key={group}
                        onClick={() => setSelectedGroup(group)}
                        className={`px-6 py-2 rounded-md text-sm font-semibold transition-colors duration-300 ${
                            selectedGroup === group ? 'bg-cyan-500 text-slate-900' : 'bg-transparent text-slate-300 hover:bg-slate-700'
                        }`}
                    >
                        {group}
                    </button>
                ))}
            </div>
        </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {chapter.subjects.map(subject => (
          <div 
            key={subject.id} 
            onClick={() => onSelectSubject(chapter, subject, selectedGroup)}
            className="bg-slate-800 rounded-lg p-4 cursor-pointer text-center transform hover:-translate-y-1 transition-transform duration-300 ease-in-out shadow-md hover:shadow-cyan-500/20 border border-slate-700 flex items-center justify-center h-24"
          >
            <h3 className="text-md font-semibold text-white">{subject.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelection;
