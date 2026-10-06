"use client";

import { useMemo, useState } from "react";
import { usePersistentState } from "@/lib/persistence";
import {
  ArrowLeftRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Edit3,
  Eye,
  FileText,
  FolderKanban,
  Plus,
  Search,
  Trash2,
  X,
  AlertCircle,
  UserRound,
} from "lucide-react";

type HandoverStatus =
  | "DRAFT"
  | "READY"
  | "HANDED_OVER"
  | "ACCEPTED";

type Handover = {
  id: string;
  handoverCode: string;
  projectName: string;
  company: string;
  contactPerson: string;
  email: string;
  phone: string;

  quotationNo: string;
  paymentNo: string;
  invoiceNo: string;

  projectManager: string;
  developmentLead: string;
  department: string;

  handoverDate: string;
  projectStartDate: string;
  expectedCompletionDate: string;

  requirements: string;
  deliverables: string;
  technology: string;

  paymentStatus: "VERIFIED" | "PENDING";
  invoiceStatus: "PAID" | "PARTIAL" | "SENT";

  checklist: {
    requirementsConfirmed: boolean;
    quotationAttached: boolean;
    paymentVerified: boolean;
    invoiceCreated: boolean;
    teamAssigned: boolean;
    timelineConfirmed: boolean;
  };

  status: HandoverStatus;
  notes: string;
  createdAt: string;
};

const employees = [
  {
    id: "EMP001",
    name: "Riya Shah",
    department: "Sales",
    role: "Sales Manager",
  },
  {
    id: "EMP002",
    name: "Saloni Mehta",
    department: "Sales",
    role: "Sales Executive",
  },
  {
    id: "EMP003",
    name: "Hetvi Shah",
    department: "Development",
    role: "Developer + Project",
  },
  {
    id: "EMP004",
    name: "Dev Patel",
    department: "Development",
    role: "Developer",
  },
  {
    id: "EMP005",
    name: "Hasti Patel",
    department: "QA",
    role: "QA + SEO",
  },
  {
    id: "EMP006",
    name: "Kashis Patel",
    department: "Marketing",
    role: "Digital Marketing",
  },
];

const initialHandovers: Handover[] = [
  {
    id: "HO001",
    handoverCode: "HO-2026-001",
    projectName: "Business CRM Website",
    company: "Joshi Enterprises",
    contactPerson: "Rahul Joshi",
    email: "rahul@joshienterprises.com",
    phone: "+91 98765 43210",

    quotationNo: "QT-2026-001",
    paymentNo: "PAY-2026-002",
    invoiceNo: "INV-2026-003",

    projectManager: "Hetvi Shah",
    developmentLead: "Dev Patel",
    department: "Development",

    handoverDate: "2026-09-18",
    projectStartDate: "2026-09-19",
    expectedCompletionDate: "2026-10-20",

    requirements:
      "Business CRM with lead management, customer management, sales pipeline and reporting.",

    deliverables:
      "Responsive CRM website, admin dashboard, lead module, sales pipeline and reports.",

    technology:
      "Next.js, React, TypeScript, Tailwind CSS, Node.js",

    paymentStatus: "VERIFIED",
    invoiceStatus: "SENT",

    checklist: {
      requirementsConfirmed: true,
      quotationAttached: true,
      paymentVerified: true,
      invoiceCreated: true,
      teamAssigned: true,
      timelineConfirmed: true,
    },

    status: "READY",
    notes: "Ready for development team handover.",
    createdAt: "2026-09-18",
  },

  {
    id: "HO002",
    handoverCode: "HO-2026-002",
    projectName: "Inventory Management Software",
    company: "VS Enterprises",
    contactPerson: "Vivek Shah",
    email: "vivek@vsenterprises.com",
    phone: "+91 98250 12345",

    quotationNo: "QT-2026-002",
    paymentNo: "PAY-2026-003",
    invoiceNo: "INV-2026-002",

    projectManager: "Hetvi Shah",
    developmentLead: "Dev Patel",
    department: "Development",

    handoverDate: "2026-09-16",
    projectStartDate: "2026-09-17",
    expectedCompletionDate: "2026-11-05",

    requirements:
      "Inventory management system for stock, products, suppliers and inventory reports.",

    deliverables:
      "Inventory dashboard, product management, supplier module, stock reports.",

    technology:
      "React, Node.js, Express, MongoDB",

    paymentStatus: "VERIFIED",
    invoiceStatus: "PAID",

    checklist: {
      requirementsConfirmed: true,
      quotationAttached: true,
      paymentVerified: true,
      invoiceCreated: true,
      teamAssigned: true,
      timelineConfirmed: true,
    },

    status: "HANDED_OVER",
    notes: "Project successfully handed over to development.",
    createdAt: "2026-09-16",
  },

  {
    id: "HO003",
    handoverCode: "HO-2026-003",
    projectName: "Healthcare Website",
    company: "Pooja Healthcare",
    contactPerson: "Pooja Mehta",
    email: "contact@poojahealthcare.com",
    phone: "+91 98980 45678",

    quotationNo: "QT-2026-003",
    paymentNo: "PAY-2026-001",
    invoiceNo: "INV-2026-001",

    projectManager: "Saloni Mehta",
    developmentLead: "Dev Patel",
    department: "Development",

    handoverDate: "2026-09-14",
    projectStartDate: "2026-09-15",
    expectedCompletionDate: "2026-10-10",

    requirements:
      "Professional healthcare website with services, doctor information and contact functionality.",

    deliverables:
      "Healthcare website, service pages, doctor section, contact form and responsive design.",

    technology:
      "Next.js, Tailwind CSS, Node.js",

    paymentStatus: "VERIFIED",
    invoiceStatus: "PARTIAL",

    checklist: {
      requirementsConfirmed: true,
      quotationAttached: true,
      paymentVerified: true,
      invoiceCreated: true,
      teamAssigned: true,
      timelineConfirmed: false,
    },

    status: "DRAFT",
    notes: "Timeline confirmation pending.",
    createdAt: "2026-09-14",
  },
];

