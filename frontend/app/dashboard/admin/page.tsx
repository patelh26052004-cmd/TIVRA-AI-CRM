"use client";

import { useMemo, useState } from "react";
import {
  Shield,
  Plus,
  Search,
  Edit3,
  Trash2,
  Check,
  X,
  Users,
  Lock,
  Save,
  UserPlus,
  Mail,
  UserCheck,
} from "lucide-react";

type Permission =
  | "dashboard"
  | "leads"
  | "sales"
  | "quotations"
  | "payments"
  | "billing"
  | "projects"
  | "tasks"
  | "campaigns"
  | "analytics"
  | "employees"
  | "notifications"
  | "settings";

type Employee = {
  id: number;
  name: string;
  email: string;
  department: string;
  roleId: number;
  status: "ACTIVE" | "INACTIVE";
};

type Role = {
  id: number;
  name: string;
  description: string;
  system: boolean;
  permissions: Permission[];
};

const permissionLabels: Record<Permission, string> = {
  dashboard: "Dashboard",
  leads: "Lead CRM",
  sales: "Sales Pipeline",
  quotations: "Quotations",
  payments: "Payments",
  billing: "Billing / Invoices",
  projects: "Projects",
  tasks: "Tasks",
  campaigns: "Campaigns",
  analytics: "AI Analytics",
  employees: "Employees & Roles",
  notifications: "Notifications",
  settings: "Settings",
};

const allPermissions = Object.keys(permissionLabels) as Permission[];

const initialRoles: Role[] = [
  {
    id: 1,
    name: "Administrator",
    description: "Full access to all CRM modules and settings.",
    system: true,
    permissions: allPermissions,
  },
  {
    id: 2,
    name: "Manager",
    description: "Manage sales, projects, tasks and reports.",
    system: false,
    permissions: [
      "dashboard",
      "leads",
      "sales",
      "quotations",
      "payments",
      "billing",
      "projects",
      "tasks",
      "analytics",
      "notifications",
    ],
  },
  {
    id: 3,
    name: "Sales",
    description: "Manage leads, sales pipeline and quotations.",
    system: false,
    permissions: [
      "dashboard",
      "leads",
      "sales",
      "quotations",
      "notifications",
    ],
  },
  {
    id: 4,
    name: "Developer",
    description: "Manage assigned projects and development tasks.",
    system: false,
    permissions: [
      "dashboard",
      "projects",
      "tasks",
      "notifications",
    ],
  },
  {
    id: 5,
    name: "Accounts",
    description: "Manage payments and billing operations.",
    system: false,
    permissions: [
      "dashboard",
      "payments",
      "billing",
      "notifications",
    ],
  },
  {
    id: 6,
    name: "Marketing",
    description: "Manage campaigns and marketing analytics.",
    system: false,
    permissions: [
      "dashboard",
      "campaigns",
      "analytics",
      "notifications",
    ],
  },
];

const initialEmployees: Employee[] = [
  {
    id: 1,
    name: "Aarav Mehta",
    email: "aarav@example.com",
    department: "Management",
    roleId: 1,
    status: "ACTIVE",
  },
  {
    id: 2,
    name: "Riya Shah",
    email: "riya@example.com",
    department: "Sales",
    roleId: 2,
    status: "ACTIVE",
  },
  {
    id: 3,
    name: "Dev Patel",
    email: "dev@example.com",
    department: "Development",
    roleId: 4,
    status: "ACTIVE",
  },
  {
    id: 4,
    name: "Mira Joshi",
    email: "mira@example.com",
    department: "QA",
    roleId: 4,
    status: "ACTIVE",
  },
  {
    id: 5,
    name: "Neha Desai",
    email: "neha@example.com",
    department: "HR",
    roleId: 5,
    status: "ACTIVE",
  },
  {
    id: 6,
    name: "Karan Joshi",
    email: "karan@example.com",
    department: "Accounts",
    roleId: 5,
    status: "ACTIVE",
  },
  {
    id: 7,
    name: "Anaya Shah",
    email: "anaya@example.com",
    department: "Marketing",
    roleId: 6,
    status: "ACTIVE",
  },
  {
    id: 8,
    name: "Rahul Mehta",
    email: "rahul@example.com",
    department: "Development",
    roleId: 4,
    status: "ACTIVE",
  },
  {
    id: 9,
    name: "Priya Patel",
    email: "priya@example.com",
    department: "Sales",
    roleId: 3,
    status: "ACTIVE",
  },
  {
    id: 10,
    name: "Kishan Shah",
    email: "kishan@example.com",
    department: "Marketing",
    roleId: 6,
    status: "INACTIVE",
  },
];

