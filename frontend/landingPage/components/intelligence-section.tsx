"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  id: number
  targetX?: number
  targetY?: number
}

const blockedUsers = [
  {
    name: "Raj M.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Priya S.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Amit K.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Neha R.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
]

export function IntelligenceSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Node[]>([])
  const connectedNodesRef = useRef<number[]>([])
  const animationRef = useRef<number>(0)
  const [isMounted, setIsMounted] = useState(false)
  const [decision, setDecision] = useState<"approve" | "review" | "block" | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [snappingPhase, setSnappingPhase] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const initNodes = useCallback((canvas: HTMLCanvasElement) => {
    nodesRef.current = []
    for (let i = 0; i < 50; i++) {
      nodesRef.current.push({
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: 3 + Math.random() * 6,
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
        initNodes(canvas)
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Update and draw nodes
      nodesRef.current.forEach((node) => {
        // If snapping, move violently toward target
        if (snappingPhase && connectedNodesRef.current.includes(node.id)) {
          const angle = connectedNodesRef.current.indexOf(node.id) * (Math.PI * 2 / 4)
          const targetX = centerX + Math.cos(angle) * 70
          const targetY = centerY + Math.sin(angle) * 70
          
          // Violent snap animation
          node.x += (targetX - node.x) * 0.15
          node.y += (targetY - node.y) * 0.15
          node.vx = 0
          node.vy = 0
        } else {
          // Normal drifting
          node.x += node.vx
          node.y += node.vy

          if (node.x < 0 || node.x > canvas.width) node.vx *= -1
          if (node.y < 0 || node.y > canvas.height) node.vy *= -1
        }

        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)

        if (connectedNodesRef.current.includes(node.id)) {
          // Connected/suspicious nodes - bright red with intense glow
          ctx.fillStyle = "#ef4444"
          ctx.shadowColor = "#ef4444"
          ctx.shadowBlur = 30
        } else {
          // Normal nodes - neon green subtle
          ctx.fillStyle = "rgba(132, 245, 124, 0.35)"
          ctx.shadowBlur = 0
        }
        ctx.fill()
        ctx.shadowBlur = 0

        // Draw connections between nearby nodes
        nodesRef.current.forEach((other) => {
          if (node.id >= other.id) return
          const dx = node.x - other.x
          const dy = node.y - other.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(other.x, other.y)

            if (
              connectedNodesRef.current.includes(node.id) &&
              connectedNodesRef.current.includes(other.id)
            ) {
              // Red laser connection with intense glow
              ctx.strokeStyle = "#ef4444"
              ctx.lineWidth = 5
              ctx.shadowColor = "#ef4444"
              ctx.shadowBlur = 25
            } else {
              ctx.strokeStyle = `rgba(132, 245, 124, ${0.12 * (1 - dist / 120)})`
              ctx.lineWidth = 1
            }
            ctx.stroke()
            ctx.shadowBlur = 0
          }
        })
      })

      // Draw pulsing danger zone if snapping
      if (snappingPhase) {
        const pulseAlpha = 0.1 + Math.sin(Date.now() * 0.01) * 0.05
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200)
        gradient.addColorStop(0, `rgba(239, 68, 68, ${pulseAlpha})`)
        gradient.addColorStop(1, "rgba(239, 68, 68, 0)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(centerX, centerY, 200, 0, Math.PI * 2)
        ctx.fill()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationRef.current)
    }
  }, [initNodes, isMounted, snappingPhase])

  const handleDecision = (type: "approve" | "review" | "block") => {
    setDecision(type)

    const selectedIds: number[] = []
    while (selectedIds.length < 4) {
      const randomId = Math.floor(Math.random() * nodesRef.current.length)
      if (!selectedIds.includes(randomId)) {
        selectedIds.push(randomId)
      }
    }
    connectedNodesRef.current = selectedIds
    setSnappingPhase(true)

    setTimeout(() => {
      setShowResult(true)
    }, 1800)
  }

  const resetSimulation = () => {
    setDecision(null)
    setShowResult(false)
    setSnappingPhase(false)
    connectedNodesRef.current = []
    
    // Reset node velocities
    nodesRef.current.forEach(node => {
      node.vx = (Math.random() - 0.5) * 0.8
      node.vy = (Math.random() - 0.5) * 0.8
    })
  }

  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: "#0a0a0a", position: "relative" }}>
      {/* Border Lines */}
      <div className="absolute top-0 left-6 md:left-12 h-full w-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
      <div className="absolute top-0 right-6 md:right-12 h-full w-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />

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
            <span className="text-xs font-mono tracking-widest" style={{ color: "#84f57c" }}>00.04</span>
            <div className="h-px w-16" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "#737373" }}>
              The Intelligence
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tighter text-white leading-[0.9]">
            BE THE
            <br />
            <span style={{ color: "#84f57c" }}>SYSTEM</span>
          </h2>
          <p className="mt-6 text-lg max-w-xl leading-relaxed" style={{ color: "#737373" }}>
            Click any decision button. Watch how our AI detects coordinated fraud rings 
            and responds in milliseconds.
          </p>
        </motion.div>

        {/* Intelligence Card - Glassmorphic */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden"
          style={{ 
            backgroundColor: "rgba(17, 17, 17, 0.85)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Canvas Area */}
          <div className="relative h-[500px]" style={{ backgroundColor: "rgba(10,10,10,0.95)" }}>
            {isMounted && <canvas ref={canvasRef} className="absolute inset-0" />}

            {/* Result Overlay - Dramatic Red Slam */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleY: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  style={{ transformOrigin: "top", backgroundColor: "rgba(239, 68, 68, 0.97)" }}
                  className="absolute inset-0 flex flex-col items-center justify-center"
                >
                  <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 150 }}
                    className="text-center"
                  >
                    {/* Warning Icon */}
                    <motion.div 
                      className="mb-6 inline-flex h-20 w-20 items-center justify-center"
                      style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="h-10 w-10 text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                      </svg>
                    </motion.div>
                    
                    <h3 className="mb-2 text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
                      SYSTEM DECISION
                    </h3>
                    <motion.p 
                      className="mb-2 text-3xl md:text-4xl font-black uppercase text-white"
                      animate={{ opacity: [1, 0.7, 1] }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                    >
                      BLOCK & HOLD
                    </motion.p>
                    <p className="mb-8 text-lg font-mono uppercase tracking-wider text-white/80">
                      Fraud Ring Detected - 4 Linked Accounts
                    </p>

                    {/* Blocked Users */}
                    <div className="mb-8 flex justify-center gap-6">
                      {blockedUsers.map((user, index) => (
                        <motion.div
                          key={user.name}
                          initial={{ scale: 0, opacity: 0, rotate: -180 }}
                          animate={{ scale: 1, opacity: 1, rotate: 0 }}
                          transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
                          className="flex flex-col items-center gap-2"
                        >
                          <div 
                            className="relative h-14 w-14 overflow-hidden rounded-full"
                            style={{ border: "2px solid rgba(255,255,255,0.5)" }}
                          >
                            <Image
                              src={user.image}
                              alt={user.name}
                              fill
                              className="object-cover grayscale"
                            />
                            {/* X overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                          </div>
                          <span className="text-xs font-mono text-white/70">
                            {user.name}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <motion.button
                      onClick={resetSimulation}
                      className="px-10 py-4 font-bold uppercase tracking-wider text-sm transition-all hover:scale-105"
                      style={{ backgroundColor: "#0a0a0a", color: "#ffffff" }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Reset Simulation
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Center Label */}
            {!showResult && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="px-8 py-4 text-center"
                  style={{ 
                    backgroundColor: "rgba(10,10,10,0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  animate={snappingPhase ? { 
                    borderColor: ["rgba(239,68,68,0.5)", "rgba(239,68,68,1)", "rgba(239,68,68,0.5)"]
                  } : {}}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  <p className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: snappingPhase ? "#ef4444" : "#737373" }}>
                    {snappingPhase ? "ANALYZING PATTERN..." : "Transaction Network"}
                  </p>
                  <p className="text-2xl font-black text-white">
                    50 <span style={{ color: snappingPhase ? "#ef4444" : "#84f57c" }}>
                      {snappingPhase ? "SUSPICIOUS" : "ACTIVE"}
                    </span> NODES
                  </p>
                </motion.div>
              </div>
            )}
          </div>

          {/* Control Panel */}
          {!decision && (
            <div 
              className="p-8"
              style={{ 
                backgroundColor: "rgba(26,26,26,0.9)",
                borderTop: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <p className="mb-6 text-center text-sm font-mono uppercase tracking-wider" style={{ color: "#737373" }}>
                A claim pattern has been flagged. What&apos;s your call?
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  onClick={() => handleDecision("approve")}
                  className="px-10 py-4 font-bold uppercase tracking-wider text-sm transition-all"
                  style={{ backgroundColor: "#84f57c", color: "#0a0a0a" }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(132,245,124,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Approve
                </motion.button>
                <motion.button
                  onClick={() => handleDecision("review")}
                  className="px-10 py-4 font-bold uppercase tracking-wider text-sm transition-all"
                  style={{ backgroundColor: "#f59e0b", color: "#0a0a0a" }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(245,158,11,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Review
                </motion.button>
                <motion.button
                  onClick={() => handleDecision("block")}
                  className="px-10 py-4 font-bold uppercase tracking-wider text-sm transition-all"
                  style={{ backgroundColor: "#ef4444", color: "#ffffff" }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(239,68,68,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Block
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
