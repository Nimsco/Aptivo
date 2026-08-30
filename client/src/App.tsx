import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'

// Pages
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import ExamDetailPage from '@/pages/ExamDetailPage'
import StudyPlanPage from '@/pages/StudyPlanPage'
import FlashcardsPage from '@/pages/FlashcardsPage'
import QuizPage from '@/pages/QuizPage'
import TutorPage from '@/pages/TutorPage'
import AnalyticsPage from '@/pages/AnalyticsPage'
import SettingsPage from '@/pages/SettingsPage'

// Layout
import MainLayout from '@/layouts/MainLayout'

// Auth Guard
import AuthGuard from '@/components/AuthGuard'

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<AuthGuard><MainLayout><DashboardPage /></MainLayout></AuthGuard>} />
        <Route path="/exam/:id" element={<AuthGuard><MainLayout><ExamDetailPage /></MainLayout></AuthGuard>} />
        <Route path="/exam/:id/study-plan" element={<AuthGuard><MainLayout><StudyPlanPage /></MainLayout></AuthGuard>} />
        <Route path="/flashcards" element={<AuthGuard><MainLayout><FlashcardsPage /></MainLayout></AuthGuard>} />
        <Route path="/quizzes" element={<AuthGuard><MainLayout><QuizPage /></MainLayout></AuthGuard>} />
        <Route path="/tutor" element={<AuthGuard><MainLayout><TutorPage /></MainLayout></AuthGuard>} />
        <Route path="/analytics" element={<AuthGuard><MainLayout><AnalyticsPage /></MainLayout></AuthGuard>} />
        <Route path="/settings" element={<AuthGuard><MainLayout><SettingsPage /></MainLayout></AuthGuard>} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
