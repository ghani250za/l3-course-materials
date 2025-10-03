import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Group, Lesson } from '../types';
import { ADMIN_PASSWORDS } from '../constants';
import { db, storage } from '../firebase';
import { collection, addDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';


interface AppContextType {
  loggedInGroup: Group | null;
  login: (group: Group, password: string) => boolean;
  logout: () => void;
  addLesson: (chapterId: string, subjectId: string, group: Group, file: File) => Promise<void>;
  deleteLesson: (lesson: Lesson) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_AUTH = 'l3AuthGroup';

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loggedInGroup, setLoggedInGroup] = useState<Group | null>(null);

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem(LOCAL_STORAGE_KEY_AUTH) as Group | null;
      if(storedAuth && Object.values(Group).includes(storedAuth)){
        setLoggedInGroup(storedAuth);
      }
    } catch (error) {
      console.error("Failed to load auth from local storage", error);
    }
  }, []);

  const login = useCallback((group: Group, password: string): boolean => {
    if (ADMIN_PASSWORDS[group] === password) {
      setLoggedInGroup(group);
      localStorage.setItem(LOCAL_STORAGE_KEY_AUTH, group);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setLoggedInGroup(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY_AUTH);
  }, []);

  const addLesson = useCallback(async (chapterId: string, subjectId: string, group: Group, file: File) => {
    if (!file) throw new Error("File is required.");
    
    const storagePath = `lessons/${chapterId}/${subjectId}/${group}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, storagePath);
    
    await uploadBytes(storageRef, file);
    const pdfUrl = await getDownloadURL(storageRef);
    
    await addDoc(collection(db, "lessons"), {
        name: file.name,
        pdfUrl,
        storagePath,
        chapterId,
        subjectId,
        group,
        createdAt: serverTimestamp()
    });
  }, []);

  const deleteLesson = useCallback(async (lesson: Lesson) => {
    // Delete from Firestore
    await deleteDoc(doc(db, "lessons", lesson.id));
    
    // Delete from Storage
    const storageRef = ref(storage, lesson.storagePath);
    await deleteObject(storageRef);
  }, []);
  

  return (
    <AppContext.Provider value={{ loggedInGroup, login, logout, addLesson, deleteLesson }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
