import { useState, useEffect, useCallback } from 'react'
import { transactionApi } from '../api/transactionApi'

export function useTransactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await transactionApi.getAll()
      setTransactions(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTransactions() }, [fetchTransactions])

  const addTransaction = useCallback(async (payload) => {
    const created = await transactionApi.create(payload)
    setTransactions((prev) => [created, ...prev])
    return created
  }, [])

  const deleteTransaction = useCallback(async (id) => {
    await transactionApi.delete(id)
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { transactions, loading, error, addTransaction, deleteTransaction, refetch: fetchTransactions }
}
