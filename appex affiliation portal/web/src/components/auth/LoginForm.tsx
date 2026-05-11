import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../contexts/AuthContext'
import { LoginCredentials } from '../../types/auth'
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional()
})

type LoginFormInputs = z.infer<typeof loginSchema>

export const LoginForm: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<{
    deviceName: string;
    deviceType: 'desktop' | 'mobile' | 'tablet';
  }>({
    deviceName: '',
    deviceType: 'desktop'
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  })

  useEffect(() => {
    // Detect device information
    const userAgent = navigator.userAgent
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent)
    const isTablet = /iPad|Android/i.test(userAgent) && !/Mobile/i.test(userAgent)
    
    let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop'
    if (isMobile) deviceType = 'mobile'
    else if (isTablet) deviceType = 'tablet'
    
    let deviceName = 'Unknown Device'
    if (userAgent.includes('Chrome')) deviceName = 'Chrome Browser'
    else if (userAgent.includes('Firefox')) deviceName = 'Firefox Browser'
    else if (userAgent.includes('Safari')) deviceName = 'Safari Browser'
    else if (userAgent.includes('Edge')) deviceName = 'Edge Browser'
    
    setDeviceInfo({ deviceName, deviceType })
  }, [])

  const onSubmit = async (data: LoginFormInputs) => {
    clearError()
    
    try {
      await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
        deviceName: deviceInfo.deviceName,
        deviceType: deviceInfo.deviceType
      })
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 glass-card p-10 rounded-3xl shadow-2xl border border-white/20">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-appex-blue rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
            <span className="text-appex-cyan font-black text-2xl">A</span>
          </div>
          <h2 className="mt-8 text-center text-4xl font-black text-appex-blue dark:text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
            AppEx Affiliation Portal Management
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-10 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-appex-blue dark:text-appex-cyan uppercase tracking-widest mb-2 ml-1">
                Email Network ID
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-appex-cyan transition-colors" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className={`appearance-none block w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-appex-navy/30 border-2 ${
                    errors.email ? 'border-red-400' : 'border-appex-blue/10 dark:border-white/10'
                  } rounded-2xl placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-appex-cyan/20 focus:border-appex-cyan transition-all`}
                  placeholder="name@company.com"
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <div className="mt-2 flex items-center text-xs text-red-500 font-bold bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                  <AlertCircle className="h-4 w-4 mr-1.5" />
                  {errors.email.message}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-appex-blue dark:text-appex-cyan uppercase tracking-widest mb-2 ml-1">
                Security Access Key
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-appex-purple transition-colors" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`appearance-none block w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-appex-navy/30 border-2 ${
                    errors.password ? 'border-red-400' : 'border-appex-blue/10 dark:border-white/10'
                  } rounded-2xl placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-appex-purple/20 focus:border-appex-purple transition-all`}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-appex-purple transition-colors text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="mt-2 flex items-center text-xs text-red-500 font-bold bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                  <AlertCircle className="h-4 w-4 mr-1.5" />
                  {errors.password.message}
                </div>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center">
                <input
                  {...register('rememberMe')}
                  type="checkbox"
                  className="h-5 w-5 text-appex-cyan focus:ring-appex-cyan/30 border-appex-blue/20 rounded-md bg-white dark:bg-appex-navy ring-offset-0"
                  disabled={isSubmitting}
                />
                <label htmlFor="rememberMe" className="ml-3 block text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Persistent Login
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-bold text-appex-purple hover:text-appex-cyan transition-colors"
                >
                   Lost Password?
                </a>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-2xl bg-red-50 dark:bg-red-900/10 p-4 border border-red-200 dark:border-red-900/30">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-bold text-red-800 dark:text-red-400">
                    Authentication Protocol Failed
                  </h3>
                  <div className="mt-1 text-sm text-red-700 dark:text-red-300/80">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white btn-accent shadow-xl shadow-appex-cyan/10 hover:shadow-appex-purple/20 transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-4 opacity-50">
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Lock className="h-5 w-5" />
                )}
              </span>
              {isSubmitting ? 'Verifying...' : 'Initialize Access'}
            </button>
          </div>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-appex-blue/5 dark:border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-[var(--background)] text-gray-500 font-bold uppercase tracking-tighter">Secure Federated ID</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                className="w-full flex items-center justify-center py-3 px-4 border-2 border-appex-blue/10 dark:border-white/10 rounded-2xl shadow-sm bg-white dark:bg-appex-navy/20 text-sm font-bold text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 focus:outline-none transition-all"
                onClick={() => {/* Handle Google OAuth */}}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center py-3 px-4 border-2 border-appex-blue/10 dark:border-white/10 rounded-2xl shadow-sm bg-white dark:bg-appex-navy/20 text-sm font-bold text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 focus:outline-none transition-all"
                onClick={() => {/* Handle Facebook OAuth */}}
              >
                <svg className="w-5 h-5 mr-3 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.248h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </form>

        {/* Sign Up Link */}
        <p className="mt-10 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-tight">
          New to the Network?{' '}
          <a
            href="/register"
            className="text-appex-cyan hover:text-appex-purple transition-colors font-black uppercase text-xs tracking-widest pl-1"
          >
            Create Credentials
          </a>
        </p>
      </div>
    </div>
  )
}
