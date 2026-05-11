import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>AppEx Affiliation Portal</title>
        <meta name="description" content="Complete affiliate marketing platform for Zimbabwean entrepreneurs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen transition-colors duration-300">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold mb-4 gradient-text pb-2">
              AppEx Affiliation Portal
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              The premier affiliate marketing platform designed specifically for Zimbabwean entrepreneurs.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="glass-card p-8 rounded-2xl border border-white/20 shadow-2xl transition-transform hover:scale-[1.02]">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-2">
                  <span className="p-2 bg-appex-blue rounded-lg text-appex-cyan">👤</span>
                  User Portal
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Start your journey today. Register, login, and manage your affiliate earnings from one dashboard.
                </p>
                <Link href="/auth/login" className="block w-full btn-accent text-center py-4">
                  Go to Dashboard
                </Link>
              </div>
              
              <div className="glass-card p-8 rounded-2xl border border-white/20 shadow-2xl transition-transform hover:scale-[1.02]">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-2">
                  <span className="p-2 bg-appex-navy rounded-lg text-appex-purple">🏢</span>
                  Admin Portal
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  System administrators can manage users, track regional analytics, and oversee payouts.
                </p>
                <Link href="/admin/login" className="block w-full btn-primary text-center py-4">
                  Admin Access
                </Link>
              </div>
            </div>
            
            <div className="mt-16">
              <div className="glass-card p-10 max-w-2xl mx-auto rounded-3xl border border-white/10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  📊 System Infrastructure
                </h2>
                <div className="grid grid-cols-1 gap-4 text-left">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-appex-blue/5 dark:bg-white/5">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Backend Network:</span>
                    <span className="text-appex-cyan font-bold">● Active</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-appex-blue/5 dark:bg-white/5">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Database Core:</span>
                    <span className="text-appex-cyan font-bold">● Online</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-appex-blue/5 dark:bg-white/5">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Global CDN:</span>
                    <span className="text-appex-cyan font-bold">● Optimized</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
