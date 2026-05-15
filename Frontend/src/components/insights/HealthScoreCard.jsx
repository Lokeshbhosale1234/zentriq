// src/components/insights/HealthScoreCard.jsx
import { useEffect, useState } from "react";

const GRADE_CONFIG = {
  A: {
    ring: "#10b981",
    glow: "shadow-emerald-500/20",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    grad: "from-emerald-500/15 via-emerald-500/5 to-transparent",
  },
  B: {
    ring: "#3b82f6",
    glow: "shadow-blue-500/20",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    grad: "from-blue-500/15 via-blue-500/5 to-transparent",
  },
  C: {
    ring: "#f59e0b",
    glow: "shadow-amber-500/20",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    grad: "from-amber-500/15 via-amber-500/5 to-transparent",
  },
  D: {
    ring: "#f97316",
    glow: "shadow-orange-500/20",
    badge: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    grad: "from-orange-500/15 via-orange-500/5 to-transparent",
  },
  F: {
    ring: "#ef4444",
    glow: "shadow-red-500/20",
    badge: "bg-red-500/20 text-red-300 border-red-500/30",
    grad: "from-red-500/15 via-red-500/5 to-transparent",
  },
};

function MetricBar({ label, value, color }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs font-semibold text-white">{value.toFixed(0)}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function HealthScoreCard({ data, loading }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (!data) return;
    setAnimatedScore(0);
    const target = data.score;
    let current = 0;
    const duration = 1000;
    const steps = 60;
    const increment = target / steps;
    const interval = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimatedScore(target);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [data]);

  const grade = data?.grade || "C";
  const cfg = GRADE_CONFIG[grade] || GRADE_CONFIG.C;
  const RADIUS = 52;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const strokeOffset = data
    ? CIRCUMFERENCE - (animatedScore / 100) * CIRCUMFERENCE
    : CIRCUMFERENCE;

  if (loading) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <div className="h-3 w-40 bg-white/10 rounded animate-pulse mb-6" />
        <div className="flex flex-col items-center gap-5">
          <div className="w-36 h-36 rounded-full bg-white/10 animate-pulse" />
          <div className="h-5 w-28 bg-white/10 rounded animate-pulse" />
          <div className="w-full space-y-3 pt-4 border-t border-white/10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-2.5 w-full bg-white/10 rounded animate-pulse" />
                <div className="h-1.5 w-full bg-white/10 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6 flex items-center justify-center h-48">
        <p className="text-gray-500 text-sm">Health score unavailable</p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl bg-gradient-to-br ${cfg.grad} border border-white/10 p-6 shadow-xl ${cfg.glow} backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Financial Health
        </p>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.badge}`}
        >
          Grade {data.grade}
        </span>
      </div>

      {/* Score ring */}
      <div className="flex justify-center mb-5">
        <div className="relative w-36 h-36">
          <svg
            className="w-full h-full -rotate-90"
            viewBox="0 0 120 120"
            aria-hidden="true"
          >
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeOffset}
              stroke={cfg.ring}
              style={{ transition: "stroke-dashoffset 0.05s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-4xl font-black tabular-nums"
              style={{ color: cfg.ring }}
            >
              {animatedScore}
            </span>
            <span className="text-xs text-gray-400 mt-0.5">/ 100</span>
          </div>
        </div>
      </div>

      {/* Label */}
      <p className="text-center text-base font-semibold text-white mb-5">
        {data.label}
      </p>

      {/* Sub-metric bars */}
      <div className="border-t border-white/10 pt-4 space-y-3">
        <MetricBar
          label="Savings Rate"
          value={data.savingsRatio || 0}
          color={cfg.ring}
        />
        <MetricBar
          label="Budget Adherence"
          value={data.budgetAdherence || 0}
          color={cfg.ring}
        />
        <MetricBar
          label="Spending Stability"
          value={data.spendingStability || 0}
          color={cfg.ring}
        />
      </div>
    </div>
  );
}
