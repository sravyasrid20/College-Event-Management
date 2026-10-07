import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle, Loader2, Clock, Calendar, MapPin, Users, Tag } from 'lucide-react'

const PendingEvents = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(null)

  useEffect(() => {
    fetchPending()
  }, [])

  const fetchPending = async () => {
    setLoading(true)
    try {
      const res = await api.get('/events/pending')
      setEvents(res.data.data || [])
    } catch {
      toast.error('Failed to load pending events')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id, title) => {
    setProcessing(`approve-${id}`)
    try {
      const res = await api.put(`/events/${id}/approve`)
      toast.success(`"${title}" approved!`)
      setEvents((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approve failed')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (id, title) => {
    if (!window.confirm(`Reject "${title}"?`)) return
    setProcessing(`reject-${id}`)
    try {
      const res = await api.put(`/events/${id}/reject`)
      toast.success(`"${title}" rejected`)
      setEvents((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reject failed')
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className="page-shell">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="page-title">Pending Events</h1>
          <p className="page-subtitle">Review and approve or reject event submissions</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-cyan-700 animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="card text-center py-20 text-slate-400">
            <Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl font-medium">No pending events</p>
            <p className="text-sm mt-1">All events have been reviewed</p>
          </div>
        ) : (
          <div className="space-y-5">
            {events.map((event) => (
              <div key={event.id} className="card hover:-translate-y-0.5 hover:shadow-xl transition-all">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0">
                        <Clock className="w-5 h-5 text-amber-700" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-slate-950 text-xl">{event.title}</h3>
                        <p className="text-sm text-slate-500 mt-0.5">Submitted by <span className="font-medium text-slate-700">{event.organizerName}</span></p>
                      </div>
                    </div>

                    {event.description && (
                      <p className="text-slate-600 text-sm mb-4 leading-relaxed">{event.description}</p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
                        <Calendar className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                        <span>{new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
                        <MapPin className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
                        <Users className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                        <span>Capacity: {event.capacity}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
                        <Tag className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                        <span>{event.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-3 md:w-36 flex-shrink-0">
                    <button
                      onClick={() => handleApprove(event.id, event.title)}
                      disabled={!!processing}
                      className="flex-1 md:flex-none btn-success flex items-center justify-center gap-2"
                    >
                      {processing === `approve-${event.id}` ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(event.id, event.title)}
                      disabled={!!processing}
                      className="flex-1 md:flex-none btn-danger flex items-center justify-center gap-2"
                    >
                      {processing === `reject-${event.id}` ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PendingEvents
