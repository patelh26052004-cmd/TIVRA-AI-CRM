"use client";

import { useMemo, useState } from "react";
import { usePersistentState } from "@/lib/persistence";
import {
  CheckCircle2,
  ChevronRight,
  CircleDot,
  ClipboardList,
  Code2,
  Edit3,
  Eye,
  Filter,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  UserRound,
  Users,
  X,
  AlertCircle,
  Clock3,
  CalendarDays,
} from "lucide-react";

type TaskStatus =
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "UNDER_REVIEW"
  | "COMPLETED"
  | "APPROVED";

type TaskPriority = "HIGH" | "MEDIUM" | "LOW";

type TaskType = "DEVELOPMENT" | "QA" | "DESIGN" | "MARKETING" | "OTHER";

type Task = {
  id: string;
  taskCode: string;
  title: string;

  projectId: string;
  projectName: string;
  company: string;

  assignedEmployee: string;
  department: string;
  taskType: TaskType;

  priority: TaskPriority;
  status: TaskStatus;

  startDate: string;
  dueDate: string;

  progress: number;

  description: string;
  deliverable: string;

  createdAt: string;
  notes: string;
};

const employees = [
  {
    name: "Hetvi Shah",
    department: "Development",
    role: "Developer + Project",
  },
  {
    name: "Dev Patel",
    department: "Development",
    role: "Developer",
  },
  {
    name: "Hasti Patel",
    department: "QA",
    role: "QA + SEO",
  },
  {
    name: "Saloni Mehta",
    department: "Sales",
    role: "Sales Executive",
  },
  {
    name: "Kashis Patel",
    department: "Marketing",
    role: "Digital Marketing",
  },
  {
    name: "Hinal Patel",
    department: "Marketing",
    role: "Digital Marketing",
  },
];

const projects = [
  {
    id: "PRJ-001",
    name: "Business CRM Website",
    company: "Joshi Enterprises",
  },
  {
    id: "PRJ-002",
    name: "Inventory Management Software",
    company: "VS Enterprises",
  },
  {
    id: "PRJ-003",
    name: "Healthcare Website",
    company: "Pooja Healthcare",
  },
  {
    id: "PRJ-004",
    name: "Restaurant Website",
    company: "Royal Restaurant",
  },
];

