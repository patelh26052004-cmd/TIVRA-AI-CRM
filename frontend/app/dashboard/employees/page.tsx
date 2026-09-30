"use client";

import { useMemo, useState } from "react";
import { usePersistentState } from "@/lib/persistence";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  ShieldCheck,
  Building2,
  CheckCircle2,
  XCircle,
  X,
  Plus,
  KeyRound,
} from "lucide-react";

type EmployeeStatus = "ACTIVE" | "INACTIVE";

type Employee = {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: EmployeeStatus;
  joiningDate: string;
  location: string;
  notes: string;
};

type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
};

const departments = [
  "Management",
  "Sales",
  "Development",
  "QA",
  "Marketing",
  "HR",
  "Accounts",
];

const permissionList = [
  "View Dashboard",
  "Manage Leads",
  "Manage Sales Pipeline",
  "Manage Quotations",
  "Manage Payments",
  "Manage Billing / Invoices",
  "Manage Projects",
  "Manage Tasks",
  "Manage Employees",
  "Manage Roles & Permissions",
  "Manage Campaigns",
  "View AI Analytics",
  "Manage Notifications",
  "Manage Settings",
];

const initialRoles: Role[] = [
  {
    id: "ROLE-001",
    name: "Administrator",
    description:
      "Full access to CRM modules, employees and settings.",
    permissions: permissionList,
  },
  {
    id: "ROLE-002",
    name: "Sales Manager",
    description:
      "Manage leads, pipeline, quotations, payments and customers.",
    permissions: [
      "View Dashboard",
      "Manage Leads",
      "Manage Sales Pipeline",
      "Manage Quotations",
      "Manage Payments",
      "Manage Billing / Invoices",
      "Manage Notifications",
    ],
  },
  {
    id: "ROLE-003",
    name: "Developer",
    description:
      "Manage projects and development tasks.",
    permissions: [
      "View Dashboard",
      "Manage Projects",
      "Manage Tasks",
      "Manage Notifications",
    ],
  },
  {
    id: "ROLE-004",
    name: "QA",
    description:
      "Manage QA tasks and project review activities.",
    permissions: [
      "View Dashboard",
      "Manage Projects",
      "Manage Tasks",
      "Manage Notifications",
    ],
  },
  {
    id: "ROLE-005",
    name: "Digital Marketing",
    description:
      "Manage campaigns and marketing activities.",
    permissions: [
      "View Dashboard",
      "Manage Leads",
      "Manage Campaigns",
      "View AI Analytics",
      "Manage Notifications",
    ],
  },
];

const initialEmployees: Employee[] = [
  {
    id: "EMP-001",
    employeeCode: "EMP-2026-001",
    name: "Ashutosh",
    email: "ashutosh@company.com",
    phone: "+91 90000 00001",
    department: "Management",
    role: "Administrator",
    status: "ACTIVE",
    joiningDate: "2025-01-10",
    location: "India",
    notes: "Company administrator.",
  },
  {
    id: "EMP-002",
    employeeCode: "EMP-2026-002",
    name: "Saloni Mehta",
    email: "saloni@company.com",
    phone: "+91 90000 00002",
    department: "Sales",
    role: "Sales Manager",
    status: "ACTIVE",
    joiningDate: "2025-04-12",
    location: "India",
    notes: "Handles sales and quotations.",
  },
  {
    id: "EMP-003",
    employeeCode: "EMP-2026-003",
    name: "Hetvi Shah",
    email: "hetvi@company.com",
    phone: "+91 90000 00003",
    department: "Development",
    role: "Developer",
    status: "ACTIVE",
    joiningDate: "2025-06-15",
    location: "India",
    notes: "Development and project activities.",
  },
  {
    id: "EMP-004",
    employeeCode: "EMP-2026-004",
    name: "Dev Patel",
    email: "dev@company.com",
    phone: "+91 90000 00004",
    department: "Development",
    role: "Developer",
    status: "ACTIVE",
    joiningDate: "2025-07-01",
    location: "India",
    notes: "Software development.",
  },
  {
    id: "EMP-005",
    employeeCode: "EMP-2026-005",
    name: "Hasti Patel",
    email: "hasti@company.com",
    phone: "+91 90000 00005",
    department: "QA",
    role: "QA",
    status: "ACTIVE",
    joiningDate: "2025-07-20",
    location: "India",
    notes: "Quality assurance and testing.",
  },
  {
    id: "EMP-006",
    employeeCode: "EMP-2026-006",
    name: "Kashis Patel",
    email: "kashis@company.com",
    phone: "+91 90000 00006",
    department: "Marketing",
    role: "Digital Marketing",
    status: "ACTIVE",
    joiningDate: "2025-08-05",
    location: "India",
    notes: "Digital marketing activities.",
  },
  {
    id: "EMP-007",
    employeeCode: "EMP-2026-007",
    name: "Hinal Patel",
    email: "hinal@company.com",
    phone: "+91 90000 00007",
    department: "Marketing",
    role: "Digital Marketing",
    status: "ACTIVE",
    joiningDate: "2025-08-10",
    location: "India",
    notes: "Digital marketing activities.",
  },
];

