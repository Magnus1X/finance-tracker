const { GoogleGenerativeAI } = require('@google/generative-ai');
const { prisma } = require('../config/database');

let genAI = null;

try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ Gemini AI initialized');
  }
} catch (error) {
  console.error('❌ Gemini AI init failed:', error.message);
}

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    if (!genAI) {
      return res.status(500).json({
        success: false,
        message: 'AI service not available',
      });
    }

    // Use the correct model name
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(`You are a financial advisor. Answer briefly: ${message}`);
    const response = await result.response;
    const aiResponse = response.text();

    res.json({
      success: true,
      data: {
        message: aiResponse,
      },
    });
    
  } catch (error) {
    console.error('AI Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'AI temporarily unavailable',
    });
  }
};

module.exports = {
  chatWithAI,
};