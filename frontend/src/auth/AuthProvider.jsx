import React, { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext({ user: null, loading: true })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Revisa sesión en el backend
    fetch('/api/auth/me', { credentials: 'include' })
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
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (res.ok && data?.user) {
        setUser(data.user)
        return { success: true, user: data.user }
      }
      const errorMsg = data?.error || 'Error al iniciar sesión'
      return { success: false, error: typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg) }
    } catch (err) {
      return { success: false, error: err?.message || 'Error de conexión' }
    }
  }

  async function register(payload) {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (res.ok) {
        // El endpoint de registro no autentica automáticamente.
        // Devolver el mensaje y no fijar `user` aquí.
        return { success: true, message: data?.message || 'Registro exitoso' }
      }
      // Asegurar que siempre retornamos un objeto con error válido
      const errorMsg = data?.error || 'Error al registrar usuario'
      return { success: false, error: typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg) }
    } catch (err) {
      return { success: false, error: err?.message || 'Error de conexión' }
    }
  }

  async function logout() {
    try {
      const res = await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include' 
      })
      const data = await res.json()
      setUser(null)
      return { success: true, message: data.message || 'Sesión cerrada' }
    } catch (err) {
      setUser(null)
      return { success: false, error: err?.message || 'Error al cerrar sesión' }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
