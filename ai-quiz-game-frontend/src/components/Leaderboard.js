import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeaderboard } from '../utils/api';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [filter, setFilter] = useState('all'); // all, easy, medium, hard
  const [category, setCategory] = useState('all');

  useEffect(() => {
    setLeaderboard(getLeaderboard());
  }, []);

  const filteredLeaderboard = leaderboard.filter(entry => {
    if (filter !== 'all' && entry.difficulty !== filter) return false;
    if (category !== 'all' && entry.category !== category) return false;
    return true;
  });

  const categories = ['all', ...new Set(leaderboard.map(entry => entry.category))];

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600
                       focus:outline-none focus:ring-2"
            >
              Play Again
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Leaderboard Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="px-4 py-3 text-left">Rank</th>
                  <th className="px-4 py-3 text-left">Player</th>
                  <th className="px-4 py-3 text-left">Score</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Difficulty</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaderboard.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-300">#{index + 1}</td>
                    <td className="px-4 py-3 text-white font-medium">{entry.playerName}</td>
                    <td className="px-4 py-3">
                      <span className="text-indigo-400 font-medium">{entry.score}</span>
                      <span className="text-gray-400">/{entry.totalQuestions * 10}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{entry.category}</td>
                    <td className="px-4 py-3">
                      <span className={`
                        px-2 py-1 rounded-full text-sm font-medium
                        ${entry.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                          entry.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'}
                      `}>
                        {entry.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{formatDate(entry.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeaderboard.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No entries found for the selected filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
