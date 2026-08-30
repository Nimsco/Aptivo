# Aptivo# Aptivo

> **Turn your syllabus into your exam plan.**

Aptivo is an AI-powered exam preparation platform that transforms syllabi, lecture notes, PDFs, and past papers into a personalized study system.

Instead of asking students to figure out what to study next, Aptivo analyzes their study material, exam deadline, available study time, and performance to recommend what they should study, practice, and review.

## Overview

Aptivo combines:

* AI-powered study planning
* Document and syllabus analysis
* Personalized daily study tasks
* Smart flashcards
* Spaced repetition
* Adaptive quizzes
* Mock exams
* Weak-topic detection
* AI tutoring
* Exam readiness analytics
* Progress tracking

The core workflow is:

```text
Study Material
      ↓
AI Analysis
      ↓
Topics & Priorities
      ↓
Personalized Study Plan
      ↓
Learn → Practice → Review
      ↓
Weakness Detection
      ↓
Targeted Revision
      ↓
Mock Exam
      ↓
Improved Exam Readiness
```

---

## Product Philosophy

Aptivo is not designed to be another generic AI chatbot.

The goal is to solve a more specific problem:

> **Students often have enough study material but do not know what to study, when to study it, or which topics they are actually weak at.**

Aptivo therefore focuses on:

* prioritization
* active recall
* spaced repetition
* adaptive practice
* exam-oriented scheduling
* measurable progress

---

# Features

## AI Study Plans

Give Aptivo your:

* exam date
* syllabus
* study material
* available study time
* target grade

Aptivo generates a practical study plan organized around the time available before the exam.

---

## Document Analysis

Upload:

* PDF
* DOCX
* TXT
* images
* pasted text

Aptivo extracts and organizes the material into topics and subtopics.

The system can associate document sections with specific study topics.

---

## Exam Management

Create multiple exams and track each one independently.

Each exam includes:

* exam date
* countdown
* target grade
* subjects
* topics
* study plan
* uploaded material
* practice history
* readiness score

---

## Daily Study Plan

The dashboard answers:

> **What should I study today?**

Each task includes:

* topic
* activity type
* estimated duration
* priority
* difficulty
* completion state

Example:

```text
Today's Plan

□ Review Database Normalization    25 min
□ SQL Practice Quiz                20 min
□ Flashcard Review                 10 min
□ ER Diagram Practice              25 min
```

---

## Smart Flashcards

Aptivo generates flashcards from the user's study material.

Supported styles include:

* definitions
* explanations
* comparisons
* applications
* scenarios
* common mistakes

Users can rate cards:

* Again
* Hard
* Good
* Easy

These ratings are used to schedule future reviews.

---

## Spaced Repetition

Aptivo stores review history and schedules future reviews based on:

* previous performance
* difficulty
* review frequency
* time since last review

The implementation is designed to encourage regular active recall rather than passive rereading.

---

## Adaptive Quizzes

Create quizzes by:

* topic
* subject
* exam
* difficulty
* number of questions

Question types include:

* multiple choice
* true/false
* scenario
* application
* concept questions

After a quiz, Aptivo identifies areas that need additional practice.

---

## Mock Exams

Create timed mock exams using the user's study material.

Features include:

* configurable question count
* configurable difficulty
* timer
* question navigation
* mark-for-review
* scoring
* topic-level performance

After submission, Aptivo provides a recovery plan focused on weak areas.

---

## Weak Topic Radar

Aptivo identifies topics where the student is struggling.

It uses signals such as:

* quiz accuracy
* repeated mistakes
* flashcard performance
* review recency
* reported confidence
* recent performance

Topics are categorized as:

```text
Strong
Needs Review
Weak
Critical
```

Example:

```text
Recursion
38%
Critical

Recent issues:
- repeated quiz mistakes
- low confidence
- poor flashcard performance
```

---

## AI Tutor

The tutor is context-aware rather than a generic chatbot.

Students can ask:

* Explain this more simply
* Give me an example
* Quiz me
* Give me a hint
* Why was my answer wrong?
* Teach me from the beginning
* Compare these concepts

The tutor prioritizes the student's uploaded study material when answering.

