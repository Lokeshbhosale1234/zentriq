import api from './axios'

export const budgetApi = {

  // GET all budgets
  getAll: async () => {
    const res = await api.get('/budgets')
    return res.data.data
  },

  // GET budget analytics
  getAnalytics: async (month, year) => {
    const params = {}
    if (month) params.month = month
    if (year)  params.year  = year

    const res  = await api.get('/budgets/analytics', { params })
    const data = res.data?.data

    // Guard: backend must return an array.
    // If it returns null (no budgets) or an object (error shape), return []
    // so every consumer downstream always gets a safe empty array.
    if (!Array.isArray(data)) return []

    return data
  },

  // CREATE budget
  create: async (payload) => {
    const res = await api.post('/budgets', payload)
    return res.data.data
  },

  // UPDATE budget
  update: async (id, payload) => {
    const res = await api.put(`/budgets/${id}`, payload)
    return res.data.data
  },

  // DELETE budget
  delete: async (id) => {
    await api.delete(`/budgets/${id}`)
  },
}

export default budgetApi
