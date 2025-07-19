'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/firebase/config'
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'

import { z } from 'zod'
import { WavyBackground } from '@/components/ui/wavy-background'
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'

const SignupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.')
})

export default function SignupPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async () => {
    setError('')

    const validation = SignupSchema.safeParse({ username, email, password })
    if (!validation.success) {
      setError(validation.error.errors[0].message)
      return
    }

    setLoading(true)
    try {
      // Create the user first
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Now create the user document (user is authenticated)
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          username,
          createdAt: new Date()
        })
      } catch (docError) {
        // If document creation fails, clean up the auth user
        await user.delete()
        throw new Error('Failed to create user profile. Please try again.')
      }

      await signOut(auth)
      router.push('/login')
    } catch (err: unknown) {
      let message = 'Signup failed. Please try again.'
      if (err && typeof err === 'object' && 'code' in err) {
        const code = (err as { code?: string }).code
        message =
          code === 'auth/email-already-in-use'
            ? 'Email is already in use.'
            : code === 'auth/invalid-email'
            ? 'Invalid email address.'
            : code === 'auth/weak-password'
            ? 'Password should be at least 6 characters.'
            : 'Signup failed. Please try again.'
      } else if (err instanceof Error) {
        message = err.message
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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl text-indigo-300 font-black mb-3 tracking-tight">
            AlgoGrit DSA
          </h1>
          <p className="text-zinc-400 text-lg font-medium">Create your account</p>
        </div>

        <div className="space-y-5">
          <InputField
            icon={<UserIcon className="h-5 w-5 text-zinc-300" />}
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <InputField
            icon={<EnvelopeIcon className="h-5 w-5 text-zinc-300" />}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            icon={<LockClosedIcon className="h-5 w-5 text-zinc-300" />}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm font-medium text-center">{error}</p>
          </div>
        )}

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full mt-8 relative group overflow-hidden rounded-lg py-4 px-8 bg-white text-black font-bold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 group-hover:text-white">
            {loading ? 'Creating Account...' : 'Create Account'}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#7c8bd2] to-[#5d6bb7] rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
        </button>

        <div className="mt-8 text-center">
          <p className="text-zinc-400 text-base">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-white font-semibold hover:underline hover:text-zinc-200"
            >
              Sign in
            </a>
          </p>
        </div>

        <div className="mt-12 text-center">
          <p className="text-zinc-600 text-sm font-medium">
            © 2025 AlgoGrit DSA. All rights reserved.
          </p>
        </div>
      </div>
    </WavyBackground>
  )
}

function InputField({
  icon,
  placeholder,
  type,
  value,
  onChange
}: {
  icon: React.ReactNode
  placeholder: string
  type: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="group relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-12 pr-4 py-4 bg-zinc-900/60 backdrop-blur-sm border border-zinc-700/50 rounded-lg focus:border-indigo-400/50 focus:bg-zinc-800/80 outline-none text-white placeholder:text-zinc-400 text-base font-medium transition-all duration-300"
      />
    </div>
  )
}