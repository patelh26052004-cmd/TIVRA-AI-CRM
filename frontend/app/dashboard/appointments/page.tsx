"use client";

import { useMemo, useState } from "react";
import { usePersistentState } from "@/lib/persistence";
import {
  CalendarDays,
  Clock3,
  Search,
  Plus,
  Video,
  Phone,
  MapPin,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  UserRound,
  X,
  ChevronDown,
  Pencil,
  Trash2,
  Bell,
  RotateCcw,
  Calendar,
} from "lucide-react";

type AppointmentStatus =
  | "Scheduled"
  | "Confirmed"
  | "Completed"
  | "Cancelled"
  | "No Show";

type AppointmentType = "Demo" | "Meeting" | "Call";

type Appointment = {
  id: number;
  customer: string;
  company: string;
  email: string;
  phone: string;
  salesperson: string;
  date: string;
  time: string;
  duration: string;
  type: AppointmentType;
  location: string;
  status: AppointmentStatus;
  leadScore: number;
  notes: string;
  reminder?: boolean;
};

const initialAppointments: Appointment[] = [
  {
    id: 1,
    customer: "Rahul Shah",
    company: "Shah Industries",
    email: "rahul@shahindustries.com",
    phone: "+91 98765 43210",
    salesperson: "Aarav Mehta",
    date: "2026-09-22",
    time: "10:30 AM",
    duration: "45 min",
    type: "Demo",
    location: "Google Meet",
    status: "Confirmed",
    leadScore: 94,
    notes: "Customer wants to see WhatsApp AI and lead scoring.",
    reminder: true,
  },
  {
    id: 2,
    customer: "Priya Patel",
    company: "Patel Manufacturing",
    email: "priya@patelmanufacturing.com",
    phone: "+91 98251 12345",
    salesperson: "Neha Joshi",
    date: "2026-09-22",
    time: "12:00 PM",
    duration: "30 min",
    type: "Meeting",
    location: "TIVRA Office",
    status: "Scheduled",
    leadScore: 87,
    notes: "Discuss CRM implementation and quotation workflow.",
    reminder: false,
  },
  {
    id: 3,
    customer: "Amit Desai",
    company: "Desai Auto Parts",
    email: "amit@desaiauto.com",
    phone: "+91 99090 45678",
    salesperson: "Aarav Mehta",
    date: "2026-09-22",
    time: "03:30 PM",
    duration: "30 min",
    type: "Call",
    location: "Phone Call",
    status: "Scheduled",
    leadScore: 76,
    notes: "Follow-up discussion about pricing and plans.",
    reminder: false,
  },
  {
    id: 4,
    customer: "Kavita Shah",
    company: "Shah Retail",
    email: "kavita@shahretail.com",
    phone: "+91 98123 56789",
    salesperson: "Riya Patel",
    date: "2026-09-23",
    time: "11:00 AM",
    duration: "45 min",
    type: "Demo",
    location: "Google Meet",
    status: "Confirmed",
    leadScore: 91,
    notes: "Interested in AI Sales Agent and automated follow-ups.",
    reminder: true,
  },
  {
    id: 5,
    customer: "Manish Joshi",
    company: "MJ Enterprises",
    email: "manish@mjenterprises.com",
    phone: "+91 98980 11223",
    salesperson: "Neha Joshi",
    date: "2026-09-24",
    time: "02:00 PM",
    duration: "30 min",
    type: "Meeting",
    location: "TIVRA Office",
    status: "Completed",
    leadScore: 82,
    notes: "Initial product discussion completed.",
    reminder: false,
  },
  {
    id: 6,
    customer: "Sneha Mehta",
    company: "Mehta Solutions",
    email: "sneha@mehtasolutions.com",
    phone: "+91 98790 99887",
    salesperson: "Riya Patel",
    date: "2026-09-24",
    time: "04:00 PM",
    duration: "30 min",
    type: "Call",
    location: "Phone Call",
    status: "Cancelled",
    leadScore: 68,
    notes: "Customer requested to reschedule.",
    reminder: false,
  },
];

const statusStyles: Record<AppointmentStatus, string> = {
  Scheduled:
    "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  Confirmed:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  Completed:
    "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  Cancelled:
    "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  "No Show":
    "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
};

