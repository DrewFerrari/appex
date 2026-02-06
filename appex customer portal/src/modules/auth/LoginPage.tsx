import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '@/components/logo'
import type { User } from '@/types'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(false),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError('')

    try {
      // For demo purposes: Check for super admin credentials
      if (data.email === 'andrewmunyanyi1@gmail.com' && data.password === 'andrew123') {
        const superAdmin: User = {
          id: 'super-admin',
          name: 'Super Admin',
          email: 'andrewmunyanyi1@gmail.com',
          phone: '+263780808358',
          role: 'owner',
          businessId: 'demo-business',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        const { login, setPermissions } = useAuthStore.getState()
        login(superAdmin, 'demo-token')
        setPermissions(['all'])
        navigate('/dashboard')
        return
      }

      const response = await authService.login(data)
      login(response.user, response.token)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Logo size="lg" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Appex</CardTitle>
          <CardDescription>
            Sign in to your Business Operating System
          </CardDescription>
          <div className="mt-2 p-2 bg-background-tertiary rounded text-xs text-text-muted">
            <strong>Demo Credentials:</strong><br />
            Email: andrewmunyanyi1@gmail.com<br />
            Password: andrew123
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-status-error/10 border border-status-error/20 text-status-error p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-text-primary">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                className={errors.email ? 'border-status-error' : ''}
              />
              {errors.email && (
                <p className="text-status-error text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-text-primary">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                className={errors.password ? 'border-status-error' : ''}
              />
              {errors.password && (
                <p className="text-status-error text-xs">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="rememberMe"
                type="checkbox"
                {...register('rememberMe')}
                className="rounded border-background-tertiary bg-background-secondary text-accent-blue focus:ring-accent-blue"
              />
              <label htmlFor="rememberMe" className="text-sm text-text-secondary">
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Link
              to="/forgot-password"
              className="text-accent-blue hover:underline text-sm"
            >
              Forgot your password?
            </Link>
            <div className="text-sm text-text-secondary">
              Don't have an account?{' '}
              <Link to="/register" className="text-accent-blue hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
