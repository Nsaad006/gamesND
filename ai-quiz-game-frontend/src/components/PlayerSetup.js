import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  'General Knowledge', 'Science', 'History', 'Technology',
  'Sports', 'Geography', 'Movies & Entertainment', 'Music',
  'Art & Literature', 'Food & Cuisine', 'Nature & Environment',
  'Space & Astronomy'
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const QUESTION_COUNTS = [5, 10, 15, 20];

const PlayerSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    playerName: '',
    category: 'General Knowledge',
    difficulty: 'easy',
    questionCount: 5
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.playerName || !formData.category || !formData.difficulty) {
      alert('Please fill in all fields');
      return;
    }
    if (formData.questionCount < 5) {
      alert('Minimum number of questions is 5');
      setFormData(prev => ({ ...prev, questionCount: 5 }));
      return;
    }
    navigate('/game', { state: formData });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
          <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
            Game Setup
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Player Name */}
            <div>
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-300 mb-2">
                Player Name
              </label>
              <input
                type="text"
                id="playerName"
                name="playerName"
                value={formData.playerName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Category Selection */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg
                         text-white appearance-none cursor-pointer focus:outline-none 
                         focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 
                         transition-all duration-200"
                required
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category} className="bg-gray-700">
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Selection */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300 mb-2">
                Difficulty
              </label>
              <div className="grid grid-cols-3 gap-3">
                {DIFFICULTIES.map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, difficulty: level.toLowerCase() }))}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200
                              ${formData.difficulty === level.toLowerCase()
                                ? 'bg-indigo-500 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              } focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label htmlFor="questionCount" className="block text-sm font-medium text-gray-300 mb-2">
                Number of Questions (minimum 5)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  id="questionCount"
                  name="questionCount"
                  min="5"
                  max="20"
                  step="1"
                  value={formData.questionCount}
                  onChange={handleChange}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                           [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-indigo-500 
                           [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <span className="text-gray-300 min-w-[3ch]">{formData.questionCount}</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-2.5 bg-indigo-500 text-white font-medium rounded-lg
                         hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 
                         focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
              >
                Start Game
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-2.5 border-2 border-gray-300 text-gray-300 font-medium 
                         rounded-lg hover:bg-gray-300/10 focus:outline-none focus:ring-2 
                         focus:ring-gray-300/50 focus:ring-offset-2 focus:ring-offset-gray-900 
                         transition-all duration-200"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlayerSetup;
