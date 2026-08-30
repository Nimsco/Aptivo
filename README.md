# Aptivo - AI-Powered Exam Preparation Platform

Turn your syllabus into your exam plan. Aptivo is an intelligent exam preparation system that helps students track topics, generate quizzes, practice with flashcards, and get personalized study plans.

![Aptivo](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- 📚 **Topic Tracking** - Break down your syllabus into manageable topics and track confidence levels
- 🤖 **AI-Powered Quizzes** - Generate custom quizzes based on weak areas
- ⏰ **Smart Study Plans** - Personalized schedules optimized for exam dates
- 🔄 **Spaced Repetition** - Flashcards with intelligent scheduling
- 📊 **Progress Analytics** - Visualize readiness scores and identify areas needing attention
- 💬 **AI Tutor** - Chat with an AI tutor that understands your course materials

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Radix UI Components
- React Router
- TanStack Query

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcryptjs

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aptivo.git
cd aptivo
```

2. Install dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials and API keys
```

4. Set up the database:
```bash
cd server
npx prisma migrate dev
npm run db:seed
```

5. Start development servers:
```bash
# From root directory
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Demo Credentials

After running the seed script, you can login with:
- Email: `demo@aptivo.com`
- Password: `demo123`

## Project Structure

```
aptivo/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── lib/
├── server/          # Express backend
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── providers/
├── prisma/          # Database schema
└── uploads/         # Document storage
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token

### Exams
- `GET /api/exams` - List all exams
- `POST /api/exams` - Create exam
- `GET /api/exams/:id` - Get exam details
- `PATCH /api/exams/:id` - Update exam
- `DELETE /api/exams/:id` - Delete exam

### Study Plans
- `POST /api/study-plans/generate` - Generate study plan
- `GET /api/study-plans/:examId` - Get study plans for exam

### Flashcards
- `GET /api/flashcards/decks` - List flashcard decks
- `POST /api/flashcards/decks` - Create deck
- `POST /api/flashcards/cards` - Add card
- `POST /api/flashcards/review` - Review card
- `GET /api/flashcards/due` - Get due cards

### Quizzes
- `GET /api/quizzes` - List quizzes
- `POST /api/quizzes` - Create quiz
- `POST /api/quizzes/:id/start` - Start quiz attempt
- `POST /api/quizzes/:id/submit` - Submit answers

### AI Tutor
- `POST /api/tutor/sessions` - Create chat session
- `GET /api/tutor/sessions` - List sessions
- `POST /api/tutor/chat` - Send message

### Analytics
- `GET /api/analytics` - Get user analytics

## License

MIT License - feel free to use this project for learning or personal use.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
