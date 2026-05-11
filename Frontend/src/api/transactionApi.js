import api from './axios'

export const transactionApi = {

  // GET all transactions
  getAll: async () => {
    const res = await api.get('/transactions')
    return res.data.data
  },

  // Search / filter transactions
  search: async (params) => {
    const res = await api.get('/transactions', {
      params: Object.fromEntries(params),
    })
    return res.data.data
  },

  // Create transaction
  create: async (payload) => {
    const res = await api.post('/transactions', payload)
    return res.data.data
  },

  // Delete transaction
  delete: async (id) => {
    await api.delete(`/transactions/${id}`)
  },

  // Analytics
  getAnalytics: async () => {
    const res = await api.get('/transactions/analytics')
    return res.data.data
  },
}

export default transactionApi