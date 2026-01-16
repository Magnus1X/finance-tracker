# Personalized Finance & Budget Tracker

A production-grade, full-stack web application for tracking income, expenses, and budgets with financial insights. Built with modern technologies and featuring a premium UI/UX.

## Features

- **Transaction Management**: Add, edit, and delete transactions with categories.
- **Budget Tracking**: Create monthly budgets and track real-time progress.
- **Analytics Dashboard**: Visual overview of financial health with charts.
- **Budget History**: Permanent record of past budgets.
- **Multi-Currency Support**: Support for USD, EUR, GBP, INR, JPY, CNY, AUD, CAD.
- **Authentication**: Secure login with Email/Password or Google OAuth.
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop.
- **Dark Mode**: Built-in theme switching.

## Tech Stack

### Frontend
- **React 18** (Vite)
- **Tailwind CSS** & **Framer Motion**
- **Recharts** for visualization
- **Context API** for state management

### Backend
- **Node.js** & **Express**
- **MongoDB Atlas** with **Prisma ORM**
- **JWT** & **Passport.js** (Google OAuth)

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Google OAuth credentials

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Magnus1X/finance-tracker.git
   cd finance-tracker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Update .env with your MongoDB URI and credentials
   npx prisma generate
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## Deployment

The application is ready for deployment on platforms like Render, Railway, or Vercel.

- **Backend**: Set `NODE_ENV=production` and configure environment variables.
- **Frontend**: maintain `VITE_API_URL` pointing to your deployed backend.

## License

MIT License.
