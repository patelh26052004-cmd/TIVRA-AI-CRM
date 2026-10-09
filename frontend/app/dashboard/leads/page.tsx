"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Flame,
  Phone,
  Mail,
  Building2,
  User,
  X,
  Pencil,
  Trash2,
  Eye,
  ChevronDown,
  Save,
  MapPin,
  Package,
  IndianRupee,
  CalendarDays,
} from "lucide-react";

type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "DEMO"
  | "QUOTATION"
  | "NEGOTIATION"
  | "WON"
  | "LOST";

type LeadPriority = "Hot" | "Warm" | "Cold";

type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  source: string;
  score: number;
  priority: LeadPriority;
  status: LeadStatus;
  product: string;
  budget: string;
  timeline: string;
  notes: string;
  assignedTo: string;
  ownerId?: string | null;
  createdAt: string;
};

const emptyLead: Lead = {
  id: "",
  name: "",
  company: "",
  email: "",
  phone: "",
  location: "",
  source: "Manual",
  score: 50,
  priority: "Warm",
  status: "NEW",
  product: "",
  budget: "",
  timeline: "",
  notes: "",
  assignedTo: "Unassigned",
  ownerId: null,
  createdAt: "",
};

function calculateScore(priority: LeadPriority) {
  if (priority === "Hot") return 90;
  if (priority === "Warm") return 70;
  return 45;
}

function mapApiLead(apiLead: any): Lead {
  const priorityMap: Record<string, LeadPriority> = {
    HOT: "Hot",
    WARM: "Warm",
    COLD: "Cold",
  };

  return {
    id: String(apiLead.id),
    name: apiLead.name || "",
    company: apiLead.company || "",
    email: apiLead.email || "",
    phone: apiLead.phone || "",
    location: apiLead.location || "",
    source: apiLead.source || "Manual",
    score: Number(apiLead.score ?? 0),
    priority: priorityMap[apiLead.temperature] || "Cold",
    status: apiLead.stage || "NEW",
    product: apiLead.product || "",
    budget: apiLead.budget || "",
    timeline: apiLead.timeline || "",
    notes: apiLead.requirements || "",
    assignedTo:
    apiLead.owner?.jobTitle ||
    apiLead.owner?.name ||
    "Unassigned",
    ownerId: apiLead.ownerId || null,
    createdAt: apiLead.createdAt || "",
  };
}

const statusConfig: Record<
  LeadStatus,
  { label: string; className: string }
