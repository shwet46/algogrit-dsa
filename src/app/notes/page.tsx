import Notes from '@/components/Notes/Notes';
import Footer from '@/components/Footer';
import React from 'react';

export default function NotesPage() {
  return (
    <>
      <main className="min-h-screen antialiased">
        <Notes />
        <Footer />
      </main>
    </>
  );
}