const emptyChecklist: Handover["checklist"] = {
  requirementsConfirmed: false,
  quotationAttached: false,
  paymentVerified: false,
  invoiceCreated: false,
  teamAssigned: false,
  timelineConfirmed: false,
};

const emptyHandover: Handover = {
  id: "",
  handoverCode: "",
  projectName: "",
  company: "",
  contactPerson: "",
  email: "",
  phone: "",

  quotationNo: "",
  paymentNo: "",
  invoiceNo: "",

  projectManager: "",
  developmentLead: "",
  department: "Development",

  handoverDate: "",
  projectStartDate: "",
  expectedCompletionDate: "",

  requirements: "",
  deliverables: "",
  technology: "",

  paymentStatus: "PENDING",
  invoiceStatus: "SENT",

  checklist: {
    ...emptyChecklist,
  },

  status: "DRAFT",
  notes: "",
  createdAt: "",
};

const statusStyles: Record<
  HandoverStatus,
  string
> = {
  DRAFT:
    "bg-slate-500/15 text-slate-300 border-slate-500/30",
  READY:
    "bg-amber-500/15 text-amber-300 border-amber-500/30",
  HANDED_OVER:
    "bg-blue-500/15 text-blue-300 border-blue-500/30",
  ACCEPTED:
    "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

function formatDate(date: string) {
  if (!date) return "-";

  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusLabel(
  status: HandoverStatus
) {
  return status.replaceAll(
    "_",
    " "
  );
}

function isChecklistComplete(
  checklist: Handover["checklist"]
) {
  return Object.values(checklist).every(
    Boolean
  );
}

function validateDates(
  item: Handover
) {
  if (
    item.handoverDate &&
    item.projectStartDate &&
    item.projectStartDate <
      item.handoverDate
  ) {
    alert(
      "Project Start Date cannot be before Handover Date."
    );
    return false;
  }

  if (
    item.projectStartDate &&
    item.expectedCompletionDate &&
    item.expectedCompletionDate <
      item.projectStartDate
  ) {
    alert(
      "Expected Completion cannot be before Project Start Date."
    );
    return false;
  }

  return true;
}

export default function ProjectHandoverPage() {
  const [
    handovers,
    setHandovers,
  ] = usePersistentState<Handover[]>(
    "tivra_handovers",
    initialHandovers
  );

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<
    "ALL" | HandoverStatus
  >("ALL");

  const [selected, setSelected] =
    useState<Handover | null>(null);

  const [editing, setEditing] =
    useState<Handover | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  const [showDelete, setShowDelete] =
    useState<Handover | null>(null);

  const filteredHandovers =
    useMemo(() => {
      const searchText =
        search.toLowerCase().trim();

      return handovers.filter(
        (item) => {
          const matchesSearch =
            !searchText ||
            item.handoverCode
              .toLowerCase()
              .includes(searchText) ||
            item.projectName
              .toLowerCase()
              .includes(searchText) ||
            item.company
              .toLowerCase()
              .includes(searchText) ||
            item.contactPerson
              .toLowerCase()
              .includes(searchText) ||
            item.projectManager
              .toLowerCase()
              .includes(searchText);

          const matchesStatus =
            statusFilter === "ALL" ||
            item.status === statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      handovers,
      search,
      statusFilter,
    ]);

  const stats = useMemo(
    () => ({
      total: handovers.length,
      ready: handovers.filter(
        (item) =>
          item.status === "READY"
      ).length,
      handedOver:
        handovers.filter(
          (item) =>
            item.status ===
            "HANDED_OVER"
        ).length,
      accepted:
        handovers.filter(
          (item) =>
            item.status === "ACCEPTED"
        ).length,
    }),
    [handovers]
  );

  function getNextHandoverCode() {
    const usedNumbers =
      handovers
        .map((item) => {
          const match =
            item.handoverCode.match(
              /HO-\d+-(\d+)/
            );

          return match
            ? Number(match[1])
            : 0;
        })
        .filter(Boolean);

    const nextNumber =
      Math.max(
        0,
        ...usedNumbers
      ) + 1;

    return `HO-2026-${String(
      nextNumber
    ).padStart(3, "0")}`;
  }

  function openCreate() {
    const newHandover: Handover = {
      ...emptyHandover,
      id: `HO${Date.now()}`,
      handoverCode:
        getNextHandoverCode(),
      handoverDate:
        new Date()
          .toISOString()
          .split("T")[0],
    };

    setEditing(newHandover);
    setShowForm(true);
    setSelected(null);
  }

  function openEdit(
    item: Handover
  ) {
    setEditing({
      ...item,
      checklist: {
        ...item.checklist,
      },
    });

    setShowForm(true);
    setSelected(null);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  function saveHandover() {
    if (!editing) return;

    if (
      !editing.projectName.trim() ||
      !editing.company.trim()
    ) {
      alert(
        "Project Name and Company are required."
      );
      return;
    }

    if (
      !validateDates(editing)
    ) {
      return;
    }

    const checklistComplete =
      isChecklistComplete(
        editing.checklist
      );

    let finalStatus =
      editing.status;

    /*
     * A handover cannot be READY until
     * payment is verified and checklist
     * is complete.
     */
    if (
      (editing.status === "READY" ||
        editing.status ===
          "HANDED_OVER" ||
        editing.status ===
          "ACCEPTED") &&
      (
        editing.paymentStatus !==
          "VERIFIED" ||
        !checklistComplete
      )
    ) {
      alert(
        "Payment must be verified and all checklist items must be completed before this status can be used."
      );
      return;
    }

    if (
      editing.status === "DRAFT" &&
      editing.paymentStatus ===
        "VERIFIED" &&
      checklistComplete
    ) {
      finalStatus = "READY";
    }

    const savedItem: Handover = {
      ...editing,
      projectName:
        editing.projectName.trim(),
      company:
        editing.company.trim(),
      contactPerson:
        editing.contactPerson.trim(),
      email:
        editing.email.trim(),
      phone:
        editing.phone.trim(),
      requirements:
        editing.requirements.trim(),
      deliverables:
        editing.deliverables.trim(),
      technology:
        editing.technology.trim(),
      notes:
        editing.notes.trim(),
      status: finalStatus,
    };

    const existing =
      handovers.some(
        (item) =>
          item.id === savedItem.id
      );

    if (existing) {
      setHandovers((prev) =>
        prev.map((item) =>
          item.id ===
          savedItem.id
            ? savedItem
            : item
        )
      );
    } else {
      setHandovers((prev) => [
        ...prev,
        {
          ...savedItem,
          createdAt:
            new Date()
              .toISOString()
              .split("T")[0],
        },
      ]);
    }

    closeForm();
  }

  function deleteHandover() {
    if (!showDelete) return;

    setHandovers((prev) =>
      prev.filter(
        (item) =>
          item.id !==
          showDelete.id
      )
    );

    setShowDelete(null);
    setSelected(null);
  }

  function updateStatus(
    id: string,
    status: HandoverStatus
  ) {
    const item =
      handovers.find(
        (handover) =>
          handover.id === id
      );

    if (!item) return;

    if (
      status === "HANDED_OVER" ||
      status === "ACCEPTED"
    ) {
      if (
        item.paymentStatus !==
        "VERIFIED"
      ) {
        alert(
          "Payment must be verified before project handover."
        );
        return;
      }

      if (
        !isChecklistComplete(
          item.checklist
        )
      ) {
        alert(
          "Complete all handover checklist items first."
        );
        return;
      }
    }

    if (
      status === "HANDED_OVER" &&
      item.status !== "READY"
    ) {
      alert(
        "Project must be READY before it can be handed over."
      );
      return;
    }

    if (
      status === "ACCEPTED" &&
      item.status !==
        "HANDED_OVER"
    ) {
      alert(
        "Project must be HANDED OVER before it can be accepted."
      );
      return;
    }

    setHandovers((prev) =>
      prev.map((handover) =>
        handover.id === id
          ? {
              ...handover,
              status,
            }
          : handover
      )
    );

    if (
      selected?.id === id
    ) {
      setSelected(
        (prev) =>
          prev
            ? {
                ...prev,
                status,
              }
            : null
      );
    }
  }

  function markAsReady(
    item: Handover
  ) {
    if (
      item.paymentStatus !==
      "VERIFIED"
    ) {
      alert(
        "Payment must be verified first."
      );
      return;
    }

    if (
      !isChecklistComplete(
        item.checklist
      )
    ) {
      alert(
        "Complete all handover checklist items first."
      );
      return;
    }

    updateStatus(
      item.id,
      "READY"
    );
  }

  function markAsHandedOver(
    item: Handover
  ) {
    updateStatus(
      item.id,
      "HANDED_OVER"
    );
  }

  function acceptHandover(
    item: Handover
  ) {
    updateStatus(
      item.id,
      "ACCEPTED"
    );
  }

  function toggleChecklist(
    key: keyof Handover["checklist"]
  ) {
    if (!editing) return;

    const updatedChecklist = {
      ...editing.checklist,
      [key]:
        !editing.checklist[key],
    };

    setEditing({
      ...editing,
      checklist:
        updatedChecklist,
      paymentStatus:
        key === "paymentVerified" &&
        !editing.checklist[key]
          ? "VERIFIED"
          : editing.paymentStatus,
    });
  }

  return (
    <div className="min-h-screen bg-[#080b12] text-white">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-blue-400">
              <ArrowLeftRight className="h-4 w-4" />

              Billing / Invoice → Project Handover
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              Project Handover
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Transfer a verified client project from sales to the development team.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium transition hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            New Project Handover
          </button>
        </div>

        {/* =====================================================
            WORKFLOW
        ===================================================== */}

        <div className="mb-6 rounded-2xl border border-white/10 bg-[#0d111a] p-5">
          <div className="mb-4">
            <h2 className="font-medium">
              Project Handover Workflow
            </h2>

            <p className="text-xs text-slate-500">
              Payment and billing verification controls project handover.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            {[
              {
                title: "Invoice",
                icon: FileText,
                active: true,
              },
              {
                title: "Payment Verified",
                icon: CheckCircle2,
                active: true,
              },
              {
                title: "Handover",
                icon: ArrowLeftRight,
                active: true,
              },
              {
                title: "Development",
                icon: FolderKanban,
                active: false,
              },
              {
                title: "Project",
                icon: ClipboardCheck,
                active: false,
              },
            ].map(
              (
                step,
                index
              ) => {
                const Icon =
                  step.icon;

                return (
                  <div
                    key={
                      step.title
                    }
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111722] p-3"
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        step.active
                          ? "bg-blue-500/15 text-blue-400"
                          : "bg-slate-500/10 text-slate-500"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        {
                          step.title
                        }
                      </p>

                      <p className="text-[11px] text-slate-500">
                        Step{" "}
                        {index +
                          1}
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* =====================================================
            STATS
        ===================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Handovers"
            value={
              stats.total
            }
            icon={
              ArrowLeftRight
            }
          />

          <StatCard
            title="Ready"
            value={
              stats.ready
            }
            icon={
              Clock3
            }
          />

          <StatCard
            title="Handed Over"
            value={
              stats.handedOver
            }
            icon={
              FolderKanban
            }
          />

          <StatCard
            title="Accepted"
            value={
              stats.accepted
            }
            icon={
              CheckCircle2
            }
          />
        </div>

        {/* =====================================================
            FILTERS
        ===================================================== */}

        <div className="mb-4 rounded-2xl border border-white/10 bg-[#0d111a] p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                value={
                  search
                }
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search project, company, contact or handover..."
                className="w-full rounded-xl border border-white/10 bg-[#111722] py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-blue-500/50"
              />
            </div>

            <select
              value={
                statusFilter
              }
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as
                    | "ALL"
                    | HandoverStatus
                )
              }
              className="rounded-xl border border-white/10 bg-[#111722] px-4 py-2.5 text-sm outline-none"
            >
              <option value="ALL">
                All Handover Status
              </option>

              <option value="DRAFT">
                Draft
              </option>

              <option value="READY">
                Ready
              </option>

              <option value="HANDED_OVER">
                Handed Over
              </option>

              <option value="ACCEPTED">
                Accepted
              </option>
            </select>
          </div>
        </div>

        {/* =====================================================
            RESULT COUNT
        ===================================================== */}

        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-300">
              {
                filteredHandovers.length
              }
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-300">
              {
                handovers.length
              }
            </span>{" "}
            handovers
          </p>

          {(search ||
            statusFilter !==
              "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter(
                  "ALL"
                );
              }}
              className="text-xs font-medium text-blue-400 hover:text-blue-300"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* =====================================================
            TABLE
        ===================================================== */}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d111a]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px] text-left">
              <thead className="border-b border-white/10 bg-[#111722]">
                <tr>
                  <th className="px-5 py-4 text-xs font-medium text-slate-400">
                    Handover
                  </th>

                  <th className="px-5 py-4 text-xs font-medium text-slate-400">
                    Project / Client
                  </th>

                  <th className="px-5 py-4 text-xs font-medium text-slate-400">
                    Payment
                  </th>

                  <th className="px-5 py-4 text-xs font-medium text-slate-400">
                    Project Manager
                  </th>

                  <th className="px-5 py-4 text-xs font-medium text-slate-400">
                    Start Date
                  </th>

                  <th className="px-5 py-4 text-xs font-medium text-slate-400">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs font-medium text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {filteredHandovers.map(
                  (item) => (
                    <tr
                      key={
                        item.id
                      }
                      className="transition hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium">
                          {
                            item.handoverCode
                          }
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(
                            item.handoverDate
                          )}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium">
                          {
                            item.projectName
                          }
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {
                            item.company
                          }
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-lg border px-2.5 py-1 text-xs ${
                            item.paymentStatus ===
                            "VERIFIED"
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                              : "border-red-500/20 bg-red-500/10 text-red-300"
                          }`}
                        >
                          {
                            item.paymentStatus
                          }
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm">
                          {
                            item.projectManager
                          }
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {
                            item.developmentLead
                          }
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-300">
                        {formatDate(
                          item.projectStartDate
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-lg border px-2.5 py-1 text-xs ${statusStyles[item.status]}`}
                        >
                          {getStatusLabel(
                            item.status
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <IconButton
                            title="View"
                            onClick={() =>
                              setSelected(
                                item
                              )
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </IconButton>

                          <IconButton
                            title="Edit"
                            onClick={() =>
                              openEdit(
                                item
                              )
                            }
                          >
                            <Edit3 className="h-4 w-4" />
                          </IconButton>

                          <IconButton
                            title="Delete"
                            onClick={() =>
                              setShowDelete(
                                item
                              )
                            }
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  )
                )}

                {filteredHandovers.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={
                        7
                      }
                      className="px-5 py-14 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-slate-500">
                          <Search className="h-5 w-5" />
                        </div>

                        <p className="mt-3 text-sm font-medium text-slate-300">
                          No project handovers found
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Try changing your search or status filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =====================================================
          VIEW MODAL
      ===================================================== */}

      {selected && (
        <Modal
          title={
            selected.handoverCode
          }
          onClose={() =>
            setSelected(null)
          }
          wide
        >
          <div className="space-y-6">
            {/* HEADER */}

            <div className="flex flex-col justify-between gap-3 rounded-xl border border-white/10 bg-[#111722] p-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-medium">
                  {
                    selected.projectName
                  }
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {
                    selected.company
                  }{" "}
                  ·{" "}
                  {
                    selected.contactPerson
                  }
                </p>
              </div>

              <span
                className={`w-fit rounded-lg border px-3 py-1.5 text-xs ${statusStyles[selected.status]}`}
              >
                {getStatusLabel(
                  selected.status
                )}
              </span>
            </div>

            {/* NEXT ACTION MESSAGE */}

            {selected.status ===
              "DRAFT" && (
              <div className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

                <div>
                  <p className="text-sm font-medium text-amber-300">
                    Handover not ready
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-200/70">
                    Complete the checklist and verify payment before handing the project to development.
                  </p>
                </div>
              </div>
            )}

            {/* SALES + BILLING */}

            <Section title="Sales & Billing Connection">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <Info
                  label="Quotation"
                  value={
                    selected.quotationNo
                  }
                />

                <Info
                  label="Payment"
                  value={
                    selected.paymentNo
                  }
                />

                <Info
                  label="Invoice"
                  value={
                    selected.invoiceNo
                  }
                />
              </div>
            </Section>

            {/* CLIENT */}

            <Section title="Client Information">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Info
                  label="Company"
                  value={
                    selected.company
                  }
                />

                <Info
                  label="Contact Person"
                  value={
                    selected.contactPerson
                  }
                />

                <Info
                  label="Email"
                  value={
                    selected.email
                  }
                />

                <Info
                  label="Phone"
                  value={
                    selected.phone
                  }
                />
              </div>
            </Section>

            {/* TEAM */}

            <Section title="Project Team">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Info
                  label="Project Manager"
                  value={
                    selected.projectManager
                  }
                />

                <Info
                  label="Development Lead"
                  value={
                    selected.developmentLead
                  }
                />

                <Info
                  label="Department"
                  value={
                    selected.department
                  }
                />
              </div>
            </Section>

            {/* TIMELINE */}

            <Section title="Project Timeline">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Info
                  label="Handover Date"
                  value={formatDate(
                    selected.handoverDate
                  )}
                />

                <Info
                  label="Project Start"
                  value={formatDate(
                    selected.projectStartDate
                  )}
                />

                <Info
                  label="Expected Completion"
                  value={formatDate(
                    selected.expectedCompletionDate
                  )}
                />
              </div>
            </Section>

            {/* SCOPE */}

            <Section title="Project Scope">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <TextBlock
                  label="Requirements"
                  value={
                    selected.requirements
                  }
                />

                <TextBlock
                  label="Deliverables"
                  value={
                    selected.deliverables
                  }
                />

                <TextBlock
                  label="Technology / Stack"
                  value={
                    selected.technology
                  }
                />
              </div>
            </Section>

            {/* PAYMENT */}

            <Section title="Payment & Invoice Status">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Info
                  label="Payment Status"
                  value={
                    selected.paymentStatus
                  }
                />

                <Info
                  label="Invoice Status"
                  value={
                    selected.invoiceStatus
                  }
                />
              </div>
            </Section>

            {/* CHECKLIST */}

            <Section title="Handover Checklist">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {Object.entries(
                  selected.checklist
                ).map(
                  ([
                    key,
                    value,
                  ]) => (
                    <div
                      key={
                        key
                      }
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111722] p-3"
                    >
                      {value ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Clock3 className="h-4 w-4 text-amber-400" />
                      )}

                      <span className="text-sm text-slate-300">
                        {formatChecklistLabel(
                          key
                        )}
                      </span>
                    </div>
                  )
                )}
              </div>
            </Section>

            {/* NOTES */}

            <Section title="Notes">
              <div className="rounded-xl border border-white/10 bg-[#111722] p-4">
                <p className="text-sm leading-6 text-slate-300">
                  {
                    selected.notes ||
                    "No notes added."
                  }
                </p>
              </div>
            </Section>

            {/* ACTIONS */}

            <div className="flex flex-wrap gap-2 border-t border-white/10 pt-5">
              {selected.status ===
                "DRAFT" && (
                <button
                  type="button"
                  onClick={() =>
                    markAsReady(
                      selected
                    )
                  }
                  className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-medium hover:bg-amber-500"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark as Ready
                </button>
              )}

              {selected.status ===
                "READY" && (
                <button
                  type="button"
                  onClick={() =>
                    markAsHandedOver(
                      selected
                    )
                  }
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium hover:bg-blue-500"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                  Mark as Handed Over
                </button>
              )}

              {selected.status ===
                "HANDED_OVER" && (
                <button
                  type="button"
                  onClick={() =>
                    acceptHandover(
                      selected
                    )
                  }
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium hover:bg-emerald-500"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Accept Handover
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  openEdit(
                    selected
                  )
                }
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#111722] px-4 py-2.5 text-sm hover:bg-white/5"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowDelete(
                    selected
                  )
                }
                className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300 hover:bg-red-500/15"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

      {showForm &&
        editing && (
          <Modal
            title={
              editing.handoverCode
                ? `Project Handover — ${editing.handoverCode}`
                : "New Project Handover"
            }
            onClose={
              closeForm
            }
            wide
          >
            <div className="space-y-6">
              {/* PROJECT + CLIENT */}

              <FormSection title="Project & Client">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    label="Project Name"
                    value={
                      editing.projectName
                    }
                    onChange={(
                      value
                    ) =>
                      setEditing({
                        ...editing,
                        projectName:
                          value,
                      })
                    }
                  />

                  <Input
                    label="Company"
                    value={
                      editing.company
                    }
                    onChange={(
                      value
                    ) =>
                      setEditing({
                        ...editing,
                        company:
                          value,
                      })
                    }
                  />

                  <Input
                    label="Contact Person"
                    value={
                      editing.contactPerson
                    }
                    onChange={(
                      value
                    ) =>
                      setEditing({
                        ...editing,
                        contactPerson:
                          value,
                      })
                    }
                  />

                  <Input
                    label="Email"
                    type="email"
                    value={
                      editing.email
                    }
                    onChange={(
                      value
                    ) =>
                      setEditing({
                        ...editing,
                        email: value,
                      })
                    }
                  />

                  <Input
                    label="Phone"
                    value={
                      editing.phone
                    }
                    onChange={(
                      value
                    ) =>
                      setEditing({
                        ...editing,
                        phone: value,
                      })
                    }
                  />
                </div>
              </FormSection>

              {/* BILLING */}

              <FormSection title="Sales & Billing Connection">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Input
                    label="Quotation No."
                    value={
                      editing.quotationNo
                    }
                    onChange={(
                      value
                    ) =>
                      setEditing({
                        ...editing,
                        quotationNo:
                          value,
                      })
                    }
                  />

                  <Input
                    label="Payment No."
                    value={
                      editing.paymentNo
                    }
                    onChange={(
                      value
                    ) =>
                      setEditing({
                        ...editing,
                        paymentNo:
                          value,
                      })
                    }
                  />

                  <Input
                    label="Invoice No."
                    value={
                      editing.invoiceNo
                    }
                    onChange={(
                      value
                    ) =>
                      setEditing({
                        ...editing,
                        invoiceNo:
                          value,
                      })
                    }
                  />
                </div>
              </FormSection>

              {/* TEAM */}

              <FormSection title="Project Team">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Select
                    label="Project Manager"
                    value={
                      editing.projectManager
                    }
                    options={employees.map(
                      (employee) =>
                        employee.name
                    )}
                    onChange={(
                      value
                    ) =>
                      setEditing({
                        ...editing,
                        projectManager:
                          value,
                      })
                    }
                  />

                  <Select
                    label="Development Lead"
                    value={
                      editing.developmentLead
                    }
                    options={employees
                      .filter(
                        (
                          employee
                        ) =>
                          employee.department ===
                          "Development"
                      )
                      .map(
                        (
                          employee
                        ) =>
                          employee.name
                      )}
                    onChange={(
                      value
                    ) =>
                      setEditing({
                        ...editing,
                        developmentLead:
                          value,
                      })
                    }
                  />

                  <Input
                    label="Department"
                    value={
                      editing.department
                    }
                    onChange={(
                      value
                    ) =>
                      setEditing({
                        ...editing,
                        department:
                          value,
                      })
                    }
                  />
                </div>
              </FormSection>

              {/* TIMELINE */}

              <FormSection title="Timeline">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Input
                    label="Handover Date"
                    type="date"
                    value={
                      editing.handoverDate
                    }
                    onChange={(
                      value
                    ) =>
                      setEditing({
                        ...editing,
                        handoverDate:
                          value,
                      })
                    }
                  />

                  <Input
                    label="Project Start Date"
                    type="date"
                    value={
                      editing.projectStartDate
                    }
                    onChange={(
                      value
                    ) =>
                      setEditing({
                        ...editing,
                        projectStartDate:
                          value,
                      })
                    }
                  />

                  <Input
                    label="Expected Completion"
                    type="date"
                    value={
                      editing.expectedCompletionDate
                    }
                    onChange={(
                      value
                    ) =>
                      setEditing({
                        ...editing,
                        expectedCompletionDate:
                          value,
                      })
                    }
                  />
                </div>
              </FormSection>

              {/* SCOPE */}

              <FormSection title="Project Scope">
                <div className="grid grid-cols-1 gap-4">
                  <TextArea
                    label="Requirements Summary"
                    value={
                      editing.requirements
                    }
                    onChange={(
                      value
                    ) =>
                      setEditing({
                        ...editing,
                        requirements:
                          value,
                      })
                    }
                  />

                  <TextArea
                    label="Deliverables"
                    value={
                      editing.deliverables
                    }
                    onChange={(
                      value
                    ) =>
                      setEditing({
                        ...editing,
                        deliverables:
                          value,
                      })
                    }
                  />

                  <TextArea
                    label="Technology / Stack"
                    value={
                      editing.technology
                    }
                    onChange={(
                      value
                    ) =>
                      setEditing({
                        ...editing,
                        technology:
                          value,
                      })
                    }
                  />
                </div>
              </FormSection>

              {/* PAYMENT */}

              <FormSection title="Payment & Invoice">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Select
                    label="Payment Status"
                    value={
                      editing.paymentStatus
                    }
                    options={[
                      "VERIFIED",
                      "PENDING",
                    ]}
                    onChange={(
                      value
                    ) =>
                      setEditing({
                        ...editing,
                        paymentStatus:
                          value as Handover["paymentStatus"],
                        checklist:
                          {
                            ...editing.checklist,
                            paymentVerified:
                              value ===
                              "VERIFIED",
                          },
                      })
                    }
                  />

                  <Select
                    label="Invoice Status"
                    value={
                      editing.invoiceStatus
                    }
                    options={[
                      "PAID",
                      "PARTIAL",
                      "SENT",
                    ]}
                    onChange={(
                      value
                    ) =>
                      setEditing({
                        ...editing,
                        invoiceStatus:
                          value as Handover["invoiceStatus"],
                      })
                    }
                  />
                </div>
              </FormSection>

              {/* CHECKLIST */}

              <FormSection title="Handover Checklist">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <Checklist
                    label="Requirements Confirmed"
                    checked={
                      editing.checklist
                        .requirementsConfirmed
                    }
                    onClick={() =>
                      toggleChecklist(
                        "requirementsConfirmed"
                      )
                    }
                  />

                  <Checklist
                    label="Quotation Attached"
                    checked={
                      editing.checklist
                        .quotationAttached
                    }
                    onClick={() =>
                      toggleChecklist(
                        "quotationAttached"
                      )
                    }
                  />

                  <Checklist
                    label="Payment Verified"
                    checked={
                      editing.checklist
                        .paymentVerified
                    }
                    onClick={() =>
                      toggleChecklist(
                        "paymentVerified"
                      )
                    }
                  />

                  <Checklist
                    label="Invoice Created"
                    checked={
                      editing.checklist
                        .invoiceCreated
                    }
                    onClick={() =>
                      toggleChecklist(
                        "invoiceCreated"
                      )
                    }
                  />

                  <Checklist
                    label="Team Assigned"
                    checked={
                      editing.checklist
                        .teamAssigned
                    }
                    onClick={() =>
                      toggleChecklist(
                        "teamAssigned"
                      )
                    }
                  />

                  <Checklist
                    label="Timeline Confirmed"
                    checked={
                      editing.checklist
                        .timelineConfirmed
                    }
                    onClick={() =>
                      toggleChecklist(
                        "timelineConfirmed"
                      )
                    }
                  />
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-800/70 px-3 py-2 text-xs text-slate-400">
                  <ClipboardCheck className="h-4 w-4 text-blue-400" />

                  {
                    isChecklistComplete(
                      editing.checklist
                    )
                      ? "All checklist items are complete."
                      : "Complete every checklist item before handover."
                  }
                </div>
              </FormSection>

              {/* STATUS + NOTES */}

              <FormSection title="Status & Notes">
                <div className="grid grid-cols-1 gap-4">
                  <Select
                    label="Handover Status"
                    value={
                      editing.status
                    }
                    options={[
                      "DRAFT",
                      "READY",
                      "HANDED_OVER",
                      "ACCEPTED",
                    ]}
                    onChange={(
                      value
                    ) =>
                      setEditing({
                        ...editing,
                        status:
                          value as HandoverStatus,
                      })
                    }
                  />

                  <TextArea
                    label="Notes"
                    value={
                      editing.notes
                    }
                    onChange={(
                      value
                    ) =>
                      setEditing({
                        ...editing,
                        notes:
                          value,
                      })
                    }
                  />
                </div>
              </FormSection>

              {/* FORM ACTIONS */}

              <div className="flex flex-col-reverse gap-2 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    closeForm
                  }
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    saveHandover
                  }
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium hover:bg-blue-500"
                >
                  Save Handover
                </button>
              </div>
            </div>
          </Modal>
        )}

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      {showDelete && (
        <Modal
          title="Delete Project Handover"
          onClose={() =>
            setShowDelete(
              null
            )
          }
        >
          <div className="space-y-5">
            <div className="flex gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

              <div>
                <p className="text-sm font-medium text-red-300">
                  Confirm deletion
                </p>

                <p className="mt-1 text-sm leading-6 text-red-200/70">
                  Delete{" "}
                  <span className="font-medium text-red-200">
                    {
                      showDelete.handoverCode
                    }
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setShowDelete(
                    null
                  )
                }
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  deleteHandover
                }
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

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{
    className?: string;
  }>;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d111a] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ICON BUTTON
