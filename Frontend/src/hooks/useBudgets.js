import { useState, useEffect, useCallback } from 'react'
import { budgetApi } from '../api/budgetApi'

export function useBudgets() {
  const [budgets, setBudgets]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await budgetApi.getAll()
      setBudgets(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchBudgets() }, [fetchBudgets])

  const createBudget = useCallback(async (payload) => {
    const created = await budgetApi.create(payload)
    setBudgets(prev => [created, ...prev])
    return created
  }, [])

  const updateBudget = useCallback(async (id, payload) => {
    const updated = await budgetApi.update(id, payload)
    setBudgets(prev => prev.map(b => b.id === id ? updated : b))
    return updated
  }, [])

  const deleteBudget = useCallback(async (id) => {
    await budgetApi.delete(id)
    setBudgets(prev => prev.filter(b => b.id !== id))
  }, [])

  return { budgets, loading, error, createBudget, updateBudget, deleteBudget, refetch: fetchBudgets }
}
