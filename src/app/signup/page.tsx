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
    <WavyBackground containerClassName="min-h-screen w-full flex items-center justify-center bg-black overflow-hidden">
      <div className="w-full max-w-md mx-auto px-6 py-12 z-10 relative">
        <div className="bg-zinc-900/90 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          {/* Gradient Accents */}
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
            Create Account
          </h2>

          {/* Username */}
          <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 mb-3">
            <UserIcon className="h-5 w-5 text-zinc-400 mr-2" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent outline-none text-white placeholder:text-zinc-400 text-sm"
            />
          </div>

          {/* Email */}
          <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 mb-3">
            <EnvelopeIcon className="h-5 w-5 text-zinc-400 mr-2" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          {/* Signup Button */}
          <button
            onClick={handleSignup}
            disabled={loading || !username || !email || !password}
            className="relative group w-full rounded-md z-10 overflow-hidden focus:outline-none border border-white/10 transition-all duration-700 disabled:opacity-50"
            type="submit"
            style={{ opacity: (loading || !username || !email || !password) ? 0.6 : 1, cursor: (loading || !username || !email || !password) ? 'not-allowed' : 'pointer' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#7c8bd2] to-[#5d6bb7] rounded-md group-hover:opacity-90 transition-opacity duration-700" />
            <div className="relative px-8 py-2.5 bg-zinc-900 rounded-md text-white font-semibold text-lg group-hover:bg-transparent flex items-center justify-center transition-all duration-700">
              {loading ? 'Creating...' : 'Sign Up'}
            </div>
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2 z-10">{error}</p>
          )}

          {/* Redirect to Login */}
          <p className="text-center text-sm text-zinc-400 mt-4 z-20 relative">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-[#7c8bd2] hover:underline font-medium cursor-pointer"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </WavyBackground>
  )
}