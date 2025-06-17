'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/firebase/config'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { setDoc, doc, collection, query, where, getDocs } from 'firebase/firestore'
import { signOut } from 'firebase/auth'

import { WavyBackground } from '@/components/ui/wavy-background'
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'

export default function SignupPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async () => {
    setError('')
    if (!username || !email || !password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    try {
      const usernameQuery = query(collection(db, 'users'), where('username', '==', username))
      const usernameSnapshot = await getDocs(usernameQuery)

      if (!usernameSnapshot.empty) {
        setError('Username is already taken.')
        setLoading(false)
        return
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        username
      })

      await signOut(auth)
      router.push('/login')
    } catch (err: unknown) {
      let message = 'Signup failed. Please try again.'
      if (err && typeof err === 'object' && 'code' in err) {
        const code = (err as { code?: string }).code
        message = code === 'auth/email-already-in-use'
          ? 'Email is already in use.'
          : code === 'auth/invalid-email'
          ? 'Invalid email address.'
          : code === 'auth/weak-password'
          ? 'Password should be at least 6 characters.'
          : 'Signup failed. Please try again.'
      }

      setError(message)
      console.error('Signup error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <WavyBackground containerClassName="min-h-screen w-full flex items-center justify-center bg-black">
      <div className="w-full max-w-sm mx-auto px-6 py-12 z-10 relative">
        
        {/* Company Title */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl text-indigo-300 font-black mb-3 tracking-tight"
          >
            AlgoGrit DSA
          </h1>
          <p className="text-zinc-400 text-lg font-medium">Create your account</p>
        </div>

        <div className="space-y-5">
          {/* Username Input */}
          <div className="group relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <UserIcon className="h-5 w-5 text-zinc-300 group-focus-within:text-indigo-300 transition-colors duration-200" />
            </div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-zinc-900/60 backdrop-blur-sm border border-zinc-700/50 rounded-lg focus:border-indigo-400/50 focus:bg-zinc-800/80 outline-none text-white placeholder:text-zinc-400 text-base font-medium transition-all duration-300"
            />
          </div>

          {/* Email Input */}
          <div className="group relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <EnvelopeIcon className="h-5 w-5 text-zinc-300 group-focus-within:text-indigo-300 transition-colors duration-200" />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-zinc-900/60 backdrop-blur-sm border border-zinc-700/50 rounded-lg focus:border-indigo-400/50 focus:bg-zinc-800/80 outline-none text-white placeholder:text-zinc-400 text-base font-medium transition-all duration-300"
            />
          </div>

          {/* Password Input */}
          <div className="group relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <LockClosedIcon className="h-5 w-5 text-zinc-300 group-focus-within:text-indigo-300 transition-colors duration-200" />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-zinc-900/60 backdrop-blur-sm border border-zinc-700/50 rounded-lg focus:border-indigo-400/50 focus:bg-zinc-800/80 outline-none text-white placeholder:text-zinc-400 text-base font-medium transition-all duration-300"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm font-medium text-center">{error}</p>
          </div>
        )}

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          disabled={loading || !username || !email || !password}
          className="w-full mt-8 relative group overflow-hidden rounded-lg py-4 px-8 bg-white text-black font-bold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/25 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:ring-offset-2 focus:ring-offset-black transform active:scale-[0.98]"
        >
          <span className="relative z-10 transition-all duration-300 group-hover:tracking-wide group-hover:text-white">
            {loading ? 'Creating Account...' : 'Create Account'}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#7c8bd2] to-[#5d6bb7] rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
        </button>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-zinc-400 text-base">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-white font-semibold hover:underline transition-all duration-200 hover:text-zinc-200"
            >
              Sign in
            </a>
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-12 text-center">
          <p className="text-zinc-600 text-sm font-medium">
            © 2025 AlgoGrit DSA. All rights reserved.
          </p>
        </div>
      </div>
    </WavyBackground>
  )
}