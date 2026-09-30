"use client";

import { useMemo, useState } from "react";
import {
  Flame,
  Search,
  SlidersHorizontal,
  TrendingUp,
  Users,
  Target,
  Clock3,
  IndianRupee,
  MessageSquare,
  ChevronRight,
  X,
} from "lucide-react";

type Lead = {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  score: number;
  intent: string;
  budget: string;
  timeline: string;
  engagement: string;
  fit: string;
  stage: string;
  recommendation: string;
  lastActivity: string;
};

const initialLeads: Lead[] = [
  {
    id: 1,
    name: "Rajesh Mehta",
    company: "Mehta Industries",
    email: "rajesh@mehtaindustries.com",
    phone: "+91 98765 43210",
    score: 92,
    intent: "Very High",
    budget: "₹50,000+",
    timeline: "Within 7 days",
    engagement: "High",
    fit: "Excellent",
    stage: "Qualified",
    recommendation: "Contact immediately and schedule a demo.",
    lastActivity: "10 min ago",
  },
  {
    id: 2,
    name: "Priya Shah",
    company: "Shah Manufacturing",
    email: "priya@shahmfg.com",
    phone: "+91 98250 12345",
    score: 86,
    intent: "High",
    budget: "₹25,000–₹50,000",
    timeline: "Within 2 weeks",
    engagement: "High",
    fit: "Excellent",
    stage: "Contacted",
    recommendation: "Send product information and follow up today.",
    lastActivity: "35 min ago",
  },
  {
    id: 3,
    name: "Amit Patel",
    company: "Patel Engineering",
    email: "amit@pateleng.com",
    phone: "+91 99090 45678",
    score: 74,
    intent: "High",
    budget: "₹25,000+",
    timeline: "This month",
    engagement: "Medium",
    fit: "Good",
    stage: "Qualified",
    recommendation: "Understand requirements and share quotation.",
    lastActivity: "2 hours ago",
  },
  {
    id: 4,
    name: "Neha Desai",
    company: "Desai Traders",
    email: "neha@desaitraders.com",
    phone: "+91 98123 67890",
    score: 61,
    intent: "Medium",
    budget: "₹10,000–₹25,000",
    timeline: "1–2 months",
    engagement: "Medium",
    fit: "Good",
    stage: "Contacted",
    recommendation: "Continue nurturing with useful product content.",
    lastActivity: "5 hours ago",
  },
  {
    id: 5,
    name: "Karan Joshi",
    company: "Joshi Enterprises",
    email: "karan@joshient.com",
    phone: "+91 98980 11223",
    score: 48,
    intent: "Medium",
    budget: "Not specified",
    timeline: "Not specified",
    engagement: "Low",
    fit: "Average",
    stage: "New",
    recommendation: "Ask qualification questions before sales follow-up.",
    lastActivity: "Yesterday",
  },
  {
    id: 6,
    name: "Sneha Patel",
    company: "SP Solutions",
    email: "sneha@spsolutions.com",
    phone: "+91 97654 32109",
    score: 35,
    intent: "Low",
    budget: "Not specified",
    timeline: "Later",
    engagement: "Low",
    fit: "Average",
    stage: "New",
    recommendation: "Add to a low-frequency nurturing sequence.",
    lastActivity: "2 days ago",
  },
];

function getScoreType(score: number) {
  if (score >= 80) return "Hot";
  if (score >= 50) return "Warm";
  return "Cold";
}

function scoreClass(score: number) {
  if (score >= 80) {
    return "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400";
  }

  if (score >= 50) {
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";
  }

  return "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400";
}

function scoreBarClass(score: number) {
  if (score >= 80) return "bg-orange-500";
  if (score >= 50) return "bg-yellow-500";
  return "bg-blue-500";
}

