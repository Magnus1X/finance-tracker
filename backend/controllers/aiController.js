const { GoogleGenerativeAI } = require('@google/generative-ai');
const { prisma } = require('../config/database');

let genAI = null;
let model = null;

try {
  if (process.env.GOOGLE_AI_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log('✅ Google Generative AI initialized');
  } else {
    console.log('⚠️ GOOGLE_AI_KEY not found in environment.');
  }
} catch (error) {
  console.error('❌ Google Generative AI init failed:', error.message);
}

const getFinancialContext = async (userId) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  try {
    // Get user's transactions for current month
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: new Date(currentYear, currentMonth - 1, 1),
          lt: new Date(currentYear, currentMonth, 1),
        },
      },
    });

    // Get user's budgets for current month
    const budgets = await prisma.budget.findMany({
      where: {
        userId,
        month: currentMonth,
        year: currentYear,
      },
    });

    // Calculate analytics
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryBreakdown = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    return {
      income,
      expenses,
      savings: income - expenses,
      budgets,
      categoryBreakdown,
      transactionCount: transactions.length,
    };
  } catch (error) {
    console.error('Error fetching financial context:', error);
    return {
      income: 0,
      expenses: 0,
      savings: 0,
      budgets: [],
      categoryBreakdown: {},
      transactionCount: 0,
    };
  }
};

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    // Mock response if AI service is not available (missing key)
    if (!model) {
      console.warn('⚠️ AI service not init, returning mock response');
      return res.json({
        success: true,
        data: {
          message: "I'm running in demo mode because the GOOGLE_AI_KEY is not configured. Based on your mocked data, you seem to be doing great! (Please configure GOOGLE_AI_KEY in backend/.env for real AI responses)",
        },
      });
    }

    // Get user's financial context
    const financialData = await getFinancialContext(userId);

    // Get user info
    console.log('[DEBUG] AI Controller: Fetching user context for ID:', userId);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, currency: true },
    });

    // Create prompt for AI
    console.log('[DEBUG] AI Controller: Preparing prompt');
    const prompt = `System Context: You are a helpful financial advisor interacting with ${user?.name || 'User'} (Currency: ${user?.currency || 'USD'}). 
User's Current Month Data:
- Income: ${financialData.income}
- Expenses: ${financialData.expenses}
- Savings: ${financialData.savings}
- Number of Transactions: ${financialData.transactionCount}
- Top expenses: ${Object.entries(financialData.categoryBreakdown).sort(([, a], [, b]) => b - a).slice(0, 3).map(([cat, amt]) => `${cat}: ${amt}`).join(', ')}
- Budgets: ${financialData.budgets.map(b => `${b.category} (${((b.spent / b.amount) * 100).toFixed(0)}% used)`).join(', ')}

Instructions: Provide concise, actionable, and friendly financial advice answering the user's message below based on their data. Do NOT use markdown headers or lists unless absolutely necessary; keep it conversational.

User Message: "${message}"`;

    console.log('[DEBUG] AI Controller: Sending request to Gemini v1.5 Flash...');
    const result = await model.generateContent(prompt);
    console.log('[DEBUG] AI Controller: Gemini response received successfully');
    const aiResponse = result.response.text();

    res.json({
      success: true,
      data: {
        message: aiResponse,
      },
    });

  } catch (error) {
    console.error('AI Error:', error.message);
    // Graceful degradation on error
    res.json({
      success: true,
      data: {
        message: "I'm having trouble connecting to the AI service right now. Please try again later. (Error: " + error.message + ")",
      },
    });
  }
};

module.exports = {
  chatWithAI,
};