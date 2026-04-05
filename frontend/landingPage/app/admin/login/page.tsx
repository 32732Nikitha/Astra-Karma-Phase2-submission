'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, LogIn } from 'lucide-react'

function apiRoot() {
  const env = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '')
  if (env) return env
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/v1`
  }
  return 'http://127.0.0.1:8000/api/v1'
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${apiRoot()}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const d = data?.detail
        const msg =
          typeof d === 'string'
            ? d
            : Array.isArray(d)
              ? d.map((x: { msg?: string }) => x?.msg).filter(Boolean).join(' ') ||
                'Invalid credentials'
              : 'Invalid credentials'
        setError(msg)
        return
      }
      const d = data?.data
      if (!d?.access_token) {
        setError('Unexpected response from server.')
        return
      }
      if (d.role !== 'admin' && d.role !== 'super_admin') {
        setError(
          'This portal is for administrators only. Use Manager or Worker from the home page.'
        )
        return
      }
      localStorage.setItem('bhima_token', d.access_token)
      localStorage.setItem('bhima_refresh', d.refresh_token)
      localStorage.setItem(
        'bhima_role',
        d.role === 'super_admin' ? 'admin' : d.role
      )
      localStorage.setItem('bhima_name', d.name || '')
      router.replace('/admin')
      router.refresh()
    } catch {
      setError('Could not reach the server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Admin sign in</h1>
            <p className="text-xs text-slate-400">BHIMA ASTRA console</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="admin@bhimaastra.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="admin123"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-2.5 text-sm font-semibold text-white transition-colors"
          >
            <LogIn size={16} />
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          <Link href="/" className="text-indigo-400 hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
