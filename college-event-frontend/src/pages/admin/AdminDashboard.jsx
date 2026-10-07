import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { Users, CalendarDays, BookOpen, Clock, Loader2, ShieldCheck } from 'lucide-react'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard')
        setStats(res.data.data)
      } catch {
        toast.error('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const cards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, panel: 'bg-cyan-100', iconColor: 'text-cyan-700' },
    { label: 'Total Events', value: stats.totalEvents, icon: CalendarDays, panel: 'bg-fuchsia-100', iconColor: 'text-fuchsia-700' },
    { label: 'Registrations', value: stats.totalRegistrations, icon: BookOpen, panel: 'bg-emerald-100', iconColor: 'text-emerald-700' },
    { label: 'Pending Events', value: stats.pendingEvents, icon: Clock, panel: 'bg-amber-100', iconColor: 'text-amber-700' },
  ] : []

  return (
    <div className="page-shell">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-100 p-2.5 rounded-lg">
              <ShieldCheck className="w-7 h-7 text-cyan-700" />
            </div>
            <div>
              <h1 className="page-title">Admin Dashboard</h1>
              <p className="text-slate-500">System overview and management</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-cyan-700 animate-spin" /></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {cards.map((c) => (
                <div key={c.label} className="card hover:-translate-y-0.5 hover:shadow-xl transition-all">
                  <div className={`${c.panel} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <c.icon className={`w-6 h-6 ${c.iconColor}`} />
                  </div>
                  <p className="font-display text-3xl font-bold text-slate-950 mb-1">{c.value}</p>
                  <p className="text-sm text-slate-500">{c.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/admin/pending-events" className="card hover:-translate-y-0.5 hover:shadow-xl transition-all cursor-pointer group">
                <div className="flex items-center gap-4 mb-3">
                  <div className="bg-amber-100 p-3 rounded-lg group-hover:bg-amber-200 transition-colors">
                    <Clock className="w-6 h-6 text-amber-700" />
                  </div>
                  <h3 className="font-display font-semibold text-slate-950 text-lg">Pending Events</h3>
                </div>
                <p className="text-slate-500 text-sm">Review and approve or reject event submissions from organizers.</p>
                <p className="text-amber-700 font-semibold text-sm mt-3">{stats?.pendingEvents || 0} events awaiting review -&gt;</p>
              </Link>

              <Link to="/admin/users" className="card hover:-translate-y-0.5 hover:shadow-xl transition-all cursor-pointer group">
                <div className="flex items-center gap-4 mb-3">
                  <div className="bg-cyan-100 p-3 rounded-lg group-hover:bg-cyan-200 transition-colors">
                    <Users className="w-6 h-6 text-cyan-700" />
                  </div>
                  <h3 className="font-display font-semibold text-slate-950 text-lg">Manage Users</h3>
                </div>
                <p className="text-slate-500 text-sm">View all registered users and ban/unban accounts as needed.</p>
                <p className="text-cyan-700 font-semibold text-sm mt-3">{stats?.totalUsers || 0} total users -&gt;</p>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
