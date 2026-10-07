import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { CalendarDays, Mail, Lock, Loader2 } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }
    const result = await login(email, password)
    if (result.success) {
      toast.success('Welcome back!')
      const redirectMap = {
        ADMIN: '/admin/dashboard',
        ORGANIZER: '/organizer/dashboard',
        STUDENT: '/student/dashboard',
      }
      navigate(redirectMap[result.role] || '/')
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="rounded-lg bg-cyan-100 p-3">
              <CalendarDays className="w-8 h-8 text-cyan-700" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-950">Welcome Back</h1>
          <p className="text-slate-500 mt-1">Sign in to CampusEvents</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                className="input-field pl-10"
                placeholder="you@college.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                className="input-field pl-10"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-3" disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyan-700 font-semibold hover:underline">
            Sign up
          </Link>
        </p>

        <div className="mt-4 rounded-lg border border-cyan-100 bg-cyan-50 p-3 text-xs text-slate-600">
          <p className="font-medium mb-1">Demo Admin:</p>
          <p>Email: admin@college.com | Password: admin123</p>
        </div>
      </div>
    </div>
  )
}

export default Login
