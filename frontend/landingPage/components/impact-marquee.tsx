"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const impactData = [
  {
    name: "Rahul M.",
    stat: "received ₹600 in 3 mins",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Priya D.",
    stat: "protected from storm",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Vijay K.",
    stat: "received ₹1,200 in 2 mins",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Anita S.",
    stat: "covered 15 rainy days",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Suresh R.",
    stat: "received ₹800 in 4 mins",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Deepa M.",
    stat: "protected 6 months",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Kiran P.",
    stat: "received ₹1,600 in 1 min",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Meera J.",
    stat: "no income loss this monsoon",
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face",
  },
]

// Double the array for seamless loop
const doubledData = [...impactData, ...impactData]
// Pre-reversed array for second row (avoid calling reverse() during render)
const doubledDataReversed = [...impactData].reverse().concat([...impactData].reverse())

export function ImpactMarquee() {
  return (
    <section className="relative overflow-hidden bg-card py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-emerald-400">
            Live Impact
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Real People. Real Protection.
          </h2>
        </motion.div>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient Masks */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-card to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-card to-transparent" />

        {/* First Row - Left to Right */}
        <div className="mb-6 flex overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {doubledData.map((item, index) => (
              <div
                key={`row1-${index}`}
                className="flex shrink-0 items-center gap-3 rounded-full border border-border bg-background px-5 py-3"
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    {item.name}
                  </span>
                  <span className="text-muted-foreground"> {item.stat}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Second Row - Right to Left */}
        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={{ x: ["-50%", "0%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 35,
                ease: "linear",
              },
            }}
          >
            {doubledDataReversed.map((item, index) => (
              <div
                key={`row2-${index}`}
                className="flex shrink-0 items-center gap-3 rounded-full border border-border bg-background px-5 py-3"
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    {item.name}
                  </span>
                  <span className="text-muted-foreground"> {item.stat}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
