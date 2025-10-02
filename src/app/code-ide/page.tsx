import React from 'react';
import CodeEditor from '@/components/CodeEditor';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <main className="min-h-screen antialiased">
        <CodeEditor />
        <Footer />
      </main>
    </>
  );
}
