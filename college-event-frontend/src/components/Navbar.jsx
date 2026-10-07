import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { CalendarDays, LogOut, User, LayoutDashboard } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const getDashboardLink = () => {
    if (!user) return '/'
    if (user.role === 'ADMIN') return '/admin/dashboard'
    if (user.role === 'ORGANIZER') return '/organizer/dashboard'
    return '/student/dashboard'
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/20 bg-slate-950/90 text-white shadow-lg backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-16 py-3 gap-4">
          <Link to="/" className="flex items-center gap-3 font-display font-bold text-xl">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-500 text-slate-950 shadow-sm">
              <CalendarDays className="w-6 h-6" />
            </span>
            <span className="leading-none">CampusEvents</span>
          </Link>

          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <Link to="/" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white">
              Events
            </Link>

            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <div className="hidden sm:flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium max-w-32 truncate">{user.name}</span>
                  <span className="rounded bg-cyan-400/20 px-1.5 py-0.5 text-xs font-bold text-cyan-100">{user.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-rose-500/15 hover:text-rose-200"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 transition-colors hover:bg-cyan-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
