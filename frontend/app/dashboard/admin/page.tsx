"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  Users,
  UserCheck,
  UserX,
  Settings2,
  Database,
  RefreshCw,
  Bell,
  Activity,
  LockKeyhole,
  Save,
  Plus,
  Search,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Server,
  Download,
  RotateCcw,
  Clock3,
  Mail,
  X,
  KeyRound,
} from "lucide-react";

type AdminUserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: AdminUserStatus;
  lastLogin: string;
  department: string;
};

type SystemSetting = {
  maintenanceMode: boolean;
  emailNotifications: boolean;
  loginAlerts: boolean;
  autoBackup: boolean;
  twoFactorRequired: boolean;
};

type ActivityItem = {
  id: number;
  title: string;
  description: string;
  time: string;
  type: "security" | "system" | "user" | "database";
};

const initialUsers: AdminUser[] = [
  {
    id: "ADM-001",
    name: "Ashutosh",
    email: "ashutosh@company.com",
    role: "Administrator",
    status: "ACTIVE",
    lastLogin: "Today, 10:42 AM",
    department: "Management",
  },
  {
    id: "ADM-002",
    name: "Saloni Mehta",
    email: "saloni@company.com",
    role: "Sales Manager",
    status: "ACTIVE",
    lastLogin: "Today, 09:18 AM",
    department: "Sales",
  },
  {
    id: "ADM-003",
    name: "Hetvi Shah",
    email: "hetvi@company.com",
    role: "Developer",
    status: "ACTIVE",
    lastLogin: "Yesterday, 06:25 PM",
    department: "Development",
  },
  {
    id: "ADM-004",
    name: "Hasti Patel",
    email: "hasti@company.com",
    role: "QA",
    status: "INACTIVE",
    lastLogin: "Sep 27, 2026",
    department: "QA",
  },
  {
    id: "ADM-005",
    name: "Kashis Patel",
    email: "kashis@company.com",
    role: "Digital Marketing",
    status: "SUSPENDED",
    lastLogin: "Sep 22, 2026",
    department: "Marketing",
  },
];

const initialActivity: ActivityItem[] = [
  {
    id: 1,
    title: "Administrator login",
    description: "Admin account signed in successfully.",
    time: "10 min ago",
    type: "security",
  },
  {
    id: 2,
    title: "Backup completed",
    description: "Latest application backup completed successfully.",
    time: "1 hour ago",
    type: "database",
  },
  {
    id: 3,
    title: "User status changed",
    description: "Kashis Patel was suspended.",
    time: "3 hours ago",
    type: "user",
  },
  {
    id: 4,
    title: "System synchronization",
    description: "CRM data synchronization completed.",
    time: "5 hours ago",
    type: "system",
  },
];

const roles = [
  "Administrator",
  "Sales Manager",
  "Developer",
  "QA",
  "Digital Marketing",
  "HR Manager",
];

const departments = [
  "Management",
  "Sales",
  "Development",
  "QA",
  "Marketing",
  "HR",
  "Accounts",
];

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function activityIcon(type: ActivityItem["type"]) {
  if (type === "security") return ShieldCheck;
  if (type === "database") return Database;
  if (type === "user") return Users;
  return Activity;
}

