import React from 'react';
import Head from 'next/head';
import { RegisterForm } from '../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Enroll - AppEx Affiliation Portal</title>
        <meta name="description" content="Join the AppEx Affiliation network and start earning commissions." />
      </Head>
      <div className="min-h-screen py-10 flex items-center justify-center">
        <RegisterForm />
      </div>
    </>
  );
}
