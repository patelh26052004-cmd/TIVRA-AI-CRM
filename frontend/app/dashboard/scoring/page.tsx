"use client";

import { useMemo, useState } from "react";
import {
  Target,
  Flame,
  TrendingUp,
  Users,
  Search,
  MessageSquare,
  IndianRupee,
  Clock3,
  ChevronRight,
  X,
  Sparkles,
  Mail,
  Phone,
  Filter,
} from "lucide-react";

type ScoreFilter = "all" | "hot" | "warm" | "cold";

type Lead = {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  score: number;
  value: number;
  source: string;
  lastActivity: string;
  status: string;
  engagement: number;
  budget: string;
  timeline: string;
  industry: string;
};

const leads: Lead[] = [
  {
    id: 1,
    name: "Rahul Shah",
    company: "Shah Industries",
    email: "rahul@shahindustries.com",
    phone: "+91 98765 43210",
    score: 94,
    value: 250000,
    source: "Website",
    lastActivity: "12 min ago",
    status: "New",
    engagement: 96,
    budget: "₹2L - ₹5L",
    timeline: "Within 7 days",
    industry: "Manufacturing",
  },
  {
    id: 2,
    name: "Priya Mehta",
    company: "Mehta Enterprises",
    email: "priya@mehtaenterprises.com",
    phone: "+91 98250 12345",
    score: 88,
    value: 180000,
    source: "WhatsApp",
    lastActivity: "35 min ago",
    status: "Contacted",
    engagement: 89,
    budget: "₹1L - ₹3L",
    timeline: "Within 15 days",
    industry: "Retail",
  },
  {
    id: 3,
    name: "Amit Patel",
    company: "Patel Tech Solutions",
    email: "amit@pateltech.com",
    phone: "+91 99090 56789",
    score: 82,
    value: 150000,
    source: "Referral",
    lastActivity: "1 hour ago",
    status: "Qualified",
    engagement: 84,
    budget: "₹1L - ₹2L",
    timeline: "This month",
    industry: "Technology",
  },
  {
    id: 4,
    name: "Neha Desai",
    company: "Desai Textiles",
    email: "neha@desaitextiles.com",
    phone: "+91 98123 45678",
    score: 76,
    value: 125000,
    source: "Facebook",
    lastActivity: "2 hours ago",
    status: "Contacted",
    engagement: 78,
    budget: "₹1L - ₹2L",
    timeline: "This month",
    industry: "Textiles",
  },
  {
    id: 5,
    name: "Karan Joshi",
    company: "Joshi Motors",
    email: "karan@joshimotors.com",
    phone: "+91 98980 23456",
    score: 69,
    value: 95000,
    source: "Instagram",
    lastActivity: "3 hours ago",
    status: "New",
    engagement: 70,
    budget: "₹50K - ₹1L",
    timeline: "Next month",
    industry: "Automobile",
  },
  {
    id: 6,
    name: "Sneha Patel",
    company: "SP Fashion",
    email: "sneha@spfashion.com",
    phone: "+91 97654 32109",
    score: 61,
    value: 70000,
    source: "Google Ads",
    lastActivity: "5 hours ago",
    status: "New",
    engagement: 64,
    budget: "₹50K - ₹1L",
    timeline: "Next month",
    industry: "Fashion",
  },
  {
    id: 7,
    name: "Dhruv Mehta",
    company: "Mehta Foods",
    email: "dhruv@mehtafoods.com",
    phone: "+91 99123 67890",
    score: 48,
    value: 45000,
    source: "Website",
    lastActivity: "1 day ago",
    status: "New",
    engagement: 51,
    budget: "₹25K - ₹50K",
    timeline: "2-3 months",
    industry: "Food",
  },
  {
    id: 8,
    name: "Riya Shah",
    company: "Shah Designs",
    email: "riya@shahdesigns.com",
    phone: "+91 98700 11223",
    score: 32,
    value: 25000,
    source: "Organic",
    lastActivity: "2 days ago",
    status: "New",
    engagement: 34,
    budget: "Below ₹50K",
    timeline: "Not decided",
    industry: "Design",
  },
];

