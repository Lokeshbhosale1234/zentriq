// src/pages/Insights.jsx
import { useCallback, useEffect, useState } from "react";
import { fetchInsightsSummary } from "../api/insights";
import HealthScoreCard from "../components/insights/HealthScoreCard";
import InsightCard from "../components/insights/InsightCard";
import SmartSummary from "../components/insights/SmartSummary";
import TrendAnalysis from "../components/insights/TrendAnalysis";

// ─── Filter configuration ─────────────────────────────────────────────────────

const TABS = [
  { key: "ALL",      label: "All" },
  { key: "WARNING",  label: "Warnings" },
  { key: "DANGER",   label: "Critical" },
  { key: "SAVINGS",  label: "Savings" },
  { key: "TRENDS",   label: "Trends" },
  { key: "SUCCESS",  label: "Wins" },
];

function matchesTab(tab, insight) {
  switch (tab) {
    case "ALL":     return true;
    case "WARNING": return insight.severity === "warning";
    case "DANGER":  return insight.severity === "danger";
    case "SAVINGS": return insight.type === "SAVINGS_SUGGESTION";
    case "TRENDS":
      return (
        insight.type === "TREND_ANALYSIS" ||
        insight.type === "CATEGORY_INTELLIGENCE"
      );
    case "SUCCESS": return insight.severity === "success";
    default:        return true;
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TabBar({ activeTab, onChange, counts }) {
  return (
    <div className="flex gap-2 flex-wrap items-center">
      {TABS.map(({ key, label }) => {
        const count = counts[key] ?? 0;
        const isActive = activeTab === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold
              transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500
              ${
                isActive
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200"
              }`}
            aria-pressed={isActive}
          >
            {label}
            {count > 0 && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full
                  ${isActive ? "bg-white/25 text-white" : "bg-white/10 text-gray-400"}`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="rounded-xl bg-red-500/10 border border-red-500/25 p-4 flex items-start gap-3 mb-6">
      <span className="text-xl flex-shrink-0 select-none" aria-hidden="true">
        ⚠️
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-red-300 font-medium">Failed to load insights</p>
        <p className="text-xs text-red-400/80 mt-0.5">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-red-300 hover:text-white border border-red-500/30 rounded-lg px-3 py-1.5 transition-colors flex-shrink-0"
        >
          Retry
        </button>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center col-span-2">
      <span className="text-5xl mb-4 select-none" aria-hidden="true">
        🎉
      </span>
      <p className="text-white font-semibold text-base">All clear in this category!</p>
      <p className="text-gray-400 text-sm mt-1">
        No insights match the current filter.
      </p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Insights() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [tab,     setTab]     = useState("ALL");

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchInsightsSummary()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err?.message || "Unexpected error");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Compute per-tab counts for badges
  const tabCounts = TABS.reduce((acc, { key }) => {
    acc[key] =
      key === "ALL"
        ? (data?.insights?.length ?? 0)
        : (data?.insights?.filter((i) => matchesTab(key, i))?.length ?? 0);
    return acc;
  }, {});

  const filteredInsights =
    data?.insights?.filter((i) => matchesTab(tab, i)) || [];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* ── Page header ── */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-1.5">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex-shrink-0">
              <span className="text-xl select-none" aria-hidden="true">✨</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                AI Financial Insights
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
                Intelligent analysis of your spending, budgets, and financial health
              </p>
            </div>
            <div className="ml-auto hidden sm:block">
              <button
                onClick={load}
                disabled={loading}
                className="text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/20
                  rounded-lg px-3 py-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Refresh insights"
              >
                {loading ? "Loading…" : "↻ Refresh"}
              </button>
            </div>
          </div>
        </header>

        {/* ── Error banner ── */}
        {error && <ErrorBanner message={error} onRetry={load} />}

        {/* ── Main layout ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Left column: health score + trend analysis */}
          <aside className="xl:col-span-1 flex flex-col gap-6">
            <HealthScoreCard data={data?.healthScore} loading={loading} />
            <TrendAnalysis
              topCategory={data?.topCategory}
              fastestGrowing={data?.fastestGrowingCategory}
              insights={data?.insights}
              loading={loading}
            />
          </aside>

          {/* Right column: smart summary + filtered insight cards */}
          <main className="xl:col-span-2 flex flex-col gap-6">
            <SmartSummary
              summary={data?.smartSummary}
              income={data?.totalIncome}
              expenses={data?.totalExpenses}
              savings={data?.netSavings}
              savingsRate={data?.savingsRate}
              loading={loading}
            />

            {/* Filter tabs + count */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <TabBar activeTab={tab} onChange={setTab} counts={tabCounts} />
              <span className="text-xs text-gray-500 sm:ml-auto">
                {loading
                  ? "Loading…"
                  : `${filteredInsights.length} insight${filteredInsights.length !== 1 ? "s" : ""}`}
              </span>
            </div>

            {/* Insight cards grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-28 rounded-xl bg-white/5 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredInsights.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredInsights.map((insight, idx) => (
                  <InsightCard key={`${insight.type}-${idx}`} insight={insight} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
