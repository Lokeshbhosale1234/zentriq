import axios from 'axios'

const api = axios.create({
  baseURL: 'https://zentriq-backend.onrender.com/api',

  // 30 seconds
  timeout: 30000,

  headers: {
    'Content-Type': 'application/json',
  },
})

/*
|--------------------------------------------------------------------------
| REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
| Automatically adds JWT token to every request
|
*/

api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem('fintech_jwt')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },

  (error) => Promise.reject(error)
)

/*
|--------------------------------------------------------------------------
| RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
| Handles:
| - timeout errors
| - unauthorized access
| - general backend errors
|
*/

api.interceptors.response.use(

  (response) => response,

  (error) => {

    // Timeout
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(
        new Error('Server is taking too long to respond')
      )
    }

    // Unauthorized
    if (error?.response?.status === 401) {

      localStorage.removeItem('fintech_jwt')
      localStorage.removeItem('fintech_user')

      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }

    // General backend error
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'An unexpected error occurred'

    return Promise.reject(new Error(message))
  }
)

export default api;