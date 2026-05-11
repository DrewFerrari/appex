"use client"

import { useState, useEffect } from "react"
import { Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react"

interface Question {
  id: number
  text: string
  options: string[]
  correct: number
  explanation: string
}

interface AssessmentData {
  courseId: string
  courseTitle: string
  passingScore: number
  questions: Question[]
}

interface AssessmentTestProps {
  courseId?: string
  moduleId?: string
  onComplete?: (certificate: any) => void
}

export function AssessmentTest({ courseId, moduleId, onComplete }: AssessmentTestProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [timeRemaining, setTimeRemaining] = useState(3600) // 60 minutes in seconds
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [score, setScore] = useState<any>(null)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    // Fetch assessment questions
    fetchAssessment()
  }, [courseId, moduleId])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (testStarted && !testCompleted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            submitTest()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [testStarted, testCompleted])

  const fetchAssessment = async () => {
    try {
      const response = await fetch(`/api/assessments${courseId ? `?course=${courseId}` : ''}${moduleId ? `&module=${moduleId}` : ''}`)
      const data = await response.json()
      setQuestions(data.questions || [])
    } catch (error) {
      console.error("Error fetching assessment:", error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const submitTest = async () => {
    const correctAnswers = questions.reduce((count, q) => {
      return count + (answers[q.id] === q.correct ? 1 : 0)
    }, 0)
    
    const percentage = (correctAnswers / questions.length) * 100
    const passed = correctAnswers >= 16
    
    setScore({
      correct: correctAnswers,
      total: questions.length,
      percentage,
      passed
    })
    
    setTestCompleted(true)
    setShowResults(true)
    
    // Save results to database
    try {
      await fetch('/api/assessments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          moduleId,
          score: correctAnswers,
          total: questions.length,
          percentage,
          passed,
          answers
        })
      })
    } catch (error) {
      console.error("Error submitting assessment:", error)
    }
    
    if (passed) {
      generateCertificate()
    }
  }

  const generateCertificate = async () => {
    try {
      const response = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          recipientName: "User Name", // Would get from user profile
          score: score.correct,
          total: questions.length
        })
      })
      
      const certificate = await response.json()
      onComplete?.(certificate)
    } catch (error) {
      console.error("Error generating certificate:", error)
    }
  }

  if (!testStarted) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Test Your Knowledge?</h2>
          <p className="text-gray-600 mb-6">
            This assessment contains {questions.length} multiple-choice questions.
            You need to answer at least 16 correctly to pass and earn your certificate.
          </p>
          
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Test Details:</h3>
            <ul className="space-y-2 text-left">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Time Limit: 60 minutes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Passing Score: 16/20 (80%)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Certificate awarded upon passing</span>
              </li>
            </ul>
          </div>
          
          <button
            onClick={() => setTestStarted(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
          >
            Start Test
          </button>
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className={`bg-white rounded-2xl shadow-xl p-8 text-center ${
          score.passed ? 'border-t-4 border-emerald-500' : 'border-t-4 border-red-500'
        }`}>
          {score.passed ? (
            <>
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h2>
              <p className="text-gray-600 mb-4">You passed the assessment!</p>
              <div className="text-4xl font-bold text-emerald-600 mb-4">
                {score.correct}/{score.total}
              </div>
              <p className="text-gray-600 mb-6">Your certificate is being generated...</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Yet</h2>
              <p className="text-gray-600 mb-4">You scored {score.correct}/{score.total}</p>
              <p className="text-gray-600 mb-6">You need 16 correct answers to pass.</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-xl"
              >
                Retake Test
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-500">Question {currentQuestion + 1} of {questions.length}</span>
          <div className="w-64 h-2 bg-gray-200 rounded-full mt-2">
            <div 
              className="h-2 bg-emerald-500 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className={`font-mono text-lg ${
            timeRemaining < 300 ? 'text-red-600 font-bold' : 'text-gray-700'
          }`}>
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {questions[currentQuestion]?.text}
        </h3>
        
        <div className="space-y-3">
          {questions[currentQuestion]?.options.map((option, idx) => (
            <label
              key={idx}
              className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                answers[questions[currentQuestion]?.id] === idx
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name={`question-${questions[currentQuestion]?.id}`}
                value={idx}
                checked={answers[questions[currentQuestion]?.id] === idx}
                onChange={() => handleAnswer(questions[currentQuestion]?.id, idx)}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 mr-3"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(prev => prev - 1)}
          disabled={currentQuestion === 0}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        
        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestion(prev => prev + 1)}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={submitTest}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Submit Test
          </button>
        )}
      </div>
    </div>
  )
}