const initialTasks: Task[] = [
  {
    id: "TASK-001",
    taskCode: "TSK-2026-001",
    title: "Create CRM Dashboard",
    projectId: "PRJ-001",
    projectName: "Business CRM Website",
    company: "Joshi Enterprises",

    assignedEmployee: "Dev Patel",
    department: "Development",
    taskType: "DEVELOPMENT",

    priority: "HIGH",
    status: "IN_PROGRESS",

    startDate: "2026-09-10",
    dueDate: "2026-09-20",

    progress: 65,

    description:
      "Develop the main CRM dashboard with statistics, charts and navigation.",
    deliverable:
      "Responsive CRM dashboard connected with project modules.",

    createdAt: "2026-09-10",
    notes: "Dashboard UI is under development.",
  },

  {
    id: "TASK-002",
    taskCode: "TSK-2026-002",
    title: "Lead CRM Module",
    projectId: "PRJ-001",
    projectName: "Business CRM Website",
    company: "Joshi Enterprises",

    assignedEmployee: "Hetvi Shah",
    department: "Development",
    taskType: "DEVELOPMENT",

    priority: "HIGH",
    status: "COMPLETED",

    startDate: "2026-09-11",
    dueDate: "2026-09-17",

    progress: 100,

    description:
      "Implement lead management with search, filters, assignment and status workflow.",
    deliverable: "Functional Lead CRM module.",

    createdAt: "2026-09-11",
    notes: "Development completed.",
  },

  {
    id: "TASK-003",
    taskCode: "TSK-2026-003",
    title: "CRM Module QA Testing",
    projectId: "PRJ-001",
    projectName: "Business CRM Website",
    company: "Joshi Enterprises",

    assignedEmployee: "Hasti Patel",
    department: "QA",
    taskType: "QA",

    priority: "MEDIUM",
    status: "UNDER_REVIEW",

    startDate: "2026-09-17",
    dueDate: "2026-09-22",

    progress: 55,

    description:
      "Test CRM modules, forms, workflows and responsive behaviour.",
    deliverable: "QA report and bug list.",

    createdAt: "2026-09-17",
    notes: "Testing is currently in progress.",
  },

  {
    id: "TASK-004",
    taskCode: "TSK-2026-004",
    title: "Inventory Product Module",
    projectId: "PRJ-002",
    projectName: "Inventory Management Software",
    company: "VS Enterprises",

    assignedEmployee: "Dev Patel",
    department: "Development",
    taskType: "DEVELOPMENT",

    priority: "HIGH",
    status: "COMPLETED",

    startDate: "2026-08-21",
    dueDate: "2026-08-30",

    progress: 100,

    description:
      "Build product and inventory management functionality.",
    deliverable:
      "Product CRUD, stock quantity and inventory dashboard.",

    createdAt: "2026-08-21",
    notes: "Completed successfully.",
  },

  {
    id: "TASK-005",
    taskCode: "TSK-2026-005",
    title: "Inventory QA Testing",
    projectId: "PRJ-002",
    projectName: "Inventory Management Software",
    company: "VS Enterprises",

    assignedEmployee: "Hasti Patel",
    department: "QA",
    taskType: "QA",

    priority: "HIGH",
    status: "APPROVED",

    startDate: "2026-08-31",
    dueDate: "2026-09-05",

    progress: 100,

    description:
      "Perform functional and responsive testing of inventory software.",
    deliverable: "Approved QA report.",

    createdAt: "2026-08-31",
    notes: "QA approved.",
  },

  {
    id: "TASK-006",
    taskCode: "TSK-2026-006",
    title: "Healthcare Homepage",
    projectId: "PRJ-003",
    projectName: "Healthcare Website",
    company: "Pooja Healthcare",

    assignedEmployee: "Hetvi Shah",
    department: "Development",
    taskType: "DEVELOPMENT",

    priority: "MEDIUM",
    status: "ASSIGNED",

    startDate: "2026-09-19",
    dueDate: "2026-09-25",

    progress: 0,

    description:
      "Create responsive healthcare website homepage.",
    deliverable:
      "Responsive homepage with hero, services and contact section.",

    createdAt: "2026-09-19",
    notes: "Assigned and waiting for development.",
  },
];

const statusConfig: Record<
  TaskStatus,
  { label: string; className: string }
> = {
  ASSIGNED: {
    label: "Assigned",
    className: "bg-slate-500/10 text-slate-300 border-slate-500/20",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  },
  ON_HOLD: {
    label: "On Hold",
    className: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    className: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  },
  APPROVED: {
    label: "Approved",
    className: "bg-green-500/10 text-green-300 border-green-500/20",
  },
};

const priorityConfig: Record<
  TaskPriority,
  { label: string; className: string }
