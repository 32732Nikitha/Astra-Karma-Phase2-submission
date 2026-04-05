import React from 'react'

export function SkeletonBox({ className = '', style = {} }) {
  return <div className={`skeleton ${className}`} style={style} />
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card space-y-3">
      <SkeletonBox className="h-4 w-2/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBox key={i} className="h-3" style={{ width: `${60 + Math.random() * 35}%` }} />
      ))}
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-4 animate-fade-in">
      <SkeletonBox className="h-28 rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        <SkeletonBox className="h-24 rounded-2xl" />
        <SkeletonBox className="h-24 rounded-2xl" />
      </div>
      <SkeletonBox className="h-36 rounded-2xl" />
      <SkeletonBox className="h-20 rounded-2xl" />
      <SkeletonBox className="h-20 rounded-2xl" />
      <SkeletonBox className="h-20 rounded-2xl" />
    </div>
  )
}