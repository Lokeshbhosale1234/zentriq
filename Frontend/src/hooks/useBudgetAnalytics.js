import { useState, useEffect, useCallback } from 'react'
import { budgetApi } from '../api/budgetApi'

export function useBudgetAnalytics(month, year) {
  const [analytics, setAnalytics] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await budgetApi.getAnalytics(month, year)

      // budgetApi.getAnalytics already guards with Array.isArray,
      // but double-check here so this hook always sets an array.
      setAnalytics(Array.isArray(data) ? data : [])

    } catch (err) {
      // ── KEY FIX ──────────────────────────────────────────────────────────
      // Previous code only called setError(err.message) here.
      // It never called setAnalytics([]) in the catch block.
      // This meant analytics stayed at its previous value (or initial []).
      // In certain React render-cycle timings the stale non-array value
      // could reach BudgetOverviewBar and cause secondary crashes.
      // Always reset to [] on any error so every consumer gets a safe array.
      setAnalytics([])
      setError(err?.response?.data?.message || err.message || 'Failed to load budget analytics')
    } finally {
      setLoading(false)
    }
  }, [month, year])

  useEffect(() => { fetch() }, [fetch])

  return { analytics, loading, error, refetch: fetch }
}
