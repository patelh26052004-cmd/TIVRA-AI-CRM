"use client";

import { useMemo, useState } from "react";
import { usePersistentState } from "@/lib/persistence";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Code2,
  Edit3,
  Eye,
  FolderKanban,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  UserRound,
  Users,
  X,
  PauseCircle,
  CircleDot,
  ClipboardCheck,
} from "lucide-react";

type ProjectStatus =
  | "NOT_STARTED"
  | "ACTIVE"
  | "ON_HOLD"
  | "UNDER_REVIEW"
  | "COMPLETED"
  | "CLOSED";

type Project = {
  id: string;
  projectCode: string;
  projectName: string;
  company: string;
  contactPerson: string;
  email: string;
  phone: string;

  handoverCode: string;
  quotationNo: string;
  paymentNo: string;
  invoiceNo: string;

  projectManager: string;
  developmentLead: string;
  department: string;

  startDate: string;
  expectedCompletionDate: string;

  status: ProjectStatus;
  progress: number;

  requirements: string;
  deliverables: string;
  technology: string;

  developmentProgress: number;
  qaProgress: number;
  reviewProgress: number;

  createdAt: string;
  notes: string;
};

type Employee = {
  id: string;
  name: string;
  department: string;
  role: string;
};

const employees: Employee[] = [
  {
    id: "EMP-001",
    name: "Riya Shah",
    department: "Sales",
    role: "Sales Manager",
  },
  {
    id: "EMP-002",
    name: "Saloni Mehta",
    department: "Sales",
    role: "Sales Executive",
  },
  {
    id: "EMP-003",
    name: "Hetvi Shah",
    department: "Development",
    role: "Developer + Project",
  },
  {
    id: "EMP-004",
    name: "Dev Patel",
    department: "Development",
    role: "Developer",
  },
  {
    id: "EMP-005",
    name: "Hasti Patel",
    department: "QA",
    role: "QA + SEO",
  },
  {
    id: "EMP-006",
    name: "Kashis Patel",
    department: "Marketing",
    role: "Digital Marketing",
  },
];

