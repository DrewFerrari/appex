import React from 'react';
import Head from 'next/head';
import { Users, Search, Filter, Plus } from 'lucide-react';
import Link from 'next/link';

export default function ReferralsPage() {
  return (
    <>
      <Head>
        <title>Referral Feed - AppEx Affiliation Portal</title>
      </Head>
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-black text-appex-blue dark:text-white uppercase tracking-tight italic">Referral Operations</h1>
              <p className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mt-1">Network Expansion Management</p>
            </div>
            <button className="btn-accent flex items-center justify-center gap-2 px-6 py-3 shadow-lg shadow-appex-cyan/20 transform hover:-translate-y-1 transition-all">
              <Plus className="h-5 w-5" />
              <span className="font-black uppercase text-xs tracking-widest">New Referral Instance</span>
            </button>
          </div>

          <div className="glass-card rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row gap-4">
               <div className="relative flex-1">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                 <input className="w-full bg-appex-blue/5 dark:bg-white/5 border-2 border-appex-blue/10 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold placeholder-gray-400 focus:outline-none focus:border-appex-cyan transition-all" placeholder="Search Identity (Name, Email, ID)..." />
               </div>
               <button className="btn-primary px-6 flex items-center gap-2 border-2 border-appex-blue/20">
                 <Filter className="h-4 w-4" />
                 <span className="font-bold text-xs uppercase tracking-widest">Apply Filters</span>
               </button>
            </div>

            <div className="p-20 text-center">
               <div className="mx-auto h-20 w-20 bg-appex-blue/10 rounded-full flex items-center justify-center mb-6">
                 <Users className="h-10 w-10 text-appex-blue/50 dark:text-white/30" />
               </div>
               <h2 className="text-2xl font-black text-appex-blue dark:text-white italic uppercase">No Active Nodes Detected</h2>
               <p className="mt-2 text-gray-500 dark:text-gray-400 font-medium">Your expansion network is currently empty. Start by initializing a new referral.</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/affiliate/dashboard" className="text-appex-purple hover:text-appex-cyan transition-colors font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Return to Command Center
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function ArrowLeft({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}
