import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LoadingScreen from './components/common/LoadingScreen'
import ErrorBoundary from './components/common/ErrorBoundary'
import { Toaster } from "react-hot-toast";
import MainLayout from './components/layout/MainLayout'
// import GigWorkerCursor from './components/GigWorkerCursor';

// Lazy-loaded pages
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Onboarding = lazy(() => import('./pages/Onboarding'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Policy = lazy(() => import('./pages/Policy'))
const Plans = lazy(() => import('./pages/Plans'))
const Forecast = lazy(() => import('./pages/Forecast'))
const Payouts = lazy(() => import('./pages/Payouts'))
const Events = lazy(() => import('./pages/Events'))
const Profile = lazy(() => import('./pages/Profile'))

function WorkerProtectedLayout() {
  const { token, user } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  if (user && !user.onboarding_complete) return <Navigate to="/onboarding" replace />
  return <MainLayout />
}

function OnboardingGate() {
  const token = useAuthStore((s) => s.token)
  if (!token) return <Navigate to="/login" replace />
  return <Onboarding />
}

function WorkerHomeRedirect() {
  const { token, user } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  if (user && !user.onboarding_complete) return <Navigate to="/onboarding" replace />
  return <Navigate to="/dashboard" replace />
}

function PublicRoute({ children }) {
  const { token, user } = useAuthStore()
  if (token) {
    if (user && !user.onboarding_complete) return <Navigate to="/onboarding" replace />
    return <Navigate to="/dashboard" replace />
  }
  return children
}

function LandingAuthBridge() {
  const setAuth = useAuthStore((s) => s.setAuth)
  useEffect(() => {
    const migrate = () => {
      const token = localStorage.getItem('bhima_token')
      const refresh = localStorage.getItem('bhima_refresh')
      const wid = localStorage.getItem('bhima_worker_id')
      const wname = localStorage.getItem('bhima_worker_name')
      if (!token || !wid) return
      setAuth(
        {
          worker_id: Number(wid),
          name: wname || 'Worker',
          onboarding_complete: true,
        },
        token,
        refresh || null
      )
      localStorage.removeItem('bhima_token')
      localStorage.removeItem('bhima_refresh')
      localStorage.removeItem('bhima_worker_id')
      localStorage.removeItem('bhima_worker_name')
      localStorage.removeItem('bhima_role')
      localStorage.removeItem('bhima_name')
    }
    const id = window.setTimeout(migrate, 0)
    return () => window.clearTimeout(id)
  }, [setAuth])
  return null
}

export default function App() {
  return (
    <ErrorBoundary>
      <LandingAuthBridge />
      {/* <GigWorkerCursor /> */}
      <BrowserRouter basename="/worker">
        <Suspense fallback={<LoadingScreen />}>
          <Routes>

            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

            <Route path="/onboarding" element={<OnboardingGate />} />

            <Route element={<WorkerProtectedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/policy" element={<Policy />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/payouts" element={<Payouts />} />
              <Route path="/events" element={<Events />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="/" element={<WorkerHomeRedirect />} />
            <Route path="*" element={<WorkerHomeRedirect />} />

          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster position="top-right" />
    </ErrorBoundary>
  )
}
