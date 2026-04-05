'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import RightPanel from '@/components/RightPanel'

function isAdminSession(): boolean {
  if (typeof window === 'undefined') return false
  const token = localStorage.getItem('bhima_token')
  const role = localStorage.getItem('bhima_role')
  return Boolean(token && role === 'admin')
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isLogin = pathname === '/admin/login'
  const [ready, setReady] = useState(false)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    if (isLogin) {
      if (isAdminSession()) {
        router.replace('/admin')
        return
      }
      setReady(true)
      return
    }
    if (!isAdminSession()) {
      router.replace('/admin/login')
      return
    }
    setAllowed(true)
    setReady(true)
  }, [pathname, isLogin, router])

  if (isLogin) {
    if (!ready) {
      return (
        <div className="admin-app-root">
          <div className="relative z-[1] min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
            Loading…
          </div>
        </div>
      )
    }
    return (
      <div className="admin-app-root">
        <div className="relative z-[1] min-h-screen">{children}</div>
      </div>
    )
  }

  if (!ready || !allowed) {
    return (
      <div className="admin-app-root">
        <div className="relative z-[1] min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
          Checking access…
        </div>
      </div>
    )
  }

  return (
    <div className="admin-app-root min-h-screen bg-slate-50">
      <div className="relative z-[1] min-h-screen">
        <Sidebar />
        <RightPanel />
        <main className="ml-[220px] mr-[260px] min-h-screen p-6">{children}</main>
      </div>
    </div>
  )
}
