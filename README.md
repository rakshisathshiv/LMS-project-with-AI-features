# LMS Platform with AI Integrations

A production-ready full-stack Learning Management System complete with a student dashboard, high-quality video integration, automated generated metrics, and an AI-powered conversational bot.

## Core Features
1. **Interactive Learning Environment**: Resume your courses precisely where you paused, with automatic tracking.
2. **AI Chatbot**: Context-aware AI responses inside course pages.
3. **Downloadable Certificates**: PDF extraction upon hitting milestones.
4. **JWT Security**: Refresh-token cookie rotation paired with access tokens.

## Tech Stack
- **Frontend**: Next.js 16 (App Router), Zustand, Tailwind CSS, Lucide Icons, jsPDF.
- **Backend**: Express.js, Prisma ORM, JSON Web Tokens (JWT), Bcrypt.
- **Database**: SQLite (Configured to instantly migrate to MySQL cleanly by only switching the `url` property in `schema.prisma`).

## Setup Instructions

### 1. Database & Backend Configuration

```bash
cd backend
npm install
npx prisma db push
npx prisma db seed
# Start standard dev server
npm run dev
```

### 2. Frontend Configuration

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

## Running the Application
Ensure both nodes are active concurrently.
- Express Backend operates inherently on `http://localhost:5000`
- Next.js Web Application boots up seamlessly on `http://localhost:3000`

## Deployment Strategy
The overarching file structure is prepared directly for zero-config Vercel pushes (`frontend/`) and arbitrary node environments (`backend/`). Make sure to deploy valid database URLs and rotate JWT secrets accordingly.
