"use client";

import { useMemo, useState } from "react";
import { usePersistentState } from "@/lib/persistence";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  UserPlus,
  X,
  Check,
  FileText,
  Send,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Wallet,
} from "lucide-react";

type InvoiceStatus =
  | "DRAFT"
  | "SENT"
  | "PARTIAL"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";

type Employee = {
  id: number;
  name: string;
  department: string;
  role: string;
};

type InvoiceItem = {
  id: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
};

type Invoice = {
  id: number;
  invoiceNo: string;
  quotationNo: string;
  paymentNo: string;

  customerName: string;
  company: string;
  email: string;
  phone: string;
  address: string;

  items: InvoiceItem[];

  subtotal: number;
  discount: number;
  gstRate: number;
  gstAmount: number;
  grandTotal: number;

  paidAmount: number;
  dueAmount: number;

  invoiceDate: string;
  dueDate: string;

  status: InvoiceStatus;
  assignedEmployeeId: number | null;

  paymentVerified: boolean;
  notes: string;
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
  InvoiceStatus,
  { label: string; className: string }
> = {
  DRAFT: {
    label: "Draft",
    className:
      "bg-gray-500/10 text-gray-300 border-gray-500/20",
  },
  SENT: {
    label: "Sent",
    className:
      "bg-blue-500/10 text-blue-300 border-blue-500/20",
  },
  PARTIAL: {
    label: "Partial",
    className:
      "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  },
  PAID: {
    label: "Paid",
    className:
      "bg-green-500/10 text-green-300 border-green-500/20",
  },
  OVERDUE: {
    label: "Overdue",
    className:
      "bg-red-500/10 text-red-300 border-red-500/20",
  },
  CANCELLED: {
    label: "Cancelled",
    className:
      "bg-red-500/10 text-red-300 border-red-500/20",
  },
};

const initialInvoices: Invoice[] = [
  {
    id: 1,
    invoiceNo: "INV-2026-001",
    quotationNo: "QT-2026-003",
    paymentNo: "PAY-2026-001",

    customerName: "Pooja Patel",
    company: "Pooja Healthcare",
    email: "pooja@healthcare.com",
    phone: "+91 98980 45678",
    address: "Surat, Gujarat",

    items: [
      {
        id: 1,
        description: "Healthcare Website Development",
        quantity: 1,
        rate: 95000,
        amount: 95000,
      },
      {
        id: 2,
        description: "Hosting & Deployment",
        quantity: 1,
        rate: 10000,
        amount: 10000,
      },
    ],

    subtotal: 105000,
    discount: 5000,
    gstRate: 18,
    gstAmount: 18000,
    grandTotal: 118000,

    paidAmount: 56050,
    dueAmount: 61950,

    invoiceDate: "2026-09-16",
    dueDate: "2026-09-30",

    status: "PARTIAL",
    assignedEmployeeId: 3,

    paymentVerified: true,
    notes: "Advance payment verified.",
  },

  {
    id: 2,
    invoiceNo: "INV-2026-002",
    quotationNo: "QT-2026-002",
    paymentNo: "PAY-2026-003",

    customerName: "Vishal Shah",
    company: "VS Enterprises",
    email: "vishal@vsenterprises.com",
    phone: "+91 98250 12345",
    address: "Ahmedabad, Gujarat",

    items: [
      {
        id: 1,
        description: "Inventory Management Software",
        quantity: 1,
        rate: 97000,
        amount: 97000,
      },
    ],

    subtotal: 97000,
    discount: 0,
    gstRate: 18,
    gstAmount: 17460,
    grandTotal: 114460,

    paidAmount: 114460,
    dueAmount: 0,

    invoiceDate: "2026-09-14",
    dueDate: "2026-09-20",

    status: "PAID",
    assignedEmployeeId: 2,

    paymentVerified: true,
    notes: "Full payment received and verified.",
  },

  {
    id: 3,
    invoiceNo: "INV-2026-003",
    quotationNo: "QT-2026-001",
    paymentNo: "PAY-2026-002",

    customerName: "Rajesh Joshi",
    company: "Joshi Enterprises",
    email: "rajesh@joshi.com",
    phone: "+91 98765 43210",
    address: "Surat, Gujarat",

    items: [
      {
        id: 1,
        description: "Business CRM Website",
        quantity: 1,
        rate: 105000,
        amount: 105000,
      },
    ],

    subtotal: 105000,
    discount: 0,
    gstRate: 18,
    gstAmount: 18900,
    grandTotal: 123900,

    paidAmount: 0,
    dueAmount: 123900,

    invoiceDate: "2026-09-18",
    dueDate: "2026-09-25",

    status: "SENT",
    assignedEmployeeId: 1,

    paymentVerified: false,
    notes: "Waiting for payment.",
  },
];

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function employeeName(id: number | null) {
  if (!id) return "Unassigned";

  return (
    employees.find((employee) => employee.id === id)?.name ||
    "Unknown"
  );
}

export default function BillingPage() {
  const [invoices, setInvoices] =
    usePersistentState<Invoice[]>("tivra_invoices", initialInvoices);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | InvoiceStatus
  >("ALL");

  const [selectedInvoice, setSelectedInvoice] =
    useState<Invoice | null>(null);

  const [editingInvoice, setEditingInvoice] =
    useState<Invoice | null>(null);

  const [assigningInvoice, setAssigningInvoice] =
    useState<Invoice | null>(null);

  const [deletingInvoice, setDeletingInvoice] =
    useState<Invoice | null>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [employeeSearch, setEmployeeSearch] =
    useState("");

  const [form, setForm] = useState<Invoice>(
    createEmptyInvoice(invoices.length + 1)
  );

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const q = search.toLowerCase();

      const matchesSearch =
        invoice.invoiceNo.toLowerCase().includes(q) ||
        invoice.quotationNo.toLowerCase().includes(q) ||
        invoice.paymentNo.toLowerCase().includes(q) ||
        invoice.customerName.toLowerCase().includes(q) ||
        invoice.company.toLowerCase().includes(q) ||
        employeeName(invoice.assignedEmployeeId)
          .toLowerCase()
          .includes(q);

      const matchesStatus =
        statusFilter === "ALL" ||
        invoice.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, search, statusFilter]);

  const stats = useMemo(() => {
    const total = invoices.reduce(
      (sum, invoice) => sum + invoice.grandTotal,
      0
    );

    const paid = invoices.reduce(
      (sum, invoice) => sum + invoice.paidAmount,
      0
    );

    const due = invoices.reduce(
      (sum, invoice) => sum + invoice.dueAmount,
      0
    );

    const overdue = invoices
      .filter((invoice) => invoice.status === "OVERDUE")
      .reduce(
        (sum, invoice) => sum + invoice.dueAmount,
        0
      );

    return {
      total,
      paid,
      due,
      overdue,
    };
  }, [invoices]);

  const filteredEmployees = employees.filter(
    (employee) => {
      const q = employeeSearch.toLowerCase();

      return (
        employee.name.toLowerCase().includes(q) ||
        employee.department.toLowerCase().includes(q) ||
        employee.role.toLowerCase().includes(q)
      );
    }
  );

  function updateForm(
    field: keyof Invoice,
    value: any
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function recalculateInvoice(invoice: Invoice) {
    const subtotal = invoice.items.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );

    const afterDiscount = Math.max(
      subtotal - invoice.discount,
      0
    );

    const gstAmount =
      (afterDiscount * invoice.gstRate) / 100;

    const grandTotal =
      afterDiscount + gstAmount;

    const dueAmount = Math.max(
      grandTotal - invoice.paidAmount,
      0
    );

    return {
      ...invoice,
      subtotal,
      gstAmount,
      grandTotal,
      dueAmount,
    };
  }

  function openAdd() {
    setForm(createEmptyInvoice(invoices.length + 1));
    setEditingInvoice(null);
    setShowAdd(true);
  }

  function openEdit(invoice: Invoice) {
    setForm({
      ...invoice,
      items: invoice.items.map((item) => ({
        ...item,
      })),
    });

    setEditingInvoice(invoice);
  }

  function saveInvoice() {
    if (!form.customerName.trim()) {
      alert("Please enter customer name.");
      return;
    }

    if (!form.company.trim()) {
      alert("Please enter company name.");
      return;
    }

    if (!form.quotationNo.trim()) {
      alert("Please enter quotation number.");
      return;
    }

    if (form.items.length === 0) {
      alert("Please add at least one invoice item.");
      return;
    }

    const calculated = recalculateInvoice(form);

    if (editingInvoice) {
      setInvoices((current) =>
        current.map((invoice) =>
          invoice.id === editingInvoice.id
            ? calculated
            : invoice
        )
      );

      setSelectedInvoice(calculated);
      setEditingInvoice(null);
    } else {
      setInvoices((current) => [
        {
          ...calculated,
          id: Date.now(),
        },
        ...current,
      ]);

      setShowAdd(false);
    }
  }

  function addItem() {
    setForm((current) => ({
      ...current,
      items: [
        ...current.items,
        {
          id: Date.now(),
          description: "",
          quantity: 1,
          rate: 0,
          amount: 0,
        },
      ],
    }));
  }

  function updateItem(
    itemId: number,
    field: keyof InvoiceItem,
    value: any
  ) {
    setForm((current) => ({
      ...current,
      items: current.items.map((item) => {
        if (item.id !== itemId) return item;

        const updated = {
          ...item,
          [field]: value,
        };

        updated.amount =
          Number(updated.quantity || 0) *
          Number(updated.rate || 0);

        return updated;
      }),
    }));
  }

  function removeItem(itemId: number) {
    setForm((current) => ({
      ...current,
      items: current.items.filter(
        (item) => item.id !== itemId
      ),
    }));
  }

  function deleteInvoice() {
    if (!deletingInvoice) return;

    setInvoices((current) =>
      current.filter(
        (invoice) =>
          invoice.id !== deletingInvoice.id
      )
    );

    setSelectedInvoice(null);
    setDeletingInvoice(null);
    setShowDelete(false);
  }

  function markAsSent(invoice: Invoice) {
    const updated = {
      ...invoice,
      status: "SENT" as InvoiceStatus,
    };

    setInvoices((current) =>
      current.map((item) =>
        item.id === invoice.id ? updated : item
      )
    );

    setSelectedInvoice(updated);
  }

  function markAsPaid(invoice: Invoice) {
    const updated = {
      ...invoice,
      paidAmount: invoice.grandTotal,
      dueAmount: 0,
      status: "PAID" as InvoiceStatus,
    };

    setInvoices((current) =>
      current.map((item) =>
        item.id === invoice.id ? updated : item
      )
    );

    setSelectedInvoice(updated);
  }

  function assignEmployee(employeeId: number | null) {
    if (!assigningInvoice) return;

    const updated = {
      ...assigningInvoice,
      assignedEmployeeId: employeeId,
    };

    setInvoices((current) =>
      current.map((invoice) =>
        invoice.id === assigningInvoice.id
          ? updated
          : invoice
      )
    );

    setSelectedInvoice(updated);
    setAssigningInvoice(null);
    setShowAssign(false);
  }

  return (
    <div className="min-h-screen bg-[#080b12] text-white p-4 md:p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-sm mb-1">
            <FileText size={16} />
            Sales / Billing
          </div>

          <h1 className="text-2xl md:text-3xl font-bold">
            Billing & Invoices
          </h1>

          <p className="text-gray-400 text-sm mt-1">
            Manage invoices, GST, payments and outstanding
            customer balances.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-xl text-sm font-medium"
        >
          <Plus size={18} />
          Create Invoice
        </button>
      </div>

      {/* Workflow */}
      <div className="bg-[#0d111a] border border-white/10 rounded-2xl p-4 mb-6 overflow-x-auto">
        <div className="flex items-center min-w-[760px]">
          {[
            "Quotation Accepted",
            "Payment",
            "Verified",
            "Invoice",
            "Project Handover",
          ].map((step, index, arr) => (
            <div
              key={step}
              className="flex items-center flex-1"
            >
              <div className="flex flex-col items-center min-w-[130px]">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border ${
                    index === 3
                      ? "bg-blue-500/15 border-blue-500/30 text-blue-400"
                      : "bg-white/5 border-white/10 text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>

                <span className="text-xs text-gray-400 mt-2 text-center">
                  {step}
                </span>
              </div>

              {index < arr.length - 1 && (
                <div className="h-px bg-white/10 flex-1 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Invoiced"
          value={formatCurrency(stats.total)}
          icon={FileText}
        />

        <StatCard
          label="Paid"
          value={formatCurrency(stats.paid)}
          icon={CheckCircle2}
        />

        <StatCard
          label="Outstanding"
          value={formatCurrency(stats.due)}
          icon={Wallet}
        />

        <StatCard
          label="Overdue"
          value={formatCurrency(stats.overdue)}
          icon={AlertCircle}
        />
      </div>

      {/* Filters */}
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
                setSearch(e.target.value)
              }
              placeholder="Search invoice, customer, quotation..."
              className="w-full bg-[#080b12] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500/50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as
                  | "ALL"
                  | InvoiceStatus
              )
            }
            className="bg-[#080b12] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
            <option value="PARTIAL">Partial</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0d111a] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px]">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs text-gray-500">
                <th className="px-5 py-4">Invoice</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Quotation</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Paid</th>
                <th className="px-5 py-4">Due</th>
                <th className="px-5 py-4">Assigned</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-white/5 hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-4">
                    <div className="font-medium">
                      {invoice.invoiceNo}
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      {invoice.invoiceDate}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-medium">
                      {invoice.customerName}
                    </div>

                    <div className="text-xs text-gray-500">
                      {invoice.company}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-blue-300 text-sm">
                    {invoice.quotationNo}
                  </td>

                  <td className="px-5 py-4 font-semibold">
                    {formatCurrency(invoice.grandTotal)}
                  </td>

                  <td className="px-5 py-4 text-green-300">
                    {formatCurrency(invoice.paidAmount)}
                  </td>

                  <td className="px-5 py-4 text-orange-300">
                    {formatCurrency(invoice.dueAmount)}
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {employeeName(
                      invoice.assignedEmployeeId
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-lg border text-xs ${
                        statusConfig[invoice.status]
                          .className
                      }`}
                    >
                      {statusConfig[invoice.status].label}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        title="View"
                        onClick={() =>
                          setSelectedInvoice(invoice)
                        }
                        className="p-2 rounded-lg hover:bg-white/10 text-gray-300"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        title="Edit"
                        onClick={() =>
                          openEdit(invoice)
                        }
                        className="p-2 rounded-lg hover:bg-white/10 text-blue-400"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        title="Assign Employee"
                        onClick={() => {
                          setAssigningInvoice(invoice);
                          setEmployeeSearch("");
                          setShowAssign(true);
                        }}
                        className="p-2 rounded-lg hover:bg-white/10 text-green-400"
                      >
                        <UserPlus size={16} />
                      </button>

                      <button
                        title="Delete"
                        onClick={() => {
                          setDeletingInvoice(invoice);
                          setShowDelete(true);
                        }}
                        className="p-2 rounded-lg hover:bg-white/10 text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredInvoices.length === 0 && (
            <div className="py-16 text-center text-gray-500">
              No invoices found.
            </div>
          )}
        </div>
      </div>

      {/* View Invoice */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0d111a] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto">

            <div className="sticky top-0 z-10 bg-[#0d111a] p-5 border-b border-white/10 flex justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {selectedInvoice.invoiceNo}
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  {selectedInvoice.company}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedInvoice(null)
                }
                className="p-2 rounded-lg hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-5">

              {/* Customer */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <InfoBox
                  label="Customer"
                  value={selectedInvoice.customerName}
                />

                <InfoBox
                  label="Company"
                  value={selectedInvoice.company}
                />

                <InfoBox
                  label="Quotation"
                  value={selectedInvoice.quotationNo}
                />

                <InfoBox
                  label="Payment"
                  value={selectedInvoice.paymentNo}
                />

                <InfoBox
                  label="Email"
                  value={selectedInvoice.email}
                />

                <InfoBox
                  label="Assigned Employee"
                  value={employeeName(
                    selectedInvoice.assignedEmployeeId
                  )}
                />
              </div>

              {/* Verification */}
              <div
                className={`rounded-xl border p-4 ${
                  selectedInvoice.paymentVerified
                    ? "bg-green-500/5 border-green-500/10"
                    : "bg-yellow-500/5 border-yellow-500/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  {selectedInvoice.paymentVerified ? (
                    <CheckCircle2
                      size={19}
                      className="text-green-400"
                    />
                  ) : (
                    <Clock3
                      size={19}
                      className="text-yellow-400"
                    />
                  )}

                  <div>
                    <p className="text-sm font-semibold">
                      Payment{" "}
                      {selectedInvoice.paymentVerified
                        ? "Verified"
                        : "Not Verified"}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Invoice workflow requires payment
                      verification.
                    </p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="border border-white/10 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 font-semibold">
                  Invoice Items
                </div>

                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-gray-500 border-b border-white/10">
                      <th className="text-left px-4 py-3">
                        Description
                      </th>
                      <th className="px-4 py-3">
                        Qty
                      </th>
                      <th className="px-4 py-3">
                        Rate
                      </th>
                      <th className="px-4 py-3 text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedInvoice.items.map(
                      (item) => (
                        <tr
                          key={item.id}
                          className="border-b border-white/5"
                        >
                          <td className="px-4 py-3 text-sm">
                            {item.description}
                          </td>

                          <td className="px-4 py-3 text-center text-sm">
                            {item.quantity}
                          </td>

                          <td className="px-4 py-3 text-center text-sm">
                            {formatCurrency(item.rate)}
                          </td>

                          <td className="px-4 py-3 text-right text-sm font-medium">
                            {formatCurrency(item.amount)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Amount */}
              <div className="flex justify-end">
                <div className="w-full md:w-96 space-y-2 bg-[#080b12] border border-white/10 rounded-xl p-4">
                  <AmountRow
                    label="Subtotal"
                    value={selectedInvoice.subtotal}
                  />

                  <AmountRow
                    label="Discount"
                    value={-selectedInvoice.discount}
                  />

                  <AmountRow
                    label={`GST (${selectedInvoice.gstRate}%)`}
                    value={selectedInvoice.gstAmount}
                  />

                  <div className="border-t border-white/10 pt-2">
                    <AmountRow
                      label="Grand Total"
                      value={selectedInvoice.grandTotal}
                      bold
                    />

                    <AmountRow
                      label="Paid"
                      value={selectedInvoice.paidAmount}
                    />

                    <AmountRow
                      label="Due"
                      value={selectedInvoice.dueAmount}
                    />
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoBox
                  label="Invoice Date"
                  value={selectedInvoice.invoiceDate}
                />

                <InfoBox
                  label="Due Date"
                  value={selectedInvoice.dueDate}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 border-t border-white/10 pt-5">
                <button
                  onClick={() =>
                    openEdit(selectedInvoice)
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm"
                >
                  <Pencil size={16} />
                  Edit
                </button>

                {selectedInvoice.status === "DRAFT" && (
                  <button
                    onClick={() =>
                      markAsSent(selectedInvoice)
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 text-sm"
                  >
                    <Send size={16} />
                    Mark as Sent
                  </button>
                )}

                {selectedInvoice.dueAmount > 0 &&
                  selectedInvoice.paymentVerified && (
                    <button
                      onClick={() =>
                        markAsPaid(selectedInvoice)
                      }
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-sm"
                    >
                      <CheckCircle2 size={16} />
                      Mark as Paid
                    </button>
                  )}

                <button
                  onClick={() => {
                    setAssigningInvoice(
                      selectedInvoice
                    );
                    setEmployeeSearch("");
                    setShowAssign(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-300 hover:bg-green-500/20 text-sm"
                >
                  <UserPlus size={16} />
                  Assign Employee
                </button>

                <button
                  onClick={() => {
                    setDeletingInvoice(
                      selectedInvoice
                    );
                    setShowDelete(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20 text-sm"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit */}
      {(showAdd || editingInvoice) && (
        <InvoiceForm
          title={
            editingInvoice
              ? "Edit Invoice"
              : "Create Invoice"
          }
          form={form}
          updateForm={updateForm}
          updateItem={updateItem}
          addItem={addItem}
          removeItem={removeItem}
          onClose={() => {
            setShowAdd(false);
            setEditingInvoice(null);
          }}
          onSave={saveInvoice}
        />
      )}

      {/* Assign */}
      {showAssign && assigningInvoice && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0d111a] border border-white/10 rounded-2xl w-full max-w-lg">

            <div className="p-5 border-b border-white/10 flex justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  Assign Employee
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  {assigningInvoice.invoiceNo}
                </p>
              </div>

              <button
                onClick={() => setShowAssign(false)}
                className="p-2 rounded-lg hover:bg-white/10"
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
                  value={employeeSearch}
                  onChange={(e) =>
                    setEmployeeSearch(e.target.value)
                  }
                  placeholder="Search employee..."
                  className="w-full bg-[#080b12] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none"
                />
              </div>

              <div className="space-y-2">
                {filteredEmployees.map((employee) => (
                  <button
                    key={employee.id}
                    onClick={() =>
                      assignEmployee(employee.id)
                    }
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/10 hover:bg-white/5 text-left"
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-300 flex items-center justify-center text-sm font-semibold">
                      {employee.name
                        .split(" ")
                        .map((x) => x[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div>
                      <div className="text-sm font-medium">
                        {employee.name}
                      </div>

                      <div className="text-xs text-gray-500">
                        {employee.department} ·{" "}
                        {employee.role}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => assignEmployee(null)}
                className="w-full mt-3 border border-white/10 rounded-xl py-2.5 text-sm text-gray-400 hover:bg-white/5"
              >
                Remove Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete */}
      {showDelete && deletingInvoice && (
        <div className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0d111a] border border-white/10 rounded-2xl w-full max-w-md p-5">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-4">
              <Trash2 size={22} />
            </div>

            <h2 className="text-lg font-bold">
              Delete Invoice?
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete{" "}
              <span className="text-gray-300">
                {deletingInvoice.invoiceNo}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowDelete(false);
                  setDeletingInvoice(null);
                }}
                className="px-4 py-2 rounded-lg border border-white/10 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={deleteInvoice}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------
   Invoice Form
------------------------------------------------------- */

function InvoiceForm({
  title,
  form,
  updateForm,
  updateItem,
  addItem,
  removeItem,
  onClose,
  onSave,
}: {
  title: string;
  form: Invoice;
  updateForm: (field: keyof Invoice, value: any) => void;
  updateItem: (
    id: number,
    field: keyof InvoiceItem,
    value: any
  ) => void;
  addItem: () => void;
  removeItem: (id: number) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const subtotal = form.items.reduce(
    (sum, item) =>
      sum + item.quantity * item.rate,
    0
  );

  const afterDiscount = Math.max(
    subtotal - form.discount,
    0
  );

  const gstAmount =
    (afterDiscount * form.gstRate) / 100;

  const grandTotal =
    afterDiscount + gstAmount;

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-[#0d111a] border border-white/10 rounded-2xl w-full max-w-6xl max-h-[94vh] overflow-y-auto">

        <div className="sticky top-0 z-10 bg-[#0d111a] p-5 border-b border-white/10 flex justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {title}
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Create and manage customer invoice
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

          {/* Customer */}
          <div>
            <h3 className="font-semibold mb-3">
              Customer Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Invoice Number"
                value={form.invoiceNo}
                onChange={(value) =>
                  updateForm("invoiceNo", value)
                }
              />

              <Input
                label="Quotation Number"
                value={form.quotationNo}
                onChange={(value) =>
                  updateForm("quotationNo", value)
                }
              />

              <Input
                label="Payment Number"
                value={form.paymentNo}
                onChange={(value) =>
                  updateForm("paymentNo", value)
                }
              />

              <Input
                label="Customer Name"
                value={form.customerName}
                onChange={(value) =>
                  updateForm("customerName", value)
                }
              />

              <Input
                label="Company"
                value={form.company}
                onChange={(value) =>
                  updateForm("company", value)
                }
              />

              <Input
                label="Email"
                value={form.email}
                onChange={(value) =>
                  updateForm("email", value)
                }
              />

              <Input
                label="Phone"
                value={form.phone}
                onChange={(value) =>
                  updateForm("phone", value)
                }
              />

              <Input
                label="Invoice Date"
                type="date"
                value={form.invoiceDate}
                onChange={(value) =>
                  updateForm("invoiceDate", value)
                }
              />

              <Input
                label="Due Date"
                type="date"
                value={form.dueDate}
                onChange={(value) =>
                  updateForm("dueDate", value)
                }
              />
            </div>

            <div className="mt-4">
              <label className="block text-xs text-gray-500 mb-1.5">
                Address
              </label>

              <textarea
                value={form.address}
                onChange={(e) =>
                  updateForm("address", e.target.value)
                }
                rows={2}
                className="w-full bg-[#080b12] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
              />
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">
                Invoice Items
              </h3>

              <button
                onClick={addItem}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-lg text-sm"
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>

            <div className="border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px]">
                  <thead>
                    <tr className="text-xs text-gray-500 border-b border-white/10">
                      <th className="text-left px-4 py-3">
                        Description
                      </th>

                      <th className="px-4 py-3">
                        Qty
                      </th>

                      <th className="px-4 py-3">
                        Rate
                      </th>

                      <th className="px-4 py-3">
                        Amount
                      </th>

                      <th className="px-4 py-3">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {form.items.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-white/5"
                      >
                        <td className="px-4 py-3">
                          <input
                            value={item.description}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Service / product"
                            className="w-full bg-[#080b12] border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
                          />
                        </td>

                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "quantity",
                                Number(e.target.value) || 1
                              )
                            }
                            className="w-20 bg-[#080b12] border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
                          />
                        </td>

                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            value={item.rate}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "rate",
                                Number(e.target.value) || 0
                              )
                            }
                            className="w-32 bg-[#080b12] border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
                          />
                        </td>

                        <td className="px-4 py-3 text-sm font-medium">
                          {formatCurrency(
                            item.quantity * item.rate
                          )}
                        </td>

                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() =>
                              removeItem(item.id)
                            }
                            className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Calculation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Discount
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.discount}
                  onChange={(e) =>
                    updateForm(
                      "discount",
                      Number(e.target.value) || 0
                    )
                  }
                  className="w-full bg-[#080b12] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  GST Rate (%)
                </label>

                <select
                  value={form.gstRate}
                  onChange={(e) =>
                    updateForm(
                      "gstRate",
                      Number(e.target.value)
                    )
                  }
                  className="w-full bg-[#080b12] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none"
                >
                  <option value={0}>0%</option>
                  <option value={5}>5%</option>
                  <option value={12}>12%</option>
                  <option value={18}>18%</option>
                  <option value={28}>28%</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Notes
                </label>

                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    updateForm(
                      "notes",
                      e.target.value
                    )
                  }
                  rows={5}
                  className="w-full bg-[#080b12] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
                  placeholder="Invoice notes..."
                />
              </div>
            </div>

            <div className="bg-[#080b12] border border-white/10 rounded-xl p-5 h-fit">
              <h3 className="font-semibold mb-4">
                Invoice Summary
              </h3>

              <AmountRow
                label="Subtotal"
                value={subtotal}
              />

              <AmountRow
                label="Discount"
                value={-form.discount}
              />

              <AmountRow
                label={`GST (${form.gstRate}%)`}
                value={gstAmount}
              />

              <div className="border-t border-white/10 mt-3 pt-3">
                <AmountRow
                  label="Grand Total"
                  value={grandTotal}
                  bold
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-300 text-sm">
              <FileText size={17} />
              Billing Workflow
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Accepted Quotation → Payment → Payment Verified
              → Billing / Invoice → Project Handover
            </p>
          </div>

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
              Save Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   Helper Components
------------------------------------------------------- */

function createEmptyInvoice(number: number): Invoice {
  return {
    id: 0,
    invoiceNo: `INV-2026-${String(number).padStart(3, "0")}`,
    quotationNo: "",
    paymentNo: "",

    customerName: "",
    company: "",
    email: "",
    phone: "",
    address: "",

    items: [
      {
        id: Date.now(),
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ],

    subtotal: 0,
    discount: 0,
    gstRate: 18,
    gstAmount: 0,
    grandTotal: 0,

    paidAmount: 0,
    dueAmount: 0,

    invoiceDate: new Date()
      .toISOString()
      .slice(0, 10),

    dueDate: "",

    status: "DRAFT",
    assignedEmployeeId: null,

    paymentVerified: false,
    notes: "",
  };
}

function formatDate(date: string) {
  return date || "-";
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-[#0d111a] border border-white/10 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">
            {label}
          </p>

          <p className="text-xl font-bold mt-1">
            {value}
          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

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

function AmountRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: number;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex justify-between gap-4 ${
        bold
          ? "text-base font-bold"
          : "text-sm text-gray-400"
      }`}
    >
      <span>{label}</span>

      <span
        className={
          value < 0
            ? "text-red-300"
            : bold
            ? "text-white"
            : "text-gray-200"
        }
      >
        {formatCurrency(value)}
      </span>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
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
          onChange(e.target.value)
        }
        className="w-full bg-[#080b12] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500/50"
      />
    </div>
  );
}