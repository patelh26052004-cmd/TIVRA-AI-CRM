"use client";

import { useMemo, useState } from "react";
import { usePersistentState } from "@/lib/persistence";
import {
  Megaphone,
  Plus,
  Search,
  MoreHorizontal,
  X,
  ChevronDown,
  Mail,
  MessageCircle,
  Smartphone,
  Users,
  TrendingUp,
  Eye,
  Pencil,
  Trash2,
  Pause,
  Play,
  CheckCircle2,
  Clock3,
  Send,
} from "lucide-react";

type CampaignStatus =
  | "Draft"
  | "Scheduled"
  | "Running"
  | "Paused"
  | "Completed";

type CampaignType = "WhatsApp" | "Email" | "SMS";

type Campaign = {
  id: number;
  name: string;
  description: string;
  type: CampaignType;
  audience: string;
  audienceCount: number;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  conversions: number;
  createdBy: string;
};

const initialCampaigns: Campaign[] = [
  {
    id: 1,
    name: "Diwali Business Offer",
    description: "Promotional campaign for existing business customers.",
    type: "WhatsApp",
    audience: "Hot Leads",
    audienceCount: 186,
    startDate: "2026-09-20",
    endDate: "2026-10-10",
    status: "Running",
    sent: 186,
    delivered: 179,
    opened: 151,
    clicked: 72,
    conversions: 18,
    createdBy: "Aarav Mehta",
  },
  {
    id: 2,
    name: "CRM Product Introduction",
    description: "Introduce TIVRA AI CRM to new business leads.",
    type: "Email",
    audience: "New Leads",
    audienceCount: 320,
    startDate: "2026-09-25",
    endDate: "2026-10-05",
    status: "Scheduled",
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    conversions: 0,
    createdBy: "Neha Joshi",
  },
  {
    id: 3,
    name: "Quotation Follow-up",
    description: "Follow-up campaign for customers who received quotations.",
    type: "WhatsApp",
    audience: "Quotation Leads",
    audienceCount: 72,
    startDate: "2026-09-18",
    endDate: "2026-09-24",
    status: "Running",
    sent: 72,
    delivered: 70,
    opened: 62,
    clicked: 31,
    conversions: 9,
    createdBy: "Riya Patel",
  },
  {
    id: 4,
    name: "Demo Reminder",
    description: "Reminder messages for upcoming product demos.",
    type: "SMS",
    audience: "Demo Leads",
    audienceCount: 104,
    startDate: "2026-09-15",
    endDate: "2026-09-22",
    status: "Completed",
    sent: 104,
    delivered: 99,
    opened: 81,
    clicked: 34,
    conversions: 12,
    createdBy: "Aarav Mehta",
  },
  {
    id: 5,
    name: "Manufacturing Campaign",
    description: "Target manufacturers with TIVRA automation features.",
    type: "Email",
    audience: "Manufacturers",
    audienceCount: 145,
    startDate: "2026-09-28",
    endDate: "2026-10-15",
    status: "Draft",
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    conversions: 0,
    createdBy: "Neha Joshi",
  },
  {
    id: 6,
    name: "Old Leads Re-engagement",
    description: "Reconnect with leads that have not responded recently.",
    type: "WhatsApp",
    audience: "Old Leads",
    audienceCount: 238,
    startDate: "2026-09-12",
    endDate: "2026-09-20",
    status: "Paused",
    sent: 120,
    delivered: 113,
    opened: 92,
    clicked: 28,
    conversions: 5,
    createdBy: "Riya Patel",
  },
];

const statusStyles: Record<CampaignStatus, string> = {
  Draft:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Scheduled:
    "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  Running:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  Paused:
    "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
  Completed:
    "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
};

const typeStyles: Record<CampaignType, string> = {
  WhatsApp:
    "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  Email:
    "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  SMS:
    "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
};

