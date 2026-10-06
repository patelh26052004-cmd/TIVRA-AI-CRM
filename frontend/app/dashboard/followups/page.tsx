"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
  Mail,
  MessageCircle,
  MoreHorizontal,
  Pause,
  Pencil,
  Phone,
  Plus,
  Search,
  Send,
  Sparkles,
  Trash2,
  UserRound,
  X,
  Eye,
  RotateCcw,
} from "lucide-react";

type FollowUpStatus =
  | "Overdue"
  | "Due Today"
  | "Scheduled"
  | "Completed"
  | "Paused";

type Priority = "Hot" | "Warm" | "Cold";

type Channel = "WhatsApp" | "Email" | "Call";

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
  channel: Channel;
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
    message:
      "Hello Rahul, have you had a chance to review the quotation?",
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
    message:
      "Hi Amit, just a reminder about your TIVRA AI demo.",
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
    message:
      "Hi Priya, can I help with any additional product information?",
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
    message:
      "Hello Vikram, sharing the product details we discussed.",
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
    message:
      "Hi Neha, are you still looking for a sales automation solution?",
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
    message:
      "Hello Rohan, would you like to discuss the proposal further?",
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
    description:
      "Send an immediate welcome message after enquiry.",
  },
  {
    day: "Day 2",
    title: "Requirement Help",
    description:
      "Ask if the lead needs help with requirements.",
  },
  {
    day: "Day 4",
    title: "Product Information",
    description:
      "Share relevant product information.",
  },
  {
    day: "Day 6",
    title: "Demo Invitation",
    description:
      "Invite qualified leads for a product demo.",
  },
  {
    day: "Day 8",
    title: "Quotation Follow-up",
    description:
      "Follow up with leads who received a quotation.",
  },
];