---

## Exam Readiness

Aptivo provides an internal **Readiness Score** based on signals such as:

* topic coverage
* quiz performance
* mock exam performance
* review consistency
* weak-topic count
* recent performance

Example:

```text
Exam Readiness

74%

Largest improvement opportunity:
Graph Algorithms
```

The readiness score is an internal estimate and is not intended to represent a scientifically validated probability of passing an exam.

---

## Analytics

Students can monitor:

* total study time
* weekly study time
* quiz performance
* mock exam performance
* topic mastery
* flashcard review activity
* strongest topics
* weakest topics

Analytics are designed to answer:

> **What should I do differently?**

rather than simply displaying numbers.

---

# Tech Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* React Router
* TanStack Query
* React Hook Form
* Zod
* Lucide React

## Backend

* Node.js
* Express
* TypeScript

## Database

* PostgreSQL
* Prisma ORM

## AI

Provider abstraction supporting:

* Qwen
* OpenAI-compatible providers
* development mock provider

The application is designed so the AI provider can be changed without rewriting the rest of the application.

## Payments

Stripe integration architecture for subscriptions.

## Storage

Storage-provider abstraction designed for:

* local development
* S3-compatible storage
* cloud storage providers

---

# Architecture

Aptivo follows a separation between frontend, backend, database, AI services, and external providers.

```text
                   ┌───────────────────┐
                   │     React App     │
                   │   TypeScript UI   │
                   └─────────┬─────────┘
                             │
                             │ HTTP
                             ▼
                   ┌───────────────────┐
                   │  Express Backend  │
                   │     REST API      │
                   └───────┬─────┬─────┘
                           │     │
              ┌────────────┘     └────────────┐
              ▼                               ▼
      ┌───────────────┐               ┌────────────────┐
      │   PostgreSQL  │               │   AI Service   │
      │    + Prisma   │               │   Provider     │
      └───────────────┘               └───────┬────────┘
                                              │
                               ┌──────────────┼──────────────┐
                               ▼              ▼              ▼
                             Qwen        OpenAI-compatible   Mock
```

---

# Project Structure

```text
aptivo/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── ...
│   │
│   └── ...
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── plugins/
│   │   ├── prompts/
│   │   ├── providers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── validators/
│   │
│   └── ...
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

The exact directory structure may evolve as the application grows.

---

# Core Data Model

The database contains entities similar to:

```text
User
 ├── Exams
 ├── Subscriptions
 ├── UsageRecords
 ├── Preferences
 └── Notifications

Exam
 ├── Subjects
 ├── Topics
 ├── Documents
 ├── StudyPlans
 ├── Quizzes
 ├── FlashcardDecks
 └── MockExams

Topic
 ├── child Topics
 ├── DocumentChunks
 ├── Flashcards
 ├── Questions
 └── Performance history
```

Primary models include:

* User
* Account
* Session
* Subscription
* UsageRecord
* Exam
* Subject
* Topic
* Document
* DocumentChunk
* StudyPlan
* StudyTask
* StudySession
* FlashcardDeck
* Flashcard
* FlashcardReview
* Quiz
* Question
* QuizAttempt
* QuizAnswer
* MockExam
* MockExamAttempt
* MockExamAnswer
* ChatSession
* ChatMessage
* Notification
* UserPreference

---

# AI Provider Architecture

Aptivo does not directly depend on one AI vendor.

The backend exposes a provider interface similar to:

```ts
interface AIProvider {
  generateText(input: GenerateTextInput): Promise<string>;

  generateStructured<T>(
    input: StructuredGenerationInput,
    schema: ZodSchema<T>
  ): Promise<T>;
}
```

Providers can implement this interface:

```text
AIProvider
 ├── QwenProvider
 ├── OpenAICompatibleProvider
 └── MockProvider
