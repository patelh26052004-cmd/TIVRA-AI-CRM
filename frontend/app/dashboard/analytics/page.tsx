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
  Download,
  BarChart3,
  Activity,
  Eye,
} from "lucide-react";

type Period =
  | "Last 30 Days"
  | "Last 3 Months"
  | "Last 6 Months"
  | "This Year";

type MonthlyData = {
  month: string;
  leads: number;
  qualified: number;
  won: number;
  revenue: number;
};

type InsightType =
  | "overall"
  | "hot-leads"
  | "whatsapp"
  | "quotation";

const allMonthlyData: MonthlyData[] = [
  {
    month: "Jan",
    leads: 70,
    qualified: 35,
    won: 9,
    revenue: 210000,
  },
  {
    month: "Feb",
    leads: 76,
    qualified: 38,
    won: 10,
    revenue: 235000,
  },
  {
    month: "Mar",
    leads: 79,
    qualified: 40,
    won: 11,
    revenue: 255000,
  },
  {
    month: "Apr",
    leads: 82,
    qualified: 42,
    won: 12,
    revenue: 285000,
  },
  {
    month: "May",
    leads: 96,
    qualified: 51,
    won: 15,
    revenue: 342000,
  },
  {
    month: "Jun",
    leads: 110,
    qualified: 59,
    won: 18,
    revenue: 415000,
  },
  {
    month: "Jul",
    leads: 128,
    qualified: 68,
    won: 21,
    revenue: 486000,
  },
  {
    month: "Aug",
    leads: 145,
    qualified: 79,
    won: 26,
    revenue: 578000,
  },
  {
    month: "Sep",
    leads: 162,
    qualified: 91,
    won: 31,
    revenue: 695000,
  },
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
    id: "hot-leads" as const,
    title: "Hot leads need attention",
    text: "12 hot leads have not received a follow-up within the configured SLA.",
    type: "warning",
  },
  {
    id: "whatsapp" as const,
    title: "WhatsApp is performing well",
    text: "WhatsApp leads currently show the highest qualification rate.",
    type: "positive",
  },
  {
    id: "quotation" as const,
    title: "Quotation follow-up opportunity",
    text: "18 quotations were viewed but have not yet received a response.",
    type: "info",
  },
];

function calculateTotal(
  data: MonthlyData[],
  field: keyof Pick<
    MonthlyData,
    "leads" | "qualified" | "won" | "revenue"
  >
) {
  return data.reduce(
    (sum, item) => sum + item[field],
    0
  );
}

function calculateGrowth(
  current: number,
  previous: number
) {
  if (previous === 0) {
    return 0;
  }

  return (
    ((current - previous) / previous) *
    100
  );
}

function getPreviousPeriodData(
  period: Period
): MonthlyData[] {
  switch (period) {
    case "Last 30 Days":
      return allMonthlyData.slice(-2, -1);

    case "Last 3 Months":
      return allMonthlyData.slice(-6, -3);

    case "Last 6 Months":
      return allMonthlyData.slice(0, 3);

    case "This Year":
      return allMonthlyData.slice(0, 3);

    default:
      return allMonthlyData.slice(0, 3);
  }
}

