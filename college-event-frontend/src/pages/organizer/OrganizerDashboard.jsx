import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import EventCard from '../../components/EventCard'
import toast from 'react-hot-toast'
import { Plus, CalendarDays, Users, Clock, Trash2, Pencil, Loader2 } from 'lucide-react'

const OrganizerDashboard = () => {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const res = await api.get('/events/my')
      setEvents(res.data.data || [])
    } catch {
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return
    setDeleting(id)
    try {
      const res = await api.delete(`/events/${id}`)
      toast.success(res.data.message)
      setEvents((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  const approved = events.filter((e) => e.status === 'APPROVED').length
  const pending = events.filter((e) => e.status === 'PENDING').length
  const rejected = events.filter((e) => e.status === 'REJECTED').length
  const statsCards = [
    { label: 'Total Events', value: events.length, icon: CalendarDays, panel: 'bg-cyan-100', iconColor: 'text-cyan-700' },
    { label: 'Approved', value: approved, icon: CalendarDays, panel: 'bg-emerald-100', iconColor: 'text-emerald-700' },
    { label: 'Pending', value: pending, icon: Clock, panel: 'bg-amber-100', iconColor: 'text-amber-700' },
    { label: 'Rejected', value: rejected, icon: CalendarDays, panel: 'bg-rose-100', iconColor: 'text-rose-700' },
  ]

  return (
    <div className="page-shell">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="page-title">Organizer Dashboard</h1>
            <p className="page-subtitle">Manage your campus events, {user?.name}</p>
          </div>
          <Link to="/organizer/create-event" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Event
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className={`${stat.panel} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="font-display text-3xl font-bold text-slate-950">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-cyan-700 animate-spin" /></div>
        ) : events.length === 0 ? (
          <div className="card text-center py-20 text-slate-400">
            <CalendarDays className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="font-display text-xl font-semibold">No events yet</p>
            <Link to="/organizer/create-event" className="btn-primary inline-flex items-center gap-2 mt-4">
              <Plus className="w-4 h-4" /> Create your first event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                actionButton={
                  <div className="flex gap-2">
                    <Link
                      to={`/organizer/edit-event/${event.id}`}
                      state={{ event }}
                      className="btn-secondary flex items-center gap-1.5 flex-1 justify-center"
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </Link>
                    <Link
                      to={`/organizer/attendees/${event.id}`}
                      className="btn-secondary flex items-center gap-1.5 flex-1 justify-center"
                    >
                      <Users className="w-4 h-4" /> Attendees
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id, event.title)}
                      disabled={deleting === event.id}
                      className="btn-danger flex items-center gap-1 px-3"
                    >
                      {deleting === event.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrganizerDashboard
