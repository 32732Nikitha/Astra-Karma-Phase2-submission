'use client'

import Link from 'next/link'

const linkClass =
  'text-[11px] font-mono uppercase tracking-widest transition-colors hover:text-[#84f57c]'

export function PortalNav() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between gap-4 px-6 py-4 md:px-12"
      style={{
        background: 'linear-gradient(to bottom, rgba(10,10,10,0.95), rgba(10,10,10,0.7), transparent)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <Link
        href="/"
        className="text-sm font-black uppercase tracking-tighter text-white md:text-base"
      >
        Bhima Astra
      </Link>
      <nav className="flex flex-wrap items-center justify-end gap-4 md:gap-8" style={{ color: '#a3a3a3' }}>
        <Link href="/admin/login" className={linkClass}>
          Admin
        </Link>
        <Link href="/manager" className={linkClass}>
          Manager
        </Link>
        <Link href="/worker/login" className={linkClass}>
          Worker
        </Link>
      </nav>
    </header>
  )
}
