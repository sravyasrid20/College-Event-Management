import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectMap = {
      ADMIN: '/admin/dashboard',
      ORGANIZER: '/organizer/dashboard',
      STUDENT: '/student/dashboard',
    }
    return <Navigate to={redirectMap[user.role] || '/'} replace />
  }

  return children
}

export default ProtectedRoute
