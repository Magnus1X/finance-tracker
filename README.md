# Personalized Finance & Budget Tracker

A production-grade, full-stack web application for tracking income, expenses, and budgets with AI-powered financial insights. Built with modern technologies and featuring a premium UI/UX.

## Features

### Core Functionality
- Income & Expense Tracking - Add, edit, and delete transactions with categories
- Budget Management - Create monthly budgets by category with real-time tracking
- Budget History - Permanent record of all past budgets with analytics
- Financial Dashboard - Visual overview with charts and statistics
- AI-Powered Chatbot - Coming Soon
- OAuth Authentication - Sign in with Google or email/password
- User Settings - Profile management with currency preferences
- Multi-Currency Support - Support for 8 major currencies (USD, EUR, GBP, INR, JPY, CNY, AUD, CAD)
- Landing Page - Beautiful marketing page with feature showcase
- Dark/Light Mode - Beautiful theme switching
- Responsive Design - Works seamlessly on mobile, tablet, and desktop

### Premium UI/UX
- Glassmorphism Design - Modern, premium look with glass cards
- Framer Motion Animations - Smooth page transitions, parallax effects, and micro-interactions
- Interactive Charts - Recharts for beautiful data visualization
- Advanced Animations - Blob animations, floating elements, staggered animations
- Gradient Designs - Beautiful gradient backgrounds and buttons
- Interactive Landing - Engaging hero section with animated elements

## Tech Stack

### Frontend
- React 18 - Latest React with hooks
- React Router - Client-side routing
- Context API - State management
- Framer Motion - Advanced animations and transitions
- Recharts - Chart visualization
- Tailwind CSS - Utility-first styling
- Vite - Fast build tool
- React Icons - Icon library
- Axios - HTTP client
- date-fns - Date utility library

### Backend
- Node.js - Runtime environment
- Express.js - Web framework
- Prisma - Modern ORM for MongoDB
- MongoDB Atlas - Cloud database
- JWT - Authentication tokens
- Passport.js - OAuth authentication
- bcryptjs - Password hashing

## Project Structure

```
finance-tracker/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── passport.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   └── budgetController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── budgetRoutes.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── server.js
│   ├── package.json
│   └── env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AIChatbot.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── AuthCallback.jsx
│   │   │   ├── Budgets.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Transactions.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── currency.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (free tier works)
- Google OAuth credentials (for OAuth login)

### Backend Setup

1. Navigate to backend directory
   ```bash
   cd backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here
   SESSION_SECRET=your_session_secret_here
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. Set up Prisma
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Start the server
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory
   ```bash
   cd frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` if your API URL is different:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

   App will run on `http://localhost:3000`

## Authentication Setup

### Google OAuth Setup

