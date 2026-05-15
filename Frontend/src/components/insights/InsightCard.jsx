// src/components/insights/InsightCard.jsx

const SEVERITY = {
  danger: {
    border: "border-red-500/30",
    bg: "hover:bg-red-500/5",
    badge: "bg-red-500/20 text-red-300",
    bar: "bg-red-400",
    label: "Critical",
  },
  warning: {
    border: "border-amber-500/30",
    bg: "hover:bg-amber-500/5",
    badge: "bg-amber-500/20 text-amber-300",
    bar: "bg-amber-400",
    label: "Warning",
  },
  success: {
    border: "border-emerald-500/30",
    bg: "hover:bg-emerald-500/5",
    badge: "bg-emerald-500/20 text-emerald-300",
    bar: "bg-emerald-400",
    label: "Positive",
  },
  info: {
    border: "border-blue-500/30",
    bg: "hover:bg-blue-500/5",
    badge: "bg-blue-500/20 text-blue-300",
    bar: "bg-blue-400",
    label: "Info",
  },
};

function TrendIndicator({ trend }) {
  if (trend === "up") {
    return (
      <span className="text-red-400 text-base leading-none select-none" aria-label="trending up">
        ↑
      </span>
    );
  }
  if (trend === "down") {
    return (
      <span className="text-emerald-400 text-base leading-none select-none" aria-label="trending down">
        ↓
      </span>
    );
  }
  return (
    <span className="text-gray-500 text-base leading-none select-none" aria-label="stable">
      →
    </span>
  );
}

export default function InsightCard({ insight }) {
  if (!insight) return null;

  const cfg = SEVERITY[insight.severity] || SEVERITY.info;
  const barWidth =
    insight.changePercent != null
      ? Math.min(Math.abs(insight.changePercent), 100)
      : null;

  return (
    <article
      className={`group rounded-xl bg-white/[0.04] border ${cfg.border} ${cfg.bg}
        p-4 backdrop-blur-sm transition-all duration-200 hover:scale-[1.015]
        hover:shadow-lg flex flex-col gap-3`}
    >
      {/* Header row */}
      <div className="flex items-start gap-3">
        <span
          className="text-xl flex-shrink-0 mt-0.5 select-none"
          aria-hidden="true"
        >
          {insight.icon}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-sm font-semibold text-white leading-snug">
              {insight.title}
            </h3>
            {insight.trend && <TrendIndicator trend={insight.trend} />}
            <span
              className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}
            >
              {cfg.label}
            </span>
          </div>

          <p className="text-gray-300 text-xs leading-relaxed">
            {insight.message}
          </p>
        </div>
      </div>

      {/* Progress bar for percentage-based insights */}
      {barWidth !== null && (
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${cfg.bar} transition-all duration-700 ease-out`}
              style={{ width: `${barWidth}%` }}
              role="progressbar"
              aria-valuenow={barWidth}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <span className="text-[10px] text-gray-400 font-medium tabular-nums w-10 text-right">
            {Math.abs(insight.changePercent).toFixed(1)}%
          </span>
        </div>
      )}

      {/* Category tag */}
      {insight.category && (
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">
            Category:
          </span>
          <span className="text-[10px] font-medium text-gray-300 capitalize">
            {insight.category}
          </span>
        </div>
      )}
    </article>
  );
}
