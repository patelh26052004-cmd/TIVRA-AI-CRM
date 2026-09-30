"use client";

import { useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Flame,
  Target,
  IndianRupee,
  CalendarDays,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  MessageSquare,
  FileText,
  X,
} from "lucide-react";

type Period = "Last 30 Days" | "Last 3 Months" | "Last 6 Months" | "This Year";

type MonthlyData = {
  month: string;
  leads: number;
  qualified: number;
  won: number;
  revenue: number;
};

const allMonthlyData: MonthlyData[] = [
  { month: "Jan", leads: 70, qualified: 35, won: 9, revenue: 210000 },
  { month: "Feb", leads: 76, qualified: 38, won: 10, revenue: 235000 },
  { month: "Mar", leads: 79, qualified: 40, won: 11, revenue: 255000 },
  { month: "Apr", leads: 82, qualified: 42, won: 12, revenue: 285000 },
  { month: "May", leads: 96, qualified: 51, won: 15, revenue: 342000 },
  { month: "Jun", leads: 110, qualified: 59, won: 18, revenue: 415000 },
  { month: "Jul", leads: 128, qualified: 68, won: 21, revenue: 486000 },
  { month: "Aug", leads: 145, qualified: 79, won: 26, revenue: 578000 },
  { month: "Sep", leads: 162, qualified: 91, won: 31, revenue: 695000 },
];

const sourceData = [
  {
    source: "WhatsApp",
    leads: 58,
    qualified: 36,
    won: 14,
    revenue: 318000,
  },
  {
    source: "Website",
    leads: 46,
    qualified: 25,
    won: 8,
    revenue: 184000,
  },
  {
    source: "Campaign",
    leads: 39,
    qualified: 20,
    won: 5,
    revenue: 112000,
  },
  {
    source: "Referral",
    leads: 31,
    qualified: 18,
    won: 4,
    revenue: 81000,
  },
];

