import React from 'react';
import Head from 'next/head';
import { BarChart3, TrendingUp, Target, Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  return (
    <>
      <Head>
        <title>Deep Intel - AppEx Affiliation Portal</title>
      </Head>
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-appex-blue dark:text-white uppercase tracking-tight italic">Performance Intelligence</h1>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mt-1">Real-time Analytics & Market Insights</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="glass-card rounded-2xl border border-white/20 p-6 shadow-xl">
               <div className="flex items-center gap-3 mb-2">
                 <Zap className="h-4 w-4 text-appex-cyan" />
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Network Speed</span>
               </div>
               <div className="text-3xl font-black text-appex-blue dark:text-white">Optimal</div>
            </div>
            <div className="glass-card rounded-2xl border border-white/20 p-6 shadow-xl">
               <div className="flex items-center gap-3 mb-2">
                 <Target className="h-4 w-4 text-appex-purple" />
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Conversion Index</span>
                 <span className="ml-auto text-[10px] font-bold text-appex-cyan bg-appex-cyan/10 px-2 py-0.5 rounded">High</span>
               </div>
               <div className="text-3xl font-black text-appex-blue dark:text-white">92.4%</div>
            </div>
            <div className="glass-card rounded-2xl border border-white/20 p-6 shadow-xl">
               <div className="flex items-center gap-3 mb-2">
                 <TrendingUp className="h-4 w-4 text-appex-cyan" />
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Growth Velocity</span>
               </div>
               <div className="text-3xl font-black text-appex-blue dark:text-white">+14.2%</div>
            </div>
          </div>

          <div className="glass-card rounded-3xl border border-white/20 p-12 shadow-2xl min-h-[400px] flex flex-col items-center justify-center text-center">
             <div className="h-40 w-40 relative flex items-center justify-center mb-8">
                <div className="absolute inset-0 border-4 border-appex-blue/10 dark:border-white/10 rounded-full"></div>
                <div className="absolute inset-0 border-t-4 border-appex-cyan rounded-full animate-spin"></div>
                <BarChart3 className="h-12 w-12 text-appex-cyan" />
             </div>
             <h2 className="text-xl font-black text-appex-blue dark:text-white uppercase tracking-tight italic">Initializing Intel Stream</h2>
             <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm font-medium">Aggregating historical data points for regional network analysis. Full visualization terminal will be online shortly.</p>
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