const typeIcon = {
  Demo: Video,
  Meeting: MapPin,
  Call: Phone,
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] =
    usePersistentState<Appointment[]>(
      "tivra_appointments",
      initialAppointments
    );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetails, setShowDetails] = useState<Appointment | null>(null);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  const [newAppointment, setNewAppointment] = useState({
    customer: "",
    company: "",
    email: "",
    phone: "",
    salesperson: "Aarav Mehta",
    date: "",
    time: "",
    duration: "30 min",
    type: "Demo" as AppointmentType,
    location: "Google Meet",
    notes: "",
  });

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        appointment.customer.toLowerCase().includes(searchText) ||
        appointment.company.toLowerCase().includes(searchText) ||
        appointment.salesperson.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        appointment.status === statusFilter;

      const matchesType =
        typeFilter === "All" ||
        appointment.type === typeFilter;

      const matchesDate =
        !selectedDate ||
        appointment.date === selectedDate;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesDate
      );
    });
  }, [
    appointments,
    search,
    statusFilter,
    typeFilter,
    selectedDate,
  ]);

  const todayCount = appointments.filter(
    (a) => a.date === "2026-09-22"
  ).length;

  const upcomingCount = appointments.filter(
    (a) =>
      a.status === "Scheduled" ||
      a.status === "Confirmed"
  ).length;

  const completedCount = appointments.filter(
    (a) => a.status === "Completed"
  ).length;

  const cancelledCount = appointments.filter(
    (a) => a.status === "Cancelled"
  ).length;

  const resetForm = () => {
    setNewAppointment({
      customer: "",
      company: "",
      email: "",
      phone: "",
      salesperson: "Aarav Mehta",
      date: "",
      time: "",
      duration: "30 min",
      type: "Demo",
      location: "Google Meet",
      notes: "",
    });
  };

  const handleAddAppointment = () => {
    if (
      !newAppointment.customer ||
      !newAppointment.company ||
      !newAppointment.date ||
      !newAppointment.time
    ) {
      alert("Please fill Customer, Company, Date and Time.");
      return;
    }

    const appointment: Appointment = {
      id: Date.now(),
      customer: newAppointment.customer,
      company: newAppointment.company,
      email: newAppointment.email,
      phone: newAppointment.phone,
      salesperson: newAppointment.salesperson,
      date: newAppointment.date,
      time: newAppointment.time,
      duration: newAppointment.duration,
      type: newAppointment.type,
      location: newAppointment.location,
      status: "Scheduled",
      leadScore: 80,
      notes: newAppointment.notes,
      reminder: false,
    };

    setAppointments((prev) => [appointment, ...prev]);
    setShowAddModal(false);
    resetForm();
  };

  const openEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);

    setNewAppointment({
      customer: appointment.customer,
      company: appointment.company,
      email: appointment.email,
      phone: appointment.phone,
      salesperson: appointment.salesperson,
      date: appointment.date,
      time: appointment.time,
      duration: appointment.duration,
      type: appointment.type,
      location: appointment.location,
      notes: appointment.notes,
    });

    setShowDetails(null);
  };

  const handleEditAppointment = () => {
    if (!editingAppointment) return;

    if (
      !newAppointment.customer ||
      !newAppointment.company ||
      !newAppointment.date ||
      !newAppointment.time
    ) {
      alert("Please fill Customer, Company, Date and Time.");
      return;
    }

    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === editingAppointment.id
          ? {
              ...appointment,
              customer: newAppointment.customer,
              company: newAppointment.company,
              email: newAppointment.email,
              phone: newAppointment.phone,
              salesperson: newAppointment.salesperson,
              date: newAppointment.date,
              time: newAppointment.time,
              duration: newAppointment.duration,
              type: newAppointment.type,
              location: newAppointment.location,
              notes: newAppointment.notes,
            }
          : appointment
      )
    );

    setEditingAppointment(null);
    resetForm();
  };

  const deleteAppointment = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmed) return;

    setAppointments((prev) =>
      prev.filter((appointment) => appointment.id !== id)
    );

    setShowDetails(null);
  };

  const cancelAppointment = (id: number) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: "Cancelled" }
          : appointment
      )
    );

    if (showDetails?.id === id) {
      setShowDetails((prev) =>
        prev
          ? { ...prev, status: "Cancelled" }
          : null
      );
    }
  };

  const rescheduleAppointment = (appointment: Appointment) => {
    openEdit(appointment);
  };

  const setReminder = (id: number) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              reminder: !appointment.reminder,
            }
          : appointment
      )
    );

    if (showDetails?.id === id) {
      setShowDetails((prev) =>
        prev
          ? {
              ...prev,
              reminder: !prev.reminder,
            }
          : null
      );
    }
  };

  const updateStatus = (
    id: number,
    status: AppointmentStatus
  ) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status }
          : appointment
      )
    );

    if (showDetails?.id === id) {
      setShowDetails((prev) =>
        prev
          ? { ...prev, status }
          : null
      );
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 md:p-6">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Appointments
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage demos, meetings, calls and customer schedules.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setEditingAppointment(null);
            setShowAddModal(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          <Plus size={18} />
          New Appointment
        </button>
      </div>

      {/* STATS */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Today's Appointments"
          value={todayCount}
          icon={<CalendarDays size={20} />}
          iconBg="bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
        />

        <StatCard
          title="Upcoming"
          value={upcomingCount}
          icon={<Clock3 size={20} />}
          iconBg="bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
        />

        <StatCard
          title="Completed"
          value={completedCount}
          icon={<CheckCircle2 size={20} />}
          iconBg="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
        />

        <StatCard
          title="Cancelled"
          value={cancelledCount}
          icon={<XCircle size={20} />}
          iconBg="bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
        />
      </div>

      {/* FILTERS */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* SEARCH */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search customer, company or salesperson..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* STATUS */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="All">
                All Appointments
              </option>

              <option value="Scheduled">
                Scheduled
              </option>

              <option value="Confirmed">
                Confirmed
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>

              <option value="No Show">
                No Show
              </option>
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          {/* TYPE */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value)
              }
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="All">
                All Appointment Types
              </option>

              <option value="Demo">Demo</option>
              <option value="Meeting">Meeting</option>
              <option value="Call">Call</option>
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          {/* DATE */}
          <div className="relative">
            <Calendar
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="date"
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(e.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {selectedDate && (
            <button
              onClick={() => setSelectedDate("")}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Clear Date
            </button>
          )}
        </div>
      </div>

      {/* CALENDAR DATE QUICK FILTER */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Calendar Filter
            </h3>

            <p className="text-xs text-slate-500">
              Select a date to view appointments.
            </p>
          </div>

          <CalendarDays
            size={20}
            className="text-orange-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {Array.from(
            new Set(
              appointments
                .map((appointment) => appointment.date)
                .sort()
            )
          ).map((date) => {
            const active = selectedDate === date;

            return (
              <button
                key={date}
                onClick={() =>
                  setSelectedDate(
                    active ? "" : date
                  )
                }
                className={`min-w-[130px] rounded-xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-slate-200 bg-slate-50 hover:border-orange-300 dark:border-slate-700 dark:bg-slate-800"
                }`}
              >
                <p className="text-xs opacity-70">
                  {new Date(
                    `${date}T00:00:00`
                  ).toLocaleDateString("en-IN", {
                    weekday: "short",
                  })}
                </p>

                <p className="mt-1 text-sm font-bold">
                  {formatDate(date)}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px]">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date & Time
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Type
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Salesperson
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Lead Score
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAppointments.map(
                (appointment) => {
                  const Icon =
                    typeIcon[appointment.type];

                  return (
                    <tr
                      key={appointment.id}
                      className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    >
                      {/* CUSTOMER */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() =>
                            setShowDetails(
                              appointment
                            )
                          }
                          className="text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                              {appointment.customer
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {appointment.customer}
                              </p>

                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {appointment.company}
                              </p>
                            </div>
                          </div>
                        </button>
                      </td>

                      {/* DATE */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {formatDate(
                            appointment.date
                          )}
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                          <Clock3 size={13} />
                          {appointment.time} ·{" "}
                          {appointment.duration}
                        </p>

                        {appointment.reminder && (
                          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-orange-500">
                            <Bell size={12} />
                            Reminder On
                          </p>
                        )}
                      </td>

                      {/* TYPE */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            <Icon size={16} />
                          </div>

                          <div>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                              {appointment.type}
                            </p>

                            <p className="text-xs text-slate-500">
                              {appointment.location}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SALESPERSON */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <UserRound
                            size={15}
                            className="text-slate-400"
                          />
                          {appointment.salesperson}
                        </div>
                      </td>

                      {/* SCORE */}
                      <td className="px-5 py-4">
                        <span
                          className={`font-bold ${
                            appointment.leadScore >=
                            90
                              ? "text-red-500"
                              : appointment.leadScore >=
                                75
                              ? "text-orange-500"
                              : "text-blue-500"
                          }`}
                        >
                          {appointment.leadScore}
                        </span>

                        <span className="text-xs text-slate-400">
                          /100
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[appointment.status]}`}
                        >
                          {appointment.status}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            title="View Details"
                            onClick={() =>
                              setShowDetails(
                                appointment
                              )
                            }
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                          >
                            <MoreHorizontal
                              size={18}
                            />
                          </button>

                          <button
                            title="Edit"
                            onClick={() =>
                              openEdit(
                                appointment
                              )
                            }
                            className="rounded-lg p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            title="Cancel"
                            onClick={() =>
                              cancelAppointment(
                                appointment.id
                              )
                            }
                            disabled={
                              appointment.status ===
                                "Cancelled" ||
                              appointment.status ===
                                "Completed"
                            }
                            className="rounded-lg p-2 text-orange-500 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-orange-500/10"
                          >
                            <XCircle size={16} />
                          </button>

                          <button
                            title="Delete"
                            onClick={() =>
                              deleteAppointment(
                                appointment.id
                              )
                            }
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>

          {filteredAppointments.length === 0 && (
            <div className="p-12 text-center">
              <CalendarDays
                size={42}
                className="mx-auto mb-3 text-slate-300"
              />

              <p className="font-semibold text-slate-700 dark:text-slate-200">
                No appointments found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {(showAddModal || editingAppointment) && (
        <Modal
          title={
            editingAppointment
              ? "Edit Appointment"
              : "Create New Appointment"
          }
          onClose={() => {
            setShowAddModal(false);
            setEditingAppointment(null);
            resetForm();
          }}
        >
          <AppointmentForm
            appointment={newAppointment}
            setAppointment={setNewAppointment}
          />

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditingAppointment(null);
                resetForm();
              }}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              onClick={
                editingAppointment
                  ? handleEditAppointment
                  : handleAddAppointment
              }
              className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
            >
              {editingAppointment
                ? "Save Changes"
                : "Create Appointment"}
            </button>
          </div>
        </Modal>
      )}

      {/* DETAILS MODAL */}
      {showDetails && (
        <Modal
          title="Appointment Details"
          onClose={() =>
            setShowDetails(null)
          }
        >
          <div className="space-y-5">
            {/* PROFILE */}
            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                {showDetails.customer
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {showDetails.customer}
                </h3>

                <p className="text-sm text-slate-500">
                  {showDetails.company}
                </p>
              </div>

              <div className="ml-auto">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[showDetails.status]}`}
                >
                  {showDetails.status}
                </span>
              </div>
            </div>

            {/* INFORMATION */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem
                label="Date"
                value={formatDate(
                  showDetails.date
                )}
              />

              <InfoItem
                label="Time"
                value={`${showDetails.time} · ${showDetails.duration}`}
              />

              <InfoItem
                label="Appointment Type"
                value={showDetails.type}
              />

              <InfoItem
                label="Location"
                value={showDetails.location}
              />

              <InfoItem
                label="Salesperson"
                value={showDetails.salesperson}
              />

              <InfoItem
                label="AI Lead Score"
                value={`${showDetails.leadScore}/100`}
              />

              <InfoItem
                label="Email"
                value={
                  showDetails.email || "-"
                }
              />

              <InfoItem
                label="Phone"
                value={
                  showDetails.phone || "-"
                }
              />
            </div>

            {/* NOTES */}
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Notes
              </p>

              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {showDetails.notes ||
                  "No notes added."}
              </div>
            </div>

            {/* STATUS */}
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Update Status
              </p>

              <div className="flex flex-wrap gap-2">
                {(
                  [
                    "Scheduled",
                    "Confirmed",
                    "Completed",
                    "Cancelled",
                    "No Show",
                  ] as AppointmentStatus[]
                ).map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      updateStatus(
                        showDetails.id,
                        status
                      )
                    }
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      showDetails.status ===
                      status
                        ? "bg-orange-500 text-white"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    setReminder(
                      showDetails.id
                    )
                  }
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${
                    showDetails.reminder
                      ? "bg-orange-500 text-white"
                      : "border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  <Bell size={16} />

                  {showDetails.reminder
                    ? "Reminder On"
                    : "Set Reminder"}
                </button>

                <button
                  onClick={() =>
                    rescheduleAppointment(
                      showDetails
                    )
                  }
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <RotateCcw size={16} />
                  Reschedule
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    openEdit(showDetails)
                  }
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  <Pencil size={16} />
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteAppointment(
                      showDetails.id
                    )
                  }
                  className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------------- FORM ---------------- */

function AppointmentForm({
  appointment,
  setAppointment,
}: {
  appointment: {
    customer: string;
    company: string;
    email: string;
    phone: string;
    salesperson: string;
    date: string;
    time: string;
    duration: string;
    type: AppointmentType;
    location: string;
    notes: string;
  };
  setAppointment: React.Dispatch<
    React.SetStateAction<{
      customer: string;
      company: string;
      email: string;
      phone: string;
      salesperson: string;
      date: string;
      time: string;
      duration: string;
      type: AppointmentType;
      location: string;
      notes: string;
    }>
  >;
}) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Customer Name *"
          value={appointment.customer}
          onChange={(value) =>
            setAppointment({
              ...appointment,
              customer: value,
            })
          }
          placeholder="Enter customer name"
        />

        <Input
          label="Company *"
          value={appointment.company}
          onChange={(value) =>
            setAppointment({
              ...appointment,
              company: value,
            })
          }
          placeholder="Enter company"
        />

        <Input
          label="Email"
          value={appointment.email}
          onChange={(value) =>
            setAppointment({
              ...appointment,
              email: value,
            })
          }
          placeholder="customer@email.com"
        />

        <Input
          label="Phone"
          value={appointment.phone}
          onChange={(value) =>
            setAppointment({
              ...appointment,
              phone: value,
            })
          }
          placeholder="+91 XXXXX XXXXX"
        />

        <Input
          label="Date *"
          type="date"
          value={appointment.date}
          onChange={(value) =>
            setAppointment({
              ...appointment,
              date: value,
            })
          }
        />

        <Input
          label="Time *"
          type="time"
          value={appointment.time}
          onChange={(value) =>
            setAppointment({
              ...appointment,
              time: value,
            })
          }
        />

        <SelectInput
          label="Appointment Type"
          value={appointment.type}
          options={[
            "Demo",
            "Meeting",
            "Call",
          ]}
          onChange={(value) =>
            setAppointment({
              ...appointment,
              type: value as AppointmentType,
            })
          }
        />

        <SelectInput
          label="Duration"
          value={appointment.duration}
          options={[
            "15 min",
            "30 min",
            "45 min",
            "60 min",
          ]}
          onChange={(value) =>
            setAppointment({
              ...appointment,
              duration: value,
            })
          }
        />

        <SelectInput
          label="Salesperson"
          value={appointment.salesperson}
          options={[
            "Aarav Mehta",
            "Neha Joshi",
            "Riya Patel",
          ]}
          onChange={(value) =>
            setAppointment({
              ...appointment,
              salesperson: value,
            })
          }
        />

        <SelectInput
          label="Location"
          value={appointment.location}
          options={[
            "Google Meet",
            "Zoom",
            "TIVRA Office",
            "Phone Call",
          ]}
          onChange={(value) =>
            setAppointment({
              ...appointment,
              location: value,
            })
          }
        />
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Notes
        </label>

        <textarea
          rows={3}
          value={appointment.notes}
          onChange={(e) =>
            setAppointment({
              ...appointment,
              notes: e.target.value,
            })
          }
          placeholder="Add appointment notes..."
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>
    </>
  );
}

/* ---------------- STAT CARD ---------------- */

function StatCard({
  title,
  value,
  icon,
  iconBg,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ---------------- MODAL ---------------- */

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/* ---------------- INPUT ---------------- */

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />
    </div>
  );
}

/* ---------------- SELECT ---------------- */

function SelectInput({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </div>
  );
}

/* ---------------- INFO ITEM ---------------- */

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-800 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}