```

The active provider is selected through environment configuration.

Example:

```env
AI_PROVIDER=qwen
```

or:

```env
AI_PROVIDER=openai-compatible
```

or:

```env
AI_PROVIDER=mock
```

This allows development without requiring a paid AI provider.

---

# AI Services

AI functionality is separated into services such as:

```text
generateStudyPlan()
generateFlashcards()
generateQuiz()
generateMockExam()
generateSummary()
generateTopicExplanation()
generateTutorResponse()
analyzeDocument()
extractTopics()
```

AI-generated structured data is validated before it is stored in the database.

AI failures are handled through:

* validation
* retries
* timeouts
* graceful errors
* provider abstraction
* mock fallback during development

---

# Security

Aptivo is designed with the following security requirements:

* password hashing
* authentication middleware
* authorization middleware
* request validation
* rate limiting
* secure environment variables
* file type validation
* file size limits
* secure API access
* CORS configuration
* protected document access

A user must never be able to access another user's resources simply by changing an ID in a request.

AI API keys are stored on the server and are never exposed to the browser.

---

# Environment Variables

Copy:

```text
.env.example
```

to:

```text
.env
```

Then configure the required variables.

Example:

```env
DATABASE_URL=

JWT_SECRET=
JWT_REFRESH_SECRET=

AI_PROVIDER=qwen

QWEN_API_KEY=
QWEN_BASE_URL=
AI_MODEL=

STORAGE_PROVIDER=
STORAGE_BUCKET=
STORAGE_REGION=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

CLIENT_URL=
SERVER_URL=
```

Never commit `.env` to Git.

---

# Installation

## Requirements

Recommended development environment:

* Node.js 20+
* npm
* PostgreSQL 15+
* Git

Optional:

* Qwen API credentials
* Stripe account
* cloud storage credentials

---

## Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd aptivo
```

---

## Install dependencies

If the project uses a monorepo/workspace setup:

```bash
npm install
```

Otherwise install frontend and backend dependencies separately:

```bash
cd client
npm install

cd ../server
npm install
```

---

# Database Setup

Configure `DATABASE_URL` in `.env`.

Example:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/aptivo"
```

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

Seed development data:

```bash
npm run db:seed
```

Available Prisma commands may include:

```bash
npx prisma studio
npx prisma migrate dev
npx prisma generate
```

---

# Development

Start the development environment using the project's configured command.

Typical setup:

```bash
npm run dev
```

Or, if frontend and backend are started independently:

```bash
cd server
npm run dev
```

and:

```bash
cd client
npm run dev
```

The Vite development server normally runs on a local port such as:

```text
http://localhost:5173
```

The backend port depends on the server configuration.

---

# Mock AI Provider

For development without an AI API:

```env
AI_PROVIDER=mock
```

The mock provider exists to allow UI and application-flow development without consuming API credits.

Mock responses should be clearly separated from production AI responses.

---

# Qwen Configuration

To use Qwen through the backend, configure the relevant environment variables:

```env
AI_PROVIDER=qwen
QWEN_API_KEY=your_api_key
QWEN_BASE_URL=your_base_url
AI_MODEL=your_model
```

The exact model and endpoint depend on the Qwen provider configuration being used.

Never put the Qwen API key in frontend code.

---

# Stripe

Stripe is used for subscription architecture.

Configure:

```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

Subscription entitlement checks should happen on the backend through a centralized entitlement service.

Example:

```text
canCreateExam(user)
canUploadDocument(user)
canGenerateQuiz(user)
canUseTutor(user)
```

Do not scatter subscription checks across React components.

---

# Available Routes

## Public

```text
/
 /login
 /signup
 /forgot-password
 /reset-password
 /pricing
```

## Authenticated

```text
/dashboard
/exams
/exams/new
/exams/:id
/study-plan
/study/:taskId
/flashcards
/quizzes
/mock-exams
/weak-topics
/tutor
/library
/analytics
/profile
/settings
/subscription
```

---

# API

Representative endpoints:

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh

GET    /api/dashboard

GET    /api/exams
POST   /api/exams
GET    /api/exams/:id
PATCH  /api/exams/:id
DELETE /api/exams/:id

POST   /api/exams/:id/materials
GET    /api/exams/:id/materials
DELETE /api/materials/:id

GET    /api/exams/:id/topics
PATCH  /api/topics/:id

POST   /api/exams/:id/generate-plan
GET    /api/exams/:id/plan