function getScoreType(score: number) {
  if (score >= 80) return "hot";
  if (score >= 60) return "warm";
  return "cold";
}

function getScoreLabel(score: number) {
  if (score >= 80) return "Hot Lead";
  if (score >= 60) return "Warm Lead";
  return "Cold Lead";
}

function getScoreColor(score: number) {
  if (score >= 80) {
    return "text-red-400 bg-red-500/10 border-red-500/20";
  }

  if (score >= 60) {
    return "text-orange-400 bg-orange-500/10 border-orange-500/20";
  }

  return "text-blue-400 bg-blue-500/10 border-blue-500/20";
}

function getScoreBarColor(score: number) {
  if (score >= 80) return "bg-red-500";
  if (score >= 60) return "bg-orange-500";
  return "bg-blue-500";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AIScoringPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ScoreFilter>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showRules, setShowRules] = useState(false);

  const hotCount = leads.filter((lead) => lead.score >= 80).length;
  const warmCount = leads.filter(
    (lead) => lead.score >= 60 && lead.score < 80
  ).length;
  const coldCount = leads.filter((lead) => lead.score < 60).length;

  const averageScore = Math.round(
    leads.reduce((total, lead) => total + lead.score, 0) / leads.length
  );

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        lead.name.toLowerCase().includes(searchText) ||
        lead.company.toLowerCase().includes(searchText) ||
        lead.email.toLowerCase().includes(searchText) ||
        lead.industry.toLowerCase().includes(searchText);

      const matchesFilter =
        filter === "all" || getScoreType(lead.score) === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <div className="mx-auto max-w-[1500px] p-6">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15">
                <Target className="h-6 w-6 text-orange-400" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  AI Lead Scoring
                </h1>
                <p className="text-sm text-zinc-500">
                  AI-powered lead qualification and prioritization
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowRules(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-orange-500/40 hover:bg-zinc-800"
          >
            <Sparkles className="h-4 w-4 text-orange-400" />
            Scoring Rules
          </button>
        </div>

        {/* Stats */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-zinc-400">Average Score</span>

              <div className="rounded-lg bg-orange-500/10 p-2">
                <Target className="h-5 w-5 text-orange-400" />
              </div>
            </div>

            <div className="text-3xl font-bold">{averageScore}</div>

            <p className="mt-1 text-xs text-emerald-400">
              AI confidence score
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-zinc-400">Hot Leads</span>

              <div className="rounded-lg bg-red-500/10 p-2">
                <Flame className="h-5 w-5 text-red-400" />
              </div>
            </div>

            <div className="text-3xl font-bold">{hotCount}</div>

            <p className="mt-1 text-xs text-red-400">Priority follow-up</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-zinc-400">Warm Leads</span>

              <div className="rounded-lg bg-orange-500/10 p-2">
                <TrendingUp className="h-5 w-5 text-orange-400" />
              </div>
            </div>

            <div className="text-3xl font-bold">{warmCount}</div>

            <p className="mt-1 text-xs text-orange-400">
              Needs nurturing
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-zinc-400">Cold Leads</span>

              <div className="rounded-lg bg-blue-500/10 p-2">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
            </div>

            <div className="text-3xl font-bold">{coldCount}</div>

            <p className="mt-1 text-xs text-blue-400">Low priority</p>
          </div>
        </section>

        {/* AI Banner */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-zinc-900 to-zinc-900 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-orange-500/15 p-3">
                <Sparkles className="h-6 w-6 text-orange-400" />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  AI scoring is active
                </h2>

                <p className="mt-1 max-w-2xl text-sm text-zinc-400">
                  Leads are automatically prioritized using engagement,
                  budget, activity, source and buying timeline.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400">
              ● System Active
            </div>
          </div>
        </section>

        {/* Search / Filter */}
        <section className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search leads, company, email..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-orange-500/50"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              <Filter className="h-4 w-4 shrink-0 text-zinc-500" />

              {(["all", "hot", "warm", "cold"] as ScoreFilter[]).map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium capitalize transition ${
                      filter === item
                        ? "bg-orange-500 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                    }`}
                  >
                    {item === "all" ? "All Leads" : `${item} Leads`}
                  </button>
                )
              )}
            </div>
          </div>
        </section>

        {/* Lead Table */}
        <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70">
          <div className="border-b border-zinc-800 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Lead Scores</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  {filteredLeads.length} leads found
                </p>
              </div>

              <div className="hidden text-xs text-zinc-500 md:block">
                Updated just now
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/50 text-left text-xs uppercase tracking-wide text-zinc-500">
                  <th className="px-5 py-4">Lead</th>
                  <th className="px-5 py-4">AI Score</th>
                  <th className="px-5 py-4">Potential Value</th>
                  <th className="px-5 py-4">Source</th>
                  <th className="px-5 py-4">Last Activity</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4"></th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-zinc-800/70 transition hover:bg-zinc-800/30"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 font-semibold text-orange-400">
                          {lead.name
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <div>
                          <div className="font-medium text-white">
                            {lead.name}
                          </div>

                          <div className="text-xs text-zinc-500">
                            {lead.company}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24">
                          <div className="mb-1 flex justify-between">
                            <span
                              className={`text-sm font-bold ${
                                getScoreType(lead.score) === "hot"
                                  ? "text-red-400"
                                  : getScoreType(lead.score) === "warm"
                                    ? "text-orange-400"
                                    : "text-blue-400"
                              }`}
                            >
                              {lead.score}
                            </span>
                          </div>

                          <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                            <div
                              className={`h-full rounded-full ${getScoreBarColor(
                                lead.score
                              )}`}
                              style={{ width: `${lead.score}%` }}
                            />
                          </div>
                        </div>

                        <span
                          className={`rounded-full border px-2 py-1 text-[10px] font-medium ${getScoreColor(
                            lead.score
                          )}`}
                        >
                          {getScoreLabel(lead.score)}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                        <IndianRupee className="h-4 w-4 text-zinc-500" />
                        {formatCurrency(lead.value)}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-300">
                        {lead.source}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <Clock3 className="h-4 w-4 text-zinc-600" />
                        {lead.lastActivity}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
                        {lead.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-orange-500/10 hover:text-orange-400"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="px-5 py-16 text-center">
              <Users className="mx-auto mb-3 h-10 w-10 text-zinc-700" />
              <h3 className="font-medium text-zinc-300">
                No leads found
              </h3>
              <p className="mt-1 text-sm text-zinc-600">
                Try another search or filter.
              </p>
            </div>
          )}
        </section>

        {/* Selected Lead Drawer */}
        {selectedLead && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedLead(null)}
            />

            <div className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto border-l border-zinc-800 bg-[#0d0d0f] shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-[#0d0d0f]/95 px-6 py-5 backdrop-blur">
                <div>
                  <h2 className="text-lg font-semibold">
                    Lead Information
                  </h2>
                  <p className="text-xs text-zinc-500">
                    AI scoring details
                  </p>
                </div>

                <button
                  onClick={() => setSelectedLead(null)}
                  className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6 p-6">
                {/* Lead Header */}
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10 text-lg font-bold text-orange-400">
                    {selectedLead.name
                      .split(" ")
                      .map((name) => name[0])
                      .join("")
                      .slice(0, 2)}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">
                      {selectedLead.name}
                    </h3>

                    <p className="text-sm text-zinc-500">
                      {selectedLead.company}
                    </p>
                  </div>
                </div>

                {/* Score */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-zinc-400">
                      AI Lead Score
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${getScoreColor(
                        selectedLead.score
                      )}`}
                    >
                      {getScoreLabel(selectedLead.score)}
                    </span>
                  </div>

                  <div className="flex items-end gap-3">
                    <span className="text-5xl font-bold">
                      {selectedLead.score}
                    </span>
                    <span className="mb-2 text-zinc-600">/ 100</span>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className={`h-full rounded-full ${getScoreBarColor(
                        selectedLead.score
                      )}`}
                      style={{ width: `${selectedLead.score}%` }}
                    />
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-zinc-300">
                    Contact Details
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
                      <Mail className="h-4 w-4 text-zinc-500" />
                      <span className="text-sm text-zinc-300">
                        {selectedLead.email}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
                      <Phone className="h-4 w-4 text-zinc-500" />
                      <span className="text-sm text-zinc-300">
                        {selectedLead.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Factors */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-zinc-300">
                    AI Scoring Factors
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-zinc-500">
                          Engagement
                        </span>
                        <span className="text-zinc-300">
                          {selectedLead.engagement}%
                        </span>
                      </div>

                      <div className="h-1.5 rounded-full bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-orange-500"
                          style={{
                            width: `${selectedLead.engagement}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
                        <p className="text-xs text-zinc-500">
                          Budget
                        </p>
                        <p className="mt-1 text-sm font-medium text-white">
                          {selectedLead.budget}
                        </p>
                      </div>

                      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
                        <p className="text-xs text-zinc-500">
                          Timeline
                        </p>
                        <p className="mt-1 text-sm font-medium text-white">
                          {selectedLead.timeline}
                        </p>
                      </div>

                      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
                        <p className="text-xs text-zinc-500">
                          Industry
                        </p>
                        <p className="mt-1 text-sm font-medium text-white">
                          {selectedLead.industry}
                        </p>
                      </div>

                      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
                        <p className="text-xs text-zinc-500">
                          Lead Source
                        </p>
                        <p className="mt-1 text-sm font-medium text-white">
                          {selectedLead.source}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-zinc-300">
                    Quick Actions
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-orange-600">
                      <MessageSquare className="h-4 w-4" />
                      WhatsApp
                    </button>

                    <button className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800">
                      <Phone className="h-4 w-4" />
                      Call Lead
                    </button>
                  </div>
                </div>

                {/* AI Recommendation */}
                <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">
                  <div className="flex gap-3">
                    <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" />

                    <div>
                      <h3 className="font-semibold text-orange-300">
                        AI Recommendation
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-zinc-400">
                        {selectedLead.score >= 80
                          ? "This lead has strong buying signals. Contact the lead immediately and prioritize a personalized sales conversation."
                          : selectedLead.score >= 60
                            ? "This lead shows good potential. Continue nurturing with relevant content and schedule a follow-up."
                            : "This lead currently has lower buying signals. Keep the lead in a nurturing campaign and monitor future activity."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scoring Rules Modal */}
        {showRules && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowRules(false)}
            />

            <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#101012] p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    AI Scoring Rules
                  </h2>

                  <p className="mt-1 text-xs text-zinc-500">
                    How TIVRA calculates lead priority
                  </p>
                </div>

                <button
                  onClick={() => setShowRules(false)}
                  className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-300">
                      Engagement
                    </span>
                    <span className="text-sm font-semibold text-orange-400">
                      30%
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-300">
                      Buying Intent
                    </span>
                    <span className="text-sm font-semibold text-orange-400">
                      25%
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-300">
                      Budget
                    </span>
                    <span className="text-sm font-semibold text-orange-400">
                      20%
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-300">
                      Activity
                    </span>
                    <span className="text-sm font-semibold text-orange-400">
                      15%
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-300">
                      Lead Source
                    </span>
                    <span className="text-sm font-semibold text-orange-400">
                      10%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-zinc-900 p-4 text-xs leading-5 text-zinc-500">
                <span className="font-medium text-zinc-300">
                  Hot:
                </span>{" "}
                80–100 &nbsp;•&nbsp;
                <span className="font-medium text-zinc-300">
                  Warm:
                </span>{" "}
                60–79 &nbsp;•&nbsp;
                <span className="font-medium text-zinc-300">
                  Cold:
                </span>{" "}
                0–59
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}