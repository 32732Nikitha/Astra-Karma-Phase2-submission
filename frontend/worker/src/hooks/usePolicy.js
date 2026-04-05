import { useEffect, useCallback } from 'react'
import { usePolicyStore } from '../store/policyStore'
import { policyApi } from '../api/policyApi'

export function usePolicy() {
  const { activePolicy, loading, error, setActivePolicy, setLoading, setError } = usePolicyStore()

  const fetchActivePolicy = useCallback(async () => {
    setLoading(true)
    try {
      const res = await policyApi.getActive()
      setActivePolicy(res.data)
    } catch (e) {
      if (e.response?.status !== 404) setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [setActivePolicy, setLoading, setError])

  useEffect(() => {
    if (!activePolicy) fetchActivePolicy()
  }, [])

  return { activePolicy, loading, error, refetch: fetchActivePolicy }
}