const initialProjects: Project[] = [
  {
    id: "PRJ-001",
    projectCode: "PRJ-2026-001",
    projectName: "Business CRM Website",
    company: "Joshi Enterprises",
    contactPerson: "Rahul Joshi",
    email: "rahul@joshienterprises.com",
    phone: "+91 98765 43210",

    handoverCode: "HO-2026-001",
    quotationNo: "QT-2026-001",
    paymentNo: "PAY-2026-002",
    invoiceNo: "INV-2026-003",

    projectManager: "Hetvi Shah",
    developmentLead: "Dev Patel",
    department: "Development",

    startDate: "2026-09-10",
    expectedCompletionDate: "2026-10-15",

    status: "ACTIVE",
    progress: 35,

    requirements:
      "Business CRM with lead management, sales pipeline, quotation and reporting.",
    deliverables:
      "CRM dashboard, Lead CRM, Sales Pipeline, Quotation and Reports.",
    technology: "Next.js, React, Node.js, PostgreSQL",

    developmentProgress: 55,
    qaProgress: 10,
    reviewProgress: 0,

    createdAt: "2026-09-10",
    notes: "Development started after successful project handover.",
  },

  {
    id: "PRJ-002",
    projectCode: "PRJ-2026-002",
    projectName: "Inventory Management Software",
    company: "VS Enterprises",
    contactPerson: "Vishal Shah",
    email: "vishal@vsenterprises.com",
    phone: "+91 98250 12345",

    handoverCode: "HO-2026-002",
    quotationNo: "QT-2026-002",
    paymentNo: "PAY-2026-003",
    invoiceNo: "INV-2026-002",

    projectManager: "Saloni Mehta",
    developmentLead: "Dev Patel",
    department: "Development",

    startDate: "2026-08-20",
    expectedCompletionDate: "2026-09-30",

    status: "UNDER_REVIEW",
    progress: 82,

    requirements:
      "Inventory management software for stock, products, suppliers and reports.",
    deliverables:
      "Inventory dashboard, Product management, Stock tracking and Reports.",
    technology: "React, Node.js, Express, MongoDB",

    developmentProgress: 100,
    qaProgress: 90,
    reviewProgress: 65,

    createdAt: "2026-08-20",
    notes: "QA completed. Final client review is pending.",
  },

  {
    id: "PRJ-003",
    projectCode: "PRJ-2026-003",
    projectName: "Healthcare Website",
    company: "Pooja Healthcare",
    contactPerson: "Pooja Mehta",
    email: "contact@poojahealthcare.com",
    phone: "+91 99090 45678",

    handoverCode: "HO-2026-003",
    quotationNo: "QT-2026-003",
    paymentNo: "PAY-2026-001",
    invoiceNo: "INV-2026-001",

    projectManager: "Hetvi Shah",
    developmentLead: "Dev Patel",
    department: "Development",

    startDate: "2026-09-05",
    expectedCompletionDate: "2026-10-05",

    status: "NOT_STARTED",
    progress: 0,

    requirements:
      "Professional healthcare website with service information and enquiry forms.",
    deliverables:
      "Healthcare website, service pages, contact form and admin content section.",
    technology: "Next.js, Tailwind CSS, Node.js",

    developmentProgress: 0,
    qaProgress: 0,
    reviewProgress: 0,

    createdAt: "2026-09-05",
    notes: "Waiting for final project kickoff.",
  },

  {
    id: "PRJ-004",
    projectCode: "PRJ-2026-004",
    projectName: "Restaurant Website",
    company: "Royal Restaurant",
    contactPerson: "Amit Patel",
    email: "amit@royalrestaurant.com",
    phone: "+91 98980 11223",

    handoverCode: "HO-2026-004",
    quotationNo: "QT-2026-005",
    paymentNo: "PAY-2026-005",
    invoiceNo: "INV-2026-005",

    projectManager: "Saloni Mehta",
    developmentLead: "Hetvi Shah",
    department: "Development",

    startDate: "2026-07-01",
    expectedCompletionDate: "2026-07-30",

    status: "COMPLETED",
    progress: 100,

    requirements:
      "Restaurant website with menu, gallery, contact and reservation enquiry.",
    deliverables:
      "Responsive restaurant website, menu section, gallery and contact form.",
    technology: "React, Tailwind CSS, Node.js",

    developmentProgress: 100,
    qaProgress: 100,
    reviewProgress: 100,

    createdAt: "2026-07-01",
    notes: "Project completed and approved by client.",
  },
];

const statusConfig: Record<
  ProjectStatus,
  {
    label: string;
    className: string;
  }
> = {
  NOT_STARTED: {
    label: "Not Started",
    className: "bg-slate-500/10 text-slate-300 border-slate-500/20",
  },
  ACTIVE: {
    label: "Active",
    className: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  },
  ON_HOLD: {
    label: "On Hold",
    className: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    className:
      "bg-purple-500/10 text-purple-300 border-purple-500/20",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  },
  CLOSED: {
    label: "Closed",
    className: "bg-gray-500/10 text-gray-300 border-gray-500/20",
  },
};

const emptyProject: Project = {
  id: "",
  projectCode: "",
  projectName: "",
  company: "",
  contactPerson: "",
  email: "",
  phone: "",

  handoverCode: "",
  quotationNo: "",
  paymentNo: "",
  invoiceNo: "",

  projectManager: "",
  developmentLead: "",
  department: "Development",

  startDate: "",
  expectedCompletionDate: "",

  status: "NOT_STARTED",
  progress: 0,

  requirements: "",
  deliverables: "",
  technology: "",

  developmentProgress: 0,
  qaProgress: 0,
  reviewProgress: 0,

  createdAt: new Date().toISOString().slice(0, 10),
  notes: "",
};

