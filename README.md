# Finance Awareness Platform

![GitHub last commit](https://img.shields.io/github/last-commit/Magnus1X/finance-tracker)
## Project Overview
Finance Awareness Platform is a comprehensive, beginner-friendly web application designed to educate users about personal finance, money management, investing basics, and market awareness. The platform serves as a modern tool for users who wish to track their daily transactions while simultaneously learning how to use their money wisely and grow their wealth.

The system combines financial education, robust tracking tools, AI-powered insights, and real-time market awareness into a single, cohesive dashboard.

## Key Features

1. **Dashboard & Analytics**
   - Centralized view of your financial health.
   - Dynamic charts tracking income and expense flow.
   - AI-driven insights generated based on recent financial activities.

2. **Transaction Ledger**
   - Comprehensive history of all financial inputs and outputs.
   - Seamless addition, editing, and deletion of transactions.
   - Filtering and visualization of cash flow over time.

3. **Smart Reminders & Alerts**
   - Automated budgeting alerts (e.g., nearing limits or deficit warnings).
   - Milestone notifications when saving targets are met.
   - Daily actionable financial nudges.

4. **Goal Tracking**
   - Create specific financial goals with target dates.
   - Monitor monthly saving requirements based on time remaining to the goal.

5. **Financial Education & Tools**
   - Built-in educational modules for personal finance.
   - Calculation tools for compound interest, SIPs, and loan EMIs.
   - Market trends aggregator summarizing financial news.

6. **Reporting**
   - Generate professional PDF and CSV reports of all current transactions and budget statuses.

## Technology Stack

### Frontend
- React.js
- Tailwind CSS (Utility-first styling, glassmorphism UI)
- Framer Motion (Animations)
- Recharts (Data visualization)

### Backend
- Node.js & Express.js
- Prisma ORM
- MongoDB (Database)
- JSON Web Tokens (Authentication)
- Google Gemini API / OpenAI API (AI Insights Engine)

## Local Installation and Setup

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB instance (Local or Atlas)
- NPM or Yarn

### 1. Clone the Repository
```bash
git clone https://github.com/Magnus1X/finance-tracker.git
cd finance-tracker
```

### 2. Backend Setup
Navigate into the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory based on the provided `env.example`:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend server:
```bash
npm run dev
# or
npm start
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The client will be running at `http://localhost:3000`.

## Testing the Application

If the database is pre-seeded or if you wish to try the application immediately without creating a new user, you may use the following testing credentials (assuming a mock user has been created in your local database with these details, or you can register a new account on the landing page using them):

**Dummy Credentials for Reviewers:**
- **Email:** abcde@gmail.com
- **Password:** abcde@123

*Note: If these credentials do not work upon first initialization, please utilize the Register page to instantiate a new account profile.*

## License
This project is proprietary. All rights reserved.
