import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, AlertCircle, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type Inputs = z.infer<typeof schema>;

export const ForgotPasswordForm: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Inputs) => {
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.message || 'Error processing request');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md w-full space-y-8 glass-card p-10 rounded-3xl shadow-2xl border border-white/20 text-center animate-fade-in">
        <div className="mx-auto h-16 w-16 bg-appex-cyan/20 rounded-full flex items-center justify-center mb-6">
          <Send className="h-8 w-8 text-appex-cyan" />
        </div>
        <h2 className="text-3xl font-black text-appex-blue dark:text-white tracking-tight">Transmission Sent</h2>
        <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium tracking-tight">
          If an account exists for that email, recovery protocols have been dispatched. Check your inbox for further instructions.
        </p>
        <Link href="/auth/login" className="mt-8 flex items-center justify-center gap-2 text-appex-purple hover:text-appex-cyan transition-colors font-black uppercase text-xs tracking-widest">
          <ArrowLeft className="h-4 w-4" /> Return to Connection Node
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full space-y-8 glass-card p-10 rounded-3xl shadow-2xl border border-white/20 transition-all duration-300">
      <div className="text-center">
        <h2 className="text-4xl font-black text-appex-blue dark:text-white tracking-tight">Key Recovery</h2>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 font-medium italic uppercase tracking-widest">
          Password Reset Protocol
        </p>
      </div>

      <form className="mt-10 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 text-center px-4 leading-relaxed">
            Enter your network email below. System will transmit a secure access restoration key.
          </p>
          
          <div className="space-y-2">
            <label className="block text-xs font-bold text-appex-blue dark:text-appex-cyan uppercase tracking-widest ml-1">Network Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-appex-cyan transition-colors" />
              </div>
              <input
                {...register('email')}
                className={`appearance-none block w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-appex-navy/30 border-2 ${errors.email ? 'border-red-400' : 'border-appex-blue/10 dark:border-white/10'} rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-appex-cyan/20 focus:border-appex-cyan transition-all`}
                placeholder="name@company.com"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-xs font-bold text-red-700 dark:text-red-400">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 btn-accent font-black uppercase tracking-widest text-sm shadow-xl shadow-appex-cyan/10 hover:shadow-appex-purple/20 transform hover:-translate-y-1 transition-all flex justify-center items-center gap-3"
        >
          {isSubmitting ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Initiate Recovery'}
        </button>

        <div className="text-center">
          <Link href="/auth/login" className="inline-flex items-center gap-2 text-appex-purple hover:text-appex-cyan transition-colors font-black uppercase text-xs tracking-widest">
            <ArrowLeft className="h-4 w-4" /> Recall Connection
          </Link>
        </div>
      </form>
    </div>
  );
};
