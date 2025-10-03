import React, { useState, useCallback, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { CHAPTERS } from '../constants';
import { Chapter, Subject, Lesson } from '../types';
import PdfThumbnail from './PdfThumbnail';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';


const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { loggedInGroup, addLesson, deleteLesson, logout } = useAppContext();
  const [selectedChapter, setSelectedChapter] = useState<Chapter>(CHAPTERS[0]);
  const [selectedSubject, setSelectedSubject] = useState<Subject>(CHAPTERS[0].subjects[0]);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(true);
  
  useEffect(() => {
    if (!loggedInGroup) return;

    setIsLoadingLessons(true);
    const lessonsRef = collection(db, 'lessons');
    const q = query(
        lessonsRef,
        where('group', '==', loggedInGroup),
        orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const lessonsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
        setAllLessons(lessonsData);
        setIsLoadingLessons(false);
    }, (err) => {
        console.error("Error fetching lessons:", err);
        setError('فشل في تحميل الدروس.');
        setIsLoadingLessons(false);
    });

    return () => unsubscribe();
  }, [loggedInGroup]);
  
  const getLessonsForSubject = (chapterId: string, subjectId: string) => {
    return allLessons.filter(l => l.chapterId === chapterId && l.subjectId === subjectId);
  };

  const handleChapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chapter = CHAPTERS.find(c => c.id === e.target.value)!;
    setSelectedChapter(chapter);
    setSelectedSubject(chapter.subjects[0]);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subject = selectedChapter.subjects.find(s => s.id === e.target.value)!;
    setSelectedSubject(subject);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].type !== 'application/pdf') {
        setError('يرجى اختيار ملف PDF فقط.');
        setFile(null);
        return;
      }
      if (e.target.files[0].size > 5 * 1024 * 1024) { // 5MB limit
        setError('حجم الملف يجب أن يكون أقل من 5 ميغابايت.');
        setFile(null);
        return;
      }
      setError('');
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !loggedInGroup) return;

    setIsUploading(true);
    setError('');

    try {
      await addLesson(selectedChapter.id, selectedSubject.id, loggedInGroup, file);
      setFile(null);
      const fileInput = (e.target as HTMLFormElement).querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء الرفع.');
    } finally {
        setIsUploading(false);
    }
  };
  
  const handleDelete = async (lesson: Lesson) => {
      if(window.confirm('هل أنت متأكد من حذف هذا الدرس؟')) {
          try {
            await deleteLesson(lesson);
          } catch(err) {
            console.error("Failed to delete lesson", err);
            alert("فشل حذف الدرس.");
          }
      }
  }

  const handleLogout = () => {
    logout();
    onLogout();
  };

  if (!loggedInGroup) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">لوحة التحكم - <span className="text-cyan-400">{loggedInGroup}</span></h2>
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg">
          تسجيل الخروج
        </button>
      </div>

      <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-bold mb-4">رفع درس جديد</h3>
        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-300 mb-2">الفصل</label>
            <select onChange={handleChapterChange} value={selectedChapter.id} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white">
              {CHAPTERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-300 mb-2">المادة</label>
            <select onChange={handleSubjectChange} value={selectedSubject.id} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white">
              {selectedChapter.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-300 mb-2">ملف PDF</label>
            <input type="file" accept="application/pdf" onChange={handleFileChange} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"/>
          </div>
          <button type="submit" disabled={!file || isUploading} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg disabled:bg-slate-600 disabled:cursor-not-allowed">
            {isUploading ? 'جاري الرفع...' : 'رفع'}
          </button>
        </form>
        {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">الدروس المرفوعة</h3>
        {isLoadingLessons ? <p className="text-slate-400 text-center">جاري تحميل الدروس...</p> : (
            <div className="space-y-6">
                {CHAPTERS.map(chapter => (
                    <div key={chapter.id}>
                        <h4 className="text-lg font-semibold text-cyan-400 border-b border-slate-600 pb-2 mb-3">{chapter.name}</h4>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {chapter.subjects.map(subject => {
                                const lessons = getLessonsForSubject(chapter.id, subject.id);
                                if (lessons.length === 0) return null;
                                return (
                                    <div key={subject.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                                        <h5 className="font-bold mb-2">{subject.name}</h5>
                                        <ul className="space-y-3">
                                            {lessons.map(lesson => (
                                              <li key={lesson.id} className="flex justify-between items-center bg-slate-700/50 p-2 rounded-lg">
                                                  <div className="flex items-center gap-3 overflow-hidden">
                                                      <div className="w-10 h-14 bg-slate-900 rounded-sm overflow-hidden flex-shrink-0">
                                                          <PdfThumbnail pdfUrl={lesson.pdfUrl} />
                                                      </div>
                                                      <span className="truncate text-slate-300 text-sm" title={lesson.name}>{lesson.name}</span>
                                                  </div>
                                                  <button onClick={() => handleDelete(lesson)} className="text-red-500 hover:text-red-400 p-1 flex-shrink-0">
                                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                                  </button>
                                              </li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            })}
                         </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;