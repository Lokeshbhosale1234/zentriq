/**
 * axiosSetup.js
 * Configures Axios interceptors ONCE at app startup.
 * - Request interceptor: attaches JWT from localStorage to every request
 * - Response interceptor: redirects to /login on 401
 *
 * Import this file once in main.jsx (or App.jsx) — do NOT import multiple times.
 */
import axios from 'axios'

const TOKEN_KEY = 'fintech_jwt'

// ── Request: attach token ─────────────────────────────────────────────────────
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response: handle 401 globally ────────────────────────────────────────────
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Token expired or invalid → clear storage and redirect to login
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem('fintech_user')
      delete axios.defaults.headers.common['Authorization']
      // Only redirect if not already on an auth page
      if (!window.location.pathname.startsWith('/login') &&
          !window.location.pathname.startsWith('/signup')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
