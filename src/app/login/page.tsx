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
  const [loadingRedirect, setLoadingRedirect] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setLoadingRedirect(false)
  }, [])

  const handleLogin = async () => {
    setError('')
    try {
      let loginEmail = userOrEmail

      if (!userOrEmail.includes('@')) {
        const q = query(collection(db, 'users'), where('username', '==', userOrEmail))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
          setError('Username not found.')
          return
        }

        loginEmail = querySnapshot.docs[0].data().email
      }

      await signInWithEmailAndPassword(auth, loginEmail, password)
      router.push('/')
    } catch (err) {
      setError('Invalid credentials. Please try again.')
      console.error(err)
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
    <WavyBackground containerClassName="min-h-screen w-full flex items-center justify-center bg-black overflow-hidden">
      <div className="w-full max-w-md mx-auto px-6 py-12 z-10 relative">
        <div className="bg-zinc-900/90 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          <div className="absolute -top-8 -left-8 w-40 h-40 bg-gradient-to-br from-[#7c8bd2]/40 via-[#5d6bb7]/30 to-[#3f4b9c]/0 rounded-full blur-2xl z-0" />
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-tr from-[#3f4b9c]/40 via-[#5d6bb7]/30 to-[#7c8bd2]/0 rounded-full blur-2xl z-0" />

          <h2
            className="text-3xl md:text-4xl font-extrabold text-center mb-6 relative z-10"
            style={{
              fontFamily: "'Fira Code', monospace",
              background: "linear-gradient(135deg, #7c8bd2, #5d6bb7, #3f4b9c)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Welcome Back
          </h2>

          {/* Username/Email */}
          <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 mb-3">
            <UserIcon className="h-5 w-5 text-zinc-400 mr-2" />
            <input
              type="text"
              placeholder="Username or Email"
              value={userOrEmail}
              onChange={(e) => setUserOrEmail(e.target.value)}
              className="w-full bg-transparent outline-none text-white placeholder:text-zinc-400 text-sm"
            />
          </div>

          {/* Password */}
          <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 mb-6">
            <LockClosedIcon className="h-5 w-5 text-zinc-400 mr-2" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent outline-none text-white placeholder:text-zinc-400 text-sm"
            />
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="relative group w-full rounded-md z-10 overflow-hidden focus:outline-none border border-white/10 transition-all duration-700"
            type="submit"
            disabled={!userOrEmail || !password || loadingRedirect}
            style={{ opacity: (!userOrEmail || !password || loadingRedirect) ? 0.6 : 1, cursor: (!userOrEmail || !password || loadingRedirect) ? 'not-allowed' : 'pointer' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#7c8bd2] to-[#5d6bb7] rounded-md group-hover:opacity-90 transition-opacity duration-700" />
            <div className="relative px-8 py-2.5 bg-zinc-900 rounded-md text-white font-semibold text-lg group-hover:bg-transparent flex items-center justify-center transition-all duration-700">
              Login
            </div>
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2 z-10">{error}</p>
          )}

          <p className="text-center text-sm text-zinc-400 mt-4 z-20 relative">
            Don&apos;t have an account?{' '}
            <a
              href="/signup"
              className="text-[#7c8bd2] hover:underline font-medium cursor-pointer"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </WavyBackground>
  )
}