import React from 'react';
import Head from 'next/head';
import { LoginForm } from '../../components/auth/LoginForm';

export default function AdminLoginPage() {
  return (
    <>
      <Head>
        <title>Admin Core - AppEx Affiliation Portal</title>
        <meta name="description" content="System administrator login for AppEx Affiliation Portal." />
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="mb-8 text-center">
            <h1 className="text-2xl font-black text-appex-purple uppercase tracking-tighter bg-appex-purple/10 px-6 py-2 rounded-full inline-block border border-appex-purple/20">
                Administrative Terminal
            </h1>
        </div>
        <LoginForm />
        <div className="mt-8 text-xs font-bold text-gray-500 uppercase tracking-widest opacity-50">
            Authorized Personnel Only • Tier 1 Security Required
        </div>
      </div>
    </>
  );
}
