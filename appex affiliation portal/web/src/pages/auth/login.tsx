import React from 'react';
import Head from 'next/head';
import { LoginForm } from '../../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login - AppEx Affiliation Portal</title>
        <meta name="description" content="Sign in to your AppEx Affiliation Portal account" />
      </Head>
      <LoginForm />
    </>
  );
}
