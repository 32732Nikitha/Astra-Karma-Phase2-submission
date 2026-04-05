import { useEffect, useCallback } from 'react'
import { useWorkerStore } from '../store/workerStore'
import { workerApi } from '../api/workerApi'

export function useWorker() {
  const { profile, riskScore, riskLoading, setProfile, setRiskScore, setRiskLoading } = useWorkerStore()

  const fetchProfile = useCallback(async () => {
    try {
      const res = await workerApi.getMe()
      setProfile(res.data)
    } catch (e) {
      console.error('Failed to fetch worker profile', e)
    }
  }, [setProfile])

  const fetchRiskScore = useCallback(async () => {
    setRiskLoading(true)
    try {
      const res = await workerApi.getRiskScore()
      setRiskScore(res.data)
    } catch (e) {
      console.error('Failed to fetch risk score', e)
    } finally {
      setRiskLoading(false)
    }
  }, [setRiskScore, setRiskLoading])

  useEffect(() => {
    if (!profile) fetchProfile()
  }, [])

  return { profile, riskScore, riskLoading, fetchProfile, fetchRiskScore }
}