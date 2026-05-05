import axios from 'axios'

const BASE_URL = '/api/transactions'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Response interceptor for unified error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'An unexpected error occurred'
    return Promise.reject(new Error(message))
  }
)

export const transactionApi = {
  getAll: async () => {
    const res = await api.get('')
    return res.data.data
  },

  create: async (payload) => {
    const res = await api.post('', payload)
    return res.data.data
  },

  delete: async (id) => {
    await api.delete(`/${id}`)
  },

  getAnalytics: async () => {
    const res = await api.get('/analytics')
    return res.data.data
  },
}

export default transactionApi
