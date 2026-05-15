// src/components/insights/SmartSummary.jsx

function MetricTile({ label, value, colorClass }) {
  return (
    <div className="flex flex-col items-center justify-center bg-white/5 rounded-xl p-3 text-center">
      <span className={`text-sm font-bold ${colorClass} leading-tight`}>{value}</span>
      <span className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

function formatCurrency(value) {
  if (value == null || isNaN(value)) return "₹0";
  return "₹" + Math.abs(value).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export default function SmartSummary({
  summary,
  income,
  expenses,
  savings,
  savingsRate,
  loading,
}) {
  const metrics = [
    {
      label: "Income",
      value: formatCurrency(income),
      colorClass: "text-emerald-400",
    },
    {
      label: "Expenses",
      value: formatCurrency(expenses),
      colorClass: "text-red-400",
    },
    {
      label: "Net Savings",
      value: formatCurrency(savings),
      colorClass: savings >= 0 ? "text-blue-400" : "text-orange-400",
    },
    {
      label: "Save Rate",
      value: `${(savingsRate || 0).toFixed(1)}%`,
      colorClass:
        savingsRate >= 20
          ? "text-emerald-400"
          : savingsRate >= 10
          ? "text-amber-400"
          : "text-red-400",
    },
  ];

  return (
    <div className="rounded-2xl bg-gradient-to-br from-violet-500/15 via-indigo-500/10 to-transparent border border-violet-500/20 p-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <span className="text-xl select-none" aria-hidden="true">
          🧠
        </span>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          AI Smart Summary
        </p>
        <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
          This Month
        </span>
      </div>

      {/* Summary text */}
      {loading ? (
        <div className="space-y-2 mb-5">
          <div className="h-3.5 bg-white/10 rounded animate-pulse w-full" />
          <div className="h-3.5 bg-white/10 rounded animate-pulse w-5/6" />
          <div className="h-3.5 bg-white/10 rounded animate-pulse w-4/6" />
        </div>
      ) : (
        <p className="text-sm text-gray-200 leading-relaxed mb-5">
          {summary || "Not enough data to generate a summary yet. Add transactions to get started."}
        </p>
      )}

      {/* Metric tiles */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 bg-white/10 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {metrics.map(({ label, value, colorClass }) => (
            <MetricTile
              key={label}
              label={label}
              value={value}
              colorClass={colorClass}
            />
          ))}
        </div>
      )}
    </div>
  );
}
