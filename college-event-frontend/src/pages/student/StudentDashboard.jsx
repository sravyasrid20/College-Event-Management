import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { CalendarDays, BookOpen, User, Loader2 } from 'lucide-react'

const StudentDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({ registrations: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/registrations/my')
        setStats({ registrations: res.data.data?.length || 0 })
      } catch {
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="page-shell">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="page-title">Student Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name}!</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-cyan-700 animate-spin" /></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="stat-card">
                <div className="bg-cyan-100 p-3 rounded-lg">
                  <BookOpen className="w-7 h-7 text-cyan-700" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">My Registrations</p>
                  <p className="font-display text-3xl font-bold text-slate-950">{stats.registrations}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <CalendarDays className="w-7 h-7 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Browse Events</p>
                  <p className="text-lg font-semibold text-slate-700">Explore All</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="bg-emerald-100 p-3 rounded-lg">
                  <User className="w-7 h-7 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Account Role</p>
                  <p className="text-lg font-semibold text-slate-700">Student</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/student/registrations" className="card hover:-translate-y-0.5 hover:shadow-xl transition-all cursor-pointer group">
                <div className="flex items-center gap-4 mb-3">
                  <div className="bg-cyan-100 p-3 rounded-lg group-hover:bg-cyan-200 transition-colors">
                    <BookOpen className="w-6 h-6 text-cyan-700" />
                  </div>
                  <h3 className="font-display font-semibold text-slate-950 text-lg">My Registrations</h3>
                </div>
                <p className="text-slate-500 text-sm">View and manage all your event registrations. Cancel if needed.</p>
              </Link>

              <Link to="/" className="card hover:-translate-y-0.5 hover:shadow-xl transition-all cursor-pointer group">
                <div className="flex items-center gap-4 mb-3">
                  <div className="bg-amber-100 p-3 rounded-lg group-hover:bg-amber-200 transition-colors">
                    <CalendarDays className="w-6 h-6 text-amber-700" />
                  </div>
                  <h3 className="font-display font-semibold text-slate-950 text-lg">Browse Events</h3>
                </div>
                <p className="text-slate-500 text-sm">Discover and register for upcoming campus events.</p>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default StudentDashboard