const insightCards = [
  {
    title: "Hot leads need attention",
    text: "12 hot leads have not received a follow-up within the configured SLA.",
    type: "warning",
  },
  {
    title: "WhatsApp is performing well",
    text: "WhatsApp leads currently show the highest qualification rate.",
    type: "positive",
  },
  {
    title: "Quotation follow-up opportunity",
    text: "18 quotations were viewed but have not yet received a response.",
    type: "info",
  },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("Last 6 Months");
  const [showInsights, setShowInsights] = useState(false);

  /*
   * IMPORTANT:
   * Dropdown now controls which data is displayed.
   */
  const filteredData = useMemo(() => {
    switch (period) {
      case "Last 30 Days":
        return allMonthlyData.slice(-1);

      case "Last 3 Months":
        return allMonthlyData.slice(-3);

      case "Last 6 Months":
        return allMonthlyData.slice(-6);

      case "This Year":
        return allMonthlyData;

      default:
        return allMonthlyData.slice(-6);
    }
  }, [period]);

  const totalLeads = useMemo(
    () => filteredData.reduce((sum, item) => sum + item.leads, 0),
    [filteredData]
  );

  const totalQualified = useMemo(
    () => filteredData.reduce((sum, item) => sum + item.qualified, 0),
    [filteredData]
  );

  const totalWon = useMemo(
    () => filteredData.reduce((sum, item) => sum + item.won, 0),
    [filteredData]
  );

  const totalRevenue = useMemo(
    () => filteredData.reduce((sum, item) => sum + item.revenue, 0),
    [filteredData]
  );

  const qualificationRate =
    totalLeads > 0 ? Math.round((totalQualified / totalLeads) * 100) : 0;

  const winRate =
    totalLeads > 0 ? Math.round((totalWon / totalLeads) * 100) : 0;

  const maxRevenue =
    filteredData.length > 0
      ? Math.max(...filteredData.map((item) => item.revenue))
      : 1;

  /*
   * Small dynamic changes based on selected period.
   */
  const periodStats = {
    "Last 30 Days": {
      growth: "8.6%",
      revenueGrowth: "10.4%",
    },
    "Last 3 Months": {
      growth: "13.2%",
      revenueGrowth: "16.8%",
    },
    "Last 6 Months": {
      growth: "18.4%",
      revenueGrowth: "21.7%",
    },
    "This Year": {
      growth: "24.8%",
      revenueGrowth: "27.3%",
    },
  };

  const currentStats = periodStats[period];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* HEADER */}
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-500" />

                <h1 className="text-2xl font-bold">AI Analytics</h1>
              </div>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Understand your sales performance and discover actionable
                opportunities.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* WORKING PERIOD DROPDOWN */}
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <select
                  value={period}
                  onChange={(e) =>
                    setPeriod(e.target.value as Period)
                  }
                  className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-10 text-sm font-medium outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="Last 3 Months">Last 3 Months</option>
                  <option value="Last 6 Months">Last 6 Months</option>
                  <option value="This Year">This Year</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setShowInsights(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                <Sparkles className="h-4 w-4" />
                AI Insights
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* PERIOD INDICATOR */}
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <CalendarDays className="h-4 w-4" />

          Showing analytics for:

          <span className="font-semibold text-slate-900 dark:text-white">
            {period}
          </span>
        </div>

        {/* KPI CARDS */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* TOTAL LEADS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Leads</p>

                <p className="mt-2 text-3xl font-bold">
                  {totalLeads.toLocaleString()}
                </p>

                <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <ArrowUpRight className="h-3.5 w-3.5" />

                  {currentStats.growth}

                  <span className="font-normal text-slate-400">
                    vs previous period
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-orange-50 p-3 text-orange-600 dark:bg-orange-500/10">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* QUALIFIED */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Qualified Leads</p>

                <p className="mt-2 text-3xl font-bold">
                  {totalQualified.toLocaleString()}
                </p>

                <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <ArrowUpRight className="h-3.5 w-3.5" />

                  {qualificationRate}% qualification
                </div>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/10">
                <Target className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* WON */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Won Deals</p>

                <p className="mt-2 text-3xl font-bold">
                  {totalWon}
                </p>

                <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <ArrowUpRight className="h-3.5 w-3.5" />

                  {winRate}% lead-to-win
                </div>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-500/10">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* REVENUE */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Revenue</p>

                <p className="mt-2 text-3xl font-bold">
                  ₹{(totalRevenue / 100000).toFixed(2)}L
                </p>

                <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <ArrowUpRight className="h-3.5 w-3.5" />

                  {currentStats.revenueGrowth}

                  <span className="font-normal text-slate-400">
                    growth
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-500/10">
                <IndianRupee className="h-6 w-6" />
              </div>
            </div>
          </div>
        </section>

        {/* AI SUMMARY */}
        <section className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-white p-5 shadow-sm dark:border-orange-500/20 dark:from-orange-500/10 dark:to-slate-900">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold">AI Sales Summary</h2>

                <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Sales activity for{" "}
                  <strong>{period}</strong> shows{" "}
                  <strong>{totalLeads}</strong> leads,{" "}
                  <strong>{totalQualified}</strong> qualified leads and{" "}
                  <strong>{totalWon}</strong> won deals.
                  Revenue generated during this period is{" "}
                  <strong>
                    ₹{totalRevenue.toLocaleString()}
                  </strong>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowInsights(true)}
              className="shrink-0 rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm font-semibold text-orange-700 hover:bg-orange-50 dark:border-orange-500/20 dark:bg-slate-800 dark:text-orange-400"
            >
              View Insights
            </button>
          </div>
        </section>

        {/* REVENUE CHART */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold">Revenue & Sales Trend</h2>

              <p className="mt-1 text-sm text-slate-500">
                Monthly revenue performance
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 dark:bg-slate-800">
              <CalendarDays className="h-4 w-4" />

              {period}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex h-64 items-end gap-3 overflow-x-auto pb-2 sm:gap-5">
              {filteredData.map((item) => {
                const height = Math.max(
                  12,
                  Math.round((item.revenue / maxRevenue) * 100)
                );

                return (
                  <div
                    key={item.month}
                    className="flex h-full min-w-[55px] flex-1 flex-col items-center justify-end"
                  >
                    <div className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      ₹{(item.revenue / 1000).toFixed(0)}k
                    </div>

                    <div
                      className="w-full max-w-[54px] cursor-pointer rounded-t-xl bg-orange-500 transition-all hover:bg-orange-600"
                      style={{ height: `${height}%` }}
                      title={`${item.month}: ₹${item.revenue.toLocaleString()}`}
                    />

                    <div className="mt-3 text-xs font-medium text-slate-500">
                      {item.month}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* LEAD FUNNEL + SALES ACTIVITY */}
        <section className="grid gap-6 xl:grid-cols-2">
          {/* FUNNEL */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div>
              <h2 className="font-bold">Lead Conversion Funnel</h2>

              <p className="mt-1 text-sm text-slate-500">
                How leads move through the sales process
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {[
                {
                  label: "All Leads",
                  value: totalLeads,
                  width: 100,
                  icon: Users,
                },
                {
                  label: "Qualified",
                  value: totalQualified,
                  width: qualificationRate,
                  icon: Target,
                },
                {
                  label: "Won",
                  value: totalWon,
                  width: winRate,
                  icon: CheckCircle2,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-slate-400" />

                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </div>

                      <span className="text-sm font-bold">
                        {item.value}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-orange-500 transition-all duration-500"
                        style={{
                          width: `${Math.max(item.width, 5)}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SALES ACTIVITY */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div>
              <h2 className="font-bold">Sales Activity</h2>

              <p className="mt-1 text-sm text-slate-500">
                Key operational metrics
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Flame className="h-4 w-4 text-red-500" />
                  Hot Leads
                </div>

                <p className="mt-2 text-2xl font-bold">75</p>

                <p className="mt-1 text-xs text-emerald-600">
                  12 require immediate follow-up
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock3 className="h-4 w-4 text-orange-500" />
                  Follow-ups
                </div>

                <p className="mt-2 text-2xl font-bold">128</p>

                <p className="mt-1 text-xs text-orange-600">
                  18 overdue
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MessageSquare className="h-4 w-4 text-green-500" />
                  WhatsApp
                </div>

                <p className="mt-2 text-2xl font-bold">84%</p>

                <p className="mt-1 text-xs text-emerald-600">
                  response rate
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <FileText className="h-4 w-4 text-blue-500" />
                  Quotations
                </div>

                <p className="mt-2 text-2xl font-bold">64</p>

                <p className="mt-1 text-xs text-slate-500">
                  18 awaiting response
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SOURCE PERFORMANCE */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800">
            <h2 className="font-bold">Lead Source Performance</h2>

            <p className="mt-1 text-sm text-slate-500">
              Compare lead quality and revenue by source
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px]">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800">
                  <th className="px-5 py-4">Source</th>
                  <th className="px-5 py-4">Leads</th>
                  <th className="px-5 py-4">Qualified</th>
                  <th className="px-5 py-4">Qualification</th>
                  <th className="px-5 py-4">Won</th>
                  <th className="px-5 py-4">Revenue</th>
                </tr>
              </thead>

              <tbody>
                {sourceData.map((source) => {
                  const rate = Math.round(
                    (source.qualified / source.leads) * 100
                  );

                  return (
                    <tr
                      key={source.source}
                      className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                    >
                      <td className="px-5 py-4 font-semibold">
                        {source.source}
                      </td>

                      <td className="px-5 py-4 text-sm">
                        {source.leads}
                      </td>

                      <td className="px-5 py-4 text-sm">
                        {source.qualified}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 rounded-full bg-slate-100 dark:bg-slate-800">
                            <div
                              className="h-full rounded-full bg-orange-500"
                              style={{ width: `${rate}%` }}
                            />
                          </div>

                          <span className="text-sm font-semibold">
                            {rate}%
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold">
                        {source.won}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-emerald-600">
                        ₹{source.revenue.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* AI OPPORTUNITIES */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold">AI Opportunities</h2>

            <p className="text-sm text-slate-500">
              Areas where TIVRA can help the sales team act faster.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {insightCards.map((insight) => (
              <div
                key={insight.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`rounded-xl p-3 ${
                      insight.type === "warning"
                        ? "bg-red-50 text-red-600 dark:bg-red-500/10"
                        : insight.type === "positive"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
                        : "bg-blue-50 text-blue-600 dark:bg-blue-500/10"
                    }`}
                  >
                    {insight.type === "warning" ? (
                      <Clock3 className="h-5 w-5" />
                    ) : insight.type === "positive" ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : (
                      <FileText className="h-5 w-5" />
                    )}
                  </div>

                  <Sparkles className="h-4 w-4 text-orange-500" />
                </div>

                <h3 className="mt-4 font-bold">{insight.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {insight.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* AI INSIGHTS MODAL */}
      {showInsights && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowInsights(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-orange-500 p-2.5 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold">AI Sales Insights</h2>

                  <p className="text-sm text-slate-500">
                    Generated for {period}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowInsights(false)}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              {/* FOLLOW UP */}
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
                <div className="flex gap-3">
                  <TrendingDown className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                  <div>
                    <h3 className="font-semibold text-red-700 dark:text-red-400">
                      Follow-up risk
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-red-700/80 dark:text-red-300">
                      12 hot leads are currently outside the configured
                      response SLA.
                    </p>
                  </div>
                </div>
              </div>

              {/* WHATSAPP */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                <div className="flex gap-3">
                  <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />

                  <div>
                    <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">
                      Strong lead source
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-emerald-700/80 dark:text-emerald-300">
                      WhatsApp currently has the strongest qualification
                      performance among the listed sources.
                    </p>
                  </div>
                </div>
              </div>

              {/* QUOTATION */}
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
                <div className="flex gap-3">
                  <FileText className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />

                  <div>
                    <h3 className="font-semibold text-blue-700 dark:text-blue-400">
                      Quotation opportunity
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-blue-700/80 dark:text-blue-300">
                      Viewed quotations without a response can be added to a
                      follow-up sequence.
                    </p>
                  </div>
                </div>
              </div>

              {/* AI RECOMMENDATION */}
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  AI recommendation
                </p>

                <p className="mt-2 text-sm leading-6">
                  For <strong>{period}</strong>, focus the sales team on
                  overdue hot leads first, then follow up with customers who
                  have viewed quotations.
                </p>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 p-5 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowInsights(false)}
                className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}