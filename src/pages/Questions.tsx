import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Info, Home, Trophy, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import avtoskolaLogo from '@/assets/avtoskola-logo.png';
import { getQuestionsForSubject, getQuestionsForVehicle } from '@/data/questions';
import { useSubjectProgress } from '@/hooks/useSubjectProgress';

const Questions: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId, subjectId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const { updateProgress } = useSubjectProgress(categoryId || 'b');

  const questions = useMemo(() => {
    const vehicleId = categoryId || 'b';
    if (subjectId) {
      return getQuestionsForSubject(vehicleId, parseInt(subjectId));
    }
    return getQuestionsForVehicle(vehicleId);
  }, [categoryId, subjectId]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  // Update progress when answering questions
  useEffect(() => {
    if (subjectId && selectedAnswer !== null) {
      updateProgress(parseInt(subjectId), currentIndex, totalQuestions, wrongCount);
    }
  }, [currentIndex, selectedAnswer, wrongCount, subjectId, totalQuestions, updateProgress]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    } else {
      setWrongCount(prev => prev + 1);
    }

    // Check if this was the last question
    if (currentIndex === totalQuestions - 1) {
      setTimeout(() => {
        setIsCompleted(true);
      }, 800);
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

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setCorrectCount(0);
    setWrongCount(0);
    setIsCompleted(false);
  };

  const getAnswerClass = (index: number) => {
    if (selectedAnswer === null) return 'card-answer';
    if (index === currentQuestion.correctAnswer) return 'card-answer card-answer-correct';
    if (index === selectedAnswer && index !== currentQuestion.correctAnswer) return 'card-answer card-answer-wrong';
    return 'card-answer opacity-50';
  };

  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
  const isPerfect = wrongCount === 0;

  // Completion Screen
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="bg-black/30 py-2">
          <div className="h-12" />
        </header>

        <div className="flex-1 bg-app-navy/90 px-4 py-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-md text-center animate-fade-in">
            {/* Trophy Icon */}
            <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
              isPerfect ? 'bg-success/20' : 'bg-accent/20'
            }`}>
              <Trophy className={`w-12 h-12 ${isPerfect ? 'text-success' : 'text-accent'}`} />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {isPerfect ? 'შესანიშნავი!' : 'დასრულებულია!'}
            </h1>
            <p className="text-muted-foreground mb-8">
              {isPerfect ? 'ყველა პასუხი სწორია!' : 'თქვენ დაასრულეთ ეს თემა'}
            </p>

            {/* Score Circle */}
            <div className="relative mx-auto w-40 h-40 mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${scorePercentage * 4.4} 440`}
                  className={isPerfect ? 'text-success' : 'text-accent'}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-foreground">{scorePercentage}%</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-success" />
                <span className="text-foreground font-medium">{correctCount} სწორი</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-6 h-6 text-destructive" />
                <span className="text-foreground font-medium">{wrongCount} შეცდომა</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full btn-menu flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                თავიდან დაწყება
              </button>
              <button
                onClick={() => navigate(`/subject/${categoryId}`)}
                className="w-full btn-menu flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                თემების სია
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full btn-menu flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                მთავარი
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg bg-card hover:bg-muted transition-colors"
          >
            <Home className="w-5 h-5 text-foreground" />
          </button>
          
          <div className="text-white font-medium">
            {currentIndex + 1}/{totalQuestions}
          </div>
          
          <img src={avtoskolaLogo} alt="ავტოსკოლა ვარკეთილში" className="h-10 w-auto" />
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-success font-bold">{correctCount}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-destructive font-bold">{wrongCount}</span>
          </div>
        </div>

        {/* Question Image */}
        {currentQuestion.image && (
          <div className="mb-4 animate-fade-in">
            <img 
              src={currentQuestion.image} 
              alt="კითხვის სურათი"
              className="w-full max-h-48 object-contain rounded-lg bg-white/10"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Question */}
        <div className="question-box mb-6 animate-fade-in">
          <p className="text-foreground text-base md:text-lg leading-relaxed">
            {currentQuestion.question}
          </p>
        </div>

        {/* Answers */}
        <div className="space-y-3 animate-slide-in">
          {currentQuestion.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={getAnswerClass(index)}
              disabled={selectedAnswer !== null}
            >
              {answer}
            </button>
          ))}
        </div>

        {/* Explanation */}
        {selectedAnswer !== null && currentQuestion.explanation && (
          <div className="mt-4 p-4 rounded-lg bg-accent/20 border border-accent/30 animate-fade-in">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-accent-foreground">განმარტება: </span>
              {currentQuestion.explanation}
            </p>
          </div>
        )}

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
