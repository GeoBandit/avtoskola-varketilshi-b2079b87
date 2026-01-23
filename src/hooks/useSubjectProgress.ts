import { useState, useEffect, useCallback } from 'react';

export interface SubjectProgress {
  status: 'not_started' | 'in_progress' | 'completed';
  currentIndex: number;
  totalQuestions: number;
  wrongCount: number;
}

interface ProgressData {
  [key: string]: SubjectProgress;
}

const STORAGE_KEY = 'subject_progress';

const getStorageKey = (categoryId: string, subjectId: number) => 
  `${categoryId}_${subjectId}`;

export const useSubjectProgress = (categoryId: string) => {
  const [progress, setProgress] = useState<ProgressData>({});

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
      } catch {
        setProgress({});
      }
    }
  }, []);

  const getSubjectProgress = useCallback((subjectId: number): SubjectProgress | null => {
    const key = getStorageKey(categoryId, subjectId);
    return progress[key] || null;
  }, [categoryId, progress]);

  const updateProgress = useCallback((
    subjectId: number, 
    currentIndex: number, 
    totalQuestions: number, 
    wrongCount: number
  ) => {
    const key = getStorageKey(categoryId, subjectId);
    const isCompleted = currentIndex >= totalQuestions - 1;
    const isCompletedPerfectly = isCompleted && wrongCount === 0;
    
    const newProgress: SubjectProgress = {
      status: isCompletedPerfectly ? 'completed' : isCompleted ? 'not_started' : 'in_progress',
      currentIndex,
      totalQuestions,
      wrongCount
    };

    setProgress(prev => {
      const updated = { ...prev, [key]: newProgress };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, [categoryId]);

  const resetProgress = useCallback((subjectId: number) => {
    const key = getStorageKey(categoryId, subjectId);
    setProgress(prev => {
      const updated = { ...prev };
      delete updated[key];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, [categoryId]);

  return { getSubjectProgress, updateProgress, resetProgress };
};