export default function AdminPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [employees, setEmployees] =
    useState<Employee[]>(initialEmployees);

  const [search, setSearch] = useState("");

  // Role modal
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] =
    useState<Permission[]>([]);

  // Assign employee modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningRole, setAssigningRole] = useState<Role | null>(null);

  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<
    number[]
  >([]);

  const [employeeSearch, setEmployeeSearch] = useState("");

  const filteredRoles = useMemo(() => {
    return roles.filter((role) =>
      `${role.name} ${role.description}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [roles, search]);

  const activeEmployees = employees.filter(
    (employee) => employee.status === "ACTIVE"
  );

  function getRoleEmployees(roleId: number) {
    return employees.filter(
      (employee) => employee.roleId === roleId
    );
  }

  function openCreateModal() {
    setEditingRole(null);
    setRoleName("");
    setDescription("");
    setSelectedPermissions(["dashboard"]);
    setShowRoleModal(true);
  }

  function openEditModal(role: Role) {
    setEditingRole(role);
    setRoleName(role.name);
    setDescription(role.description);
    setSelectedPermissions(role.permissions);
    setShowRoleModal(true);
  }

  function togglePermission(permission: Permission) {
    setSelectedPermissions((current) =>
      current.includes(permission)
        ? current.filter((item) => item !== permission)
        : [...current, permission]
    );
  }

  function selectAllPermissions() {
    setSelectedPermissions(allPermissions);
  }

  function clearPermissions() {
    setSelectedPermissions([]);
  }

  function saveRole() {
    if (!roleName.trim()) {
      alert("Please enter role name.");
      return;
    }

    if (selectedPermissions.length === 0) {
      alert("Please select at least one permission.");
      return;
    }

    if (editingRole) {
      setRoles((current) =>
        current.map((role) =>
          role.id === editingRole.id
            ? {
                ...role,
                name: roleName.trim(),
                description: description.trim(),
                permissions: selectedPermissions,
              }
            : role
        )
      );
    } else {
      const newRole: Role = {
        id: Date.now(),
        name: roleName.trim(),
        description:
          description.trim() ||
          "Custom role created by administrator.",
        system: false,
        permissions: selectedPermissions,
      };

      setRoles((current) => [...current, newRole]);
    }

    setShowRoleModal(false);
  }

  function deleteRole(role: Role) {
    if (role.system) {
      alert("System roles cannot be deleted.");
      return;
    }

    const roleEmployees = getRoleEmployees(role.id);

    if (roleEmployees.length > 0) {
      alert(
        `This role has ${roleEmployees.length} assigned employee(s). Please reassign them before deleting the role.`
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete "${role.name}" role?`
    );

    if (!confirmed) return;

    setRoles((current) =>
      current.filter((item) => item.id !== role.id)
    );
  }

  // ==========================================
  // ASSIGN EMPLOYEE
  // ==========================================

  function openAssignModal(role: Role) {
    const assignedEmployees = employees
      .filter((employee) => employee.roleId === role.id)
      .map((employee) => employee.id);

    setAssigningRole(role);
    setSelectedEmployeeIds(assignedEmployees);
    setEmployeeSearch("");
    setShowAssignModal(true);
  }

  function toggleEmployee(employeeId: number) {
    setSelectedEmployeeIds((current) => {
      if (current.includes(employeeId)) {
        return current.filter((id) => id !== employeeId);
      }

      return [...current, employeeId];
    });
  }

  const filteredEmployees = useMemo(() => {
    return activeEmployees.filter((employee) =>
      `${employee.name} ${employee.email} ${employee.department}`
        .toLowerCase()
        .includes(employeeSearch.toLowerCase())
    );
  }, [activeEmployees, employeeSearch]);

  function selectAllEmployees() {
    const visibleIds = filteredEmployees.map(
      (employee) => employee.id
    );

    setSelectedEmployeeIds((current) => {
      const combined = new Set([
        ...current,
        ...visibleIds,
      ]);

      return Array.from(combined);
    });
  }

  function clearVisibleEmployees() {
    const visibleIds = new Set(
      filteredEmployees.map((employee) => employee.id)
    );

    setSelectedEmployeeIds((current) =>
      current.filter((id) => !visibleIds.has(id))
    );
  }

  function saveAssignments() {
    if (!assigningRole) return;

    setEmployees((current) =>
      current.map((employee) => {
        // Assign selected employees to this role
        if (selectedEmployeeIds.includes(employee.id)) {
          return {
            ...employee,
            roleId: assigningRole.id,
          };
        }

        // Remove employees that were previously
        // assigned to this role but are now unchecked
        if (employee.roleId === assigningRole.id) {
          return {
            ...employee,
            roleId: 0,
          };
        }

        return employee;
      })
    );

    setShowAssignModal(false);
  }

  const totalActiveEmployees = activeEmployees.length;

  return (
    <div className="min-h-screen bg-[#080b12] text-white">
      <div className="p-6 lg:p-8">

        {/* ==========================================
            HEADER
            ========================================== */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  Admin Panel
                </h1>

                <p className="text-sm text-gray-400">
                  Manage roles, employees and system permissions
                </p>
              </div>

            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            Create Role
          </button>

        </div>

        {/* ==========================================
            STATS
            ========================================== */}

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <StatCard
            icon={<Shield className="h-5 w-5" />}
            title="Total Roles"
            value={roles.length}
          />

          <StatCard
            icon={<Users className="h-5 w-5" />}
            title="Active Employees"
            value={totalActiveEmployees}
          />

          <StatCard
            icon={<Lock className="h-5 w-5" />}
            title="System Roles"
            value={roles.filter((role) => role.system).length}
          />

        </div>

        {/* ==========================================
            SEARCH
            ========================================== */}

        <div className="mt-7 rounded-2xl border border-white/10 bg-[#0d111a] p-4">

          <div className="relative">

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roles..."
              className="w-full rounded-xl border border-white/10 bg-[#080b12] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
            />

          </div>

        </div>

        {/* ==========================================
            ROLE CARDS
            ========================================== */}

        <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">

          {filteredRoles.map((role) => {

            const roleEmployees =
              getRoleEmployees(role.id);

            return (
              <div
                key={role.id}
                className="rounded-2xl border border-white/10 bg-[#0d111a] p-5"
              >

                {/* Role Header */}

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-start gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                      <Shield className="h-5 w-5 text-blue-400" />
                    </div>

                    <div>

                      <div className="flex flex-wrap items-center gap-2">

                        <h2 className="font-semibold">
                          {role.name}
                        </h2>

                        {role.system && (
                          <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2 py-1 text-[10px] font-medium text-purple-300">
                            SYSTEM
                          </span>
                        )}

                      </div>

                      <p className="mt-1 text-sm text-gray-400">
                        {role.description}
                      </p>

                    </div>

                  </div>

                  <div className="flex shrink-0 items-center gap-2">

                    <button
                      onClick={() => openEditModal(role)}
                      className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
                      title="Edit Role"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => deleteRole(role)}
                      disabled={role.system}
                      className={`rounded-lg border border-white/10 p-2 transition ${
                        role.system
                          ? "cursor-not-allowed text-gray-700"
                          : "text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                      }`}
                      title="Delete Role"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                  </div>

                </div>

                {/* ==========================================
                    ASSIGNED EMPLOYEES
                    ========================================== */}

                <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-4">

                  <div className="flex items-center justify-between gap-3">

                    <div>

                      <div className="flex items-center gap-2">

                        <Users className="h-4 w-4 text-blue-400" />

                        <span className="text-sm font-medium">
                          Assigned Employees
                        </span>

                      </div>

                      <p className="mt-1 text-xs text-gray-500">
                        {roleEmployees.length} employee
                        {roleEmployees.length !== 1 ? "s" : ""} assigned
                      </p>

                    </div>

                    <button
                      onClick={() => openAssignModal(role)}
                      className="flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs font-medium text-blue-300 transition hover:bg-blue-500/20"
                    >
                      <UserPlus className="h-4 w-4" />
                      Assign Employee
                    </button>

                  </div>

                  {roleEmployees.length > 0 ? (

                    <div className="mt-3 flex flex-wrap gap-2">

                      {roleEmployees
                        .slice(0, 4)
                        .map((employee) => (

                          <div
                            key={employee.id}
                            className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#080b12] px-2.5 py-2"
                          >

                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/10 text-xs font-semibold text-blue-300">
                              {employee.name
                                .split(" ")
                                .map((part) => part[0])
                                .join("")
                                .slice(0, 2)}
                            </div>

                            <span className="text-xs text-gray-300">
                              {employee.name}
                            </span>

                          </div>

                        ))}

                      {roleEmployees.length > 4 && (

                        <div className="flex items-center rounded-lg border border-white/10 bg-[#080b12] px-3 py-2 text-xs text-gray-500">
                          +{roleEmployees.length - 4} more
                        </div>

                      )}

                    </div>

                  ) : (

                    <div className="mt-3 rounded-lg border border-dashed border-white/10 p-3 text-center">

                      <p className="text-xs text-gray-500">
                        No employees assigned to this role.
                      </p>

                    </div>

                  )}

                </div>

                {/* ==========================================
                    PERMISSIONS
                    ========================================== */}

                <div className="mt-4">

                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                    Permissions
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {role.permissions
                      .slice(0, 7)
                      .map((permission) => (

                        <span
                          key={permission}
                          className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-gray-300"
                        >
                          {permissionLabels[permission]}
                        </span>

                      ))}

                    {role.permissions.length > 7 && (

                      <span className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-1.5 text-xs text-blue-300">
                        +{role.permissions.length - 7} more
                      </span>

                    )}

                  </div>

                </div>

              </div>
            );

          })}

          {filteredRoles.length === 0 && (

            <div className="xl:col-span-2 rounded-2xl border border-dashed border-white/10 py-16 text-center">

              <Shield className="mx-auto h-10 w-10 text-gray-600" />

              <p className="mt-3 text-sm text-gray-400">
                No roles found.
              </p>

            </div>

          )}

        </div>

      </div>

      {/* =====================================================
          CREATE / EDIT ROLE MODAL
          ===================================================== */}

      {showRoleModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0d111a]">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-white/10 p-5">

              <div>

                <h2 className="text-lg font-semibold">
                  {editingRole
                    ? "Edit Role"
                    : "Create New Role"}
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Configure role access and permissions.
                </p>

              </div>

              <button
                onClick={() => setShowRoleModal(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Form */}

            <div className="space-y-5 p-5">

              <div>

                <label className="mb-2 block text-sm text-gray-300">
                  Role Name
                </label>

                <input
                  value={roleName}
                  onChange={(e) =>
                    setRoleName(e.target.value)
                  }
                  placeholder="Example: Sales Manager"
                  className="w-full rounded-xl border border-white/10 bg-[#080b12] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-500"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm text-gray-300">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Describe what this role is responsible for..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#080b12] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-500"
                />

              </div>

              {/* Permissions */}

              <div>

                <div className="mb-3 flex items-center justify-between">

                  <div>

                    <h3 className="text-sm font-semibold">
                      Module Permissions
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Select the modules this role can access.
                    </p>

                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={selectAllPermissions}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/5"
                    >
                      Select All
                    </button>

                    <button
                      onClick={clearPermissions}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 hover:bg-white/5"
                    >
                      Clear
                    </button>

                  </div>

                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

                  {allPermissions.map((permission) => {

                    const selected =
                      selectedPermissions.includes(
                        permission
                      );

                    return (

                      <button
                        key={permission}
                        onClick={() =>
                          togglePermission(permission)
                        }
                        className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${
                          selected
                            ? "border-blue-500/40 bg-blue-500/10"
                            : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                        }`}
                      >

                        <span
                          className={`text-sm ${
                            selected
                              ? "text-blue-300"
                              : "text-gray-300"
                          }`}
                        >
                          {permissionLabels[permission]}
                        </span>

                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                            selected
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-600"
                          }`}
                        >

                          {selected && (
                            <Check className="h-3.5 w-3.5 text-white" />
                          )}

                        </div>

                      </button>

                    );
                  })}

                </div>

              </div>

            </div>

            {/* Footer */}

            <div className="flex justify-end gap-3 border-t border-white/10 p-5">

              <button
                onClick={() => setShowRoleModal(false)}
                className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-gray-300 hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                onClick={saveRole}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold hover:bg-blue-500"
              >
                <Save className="h-4 w-4" />

                {editingRole
                  ? "Save Changes"
                  : "Create Role"}
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          ASSIGN EMPLOYEE MODAL
          ===================================================== */}

      {showAssignModal && assigningRole && (

        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0d111a]">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-white/10 p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                  <UserPlus className="h-5 w-5 text-blue-400" />
                </div>

                <div>

                  <h2 className="text-lg font-semibold">
                    Assign Employee
                  </h2>

                  <p className="text-sm text-gray-400">

                    Role:{" "}

                    <span className="text-blue-300">
                      {assigningRole.name}
                    </span>

                  </p>

                </div>

              </div>

              <button
                onClick={() =>
                  setShowAssignModal(false)
                }
                className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Assignment Summary */}

            <div className="border-b border-white/10 p-5">

              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm font-medium">
                      Selected Employees
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Select employees who should have this role.
                    </p>

                  </div>

                  <div className="text-2xl font-bold text-blue-400">
                    {selectedEmployeeIds.length}
                  </div>

                </div>

              </div>

              {/* Search */}

              <div className="relative mt-4">

                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                <input
                  value={employeeSearch}
                  onChange={(e) =>
                    setEmployeeSearch(e.target.value)
                  }
                  placeholder="Search employees..."
                  className="w-full rounded-xl border border-white/10 bg-[#080b12] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
                />

              </div>

              {/* Select buttons */}

              <div className="mt-3 flex gap-2">

                <button
                  onClick={selectAllEmployees}
                  className="rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-300 hover:bg-white/5"
                >
                  Select All
                </button>

                <button
                  onClick={clearVisibleEmployees}
                  className="rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-400 hover:bg-white/5"
                >
                  Clear Visible
                </button>

              </div>

            </div>

            {/* Employee List */}

            <div className="max-h-[430px] overflow-y-auto p-5">

              <div className="space-y-2">

                {filteredEmployees.map((employee) => {

                  const selected =
                    selectedEmployeeIds.includes(
                      employee.id
                    );

                  const currentRole = roles.find(
                    (role) =>
                      role.id === employee.roleId
                  );

                  return (

                    <button
                      key={employee.id}
                      onClick={() =>
                        toggleEmployee(employee.id)
                      }
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                        selected
                          ? "border-blue-500/40 bg-blue-500/10"
                          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                    >

                      {/* Checkbox */}

                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                          selected
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-600"
                        }`}
                      >

                        {selected && (
                          <Check className="h-3.5 w-3.5 text-white" />
                        )}

                      </div>

                      {/* Avatar */}

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-sm font-semibold text-blue-300">

                        {employee.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}

                      </div>

                      {/* Employee Details */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <p className="truncate text-sm font-medium text-white">
                            {employee.name}
                          </p>

                          {selected && (

                            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-300">
                              SELECTED
                            </span>

                          )}

                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">

                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {employee.email}
                          </span>

                          <span>
                            {employee.department}
                          </span>

                        </div>

                      </div>

                      {/* Current Role */}

                      <div className="hidden text-right sm:block">

                        <p className="text-[10px] uppercase tracking-wider text-gray-600">
                          Current Role
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {currentRole?.name ||
                            "Unassigned"}
                        </p>

                      </div>

                    </button>

                  );
                })}

                {filteredEmployees.length === 0 && (

                  <div className="py-12 text-center">

                    <Users className="mx-auto h-9 w-9 text-gray-600" />

                    <p className="mt-3 text-sm text-gray-400">
                      No active employees found.
                    </p>

                  </div>

                )}

              </div>

            </div>

            {/* Footer */}

            <div className="flex items-center justify-between border-t border-white/10 p-5">

              <div className="flex items-center gap-2 text-xs text-gray-500">

                <UserCheck className="h-4 w-4" />

                {selectedEmployeeIds.length} employee
                {selectedEmployeeIds.length !== 1
                  ? "s"
                  : ""}{" "}
                selected

              </div>

              <div className="flex gap-3">

                <button
                  onClick={() =>
                    setShowAssignModal(false)
                  }
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  onClick={saveAssignments}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold hover:bg-blue-500"
                >
                  <Save className="h-4 w-4" />
                  Save Assignment
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d111a] p-5">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          {icon}
        </div>

        <span className="text-2xl font-bold">
          {value}
        </span>

      </div>

      <p className="mt-4 text-sm text-gray-400">
        {title}
      </p>

    </div>
  );
}