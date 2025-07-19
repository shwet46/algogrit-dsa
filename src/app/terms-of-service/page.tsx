import React from 'react';
import { VscTerminal } from "react-icons/vsc";
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen mt-20 bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 sm:px-10 md:px-16 py-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <VscTerminal className="text-[#60a5fa]" size={24} />
            <h1
              className="text-xl font-bold bg-gradient-to-r from-[#567fb1] via-[#3d64a2] to-[#1c46a2] bg-clip-text text-transparent"
              style={{ fontFamily: "'Fira Code', monospace" }}
            >
              AlgoGrit
            </h1>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 sm:px-10 md:px-16 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-zinc-400">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-invert prose-zinc max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Agreement to Terms</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                By accessing and using AlgoGrit DSA ("the Platform"), you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Description of Service</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                AlgoGrit DSA is an online platform that provides Data Structures and Algorithms practice problems, 
                coding challenges, progress tracking, and learning resources. The platform includes features such as:
              </p>
              <ul className="text-zinc-300 space-y-2 mb-4 list-disc list-inside">
                <li>Access to coding problems from various platforms</li>
                <li>Online code editor and IDE</li>
                <li>Progress tracking and analytics</li>
                <li>User profiles and achievement systems</li>
                <li>Notes and solution storage</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">User Accounts</h2>
              
              <h3 className="text-xl font-medium text-white mb-3">Account Creation</h3>
              <ul className="text-zinc-300 space-y-2 mb-4 list-disc list-inside">
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You must be at least 13 years old to create an account</li>
                <li>One person may not maintain multiple accounts</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">Account Responsibilities</h3>
              <ul className="text-zinc-300 space-y-2 mb-4 list-disc list-inside">
                <li>You are responsible for all activities that occur under your account</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>You may not transfer your account to another person</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Acceptable Use</h2>
              
              <h3 className="text-xl font-medium text-white mb-3">You May:</h3>
              <ul className="text-zinc-300 space-y-2 mb-4 list-disc list-inside">
                <li>Use the platform for personal learning and skill development</li>
                <li>Share your solutions and discuss problems with other users</li>
                <li>Provide feedback and suggestions for improvement</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">You May Not:</h3>
              <ul className="text-zinc-300 space-y-2 mb-4 list-disc list-inside">
                <li>Copy, redistribute, or sell access to the platform or its content</li>
                <li>Use automated tools to scrape or download content without permission</li>
                <li>Upload malicious code or attempt to compromise platform security</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Create fake accounts or impersonate others</li>
                <li>Use the platform for commercial purposes without authorization</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Content and Intellectual Property</h2>
              
              <h3 className="text-xl font-medium text-white mb-3">Your Content</h3>
              <p className="text-zinc-300 leading-relaxed mb-4">
                You retain ownership of any code, notes, or other content you create on the platform. By using our 
                service, you grant us a license to store, display, and distribute your content as necessary to 
                provide the service.
              </p>

              <h3 className="text-xl font-medium text-white mb-3">Platform Content</h3>
              <p className="text-zinc-300 leading-relaxed mb-4">
                The platform, its features, and underlying technology are owned by AlgoGrit DSA. Problem statements 
                and descriptions are sourced from various public platforms and educational resources. We respect 
                intellectual property rights and will respond to valid copyright claims.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Privacy and Data</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, 
                use, and protect your personal information. By using the platform, you consent to the collection 
                and use of information as described in our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Service Availability</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                We strive to provide reliable access to our platform, but we cannot guarantee 100% uptime. 
                The service may be temporarily unavailable due to maintenance, updates, or technical issues. 
                We reserve the right to modify, suspend, or discontinue the service at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                AlgoGrit DSA is provided "as is" without warranties of any kind. We are not liable for any 
                direct, indirect, incidental, or consequential damages resulting from your use of the platform. 
                Your use of the service is at your own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Account Termination</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                We reserve the right to suspend or terminate your account if you violate these terms of service. 
                You may also delete your account at any time. Upon termination, your right to use the platform 
                ceases immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Changes to Terms</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                We may update these terms of service from time to time. We will notify users of any significant 
                changes by posting the updated terms on this page and updating the "Last updated" date. 
                Continued use of the platform after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Governing Law</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                These terms of service are governed by and construed in accordance with applicable laws. 
                Any disputes arising from these terms will be resolved through appropriate legal channels.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                If you have any questions about these terms of service, please contact us:
              </p>
              <div className="text-zinc-300">
                <p>Email: <a href="mailto:shwetabehera444@gmail.com" className="text-blue-400 hover:underline">shwetabehera444@gmail.com</a></p>
                <p>Platform: AlgoGrit DSA</p>
              </div>
            </section>
          </div>

          {/* Back to Home */}
          <div className="mt-12 pt-8 border-t border-zinc-800">
            <Link
              href="/"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to AlgoGrit
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}