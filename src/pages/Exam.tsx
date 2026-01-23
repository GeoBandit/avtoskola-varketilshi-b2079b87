import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import avtoskolaLogo from '@/assets/avtoskola-logo.png';
import { getQuestionsForVehicle } from '@/data/questions';
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
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

    if (answerIndex === currentQuestion.correctAnswer) {
      setCorrectCount(prev => prev + 1);
    } else {
      const newWrongCount = wrongCount + 1;
      setWrongCount(newWrongCount);
      
      // Check if exceeded max wrong answers for this category
      if (newWrongCount > maxWrongAnswers) {
        setShowFailDialog(true);
        return; // Don't auto-advance if failed
      }
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

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
    setSelectedAnswer(answers[index]);
  };

  const getAnswerClass = (index: number) => {
    const currentAnswer = answers[currentIndex];
    if (currentAnswer === null) return 'card-answer';
    if (index === currentQuestion.correctAnswer) return 'card-answer card-answer-correct';
    if (index === currentAnswer && index !== currentQuestion.correctAnswer) return 'card-answer card-answer-wrong';
    return 'card-answer opacity-50';
  };

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
            <span className="timer-badge text-primary">{correctCount}</span>
            <span className="timer-badge text-destructive">{wrongCount}</span>
            <span className="timer-badge text-muted-foreground">#{currentQuestion?.id || 0}</span>
          </div>
          <img src={avtoskolaLogo} alt="ავტოსკოლა ვარკეთილში" className="h-10 w-auto" />
        </div>

        {/* Question Image */}
        {currentQuestion?.image && (
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
