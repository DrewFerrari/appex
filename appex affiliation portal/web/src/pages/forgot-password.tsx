import React from 'react';
import Head from 'next/head';
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <>
      <Head>
        <title>Recover Access - AppEx Affiliation Portal</title>
        <meta name="description" content="Reset your AppEx Affiliation Portal password." />
      </Head>
      <div className="min-h-screen flex items-center justify-center p-4">
        <ForgotPasswordForm />
      </div>
    </>
  );
}
