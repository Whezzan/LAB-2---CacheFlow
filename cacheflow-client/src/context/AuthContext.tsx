import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { AuthUser } from '../types'

interface AuthContextValue {
  user: AuthUser | null
  login: (userData: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('cacheflow_user')
    if (stored) {
      setUser(JSON.parse(stored) as AuthUser)
    }
  }, [])

  const login = (userData: AuthUser) => {
    setUser(userData)
    localStorage.setItem('cacheflow_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('cacheflow_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