export default function AnalyticsPage() {
  const [period, setPeriod] =
    useState<Period>("Last 6 Months");

  const [activeInsight, setActiveInsight] =
    useState<InsightType | null>(null);

  const [exporting, setExporting] =
    useState(false);

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

  const previousPeriodData =
    useMemo(
      () => getPreviousPeriodData(period),
      [period]
    );

  const totalLeads = useMemo(
    () =>
      calculateTotal(
        filteredData,
        "leads"
      ),
    [filteredData]
  );

  const totalQualified = useMemo(
    () =>
      calculateTotal(
        filteredData,
        "qualified"
      ),
    [filteredData]
  );

  const totalWon = useMemo(
    () =>
      calculateTotal(
        filteredData,
        "won"
      ),
    [filteredData]
  );

  const totalRevenue = useMemo(
    () =>
      calculateTotal(
        filteredData,
        "revenue"
      ),
    [filteredData]
  );

  const previousLeads = useMemo(
    () =>
      calculateTotal(
        previousPeriodData,
        "leads"
      ),
    [previousPeriodData]
  );

  const previousRevenue = useMemo(
    () =>
      calculateTotal(
        previousPeriodData,
        "revenue"
      ),
    [previousPeriodData]
  );

  const qualificationRate =
    totalLeads > 0
      ? Math.round(
          (totalQualified /
            totalLeads) *
            100
        )
      : 0;

  const winRate =
    totalLeads > 0
      ? Math.round(
          (totalWon /
            totalLeads) *
            100
        )
      : 0;

  const leadGrowth = calculateGrowth(
    totalLeads,
    previousLeads
  );

  const revenueGrowth =
    calculateGrowth(
      totalRevenue,
      previousRevenue
    );

  const maxRevenue =
    filteredData.length > 0
      ? Math.max(
          ...filteredData.map(
            (item) => item.revenue
          )
        )
      : 1;

  const totalSourceLeads =
    sourceData.reduce(
      (sum, item) =>
        sum + item.leads,
      0
    );

  const totalSourceRevenue =
    sourceData.reduce(
      (sum, item) =>
        sum + item.revenue,
      0
    );

  const exportAnalytics = () => {
    if (exporting) {
      return;
    }

    setExporting(true);

    const rows = [
      [
        "Month",
        "Leads",
        "Qualified",
        "Won",
        "Revenue",
      ],
      ...filteredData.map(
        (item) => [
          item.month,
          item.leads,
          item.qualified,
          item.won,
          item.revenue,
        ]
      ),
    ];

    const csvContent = rows
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(
              /"/g,
              '""'
            )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download = `tivra-ai-analytics-${period
      .toLowerCase()
      .replaceAll(" ", "-")}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setTimeout(() => {
      setExporting(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                  <Sparkles className="h-5 w-5" />
                </div>

                <h1 className="text-2xl font-bold">
                  AI Analytics
                </h1>
              </div>

              <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                Understand your sales performance and discover actionable opportunities.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* PERIOD FILTER */}

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <select
                  value={period}
                  onChange={(e) =>
                    setPeriod(
                      e.target.value as Period
                    )
                  }
                  className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-10 text-sm font-medium outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="Last 30 Days">
                    Last 30 Days
                  </option>

                  <option value="Last 3 Months">
                    Last 3 Months
                  </option>

                  <option value="Last 6 Months">
                    Last 6 Months
                  </option>

                  <option value="This Year">
                    This Year
                  </option>
                </select>
              </div>

              {/* EXPORT */}

              <button
                type="button"
                onClick={
                  exportAnalytics
                }
                disabled={exporting}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-orange-300 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800"
              >
                <Download className="h-4 w-4" />

                {exporting
                  ? "Exporting..."
                  : "Export"}
              </button>

              {/* OVERALL AI INSIGHTS */}

              <button
                type="button"
                onClick={() =>
                  setActiveInsight(
                    "overall"
                  )
                }
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
        {/* =====================================================
            PERIOD INDICATOR
        ===================================================== */}

        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <CalendarDays className="h-4 w-4" />

          <span>
            Showing analytics for:
          </span>

          <span className="rounded-lg bg-orange-50 px-2.5 py-1 font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
            {period}
          </span>
        </div>

        {/* =====================================================
            KPI CARDS
        ===================================================== */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            title="Total Leads"
            value={totalLeads.toLocaleString()}
            growth={leadGrowth}
            icon={
              <Users className="h-6 w-6" />
            }
            iconClass="bg-orange-50 text-orange-600 dark:bg-orange-500/10"
          />

          <KpiCard
            title="Qualified Leads"
            value={totalQualified.toLocaleString()}
            subtitle={`${qualificationRate}% qualification`}
            icon={
              <Target className="h-6 w-6" />
            }
            iconClass="bg-blue-50 text-blue-600 dark:bg-blue-500/10"
          />

          <KpiCard
            title="Won Deals"
            value={totalWon.toLocaleString()}
            subtitle={`${winRate}% lead-to-win`}
            icon={
              <CheckCircle2 className="h-6 w-6" />
            }
            iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
          />

          <KpiCard
            title="Revenue"
            value={`₹${(
              totalRevenue /
              100000
            ).toFixed(2)}L`}
            growth={revenueGrowth}
            icon={
              <IndianRupee className="h-6 w-6" />
            }
            iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
          />
        </section>

        {/* =====================================================
            AI SUMMARY
        ===================================================== */}

        <section className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-white p-5 shadow-sm dark:border-orange-500/20 dark:from-orange-500/10 dark:to-slate-900">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold">
                  AI Sales Summary
                </h2>

                <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                  During{" "}
                  <strong>
                    {period}
                  </strong>
                  , your CRM recorded{" "}
                  <strong>
                    {totalLeads}
                  </strong>{" "}
                  leads,{" "}
                  <strong>
                    {totalQualified}
                  </strong>{" "}
                  qualified leads and{" "}
                  <strong>
                    {totalWon}
                  </strong>{" "}
                  won deals. Total recorded
                  revenue was{" "}
                  <strong>
                    ₹
                    {totalRevenue.toLocaleString()}
                  </strong>
                  .
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setActiveInsight(
                  "overall"
                )
              }
              className="shrink-0 rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-50 dark:border-orange-500/20 dark:bg-slate-800 dark:text-orange-400"
            >
              View Insights
            </button>
          </div>
        </section>

        {/* =====================================================
            REVENUE TREND
        ===================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-500" />

                <h2 className="font-bold">
                  Revenue & Sales Trend
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Monthly revenue performance
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 dark:bg-slate-800">
              {period}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex h-72 items-end gap-3 overflow-x-auto pb-2 sm:gap-5">
              {filteredData.map(
                (item) => {
                  const height =
                    Math.max(
                      10,
                      Math.round(
                        (item.revenue /
                          maxRevenue) *
                          100
                      )
                    );

                  return (
                    <div
                      key={
                        item.month
                      }
                      className="flex h-full min-w-[58px] flex-1 flex-col items-center justify-end"
                    >
                      <div className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        ₹
                        {(
                          item.revenue /
                          1000
                        ).toFixed(0)}
                        k
                      </div>

                      <div
                        className="w-full max-w-[58px] cursor-pointer rounded-t-xl bg-orange-500 transition-all duration-300 hover:bg-orange-600"
                        style={{
                          height: `${height}%`,
                        }}
                        title={`${item.month} - Revenue ₹${item.revenue.toLocaleString()}`}
                      />

                      <div className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                        {
                          item.month
                        }
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            FUNNEL + SALES ACTIVITY
        ===================================================== */}

        <section className="grid gap-6 xl:grid-cols-2">
          {/* FUNNEL */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div>
              <h2 className="font-bold">
                Lead Conversion Funnel
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                How leads move through the sales process
              </p>
            </div>

            <div className="mt-6 space-y-5">
              <FunnelRow
                label="All Leads"
                value={
                  totalLeads
                }
                percentage={100}
                icon={
                  <Users className="h-4 w-4" />
                }
              />

              <FunnelRow
                label="Qualified"
                value={
                  totalQualified
                }
                percentage={
                  qualificationRate
                }
                icon={
                  <Target className="h-4 w-4" />
                }
              />

              <FunnelRow
                label="Won"
                value={
                  totalWon
                }
                percentage={winRate}
                icon={
                  <CheckCircle2 className="h-4 w-4" />
                }
              />
            </div>
          </section>

          {/* SALES ACTIVITY */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-500" />

                <h2 className="font-bold">
                  Sales Activity
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Key operational metrics
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <ActivityCard
                icon={
                  <Flame className="h-4 w-4 text-red-500" />
                }
                label="Hot Leads"
                value="75"
                note="12 require immediate follow-up"
                noteClass="text-red-500"
                onClick={() =>
                  setActiveInsight(
                    "hot-leads"
                  )
                }
              />

              <ActivityCard
                icon={
                  <Clock3 className="h-4 w-4 text-orange-500" />
                }
                label="Follow-ups"
                value="128"
                note="18 overdue"
                noteClass="text-orange-600"
              />

              <ActivityCard
                icon={
                  <MessageSquare className="h-4 w-4 text-green-500" />
                }
                label="WhatsApp"
                value="84%"
                note="response rate"
                noteClass="text-emerald-600"
                onClick={() =>
                  setActiveInsight(
                    "whatsapp"
                  )
                }
              />

              <ActivityCard
                icon={
                  <FileText className="h-4 w-4 text-blue-500" />
                }
                label="Quotations"
                value="64"
                note="18 awaiting response"
                noteClass="text-slate-500"
                onClick={() =>
                  setActiveInsight(
                    "quotation"
                  )
                }
              />
            </div>
          </section>
        </section>

        {/* =====================================================
            LEAD SOURCE PERFORMANCE
        ===================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-bold">
                  Lead Source Performance
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Compare lead quality and revenue by source
                </p>
              </div>

              <div className="flex gap-3 text-xs">
                <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                  Total Leads:{" "}
                  <strong>
                    {totalSourceLeads}
                  </strong>
                </div>

                <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                  Revenue:{" "}
                  <strong>
                    ₹
                    {totalSourceRevenue.toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px]">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800">
                  <th className="px-5 py-4">
                    Source
                  </th>

                  <th className="px-5 py-4">
                    Leads
                  </th>

                  <th className="px-5 py-4">
                    Qualified
                  </th>

                  <th className="px-5 py-4">
                    Qualification
                  </th>

                  <th className="px-5 py-4">
                    Won
                  </th>

                  <th className="px-5 py-4">
                    Revenue
                  </th>
                </tr>
              </thead>

              <tbody>
                {sourceData.map(
                  (source) => {
                    const rate =
                      source.leads >
                      0
                        ? Math.round(
                            (source.qualified /
                              source.leads) *
                              100
                          )
                        : 0;

                    return (
                      <tr
                        key={
                          source.source
                        }
                        className="border-b border-slate-100 transition hover:bg-slate-50 last:border-0 dark:border-slate-800 dark:hover:bg-slate-800/40"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                              <MessageSquare className="h-4 w-4" />
                            </div>

                            <div>
                              <p className="font-semibold">
                                {
                                  source.source
                                }
                              </p>

                              <p className="text-[11px] text-slate-400">
                                {Math.round(
                                  (source.leads /
                                    totalSourceLeads) *
                                    100
                                )}
                                % of leads
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {
                            source.leads
                          }
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {
                            source.qualified
                          }
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-24 rounded-full bg-slate-100 dark:bg-slate-800">
                              <div
                                className="h-full rounded-full bg-orange-500"
                                style={{
                                  width: `${rate}%`,
                                }}
                              />
                            </div>

                            <span className="text-sm font-semibold">
                              {rate}%
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold">
                          {
                            source.won
                          }
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-emerald-600">
                          ₹
                          {source.revenue.toLocaleString()}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* =====================================================
            AI OPPORTUNITIES
        ===================================================== */}

        <section>
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-500" />

              <h2 className="text-lg font-bold">
                AI Opportunities
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Areas where TIVRA can help the sales team act faster.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {insightCards.map(
              (insight) => (
                <div
                  key={
                    insight.id
                  }
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`rounded-xl p-3 ${
                        insight.type ===
                        "warning"
                          ? "bg-red-50 text-red-600 dark:bg-red-500/10"
                          : insight.type ===
                            "positive"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
                          : "bg-blue-50 text-blue-600 dark:bg-blue-500/10"
                      }`}
                    >
                      {insight.type ===
                      "warning" ? (
                        <Clock3 className="h-5 w-5" />
                      ) : insight.type ===
                        "positive" ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </div>

                    <Sparkles className="h-4 w-4 text-orange-500" />
                  </div>

                  <h3 className="mt-4 font-bold">
                    {insight.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {
                      insight.text
                    }
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveInsight(
                        insight.id
                      )
                    }
                    className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-orange-500 hover:text-orange-600"
                  >
                    Explore insight

                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )
            )}
          </div>
        </section>
      </main>

      {/* =====================================================
          CONTEXTUAL AI INSIGHT MODALS
      ===================================================== */}

      {activeInsight && (
        <InsightModal
          type={activeInsight}
          period={period}
          totalLeads={totalLeads}
          totalQualified={
            totalQualified
          }
          totalWon={totalWon}
          totalRevenue={
            totalRevenue
          }
          qualificationRate={
            qualificationRate
          }
          winRate={winRate}
          onClose={() =>
            setActiveInsight(
              null
            )
          }
        />
      )}
    </div>
  );
}

/* =========================================================
   KPI CARD
========================================================= */

function KpiCard({
  title,
  value,
  growth,
  subtitle,
  icon,
  iconClass,
}: {
  title: string;
  value: string;
  growth?: number;
  subtitle?: string;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight">
            {value}
          </p>

          {typeof growth ===
            "number" && (
            <div
              className={`mt-2 flex items-center gap-1 text-xs font-semibold ${
                growth >= 0
                  ? "text-emerald-600"
                  : "text-red-500"
              }`}
            >
              {growth >= 0 ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}

              {Math.abs(
                growth
              ).toFixed(1)}
              %

              <span className="font-normal text-slate-400">
                vs previous period
              </span>
            </div>
          )}

          {subtitle && (
            <div className="mt-2 text-xs font-semibold text-emerald-600">
              {subtitle}
            </div>
          )}
        </div>

        <div
          className={`rounded-xl p-3 ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   FUNNEL ROW
========================================================= */

function FunnelRow({
  label,
  value,
  percentage,
  icon,
}: {
  label: string;
  value: number;
  percentage: number;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-slate-400">
            {icon}
          </div>

          <span className="text-sm font-medium">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">
            {value}
          </span>

          <span className="text-xs text-slate-400">
            {percentage}%
          </span>
        </div>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-orange-500 transition-all duration-500"
          style={{
            width: `${Math.max(
              percentage,
              5
            )}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   ACTIVITY CARD
========================================================= */

function ActivityCard({
  icon,
  label,
  value,
  note,
  noteClass,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
  noteClass: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`w-full rounded-xl bg-slate-50 p-4 text-left dark:bg-slate-800/70 ${
        onClick
          ? "transition hover:bg-orange-50 dark:hover:bg-orange-500/5"
          : ""
      }`}
    >
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        {icon}

        {label}
      </div>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>

      <p
        className={`mt-1 text-xs font-medium ${noteClass}`}
      >
        {note}
      </p>

      {onClick && (
        <p className="mt-3 text-[10px] font-semibold text-orange-500">
          View insight →
        </p>
      )}
    </button>
  );
}

/* =========================================================
   INSIGHT MODAL
========================================================= */

function InsightModal({
  type,
  period,
  totalLeads,
  totalQualified,
  totalWon,
  totalRevenue,
  qualificationRate,
  winRate,
  onClose,
}: {
  type: InsightType;
  period: Period;
  totalLeads: number;
  totalQualified: number;
  totalWon: number;
  totalRevenue: number;
  qualificationRate: number;
  winRate: number;
  onClose: () => void;
}) {
  const content = {
    overall: {
      title: "AI Sales Insights",
      subtitle: `Overall analytics for ${period}`,
      icon: (
        <Sparkles className="h-5 w-5" />
      ),
      iconClass:
        "bg-orange-500 text-white",
      cards: [
        {
          type: "orange" as const,
          icon: (
            <Sparkles className="h-5 w-5" />
          ),
          title:
            "Overall performance",
          text: `During ${period}, your CRM recorded ${totalLeads} leads, ${totalQualified} qualified leads and ${totalWon} won deals, generating ₹${totalRevenue.toLocaleString()} in recorded revenue.`,
        },
        {
          type: "red" as const,
          icon: (
            <Clock3 className="h-5 w-5" />
          ),
          title: "Follow-up risk",
          text: "12 hot leads are currently outside the configured response SLA and should be reviewed by the sales team.",
        },
        {
          type: "green" as const,
          icon: (
            <TrendingUp className="h-5 w-5" />
          ),
          title:
            "Strong channel",
          text: "WhatsApp continues to show strong qualification performance among the listed lead sources.",
        },
        {
          type: "blue" as const,
          icon: (
            <FileText className="h-5 w-5" />
          ),
          title:
            "Quotation opportunity",
          text: "Viewed quotations without a response can be added to a structured follow-up sequence.",
        },
      ],
      recommendation: `For ${period}, maintain attention on overdue hot leads while continuing structured follow-ups on quotation and WhatsApp conversations.`,
    },

    "hot-leads": {
      title: "Hot Leads Insight",
      subtitle:
        "AI analysis of high-intent leads",
      icon: (
        <Flame className="h-5 w-5" />
      ),
      iconClass:
        "bg-red-500 text-white",
      cards: [
        {
          type: "red" as const,
          icon: (
            <Flame className="h-5 w-5" />
          ),
          title:
            "12 hot leads need follow-up",
          text: "These leads have not received a follow-up within the configured SLA. Delayed responses may reduce engagement.",
        },
        {
          type: "orange" as const,
          icon: (
            <Target className="h-5 w-5" />
          ),
          title:
            "High conversion opportunity",
          text: "Hot leads should be handled with faster and more personalized follow-ups because they already show stronger buying signals.",
        },
      ],
      recommendation:
        "Prioritize the 12 overdue hot leads, assign owners and schedule their next follow-up immediately.",
    },

    whatsapp: {
      title: "WhatsApp Insight",
      subtitle:
        "AI analysis of WhatsApp performance",
      icon: (
        <MessageSquare className="h-5 w-5" />
      ),
      iconClass:
        "bg-green-500 text-white",
      cards: [
        {
          type: "green" as const,
          icon: (
            <TrendingUp className="h-5 w-5" />
          ),
          title:
            "Strong qualification rate",
          text: "WhatsApp generated 58 leads, including 36 qualified leads, giving it a qualification rate of approximately 62%.",
        },
        {
          type: "blue" as const,
          icon: (
            <MessageSquare className="h-5 w-5" />
          ),
          title:
            "High engagement channel",
          text: "The current analytics show WhatsApp as an important channel for customer conversations and lead qualification.",
        },
      ],
      recommendation:
        "Continue using WhatsApp for timely lead engagement and connect high-intent conversations with sales follow-up workflows.",
    },

    quotation: {
      title: "Quotation Insight",
      subtitle:
        "AI analysis of quotation follow-ups",
      icon: (
        <FileText className="h-5 w-5" />
      ),
      iconClass:
        "bg-blue-500 text-white",
      cards: [
        {
          type: "blue" as const,
          icon: (
            <Eye className="h-5 w-5" />
          ),
          title:
            "18 quotations awaiting response",
          text: "These quotations were viewed but have not yet received a customer response, creating a clear follow-up opportunity.",
        },
        {
          type: "orange" as const,
          icon: (
            <Clock3 className="h-5 w-5" />
          ),
          title:
            "Follow-up can be automated",
          text: "A structured reminder sequence can help sales representatives follow up with customers after quotation views.",
        },
      ],
      recommendation:
        "Create a quotation follow-up workflow that prioritizes viewed quotations and assigns a clear next action to the responsible salesperson.",
    },
  }[type];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${content.iconClass}`}
            >
              {content.icon}
            </div>

            <div>
              <h2 className="font-bold">
                {content.title}
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {content.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* CONTENT */}

        <div className="max-h-[70vh] space-y-4 overflow-y-auto p-5">
          {content.cards.map(
            (card) => (
              <InsightModalCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                text={card.text}
                type={card.type}
              />
            )
          )}

          {/* PERFORMANCE SNAPSHOT */}

          {type ===
            "overall" && (
            <div className="grid gap-3 sm:grid-cols-3">
              <MiniInsightStat
                label="Qualification"
                value={`${qualificationRate}%`}
              />

              <MiniInsightStat
                label="Lead-to-Win"
                value={`${winRate}%`}
              />

              <MiniInsightStat
                label="Revenue"
                value={`₹${(
                  totalRevenue /
                  100000
                ).toFixed(2)}L`}
              />
            </div>
          )}

          {/* RECOMMENDATION */}

          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-orange-500" />

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                AI Recommendation
              </p>
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
              {content.recommendation}
            </p>
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex justify-end border-t border-slate-200 p-5 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INSIGHT MODAL CARD
========================================================= */

function InsightModalCard({
  icon,
  title,
  text,
  type,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  type:
    | "red"
    | "green"
    | "blue"
    | "orange";
}) {
  const classes = {
    red: "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400",
    green:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",
    blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",
    orange:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400",
  };

  return (
    <div
      className={`rounded-xl border p-4 ${classes[type]}`}
    >
      <div className="flex gap-3">
        <div className="mt-0.5 shrink-0">
          {icon}
        </div>

        <div>
          <h3 className="font-semibold">
            {title}
          </h3>

          <p className="mt-1 text-sm leading-6 opacity-85">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MINI INSIGHT STAT
========================================================= */

function MiniInsightStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold">
        {value}
      </p>
    </div>
  );
}