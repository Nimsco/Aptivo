import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Brain, Target, TrendingUp, Clock, CheckCircle, Sparkles } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Aptivo</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login"><Button variant="ghost">Log in</Button></Link>
            <Link to="/register"><Button>Get Started</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Turn Your Syllabus Into<br />
          <span className="text-primary">Your Exam Plan</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          AI-powered exam preparation that adapts to your learning style. Track topics, generate quizzes, 
          practice with flashcards, and get personalized study plans.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register"><Button size="lg" className="text-lg px-8">Start Free</Button></Link>
          <Link to="/login"><Button size="lg" variant="outline" className="text-lg px-8">Demo Login</Button></Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <Target className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Track Topics</h3>
              <p className="text-muted-foreground">Break down your syllabus into manageable topics and track your confidence levels.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Sparkles className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered Quizzes</h3>
              <p className="text-muted-foreground">Generate custom quizzes based on your weak areas and exam requirements.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Clock className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Study Plans</h3>
              <p className="text-muted-foreground">Get personalized study schedules optimized for your exam date.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <CheckCircle className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Spaced Repetition</h3>
              <p className="text-muted-foreground">Flashcards with intelligent scheduling to maximize retention.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Progress Analytics</h3>
              <p className="text-muted-foreground">Visualize your readiness score and identify areas needing attention.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Brain className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Tutor</h3>
              <p className="text-muted-foreground">Chat with an AI tutor that understands your course materials.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-primary/10 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Ace Your Exams?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of students who are studying smarter with Aptivo.
          </p>
          <Link to="/register"><Button size="lg" className="text-lg px-8">Get Started for Free</Button></Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Aptivo. Built for students, by students.</p>
        </div>
      </footer>
    </div>
  )
}
