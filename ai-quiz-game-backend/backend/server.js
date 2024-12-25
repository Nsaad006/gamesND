const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

const GEMINI_API_KEY = 'AIzaSyASqNzoFQbx5poLvP8zhX_pzNZfggWR0wc';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

app.use(cors());
app.use(express.json());

// Store used questions to avoid repetition
const usedQuestions = new Set();

// Function to generate question based on category and difficulty
async function generateQuestion(category, difficulty) {
  const categoryPrompts = {
    general: "Generate a general knowledge question about any topic",
    science: "Generate a science question about physics, chemistry, or biology",
    history: "Generate a history question about significant historical events, figures, or periods",
    tech: "Generate a technology question about computers, software, or modern innovations",
    sports: "Generate a sports question about rules, history, or famous athletes",
    geography: "Generate a geography question about countries, capitals, or natural features",
    movies: "Generate a movies & entertainment question about films, actors, or directors",
    music: "Generate a music question about songs, artists, or musical instruments",
    art: "Generate an art & literature question about paintings, books, or artists",
    food: "Generate a food & cuisine question about dishes, ingredients, or cooking methods",
    nature: "Generate a nature & environment question about animals, plants, or ecosystems",
    space: "Generate a space & astronomy question about planets, stars, or space exploration"
  };

  const prompt = `${categoryPrompts[category] || categoryPrompts.general} with ${difficulty} difficulty level.
    The question should be challenging but clear.
    Return the response in the following JSON format:
    {
      "question": "the question text",
      "answers": ["correct answer", "wrong answer 1", "wrong answer 2", "wrong answer 3"],
      "correctAnswer": "correct answer",
      "explanation": "brief explanation of why this is the correct answer"
    }
    Make sure the answers are shuffled and the correct answer is included in the answers array.
    The question should be specific and factual, avoiding subjective or ambiguous content.`;

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }
    );

    const generatedContent = response.data.candidates[0].content.parts[0].text;
    const questionData = JSON.parse(generatedContent);

    // Check if this question has been used before
    if (usedQuestions.has(questionData.question)) {
      // If question is repeated, generate a new one
      return generateQuestion(category, difficulty);
    }

    // Add question to used questions set
    usedQuestions.add(questionData.question);

    // Shuffle the answers
    questionData.answers = shuffleArray([...questionData.answers]);

    return questionData;
  } catch (error) {
    console.error('Error generating question:', error);
    throw error;
  }
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Clear used questions periodically (every 24 hours)
setInterval(() => {
  usedQuestions.clear();
}, 24 * 60 * 60 * 1000);

// Route to generate AI questions
app.get('/generate-question', async (req, res) => {
  const { category, difficulty } = req.query;
  try {
    const questionData = await generateQuestion(
      category || 'general',
      difficulty || 'medium'
    );
    res.json(questionData);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to generate question',
      details: error.message 
    });
  }
});

// Route to store high scores
app.post('/scores', (req, res) => {
  const { playerName, score } = req.body;
  // In a real app, you would store this in a database
  // For now, we'll just send back a success response
  res.json({ success: true, message: 'Score saved successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
