"use client";

import { useMemo, useState } from "react";
import { usePersistentState } from "@/lib/persistence";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Copy,
  Trash2,
  UserPlus,
  X,
  Check,
  ChevronRight,
  FileText,
  Clock3,
  CreditCard,
  History,
  CheckCircle2,
  XCircle,
} from "lucide-react";

type QuotationStatus =
  | "DRAFT"
  | "SENT"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "ACCEPTED"
  | "EXPIRED"
  | "CANCELLED";

type Employee = {
  id: number;
  name: string;
  department: string;
  role: string;
};

type QuotationItem = {
  id: number;
  name: string;
  description: string;
  quantity: number;
  rate: number;
};

type QuotationVersion = {
  version: number;
  date: string;
  createdBy: string;
  amount: number;
  status: QuotationStatus;
  note: string;
};

type Quotation = {
  id: number;
  quotationNo: string;
  version: number;
  leadId: number;
  customerName: string;
  company: string;
  email: string;
  phone: string;
  product: string;
  assignedEmployeeId: number | null;
  status: QuotationStatus;
  validUntil: string;
  paymentTerms: string;
  discount: number;
  tax: number;
  notes: string;
  items: QuotationItem[];
  createdAt: string;
  versions: QuotationVersion[];
};

const employees: Employee[] = [
  {
    id: 1,
    name: "Riya Shah",
    department: "Sales",
    role: "Sales Manager",
  },
  {
    id: 2,
    name: "Saloni Mehta",
    department: "Sales",
    role: "Sales Executive",
  },
  {
    id: 3,
    name: "Hetvi Shah",
    department: "Sales",
    role: "Sales + Project",
  },
  {
    id: 4,
    name: "Dev Patel",
    department: "Development",
    role: "Developer",
  },
  {
    id: 5,
    name: "Kashis Patel",
    department: "Marketing",
    role: "Digital Marketing",
  },
  {
    id: 6,
    name: "Hinal Patel",
    department: "Marketing",
    role: "Digital Marketing",
  },
];

const statusConfig: Record<
  QuotationStatus,
  { label: string; className: string }
