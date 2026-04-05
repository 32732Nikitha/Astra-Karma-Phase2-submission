'use client'

import { useEffect, useState } from 'react'
import { CloudRain, Wind, Sun } from 'lucide-react'

const weatherFrames = [
  {
    city: 'Hyderabad',
    condition: 'Heavy Rainfall',
    value: '120mm',
    risk: 'HIGH',
    color: 'bg-rose-500',
    icon: CloudRain,
    gradient: 'from-indigo-600 via-blue-500 to-indigo-400'
  },
  {
    city: 'Delhi',
    condition: 'Dense Fog',
    value: '<50m visibility',
    risk: 'HIGH',
    color: 'bg-rose-500',
    icon: CloudRain,
    gradient: 'from-gray-400 via-slate-400 to-gray-300'
  },
  {
    city: 'Chennai',
    condition: 'Strong Winds',
    value: '45 km/h',
    risk: 'MEDIUM',
    color: 'bg-orange-400',
    icon: Wind,
    gradient: 'from-blue-500 via-indigo-400 to-blue-300'
  },
  {
    city: 'Bangalore',
    condition: 'Clear Weather',
    value: 'Stable',
    risk: 'LOW',
    color: 'bg-emerald-500',
    icon: Sun,
    gradient: 'from-emerald-400 via-teal-400 to-green-300'
  }
]

export default function RightPanel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % weatherFrames.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const current = weatherFrames[index]
  const Icon = current.icon

  return (
    <div className="fixed right-0 top-0 w-[260px] h-screen bg-white border-l border-slate-100 z-40 flex flex-col">

      {/* 🔥 FULL HEIGHT WEATHER CARD */}
      <div className={`relative flex-1 p-4 overflow-hidden bg-gradient-to-br ${current.gradient} text-white transition-all duration-700`}>

        {/* Floating Glow */}
        <div className="absolute w-40 h-40 bg-white/10 blur-3xl rounded-full top-[-20px] left-[-20px] animate-pulse" />
        <div className="absolute w-32 h-32 bg-white/10 blur-2xl rounded-full bottom-[-20px] right-[-10px] animate-pulse" />

        {/* Live */}
        <div className="absolute top-3 right-3 flex items-center gap-1 text-xs">
          <span className="w-2 h-2 bg-red-400 rounded-full animate-ping" />
          Live
        </div>

        {/* Header */}
        <div className="text-[11px] opacity-80 mb-6">
          AI Weather Monitoring
        </div>

        {/* Icon */}
        <div className="mb-4 transition-all duration-500">
          <Icon size={34} />
        </div>

        {/* Content */}
        <div className="space-y-2 animate-fadeIn">
          <div className="text-xl font-bold">
            {current.city}
          </div>

          <div className="text-sm opacity-90">
            {current.condition}
          </div>

          <div className="text-xs opacity-70">
            {current.value}
          </div>

          <div className={`inline-block text-[11px] px-3 py-1 rounded-full mt-3 ${current.color}`}>
            Risk: {current.risk}
          </div>
        </div>

        {/* Bottom Overlay Stats */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md rounded-xl p-3 text-xs space-y-2">
          <div className="flex justify-between">
            <span>Affected</span>
            <span>120</span>
          </div>
          <div className="flex justify-between">
            <span>Alerts</span>
            <span>6</span>
          </div>
          <div className="flex justify-between">
            <span>Claims</span>
            <span>21</span>
          </div>
        </div>

      </div>
    </div>
  )
}