import { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { gsap } from 'gsap';
import { transactionAPI, budgetAPI } from '../services/api';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your finance assistant. I can help you with budgeting advice, expense optimization, and savings suggestions. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && chatRef.current) {
      gsap.from(chatRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 20,
        duration: 0.3,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getAIResponse = async (userMessage) => {
    // Mock AI responses based on user queries
    // In production, this would call an actual AI API
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('budget') || lowerMessage.includes('spending')) {
      try {
        const currentDate = new Date();
        const budgetsRes = await budgetAPI.getAll({
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
        });
        const budgets = budgetsRes.data.data;

        if (budgets.length === 0) {
          return "You don't have any active budgets. I recommend creating budgets for your main expense categories to better track your spending!";
        }

        const overBudget = budgets.filter((b) => b.spent > b.amount);
        if (overBudget.length > 0) {
          return `You're over budget in ${overBudget.length} category/categories: ${overBudget.map((b) => b.category).join(', ')}. Consider reducing spending in these areas.`;
        }

        const highUtilization = budgets.filter((b) => (b.spent / b.amount) * 100 >= 80);
        if (highUtilization.length > 0) {
          return `You're close to your budget limit in: ${highUtilization.map((b) => b.category).join(', ')}. Be mindful of your spending in these categories.`;
        }

        return `Great job! You have ${budgets.length} active budgets and you're staying within your limits. Keep up the good work!`;
      } catch (error) {
        return "I'm having trouble accessing your budget data. Please try again later.";
      }
    }

    if (lowerMessage.includes('save') || lowerMessage.includes('saving')) {
      try {
        const currentDate = new Date();
        const analyticsRes = await transactionAPI.getAnalytics({
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
        });
        const analytics = analyticsRes.data.data;

        if (analytics.savings > 0) {
          return `You're saving $${analytics.savings.toFixed(2)} this month! That's excellent. Consider putting this into a savings account or investment.`;
        } else {
          return `You're spending more than you're earning this month. I recommend reviewing your expenses and finding areas to cut back.`;
        }
      } catch (error) {
        return "I'm having trouble accessing your financial data. Please try again later.";
      }
    }

    if (lowerMessage.includes('expense') || lowerMessage.includes('spend')) {
      try {
        const currentDate = new Date();
        const analyticsRes = await transactionAPI.getAnalytics({
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
        });
        const analytics = analyticsRes.data.data;

        if (analytics.categoryBreakdown) {
          const topCategory = Object.entries(analytics.categoryBreakdown)
            .sort(([, a], [, b]) => b - a)[0];
          return `Your top spending category is ${topCategory[0]} at $${topCategory[1].toFixed(2)}. Consider if there are ways to reduce spending in this area.`;
        }
      } catch (error) {
        return "I'm having trouble accessing your expense data. Please try again later.";
      }
    }

    if (lowerMessage.includes('advice') || lowerMessage.includes('tip')) {
      const tips = [
        "Track every expense, no matter how small. Small purchases add up quickly!",
        "Create a budget for each category and stick to it. Review and adjust monthly.",
        "Build an emergency fund with 3-6 months of expenses.",
        "Review your subscriptions regularly and cancel what you don't use.",
        "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
        "Set up automatic transfers to savings to pay yourself first.",
        "Compare prices before making large purchases.",
        "Cook at home more often to save on food expenses.",
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm here to help you manage your finances better. Ask me about budgets, expenses, savings, or get general financial advice!";
    }

    return "I can help you with budgeting advice, expense analysis, savings tips, and financial calculations. Try asking about your current budget status, spending patterns, or savings goals!";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    // Simulate AI thinking time
    setTimeout(async () => {
      const aiResponse = await getAIResponse(userMessage);
      setMessages((prev) => [...prev, { role: 'assistant', content: aiResponse }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center z-50"
      >
        {isOpen ? <FiX className="text-xl" /> : <FiMessageCircle className="text-xl" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatRef}
          className="fixed bottom-24 right-6 w-96 h-[500px] glass card shadow-2xl flex flex-col z-40"
        >
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="font-bold text-lg">Finance Assistant</h3>
              <p className="text-xs text-gray-500">AI-powered help</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FiX />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 input-field"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary p-3"
            >
              <FiSend />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatbot;

