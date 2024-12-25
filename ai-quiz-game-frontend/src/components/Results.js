import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { updateLeaderboard } from '../utils/api';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [animatedScore, setAnimatedScore] = useState(0);
  const [rank, setRank] = useState(null);

  useEffect(() => {
    if (!location.state) {
      navigate('/');
      return;
    }

    const { score, totalQuestions, category, difficulty, playerName } = location.state;
    
    // Save to leaderboard
    const leaderboard = updateLeaderboard({
      playerName: playerName || 'Anonymous Player',
      score,
      totalQuestions,
      category,
      difficulty,
      percentage: Math.round((score / (totalQuestions * 10)) * 100)
    });

    // Calculate rank
    const position = leaderboard.findIndex(entry => 
      entry.score === score && entry.timestamp === leaderboard[leaderboard.length - 1].timestamp
    );
    setRank(position + 1);

    // Animate score
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [location.state, navigate]);

  if (!location.state) return null;

  const { score, totalQuestions, category, difficulty } = location.state;
  const percentage = Math.round((score / (totalQuestions * 10)) * 100);
  
  const getGrade = () => {
    if (percentage >= 90) return { grade: 'A', color: 'text-green-400' };
    if (percentage >= 80) return { grade: 'B', color: 'text-blue-400' };
    if (percentage >= 70) return { grade: 'C', color: 'text-yellow-400' };
    if (percentage >= 60) return { grade: 'D', color: 'text-orange-400' };
    return { grade: 'F', color: 'text-red-400' };
  };

  const { grade, color } = getGrade();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
          <h1 className="text-3xl font-bold text-center text-white mb-8">Quiz Results</h1>
          
          <div className="text-center mb-8">
            <div className="text-5xl font-bold mb-2">
              <span className="text-indigo-400">{animatedScore}</span>
              <span className="text-gray-400">/{totalQuestions * 10}</span>
            </div>
            <div className={`text-4xl font-bold ${color} mb-4`}>
              Grade: {grade}
            </div>
            {rank && (
              <div className="text-gray-300 text-lg">
                Leaderboard Rank: #{rank}
              </div>
            )}
          </div>

          <div className="grid gap-4 mb-8">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400">Category</div>
              <div className="text-white font-medium">{category}</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400">Difficulty</div>
              <div className="text-white font-medium capitalize">{difficulty}</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400">Questions</div>
              <div className="text-white font-medium">{totalQuestions}</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-gray-400">Success Rate</div>
              <div className="text-white font-medium">{percentage}%</div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/leaderboard')}
              className="flex-1 px-6 py-3 bg-indigo-500 text-white font-medium rounded-lg
                       hover:bg-indigo-600 focus:outline-none focus:ring-2"
            >
              View Leaderboard
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-300 font-medium rounded-lg
                       hover:bg-gray-300/10 focus:outline-none focus:ring-2"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
