import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const getRiskLabel = (score) => {
  if (score < 35) return { label: "Low Risk", color: "#10b981", bg: "bg-emerald-50", text: "text-emerald-700" };
  if (score < 65) return { label: "Moderate Risk", color: "#f59e0b", bg: "bg-amber-50", text: "text-amber-700" };
  return { label: "High Risk", color: "#ef4444", bg: "bg-red-50", text: "text-red-700" };
};

export default function CompositeScoreGauge({ score = 62 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const risk = getRiskLabel(animatedScore);
  
  // Custom threshold config
  const THRESHOLD = 70;
  const isCrossed = animatedScore >= THRESHOLD;

  const radius = 52;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const arc = circumference * 0.75;
  const dashOffset = arc - (animatedScore / 100) * arc;

  useEffect(() => {
    let start = 0;
    const step = () => {
      start += 1.5;
      if (start >= score) { setAnimatedScore(score); return; }
      setAnimatedScore(start);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [score]);

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-sm border border-white/80 p-5 flex flex-col items-center gap-3 w-full h-full relative overflow-hidden">
      
      {/* Soft pulsing background glow when threshold crossed */}
      {isCrossed && (
        <motion.div 
          animate={{ opacity: [0.15, 0.35, 0.15], scale: [0.9, 1.05, 0.9] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute inset-0 bg-red-400/20 blur-3xl rounded-full" 
        />
      )}

      <p className="text-xs font-bold tracking-widest text-slate-400 uppercase z-10">Zone Risk Score</p>

      <div className="relative z-10" style={{ width: 140, height: 100 }}>
        <svg width="140" height="100" viewBox="0 0 120 80">
          {/* Background arc */}
          <circle
            cx="60" cy="68" r={normalizedRadius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={stroke}
            strokeDasharray={`${arc} ${circumference}`}
            strokeLinecap="round"
            transform="rotate(-135 60 68)"
          />
          {/* Foreground arc */}
          <circle
            cx="60" cy="68" r={normalizedRadius}
            fill="none"
            stroke={risk.color}
            strokeWidth={stroke}
            strokeDasharray={`${arc} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-135 60 68)"
            style={{ 
              transition: "stroke-dashoffset 0.1s linear, stroke 0.4s ease-out",
              filter: isCrossed ? "drop-shadow(0 0 6px rgba(239, 68, 68, 0.3))" : "none" 
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-3xl font-black text-slate-800" style={{ lineHeight: 1 }}>{Math.round(animatedScore)}</span>
          <span className="text-[10px] text-slate-400 font-medium">/100</span>
        </div>
      </div>

      <span className={`text-[10px] font-black tracking-wide uppercase px-3 py-1.5 rounded-full z-10 transition-colors duration-300 ${risk.bg} ${risk.text}`}>
        {risk.label}
      </span>

      <div className="w-full grid grid-cols-3 gap-2 mt-2 z-10">
        {[
          { label: "Rainfall", val: "R₁", pct: 38 },
          { label: "AQI", val: "R₂", pct: 54 },
          { label: "Traffic", val: "R₃", pct: 21 },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl bg-slate-50/50">
            <div className="w-full h-1 bg-slate-200/60 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-indigo-400" style={{ width: `${item.pct}%` }} />
            </div>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}