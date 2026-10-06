"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Clock3,
  FileText,
  Filter,
  Flame,
  MessageCircle,
  MoreVertical,
  Search,
  Trash2,
  UserPlus,
  X,
  CalendarDays,
  Bot,
  AlertCircle,
  Settings2,
  Plus,
  SlidersHorizontal,
  Eye,
  CircleDot,
  Zap,
} from "lucide-react";

type NotificationType =
  | "lead"
  | "followup"
  | "quotation"
  | "appointment"
  | "whatsapp"
  | "ai"
  | "system";

type Priority = "High" | "Medium" | "Low";

type Notification = {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  timestamp: number;
  read: boolean;
  priority: Priority;
  name?: string;
};

type NotificationPreferences = {
  leads: boolean;
  followups: boolean;
  quotations: boolean;
  appointments: boolean;
  whatsapp: boolean;
  ai: boolean;
  system: boolean;
  sound: boolean;
};

const STORAGE_KEY = "tivra_notifications";
const PREF_KEY = "tivra_notification_preferences";

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "lead",
    title: "New Hot Lead Received",
    message:
      "Rajesh Industries has submitted a new enquiry and has been marked as a Hot Lead.",
    time: "5 min ago",
    timestamp: Date.now() - 5 * 60 * 1000,
    read: false,
    priority: "High",
    name: "Rajesh Industries",
  },
  {
    id: 2,
    type: "followup",
    title: "Follow-up Due",
    message:
      "Your follow-up with Priya Shah is due today at 2:30 PM.",
    time: "25 min ago",
    timestamp: Date.now() - 25 * 60 * 1000,
    read: false,
    priority: "High",
    name: "Priya Shah",
  },
  {
    id: 3,
    type: "quotation",
    title: "Quotation Viewed",
    message:
      "Quotation #QT-1024 has been viewed by the customer.",
    time: "1 hour ago",
    timestamp: Date.now() - 60 * 60 * 1000,
    read: false,
    priority: "Medium",
    name: "Shree Enterprise",
  },
  {
    id: 4,
    type: "appointment",
    title: "Appointment Reminder",
    message:
      "Demo meeting with Amit Patel is scheduled for today at 4:00 PM.",
    time: "2 hours ago",
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    read: false,
    priority: "High",
    name: "Amit Patel",
  },
  {
    id: 5,
    type: "whatsapp",
    title: "New WhatsApp Message",
    message:
      "A customer replied to your WhatsApp AI conversation.",
    time: "3 hours ago",
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    read: true,
    priority: "Medium",
    name: "Neha Trading",
  },
  {
    id: 6,
    type: "ai",
    title: "AI Sales Insight",
    message:
      "TIVRA AI detected 4 leads that need immediate attention.",
    time: "Today, 9:30 AM",
    timestamp: Date.now() - 4 * 60 * 60 * 1000,
    read: true,
    priority: "High",
  },
  {
    id: 7,
    type: "lead",
    title: "Lead Assigned",
    message:
      "A new lead has been assigned to you by the sales manager.",
    time: "Today, 9:10 AM",
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    read: true,
    priority: "Medium",
    name: "Global Tech Solutions",
  },
  {
    id: 8,
    type: "system",
    title: "System Update",
    message:
      "TIVRA CRM successfully completed the latest system synchronization.",
    time: "Yesterday",
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    read: true,
    priority: "Low",
  },
];

const defaultPreferences: NotificationPreferences = {
  leads: true,
  followups: true,
  quotations: true,
  appointments: true,
  whatsapp: true,
  ai: true,
  system: true,
  sound: false,
};

const typeLabels: Record<NotificationType, string> = {
  lead: "Lead",
  followup: "Follow-up",
  quotation: "Quotation",
  appointment: "Appointment",
  whatsapp: "WhatsApp",
  ai: "AI Alert",
  system: "System",
};