========================================================= */

function IconButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
    >
      {children}
    </button>
  );
}

/* =========================================================
   MODAL
========================================================= */

function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`max-h-[92vh] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f17] shadow-2xl ${
          wide
            ? "max-w-5xl"
            : "max-w-lg"
        }`}
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="font-semibold">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(92vh-70px)] overflow-y-auto p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SECTION
========================================================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-slate-300">
        {title}
      </h3>

      {children}
    </div>
  );
}

/* =========================================================
   FORM SECTION
========================================================= */

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d111a] p-4">
      <h3 className="mb-4 text-sm font-medium text-white">
        {title}
      </h3>

      {children}
    </div>
  );
}

/* =========================================================
   INFO
========================================================= */

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111722] p-3">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm text-slate-200">
        {value || "-"}
      </p>
    </div>
  );
}

/* =========================================================
   TEXT BLOCK
========================================================= */

function TextBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111722] p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">
        {value || "-"}
      </p>
    </div>
  );
}

/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-slate-400">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="w-full rounded-xl border border-white/10 bg-[#111722] px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500/50"
      />
    </label>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-slate-400">
        {label}
      </span>

      <textarea
        rows={3}
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="w-full resize-none rounded-xl border border-white/10 bg-[#111722] px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500/50"
      />
    </label>
  );
}

/* =========================================================
   SELECT
========================================================= */

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-slate-400">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="w-full rounded-xl border border-white/10 bg-[#111722] px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500/50"
      >
        <option value="">
          Select {label}
        </option>

        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          )
        )}
      </select>
    </label>
  );
}

/* =========================================================
   CHECKLIST
========================================================= */

function Checklist({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
        checked
          ? "border-emerald-500/20 bg-emerald-500/5"
          : "border-white/10 bg-[#111722] hover:bg-white/[0.03]"
      }`}
    >
      <div
        className={`flex h-5 w-5 items-center justify-center rounded-md border ${
          checked
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-slate-600"
        }`}
      >
        {checked && (
          <CheckCircle2 className="h-4 w-4" />
        )}
      </div>

      <span className="text-sm text-slate-300">
        {label}
      </span>
    </button>
  );
}

/* =========================================================
   CHECKLIST LABEL
========================================================= */

function formatChecklistLabel(
  key: string
) {
  return key
    .replace(
      /([A-Z])/g,
      " $1"
    )
    .replace(
      /^./,
      (value) =>
        value.toUpperCase()
    );
}