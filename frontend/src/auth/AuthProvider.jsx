import React, { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext({ user: null, loading: true })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Revisa sesión en el backend
    fetch('/api/me', { credentials: 'include' })
      .then(async res => {
        if (!res.ok) return { user: null }
        return res.json()
      })
      .then(data => {
        setUser(data.user || null)
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (res.ok) {
      setUser(data.user)
      return { success: true }
    }
    return { success: false, error: data.error }
  }

  async function register(payload) {
    const res = await fetch('/api/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    if (res.ok) {
      setUser(data.user)
      return { success: true }
    }
    return { success: false, error: data.error }
  }

  async function logout() {
    try {
      await fetch('/api/logout', { credentials: 'include' })
    } catch (e) {
      // ignore
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