export default function ProjectsPage() {
  const [projects, setProjects] = usePersistentState<Project[]>("tivra_projects", initialProjects);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ProjectStatus>(
    "ALL"
  );

  const [selectedProject, setSelectedProject] = useState<Project | null>(
    null
  );

  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const query = search.toLowerCase();

      const matchesSearch =
        project.projectName.toLowerCase().includes(query) ||
        project.company.toLowerCase().includes(query) ||
        project.projectCode.toLowerCase().includes(query) ||
        project.contactPerson.toLowerCase().includes(query) ||
        project.projectManager.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  const stats = useMemo(() => {
    const total = projects.length;

    const active = projects.filter(
      (project) => project.status === "ACTIVE"
    ).length;

    const review = projects.filter(
      (project) => project.status === "UNDER_REVIEW"
    ).length;

    const completed = projects.filter(
      (project) =>
        project.status === "COMPLETED" || project.status === "CLOSED"
    ).length;

    const averageProgress =
      total === 0
        ? 0
        : Math.round(
            projects.reduce((sum, project) => sum + project.progress, 0) /
              total
          );

    return {
      total,
      active,
      review,
      completed,
      averageProgress,
    };
  }, [projects]);

  const openProject = (project: Project) => {
    setSelectedProject(project);
    setShowViewModal(true);
    setOpenMenu(null);
  };

  const startEdit = (project: Project) => {
    setEditingProject({ ...project });
    setShowEditModal(true);
    setOpenMenu(null);
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
    setDeleteId(null);
  };

  const updateProjectStatus = (
    id: string,
    status: ProjectStatus
  ) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== id) return project;

        let progress = project.progress;

        if (status === "NOT_STARTED") progress = 0;
        if (status === "ACTIVE" && progress === 0) progress = 10;
        if (status === "UNDER_REVIEW" && progress < 80) progress = 80;
        if (status === "COMPLETED") progress = 100;
        if (status === "CLOSED") progress = 100;

        return {
          ...project,
          status,
          progress,
        };
      })
    );

    setSelectedProject((prev) =>
      prev
        ? {
            ...prev,
            status,
            progress:
              status === "COMPLETED" || status === "CLOSED"
                ? 100
                : prev.progress,
          }
        : null
    );
  };

  const saveProject = () => {
    if (!editingProject) return;

    setProjects((prev) =>
      prev.map((project) =>
        project.id === editingProject.id ? editingProject : project
      )
    );

    setShowEditModal(false);
    setEditingProject(null);
  };

  const addProject = (project: Project) => {
    const newProject = {
      ...project,
      id: `PRJ-${Date.now()}`,
      projectCode:
        project.projectCode ||
        `PRJ-2026-${String(projects.length + 1).padStart(3, "0")}`,
    };

    setProjects((prev) => [newProject, ...prev]);
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
                <FolderKanban className="h-5 w-5 text-blue-400" />
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Projects
                </h1>
                <p className="text-sm text-zinc-400">
                  Manage project delivery from handover to completion
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-3 text-sm font-semibold transition"
          >
            <Plus className="h-4 w-4" />
            Create Project
          </button>
        </div>

        {/* WORKFLOW */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[850px]">
            {[
              {
                title: "Handover",
                icon: ClipboardCheck,
              },
              {
                title: "Development",
                icon: Code2,
              },
              {
                title: "QA",
                icon: CheckCircle2,
              },
              {
                title: "Review",
                icon: Eye,
              },
              {
                title: "Completed",
                icon: CheckCircle2,
              },
            ].map((step, index, arr) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="flex items-center flex-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-blue-400" />
                    </div>

                    <span className="text-sm font-medium whitespace-nowrap">
                      {step.title}
                    </span>
                  </div>

                  {index < arr.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-zinc-600 mx-4" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Projects"
            value={stats.total}
            icon={FolderKanban}
          />

          <StatCard
            title="Active"
            value={stats.active}
            icon={CircleDot}
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
            title="Avg. Progress"
            value={`${stats.averageProgress}%`}
            icon={TrendingIcon}
          />
        </div>

        {/* SEARCH + FILTER */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search project, company, contact or manager..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as "ALL" | ProjectStatus
                )
              }
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="NOT_STARTED">Not Started</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="COMPLETED">Completed</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        {/* PROJECT TABLE */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800">
            <h2 className="font-semibold">Project List</h2>
            <p className="text-xs text-zinc-500 mt-1">
              {filteredProjects.length} project
              {filteredProjects.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-zinc-950/70">
                <tr className="text-left text-xs uppercase tracking-wide text-zinc-500">
                  <th className="px-5 py-4">Project</th>
                  <th className="px-5 py-4">Client</th>
                  <th className="px-5 py-4">Manager</th>
                  <th className="px-5 py-4">Timeline</th>
                  <th className="px-5 py-4">Progress</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800">
                {filteredProjects.map((project) => {
                  const status = statusConfig[project.status];

                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-zinc-800/30 transition"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-sm">
                            {project.projectName}
                          </p>

                          <p className="text-xs text-zinc-500 mt-1">
                            {project.projectCode}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm">{project.company}</p>
                        <p className="text-xs text-zinc-500 mt-1">
                          {project.contactPerson}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <UserRound className="h-4 w-4 text-blue-400" />
                          </div>

                          <div>
                            <p className="text-sm">
                              {project.projectManager}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {project.department}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <CalendarDays className="h-3.5 w-3.5" />

                          {formatDate(project.startDate)}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                          <Clock3 className="h-3.5 w-3.5" />

                          {formatDate(project.expectedCompletionDate)}
                        </div>
                      </td>

                      <td className="px-5 py-4 min-w-[150px]">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-zinc-400">
                            Progress
                          </span>

                          <span className="font-medium">
                            {project.progress}%
                          </span>
                        </div>

                        <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{
                              width: `${project.progress}%`,
                            }}
                          />
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right relative">
                        <button
                          onClick={() =>
                            setOpenMenu(
                              openMenu === project.id
                                ? null
                                : project.id
                            )
                          }
                          className="p-2 rounded-lg hover:bg-zinc-800"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {openMenu === project.id && (
                          <div className="absolute right-5 top-12 z-30 w-44 rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
                            <button
                              onClick={() => openProject(project)}
                              className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-zinc-800"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </button>

                            <button
                              onClick={() => startEdit(project)}
                              className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-zinc-800"
                            >
                              <Edit3 className="h-4 w-4" />
                              Edit
                            </button>

                            <button
                              onClick={() => setDeleteId(project.id)}
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

          {filteredProjects.length === 0 && (
            <div className="py-16 text-center">
              <FolderKanban className="h-10 w-10 mx-auto text-zinc-700" />

              <p className="mt-3 text-sm text-zinc-400">
                No projects found
              </p>
            </div>
          )}
        </div>
      </div>

      {/* VIEW MODAL */}
      {showViewModal && selectedProject && (
        <Modal
          title="Project Details"
          onClose={() => setShowViewModal(false)}
          wide
        >
          <ProjectDetails project={selectedProject} />

          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3">
              Project Status
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {(
                [
                  "NOT_STARTED",
                  "ACTIVE",
                  "ON_HOLD",
                  "UNDER_REVIEW",
                  "COMPLETED",
                ] as ProjectStatus[]
              ).map((status) => (
                <button
                  key={status}
                  onClick={() =>
                    updateProjectStatus(selectedProject.id, status)
                  }
                  className={`rounded-xl border px-3 py-2 text-xs transition ${
                    selectedProject.status === status
                      ? "border-blue-500 bg-blue-500/10 text-blue-300"
                      : "border-zinc-800 hover:bg-zinc-800"
                  }`}
                >
                  {statusConfig[status].label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => {
                setShowViewModal(false);
                startEdit(selectedProject);
              }}
              className="rounded-xl border border-zinc-700 px-4 py-2.5 text-sm hover:bg-zinc-800"
            >
              Edit Project
            </button>

            <button
              onClick={() => setShowViewModal(false)}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium hover:bg-blue-500"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <ProjectFormModal
          title="Create New Project"
          project={{
            ...emptyProject,
            id: "",
            projectCode: `PRJ-2026-${String(
              projects.length + 1
            ).padStart(3, "0")}`,
          }}
          onClose={() => setShowAddModal(false)}
          onSave={addProject}
          mode="add"
        />
      )}

      {/* EDIT MODAL */}
      {showEditModal && editingProject && (
        <ProjectFormModal
          title="Edit Project"
          project={editingProject}
          onClose={() => {
            setShowEditModal(false);
            setEditingProject(null);
          }}
          onSave={(project) => {
            setEditingProject(project);
            setProjects((prev) =>
              prev.map((item) =>
                item.id === project.id ? project : item
              )
            );
            setShowEditModal(false);
            setEditingProject(null);
          }}
          mode="edit"
        />
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <Modal
          title="Delete Project"
          onClose={() => setDeleteId(null)}
        >
          <div className="py-2">
            <p className="text-sm text-zinc-400">
              Are you sure you want to delete this project?
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
                onClick={() => deleteProject(deleteId)}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

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
          <p className="text-xs text-zinc-500">{title}</p>

          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>

        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-blue-400" />
        </div>
      </div>
    </div>
  );
}

function TrendingIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="14 7 21 7 21 14" />
    </svg>
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
          <h2 className="font-semibold">{title}</h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function ProjectDetails({
  project,
}: {
  project: Project;
}) {
  const status = statusConfig[project.status];

  return (
    <div className="space-y-6">
      {/* TOP */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <p className="text-xs text-zinc-500">
              {project.projectCode}
            </p>

            <h3 className="text-xl font-bold mt-1">
              {project.projectName}
            </h3>

            <p className="text-sm text-zinc-400 mt-1">
              {project.company}
            </p>
          </div>

          <span
            className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-zinc-400">
              Overall Progress
            </span>

            <span>{project.progress}%</span>
          </div>

          <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{
                width: `${project.progress}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* CLIENT + TEAM */}
      <div className="grid md:grid-cols-2 gap-4">
        <InfoBox title="Client Information">
          <InfoRow
            label="Company"
            value={project.company}
          />
          <InfoRow
            label="Contact"
            value={project.contactPerson}
          />
          <InfoRow label="Email" value={project.email} />
          <InfoRow label="Phone" value={project.phone} />
        </InfoBox>

        <InfoBox title="Project Team">
          <InfoRow
            label="Project Manager"
            value={project.projectManager}
          />
          <InfoRow
            label="Development Lead"
            value={project.developmentLead}
          />
          <InfoRow
            label="Department"
            value={project.department}
          />
        </InfoBox>
      </div>

      {/* CONNECTIONS */}
      <InfoBox title="Sales & Billing Connection">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ConnectionItem
            label="Handover"
            value={project.handoverCode}
          />

          <ConnectionItem
            label="Quotation"
            value={project.quotationNo}
          />

          <ConnectionItem
            label="Payment"
            value={project.paymentNo}
          />

          <ConnectionItem
            label="Invoice"
            value={project.invoiceNo}
          />
        </div>
      </InfoBox>

      {/* TIMELINE */}
      <InfoBox title="Project Timeline">
        <div className="grid md:grid-cols-2 gap-4">
          <InfoRow
            label="Start Date"
            value={formatDate(project.startDate)}
          />

          <InfoRow
            label="Expected Completion"
            value={formatDate(
              project.expectedCompletionDate
            )}
          />
        </div>
      </InfoBox>

      {/* PROGRESS */}
      <InfoBox title="Delivery Progress">
        <ProgressRow
          label="Development"
          value={project.developmentProgress}
        />

        <ProgressRow label="QA" value={project.qaProgress} />

        <ProgressRow
          label="Client Review"
          value={project.reviewProgress}
        />
      </InfoBox>

      {/* SCOPE */}
      <InfoBox title="Project Scope">
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <p className="text-xs text-zinc-500 mb-2">
              Requirements
            </p>

            <p className="text-sm text-zinc-300 leading-6">
              {project.requirements || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-2">
              Deliverables
            </p>

            <p className="text-sm text-zinc-300 leading-6">
              {project.deliverables || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-2">
              Technology
            </p>

            <p className="text-sm text-zinc-300 leading-6">
              {project.technology || "-"}
            </p>
          </div>
        </div>
      </InfoBox>

      {/* NOTES */}
      <InfoBox title="Notes">
        <p className="text-sm text-zinc-300 leading-6">
          {project.notes || "No notes added."}
        </p>
      </InfoBox>
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
    <div className="flex items-start justify-between gap-4 py-2 border-b border-zinc-800 last:border-0">
      <span className="text-xs text-zinc-500">
        {label}
      </span>

      <span className="text-sm text-zinc-300 text-right">
        {value || "-"}
      </span>
    </div>
  );
}

function ConnectionItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="text-sm font-medium mt-1">{value || "-"}</p>
    </div>
  );
}

function ProgressRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between text-xs mb-2">
        <span className="text-zinc-400">{label}</span>
        <span>{value}%</span>
      </div>

      <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full"
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}

function ProjectFormModal({
  title,
  project,
  onClose,
  onSave,
  mode,
}: {
  title: string;
  project: Project;
  onClose: () => void;
  onSave: (project: Project) => void;
  mode: "add" | "edit";
}) {
  const [form, setForm] = useState<Project>(project);

  const update = <K extends keyof Project>(
    key: K,
    value: Project[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const save = () => {
    if (!form.projectName.trim()) {
      alert("Please enter project name.");
      return;
    }

    if (!form.company.trim()) {
      alert("Please enter company name.");
      return;
    }

    if (!form.projectManager.trim()) {
      alert("Please select project manager.");
      return;
    }

    onSave(form);
  };

  return (
    <Modal title={title} onClose={onClose} wide>
      <div className="space-y-6">
        {/* BASIC */}
        <FormSection title="Project Information">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Project Name"
              value={form.projectName}
              onChange={(value) =>
                update("projectName", value)
              }
              placeholder="Enter project name"
            />

            <Input
              label="Project Code"
              value={form.projectCode}
              onChange={(value) =>
                update("projectCode", value)
              }
              placeholder="PRJ-2026-001"
            />

            <Input
              label="Company / Client"
              value={form.company}
              onChange={(value) =>
                update("company", value)
              }
              placeholder="Company name"
            />

            <Input
              label="Contact Person"
              value={form.contactPerson}
              onChange={(value) =>
                update("contactPerson", value)
              }
              placeholder="Contact person"
            />

            <Input
              label="Email"
              value={form.email}
              onChange={(value) =>
                update("email", value)
              }
              placeholder="client@example.com"
            />

            <Input
              label="Phone"
              value={form.phone}
              onChange={(value) =>
                update("phone", value)
              }
              placeholder="+91"
            />
          </div>
        </FormSection>

        {/* CONNECTION */}
        <FormSection title="Sales & Billing Connection">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Handover Code"
              value={form.handoverCode}
              onChange={(value) =>
                update("handoverCode", value)
              }
              placeholder="HO-2026-001"
            />

            <Input
              label="Quotation No."
              value={form.quotationNo}
              onChange={(value) =>
                update("quotationNo", value)
              }
              placeholder="QT-2026-001"
            />

            <Input
              label="Payment No."
              value={form.paymentNo}
              onChange={(value) =>
                update("paymentNo", value)
              }
              placeholder="PAY-2026-001"
            />

            <Input
              label="Invoice No."
              value={form.invoiceNo}
              onChange={(value) =>
                update("invoiceNo", value)
              }
              placeholder="INV-2026-001"
            />
          </div>
        </FormSection>

        {/* TEAM */}
        <FormSection title="Project Team">
          <div className="grid md:grid-cols-3 gap-4">
            <Select
              label="Project Manager"
              value={form.projectManager}
              onChange={(value) =>
                update("projectManager", value)
              }
              options={employees
                .filter(
                  (employee) =>
                    employee.department === "Sales" ||
                    employee.name === "Hetvi Shah"
                )
                .map((employee) => employee.name)}
            />

            <Select
              label="Development Lead"
              value={form.developmentLead}
              onChange={(value) =>
                update("developmentLead", value)
              }
              options={employees
                .filter(
                  (employee) =>
                    employee.department === "Development"
                )
                .map((employee) => employee.name)}
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
              ]}
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
              label="Expected Completion"
              type="date"
              value={form.expectedCompletionDate}
              onChange={(value) =>
                update("expectedCompletionDate", value)
              }
            />

            <Select
              label="Status"
              value={form.status}
              onChange={(value) =>
                update(
                  "status",
                  value as ProjectStatus
                )
              }
              options={[
                "NOT_STARTED",
                "ACTIVE",
                "ON_HOLD",
                "UNDER_REVIEW",
                "COMPLETED",
                "CLOSED",
              ]}
              displayLabels={{
                NOT_STARTED: "Not Started",
                ACTIVE: "Active",
                ON_HOLD: "On Hold",
                UNDER_REVIEW: "Under Review",
                COMPLETED: "Completed",
                CLOSED: "Closed",
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
                    Math.max(0, Number(value) || 0)
                  )
                )
              }
            />
          </div>
        </FormSection>

        {/* SCOPE */}
        <FormSection title="Project Scope">
          <div className="grid md:grid-cols-3 gap-4">
            <Textarea
              label="Requirements"
              value={form.requirements}
              onChange={(value) =>
                update("requirements", value)
              }
              placeholder="Project requirements"
            />

            <Textarea
              label="Deliverables"
              value={form.deliverables}
              onChange={(value) =>
                update("deliverables", value)
              }
              placeholder="Project deliverables"
            />

            <Textarea
              label="Technology / Stack"
              value={form.technology}
              onChange={(value) =>
                update("technology", value)
              }
              placeholder="React, Node.js..."
            />
          </div>
        </FormSection>

        {/* DELIVERY */}
        <FormSection title="Delivery Progress">
          <div className="grid md:grid-cols-3 gap-4">
            <Input
              label="Development Progress %"
              type="number"
              value={String(form.developmentProgress)}
              onChange={(value) =>
                update(
                  "developmentProgress",
                  Math.min(
                    100,
                    Math.max(0, Number(value) || 0)
                  )
                )
              }
            />

            <Input
              label="QA Progress %"
              type="number"
              value={String(form.qaProgress)}
              onChange={(value) =>
                update(
                  "qaProgress",
                  Math.min(
                    100,
                    Math.max(0, Number(value) || 0)
                  )
                )
              }
            />

            <Input
              label="Review Progress %"
              type="number"
              value={String(form.reviewProgress)}
              onChange={(value) =>
                update(
                  "reviewProgress",
                  Math.min(
                    100,
                    Math.max(0, Number(value) || 0)
                  )
                )
              }
            />
          </div>
        </FormSection>

        {/* NOTES */}
        <FormSection title="Notes">
          <Textarea
            label="Project Notes"
            value={form.notes}
            onChange={(value) =>
              update("notes", value)
            }
            placeholder="Add project notes..."
          />
        </FormSection>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-2">
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
              ? "Create Project"
              : "Save Changes"}
          </button>
        </div>
      </div>
    </Modal>
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
        onChange={(e) => onChange(e.target.value)}
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
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option} value={option}>
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
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm outline-none focus:border-blue-500 resize-none"
      />
    </div>
  );
}

function formatDate(date: string) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}