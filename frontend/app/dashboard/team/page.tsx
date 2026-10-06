"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  Edit3,
  Eye,
  Target,
  Flame,
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
  Trash2,
  CheckCircle2,
  UserRound,
  RotateCcw,
  MinusCircle,
} from "lucide-react";

type MemberStatus = "Active" | "Away" | "Offline";
type AssignmentMethod =
  | "Round Robin"
  | "Workload Based"
  | "Territory Based"
  | "Manual Assignment";

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

const STORAGE_KEY = "tivra_sales_team";

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

const teamNames = ["Enterprise Sales", "SMB Sales", "Inside Sales"];
const roleNames = ["Salesperson", "Sales Manager", "Sales Executive"];
const territoryNames = [
  "Gujarat",
  "Maharashtra",
  "Rajasthan",
  "Delhi NCR",
  "Madhya Pradesh",
  "Pan India",
];

const emptyMemberForm = {
  name: "",
  email: "",
  phone: "",
  role: "Salesperson",
  team: "SMB Sales",
  territory: "Gujarat",
  status: "Active" as MemberStatus,
  leads: "0",
  hotLeads: "0",
  followUps: "0",
  wonDeals: "0",
  revenue: "0",
  target: "300000",
  conversion: "0",
};

const currency = (value: number) =>
  `₹${Math.max(0, value).toLocaleString("en-IN")}`;

const getInitials = (name: string) => {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return initials || "NA";
};

const progressWidth = (revenue: number, target: number) => {
  if (!target || target < 0) return 0;
  return Math.min(100, Math.max(0, Math.round((revenue / target) * 100)));
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

function loadMembers(): SalesMember[] {
  if (typeof window === "undefined") return initialMembers;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialMembers;

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return initialMembers;

    return parsed.filter(Boolean) as SalesMember[];
  } catch {
    return initialMembers;
  }
}