GET    /api/quizzes
POST   /api/quizzes
GET    /api/quizzes/:id
POST   /api/quizzes/:id/submit

GET    /api/flashcards
POST   /api/flashcards/generate
POST   /api/flashcards/:id/review

GET    /api/mock-exams
POST   /api/mock-exams
POST   /api/mock-exams/:id/start
POST   /api/mock-exams/:id/submit

GET    /api/weak-topics

GET    /api/analytics

POST   /api/tutor/chat
GET    /api/tutor/sessions

GET    /api/subscription
POST   /api/subscription/checkout

POST   /api/webhooks/stripe
```

The exact API surface may evolve as implementation progresses.

---

# Subscription Model

Aptivo follows a freemium model.

## Free

Example limits:

* 1 active exam
* limited document processing
* limited AI generations
* basic flashcards
* basic quizzes
* basic analytics

## Pro

Example features:

* multiple active exams
* increased document limits
* advanced study plans
* adaptive quizzes
* mock exams
* advanced analytics
* AI tutor
* increased AI usage
* expanded storage

The specific pricing and quotas are configurable.

---

# Development Principles

## Functionality over quantity

Do not build dozens of shallow features.

Prioritize:

```text
Exam
→ Material
→ Topics
→ Plan
→ Study
→ Practice
→ Weakness
→ Review
→ Mock Exam
```

## AI must be grounded

When possible, AI output should use the student's own material.

The system should not falsely claim that information came from a document when it did not.

## No fake functionality

Buttons must perform real actions or clearly indicate unavailable functionality.

## No hard-coded secrets

All credentials belong in environment variables.

## No giant components

Keep business logic, UI, API calls, and database operations separated.

---

# Testing

Tests should cover critical behavior including:

* registration
* login
* authorization
* exam creation
* exam ownership
* document ownership
* document processing
* quiz scoring
* flashcard review
* readiness calculation
* study-plan generation
* API validation
* subscription entitlement

Before deployment, verify:

```text
✓ TypeScript
✓ Lint
✓ Tests
✓ Database migrations
✓ API routes
✓ Authentication
✓ Authorization
✓ AI integration
✓ Responsive UI
```

---

# Roadmap

## Phase 1

* authentication
* application shell
* database
* exam management
* subjects
* topics

## Phase 2

* document uploads
* document extraction
* AI topic extraction
* study plans

## Phase 3

* flashcards
* spaced repetition
* quizzes
* quiz analytics

## Phase 4

* mock exams
* recovery plans
* weak-topic radar
* readiness score

## Phase 5

* contextual AI tutor
* advanced analytics
* notifications

## Phase 6

* subscriptions
* Stripe
* usage limits
* deployment

## Future

Potential extensions:

* mobile application
* collaborative study
* instructor tools
* university integrations
* calendar integration
* additional document formats
* advanced retrieval/RAG
* multilingual support

---

# Demo Data

Development environments can use seeded data for:

**Alex Morgan**

Example exams:

* Data Structures
* Database Systems
* Computer Networks

The seed data includes:

* topics
* study tasks
* flashcards
* quiz attempts
* weak topics
* progress data

Demo data must never be used as a substitute for real user data in production.

---

# Privacy

Aptivo may process user-provided educational material.

The application should:

* restrict files to their owners
* protect API endpoints
* avoid logging document contents
* avoid logging secrets
* support account deletion
* support data deletion
* keep private study material private

---

# License

Choose an appropriate license before publishing the repository.

Example:

```text
MIT License
```

Do not add a license automatically if the project contains third-party code with incompatible licensing requirements.

---

# Contributing

Contributions should follow these principles:

1. Keep changes focused.
2. Preserve the existing architecture.
3. Add validation for new API endpoints.
4. Add tests for important behavior.
5. Do not commit secrets.
6. Update documentation when functionality changes.

---

# Status

**Development / MVP**

Aptivo is being developed as a full-stack AI-powered exam preparation platform.

The application is intended to evolve from an MVP into a production SaaS product.

---

## Core Idea

Aptivo is built around one simple question:

> **What should I study next?**

Everything in the product should help answer that question more accurately.
