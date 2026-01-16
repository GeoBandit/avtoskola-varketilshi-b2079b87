import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import StartLogo from '@/components/StartLogo';
import { generateQuestionsForSubject, getAllQuestions, subjects } from '@/data/questions';

const Questions: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId, subjectId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const questions = useMemo(() => {
    if (subjectId) {
      return generateQuestionsForSubject(parseInt(subjectId), subjects.find(s => s.id === parseInt(subjectId))?.questionCount || 30);
    }
    return getAllQuestions();
  }, [subjectId]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    if (answerIndex === currentQuestion.correctAnswer) {
      setCorrectCount(prev => prev + 1);
    } else {
      setWrongCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelectedAnswer(null);
    }
  };

  const getAnswerClass = (index: number) => {
    if (selectedAnswer === null) return 'card-answer';
    if (index === currentQuestion.correctAnswer) return 'card-answer card-answer-correct';
    if (index === selectedAnswer && index !== currentQuestion.correctAnswer) return 'card-answer card-answer-wrong';
    return 'card-answer opacity-50';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-black/30 py-2">
        <div className="h-12" />
      </header>

      {/* Content */}
      <div className="flex-1 bg-app-navy/90 px-4 py-6 flex flex-col">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-white p-2"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <div className="text-white font-medium">
            {currentIndex + 1}/{totalQuestions}
          </div>
          
          <StartLogo size="small" />
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-primary font-bold">{correctCount}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-destructive font-bold">{wrongCount}</span>
          </div>
        </div>

        {/* Question */}
        <div className="question-box mb-6 animate-fade-in">
          <p className="text-foreground text-base md:text-lg leading-relaxed">
            {currentQuestion.question}
          </p>
        </div>

        {/* Answers */}
        <div className="space-y-3 flex-1 animate-slide-in">
          {currentQuestion.answers.map((answer, index) => {
            
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={getAnswerClass(index)}
                disabled={selectedAnswer !== null}
              >
                {answer}
              </button>
            );
          })}
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-muted mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="btn-nav disabled:opacity-30"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button className="p-3 rounded-full bg-accent text-accent-foreground">
            <Info className="w-6 h-6" />
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentIndex === totalQuestions - 1}
            className="btn-nav disabled:opacity-30"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Questions;
