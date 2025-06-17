'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/signup'); 
    }
  }, [user, router]);

  if (!user) {
    return null; 
  }

  return (
    <main className="min-h-screen antialiased">
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}