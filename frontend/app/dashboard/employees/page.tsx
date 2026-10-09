"use client";

import { useEffect, useMemo, useState } from "react";
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
  Save,
  UserCheck,
  UserX,
  MapPin,
  Mail,
  Phone,
  CalendarDays,
  BriefcaseBusiness,
} from "lucide-react";

type EmployeeStatus = "ACTIVE" | "INACTIVE";
type Tab = "employees" | "roles";

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

const locations = [
  "India",
  "Ahmedabad",
  "Surat",
  "Vadodara",
  "Rajkot",
  "Mumbai",
  "Remote",
];

const initialRoles: Role[] = [
  {
    id: "ROLE-001",
    name: "Administrator",
    description: "Full access to CRM modules, employees and settings.",
    permissions: permissionList,
  },
  {
    id: "ROLE-002",
    name: "Sales Manager",
    description: "Manage leads, pipeline, quotations, payments and customers.",
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
    description: "Manage projects and development tasks.",
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
    description: "Manage QA tasks and project review activities.",
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
    description: "Manage campaigns and marketing activities.",
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

const EMPTY_EMPLOYEE: Employee = {
  id: "",
  employeeCode: "",
  name: "",
  email: "",
  phone: "",
  department: "",
  role: "",
  status: "ACTIVE",
  joiningDate: "",
  location: "India",
  notes: "",
};

const EMPTY_ROLE: Role = {
  id: "",
  name: "",
  description: "",
  permissions: [],
};

function safeLoad<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function makeEmployeeCode(existing: Employee[]) {
  const max = existing.reduce((highest, employee) => {
    const match = employee.employeeCode.match(/(\d+)$/);
    return Math.max(highest, match ? Number(match[1]) : 0);
  }, 0);
  return `EMP-2026-${String(max + 1).padStart(3, "0")}`;
}

function formatDate(date: string) {
  if (!date) return "-";
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function EmployeesRolesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>(initialRoles);

  const [tenantId, setTenantId] = useState("");
const [loadingEmployees, setLoadingEmployees] = useState(false);

  const [hydrated, setHydrated] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>("employees");
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | EmployeeStatus>("ALL");

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState<string | null>(null);
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null);

  useEffect(() => {
  const storedTenantId =
    window.localStorage.getItem("tivra_tenant_id");

  if (storedTenantId) {
    setTenantId(storedTenantId);
  }

  setRoles(safeLoad<Role[]>("tivra_roles", initialRoles));
  setHydrated(true);
}, []);

  // useEffect(() => {
  //   if (!hydrated) return;
  //   window.localStorage.setItem("tivra_employees", JSON.stringify(employees));
  // }, [employees, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem("tivra_roles", JSON.stringify(roles));
  }, [roles, hydrated]);

  useEffect(() => {
    const close = () => setOpenMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const roleNames = useMemo(() => roles.map((role) => role.name), [roles]);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();
    return employees.filter((employee) => {
      const matchesSearch =
        !query ||
        employee.name.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.employeeCode.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query) ||
        employee.role.toLowerCase().includes(query) ||
        employee.location.toLowerCase().includes(query);

      const matchesDepartment =
        departmentFilter === "ALL" || employee.department === departmentFilter;
      const matchesRole = roleFilter === "ALL" || employee.role === roleFilter;
      const matchesStatus = statusFilter === "ALL" || employee.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
    });
  }, [employees, search, departmentFilter, roleFilter, statusFilter]);

  const activeEmployees = employees.filter((employee) => employee.status === "ACTIVE").length;
  const inactiveEmployees = employees.filter((employee) => employee.status === "INACTIVE").length;
  const departmentCount = new Set(employees.map((employee) => employee.department).filter(Boolean)).size;

  const clearEmployeeFilters = () => {
    setSearch("");
    setDepartmentFilter("ALL");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
  };

  const fetchEmployees = async (currentTenantId = tenantId) => {
  if (!currentTenantId) return;

  try {
    setLoadingEmployees(true);

    const response = await fetch(
      `http://localhost:5000/api/users?tenantId=${encodeURIComponent(
        currentTenantId
      )}`,
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Unable to load employees."
      );
    }

    const mappedEmployees: Employee[] = (data.users || []).map(
      (user: any) => ({
        id: user.id,
        employeeCode: user.employeeCode || "",
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        department: user.department || "",
        role: user.jobTitle || user.role || "",
        status:
          user.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
        joiningDate: user.joiningDate
          ? String(user.joiningDate).slice(0, 10)
          : "",
        location: user.location || "India",
        notes: user.notes || "",
      })
    );

    setEmployees(mappedEmployees);
  } catch (error) {
    console.error("Fetch employees error:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Unable to load employees."
    );
  } finally {
    setLoadingEmployees(false);
  }
};

