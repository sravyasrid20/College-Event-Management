import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { Calendar, Clock, MapPin, Tag, Trash2, Loader2, BookOpen } from 'lucide-react'

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    setLoading(true)
    try {
      const res = await api.get('/registrations/my')
      setRegistrations(res.data.data || [])
    } catch {
      toast.error('Failed to load registrations')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (eventId, eventTitle) => {
    if (!window.confirm(`Cancel registration for "${eventTitle}"?`)) return
    setCancelling(eventId)
    try {
      const res = await api.delete(`/registrations/${eventId}`)
      toast.success(res.data.message || 'Registration cancelled')
      setRegistrations((prev) => prev.filter((r) => r.eventId !== eventId))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel')
    } finally {
      setCancelling(null)
    }
  }

  return (
    <div className="page-shell">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="page-title">My Registrations</h1>
          <p className="page-subtitle">Events you've signed up for</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-cyan-700 animate-spin" /></div>
        ) : registrations.length === 0 ? (
          <div className="card text-center py-20 text-slate-400">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl font-medium">No registrations yet</p>
            <p className="text-sm mt-1">Browse events and register to see them here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((reg) => (
              <div key={reg.registrationId} className="card flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-display font-bold text-slate-950 text-lg mb-2">{reg.eventTitle}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-cyan-600" />
                      {new Date(reg.eventDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-cyan-600" />
                      {reg.eventTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-cyan-600" />
                      {reg.venue}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4 text-cyan-600" />
                      {reg.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Registered: {new Date(reg.registeredAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleCancel(reg.eventId, reg.eventTitle)}
                  disabled={cancelling === reg.eventId}
                  className="btn-danger flex items-center gap-2 flex-shrink-0"
                >
                  {cancelling === reg.eventId ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Cancel
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyRegistrations
