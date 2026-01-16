import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import StartLogo from '@/components/StartLogo';
import { getAllQuestions } from '@/data/questions';

const EXAM_TIME = 30 * 60; // 30 minutes in seconds
const EXAM_QUESTION_COUNT = 30;

const Exam: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(EXAM_TIME);

  const questions = useMemo(() => {
    const allQuestions = getAllQuestions();
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, EXAM_QUESTION_COUNT);
  }, []);

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
      setWrongCount(prev => prev + 1);
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
          <div className="flex items-center gap-2">
            <span className="timer-badge text-primary">{formatTime(timeLeft)}</span>
            <span className="timer-badge">
              {currentIndex + 1}({questions.length})
            </span>
            <span className="timer-badge text-primary">{correctCount}</span>
            <span className="timer-badge text-destructive">{wrongCount}</span>
            <span className="timer-badge text-muted-foreground">#{currentQuestion?.id || 0}</span>
          </div>
          <StartLogo size="small" />
        </div>

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
          
          {[1, 2, 3].map(num => (
            <button
              key={num}
              onClick={() => goToQuestion(num - 1)}
              className={`nav-pill ${currentIndex === num - 1 ? 'border-primary bg-primary/20' : ''}`}
            >
              {num}
            </button>
          ))}
          
          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className="nav-pill disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Exam;