useEffect(() => {
  if (!tenantId) return;

  fetchEmployees(tenantId);
}, [tenantId]);



  const saveEmployee = async (input: Employee) => {
  const name = input.name.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();

  if (!tenantId) {
    alert("Tenant information is missing. Please login again.");
    return;
  }

  if (!name) {
    alert("Please enter employee name.");
    return;
  }

  if (!email) {
    alert("Please enter employee email.");
    return;
  }

  if (!input.department) {
    alert("Please select department.");
    return;
  }

  if (!input.role) {
    alert("Please select role.");
    return;
  }

  if (!input.joiningDate) {
    alert("Please select joining date.");
    return;
  }

  const payload = {
    tenantId,
    name,
    email,
    role: "SALESPERSON",
    jobTitle: input.role,
    employeeCode: input.employeeCode.trim() || null,
    phone: phone || null,
    department: input.department,
    status: input.status,
    joiningDate: input.joiningDate,
    location: input.location.trim() || "India",
    notes: input.notes.trim() || null,
  };

  try {
    const isEditing = Boolean(input.id);

    const response = await fetch(
      isEditing
        ? `http://localhost:5000/api/users/${encodeURIComponent(input.id)}`
        : "http://localhost:5000/api/users",
      {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          (isEditing
            ? "Unable to update employee."
            : "Unable to create employee.")
      );
    }

    alert(
      isEditing
        ? "Employee updated successfully."
        : "Employee created successfully."
    );

    setEditingEmployee(null);

    await fetchEmployees();
  } catch (error) {
    console.error("Save employee error:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Unable to save employee."
    );
  }
};

 const deleteEmployee = async (id: string) => {
  if (!tenantId) {
    alert("Tenant information is missing. Please login again.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/users/${encodeURIComponent(
        id
      )}?tenantId=${encodeURIComponent(tenantId)}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Unable to delete employee."
      );
    }

    alert("Employee deleted successfully.");

    setDeleteEmployeeId(null);

    await fetchEmployees();
  } catch (error) {
    console.error("Delete employee error:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Unable to delete employee."
    );
  }
};

  const toggleEmployeeStatus = async (id: string) => {
  const employee = employees.find((item) => item.id === id);

  if (!employee) {
    return;
  }

  if (!tenantId) {
    alert("Tenant information is missing. Please login again.");
    return;
  }

  const newStatus =
    employee.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  try {
    const response = await fetch(
      `http://localhost:5000/api/users/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenantId,
          name: employee.name,
          email: employee.email,
          role: "SALESPERSON",
          jobTitle: employee.role,
          employeeCode: employee.employeeCode || null,
          phone: employee.phone || null,
          department: employee.department,
          status: newStatus,
          joiningDate: employee.joiningDate,
          location: employee.location || "India",
          notes: employee.notes || null,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Unable to update employee status."
      );
    }

    alert(
      `Employee status changed to ${newStatus === "ACTIVE" ? "Active" : "Inactive"}.`
    );

    setOpenMenu(null);

    await fetchEmployees();
  } catch (error) {
    console.error("Toggle employee status error:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Unable to update employee status."
    );
  }
};

  const saveRole = (input: Role) => {
    const name = input.name.trim();
    const description = input.description.trim();

    if (!name) {
      alert("Please enter role name.");
      return;
    }
    if (!description) {
      alert("Please enter role description.");
      return;
    }
    if (input.permissions.length === 0) {
      alert("Please select at least one permission.");
      return;
    }

    const cleanRole: Role = { ...input, name, description };

    if (input.id) {
      const oldRole = roles.find((role) => role.id === input.id);
      setRoles((current) =>
        current.map((role) => (role.id === input.id ? cleanRole : role))
      );

      if (oldRole && oldRole.name !== cleanRole.name) {
        setEmployees((current) =>
          current.map((employee) =>
            employee.role === oldRole.name
              ? { ...employee, role: cleanRole.name }
              : employee
          )
        );
      }

      alert("Role updated successfully.");
    } else {
      setRoles((current) => [
        { ...cleanRole, id: `ROLE-${Date.now()}` },
        ...current,
      ]);
      alert("Role created successfully.");
    }

    setEditingRole(null);
  };

  const deleteRole = (id: string) => {
    const role = roles.find((item) => item.id === id);
    if (!role) return;

    if (role.name === "Administrator") {
      alert("Administrator role cannot be deleted.");
      return;
    }

    const assigned = employees.filter((employee) => employee.role === role.name);
    if (assigned.length > 0) {
      alert(
        `"${role.name}" cannot be deleted because ${assigned.length} employee(s) are assigned to this role. Reassign them first.`
      );
      return;
    }

    setRoles((current) => current.filter((item) => item.id !== id));
    setDeleteRoleId(null);
    alert("Role deleted successfully.");
  };

  return (
    <div
      className="min-h-screen bg-[#09090b] text-white"
      onClick={() => setOpenMenu(null)}
    >
      <div className="space-y-6 p-4 md:p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">Employees &amp; Roles</h1>
              <p className="text-sm text-zinc-400">
                Manage employees, departments, roles and permissions
              </p>
            </div>
          </div>

          {activeTab === "employees" ? (
            <button
              onClick={(event) => {
                event.stopPropagation();
                setEditingEmployee({
                  ...EMPTY_EMPLOYEE,
                  employeeCode: makeEmployeeCode(employees),
                  role: roleNames[0] || "",
                });
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
            >
              <UserPlus className="h-4 w-4" />
              Add Employee
            </button>
          ) : (
            <button
              onClick={(event) => {
                event.stopPropagation();
                setEditingRole({ ...EMPTY_ROLE });
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
            >
              <Plus className="h-4 w-4" />
              Create Role
            </button>
          )}
        </div>

        {/* TABS */}
        <div className="flex gap-2 border-b border-zinc-800">
          <TabButton active={activeTab === "employees"} onClick={() => setActiveTab("employees")}>
            <Users className="h-4 w-4" />
            Employees
          </TabButton>
          <TabButton active={activeTab === "roles"} onClick={() => setActiveTab("roles")}>
            <ShieldCheck className="h-4 w-4" />
            Roles &amp; Permissions
          </TabButton>
        </div>

        {activeTab === "employees" && (
          <>
            {/* STATS */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <StatCard title="Total Employees" value={employees.length} icon={Users} />
              <StatCard title="Active" value={activeEmployees} icon={CheckCircle2} />
              <StatCard title="Inactive" value={inactiveEmployees} icon={XCircle} />
              <StatCard title="Departments" value={departmentCount} icon={Building2} />
            </div>

            {/* FILTERS */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
              <div className="mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4 text-zinc-400" />
                <span className="text-sm font-medium">Employee Filters</span>
                <button
                  onClick={clearEmployeeFilters}
                  className="ml-auto text-xs text-blue-400 hover:text-blue-300"
                >
                  Reset filters
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search employee..."
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <Select
                  label=""
                  value={departmentFilter}
                  onChange={setDepartmentFilter}
                  options={["ALL", ...departments]}
                  displayLabels={{ ALL: "All Departments" }}
                />

                <Select
                  label=""
                  value={roleFilter}
                  onChange={setRoleFilter}
                  options={["ALL", ...roleNames]}
                  displayLabels={{ ALL: "All Roles" }}
                />

                <Select
                  label=""
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value as "ALL" | EmployeeStatus)}
                  options={["ALL", "ACTIVE", "INACTIVE"]}
                  displayLabels={{ ALL: "All Status", ACTIVE: "Active", INACTIVE: "Inactive" }}
                />
              </div>
            </div>

            {/* EMPLOYEE TABLE */}
            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70">
              <div className="border-b border-zinc-800 px-5 py-4">
                <h2 className="font-semibold">Employee List</h2>
                <p className="mt-1 text-xs text-zinc-500">{filteredEmployees.length} employees found</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px]">
                  <thead className="bg-zinc-950/70">
                    <tr className="text-left text-xs uppercase tracking-wide text-zinc-500">
                      <th className="px-5 py-4">Employee</th>
                      <th className="px-5 py-4">Department</th>
                      <th className="px-5 py-4">Role</th>
                      <th className="px-5 py-4">Contact</th>
                      <th className="px-5 py-4">Joining Date</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {filteredEmployees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-zinc-800/30">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 text-sm font-semibold text-blue-400">
                              {initials(employee.name)}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{employee.name}</p>
                              <p className="mt-1 text-xs text-zinc-500">{employee.employeeCode}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm">{employee.department}</td>
                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                            {employee.role}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm">{employee.email}</p>
                          <p className="mt-1 text-xs text-zinc-500">{employee.phone}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-zinc-400">{formatDate(employee.joiningDate)}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs ${
                              employee.status === "ACTIVE"
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                                : "border-zinc-700 bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            {employee.status === "ACTIVE" ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="relative px-5 py-4 text-right">
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              setOpenMenu(openMenu === employee.id ? null : employee.id);
                            }}
                            className="rounded-lg p-2 hover:bg-zinc-800"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>

                          {openMenu === employee.id && (
                            <ActionMenu>
                              <ActionButton
                                icon={<Eye className="h-4 w-4" />}
                                label="View"
                                onClick={() => {
                                  setSelectedEmployee(employee);
                                  setOpenMenu(null);
                                }}
                              />
                              <ActionButton
                                icon={<Edit3 className="h-4 w-4" />}
                                label="Edit"
                                onClick={() => {
                                  setEditingEmployee({ ...employee });
                                  setOpenMenu(null);
                                }}
                              />
                              <ActionButton
                                icon={
                                  employee.status === "ACTIVE" ? (
                                    <XCircle className="h-4 w-4" />
                                  ) : (
                                    <CheckCircle2 className="h-4 w-4" />
                                  )
                                }
                                label={employee.status === "ACTIVE" ? "Make Inactive" : "Make Active"}
                                onClick={() => toggleEmployeeStatus(employee.id)}
                              />
                              <ActionButton
                                danger
                                icon={<Trash2 className="h-4 w-4" />}
                                label="Delete"
                                onClick={() => {
                                  setDeleteEmployeeId(employee.id);
                                  setOpenMenu(null);
                                }}
                              />
                            </ActionMenu>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredEmployees.length === 0 && (
                <EmptyState title="No employees found" description="Try changing your search or filters." />
              )}
            </div>
          </>
        )}

        {activeTab === "roles" && (
          <>
            {/* ROLE STATS */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <StatCard title="Total Roles" value={roles.length} icon={ShieldCheck} />
              <StatCard title="Permission Types" value={permissionList.length} icon={KeyRound} />
              <StatCard title="Employees" value={employees.length} icon={Users} />
            </div>

            {/* ROLE CARDS */}
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {roles.map((role) => {
                const employeeCount = employees.filter((employee) => employee.role === role.name).length;
                return (
                  <div key={role.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                          <ShieldCheck className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{role.name}</h3>
                          <p className="mt-1 text-xs text-zinc-500">
                            {employeeCount} employee{employeeCount !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-5 text-zinc-400">{role.description}</p>

                    <div className="mt-5">
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="text-zinc-500">Permissions</span>
                        <span className="text-blue-400">
                          {role.permissions.length}/{permissionList.length}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.slice(0, 4).map((permission) => (
                          <span key={permission} className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-[11px] text-zinc-400">
                            {permission}
                          </span>
                        ))}
                        {role.permissions.length > 4 && (
                          <span className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-[11px] text-zinc-500">
                            +{role.permissions.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 flex gap-2 border-t border-zinc-800 pt-4">
                      <button
                        onClick={() => setSelectedRole(role)}
                        className="flex-1 rounded-xl border border-zinc-800 px-3 py-2 text-xs hover:bg-zinc-800"
                      >
                        View Permissions
                      </button>
                      <button
                        onClick={() => setEditingRole({ ...role, permissions: [...role.permissions] })}
                        className="rounded-xl border border-zinc-800 px-3 py-2 hover:bg-zinc-800"
                        title="Edit Role"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteRoleId(role.id)}
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

      {/* EMPLOYEE VIEW */}
      {selectedEmployee && (
        <Modal title="Employee Details" onClose={() => setSelectedEmployee(null)} wide>
          <div className="space-y-5">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 text-xl font-bold text-blue-400">
                  {initials(selectedEmployee.name)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedEmployee.name}</h2>
                  <p className="text-sm text-zinc-500">{selectedEmployee.employeeCode}</p>
                  <p className="mt-1 text-xs text-blue-400">{selectedEmployee.role}</p>
                </div>
                <span
                  className={`ml-auto rounded-full border px-3 py-1 text-xs ${
                    selectedEmployee.status === "ACTIVE"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                      : "border-zinc-700 bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {selectedEmployee.status === "ACTIVE" ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InfoBox title="Contact Information">
                <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={selectedEmployee.email} />
                <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={selectedEmployee.phone} />
                <InfoRow icon={<MapPin className="h-4 w-4" />} label="Location" value={selectedEmployee.location} />
              </InfoBox>

              <InfoBox title="Organization">
                <InfoRow icon={<Building2 className="h-4 w-4" />} label="Department" value={selectedEmployee.department} />
                <InfoRow icon={<BriefcaseBusiness className="h-4 w-4" />} label="Role" value={selectedEmployee.role} />
                <InfoRow icon={<CalendarDays className="h-4 w-4" />} label="Joining Date" value={formatDate(selectedEmployee.joiningDate)} />
              </InfoBox>
            </div>

            <InfoBox title="Notes">
              <p className="text-sm leading-6 text-zinc-400">{selectedEmployee.notes || "No notes available."}</p>
            </InfoBox>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditingEmployee({ ...selectedEmployee });
                  setSelectedEmployee(null);
                }}
                className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm hover:bg-zinc-800"
              >
                Edit Employee
              </button>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium hover:bg-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* EMPLOYEE FORM */}
      {editingEmployee && (
        <EmployeeFormModal
          employee={editingEmployee}
          roles={roles}
          onClose={() => setEditingEmployee(null)}
          onSave={saveEmployee}
        />
      )}

      {/* DELETE EMPLOYEE */}
      {deleteEmployeeId && (
        <Modal title="Delete Employee" onClose={() => setDeleteEmployeeId(null)}>
          <p className="text-sm text-zinc-400">Are you sure you want to delete this employee?</p>
          <p className="mt-2 text-xs text-red-400">This action cannot be undone.</p>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={() => setDeleteEmployeeId(null)} className="rounded-xl border border-zinc-700 px-4 py-2.5 text-sm hover:bg-zinc-800">
              Cancel
            </button>
            <button
              onClick={() => deleteEmployee(deleteEmployeeId)}
              className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium hover:bg-red-500"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}

      {/* ROLE VIEW */}
      {selectedRole && (
        <Modal title="Role & Permissions" onClose={() => setSelectedRole(null)} wide>
          <div className="space-y-5">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                  <ShieldCheck className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedRole.name}</h2>
                  <p className="mt-1 text-sm text-zinc-500">{selectedRole.description}</p>
                </div>
              </div>
            </div>

            <InfoBox title="All Permission Types">
              <div className="grid gap-3 md:grid-cols-2">
                {permissionList.map((permission) => {
                  const enabled = selectedRole.permissions.includes(permission);
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
                      <span className={`text-sm ${enabled ? "text-zinc-200" : "text-zinc-600"}`}>
                        {permission}
                      </span>
                    </div>
                  );
                })}
              </div>
            </InfoBox>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditingRole({ ...selectedRole, permissions: [...selectedRole.permissions] });
                  setSelectedRole(null);
                }}
                className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm hover:bg-zinc-800"
              >
                Edit Role
              </button>
              <button onClick={() => setSelectedRole(null)} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium hover:bg-blue-500">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ROLE FORM */}
      {editingRole && (
        <RoleFormModal role={editingRole} onClose={() => setEditingRole(null)} onSave={saveRole} />
      )}

      {/* DELETE ROLE */}
      {deleteRoleId && (
        <Modal title="Delete Role" onClose={() => setDeleteRoleId(null)}>
          <div className="space-y-4">
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <div className="flex gap-3">
                <Trash2 className="h-5 w-5 shrink-0 text-red-400" />
                <div>
                  <p className="text-sm font-medium text-red-300">Delete this role?</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    The deletion will be blocked when employees are assigned to this role.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteRoleId(null)} className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm hover:bg-zinc-800">
                Cancel
              </button>
              <button onClick={() => deleteRole(deleteRoleId)} className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold hover:bg-red-500">
                Delete Role
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm transition ${
        active ? "border-blue-500 text-blue-400" : "border-transparent text-zinc-500 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function StatCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-500">{title}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
          <Icon className="h-5 w-5 text-blue-400" />
        </div>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options, displayLabels = {} }: { label: string; value: string; onChange: (value: string) => void; options: string[]; displayLabels?: Record<string, string> }) {
  return (
    <div>
      {label && <label className="mb-2 block text-xs text-zinc-500">{label}</label>}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm outline-none focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {displayLabels[option] || option}
          </option>
        ))}
      </select>
    </div>
  );
}