> = {
  NEW: {
    label: "New",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  CONTACTED: {
    label: "Contacted",
    className: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
  QUALIFIED: {
    label: "Qualified",
    className: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },
  DEMO: {
    label: "Demo / Meeting",
    className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
  QUOTATION: {
    label: "Quotation",
    className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  NEGOTIATION: {
    label: "Negotiation",
    className: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  WON: {
    label: "Won",
    className: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  LOST: {
    label: "Lost",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

function LeadCRMContent() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<
    LeadPriority | "ALL"
  >("ALL");

  const searchParams = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);

  const [form, setForm] = useState<Lead>(emptyLead);
  const [menuId, setMenuId] = useState<string | null>(null);

  const tenantId =
    typeof window !== "undefined"
      ? localStorage.getItem("tivra_tenant_id")
      : null;

  const currentUserId =
    typeof window !== "undefined"
      ? localStorage.getItem("tivra_user_id")
      : null;

  async function fetchLeads() {
    if (!tenantId) {
      setApiError("No TIVRA workspace found. Please sign in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setApiError("");

      const response = await fetch(
        `http://localhost:5000/api/leads?tenantId=${encodeURIComponent(
          tenantId
        )}`,
        { cache: "no-store" }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load leads.");
      }

      setLeads((data.leads || []).map(mapApiLead));
    } catch (error) {
      console.error("Fetch leads error:", error);
      setApiError(
        error instanceof Error
          ? error.message
          : "Unable to connect to TIVRA server."
      );
    } finally {
      setLoading(false);
    }
  }

    async function fetchEmployees() {
    if (!tenantId) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/users?tenantId=${encodeURIComponent(
          tenantId
        )}`,
        { cache: "no-store" }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load employees."
        );
      }
          setEmployees(
            (data.users || [])
              .filter((user: any) => user.status === "ACTIVE")
              .map((user: any) => ({
                ...user,
                role: user.jobTitle || user.role || "",
              }))
          );

    } catch (error) {
      console.error("Fetch employees error:", error);
    }
  }


      useEffect(() => {
        fetchLeads();
        fetchEmployees();
      }, []);

      useEffect(() => {
        const leadId = searchParams.get("edit");

        if (!leadId || loading) return;

        const leadToEdit = leads.find((lead) => lead.id === leadId);

        if (leadToEdit) {
          openEditForm(leadToEdit);
          window.history.replaceState({}, "", "/dashboard/leads");
        }
      }, [searchParams, loading, leads]);


  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const text = search.toLowerCase();

      const matchesSearch =
        lead.name.toLowerCase().includes(text) ||
        lead.company.toLowerCase().includes(text) ||
        lead.email.toLowerCase().includes(text) ||
        lead.phone.toLowerCase().includes(text);

      const matchesStatus =
        statusFilter === "ALL" || lead.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" || lead.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [leads, search, statusFilter, priorityFilter]);

  const totalLeads = leads.length;

  const hotLeads = leads.filter(
    (lead) => lead.priority === "Hot"
  ).length;

  const wonLeads = leads.filter(
    (lead) => lead.status === "WON"
  ).length;

  const conversionRate =
    totalLeads === 0
      ? 0
      : Math.round((wonLeads / totalLeads) * 100);

  function openAddForm() {
    setEditingLead(null);

    setForm({
      ...emptyLead,
      id: "",
      createdAt: "",
      ownerId: currentUserId,
      assignedTo: localStorage.getItem("tivra_user_name") || "Unassigned",
    });

    setShowForm(true);
  }

  function openEditForm(lead: Lead) {
    setEditingLead(lead);
    setForm({ ...lead });
    setShowForm(true);
    setMenuId(null);
  }

  function closeForm() {
    setShowForm(false);
    setEditingLead(null);
    setForm(emptyLead);
  }

  function updateForm<K extends keyof Lead>(
    field: K,
    value: Lead[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveLead() {
    if (!form.name.trim()) {
      alert("Please enter lead name.");
      return;
    }

    if (!tenantId) {
      alert("Your workspace session is missing. Please sign in again.");
      return;
    }

    const finalLead: Lead = {
      ...form,
      score: calculateScore(form.priority),
      ownerId: form.ownerId || currentUserId,
    };

    const payload = {
      tenantId,
      ownerId: finalLead.ownerId || null,
      name: finalLead.name,
      company: finalLead.company,
      email: finalLead.email,
      phone: finalLead.phone,
      location: finalLead.location,
      product: finalLead.product,
      budget: finalLead.budget,
      timeline: finalLead.timeline,
      requirements: finalLead.notes,
      source: finalLead.source,
      score: finalLead.score,
      temperature: finalLead.priority.toUpperCase(),
      stage: finalLead.status,
    };

    try {
      const response = await fetch(
        editingLead
          ? `http://localhost:5000/api/leads/${editingLead.id}`
          : "http://localhost:5000/api/leads",
        {
          method: editingLead ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save lead.");
      }

      const savedLead = mapApiLead(data.lead);

      setLeads((current) =>
        editingLead
          ? current.map((lead) =>
              lead.id === editingLead.id ? savedLead : lead
            )
          : [savedLead, ...current]
      );

      closeForm();
    } catch (error) {
      console.error("Save lead error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to save lead."
      );
    }
  }

  async function deleteLead(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmed || !tenantId) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/leads/${id}?tenantId=${encodeURIComponent(
          tenantId
        )}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete lead.");
      }

      setLeads((current) =>
        current.filter((lead) => lead.id !== id)
      );
      setMenuId(null);
    } catch (error) {
      console.error("Delete lead error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete lead."
      );
    }
  }

  async function updatePriority(
  id: string,
  priority: LeadPriority
) {
  const lead = leads.find((item) => item.id === id);

  if (!lead || !tenantId) return;

  try {
    const response = await fetch(
      `http://localhost:5000/api/leads/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenantId,
          ownerId:
            lead.ownerId ||
            currentUserId ||
            null,
          name: lead.name,
          company: lead.company,
          email: lead.email,
          phone: lead.phone,
          location: lead.location,
          product: lead.product,
          budget: lead.budget,
          timeline: lead.timeline,
          requirements: lead.notes,
          source: lead.source,
          score: lead.score,
          temperature: priority.toUpperCase(),
          stage: lead.status,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Unable to update lead priority."
      );
    }

    const updatedLead = mapApiLead(data.lead);

    setLeads((current) =>
      current.map((item) =>
        item.id === id
          ? updatedLead
          : item
      )
    );
  } catch (error) {
    console.error(
      "Update priority error:",
      error
    );

    alert(
      error instanceof Error
        ? error.message
        : "Unable to update lead priority."
    );
  }
}

  async function updateStatus(id: string, status: LeadStatus) {
    const lead = leads.find((item) => item.id === id);

    if (!lead || !tenantId) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/leads/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tenantId,
            ownerId: lead.ownerId || currentUserId || null,
            name: lead.name,
            company: lead.company,
            email: lead.email,
            phone: lead.phone,
            location: lead.location,
            product: lead.product,
            budget: lead.budget,
            timeline: lead.timeline,
            requirements: lead.notes,
            source: lead.source,
            score: lead.score,
            temperature: lead.priority.toUpperCase(),
            stage: status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update lead status.");
      }

      const updatedLead = mapApiLead(data.lead);

      setLeads((current) =>
        current.map((item) =>
          item.id === id ? updatedLead : item
        )
      );

      setMenuId(null);
    } catch (error) {
      console.error("Update status error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to update lead status."
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#070c1b] px-4 py-6 text-white sm:px-6 lg:px-8">
      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Lead CRM
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage leads, sales stages and customer information.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
        >
          <Plus size={18} />
          Add Lead
        </button>
      </div>

      {apiError && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <span>{apiError}</span>
          <button
            onClick={fetchLeads}
            className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs font-semibold hover:bg-red-500/10"
          >
            Retry
          </button>
        </div>
      )}

      {loading && (
        <div className="mb-5 rounded-xl border border-white/10 bg-[#0d111a] px-4 py-3 text-sm text-slate-400">
          Loading leads from database...
        </div>
      )}

      {/* STATS */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Leads"
          value={totalLeads}
          icon={<User size={20} />}
        />

        <StatCard
          title="Hot Leads"
          value={hotLeads}
          icon={<Flame size={20} />}
        />

        <StatCard
          title="Won Leads"
          value={wonLeads}
          icon={<IndianRupee size={20} />}
        />

        <StatCard
          title="Conversion"
          value={`${conversionRate}%`}
          icon={<Package size={20} />}
        />
      </div>

      {/* PIPELINE */}

      <div className="mb-6 rounded-2xl border border-white/10 bg-[#0d111a] p-4">
        <div className="mb-4">
          <h2 className="text-sm font-semibold">
            Lead Pipeline
          </h2>

          <p className="text-xs text-slate-500">
            Track leads through the sales process.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-8">
          {(
            [
              "NEW",
              "CONTACTED",
              "QUALIFIED",
              "DEMO",
              "QUOTATION",
              "NEGOTIATION",
              "WON",
              "LOST",
            ] as LeadStatus[]
          ).map((status) => {
            const count = leads.filter(
              (lead) => lead.status === status
            ).length;

            const active = statusFilter === status;

            return (
              <button
                key={status}
                onClick={() =>
                  setStatusFilter(
                    active ? "ALL" : status
                  )
                }
                className={`rounded-xl border p-3 text-left transition ${
                  active
                    ? "border-orange-500/50 bg-orange-500/10"
                    : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                }`}
              >
                <div className="text-xs text-slate-400">
                  {statusConfig[status].label}
                </div>

                <div className="mt-1 text-lg font-semibold">
                  {count}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTERS */}

      <div className="mb-5 rounded-2xl border border-white/10 bg-[#0d111a] p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search lead, company, email or phone..."
              className="w-full rounded-xl border border-white/10 bg-[#070c1b] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-orange-500/50"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(
                    e.target.value as
                      | LeadPriority
                      | "ALL"
                  )
                }
                className="appearance-none rounded-xl border border-white/10 bg-[#070c1b] py-3 pl-9 pr-10 text-sm text-white outline-none"
              >
                <option value="ALL">
                  All Priority
                </option>
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Cold">Cold</option>
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* LEADS */}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d111a]">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-sm font-semibold">
            Leads ({filteredLeads.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs text-slate-500">
                <th className="px-5 py-4">
                  Lead
                </th>

                <th className="px-5 py-4">
                  Company
                </th>

                <th className="px-5 py-4">
                  Contact
                </th>

                <th className="px-5 py-4">
                  Priority
                </th>

                <th className="px-5 py-4">
                  Stage
                </th>

                <th className="px-5 py-4">
                  Score
                </th>

                <th className="px-5 py-4 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-white/5 transition hover:bg-white/[0.02]"
                >
                  {/* LEAD */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/10 font-semibold text-orange-400">
                        {lead.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          {lead.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {lead.source}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* COMPANY */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2
                        size={15}
                        className="text-slate-500"
                      />

                      {lead.company}
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <MapPin size={12} />
                      {lead.location}
                    </div>
                  </td>

                  {/* CONTACT */}

                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Mail size={13} />
                        {lead.email}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Phone size={13} />
                        {lead.phone}
                      </div>
                    </div>
                  </td>

                  {/* PRIORITY */}

                  <td className="px-5 py-4">
                    <PriorityBadge
                      priority={lead.priority}
                        onChange={(priority) =>
                      updatePriority(lead.id, priority)
                      }
                    />
                  </td>

                  {/* STATUS */}

                  <td className="px-5 py-4">
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        updateStatus(
                          lead.id,
                          e.target.value as LeadStatus
                        )
                      }
                      className={`rounded-lg border px-3 py-2 text-xs font-medium outline-none ${statusConfig[lead.status].className} bg-transparent`}
                    >
                      {(
                        Object.keys(
                          statusConfig
                        ) as LeadStatus[]
                      ).map((status) => (
                        <option
                          key={status}
                          value={status}
                          className="bg-[#0d111a] text-white"
                        >
                          {statusConfig[status].label}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* SCORE */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-orange-500"
                          style={{
                            width: `${lead.score}%`,
                          }}
                        />
                      </div>

                      <span className="text-xs font-semibold">
                        {lead.score}
                      </span>
                    </div>
                  </td>

                  {/* ACTION */}

                  <td className="px-5 py-4">
                    <div className="relative flex justify-end gap-2">
                      <button
                        onClick={() =>
                          setViewingLead(lead)
                        }
                        title="View"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-blue-500/40 hover:text-blue-400"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() =>
                          openEditForm(lead)
                        }
                        title="Edit"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-orange-500/40 hover:text-orange-400"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() =>
                          setMenuId(
                            menuId === lead.id
                              ? null
                              : lead.id
                          )
                        }
                        title="More"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:text-white"
                      >
                        <MoreHorizontal size={17} />
                      </button>

                      {menuId === lead.id && (
                        <div className="absolute right-0 top-11 z-20 w-44 rounded-xl border border-white/10 bg-[#111827] p-1 shadow-2xl">
                          <button
                            onClick={() =>
                              openEditForm(lead)
                            }
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/5"
                          >
                            <Pencil size={15} />
                            Edit Lead
                          </button>

                          <button
                            onClick={() =>
                              setViewingLead(lead)
                            }
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/5"
                          >
                            <Eye size={15} />
                            View Details
                          </button>

                          <button
                            onClick={() =>
                              deleteLead(lead.id)
                            }
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 size={15} />
                            Delete Lead
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLeads.length === 0 && (
            <div className="px-5 py-16 text-center">
              <User
                size={35}
                className="mx-auto mb-3 text-slate-600"
              />

              <p className="text-sm font-medium">
                No leads found
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}

      {showForm && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0d111a] shadow-2xl">
            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0d111a] px-6 py-5">
              <div>
                <h2 className="text-lg font-bold">
                  {editingLead
                    ? "Edit Lead"
                    : "Add New Lead"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {editingLead
                    ? "Update lead information and save changes."
                    : "Create a new lead in your CRM."}
                </p>
              </div>

              <button
                onClick={closeForm}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            {/* FORM */}

            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
              <FormInput
                label="Lead Name *"
                value={form.name}
                onChange={(value) =>
                  updateForm("name", value)
                }
                placeholder="Enter lead name"
              />

              <FormInput
                label="Company *"
                value={form.company}
                onChange={(value) =>
                  updateForm("company", value)
                }
                placeholder="Enter company name"
              />

              <FormInput
                label="Email"
                value={form.email}
                onChange={(value) =>
                  updateForm("email", value)
                }
                placeholder="example@company.com"
              />

              <FormInput
                label="Phone"
                value={form.phone}
                onChange={(value) =>
                  updateForm("phone", value)
                }
                placeholder="+91 XXXXX XXXXX"
              />

              <FormInput
                label="Location"
                value={form.location}
                onChange={(value) =>
                  updateForm("location", value)
                }
                placeholder="City, State"
              />

              <FormInput
                label="Product / Service"
                value={form.product}
                onChange={(value) =>
                  updateForm("product", value)
                }
                placeholder="CRM Software"
              />

              <FormInput
                label="Budget"
                value={form.budget}
                onChange={(value) =>
                  updateForm("budget", value)
                }
                placeholder="₹50,000"
              />

              <FormInput
                label="Timeline"
                value={form.timeline}
                onChange={(value) =>
                  updateForm("timeline", value)
                }
                placeholder="Within 15 days"
              />

              <FormSelect
                label="Priority"
                value={form.priority}
                onChange={(value) =>
                  updateForm(
                    "priority",
                    value as LeadPriority
                  )
                }
                options={[
                  "Hot",
                  "Warm",
                  "Cold",
                ]}
              />

              <FormSelect
                label="Status"
                value={form.status}
                onChange={(value) =>
                  updateForm(
                    "status",
                    value as LeadStatus
                  )
                }
                options={[
                  "NEW",
                  "CONTACTED",
                  "QUALIFIED",
                  "DEMO",
                  "QUOTATION",
                  "NEGOTIATION",
                  "WON",
                  "LOST",
                ]}
              />

              <FormInput
                label="Lead Source"
                value={form.source}
                onChange={(value) =>
                  updateForm("source", value)
                }
                placeholder="Website / WhatsApp / Campaign"
              />

              <div>
                <label className="mb-2 block text-xs font-medium text-slate-400">
                Assigned Employee
              </label>

              <select
                        value={form.ownerId || ""}
                        onChange={(e) => {
                          const selectedEmployee = employees.find(
                            (employee) => employee.id === e.target.value
                          );

                          updateForm(
                            "ownerId",
                            e.target.value || null
                          );

                          updateForm(
                            "assignedTo",
                            selectedEmployee?.name || "Unassigned"
                          );
                        }}
                        className="w-full rounded-xl border border-white/10 bg-[#070c1b] px-4 py-3 text-sm text-white outline-none focus:border-orange-500/50"
                      >
                        <option
                          value=""
                          className="bg-[#0d111a]"
                        >
                          Unassigned
                        </option>

                        {form.ownerId &&
                          !employees.some(
                            (employee) => employee.id === form.ownerId
                          ) &&
                          editingLead?.assignedTo && (
                            <option
                              value={form.ownerId}
                              className="bg-[#0d111a]"
                            >
                              {editingLead.assignedTo} — Inactive
                            </option>
                          )}

                        {employees.map((employee) => (
                          <option
                            key={employee.id}
                            value={employee.id}
                            className="bg-[#0d111a]"
                          >
                            {employee.name} — {employee.role}
                          </option>
                        ))}
                      </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-medium text-slate-400">
                  Notes
                </label>

                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    updateForm(
                      "notes",
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder="Add notes about this lead..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#070c1b] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-orange-500/50"
                />
              </div>
            </div>

            {/* FOOTER */}

            <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-5">
              <button
                onClick={closeForm}
                className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                onClick={saveLead}
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
              >
                <Save size={16} />

                {editingLead
                  ? "Save Changes"
                  : "Create Lead"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DETAILS */}

      {viewingLead && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0d111a] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold">
                  Lead Details
                </h2>

                <p className="text-xs text-slate-500">
                  Complete lead information
                </p>
              </div>

              <button
                onClick={() =>
                  setViewingLead(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
              <DetailItem
                label="Name"
                value={viewingLead.name}
              />

              <DetailItem
                label="Company"
                value={viewingLead.company}
              />

              <DetailItem
                label="Email"
                value={viewingLead.email}
              />

              <DetailItem
                label="Phone"
                value={viewingLead.phone}
              />

              <DetailItem
                label="Location"
                value={viewingLead.location}
              />

              <DetailItem
                label="Product"
                value={viewingLead.product}
              />

              <DetailItem
                label="Budget"
                value={viewingLead.budget}
              />

              <DetailItem
                label="Timeline"
                value={viewingLead.timeline}
              />

              <DetailItem
                label="Source"
                value={viewingLead.source}
              />

              <DetailItem
                label="Assigned To"
                value={viewingLead.assignedTo}
              />

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs text-slate-500">
                  Priority
                </p>

                <div className="mt-2">
                  <PriorityBadge
                    priority={viewingLead.priority}
                     onChange={(priority) =>
                    updatePriority(viewingLead.id, priority)
                    }
                  />
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs text-slate-500">
                  Status
                </p>

                <p className="mt-2 text-sm font-semibold">
                  {statusConfig[
                    viewingLead.status
                  ].label}
                </p>
              </div>

              <div className="sm:col-span-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs text-slate-500">
                  Notes
                </p>

                <p className="mt-2 text-sm text-slate-300">
                  {viewingLead.notes || "No notes added."}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-5">
              <button
                onClick={() => {
                  setViewingLead(null);
                  openEditForm(viewingLead);
                }}
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
              >
                <Pencil size={16} />
                Edit Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default function LeadCRMPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070c1b] p-6 text-white">
          Loading leads...
        </div>
      }
    >
      <LeadCRMContent />
    </Suspense>
  );
}

/* --------------------------------
   COMPONENTS
-------------------------------- */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d111a] p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {title}
        </p>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
          {icon}
        </div>
      </div>

      <p className="text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}

function PriorityBadge({
  priority,
  onChange,
}: {
  priority: LeadPriority;
  onChange: (priority: LeadPriority) => void;
}) {
  const styles = {
    Hot: "bg-red-500/10 text-red-400 border-red-500/20",
    Warm: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Cold: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };

  return (
    <select
      value={priority}
      onChange={(e) =>
        onChange(
          e.target.value as LeadPriority
        )
      }
      className={`rounded-lg border px-3 py-2 text-xs font-medium outline-none ${styles[priority]} bg-[#0d111a]`}
    >
      <option
        value="Hot"
        className="bg-[#0d111a] text-white"
      >
        🔥 Hot
      </option>

      <option
        value="Warm"
        className="bg-[#0d111a] text-white"
      >
        🟠 Warm
      </option>

      <option
        value="Cold"
        className="bg-[#0d111a] text-white"
      >
        🔵 Cold
      </option>
    </select>
  );
}

function FormInput({
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
      <label className="mb-2 block text-xs font-medium text-slate-400">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-[#070c1b] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-orange-500/50"
      />
    </div>
  );
}

function FormSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-slate-400">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-xl border border-white/10 bg-[#070c1b] px-4 py-3 text-sm text-white outline-none focus:border-orange-500/50"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-[#0d111a]"
          >
            {option}
          </option>
        ))}
      </select>
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
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-medium text-slate-200">
        {value || "-"}
      </p>
    </div>
  );
}
