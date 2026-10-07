import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import EventCard from '../components/EventCard'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Search, CalendarDays, Loader2 } from 'lucide-react'

const CATEGORIES = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar']

const Home = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [registering, setRegistering] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const res = await api.get('/events')
      setEvents(res.data.data || [])
    } catch {
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (eventId) => {
    if (!user) {
      toast.error('Please login to register for events')
      return
    }
    setRegistering(eventId)
    try {
      const res = await api.post(`/registrations/${eventId}`)
      toast.success(res.data.message || 'Registered successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setRegistering(null)
    }
  }

  const filtered = events.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || e.category === category
    return matchSearch && matchCat
  })

  return (
    <div className="min-h-screen bg-transparent">
      <div className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(8,145,178,0.45),transparent_45%),linear-gradient(300deg,rgba(251,191,36,0.18),transparent_42%)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-cyan-100">
              <CalendarDays className="w-4 h-4" />
              Campus event hub
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold leading-tight mb-4">Discover Campus Events</h1>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl">Find technical meets, cultural programs, sports days, workshops, and seminars across campus.</p>
          </div>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search events by title or venue..."
              className="w-full rounded-lg border border-white/20 bg-white py-4 pl-12 pr-4 text-slate-950 shadow-xl outline-none transition focus:ring-2 focus:ring-cyan-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat
                  ? 'bg-cyan-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-cyan-300 hover:text-cyan-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-cyan-700 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-20 text-slate-400">
            <CalendarDays className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="font-display text-xl font-semibold">No events found</p>
            <p className="text-sm mt-1">Try changing your search or category filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                actionButton={
                  user?.role === 'STUDENT' ? (
                    <button
                      onClick={() => handleRegister(event.id)}
                      disabled={registering === event.id || event.registrationCount >= event.capacity}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      {registering === event.id ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Registering...</>
                      ) : event.registrationCount >= event.capacity ? (
                        'Event Full'
                      ) : (
                        'Register Now'
                      )}
                    </button>
                  ) : null
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
