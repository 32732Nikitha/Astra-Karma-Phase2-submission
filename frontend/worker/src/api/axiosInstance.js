import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { goToLanding } from '../utils/landingUrl'

function resolveApiBase() {
  const v = import.meta.env.VITE_API_URL
  if (v && String(v).trim()) return String(v).replace(/\/$/, '')
  if (typeof window !== 'undefined') {
    const port = window.location.port
    if (port === '5173' || port === '5174') {
      return 'http://127.0.0.1:8000/api/v1'
    }
    return `${window.location.origin}/api/v1`
  }
  return 'http://127.0.0.1:8000/api/v1'
}

const api = axios.create({
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    config.baseURL = resolveApiBase()
    const path = config.url || ''
    const isAuthPublic =
      path.includes('/auth/send-otp') ||
      path.includes('/auth/verify-otp') ||
      path.includes('/auth/otp/')
    const token = useAuthStore.getState().token
    if (token && !isAuthPublic) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle errors + token refresh
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = useAuthStore.getState().refreshToken
        const { data } = await axios.post(
          `${resolveApiBase()}/auth/refresh`,
          { refresh_token: refreshToken }
        )
        const access_token = data?.data?.access_token ?? data?.access_token
        useAuthStore.getState().setAuth(
          useAuthStore.getState().user,
          access_token,
          refreshToken
        )
        processQueue(null, access_token)
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        useAuthStore.getState().logout()
        goToLanding()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Show error toast for non-401 errors
    const message = error.response?.data?.detail || error.message || 'Something went wrong'
    if (error.response?.status !== 422) {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default api