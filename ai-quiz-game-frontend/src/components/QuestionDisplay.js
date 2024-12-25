import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateQuestions } from '../utils/api';

const QuestionDisplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const MAX_RETRIES = 3;

  useEffect(() => {
    if (!location.state) {
      navigate('/');
      return;
    }

    const fetchQuestions = async () => {
      const { category, difficulty, questionCount } = location.state;
      
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching questions:', { category, difficulty, questionCount });
        
        // Start countdown
        setCountdown(3);
        const countdownInterval = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
            }
            return prev - 1;
          });
        }, 1000);
        
        const aiQuestions = await generateQuestions(category, difficulty, questionCount);
        console.log('Questions received:', aiQuestions);
        
        setQuestions(aiQuestions);
        setCurrentQuestion(0);
        setScore(0);
        setTimeLeft(30);
        setSelectedAnswer(null);
      } catch (err) {
        console.error('Error in fetchQuestions:', err);
        setError(err.message || 'Failed to load questions');
        
        // Auto-retry logic
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
          setRetryCount(prev => prev + 1);
          setTimeout(fetchQuestions, 2000 * (retryCount + 1)); // Exponential backoff
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [location.state, navigate]);

  const handleRetry = () => {
    setRetryCount(0);
    setError(null);
    setLoading(true);
    const { category, difficulty, questionCount } = location.state;
    generateQuestions(category, difficulty, questionCount)
      .then(aiQuestions => {
        setQuestions(aiQuestions);
        setCurrentQuestion(0);
        setScore(0);
        setTimeLeft(30);
        setSelectedAnswer(null);
        setError(null);
      })
      .catch(err => {
        console.error('Error in handleRetry:', err);
        setError(err.message || 'Failed to load questions');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAnswerSelect = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    
    if (index === questions[currentQuestion].correctAnswer) {
      setScore(score + 10);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setTimeLeft(30);
      } else {
        navigate('/results', { 
          state: { 
            score,
            totalQuestions: questions.length,
            category: location.state.category,
            difficulty: location.state.difficulty,
            playerName: location.state.playerName
          } 
        });
      }
    }, 1500);
  };

  useEffect(() => {
    if (loading || selectedAnswer !== null) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswerSelect(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, selectedAnswer]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-indigo-500 mb-4">Get Ready!</h2>
          {countdown > 0 ? (
            <div className="text-6xl font-bold text-white mb-8">{countdown}</div>
          ) : (
            <div className="animate-pulse text-xl text-gray-300">Generating your questions...</div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-fade-in text-center max-w-md mx-auto p-6">
          <div className="bg-red-500/10 text-red-400 p-4 rounded-lg mb-6">
            <p className="text-lg font-medium mb-2">Error</p>
            <p className="text-sm">{error}</p>
          </div>
          <div className="flex gap-4 justify-center">
            {retryCount < MAX_RETRIES && (
              <button
                onClick={handleRetry}
                className="px-6 py-2.5 bg-indigo-500 text-white font-medium rounded-lg
                         hover:bg-indigo-600 focus:outline-none focus:ring-2"
              >
                Try Again
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 border border-gray-300 text-gray-300 font-medium rounded-lg
                       hover:bg-gray-300/10 focus:outline-none focus:ring-2"
            >
              Back to Setup
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!questions.length) return null;

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-gray-300">
              Question {currentQuestion + 1}/{questions.length}
            </div>
            <div className="text-2xl font-bold text-indigo-500">
              Score: {score}
            </div>
          </div>

          {/* Timer */}
          <div className="mb-6">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-1000 ease-linear"
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              ></div>
            </div>
            <div className="text-right text-sm text-gray-400 mt-1">
              {timeLeft}s
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-xl text-gray-200 font-medium mb-6">
              {currentQ.question}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  className={`p-4 rounded-lg font-medium transition-all duration-200 text-left
                    ${selectedAnswer === null
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : selectedAnswer === index
                        ? index === currentQ.correctAnswer
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : index === currentQ.correctAnswer
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-700 text-gray-400'
                    }
                  `}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-end">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-300 font-medium 
                       rounded-lg hover:bg-gray-300/10 focus:outline-none focus:ring-2 
                       focus:ring-gray-300/50 focus:ring-offset-2 focus:ring-offset-gray-900 
                       transition-all duration-200"
            >
              Quit Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;
