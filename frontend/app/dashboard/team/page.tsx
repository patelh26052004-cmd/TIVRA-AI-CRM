"use client";

import { useMemo, useState } from "react";
import { usePersistentState } from "@/lib/persistence";
import {
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  Edit3,
  Eye,
  Target,
  Flame,
  CheckCircle2,
  Clock3,
  TrendingUp,
  MapPin,
  BriefcaseBusiness,
  Phone,
  Mail,
  X,
  Save,
  UserCheck,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

type MemberStatus = "Active" | "Away" | "Offline";

type SalesMember = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  team: string;
  territory: string;
  status: MemberStatus;
  leads: number;
  hotLeads: number;
  followUps: number;
  wonDeals: number;
  revenue: number;
  target: number;
  conversion: number;
  avatar: string;
};

const initialMembers: SalesMember[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@tivra.ai",
    phone: "+91 98765 43210",
    role: "Sales Manager",
    team: "Enterprise Sales",
    territory: "Gujarat",
    status: "Active",
    leads: 84,
    hotLeads: 18,
    followUps: 23,
    wonDeals: 12,
    revenue: 485000,
    target: 600000,
    conversion: 14.3,
    avatar: "RS",
  },
  {
    id: 2,
    name: "Priya Mehta",
    email: "priya@tivra.ai",
    phone: "+91 98254 12345",
    role: "Salesperson",
    team: "SMB Sales",
    territory: "Maharashtra",
    status: "Active",
    leads: 67,
    hotLeads: 14,
    followUps: 17,
    wonDeals: 9,
    revenue: 365000,
    target: 450000,
    conversion: 13.4,
    avatar: "PM",
  },
  {
    id: 3,
    name: "Amit Patel",
    email: "amit@tivra.ai",
    phone: "+91 99090 45678",
    role: "Salesperson",
    team: "Enterprise Sales",
    territory: "Gujarat",
    status: "Active",
    leads: 59,
    hotLeads: 11,
    followUps: 12,
    wonDeals: 8,
    revenue: 298000,
    target: 400000,
    conversion: 13.6,
    avatar: "AP",
  },
  {
    id: 4,
    name: "Neha Shah",
    email: "neha@tivra.ai",
    phone: "+91 98123 76543",
    role: "Salesperson",
    team: "SMB Sales",
    territory: "Rajasthan",
    status: "Away",
    leads: 48,
    hotLeads: 9,
    followUps: 15,
    wonDeals: 6,
    revenue: 214000,
    target: 350000,
    conversion: 12.5,
    avatar: "NS",
  },
  {
    id: 5,
    name: "Karan Desai",
    email: "karan@tivra.ai",
    phone: "+91 97654 32109",
    role: "Salesperson",
    team: "Inside Sales",
    territory: "Madhya Pradesh",
    status: "Active",
    leads: 73,
    hotLeads: 16,
    followUps: 19,
    wonDeals: 10,
    revenue: 342000,
    target: 400000,
    conversion: 13.7,
    avatar: "KD",
  },
  {
    id: 6,
    name: "Riya Joshi",
    email: "riya@tivra.ai",
    phone: "+91 98989 11223",
    role: "Salesperson",
    team: "Inside Sales",
    territory: "Delhi NCR",
    status: "Offline",
    leads: 42,
    hotLeads: 7,
    followUps: 8,
    wonDeals: 5,
    revenue: 185000,
    target: 300000,
    conversion: 11.9,
    avatar: "RJ",
  },
];

const teams = [
  {
    name: "Enterprise Sales",
    members: 2,
    leads: 143,
    revenue: 783000,
    target: 1000000,
  },
  {
    name: "SMB Sales",
    members: 2,
    leads: 115,
    revenue: 579000,
    target: 800000,
  },
  {
    name: "Inside Sales",
    members: 2,
    leads: 115,
    revenue: 527000,
    target: 700000,
  },
];