const emptyEmployee: Employee = {
  id: "",
  employeeCode: "",
  name: "",
  email: "",
  phone: "",
  department: "",
  role: "",
  status: "ACTIVE",
  joiningDate: "",
  location: "",
  notes: "",
};

const emptyRole: Role = {
  id: "",
  name: "",
  description: "",
  permissions: [],
};

export default function EmployeesPage() {
  const [employees, setEmployees] =
    usePersistentState<Employee[]>("tivra_employees", initialEmployees);

  const [roles, setRoles] =
    usePersistentState<Role[]>("tivra_roles", initialRoles);

  const [activeTab, setActiveTab] = useState<
    "employees" | "roles"
  >("employees");

  const [search, setSearch] = useState("");

  const [departmentFilter, setDepartmentFilter] =
    useState("ALL");

  const [roleFilter, setRoleFilter] =
    useState("ALL");

  const [statusFilter, setStatusFilter] =
    useState<"ALL" | EmployeeStatus>("ALL");

  const [openMenu, setOpenMenu] =
    useState<string | null>(null);

  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

  const [showEmployeeView, setShowEmployeeView] =
    useState(false);

  const [editingEmployee, setEditingEmployee] =
    useState<Employee | null>(null);

  const [showEmployeeForm, setShowEmployeeForm] =
    useState(false);

  const [deleteEmployeeId, setDeleteEmployeeId] =
    useState<string | null>(null);

  const [selectedRole, setSelectedRole] =
    useState<Role | null>(null);

  const [showRoleView, setShowRoleView] =
    useState(false);

  const [editingRole, setEditingRole] =
    useState<Role | null>(null);

  const [showRoleForm, setShowRoleForm] =
    useState(false);

  const [deleteRoleId, setDeleteRoleId] =
    useState<string | null>(null);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const query = search.toLowerCase();

      const matchesSearch =
        employee.name.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.employeeCode
          .toLowerCase()
          .includes(query) ||
        employee.department
          .toLowerCase()
          .includes(query) ||
        employee.role.toLowerCase().includes(query);

      const matchesDepartment =
        departmentFilter === "ALL" ||
        employee.department === departmentFilter;

      const matchesRole =
        roleFilter === "ALL" ||
        employee.role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        employee.status === statusFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    employees,
    search,
    departmentFilter,
    roleFilter,
    statusFilter,
  ]);

  const activeEmployees = employees.filter(
    (employee) => employee.status === "ACTIVE"
  ).length;

  const inactiveEmployees = employees.filter(
    (employee) => employee.status === "INACTIVE"
  ).length;

  const departmentCount = new Set(
    employees.map((employee) => employee.department)
  ).size;

  const deleteEmployee = (id: string) => {
    setEmployees((prev) =>
      prev.filter((employee) => employee.id !== id)
    );

    setDeleteEmployeeId(null);
  };

  const toggleEmployeeStatus = (id: string) => {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === id
          ? {
              ...employee,
              status:
                employee.status === "ACTIVE"
                  ? "INACTIVE"
                  : "ACTIVE",
            }
          : employee
      )
    );

    setOpenMenu(null);
  };

  const saveEmployee = (employee: Employee) => {
    if (!employee.name.trim()) {
      alert("Please enter employee name.");
      return;
    }

    if (!employee.email.trim()) {
      alert("Please enter employee email.");
      return;
    }

    if (!employee.department) {
      alert("Please select department.");
      return;
    }

    if (!employee.role) {
      alert("Please select role.");
      return;
    }

    if (employee.id) {
      setEmployees((prev) =>
        prev.map((item) =>
          item.id === employee.id ? employee : item
        )
      );
    } else {
      setEmployees((prev) => [
        ...prev,
        {
          ...employee,
          id: `EMP-${Date.now()}`,
          employeeCode:
            employee.employeeCode ||
            `EMP-2026-${String(
              prev.length + 1
            ).padStart(3, "0")}`,
        },
      ]);
    }

    setShowEmployeeForm(false);
    setEditingEmployee(null);
  };

  const saveRole = (role: Role) => {
    if (!role.name.trim()) {
      alert("Please enter role name.");
      return;
    }

    if (!role.description.trim()) {
      alert("Please enter role description.");
      return;
    }

    if (role.id) {
      const oldRole = roles.find(
        (item) => item.id === role.id
      );

      setRoles((prev) =>
        prev.map((item) =>
          item.id === role.id ? role : item
        )
      );

      if (oldRole) {
        setEmployees((prev) =>
          prev.map((employee) =>
            employee.role === oldRole.name
              ? {
                  ...employee,
                  role: role.name,
                }
              : employee
          )
        );
      }
    } else {
      setRoles((prev) => [
        ...prev,
        {
          ...role,
          id: `ROLE-${Date.now()}`,
        },
      ]);
    }

    setShowRoleForm(false);
    setEditingRole(null);
  };

  const deleteRole = (id: string) => {
    const role = roles.find(
      (item) => item.id === id
    );

    if (!role) return;

    const assignedEmployees = employees.filter(
      (employee) => employee.role === role.name
    );

    if (assignedEmployees.length > 0) {
      alert(
        `"${role.name}" cannot be deleted because ${assignedEmployees.length} employee(s) are assigned to this role. Reassign them first.`
      );
      return;
    }

    setRoles((prev) =>
      prev.filter((item) => item.id !== id)
    );

    setDeleteRoleId(null);
  };

  const roleEmployeeCount = (roleName: string) => {
    return employees.filter(
      (employee) =>
        employee.role === roleName
    ).length;
  };

  const roleNames = roles.map(
    (role) => role.name
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="p-4 md:p-6 lg:p-8 space-y-6">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-400" />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Employees & Roles
              </h1>

              <p className="text-sm text-zinc-400">
                Manage employees, departments, roles and permissions
              </p>
            </div>
          </div>

          {activeTab === "employees" ? (
            <button
              onClick={() => {
                setEditingEmployee({
                  ...emptyEmployee,
                });
                setShowEmployeeForm(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-3 text-sm font-semibold"
            >
              <UserPlus className="h-4 w-4" />
              Add Employee
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingRole({
                  ...emptyRole,
                });
                setShowRoleForm(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-3 text-sm font-semibold"
            >
              <Plus className="h-4 w-4" />
              Create Role
            </button>
          )}
        </div>

        {/* TABS */}
        <div className="flex gap-2 border-b border-zinc-800">
          <button
            onClick={() =>
              setActiveTab("employees")
            }
            className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 ${
              activeTab === "employees"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-zinc-500 hover:text-white"
            }`}
          >
            <Users className="h-4 w-4" />
            Employees
          </button>

          <button
            onClick={() =>
              setActiveTab("roles")
            }
            className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 ${
              activeTab === "roles"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-zinc-500 hover:text-white"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Roles & Permissions
          </button>
        </div>

        {/* EMPLOYEES TAB */}
        {activeTab === "employees" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="Total Employees"
                value={employees.length}
                icon={Users}
              />

              <StatCard
                title="Active"
                value={activeEmployees}
                icon={CheckCircle2}
              />

              <StatCard
                title="Inactive"
                value={inactiveEmployees}
                icon={XCircle}
              />

              <StatCard
                title="Departments"
                value={departmentCount}
                icon={Building2}
              />
            </div>

            {/* FILTERS */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-4 w-4 text-zinc-400" />

                <span className="text-sm font-medium">
                  Employee Filters
                </span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />

                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search employee..."
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <select
                  value={departmentFilter}
                  onChange={(e) =>
                    setDepartmentFilter(
                      e.target.value
                    )
                  }
                  className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm outline-none"
                >
                  <option value="ALL">
                    All Departments
                  </option>

                  {departments.map(
                    (department) => (
                      <option
                        key={department}
                        value={department}
                      >
                        {department}
                      </option>
                    )
                  )}
                </select>

                <select
                  value={roleFilter}
                  onChange={(e) =>
                    setRoleFilter(e.target.value)
                  }
                  className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm outline-none"
                >
                  <option value="ALL">
                    All Roles
                  </option>

                  {roleNames.map((role) => (
                    <option
                      key={role}
                      value={role}
                    >
                      {role}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value as
                        | "ALL"
                        | EmployeeStatus
                    )
                  }
                  className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm outline-none"
                >
                  <option value="ALL">
                    All Status
                  </option>

                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="INACTIVE">
                    Inactive
                  </option>
                </select>
              </div>
            </div>

            {/* EMPLOYEE TABLE */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-800">
                <h2 className="font-semibold">
                  Employee List
                </h2>

                <p className="text-xs text-zinc-500 mt-1">
                  {filteredEmployees.length} employees found
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px]">
                  <thead className="bg-zinc-950/70">
                    <tr className="text-left text-xs uppercase tracking-wide text-zinc-500">
                      <th className="px-5 py-4">
                        Employee
                      </th>

                      <th className="px-5 py-4">
                        Department
                      </th>

                      <th className="px-5 py-4">
                        Role
                      </th>

                      <th className="px-5 py-4">
                        Contact
                      </th>

                      <th className="px-5 py-4">
                        Joining Date
                      </th>

                      <th className="px-5 py-4">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-zinc-800">
                    {filteredEmployees.map(
                      (employee) => (
                        <tr
                          key={employee.id}
                          className="hover:bg-zinc-800/30"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                <span className="text-sm font-semibold text-blue-400">
                                  {employee.name
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              </div>

                              <div>
                                <p className="text-sm font-medium">
                                  {employee.name}
                                </p>

                                <p className="text-xs text-zinc-500 mt-1">
                                  {employee.employeeCode}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-sm">
                            {employee.department}
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                              {employee.role}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm">
                              {employee.email}
                            </p>

                            <p className="text-xs text-zinc-500 mt-1">
                              {employee.phone}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm text-zinc-400">
                            {formatDate(
                              employee.joiningDate
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs ${
                                employee.status ===
                                "ACTIVE"
                                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                                  : "border-zinc-700 bg-zinc-800 text-zinc-400"
                              }`}
                            >
                              {employee.status}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right relative">
                            <button
                              onClick={() =>
                                setOpenMenu(
                                  openMenu ===
                                    employee.id
                                    ? null
                                    : employee.id
                                )
                              }
                              className="p-2 rounded-lg hover:bg-zinc-800"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>

                            {openMenu ===
                              employee.id && (
                              <div className="absolute right-5 top-12 z-30 w-48 rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
                                <button
                                  onClick={() => {
                                    setSelectedEmployee(
                                      employee
                                    );
                                    setShowEmployeeView(
                                      true
                                    );
                                    setOpenMenu(null);
                                  }}
                                  className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-zinc-800"
                                >
                                  <Eye className="h-4 w-4" />
                                  View
                                </button>

                                <button
                                  onClick={() => {
                                    setEditingEmployee(
                                      employee
                                    );
                                    setShowEmployeeForm(
                                      true
                                    );
                                    setOpenMenu(null);
                                  }}
                                  className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-zinc-800"
                                >
                                  <Edit3 className="h-4 w-4" />
                                  Edit
                                </button>

                                <button
                                  onClick={() =>
                                    toggleEmployeeStatus(
                                      employee.id
                                    )
                                  }
                                  className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-zinc-800"
                                >
                                  {employee.status ===
                                  "ACTIVE" ? (
                                    <>
                                      <XCircle className="h-4 w-4" />
                                      Make Inactive
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 className="h-4 w-4" />
                                      Make Active
                                    </>
                                  )}
                                </button>

                                <button
                                  onClick={() => {
                                    setDeleteEmployeeId(
                                      employee.id
                                    );
                                    setOpenMenu(null);
                                  }}
                                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ROLES TAB */}
        {activeTab === "roles" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard
                title="Total Roles"
                value={roles.length}
                icon={ShieldCheck}
              />

              <StatCard
                title="Permission Types"
                value={permissionList.length}
                icon={KeyRound}
              />

              <StatCard
                title="Employees"
                value={employees.length}
                icon={Users}
              />
            </div>

            {/* ROLE CARDS */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {roles.map((role) => {
                const employeeCount =
                  roleEmployeeCount(role.name);

                return (
                  <div
                    key={role.id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                          <ShieldCheck className="h-5 w-5 text-blue-400" />
                        </div>

                        <div>
                          <h3 className="font-semibold">
                            {role.name}
                          </h3>

                          <p className="text-xs text-zinc-500 mt-1">
                            {employeeCount} employee
                            {employeeCount !== 1
                              ? "s"
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ROLE DESCRIPTION */}
                    <div className="mt-4">
                      <p className="text-xs text-zinc-500 mb-1">
                        Role Description
                      </p>

                      <p className="text-sm text-zinc-400 leading-5">
                        {role.description}
                      </p>
                    </div>

                    {/* PERMISSION COUNT */}
                    <div className="mt-5">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-zinc-500">
                          Permissions
                        </span>

                        <span className="text-blue-400">
                          {role.permissions.length}/
                          {permissionList.length}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {role.permissions
                          .slice(0, 4)
                          .map((permission) => (
                            <span
                              key={permission}
                              className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-[11px] text-zinc-400"
                            >
                              {permission}
                            </span>
                          ))}

                        {role.permissions.length >
                          4 && (
                          <span className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-[11px] text-zinc-500">
                            +
                            {role.permissions.length -
                              4}{" "}
                            more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-2 mt-5 pt-4 border-t border-zinc-800">
                      <button
                        onClick={() => {
                          setSelectedRole(role);
                          setShowRoleView(true);
                        }}
                        className="flex-1 rounded-xl border border-zinc-800 px-3 py-2 text-xs hover:bg-zinc-800"
                      >
                        View Permissions
                      </button>

                      <button
                        onClick={() => {
                          setEditingRole({
                            ...role,
                            permissions: [
                              ...role.permissions,
                            ],
                          });
                          setShowRoleForm(true);
                        }}
                        className="rounded-xl border border-zinc-800 px-3 py-2 hover:bg-zinc-800"
                        title="Edit Role"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>

                      {/* DELETE ROLE */}
                      <button
                        onClick={() =>
                          setDeleteRoleId(role.id)
                        }
                        className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-red-400 hover:bg-red-500/10"
                        title="Delete Role"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* EMPLOYEE VIEW MODAL */}
      {showEmployeeView &&
        selectedEmployee && (
          <Modal
            title="Employee Details"
            onClose={() =>
              setShowEmployeeView(false)
            }
            wide
          >
            <div className="space-y-5">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-blue-400">
                      {selectedEmployee.name
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      {selectedEmployee.name}
                    </h2>

                    <p className="text-sm text-zinc-500">
                      {selectedEmployee.employeeCode}
                    </p>
                  </div>

                  <span
                    className={`ml-auto rounded-full border px-3 py-1 text-xs ${
                      selectedEmployee.status ===
                      "ACTIVE"
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                        : "border-zinc-700 bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {selectedEmployee.status}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <InfoBox title="Contact Information">
                  <InfoRow
                    label="Email"
                    value={
                      selectedEmployee.email
                    }
                  />

                  <InfoRow
                    label="Phone"
                    value={
                      selectedEmployee.phone
                    }
                  />

                  <InfoRow
                    label="Location"
                    value={
                      selectedEmployee.location
                    }
                  />
                </InfoBox>

                <InfoBox title="Organization">
                  <InfoRow
                    label="Department"
                    value={
                      selectedEmployee.department
                    }
                  />

                  <InfoRow
                    label="Role"
                    value={
                      selectedEmployee.role
                    }
                  />

                  <InfoRow
                    label="Joining Date"
                    value={formatDate(
                      selectedEmployee.joiningDate
                    )}
                  />
                </InfoBox>
              </div>

              <InfoBox title="Notes">
                <p className="text-sm text-zinc-400 leading-6">
                  {selectedEmployee.notes ||
                    "No notes available."}
                </p>
              </InfoBox>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowEmployeeView(false);
                    setEditingEmployee({
                      ...selectedEmployee,
                    });
                    setShowEmployeeForm(true);
                  }}
                  className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm hover:bg-zinc-800"
                >
                  Edit Employee
                </button>

                <button
                  onClick={() =>
                    setShowEmployeeView(false)
                  }
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium hover:bg-blue-500"
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
        )}

      {/* EMPLOYEE FORM */}
      {showEmployeeForm &&
        editingEmployee && (
          <EmployeeFormModal
            employee={editingEmployee}
            roles={roles}
            onClose={() => {
              setShowEmployeeForm(false);
              setEditingEmployee(null);
            }}
            onSave={saveEmployee}
          />
        )}

      {/* DELETE EMPLOYEE */}
      {deleteEmployeeId && (
        <Modal
          title="Delete Employee"
          onClose={() =>
            setDeleteEmployeeId(null)
          }
        >
          <p className="text-sm text-zinc-400">
            Are you sure you want to delete this
            employee?
          </p>

          <p className="text-xs text-red-400 mt-2">
            This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() =>
                setDeleteEmployeeId(null)
              }
              className="rounded-xl border border-zinc-700 px-4 py-2.5 text-sm hover:bg-zinc-800"
            >
              Cancel
            </button>

            <button
              onClick={() =>
                deleteEmployee(deleteEmployeeId)
              }
              className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium hover:bg-red-500"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}

      {/* ROLE VIEW */}
      {showRoleView && selectedRole && (
        <Modal
          title="Role & Permissions"
          onClose={() => setShowRoleView(false)}
          wide
        >
          <div className="space-y-5">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-blue-400" />
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    {selectedRole.name}
                  </h2>

                  <p className="text-sm text-zinc-500 mt-1">
                    {selectedRole.description}
                  </p>
                </div>
              </div>
            </div>

            <InfoBox title="All Permission Types">
              <div className="grid md:grid-cols-2 gap-3">
                {permissionList.map(
                  (permission) => {
                    const enabled =
                      selectedRole.permissions.includes(
                        permission
                      );

                    return (
                      <div
                        key={permission}
                        className={`flex items-center gap-3 rounded-xl border p-3 ${
                          enabled
                            ? "border-emerald-500/20 bg-emerald-500/5"
                            : "border-zinc-800 bg-zinc-950"
                        }`}
                      >
                        {enabled ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-zinc-600" />
                        )}

                        <span
                          className={`text-sm ${
                            enabled
                              ? "text-zinc-200"
                              : "text-zinc-600"
                          }`}
                        >
                          {permission}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </InfoBox>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRoleView(false);
                  setEditingRole({
                    ...selectedRole,
                    permissions: [
                      ...selectedRole.permissions,
                    ],
                  });
                  setShowRoleForm(true);
                }}
                className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm hover:bg-zinc-800"
              >
                Edit Role
              </button>

              <button
                onClick={() =>
                  setShowRoleView(false)
                }
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium hover:bg-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ROLE FORM */}
      {showRoleForm && editingRole && (
        <RoleFormModal
          role={editingRole}
          onClose={() => {
            setShowRoleForm(false);
            setEditingRole(null);
          }}
          onSave={saveRole}
        />
      )}

      {/* DELETE ROLE */}
      {deleteRoleId && (
        <Modal
          title="Delete Role"
          onClose={() => setDeleteRoleId(null)}
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <div className="flex gap-3">
                <Trash2 className="h-5 w-5 text-red-400 shrink-0" />

                <div>
                  <p className="text-sm font-medium text-red-300">
                    Delete this role?
                  </p>

                  <p className="text-xs text-zinc-500 mt-1">
                    This action cannot be undone.
                    If employees are assigned to
                    this role, deletion will be blocked.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setDeleteRoleId(null)
                }
                className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm hover:bg-zinc-800"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  deleteRole(deleteRoleId)
                }
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold hover:bg-red-500"
              >
                Delete Role
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ================= EMPLOYEE FORM ================= */

function EmployeeFormModal({
  employee,
  roles,
  onClose,
  onSave,
}: {
  employee: Employee;
  roles: Role[];
  onClose: () => void;
  onSave: (employee: Employee) => void;
}) {
  const [form, setForm] =
    useState<Employee>(employee);

  const update = <K extends keyof Employee>(
    key: K,
    value: Employee[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Modal
      title={
        form.id
          ? "Edit Employee"
          : "Add New Employee"
      }
      onClose={onClose}
      wide
    >
      <div className="space-y-6">
        <FormSection title="Employee Information">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={form.name}
              onChange={(value) =>
                update("name", value)
              }
              placeholder="Enter employee name"
            />

            <Input
              label="Employee Code"
              value={form.employeeCode}
              onChange={(value) =>
                update(
                  "employeeCode",
                  value
                )
              }
              placeholder="EMP-2026-008"
            />

            <Input
              label="Email"
              value={form.email}
              onChange={(value) =>
                update("email", value)
              }
              placeholder="employee@company.com"
              type="email"
            />

            <Input
              label="Phone"
              value={form.phone}
              onChange={(value) =>
                update("phone", value)
              }
              placeholder="+91..."
            />
          </div>
        </FormSection>

        <FormSection title="Organization">
          <div className="grid md:grid-cols-3 gap-4">
            <Select
              label="Department"
              value={form.department}
              onChange={(value) =>
                update(
                  "department",
                  value
                )
              }
              options={departments}
            />

            <Select
              label="Role"
              value={form.role}
              onChange={(value) =>
                update("role", value)
              }
              options={roles.map(
                (role) => role.name
              )}
            />

            <Select
              label="Status"
              value={form.status}
              onChange={(value) =>
                update(
                  "status",
                  value as EmployeeStatus
                )
              }
              options={[
                "ACTIVE",
                "INACTIVE",
              ]}
              displayLabels={{
                ACTIVE: "Active",
                INACTIVE: "Inactive",
              }}
            />
          </div>
        </FormSection>

        <FormSection title="Additional Information">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Joining Date"
              value={form.joiningDate}
              onChange={(value) =>
                update(
                  "joiningDate",
                  value
                )
              }
              type="date"
            />

            <Input
              label="Location"
              value={form.location}
              onChange={(value) =>
                update(
                  "location",
                  value
                )
              }
              placeholder="City / Country"
            />
          </div>

          <div className="mt-4">
            <Textarea
              label="Notes"
              value={form.notes}
              onChange={(value) =>
                update("notes", value)
              }
              placeholder="Add employee notes..."
            />
          </div>
        </FormSection>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm hover:bg-zinc-800"
          >
            Cancel
          </button>

          <button
            onClick={() => onSave(form)}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold hover:bg-blue-500"
          >
            {form.id
              ? "Save Changes"
              : "Create Employee"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ================= ROLE FORM ================= */

function RoleFormModal({
  role,
  onClose,
  onSave,
}: {
  role: Role;
  onClose: () => void;
  onSave: (role: Role) => void;
}) {
  const [form, setForm] =
    useState<Role>(role);

  const togglePermission = (
    permission: string
  ) => {
    setForm((prev) => ({
      ...prev,
      permissions:
        prev.permissions.includes(permission)
          ? prev.permissions.filter(
              (item) => item !== permission
            )
          : [
              ...prev.permissions,
              permission,
            ],
    }));
  };

  return (
    <Modal
      title={
        form.id
          ? "Edit Role"
          : "Create New Role"
      }
      onClose={onClose}
      wide
    >
      <div className="space-y-6">
        <FormSection title="Role Information">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Role Name"
              value={form.name}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  name: value,
                }))
              }
              placeholder="e.g. Sales Executive"
            />

            <Input
              label="Role Description"
              value={form.description}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  description: value,
                }))
              }
              placeholder="Describe this role..."
            />
          </div>
        </FormSection>

        <FormSection title="Permissions">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs text-zinc-500">
              Enable or disable permissions for
              this role.
            </p>

            <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs text-blue-400">
              {form.permissions.length}/
              {permissionList.length} enabled
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {permissionList.map(
              (permission) => {
                const enabled =
                  form.permissions.includes(
                    permission
                  );

                return (
                  <button
                    key={permission}
                    type="button"
                    onClick={() =>
                      togglePermission(
                        permission
                      )
                    }
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                      enabled
                        ? "border-blue-500/30 bg-blue-500/10"
                        : "border-zinc-800 bg-zinc-950 hover:bg-zinc-900"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-md border flex items-center justify-center ${
                        enabled
                          ? "border-blue-500 bg-blue-600"
                          : "border-zinc-700"
                      }`}
                    >
                      {enabled && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                      )}
                    </div>

                    <span className="text-sm">
                      {permission}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </FormSection>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm hover:bg-zinc-800"
          >
            Cancel
          </button>

          <button
            onClick={() => onSave(form)}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold hover:bg-blue-500"
          >
            {form.id
              ? "Save Changes"
              : "Create Role"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ================= UI COMPONENTS ================= */

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: any;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-500">
            {title}
          </p>

          <p className="text-2xl font-bold mt-2">
            {value}
          </p>
        </div>

        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-blue-400" />
        </div>
      </div>
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`w-full ${
          wide ? "max-w-5xl" : "max-w-xl"
        } max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-5 py-4">
          <h2 className="font-semibold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
      <h3 className="text-sm font-semibold mb-4">
        {title}
      </h3>

      {children}
    </div>
  );
}

function InfoBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
      <h3 className="text-sm font-semibold mb-4">
        {title}
      </h3>

      {children}
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-zinc-800 last:border-0">
      <span className="text-xs text-zinc-500">
        {label}
      </span>

      <span className="text-sm text-zinc-300 text-right">
        {value || "-"}
      </span>
    </div>
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
      <label className="block text-xs text-zinc-500 mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  displayLabels = {},
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  displayLabels?: Record<string, string>;
}) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-2">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
      >
        <option value="">
          Select {label}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {displayLabels[option] || option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Textarea({
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
      <label className="block text-xs text-zinc-500 mb-2">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm outline-none focus:border-blue-500 resize-none"
      />
    </div>
  );
}

function formatDate(date: string) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}