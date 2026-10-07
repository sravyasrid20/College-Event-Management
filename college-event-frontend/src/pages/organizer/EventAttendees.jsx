import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { Users, Mail, ArrowLeft, Loader2, Calendar } from 'lucide-react'

const EventAttendees = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [attendees, setAttendees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const res = await api.get(`/registrations/event/${eventId}`)
        setAttendees(res.data.data || [])
      } catch {
        toast.error('Failed to load attendees')
      } finally {
        setLoading(false)
      }
    }
    fetchAttendees()
  }, [eventId])

  return (
    <div className="page-shell">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => navigate('/organizer/dashboard')}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="page-title">Event Attendees</h1>
            <p className="page-subtitle">Students registered for this event</p>
          </div>
          {!loading && (
            <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-800">
              <Users className="h-4 w-4" />
              {attendees.length} attendee{attendees.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-cyan-700 animate-spin" /></div>
        ) : attendees.length === 0 ? (
          <div className="card text-center py-20 text-slate-400">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl font-medium">No attendees yet</p>
            <p className="text-sm mt-1">No one has registered for this event</p>
          </div>
        ) : (
          <div className="card">
            <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center gap-2 font-display font-semibold text-slate-950">
                <Users className="w-5 h-5 text-cyan-700" />
                {attendees.length} Registered Attendee{attendees.length !== 1 ? 's' : ''}
              </h2>
              <p className="text-sm text-slate-500">Event ID: {eventId}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] table-fixed text-sm">
                <colgroup>
                  <col className="w-16" />
                  <col className="w-[25%]" />
                  <col className="w-[38%]" />
                  <col className="w-[27%]" />
                </colgroup>
                <thead>
                  <tr className="table-head">
                    <th className="rounded-l-lg px-4 py-3 text-left">#</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="rounded-r-lg px-4 py-3 text-left">Registered At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attendees.map((a, i) => (
                    <tr key={a.registrationId} className="hover:bg-cyan-50/50 transition-colors">
                      <td className="px-4 py-4 align-middle text-slate-500">{i + 1}</td>
                      <td className="px-4 py-4 align-middle font-medium text-slate-950">{a.studentName}</td>
                      <td className="px-4 py-4 align-middle text-slate-600">
                        <div className="flex min-w-0 items-center gap-2">
                          <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                          <span className="truncate">{a.studentEmail}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-middle text-slate-500">
                        <div className="flex min-w-0 items-center gap-2">
                          <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
                          <span className="truncate">{new Date(a.registeredAt).toLocaleString()}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventAttendees
