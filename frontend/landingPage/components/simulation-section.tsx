"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface Particle {
  x: number
  y: number
  speed: number
  length: number
}

interface Confetti {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  color: string
}

// Vertical scrolling face avatars
const leftFaces = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&h=60&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=60&h=60&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop&crop=face",
]

const rightFaces = [
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=60&h=60&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=60&h=60&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face",
]

function VerticalMarquee({ 
  faces, 
  direction = "up",
  className = ""
}: { 
  faces: string[]
  direction?: "up" | "down"
  className?: string
}) {
  const doubled = [...faces, ...faces, ...faces]
  
  return (
    <div className={`overflow-hidden h-full ${className}`}>
      <motion.div
        animate={{ 
          y: direction === "up" ? [0, -33.33 * faces.length * 4.5] : [-33.33 * faces.length * 4.5, 0]
        }}
        transition={{
          y: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          },
        }}
        className="flex flex-col gap-3"
      >
        {doubled.map((face, i) => (
          <div
            key={i}
            className="relative w-10 h-10 rounded-full overflow-hidden grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Image src={face} alt="" fill className="object-cover" />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export function SimulationSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [rainfall, setRainfall] = useState(50)
  const [showPayout, setShowPayout] = useState(false)
  const [payoutAmount, setPayoutAmount] = useState(0)
  const [walletDraining, setWalletDraining] = useState(false)
  const particlesRef = useRef<{ left: Particle[]; right: Particle[] }>({
    left: [],
    right: [],
  })
  const confettiRef = useRef<Confetti[]>([])
  const animationRef = useRef<number>(0)
  const prevRainfallRef = useRef(50)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const initParticles = useCallback((canvas: HTMLCanvasElement) => {
    const particleCount = 250
    particlesRef.current = { left: [], right: [] }

    for (let i = 0; i < particleCount; i++) {
      const baseParticle = {
        x: Math.random() * (canvas.width / 2),
        y: Math.random() * canvas.height,
        speed: 12 + Math.random() * 12,
        length: 25 + Math.random() * 35,
      }
      particlesRef.current.left.push({ ...baseParticle })
      particlesRef.current.right.push({
        ...baseParticle,
        x: canvas.width / 2 + Math.random() * (canvas.width / 2),
      })
    }
  }, [])

  useEffect(() => {
    if (!isMounted) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
        initParticles(canvas)
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const intensity = rainfall / 150
      const midX = canvas.width / 2

      // Draw left side (Chaos - aggressive rain)
      ctx.save()
      ctx.beginPath()
      ctx.rect(0, 0, midX - 2, canvas.height)
      ctx.clip()

      // More aggressive rain on left
      particlesRef.current.left.forEach((p) => {
        p.y += p.speed * intensity * 1.2
        p.x += 2.5
        if (p.y > canvas.height) {
          p.y = -p.length
          p.x = Math.random() * midX
        }
        if (p.x > midX) p.x = 0

        // Rain streaks - white/gray aggressive
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 + intensity * 0.5})`
        ctx.lineWidth = 2
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x + 4, p.y + p.length * intensity * 1.2)
        ctx.stroke()

        // Splash effect at bottom
        if (p.y > canvas.height - 80 && p.y < canvas.height - 50) {
          ctx.beginPath()
          ctx.arc(p.x, canvas.height - 50, 5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${0.15 * intensity})`
          ctx.fill()
        }
      })
      ctx.restore()

      // Draw right side (Shield - neon green protection)
      ctx.save()
      ctx.beginPath()
      ctx.rect(midX + 2, 0, midX, canvas.height)
      ctx.clip()

      // Draw neon dome
      const domeRadius = Math.min(canvas.width / 4, canvas.height * 0.5)
      const domeX = midX + canvas.width / 4
      const domeY = canvas.height * 0.72

      // Dome glow layers
      for (let i = 3; i >= 0; i--) {
        const gradient = ctx.createRadialGradient(
          domeX, domeY, 0,
          domeX, domeY, domeRadius * (1 + i * 0.15)
        )
        gradient.addColorStop(0, `rgba(132, 245, 124, ${0.08 - i * 0.015})`)
        gradient.addColorStop(0.7, `rgba(132, 245, 124, ${0.04 - i * 0.008})`)
        gradient.addColorStop(1, "rgba(132, 245, 124, 0)")

        ctx.beginPath()
        ctx.arc(domeX, domeY, domeRadius * (1 + i * 0.15), Math.PI, 0)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // Dome border - thick neon with glow
      ctx.beginPath()
      ctx.arc(domeX, domeY, domeRadius, Math.PI, 0)
      ctx.strokeStyle = `rgba(132, 245, 124, ${0.7 + intensity * 0.3})`
      ctx.lineWidth = 5
      ctx.shadowColor = "#84f57c"
      ctx.shadowBlur = 30
      ctx.stroke()
      ctx.shadowBlur = 0

      // Rain deflecting off dome - neon green
      particlesRef.current.right.forEach((p) => {
        const dx = p.x - domeX
        const distFromCenter = Math.abs(dx)

        if (distFromCenter < domeRadius) {
          const domeHeight = domeY - Math.sqrt(Math.max(0, domeRadius * domeRadius - dx * dx))
          if (p.y + p.length * intensity > domeHeight) {
            p.y = domeHeight - p.length
            p.x += dx > 0 ? 5 : -5
          } else {
            p.y += p.speed * intensity * 0.6
          }
        } else {
          p.y += p.speed * intensity * 0.8
        }

        p.x += 2
        if (p.y > canvas.height || p.x > canvas.width) {
          p.y = -p.length
          p.x = midX + Math.random() * (canvas.width / 2)
        }

        ctx.beginPath()
        ctx.strokeStyle = `rgba(132, 245, 124, ${0.25 + intensity * 0.45})`
        ctx.lineWidth = 2
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x + 3, p.y + p.length * intensity * 0.35)
        ctx.stroke()
      })
      ctx.restore()

      // Draw center divider
      ctx.beginPath()
      ctx.moveTo(midX, 0)
      ctx.lineTo(midX, canvas.height)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw confetti (neon colors)
      confettiRef.current.forEach((c, i) => {
        c.x += c.vx
        c.y += c.vy
        c.vy += 0.18
        c.rotation += c.rotationSpeed

        ctx.save()
        ctx.translate(c.x, c.y)
        ctx.rotate(c.rotation)
        ctx.fillStyle = c.color
        ctx.shadowColor = c.color
        ctx.shadowBlur = 12
        ctx.fillRect(-7, -4, 14, 8)
        ctx.restore()

        if (c.y > canvas.height) {
          confettiRef.current.splice(i, 1)
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationRef.current)
    }
  }, [rainfall, initParticles, isMounted])

  // Wallet draining effect when rainfall increases
  useEffect(() => {
    if (rainfall > 60) {
      setWalletDraining(true)
    } else {
      setWalletDraining(false)
    }
  }, [rainfall])

  useEffect(() => {
    if (rainfall > 100 && prevRainfallRef.current <= 100) {
      setShowPayout(true)
      setPayoutAmount(0)

      const canvas = canvasRef.current
      if (canvas) {
        const midX = canvas.width / 2
        for (let i = 0; i < 80; i++) {
          confettiRef.current.push({
            x: midX + canvas.width / 4,
            y: canvas.height * 0.35,
            vx: (Math.random() - 0.5) * 14,
            vy: -Math.random() * 14 - 8,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.35,
            color: ["#84f57c", "#22d3ee", "#ffffff"][Math.floor(Math.random() * 3)],
          })
        }
      }

      const duration = 1500
      const startTime = Date.now()
      const animatePayout = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setPayoutAmount(Math.floor(1600 * eased))
        if (progress < 1) {
          requestAnimationFrame(animatePayout)
        }
      }
      animatePayout()
    } else if (rainfall <= 100) {
      setShowPayout(false)
    }
    prevRainfallRef.current = rainfall
  }, [rainfall])

  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: "#0a0a0a", position: "relative" }}>
      {/* Border Lines */}
      <div className="absolute top-0 left-6 md:left-12 h-full w-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
      <div className="absolute top-0 right-6 md:right-12 h-full w-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />

      {/* Vertical Face Marquees on extreme borders */}
      <div className="absolute left-2 top-24 bottom-24 z-20 hidden xl:block">
        <VerticalMarquee faces={leftFaces} direction="up" />
      </div>
      <div className="absolute right-2 top-24 bottom-24 z-20 hidden xl:block">
        <VerticalMarquee faces={rightFaces} direction="down" />
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-mono tracking-widest" style={{ color: "#84f57c" }}>00.02</span>
            <div className="h-px w-16" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "#737373" }}>
              The Simulation
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tighter text-white leading-[0.9]">
            CHAOS VS
            <br />
            <span style={{ color: "#84f57c" }}>PROTECTION</span>
          </h2>
        </motion.div>

        {/* Simulation Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}
        >
          {/* Slider Controller */}
          <div 
            className="p-6 backdrop-blur-sm"
            style={{ backgroundColor: "rgba(26,26,26,0.9)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
              <div className="flex w-full items-center justify-between">
                <span className="text-sm font-mono uppercase tracking-wider" style={{ color: "#737373" }}>
                  Rainfall Intensity
                </span>
                <span 
                  className="px-4 py-1 text-sm font-bold font-mono"
                  style={{ 
                    backgroundColor: rainfall > 100 ? "rgba(239,68,68,0.2)" : "rgba(132,245,124,0.15)", 
                    color: rainfall > 100 ? "#ef4444" : "#84f57c" 
                  }}
                >
                  {rainfall}MM
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                value={rainfall}
                onChange={(e) => setRainfall(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-[#84f57c] [&::-webkit-slider-thumb]:transition-all hover:[&::-webkit-slider-thumb]:scale-110"
                style={{
                  background: `linear-gradient(to right, ${rainfall > 100 ? '#ef4444' : '#84f57c'} ${(rainfall / 150) * 100}%, #262626 ${(rainfall / 150) * 100}%)`,
                }}
              />
              <div className="flex w-full justify-between text-xs font-mono uppercase" style={{ color: "#737373" }}>
                <span>0mm</span>
                <span style={{ color: "#ef4444" }}>100mm Threshold</span>
                <span>150mm</span>
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="relative h-[550px]" style={{ backgroundColor: "#0d0d0d" }}>
            {isMounted && <canvas ref={canvasRef} className="absolute inset-0" />}

            {/* Side Labels */}
            <div className="absolute inset-0 flex pointer-events-none">
              {/* Left Side - Unprotected (Chaos) */}
              <div className="flex flex-1 flex-col items-center justify-between py-8 px-4">
                <div 
                  className="px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold"
                  style={{ backgroundColor: "rgba(239,68,68,0.2)", color: "#ef4444" }}
                >
                  Unprotected
                </div>
                <div className="flex flex-col items-center gap-4">
                  <motion.div 
                    className="relative h-20 w-20 overflow-hidden rounded-full grayscale"
                    style={{ border: "3px solid rgba(239,68,68,0.5)" }}
                    animate={walletDraining ? { scale: [1, 0.95, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                      alt="Unprotected worker"
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                  <div className="text-center">
                    <p className="font-bold text-white uppercase tracking-wide text-sm">Suresh M.</p>
                    <p className="text-xs font-mono" style={{ color: "#ef4444" }}>INCOME LOST</p>
                  </div>
                </div>
                {/* Wallet Drain Animation */}
                <motion.div 
                  className="px-8 py-4 text-center"
                  style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
                  animate={walletDraining ? { 
                    backgroundColor: ["rgba(239,68,68,0.1)", "rgba(239,68,68,0.2)", "rgba(239,68,68,0.1)"]
                  } : {}}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <motion.p 
                    className="text-3xl font-black" 
                    style={{ color: "#ef4444" }}
                    animate={walletDraining ? { opacity: [1, 0.6, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                  >
                    ₹{Math.max(0, Math.floor(2000 - (rainfall * 15))).toLocaleString()}
                  </motion.p>
                  <p className="text-xs font-mono uppercase" style={{ color: "#737373" }}>
                    Wallet draining...
                  </p>
                </motion.div>
              </div>

              {/* Right Side - Protected (Neon Green Shield) */}
              <div className="flex flex-1 flex-col items-center justify-between py-8 px-4">
                <div 
                  className="px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold"
                  style={{ backgroundColor: "rgba(132,245,124,0.2)", color: "#84f57c" }}
                >
                  Protected
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div 
                    className="relative h-20 w-20 overflow-hidden rounded-full"
                    style={{ border: "3px solid rgba(132,245,124,0.7)", boxShadow: "0 0 25px rgba(132,245,124,0.35)" }}
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
                      alt="Protected worker"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-white uppercase tracking-wide text-sm">Vikram R.</p>
                    <p className="text-xs font-mono" style={{ color: "#84f57c" }}>BHIMA PROTECTED</p>
                  </div>
                </div>
                <AnimatePresence>
                  {showPayout ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="px-8 py-4 text-center"
                      style={{ backgroundColor: "rgba(132,245,124,0.15)" }}
                    >
                      <motion.p
                        className="text-3xl font-black"
                        style={{ color: "#84f57c", textShadow: "0 0 25px rgba(132,245,124,0.6)" }}
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 0.4 }}
                      >
                        ₹{payoutAmount.toLocaleString()}
                      </motion.p>
                      <p className="text-xs font-mono uppercase" style={{ color: "#84f57c" }}>
                        Instant Payout!
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="px-8 py-4 text-center"
                      style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                    >
                      <p className="text-3xl font-black text-white">STANDBY</p>
                      <p className="text-xs font-mono uppercase" style={{ color: "#737373" }}>
                        {">"}100mm triggers payout
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
