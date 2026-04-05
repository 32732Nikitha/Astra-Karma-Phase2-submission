"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const letterVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.03,
      type: "spring",
      stiffness: 120,
      damping: 12,
    },
  }),
}

function AnimatedText({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ")
  
  return (
    <span className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-[0.25em]">
          {word.split("").map((char, charIndex) => {
            const globalIndex = words.slice(0, wordIndex).join("").length + charIndex
            return (
              <motion.span
                key={charIndex}
                custom={globalIndex}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="inline-block"
              >
                {char}
              </motion.span>
            )
          })}
        </span>
      ))}
    </span>
  )
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={containerRef}
      className="h-[200vh] overflow-hidden"
      style={{ backgroundColor: "#0a0a0a", position: "relative" }}
    >
      {/* Parallax Video Background */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 h-[120%]"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover grayscale opacity-30"
        >
          <source
            src="https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4"
            type="video/mp4"
          />
        </video>
        <div 
          className="absolute inset-0" 
          style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0.5), transparent, #0a0a0a)" }}
        />
      </motion.div>

      {/* Content */}
      <div className="sticky top-0 h-screen flex flex-col justify-center">
        <motion.div
          style={{ y: textY, opacity }}
          className="relative z-10 px-6 md:px-12 lg:px-20"
        >
          {/* Section Number */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="text-xs font-mono tracking-widest" style={{ color: "#84f57c" }}>00.01</span>
            <div className="h-px w-16" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "#737373" }}>
              The Hook
            </span>
          </motion.div>

          {/* Giant Typography */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black uppercase leading-[0.9] tracking-tighter text-white">
            <AnimatedText text="WHAT HAPPENS" />
            <br />
            <AnimatedText text="WHEN INCOME" />
            <br />
            <span style={{ color: "#84f57c" }}>
              <AnimatedText text="DROPS IN" />
            </span>
            <br />
            <AnimatedText text="5 MINUTES?" />
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="mt-8 max-w-xl text-lg"
            style={{ color: "#737373" }}
          >
            When the storm hits, every second counts. Bhima Astra delivers instant
            parametric payouts to gig workers—no claims, no waiting.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="mt-12 flex items-center gap-6"
          >
            <button 
              className="group relative px-8 py-4 font-bold uppercase tracking-wider text-sm overflow-hidden"
              style={{ backgroundColor: "#84f57c", color: "#0a0a0a" }}
            >
              <span className="relative z-10">Get Protected</span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            <button 
              className="px-8 py-4 border font-medium uppercase tracking-wider text-sm text-white hover:text-[#84f57c] hover:border-[#84f57c] transition-colors duration-300"
              style={{ borderColor: "rgba(255,255,255,0.2)" }}
            >
              Learn More
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "#737373" }}>
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-px h-12"
            style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)" }}
          />
        </motion.div>
      </div>

      {/* Border Lines */}
      <div className="absolute top-0 left-6 md:left-12 h-full w-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
      <div className="absolute top-0 right-6 md:right-12 h-full w-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
    </section>
  )
}
