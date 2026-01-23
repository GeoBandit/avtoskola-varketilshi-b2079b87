import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, RotateCcw, Check } from 'lucide-react';
import avtoskolaLogo from '@/assets/avtoskola-logo.png';
import { getSubjectsForVehicle } from '@/data/questions';
import { useSubjectProgress } from '@/hooks/useSubjectProgress';

const SubjectSelect: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { getSubjectProgress, resetProgress } = useSubjectProgress(categoryId || 'b');
  
  const subjects = useMemo(() => {
    return getSubjectsForVehicle(categoryId || 'b');
  }, [categoryId]);

  const handleSubjectClick = (subjectId: number) => {
    navigate(`/questions/${categoryId}/${subjectId}`);
  };

  const handleResetSubject = (e: React.MouseEvent, subjectId: number) => {
    e.stopPropagation();
    resetProgress(subjectId);
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

        {/* Subject List */}
        <div className="space-y-3 animate-fade-in">
          {subjects.map((subject) => {
            const progress = getSubjectProgress(subject.id);
            const isInProgress = progress?.status === 'in_progress';
            const isCompleted = progress?.status === 'completed';
            
            return (
              <button
                key={subject.id}
                onClick={() => handleSubjectClick(subject.id)}
                className={`w-full flex items-center justify-between py-4 px-5 rounded-xl transition-all duration-200 ${
                  isCompleted
                    ? 'bg-success/20 border-2 border-success text-foreground'
                    : isInProgress 
                      ? 'bg-accent text-accent-foreground' 
                      : 'bg-card border border-muted text-foreground hover:border-primary'
                }`}
              >
                <span className="text-left text-sm md:text-base font-medium flex items-center gap-3">
                  {isCompleted && (
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-success text-white">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                  {subject.name}
                </span>
                {(isInProgress || isCompleted) && (
                  <button
                    onClick={(e) => handleResetSubject(e, subject.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isCompleted 
                        ? 'bg-success/30 hover:bg-success/40' 
                        : 'bg-accent-foreground/20 hover:bg-accent-foreground/30'
                    }`}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubjectSelect;
