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

    if (!genAI) {
      return res.status(500).json({
        success: false,
        message: 'AI service not available',
      });
    }

    // Get user's financial context
    const financialData = await getFinancialContext(userId);
    
    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, currency: true },
    });

    // Create context for AI
    const context = `You are a helpful financial advisor. User: ${user?.name || 'User'}, Currency: ${user?.currency || 'USD'}. Current month data - Income: ${financialData.income}, Expenses: ${financialData.expenses}, Savings: ${financialData.savings}, Transactions: ${financialData.transactionCount}. Top expenses: ${Object.entries(financialData.categoryBreakdown).sort(([,a], [,b]) => b - a).slice(0, 3).map(([cat, amt]) => `${cat}: ${amt}`).join(', ')}. Budgets: ${financialData.budgets.map(b => `${b.category} (${((b.spent/b.amount)*100).toFixed(0)}% used)`).join(', ')}. Provide concise, actionable financial advice.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `${context}\n\nUser Question: ${message}`;
    
    const result = await model.generateContent(prompt);
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
      message: process.env.NODE_ENV === 'production' ? 'AI service temporarily unavailable' : error.message,
    });
  }
};

module.exports = {
  chatWithAI,
};