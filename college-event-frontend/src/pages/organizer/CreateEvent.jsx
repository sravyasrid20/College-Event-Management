import React, { useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { CalendarDays, Loader2, ArrowLeft } from 'lucide-react'

const CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Other']

const CreateEvent = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const existingEvent = location.state?.event
  const isEdit = !!id

  const [form, setForm] = useState({
    title: existingEvent?.title || '',
    description: existingEvent?.description || '',
    venue: existingEvent?.venue || '',
    eventDate: existingEvent?.eventDate || '',
    eventTime: existingEvent?.eventTime || '',
    capacity: existingEvent?.capacity || '',
    category: existingEvent?.category || 'Technical',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.venue || !form.eventDate || !form.eventTime || !form.capacity) {
      toast.error('Please fill all required fields')
      return
    }
    setLoading(true)
    try {
      const payload = { ...form, capacity: parseInt(form.capacity) }
      let res
      if (isEdit) {
        res = await api.put(`/events/${id}`, payload)
      } else {
        res = await api.post('/events', payload)
      }
      toast.success(res.data.message || (isEdit ? 'Event updated!' : 'Event created!'))
      navigate('/organizer/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => navigate('/organizer/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-cyan-100 p-2.5 rounded-lg">
              <CalendarDays className="w-6 h-6 text-cyan-700" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-950">{isEdit ? 'Edit Event' : 'Create New Event'}</h1>
              <p className="text-slate-500 text-sm">{isEdit ? 'Update event details' : 'Fill in the details below'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Event Title *</label>
              <input name="title" type="text" className="input-field" placeholder="e.g. Annual Tech Symposium" value={form.title} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea name="description" rows={4} className="input-field resize-none" placeholder="Describe the event..." value={form.description} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Event Date *</label>
                <input name="eventDate" type="date" className="input-field" value={form.eventDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Event Time *</label>
                <input name="eventTime" type="time" className="input-field" value={form.eventTime} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Venue *</label>
              <input name="venue" type="text" className="input-field" placeholder="e.g. Main Auditorium, Block A" value={form.venue} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Capacity *</label>
                <input name="capacity" type="number" min={1} className="input-field" placeholder="e.g. 200" value={form.capacity} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category *</label>
                <select name="category" className="input-field" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate('/organizer/dashboard')} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {loading ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateEvent
