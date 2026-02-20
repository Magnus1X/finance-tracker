const express = require('express');
const { chatWithAI } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/ai/chat - Chat with AI assistant
router.post('/chat', protect, chatWithAI);

// GET /api/ai/test - Test AI connection
router.get('/test', (req, res) => {
  const hasApiKey = !!process.env.GOOGLE_AI_KEY;
  res.json({
    success: true,
    message: 'AI service status',
    data: {
      configured: hasApiKey,
      apiKeyLength: hasApiKey ? process.env.GOOGLE_AI_KEY.length : 0,
    },
  });
});

module.exports = router;