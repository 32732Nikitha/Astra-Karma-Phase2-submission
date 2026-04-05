"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const pipelineStages = [
  {
    id: 1,
    title: "RULES ENGINE",
    description: "Deterministic checks against known fraud patterns. Transaction velocity, device fingerprinting, geo-anomalies.",
    stats: ["2.3ms", "10K+ Rules", "99.2% Precision"],
    bgColor: "#0a0a0a",
    textColor: "#ffffff",
    accentColor: "#84f57c",
    borderColor: "rgba(132, 245, 124, 0.3)",
  },
  {
    id: 2,
    title: "BEHAVIOR ML",
    description: "Deep learning models analyze user behavior patterns. Keystroke dynamics, navigation flows, session biometrics.",
    stats: ["15ms", "Neural Net", "97.8% Recall"],
    bgColor: "#84f57c",
    textColor: "#0a0a0a",
    accentColor: "#0a0a0a",
    borderColor: "rgba(10, 10, 10, 0.3)",
  },
  {
    id: 3,
    title: "NETWORK GRAPH",
    description: "Graph neural networks map transaction relationships. Identifies fraud rings, money mules, synthetic identities.",
    stats: ["45ms", "Graph DB", "6.2M Nodes"],
    bgColor: "#1a1a1a",
    textColor: "#ffffff",
    accentColor: "#84f57c",
    borderColor: "rgba(132, 245, 124, 0.3)",
  },
  {
    id: 4,
    title: "DECISION",
    description: "Final adjudication combining all signals. Automated actions: Approve, Review, Block, Hold for verification.",
    stats: ["<100ms", "Auto-Block", "0.01% False+"],
    bgColor: "#ef4444",
    textColor: "#ffffff",
    accentColor: "#ffffff",
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
]

// Cascading sticky top values - each card leaves the previous one's header visible
const stickyTops = ["5rem", "9rem", "13rem", "17rem"]

function StickyCard({
  stage,
  index,
  totalCards,
}: {
  stage: typeof pipelineStages[0]
  index: number
  totalCards: number
}) {
  const cardContainerRef = useRef<HTMLDivElement>(null)
  
  // Track scroll progress within this card's massive container
  const { scrollYProgress } = useScroll({
    target: cardContainerRef,
    offset: ["start start", "end start"],
  })

  // Push-back effect: As user scrolls past this card (next card overlapping),
  // this card scales down and dims
  const scale = useTransform(
    scrollYProgress, 
    [0, 0.3, 0.7, 1], 
    [1, 1, 0.95, 0.92]
  )
  const opacity = useTransform(
    scrollYProgress, 
    [0, 0.4, 0.8, 1], 
    [1, 1, 0.6, 0.4]
  )
  const brightness = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    [1, 0.9, 0.7]
  )

  return (
    // MASSIVE scroll container - 200vh gives plenty of "reading phase" time
    <div 
      ref={cardContainerRef}
      className="relative"
      style={{ 
        minHeight: index < totalCards - 1 ? "200vh" : "100vh",
        position: "relative",
      }}
    >
      <motion.div
        style={{ 
          scale,
          opacity,
          filter: `brightness(${brightness.get()})`,
          position: "sticky",
          top: stickyTops[index],
          zIndex: 10 + index,
        }}
        className="w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ 
            type: "spring", 
            stiffness: 70, 
            damping: 18,
            delay: 0.05
          }}
          className="w-full max-w-6xl mx-auto min-h-[75vh] flex flex-col justify-center p-8 md:p-12 lg:p-16 border shadow-2xl overflow-hidden"
          style={{ 
            backgroundColor: stage.bgColor,
            borderColor: stage.borderColor,
            borderRadius: "4px",
          }}
        >
          {/* Stage Number Label - This part stays visible when stacked */}
          <div className="flex items-center gap-4 mb-8">
            <span 
              className="text-xs font-mono tracking-widest font-bold"
              style={{ color: stage.accentColor }}
            >
              STAGE 0{stage.id}
            </span>
            <div 
              className="h-px flex-1 max-w-32"
              style={{ backgroundColor: stage.accentColor, opacity: 0.4 }}
            />
            <span 
              className="text-xs font-mono tracking-widest uppercase"
              style={{ color: stage.textColor, opacity: 0.5 }}
            >
              {stage.title}
            </span>
          </div>

          {/* Giant Title with spring bounce */}
          <motion.h3 
            className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-6"
            style={{ color: stage.textColor }}
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ 
              type: "spring", 
              stiffness: 80, 
              damping: 14,
              delay: 0.1
            }}
          >
            {stage.title}
          </motion.h3>

          {/* Description */}
          <motion.p 
            className="text-lg md:text-xl max-w-2xl mb-12 leading-relaxed"
            style={{ color: stage.textColor, opacity: 0.7 }}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 0.7 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ 
              type: "spring", 
              stiffness: 80, 
              damping: 14,
              delay: 0.2
            }}
          >
            {stage.description}
          </motion.p>

          {/* Stats Pills */}
          <motion.div 
            className="flex flex-wrap gap-4"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ 
              type: "spring", 
              stiffness: 80, 
              damping: 14,
              delay: 0.3
            }}
          >
            {stage.stats.map((stat, i) => (
              <motion.div
                key={i}
                className="px-6 py-3 font-mono text-sm uppercase tracking-wider font-bold"
                style={{ 
                  backgroundColor: `${stage.accentColor}20`,
                  color: stage.accentColor,
                  border: `1px solid ${stage.accentColor}40`,
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  type: "spring",
                  stiffness: 120,
                  damping: 12,
                  delay: 0.35 + (i * 0.08)
                }}
              >
                {stat}
              </motion.div>
            ))}
          </motion.div>

          {/* Background Large Number */}
          <div 
            className="absolute bottom-8 right-8 text-[25vw] font-black opacity-[0.03] select-none pointer-events-none leading-none"
            style={{ color: stage.textColor }}
          >
            0{stage.id}
          </div>

          {/* Corner Grid Pattern */}
          <div 
            className="absolute top-0 right-0 w-40 h-40 opacity-10"
            style={{
              backgroundImage: `linear-gradient(${stage.accentColor} 1px, transparent 1px), linear-gradient(90deg, ${stage.accentColor} 1px, transparent 1px)`,
              backgroundSize: "20px 20px"
            }}
          />

          {/* Bottom accent line */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ backgroundColor: stage.accentColor, opacity: 0.3 }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

export function FraudPipelineSection() {
  return (
    <section className="py-24" style={{ backgroundColor: "#0a0a0a", position: "relative" }}>
      {/* Border Lines */}
      <div className="absolute top-0 left-6 md:left-12 h-full w-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
      <div className="absolute top-0 right-6 md:right-12 h-full w-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />

      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-mono tracking-widest" style={{ color: "#84f57c" }}>00.03</span>
            <div className="h-px w-16" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "#737373" }}>
              Fraud Pipeline
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tighter text-white leading-[0.9]">
            FOUR LAYERS
            <br />
            <span style={{ color: "#84f57c" }}>ZERO ESCAPE</span>
          </h2>
          <p className="mt-6 text-lg max-w-xl" style={{ color: "#737373" }}>
            Every transaction passes through our multi-stage fraud detection pipeline. 
            Scroll through each layer as they stack like a cinematic deck of cards.
          </p>
        </motion.div>

        {/* Sticky Stacking Cards Container */}
        <div className="relative" style={{ position: "relative" }}>
          {pipelineStages.map((stage, index) => (
            <StickyCard 
              key={stage.id} 
              stage={stage} 
              index={index}
              totalCards={pipelineStages.length}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
