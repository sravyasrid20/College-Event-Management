import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { CalendarDays, User, Mail, Lock, Loader2 } from 'lucide-react'

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STUDENT' })
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all fields')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    const result = await register(form.name, form.email, form.password, form.role)
    if (result.success) {
      toast.success('Account created! Please login.')
      navigate('/login')
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
          <h1 className="font-display text-2xl font-bold text-slate-950">Create Account</h1>
          <p className="text-slate-500 mt-1">Join CampusEvents today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input name="name" type="text" className="input-field pl-10" placeholder="John Doe" value={form.name} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input name="email" type="email" className="input-field pl-10" placeholder="you@college.com" value={form.email} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input name="password" type="password" className="input-field pl-10" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Register As</label>
            <div className="grid grid-cols-2 gap-3">
              {['STUDENT', 'ORGANIZER'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm({ ...form, role })}
                  className={`py-2.5 px-4 rounded-lg border-2 font-medium text-sm transition-all ${
                    form.role === role
                      ? 'border-cyan-700 bg-cyan-50 text-cyan-800'
                      : 'border-slate-200 text-slate-600 hover:border-cyan-300'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-3" disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-700 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