const typePreferenceKey: Record<
  NotificationType,
  keyof NotificationPreferences | null
> = {
  lead: "leads",
  followup: "followups",
  quotation: "quotations",
  appointment: "appointments",
  whatsapp: "whatsapp",
  ai: "ai",
  system: "system",
};

function loadArray<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function iconForType(type: NotificationType) {
  switch (type) {
    case "lead":
      return UserPlus;
    case "followup":
      return Clock3;
    case "quotation":
      return FileText;
    case "appointment":
      return CalendarDays;
    case "whatsapp":
      return MessageCircle;
    case "ai":
      return Bot;
    default:
      return AlertCircle;
  }
}

function iconStyle(type: NotificationType) {
  switch (type) {
    case "lead":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "followup":
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    case "quotation":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "appointment":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "whatsapp":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    case "ai":
      return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }
}

function priorityStyle(priority: Priority) {
  if (priority === "High") {
    return "bg-red-500/10 text-red-400 border-red-500/20";
  }

  if (priority === "Medium") {
    return "bg-orange-500/10 text-orange-400 border-orange-500/20";
  }

  return "bg-zinc-800 text-zinc-400 border-zinc-700";
}

function formatNow(timestamp: number) {
  const diff = Math.max(0, Date.now() - timestamp);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(
    initialNotifications
  );
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(defaultPreferences);
  const [hydrated, setHydrated] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "All" | "Unread" | NotificationType
  >("All");
  const [priorityFilter, setPriorityFilter] = useState<
    "All" | Priority
  >("All");

  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "system" as NotificationType,
    priority: "Medium" as Priority,
    name: "",
  });

  useEffect(() => {
    const savedNotifications = loadArray<Notification[]>(
      STORAGE_KEY,
      initialNotifications
    );
    const savedPreferences = loadArray<NotificationPreferences>(
      PREF_KEY,
      defaultPreferences
    );

    const normalized = Array.isArray(savedNotifications)
      ? savedNotifications.map((notification) => ({
          ...notification,
          timestamp:
            typeof notification.timestamp === "number"
              ? notification.timestamp
              : Date.now(),
        }))
      : initialNotifications;

    setNotifications(normalized);
    setPreferences(savedPreferences ?? defaultPreferences);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(PREF_KEY, JSON.stringify(preferences));
  }, [preferences, hydrated]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const highPriorityCount = notifications.filter(
    (notification) => notification.priority === "High"
  ).length;

  const aiAlertCount = notifications.filter(
    (notification) => notification.type === "ai"
  ).length;

  const filteredNotifications = useMemo(() => {
    const query = search.toLowerCase().trim();

    return notifications.filter((notification) => {
      const matchesSearch =
        !query ||
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query) ||
        notification.name?.toLowerCase().includes(query);

      const matchesType =
        filter === "All"
          ? true
          : filter === "Unread"
          ? !notification.read
          : notification.type === filter;

      const matchesPriority =
        priorityFilter === "All" ||
        notification.priority === priorityFilter;

      return matchesSearch && matchesType && matchesPriority;
    });
  }, [notifications, search, filter, priorityFilter]);

  const markAsRead = (id: number) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
    setShowMenu(null);
  };

  const toggleRead = (id: number) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: !notification.read }
          : notification
      )
    );
    setShowMenu(null);
  };

  const markAllAsRead = () => {
    if (unreadCount === 0) return;

    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    );
    setSelectedNotification((current) =>
      current?.id === id ? null : current
    );
    setShowMenu(null);
  };

  const clearAll = () => {
    setNotifications([]);
    setShowClearConfirm(false);
  };

  const createNotification = () => {
    if (!newNotification.title.trim()) {
      alert("Please enter notification title.");
      return;
    }

    if (!newNotification.message.trim()) {
      alert("Please enter notification message.");
      return;
    }

    const created: Notification = {
      id: Date.now(),
      type: newNotification.type,
      title: newNotification.title.trim(),
      message: newNotification.message.trim(),
      time: "Just now",
      timestamp: Date.now(),
      read: false,
      priority: newNotification.priority,
      name: newNotification.name.trim() || undefined,
    };

    setNotifications((current) => [created, ...current]);
    setShowCreate(false);
    setNewNotification({
      title: "",
      message: "",
      type: "system",
      priority: "Medium",
      name: "",
    });
  };

  const togglePreference = (
    key: keyof NotificationPreferences
  ) => {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const enabledNotificationCount = Object.entries(preferences).filter(
    ([key, value]) => key !== "sound" && value
  ).length;

  return (
    <div
      className="min-h-screen bg-[#0b1020] text-white"
      onClick={() => setShowMenu(null)}
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                <Bell size={23} />
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  Notifications
                </h1>

                <p className="text-sm text-zinc-400">
                  Stay updated with your TIVRA sales activity
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={(event) => {
                event.stopPropagation();
                setShowCreate(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-indigo-500"
            >
              <Plus size={17} />
              Test Notification
            </button>

            <button
              onClick={(event) => {
                event.stopPropagation();
                setShowSettings(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#151b2d] px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-[#1b2338]"
            >
              <Settings2 size={17} />
              Settings
            </button>

            <button
              onClick={(event) => {
                event.stopPropagation();
                markAllAsRead();
              }}
              disabled={unreadCount === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#151b2d] px-4 py-2.5 text-sm font-semibold transition hover:bg-[#1b2338] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckCheck size={17} />
              {unreadCount > 0
                ? "Mark all as read"
                : "All notifications read"}
            </button>

            <button
              onClick={(event) => {
                event.stopPropagation();
                setShowClearConfirm(true);
              }}
              disabled={notifications.length === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-red-900/40 bg-[#151b2d] px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 size={17} />
              Clear all
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard
            label="Total"
            value={notifications.length}
            accent="text-white"
            icon={<Bell size={18} />}
          />

          <StatCard
            label="Unread"
            value={unreadCount}
            accent="text-indigo-400"
            icon={<CircleDot size={18} />}
          />

          <StatCard
            label="High Priority"
            value={highPriorityCount}
            accent="text-red-400"
            icon={<Flame size={18} />}
          />

          <StatCard
            label="AI Alerts"
            value={aiAlertCount}
            accent="text-purple-400"
            icon={<Bot size={18} />}
          />
        </div>

        {/* SEARCH + FILTER */}
        <div className="mb-5 rounded-xl border border-zinc-800 bg-[#111827] p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-lg">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search notifications..."
                className="w-full rounded-lg border border-zinc-800 bg-[#0b1020] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="mr-1 flex items-center gap-2 text-sm text-zinc-500">
                <Filter size={16} />
                Filter
              </div>

              {[
                ["All", "All"],
                ["Unread", "Unread"],
                ["Lead", "lead"],
                ["Follow-up", "followup"],
                ["Quotation", "quotation"],
                ["Appointment", "appointment"],
                ["WhatsApp", "whatsapp"],
                ["AI Alert", "ai"],
                ["System", "system"],
              ].map(([label, value]) => (
                <button
                  key={value}
                  onClick={() =>
                    setFilter(
                      value as "All" | "Unread" | NotificationType
                    )
                  }
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                    filter === value
                      ? "bg-indigo-600 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs text-zinc-500">
              Priority:
            </span>

            {(["All", "High", "Medium", "Low"] as const).map(
              (priority) => (
                <button
                  key={priority}
                  onClick={() => setPriorityFilter(priority)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    priorityFilter === priority
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                      : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  {priority === "All"
                    ? "All Priority"
                    : `${priority} Priority`}
                </button>
              )
            )}

            {(search || filter !== "All" || priorityFilter !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("All");
                  setPriorityFilter("All");
                }}
                className="ml-auto text-xs font-medium text-indigo-400 hover:text-indigo-300"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* LIST */}
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#111827]">
          <div className="border-b border-zinc-800 px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold">
                  Recent Notifications
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  {filteredNotifications.length} notification
                  {filteredNotifications.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {unreadCount > 0 && (
                <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                  {unreadCount} unread
                </span>
              )}
            </div>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-zinc-500">
                <Bell size={28} />
              </div>

              <h3 className="text-lg font-semibold">
                No notifications found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-zinc-500">
                You are all caught up or no notifications match your current filter.
              </p>
            </div>
          ) : (
            <div>
              {filteredNotifications.map((notification) => {
                const Icon = iconForType(notification.type);

                return (
                  <div
                    key={notification.id}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification.id);
                      }
                    }}
                    className={`relative flex cursor-pointer gap-4 border-b border-zinc-800 px-5 py-5 transition last:border-b-0 hover:bg-[#151b2d] ${
                      !notification.read
                        ? "bg-indigo-500/[0.04]"
                        : ""
                    }`}
                  >
                    {!notification.read && (
                      <span className="absolute left-0 top-0 h-full w-1 bg-indigo-500" />
                    )}

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${iconStyle(
                        notification.type
                      )}`}
                    >
                      <Icon size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className={`text-sm ${
                              !notification.read
                                ? "font-bold text-white"
                                : "font-semibold text-zinc-200"
                            }`}
                          >
                            {notification.title}
                          </h3>

                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-indigo-500" />
                          )}

                          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                            {typeLabels[notification.type]}
                          </span>
                        </div>

                        <span className="flex shrink-0 items-center gap-1 text-xs text-zinc-500">
                          <Clock3 size={13} />
                          {formatNow(notification.timestamp)}
                        </span>
                      </div>

                      <p className="mt-1 max-w-4xl text-sm leading-6 text-zinc-400">
                        {notification.message}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {notification.name && (
                          <span className="text-xs font-medium text-zinc-500">
                            {notification.name}
                          </span>
                        )}

                        <span
                          className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${priorityStyle(
                            notification.priority
                          )}`}
                        >
                          {notification.priority} Priority
                        </span>
                      </div>
                    </div>

                    <div className="relative shrink-0">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setShowMenu(
                            showMenu === notification.id
                              ? null
                              : notification.id
                          );
                        }}
                        className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {showMenu === notification.id && (
                        <div
                          onClick={(event) => event.stopPropagation()}
                          className="absolute right-0 top-10 z-50 w-48 overflow-hidden rounded-lg border border-zinc-800 bg-[#182033] py-1 shadow-xl"
                        >
                          <button
                            onClick={() => {
                              setSelectedNotification(notification);
                              setShowMenu(null);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-zinc-200 hover:bg-zinc-800"
                          >
                            <Eye size={16} />
                            View Details
                          </button>

                          <button
                            onClick={() => toggleRead(notification.id)}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-zinc-200 hover:bg-zinc-800"
                          >
                            {notification.read ? (
                              <CircleDot size={16} />
                            ) : (
                              <Check size={16} />
                            )}
                            {notification.read
                              ? "Mark as unread"
                              : "Mark as read"}
                          </button>

                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>

                          <button
                            onClick={() => setShowMenu(null)}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-zinc-300 hover:bg-zinc-800"
                          >
                            <X size={16} />
                            Close
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="mt-5 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.04] p-4">
          <div className="flex gap-3">
            <Zap className="mt-0.5 shrink-0 text-indigo-400" size={18} />

            <div>
              <p className="text-sm font-semibold text-indigo-300">
                TIVRA Smart Notifications
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-400">
                Frontend notification center with persistent browser storage,
                read states, priorities, filters and notification preferences.
                Real-time backend events can be connected later.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILS MODAL */}
      {selectedNotification && (
        <ModalOverlay onClose={() => setSelectedNotification(null)}>
          <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-[#111827] shadow-2xl">
            <ModalHeader
              title="Notification Details"
              onClose={() => setSelectedNotification(null)}
            />

            <div className="p-6">
              <div className="flex items-start gap-4 rounded-2xl border border-zinc-800 bg-[#0b1020] p-5">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${iconStyle(
                    selectedNotification.type
                  )}`}
                >
                  {(() => {
                    const Icon = iconForType(selectedNotification.type);
                    return <Icon size={21} />;
                  })()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold">
                      {selectedNotification.title}
                    </h3>

                    <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[10px] text-zinc-400">
                      {typeLabels[selectedNotification.type]}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {selectedNotification.message}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <DetailItem
                  label="Priority"
                  value={`${selectedNotification.priority} Priority`}
                />

                <DetailItem
                  label="Status"
                  value={selectedNotification.read ? "Read" : "Unread"}
                />

                <DetailItem
                  label="Time"
                  value={formatNow(selectedNotification.timestamp)}
                />

                <DetailItem
                  label="Related To"
                  value={selectedNotification.name || "General notification"}
                />
              </div>

              <div className="mt-5 flex justify-end gap-3">
                {!selectedNotification.read && (
                  <button
                    onClick={() => {
                      markAsRead(selectedNotification.id);
                      setSelectedNotification((current) =>
                        current
                          ? { ...current, read: true }
                          : current
                      );
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-sm font-semibold text-indigo-300 hover:bg-indigo-500/20"
                  >
                    <Check size={17} />
                    Mark as read
                  </button>
                )}

                <button
                  onClick={() => setSelectedNotification(null)}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold hover:bg-indigo-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* SETTINGS MODAL */}
      {showSettings && (
        <ModalOverlay onClose={() => setShowSettings(false)}>
          <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-[#111827] shadow-2xl">
            <ModalHeader
              title="Notification Settings"
              onClose={() => setShowSettings(false)}
            />

            <div className="p-6">
              <div className="mb-5 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.04] p-4">
                <div className="flex items-center gap-3">
                  <SlidersHorizontal className="h-5 w-5 text-indigo-400" />
                  <div>
                    <p className="text-sm font-semibold">
                      Notification Channels
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {enabledNotificationCount} of 7 notification channels enabled
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <PreferenceRow
                  label="Lead Notifications"
                  description="New leads, hot leads and lead assignments"
                  enabled={preferences.leads}
                  onToggle={() => togglePreference("leads")}
                />

                <PreferenceRow
                  label="Follow-up Notifications"
                  description="Due and overdue follow-up reminders"
                  enabled={preferences.followups}
                  onToggle={() => togglePreference("followups")}
                />

                <PreferenceRow
                  label="Quotation Notifications"
                  description="Quotation views, updates and status changes"
                  enabled={preferences.quotations}
                  onToggle={() => togglePreference("quotations")}
                />

                <PreferenceRow
                  label="Appointment Notifications"
                  description="Meeting reminders and appointment changes"
                  enabled={preferences.appointments}
                  onToggle={() => togglePreference("appointments")}
                />

                <PreferenceRow
                  label="WhatsApp Notifications"
                  description="New customer messages and AI conversations"
                  enabled={preferences.whatsapp}
                  onToggle={() => togglePreference("whatsapp")}
                />

                <PreferenceRow
                  label="AI Alerts"
                  description="AI insights, recommendations and sales alerts"
                  enabled={preferences.ai}
                  onToggle={() => togglePreference("ai")}
                />

                <PreferenceRow
                  label="System Notifications"
                  description="System updates and synchronization events"
                  enabled={preferences.system}
                  onToggle={() => togglePreference("system")}
                />

                <PreferenceRow
                  label="Notification Sound"
                  description="Play a browser notification sound when supported"
                  enabled={preferences.sound}
                  onToggle={() => togglePreference("sound")}
                />
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setShowSettings(false)}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold hover:bg-indigo-500"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* CREATE NOTIFICATION MODAL */}
      {showCreate && (
        <ModalOverlay onClose={() => setShowCreate(false)}>
          <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-[#111827] shadow-2xl">
            <ModalHeader
              title="Test Notification"
              onClose={() => setShowCreate(false)}
            />

            <div className="space-y-4 p-6">
              <Field
                label="Title"
                value={newNotification.title}
                placeholder="Enter notification title"
                onChange={(value) =>
                  setNewNotification((current) => ({
                    ...current,
                    title: value,
                  }))
                }
              />

              <Field
                label="Related Name (Optional)"
                value={newNotification.name}
                placeholder="Customer / lead / company"
                onChange={(value) =>
                  setNewNotification((current) => ({
                    ...current,
                    name: value,
                  }))
                }
              />

              <div>
                <label className="mb-2 block text-xs font-medium text-zinc-500">
                  Message
                </label>

                <textarea
                  value={newNotification.message}
                  onChange={(event) =>
                    setNewNotification((current) => ({
                      ...current,
                      message: event.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="Enter notification message..."
                  className="w-full resize-none rounded-xl border border-zinc-800 bg-[#0b1020] px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="Type"
                  value={newNotification.type}
                  onChange={(value) =>
                    setNewNotification((current) => ({
                      ...current,
                      type: value as NotificationType,
                    }))
                  }
                  options={[
                    "lead",
                    "followup",
                    "quotation",
                    "appointment",
                    "whatsapp",
                    "ai",
                    "system",
                  ]}
                  labels={typeLabels}
                />

                <SelectField
                  label="Priority"
                  value={newNotification.priority}
                  onChange={(value) =>
                    setNewNotification((current) => ({
                      ...current,
                      priority: value as Priority,
                    }))
                  }
                  options={["High", "Medium", "Low"]}
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4">
                <button
                  onClick={() => setShowCreate(false)}
                  className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800"
                >
                  Cancel
                </button>

                <button
                  onClick={createNotification}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold hover:bg-indigo-500"
                >
                  <Bell size={17} />
                  Create Notification
                </button>
              </div>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* CLEAR CONFIRM */}
      {showClearConfirm && (
        <ModalOverlay onClose={() => setShowClearConfirm(false)}>
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#111827] shadow-2xl">
            <ModalHeader
              title="Clear Notifications"
              onClose={() => setShowClearConfirm(false)}
            />

            <div className="p-6">
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <div className="flex gap-3">
                  <Trash2 className="h-5 w-5 shrink-0 text-red-400" />

                  <div>
                    <p className="text-sm font-semibold text-red-300">
                      Clear all notifications?
                    </p>

                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      This will remove all {notifications.length} notifications
                      from the local notification center.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800"
                >
                  Cancel
                </button>

                <button
                  onClick={clearAll}
                  className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold hover:bg-red-500"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: number;
  accent: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#111827] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-zinc-500">{label}</p>
          <p className={`mt-1 text-2xl font-bold ${accent}`}>{value}</p>
        </div>

        <div className={`rounded-xl bg-zinc-900 p-3 ${accent}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ModalOverlay({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="w-full" onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
      <h2 className="font-semibold">{title}</h2>

      <button
        onClick={onClose}
        className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#0b1020] p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-zinc-200">{value}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-zinc-500">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-zinc-800 bg-[#0b1020] px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  labels = {},
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  labels?: Record<string, string>;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-zinc-500">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-zinc-800 bg-[#0b1020] px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {labels[option] || option}
          </option>
        ))}
      </select>
    </div>
  );
}

function PreferenceRow({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-[#0b1020] p-4 text-left transition hover:bg-zinc-900"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-200">{label}</p>
        <p className="mt-1 text-xs leading-5 text-zinc-500">
          {description}
        </p>
      </div>

      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-indigo-600" : "bg-zinc-700"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}
