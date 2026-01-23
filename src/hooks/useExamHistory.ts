import { useState, useEffect, useCallback } from 'react';

export interface ExamAttempt {
  id: string;
  categoryId: string;
  date: string;
  correctCount: number;
  wrongCount: number;
  totalQuestions: number;
  timeSpent: number;
  passed: boolean;
  maxWrongAllowed: number;
}

const STORAGE_KEY = 'exam_history';

export const useExamHistory = () => {
  const [history, setHistory] = useState<ExamAttempt[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const saveAttempt = useCallback((attempt: Omit<ExamAttempt, 'id' | 'date'>) => {
    const newAttempt: ExamAttempt = {
      ...attempt,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };

    setHistory(prev => {
      const updated = [newAttempt, ...prev].slice(0, 50); // Keep last 50 attempts
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getHistoryByCategory = useCallback((categoryId: string) => {
    return history.filter(h => h.categoryId === categoryId);
  }, [history]);

  const getStats = useCallback(() => {
    const total = history.length;
    const passed = history.filter(h => h.passed).length;
    const failed = total - passed;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
    
    return { total, passed, failed, passRate };
  }, [history]);

  return { history, saveAttempt, clearHistory, getHistoryByCategory, getStats };
};
