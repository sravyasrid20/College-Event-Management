import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      const userData = res.data.data
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return { success: true, role: userData.role }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (_) {}
    setUser(null)
    localStorage.removeItem('user')
  }

  const register = async (name, email, password, role) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/register', { name, email, password, role })
      return { success: true, message: res.data.message }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
