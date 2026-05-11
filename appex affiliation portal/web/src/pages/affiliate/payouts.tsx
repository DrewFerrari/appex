import React from 'react';
import Head from 'next/head';
import { CreditCard, History, Clock, Wallet, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PayoutsPage() {
  return (
    <>
      <Head>
        <title>Settlements - AppEx Affiliation Portal</title>
      </Head>
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-appex-blue dark:text-white uppercase tracking-tight italic">Financial Settlements</h1>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mt-1">Commission Liquidation Management</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="glass-card rounded-3xl border border-white/20 p-8 shadow-xl">
                 <div className="flex items-center gap-4 mb-6">
                    <Wallet className="h-6 w-6 text-appex-cyan" />
                    <h2 className="text-xl font-black text-appex-blue dark:text-white uppercase tracking-tight italic">Initiate Withdrawal</h2>
                 </div>
                 <div className="p-10 text-center border-2 border-dashed border-appex-blue/10 dark:border-white/10 rounded-2xl">
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Withdrawal protocol unavailable.</p>
                    <p className="text-xs text-gray-400 mt-1 italic">Minimum threshold of $50.00 required for transmission.</p>
                 </div>
              </div>

              <div className="glass-card rounded-3xl border border-white/20 p-8 shadow-xl">
                 <div className="flex items-center gap-4 mb-6">
                    <History className="h-6 w-6 text-appex-purple" />
                    <h2 className="text-xl font-black text-appex-blue dark:text-white uppercase tracking-tight italic">Transmission History</h2>
                 </div>
                 <div className="py-20 text-center">
                    <Clock className="h-10 w-10 text-gray-300 dark:text-white/10 mx-auto mb-4" />
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">No Historical Logs Found</p>
                 </div>
              </div>
            </div>

            <div className="space-y-8">
               <div className="glass-card rounded-3xl border border-white/20 p-8 shadow-xl bg-appex-blue dark:bg-appex-blue/20">
                  <h3 className="text-xs font-black text-appex-cyan uppercase tracking-widest mb-2">Available Balance</h3>
                  <div className="text-4xl font-black text-white">$0.00</div>
                  <div className="mt-4 pt-4 border-t border-white/10 text-[10px] font-bold text-appex-cyan italic uppercase">
                    Next cycle distribution: Pending
                  </div>
               </div>

               <div className="glass-card rounded-3xl border border-white/20 p-8 shadow-xl">
                  <h3 className="text-xs font-black text-appex-blue dark:text-white uppercase tracking-widest mb-4">Payment Methods</h3>
                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-appex-blue/5 dark:bg-white/5 border border-appex-blue/10 dark:border-white/10 hover:border-appex-cyan transition-colors">
                     <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Add Bank Account</span>
                     <CreditCard className="h-4 w-4 text-appex-cyan" />
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