> = {
  HIGH: {
    label: "High",
    className: "text-red-400 bg-red-500/10 border-red-500/20",
  },
  MEDIUM: {
    label: "Medium",
    className: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  LOW: {
    label: "Low",
    className: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
};

const emptyTask: Task = {
  id: "",
  taskCode: "",
  title: "",

  projectId: "",
  projectName: "",
  company: "",

  assignedEmployee: "",
  department: "Development",
  taskType: "DEVELOPMENT",

  priority: "MEDIUM",
  status: "ASSIGNED",

  startDate: "",
  dueDate: "",

  progress: 0,

  description: "",
  deliverable: "",

  createdAt: new Date().toISOString().slice(0, 10),
  notes: "",
};

export default function TasksPage() {
  const [tasks, setTasks] = usePersistentState<Task[]>("tivra_tasks", initialTasks);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | TaskStatus>("ALL");

  const [priorityFilter, setPriorityFilter] =
    useState<"ALL" | TaskPriority>("ALL");

  const [employeeFilter, setEmployeeFilter] =
    useState("ALL");

  const [typeFilter, setTypeFilter] =
    useState<"ALL" | TaskType>("ALL");

  const [selectedTask, setSelectedTask] =
    useState<Task | null>(null);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  const [showView, setShowView] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [deleteId, setDeleteId] =
    useState<string | null>(null);

  const [openMenu, setOpenMenu] =
    useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const q = search.toLowerCase();

      const matchesSearch =
        task.title.toLowerCase().includes(q) ||
        task.taskCode.toLowerCase().includes(q) ||
        task.projectName.toLowerCase().includes(q) ||
        task.company.toLowerCase().includes(q) ||
        task.assignedEmployee.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" ||
        task.priority === priorityFilter;

      const matchesEmployee =
        employeeFilter === "ALL" ||
        task.assignedEmployee === employeeFilter;

      const matchesType =
        typeFilter === "ALL" ||
        task.taskType === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesEmployee &&
        matchesType
      );
    });
  }, [
    tasks,
    search,
    statusFilter,
    priorityFilter,
    employeeFilter,
    typeFilter,
  ]);

  const stats = useMemo(() => {
    return {
      total: tasks.length,

      assigned: tasks.filter(
        (task) => task.status === "ASSIGNED"
      ).length,

      inProgress: tasks.filter(
        (task) => task.status === "IN_PROGRESS"
      ).length,

      review: tasks.filter(
        (task) => task.status === "UNDER_REVIEW"
      ).length,

      completed: tasks.filter(
        (task) =>
          task.status === "COMPLETED" ||
          task.status === "APPROVED"
      ).length,

      highPriority: tasks.filter(
        (task) => task.priority === "HIGH"
      ).length,
    };
  }, [tasks]);

  const updateStatus = (
    id: string,
    status: TaskStatus
  ) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;

        let progress = task.progress;

        if (status === "ASSIGNED") {
          progress = 0;
        }

        if (
          status === "IN_PROGRESS" &&
          progress === 0
        ) {
          progress = 10;
        }

        if (status === "UNDER_REVIEW" && progress < 80) {
          progress = 80;
        }

        if (
          status === "COMPLETED" ||
          status === "APPROVED"
        ) {
          progress = 100;
        }

        return {
          ...task,
          status,
          progress,
        };
      })
    );

    setSelectedTask((prev) =>
      prev
        ? {
            ...prev,
            status,
            progress:
              status === "COMPLETED" ||
              status === "APPROVED"
                ? 100
                : prev.progress,
          }
        : null
    );
  };

  const openTask = (task: Task) => {
    setSelectedTask(task);
    setShowView(true);
    setOpenMenu(null);
  };

  const editTask = (task: Task) => {
    setEditingTask({ ...task });
    setShowEdit(true);
    setOpenMenu(null);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );

    setDeleteId(null);
  };

  const addTask = (task: Task) => {
    const project = projects.find(
      (item) => item.id === task.projectId
    );

    const employee = employees.find(
      (item) => item.name === task.assignedEmployee
    );

    const newTask: Task = {
      ...task,
      id: `TASK-${Date.now()}`,
      taskCode:
        task.taskCode ||
        `TSK-2026-${String(
          tasks.length + 1
        ).padStart(3, "0")}`,
      projectName: project?.name || "",
      company: project?.company || "",
      department:
        employee?.department ||
        task.department,
    };

    setTasks((prev) => [newTask, ...prev]);
    setShowAdd(false);
  };

  const saveEdit = (task: Task) => {
    const project = projects.find(
      (item) => item.id === task.projectId
    );

    const employee = employees.find(
      (item) => item.name === task.assignedEmployee
    );

    const updatedTask: Task = {
      ...task,
      projectName: project?.name || task.projectName,
      company: project?.company || task.company,
      department:
        employee?.department || task.department,
    };

    setTasks((prev) =>
      prev.map((item) =>
        item.id === updatedTask.id
          ? updatedTask
          : item
      )
    );

    setShowEdit(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="p-4 md:p-6 lg:p-8 space-y-6">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <ClipboardList className="h-5 w-5 text-blue-400" />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Tasks
              </h1>

              <p className="text-sm text-zinc-400">
                Assign, track and manage project tasks
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-3 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" />
            Create Task
          </button>
        </div>

        {/* WORKFLOW */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 overflow-x-auto">
          <div className="flex items-center min-w-[850px]">
            {[
              ["ASSIGNED", "Assigned", CircleDot],
              ["IN_PROGRESS", "In Progress", Code2],
              ["UNDER_REVIEW", "Review", Eye],
              ["COMPLETED", "Completed", CheckCircle2],
              ["APPROVED", "Approved", CheckCircle2],
            ].map(
              ([key, label, Icon]: any, index, arr) => (
                <div
                  key={key}
                  className="flex items-center flex-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-blue-400" />
                    </div>

                    <span className="text-sm font-medium whitespace-nowrap">
                      {label}
                    </span>
                  </div>

                  {index < arr.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-zinc-600 mx-4" />
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon={ClipboardList}
          />

          <StatCard
            title="Assigned"
            value={stats.assigned}
            icon={CircleDot}
          />

          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={Code2}
          />

          <StatCard
            title="Under Review"
            value={stats.review}
            icon={Eye}
          />

          <StatCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle2}
          />

          <StatCard
            title="High Priority"
            value={stats.highPriority}
            icon={AlertCircle}
          />
        </div>

        {/* FILTERS */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-zinc-400" />
            <span className="text-sm font-medium">
              Task Filters
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search task, project or employee..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as
                    | "ALL"
                    | TaskStatus
                )
              }
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">
                In Progress
              </option>
              <option value="ON_HOLD">On Hold</option>
              <option value="UNDER_REVIEW">
                Under Review
              </option>
              <option value="COMPLETED">
                Completed
              </option>
              <option value="APPROVED">Approved</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(
                  e.target.value as
                    | "ALL"
                    | TaskPriority
                )
              }
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm outline-none"
            >
              <option value="ALL">All Priority</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            <select
              value={employeeFilter}
              onChange={(e) =>
                setEmployeeFilter(e.target.value)
              }
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm outline-none"
            >
              <option value="ALL">All Employees</option>

              {employees.map((employee) => (
                <option
                  key={employee.name}
                  value={employee.name}
                >
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3">
            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(
                  e.target.value as
                    | "ALL"
                    | TaskType
                )
              }
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm outline-none"
            >
              <option value="ALL">All Task Types</option>
              <option value="DEVELOPMENT">
                Development
              </option>
              <option value="QA">QA</option>
              <option value="DESIGN">Design</option>
              <option value="MARKETING">
                Marketing
              </option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800">
            <h2 className="font-semibold">
              Task List
            </h2>

            <p className="text-xs text-zinc-500 mt-1">
              {filteredTasks.length} task
              {filteredTasks.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-zinc-950/70">
                <tr className="text-left text-xs uppercase tracking-wide text-zinc-500">
                  <th className="px-5 py-4">
                    Task
                  </th>

                  <th className="px-5 py-4">
                    Project
                  </th>

                  <th className="px-5 py-4">
                    Assigned To
                  </th>

                  <th className="px-5 py-4">
                    Priority
                  </th>

                  <th className="px-5 py-4">
                    Due Date
                  </th>

                  <th className="px-5 py-4">
                    Progress
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
                {filteredTasks.map((task) => {
                  const status =
                    statusConfig[task.status];

                  const priority =
                    priorityConfig[task.priority];

                  return (
                    <tr
                      key={task.id}
                      className="hover:bg-zinc-800/30"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium">
                          {task.title}
                        </p>

                        <p className="text-xs text-zinc-500 mt-1">
                          {task.taskCode}
                        </p>

                        <span className="inline-flex mt-2 rounded-md border border-zinc-800 px-2 py-1 text-[10px] text-zinc-400">
                          {task.taskType}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm">
                          {task.projectName}
                        </p>

                        <p className="text-xs text-zinc-500 mt-1">
                          {task.company}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <UserRound className="h-4 w-4 text-blue-400" />
                          </div>

                          <div>
                            <p className="text-sm">
                              {task.assignedEmployee}
                            </p>

                            <p className="text-xs text-zinc-500">
                              {task.department}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs ${priority.className}`}
                        >
                          {priority.label}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <CalendarDays className="h-3.5 w-3.5" />

                          {formatDate(task.dueDate)}
                        </div>
                      </td>

                      <td className="px-5 py-4 min-w-[150px]">
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-zinc-400">
                            Progress
                          </span>

                          <span>
                            {task.progress}%
                          </span>
                        </div>

                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{
                              width: `${task.progress}%`,
                            }}
                          />
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right relative">
                        <button
                          onClick={() =>
                            setOpenMenu(
                              openMenu === task.id
                                ? null
                                : task.id
                            )
                          }
                          className="p-2 rounded-lg hover:bg-zinc-800"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {openMenu === task.id && (
                          <div className="absolute right-5 top-12 z-30 w-44 rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
                            <button
                              onClick={() =>
                                openTask(task)
                              }
                              className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-zinc-800"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </button>

                            <button
                              onClick={() =>
                                editTask(task)
                              }
                              className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-zinc-800"
                            >
                              <Edit3 className="h-4 w-4" />
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                setDeleteId(task.id)
                              }
                              className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredTasks.length === 0 && (
            <div className="py-16 text-center">
              <ClipboardList className="h-10 w-10 mx-auto text-zinc-700" />

              <p className="mt-3 text-sm text-zinc-400">
                No tasks found
              </p>
            </div>
          )}
        </div>
      </div>

      {/* VIEW MODAL */}
      {showView && selectedTask && (
        <Modal
          title="Task Details"
          onClose={() => setShowView(false)}
          wide
        >
          <TaskDetails
            task={selectedTask}
            onStatusChange={updateStatus}
          />

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                setShowView(false);
                editTask(selectedTask);
              }}
              className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm hover:bg-zinc-800"
            >
              Edit Task
            </button>

            <button
              onClick={() => setShowView(false)}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium hover:bg-blue-500"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* ADD */}
      {showAdd && (
        <TaskFormModal
          title="Create New Task"
          task={{
            ...emptyTask,
            taskCode: `TSK-2026-${String(
              tasks.length + 1
            ).padStart(3, "0")}`,
          }}
          mode="add"
          onClose={() => setShowAdd(false)}
          onSave={addTask}
        />
      )}

      {/* EDIT */}
      {showEdit && editingTask && (
        <TaskFormModal
          title="Edit Task"
          task={editingTask}
          mode="edit"
          onClose={() => {
            setShowEdit(false);
            setEditingTask(null);
          }}
          onSave={saveEdit}
        />
      )}

      {/* DELETE */}
      {deleteId && (
        <Modal
          title="Delete Task"
          onClose={() => setDeleteId(null)}
        >
          <p className="text-sm text-zinc-400">
            Are you sure you want to delete this task?
          </p>

          <p className="text-xs text-red-400 mt-2">
            This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setDeleteId(null)}
              className="rounded-xl border border-zinc-700 px-4 py-2.5 text-sm hover:bg-zinc-800"
            >
              Cancel
            </button>

            <button
              onClick={() => deleteTask(deleteId)}
              className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium hover:bg-red-500"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------------- TASK DETAILS ---------------- */

function TaskDetails({
  task,
  onStatusChange,
}: {
  task: Task;
  onStatusChange: (
    id: string,
    status: TaskStatus
  ) => void;
}) {
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div>
            <p className="text-xs text-zinc-500">
              {task.taskCode}
            </p>

            <h2 className="text-xl font-bold mt-1">
              {task.title}
            </h2>

            <p className="text-sm text-zinc-400 mt-1">
              {task.projectName}
            </p>
          </div>

          <div className="flex gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs h-fit ${priority.className}`}
            >
              {priority.label}
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-xs h-fit ${status.className}`}
            >
              {status.label}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-zinc-400">
              Task Progress
            </span>

            <span>{task.progress}%</span>
          </div>

          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{
                width: `${task.progress}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* CLIENT / PROJECT / EMPLOYEE */}
      <div className="grid md:grid-cols-3 gap-4">
        <InfoBox title="Project">
          <InfoRow
            label="Project"
            value={task.projectName}
          />

          <InfoRow
            label="Company"
            value={task.company}
          />

          <InfoRow
            label="Task Type"
            value={task.taskType}
          />
        </InfoBox>

        <InfoBox title="Assigned Employee">
          <InfoRow
            label="Employee"
            value={task.assignedEmployee}
          />

          <InfoRow
            label="Department"
            value={task.department}
          />
        </InfoBox>

        <InfoBox title="Timeline">
          <InfoRow
            label="Start Date"
            value={formatDate(task.startDate)}
          />

          <InfoRow
            label="Due Date"
            value={formatDate(task.dueDate)}
          />
        </InfoBox>
      </div>

      {/* DESCRIPTION */}
      <InfoBox title="Task Description">
        <p className="text-sm text-zinc-300 leading-6">
          {task.description || "-"}
        </p>
      </InfoBox>

      {/* DELIVERABLE */}
      <InfoBox title="Deliverable">
        <p className="text-sm text-zinc-300 leading-6">
          {task.deliverable || "-"}
        </p>
      </InfoBox>

      {/* STATUS */}
      <InfoBox title="Update Task Status">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {(
            [
              "ASSIGNED",
              "IN_PROGRESS",
              "ON_HOLD",
              "UNDER_REVIEW",
              "COMPLETED",
              "APPROVED",
            ] as TaskStatus[]
          ).map((item) => (
            <button
              key={item}
              onClick={() =>
                onStatusChange(task.id, item)
              }
              className={`rounded-xl border px-3 py-2.5 text-xs transition ${
                task.status === item
                  ? "border-blue-500 bg-blue-500/10 text-blue-300"
                  : "border-zinc-800 hover:bg-zinc-800"
              }`}
            >
              {statusConfig[item].label}
            </button>
          ))}
        </div>
      </InfoBox>

      {/* NOTES */}
      <InfoBox title="Notes">
        <p className="text-sm text-zinc-300 leading-6">
          {task.notes || "No notes added."}
        </p>
      </InfoBox>
    </div>
  );
}

/* ---------------- FORM ---------------- */

function TaskFormModal({
  title,
  task,
  mode,
  onClose,
  onSave,
}: {
  title: string;
  task: Task;
  mode: "add" | "edit";
  onClose: () => void;
  onSave: (task: Task) => void;
}) {
  const [form, setForm] = useState<Task>(task);

  const update = <K extends keyof Task>(
    key: K,
    value: Task[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const selectedProject = projects.find(
    (project) => project.id === form.projectId
  );

  const save = () => {
    if (!form.title.trim()) {
      alert("Please enter task title.");
      return;
    }

    if (!form.projectId) {
      alert("Please select a project.");
      return;
    }

    if (!form.assignedEmployee) {
      alert("Please assign an employee.");
      return;
    }

    onSave({
      ...form,
      projectName:
        selectedProject?.name || form.projectName,
      company:
        selectedProject?.company || form.company,
    });
  };

  return (
    <Modal
      title={title}
      onClose={onClose}
      wide
    >
      <div className="space-y-6">

        {/* BASIC */}
        <FormSection title="Task Information">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Task Title"
              value={form.title}
              onChange={(value) =>
                update("title", value)
              }
              placeholder="Enter task title"
            />

            <Input
              label="Task Code"
              value={form.taskCode}
              onChange={(value) =>
                update("taskCode", value)
              }
              placeholder="TSK-2026-001"
            />

            <Select
              label="Project"
              value={form.projectId}
              onChange={(value) => {
                const project = projects.find(
                  (item) => item.id === value
                );

                update("projectId", value);
                update(
                  "projectName",
                  project?.name || ""
                );
                update(
                  "company",
                  project?.company || ""
                );
              }}
              options={projects.map(
                (project) => project.id
              )}
              displayLabels={Object.fromEntries(
                projects.map((project) => [
                  project.id,
                  `${project.name} — ${project.company}`,
                ])
              )}
            />

            <Select
              label="Task Type"
              value={form.taskType}
              onChange={(value) =>
                update(
                  "taskType",
                  value as TaskType
                )
              }
              options={[
                "DEVELOPMENT",
                "QA",
                "DESIGN",
                "MARKETING",
                "OTHER",
              ]}
              displayLabels={{
                DEVELOPMENT: "Development",
                QA: "QA",
                DESIGN: "Design",
                MARKETING: "Marketing",
                OTHER: "Other",
              }}
            />
          </div>
        </FormSection>

        {/* ASSIGNMENT */}
        <FormSection title="Task Assignment">
          <div className="grid md:grid-cols-3 gap-4">
            <Select
              label="Assigned Employee"
              value={form.assignedEmployee}
              onChange={(value) => {
                const employee =
                  employees.find(
                    (item) =>
                      item.name === value
                  );

                update(
                  "assignedEmployee",
                  value
                );

                update(
                  "department",
                  employee?.department ||
                    "Development"
                );
              }}
              options={employees.map(
                (employee) => employee.name
              )}
              displayLabels={Object.fromEntries(
                employees.map((employee) => [
                  employee.name,
                  `${employee.name} — ${employee.role}`,
                ])
              )}
            />

            <Select
              label="Department"
              value={form.department}
              onChange={(value) =>
                update("department", value)
              }
              options={[
                "Management",
                "Sales",
                "Development",
                "QA",
                "Marketing",
                "Accounts",
                "HR",
              ]}
            />

            <Select
              label="Priority"
              value={form.priority}
              onChange={(value) =>
                update(
                  "priority",
                  value as TaskPriority
                )
              }
              options={[
                "HIGH",
                "MEDIUM",
                "LOW",
              ]}
              displayLabels={{
                HIGH: "High",
                MEDIUM: "Medium",
                LOW: "Low",
              }}
            />
          </div>
        </FormSection>

        {/* TIMELINE */}
        <FormSection title="Timeline & Status">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={(value) =>
                update("startDate", value)
              }
            />

            <Input
              label="Due Date"
              type="date"
              value={form.dueDate}
              onChange={(value) =>
                update("dueDate", value)
              }
            />

            <Select
              label="Status"
              value={form.status}
              onChange={(value) =>
                update(
                  "status",
                  value as TaskStatus
                )
              }
              options={[
                "ASSIGNED",
                "IN_PROGRESS",
                "ON_HOLD",
                "UNDER_REVIEW",
                "COMPLETED",
                "APPROVED",
              ]}
              displayLabels={{
                ASSIGNED: "Assigned",
                IN_PROGRESS: "In Progress",
                ON_HOLD: "On Hold",
                UNDER_REVIEW: "Under Review",
                COMPLETED: "Completed",
                APPROVED: "Approved",
              }}
            />

            <Input
              label="Progress %"
              type="number"
              value={String(form.progress)}
              onChange={(value) =>
                update(
                  "progress",
                  Math.min(
                    100,
                    Math.max(
                      0,
                      Number(value) || 0
                    )
                  )
                )
              }
            />
          </div>
        </FormSection>

        {/* DESCRIPTION */}
        <FormSection title="Task Details">
          <div className="grid md:grid-cols-2 gap-4">
            <Textarea
              label="Description"
              value={form.description}
              onChange={(value) =>
                update("description", value)
              }
              placeholder="Describe the task..."
            />

            <Textarea
              label="Deliverable"
              value={form.deliverable}
              onChange={(value) =>
                update("deliverable", value)
              }
              placeholder="What should be delivered?"
            />
          </div>
        </FormSection>

        {/* NOTES */}
        <FormSection title="Notes">
          <Textarea
            label="Task Notes"
            value={form.notes}
            onChange={(value) =>
              update("notes", value)
            }
            placeholder="Add notes..."
          />
        </FormSection>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm hover:bg-zinc-800"
          >
            Cancel
          </button>

          <button
            onClick={save}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold hover:bg-blue-500"
          >
            {mode === "add"
              ? "Create Task"
              : "Save Changes"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ---------------- UI COMPONENTS ---------------- */

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