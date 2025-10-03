import React, { useState, useEffect } from 'react';
import { Chapter, Subject, Group, Lesson } from '../types';
import PdfThumbnail from './PdfThumbnail';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';


interface LessonListProps {
  chapter: Chapter;
  subject: Subject;
  group: Group;
  onBack: () => void;
}

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span>العودة إلى المواد</span>
    </button>
);


const LessonList: React.FC<LessonListProps> = ({ chapter, subject, group, onBack }) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const lessonsRef = collection(db, 'lessons');
    const q = query(
      lessonsRef,
      where('chapterId', '==', chapter.id),
      where('subjectId', '==', subject.id),
      where('group', '==', group),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const lessonsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
      setLessons(lessonsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching lessons:", error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [chapter.id, subject.id, group]);

  const handleDownload = (pdfUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.target = '_blank';
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  };

  return (
    <div>
        <BackButton onClick={onBack} />
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-200">{subject.name} - <span className="text-cyan-400">{group}</span></h2>
            <p className="text-slate-400 mt-2">دروس {chapter.name}</p>
        </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        {loading ? (
            <p className="text-center text-slate-400">جاري تحميل الدروس...</p>
        ) : lessons.length === 0 ? (
          <p className="text-center text-slate-400">لا توجد دروس مرفوعة لهذه المادة حتى الآن.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {lessons.map(lesson => (
              <div key={lesson.id} className="bg-slate-700/50 rounded-lg overflow-hidden flex flex-col border border-slate-600 group transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-cyan-500/20">
                <div className="relative w-full" style={{ paddingTop: '141.42%' /* A4 aspect ratio */ }}>
                    <div className="absolute top-0 left-0 w-full h-full bg-slate-900">
                        <PdfThumbnail pdfUrl={lesson.pdfUrl} />
                    </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <span className="text-sm font-medium text-slate-200 flex-grow mb-3 truncate" title={lesson.name}>{lesson.name}</span>
                  <button 
                    onClick={() => handleDownload(lesson.pdfUrl, lesson.name)}
                    className="w-full text-center bg-cyan-500 text-slate-900 font-bold py-2 px-3 rounded-lg hover:bg-cyan-400 transition-colors duration-300 text-sm"
                  >
                    تحميل
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonList;