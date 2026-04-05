import { useEffect } from 'react'
import { wsService } from '../api/wsService'
import { useAuthStore } from '../store/authStore'

export function useWebSocket() {
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    if (user?.geo_zone_id) {
      wsService.connect(user.geo_zone_id)
    }
    return () => {
      // Don't disconnect on component unmount — keep persistent connection
    }
  }, [user?.geo_zone_id])

  return wsService
}