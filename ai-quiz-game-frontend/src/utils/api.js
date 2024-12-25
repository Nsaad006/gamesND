const API_KEY = 'AIzaSyASqNzoFQbx5poLvP8zhX_pzNZfggWR0wc';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export const generateQuestions = async (category, difficulty, count) => {
  try {
    const prompt = `You are a quiz question generator. Generate ${count} multiple choice questions about ${category} with ${difficulty} difficulty level. 
    Format your response as a valid JSON array where each question object has this exact structure:
    {
      "question": "the question text",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0 // index of correct answer (0-3)
    }
    
    Requirements:
    - Questions should be appropriate for ${difficulty} difficulty
    - Each question must have exactly 4 options
    - Make sure questions are engaging and educational
    - Ensure the correctAnswer is a valid index (0-3)
    - The entire response must be a valid JSON array
    
    Example format:
    [
      {
        "question": "What is the capital of France?",
        "options": ["Paris", "London", "Berlin", "Madrid"],
        "correctAnswer": 0
      }
    ]`;

    console.log('Sending request to Gemini API...');
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to generate questions');
    }

    const data = await response.json();
    console.log('Received response:', data);

    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      console.error('Invalid API response structure:', data);
      throw new Error('Invalid response from AI service');
    }

    const textResponse = data.candidates[0].content.parts[0].text;
    console.log('Raw text response:', textResponse);

    // Find the JSON array in the response
    const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('No JSON array found in response');
      throw new Error('Invalid question format received');
    }

    const questions = JSON.parse(jsonMatch[0]);

    // Validate the questions format
    if (!Array.isArray(questions) || questions.length === 0) {
      console.error('Invalid questions array:', questions);
      throw new Error('Invalid questions format');
    }

    // Validate each question
    const validatedQuestions = questions.map((q, index) => {
      if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || 
          typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
        console.error(`Invalid question format at index ${index}:`, q);
        throw new Error('Invalid question format');
      }
      return {
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      };
    });

    if (validatedQuestions.length < count) {
      console.error('Not enough questions generated');
      throw new Error('Failed to generate enough questions');
    }

    return validatedQuestions.slice(0, count);
  } catch (error) {
    console.error('Error in generateQuestions:', error);
    throw new Error(error.message || 'Failed to generate questions');
  }
};

// Leaderboard functions
export const getLeaderboard = () => {
  const leaderboard = localStorage.getItem('quizLeaderboard');
  return leaderboard ? JSON.parse(leaderboard) : [];
};

export const updateLeaderboard = (playerData) => {
  const leaderboard = getLeaderboard();
  const newEntry = {
    ...playerData,
    timestamp: new Date().toISOString(),
    id: Date.now()
  };
  
  leaderboard.push(newEntry);
  
  // Sort by score (descending) and keep top 100 entries
  const sortedLeaderboard = leaderboard
    .sort((a, b) => b.score - a.score)
    .slice(0, 100);
  
  localStorage.setItem('quizLeaderboard', JSON.stringify(sortedLeaderboard));
  return sortedLeaderboard;
};