> = {
  DRAFT: {
    label: "Draft",
    className:
      "bg-slate-500/10 text-slate-300 border-slate-500/20",
  },
  SENT: {
    label: "Sent",
    className:
      "bg-blue-500/10 text-blue-300 border-blue-500/20",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    className:
      "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  },
  APPROVED: {
    label: "Approved",
    className:
      "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  },
  REJECTED: {
    label: "Rejected",
    className:
      "bg-red-500/10 text-red-300 border-red-500/20",
  },
  ACCEPTED: {
    label: "Accepted",
    className:
      "bg-green-500/10 text-green-300 border-green-500/20",
  },
  EXPIRED: {
    label: "Expired",
    className:
      "bg-orange-500/10 text-orange-300 border-orange-500/20",
  },
  CANCELLED: {
    label: "Cancelled",
    className:
      "bg-gray-500/10 text-gray-300 border-gray-500/20",
  },
};

const emptyItem = (): QuotationItem => ({
  id: Date.now() + Math.floor(Math.random() * 10000),
  name: "",
  description: "",
  quantity: 1,
  rate: 0,
});

const initialQuotations: Quotation[] = [
  {
    id: 1,
    quotationNo: "QT-2026-001",
    version: 2,
    leadId: 101,
    customerName: "Rajesh Joshi",
    company: "Joshi Enterprises",
    email: "rajesh@joshi.com",
    phone: "+91 98765 43210",
    product: "Business CRM Website",
    assignedEmployeeId: 1,
    status: "SENT",
    validUntil: "2026-10-05",
    paymentTerms: "50% advance, 50% after completion",
    discount: 5000,
    tax: 18,
    notes: "Includes responsive website and admin panel.",
    items: [
      {
        id: 1,
        name: "CRM Website",
        description: "Responsive CRM web application",
        quantity: 1,
        rate: 85000,
      },
      {
        id: 2,
        name: "Admin Panel",
        description: "Admin dashboard and management",
        quantity: 1,
        rate: 25000,
      },
    ],
    createdAt: "2026-09-10",
    versions: [
      {
        version: 1,
        date: "2026-09-08",
        createdBy: "Riya Shah",
        amount: 118000,
        status: "DRAFT",
        note: "Initial quotation",
      },
      {
        version: 2,
        date: "2026-09-10",
        createdBy: "Riya Shah",
        amount: 123900,
        status: "SENT",
        note: "Updated pricing",
      },
    ],
  },
  {
    id: 2,
    quotationNo: "QT-2026-002",
    version: 1,
    leadId: 102,
    customerName: "Vishal Shah",
    company: "VS Enterprises",
    email: "vishal@vsenterprises.com",
    phone: "+91 98250 12345",
    product: "Inventory Management Software",
    assignedEmployeeId: 2,
    status: "UNDER_REVIEW",
    validUntil: "2026-09-30",
    paymentTerms: "40% advance, 60% after delivery",
    discount: 3000,
    tax: 18,
    notes: "Barcode and inventory modules included.",
    items: [
      {
        id: 1,
        name: "Inventory Module",
        description: "Inventory management system",
        quantity: 1,
        rate: 70000,
      },
      {
        id: 2,
        name: "Barcode Module",
        description: "Barcode generation and scanning",
        quantity: 1,
        rate: 30000,
      },
    ],
    createdAt: "2026-09-12",
    versions: [
      {
        version: 1,
        date: "2026-09-12",
        createdBy: "Saloni Mehta",
        amount: 114460,
        status: "UNDER_REVIEW",
        note: "Submitted for review",
      },
    ],
  },
  {
    id: 3,
    quotationNo: "QT-2026-003",
    version: 1,
    leadId: 103,
    customerName: "Pooja Patel",
    company: "Pooja Healthcare",
    email: "pooja@healthcare.com",
    phone: "+91 98980 45678",
    product: "Healthcare Website",
    assignedEmployeeId: 3,
    status: "ACCEPTED",
    validUntil: "2026-10-15",
    paymentTerms: "50% advance, 50% after completion",
    discount: 0,
    tax: 18,
    notes: "Healthcare website with appointment module.",
    items: [
      {
        id: 1,
        name: "Healthcare Website",
        description: "Professional healthcare website",
        quantity: 1,
        rate: 95000,
      },
    ],
    createdAt: "2026-09-05",
    versions: [
      {
        version: 1,
        date: "2026-09-05",
        createdBy: "Hetvi Shah",
        amount: 112100,
        status: "ACCEPTED",
        note: "Customer accepted quotation",
      },
    ],
  },
  {
    id: 4,
    quotationNo: "QT-2026-004",
    version: 1,
    leadId: 104,
    customerName: "Amit Patel",
    company: "Shree Manufacturing",
    email: "amit@shreemanufacturing.com",
    phone: "+91 99090 22222",
    product: "ERP Software",
    assignedEmployeeId: null,
    status: "DRAFT",
    validUntil: "2026-10-20",
    paymentTerms: "30% advance, 40% development, 30% completion",
    discount: 10000,
    tax: 18,
    notes:
      "ERP modules will be finalized during requirement discussion.",
    items: [
      {
        id: 1,
        name: "ERP Development",
        description: "Business ERP application",
        quantity: 1,
        rate: 150000,
      },
    ],
    createdAt: "2026-09-15",
    versions: [
      {
        version: 1,
        date: "2026-09-15",
        createdBy: "Admin",
        amount: 165200,
        status: "DRAFT",
        note: "Initial draft",
      },
    ],
  },
];

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function calculateSubtotal(items: QuotationItem[]) {
  return items.reduce(
    (total, item) =>
      total + item.quantity * item.rate,
    0
  );
}

function calculateTotal(quotation: Quotation) {
  const subtotal = calculateSubtotal(quotation.items);
  const taxable = Math.max(
    subtotal - quotation.discount,
    0
  );
  const taxAmount =
    (taxable * quotation.tax) / 100;

  return taxable + taxAmount;
}

function employeeName(id: number | null) {
  if (!id) return "Unassigned";

  return (
    employees.find(
      (employee) => employee.id === id
    )?.name || "Unknown"
  );
}

function nextStatus(
  status: QuotationStatus
): QuotationStatus | null {
  const flow: Record<
    QuotationStatus,
    QuotationStatus | null
  > = {
    DRAFT: "SENT",
    SENT: "UNDER_REVIEW",
    UNDER_REVIEW: "APPROVED",
    APPROVED: "ACCEPTED",
    REJECTED: null,
    ACCEPTED: null,
    EXPIRED: null,
    CANCELLED: null,
  };

  return flow[status];
}

function getNextQuotationNumber(
  quotations: Quotation[]
) {
  let maxNumber = 0;

  quotations.forEach((quotation) => {
    const match =
      quotation.quotationNo.match(
        /QT-\d{4}-(\d+)/
      );

    if (match) {
      const number = Number(match[1]);

      if (number > maxNumber) {
        maxNumber = number;
      }
    }
  });

  return `QT-2026-${String(
    maxNumber + 1
  ).padStart(3, "0")}`;
}

export default function QuotationsPage() {
  const [quotations, setQuotations] =
    usePersistentState<Quotation[]>(
      "tivra_quotations",
      initialQuotations
    );

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<"ALL" | QuotationStatus>("ALL");

  const [selectedQuotation, setSelectedQuotation] =
    useState<Quotation | null>(null);

  const [editingQuotation, setEditingQuotation] =
    useState<Quotation | null>(null);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [showAssignModal, setShowAssignModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [showHistoryModal, setShowHistoryModal] =
    useState(false);

  const [showPaymentModal, setShowPaymentModal] =
    useState(false);

  const [assigningQuotation, setAssigningQuotation] =
    useState<Quotation | null>(null);

  const [deletingQuotation, setDeletingQuotation] =
    useState<Quotation | null>(null);

  const [employeeSearch, setEmployeeSearch] =
    useState("");

  const [form, setForm] = useState<Quotation>({
    id: 0,
    quotationNo: "",
    version: 1,
    leadId: 0,
    customerName: "",
    company: "",
    email: "",
    phone: "",
    product: "",
    assignedEmployeeId: null,
    status: "DRAFT",
    validUntil: "",
    paymentTerms:
      "50% advance, 50% after completion",
    discount: 0,
    tax: 18,
    notes: "",
    items: [emptyItem()],
    createdAt: new Date()
      .toISOString()
      .slice(0, 10),
    versions: [],
  });

  const filteredQuotations = useMemo(() => {
    return quotations.filter((quotation) => {
      const query = search.toLowerCase();

      const matchesSearch =
        quotation.quotationNo
          .toLowerCase()
          .includes(query) ||
        quotation.customerName
          .toLowerCase()
          .includes(query) ||
        quotation.company
          .toLowerCase()
          .includes(query) ||
        quotation.product
          .toLowerCase()
          .includes(query) ||
        employeeName(
          quotation.assignedEmployeeId
        )
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        quotation.status === statusFilter;

      return (
        matchesSearch && matchesStatus
      );
    });
  }, [
    quotations,
    search,
    statusFilter,
  ]);

  const stats = useMemo(() => {
    const total = quotations.length;

    const totalValue =
      quotations.reduce(
        (sum, quotation) =>
          sum + calculateTotal(quotation),
        0
      );

    const accepted =
      quotations.filter(
        (quotation) =>
          quotation.status === "ACCEPTED"
      ).length;

    const pending =
      quotations.filter((quotation) =>
        [
          "DRAFT",
          "SENT",
          "UNDER_REVIEW",
          "APPROVED",
        ].includes(quotation.status)
      ).length;

    const rejected =
      quotations.filter(
        (quotation) =>
          quotation.status === "REJECTED"
      ).length;

    return {
      total,
      totalValue,
      accepted,
      pending,
      rejected,
    };
  }, [quotations]);

  function openAddModal() {
    setForm({
      id: 0,
      quotationNo:
        getNextQuotationNumber(quotations),
      version: 1,
      leadId: 0,
      customerName: "",
      company: "",
      email: "",
      phone: "",
      product: "",
      assignedEmployeeId: null,
      status: "DRAFT",
      validUntil: "",
      paymentTerms:
        "50% advance, 50% after completion",
      discount: 0,
      tax: 18,
      notes: "",
      items: [emptyItem()],
      createdAt: new Date()
        .toISOString()
        .slice(0, 10),
      versions: [],
    });

    setEditingQuotation(null);
    setSelectedQuotation(null);
    setShowAddModal(true);
  }

  function openEditModal(
    quotation: Quotation
  ) {
    setForm({
      ...quotation,
      items: quotation.items.map(
        (item) => ({
          ...item,
        })
      ),
      versions:
        quotation.versions.map(
          (version) => ({
            ...version,
          })
        ),
    });

    setSelectedQuotation(null);
    setEditingQuotation(quotation);
    setShowAddModal(false);
  }

  function saveQuotation() {
    if (
      !form.customerName.trim() ||
      !form.company.trim()
    ) {
      alert(
        "Please enter customer name and company."
      );
      return;
    }

    if (!form.product.trim()) {
      alert(
        "Please enter product/service."
      );
      return;
    }

    if (form.items.length === 0) {
      alert(
        "Please add at least one quotation item."
      );
      return;
    }

    const cleanedItems =
      form.items.filter(
        (item) =>
          item.name.trim() !== ""
      );

    if (cleanedItems.length === 0) {
      alert(
        "Please enter at least one item name."
      );
      return;
    }

    if (editingQuotation) {
      const updatedQuotation: Quotation =
        {
          ...form,
          items: cleanedItems,
          versions: [
            ...editingQuotation.versions.filter(
              (version) =>
                version.version !==
                editingQuotation.version
            ),
            {
              version:
                editingQuotation.version,
              date: new Date()
                .toISOString()
                .slice(0, 10),
              createdBy: "Current User",
              amount: calculateTotal({
                ...form,
                items: cleanedItems,
              }),
              status: form.status,
              note: "Quotation updated",
            },
          ],
        };

      setQuotations((current) =>
        current.map((quotation) =>
          quotation.id ===
          editingQuotation.id
            ? updatedQuotation
            : quotation
        )
      );

      setSelectedQuotation(
        updatedQuotation
      );
      setEditingQuotation(null);
    } else {
      const newQuotation: Quotation = {
        ...form,
        id:
          Date.now() +
          Math.floor(
            Math.random() * 100000
          ),
        items: cleanedItems,
        versions: [
          {
            version: 1,
            date: new Date()
              .toISOString()
              .slice(0, 10),
            createdBy: "Current User",
            amount: calculateTotal({
              ...form,
              items: cleanedItems,
            }),
            status: form.status,
            note: "Quotation created",
          },
        ],
      };

      setQuotations((current) => [
        newQuotation,
        ...current,
      ]);

      setSelectedQuotation(
        newQuotation
      );
      setShowAddModal(false);
    }
  }

  function duplicateQuotation(
    quotation: Quotation
  ) {
    const today =
      new Date()
        .toISOString()
        .slice(0, 10);

    const newQuotationNo =
      getNextQuotationNumber(
        quotations
      );

    const newQuotationId =
      Date.now() +
      Math.floor(
        Math.random() * 1000000
      );

    const duplicatedItems =
      quotation.items.map(
        (item, index) => ({
          ...item,
          id:
            Date.now() +
            index +
            Math.floor(
              Math.random() * 1000000
            ),
        })
      );

    const duplicated: Quotation = {
      ...quotation,
      id: newQuotationId,
      quotationNo: newQuotationNo,
      version: 1,
      status: "DRAFT",
      createdAt: today,
      items: duplicatedItems,
      versions: [
        {
          version: 1,
          date: today,
          createdBy: "Current User",
          amount: calculateTotal({
            ...quotation,
            status: "DRAFT",
            items: duplicatedItems,
          }),
          status: "DRAFT",
          note: `Duplicated from ${quotation.quotationNo}`,
        },
      ],
    };

    setQuotations((current) => [
      duplicated,
      ...current,
    ]);

    setSelectedQuotation(null);
    setShowHistoryModal(false);
    setShowPaymentModal(false);
  }

  function deleteQuotation() {
    if (!deletingQuotation) return;

    setQuotations((current) =>
      current.filter(
        (quotation) =>
          quotation.id !==
          deletingQuotation.id
      )
    );

    if (
      selectedQuotation?.id ===
      deletingQuotation.id
    ) {
      setSelectedQuotation(null);
    }

    setDeletingQuotation(null);
    setShowDeleteModal(false);
  }

  /* =====================================================
     FIXED STATUS UPDATE
  ===================================================== */

  function updateStatus(
    quotationId: number,
    status: QuotationStatus
  ) {
    const quotation = quotations.find(
      (q) => q.id === quotationId
    );

    if (!quotation) return;

    if (quotation.status === status) {
      return;
    }

    const today = new Date()
      .toISOString()
      .slice(0, 10);

    const versionEntry: QuotationVersion = {
      version: quotation.version,
      date: today,
      createdBy: "Current User",
      amount: calculateTotal(quotation),
      status,
      note: `Status changed from ${
        statusConfig[quotation.status].label
      } to ${
        statusConfig[status].label
      }`,
    };

    const updatedQuotation: Quotation = {
      ...quotation,
      status,
      versions: [
        ...quotation.versions.filter(
          (version) =>
            !(
              version.version ===
                quotation.version &&
              version.status ===
                quotation.status
            )
        ),
        versionEntry,
      ],
    };

    setQuotations((current) =>
      current.map((item) =>
        item.id === quotationId
          ? updatedQuotation
          : item
      )
    );

    setSelectedQuotation((current) =>
      current &&
      current.id === quotationId
        ? updatedQuotation
        : current
    );
  }

  /* =====================================================
     FIXED MOVE BUTTON
  ===================================================== */

  function moveToNextStatus(
    quotation: Quotation
  ) {
    const next =
      nextStatus(
        quotation.status
      );

    if (!next) {
      return;
    }

    updateStatus(
      quotation.id,
      next
    );
  }

  function openAssignModal(
    quotation: Quotation
  ) {
    setAssigningQuotation(
      quotation
    );
    setEmployeeSearch("");
    setShowAssignModal(true);
  }

  function assignEmployee(
    employeeId: number | null
  ) {
    if (!assigningQuotation) return;

    const updatedQuotation = {
      ...assigningQuotation,
      assignedEmployeeId:
        employeeId,
    };

    setQuotations((current) =>
      current.map((quotation) =>
        quotation.id ===
        assigningQuotation.id
          ? updatedQuotation
          : quotation
      )
    );

    setSelectedQuotation(
      (current) =>
        current &&
        current.id ===
          assigningQuotation.id
          ? updatedQuotation
          : current
    );

    setShowAssignModal(false);
    setAssigningQuotation(null);
  }

  function addItem() {
    setForm((current) => ({
      ...current,
      items: [
        ...current.items,
        emptyItem(),
      ],
    }));
  }

  function updateItem(
    itemId: number,
    field: keyof QuotationItem,
    value: string | number
  ) {
    setForm((current) => ({
      ...current,
      items: current.items.map(
        (item) =>
          item.id === itemId
            ? {
                ...item,
                [field]:
                  field ===
                    "quantity" ||
                  field === "rate"
                    ? Number(value)
                    : value,
              }
            : item
      ),
    }));
  }

  function removeItem(
    itemId: number
  ) {
    setForm((current) => ({
      ...current,
      items: current.items.filter(
        (item) =>
          item.id !== itemId
      ),
    }));
  }

  const filteredEmployees =
    employees.filter(
      (employee) => {
        const query =
          employeeSearch.toLowerCase();

        return (
          employee.name
            .toLowerCase()
            .includes(query) ||
          employee.department
            .toLowerCase()
            .includes(query) ||
          employee.role
            .toLowerCase()
            .includes(query)
        );
      }
    );

  return (
    <div className="min-h-screen bg-[#080b12] text-white p-4 md:p-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-sm mb-1">
            <FileText size={16} />
            Sales / Quotations
          </div>

          <h1 className="text-2xl md:text-3xl font-bold">
            Quotations
          </h1>

          <p className="text-gray-400 text-sm mt-1">
            Create, manage, assign and track customer quotations.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-xl font-medium transition"
        >
          <Plus size={18} />
          New Quotation
        </button>
      </div>

      {/* WORKFLOW */}

      <div className="bg-[#0d111a] border border-white/10 rounded-2xl p-4 mb-6 overflow-x-auto">
        <div className="flex items-center min-w-[850px]">
          {[
            "DRAFT",
            "SENT",
            "UNDER_REVIEW",
            "APPROVED",
            "ACCEPTED",
          ].map(
            (status, index, array) => (
              <div
                key={status}
                className="flex items-center flex-1"
              >
                <div className="flex flex-col items-center min-w-[120px]">
                  <div className="w-9 h-9 rounded-full bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    {index + 1}
                  </div>

                  <span className="text-xs text-gray-300 mt-2 text-center">
                    {
                      statusConfig[
                        status as QuotationStatus
                      ].label
                    }
                  </span>
                </div>

                {index <
                  array.length -
                    1 && (
                  <div className="h-px bg-white/10 flex-1 mx-2" />
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        {[
          {
            label: "Total Quotations",
            value: stats.total,
            icon: FileText,
          },
          {
            label: "Quotation Value",
            value:
              formatCurrency(
                stats.totalValue
              ),
            icon: CreditCard,
          },
          {
            label: "Accepted",
            value: stats.accepted,
            icon: CheckCircle2,
          },
          {
            label: "Pending",
            value: stats.pending,
            icon: Clock3,
          },
          {
            label: "Rejected",
            value: stats.rejected,
            icon: XCircle,
          },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-[#0d111a] border border-white/10 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">
                    {stat.label}
                  </p>

                  <p className="text-xl font-bold mt-1">
                    {stat.value}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FILTERS */}

      <div className="bg-[#0d111a] border border-white/10 rounded-2xl p-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search quotation, customer, company, product..."
              className="w-full bg-[#080b12] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500/50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as
                  | "ALL"
                  | QuotationStatus
              )
            }
            className="bg-[#080b12] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none"
          >
            <option value="ALL">
              All Status
            </option>

            {Object.entries(
              statusConfig
            ).map(
              ([
                value,
                config,
              ]) => (
                <option
                  key={value}
                  value={value}
                >
                  {config.label}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* TABLE */}

      <div className="bg-[#0d111a] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs text-gray-500">
                <th className="px-5 py-4">
                  Quotation
                </th>

                <th className="px-5 py-4">
                  Customer
                </th>

                <th className="px-5 py-4">
                  Product
                </th>

                <th className="px-5 py-4">
                  Assigned
                </th>

                <th className="px-5 py-4">
                  Amount
                </th>

                <th className="px-5 py-4">
                  Valid Until
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredQuotations.map(
                (quotation) => (
                  <tr
                    key={quotation.id}
                    className="border-b border-white/5 hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium">
                        {
                          quotation.quotationNo
                        }
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        Version{" "}
                        {
                          quotation.version
                        }
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium">
                        {
                          quotation.customerName
                        }
                      </div>

                      <div className="text-xs text-gray-500">
                        {
                          quotation.company
                        }
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-300">
                        {
                          quotation.product
                        }
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-sm">
                        {employeeName(
                          quotation.assignedEmployeeId
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 font-semibold">
                      {formatCurrency(
                        calculateTotal(
                          quotation
                        )
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-400">
                      {
                        quotation.validUntil ||
                        "-"
                      }
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-lg border text-xs ${
                          statusConfig[
                            quotation.status
                          ].className
                        }`}
                      >
                        {
                          statusConfig[
                            quotation.status
                          ].label
                        }
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">

                        <button
                          title="View Details"
                          onClick={() => {
                            setSelectedQuotation(
                              quotation
                            );

                            setShowHistoryModal(
                              false
                            );

                            setShowPaymentModal(
                              false
                            );
                          }}
                          className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-400 transition"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          title="Edit"
                          onClick={() =>
                            openEditModal(
                              quotation
                            )
                          }
                          className="p-2 rounded-lg hover:bg-white/10 text-blue-400 transition"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          title="Duplicate Quotation"
                          onClick={() =>
                            duplicateQuotation(
                              quotation
                            )
                          }
                          className="p-2 rounded-lg hover:bg-purple-500/10 text-purple-400 transition"
                        >
                          <Copy size={16} />
                        </button>

                        <button
                          title="Assign Employee"
                          onClick={() =>
                            openAssignModal(
                              quotation
                            )
                          }
                          className="p-2 rounded-lg hover:bg-green-500/10 text-green-400 transition"
                        >
                          <UserPlus
                            size={16}
                          />
                        </button>

                        <button
                          title="Delete"
                          onClick={() => {
                            setDeletingQuotation(
                              quotation
                            );
                            setShowDeleteModal(
                              true
                            );
                          }}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition"
                        >
                          <Trash2
                            size={16}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          {filteredQuotations.length ===
            0 && (
            <div className="py-16 text-center text-gray-500">
              No quotations found.
            </div>
          )}
        </div>
      </div>

      {/* VIEW DETAILS MODAL */}

      {selectedQuotation && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0d111a] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">

            <div className="sticky top-0 z-10 bg-[#0d111a] p-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">
                    {
                      selectedQuotation.quotationNo
                    }
                  </h2>

                  <span
                    className={`px-2.5 py-1 rounded-lg border text-xs ${
                      statusConfig[
                        selectedQuotation.status
                      ].className
                    }`}
                  >
                    {
                      statusConfig[
                        selectedQuotation.status
                      ].label
                    }
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  Version{" "}
                  {
                    selectedQuotation.version
                  }{" "}
                  · Created{" "}
                  {
                    selectedQuotation.createdAt
                  }
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedQuotation(
                    null
                  )
                }
                className="p-2 rounded-lg hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-5">

              {/* CUSTOMER DETAILS */}

              <div>
                <h3 className="font-semibold mb-3">
                  Customer Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InfoBox
                    label="Customer"
                    value={
                      selectedQuotation.customerName
                    }
                  />

                  <InfoBox
                    label="Company"
                    value={
                      selectedQuotation.company
                    }
                  />

                  <InfoBox
                    label="Assigned Employee"
                    value={employeeName(
                      selectedQuotation.assignedEmployeeId
                    )}
                  />

                  <InfoBox
                    label="Email"
                    value={
                      selectedQuotation.email
                    }
                  />

                  <InfoBox
                    label="Phone"
                    value={
                      selectedQuotation.phone
                    }
                  />

                  <InfoBox
                    label="Product / Service"
                    value={
                      selectedQuotation.product
                    }
                  />

                  <InfoBox
                    label="Lead ID"
                    value={String(
                      selectedQuotation.leadId ||
                        "-"
                    )}
                  />

                  <InfoBox
                    label="Valid Until"
                    value={
                      selectedQuotation.validUntil ||
                      "-"
                    }
                  />

                  <InfoBox
                    label="Payment Terms"
                    value={
                      selectedQuotation.paymentTerms
                    }
                  />
                </div>
              </div>

              {/* STATUS */}

              <div className="bg-[#080b12] border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">
                    Quotation Status
                  </h3>

                  <span
                    className={`px-2.5 py-1 rounded-lg border text-xs ${
                      statusConfig[
                        selectedQuotation.status
                      ].className
                    }`}
                  >
                    {
                      statusConfig[
                        selectedQuotation.status
                      ].label
                    }
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(
                    Object.keys(
                      statusConfig
                    ) as QuotationStatus[]
                  ).map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() =>
                          updateStatus(
                            selectedQuotation.id,
                            status
                          )
                        }
                        className={`px-3 py-2 rounded-lg text-xs border transition ${
                          selectedQuotation.status ===
                          status
                            ? "border-blue-500 bg-blue-500/10 text-blue-300"
                            : "border-white/10 text-gray-400 hover:bg-white/5"
                        }`}
                      >
                        {
                          statusConfig[
                            status
                          ].label
                        }
                      </button>
                    )
                  )}
                </div>

                {nextStatus(
                  selectedQuotation.status
                ) && (
                  <button
                    type="button"
                    onClick={() =>
                      moveToNextStatus(
                        selectedQuotation
                      )
                    }
                    className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm transition cursor-pointer"
                  >
                    Move to{" "}
                    {
                      statusConfig[
                        nextStatus(
                          selectedQuotation.status
                        )!
                      ].label
                    }

                    <ChevronRight
                      size={16}
                    />
                  </button>
                )}
              </div>

              {/* ITEMS */}

              <div>
                <h3 className="font-semibold mb-3">
                  Quotation Items
                </h3>

                <div className="border border-white/10 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-white/[0.02] border-b border-white/10 text-xs text-gray-500">
                        <th className="px-4 py-3 text-left">
                          Item
                        </th>

                        <th className="px-4 py-3 text-left">
                          Qty
                        </th>

                        <th className="px-4 py-3 text-left">
                          Rate
                        </th>

                        <th className="px-4 py-3 text-right">
                          Total
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedQuotation.items.map(
                        (item) => (
                          <tr
                            key={item.id}
                            className="border-b border-white/5"
                          >
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium">
                                {
                                  item.name ||
                                  "-"
                                }
                              </div>

                              <div className="text-xs text-gray-500">
                                {
                                  item.description
                                }
                              </div>
                            </td>

                            <td className="px-4 py-3 text-sm">
                              {
                                item.quantity
                              }
                            </td>

                            <td className="px-4 py-3 text-sm">
                              {formatCurrency(
                                item.rate
                              )}
                            </td>

                            <td className="px-4 py-3 text-right font-medium">
                              {formatCurrency(
                                item.quantity *
                                  item.rate
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* TOTALS */}

              <div className="flex justify-end">
                <div className="w-full md:w-80 bg-[#080b12] border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Subtotal
                    </span>

                    <span>
                      {formatCurrency(
                        calculateSubtotal(
                          selectedQuotation.items
                        )
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Discount
                    </span>

                    <span>
                      -{" "}
                      {formatCurrency(
                        selectedQuotation.discount
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      GST (
                      {
                        selectedQuotation.tax
                      }
                      %)
                    </span>

                    <span>
                      {formatCurrency(
                        Math.max(
                          calculateSubtotal(
                            selectedQuotation.items
                          ) -
                            selectedQuotation.discount,
                          0
                        ) *
                          (selectedQuotation.tax /
                            100)
                      )}
                    </span>
                  </div>

                  <div className="border-t border-white/10 pt-3 flex justify-between font-bold">
                    <span>
                      Total
                    </span>

                    <span className="text-blue-400">
                      {formatCurrency(
                        calculateTotal(
                          selectedQuotation
                        )
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* NOTES */}

              {selectedQuotation.notes && (
                <div>
                  <h3 className="font-semibold mb-3">
                    Notes
                  </h3>

                  <div className="bg-[#080b12] border border-white/10 rounded-xl p-4 text-sm text-gray-400">
                    {
                      selectedQuotation.notes
                    }
                  </div>
                </div>
              )}

              {/* ACTIONS */}

              <div className="flex flex-wrap gap-2 border-t border-white/10 pt-5">

                <button
                  onClick={() =>
                    openEditModal(
                      selectedQuotation
                    )
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm"
                >
                  <Pencil size={16} />
                  Edit
                </button>

                <button
                  onClick={() =>
                    duplicateQuotation(
                      selectedQuotation
                    )
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 text-sm"
                >
                  <Copy size={16} />
                  Duplicate
                </button>

                <button
                  onClick={() =>
                    openAssignModal(
                      selectedQuotation
                    )
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600/20 text-green-300 hover:bg-green-600/30 text-sm"
                >
                  <UserPlus size={16} />
                  Assign Employee
                </button>

                <button
                  onClick={() =>
                    setShowHistoryModal(
                      true
                    )
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm"
                >
                  <History size={16} />
                  Version History
                </button>

                {selectedQuotation.status ===
                  "ACCEPTED" && (
                  <button
                    onClick={() =>
                      setShowPaymentModal(
                        true
                      )
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm"
                  >
                    <CreditCard
                      size={16}
                    />
                    Create Payment
                  </button>
                )}

                <button
                  onClick={() => {
                    setDeletingQuotation(
                      selectedQuotation
                    );
                    setShowDeleteModal(
                      true
                    );
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20 text-sm"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>

              <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 text-sm text-gray-400">
                <strong className="text-blue-300">
                  Workflow:
                </strong>{" "}
                Accepted quotation → Payment
                verification → Billing / Invoice →
                Project Handover.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}

      {(showAddModal ||
        editingQuotation) && (
        <QuotationFormModal
          title={
            editingQuotation
              ? "Edit Quotation"
              : "Create New Quotation"
          }
          form={form}
          setForm={setForm}
          onClose={() => {
            setShowAddModal(false);
            setEditingQuotation(null);
          }}
          onSave={saveQuotation}
          onAddItem={addItem}
          onUpdateItem={updateItem}
          onRemoveItem={removeItem}
        />
      )}

      {/* ASSIGN EMPLOYEE MODAL */}

      {showAssignModal &&
        assigningQuotation && (
          <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
            <div className="bg-[#0d111a] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">

              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">
                    Assign Employee
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    {
                      assigningQuotation.quotationNo
                    }
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowAssignModal(
                      false
                    );
                    setAssigningQuotation(
                      null
                    );
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5">

                <div className="relative mb-4">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <input
                    value={
                      employeeSearch
                    }
                    onChange={(e) =>
                      setEmployeeSearch(
                        e.target.value
                      )
                    }
                    placeholder="Search employee..."
                    className="w-full bg-[#080b12] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none"
                  />
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {filteredEmployees.map(
                    (employee) => {
                      const selected =
                        assigningQuotation.assignedEmployeeId ===
                        employee.id;

                      return (
                        <button
                          key={
                            employee.id
                          }
                          onClick={() =>
                            assignEmployee(
                              employee.id
                            )
                          }
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left ${
                            selected
                              ? "border-blue-500 bg-blue-500/10"
                              : "border-white/10 hover:bg-white/5"
                          }`}
                        >
                          <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-300 flex items-center justify-center text-sm font-semibold">
                            {employee.name
                              .split(" ")
                              .map(
                                (
                                  part
                                ) =>
                                  part[0]
                              )
                              .join("")
                              .slice(
                                0,
                                2
                              )}
                          </div>

                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {
                                employee.name
                              }
                            </div>

                            <div className="text-xs text-gray-500">
                              {
                                employee.department
                              }{" "}
                              ·{" "}
                              {
                                employee.role
                              }
                            </div>
                          </div>

                          {selected && (
                            <Check
                              size={
                                18
                              }
                              className="text-blue-400"
                            />
                          )}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={() =>
                    assignEmployee(null)
                  }
                  className="w-full mt-3 border border-white/10 hover:bg-white/5 rounded-xl py-2.5 text-sm text-gray-400"
                >
                  Remove Assignment
                </button>
              </div>
            </div>
          </div>
        )}

      {/* DELETE MODAL */}

      {showDeleteModal &&
        deletingQuotation && (
          <div className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center p-4">
            <div className="bg-[#0d111a] border border-white/10 rounded-2xl w-full max-w-md p-5 shadow-2xl">

              <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-4">
                <Trash2 size={22} />
              </div>

              <h2 className="text-lg font-bold">
                Delete Quotation?
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Are you sure you want to
                delete{" "}
                <span className="text-gray-300">
                  {
                    deletingQuotation.quotationNo
                  }
                </span>
                ? This action cannot be
                undone.
              </p>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowDeleteModal(
                      false
                    );
                    setDeletingQuotation(
                      null
                    );
                  }}
                  className="px-4 py-2 rounded-lg border border-white/10 text-sm"
                >
                  Cancel
                </button>

                <button
                  onClick={deleteQuotation}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      {/* HISTORY MODAL */}

      {showHistoryModal &&
        selectedQuotation && (
          <div className="fixed inset-0 z-[80] bg-black/70 flex items-center justify-center p-4">
            <div className="bg-[#0d111a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">

              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">
                    Version History
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    {
                      selectedQuotation.quotationNo
                    }
                  </p>
                </div>

                <button
                  onClick={() =>
                    setShowHistoryModal(
                      false
                    )
                  }
                  className="p-2 rounded-lg hover:bg-white/10"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-3">
                {selectedQuotation.versions
                  .slice()
                  .reverse()
                  .map((version) => (
                    <div
                      key={`${version.version}-${version.date}-${version.note}`}
                      className="bg-[#080b12] border border-white/10 rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold">
                              Version{" "}
                              {
                                version.version
                              }
                            </span>

                            <span
                              className={`px-2 py-1 rounded-md border text-[11px] ${
                                statusConfig[
                                  version.status
                                ].className
                              }`}
                            >
                              {
                                statusConfig[
                                  version.status
                                ].label
                              }
                            </span>
                          </div>

                          <p className="text-sm text-gray-400 mt-2">
                            {
                              version.note
                            }
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold">
                            {formatCurrency(
                              version.amount
                            )}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {
                              version.date
                            }
                          </p>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mt-3">
                        Created by{" "}
                        {
                          version.createdBy
                        }
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

      {/* PAYMENT MODAL */}

      {showPaymentModal &&
        selectedQuotation && (
          <div className="fixed inset-0 z-[80] bg-black/70 flex items-center justify-center p-4">
            <div className="bg-[#0d111a] border border-white/10 rounded-2xl w-full max-w-md p-5 shadow-2xl">

              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <CreditCard size={22} />
              </div>

              <h2 className="text-lg font-bold">
                Create Payment
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                This quotation is accepted
                and can move to the Payment
                module.
              </p>

              <div className="bg-[#080b12] border border-white/10 rounded-xl p-4 mt-4 space-y-2">

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Quotation
                  </span>

                  <span>
                    {
                      selectedQuotation.quotationNo
                    }
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Customer
                  </span>

                  <span>
                    {
                      selectedQuotation.company
                    }
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Amount
                  </span>

                  <span className="font-semibold text-emerald-400">
                    {formatCurrency(
                      calculateTotal(
                        selectedQuotation
                      )
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-5">

                <button
                  onClick={() =>
                    setShowPaymentModal(
                      false
                    )
                  }
                  className="px-4 py-2 rounded-lg border border-white/10 text-sm"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    setShowPaymentModal(
                      false
                    );

                    alert(
                      "Payment module connection is ready. Backend integration will create the actual payment record."
                    );
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

/* =======================================================
   INFO BOX
======================================================= */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#080b12] border border-white/10 rounded-xl p-3">
      <p className="text-xs text-gray-500 mb-1">
        {label}
      </p>

      <p className="text-sm text-gray-200 break-words">
        {value || "-"}
      </p>
    </div>
  );
}

/* =======================================================
   QUOTATION FORM MODAL
======================================================= */

function QuotationFormModal({
  title,
  form,
  setForm,
  onClose,
  onSave,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}: {
  title: string;
  form: Quotation;
  setForm: React.Dispatch<
    React.SetStateAction<Quotation>
  >;
  onClose: () => void;
  onSave: () => void;
  onAddItem: () => void;
  onUpdateItem: (
    itemId: number,
    field: keyof QuotationItem,
    value: string | number
  ) => void;
  onRemoveItem: (
    itemId: number
  ) => void;
}) {
  const subtotal =
    calculateSubtotal(
      form.items
    );

  const taxable = Math.max(
    subtotal - form.discount,
    0
  );

  const taxAmount =
    (taxable * form.tax) /
    100;

  const total =
    taxable + taxAmount;

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-[#0d111a] border border-white/10 rounded-2xl w-full max-w-6xl max-h-[92vh] overflow-y-auto shadow-2xl">

        <div className="sticky top-0 z-10 bg-[#0d111a] p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {title}
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Quotation details and pricing
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-6">

          {/* CUSTOMER */}

          <div>
            <h3 className="font-semibold mb-3">
              Customer Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

              <Input
                label="Quotation Number"
                value={
                  form.quotationNo
                }
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      quotationNo:
                        value,
                    })
                  )
                }
              />

              <Input
                label="Customer Name"
                value={
                  form.customerName
                }
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      customerName:
                        value,
                    })
                  )
                }
              />

              <Input
                label="Company"
                value={
                  form.company
                }
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      company:
                        value,
                    })
                  )
                }
              />

              <Input
                label="Email"
                value={
                  form.email
                }
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      email: value,
                    })
                  )
                }
              />

              <Input
                label="Phone"
                value={
                  form.phone
                }
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      phone: value,
                    })
                  )
                }
              />

              <Input
                label="Product / Service"
                value={
                  form.product
                }
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      product:
                        value,
                    })
                  )
                }
              />

              <Input
                label="Lead ID"
                value={String(
                  form.leadId || ""
                )}
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      leadId:
                        Number(
                          value
                        ) || 0,
                    })
                  )
                }
                type="number"
              />

              <Input
                label="Valid Until"
                value={
                  form.validUntil
                }
                onChange={(value) =>
                  setForm(
                    (current) => ({
                      ...current,
                      validUntil:
                        value,
                    })
                  )
                }
                type="date"
              />

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Status
                </label>

                <select
                  value={
                    form.status
                  }
                  onChange={(e) =>
                    setForm(
                      (current) => ({
                        ...current,
                        status:
                          e.target
                            .value as QuotationStatus,
                      })
                    )
                  }
                  className="w-full bg-[#080b12] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none"
                >
                  {Object.entries(
                    statusConfig
                  ).map(
                    ([
                      value,
                      config,
                    ]) => (
                      <option
                        key={value}
                        value={value}
                      >
                        {
                          config.label
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Payment Terms
                </label>

                <select
                  value={
                    form.paymentTerms
                  }
                  onChange={(e) =>
                    setForm(
                      (current) => ({
                        ...current,
                        paymentTerms:
                          e.target
                            .value,
                      })
                    )
                  }
                  className="w-full bg-[#080b12] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none"
                >
                  <option>
                    50% advance, 50% after completion
                  </option>

                  <option>
                    40% advance, 60% after delivery
                  </option>

                  <option>
                    30% advance, 40% development, 30% completion
                  </option>

                  <option>
                    100% after completion
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* ITEMS */}

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">
                Quotation Items
              </h3>

              <button
                onClick={onAddItem}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm"
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {form.items.map(
                (item, index) => (
                  <div
                    key={item.id}
                    className="bg-[#080b12] border border-white/10 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-500">
                        Item{" "}
                        {index + 1}
                      </span>

                      {form.items
                        .length >
                        1 && (
                        <button
                          onClick={() =>
                            onRemoveItem(
                              item.id
                            )
                          }
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2
                            size={
                              16
                            }
                          />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">

                      <Input
                        label="Item Name"
                        value={
                          item.name
                        }
                        onChange={(
                          value
                        ) =>
                          onUpdateItem(
                            item.id,
                            "name",
                            value
                          )
                        }
                      />

                      <Input
                        label="Description"
                        value={
                          item.description
                        }
                        onChange={(
                          value
                        ) =>
                          onUpdateItem(
                            item.id,
                            "description",
                            value
                          )
                        }
                      />

                      <Input
                        label="Quantity"
                        type="number"
                        value={String(
                          item.quantity
                        )}
                        onChange={(
                          value
                        ) =>
                          onUpdateItem(
                            item.id,
                            "quantity",
                            Number(
                              value
                            )
                          )
                        }
                      />

                      <Input
                        label="Rate"
                        type="number"
                        value={String(
                          item.rate
                        )}
                        onChange={(
                          value
                        ) =>
                          onUpdateItem(
                            item.id,
                            "rate",
                            Number(
                              value
                            )
                          )
                        }
                      />
                    </div>

                    <div className="mt-3 text-right text-sm">
                      Item Total:{" "}
                      <span className="font-semibold text-blue-400">
                        {formatCurrency(
                          item.quantity *
                            item.rate
                        )}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* PRICING */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            <div>
              <label className="block text-xs text-gray-500 mb-1.5">
                Notes
              </label>

              <textarea
                value={
                  form.notes
                }
                onChange={(e) =>
                  setForm(
                    (current) => ({
                      ...current,
                      notes:
                        e.target
                          .value,
                    })
                  )
                }
                rows={7}
                placeholder="Quotation notes..."
                className="w-full bg-[#080b12] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
              />
            </div>

            <div className="bg-[#080b12] border border-white/10 rounded-xl p-4">

              <h3 className="font-semibold mb-4">
                Pricing Summary
              </h3>

              <div className="space-y-4">

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span>
                    {formatCurrency(
                      subtotal
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500">
                    Discount
                  </span>

                  <input
                    type="number"
                    value={
                      form.discount
                    }
                    onChange={(e) =>
                      setForm(
                        (current) => ({
                          ...current,
                          discount:
                            Number(
                              e.target
                                .value
                            ) || 0,
                        })
                      )
                    }
                    className="w-32 bg-[#0d111a] border border-white/10 rounded-lg px-3 py-2 text-sm text-right outline-none"
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500">
                    GST %
                  </span>

                  <input
                    type="number"
                    value={
                      form.tax
                    }
                    onChange={(e) =>
                      setForm(
                        (current) => ({
                          ...current,
                          tax:
                            Number(
                              e.target
                                .value
                            ) || 0,
                        })
                      )
                    }
                    className="w-32 bg-[#0d111a] border border-white/10 rounded-lg px-3 py-2 text-sm text-right outline-none"
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    GST Amount
                  </span>

                  <span>
                    {formatCurrency(
                      taxAmount
                    )}
                  </span>
                </div>

                <div className="border-t border-white/10 pt-4 flex justify-between">
                  <span className="font-semibold">
                    Grand Total
                  </span>

                  <span className="text-xl font-bold text-blue-400">
                    {formatCurrency(
                      total
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SAVE */}

          <div className="flex justify-end gap-3 border-t border-white/10 pt-5">

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm"
            >
              Cancel
            </button>

            <button
              onClick={onSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-medium"
            >
              <Check size={17} />
              Save Quotation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =======================================================
   INPUT COMPONENT
======================================================= */

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
    <div>
      <label className="block text-xs text-gray-500 mb-1.5">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="w-full bg-[#080b12] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500/50"
      />
    </div>
  );
}