const owners = ["Karan Patel", "Neha Shah"];

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = usePersistentState<FollowUp[]>(
    "tivra_followups",
    initialFollowUps
  );

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "All" | FollowUpStatus
  >("All");

  const [priorityFilter, setPriorityFilter] = useState<
    "All" | Priority
  >("All");

  const [ownerFilter, setOwnerFilter] = useState("All");

  const [channelFilter, setChannelFilter] = useState<
    "All" | Channel
  >("All");

  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSequence, setShowSequence] = useState(false);

  const [selectedFollowUp, setSelectedFollowUp] =
    useState<FollowUp | null>(null);

  const [showViewModal, setShowViewModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [showAiMessage, setShowAiMessage] = useState(false);

  const [aiMessage, setAiMessage] = useState("");

  const [openMenuId, setOpenMenuId] = useState<number | null>(
    null
  );

  const [form, setForm] = useState({
    lead: "Rahul Shah",
    action: "Quotation Follow-up",
    date: "",
    time: "",
    channel: "WhatsApp" as Channel,
    message: "",
    owner: "Karan Patel",
  });

  const [editForm, setEditForm] = useState({
    action: "",
    date: "",
    time: "",
    channel: "WhatsApp" as Channel,
    message: "",
    owner: "",
    status: "Scheduled" as FollowUpStatus,
  });

  const filteredFollowUps = useMemo(() => {
    return followUps.filter((item) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        item.lead.toLowerCase().includes(query) ||
        item.company.toLowerCase().includes(query) ||
        item.action.toLowerCase().includes(query) ||
        item.message.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        item.priority === priorityFilter;

      const matchesOwner =
        ownerFilter === "All" ||
        item.owner === ownerFilter;

      const matchesChannel =
        channelFilter === "All" ||
        item.channel === channelFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesOwner &&
        matchesChannel
      );
    });
  }, [
    followUps,
    search,
    statusFilter,
    priorityFilter,
    ownerFilter,
    channelFilter,
  ]);

  const overdue = followUps.filter(
    (item) => item.status === "Overdue"
  ).length;

  const dueToday = followUps.filter(
    (item) => item.status === "Due Today"
  ).length;

  const scheduled = followUps.filter(
    (item) => item.status === "Scheduled"
  ).length;

  const completed = followUps.filter(
    (item) => item.status === "Completed"
  ).length;

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setOwnerFilter("All");
    setChannelFilter("All");
  };

  const markCompleted = (id: number) => {
    setFollowUps((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "Completed" }
          : item
      )
    );

    setOpenMenuId(null);
  };

  const pauseFollowUp = (id: number) => {
    setFollowUps((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "Paused" }
          : item
      )
    );

    setOpenMenuId(null);
  };

  const deleteFollowUp = (id: number) => {
    const item = followUps.find((follow) => follow.id === id);

    if (!item) return;

    const confirmed = window.confirm(
      `Delete follow-up for ${item.lead}?`
    );

    if (!confirmed) return;

    setFollowUps((prev) =>
      prev.filter((follow) => follow.id !== id)
    );

    setOpenMenuId(null);
  };

  const viewFollowUp = (item: FollowUp) => {
    setSelectedFollowUp(item);
    setShowViewModal(true);
    setOpenMenuId(null);
  };

  const openEdit = (item: FollowUp) => {
    setSelectedFollowUp(item);

    setEditForm({
      action: item.action,
      date: item.date,
      time: item.time,
      channel: item.channel,
      message: item.message,
      owner: item.owner,
      status: item.status,
    });

    setShowEditModal(true);
    setOpenMenuId(null);
  };

  const saveEdit = () => {
    if (!selectedFollowUp) return;

    setFollowUps((prev) =>
      prev.map((item) =>
        item.id === selectedFollowUp.id
          ? {
              ...item,
              action: editForm.action,
              date: editForm.date || item.date,
              time: editForm.time || item.time,
              channel: editForm.channel,
              message:
                editForm.message || item.message,
              owner: editForm.owner,
              status: editForm.status,
            }
          : item
      )
    );

    setShowEditModal(false);
    setSelectedFollowUp(null);
  };

  const generateAiMessage = (item: FollowUp) => {
    setSelectedFollowUp(item);

    const generated = `Hi ${
      item.lead
    }, I wanted to follow up regarding ${item.action.toLowerCase()}. Based on our previous conversation, I would be happy to help with any questions or next steps. Please let me know a convenient time to connect.`;

    setAiMessage(generated);
    setShowAiMessage(true);
    setOpenMenuId(null);
  };

  const addFollowUp = () => {
    if (!form.message.trim()) {
      alert("Please enter a follow-up message.");
      return;
    }

    const leadData: Record<
      string,
      {
        company: string;
        avatar: string;
        priority: Priority;
        score: number;
        stage: string;
      }
    > = {
      "Rahul Shah": {
        company: "Shah Industries",
        avatar: "RS",
        priority: "Hot",
        score: 92,
        stage: "Quotation",
      },
      "Amit Patel": {
        company: "Patel Manufacturing",
        avatar: "AP",
        priority: "Hot",
        score: 88,
        stage: "Demo",
      },
      "Priya Mehta": {
        company: "Mehta Textiles",
        avatar: "PM",
        priority: "Warm",
        score: 71,
        stage: "Qualified",
      },
      "Vikram Joshi": {
        company: "Joshi Electronics",
        avatar: "VJ",
        priority: "Warm",
        score: 68,
        stage: "Contacted",
      },
    };

    const selectedLead =
      leadData[form.lead] || leadData["Rahul Shah"];

    const newFollowUp: FollowUp = {
      id: Date.now(),
      lead: form.lead,
      company: selectedLead.company,
      avatar: selectedLead.avatar,
      priority: selectedLead.priority,
      score: selectedLead.score,
      stage: selectedLead.stage,
      action: form.action,
      message: form.message,
      date: form.date || "Tomorrow",
      time: form.time || "10:00 AM",
      status: "Scheduled",
      owner: form.owner,
      channel: form.channel,
    };

    setFollowUps((prev) => [newFollowUp, ...prev]);

    setForm({
      lead: "Rahul Shah",
      action: "Quotation Follow-up",
      date: "",
      time: "",
      channel: "WhatsApp",
      message: "",
      owner: "Karan Patel",
    });

    setShowAddModal(false);
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

  const channelIcon = (channel: Channel) => {
    if (channel === "WhatsApp") {
      return (
        <MessageCircle
          size={15}
          className="text-green-500"
        />
      );
    }

    if (channel === "Email") {
      return (
        <Mail
          size={15}
          className="text-blue-500"
        />
      );
    }

    return (
      <Phone
        size={15}
        className="text-slate-500"
      />
    );
  };

  return (
    <main
      onClick={() => setOpenMenuId(null)}
      className="min-h-screen bg-slate-50 text-slate-950 dark:bg-[#070c1b] dark:text-white"
    >
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
              <h1 className="text-lg font-bold">
                Smart Follow-up
              </h1>

              <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                Never miss an opportunity
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSequence(true);
            }}
            className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium transition hover:bg-slate-100 sm:flex dark:border-white/10 dark:hover:bg-white/5"
          >
            <Sparkles size={16} />
            AI Sequence
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <Plus size={17} />

            <span className="hidden sm:inline">
              Add Follow-up
            </span>
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
            Manage scheduled follow-ups, overdue leads and
            AI-powered sales messages.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* OVERDUE */}
          <div className="rounded-2xl border border-red-200 bg-white p-5 dark:border-red-500/20 dark:bg-[#111a2e]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Overdue
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {overdue}
                </p>
              </div>

              <div className="rounded-xl bg-red-100 p-3 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <Bell size={19} />
              </div>
            </div>

            <p className="mt-3 text-xs text-red-600 dark:text-red-400">
              Needs immediate attention
            </p>
          </div>

          {/* DUE TODAY */}
          <div className="rounded-2xl border border-orange-200 bg-white p-5 dark:border-orange-500/20 dark:bg-[#111a2e]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Due Today
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {dueToday}
                </p>
              </div>

              <div className="rounded-xl bg-orange-100 p-3 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                <CalendarDays size={19} />
              </div>
            </div>

            <p className="mt-3 text-xs text-orange-600 dark:text-orange-400">
              Scheduled for today
            </p>
          </div>

          {/* SCHEDULED */}
          <div className="rounded-2xl border border-blue-200 bg-white p-5 dark:border-blue-500/20 dark:bg-[#111a2e]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Scheduled
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {scheduled}
                </p>
              </div>

              <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <Clock3 size={19} />
              </div>
            </div>

            <p className="mt-3 text-xs text-blue-600 dark:text-blue-400">
              Upcoming follow-ups
            </p>
          </div>

          {/* COMPLETED */}
          <div className="rounded-2xl border border-green-200 bg-white p-5 dark:border-green-500/20 dark:bg-[#111a2e]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Completed
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {completed}
                </p>
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
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              {/* SEARCH */}
              <div className="relative max-w-md flex-1">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search leads, companies or follow-ups..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-orange-400 dark:border-white/10 dark:bg-white/5"
                />
              </div>

              {/* FILTERS */}
              <div className="flex flex-wrap gap-2">
                {/* STATUS */}
                <FilterSelect
                  value={statusFilter}
                  onChange={(value) =>
                    setStatusFilter(
                      value as "All" | FollowUpStatus
                    )
                  }
                  options={[
                    ["All", "All Statuses"],
                    ["Overdue", "Overdue"],
                    ["Due Today", "Due Today"],
                    ["Scheduled", "Scheduled"],
                    ["Completed", "Completed"],
                    ["Paused", "Paused"],
                  ]}
                />

                {/* PRIORITY */}
                <FilterSelect
                  value={priorityFilter}
                  onChange={(value) =>
                    setPriorityFilter(
                      value as "All" | Priority
                    )
                  }
                  options={[
                    ["All", "All Priorities"],
                    ["Hot", "Hot"],
                    ["Warm", "Warm"],
                    ["Cold", "Cold"],
                  ]}
                />

                {/* MORE FILTERS */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMoreFilters(
                      !showMoreFilters
                    );
                  }}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition ${
                    showMoreFilters
                      ? "border-orange-400 bg-orange-50 text-orange-600 dark:border-orange-500/50 dark:bg-orange-500/10 dark:text-orange-400"
                      : "border-slate-200 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/5"
                  }`}
                >
                  <Filter size={14} />
                  More Filters
                  <ChevronDown
                    size={14}
                    className={`transition ${
                      showMoreFilters
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {/* RESET */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetFilters();
                  }}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                >
                  <RotateCcw size={14} />
                  Reset
                </button>
              </div>
            </div>

            {/* MORE FILTERS */}
            {showMoreFilters && (
              <div className="grid grid-cols-1 gap-3 border-t border-slate-200 pt-4 dark:border-white/10 md:grid-cols-2">
                {/* OWNER */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Owner
                  </label>

                  <FilterSelect
                    fullWidth
                    value={ownerFilter}
                    onChange={setOwnerFilter}
                    options={[
                      ["All", "All Owners"],
                      ...owners.map((owner) => [
                        owner,
                        owner,
                      ] as [string, string]),
                    ]}
                  />
                </div>

                {/* CHANNEL */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Channel
                  </label>

                  <FilterSelect
                    fullWidth
                    value={channelFilter}
                    onChange={(value) =>
                      setChannelFilter(
                        value as "All" | Channel
                      )
                    }
                    options={[
                      ["All", "All Channels"],
                      ["WhatsApp", "WhatsApp"],
                      ["Email", "Email"],
                      ["Call", "Call"],
                    ]}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RESULT COUNT */}
        <div className="mt-4 px-1">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {filteredFollowUps.length} follow-ups found
          </p>
        </div>

        {/* FOLLOW-UP TABLE */}
        <div className="mt-2 overflow-visible rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111a2e]">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
            <div>
              <h3 className="font-semibold">
                Follow-up Tasks
              </h3>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {filteredFollowUps.length} follow-ups found
              </p>
            </div>

            {/* THREE DOT */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(
                    openMenuId === -1 ? null : -1
                  );
                }}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/5 dark:hover:text-white"
                title="Task options"
              >
                <MoreHorizontal size={19} />
              </button>

              {openMenuId === -1 && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-11 z-50 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-[#0f172a]"
                >
                  <button
                    onClick={() => {
                      setStatusFilter("All");
                      setPriorityFilter("All");
                      setOwnerFilter("All");
                      setChannelFilter("All");
                      setSearch("");
                      setOpenMenuId(null);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    <RotateCcw size={14} />
                    Reset Filters
                  </button>

                  <button
                    onClick={() => {
                      setShowAddModal(true);
                      setOpenMenuId(null);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    <Plus size={14} />
                    Add Follow-up
                  </button>

                  <button
                    onClick={() => {
                      setShowSequence(true);
                      setOpenMenuId(null);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    <Sparkles size={14} />
                    AI Sequence
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
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
                    {/* LEAD */}
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
                              className={priorityStyle(
                                item.priority
                              )}
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

                    {/* FOLLOW-UP */}
                    <td className="max-w-[270px] px-5 py-4">
                      <p className="text-sm font-medium">
                        {item.action}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                        {item.message}
                      </p>
                    </td>

                    {/* SCHEDULE */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium">
                        {item.date}
                      </p>

                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <Clock3 size={12} />
                        {item.time}
                      </div>
                    </td>

                    {/* CHANNEL */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-xs font-medium">
                        {channelIcon(item.channel)}
                        {item.channel}
                      </div>
                    </td>

                    {/* OWNER */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[9px] font-bold dark:bg-white/10">
                          {getInitials(item.owner)}
                        </div>

                        <span className="text-xs">
                          {item.owner}
                        </span>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyle(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4">
                      <div className="relative flex justify-end gap-1">
                        <button
                          onClick={() =>
                            generateAiMessage(item)
                          }
                          title="Generate AI message"
                          className="rounded-lg p-2 text-orange-500 transition hover:bg-orange-50 dark:hover:bg-orange-500/10"
                        >
                          <Bot size={16} />
                        </button>

                        {item.status !== "Completed" && (
                          <button
                            onClick={() =>
                              markCompleted(item.id)
                            }
                            title="Mark completed"
                            className="rounded-lg p-2 text-green-600 transition hover:bg-green-50 dark:hover:bg-green-500/10"
                          >
                            <Check size={16} />
                          </button>
                        )}

                        <button
                          onClick={() => openEdit(item)}
                          title="Edit"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-white/5"
                        >
                          <Pencil size={16} />
                        </button>

                        {/* ROW THREE DOT */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            setOpenMenuId(
                              openMenuId === item.id
                                ? null
                                : item.id
                            );
                          }}
                          title="More actions"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-white/5"
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {openMenuId === item.id && (
                          <div
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                            className="absolute right-0 top-10 z-50 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-[#0f172a]"
                          >
                            <button
                              onClick={() =>
                                viewFollowUp(item)
                              }
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs hover:bg-slate-100 dark:hover:bg-white/5"
                            >
                              <Eye size={14} />
                              View Details
                            </button>

                            <button
                              onClick={() =>
                                openEdit(item)
                              }
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs hover:bg-slate-100 dark:hover:bg-white/5"
                            >
                              <Pencil size={14} />
                              Edit Follow-up
                            </button>

                            {item.status !== "Completed" && (
                              <button
                                onClick={() =>
                                  markCompleted(
                                    item.id
                                  )
                                }
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-500/10"
                              >
                                <Check size={14} />
                                Mark Completed
                              </button>
                            )}

                            {item.status !== "Paused" &&
                              item.status !==
                                "Completed" && (
                                <button
                                  onClick={() =>
                                    pauseFollowUp(
                                      item.id
                                    )
                                  }
                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs hover:bg-slate-100 dark:hover:bg-white/5"
                                >
                                  <Pause size={14} />
                                  Pause
                                </button>
                              )}

                            <button
                              onClick={() =>
                                generateAiMessage(item)
                              }
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-500/10"
                            >
                              <Bot size={14} />
                              Generate AI Message
                            </button>

                            <div className="my-1 border-t border-slate-200 dark:border-white/10" />

                            <button
                              onClick={() =>
                                deleteFollowUp(
                                  item.id
                                )
                              }
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredFollowUps.length === 0 && (
              <div className="p-12 text-center">
                <Clock3
                  className="mx-auto text-slate-300"
                  size={32}
                />

                <p className="mt-3 text-sm font-semibold">
                  No follow-ups found
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Try changing your search or filters.
                </p>

                <button
                  onClick={resetFilters}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600"
                >
                  <RotateCcw size={14} />
                  Reset Filters
                </button>
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
                <h3 className="font-bold">
                  AI-Powered Follow-up
                </h3>

                <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                  TIVRA can personalize follow-up messages
                  using lead requirements, previous
                  conversations, stage and buying signals.
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
        <Modal title="Add Follow-up" onClose={() => setShowAddModal(false)}>
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold">
                Lead
              </span>

              <select
                value={form.lead}
                onChange={(e) =>
                  setForm({
                    ...form,
                    lead: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-white/10 dark:bg-[#0b1222]"
              >
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

              <select
                value={form.action}
                onChange={(e) =>
                  setForm({
                    ...form,
                    action: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-white/10 dark:bg-[#0b1222]"
              >
                <option>
                  Quotation Follow-up
                </option>

                <option>
                  Demo Reminder
                </option>

                <option>
                  Requirement Follow-up
                </option>

                <option>
                  Re-engagement
                </option>

                <option>
                  Product Information
                </option>

                <option>
                  Negotiation Follow-up
                </option>
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold">
                  Date
                </span>

                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      date: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-white/10 dark:bg-[#0b1222]"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold">
                  Time
                </span>

                <input
                  type="time"
                  value={form.time}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      time: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-white/10 dark:bg-[#0b1222]"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold">
                  Channel
                </span>

                <select
                  value={form.channel}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      channel:
                        e.target.value as Channel,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-white/10 dark:bg-[#0b1222]"
                >
                  <option>WhatsApp</option>
                  <option>Email</option>
                  <option>Call</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold">
                  Owner
                </span>

                <select
                  value={form.owner}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      owner: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-white/10 dark:bg-[#0b1222]"
                >
                  <option>Karan Patel</option>
                  <option>Neha Shah</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold">
                Message
              </span>

              <textarea
                rows={4}
                value={form.message}
                onChange={(e) =>
                  setForm({
                    ...form,
                    message: e.target.value,
                  })
                }
                placeholder="Write your follow-up message..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-white/10 dark:bg-[#0b1222]"
              />
            </label>
          </div>

          <ModalFooter
            onCancel={() => setShowAddModal(false)}
            action="Create Follow-up"
            onAction={addFollowUp}
          />
        </Modal>
      )}

      {/* VIEW MODAL */}
      {showViewModal && selectedFollowUp && (
        <Modal
          title="Follow-up Details"
          onClose={() => setShowViewModal(false)}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 dark:border-white/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                {selectedFollowUp.avatar}
              </div>

              <div>
                <h3 className="font-semibold">
                  {selectedFollowUp.lead}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedFollowUp.company}
                </p>
              </div>
            </div>

            <DetailRow
              label="Follow-up"
              value={selectedFollowUp.action}
            />

            <DetailRow
              label="Schedule"
              value={`${selectedFollowUp.date} • ${selectedFollowUp.time}`}
            />

            <DetailRow
              label="Channel"
              value={selectedFollowUp.channel}
            />

            <DetailRow
              label="Owner"
              value={selectedFollowUp.owner}
            />

            <DetailRow
              label="Status"
              value={selectedFollowUp.status}
            />

            <div>
              <p className="mb-2 text-xs font-semibold text-slate-500">
                Message
              </p>

              <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 dark:bg-white/5">
                {selectedFollowUp.message}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {showEditModal && selectedFollowUp && (
        <Modal
          title="Edit Follow-up"
          onClose={() => setShowEditModal(false)}
        >
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold">
                Follow-up Type
              </span>

              <select
                value={editForm.action}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    action: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-white/10 dark:bg-[#0b1222]"
              >
                <option>
                  Quotation Follow-up
                </option>

                <option>Demo Reminder</option>

                <option>
                  Requirement Follow-up
                </option>

                <option>Re-engagement</option>

                <option>Product Information</option>

                <option>
                  Negotiation Follow-up
                </option>
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold">
                  Date
                </span>

                <input
                  value={editForm.date}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      date: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-white/10 dark:bg-[#0b1222]"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold">
                  Time
                </span>

                <input
                  value={editForm.time}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      time: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-white/10 dark:bg-[#0b1222]"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold">
                  Channel
                </span>

                <select
                  value={editForm.channel}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      channel:
                        e.target.value as Channel,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-white/10 dark:bg-[#0b1222]"
                >
                  <option>WhatsApp</option>
                  <option>Email</option>
                  <option>Call</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold">
                  Owner
                </span>

                <select
                  value={editForm.owner}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      owner: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-white/10 dark:bg-[#0b1222]"
                >
                  <option>Karan Patel</option>
                  <option>Neha Shah</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold">
                Status
              </span>

              <select
                value={editForm.status}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    status:
                      e.target.value as FollowUpStatus,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-white/10 dark:bg-[#0b1222]"
              >
                <option>Overdue</option>
                <option>Due Today</option>
                <option>Scheduled</option>
                <option>Completed</option>
                <option>Paused</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold">
                Message
              </span>

              <textarea
                rows={5}
                value={editForm.message}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    message: e.target.value,
                  })
                }
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-white/10 dark:bg-[#0b1222]"
              />
            </label>
          </div>

          <ModalFooter
            onCancel={() => setShowEditModal(false)}
            action="Save Changes"
            onAction={saveEdit}
          />
        </Modal>
      )}

      {/* AI SEQUENCE MODAL */}
      {showSequence && (
        <Modal
          title="AI Follow-up Sequence"
          onClose={() => setShowSequence(false)}
          wide
        >
          <div className="mb-5 rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-500/20 dark:bg-orange-500/10">
            <div className="flex gap-3">
              <Bot
                className="mt-0.5 shrink-0 text-orange-500"
                size={18}
              />

              <div>
                <p className="text-sm font-semibold">
                  TIVRA AI Automation
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                  The sequence automatically pauses when the
                  customer replies, opts out, becomes Won/Lost,
                  or is handed over to a human salesperson.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {sequenceSteps.map((step, index) => (
              <div
                key={step.day}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                    {index + 1}
                  </div>

                  {index <
                    sequenceSteps.length - 1 && (
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

          <div className="mt-5 flex justify-end">
            <button
              onClick={() => setShowSequence(false)}
              className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* AI MESSAGE MODAL */}
      {showAiMessage && selectedFollowUp && (
        <Modal
          title="AI Follow-up Message"
          onClose={() => setShowAiMessage(false)}
        >
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-orange-600 dark:text-orange-400">
            <Sparkles size={14} />
            Personalized for {selectedFollowUp.lead}
          </div>

          <textarea
            value={aiMessage}
            onChange={(e) =>
              setAiMessage(e.target.value)
            }
            rows={7}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 outline-none focus:border-orange-400 dark:border-white/10 dark:bg-white/5"
          />

          <p className="mt-2 text-[10px] text-slate-400">
            Review and approve AI-generated messages before
            sending.
          </p>

          <div className="mt-5 flex justify-end gap-2">
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
        </Modal>
      )}
    </main>
  );
}

/* =========================================================
   FILTER SELECT
========================================================= */

function FilterSelect({
  value,
  onChange,
  options,
  fullWidth = false,
}: {
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
  fullWidth?: boolean;
}) {
  return (
    <div className={`relative ${fullWidth ? "w-full" : ""}`}>
      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={`appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-xs font-medium outline-none transition focus:border-orange-400 dark:border-white/10 dark:bg-[#111a2e] ${
          fullWidth ? "w-full" : ""
        }`}
      >
        {options.map(([optionValue, label]) => (
          <option
            key={optionValue}
            value={optionValue}
          >
            {label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

/* =========================================================
   MODAL
========================================================= */

function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`max-h-[90vh] w-full ${
          wide ? "max-w-2xl" : "max-w-lg"
        } overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111a2e]`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#111a2e]">
          <h3 className="font-bold">{title}</h3>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MODAL FOOTER
========================================================= */

function ModalFooter({
  onCancel,
  action,
  onAction,
}: {
  onCancel: () => void;
  action: string;
  onAction: () => void;
}) {
  return (
    <div className="mt-5 flex justify-end gap-2 border-t border-slate-200 pt-5 dark:border-white/10">
      <button
        onClick={onCancel}
        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium dark:border-white/10"
      >
        Cancel
      </button>

      <button
        onClick={onAction}
        className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
      >
        {action}
      </button>
    </div>
  );
}

/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 dark:border-white/10">
      <span className="text-xs text-slate-500 dark:text-slate-400">
        {label}
      </span>

      <span className="text-sm font-medium">
        {value}
      </span>
    </div>
  );
}