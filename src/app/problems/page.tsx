import Problems from '@/components/Problems';
import Footer from '@/components/Footer';
import React from 'react';

export default function Home() {
  return (
    <>
    <main className="min-h-screen antialiased">
        <Problems/>
        <Footer/>
    </main>
    </>
  );
}
