import React from 'react';
import Head from 'next/head';
import { Shield, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Data Encryption & Privacy - AppEx</title>
      </Head>
      <div className="min-h-screen p-8 flex flex-col items-center">
        <div className="max-w-4xl w-full glass-card p-12 rounded-[40px] border border-white/20 shadow-2xl relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute -bottom-20 -left-20 h-64 w-64 bg-appex-purple/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-appex-navy rounded-2xl">
                <Shield className="h-8 w-8 text-appex-purple" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-appex-blue dark:text-white uppercase tracking-tight italic">Privacy Protocol</h1>
                <p className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">Data Encryption & Policy</p>
              </div>
            </div>

            <div className="space-y-8 text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              <section>
                <h2 className="text-appex-purple font-black uppercase text-sm tracking-widest mb-4 flex items-center gap-2">
                  <Lock className="h-4 w-4" /> End-to-End Encryption
                </h2>
                <p>
                  All personal identity data (PII) is encrypted at the node level using military-grade AES-256 protocols before being transmitted to the core database. Your credentials remain private and secured behind multiple security layers.
                </p>
              </section>

              <section>
                <h2 className="text-appex-purple font-black uppercase text-sm tracking-widest mb-4">Network Telemetry</h2>
                <p>
                  We collect minimal telemetry data required for fraud detection, commission attribution, and network performance optimization. We do not sell your personal data to external entities.
                </p>
              </section>

              <section>
                <h2 className="text-appex-purple font-black uppercase text-sm tracking-widest mb-4">Cookie Utilization</h2>
                <p>
                  Our platform uses persistent session tokens and attribution cookies to ensure accurate referral tracking and secure authenticated sessions across the AppEx ecosystem.
                </p>
              </section>

              <div className="pt-8 border-t border-white/10 text-center">
                <Link href="/register" className="inline-flex items-center gap-2 text-appex-cyan hover:text-appex-purple transition-colors font-black uppercase text-xs tracking-widest">
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
