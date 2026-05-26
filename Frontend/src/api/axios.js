import axios from 'axios'

const api = axios.create({
  baseURL: 'https://zentriq-backend.onrender.com/api',

  // 30 seconds timeout
  timeout: 30000,

  headers: {
    'Content-Type': 'application/json',
  },
})

/*
|--------------------------------------------------------------------------
| REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
| Automatically attaches JWT token
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
| - backend wakeup delays
| - unauthorized access
| - general backend errors
|
*/

api.interceptors.response.use(

  (response) => response,

  (error) => {

    /*
    |--------------------------------------------------------------------------
    | BACKEND WAKEUP / TIMEOUT
    |--------------------------------------------------------------------------
    */

    if (
      error.code === 'ECONNABORTED' ||
      error.message?.includes('timeout')
    ) {

      return Promise.reject(
        new Error(
          'Backend server is waking up. Please wait a few seconds and try again.'
        )
      )
    }

    /*
    |--------------------------------------------------------------------------
    | UNAUTHORIZED
    |--------------------------------------------------------------------------
    */

    if (error?.response?.status === 401) {

      localStorage.removeItem('fintech_jwt')
      localStorage.removeItem('fintech_user')

      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }

    /*
    |--------------------------------------------------------------------------
    | GENERAL BACKEND ERROR
    |--------------------------------------------------------------------------
    */

    const message =
      error?.response?.data?.message ||
      error?.message ||
      'An unexpected error occurred'

    return Promise.reject(new Error(message))
  }
)

export default api