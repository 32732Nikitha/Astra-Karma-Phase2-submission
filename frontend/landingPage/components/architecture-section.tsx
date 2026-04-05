"use client"

import { motion } from "framer-motion"

const stages = [
  {
    number: "01",
    title: "Weather Oracle",
    description:
      "Real-time weather data from 50+ stations feeds into our parametric engine with sub-minute latency.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-8 w-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
        />
      </svg>
    ),
    size: "large",
  },
  {
    number: "02",
    title: "Smart Contracts",
    description:
      "Blockchain-verified trigger conditions execute instantly when thresholds are met.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-8 w-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
    size: "small",
  },
  {
    number: "03",
    title: "Fraud Shield",
    description:
      "ML-powered detection identifies coordinated claim patterns in milliseconds.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-8 w-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
    size: "small",
  },
  {
    number: "04",
    title: "Instant Payout",
    description:
      "Direct UPI transfers reach worker wallets within 3 minutes of trigger verification.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-8 w-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
        />
      </svg>
    ),
    size: "large",
  },
]

export function ArchitectureSection() {
  return (
    <section className="relative bg-background px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-emerald-400">
            How It Works
          </p>
          <h2 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            The Architecture
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Four stages of protection, from weather data to wallet. Every step
            is automated, verified, and instant.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`group relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all hover:border-emerald-500/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] ${
                stage.size === "large" ? "lg:col-span-2" : ""
              }`}
            >
              {/* Background Glow */}
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/5 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />

              {/* Stage Number */}
              <div className="mb-6 flex items-center justify-between">
                <span className="text-5xl font-bold text-emerald-500/20">
                  {stage.number}
                </span>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 transition-all group-hover:bg-emerald-500/20">
                  {stage.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="mb-3 text-2xl font-bold text-foreground">
                {stage.title}
              </h3>
              <p className="text-muted-foreground">{stage.description}</p>

              {/* Arrow */}
              <div className="mt-6 flex items-center gap-2 text-emerald-400 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-sm font-medium">Learn more</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4"
        >
          {[
            { value: "50+", label: "Weather Stations" },
            { value: "<3min", label: "Payout Time" },
            { value: "99.9%", label: "Uptime" },
            { value: "₹2Cr+", label: "Payouts Processed" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card/50 p-6 text-center"
            >
              <p className="mb-1 text-3xl font-bold text-emerald-400 md:text-4xl">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
