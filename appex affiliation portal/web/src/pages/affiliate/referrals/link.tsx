import React, { useState } from 'react';
import Head from 'next/head';
import { Award, Copy, Check, Share2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';

export default function ReferralLinkPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  
  const referralLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/register?ref=${user?.referralCode || 'APPEX123'}`
    : `https://appex-portal.com/register?ref=${user?.referralCode || 'APPEX123'}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Head>
        <title>Access Key - AppEx Affiliation Portal</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <div className="mx-auto h-20 w-20 bg-appex-blue rounded-3xl flex items-center justify-center shadow-2xl shadow-appex-cyan/10 mb-6 transform rotate-3 hover:rotate-0 transition-transform">
               <Award className="h-10 w-10 text-appex-cyan" />
            </div>
            <h1 className="text-4xl font-black text-appex-blue dark:text-white uppercase tracking-tight italic">Your Network Key</h1>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mt-1">Unique Referral Transmission Link</p>
          </div>

          <div className="glass-card rounded-[40px] border border-white/20 p-12 shadow-2xl relative overflow-hidden">
             {/* Decorative Background Mask */}
             <div className="absolute -top-20 -right-20 h-64 w-64 bg-appex-cyan/5 rounded-full blur-3xl"></div>
             <div className="absolute -bottom-20 -left-20 h-64 w-64 bg-appex-purple/5 rounded-full blur-3xl"></div>

             <div className="relative z-10">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 text-center mb-8 px-6 leading-relaxed">
                  Transmit this unique protocol link to your network. Every node that initializes enrollment via this key will be permanently linked to your commission stream.
                </p>

                <div className="bg-appex-blue/5 dark:bg-appex-navy/40 border-2 border-appex-blue/10 dark:border-white/10 rounded-3xl p-2 flex flex-col sm:flex-row items-center gap-2">
                   <div className="flex-1 w-full px-6 py-4 font-mono text-sm text-appex-blue dark:text-appex-cyan truncate">
                      {referralLink}
                   </div>
                   <button 
                     onClick={copyToClipboard}
                     className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all ${
                       copied ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'btn-accent shadow-xl shadow-appex-cyan/10'
                     }`}
                   >
                     {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                     {copied ? 'Captured' : 'Copy Key'}
                   </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                   <button className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-appex-blue/5 dark:bg-white/5 border border-appex-blue/10 dark:border-white/10 hover:border-appex-cyan transition-all group">
                      <Share2 className="h-5 w-5 text-gray-400 group-hover:text-appex-cyan" />
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-white uppercase tracking-widest">Digital Share</span>
                   </button>
                   <button className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-appex-blue/5 dark:bg-white/5 border border-appex-blue/10 dark:border-white/10 hover:border-appex-cyan transition-all group">
                      <Award className="h-5 w-5 text-gray-400 group-hover:text-appex-cyan" />
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-white uppercase tracking-widest">QR Protocol</span>
                   </button>
                </div>
             </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/affiliate/dashboard" className="text-appex-purple hover:text-appex-cyan transition-colors font-black uppercase text-xs tracking-widest inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Return to Command Center
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
