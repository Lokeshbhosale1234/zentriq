import api from './axios'

/**
 * authApi.js
 * Uses the shared axios instance from axios.js
 * so baseURL, timeout, JWT handling, and interceptors
 * remain centralized and consistent.
 */

export const register = async ({ name, email, password }) => {

  const res = await api.post('/auth/register', {
    name,
    email,
    password,
  })

  return res.data.data
}

export const login = async ({ email, password }) => {

  const res = await api.post('/auth/login', {
    email,
    password,
  })

  return res.data.data
}

export default {
  register,
  login,
}