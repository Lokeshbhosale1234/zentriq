import api from './axios'

export const transactionApi = {

  getAll: async () => {
    const res = await api.get('/transactions')
    return res.data.data
  },

  create: async (payload) => {
    const res = await api.post('/transactions', payload)
    return res.data.data
  },

  delete: async (id) => {
    await api.delete(`/transactions/${id}`)
  },

  getAnalytics: async () => {
    const res = await api.get('/transactions/analytics')
    return res.data.data
  },
}

export default transactionApi;