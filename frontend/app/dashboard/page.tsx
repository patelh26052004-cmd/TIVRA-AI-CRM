"use client";

import Link from "next/link";
import {
  Users,
  Flame,
  MessageSquare,
  FileText,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  Clock3,
  MoreHorizontal,
  Plus,
  ChevronRight,
  Eye,
  Pencil,
  MessageCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

// const stats = [
//   {
//     title: "Total Leads",
//     value: leads.length.toLocaleString(),
//     change: "+12.5%",
//     positive: true,
//     icon: Users,
//   },
//   {
//     title: "Hot Leads",
//     value: "186",
//     change: "+8.2%",
//     positive: true,
//     icon: Flame,
//   },
//   {
//     title: "Follow-ups",
//     value: "64",
//     change: "-4.1%",
//     positive: false,
//     icon: Clock3,
//   },
//   {
//     title: "Quotations",
//     value: "42",
//     change: "+15.3%",
//     positive: true,
//     icon: FileText,
//   },
// ];

// const pipeline = [
//   { name: "New", value: 320, percentage: 100 },
//   { name: "Contacted", value: 248, percentage: 77 },
//   { name: "Qualified", value: 182, percentage: 57 },
//   { name: "Demo / Meeting", value: 104, percentage: 32 },
//   { name: "Quotation", value: 72, percentage: 22 },
//   { name: "Negotiation", value: 41, percentage: 13 },
// ];

// const recentLeads = [
//   {
//     name: "Rahul Mehta",
//     company: "Mehta Industries",
//     source: "Website",
//     score: 92,
//     status: "Hot",
//   },
//   {
//     name: "Priya Shah",
//     company: "Shah Enterprises",
//     source: "WhatsApp",
//     score: 84,
//     status: "Hot",
//   },
//   {
//     name: "Amit Patel",
//     company: "Patel Manufacturing",
//     source: "Campaign",
//     score: 71,
//     status: "Warm",
//   },
//   {
//     name: "Neha Desai",
//     company: "Desai Solutions",
//     source: "Website",
//     score: 58,
//     status: "Warm",
//   },
//   {
//     name: "Karan Joshi",
//     company: "Joshi Traders",
//     source: "WhatsApp",
//     score: 36,
//     status: "Cold",
//   },
// ];

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
  const [userName, setUserName] = useState("Admin");
  const [leads, setLeads] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [followUps, setFollowUps] = useState<any[]>([]);

    const stats = [
    {
      title: "Total Leads",
      value: leads.length.toLocaleString(),
      change: "+12.5%",
      positive: true,
      icon: Users,
    },
    {
      title: "Hot Leads",
      value: leads.filter((lead) => lead.temperature === "HOT").length.toLocaleString(),
      change: "+8.2%",
      positive: true,
      icon: Flame,
    },
    {
      title: "Follow-ups",
      value: followUps.length.toLocaleString(),
      change: "-4.1%",
      positive: false,
      icon: Clock3,
    },
    {
      title: "Quotations",
      value: quotations.length.toLocaleString(),
      change: "+15.3%",
      positive: true,
      icon: FileText,
    },
  ];

  // IMPORTANT STATES FOR THREE-DOT MENU

  // IMPORTANT STATES FOR THREE-DOT MENU
  const [openLeadMenu, setOpenLeadMenu] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("tivra_theme");

    if (savedTheme === "light") {
      setDark(false);
    } else {
      setDark(true);
    }
  }, []);

                
                  useEffect(() => {
                  async function fetchLeads() {
                    try {
                      const tenantId = localStorage.getItem("tivra_tenant_id");

                      if (!tenantId) {
                        return;
                      }

                      const response = await fetch(
                        `http://localhost:5000/api/leads?tenantId=${tenantId}`
                      );

                      const data = await response.json();

                      if (response.ok && data.success) {
                        setLeads(data.leads || []);
                      }
                    } catch (error) {
                      console.error("Failed to fetch leads:", error);
                    }
                  }

                  fetchLeads();
                }, []);

            useEffect(() => {
                async function fetchQuotations() {
                  try {
                    const tenantId = localStorage.getItem("tivra_tenant_id");

                    if (!tenantId) {
                      return;
                    }

                    const response = await fetch(
                      `http://localhost:5000/api/quotations?tenantId=${tenantId}`
                    );

                    const data = await response.json();

                    if (response.ok && data.success) {
                      setQuotations(data.quotations || []);
                    }
                  } catch (error) {
                    console.error("Failed to fetch quotations:", error);
                  }
                }

                fetchQuotations();
              }, []);

                    useEffect(() => {
                      async function fetchFollowUps() {
                        try {
                          const tenantId = localStorage.getItem("tivra_tenant_id");
                          if (!tenantId) return;

                          const response = await fetch(
                            `http://localhost:5000/api/follow-ups?tenantId=${tenantId}`
                          );

                          const data = await response.json();

                          if (response.ok && data.success) {
                            setFollowUps(data.followUps || []);
                          }
                        } catch (error) {
                          console.error("Failed to fetch follow-ups:", error);
                        }
                      }

                      fetchFollowUps();
                    }, []);

  // Toast helper
  const showToast = (message: string) => {
    setToastMessage(message);

    window.setTimeout(() => {
      setToastMessage("");
    }, 2200);
  };

  const card = dark
    ? "border-white/10 bg-[#111a2e]"
    : "border-slate-200 bg-white";

  const text = dark ? "text-white" : "text-slate-950";
  const muted = dark ? "text-slate-400" : "text-slate-500";
  const border = dark ? "border-white/10" : "border-slate-200";

  return (
    <div
      className={`min-h-screen ${text}`}
      onClick={() => {
        if (openLeadMenu) {
          setOpenLeadMenu(null);
        }
      }}
    >
      <div className="w-full p-4 md:p-6 lg:p-8">
        {/* PAGE HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className={`mb-1 text-sm ${muted}`}>Overview</p>

            <h1 className="text-3xl font-bold tracking-tight">
                Welcome, {userName}
            </h1>
          </div>

          <div className="flex gap-3">
            <Link
              href="/dashboard/leads"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              <Plus size={18} />
              Add Lead
            </Link>

            <Link
              href="/dashboard/quotations"
              onClick={(e) => e.stopPropagation()}
              className={`hidden items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:border-orange-500 hover:text-orange-500 sm:flex ${border}`}
            >
              <FileText size={18} />
              Create Quotation
            </Link>
          </div>
        </div>

        {/* STATS */}
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
                      stat.positive ? "text-emerald-500" : "text-red-500"
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

                <p className="mt-1 text-3xl font-bold">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* PIPELINE + AI */}
        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          {/* PIPELINE */}
          <div
            className={`rounded-2xl border p-6 xl:col-span-2 ${card}`}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Sales Pipeline</h2>

                <p className={`text-sm ${muted}`}>
                  Current leads by sales stage
                </p>
              </div>

              <Link
                href="/dashboard/pipeline"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-sm font-semibold text-orange-500"
              >
                View CRM
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="space-y-5">
                            {[
                {
                  name: "New",
                  value: leads.filter((lead) => lead.stage === "NEW").length,
                },
                {
                  name: "Contacted",
                  value: leads.filter((lead) => lead.stage === "CONTACTED").length,
                },
                {
                  name: "Qualified",
                  value: leads.filter((lead) => lead.stage === "QUALIFIED").length,
                },
                {
                  name: "Demo / Meeting",
                  value: leads.filter((lead) => lead.stage === "DEMO").length,
                },
                {
                  name: "Quotation",
                  value: leads.filter((lead) => lead.stage === "QUOTATION").length,
                },
                {
                  name: "Negotiation",
                  value: leads.filter((lead) => lead.stage === "NEGOTIATION").length,
                },
              ].map((item) => {
                const totalLeads = leads.length;
                const percentage =
                  totalLeads > 0
                    ? Math.round((item.value / totalLeads) * 100)
                    : 0;

                return (
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
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI INSIGHT */}
          <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-white/20 p-3">
                <Flame size={22} />
              </div>

              <div>
                <h2 className="font-bold">AI Sales Insight</h2>

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
              onClick={(e) => e.stopPropagation()}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-orange-600 transition hover:bg-slate-100"
            >
              View Hot Leads
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>

        {/* RECENT LEADS + ACTIVITY */}
        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          {/* RECENT LEADS */}
          <div
            className={`overflow-visible rounded-2xl border xl:col-span-2 ${card}`}
          >
            <div
              className={`flex items-center justify-between border-b p-6 ${border}`}
            >
              <div>
                <h2 className="text-lg font-bold">Recent Leads</h2>

                <p className={`text-sm ${muted}`}>
                  Latest leads captured by TIVRA
                </p>
              </div>

              <Link
                href="/dashboard/leads"
                onClick={(e) => e.stopPropagation()}
                className="text-sm font-semibold text-orange-500"
              >
                View all
              </Link>
            </div>

            <div className="overflow-x-auto overflow-y-visible">
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

                    <th className="px-6 py-4 text-right">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {leads.slice(0, 5).map((lead) => (
                    <tr
                      key={lead.id}
                      className={`border-b last:border-0 ${border}`}
                    >
                      {/* LEAD */}
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

                      {/* SOURCE */}
                      <td className={`px-6 py-4 text-sm ${muted}`}>
                        {lead.source}
                      </td>

                      {/* SCORE */}
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

                      {/* STATUS */}
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
                          {lead.stage}
                        </span>
                      </td>

                      {/* ACTION MENU */}
                      <td className="relative px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();

                            setOpenLeadMenu((current) =>
                              current === lead.name
                                ? null
                                : lead.name
                            );
                          }}
                          className={`inline-flex items-center justify-center rounded-lg p-2 transition hover:bg-orange-500/10 hover:text-orange-500 ${muted}`}
                          title={`Actions for ${lead.name}`}
                        >
                          <MoreHorizontal size={19} />
                        </button>

                        {openLeadMenu === lead.name && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className={`absolute right-4 top-[52px] z-[9999] w-52 rounded-xl border p-1.5 text-left shadow-2xl ${
                              dark
                                ? "border-white/10 bg-[#182238] text-white"
                                : "border-slate-200 bg-white text-slate-900"
                            }`}
                          >
                            {/* VIEW LEAD */}
                            <button
                              type="button"
                              onClick={() => {
                                  setOpenLeadMenu(null);
                                  setSelectedLead(lead);
                                }}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition hover:bg-orange-500/10 hover:text-orange-500"
                            >
                              <Eye size={15} />
                              View Lead
                            </button>

                            {/* EDIT LEAD */}

                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenLeadMenu(null);
                                    window.location.href = `/dashboard/leads?edit=${encodeURIComponent(lead.id)}`;
                                  }}
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition hover:bg-orange-500/10 hover:text-orange-500"
                                >
                                  <Pencil size={15} />
                                  Edit Lead
                                </button>


                            {/* WHATSAPP */}
                            <button
                              type="button"
                              onClick={() => {
                                setOpenLeadMenu(null);
                                showToast(
                                  `Starting WhatsApp chat with ${lead.name}`
                                );
                              }}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition hover:bg-orange-500/10 hover:text-orange-500"
                            >
                              <MessageCircle size={15} />
                              WhatsApp
                            </button>

                            {/* CREATE QUOTE */}
                            <button
                              type="button"
                              onClick={() => {
                                setOpenLeadMenu(null);
                                showToast(
                                  `Creating quotation for ${lead.name}`
                                );
                              }}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition hover:bg-orange-500/10 hover:text-orange-500"
                            >
                              <FileText size={15} />
                              Create Quote
                            </button>

                            <div
                              className={`my-1 border-t ${
                                dark
                                  ? "border-white/10"
                                  : "border-slate-100"
                              }`}
                            />

                            {/* MARK CONTACTED */}
                            <button
                              type="button"
                              onClick={() => {
                                setOpenLeadMenu(null);
                                showToast(
                                  `${lead.name} marked as contacted`
                                );
                              }}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-green-500 transition hover:bg-green-500/10"
                            >
                              <CheckCircle2 size={15} />
                              Mark Contacted
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div className={`rounded-2xl border ${card}`}>
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
                onClick={(e) => e.stopPropagation()}
                className={`mt-7 flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition hover:border-orange-500 hover:text-orange-500 ${border}`}
              >
                View Analytics
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
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

      {/* LEAD DETAILS MODAL */}
              {selectedLead && (
                <div
                  className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                  onClick={() => setSelectedLead(null)}
                >
                  <div
                    className={`w-full max-w-2xl rounded-2xl border p-6 shadow-2xl ${
                      dark
                        ? "border-white/10 bg-[#111a2e] text-white"
                        : "border-slate-200 bg-white text-slate-900"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* HEADER */}
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold">
                          Lead Details
                        </h2>

                        <p className={`mt-1 text-sm ${muted}`}>
                          Complete information about this lead
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedLead(null)}
                        className={`rounded-lg p-2 transition hover:bg-orange-500/10 hover:text-orange-500 ${muted}`}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* DETAILS */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className={`text-xs ${muted}`}>Lead Name</p>
                        <p className="mt-1 font-semibold">
                          {selectedLead.name || "-"}
                        </p>
                      </div>

                      <div>
                        <p className={`text-xs ${muted}`}>Company</p>
                        <p className="mt-1 font-semibold">
                          {selectedLead.company || "-"}
                        </p>
                      </div>

                      <div>
                        <p className={`text-xs ${muted}`}>Phone</p>
                        <p className="mt-1 font-semibold">
                          {selectedLead.phone || "-"}
                        </p>
                      </div>

                      <div>
                        <p className={`text-xs ${muted}`}>Email</p>
                        <p className="mt-1 font-semibold">
                          {selectedLead.email || "-"}
                        </p>
                      </div>

                      <div>
                        <p className={`text-xs ${muted}`}>Source</p>
                        <p className="mt-1 font-semibold">
                          {selectedLead.source || "-"}
                        </p>
                      </div>

                      <div>
                        <p className={`text-xs ${muted}`}>Status</p>
                        <p className="mt-1 font-semibold text-orange-500">
                          {selectedLead.stage || "-"}
                        </p>
                      </div>

                      <div>
                        <p className={`text-xs ${muted}`}>AI Score</p>
                        <p className="mt-1 font-semibold">
                          {selectedLead.score ?? 0}/100
                        </p>
                      </div>

                      <div>
                        <p className={`text-xs ${muted}`}>Priority</p>
                        <p className="mt-1 font-semibold">
                          {selectedLead.priority || "-"}
                        </p>
                      </div>

                      <div>
                        <p className={`text-xs ${muted}`}>Product</p>
                        <p className="mt-1 font-semibold">
                          {selectedLead.product || "-"}
                        </p>
                      </div>

                      <div>
                        <p className={`text-xs ${muted}`}>Budget</p>
                        <p className="mt-1 font-semibold">
                          {selectedLead.budget || "-"}
                        </p>
                      </div>

                      <div>
                        <p className={`text-xs ${muted}`}>Timeline</p>
                        <p className="mt-1 font-semibold">
                          {selectedLead.timeline || "-"}
                        </p>
                      </div>

                      <div>
                        <p className={`text-xs ${muted}`}>Location</p>
                        <p className="mt-1 font-semibold">
                          {selectedLead.location || "-"}
                        </p>
                      </div>
                    </div>

                    {/* REQUIREMENTS / NOTES */}
                    <div className="mt-5">
                      <p className={`text-xs ${muted}`}>
                        Requirements / Notes
                      </p>

                      <div
                        className={`mt-2 rounded-xl border p-4 text-sm leading-6 ${
                          dark
                            ? "border-white/10 bg-white/5 text-slate-300"
                            : "border-slate-200 bg-slate-50 text-slate-600"
                        }`}
                      >
                        {selectedLead.requirements ||
                          selectedLead.notes ||
                          "No additional requirements or notes."}
                      </div>
                    </div>

                    {/* CLOSE */}
                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setSelectedLead(null)}
                        className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

      {/* TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 z-[10000] flex -translate-x-1/2 items-center gap-3 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-2xl">
          <CheckCircle2
            size={17}
            className="text-green-400"
          />

          <span>{toastMessage}</span>

          <button
            type="button"
            onClick={() => setToastMessage("")}
            className="ml-2 rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

/* QUICK ACTION COMPONENT */

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