import React from 'react';
import Head from 'next/head';
import { Shield, Book, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Network Protocols & Terms - AppEx</title>
      </Head>
      <div className="min-h-screen p-8 flex flex-col items-center">
        <div className="max-w-4xl w-full glass-card p-12 rounded-[40px] border border-white/20 shadow-2xl relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute -top-20 -right-20 h-64 w-64 bg-appex-cyan/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-appex-blue rounded-2xl">
                <Book className="h-8 w-8 text-appex-cyan" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-appex-blue dark:text-white uppercase tracking-tight italic">Network Protocols</h1>
                <p className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">Service Level Agreement & Terms</p>
              </div>
            </div>

            <div className="space-y-8 text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              <section>
                <h2 className="text-appex-cyan font-black uppercase text-sm tracking-widest mb-4">1. Access Initialization</h2>
                <p>
                  By enrolling in the AppEx Affiliation Network, you agree to abide by the digital protocols established for transmission and conversion. Unauthorized access to the core node infrastructure is strictly prohibited.
                </p>
              </section>

              <section>
                <h2 className="text-appex-cyan font-black uppercase text-sm tracking-widest mb-4">2. Commission Streams</h2>
                <p>
                  Affiliates are entitled to compensation based on successful node registrations and active conversions. All commission distributions are subject to verification via the AppEx ledger protocol.
                </p>
              </section>

              <section>
                <h2 className="text-appex-cyan font-black uppercase text-sm tracking-widest mb-4">3. Code of Conduct</h2>
                <p>
                  Spamming, deceptive traffic generation, and any form of network manipulation will result in immediate termination of your access key and forfeiture of outstanding settlements.
                </p>
              </section>

              <div className="pt-8 border-t border-white/10 text-center">
                <Link href="/register" className="inline-flex items-center gap-2 text-appex-purple hover:text-appex-cyan transition-colors font-black uppercase text-xs tracking-widest">
                  <ArrowLeft className="h-4 w-4" /> Return to Enrollment Terminal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
