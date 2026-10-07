import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AIChatbot from './components/AIChatbot'

import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'

import StudentDashboard from './pages/student/StudentDashboard'
import MyRegistrations from './pages/student/MyRegistrations'

import OrganizerDashboard from './pages/organizer/OrganizerDashboard'
import CreateEvent from './pages/organizer/CreateEvent'
import EventAttendees from './pages/organizer/EventAttendees'

import AdminDashboard from './pages/admin/AdminDashboard'
import ManageUsers from './pages/admin/ManageUsers'
import PendingEvents from './pages/admin/PendingEvents'

const RedirectIfLoggedIn = ({ children }) => {
  const { user } = useAuth()

  if (user) {
    const map = {
      ADMIN: '/admin/dashboard',
      ORGANIZER: '/organizer/dashboard',
      STUDENT: '/student/dashboard',
    }

    return <Navigate to={map[user.role] || '/'} replace />
  }

  return children
}

const AppRoutes = () => {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <RedirectIfLoggedIn>
              <Login />
            </RedirectIfLoggedIn>
          }
        />

        <Route
          path="/register"
          element={
            <RedirectIfLoggedIn>
              <Register />
            </RedirectIfLoggedIn>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/registrations"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <MyRegistrations />
            </ProtectedRoute>
          }
        />

        {/* Organizer Routes */}
        <Route
          path="/organizer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ORGANIZER']}>
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer/create-event"
          element={
            <ProtectedRoute allowedRoles={['ORGANIZER']}>
              <CreateEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer/edit-event/:id"
          element={
            <ProtectedRoute allowedRoles={['ORGANIZER']}>
              <CreateEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer/attendees/:eventId"
          element={
            <ProtectedRoute allowedRoles={['ORGANIZER']}>
              <EventAttendees />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/pending-events"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <PendingEvents />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* AI Chatbot */}
      <AIChatbot />
    </>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              borderRadius: '10px',
              fontSize: '14px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#f1f5f9',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#f1f5f9',
              },
            },
          }}
        />

        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App