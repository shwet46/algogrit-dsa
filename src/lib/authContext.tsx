"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { User, onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase/config"

const AuthContext = createContext<{ user: User | null }>({ user: null })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => setUser(firebaseUser))
    return () => unsub()
  }, [])

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)