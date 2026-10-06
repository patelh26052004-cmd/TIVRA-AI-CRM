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
  CreditCard,
  Clock3,
  AlertCircle,
  CheckCircle2,
  Wallet,
  ArrowRight,
  RotateCcw,
  FileText,
  Building2,
  Phone,
  Mail,
  CalendarDays,
  Hash,
  ShieldCheck,
  CircleDollarSign,
} from "lucide-react";

type PaymentStatus =
  | "PENDING"
  | "PARTIAL"
  | "RECEIVED"
  | "OVERDUE";

type PaymentMethod =
  | "BANK_TRANSFER"
  | "UPI"
  | "CASH"
  | "CHEQUE"
  | "CARD"
  | "OTHER";

type PaymentType = "ADVANCE" | "PARTIAL" | "FULL";

type Employee = {
  id: number;
  name: string;
  department: string;
  role: string;
};

type Payment = {
  id: number;
  paymentNo: string;
  quotationNo: string;
  customerName: string;
  company: string;
  email: string;
  phone: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  referenceNo: string;
  paymentDate: string;
  dueDate: string;
  status: PaymentStatus;
  assignedEmployeeId: number | null;
  notes: string;
  verified: boolean;
  createdAt: string;
};

const employees: Employee[] = [
  { id: 1, name: "Riya Shah", department: "Sales", role: "Sales Manager" },
  { id: 2, name: "Saloni Mehta", department: "Sales", role: "Sales Executive" },
  { id: 3, name: "Hetvi Shah", department: "Sales", role: "Sales + Project" },
  { id: 4, name: "Dev Patel", department: "Development", role: "Developer" },
  { id: 5, name: "Kashis Patel", department: "Marketing", role: "Digital Marketing" },
  { id: 6, name: "Hinal Patel", department: "Marketing", role: "Digital Marketing" },
];

const statusConfig: Record<
  PaymentStatus,
  { label: string; className: string; dotClassName: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
    dotClassName: "bg-yellow-400",
  },
  PARTIAL: {
    label: "Partial",
    className: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    dotClassName: "bg-blue-400",
  },
  RECEIVED: {
    label: "Received",
    className: "bg-green-500/10 text-green-300 border-green-500/20",
    dotClassName: "bg-green-400",
  },
  OVERDUE: {
    label: "Overdue",
    className: "bg-red-500/10 text-red-300 border-red-500/20",
    dotClassName: "bg-red-400",
  },
};

const paymentMethodLabels: Record<PaymentMethod, string> = {
  BANK_TRANSFER: "Bank Transfer",
  UPI: "UPI",
  CASH: "Cash",
  CHEQUE: "Cheque",
  CARD: "Card",
  OTHER: "Other",
};

const initialPayments: Payment[] = [
  {
    id: 1,
    paymentNo: "PAY-2026-001",
    quotationNo: "QT-2026-003",
    customerName: "Pooja Patel",
    company: "Pooja Healthcare",
    email: "pooja@healthcare.com",
    phone: "+91 98980 45678",
    totalAmount: 112100,
    paidAmount: 56050,
    dueAmount: 56050,
    paymentType: "PARTIAL",
    paymentMethod: "BANK_TRANSFER",
    referenceNo: "HDFC-FT-892341",
    paymentDate: "2026-09-16",
    dueDate: "2026-09-30",
    status: "PARTIAL",
    assignedEmployeeId: 3,
    notes: "50% advance received.",
    verified: true,
    createdAt: "2026-09-16",
  },
  {
    id: 2,
    paymentNo: "PAY-2026-002",
    quotationNo: "QT-2026-001",
    customerName: "Rajesh Joshi",
    company: "Joshi Enterprises",
    email: "rajesh@joshi.com",
    phone: "+91 98765 43210",
    totalAmount: 123900,
    paidAmount: 0,
    dueAmount: 123900,
    paymentType: "ADVANCE",
    paymentMethod: "UPI",
    referenceNo: "",
    paymentDate: "",
    dueDate: "2026-09-25",
    status: "PENDING",
    assignedEmployeeId: 1,
    notes: "Waiting for advance payment.",
    verified: false,
    createdAt: "2026-09-12",
  },
  {
    id: 3,
    paymentNo: "PAY-2026-003",
    quotationNo: "QT-2026-002",
    customerName: "Vishal Shah",
    company: "VS Enterprises",
    email: "vishal@vsenterprises.com",
    phone: "+91 98250 12345",
    totalAmount: 114460,
    paidAmount: 114460,
    dueAmount: 0,
    paymentType: "FULL",
    paymentMethod: "BANK_TRANSFER",
    referenceNo: "ICICI-NEFT-12091",
    paymentDate: "2026-09-14",
    dueDate: "2026-09-20",
    status: "RECEIVED",
    assignedEmployeeId: 2,
    notes: "Full payment received.",
    verified: true,
    createdAt: "2026-09-14",
  },
  {
    id: 4,
    paymentNo: "PAY-2026-004",
    quotationNo: "QT-2026-004",
    customerName: "Amit Patel",
    company: "Shree Manufacturing",
    email: "amit@shreemanufacturing.com",
    phone: "+91 99090 22222",
    totalAmount: 165200,
    paidAmount: 0,
    dueAmount: 165200,
    paymentType: "ADVANCE",
    paymentMethod: "CHEQUE",
    referenceNo: "CHQ-45821",
    paymentDate: "",
    dueDate: "2026-09-10",
    status: "OVERDUE",
    assignedEmployeeId: null,
    notes: "Advance payment overdue.",
    verified: false,
    createdAt: "2026-09-01",
  },
];

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function employeeName(id: number | null) {
  if (!id) return "Unassigned";
  return employees.find((employee) => employee.id === id)?.name || "Unknown";
}