export default function AdminPanelPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [settings, setSettings] = useState<SystemSetting>({
    maintenanceMode: false,
    emailNotifications: true,
    loginAlerts: true,
    autoBackup: true,
    twoFactorRequired: false,
  });

  const [activeTab, setActiveTab] = useState<"overview" | "users" | "system">(
    "overview"
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | AdminUserStatus>(
    "ALL"
  );
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showUserView, setShowUserView] = useState(false);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "Sales Manager",
    department: "Sales",
    status: "ACTIVE" as AdminUserStatus,
  });

  const [backupStatus, setBackupStatus] = useState(
    "Last backup: Today, 09:30 AM"
  );
  const [syncing, setSyncing] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    setUsers(readStorage<AdminUser[]>("tivra_admin_users", initialUsers));
    setActivities(
      readStorage<ActivityItem[]>("tivra_admin_activity", initialActivity)
    );
    setSettings(
      readStorage<SystemSetting>("tivra_admin_settings", {
        maintenanceMode: false,
        emailNotifications: true,
        loginAlerts: true,
        autoBackup: true,
        twoFactorRequired: false,
      })
    );
  }, []);

  useEffect(() => {
    if (users.length) writeStorage("tivra_admin_users", users);
  }, [users]);

  useEffect(() => {
    if (activities.length) writeStorage("tivra_admin_activity", activities);
  }, [activities]);

  useEffect(() => {
    writeStorage("tivra_admin_settings", settings);
  }, [settings]);

  const activeUsers = users.filter((user) => user.status === "ACTIVE").length;
  const inactiveUsers = users.filter((user) => user.status === "INACTIVE").length;
  const suspendedUsers = users.filter(
    (user) => user.status === "SUSPENDED"
  ).length;

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.department.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" || user.status === statusFilter;

      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, search, statusFilter, roleFilter]);

  const addActivity = (
    title: string,
    description: string,
    type: ActivityItem["type"]
  ) => {
    setActivities((current) => [
      {
        id: Date.now(),
        title,
        description,
        time: "Just now",
        type,
      },
      ...current,
    ]);
  };

  const resetUserForm = () => {
    setUserForm({
      name: "",
      email: "",
      role: "Sales Manager",
      department: "Sales",
      status: "ACTIVE",
    });
  };

  const openAddUser = () => {
    setEditingUser(null);
    resetUserForm();
    setShowUserForm(true);
    setOpenMenu(null);
  };

  const openEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status,
    });
    setShowUserForm(true);
    setOpenMenu(null);
  };

  const saveUser = () => {
    if (!userForm.name.trim()) {
      alert("Please enter user name.");
      return;
    }

    if (!userForm.email.trim()) {
      alert("Please enter email.");
      return;
    }

    if (editingUser) {
      setUsers((current) =>
        current.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                name: userForm.name.trim(),
                email: userForm.email.trim(),
                role: userForm.role,
                department: userForm.department,
                status: userForm.status,
              }
            : user
        )
      );

      addActivity(
        "Admin user updated",
        `${userForm.name.trim()} user profile was updated.`,
        "user"
      );
      alert("User updated successfully.");
    } else {
      const newUser: AdminUser = {
        id: `ADM-${String(users.length + 1).padStart(3, "0")}-${Date.now()
          .toString()
          .slice(-4)}`,
        name: userForm.name.trim(),
        email: userForm.email.trim(),
        role: userForm.role,
        department: userForm.department,
        status: userForm.status,
        lastLogin: "Never",
      };

      setUsers((current) => [newUser, ...current]);

      addActivity(
        "New admin user created",
        `${newUser.name} was added to the admin directory.`,
        "user"
      );
      alert("User added successfully.");
    }

    setShowUserForm(false);
    setEditingUser(null);
    resetUserForm();
  };

  const deleteUser = (user: AdminUser) => {
    if (user.role === "Administrator") {
      alert("Administrator account cannot be deleted from this panel.");
      return;
    }

    const confirmed = window.confirm(`Delete ${user.name}?`);
    if (!confirmed) return;

    setUsers((current) => current.filter((item) => item.id !== user.id));

    addActivity(
      "Admin user deleted",
      `${user.name} was removed from the admin directory.`,
      "security"
    );

    setOpenMenu(null);
  };

  const toggleStatus = (user: AdminUser) => {
    if (user.role === "Administrator") {
      alert("Administrator status cannot be changed here.");
      return;
    }

    const nextStatus: AdminUserStatus =
      user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    setUsers((current) =>
      current.map((item) =>
        item.id === user.id
          ? {
              ...item,
              status: nextStatus,
            }
          : item
      )
    );

    addActivity(
      "User status changed",
      `${user.name} is now ${nextStatus.toLowerCase()}.`,
      "user"
    );

    setOpenMenu(null);
  };

  const suspendUser = (user: AdminUser) => {
    if (user.role === "Administrator") {
      alert("Administrator account cannot be suspended here.");
      return;
    }

    setUsers((current) =>
      current.map((item) =>
        item.id === user.id
          ? {
              ...item,
              status: "SUSPENDED",
            }
          : item
      )
    );

    addActivity(
      "User suspended",
      `${user.name} was suspended by an administrator.`,
      "security"
    );

    setOpenMenu(null);
  };

  const runBackup = () => {
    setBackupStatus("Backup in progress...");
    setTimeout(() => {
      setBackupStatus("Last backup: Just now");
      addActivity(
        "Backup completed",
        "Application data backup completed successfully.",
        "database"
      );
      alert("Backup completed successfully.");
    }, 800);
  };

  const runSync = () => {
    if (syncing) return;

    setSyncing(true);

    setTimeout(() => {
      setSyncing(false);

      addActivity(
        "System synchronization",
        "Admin-triggered CRM synchronization completed.",
        "system"
      );

      alert("System synchronization completed.");
    }, 1000);
  };

  const saveSystemSettings = () => {
    setSavingSettings(true);

    setTimeout(() => {
      setSavingSettings(false);

      addActivity(
        "System settings updated",
        "Administrative system settings were saved.",
        "system"
      );

      alert("System settings saved successfully.");
    }, 500);
  };

  const exportUsers = () => {
    const rows = [
      ["ID", "Name", "Email", "Role", "Department", "Status", "Last Login"],
      ...users.map((user) => [
        user.id,
        user.name,
        user.email,
        user.role,
        user.department,
        user.status,
        user.lastLogin,
      ]),
    ];

    const csv = rows
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
    link.download = "tivra-admin-users.csv";
    link.click();
    URL.revokeObjectURL(url);

    addActivity(
      "Admin user export",
      "Admin user directory was exported to CSV.",
      "system"
    );
  };

  return (
    <div
      className="min-h-screen bg-[#09090b] text-white"
      onClick={() => setOpenMenu(null)}
    >
      <div className="space-y-6 p-4 md:p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
              <ShieldCheck className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">Admin Panel</h1>
              <p className="text-sm text-zinc-400">
                Manage system access, security, users and administration
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={(event) => {
                event.stopPropagation();
                runSync();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-semibold hover:bg-zinc-800"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync System"}
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                runBackup();
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold hover:bg-blue-500"
            >
              <Database className="h-4 w-4" />
              Backup Now
            </button>
          </div>
        </div>

        <div className="flex gap-2 border-b border-zinc-800">
          <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
            <Activity className="h-4 w-4" />
            Overview
          </TabButton>
          <TabButton active={activeTab === "users"} onClick={() => setActiveTab("users")}>
            <Users className="h-4 w-4" />
            Admin Users
          </TabButton>
          <TabButton active={activeTab === "system"} onClick={() => setActiveTab("system")}>
            <Settings2 className="h-4 w-4" />
            System Settings
          </TabButton>
        </div>

        {activeTab === "overview" && (
          <>
            <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              <MetricCard label="Total Admin Users" value={users.length} helper={`${activeUsers} active`} icon={Users} iconClass="bg-blue-500/10 text-blue-400" />
              <MetricCard label="Active Users" value={activeUsers} helper="Current active access" icon={UserCheck} iconClass="bg-emerald-500/10 text-emerald-400" />
              <MetricCard label="Suspended" value={suspendedUsers} helper={`${inactiveUsers} inactive`} icon={UserX} iconClass="bg-red-500/10 text-red-400" />
              <MetricCard label="Security Status" value={settings.twoFactorRequired ? "2FA ON" : "Standard"} helper={settings.loginAlerts ? "Login alerts enabled" : "Login alerts disabled"} icon={LockKeyhole} iconClass="bg-indigo-500/10 text-indigo-400" />
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
              <HealthCard icon={Server} title="Application" status="Operational" description="Frontend services are running normally." />
              <HealthCard icon={Database} title="Database" status="Connected" description="Local demo data store is available." />
              <HealthCard icon={Bell} title="Notifications" status="Enabled" description="Notification preferences are active." />
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
              <div>
                <h2 className="font-semibold">Quick Admin Actions</h2>
                <p className="mt-1 text-sm text-zinc-500">Frequently used system administration controls.</p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <QuickAction icon={<UserCheck className="h-5 w-5" />} title="Manage Users" description="Add or update admin users" onClick={() => setActiveTab("users")} />
                <QuickAction icon={<Settings2 className="h-5 w-5" />} title="System Settings" description="Configure admin preferences" onClick={() => setActiveTab("system")} />
                <QuickAction icon={<Download className="h-5 w-5" />} title="Export Users" description="Download user directory" onClick={exportUsers} />
                <QuickAction icon={<Database className="h-5 w-5" />} title="Run Backup" description="Create latest data backup" onClick={runBackup} />
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70">
              <div className="border-b border-zinc-800 p-5">
                <h2 className="font-semibold">Recent Admin Activity</h2>
                <p className="mt-1 text-sm text-zinc-500">Latest administration and security events</p>
              </div>
              <div className="divide-y divide-zinc-800">
                {activities.slice(0, 8).map((item) => {
                  const Icon = activityIcon(item.type);
                  return (
                    <div key={item.id} className="flex gap-3 p-5 transition hover:bg-zinc-800/20">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-sm font-medium">{item.title}</p>
                          <span className="flex items-center gap-1 text-xs text-zinc-500"><Clock3 className="h-3.5 w-3.5" />{item.time}</span>
                        </div>
                        <p className="mt-1 text-sm text-zinc-500">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {activeTab === "users" && (
          <>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Admin Users</h2>
                <p className="text-sm text-zinc-500">Control administrator-level user access.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={exportUsers} className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-semibold hover:bg-zinc-800"><Download className="h-4 w-4" />Export CSV</button>
                <button onClick={openAddUser} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold hover:bg-blue-500"><Plus className="h-4 w-4" />Add Admin User</button>
              </div>
            </div>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500" />
                </div>
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm outline-none">
                  <option value="ALL">All Roles</option>
                  {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "ALL" | AdminUserStatus)} className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm outline-none">
                  <option value="ALL">All Status</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="SUSPENDED">Suspended</option>
                </select>
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70">
              <div className="border-b border-zinc-800 p-5"><h3 className="font-semibold">User Directory</h3><p className="mt-1 text-xs text-zinc-500">{filteredUsers.length} users found</p></div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-zinc-950/70"><tr className="text-left text-xs uppercase tracking-wide text-zinc-500"><th className="px-5 py-4">User</th><th className="px-5 py-4">Role</th><th className="px-5 py-4">Department</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Last Login</th><th className="px-5 py-4 text-right">Action</th></tr></thead>
                  <tbody className="divide-y divide-zinc-800">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-zinc-800/20">
                        <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 text-sm font-semibold text-blue-400">{getInitials(user.name)}</div><div><p className="font-medium">{user.name}</p><p className="mt-1 text-xs text-zinc-500">{user.email}</p><p className="mt-1 text-[11px] text-zinc-600">{user.id}</p></div></div></td>
                        <td className="px-5 py-4"><span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-300">{user.role}</span></td>
                        <td className="px-5 py-4 text-sm text-zinc-300">{user.department}</td>
                        <td className="px-5 py-4"><StatusBadge status={user.status} /></td>
                        <td className="px-5 py-4 text-sm text-zinc-400">{user.lastLogin}</td>
                        <td className="relative px-5 py-4 text-right">
                          <button onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === user.id ? null : user.id); }} className="rounded-lg p-2 hover:bg-zinc-800"><MoreVertical className="h-4 w-4" /></button>
                          {openMenu === user.id && <div onClick={(e) => e.stopPropagation()} className="absolute right-5 top-12 z-40 w-48 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">
                            <ActionButton icon={<Eye className="h-4 w-4" />} label="View Details" onClick={() => { setSelectedUser(user); setShowUserView(true); setOpenMenu(null); }} />
                            <ActionButton icon={<Pencil className="h-4 w-4" />} label="Edit User" onClick={() => openEditUser(user)} />
                            <ActionButton icon={user.status === "ACTIVE" ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />} label={user.status === "ACTIVE" ? "Make Inactive" : "Make Active"} onClick={() => toggleStatus(user)} />
                            {user.role !== "Administrator" && user.status !== "SUSPENDED" && <ActionButton icon={<LockKeyhole className="h-4 w-4" />} label="Suspend User" onClick={() => suspendUser(user)} />}
                            <ActionButton danger icon={<Trash2 className="h-4 w-4" />} label="Delete User" onClick={() => deleteUser(user)} />
                          </div>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && <EmptyState icon={<Users className="h-10 w-10" />} title="No users found" description="Try changing your search or filters." />}
              </div>
            </section>
          </>
        )}

        {activeTab === "system" && (
          <>
            <section className="grid gap-4 lg:grid-cols-2">
              <SettingCard icon={AlertTriangle} title="Maintenance Mode" description="Temporarily restrict normal user access while system work is in progress." enabled={settings.maintenanceMode} onChange={(value) => setSettings((current) => ({ ...current, maintenanceMode: value }))} danger />
              <SettingCard icon={Mail} title="Email Notifications" description="Allow TIVRA to generate administrative email alerts." enabled={settings.emailNotifications} onChange={(value) => setSettings((current) => ({ ...current, emailNotifications: value }))} />
              <SettingCard icon={Bell} title="Login Alerts" description="Show or record notifications when an administrator logs in." enabled={settings.loginAlerts} onChange={(value) => setSettings((current) => ({ ...current, loginAlerts: value }))} />
              <SettingCard icon={Database} title="Automatic Backup" description="Keep automatic backup enabled for routine data protection." enabled={settings.autoBackup} onChange={(value) => setSettings((current) => ({ ...current, autoBackup: value }))} />
              <SettingCard icon={KeyRound} title="Require Two-Factor Authentication" description="Require additional sign-in verification for administrator accounts." enabled={settings.twoFactorRequired} onChange={(value) => setSettings((current) => ({ ...current, twoFactorRequired: value }))} />
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="flex items-start gap-3"><div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400"><Database className="h-5 w-5" /></div><div><h3 className="font-semibold">Data Backup</h3><p className="mt-1 text-sm text-zinc-500">Create a frontend demo backup event.</p><p className="mt-2 text-xs text-zinc-400">{backupStatus}</p></div></div><button onClick={runBackup} className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-semibold hover:bg-zinc-700"><Database className="h-4 w-4" />Run Backup</button></div></section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="flex items-start gap-3"><div className="rounded-xl bg-blue-500/10 p-3 text-blue-400"><RefreshCw className="h-5 w-5" /></div><div><h3 className="font-semibold">System Synchronization</h3><p className="mt-1 text-sm text-zinc-500">Trigger a frontend demo sync event.</p></div></div><button onClick={runSync} disabled={syncing} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"><RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />{syncing ? "Synchronizing..." : "Synchronize Now"}</button></div></section>

            <div className="flex justify-end gap-3"><button onClick={() => setSettings({ maintenanceMode: false, emailNotifications: true, loginAlerts: true, autoBackup: true, twoFactorRequired: false })} className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-semibold hover:bg-zinc-800"><RotateCcw className="h-4 w-4" />Reset</button><button onClick={saveSystemSettings} disabled={savingSettings} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold hover:bg-blue-500 disabled:opacity-60"><Save className="h-4 w-4" />{savingSettings ? "Saving..." : "Save Settings"}</button></div>
          </>
        )}
      </div>

      {showUserForm && <ModalOverlay onClose={() => { setShowUserForm(false); setEditingUser(null); }}><div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"><ModalHeader title={editingUser ? "Edit Admin User" : "Add Admin User"} subtitle="Manage administrator directory information." onClose={() => { setShowUserForm(false); setEditingUser(null); }} /><div className="space-y-5 p-6"><div className="grid gap-4 md:grid-cols-2"><Input label="Full Name" value={userForm.name} onChange={(value) => setUserForm((current) => ({ ...current, name: value }))} placeholder="Enter user name" /><Input label="Email" type="email" value={userForm.email} onChange={(value) => setUserForm((current) => ({ ...current, email: value }))} placeholder="user@company.com" /><SelectField label="Role" value={userForm.role} options={roles} onChange={(value) => setUserForm((current) => ({ ...current, role: value }))} /><SelectField label="Department" value={userForm.department} options={departments} onChange={(value) => setUserForm((current) => ({ ...current, department: value }))} /><SelectField label="Status" value={userForm.status} options={["ACTIVE", "INACTIVE", "SUSPENDED"]} displayLabels={{ ACTIVE: "Active", INACTIVE: "Inactive", SUSPENDED: "Suspended" }} onChange={(value) => setUserForm((current) => ({ ...current, status: value as AdminUserStatus }))} /></div>{userForm.role === "Administrator" && <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-300">Administrator accounts have full access. Use this role carefully.</div>}<div className="flex justify-end gap-3 border-t border-zinc-800 pt-5"><button onClick={() => { setShowUserForm(false); setEditingUser(null); }} className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-semibold hover:bg-zinc-800">Cancel</button><button onClick={saveUser} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold hover:bg-blue-500"><Save className="h-4 w-4" />{editingUser ? "Save Changes" : "Create User"}</button></div></div></div></ModalOverlay>}

      {showUserView && selectedUser && <ModalOverlay onClose={() => setShowUserView(false)}><div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"><ModalHeader title="Admin User Details" subtitle={selectedUser.id} onClose={() => setShowUserView(false)} /><div className="space-y-5 p-6"><div className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"><div className="flex h-14 w-14 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 text-lg font-bold text-blue-400">{getInitials(selectedUser.name)}</div><div className="min-w-0"><h3 className="text-lg font-bold">{selectedUser.name}</h3><p className="mt-1 truncate text-sm text-zinc-500">{selectedUser.email}</p></div><div className="ml-auto"><StatusBadge status={selectedUser.status} /></div></div><div className="grid gap-3 sm:grid-cols-2"><InfoBox icon={<ShieldCheck className="h-4 w-4" />} label="Role" value={selectedUser.role} /><InfoBox icon={<Users className="h-4 w-4" />} label="Department" value={selectedUser.department} /><InfoBox icon={<Clock3 className="h-4 w-4" />} label="Last Login" value={selectedUser.lastLogin} /><InfoBox icon={<KeyRound className="h-4 w-4" />} label="Access" value={selectedUser.role === "Administrator" ? "Full admin access" : "Role-based access"} /></div><div className="flex justify-end gap-3"><button onClick={() => { setShowUserView(false); openEditUser(selectedUser); }} className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-semibold hover:bg-zinc-800"><Pencil className="h-4 w-4" />Edit User</button><button onClick={() => setShowUserView(false)} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold hover:bg-blue-500">Close</button></div></div></div></ModalOverlay>}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${active ? "border-blue-500 text-blue-400" : "border-transparent text-zinc-500 hover:text-white"}`}>{children}</button>;
}

function MetricCard({ label, value, helper, icon: Icon, iconClass }: { label: string; value: string | number; helper: string; icon: React.ElementType; iconClass: string }) {
  return <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"><div className="flex items-start justify-between"><div><p className="text-xs text-zinc-500">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p><p className="mt-1 text-xs text-zinc-500">{helper}</p></div><div className={`rounded-xl p-3 ${iconClass}`}><Icon className="h-5 w-5" /></div></div></div>;
}

function HealthCard({ icon: Icon, title, status, description }: { icon: React.ElementType; title: string; status: string; description: string }) {
  return <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"><div className="flex items-center gap-3"><div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400"><Icon className="h-5 w-5" /></div><div><p className="font-semibold">{title}</p><p className="mt-1 text-xs text-emerald-400">{status}</p></div><CheckCircle2 className="ml-auto h-5 w-5 text-emerald-400" /></div><p className="mt-4 text-sm leading-6 text-zinc-500">{description}</p></div>;
}

function QuickAction({ icon, title, description, onClick }: { icon: React.ReactNode; title: string; description: string; onClick: () => void }) {
  return <button onClick={onClick} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-left transition hover:border-blue-500/30 hover:bg-zinc-900"><div className="flex items-center gap-3"><div className="rounded-xl bg-blue-500/10 p-2 text-blue-400">{icon}</div><div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs text-zinc-500">{description}</p></div></div></button>;
}

function StatusBadge({ status }: { status: AdminUserStatus }) {
  const styles: Record<AdminUserStatus, string> = { ACTIVE: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300", INACTIVE: "border-zinc-700 bg-zinc-800 text-zinc-400", SUSPENDED: "border-red-500/20 bg-red-500/10 text-red-300" };
  const labels: Record<AdminUserStatus, string> = { ACTIVE: "Active", INACTIVE: "Inactive", SUSPENDED: "Suspended" };
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
}

function ActionButton({ icon, label, onClick, danger = false }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return <button onClick={onClick} className={`flex w-full items-center gap-2 px-4 py-3 text-left text-sm transition ${danger ? "text-red-400 hover:bg-red-500/10" : "text-zinc-300 hover:bg-zinc-800"}`}>{icon}{label}</button>;
}

function SettingCard({ icon: Icon, title, description, enabled, onChange, danger = false }: { icon: React.ElementType; title: string; description: string; enabled: boolean; onChange: (value: boolean) => void; danger?: boolean }) {
  return <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"><div className="flex items-start gap-4"><div className={`rounded-xl p-3 ${danger ? "bg-red-500/10 text-red-400" : "bg-blue-500/10 text-blue-400"}`}><Icon className="h-5 w-5" /></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm leading-6 text-zinc-500">{description}</p></div><button onClick={() => onChange(!enabled)} className={`relative h-6 w-11 shrink-0 rounded-full transition ${enabled ? "bg-blue-600" : "bg-zinc-700"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${enabled ? "left-6" : "left-1"}`} /></button></div><div className="mt-4 flex items-center gap-2 text-xs">{enabled ? <><CheckCircle2 className="h-4 w-4 text-emerald-400" /><span className="text-emerald-400">Enabled</span></> : <><XCircle className="h-4 w-4 text-zinc-500" /><span className="text-zinc-500">Disabled</span></>}</div></div></div></div>;
}

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}><div className="w-full" onClick={(e) => e.stopPropagation()}>{children}</div></div>;
}

function ModalHeader({ title, subtitle, onClose }: { title: string; subtitle: string; onClose: () => void }) {
  return <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4"><div><h2 className="font-semibold">{title}</h2><p className="mt-1 text-xs text-zinc-500">{subtitle}</p></div><button onClick={onClose} className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-white"><X className="h-4 w-4" /></button></div>;
}

function Input({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return <div><label className="mb-2 block text-xs text-zinc-500">{label}</label><input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm outline-none focus:border-blue-500" /></div>;
}

function SelectField({ label, value, onChange, options, displayLabels = {} }: { label: string; value: string; onChange: (value: string) => void; options: string[]; displayLabels?: Record<string, string> }) {
  return <div><label className="mb-2 block text-xs text-zinc-500">{label}</label><select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm outline-none focus:border-blue-500">{options.map((option) => <option key={option} value={option}>{displayLabels[option] || option}</option>)}</select></div>;
}

function InfoBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4"><div className="flex items-center gap-2 text-xs text-zinc-500">{icon}{label}</div><p className="mt-2 text-sm font-medium">{value}</p></div>;
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return <div className="p-12 text-center"><div className="mx-auto w-fit text-zinc-600">{icon}</div><p className="mt-3 font-semibold">{title}</p><p className="mt-1 text-sm text-zinc-500">{description}</p></div>;
}
