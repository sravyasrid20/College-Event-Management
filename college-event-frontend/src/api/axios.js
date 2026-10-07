import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect when login itself fails.
    // Login.jsx needs to receive the 401 so it can
    // show "Invalid email or password".
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes('/auth/login')
    ) {
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api