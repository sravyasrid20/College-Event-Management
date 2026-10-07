import React, { useEffect, useState } from 'react'
import { Calendar, Clock, MapPin, Users, Tag, X, UserRound, ClipboardList } from 'lucide-react'

const EventCard = ({ event, actionButton }) => {
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (!showDetails) return

    const handleEscape = (e) => {
      if (e.key === 'Escape') setShowDetails(false)
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [showDetails])

  const statusClass = {
    PENDING: 'badge-pending',
    APPROVED: 'badge-approved',
    REJECTED: 'badge-rejected',
  }[event.status] || 'badge-pending'

  const categoryColors = {
    Technical: 'bg-sky-100 text-sky-700',
    Cultural: 'bg-fuchsia-100 text-fuchsia-700',
    Sports: 'bg-emerald-100 text-emerald-700',
    Workshop: 'bg-orange-100 text-orange-700',
    Seminar: 'bg-rose-100 text-rose-700',
  }
  const catColor = categoryColors[event.category] || 'bg-slate-100 text-slate-700'
  const formattedDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Not set'
  const shortDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Not set'
  const registrationCount = event.registrationCount ?? 0
  const availableSeats = Math.max((event.capacity ?? 0) - registrationCount, 0)

  const detailItems = [
    { label: 'Date', value: formattedDate, icon: Calendar },
    { label: 'Time', value: event.eventTime || 'Not set', icon: Clock },
    { label: 'Venue', value: event.venue || 'Not set', icon: MapPin },
    { label: 'Capacity', value: `${registrationCount} / ${event.capacity ?? 0} registered`, icon: Users },
    { label: 'Available Seats', value: `${availableSeats}`, icon: ClipboardList },
    { label: 'Organizer', value: event.organizerName || 'Unknown', icon: UserRound },
  ]

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setShowDetails(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setShowDetails(true)
          }
        }}
        className="group overflow-hidden rounded-lg border border-white/80 bg-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
      >
        <div className="h-2 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-300" />
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-display font-bold text-slate-950 text-lg leading-snug flex-1 mr-2">{event.title}</h3>
            <span className={statusClass}>{event.status}</span>
          </div>

          {event.description && (
            <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">{event.description}</p>
          )}

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar className="w-4 h-4 text-cyan-600 flex-shrink-0" />
              <span>{shortDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock className="w-4 h-4 text-cyan-600 flex-shrink-0" />
              <span>{event.eventTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-cyan-600 flex-shrink-0" />
              <span>{event.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Users className="w-4 h-4 text-cyan-600 flex-shrink-0" />
              <span>{registrationCount} / {event.capacity} registered</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${catColor}`}>
              <Tag className="w-3 h-3" />
              {event.category}
            </span>
            <span className="text-xs font-medium text-slate-400">By {event.organizerName}</span>
          </div>

          {actionButton && (
            <div
              className="mt-4 pt-4 border-t border-slate-100"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {actionButton}
            </div>
          )}
        </div>
      </div>

      {showDetails && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm"
          onClick={() => setShowDetails(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`event-details-${event.id}`}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-2 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-300" />
            <div className="p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className={statusClass}>{event.status}</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${catColor}`}>
                      <Tag className="w-3 h-3" />
                      {event.category}
                    </span>
                  </div>
                  <h2 id={`event-details-${event.id}`} className="font-display text-2xl font-bold text-slate-950">
                    {event.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDetails(false)}
                  className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Close event details"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6 rounded-lg bg-slate-50 p-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Description</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {event.description || 'No description provided for this event.'}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {detailItems.map((item) => (
                  <div key={item.label} className="flex gap-3 rounded-lg border border-slate-100 bg-white p-4">
                    <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg bg-cyan-50 text-cyan-700">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{item.label}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {event.createdAt && (
                <p className="mt-5 text-xs text-slate-400">
                  Created on {new Date(event.createdAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default EventCard