function calculateDue(total: number, paid: number) {
  return Math.max(total - paid, 0);
}

function getPaymentStatus(
  totalAmount: number,
  paidAmount: number,
  dueDate: string
): PaymentStatus {
  if (paidAmount >= totalAmount && totalAmount > 0) return "RECEIVED";
  if (paidAmount > 0) return "PARTIAL";

  if (
    dueDate &&
    new Date(`${dueDate}T00:00:00`).getTime() <
      new Date().setHours(0, 0, 0, 0)
  ) {
    return "OVERDUE";
  }

  return "PENDING";
}

function derivePaymentType(paidAmount: number, totalAmount: number): PaymentType {
  if (paidAmount >= totalAmount && totalAmount > 0) return "FULL";
  if (paidAmount > 0) return "PARTIAL";
  return "ADVANCE";
}

function nextPaymentNumber(payments: Payment[]) {
  const highest = payments.reduce((max, payment) => {
    const match = payment.paymentNo.match(/PAY-\d{4}-(\d+)$/i);
    return Math.max(max, match ? Number(match[1]) || 0 : 0);
  }, 0);

  return `PAY-${new Date().getFullYear()}-${String(highest + 1).padStart(3, "0")}`;
}

export default function PaymentsPage() {
  const [payments, setPayments] = usePersistentState<Payment[]>(
    "tivra_payments",
    initialPayments
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | PaymentStatus>("ALL");
  const [methodFilter, setMethodFilter] = useState<"ALL" | PaymentMethod>("ALL");

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [assigningPayment, setAssigningPayment] = useState<Payment | null>(null);
  const [deletingPayment, setDeletingPayment] = useState<Payment | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState("");

  const [form, setForm] = useState<Payment>({
    id: 0,
    paymentNo: "",
    quotationNo: "",
    customerName: "",
    company: "",
    email: "",
    phone: "",
    totalAmount: 0,
    paidAmount: 0,
    dueAmount: 0,
    paymentType: "ADVANCE",
    paymentMethod: "BANK_TRANSFER",
    referenceNo: "",
    paymentDate: "",
    dueDate: "",
    status: "PENDING",
    assignedEmployeeId: null,
    notes: "",
    verified: false,
    createdAt: new Date().toISOString().slice(0, 10),
  });

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        !query ||
        [
          payment.paymentNo,
          payment.quotationNo,
          payment.customerName,
          payment.company,
          payment.email,
          payment.phone,
          payment.referenceNo,
          employeeName(payment.assignedEmployeeId),
        ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "ALL" || payment.status === statusFilter;

      const matchesMethod =
        methodFilter === "ALL" || payment.paymentMethod === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [payments, search, statusFilter, methodFilter]);

  const stats = useMemo(() => {
    const totalValue = payments.reduce((sum, payment) => sum + payment.totalAmount, 0);
    const received = payments.reduce((sum, payment) => sum + payment.paidAmount, 0);
    const pending = payments.reduce((sum, payment) => sum + payment.dueAmount, 0);
    const overdue = payments
      .filter((payment) => payment.status === "OVERDUE")
      .reduce((sum, payment) => sum + payment.dueAmount, 0);

    return {
      totalValue,
      received,
      pending,
      overdue,
      count: payments.length,
      receivedCount: payments.filter((payment) => payment.status === "RECEIVED").length,
      pendingCount: payments.filter((payment) => payment.status === "PENDING").length,
      partialCount: payments.filter((payment) => payment.status === "PARTIAL").length,
      overdueCount: payments.filter((payment) => payment.status === "OVERDUE").length,
    };
  }, [payments]);

  const filteredEmployees = useMemo(() => {
    const query = employeeSearch.trim().toLowerCase();
    return employees.filter(
      (employee) =>
        !query ||
        employee.name.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query) ||
        employee.role.toLowerCase().includes(query)
    );
  }, [employeeSearch]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setMethodFilter("ALL");
  };

  function openAddModal() {
    setForm({
      id: 0,
      paymentNo: nextPaymentNumber(payments),
      quotationNo: "",
      customerName: "",
      company: "",
      email: "",
      phone: "",
      totalAmount: 0,
      paidAmount: 0,
      dueAmount: 0,
      paymentType: "ADVANCE",
      paymentMethod: "BANK_TRANSFER",
      referenceNo: "",
      paymentDate: "",
      dueDate: "",
      status: "PENDING",
      assignedEmployeeId: null,
      notes: "",
      verified: false,
      createdAt: new Date().toISOString().slice(0, 10),
    });
    setShowAddModal(true);
  }

  function openEditModal(payment: Payment) {
    setForm({ ...payment });
    setEditingPayment(payment);
    setSelectedPayment(null);
  }

  function savePayment() {
    const customerName = form.customerName.trim();
    const company = form.company.trim();
    const quotationNo = form.quotationNo.trim();

    if (!customerName) return alert("Please enter customer name.");
    if (!company) return alert("Please enter company name.");
    if (!quotationNo) return alert("Please enter quotation number.");
    if (form.totalAmount <= 0) return alert("Please enter a valid total amount.");
    if (form.paidAmount < 0) return alert("Paid amount cannot be negative.");
    if (form.paidAmount > form.totalAmount) {
      return alert("Paid amount cannot exceed total amount.");
    }
    if (form.paymentDate && form.dueDate && form.paymentDate > form.dueDate) {
      return alert("Payment date cannot be after the due date.");
    }

    const dueAmount = calculateDue(form.totalAmount, form.paidAmount);
    const status = getPaymentStatus(form.totalAmount, form.paidAmount, form.dueDate);
    const paymentType = derivePaymentType(form.paidAmount, form.totalAmount);

    const updatedPayment: Payment = {
      ...form,
      customerName,
      company,
      quotationNo,
      referenceNo: form.referenceNo.trim(),
      notes: form.notes.trim(),
      dueAmount,
      status,
      paymentType,
      verified: form.verified && form.paidAmount > 0,
    };

    if (editingPayment) {
      setPayments((current) =>
        current.map((payment) =>
          payment.id === editingPayment.id ? updatedPayment : payment
        )
      );
      setEditingPayment(null);
    } else {
      setPayments((current) => [
        { ...updatedPayment, id: Date.now() },
        ...current,
      ]);
      setShowAddModal(false);
    }
  }

  function deletePayment() {
    if (!deletingPayment) return;

    setPayments((current) =>
      current.filter((payment) => payment.id !== deletingPayment.id)
    );

    if (selectedPayment?.id === deletingPayment.id) setSelectedPayment(null);
    if (editingPayment?.id === deletingPayment.id) setEditingPayment(null);

    setDeletingPayment(null);
    setShowDeleteModal(false);
  }

  function markAsReceived(payment: Payment) {
    const updated: Payment = {
      ...payment,
      paidAmount: payment.totalAmount,
      dueAmount: 0,
      paymentType: "FULL",
      status: "RECEIVED",
      paymentDate: payment.paymentDate || new Date().toISOString().slice(0, 10),
    };

    setPayments((current) =>
      current.map((item) => (item.id === payment.id ? updated : item))
    );
    setSelectedPayment(updated);
  }

  function verifyPayment(payment: Payment) {
    if (payment.paidAmount <= 0) {
      setShowVerifyModal(false);
      alert("A payment amount must be recorded before verification.");
      return;
    }

    const updated: Payment = { ...payment, verified: true };

    setPayments((current) =>
      current.map((item) => (item.id === payment.id ? updated : item))
    );
    setSelectedPayment(updated);
    setShowVerifyModal(false);
  }

  function assignEmployee(employeeId: number | null) {
    if (!assigningPayment) return;

    const updated = { ...assigningPayment, assignedEmployeeId: employeeId };

    setPayments((current) =>
      current.map((payment) =>
        payment.id === assigningPayment.id ? updated : payment
      )
    );

    setSelectedPayment((current) =>
      current && current.id === assigningPayment.id ? updated : current
    );

    setAssigningPayment(null);
    setShowAssignModal(false);
  }

  function openAssignModal(payment: Payment) {
    setAssigningPayment(payment);
    setEmployeeSearch("");
    setShowAssignModal(true);
  }

  function updateForm(field: keyof Payment, value: string | number | boolean | null) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleEditFromView() {
    if (!selectedPayment) return;
    openEditModal(selectedPayment);
  }

  return (
    <div className="min-h-screen bg-[#080b12] p-4 text-white md:p-6">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-sm text-blue-400">
            <CreditCard size={16} />
            Sales / Payments
          </div>
          <h1 className="text-2xl font-bold md:text-3xl">Payments</h1>
          <p className="mt-1 text-sm text-gray-400">
            Track quotation payments, verify receipts and monitor outstanding amounts.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium transition hover:bg-blue-500"
        >
          <Plus size={18} />
          Add Payment
        </button>
      </div>

      {/* WORKFLOW */}
      <div className="mb-6 overflow-x-auto rounded-2xl border border-white/10 bg-[#0d111a] p-4">
        <div className="flex min-w-[760px] items-center">
          {["Quotation Accepted", "Payment", "Verification", "Billing"].map(
            (step, index, array) => (
              <div key={step} className="flex flex-1 items-center">
                <div className="flex min-w-[160px] flex-col items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold ${
                      index === 1
                        ? "border-blue-500/30 bg-blue-500/15 text-blue-400"
                        : "border-white/10 bg-white/5 text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="mt-2 text-center text-xs text-gray-400">{step}</span>
                </div>
                {index < array.length - 1 && (
                  <div className="mx-2 h-px flex-1 bg-white/10" />
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* STATS */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Payment Value" value={formatCurrency(stats.totalValue)} icon={Wallet} helper={`${stats.count} payment records`} />
        <StatCard label="Received" value={formatCurrency(stats.received)} icon={CheckCircle2} helper={`${stats.receivedCount} received`} />
        <StatCard label="Pending / Due" value={formatCurrency(stats.pending)} icon={Clock3} helper={`${stats.pendingCount + stats.partialCount} open payments`} />
        <StatCard label="Overdue" value={formatCurrency(stats.overdue)} icon={AlertCircle} helper={`${stats.overdueCount} overdue`} />
      </div>

      {/* FILTERS */}
      <div className="mb-4 rounded-2xl border border-white/10 bg-[#0d111a] p-4">
        <div className="flex flex-col gap-3 xl:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search payment, quotation, customer, company, reference..."
              className="w-full rounded-xl border border-white/10 bg-[#080b12] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500/50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "ALL" | PaymentStatus)}
            className="rounded-xl border border-white/10 bg-[#080b12] px-4 py-2.5 text-sm outline-none"
          >
            <option value="ALL">All Payment Status</option>
            <option value="PENDING">Pending</option>
            <option value="PARTIAL">Partial</option>
            <option value="RECEIVED">Received</option>
            <option value="OVERDUE">Overdue</option>
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value as "ALL" | PaymentMethod)}
            className="rounded-xl border border-white/10 bg-[#080b12] px-4 py-2.5 text-sm outline-none"
          >
            <option value="ALL">All Payment Methods</option>
            {Object.entries(paymentMethodLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          {(search || statusFilter !== "ALL" || methodFilter !== "ALL") && (
            <button
              onClick={resetFilters}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/5"
            >
              <RotateCcw size={16} />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d111a]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1280px]">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs text-gray-500">
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Quotation</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Due</th>
                <th className="px-5 py-4">Method</th>
                <th className="px-5 py-4">Assigned</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-white/5 transition hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <div className="font-medium">{payment.paymentNo}</div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <CalendarDays size={12} />
                      {payment.paymentDate || "Payment not received"}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium">{payment.customerName}</div>
                    <div className="text-xs text-gray-500">{payment.company}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-blue-300">{payment.quotationNo}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold">{formatCurrency(payment.paidAmount)}</div>
                    <div className="text-xs text-gray-500">of {formatCurrency(payment.totalAmount)}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={payment.dueAmount > 0 ? "text-orange-300" : "text-green-300"}>
                      {formatCurrency(payment.dueAmount)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-400">
                    {paymentMethodLabels[payment.paymentMethod]}
                  </td>
                  <td className="px-5 py-4 text-sm">{employeeName(payment.assignedEmployeeId)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs ${statusConfig[payment.status].className}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusConfig[payment.status].dotClassName}`} />
                        {statusConfig[payment.status].label}
                      </span>
                      {payment.verified && <CheckCircle2 size={15} className="text-green-400" aria-label="Payment verified" />}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <IconButton title="View Payment" onClick={() => setSelectedPayment(payment)}>
                        <Eye size={16} />
                      </IconButton>
                      <IconButton title="Edit Payment" onClick={() => openEditModal(payment)} className="text-blue-400">
                        <Pencil size={16} />
                      </IconButton>
                      <IconButton title="Assign Employee" onClick={() => openAssignModal(payment)} className="text-green-400">
                        <UserPlus size={16} />
                      </IconButton>
                      <IconButton title="Delete Payment" onClick={() => { setDeletingPayment(payment); setShowDeleteModal(true); }} className="text-red-400">
                        <Trash2 size={16} />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPayments.length === 0 && (
            <div className="py-16 text-center text-gray-500">
              <CreditCard className="mx-auto mb-3 h-9 w-9 text-gray-700" />
              <p className="font-medium text-gray-400">No payments found</p>
              <p className="mt-1 text-xs">Try changing your search or filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* VIEW PAYMENT */}
      {selectedPayment && (
        <ModalOverlay>
          <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#0d111a] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 bg-[#0d111a] px-5 py-4 md:px-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold">{selectedPayment.paymentNo}</h2>
                  <StatusBadge status={selectedPayment.status} />
                  {selectedPayment.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-300">
                      <ShieldCheck size={13} /> Verified
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">Linked quotation · {selectedPayment.quotationNo}</p>
              </div>
              <button onClick={() => setSelectedPayment(null)} className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white" aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[78vh] overflow-y-auto p-5 md:p-6">
              <div className="space-y-5">
                {/* CUSTOMER / QUOTATION */}
                <DetailSection title="Customer & Quotation" icon={<Building2 size={16} />}>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    <InfoBox label="Customer" value={selectedPayment.customerName} />
                    <InfoBox label="Company" value={selectedPayment.company} />
                    <InfoBox label="Quotation" value={selectedPayment.quotationNo} />
                    <InfoBox label="Email" value={selectedPayment.email} icon={<Mail size={13} />} />
                    <InfoBox label="Phone" value={selectedPayment.phone} icon={<Phone size={13} />} />
                    <InfoBox label="Assigned Employee" value={employeeName(selectedPayment.assignedEmployeeId)} />
                  </div>
                </DetailSection>

                {/* AMOUNTS */}
                <DetailSection title="Payment Summary" icon={<CircleDollarSign size={16} />}>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <AmountCard label="Total Amount" value={selectedPayment.totalAmount} />
                    <AmountCard label="Paid Amount" value={selectedPayment.paidAmount} tone="green" />
                    <AmountCard label="Due Amount" value={selectedPayment.dueAmount} tone={selectedPayment.dueAmount > 0 ? "orange" : "green"} />
                  </div>

                  <div className="mt-4 rounded-xl border border-white/10 bg-[#080b12] p-4">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-gray-500">Payment Progress</span>
                      <span className="font-semibold">
                        {selectedPayment.totalAmount > 0
                          ? Math.round((selectedPayment.paidAmount / selectedPayment.totalAmount) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{
                          width: `${selectedPayment.totalAmount > 0 ? Math.min((selectedPayment.paidAmount / selectedPayment.totalAmount) * 100, 100) : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </DetailSection>

                {/* PAYMENT DETAILS */}
                <DetailSection title="Payment Details" icon={<CreditCard size={16} />}>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    <InfoBox label="Payment Type" value={selectedPayment.paymentType} />
                    <InfoBox label="Payment Method" value={paymentMethodLabels[selectedPayment.paymentMethod]} />
                    <InfoBox label="Reference / UTR" value={selectedPayment.referenceNo || "-"} icon={<Hash size={13} />} />
                    <InfoBox label="Payment Date" value={selectedPayment.paymentDate || "Not received"} />
                    <InfoBox label="Due Date" value={selectedPayment.dueDate || "-"} />
                    <InfoBox label="Created" value={selectedPayment.createdAt} />
                  </div>
                </DetailSection>

                {/* VERIFICATION */}
                <div className="rounded-2xl border border-white/10 bg-[#080b12] p-4 md:p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={17} className="text-green-400" />
                        <h3 className="font-semibold">Payment Verification</h3>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-gray-500">Verification is required before the billing / invoice workflow.</p>
                    </div>
                    {selectedPayment.verified ? (
                      <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-2.5 text-sm font-medium text-green-300">
                        <CheckCircle2 size={17} />
                        Payment Verified
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowVerifyModal(true)}
                        disabled={selectedPayment.paidAmount <= 0}
                        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Check size={16} />
                        Verify Payment
                      </button>
                    )}
                  </div>
                </div>

                {/* NOTES */}
                <DetailSection title="Notes" icon={<FileText size={16} />}>
                  <div className="rounded-xl border border-white/10 bg-[#080b12] p-4">
                    <p className="whitespace-pre-wrap text-sm leading-6 text-gray-300">
                      {selectedPayment.notes || "No notes added."}
                    </p>
                  </div>
                </DetailSection>

                {/* WORKFLOW */}
                <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-4">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-blue-300">
                    <span>Quotation</span><ArrowRight size={14} />
                    <span>Payment</span><ArrowRight size={14} />
                    <span>Verification</span><ArrowRight size={14} />
                    <span>Billing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* VIEW FOOTER */}
            <div className="flex flex-col gap-2 border-t border-white/10 bg-[#0d111a] p-4 sm:flex-row sm:justify-end">
              <button
                onClick={() => setSelectedPayment(null)}
                className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium transition hover:bg-white/5"
              >
                Close
              </button>
              <button
                onClick={handleEditFromView}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium transition hover:bg-blue-500"
              >
                <Pencil size={16} />
                Edit Payment
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* ADD / EDIT */}
      {(showAddModal || editingPayment) && (
        <PaymentFormModal
          title={editingPayment ? "Edit Payment" : "Add Payment"}
          isEditing={Boolean(editingPayment)}
          form={form}
          updateForm={updateForm}
          onClose={() => {
            setShowAddModal(false);
            setEditingPayment(null);
          }}
          onSave={savePayment}
        />
      )}

      {/* ASSIGN */}
      {showAssignModal && assigningPayment && (
        <ModalOverlay>
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0d111a] shadow-2xl">
            <ModalHeader title="Assign Employee" subtitle={assigningPayment.paymentNo} onClose={() => setShowAssignModal(false)} />
            <div className="p-5">
              <div className="relative mb-4">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  placeholder="Search employee, department or role..."
                  className="w-full rounded-xl border border-white/10 bg-[#080b12] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500/50"
                />
              </div>
              <div className="max-h-72 space-y-2 overflow-y-auto">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => {
                    const isSelected = assigningPayment.assignedEmployeeId === employee.id;
                    return (
                      <button
                        key={employee.id}
                        onClick={() => assignEmployee(employee.id)}
                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                          isSelected ? "border-blue-500 bg-blue-500/10" : "border-white/10 hover:bg-white/5"
                        }`}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-sm font-semibold text-blue-300">
                          {employee.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium">{employee.name}</div>
                          <div className="mt-0.5 text-xs text-gray-500">{employee.department} · {employee.role}</div>
                        </div>
                        {isSelected && <Check size={18} className="text-blue-400" />}
                      </button>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-sm text-gray-500">No employees found.</div>
                )}
              </div>
              <button
                onClick={() => assignEmployee(null)}
                className="mt-3 w-full rounded-xl border border-white/10 py-2.5 text-sm text-gray-400 transition hover:bg-white/5"
              >
                Remove Assignment
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* DELETE */}
      {showDeleteModal && deletingPayment && (
        <ModalOverlay>
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d111a] p-5 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <Trash2 size={22} />
            </div>
            <h2 className="text-lg font-bold">Delete Payment?</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete <span className="font-medium text-gray-300">{deletingPayment.paymentNo}</span>? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => { setShowDeleteModal(false); setDeletingPayment(null); }} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm transition hover:bg-white/5">Cancel</button>
              <button onClick={deletePayment} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium transition hover:bg-red-500">Delete Payment</button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* VERIFY */}
      {showVerifyModal && selectedPayment && (
        <ModalOverlay>
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d111a] p-5 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
              <ShieldCheck size={22} />
            </div>
            <h2 className="text-lg font-bold">Verify Payment?</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Confirm that the recorded amount has been received. After verification, the payment can proceed toward billing / invoice processing.
            </p>
            <div className="mt-4 space-y-2 rounded-xl border border-white/10 bg-[#080b12] p-4">
              <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Payment</span><span>{selectedPayment.paymentNo}</span></div>
              <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Customer</span><span className="text-right">{selectedPayment.customerName}</span></div>
              <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Recorded Amount</span><span className="font-semibold text-green-300">{formatCurrency(selectedPayment.paidAmount)}</span></div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setShowVerifyModal(false)} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm transition hover:bg-white/5">Cancel</button>
              <button onClick={() => verifyPayment(selectedPayment)} className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium transition hover:bg-green-500">Verify Payment</button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}

function ModalOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      {children}
    </div>
  );
}

function ModalHeader({ title, subtitle, onClose }: { title: string; subtitle: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
      <div className="min-w-0">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
      </div>
      <button onClick={onClose} className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white" aria-label="Close">
        <X size={18} />
      </button>
    </div>
  );
}

function PaymentFormModal({
  title,
  isEditing,
  form,
  updateForm,
  onClose,
  onSave,
}: {
  title: string;
  isEditing: boolean;
  form: Payment;
  updateForm: (field: keyof Payment, value: string | number | boolean | null) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const dueAmount = calculateDue(form.totalAmount, form.paidAmount);
  const progress = form.totalAmount > 0 ? Math.min((form.paidAmount / form.totalAmount) * 100, 100) : 0;
  const canSave = Boolean(form.customerName.trim() && form.company.trim() && form.quotationNo.trim() && form.totalAmount > 0 && form.paidAmount >= 0 && form.paidAmount <= form.totalAmount);

  return (
    <ModalOverlay>
      <div className="flex w-full max-w-5xl max-h-[92vh] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d111a] shadow-2xl">
        <div className="shrink-0 border-b border-white/10 bg-[#0d111a] px-5 py-4 md:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs text-blue-400">
                {isEditing ? <Pencil size={13} /> : <Plus size={13} />}
                {isEditing ? "Payment Management" : "New Payment"}
              </div>
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="mt-1 text-xs text-gray-500">Enter payment information and keep the quotation collection workflow updated.</p>
            </div>
            <button onClick={onClose} className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white" aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 md:p-6">
          <div className="space-y-6">
            <FormSection title="Basic Information" description="Identify the payment and the customer linked to the quotation." icon={<FileText size={17} />}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Input label="Payment Number" value={form.paymentNo} onChange={(value) => updateForm("paymentNo", value)} />
                <Input label="Quotation Number" value={form.quotationNo} required onChange={(value) => updateForm("quotationNo", value)} />
                <Input label="Customer Name" value={form.customerName} required onChange={(value) => updateForm("customerName", value)} />
                <Input label="Company" value={form.company} required onChange={(value) => updateForm("company", value)} />
                <Input label="Email" type="email" value={form.email} onChange={(value) => updateForm("email", value)} />
                <Input label="Phone" type="tel" value={form.phone} onChange={(value) => updateForm("phone", value)} />
              </div>
            </FormSection>

            <FormSection title="Payment Information" description="Record the amount, method and important dates." icon={<CreditCard size={17} />}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Input label="Total Amount" required type="number" min="0" value={String(form.totalAmount)} onChange={(value) => updateForm("totalAmount", Math.max(Number(value) || 0, 0))} />
                <Input label="Paid Amount" required type="number" min="0" value={String(form.paidAmount)} onChange={(value) => updateForm("paidAmount", Math.max(Number(value) || 0, 0))} />
                <ReadOnlyField label="Due Amount" value={formatCurrency(dueAmount)} tone={dueAmount > 0 ? "orange" : "green"} />
                <SelectField label="Payment Type" value={form.paymentType} onChange={(value) => updateForm("paymentType", value as PaymentType)} options={[{value: "ADVANCE", label: "Advance"}, {value: "PARTIAL", label: "Partial"}, {value: "FULL", label: "Full Payment"}]} />
                <SelectField label="Payment Method" value={form.paymentMethod} onChange={(value) => updateForm("paymentMethod", value as PaymentMethod)} options={Object.entries(paymentMethodLabels).map(([value, label]) => ({value, label}))} />
                <Input label="Reference / UTR" value={form.referenceNo} placeholder="UTR, bank ref, cheque no..." onChange={(value) => updateForm("referenceNo", value)} />
                <Input label="Payment Date" type="date" value={form.paymentDate} onChange={(value) => updateForm("paymentDate", value)} />
                <Input label="Due Date" type="date" value={form.dueDate} onChange={(value) => updateForm("dueDate", value)} />
                <ReadOnlyField label="Current Status" value={getPaymentStatus(form.totalAmount, form.paidAmount, form.dueDate)} />
              </div>
            </FormSection>

            <FormSection title="Collection & Notes" description="Assign ownership and keep the collection context for the sales team." icon={<UserPlus size={17} />}>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <SelectField
                  label="Assigned Employee"
                  value={String(form.assignedEmployeeId ?? "")}
                  onChange={(value) => updateForm("assignedEmployeeId", value ? Number(value) : null)}
                  options={[
                    { value: "", label: "Unassigned" },
                    ...employees.map((employee) => ({ value: String(employee.id), label: `${employee.name} · ${employee.role}` })),
                  ]}
                />
                <ReadOnlyField label="Created Date" value={form.createdAt} />
              </div>
              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-medium text-gray-400">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => updateForm("notes", e.target.value)}
                  rows={5}
                  placeholder="Add collection notes, customer commitment, cheque details or follow-up context..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#080b12] px-3 py-3 text-sm outline-none transition focus:border-blue-500/50"
                />
              </div>
            </FormSection>

            <FormSection title="Payment Progress" description="Review the calculated collection position before saving." icon={<CircleDollarSign size={17} />}>
              <div className="rounded-xl border border-white/10 bg-[#080b12] p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-gray-500">Collected</span>
                  <span className="font-semibold">{Math.round(progress)}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${progress}%` }} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                  <Metric label="Total" value={formatCurrency(form.totalAmount)} />
                  <Metric label="Paid" value={formatCurrency(form.paidAmount)} />
                  <Metric label="Due" value={formatCurrency(dueAmount)} />
                </div>
              </div>
            </FormSection>

            <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-300"><ArrowRight size={16} /> Payment Workflow</div>
              <p className="mt-2 text-xs leading-5 text-gray-500">Accepted Quotation → Payment → Verification → Billing / Invoice</p>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-white/10 bg-[#0d111a] p-4 md:px-6">
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button onClick={onClose} className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium transition hover:bg-white/5">Cancel</button>
            <button
              onClick={onSave}
              disabled={!canSave}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Check size={17} />
              {isEditing ? "Save Changes" : "Save Payment"}
            </button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}

function FormSection({ title, description, icon, children }: { title: string; description: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0a0e16] p-4 md:p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">{icon}</div>
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Input({ label, value, onChange, type = "text", placeholder, required, min }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; required?: boolean; min?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-400">{label}{required && <span className="ml-1 text-blue-400">*</span>}</label>
      <input type={type} min={min} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#080b12] px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-700 focus:border-blue-500/50" />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-400">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#080b12] px-3 py-2.5 text-sm outline-none focus:border-blue-500/50">
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  );
}

function ReadOnlyField({ label, value, tone }: { label: string; value: string; tone?: "orange" | "green" }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-400">{label}</label>
      <div className={`rounded-xl border border-white/10 bg-[#080b12] px-3 py-2.5 text-sm ${tone === "orange" ? "text-orange-300" : tone === "green" ? "text-green-300" : "text-gray-300"}`}>{value || "-"}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3"><p className="text-[10px] text-gray-600">{label}</p><p className="mt-1 font-medium text-gray-300">{value}</p></div>;
}

function DetailSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-200"><span className="text-blue-400">{icon}</span>{title}</div>
      {children}
    </section>
  );
}

function StatCard({ label, value, icon: Icon, helper }: { label: string; value: string; icon: React.ElementType; helper: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d111a] p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="mt-1 text-xl font-bold">{value}</p>
          <p className="mt-1 text-[11px] text-gray-600">{helper}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400"><Icon size={20} /></div>
      </div>
    </div>
  );
}

function AmountCard({ label, value, tone = "default" }: { label: string; value: number; tone?: "default" | "green" | "orange" }) {
  const toneClass = tone === "green" ? "text-green-300" : tone === "orange" ? "text-orange-300" : "text-white";
  return (
    <div className="rounded-xl border border-white/10 bg-[#080b12] p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-1 text-xl font-bold ${toneClass}`}>{formatCurrency(value)}</p>
    </div>
  );
}

function InfoBox({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#080b12] p-3">
      <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-500">{icon}{label}</div>
      <p className="break-words text-sm text-gray-200">{value || "-"}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs ${statusConfig[status].className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${statusConfig[status].dotClassName}`} />
      {statusConfig[status].label}
    </span>
  );
}

function IconButton({ title, onClick, children, className = "" }: { title: string; onClick: () => void; children: React.ReactNode; className?: string }) {
  return <button title={title} aria-label={title} onClick={onClick} className={`rounded-lg p-2 text-gray-300 transition hover:bg-white/10 ${className}`}>{children}</button>;
}
