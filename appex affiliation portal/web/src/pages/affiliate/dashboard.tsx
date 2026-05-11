import React from 'react';
import Head from 'next/head';
import { Dashboard } from '../../components/affiliate/Dashboard';

export default function AffiliateDashboardPage() {
  return (
    <>
      <Head>
        <title>Control Center - AppEx Affiliation Portal</title>
        <meta name="description" content="View your affiliate performance, earnings, and referrals." />
      </Head>
      <Dashboard />
    </>
  );
}
