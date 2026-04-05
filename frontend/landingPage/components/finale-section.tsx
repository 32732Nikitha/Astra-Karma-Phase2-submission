"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const stats = [
  { label: "Claims Processed", value: "2.4M+", variant: "neon" },
  { label: "Avg Payout Time", value: "< 3 min", variant: "dark" },
  { label: "Fraud Prevented", value: "₹847Cr", variant: "neon" },
  { label: "Active Users", value: "1.2M", variant: "dark" },
  { label: "Uptime", value: "99.99%", variant: "neon" },
  { label: "Cities Covered", value: "150+", variant: "dark" },
  { label: "Partner Networks", value: "45+", variant: "neon" },
  { label: "ML Models", value: "23", variant: "dark" },
]

const doubledStats = [...stats, ...stats, ...stats]

// Bounce animation variants for letters
const letterVariants = {
  hidden: { y: 100, opacity: 0, rotateX: 90 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: {
      delay: i * 0.02,
      type: "spring",
      stiffness: 150,
      damping: 12,
    },
  }),
}

function BouncingText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letterVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="inline-block"
          style={{ transformOrigin: "center bottom" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  )
}

export function FinaleSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Parallax effect for marquees - moves based on scroll
  const marqueeX = useTransform(scrollYProgress, [0, 1], ["5%", "-35%"])
  const marqueeX2 = useTransform(scrollYProgress, [0, 1], ["-35%", "5%"])

  return (
    <section 
      ref={sectionRef}
      className="py-32 md:py-48 overflow-hidden"
      style={{ backgroundColor: "#0a0a0a", position: "relative" }}
    >
      {/* Border Lines */}
      <div className="absolute top-0 left-6 md:left-12 h-full w-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
      <div className="absolute top-0 right-6 md:right-12 h-full w-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />

      {/* Section Header */}
      <div className="mx-auto max-w-6xl px-6 lg:px-20 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-mono tracking-widest" style={{ color: "#84f57c" }}>00.05</span>
            <div className="h-px w-16" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "#737373" }}>
              The Finale
            </span>
          </div>
        </motion.div>
      </div>

      {/* Giant Typography with Bouncing Animation */}
      <div className="mx-auto max-w-7xl px-6 lg:px-20 mb-24">
        <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[11rem] font-black uppercase leading-[0.85] tracking-tighter text-white text-center">
          <BouncingText text="IT SHOULD" />
          <br />
          <span style={{ color: "#84f57c" }}>
            <BouncingText text="KNOW." />
          </span>
        </h2>
        <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[11rem] font-black uppercase leading-[0.85] tracking-tighter text-white text-center mt-4">
          <BouncingText text="BHIMA ASTRA" />
          <br />
          <span style={{ color: "#84f57c" }}>
            <BouncingText text="DOES." />
          </span>
        </h2>
      </div>

      {/* Horizontal Parallax Stats Marquee - Row 1 */}
      <div className="relative mb-4 overflow-hidden">
        <motion.div
          style={{ x: marqueeX }}
          className="flex gap-4 whitespace-nowrap"
        >
          {doubledStats.map((stat, index) => (
            <div
              key={`row1-${index}`}
              className="flex items-center gap-4 px-8 py-4 rounded-full shrink-0"
              style={{
                backgroundColor: stat.variant === "neon" ? "#84f57c" : "#1a1a1a",
                color: stat.variant === "neon" ? "#0a0a0a" : "#ffffff",
                border: stat.variant === "neon" ? "none" : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span className="text-2xl md:text-3xl font-black tracking-tight">{stat.value}</span>
              <span className="text-sm font-mono uppercase tracking-wider opacity-70">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Horizontal Parallax Stats Marquee - Row 2 (Reverse direction) */}
      <div className="relative overflow-hidden">
        <motion.div
          style={{ x: marqueeX2 }}
          className="flex gap-4 whitespace-nowrap"
        >
          {doubledStats.map((stat, index) => (
            <div
              key={`row2-${index}`}
              className="flex items-center gap-4 px-8 py-4 rounded-full shrink-0"
              style={{
                backgroundColor: stat.variant === "dark" ? "#84f57c" : "#1a1a1a",
                color: stat.variant === "dark" ? "#0a0a0a" : "#ffffff",
                border: stat.variant === "dark" ? "none" : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span className="text-2xl md:text-3xl font-black tracking-tight">{stat.value}</span>
              <span className="text-sm font-mono uppercase tracking-wider opacity-70">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="mx-auto max-w-6xl px-6 lg:px-20 mt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="mb-8 text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "#737373" }}>
            Join the millions of gig workers protected by Bhima Astra. 
            Instant payouts. Zero paperwork. Complete peace of mind.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button 
              className="group relative px-12 py-5 font-bold uppercase tracking-wider text-sm overflow-hidden"
              style={{ backgroundColor: "#84f57c", color: "#0a0a0a" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">Start Protection</span>
              <motion.div 
                className="absolute inset-0 bg-white"
                initial={{ y: "100%" }}
                whileHover={{ y: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            <motion.button 
              className="px-12 py-5 font-bold uppercase tracking-wider text-sm text-white transition-colors duration-300 hover:border-[#84f57c] hover:text-[#84f57c]"
              style={{ border: "1px solid rgba(255,255,255,0.2)" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Contact Sales
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