function ActionMenu({ children }: { children: React.ReactNode }) {
  return (
    <div onClick={(event) => event.stopPropagation()} className="absolute right-5 top-12 z-30 w-52 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">
      {children}
    </div>
  );
}

function ActionButton({ icon, label, onClick, danger = false }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-4 py-3 text-left text-sm ${
        danger ? "text-red-400 hover:bg-red-500/10" : "hover:bg-zinc-800"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-12 text-center">
      <Users className="mx-auto h-10 w-10 text-zinc-700" />
      <p className="mt-3 font-semibold">{title}</p>
      <p className="mt-1 text-sm text-zinc-500">{description}</p>
    </div>
  );
}

function Modal({ title, children, onClose, wide = false }: { title: string; children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(event) => event.stopPropagation()}
        className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl ${wide ? "max-w-5xl" : "max-w-xl"}`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-5 py-4">
          <h2 className="font-semibold">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-zinc-800">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function EmployeeFormModal({ employee, roles, onClose, onSave }: { employee: Employee; roles: Role[]; onClose: () => void; onSave: (employee: Employee) => void }) {
  const [form, setForm] = useState<Employee>(employee);

  const update = <K extends keyof Employee>(key: K, value: Employee[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <Modal title={form.id ? "Edit Employee" : "Add New Employee"} onClose={onClose} wide>
      <div className="space-y-6">
        <FormSection title="Employee Information">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Full Name" value={form.name} onChange={(value) => update("name", value)} placeholder="Enter employee name" />
            <Input label="Employee Code" value={form.employeeCode} onChange={(value) => update("employeeCode", value)} placeholder="EMP-2026-008" />
            <Input label="Email" value={form.email} onChange={(value) => update("email", value)} placeholder="employee@company.com" type="email" />
            <Input label="Phone" value={form.phone} onChange={(value) => update("phone", value)} placeholder="+91..." />
          </div>
        </FormSection>

        <FormSection title="Organization">
          <div className="grid gap-4 md:grid-cols-3">
            <Select label="Department" value={form.department} onChange={(value) => update("department", value)} options={departments} />
            <Select label="Role" value={form.role} onChange={(value) => update("role", value)} options={roles.map((role) => role.name)} />
            <Select label="Status" value={form.status} onChange={(value) => update("status", value as EmployeeStatus)} options={["ACTIVE", "INACTIVE"]} displayLabels={{ ACTIVE: "Active", INACTIVE: "Inactive" }} />
          </div>
        </FormSection>

        <FormSection title="Additional Information">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Joining Date" value={form.joiningDate} onChange={(value) => update("joiningDate", value)} type="date" />
            <Input label="Location" value={form.location} onChange={(value) => update("location", value)} placeholder="City / Country" />
          </div>
          <div className="mt-4">
            <Textarea label="Notes" value={form.notes} onChange={(value) => update("notes", value)} placeholder="Add employee notes..." />
          </div>
        </FormSection>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm hover:bg-zinc-800">
            Cancel
          </button>
          <button onClick={() => onSave(form)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold hover:bg-blue-500">
            <Save className="h-4 w-4" />
            {form.id ? "Save Changes" : "Create Employee"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function RoleFormModal({ role, onClose, onSave }: { role: Role; onClose: () => void; onSave: (role: Role) => void }) {
  const [form, setForm] = useState<Role>(role);

  const togglePermission = (permission: string) => {
    setForm((current) => ({
      ...current,
      permissions: current.permissions.includes(permission)
        ? current.permissions.filter((item) => item !== permission)
        : [...current.permissions, permission],
    }));
  };

  const selectAll = () => {
    setForm((current) => ({ ...current, permissions: [...permissionList] }));
  };

  const clearAll = () => {
    setForm((current) => ({ ...current, permissions: [] }));
  };

  return (
    <Modal title={form.id ? "Edit Role" : "Create New Role"} onClose={onClose} wide>
      <div className="space-y-6">
        <FormSection title="Role Information">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Role Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} placeholder="e.g. Finance Manager" />
            <Input label="Role Description" value={form.description} onChange={(value) => setForm((current) => ({ ...current, description: value }))} placeholder="Describe this role..." />
          </div>
        </FormSection>

        <FormSection title="Permissions">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="mr-auto text-xs text-zinc-500">
              {form.permissions.length}/{permissionList.length} enabled
            </span>
            <button onClick={selectAll} className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs hover:bg-zinc-800">
              Select All
            </button>
            <button onClick={clearAll} className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs hover:bg-zinc-800">
              Clear All
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {permissionList.map((permission) => {
              const enabled = form.permissions.includes(permission);
              return (
                <button
                  key={permission}
                  type="button"
                  onClick={() => togglePermission(permission)}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                    enabled
                      ? "border-blue-500/30 bg-blue-500/10"
                      : "border-zinc-800 bg-zinc-950 hover:bg-zinc-900"
                  }`}
                >
                  <div className={`flex h-5 w-5 items-center justify-center rounded-md border ${enabled ? "border-blue-500 bg-blue-600" : "border-zinc-700"}`}>
                    {enabled && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                  </div>
                  <span className="text-sm">{permission}</span>
                </button>
              );
            })}
          </div>
        </FormSection>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm hover:bg-zinc-800">
            Cancel
          </button>
          <button onClick={() => onSave(form)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold hover:bg-blue-500">
            <Save className="h-4 w-4" />
            {form.id ? "Save Changes" : "Create Role"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
      <h3 className="mb-4 text-sm font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function InfoBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
      <h3 className="mb-4 text-sm font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-zinc-800 py-3 last:border-0">
      <div className="text-zinc-500">{icon}</div>
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="ml-auto max-w-[65%] break-all text-right text-sm text-zinc-300">{value || "-"}</span>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="mb-2 block text-xs text-zinc-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="mb-2 block text-xs text-zinc-500">{label}</label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
      />
    </div>
  );
}
