"use client";
import { useState, useEffect } from 'react';
import questions from '@/question.json';
import Results from './Results';

type Question = {
  question: string;
  choices: string[];
  answer: string;
};

const Quiz = () => {
  const initialTime = 600; // 10 minutes in seconds
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedQuestionIndex = parseInt(localStorage.getItem('currentQuestionIndex') || '0');
      const savedTimeLeft = parseInt(localStorage.getItem('timeLeft') || initialTime.toString());
      setCurrentQuestionIndex(savedQuestionIndex);
      setTimeLeft(savedTimeLeft);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (quizStarted && !showResults) {
      interval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft <= 1) {
            clearInterval(interval!);
            alert('Time is up!');
            handleQuizEnd();
            return 0;
          }
          const newTimeLeft = prevTimeLeft - 1;
          if (typeof window !== 'undefined') {
            localStorage.setItem('timeLeft', newTimeLeft.toString());
          }
          return newTimeLeft;
        });
      }, 1000);
    }
    return () => clearInterval(interval!);
  }, [quizStarted, showResults]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement !== null);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestionIndex].answer) {
      setScore(score + 1);
    }
    setSelectedAnswer('');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => {
        const newIndex = prevIndex + 1;
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentQuestionIndex', newIndex.toString());
        }
        return newIndex;
      });
    } else {
      handleQuizEnd();
    }
  };

  const handleQuizEnd = () => {
    setShowResults(true);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentQuestionIndex');
      localStorage.removeItem('timeLeft');
    }
  };

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    }
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    handleFullScreen();
  };

  const exitFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setTimeLeft(initialTime);
    setScore(0);
    setSelectedAnswer('');
    setShowResults(false);
    setQuizStarted(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (!quizStarted) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center text-gray-800">
          <h1 className="text-3xl font-bold mb-4">Welcome to the Quiz</h1>
          <button
            onClick={handleStartQuiz}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (!isFullScreen) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center text-gray-800">
          <p className="mb-4">Please enable full-screen mode to start the quiz.</p>
          <button
            onClick={handleFullScreen}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Enable Full Screen
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion: Question = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl text-gray-800">
        {!showResults ? (
          <>
            <div className="text-center mb-4">
              <p className="text-xl font-semibold mb-2">{currentQuestion.question}</p>
              <p className="text-lg text-gray-700">Time left: {`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}</p>
            </div>
            <ul className="space-y-2 mb-4">
              {currentQuestion.choices.map((choice, index) => (
                <li
                  key={index}
                  onClick={() => setSelectedAnswer(choice)}
                  className={`p-2 border rounded cursor-pointer ${selectedAnswer === choice ? 'bg-blue-200' : 'bg-white'} hover:bg-blue-100`}
                >
                  {choice}
                </li>
              ))}
            </ul>
            <div className="flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <Results score={score} totalQuestions={questions.length} />
            <button
              onClick={exitFullScreen}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Exit Full Screen
            </button>
            <button
              onClick={handleRestartQuiz}
              className="mt-4 ml-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Restart Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
