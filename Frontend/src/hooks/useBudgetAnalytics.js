import { useState, useEffect, useCallback } from 'react'
import { budgetApi } from '../api/budgetApi'

export function useBudgetAnalytics(month, year) {
  const [analytics, setAnalytics] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await budgetApi.getAnalytics(month, year)
      setAnalytics(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [month, year])

  useEffect(() => { fetch() }, [fetch])

  return { analytics, loading, error, refetch: fetch }
}
