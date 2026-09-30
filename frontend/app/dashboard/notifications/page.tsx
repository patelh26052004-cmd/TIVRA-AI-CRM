"use client";

import { useMemo, useState } from "react";
import { usePersistentState } from "@/lib/persistence";
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
} from "lucide-react";

type NotificationType =
  | "lead"
  | "followup"
  | "quotation"
  | "appointment"
  | "whatsapp"
  | "ai"
  | "system";

type Notification = {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: "High" | "Medium" | "Low";
  name?: string;
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "lead",
    title: "New Hot Lead Received",
    message:
      "Rajesh Industries has submitted a new enquiry and has been marked as a Hot Lead.",
    time: "5 min ago",
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
    read: true,
    priority: "Low",
  },
];

const typeLabels: Record<NotificationType, string> = {
  lead: "Lead",
  followup: "Follow-up",
  quotation: "Quotation",
  appointment: "Appointment",
  whatsapp: "WhatsApp",
  ai: "AI Alert",
  system: "System",
};

function getIcon(type: NotificationType) {
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

function getIconStyle(type: NotificationType) {
  switch (type) {
    case "lead":
      return "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400";

    case "followup":
      return "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400";

    case "quotation":
      return "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400";

    case "appointment":
      return "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400";

    case "whatsapp":
      return "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400";

    case "ai":
      return "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400";

    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400";
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    usePersistentState<Notification[]>("tivra_notifications", initialNotifications);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<
    "All" | "Unread" | NotificationType
  >("All");

  const [showMenu, setShowMenu] = useState<number | null>(null);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        notification.title.toLowerCase().includes(searchText) ||
        notification.message.toLowerCase().includes(searchText) ||
        notification.name?.toLowerCase().includes(searchText);

      const matchesFilter =
        filter === "All"
          ? true
          : filter === "Unread"
          ? !notification.read
          : notification.type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [notifications, search, filter]);

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

  const markAllAsRead = () => {
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

    setShowMenu(null);
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 dark:bg-[#0b1020] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                <Bell size={23} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Notifications
                </h1>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Stay updated with your TIVRA sales activity
                </p>
              </div>
            </div>
          </div>

          {/* HEADER BUTTONS */}
          <div className="flex flex-wrap gap-2">

            {/* MARK ALL READ */}
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                unreadCount > 0
                  ? "border-indigo-200 bg-white text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800 dark:bg-[#151b2d] dark:text-indigo-400 dark:hover:bg-indigo-500/10"
                  : "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-500 dark:border-gray-700 dark:bg-[#151b2d] dark:text-gray-500"
              }`}
            >
              <CheckCheck size={17} />

              <span>
                {unreadCount > 0
                  ? "Mark all as read"
                  : "All notifications read"}
              </span>
            </button>

            {/* CLEAR ALL */}
            <button
              onClick={clearAll}
              disabled={notifications.length === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/40 dark:bg-[#151b2d] dark:text-red-400 dark:hover:bg-red-950/20"
            >
              <Trash2 size={17} />
              Clear all
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-[#111827]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {notifications.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-[#111827]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Unread
            </p>

            <p className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {unreadCount}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-[#111827]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              High Priority
            </p>

            <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
              {
                notifications.filter(
                  (notification) => notification.priority === "High"
                ).length
              }
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-[#111827]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              AI Alerts
            </p>

            <p className="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">
              {
                notifications.filter(
                  (notification) => notification.type === "ai"
                ).length
              }
            </p>
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-[#111827]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* SEARCH */}
            <div className="relative w-full lg:max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notifications..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-[#0b1020] dark:text-white dark:placeholder:text-gray-500"
              />
            </div>

            {/* FILTER */}
            <div className="flex flex-wrap items-center gap-2">

              <div className="mr-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
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
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* NOTIFICATION LIST */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#111827]">

          {/* LIST HEADER */}
          <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
            <div className="flex items-center justify-between">

              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Recent Notifications
                </h2>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {filteredNotifications.length} notification
                  {filteredNotifications.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {unreadCount > 0 && (
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                  {unreadCount} unread
                </span>
              )}
            </div>
          </div>

          {/* EMPTY STATE */}
          {filteredNotifications.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">

              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800">
                <Bell size={28} />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                No notifications found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                You are all caught up or no notifications match your
                current filter.
              </p>
            </div>
          ) : (

            <div>
              {filteredNotifications.map((notification) => {
                const Icon = getIcon(notification.type);

                return (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`relative flex cursor-pointer gap-4 border-b border-gray-100 px-5 py-5 transition last:border-b-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-[#151b2d] ${
                      !notification.read
                        ? "bg-indigo-50/40 dark:bg-indigo-500/[0.04]"
                        : ""
                    }`}
                  >

                    {/* UNREAD LINE */}
                    {!notification.read && (
                      <span className="absolute left-0 top-0 h-full w-1 bg-indigo-600" />
                    )}

                    {/* ICON */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${getIconStyle(
                        notification.type
                      )}`}
                    >
                      <Icon size={20} />
                    </div>

                    {/* CONTENT */}
                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3
                            className={`text-sm ${
                              !notification.read
                                ? "font-bold text-gray-900 dark:text-white"
                                : "font-semibold text-gray-800 dark:text-gray-200"
                            }`}
                          >
                            {notification.title}
                          </h3>

                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-indigo-600" />
                          )}

                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                            {typeLabels[notification.type]}
                          </span>
                        </div>

                        <span className="flex shrink-0 items-center gap-1 text-xs text-gray-400">
                          <Clock3 size={13} />
                          {notification.time}
                        </span>
                      </div>

                      <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-400">
                        {notification.message}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">

                        {notification.name && (
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {notification.name}
                          </span>
                        )}

                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                            notification.priority === "High"
                              ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                              : notification.priority === "Medium"
                              ? "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {notification.priority} Priority
                        </span>
                      </div>
                    </div>

                    {/* MENU */}
                    <div className="relative shrink-0">

                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          setShowMenu(
                            showMenu === notification.id
                              ? null
                              : notification.id
                          );
                        }}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {showMenu === notification.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-10 z-50 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-xl dark:border-gray-700 dark:bg-[#182033]"
                        >

                          {!notification.read && (
                            <button
                              onClick={() =>
                                markAsRead(notification.id)
                              }
                              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                            >
                              <Check size={16} />
                              Mark as read
                            </button>
                          )}

                          <button
                            onClick={() =>
                              deleteNotification(notification.id)
                            }
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>

                          <button
                            onClick={() => setShowMenu(null)}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
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

        {/* TIVRA INFO */}
        <div className="mt-5 rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900/40 dark:bg-indigo-500/5">

          <div className="flex gap-3">

            <Flame
              className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400"
              size={18}
            />

            <div>
              <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-300">
                TIVRA Smart Notifications
              </p>

              <p className="mt-1 text-xs leading-5 text-indigo-700 dark:text-indigo-400">
                Notifications are currently demo data. In the production
                version, TIVRA will receive real-time alerts from leads,
                WhatsApp, follow-ups, quotations, appointments and AI
                automation.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}