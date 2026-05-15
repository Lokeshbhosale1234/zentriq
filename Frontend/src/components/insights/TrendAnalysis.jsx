// src/components/insights/TrendAnalysis.jsx

const CATEGORY_COLORS = [
  "#818cf8",
  "#34d399",
  "#fb923c",
  "#f472b6",
  "#38bdf8",
  "#a78bfa",
  "#fbbf24",
  "#4ade80",
];

function StatPill({ label, value, colorClass }) {
  return (
    <div className="flex flex-col gap-0.5 bg-white/5 rounded-xl px-3 py-2.5">
      <span className="text-[10px] text-gray-500 uppercase tracking-wider">
        {label}
      </span>
      <span className={`text-sm font-semibold capitalize truncate ${colorClass}`}>
        {value || "—"}
      </span>
    </div>
  );
}

function TrendRow({ insight, colorIndex }) {
  const isCat = insight.type === "CATEGORY_INTELLIGENCE";
  const color = isCat ? CATEGORY_COLORS[colorIndex % CATEGORY_COLORS.length] : null;

  return (
    <div className="flex items-start gap-3 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl p-3 transition-colors">
      {isCat ? (
        <div
          className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
          style={{ backgroundColor: color }}
        />
      ) : (
        <span className="text-lg flex-shrink-0 select-none" aria-hidden="true">
          {insight.icon}
        </span>
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium text-white leading-snug">
          {insight.title}
        </p>
        <p className="text-xs text-gray-400 leading-relaxed mt-0.5">
          {insight.message}
        </p>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl p-3">
      <div className="w-6 h-6 bg-white/10 rounded animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-white/10 rounded animate-pulse w-3/4" />
        <div className="h-2.5 bg-white/10 rounded animate-pulse w-full" />
      </div>
    </div>
  );
}

export default function TrendAnalysis({
  topCategory,
  fastestGrowing,
  insights,
  loading,
}) {
  const trendInsights = insights?.filter((i) => i.type === "TREND_ANALYSIS") || [];
  const catInsights = insights?.filter((i) => i.type === "CATEGORY_INTELLIGENCE") || [];
  const allRows = [...trendInsights, ...catInsights];

  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-6 backdrop-blur-sm">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
        Trend Analysis
      </p>

      {loading ? (
        <div className="space-y-3">
          {/* Stat pills skeleton */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="h-14 bg-white/10 rounded-xl animate-pulse" />
            <div className="h-14 bg-white/10 rounded-xl animate-pulse" />
          </div>
          {[1, 2, 3].map((i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Quick stat pills */}
          <div className="grid grid-cols-2 gap-3 mb-1">
            <StatPill
              label="Top Category"
              value={topCategory}
              colorClass="text-white"
            />
            <StatPill
              label="Fastest Growing"
              value={fastestGrowing}
              colorClass="text-amber-400"
            />
          </div>

          {/* All trend and category rows */}
          {allRows.length > 0 ? (
            allRows.map((ins, idx) => (
              <TrendRow
                key={`${ins.type}-${idx}`}
                insight={ins}
                colorIndex={idx}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <span className="text-3xl mb-2 select-none" aria-hidden="true">
                📊
              </span>
              <p className="text-gray-400 text-sm">
                Add more transactions to see trend analysis.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
