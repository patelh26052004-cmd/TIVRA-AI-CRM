"use client";

import Link from "next/link";
import {
  Users,
  Flame,
  MessageSquare,
  FileText,
  CalendarDays,
  BarChart3,
  Bot,
  ArrowUpRight,
  ArrowDownRight,
  Clock3,
  MoreHorizontal,
  Plus,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";

const stats = [
  {
    title: "Total Leads",
    value: "1,248",
    change: "+12.5%",
    positive: true,
    icon: Users,
  },
  {
    title: "Hot Leads",
    value: "186",
    change: "+8.2%",
    positive: true,
    icon: Flame,
  },
  {
    title: "Follow-ups",
    value: "64",
    change: "-4.1%",
    positive: false,
    icon: Clock3,
  },
  {
    title: "Quotations",
    value: "42",
    change: "+15.3%",
    positive: true,
    icon: FileText,
  },
];

const pipeline = [
  { name: "New", value: 320, percentage: 100 },
  { name: "Contacted", value: 248, percentage: 77 },
  { name: "Qualified", value: 182, percentage: 57 },
  { name: "Demo / Meeting", value: 104, percentage: 32 },
  { name: "Quotation", value: 72, percentage: 22 },
  { name: "Negotiation", value: 41, percentage: 13 },
];

const recentLeads = [
  {
    name: "Rahul Mehta",
    company: "Mehta Industries",
    source: "Website",
    score: 92,
    status: "Hot",
  },
  {
    name: "Priya Shah",
    company: "Shah Enterprises",
    source: "WhatsApp",
    score: 84,
    status: "Hot",
  },
  {
    name: "Amit Patel",
    company: "Patel Manufacturing",
    source: "Campaign",
    score: 71,
    status: "Warm",
  },
  {
    name: "Neha Desai",
    company: "Desai Solutions",
    source: "Website",
    score: 58,
    status: "Warm",
  },
  {
    name: "Karan Joshi",
    company: "Joshi Traders",
    source: "WhatsApp",
    score: 36,
    status: "Cold",
  },
];

const activities = [
  {
    title: "Quotation viewed",
    description: "Rahul Mehta viewed quotation #QT-1024",
    time: "10 min ago",
  },
  {
    title: "New hot lead",
    description: "AI scored Priya Shah with 84/100",
    time: "25 min ago",
  },
  {
    title: "Demo booked",
    description: "Amit Patel booked a product demo",
    time: "1 hour ago",
  },
  {
    title: "Follow-up completed",
    description: "Follow-up completed with Neha Desai",
    time: "2 hours ago",
  },
];

export default function DashboardPage() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("tivra_theme");

    if (savedTheme === "light") {
      setDark(false);
    } else {
      setDark(true);
    }
  }, []);

  const card = dark
    ? "border-white/10 bg-[#111a2e]"
    : "border-slate-200 bg-white";

  const text = dark ? "text-white" : "text-slate-950";
  const muted = dark ? "text-slate-400" : "text-slate-500";
  const border = dark ? "border-white/10" : "border-slate-200";

  return (
    <div className={`min-h-screen ${text}`}>
      <div className="w-full p-4 md:p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className={`mb-1 text-sm ${muted}`}>Overview</p>

            <h1 className="text-3xl font-bold tracking-tight">
              Sales Dashboard
            </h1>
          </div>

          <div className="flex gap-3">
            <Link
              href="/dashboard/leads"
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              <Plus size={18} />
              Add Lead
            </Link>

            <Link
              href="/dashboard/quotations"
              className={`hidden items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:border-orange-500 hover:text-orange-500 sm:flex ${border}`}
            >
              <FileText size={18} />
              Create Quotation
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className={`rounded-2xl border p-5 ${card}`}
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="rounded-xl bg-orange-500/10 p-3 text-orange-500">
                    <Icon size={21} />
                  </div>

                  <span
                    className={`flex items-center gap-1 text-xs font-semibold ${
                      stat.positive
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  >
                    {stat.positive ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}

                    {stat.change}
                  </span>
                </div>

                <p className={`text-sm ${muted}`}>{stat.title}</p>

                <p className="mt-1 text-3xl font-bold">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Pipeline + AI Insight */}
        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          {/* Pipeline */}
          <div
            className={`rounded-2xl border p-6 xl:col-span-2 ${card}`}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  Sales Pipeline
                </h2>

                <p className={`text-sm ${muted}`}>
                  Current leads by sales stage
                </p>
              </div>

              <Link
                href="/dashboard/pipeline"
                className="flex items-center gap-1 text-sm font-semibold text-orange-500"
              >
                View CRM
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="space-y-5">
              {pipeline.map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>{item.name}</span>

                    <span className={`font-semibold ${muted}`}>
                      {item.value} leads
                    </span>
                  </div>

                  <div
                    className={`h-2.5 overflow-hidden rounded-full ${
                      dark ? "bg-white/10" : "bg-slate-100"
                    }`}
                  >
                    <div
                      className="h-full rounded-full bg-orange-500 transition-all"
                      style={{
                        width: `${item.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insight */}
          <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-white/20 p-3">
                <Bot size={22} />
              </div>

              <div>
                <h2 className="font-bold">
                  AI Sales Insight
                </h2>

                <p className="text-xs text-white/70">
                  Updated just now
                </p>
              </div>
            </div>

            <p className="text-2xl font-bold leading-tight">
              18 hot leads need attention today.
            </p>

            <p className="mt-4 text-sm leading-6 text-white/80">
              TIVRA detected high buying intent from recent
              website and WhatsApp conversations. Prioritize
              leads requesting pricing, demos, and quotations.
            </p>

            <Link
              href="/dashboard/scoring"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-orange-600 transition hover:bg-slate-100"
            >
              View Hot Leads
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>

        {/* Recent Leads + Activity */}
        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          {/* Recent Leads */}
          <div
            className={`overflow-hidden rounded-2xl border xl:col-span-2 ${card}`}
          >
            <div
              className={`flex items-center justify-between border-b p-6 ${border}`}
            >
              <div>
                <h2 className="text-lg font-bold">
                  Recent Leads
                </h2>

                <p className={`text-sm ${muted}`}>
                  Latest leads captured by TIVRA
                </p>
              </div>

              <Link
                href="/dashboard/leads"
                className="text-sm font-semibold text-orange-500"
              >
                View all
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr
                    className={`border-b text-left text-xs uppercase ${border} ${muted}`}
                  >
                    <th className="px-6 py-4 font-semibold">
                      Lead
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Source
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      AI Score
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Status
                    </th>

                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>

                <tbody>
                  {recentLeads.map((lead) => (
                    <tr
                      key={lead.name}
                      className={`border-b last:border-0 ${border}`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold">
                            {lead.name}
                          </p>

                          <p className={`text-xs ${muted}`}>
                            {lead.company}
                          </p>
                        </div>
                      </td>

                      <td
                        className={`px-6 py-4 text-sm ${muted}`}
                      >
                        {lead.source}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`font-bold ${
                            lead.score >= 80
                              ? "text-orange-500"
                              : lead.score >= 60
                              ? "text-yellow-500"
                              : "text-slate-400"
                          }`}
                        >
                          {lead.score}/100
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            lead.status === "Hot"
                              ? "bg-orange-500/10 text-orange-500"
                              : lead.status === "Warm"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-slate-500/10 text-slate-400"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          className={`rounded-lg p-1 transition hover:bg-orange-500/10 hover:text-orange-500 ${muted}`}
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div
            className={`rounded-2xl border ${card}`}
          >
            <div
              className={`border-b p-6 ${border}`}
            >
              <h2 className="text-lg font-bold">
                Recent Activity
              </h2>

              <p className={`text-sm ${muted}`}>
                Latest sales activity
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {activities.map((activity, index) => (
                  <div
                    key={activity.title}
                    className="flex gap-3"
                  >
                    <div className="relative pt-1">
                      <div className="h-3 w-3 rounded-full bg-orange-500" />

                      {index !== activities.length - 1 && (
                        <div
                          className={`absolute left-[5px] top-4 h-12 w-px ${
                            dark
                              ? "bg-white/10"
                              : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>

                    <div className="-mt-1">
                      <p className="text-sm font-semibold">
                        {activity.title}
                      </p>

                      <p
                        className={`mt-1 text-xs leading-5 ${muted}`}
                      >
                        {activity.description}
                      </p>

                      <p className="mt-1 text-xs text-orange-500">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/dashboard/analytics"
                className={`mt-7 flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition hover:border-orange-500 hover:text-orange-500 ${border}`}
              >
                View Analytics
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pb-8">
          <h2 className="mb-4 text-lg font-bold">
            Quick Actions
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickAction
              href="/dashboard/leads"
              icon={<Users size={20} />}
              title="Add New Lead"
              description="Create a lead manually"
              dark={dark}
            />

            <QuickAction
              href="/dashboard/whatsapp"
              icon={<MessageSquare size={20} />}
              title="Open WhatsApp"
              description="Manage customer chats"
              dark={dark}
            />

            <QuickAction
              href="/dashboard/quotations"
              icon={<FileText size={20} />}
              title="Create Quotation"
              description="Prepare a sales quotation"
              dark={dark}
            />

            <QuickAction
              href="/dashboard/appointments"
              icon={<CalendarDays size={20} />}
              title="Book Demo"
              description="Schedule customer meeting"
              dark={dark}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
  description,
  dark,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  dark: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group rounded-2xl border p-5 transition duration-200 hover:-translate-y-0.5 hover:border-orange-500/40 ${
        dark
          ? "border-white/10 bg-[#111a2e]"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
        {icon}
      </div>

      <p className="font-semibold">{title}</p>

      <div className="mt-1 flex items-center justify-between gap-2">
        <p
          className={`text-xs ${
            dark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {description}
        </p>

        <ArrowUpRight
          size={16}
          className="shrink-0 text-orange-500 opacity-0 transition group-hover:opacity-100"
        />
      </div>
    </Link>
  );
}