export default function AIScoringPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const hotCount = initialLeads.filter((lead) => lead.score >= 80).length;
  const warmCount = initialLeads.filter(
    (lead) => lead.score >= 50 && lead.score < 80
  ).length;
  const coldCount = initialLeads.filter((lead) => lead.score < 50).length;

  const averageScore = Math.round(
    initialLeads.reduce((sum, lead) => sum + lead.score, 0) /
      initialLeads.length
  );

  const filteredLeads = useMemo(() => {
    return initialLeads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.company.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase());

      const type = getScoreType(lead.score);

      const matchesFilter = filter === "All" || type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-4 py-6 text-slate-950 dark:bg-[#070c1b] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* PAGE TITLE */}
        <div>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                  <Target size={21} />
                </div>

                <span className="text-sm font-medium text-orange-500">
                  AI Intelligence
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                AI Lead Scoring
              </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Identify which leads need attention first using AI-powered
                scoring.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:border-orange-300 hover:text-orange-500 dark:border-white/10 dark:bg-[#111a2e]"
            >
              <SlidersHorizontal size={17} />
              Scoring Rules
            </button>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Average AI Score"
            value={`${averageScore}/100`}
            subtitle="Across all leads"
            icon={<Target size={20} />}
          />

          <SummaryCard
            title="Hot Leads"
            value={hotCount.toString()}
            subtitle="Score 80–100"
            icon={<Flame size={20} />}
            accent="orange"
          />

          <SummaryCard
            title="Warm Leads"
            value={warmCount.toString()}
            subtitle="Score 50–79"
            icon={<TrendingUp size={20} />}
            accent="yellow"
          />

          <SummaryCard
            title="Cold Leads"
            value={coldCount.toString()}
            subtitle="Score below 50"
            icon={<Users size={20} />}
            accent="blue"
          />
        </section>

        {/* AI EXPLANATION */}
        <section className="rounded-2xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-500/20 dark:bg-orange-500/5">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Target size={21} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-950 dark:text-white">
                How AI Lead Scoring works
              </h2>

              <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                TIVRA evaluates lead intent, business fit, budget, purchase
                timeline and engagement to generate a score from 0 to 100.
                Higher scores indicate stronger buying signals and can help
                sales teams decide which leads to contact first.
              </p>
            </div>
          </div>
        </section>

        {/* SEARCH + FILTER */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111a2e]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search leads or companies..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 dark:border-white/10 dark:bg-[#0b1222]"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {["All", "Hot", "Warm", "Cold"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    filter === item
                      ? "bg-orange-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* LEAD TABLE */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111a2e]">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">AI Scored Leads</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {filteredLeads.length} leads found
                </p>
              </div>

              <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex dark:text-slate-400">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                AI updated scores
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-white/10 dark:text-slate-400">
                  <th className="px-5 py-4 font-medium">Lead</th>
                  <th className="px-5 py-4 font-medium">AI Score</th>
                  <th className="px-5 py-4 font-medium">Intent</th>
                  <th className="px-5 py-4 font-medium">Budget</th>
                  <th className="px-5 py-4 font-medium">Timeline</th>
                  <th className="px-5 py-4 font-medium">Engagement</th>
                  <th className="px-5 py-4 font-medium">Last Activity</th>
                  <th className="px-5 py-4 font-medium"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredLeads.map((lead) => {
                  const scoreType = getScoreType(lead.score);

                  return (
                    <tr
                      key={lead.id}
                      className="transition hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                    >
                      {/* LEAD */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                            {lead.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>

                          <div>
                            <p className="font-semibold">{lead.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {lead.company}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SCORE */}
                      <td className="px-5 py-4">
                        <div className="w-28">
                          <div className="mb-1.5 flex items-center justify-between">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-bold ${scoreClass(
                                lead.score
                              )}`}
                            >
                              {lead.score}
                            </span>

                            <span className="text-[11px] text-slate-400">
                              {scoreType}
                            </span>
                          </div>

                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                            <div
                              className={`h-full rounded-full ${scoreBarClass(
                                lead.score
                              )}`}
                              style={{ width: `${lead.score}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* INTENT */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <MessageSquare
                            size={15}
                            className="text-orange-500"
                          />
                          {lead.intent}
                        </div>
                      </td>

                      {/* BUDGET */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <IndianRupee
                            size={15}
                            className="text-slate-400"
                          />
                          {lead.budget}
                        </div>
                      </td>

                      {/* TIMELINE */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock3 size={15} className="text-slate-400" />
                          {lead.timeline}
                        </div>
                      </td>

                      {/* ENGAGEMENT */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            lead.engagement === "High"
                              ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                              : lead.engagement === "Medium"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
                              : "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400"
                          }`}
                        >
                          {lead.engagement}
                        </span>
                      </td>

                      {/* ACTIVITY */}
                      <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {lead.lastActivity}
                      </td>

                      {/* DETAILS */}
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedLead(lead)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-orange-50 hover:text-orange-500 dark:hover:bg-orange-500/10"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="px-5 py-16 text-center">
              <Users className="mx-auto text-slate-300 dark:text-slate-600" size={38} />
              <p className="mt-3 font-medium">No leads found</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Try another search or filter.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* LEAD DETAILS MODAL */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111a2e]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-orange-500">
                  AI Lead Analysis
                </p>

                <h2 className="mt-1 text-lg font-bold">
                  {selectedLead.name}
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {selectedLead.company}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {/* SCORE */}
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-500/20 dark:bg-orange-500/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      AI Lead Score
                    </p>

                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-4xl font-bold text-orange-500">
                        {selectedLead.score}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${scoreClass(
                          selectedLead.score
                        )}`}
                      >
                        {getScoreType(selectedLead.score)}
                      </span>
                    </div>
                  </div>

                  <Target className="text-orange-500" size={32} />
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white dark:bg-white/10">
                  <div
                    className={`h-full rounded-full ${scoreBarClass(
                      selectedLead.score
                    )}`}
                    style={{ width: `${selectedLead.score}%` }}
                  />
                </div>
              </div>

              {/* FACTORS */}
              <div>
                <h3 className="mb-3 font-semibold">Scoring Factors</h3>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Factor
                    title="Buying Intent"
                    value={selectedLead.intent}
                  />
                  <Factor title="Business Fit" value={selectedLead.fit} />
                  <Factor title="Budget" value={selectedLead.budget} />
                  <Factor title="Timeline" value={selectedLead.timeline} />
                  <Factor
                    title="Engagement"
                    value={selectedLead.engagement}
                  />
                  <Factor title="Sales Stage" value={selectedLead.stage} />
                </div>
              </div>

              {/* RECOMMENDATION */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  AI Recommendation
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                  {selectedLead.recommendation}
                </p>
              </div>

              {/* CONTACT */}
              <div className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:gap-6">
                <span>{selectedLead.email}</span>
                <span>{selectedLead.phone}</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Continue to Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  accent = "orange",
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  accent?: "orange" | "yellow" | "blue";
}) {
  const iconClass =
    accent === "orange"
      ? "bg-orange-100 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400"
      : accent === "yellow"
      ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400"
      : "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111a2e]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold">{value}</p>

          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function Factor({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-white/10">
      <p className="text-xs text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}