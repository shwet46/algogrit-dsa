'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/firebase/config'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { WavyBackground } from '@/components/ui/wavy-background'
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline'

export default function LoginPage() {
  const [userOrEmail, setUserOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingRedirect, setLoadingRedirect] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setLoadingRedirect(false)
  }, [])

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    
    try {
      let loginEmail = userOrEmail

      if (!userOrEmail.includes('@')) {
        const q = query(collection(db, 'users'), where('username', '==', userOrEmail))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
          setError('Username not found.')
          setLoading(false)
          return
        }

        loginEmail = querySnapshot.docs[0].data().email
      }

      await signInWithEmailAndPassword(auth, loginEmail, password)
      router.push('/')
    } catch (err) {
      setError('Invalid credentials. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loadingRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl font-semibold">
        Redirecting...
      </div>
    )
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
          <p className="text-zinc-400 text-lg font-medium">Welcome back</p>
        </div>

        <div className="space-y-5">
          {/* Username/Email Input */}
          <div className="group relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <UserIcon className="h-5 w-5 text-zinc-300 group-focus-within:text-indigo-300 transition-colors duration-200" />
            </div>
            <input
              type="text"
              placeholder="Username or Email"
              value={userOrEmail}
              onChange={(e) => setUserOrEmail(e.target.value)}
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

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading || !userOrEmail || !password || loadingRedirect}
          className="w-full mt-8 relative group overflow-hidden rounded-lg py-4 px-8 bg-white text-black font-bold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/25 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:ring-offset-2 focus:ring-offset-black transform active:scale-[0.98]"
        >
          <span className="relative z-10 transition-all duration-300 group-hover:tracking-wide group-hover:text-white">
            {loading ? 'Signing In...' : 'Sign In'}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#7c8bd2] to-[#5d6bb7] rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
        </button>

        {/* Signup Link */}
        <div className="mt-8 text-center">
          <p className="text-zinc-400 text-base">
            Don&apos;t have an account?{' '}
            <a
              href="/signup"
              className="text-white font-semibold hover:underline transition-all duration-200 hover:text-zinc-200"
            >
              Sign up
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