export default function SalesTeamPage() {
  const [members, setMembers] = useState<SalesMember[]>(initialMembers);
  const [hydrated, setHydrated] = useState(false);

  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("All Teams");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetails, setShowDetails] = useState<SalesMember | null>(null);
  const [showEdit, setShowEdit] = useState<SalesMember | null>(null);
  const [showAssign, setShowAssign] = useState(false);
  const [menuId, setMenuId] = useState<number | null>(null);

  const [newMember, setNewMember] = useState(emptyMemberForm);

  const [assignmentMethod, setAssignmentMethod] =
    useState<AssignmentMethod>("Round Robin");
  const [assignmentTeam, setAssignmentTeam] = useState("All Sales Teams");
  const [assignmentMemberId, setAssignmentMemberId] = useState("");
  const [assignmentTerritory, setAssignmentTerritory] = useState("Gujarat");
  const [assignmentCount, setAssignmentCount] = useState("5");

  useEffect(() => {
    const loaded = loadMembers();
    setMembers(loaded);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  }, [members, hydrated]);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        !query ||
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.phone.toLowerCase().includes(query) ||
        member.territory.toLowerCase().includes(query) ||
        member.team.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query);

      const matchesTeam =
        teamFilter === "All Teams" || member.team === teamFilter;

      const matchesStatus =
        statusFilter === "All Status" || member.status === statusFilter;

      return matchesSearch && matchesTeam && matchesStatus;
    });
  }, [members, search, teamFilter, statusFilter]);

  const totalRevenue = useMemo(
    () => members.reduce((sum, member) => sum + Number(member.revenue || 0), 0),
    [members]
  );

  const totalTarget = useMemo(
    () => members.reduce((sum, member) => sum + Number(member.target || 0), 0),
    [members]
  );

  const totalLeads = useMemo(
    () => members.reduce((sum, member) => sum + Number(member.leads || 0), 0),
    [members]
  );

  const totalHotLeads = useMemo(
    () =>
      members.reduce((sum, member) => sum + Number(member.hotLeads || 0), 0),
    [members]
  );

  const totalFollowUps = useMemo(
    () =>
      members.reduce((sum, member) => sum + Number(member.followUps || 0), 0),
    [members]
  );

  const totalWonDeals = useMemo(
    () =>
      members.reduce((sum, member) => sum + Number(member.wonDeals || 0), 0),
    [members]
  );

  const targetProgress = totalTarget
    ? Math.round((totalRevenue / totalTarget) * 100)
    : 0;

  const activeCount = members.filter((member) => member.status === "Active").length;

  const derivedTeams = useMemo(() => {
    return teamNames.map((name) => {
      const teamMembers = members.filter((member) => member.team === name);
      const revenue = teamMembers.reduce(
        (sum, member) => sum + member.revenue,
        0
      );
      const target = teamMembers.reduce(
        (sum, member) => sum + member.target,
        0
      );
      const leads = teamMembers.reduce(
        (sum, member) => sum + member.leads,
        0
      );

      return {
        name,
        members: teamMembers.length,
        leads,
        revenue,
        target,
        progress: target ? Math.round((revenue / target) * 100) : 0,
      };
    });
  }, [members]);

  const resetNewMember = () => {
    setNewMember({ ...emptyMemberForm });
  };

  const openAdd = () => {
    resetNewMember();
    setShowAddModal(true);
    setMenuId(null);
  };

  const addMember = () => {
    const name = newMember.name.trim();
    const email = newMember.email.trim();
    const phone = newMember.phone.trim();

    if (!name) {
      alert("Please enter salesperson name.");
      return;
    }

    if (!email) {
      alert("Please enter email.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!phone) {
      alert("Please enter phone number.");
      return;
    }

    const member: SalesMember = {
      id: Date.now(),
      name,
      email,
      phone,
      role: newMember.role,
      team: newMember.team,
      territory: newMember.territory,
      status: newMember.status,
      leads: Number(newMember.leads) || 0,
      hotLeads: Number(newMember.hotLeads) || 0,
      followUps: Number(newMember.followUps) || 0,
      wonDeals: Number(newMember.wonDeals) || 0,
      revenue: Number(newMember.revenue) || 0,
      target: Number(newMember.target) || 0,
      conversion: Number(newMember.conversion) || 0,
      avatar: getInitials(name),
    };

    setMembers((current) => [member, ...current]);
    setShowAddModal(false);
    resetNewMember();
    alert(`${name} has been added to the Sales Team.`);
  };

  const updateMember = () => {
    if (!showEdit) return;

    const name = showEdit.name.trim();
    const email = showEdit.email.trim();
    const phone = showEdit.phone.trim();

    if (!name || !email || !phone) {
      alert("Name, email and phone are required.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const updated = {
      ...showEdit,
      name,
      email,
      phone,
      avatar: getInitials(name),
      leads: Number(showEdit.leads) || 0,
      hotLeads: Number(showEdit.hotLeads) || 0,
      followUps: Number(showEdit.followUps) || 0,
      wonDeals: Number(showEdit.wonDeals) || 0,
      revenue: Number(showEdit.revenue) || 0,
      target: Number(showEdit.target) || 0,
      conversion: Number(showEdit.conversion) || 0,
    };

    setMembers((current) =>
      current.map((member) => (member.id === updated.id ? updated : member))
    );

    setShowEdit(null);
    alert(`${name} has been updated.`);
  };

  const deleteMember = (member: SalesMember) => {
    const confirmed = window.confirm(
      `Delete ${member.name} from the Sales Team? This cannot be undone.`
    );

    if (!confirmed) return;

    setMembers((current) =>
      current.filter((item) => item.id !== member.id)
    );
    setMenuId(null);
  };

  const changeStatus = (member: SalesMember, status: MemberStatus) => {
    setMembers((current) =>
      current.map((item) =>
        item.id === member.id ? { ...item, status } : item
      )
    );
    setMenuId(null);
  };

  const resetFilters = () => {
    setSearch("");
    setTeamFilter("All Teams");
    setStatusFilter("All Status");
  };

  const openAssignModal = () => {
    setAssignmentMethod("Round Robin");
    setAssignmentTeam("All Sales Teams");
    setAssignmentMemberId("");
    setAssignmentTerritory("Gujarat");
    setAssignmentCount("5");
    setShowAssign(true);
    setMenuId(null);
  };

  const eligibleMembers = useMemo(() => {
    let result = members.filter((member) => member.status === "Active");

    if (assignmentTeam !== "All Sales Teams") {
      result = result.filter((member) => member.team === assignmentTeam);
    }

    if (assignmentMethod === "Territory Based") {
      result = result.filter((member) => member.territory === assignmentTerritory);
    }

    return result;
  }, [members, assignmentTeam, assignmentMethod, assignmentTerritory]);

  const assignLeads = () => {
    const count = Number(assignmentCount);

    if (!Number.isFinite(count) || count <= 0) {
      alert("Please enter a valid number of leads.");
      return;
    }

    if (assignmentMethod === "Manual Assignment") {
      if (!assignmentMemberId) {
        alert("Please select a salesperson for manual assignment.");
        return;
      }

      const selectedId = Number(assignmentMemberId);
      const selected = members.find((member) => member.id === selectedId);

      if (!selected) {
        alert("Selected salesperson was not found.");
        return;
      }

      setMembers((current) =>
        current.map((member) =>
          member.id === selectedId
            ? {
                ...member,
                leads: member.leads + count,
                hotLeads: member.hotLeads + Math.floor(count * 0.2),
              }
            : member
        )
      );

      setShowAssign(false);
      alert(`${count} leads assigned to ${selected.name}.`);
      return;
    }

    if (eligibleMembers.length === 0) {
      alert("No active salespeople match the selected assignment rules.");
      return;
    }

    let chosenIds: number[] = [];

    if (assignmentMethod === "Workload Based") {
      chosenIds = [...eligibleMembers]
        .sort((a, b) => a.leads - b.leads)
        .slice(0, Math.min(count, eligibleMembers.length))
        .map((member) => member.id);
    } else {
      chosenIds = eligibleMembers
        .slice(0, Math.min(count, eligibleMembers.length))
        .map((member) => member.id);
    }

    if (chosenIds.length === 0) {
      alert("No eligible salesperson found.");
      return;
    }

    setMembers((current) =>
      current.map((member) => {
        if (!chosenIds.includes(member.id)) return member;

        const perMember = Math.max(1, Math.floor(count / chosenIds.length));
        const remainder =
          chosenIds.indexOf(member.id) < count % chosenIds.length ? 1 : 0;
        const assigned = perMember + remainder;

        return {
          ...member,
          leads: member.leads + assigned,
          hotLeads: member.hotLeads + Math.floor(assigned * 0.2),
        };
      })
    );

    setShowAssign(false);
    alert(
      `${count} leads assigned using ${assignmentMethod.toLowerCase()}.`
    );
  };

  const exportCsv = () => {
    const header = [
      "Name",
      "Email",
      "Phone",
      "Role",
      "Team",
      "Territory",
      "Status",
      "Leads",
      "Hot Leads",
      "Follow Ups",
      "Won Deals",
      "Revenue",
      "Target",
      "Conversion",
    ];

    const rows = members.map((member) => [
      member.name,
      member.email,
      member.phone,
      member.role,
      member.team,
      member.territory,
      member.status,
      member.leads,
      member.hotLeads,
      member.followUps,
      member.wonDeals,
      member.revenue,
      member.target,
      member.conversion,
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tivra-sales-team.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white"
      onClick={() => menuId !== null && setMenuId(null)}
    >
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
                onClick={(event) => {
                  event.stopPropagation();
                  openAssignModal();
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <UserCheck className="h-4 w-4" />
                Assign Leads
              </button>

              <button
                onClick={(event) => {
                  event.stopPropagation();
                  openAdd();
                }}
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
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Sales Team"
            value={members.length.toString()}
            sub={`${activeCount} active`}
            icon={<Users className="h-6 w-6" />}
            iconClass="bg-orange-50 text-orange-600 dark:bg-orange-500/10"
          />
          <StatCard
            label="Total Leads"
            value={totalLeads.toString()}
            sub={`${totalHotLeads} hot leads`}
            icon={<Flame className="h-6 w-6" />}
            iconClass="bg-red-50 text-red-600 dark:bg-red-500/10"
          />
          <StatCard
            label="Revenue"
            value={`₹${(totalRevenue / 100000).toFixed(1)}L`}
            sub={`Target ₹${(totalTarget / 100000).toFixed(1)}L`}
            icon={<TrendingUp className="h-6 w-6" />}
            iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
          />
          <StatCard
            label="Target Progress"
            value={`${targetProgress}%`}
            sub={`${totalFollowUps} follow-ups · ${totalWonDeals} won deals`}
            icon={<Target className="h-6 w-6" />}
            iconClass="bg-blue-50 text-blue-600 dark:bg-blue-500/10"
          />
        </section>

        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">Team Overview</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Live performance calculated from sales team data.
              </p>
            </div>

            <button
              onClick={exportCsv}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              Export CSV
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {derivedTeams.map((team) => (
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
                    <span className="font-semibold">{team.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-orange-500 transition-all"
                      style={{ width: `${Math.min(team.progress, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-between text-sm">
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    {currency(team.revenue)}
                  </span>
                  <span className="text-slate-400">
                    / {currency(team.target)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search salesperson, email, phone, team or territory..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <select
              value={teamFilter}
              onChange={(event) => setTeamFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
            >
              <option>All Teams</option>
              {teamNames.map((team) => (
                <option key={team}>{team}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Away</option>
              <option>Offline</option>
            </select>

            {(search || teamFilter !== "All Teams" || statusFilter !== "All Status") && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            )}
          </div>
        </section>

        <section className="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800">
            <div className="flex items-center justify-between gap-3">
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

          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[1150px]">
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
                            <p className="text-xs text-slate-500">{member.role}</p>
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
                        <p className="font-semibold">{member.leads}</p>
                        <p className="text-xs text-red-500">{member.hotLeads} hot</p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="w-36">
                          <div className="mb-1 flex justify-between text-xs">
                            <span>{currency(member.revenue)}</span>
                            <span className="text-slate-400">
                              {member.conversion}% conv.
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
                        <div className="text-sm font-semibold">{progress}%</div>
                        <div className="text-xs text-slate-500">
                          {currency(member.target)}
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
                        <div className="relative flex items-center gap-1">
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              setShowDetails(member);
                              setMenuId(null);
                            }}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              setShowEdit({ ...member });
                              setMenuId(null);
                            }}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              setMenuId(menuId === member.id ? null : member.id);
                            }}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                            title="More"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          {menuId === member.id && (
                            <div
                              onClick={(event) => event.stopPropagation()}
                              className="absolute right-0 top-10 z-50 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
                            >
                              <MenuItem
                                icon={<Eye className="h-4 w-4" />}
                                label="View Details"
                                onClick={() => {
                                  setShowDetails(member);
                                  setMenuId(null);
                                }}
                              />
                              <MenuItem
                                icon={<Edit3 className="h-4 w-4" />}
                                label="Edit Member"
                                onClick={() => {
                                  setShowEdit({ ...member });
                                  setMenuId(null);
                                }}
                              />
                              <MenuItem
                                icon={<UserCheck className="h-4 w-4" />}
                                label="Assign Leads"
                                onClick={() => {
                                  setAssignmentMethod("Manual Assignment");
                                  setAssignmentMemberId(String(member.id));
                                  setAssignmentTeam(member.team);
                                  setShowAssign(true);
                                  setMenuId(null);
                                }}
                              />
                              <MenuItem
                                icon={
                                  member.status === "Active" ? (
                                    <Clock3 className="h-4 w-4" />
                                  ) : (
                                    <CheckCircle2 className="h-4 w-4" />
                                  )
                                }
                                label={
                                  member.status === "Active"
                                    ? "Mark Away"
                                    : "Mark Active"
                                }
                                onClick={() =>
                                  changeStatus(
                                    member,
                                    member.status === "Active" ? "Away" : "Active"
                                  )
                                }
                              />
                              <MenuItem
                                icon={<MinusCircle className="h-4 w-4" />}
                                label="Mark Offline"
                                onClick={() => changeStatus(member, "Offline")}
                              />
                              <MenuItem
                                danger
                                icon={<Trash2 className="h-4 w-4" />}
                                label="Delete Member"
                                onClick={() => deleteMember(member)}
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

            {filteredMembers.length === 0 && (
              <div className="p-12 text-center">
                <Users className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-3 font-semibold">No salespeople found</p>
                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <InfoCard
            icon={<UserCheck className="h-5 w-5" />}
            iconClass="bg-orange-50 text-orange-600 dark:bg-orange-500/10"
            title="Lead Assignment"
            description="Automatically distribute new leads across your sales team."
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <InfoPill label="Round Robin" value="Enabled" />
              <InfoPill label="Workload" value="Balanced" />
              <InfoPill label="Territory" value="Enabled" />
            </div>
          </InfoCard>

          <InfoCard
            icon={<AlertCircle className="h-5 w-5" />}
            iconClass="bg-red-50 text-red-600 dark:bg-red-500/10"
            title="Hot Lead SLA"
            description="Monitor response time for high-intent leads."
          >
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
              <div>
                <p className="text-xs text-slate-500">Current SLA</p>
                <p className="mt-1 text-xl font-bold">15 minutes</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Today</p>
                <p className="mt-1 font-bold text-emerald-600">94% on time</p>
              </div>
            </div>
          </InfoCard>
        </section>
      </main>

      {showAddModal && (
        <ModalOverlay onClose={() => setShowAddModal(false)}>
          <ModalShell
            title="Add Salesperson"
            subtitle="Create a complete sales team member profile."
            onClose={() => setShowAddModal(false)}
          >
            <div className="space-y-5 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput
                  label="Full Name"
                  value={newMember.name}
                  onChange={(value) =>
                    setNewMember((current) => ({ ...current, name: value }))
                  }
                  placeholder="Enter full name"
                />
                <FormInput
                  label="Email"
                  type="email"
                  value={newMember.email}
                  onChange={(value) =>
                    setNewMember((current) => ({ ...current, email: value }))
                  }
                  placeholder="name@company.com"
                />
                <FormInput
                  label="Phone"
                  value={newMember.phone}
                  onChange={(value) =>
                    setNewMember((current) => ({ ...current, phone: value }))
                  }
                  placeholder="+91..."
                />
                <FormSelect
                  label="Role"
                  value={newMember.role}
                  options={roleNames}
                  onChange={(value) =>
                    setNewMember((current) => ({ ...current, role: value }))
                  }
                />
                <FormSelect
                  label="Team"
                  value={newMember.team}
                  options={teamNames}
                  onChange={(value) =>
                    setNewMember((current) => ({ ...current, team: value }))
                  }
                />
                <FormSelect
                  label="Territory"
                  value={newMember.territory}
                  options={territoryNames}
                  onChange={(value) =>
                    setNewMember((current) => ({ ...current, territory: value }))
                  }
                />
                <FormSelect
                  label="Status"
                  value={newMember.status}
                  options={["Active", "Away", "Offline"]}
                  onChange={(value) =>
                    setNewMember((current) => ({
                      ...current,
                      status: value as MemberStatus,
                    }))
                  }
                />
                <FormInput
                  label="Monthly Target"
                  type="number"
                  value={newMember.target}
                  onChange={(value) =>
                    setNewMember((current) => ({ ...current, target: value }))
                  }
                  placeholder="300000"
                />
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-orange-500" />
                  <h3 className="text-sm font-semibold">Initial Sales Metrics</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  <FormInput
                    label="Leads"
                    type="number"
                    value={newMember.leads}
                    onChange={(value) =>
                      setNewMember((current) => ({ ...current, leads: value }))
                    }
                  />
                  <FormInput
                    label="Hot Leads"
                    type="number"
                    value={newMember.hotLeads}
                    onChange={(value) =>
                      setNewMember((current) => ({
                        ...current,
                        hotLeads: value,
                      }))
                    }
                  />
                  <FormInput
                    label="Follow Ups"
                    type="number"
                    value={newMember.followUps}
                    onChange={(value) =>
                      setNewMember((current) => ({
                        ...current,
                        followUps: value,
                      }))
                    }
                  />
                  <FormInput
                    label="Won Deals"
                    type="number"
                    value={newMember.wonDeals}
                    onChange={(value) =>
                      setNewMember((current) => ({
                        ...current,
                        wonDeals: value,
                      }))
                    }
                  />
                  <FormInput
                    label="Revenue"
                    type="number"
                    value={newMember.revenue}
                    onChange={(value) =>
                      setNewMember((current) => ({
                        ...current,
                        revenue: value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <ModalFooter
              cancelLabel="Cancel"
              saveLabel="Add Member"
              onCancel={() => setShowAddModal(false)}
              onSave={addMember}
            />
          </ModalShell>
        </ModalOverlay>
      )}

      {showDetails && (
        <ModalOverlay onClose={() => setShowDetails(null)}>
          <ModalShell
            title="Salesperson Details"
            subtitle={showDetails.id ? `Member ID: ${showDetails.id}` : ""}
            onClose={() => setShowDetails(null)}
          >
            <div className="p-5">
              <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-700 dark:bg-orange-500/15 dark:text-orange-400">
                  {showDetails.avatar}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold">{showDetails.name}</h3>
                  <p className="text-sm text-slate-500">{showDetails.role}</p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle(
                      showDetails.status
                    )}`}
                  >
                    {showDetails.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <DetailItem label="Email" value={showDetails.email} icon={<Mail className="h-4 w-4" />} />
                <DetailItem label="Phone" value={showDetails.phone} icon={<Phone className="h-4 w-4" />} />
                <DetailItem label="Team" value={showDetails.team} icon={<BriefcaseBusiness className="h-4 w-4" />} />
                <DetailItem label="Territory" value={showDetails.territory} icon={<MapPin className="h-4 w-4" />} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <MiniStat label="Leads" value={showDetails.leads.toString()} />
                <MiniStat label="Hot Leads" value={showDetails.hotLeads.toString()} />
                <MiniStat label="Follow Ups" value={showDetails.followUps.toString()} />
                <MiniStat label="Won Deals" value={showDetails.wonDeals.toString()} />
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Revenue</p>
                    <p className="mt-1 text-xl font-bold">{currency(showDetails.revenue)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Target</p>
                    <p className="mt-1 text-sm font-semibold">{currency(showDetails.target)}</p>
                  </div>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-orange-500"
                    style={{ width: `${progressWidth(showDetails.revenue, showDetails.target)}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs text-slate-500">
                  <span>{progressWidth(showDetails.revenue, showDetails.target)}% target achieved</span>
                  <span>{showDetails.conversion}% conversion</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`tel:${showDetails.phone}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </a>
                <a
                  href={`mailto:${showDetails.email}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              </div>
            </div>
          </ModalShell>
        </ModalOverlay>
      )}

      {showEdit && (
        <ModalOverlay onClose={() => setShowEdit(null)}>
          <ModalShell
            title="Edit Salesperson"
            subtitle="Update profile, status and sales performance."
            onClose={() => setShowEdit(null)}
          >
            <div className="max-h-[72vh] overflow-y-auto p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput
                  label="Full Name"
                  value={showEdit.name}
                  onChange={(value) =>
                    setShowEdit((current) =>
                      current ? { ...current, name: value } : current
                    )
                  }
                />
                <FormInput
                  label="Email"
                  type="email"
                  value={showEdit.email}
                  onChange={(value) =>
                    setShowEdit((current) =>
                      current ? { ...current, email: value } : current
                    )
                  }
                />
                <FormInput
                  label="Phone"
                  value={showEdit.phone}
                  onChange={(value) =>
                    setShowEdit((current) =>
                      current ? { ...current, phone: value } : current
                    )
                  }
                />
                <FormSelect
                  label="Role"
                  value={showEdit.role}
                  options={roleNames}
                  onChange={(value) =>
                    setShowEdit((current) =>
                      current ? { ...current, role: value } : current
                    )
                  }
                />
                <FormSelect
                  label="Team"
                  value={showEdit.team}
                  options={teamNames}
                  onChange={(value) =>
                    setShowEdit((current) =>
                      current ? { ...current, team: value } : current
                    )
                  }
                />
                <FormSelect
                  label="Territory"
                  value={showEdit.territory}
                  options={territoryNames}
                  onChange={(value) =>
                    setShowEdit((current) =>
                      current ? { ...current, territory: value } : current
                    )
                  }
                />
                <FormSelect
                  label="Status"
                  value={showEdit.status}
                  options={["Active", "Away", "Offline"]}
                  onChange={(value) =>
                    setShowEdit((current) =>
                      current
                        ? { ...current, status: value as MemberStatus }
                        : current
                    )
                  }
                />
                <FormInput
                  label="Monthly Target"
                  type="number"
                  value={String(showEdit.target)}
                  onChange={(value) =>
                    setShowEdit((current) =>
                      current ? { ...current, target: Number(value) || 0 } : current
                    )
                  }
                />
                <FormInput
                  label="Revenue"
                  type="number"
                  value={String(showEdit.revenue)}
                  onChange={(value) =>
                    setShowEdit((current) =>
                      current ? { ...current, revenue: Number(value) || 0 } : current
                    )
                  }
                />
                <FormInput
                  label="Leads"
                  type="number"
                  value={String(showEdit.leads)}
                  onChange={(value) =>
                    setShowEdit((current) =>
                      current ? { ...current, leads: Number(value) || 0 } : current
                    )
                  }
                />
                <FormInput
                  label="Hot Leads"
                  type="number"
                  value={String(showEdit.hotLeads)}
                  onChange={(value) =>
                    setShowEdit((current) =>
                      current ? { ...current, hotLeads: Number(value) || 0 } : current
                    )
                  }
                />
                <FormInput
                  label="Follow Ups"
                  type="number"
                  value={String(showEdit.followUps)}
                  onChange={(value) =>
                    setShowEdit((current) =>
                      current
                        ? { ...current, followUps: Number(value) || 0 }
                        : current
                    )
                  }
                />
                <FormInput
                  label="Won Deals"
                  type="number"
                  value={String(showEdit.wonDeals)}
                  onChange={(value) =>
                    setShowEdit((current) =>
                      current
                        ? { ...current, wonDeals: Number(value) || 0 }
                        : current
                    )
                  }
                />
                <FormInput
                  label="Conversion %"
                  type="number"
                  value={String(showEdit.conversion)}
                  onChange={(value) =>
                    setShowEdit((current) =>
                      current
                        ? { ...current, conversion: Number(value) || 0 }
                        : current
                    )
                  }
                />
              </div>
            </div>

            <ModalFooter
              cancelLabel="Cancel"
              saveLabel="Save Changes"
              onCancel={() => setShowEdit(null)}
              onSave={updateMember}
            />
          </ModalShell>
        </ModalOverlay>
      )}

      {showAssign && (
        <ModalOverlay onClose={() => setShowAssign(false)}>
          <ModalShell
            title="Lead Assignment"
            subtitle="Configure and run a frontend lead assignment simulation."
            onClose={() => setShowAssign(false)}
          >
            <div className="space-y-4 p-5">
              <FormSelect
                label="Assignment Method"
                value={assignmentMethod}
                options={[
                  "Round Robin",
                  "Workload Based",
                  "Territory Based",
                  "Manual Assignment",
                ]}
                onChange={(value) =>
                  setAssignmentMethod(value as AssignmentMethod)
                }
              />

              <FormSelect
                label="Assign Team"
                value={assignmentTeam}
                options={["All Sales Teams", ...teamNames]}
                onChange={(value) => setAssignmentTeam(value)}
              />

              {assignmentMethod === "Territory Based" && (
                <FormSelect
                  label="Territory"
                  value={assignmentTerritory}
                  options={territoryNames}
                  onChange={setAssignmentTerritory}
                />
              )}

              {assignmentMethod === "Manual Assignment" && (
                <FormSelect
                  label="Salesperson"
                  value={assignmentMemberId}
                  options={eligibleMembers.map((member) => ({
                    value: String(member.id),
                    label: `${member.name} · ${member.team}`,
                  }))}
                  onChange={setAssignmentMemberId}
                  placeholder="Select salesperson"
                />
              )}

              <FormInput
                label="Number of Leads"
                type="number"
                value={assignmentCount}
                onChange={setAssignmentCount}
                placeholder="5"
              />

              <div className="rounded-xl bg-orange-50 p-4 text-sm text-orange-800 dark:bg-orange-500/10 dark:text-orange-300">
                This frontend demo updates the selected salesperson lead counters locally. It does not call a backend API.
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <p className="text-xs text-slate-500">Eligible active members</p>
                <p className="mt-1 text-2xl font-bold">{eligibleMembers.length}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {eligibleMembers.map((member) => member.name).join(", ") || "None"}
                </p>
              </div>
            </div>

            <ModalFooter
              cancelLabel="Cancel"
              saveLabel="Assign Leads"
              onCancel={() => setShowAssign(false)}
              onSave={assignLeads}
              icon={<UserCheck className="h-4 w-4" />}
            />
          </ModalShell>
        </ModalOverlay>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
  iconClass,
}: {
  label: string;
  value: string;
  sub: string;
  icon: ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{sub}</p>
        </div>
        <div className={`rounded-xl p-3 ${iconClass}`}>{icon}</div>
      </div>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition ${
        danger
          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
          : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function InfoCard({
  icon,
  iconClass,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  iconClass: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        <div className={`rounded-xl p-3 ${iconClass}`}>{icon}</div>
        <div>
          <h3 className="font-bold">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        {icon}
        {label}
      </div>
      <p className="mt-2 break-all text-sm font-semibold">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 text-center dark:bg-slate-800/70">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

function FormInput({
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
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        min={type === "number" ? 0 : undefined}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800"
      />
    </div>
  );
}

function FormSelect({
  label,
  value,
  options,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  options: Array<string | { value: string; label: string }>;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => {
          const item =
            typeof option === "string"
              ? { value: option, label: option }
              : option;

          return (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="w-full"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function ModalShell({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      {children}
    </div>
  );
}

function ModalFooter({
  cancelLabel,
  saveLabel,
  onCancel,
  onSave,
  icon = <Save className="h-4 w-4" />,
}: {
  cancelLabel: string;
  saveLabel: string;
  onCancel: () => void;
  onSave: () => void;
  icon?: ReactNode;
}) {
  return (
    <div className="flex justify-end gap-3 border-t border-slate-200 p-5 dark:border-slate-800">
      <button
        onClick={onCancel}
        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        {cancelLabel}
      </button>
      <button
        onClick={onSave}
        className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
      >
        {icon}
        {saveLabel}
      </button>
    </div>
  );
}
