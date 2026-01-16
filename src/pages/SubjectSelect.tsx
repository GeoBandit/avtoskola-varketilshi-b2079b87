import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, RotateCcw } from 'lucide-react';
import StartLogo from '@/components/StartLogo';
import { getSubjectsForVehicle } from '@/data/questions';

const SubjectSelect: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [activeSubjects, setActiveSubjects] = useState<number[]>([1, 4]);
  
  const subjects = useMemo(() => {
    return getSubjectsForVehicle(categoryId || 'b');
  }, [categoryId]);
  const handleSubjectClick = (subjectId: number) => {
    navigate(`/questions/${categoryId}/${subjectId}`);
  };

  const handleResetSubject = (e: React.MouseEvent, subjectId: number) => {
    e.stopPropagation();
    setActiveSubjects(prev => prev.filter(id => id !== subjectId));
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
          
          <StartLogo size="medium" />
          
          <div className="w-12" />
        </div>

        {/* Subject List */}
        <div className="space-y-3 animate-fade-in">
          {subjects.map((subject) => {
            const isActive = activeSubjects.includes(subject.id);
            return (
              <button
                key={subject.id}
                onClick={() => handleSubjectClick(subject.id)}
                className={`w-full flex items-center justify-between py-4 px-5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-accent text-accent-foreground' 
                    : 'bg-card border border-muted text-foreground hover:border-primary'
                }`}
              >
                <span className="text-left text-sm md:text-base font-medium">
                  {subject.name}
                </span>
                {isActive && (
                  <button
                    onClick={(e) => handleResetSubject(e, subject.id)}
                    className="p-2 rounded-lg bg-accent-foreground/20 hover:bg-accent-foreground/30"
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
