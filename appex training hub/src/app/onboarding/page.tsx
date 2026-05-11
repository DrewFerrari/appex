"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"

interface OnboardingAnswers {
  business_type?: string
  experience_level?: string
  learning_goals?: string[]
  time_commitment?: string
}

const questions = [
  {
    id: 'business_type',
    question: 'What type of business do you operate?',
    type: 'single_select',
    options: [
      { value: 'RETAIL', label: 'Retail Store', icon: 'Retail Store', description: 'General retail, supermarkets, shops' },
      { value: 'RESTAURANT', label: 'Restaurant/Cafe', icon: 'Restaurant', description: 'Food service, restaurants, cafes' },
      { value: 'HARDWARE', label: 'Hardware Store', icon: 'Hardware', description: 'Hardware, tools, building supplies' },
      { value: 'GROCERY', label: 'Grocery Store', icon: 'Grocery', description: 'Grocery stores, food markets' },
      { value: 'PHARMACY', label: 'Pharmacy', icon: 'Pharmacy', description: 'Pharmacies, medical supplies' },
      { value: 'BUTCHERY', label: 'Butchery', icon: 'Butchery', description: 'Meat shops, butcheries' },
      { value: 'MULTIPLE', label: 'Multiple Business Types', icon: 'Multiple', description: 'I operate multiple types of businesses' }
    ]
  },
  {
    id: 'experience_level',
    question: 'What is your experience with POS systems?',
    type: 'single_select',
    options: [
      { value: 'BEGINNER', label: 'Beginner', icon: 'Beginner', description: 'First time using POS systems' },
      { value: 'INTERMEDIATE', label: 'Intermediate', icon: 'Intermediate', description: 'Used POS systems before' },
      { value: 'ADVANCED', label: 'Advanced', icon: 'Advanced', description: 'Expert user, looking for advanced features' }
    ]
  },
  {
    id: 'learning_goals',
    question: 'What are your primary learning goals? (Select all that apply)',
    type: 'multi_select',
    options: [
      { value: 'basic_ops', label: 'Basic Operations', icon: 'Basic', description: 'Daily operations, sales, customer management' },
      { value: 'inventory', label: 'Inventory Management', icon: 'Inventory', description: 'Stock control, reordering, tracking' },
      { value: 'sales', label: 'Sales & Reporting', icon: 'Sales', description: 'Sales analytics, reports, insights' },
      { value: 'staff', label: 'Staff Management', icon: 'Staff', description: 'Employee management, permissions, roles' },
      { value: 'advanced', label: 'Advanced Features', icon: 'Advanced', description: 'Loyalty programs, promotions, integrations' }
    ]
  },
  {
    id: 'time_commitment',
    question: 'How much time can you dedicate weekly?',
    type: 'single_select',
    options: [
      { value: '1-2', label: '1-2 hours per week', icon: '1-2 hours', description: 'Light learning pace' },
      { value: '3-5', label: '3-5 hours per week', icon: '3-5 hours', description: 'Moderate learning pace' },
      { value: '5-10', label: '5-10 hours per week', icon: '5-10 hours', description: 'Dedicated learning pace' },
      { value: '10+', label: '10+ hours per week', icon: '10+ hours', description: 'Intensive learning pace' }
    ]
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<OnboardingAnswers>({})
  const [isLoading, setIsLoading] = useState(false)

  const currentQuestion = questions[step - 1]
  const progress = (step / questions.length) * 100

  const handleSingleSelect = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value
    })
  }

  const handleMultiSelect = (value: string, checked: boolean) => {
    const currentGoals = answers.learning_goals || []
    const newGoals = checked
      ? [...currentGoals, value]
      : currentGoals.filter((goal: string) => goal !== value)
    
    setAnswers({
      ...answers,
      learning_goals: newGoals
    })
  }

  const handleNext = () => {
    if (step < questions.length) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
      })

      if (!response.ok) {
        throw new Error('Failed to save onboarding data')
      }

      const data = await response.json()
      
      // Redirect to dashboard with learning path
      router.push('/dashboard?onboarding=complete')
    } catch (error) {
      console.error('Onboarding error:', error)
      // Still redirect to dashboard even if onboarding fails
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const isCurrentStepValid = () => {
    if (currentQuestion.type === 'single_select') {
      return answers[currentQuestion.id as keyof OnboardingAnswers] !== undefined
    } else if (currentQuestion.type === 'multi_select') {
      const goals = answers.learning_goals || []
      return goals.length > 0
    }
    return false
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Personalize Your Learning Journey
              </h1>
              <span className="text-sm text-gray-500">
                Step {step} of {questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              This helps us create the perfect learning path for you
            </p>
          </div>

          {/* Question Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentQuestion.type === 'single_select' && (
                <RadioGroup
                  value={answers[currentQuestion.id as keyof OnboardingAnswers] as string || ''}
                  onValueChange={handleSingleSelect}
                >
                  {currentQuestion.options.map((option) => (
                    <div key={option.value} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="font-medium">
                          {option.label}
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">
                        {option.description}
                      </p>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentQuestion.type === 'multi_select' && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <div key={option.value} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={option.value}
                          checked={(answers.learning_goals || []).includes(option.value)}
                          onCheckedChange={(checked) => handleMultiSelect(option.value, checked as boolean)}
                        />
                        <Label htmlFor={option.value} className="font-medium">
                          {option.label}
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">
                        {option.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isCurrentStepValid() || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : step === questions.length ? (
                <>
                  Complete Setup
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          {/* Skip Option */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
