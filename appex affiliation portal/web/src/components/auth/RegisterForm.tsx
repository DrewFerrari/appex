import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { RegisterData } from '../../types/auth';
import { User, Phone, Lock, Mail, AlertCircle, Shield, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  nationalId: z.string().min(5, 'Please enter a valid National ID'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
  referralCode: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms'),
  acceptPrivacyPolicy: z.boolean().refine(val => val === true, 'You must accept the privacy policy'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      nationalId: '',
      password: '',
      confirmPassword: '',
      referralCode: '',
      acceptTerms: false,
      acceptPrivacyPolicy: false
    }
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setError(null);
    try {
      // In a real scenario, we'd call an 'register' function from AuthContext
      // For now, let's simulate the API call to /api/auth/register
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error occurred during registration');
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md w-full space-y-8 glass-card p-10 rounded-3xl shadow-2xl border border-white/20 text-center animate-fade-in">
        <div className="mx-auto h-20 w-20 bg-appex-cyan/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-12 w-12 text-appex-cyan" />
        </div>
        <h2 className="text-3xl font-black text-appex-blue dark:text-white tracking-tight">Registration Protocol Initialized</h2>
        <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">
          Your credentials have been submitted. Please check your email for a verification link to activate your access node.
        </p>
        <Link href="/auth/login" className="mt-8 block w-full btn-accent py-4 text-center">
          Proceed to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl w-full space-y-8 glass-card p-10 rounded-3xl shadow-2xl border border-white/20 transition-all duration-300">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 bg-appex-blue rounded-2xl flex items-center justify-center shadow-lg mb-6">
          <Shield className="h-8 w-8 text-appex-cyan" />
        </div>
        <h2 className="text-4xl font-black text-appex-blue dark:text-white tracking-tight">Create Network Credentials</h2>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 font-medium italic uppercase tracking-widest">
          AppEx Affiliate Enrollment
        </p>
      </div>

      <form className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Full Name */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-appex-blue dark:text-appex-cyan uppercase tracking-widest ml-1">Legal Identity (Full Name)</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400 group-focus-within:text-appex-cyan transition-colors" />
            </div>
            <input
              {...register('fullName')}
              className={`appearance-none block w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-appex-navy/30 border-2 ${errors.fullName ? 'border-red-400' : 'border-appex-blue/10 dark:border-white/10'} rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-appex-cyan/20 focus:border-appex-cyan transition-all`}
              placeholder="John Doe"
            />
          </div>
          {errors.fullName && <p className="text-xs text-red-500 font-bold ml-1">{errors.fullName.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-appex-blue dark:text-appex-cyan uppercase tracking-widest ml-1">Network Email</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-appex-cyan transition-colors" />
            </div>
            <input
              {...register('email')}
              type="email"
              className={`appearance-none block w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-appex-navy/30 border-2 ${errors.email ? 'border-red-400' : 'border-appex-blue/10 dark:border-white/10'} rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-appex-cyan/20 focus:border-appex-cyan transition-all`}
              placeholder="john@example.com"
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 font-bold ml-1">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-appex-blue dark:text-appex-cyan uppercase tracking-widest ml-1">Mobile Uplink</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-appex-cyan transition-colors" />
            </div>
            <input
              {...register('phone')}
              className={`appearance-none block w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-appex-navy/30 border-2 ${errors.phone ? 'border-red-400' : 'border-appex-blue/10 dark:border-white/10'} rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-appex-cyan/20 focus:border-appex-cyan transition-all`}
              placeholder="+263 7..."
            />
          </div>
          {errors.phone && <p className="text-xs text-red-500 font-bold ml-1">{errors.phone.message}</p>}
        </div>

        {/* National ID */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-appex-blue dark:text-appex-cyan uppercase tracking-widest ml-1">Government ID</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Shield className="h-5 w-5 text-gray-400 group-focus-within:text-appex-cyan transition-colors" />
            </div>
            <input
              {...register('nationalId')}
              className={`appearance-none block w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-appex-navy/30 border-2 ${errors.nationalId ? 'border-red-400' : 'border-appex-blue/10 dark:border-white/10'} rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-appex-cyan/20 focus:border-appex-cyan transition-all`}
              placeholder="12-345678-A-90"
            />
          </div>
          {errors.nationalId && <p className="text-xs text-red-500 font-bold ml-1">{errors.nationalId.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-appex-blue dark:text-appex-cyan uppercase tracking-widest ml-1">Access Key</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-appex-purple transition-colors" />
            </div>
            <input
              {...register('password')}
              type="password"
              className={`appearance-none block w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-appex-navy/30 border-2 ${errors.password ? 'border-red-400' : 'border-appex-blue/10 dark:border-white/10'} rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-appex-purple/20 focus:border-appex-purple transition-all`}
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="text-xs text-red-500 font-bold ml-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-appex-blue dark:text-appex-cyan uppercase tracking-widest ml-1">Confirm Access Key</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-appex-purple transition-colors" />
            </div>
            <input
              {...register('confirmPassword')}
              type="password"
              className={`appearance-none block w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-appex-navy/30 border-2 ${errors.confirmPassword ? 'border-red-400' : 'border-appex-blue/10 dark:border-white/10'} rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-appex-purple/20 focus:border-appex-purple transition-all`}
              placeholder="••••••••"
            />
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500 font-bold ml-1">{errors.confirmPassword.message}</p>}
        </div>

        <div className="md:col-span-2 space-y-4 pt-4 border-t border-appex-blue/5 dark:border-white/5">
          <div className="flex items-center gap-3">
             <input {...register('acceptTerms')} type="checkbox" className="h-5 w-5 text-appex-cyan rounded-md dark:bg-appex-navy" />
             <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">I accept the <Link href="/terms" className="text-appex-cyan font-bold italic">Network protocols and Terms</Link></label>
          </div>
          <div className="flex items-center gap-3">
             <input {...register('acceptPrivacyPolicy')} type="checkbox" className="h-5 w-5 text-appex-cyan rounded-md dark:bg-appex-navy" />
             <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">I accept the <Link href="/privacy" className="text-appex-cyan font-bold italic">Data encryption and Privacy policy</Link></label>
          </div>
        </div>

        {error && (
          <div className="md:col-span-2 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-xs font-bold text-red-700 dark:text-red-400">{error}</span>
          </div>
        )}

        <div className="md:col-span-2 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 btn-accent font-black uppercase tracking-widest text-sm shadow-xl shadow-appex-cyan/10 hover:shadow-appex-purple/20 transform hover:-translate-y-1 transition-all flex justify-center items-center gap-3"
          >
            {isSubmitting ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Initialize Enrollment'}
          </button>
        </div>
      </form>

      <div className="mt-8 text-center bg-appex-blue/5 dark:bg-white/5 p-6 rounded-3xl border border-appex-blue/10 dark:border-white/10">
         <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-tight">
            Already have an active node?{' '}
            <Link href="/auth/login" className="text-appex-purple hover:text-appex-cyan transition-colors font-black uppercase text-xs tracking-widest pl-1">
              Connect to access
            </Link>
          </p>
      </div>
    </div>
  );
};
