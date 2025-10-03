
import React, { useState, useCallback, useMemo } from 'react';
import { AppContextProvider } from './contexts/AppContext';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Header from './components/Header';
import ChapterSelection from './components/ChapterSelection';
import SubjectSelection from './components/SubjectSelection';
import LessonList from './components/LessonList';
import { Chapter, Group, Subject } from './types';
import { CHAPTERS } from './constants';

type View = 
  | { name: 'HOME' }
  | { name: 'CHAPTER'; chapter: Chapter }
  | { name: 'SUBJECT'; chapter: Chapter; subject: Subject; group: Group }
  | { name: 'ADMIN_LOGIN' }
  | { name: 'ADMIN_DASHBOARD' };

export default function App() {
  const [view, setView] = useState<View>({ name: 'HOME' });
  const [selectedGroup, setSelectedGroup] = useState<Group>(Group.G1);

  const navigateToChapter = useCallback((chapter: Chapter) => {
    setView({ name: 'CHAPTER', chapter });
  }, []);

  const navigateToSubject = useCallback((chapter: Chapter, subject: Subject, group: Group) => {
    setView({ name: 'SUBJECT', chapter, subject, group });
  }, []);

  const navigateHome = useCallback(() => {
    setView({ name: 'HOME' });
  }, []);

  const navigateToAdminLogin = useCallback(() => {
    setView({ name: 'ADMIN_LOGIN' });
  }, []);
  
  const navigateToAdminDashboard = useCallback(() => {
    setView({ name: 'ADMIN_DASHBOARD' });
  }, []);

  const renderContent = useMemo(() => {
    switch (view.name) {
      case 'HOME':
        return <ChapterSelection onSelectChapter={navigateToChapter} />;
      case 'CHAPTER':
        return <SubjectSelection chapter={view.chapter} onSelectSubject={navigateToSubject} onBack={navigateHome} selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} />;
      case 'SUBJECT':
        return <LessonList chapter={view.chapter} subject={view.subject} group={view.group} onBack={() => navigateToChapter(view.chapter)} />;
      case 'ADMIN_LOGIN':
        return <AdminLogin onLoginSuccess={navigateToAdminDashboard} onBack={navigateHome} />;
      case 'ADMIN_DASHBOARD':
        return <AdminDashboard onLogout={navigateHome} />;
      default:
        return <ChapterSelection onSelectChapter={navigateToChapter} />;
    }
  }, [view, navigateToChapter, navigateToSubject, navigateHome, navigateToAdminDashboard, selectedGroup]);

  return (
    <AppContextProvider>
      <div className="bg-slate-900 text-white min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {renderContent}
        </main>
        <footer className="text-center py-6 border-t border-slate-700">
          <button onClick={navigateToAdminLogin} className="text-slate-400 hover:text-cyan-400 transition-colors duration-300">
            Admin Panel
          </button>
        </footer>
      </div>
    </AppContextProvider>
  );
}
