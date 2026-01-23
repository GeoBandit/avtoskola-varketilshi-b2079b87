import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Trophy, XCircle, CheckCircle, Trash2, Clock } from 'lucide-react';
import avtoskolaLogo from '@/assets/avtoskola-logo.png';
import { useExamHistory, ExamAttempt } from '@/hooks/useExamHistory';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const ExamHistory: React.FC = () => {
  const navigate = useNavigate();
  const { history, clearHistory, getStats } = useExamHistory();
  const stats = getStats();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ka-GE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-black/30 py-2">
        <div className="h-12" />
      </header>

      {/* Content */}
      <div className="flex-1 bg-app-navy/90 px-4 py-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-white p-2"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <img src={avtoskolaLogo} alt="ავტოსკოლა ვარკეთილში" className="h-12 w-auto" />
          
          <div className="w-12" />
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="bg-card rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground">სულ</p>
          </div>
          <div className="bg-card rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-success">{stats.passed}</p>
            <p className="text-xs text-muted-foreground">ჩაბარებული</p>
          </div>
          <div className="bg-card rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-destructive">{stats.failed}</p>
            <p className="text-xs text-muted-foreground">ჩავარდნილი</p>
          </div>
          <div className="bg-card rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-accent">{stats.passRate}%</p>
            <p className="text-xs text-muted-foreground">წარმატება</p>
          </div>
        </div>

        {/* Clear History Button */}
        {history.length > 0 && (
          <div className="flex justify-end mb-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/20 text-destructive text-sm hover:bg-destructive/30 transition-colors">
                  <Trash2 className="w-4 h-4" />
                  ისტორიის წაშლა
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-muted">
                <AlertDialogHeader>
                  <AlertDialogTitle>ისტორიის წაშლა?</AlertDialogTitle>
                  <AlertDialogDescription>
                    დარწმუნებული ხართ, რომ გსურთ ყველა გამოცდის ისტორიის წაშლა? ეს მოქმედება შეუქცევადია.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-muted hover:bg-muted/80">გაუქმება</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={clearHistory}
                    className="bg-destructive hover:bg-destructive/80"
                  >
                    წაშლა
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {/* History List */}
        <div className="space-y-3 animate-fade-in">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">ჯერ არ გაქვთ გამოცდის ისტორია</p>
              <p className="text-sm text-muted-foreground mt-2">გამოცდის ჩაბარების შემდეგ შედეგები აქ გამოჩნდება</p>
            </div>
          ) : (
            history.map((attempt) => (
              <ExamAttemptCard key={attempt.id} attempt={attempt} formatDate={formatDate} formatTime={formatTime} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const ExamAttemptCard: React.FC<{
  attempt: ExamAttempt;
  formatDate: (date: string) => string;
  formatTime: (seconds: number) => string;
}> = ({ attempt, formatDate, formatTime }) => {
  const scorePercent = Math.round((attempt.correctCount / attempt.totalQuestions) * 100);
  
  return (
    <div className={`p-4 rounded-xl border-2 ${
      attempt.passed 
        ? 'bg-success/10 border-success/50' 
        : 'bg-destructive/10 border-destructive/50'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {attempt.passed ? (
            <CheckCircle className="w-5 h-5 text-success" />
          ) : (
            <XCircle className="w-5 h-5 text-destructive" />
          )}
          <span className={`font-bold ${attempt.passed ? 'text-success' : 'text-destructive'}`}>
            {attempt.passed ? 'ჩაბარებული' : 'ჩავარდნილი'}
          </span>
          <span className="px-2 py-0.5 rounded bg-muted text-xs font-medium">
            {attempt.categoryId.toUpperCase()}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">{formatDate(attempt.date)}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{scorePercent}%</p>
            <p className="text-xs text-muted-foreground">შედეგი</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-success">{attempt.correctCount}</p>
            <p className="text-xs text-muted-foreground">სწორი</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-destructive">{attempt.wrongCount}</p>
            <p className="text-xs text-muted-foreground">შეცდომა</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{formatTime(attempt.timeSpent)}</span>
        </div>
      </div>
    </div>
  );
};

export default ExamHistory;
