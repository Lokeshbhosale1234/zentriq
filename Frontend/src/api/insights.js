// src/api/insights.js
// Reuses the existing axios instance (with JWT interceptor already configured).
// Import path assumes your existing axios instance is at src/api/axios.js or src/utils/axios.js
// Adjust the import path to match your project structure.

import api from './axios';

/**
 * Fetches the full insights summary: health score, all insights,
 * smart summary paragraph, and aggregate financial metrics.
 * This is the primary call used by the Insights page.
 */
export const fetchInsightsSummary = () =>
  api.get("/insights/summary").then((res) => res.data);

/**
 * Fetches only the flat list of insight objects.
 */
export const fetchInsights = () =>
  api.get("/insights").then((res) => res.data);

/**
 * Fetches only the financial health score breakdown.
 */
export const fetchHealthScore = () =>
  api.get("/insights/health-score").then((res) => res.data);
