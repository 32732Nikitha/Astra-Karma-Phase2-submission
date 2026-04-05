import { useState, useEffect } from 'react'
import { mlApi } from '../api/mlApi'
import { useAuthStore } from '../store/authStore'

export function useForecast() {
  const user = useAuthStore((s) => s.user)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user?.geo_zone_id) return
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await mlApi.getForecast(user.geo_zone_id)
        setForecast(res.data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [user?.geo_zone_id])

  return { forecast, loading, error }
}