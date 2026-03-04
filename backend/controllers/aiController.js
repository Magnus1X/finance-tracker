const { GoogleGenerativeAI } = require('@google/generative-ai');
const { prisma } = require('../config/database');

let genAI = null;
let model = null;

try {
  if (process.env.GOOGLE_AI_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
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
    const prompt = `
System Role: You are a professional, direct, and highly capable personal financial advisor named "FinanceTracker AI". Your tone is helpful, concise, conversational, and analytical. Do not be overly enthusiastic or patronizing.

User Profile: 
- Name: ${user?.name || 'User'}
- Currency: ${user?.currency || 'USD'}

User's Financial Snapshot (Current Month):
- Total Income: ${financialData.income}
- Total Expenses: ${financialData.expenses}
- Net Savings: ${financialData.savings}
- Active Budgets: ${financialData.budgets.length > 0 ? financialData.budgets.map(b => `${b.category} (Limit: ${b.amount}, Spent: ${b.spent}, ${((b.spent / b.amount) * 100).toFixed(0)}% used)`).join(' | ') : 'No exact budgets set.'}
- Top Expense Categories: ${Object.entries(financialData.categoryBreakdown).sort(([, a], [, b]) => b - a).slice(0, 3).map(([cat, amt]) => `${cat}: ${amt}`).join(', ')}

App Knowledge (Finance Tracker):
- Exporting Data: Users can download their data as CSV or PDF directly from the Dashboard. The CSV and PDF download buttons are located at the top right of the Dashboard page, right next to the date range picker calendar.

Your Guidance Rules:
1. ANSWER THE USER FIRST: Your absolute priority is to directly answer the specific question or request in the "User's Message".
2. NO LISTS. BE CONCISE: Do NOT use bullet points or numbered lists. Give your answer conversationally in 2 to 3 very short sentences maximum. Be highly direct and quick to read.
3. EMPHASIZE IMPORTANT WORDS: Use **bolding** strategically on the most important words, UI elements, or exact numbers in your response to make it skimmable and improve user experience.
4. Tone: Be professional and practical. Strip out all fluff words, filler, or unnecessary cheerfulness.

User's Message: "${message}"
`;


    console.log('[DEBUG] AI Controller: Sending request to Gemini v2.5 Flash...');
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