export default function SalesTeamPage() {
  const [members, setMembers] = usePersistentState<SalesMember[]>("tivra_sales_team", initialMembers);
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("All Teams");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetails, setShowDetails] = useState<SalesMember | null>(null);
  const [showEdit, setShowEdit] = useState<SalesMember | null>(null);
  const [showAssign, setShowAssign] = useState(false);

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Salesperson",
    team: "SMB Sales",
    territory: "Gujarat",
  });

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase()) ||
        member.territory.toLowerCase().includes(search.toLowerCase());

      const matchesTeam =
        teamFilter === "All Teams" || member.team === teamFilter;

      const matchesStatus =
        statusFilter === "All Status" || member.status === statusFilter;

      return matchesSearch && matchesTeam && matchesStatus;
    });
  }, [members, search, teamFilter, statusFilter]);

  const totalRevenue = members.reduce((sum, m) => sum + m.revenue, 0);
  const totalTarget = members.reduce((sum, m) => sum + m.target, 0);
  const totalLeads = members.reduce((sum, m) => sum + m.leads, 0);
  const totalHotLeads = members.reduce((sum, m) => sum + m.hotLeads, 0);

  const targetProgress = Math.round((totalRevenue / totalTarget) * 100);

  const addMember = () => {
    if (!newMember.name.trim() || !newMember.email.trim()) return;

    const initials = newMember.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const member: SalesMember = {
      id: Date.now(),
      name: newMember.name,
      email: newMember.email,
      phone: newMember.phone || "Not added",
      role: newMember.role,
      team: newMember.team,
      territory: newMember.territory,
      status: "Active",
      leads: 0,
      hotLeads: 0,
      followUps: 0,
      wonDeals: 0,
      revenue: 0,
      target: 300000,
      conversion: 0,
      avatar: initials,
    };

    setMembers((prev) => [member, ...prev]);
    setNewMember({
      name: "",
      email: "",
      phone: "",
      role: "Salesperson",
      team: "SMB Sales",
      territory: "Gujarat",
    });
    setShowAddModal(false);
  };

  const updateMember = () => {
    if (!showEdit) return;

    setMembers((prev) =>
      prev.map((member) =>
        member.id === showEdit.id ? showEdit : member
      )
    );

    setShowEdit(null);
  };

  const statusStyle = (status: MemberStatus) => {
    if (status === "Active") {
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
    }

    if (status === "Away") {
      return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
    }

    return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
  };

  const progressWidth = (revenue: number, target: number) => {
    if (!target) return 0;
    return Math.min(100, Math.round((revenue / target) * 100));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* PAGE HEADER */}
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Sales Team</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Manage salespeople, teams, targets and lead assignments.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowAssign(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <UserCheck className="h-4 w-4" />
                Assign Leads
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
              >
                <UserPlus className="h-4 w-4" />
                Add Salesperson
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* STATS */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Sales Team
                </p>
                <p className="mt-2 text-3xl font-bold">{members.length}</p>
                <p className="mt-1 text-xs text-emerald-600">
                  {members.filter((m) => m.status === "Active").length} active
                </p>
              </div>

              <div className="rounded-xl bg-orange-50 p-3 text-orange-600 dark:bg-orange-500/10">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Total Leads
                </p>
                <p className="mt-2 text-3xl font-bold">{totalLeads}</p>
                <p className="mt-1 text-xs text-orange-600">
                  {totalHotLeads} hot leads
                </p>
              </div>

              <div className="rounded-xl bg-red-50 p-3 text-red-600 dark:bg-red-500/10">
                <Flame className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Revenue
                </p>
                <p className="mt-2 text-3xl font-bold">
                  ₹{(totalRevenue / 100000).toFixed(1)}L
                </p>
                <p className="mt-1 text-xs text-emerald-600">
                  Target ₹{(totalTarget / 100000).toFixed(1)}L
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-500/10">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Target Progress
                </p>
                <p className="mt-2 text-3xl font-bold">{targetProgress}%</p>
                <p className="mt-1 text-xs text-slate-500">
                  Team target achievement
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/10">
                <Target className="h-6 w-6" />
              </div>
            </div>
          </div>
        </section>

        {/* TEAM OVERVIEW */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Team Overview</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Performance by sales team
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {teams.map((team) => {
              const progress = Math.round((team.revenue / team.target) * 100);

              return (
                <div
                  key={team.name}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold">{team.name}</h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {team.members} members · {team.leads} leads
                      </p>
                    </div>

                    <div className="rounded-lg bg-orange-50 p-2 text-orange-600 dark:bg-orange-500/10">
                      <BriefcaseBusiness className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-slate-500">Revenue</span>
                      <span className="font-semibold">{progress}%</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-orange-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between text-sm">
                    <span className="text-slate-500">₹{team.revenue.toLocaleString()}</span>
                    <span className="text-slate-400">
                      / ₹{team.target.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* FILTERS */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search salesperson, email or territory..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
            >
              <option>All Teams</option>
              <option>Enterprise Sales</option>
              <option>SMB Sales</option>
              <option>Inside Sales</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Away</option>
              <option>Offline</option>
            </select>
          </div>
        </section>

        {/* SALESPEOPLE TABLE */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold">Salespeople</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {filteredMembers.length} members shown
                </p>
              </div>

              <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
                <Clock3 className="h-4 w-4" />
                SLA monitoring enabled
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800">
                  <th className="px-5 py-4 font-semibold">Salesperson</th>
                  <th className="px-5 py-4 font-semibold">Team</th>
                  <th className="px-5 py-4 font-semibold">Territory</th>
                  <th className="px-5 py-4 font-semibold">Leads</th>
                  <th className="px-5 py-4 font-semibold">Performance</th>
                  <th className="px-5 py-4 font-semibold">Target</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredMembers.map((member) => {
                  const progress = progressWidth(member.revenue, member.target);

                  return (
                    <tr
                      key={member.id}
                      className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700 dark:bg-orange-500/15 dark:text-orange-400">
                            {member.avatar}
                          </div>

                          <div>
                            <p className="font-semibold">{member.name}</p>
                            <p className="text-xs text-slate-500">
                              {member.role}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm">{member.team}</td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-sm">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {member.territory}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold">{member.leads}</p>
                          <p className="text-xs text-red-500">
                            {member.hotLeads} hot
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="w-32">
                          <div className="mb-1 flex justify-between text-xs">
                            <span>₹{(member.revenue / 1000).toFixed(0)}k</span>
                            <span className="text-slate-400">
                              {member.conversion}%
                            </span>
                          </div>

                          <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
                            <div
                              className="h-full rounded-full bg-orange-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="text-sm font-semibold">
                          {progress}%
                        </div>
                        <div className="text-xs text-slate-500">
                          ₹{member.target.toLocaleString()}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle(
                            member.status
                          )}`}
                        >
                          {member.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setShowDetails(member)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => setShowEdit({ ...member })}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredMembers.length === 0 && (
              <div className="p-12 text-center">
                <Users className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-3 font-semibold">No salespeople found</p>
                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ASSIGNMENT / SLA */}
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-orange-50 p-3 text-orange-600 dark:bg-orange-500/10">
                <UserCheck className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-bold">Lead Assignment</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Automatically distribute new leads across your sales team.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <p className="text-xs text-slate-500">Round Robin</p>
                <p className="mt-1 font-semibold">Enabled</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <p className="text-xs text-slate-500">Workload</p>
                <p className="mt-1 font-semibold">Balanced</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <p className="text-xs text-slate-500">Territory</p>
                <p className="mt-1 font-semibold">Enabled</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-red-50 p-3 text-red-600 dark:bg-red-500/10">
                <AlertCircle className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-bold">Hot Lead SLA</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Monitor response time for high-intent leads.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
              <div>
                <p className="text-xs text-slate-500">Current SLA</p>
                <p className="mt-1 text-xl font-bold">15 minutes</p>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-500">Today</p>
                <p className="mt-1 font-bold text-emerald-600">94% on time</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ADD MEMBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold">Add Salesperson</h2>
                <p className="text-sm text-slate-500">
                  Create a new sales team member.
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Full Name
                </label>
                <input
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                  placeholder="Enter name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) =>
                      setNewMember({ ...newMember, email: e.target.value })
                    }
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Phone
                  </label>
                  <input
                    value={newMember.phone}
                    onChange={(e) =>
                      setNewMember({ ...newMember, phone: e.target.value })
                    }
                    placeholder="+91..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Role
                  </label>
                  <select
                    value={newMember.role}
                    onChange={(e) =>
                      setNewMember({ ...newMember, role: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option>Salesperson</option>
                    <option>Sales Manager</option>
                    <option>Sales Executive</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Team
                  </label>
                  <select
                    value={newMember.team}
                    onChange={(e) =>
                      setNewMember({ ...newMember, team: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option>Enterprise Sales</option>
                    <option>SMB Sales</option>
                    <option>Inside Sales</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Territory
                </label>
                <select
                  value={newMember.territory}
                  onChange={(e) =>
                    setNewMember({
                      ...newMember,
                      territory: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
                >
                  <option>Gujarat</option>
                  <option>Maharashtra</option>
                  <option>Rajasthan</option>
                  <option>Delhi NCR</option>
                  <option>Madhya Pradesh</option>
                  <option>Pan India</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 p-5 dark:border-slate-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold dark:border-slate-700"
              >
                Cancel
              </button>

              <button
                onClick={addMember}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
              >
                <UserPlus className="h-4 w-4" />
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAILS MODAL */}
      {showDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-700 dark:bg-orange-500/15 dark:text-orange-400">
                  {showDetails.avatar}
                </div>

                <div>
                  <h2 className="font-bold">{showDetails.name}</h2>
                  <p className="text-sm text-slate-500">
                    {showDetails.role}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDetails(null)}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <p className="mt-2 text-sm font-semibold">
                  {showDetails.email}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Phone className="h-4 w-4" />
                  Phone
                </div>
                <p className="mt-2 text-sm font-semibold">
                  {showDetails.phone}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <div className="text-xs text-slate-500">Team</div>
                <p className="mt-2 text-sm font-semibold">
                  {showDetails.team}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <div className="text-xs text-slate-500">Territory</div>
                <p className="mt-2 text-sm font-semibold">
                  {showDetails.territory}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <div className="text-xs text-slate-500">Total Leads</div>
                <p className="mt-2 text-xl font-bold">
                  {showDetails.leads}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <div className="text-xs text-slate-500">Hot Leads</div>
                <p className="mt-2 text-xl font-bold text-red-500">
                  {showDetails.hotLeads}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <div className="text-xs text-slate-500">Won Deals</div>
                <p className="mt-2 text-xl font-bold">
                  {showDetails.wonDeals}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <div className="text-xs text-slate-500">Revenue</div>
                <p className="mt-2 text-xl font-bold text-emerald-600">
                  ₹{showDetails.revenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEdit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold">Edit Salesperson</h2>
                <p className="text-sm text-slate-500">
                  Update team member details.
                </p>
              </div>

              <button
                onClick={() => setShowEdit(null)}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Name
                </label>
                <input
                  value={showEdit.name}
                  onChange={(e) =>
                    setShowEdit({ ...showEdit, name: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Email
                </label>
                <input
                  value={showEdit.email}
                  onChange={(e) =>
                    setShowEdit({ ...showEdit, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Team
                  </label>
                  <select
                    value={showEdit.team}
                    onChange={(e) =>
                      setShowEdit({ ...showEdit, team: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option>Enterprise Sales</option>
                    <option>SMB Sales</option>
                    <option>Inside Sales</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Territory
                  </label>
                  <select
                    value={showEdit.territory}
                    onChange={(e) =>
                      setShowEdit({
                        ...showEdit,
                        territory: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option>Gujarat</option>
                    <option>Maharashtra</option>
                    <option>Rajasthan</option>
                    <option>Delhi NCR</option>
                    <option>Madhya Pradesh</option>
                    <option>Pan India</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Status
                </label>
                <select
                  value={showEdit.status}
                  onChange={(e) =>
                    setShowEdit({
                      ...showEdit,
                      status: e.target.value as MemberStatus,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <option>Active</option>
                  <option>Away</option>
                  <option>Offline</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 p-5 dark:border-slate-800">
              <button
                onClick={() => setShowEdit(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold dark:border-slate-700"
              >
                Cancel
              </button>

              <button
                onClick={updateMember}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN LEADS MODAL */}
      {showAssign && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold">Lead Assignment</h2>
                <p className="text-sm text-slate-500">
                  Configure how new leads are assigned.
                </p>
              </div>

              <button
                onClick={() => setShowAssign(false)}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Assignment Method
                </label>

                <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800">
                  <option>Round Robin</option>
                  <option>Workload Based</option>
                  <option>Territory Based</option>
                  <option>Manual Assignment</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Assign Team
                </label>

                <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800">
                  <option>All Sales Teams</option>
                  <option>Enterprise Sales</option>
                  <option>SMB Sales</option>
                  <option>Inside Sales</option>
                </select>
              </div>

              <div className="rounded-xl bg-orange-50 p-4 text-sm text-orange-800 dark:bg-orange-500/10 dark:text-orange-300">
                New leads will be distributed automatically according to the
                selected assignment rule.
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 p-5 dark:border-slate-800">
              <button
                onClick={() => setShowAssign(false)}
                className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}