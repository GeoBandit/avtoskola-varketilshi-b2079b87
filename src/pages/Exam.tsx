import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home, Trophy, RotateCcw, CheckCircle, XCircle, Clock, History } from 'lucide-react';
import { getQuestionsForVehicle } from '@/data/questions';
import { useExamHistory } from '@/hooks/useExamHistory';
import CachedImage from '@/components/CachedImage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const EXAM_TIME = 30 * 60; // 30 minutes in seconds
const EXAM_QUESTION_COUNT = 30;

// Wrong answer limits by category
const getMaxWrongAnswers = (category: string): number => {
  switch (category) {
    case 'b':
    case 'b1':
    case 'ts':
      return 3; // B, B1, and TS categories allow max 3 wrong answers
    case 'c':
    case 'd':
      return 4; // C and D categories allow max 4 wrong answers
    default:
      return 3;
  }
};

const Exam: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(EXAM_TIME);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showFailDialog, setShowFailDialog] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalTime, setFinalTime] = useState(0);
  const hasSavedResult = useRef(false);
  
  const { saveAttempt } = useExamHistory();
  const maxWrongAnswers = getMaxWrongAnswers(categoryId || 'b');

  const questions = useMemo(() => {
    const allQuestions = getQuestionsForVehicle(categoryId || 'b');
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, EXAM_QUESTION_COUNT);
  }, [categoryId]);

  useEffect(() => {
    setAnswers(new Array(questions.length).fill(null));
  }, [questions.length]);

  useEffect(() => {
    if (isCompleted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          setFinalTime(EXAM_TIME);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    if (answers[currentIndex] !== null) return;
    
    const newAnswers = [...answers];
    newAnswers[currentIndex] = answerIndex;
    setAnswers(newAnswers);
    setSelectedAnswer(answerIndex);

    let newCorrectCount = correctCount;
    let newWrongCount = wrongCount;

    if (answerIndex === currentQuestion.correctAnswer) {
      newCorrectCount = correctCount + 1;
      setCorrectCount(newCorrectCount);
    } else {
      newWrongCount = wrongCount + 1;
      setWrongCount(newWrongCount);
      
      // Check if exceeded max wrong answers for this category
      if (newWrongCount > maxWrongAnswers) {
        setFinalTime(EXAM_TIME - timeLeft);
        setIsCompleted(true);
        setShowFailDialog(true);
        return; // Don't auto-advance if failed
      }
    }

    // Check if this was the last question
    const isLastQuestion = currentIndex === questions.length - 1;
    if (isLastQuestion) {
      setTimeout(() => {
        setFinalTime(EXAM_TIME - timeLeft);
        setIsCompleted(true);
      }, 800);
      return;
    }

    // Auto advance to next question after a brief delay
    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(newAnswers[currentIndex + 1]);
      }, 800);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(answers[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelectedAnswer(answers[currentIndex - 1]);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const getAnswerClass = (index: number) => {
    const currentAnswer = answers[currentIndex];
    if (currentAnswer === null) return 'card-answer';
    if (index === currentQuestion.correctAnswer) return 'card-answer card-answer-correct';
    if (index === currentAnswer && index !== currentQuestion.correctAnswer) return 'card-answer card-answer-wrong';
    return 'card-answer opacity-50';
  };

  const scorePercentage = Math.round((correctCount / questions.length) * 100);
  const isPassed = wrongCount <= maxWrongAnswers;

  // Save exam result when completed
  useEffect(() => {
    if (isCompleted && !hasSavedResult.current) {
      hasSavedResult.current = true;
      saveAttempt({
        categoryId: categoryId || 'b',
        correctCount,
        wrongCount,
        totalQuestions: questions.length,
        timeSpent: finalTime,
        passed: wrongCount <= maxWrongAnswers,
        maxWrongAllowed: maxWrongAnswers,
      });
    }
  }, [isCompleted, categoryId, correctCount, wrongCount, questions.length, finalTime, maxWrongAnswers, saveAttempt]);

  // Exam Results Screen
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="bg-black/30 py-2">
          <div className="h-12" />
        </header>

        <div className="flex-1 bg-app-navy/90 px-4 py-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-md text-center animate-fade-in">
            {/* Trophy/Result Icon */}
            <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
              isPassed ? 'bg-success/20' : 'bg-destructive/20'
            }`}>
              <Trophy className={`w-12 h-12 ${isPassed ? 'text-success' : 'text-destructive'}`} />
            </div>

            {/* Title */}
            <h1 className={`text-2xl font-bold mb-2 ${isPassed ? 'text-success' : 'text-destructive'}`}>
              {isPassed ? 'გამოცდა ჩაბარებულია!' : 'გამოცდა ჩაბარებული არ არის'}
            </h1>
            <p className="text-muted-foreground mb-6">
              კატეგორია: {categoryId?.toUpperCase()} • მაქსიმუმ {maxWrongAnswers} შეცდომა დასაშვები
            </p>

            {/* Score Circle */}
            <div className="relative mx-auto w-40 h-40 mb-6">
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
                  className={isPassed ? 'text-success' : 'text-destructive'}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-foreground">{scorePercentage}%</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-card">
                <CheckCircle className="w-6 h-6 text-success" />
                <span className="text-xl font-bold text-foreground">{correctCount}</span>
                <span className="text-xs text-muted-foreground">სწორი</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-card">
                <XCircle className="w-6 h-6 text-destructive" />
                <span className="text-xl font-bold text-foreground">{wrongCount}</span>
                <span className="text-xs text-muted-foreground">შეცდომა</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-card">
                <Clock className="w-6 h-6 text-accent" />
                <span className="text-xl font-bold text-foreground">{formatTime(finalTime)}</span>
                <span className="text-xs text-muted-foreground">დრო</span>
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
                onClick={() => navigate('/history')}
                className="w-full btn-menu flex items-center justify-center gap-2"
              >
                <History className="w-5 h-5" />
                ისტორია
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
      <div className="flex-1 bg-app-navy/90 px-4 py-4 flex flex-col">
        {/* Timer Bar */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowExitDialog(true)}
            className="p-2 rounded-lg bg-card hover:bg-muted transition-colors"
          >
            <Home className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <span className="timer-badge text-primary">{formatTime(timeLeft)}</span>
            <span className="timer-badge">
              {currentIndex + 1}({questions.length})
            </span>
            <span className="timer-badge text-success">{correctCount}</span>
            <span className="timer-badge text-destructive">{wrongCount}</span>
            <span className="timer-badge text-muted-foreground">#{currentQuestion?.id || 0}</span>
          </div>
          
        </div>

        {/* Question Image */}
        {currentQuestion?.image && (
          <div className="mb-4 animate-fade-in">
            <CachedImage 
              src={currentQuestion.image} 
              alt="კითხვის სურათი"
              className="w-full max-h-48 object-contain rounded-lg bg-white/10"
            />
          </div>
        )}

        {/* Question */}
        <div className="question-box mb-4 animate-fade-in">
          <p className="text-foreground text-base leading-relaxed">
            {currentQuestion?.question}
          </p>
        </div>

        {/* Answers */}
        <div className="space-y-3 flex-1">
          {currentQuestion?.answers.map((answer, index) => {
            
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`${getAnswerClass(index)} flex items-start gap-3 text-left`}
                disabled={answers[currentIndex] !== null}
              >
                <span className="flex-shrink-0 w-8 h-8 rounded bg-secondary flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <span className="flex-1">{answer}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-muted mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="nav-pill disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {currentQuestion?.answers.map((_, index) => {
            const answerNum = index + 1;
            const isSelected = answers[currentIndex] === index;
            const isCorrect = answers[currentIndex] !== null && index === currentQuestion.correctAnswer;
            const isWrong = answers[currentIndex] === index && index !== currentQuestion.correctAnswer;
            
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={answers[currentIndex] !== null}
                className={`nav-pill ${
                  isCorrect ? 'border-primary bg-primary/30 text-primary' : 
                  isWrong ? 'border-destructive bg-destructive/30 text-destructive' :
                  isSelected ? 'border-primary bg-primary/20' : ''
                } disabled:cursor-default`}
              >
                {answerNum}
              </button>
            );
          })}
          
          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className="nav-pill disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="bg-card border-muted">
          <AlertDialogHeader>
            <AlertDialogTitle>გამოცდის შეწყვეტა?</AlertDialogTitle>
            <AlertDialogDescription>
              დარწმუნებული ხართ, რომ გსურთ გამოცდის შეწყვეტა? თქვენი პროგრესი არ შეინახება.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-muted hover:bg-muted/80">გაგრძელება</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => navigate('/')}
              className="bg-destructive hover:bg-destructive/80"
            >
              გასვლა
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Fail Dialog for all categories */}
      <AlertDialog open={showFailDialog} onOpenChange={setShowFailDialog}>
        <AlertDialogContent className="bg-card border-muted">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">გამოცდა ჩაბარებული არ არის!</AlertDialogTitle>
            <AlertDialogDescription>
              თქვენ დაუშვით {maxWrongAnswers + 1} შეცდომა. {categoryId?.toUpperCase()} კატეგორიის გამოცდაზე დასაშვებია მაქსიმუმ {maxWrongAnswers} შეცდომა.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => navigate('/')}
              className="bg-destructive hover:bg-destructive/80"
            >
              მთავარ გვერდზე დაბრუნება
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Exam;
