"use client";

import Link from "next/link";
import { useState } from "react";
import { usePersistentState } from "@/lib/persistence";
import {
  ArrowLeft,
  Bell,
  Bot,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Filter,
  Flame,
  MessageCircle,
  MoreHorizontal,
  Pause,
  Pencil,
  Plus,
  Search,
  Send,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

type FollowUpStatus = "Overdue" | "Due Today" | "Scheduled" | "Completed" | "Paused";
type Priority = "Hot" | "Warm" | "Cold";

type FollowUp = {
  id: number;
  lead: string;
  company: string;
  avatar: string;
  priority: Priority;
  score: number;
  stage: string;
  action: string;
  message: string;
  date: string;
  time: string;
  status: FollowUpStatus;
  owner: string;
  channel: "WhatsApp" | "Email" | "Call";
};

const initialFollowUps: FollowUp[] = [
  {
    id: 1,
    lead: "Rahul Shah",
    company: "Shah Industries",
    avatar: "RS",
    priority: "Hot",
    score: 92,
    stage: "Quotation",
    action: "Quotation follow-up",
    message: "Hello Rahul, have you had a chance to review the quotation?",
    date: "Today",
    time: "11:30 AM",
    status: "Overdue",
    owner: "Karan Patel",
    channel: "WhatsApp",
  },
  {
    id: 2,
    lead: "Amit Patel",
    company: "Patel Manufacturing",
    avatar: "AP",
    priority: "Hot",
    score: 88,
    stage: "Demo",
    action: "Demo reminder",
    message: "Hi Amit, just a reminder about your TIVRA AI demo.",
    date: "Today",
    time: "2:00 PM",
    status: "Due Today",
    owner: "Karan Patel",
    channel: "WhatsApp",
  },
  {
    id: 3,
    lead: "Priya Mehta",
    company: "Mehta Textiles",
    avatar: "PM",
    priority: "Warm",
    score: 71,
    stage: "Qualified",
    action: "Requirement follow-up",
    message: "Hi Priya, can I help with any additional product information?",
    date: "Today",
    time: "4:30 PM",
    status: "Scheduled",
    owner: "Neha Shah",
    channel: "WhatsApp",
  },
  {
    id: 4,
    lead: "Vikram Joshi",
    company: "Joshi Electronics",
    avatar: "VJ",
    priority: "Warm",
    score: 68,
    stage: "Contacted",
    action: "Product information",
    message: "Hello Vikram, sharing the product details we discussed.",
    date: "Tomorrow",
    time: "10:00 AM",
    status: "Scheduled",
    owner: "Neha Shah",
    channel: "Email",
  },
  {
    id: 5,
    lead: "Neha Desai",
    company: "Desai Enterprises",
    avatar: "ND",
    priority: "Cold",
    score: 39,
    stage: "New",
    action: "Re-engagement",
    message: "Hi Neha, are you still looking for a sales automation solution?",
    date: "Sep 20",
    time: "12:00 PM",
    status: "Scheduled",
    owner: "Karan Patel",
    channel: "WhatsApp",
  },
  {
    id: 6,
    lead: "Rohan Shah",
    company: "Shah Technologies",
    avatar: "RS",
    priority: "Hot",
    score: 84,
    stage: "Negotiation",
    action: "Negotiation follow-up",
    message: "Hello Rohan, would you like to discuss the proposal further?",
    date: "Sep 18",
    time: "9:30 AM",
    status: "Completed",
    owner: "Karan Patel",
    channel: "Call",
  },
];

const sequenceSteps = [
  {
    day: "Day 1",
    title: "Welcome Message",
    description: "Send an immediate welcome message after enquiry.",
  },
  {
    day: "Day 2",
    title: "Requirement Help",
    description: "Ask if the lead needs help with requirements.",
  },
  {
    day: "Day 4",
    title: "Product Information",
    description: "Share relevant product information.",
  },
  {
    day: "Day 6",
    title: "Demo Invitation",
    description: "Invite qualified leads for a product demo.",
  },
  {
    day: "Day 8",
    title: "Quotation Follow-up",
    description: "Follow up with leads who received a quotation.",
  },
];

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = usePersistentState<FollowUp[]>("tivra_followups", initialFollowUps);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | FollowUpStatus>("All");
  const [priorityFilter, setPriorityFilter] = useState<"All" | Priority>("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSequence, setShowSequence] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(null);
  const [aiMessage, setAiMessage] = useState("");
  const [showAiMessage, setShowAiMessage] = useState(false);

  const filteredFollowUps = followUps.filter((item) => {
    const matchesSearch =
      item.lead.toLowerCase().includes(search.toLowerCase()) ||
      item.company.toLowerCase().includes(search.toLowerCase()) ||
      item.action.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || item.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const overdue = followUps.filter((item) => item.status === "Overdue").length;
  const dueToday = followUps.filter((item) => item.status === "Due Today").length;
  const scheduled = followUps.filter((item) => item.status === "Scheduled").length;
  const completed = followUps.filter((item) => item.status === "Completed").length;

  const markCompleted = (id: number) => {
    setFollowUps((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Completed" } : item
      )
    );
  };

  const pauseFollowUp = (id: number) => {
    setFollowUps((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Paused" } : item
      )
    );
  };

  const generateAiMessage = (item: FollowUp) => {
    setSelectedFollowUp(item);

    const generated = `Hi ${item.lead}, I wanted to follow up regarding ${item.action.toLowerCase()}. Based on our previous conversation, I would be happy to help with any questions or next steps. Please let me know a convenient time to connect.`;

    setAiMessage(generated);
    setShowAiMessage(true);
  };

  const statusStyle = (status: FollowUpStatus) => {
    switch (status) {
      case "Overdue":
        return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
      case "Due Today":
        return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";
      case "Scheduled":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
      case "Completed":
        return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";
      default:
        return "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400";
    }
  };

  const priorityStyle = (priority: Priority) => {
    if (priority === "Hot") {
      return "text-orange-600 dark:text-orange-400";
    }

    if (priority === "Warm") {
      return "text-yellow-600 dark:text-yellow-400";
    }

    return "text-slate-500 dark:text-slate-400";
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-[#070c1b] dark:text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur dark:border-white/10 dark:bg-[#0b1222]/95">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-200 p-2 transition hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/5"
          >
            <ArrowLeft size={19} />
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Clock3 size={19} />
            </div>

            <div>
              <h1 className="text-lg font-bold">Smart Follow-up</h1>
              <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                Never miss an opportunity
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSequence(true)}
            className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium transition hover:bg-slate-100 sm:flex dark:border-white/10 dark:hover:bg-white/5"
          >
            <Sparkles size={16} />
            AI Sequence
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <Plus size={17} />
            <span className="hidden sm:inline">Add Follow-up</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] p-5 md:p-7">
        {/* INTRO */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">
            Follow-up Center
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage scheduled follow-ups, overdue leads and AI-powered sales
            messages.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-red-200 bg-white p-5 dark:border-red-500/20 dark:bg-[#111a2e]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Overdue
                </p>
                <p className="mt-2 text-2xl font-bold">{overdue}</p>
              </div>

              <div className="rounded-xl bg-red-100 p-3 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <Bell size={19} />
              </div>
            </div>

            <p className="mt-3 text-xs text-red-600 dark:text-red-400">
              Needs immediate attention
            </p>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-white p-5 dark:border-orange-500/20 dark:bg-[#111a2e]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Due Today
                </p>
                <p className="mt-2 text-2xl font-bold">{dueToday}</p>
              </div>

              <div className="rounded-xl bg-orange-100 p-3 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                <CalendarDays size={19} />
              </div>
            </div>

            <p className="mt-3 text-xs text-orange-600 dark:text-orange-400">
              Scheduled for today
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-white p-5 dark:border-blue-500/20 dark:bg-[#111a2e]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Scheduled
                </p>
                <p className="mt-2 text-2xl font-bold">{scheduled}</p>
              </div>

              <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <Clock3 size={19} />
              </div>
            </div>

            <p className="mt-3 text-xs text-blue-600 dark:text-blue-400">
              Upcoming follow-ups
            </p>
          </div>

          <div className="rounded-2xl border border-green-200 bg-white p-5 dark:border-green-500/20 dark:bg-[#111a2e]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Completed
                </p>
                <p className="mt-2 text-2xl font-bold">{completed}</p>
              </div>

              <div className="rounded-xl bg-green-100 p-3 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                <CheckCircle2 size={19} />
              </div>
            </div>

            <p className="mt-3 text-xs text-green-600 dark:text-green-400">
              Follow-ups completed
            </p>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#111a2e]">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative max-w-md flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search leads, companies or follow-ups..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-orange-400 dark:border-white/10 dark:bg-white/5"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as "All" | FollowUpStatus)
                  }
                  className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-xs font-medium outline-none dark:border-white/10 dark:bg-[#111a2e]"
                >
                  <option value="All">All Status</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Due Today">Due Today</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Paused">Paused</option>
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              <div className="relative">
                <select
                  value={priorityFilter}
                  onChange={(e) =>
                    setPriorityFilter(e.target.value as "All" | Priority)
                  }
                  className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-xs font-medium outline-none dark:border-white/10 dark:bg-[#111a2e]"
                >
                  <option value="All">All Priority</option>
                  <option value="Hot">Hot</option>
                  <option value="Warm">Warm</option>
                  <option value="Cold">Cold</option>
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium transition hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/5">
                <Filter size={14} />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* FOLLOW-UP TABLE */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111a2e]">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
            <div>
              <h3 className="font-semibold">Follow-up Tasks</h3>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {filteredFollowUps.length} follow-ups found
              </p>
            </div>

            <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.02]">
                <tr>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Lead
                  </th>

                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Follow-up
                  </th>

                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Schedule
                  </th>

                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Channel
                  </th>

                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Owner
                  </th>

                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredFollowUps.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700 dark:bg-orange-500/10 dark:text-orange-400">
                          {item.avatar}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold">
                              {item.lead}
                            </p>

                            <Flame
                              size={14}
                              className={priorityStyle(item.priority)}
                            />
                          </div>

                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {item.company}
                          </p>

                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-[10px] font-bold text-orange-500">
                              {item.score}
                            </span>

                            <span className="text-[10px] text-slate-400">
                              •
                            </span>

                            <span className="text-[10px] text-slate-400">
                              {item.stage}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="max-w-[270px] px-5 py-4">
                      <p className="text-sm font-medium">{item.action}</p>

                      <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                        {item.message}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium">{item.date}</p>

                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <Clock3 size={12} />
                        {item.time}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-xs font-medium">
                        {item.channel === "WhatsApp" ? (
                          <MessageCircle size={15} className="text-green-500" />
                        ) : item.channel === "Email" ? (
                          <Send size={15} className="text-blue-500" />
                        ) : (
                          <PhoneIcon />
                        )}

                        {item.channel}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[9px] font-bold dark:bg-white/10">
                          {item.owner
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </div>

                        <span className="text-xs">{item.owner}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyle(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => generateAiMessage(item)}
                          title="Generate AI message"
                          className="rounded-lg p-2 text-orange-500 transition hover:bg-orange-50 dark:hover:bg-orange-500/10"
                        >
                          <Bot size={16} />
                        </button>

                        {item.status !== "Completed" && (
                          <button
                            onClick={() => markCompleted(item.id)}
                            title="Mark completed"
                            className="rounded-lg p-2 text-green-600 transition hover:bg-green-50 dark:hover:bg-green-500/10"
                          >
                            <Check size={16} />
                          </button>
                        )}

                        {item.status !== "Paused" &&
                          item.status !== "Completed" && (
                            <button
                              onClick={() => pauseFollowUp(item.id)}
                              title="Pause follow-up"
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-white/5"
                            >
                              <Pause size={16} />
                            </button>
                          )}

                        <button
                          title="Edit"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-white/5"
                        >
                          <Pencil size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredFollowUps.length === 0 && (
              <div className="p-12 text-center">
                <Clock3 className="mx-auto text-slate-300" size={32} />
                <p className="mt-3 text-sm font-semibold">
                  No follow-ups found
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Try changing your search or filters.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* AI AUTOMATION BANNER */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-white p-6 dark:border-orange-500/20 dark:from-orange-500/10 dark:to-[#111a2e]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white">
                <Bot size={24} />
              </div>

              <div>
                <h3 className="font-bold">AI-Powered Follow-up</h3>

                <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                  TIVRA can personalize follow-up messages using lead
                  requirements, previous conversations, stage and buying
                  signals.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium shadow-sm dark:bg-white/5">
                    AI Personalization
                  </span>

                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium shadow-sm dark:bg-white/5">
                    Pause on Reply
                  </span>

                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium shadow-sm dark:bg-white/5">
                    Human Handover
                  </span>

                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium shadow-sm dark:bg-white/5">
                    Audit Timeline
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSequence(true)}
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              <Sparkles size={17} />
              View Sequence
            </button>
          </div>
        </div>
      </div>

      {/* ADD FOLLOW-UP MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111a2e]">
            <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-white/10">
              <div>
                <h3 className="font-bold">Add Follow-up</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Create a new sales follow-up task.
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold">
                  Lead
                </span>

                <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-white/10 dark:bg-[#0b1222]">
                  <option>Rahul Shah</option>
                  <option>Amit Patel</option>
                  <option>Priya Mehta</option>
                  <option>Vikram Joshi</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold">
                  Follow-up Type
                </span>

                <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-white/10 dark:bg-[#0b1222]">
                  <option>Quotation Follow-up</option>
                  <option>Demo Reminder</option>
                  <option>Requirement Follow-up</option>
                  <option>Re-engagement</option>
                  <option>Product Information</option>
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold">
                    Date
                  </span>

                  <input
                    type="date"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-white/10 dark:bg-[#0b1222]"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold">
                    Time
                  </span>

                  <input
                    type="time"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-white/10 dark:bg-[#0b1222]"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold">
                  Channel
                </span>

                <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-white/10 dark:bg-[#0b1222]">
                  <option>WhatsApp</option>
                  <option>Email</option>
                  <option>Call</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold">
                  Message
                </span>

                <textarea
                  rows={3}
                  placeholder="Write your follow-up message..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-white/10 dark:bg-[#0b1222]"
                />
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 p-5 dark:border-white/10">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium dark:border-white/10"
              >
                Cancel
              </button>

              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Create Follow-up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI SEQUENCE MODAL */}
      {showSequence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111a2e]">
            <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                  <Sparkles size={20} />
                </div>

                <div>
                  <h3 className="font-bold">AI Follow-up Sequence</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Example sales automation sequence
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowSequence(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="mb-5 rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-500/20 dark:bg-orange-500/10">
                <div className="flex gap-3">
                  <Bot className="mt-0.5 shrink-0 text-orange-500" size={18} />

                  <div>
                    <p className="text-sm font-semibold">
                      TIVRA AI Automation
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                      The sequence automatically pauses when the customer
                      replies, opts out, becomes Won/Lost, or is handed over
                      to a human salesperson.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {sequenceSteps.map((step, index) => (
                  <div key={step.day} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                        {index + 1}
                      </div>

                      {index < sequenceSteps.length - 1 && (
                        <div className="mt-2 h-full min-h-8 w-px bg-slate-200 dark:bg-white/10" />
                      )}
                    </div>

                    <div className="flex-1 rounded-xl border border-slate-200 p-4 dark:border-white/10">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
                            {step.day}
                          </span>

                          <h4 className="mt-1 text-sm font-semibold">
                            {step.title}
                          </h4>
                        </div>

                        <CheckCircle2
                          size={18}
                          className="text-green-500"
                        />
                      </div>

                      <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 p-5 dark:border-white/10">
              <button
                onClick={() => setShowSequence(false)}
                className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI MESSAGE MODAL */}
      {showAiMessage && selectedFollowUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111a2e]">
            <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                  <Bot size={20} />
                </div>

                <div>
                  <h3 className="font-bold">AI Follow-up Message</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Personalized for {selectedFollowUp.lead}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAiMessage(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-medium text-orange-600 dark:text-orange-400">
                <Sparkles size={14} />
                AI-generated suggestion
              </div>

              <textarea
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                rows={6}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 outline-none focus:border-orange-400 dark:border-white/10 dark:bg-white/5"
              />

              <p className="mt-2 text-[10px] text-slate-400">
                Review and approve AI-generated messages before sending in the
                production workflow.
              </p>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 p-5 dark:border-white/10">
              <button
                onClick={() => setShowAiMessage(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium dark:border-white/10"
              >
                Cancel
              </button>

              <button
                onClick={() => setShowAiMessage(false)}
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
              >
                <Send size={15} />
                Use Message
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function PhoneIcon() {
  return <UserRound size={15} className="text-slate-500" />;
}