1. Go to Google Cloud Console (https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret to your `.env` file

### JWT Secret

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback

### Transactions
- `GET /api/transactions` - Get all transactions (Protected)
- `GET /api/transactions/:id` - Get single transaction (Protected)
- `POST /api/transactions` - Create transaction (Protected)
- `PUT /api/transactions/:id` - Update transaction (Protected)
- `DELETE /api/transactions/:id` - Delete transaction (Protected)
- `GET /api/transactions/analytics` - Get analytics (Protected)

### Budgets
- `GET /api/budgets` - Get all budgets (Protected)
- `GET /api/budgets/:id` - Get single budget (Protected)
- `POST /api/budgets` - Create budget (Protected)
- `PUT /api/budgets/:id` - Update budget (Protected)
- `DELETE /api/budgets/:id` - Delete budget (Protected)
- `POST /api/budgets/:id/archive` - Archive budget (Protected)
- `GET /api/budgets/history` - Get budget history (Protected)

## Database Schema

### User
- id (ObjectId)
- name (String)
- email (String, unique)
- password (String, optional for OAuth users)
- provider (String: 'local' or 'google')
- providerId (String, for OAuth)
- avatar (String, optional)
- currency (String, default: 'USD')
- occupation (String, optional)
- lifestyle (String, optional)
- createdAt, updatedAt

### Transaction
- id (ObjectId)
- userId (ObjectId, ref: User)
- type (String: 'income' or 'expense')
- category (String)
- amount (Float)
- description (String)
- date (DateTime)
- createdAt, updatedAt

### Budget
- id (ObjectId)
- userId (ObjectId, ref: User)
- category (String)
- amount (Float)
- month (Int: 1-12)
- year (Int)
- spent (Float)
- createdAt, updatedAt

### BudgetHistory
- id (ObjectId)
- userId (ObjectId, ref: User)
- category (String)
- budgetedAmount (Float)
- spentAmount (Float)
- month (Int)
- year (Int)
- status (String: 'under', 'over', 'met')
- utilizationPercentage (Float)
- createdAt, updatedAt

## UI Components

### Pages
- Landing - Marketing page with feature showcase and animations
- Dashboard - Overview with charts and stats
- Transactions - Manage income and expenses
- Budgets - Create and track budgets
- History - View past budget performance
- Settings - User profile management and preferences
- AuthCallback - OAuth authentication callback handler

### Features
- AI Chatbot - Coming Soon
- Multi-Currency - Support for 8 major world currencies
- User Settings - Profile management with currency preferences
- Dark Mode - Toggle between light and dark themes
- Responsive Layout - Mobile-first design
- Advanced Animations - Framer Motion powered smooth transitions
- Landing Page - Beautiful marketing page with interactive elements

## AI Chatbot (Coming Soon)

The AI chatbot will provide:
- Real-time budget status and recommendations
- Expense analysis with category breakdown
- Savings suggestions based on income vs expenses
- General financial tips and advice
- Personalized responses based on actual user data
- Interactive chat interface with typing indicators

This feature will be integrated with Gemini, Anthropic, or other AI APIs in future updates.

## Deployment

### Backend Deployment (Render/Railway/Heroku)

1. Set environment variables in your hosting platform:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   SESSION_SECRET=your_session_secret
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.com
   ```

2. Ensure MongoDB Atlas allows connections from your server IP

3. Deploy and the service will auto-start

### Frontend Deployment (Vercel/Netlify)

1. Build the project:
   ```bash
   npm run build
   ```

2. Set environment variable:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

3. Deploy the `dist` folder

## Development

### Running in Development

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

### Database Migrations

```bash
npx prisma generate
npx prisma db push
npx prisma studio
```

## Production Deployment Guide

### Step 1: Prepare Your Code

Ensure your environment files are configured:

Backend `.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker?retryWrites=true&w=majority
JWT_SECRET=generated_secret_key
SESSION_SECRET=generated_session_key
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

Frontend `.env`:
```env
VITE_API_URL=https://your-backend-url.com/api
```

### Step 2: Deploy Backend (Render)

1. Create new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - Build Command: `cd backend && npm install && npx prisma generate`
   - Start Command: `cd backend && node server.js`
4. Add environment variables from your backend `.env`
5. Deploy

### Step 3: Deploy Frontend (Render/Vercel/Netlify)

1. Create new Static Site
2. Configure:
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
3. Add environment variable: `VITE_API_URL`
4. Deploy

### Step 4: Update CORS

Update backend `FRONTEND_URL` environment variable with your deployed frontend URL.

## Testing

The application is built with production-ready code following best practices:
- Error handling
- Input validation
- Secure authentication
- Clean code architecture
- Scalable structure

## License

This project is open source and available for personal and commercial use.

## Resume-Ready Features

This project demonstrates:
- Full-stack development (React + Node.js + MongoDB)
- Modern ORM usage (Prisma with MongoDB)
- OAuth integration (Google authentication)
- RESTful API design with Express.js
- State management (Context API)
- Advanced animations (Framer Motion)
- Data visualization (Recharts)
- Responsive design with Tailwind CSS
- Authentication & Authorization (JWT)
- Database design & optimization with indexes
- Clean code architecture and separation of concerns
- Multi-currency support and internationalization
- Real-time data processing and AI integration
- Modern build tools (Vite) and development workflow

## Interview Talking Points

1. Architecture: MVC pattern, separation of concerns, modular structure
2. Authentication: JWT + OAuth implementation with Google integration
3. Database: Prisma ORM with MongoDB, optimized schema design with indexes
4. State Management: Context API for global state management
5. Animations: Framer Motion for advanced animations and micro-interactions
6. API Design: RESTful endpoints with proper error handling and validation
7. Security: Password hashing, token-based auth, protected routes
8. Performance: Optimized queries, efficient data fetching, lazy loading
9. UI/UX: Glassmorphism design, responsive layout, accessibility
10. Multi-Currency: International support with currency utilities
11. Real-time Features: Dynamic budget tracking with AI chatbot integration planned

## Contributing

This is a portfolio project. Feel free to fork and customize for your needs.

## Support

For questions or issues, please open an issue on the repository.
