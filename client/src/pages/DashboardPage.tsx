import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, BookOpen, Clock, TrendingUp, Target } from 'lucide-react'

export default function DashboardPage() {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/exams')
      .then(res => res.json())
      .then(data => {
        if (data.success) setExams(data.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Track your exam preparation progress</p>
        </div>
        <Button asChild>
          <Link to="/exam/new"><PlusCircle className="mr-2 h-4 w-4" /> Add Exam</Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <BookOpen className="h-10 w-10 text-primary bg-primary/10 p-2 rounded-lg" />
              <div>
                <p className="text-sm text-muted-foreground">Total Exams</p>
                <p className="text-2xl font-bold">{exams.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Target className="h-10 w-10 text-primary bg-primary/10 p-2 rounded-lg" />
              <div>
                <p className="text-sm text-muted-foreground">Topics Tracked</p>
                <p className="text-2xl font-bold">{exams.reduce((acc, e) => acc + (e._count?.topics || 0), 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Clock className="h-10 w-10 text-primary bg-primary/10 p-2 rounded-lg" />
              <div>
                <p className="text-sm text-muted-foreground">Study Hours</p>
                <p className="text-2xl font-bold">12.5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="h-10 w-10 text-primary bg-primary/10 p-2 rounded-lg" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Readiness</p>
                <p className="text-2xl font-bold">68%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exams List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Exams</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : exams.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No exams yet</h3>
              <p className="text-muted-foreground mb-4">Add your first exam to start tracking your preparation</p>
              <Button asChild>
                <Link to="/exam/new">Add Your First Exam</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exams.map((exam: any) => (
              <Card key={exam.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <Link to={`/exam/${exam.id}`}>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{exam.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{exam.module || 'No module'}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Exam Date</span>
                        <span>{new Date(exam.examDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Readiness</span>
                        <span className="font-medium">{exam.readiness}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${exam.readiness}%` }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