function getTypeIcon(type: CampaignType) {
  if (type === "WhatsApp") return MessageCircle;
  if (type === "Email") return Mail;
  return Smartphone;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] =
    usePersistentState<Campaign[]>(
      "tivra_campaigns",
      initialCampaigns
    );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Types");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetails, setShowDetails] = useState<Campaign | null>(null);
  const [editingCampaign, setEditingCampaign] =
    useState<Campaign | null>(null);

  const [menuId, setMenuId] = useState<number | null>(null);

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    type: "WhatsApp" as CampaignType,
    audience: "Hot Leads",
    audienceCount: "100",
    startDate: "",
    endDate: "",
    createdBy: "Aarav Mehta",
  });

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const query = search.toLowerCase();

      const matchesSearch =
        campaign.name.toLowerCase().includes(query) ||
        campaign.description.toLowerCase().includes(query) ||
        campaign.audience.toLowerCase().includes(query) ||
        campaign.createdBy.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All Status" ||
        campaign.status === statusFilter;

      const matchesType =
        typeFilter === "All Types" ||
        campaign.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [campaigns, search, statusFilter, typeFilter]);

  const runningCount = campaigns.filter(
    (c) => c.status === "Running"
  ).length;

  const scheduledCount = campaigns.filter(
    (c) => c.status === "Scheduled"
  ).length;

  const completedCount = campaigns.filter(
    (c) => c.status === "Completed"
  ).length;

  const totalAudience = campaigns.reduce(
    (sum, campaign) => sum + campaign.audienceCount,
    0
  );

  const resetForm = () => {
    setNewCampaign({
      name: "",
      description: "",
      type: "WhatsApp",
      audience: "Hot Leads",
      audienceCount: "100",
      startDate: "",
      endDate: "",
      createdBy: "Aarav Mehta",
    });
  };

  const handleCreateCampaign = () => {
    if (
      !newCampaign.name.trim() ||
      !newCampaign.startDate ||
      !newCampaign.endDate
    ) {
      alert("Please fill Campaign Name, Start Date and End Date.");
      return;
    }

    if (newCampaign.endDate < newCampaign.startDate) {
      alert("End Date cannot be before Start Date.");
      return;
    }

    const campaign: Campaign = {
      id: Date.now(),
      name: newCampaign.name.trim(),
      description: newCampaign.description.trim(),
      type: newCampaign.type,
      audience: newCampaign.audience,
      audienceCount: Number(newCampaign.audienceCount) || 0,
      startDate: newCampaign.startDate,
      endDate: newCampaign.endDate,
      status: "Draft",
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      conversions: 0,
      createdBy: newCampaign.createdBy,
    };

    setCampaigns((prev) => [campaign, ...prev]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    const campaign = campaigns.find((item) => item.id === id);

    if (!campaign) return;

    const confirmed = window.confirm(
      `Delete "${campaign.name}"?`
    );

    if (!confirmed) return;

    setCampaigns((prev) =>
      prev.filter((item) => item.id !== id)
    );

    if (showDetails?.id === id) {
      setShowDetails(null);
    }

    if (editingCampaign?.id === id) {
      setEditingCampaign(null);
    }

    setMenuId(null);
  };

  const toggleCampaign = (id: number) => {
    const campaign = campaigns.find((item) => item.id === id);

    if (!campaign) return;

    const nextStatus: CampaignStatus =
      campaign.status === "Running"
        ? "Paused"
        : "Running";

    setCampaigns((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: nextStatus,
            }
          : item
      )
    );

    if (showDetails?.id === id) {
      setShowDetails((prev) =>
        prev
          ? {
              ...prev,
              status: nextStatus,
            }
          : null
      );
    }

    setMenuId(null);
  };

  /* FIXED EDIT FUNCTION */
  const openEdit = (campaign: Campaign) => {
    // Close View Details first
    setShowDetails(null);

    setEditingCampaign(campaign);

    setNewCampaign({
      name: campaign.name,
      description: campaign.description,
      type: campaign.type,
      audience: campaign.audience,
      audienceCount: String(campaign.audienceCount),
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      createdBy: campaign.createdBy,
    });

    setMenuId(null);
  };

  /* FIXED UPDATE FUNCTION */
  const handleUpdateCampaign = () => {
    if (!editingCampaign) return;

    if (
      !newCampaign.name.trim() ||
      !newCampaign.startDate ||
      !newCampaign.endDate
    ) {
      alert("Please fill Campaign Name, Start Date and End Date.");
      return;
    }

    if (newCampaign.endDate < newCampaign.startDate) {
      alert("End Date cannot be before Start Date.");
      return;
    }

    const updatedCampaign: Campaign = {
      ...editingCampaign,
      name: newCampaign.name.trim(),
      description: newCampaign.description.trim(),
      type: newCampaign.type,
      audience: newCampaign.audience,
      audienceCount: Number(newCampaign.audienceCount) || 0,
      startDate: newCampaign.startDate,
      endDate: newCampaign.endDate,
      createdBy: newCampaign.createdBy,
    };

    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === editingCampaign.id
          ? updatedCampaign
          : campaign
      )
    );

    setEditingCampaign(null);
    resetForm();

    // Automatically show updated details
    setShowDetails(updatedCampaign);
  };

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getOpenRate = (campaign: Campaign) => {
    if (!campaign.delivered) return 0;

    return Math.round(
      (campaign.opened / campaign.delivered) * 100
    );
  };

  const getConversionRate = (campaign: Campaign) => {
    if (!campaign.sent) return 0;

    return Math.round(
      (campaign.conversions / campaign.sent) * 100
    );
  };

  return (
    <div
      onClick={() => setMenuId(null)}
      className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 md:p-6"
    >
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
            <Megaphone size={21} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Campaigns
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Create and manage your marketing campaigns.
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            resetForm();
            setShowCreateModal(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          <Plus size={18} />
          New Campaign
        </button>
      </div>

      {/* STATS */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Running Campaigns"
          value={runningCount}
          icon={<TrendingUp size={20} />}
          iconBg="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
        />

        <StatCard
          title="Scheduled"
          value={scheduledCount}
          icon={<Clock3 size={20} />}
          iconBg="bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
        />

        <StatCard
          title="Completed"
          value={completedCount}
          icon={<CheckCircle2 size={20} />}
          iconBg="bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
        />

        <StatCard
          title="Total Audience"
          value={totalAudience}
          icon={<Users size={20} />}
          iconBg="bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
        />
      </div>

      {/* FILTERS */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search campaigns, audience or creator..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              "All Status",
              "Draft",
              "Scheduled",
              "Running",
              "Paused",
              "Completed",
            ]}
          />

          <FilterSelect
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              "All Types",
              "WhatsApp",
              "Email",
              "SMS",
            ]}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px]">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Campaign
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Type
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Audience
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Performance
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCampaigns.map((campaign) => {
                const Icon = getTypeIcon(campaign.type);

                return (
                  <tr
                    key={campaign.id}
                    className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setShowDetails(campaign)}
                        className="text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                            <Megaphone size={18} />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {campaign.name}
                            </p>

                            <p className="mt-1 max-w-[260px] truncate text-xs text-slate-500 dark:text-slate-400">
                              {campaign.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${typeStyles[campaign.type]}`}
                      >
                        <Icon size={14} />
                        {campaign.type}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {campaign.audience}
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <Users size={13} />
                        {campaign.audienceCount} leads
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {formatDate(campaign.startDate)}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        to {formatDate(campaign.endDate)}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      {campaign.sent > 0 ? (
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-slate-800 dark:text-white">
                              {getOpenRate(campaign)}%
                            </span>

                            <span className="text-xs text-slate-500">
                              open rate
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-slate-500">
                            {campaign.conversions} conversions
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Not started
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[campaign.status]}`}
                      >
                        {campaign.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div
                        className="relative inline-block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() =>
                            setMenuId(
                              menuId === campaign.id
                                ? null
                                : campaign.id
                            )
                          }
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {menuId === campaign.id && (
                          <div className="absolute right-0 top-10 z-30 w-48 rounded-xl border border-slate-200 bg-white p-1 text-left shadow-xl dark:border-slate-700 dark:bg-slate-900">
                            <MenuButton
                              icon={<Eye size={15} />}
                              label="View Details"
                              onClick={() => {
                                setShowDetails(campaign);
                                setMenuId(null);
                              }}
                            />

                            <MenuButton
                              icon={<Pencil size={15} />}
                              label="Edit Campaign"
                              onClick={() => openEdit(campaign)}
                            />

                            <MenuButton
                              icon={
                                campaign.status === "Running" ? (
                                  <Pause size={15} />
                                ) : (
                                  <Play size={15} />
                                )
                              }
                              label={
                                campaign.status === "Running"
                                  ? "Pause Campaign"
                                  : "Start Campaign"
                              }
                              onClick={() =>
                                toggleCampaign(campaign.id)
                              }
                            />

                            <MenuButton
                              icon={<Trash2 size={15} />}
                              label="Delete Campaign"
                              danger
                              onClick={() =>
                                handleDelete(campaign.id)
                              }
                            />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredCampaigns.length === 0 && (
            <div className="p-12 text-center">
              <Megaphone
                size={42}
                className="mx-auto mb-3 text-slate-300"
              />

              <p className="font-semibold text-slate-700 dark:text-slate-200">
                No campaigns found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CREATE */}
      {showCreateModal && (
        <CampaignFormModal
          title="Create New Campaign"
          form={newCampaign}
          setForm={setNewCampaign}
          onClose={() => {
            setShowCreateModal(false);
            resetForm();
          }}
          onSubmit={handleCreateCampaign}
          submitLabel="Create Campaign"
        />
      )}

      {/* EDIT */}
      {editingCampaign && (
        <CampaignFormModal
          title="Edit Campaign"
          form={newCampaign}
          setForm={setNewCampaign}
          onClose={() => {
            setEditingCampaign(null);
            resetForm();
          }}
          onSubmit={handleUpdateCampaign}
          submitLabel="Save Changes"
        />
      )}

      {/* DETAILS */}
      {showDetails && (
        <Modal
          title="Campaign Details"
          onClose={() => setShowDetails(null)}
        >
          <div className="space-y-5">
            <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                <Megaphone size={25} />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {showDetails.name}
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {showDetails.description}
                </p>
              </div>

              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[showDetails.status]}`}
              >
                {showDetails.status}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                label="Campaign Type"
                value={showDetails.type}
              />

              <InfoItem
                label="Audience"
                value={`${showDetails.audience} (${showDetails.audienceCount})`}
              />

              <InfoItem
                label="Created By"
                value={showDetails.createdBy}
              />

              <InfoItem
                label="Start Date"
                value={formatDate(showDetails.startDate)}
              />

              <InfoItem
                label="End Date"
                value={formatDate(showDetails.endDate)}
              />

              <InfoItem
                label="Conversions"
                value={String(showDetails.conversions)}
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-bold text-slate-800 dark:text-slate-200">
                Campaign Performance
              </h3>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
                <PerformanceCard
                  label="Sent"
                  value={showDetails.sent}
                />

                <PerformanceCard
                  label="Delivered"
                  value={showDetails.delivered}
                />

                <PerformanceCard
                  label="Opened"
                  value={showDetails.opened}
                />

                <PerformanceCard
                  label="Clicked"
                  value={showDetails.clicked}
                />

                <PerformanceCard
                  label="Conversions"
                  value={showDetails.conversions}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <RateCard
                label="Open Rate"
                value={getOpenRate(showDetails)}
                color="bg-orange-500"
              />

              <RateCard
                label="Conversion Rate"
                value={getConversionRate(showDetails)}
                color="bg-emerald-500"
              />
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
              <button
                onClick={() => openEdit(showDetails)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Pencil size={16} />
                Edit
              </button>

              <button
                onClick={() => {
                  handleDelete(showDetails.id);
                }}
                className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                <Trash2 size={16} />
                Delete
              </button>

              <button
                onClick={() =>
                  toggleCampaign(showDetails.id)
                }
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
              >
                {showDetails.status === "Running" ? (
                  <>
                    <Pause size={16} />
                    Pause
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    Start
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

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

function FilterSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white lg:w-auto"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

function MenuButton({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
        danger
          ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

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
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
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

function CampaignFormModal({
  title,
  form,
  setForm,
  onClose,
  onSubmit,
  submitLabel,
}: {
  title: string;
  form: {
    name: string;
    description: string;
    type: CampaignType;
    audience: string;
    audienceCount: string;
    startDate: string;
    endDate: string;
    createdBy: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
      type: CampaignType;
      audience: string;
      audienceCount: string;
      startDate: string;
      endDate: string;
      createdBy: string;
    }>
  >;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel: string;
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Campaign Name *"
          value={form.name}
          onChange={(value) =>
            setForm({
              ...form,
              name: value,
            })
          }
          placeholder="Enter campaign name"
        />

        <SelectInput
          label="Campaign Type"
          value={form.type}
          options={["WhatsApp", "Email", "SMS"]}
          onChange={(value) =>
            setForm({
              ...form,
              type: value as CampaignType,
            })
          }
        />

        <SelectInput
          label="Audience"
          value={form.audience}
          options={[
            "Hot Leads",
            "New Leads",
            "Quotation Leads",
            "Demo Leads",
            "Old Leads",
            "Manufacturers",
            "All Leads",
          ]}
          onChange={(value) =>
            setForm({
              ...form,
              audience: value,
            })
          }
        />

        <Input
          label="Audience Size"
          type="number"
          value={form.audienceCount}
          onChange={(value) =>
            setForm({
              ...form,
              audienceCount: value,
            })
          }
          placeholder="100"
        />

        <Input
          label="Start Date *"
          type="date"
          value={form.startDate}
          onChange={(value) =>
            setForm({
              ...form,
              startDate: value,
            })
          }
        />

        <Input
          label="End Date *"
          type="date"
          value={form.endDate}
          onChange={(value) =>
            setForm({
              ...form,
              endDate: value,
            })
          }
        />

        <SelectInput
          label="Created By"
          value={form.createdBy}
          options={[
            "Aarav Mehta",
            "Neha Joshi",
            "Riya Patel",
          ]}
          onChange={(value) =>
            setForm({
              ...form,
              createdBy: value,
            })
          }
        />
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Campaign Description
        </label>

        <textarea
          rows={4}
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          placeholder="Describe the purpose of this campaign..."
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Cancel
        </button>

        <button
          onClick={onSubmit}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
        >
          <Send size={16} />
          {submitLabel}
        </button>
      </div>
    </Modal>
  );
}

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
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />
    </div>
  );
}

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
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          {options.map((option) => (
            <option key={option} value={option}>
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

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      <p className="text-xs text-slate-400">{label}</p>

      <p className="mt-1 break-words text-sm font-medium text-slate-800 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}

function PerformanceCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <p className="text-xs text-slate-400">{label}</p>

      <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function RateCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-slate-500">{label}</span>

        <span className="font-bold text-slate-900 dark:text-white">
          {value}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full rounded-full ${color}`}
          style={{
            width: `${Math.min(value, 100)}%`,
          }}
        />
      </div>
    </div>
  );
}