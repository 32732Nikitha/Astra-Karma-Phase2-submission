'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, FileText, AlertCircle,
  ShieldAlert, Zap, BarChart3, Settings, ChevronRight,
  Shield
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/workers', label: 'Workers', icon: Users },
  { href: '/admin/policies', label: 'Policies', icon: FileText },
  { href: '/admin/claims', label: 'Claims', icon: AlertCircle },
  { href: '/admin/fraud', label: 'Fraud Detection', icon: ShieldAlert },
  { href: '/admin/triggers', label: 'Live Triggers', icon: Zap },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('bhima_token')
    localStorage.removeItem('bhima_refresh')
    localStorage.removeItem('bhima_role')
    localStorage.removeItem('bhima_name')
    window.location.assign('/')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] bg-white border-r border-slate-100 flex flex-col z-40" style={{boxShadow:'2px 0 20px rgb(0 0 0 / 0.04)'}}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-indigo flex items-center justify-center flex-shrink-0" style={{boxShadow:'0 4px 12px rgb(99 102 241 / 0.4)'}}>
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <div className="font-display font-800 text-[15px] text-slate-900 leading-tight" style={{fontFamily:'Syne,sans-serif',fontWeight:800}}>BHIMA ASTRA</div>
            <div className="text-[10px] text-slate-400 font-500">BhimaAstra Admin</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] text-slate-400 font-600 uppercase tracking-widest px-3 mb-2">Main Menu</div>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} className={`nav-item ${active ? 'active' : ''}`}>
              <Icon size={16} className="flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={13} className="opacity-70" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-slate-100">
        <button
          type="button"
          onClick={handleLogout}
          className="nav-item w-full text-left text-rose-600 hover:bg-rose-50"
        >
          <span className="text-xs font-600">Sign out</span>
        </button>
        <Link href="/admin/settings" className={`nav-item ${pathname === '/admin/settings' ? 'active' : ''}`}>
          <Settings size={16} />
          <span>Settings</span>
        </Link>
        <div className="mt-3 mx-1 p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100">
          <div className="text-[11px] font-600 text-indigo-700">System Status</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-slow" />
            <span className="text-[10px] text-slate-500">All systems operational</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
