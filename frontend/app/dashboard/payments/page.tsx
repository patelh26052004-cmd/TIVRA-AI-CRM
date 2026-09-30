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

  paymentType: "ADVANCE" | "PARTIAL" | "FULL";
  paymentMethod: PaymentMethod;
  paymentDate: string;
  dueDate: string;

  status: PaymentStatus;
  assignedEmployeeId: number | null;

  notes: string;
  verified: boolean;
  createdAt: string;
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
  PaymentStatus,
  {
    label: string;
    className: string;
  }
> = {
  PENDING: {
    label: "Pending",
    className:
      "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  },
  PARTIAL: {
    label: "Partial",
    className:
      "bg-blue-500/10 text-blue-300 border-blue-500/20",
  },
  RECEIVED: {
    label: "Received",
    className:
      "bg-green-500/10 text-green-300 border-green-500/20",
  },
  OVERDUE: {
    label: "Overdue",
    className:
      "bg-red-500/10 text-red-300 border-red-500/20",
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
    paymentType: "ADVANCE",
    paymentMethod: "BANK_TRANSFER",
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

  return (
    employees.find((employee) => employee.id === id)?.name ||
    "Unknown"
  );
}

function getPaymentStatus(
  totalAmount: number,
  paidAmount: number,
  dueDate: string
): PaymentStatus {
  if (paidAmount >= totalAmount) {
    return "RECEIVED";
  }

  if (paidAmount > 0) {
    return "PARTIAL";
  }

  if (
    dueDate &&
    new Date(dueDate).getTime() <
      new Date().setHours(0, 0, 0, 0)
  ) {
    return "OVERDUE";
  }

  return "PENDING";
}

export default function PaymentsPage() {
  const [payments, setPayments] =
    usePersistentState<Payment[]>("tivra_payments", initialPayments);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | PaymentStatus
  >("ALL");

  const [selectedPayment, setSelectedPayment] =
    useState<Payment | null>(null);

  const [editingPayment, setEditingPayment] =
    useState<Payment | null>(null);

  const [assigningPayment, setAssigningPayment] =
    useState<Payment | null>(null);

  const [deletingPayment, setDeletingPayment] =
    useState<Payment | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] =
    useState(false);
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);
  const [showVerifyModal, setShowVerifyModal] =
    useState(false);

  const [employeeSearch, setEmployeeSearch] =
    useState("");

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
    paymentDate: "",
    dueDate: "",
    status: "PENDING",
    assignedEmployeeId: null,
    notes: "",
    verified: false,
    createdAt: new Date()
      .toISOString()
      .slice(0, 10),
  });

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const query = search.toLowerCase();

      const matchesSearch =
        payment.paymentNo
          .toLowerCase()
          .includes(query) ||
        payment.quotationNo
          .toLowerCase()
          .includes(query) ||
        payment.customerName
          .toLowerCase()
          .includes(query) ||
        payment.company
          .toLowerCase()
          .includes(query) ||
        employeeName(payment.assignedEmployeeId)
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        payment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

  const stats = useMemo(() => {
    const totalValue = payments.reduce(
      (sum, payment) => sum + payment.totalAmount,
      0
    );

    const received = payments.reduce(
      (sum, payment) => sum + payment.paidAmount,
      0
    );

    const pending = payments.reduce(
      (sum, payment) => sum + payment.dueAmount,
      0
    );

    const overdue = payments
      .filter((payment) => payment.status === "OVERDUE")
      .reduce(
        (sum, payment) => sum + payment.dueAmount,
        0
      );

    return {
      totalValue,
      received,
      pending,
      overdue,
    };
  }, [payments]);

  const filteredEmployees = employees.filter(
    (employee) => {
      const query = employeeSearch.toLowerCase();

      return (
        employee.name.toLowerCase().includes(query) ||
        employee.department
          .toLowerCase()
          .includes(query) ||
        employee.role.toLowerCase().includes(query)
      );
    }
  );

  function openAddModal() {
    setForm({
      id: 0,
      paymentNo: `PAY-2026-${String(
        payments.length + 1
      ).padStart(3, "0")}`,
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
      paymentDate: "",
      dueDate: "",
      status: "PENDING",
      assignedEmployeeId: null,
      notes: "",
      verified: false,
      createdAt: new Date()
        .toISOString()
        .slice(0, 10),
    });

    setShowAddModal(true);
  }

  function openEditModal(payment: Payment) {
    setForm({
      ...payment,
    });

    setEditingPayment(payment);
  }

  function calculateDue(
    total: number,
    paid: number
  ) {
    return Math.max(total - paid, 0);
  }

  function savePayment() {
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

    if (form.totalAmount <= 0) {
      alert("Please enter a valid total amount.");
      return;
    }

    if (form.paidAmount < 0) {
      alert("Paid amount cannot be negative.");
      return;
    }

    if (form.paidAmount > form.totalAmount) {
      alert("Paid amount cannot exceed total amount.");
      return;
    }

    const dueAmount = calculateDue(
      form.totalAmount,
      form.paidAmount
    );

    const status = getPaymentStatus(
      form.totalAmount,
      form.paidAmount,
      form.dueDate
    );

    const updatedPayment: Payment = {
      ...form,
      dueAmount,
      status,
    };

    if (editingPayment) {
      setPayments((current) =>
        current.map((payment) =>
          payment.id === editingPayment.id
            ? updatedPayment
            : payment
        )
      );

      setEditingPayment(null);
    } else {
      setPayments((current) => [
        {
          ...updatedPayment,
          id: Date.now(),
        },
        ...current,
      ]);

      setShowAddModal(false);
    }
  }

  function deletePayment() {
    if (!deletingPayment) return;

    setPayments((current) =>
      current.filter(
        (payment) =>
          payment.id !== deletingPayment.id
      )
    );

    if (
      selectedPayment?.id === deletingPayment.id
    ) {
      setSelectedPayment(null);
    }

    setDeletingPayment(null);
    setShowDeleteModal(false);
  }

  function markAsReceived(payment: Payment) {
    const updated: Payment = {
      ...payment,
      paidAmount: payment.totalAmount,
      dueAmount: 0,
      status: "RECEIVED",
      paymentDate:
        payment.paymentDate ||
        new Date().toISOString().slice(0, 10),
    };

    setPayments((current) =>
      current.map((item) =>
        item.id === payment.id
          ? updated
          : item
      )
    );

    setSelectedPayment(updated);
  }

  function verifyPayment(payment: Payment) {
    const updated: Payment = {
      ...payment,
      verified: true,
    };

    setPayments((current) =>
      current.map((item) =>
        item.id === payment.id
          ? updated
          : item
      )
    );

    setSelectedPayment(updated);
    setShowVerifyModal(false);
  }

  function assignEmployee(employeeId: number | null) {
    if (!assigningPayment) return;

    const updated: Payment = {
      ...assigningPayment,
      assignedEmployeeId: employeeId,
    };

    setPayments((current) =>
      current.map((payment) =>
        payment.id === assigningPayment.id
          ? updated
          : payment
      )
    );

    setSelectedPayment((current) =>
      current &&
      current.id === assigningPayment.id
        ? updated
        : current
    );

    setAssigningPayment(null);
    setShowAssignModal(false);
  }

  function openAssignModal(payment: Payment) {
    setAssigningPayment(payment);
    setEmployeeSearch("");
    setShowAssignModal(true);
  }

  function updateForm(
    field: keyof Payment,
    value: string | number | boolean | null
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <div className="min-h-screen bg-[#080b12] text-white p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-sm mb-1">
            <CreditCard size={16} />
            Sales / Payments
          </div>

          <h1 className="text-2xl md:text-3xl font-bold">
            Payments
          </h1>

          <p className="text-gray-400 text-sm mt-1">
            Track quotation payments, verify receipts and
            monitor outstanding amounts.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-xl text-sm font-medium"
        >
          <Plus size={18} />
          Add Payment
        </button>
      </div>

      {/* Workflow */}
      <div className="bg-[#0d111a] border border-white/10 rounded-2xl p-4 mb-6 overflow-x-auto">
        <div className="flex items-center min-w-[720px]">
          {[
            "Quotation Accepted",
            "Payment",
            "Verification",
            "Billing",
          ].map((step, index, array) => (
            <div
              key={step}
              className="flex items-center flex-1"
            >
              <div className="flex flex-col items-center min-w-[140px]">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border ${
                    index === 1
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

              {index < array.length - 1 && (
                <div className="h-px bg-white/10 flex-1 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Payment Value"
          value={formatCurrency(stats.totalValue)}
          icon={Wallet}
        />

        <StatCard
          label="Received"
          value={formatCurrency(stats.received)}
          icon={CheckCircle2}
        />

        <StatCard
          label="Pending"
          value={formatCurrency(stats.pending)}
          icon={Clock3}
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
              placeholder="Search payment, quotation, customer, company..."
              className="w-full bg-[#080b12] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500/50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as
                  | "ALL"
                  | PaymentStatus
              )
            }
            className="bg-[#080b12] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none"
          >
            <option value="ALL">
              All Status
            </option>
            <option value="PENDING">
              Pending
            </option>
            <option value="PARTIAL">
              Partial
            </option>
            <option value="RECEIVED">
              Received
            </option>
            <option value="OVERDUE">
              Overdue
            </option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0d111a] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs text-gray-500">
                <th className="px-5 py-4">
                  Payment
                </th>

                <th className="px-5 py-4">
                  Customer
                </th>

                <th className="px-5 py-4">
                  Quotation
                </th>

                <th className="px-5 py-4">
                  Amount
                </th>

                <th className="px-5 py-4">
                  Due
                </th>

                <th className="px-5 py-4">
                  Method
                </th>

                <th className="px-5 py-4">
                  Assigned
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
              {filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-white/5 hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-4">
                    <div className="font-medium">
                      {payment.paymentNo}
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      {payment.paymentDate ||
                        "Payment not received"}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-medium">
                      {payment.customerName}
                    </div>

                    <div className="text-xs text-gray-500">
                      {payment.company}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-sm text-blue-300">
                      {payment.quotationNo}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-semibold">
                      {formatCurrency(
                        payment.paidAmount
                      )}
                    </div>

                    <div className="text-xs text-gray-500">
                      of{" "}
                      {formatCurrency(
                        payment.totalAmount
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={
                        payment.dueAmount > 0
                          ? "text-orange-300"
                          : "text-green-300"
                      }
                    >
                      {formatCurrency(
                        payment.dueAmount
                      )}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-400">
                    {
                      paymentMethodLabels[
                        payment.paymentMethod
                      ]
                    }
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {employeeName(
                      payment.assignedEmployeeId
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-lg border text-xs ${statusConfig[payment.status].className}`}
                      >
                        {
                          statusConfig[payment.status]
                            .label
                        }
                      </span>

                      {payment.verified && (
                        <span
                          title="Payment verified"
                          className="text-green-400"
                        >
                          <CheckCircle2 size={15} />
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        title="View"
                        onClick={() =>
                          setSelectedPayment(payment)
                        }
                        className="p-2 rounded-lg hover:bg-white/10 text-gray-300"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        title="Edit"
                        onClick={() =>
                          openEditModal(payment)
                        }
                        className="p-2 rounded-lg hover:bg-white/10 text-blue-400"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        title="Assign Employee"
                        onClick={() =>
                          openAssignModal(payment)
                        }
                        className="p-2 rounded-lg hover:bg-white/10 text-green-400"
                      >
                        <UserPlus size={16} />
                      </button>

                      <button
                        title="Delete"
                        onClick={() => {
                          setDeletingPayment(payment);
                          setShowDeleteModal(true);
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

          {filteredPayments.length === 0 && (
            <div className="py-16 text-center text-gray-500">
              No payments found.
            </div>
          )}
        </div>
      </div>

      {/* View Payment */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0d111a] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {selectedPayment.paymentNo}
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Linked quotation:{" "}
                  {selectedPayment.quotationNo}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedPayment(null)
                }
                className="p-2 rounded-lg hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Customer */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoBox
                  label="Customer"
                  value={
                    selectedPayment.customerName
                  }
                />

                <InfoBox
                  label="Company"
                  value={selectedPayment.company}
                />

                <InfoBox
                  label="Quotation"
                  value={
                    selectedPayment.quotationNo
                  }
                />

                <InfoBox
                  label="Email"
                  value={selectedPayment.email}
                />

                <InfoBox
                  label="Phone"
                  value={selectedPayment.phone}
                />

                <InfoBox
                  label="Assigned Employee"
                  value={employeeName(
                    selectedPayment.assignedEmployeeId
                  )}
                />
              </div>

              {/* Payment Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AmountCard
                  label="Total Amount"
                  value={selectedPayment.totalAmount}
                />

                <AmountCard
                  label="Paid Amount"
                  value={selectedPayment.paidAmount}
                />

                <AmountCard
                  label="Due Amount"
                  value={selectedPayment.dueAmount}
                />
              </div>

              {/* Progress */}
              <div className="bg-[#080b12] border border-white/10 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">
                    Payment Progress
                  </span>

                  <span className="font-medium">
                    {selectedPayment.totalAmount > 0
                      ? Math.round(
                          (selectedPayment.paidAmount /
                            selectedPayment.totalAmount) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>

                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${
                        selectedPayment.totalAmount > 0
                          ? Math.min(
                              (selectedPayment.paidAmount /
                                selectedPayment.totalAmount) *
                                100,
                              100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoBox
                  label="Payment Type"
                  value={selectedPayment.paymentType}
                />

                <InfoBox
                  label="Payment Method"
                  value={
                    paymentMethodLabels[
                      selectedPayment.paymentMethod
                    ]
                  }
                />

                <InfoBox
                  label="Payment Date"
                  value={
                    selectedPayment.paymentDate ||
                    "Not received"
                  }
                />

                <InfoBox
                  label="Due Date"
                  value={
                    selectedPayment.dueDate ||
                    "-"
                  }
                />
              </div>

              {/* Verification */}
              <div className="bg-[#080b12] border border-white/10 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">
                      Payment Verification
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      Payment must be verified before the
                      billing step.
                    </p>
                  </div>

                  {selectedPayment.verified ? (
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <CheckCircle2 size={18} />
                      Verified
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        setShowVerifyModal(true)
                      }
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm"
                    >
                      <Check size={16} />
                      Verify Payment
                    </button>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-[#080b12] border border-white/10 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-2">
                  Notes
                </p>

                <p className="text-sm text-gray-300">
                  {selectedPayment.notes || "No notes."}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 border-t border-white/10 pt-5">
                <button
                  onClick={() =>
                    openEditModal(selectedPayment)
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm"
                >
                  <Pencil size={16} />
                  Edit
                </button>

                <button
                  onClick={() =>
                    openAssignModal(selectedPayment)
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600/20 text-green-300 hover:bg-green-600/30 text-sm"
                >
                  <UserPlus size={16} />
                  Assign Employee
                </button>

                {selectedPayment.status !==
                  "RECEIVED" && (
                  <button
                    onClick={() =>
                      markAsReceived(selectedPayment)
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm"
                  >
                    <CheckCircle2 size={16} />
                    Mark as Received
                  </button>
                )}

                <button
                  onClick={() => {
                    setDeletingPayment(
                      selectedPayment
                    );
                    setShowDeleteModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20 text-sm"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>

              {/* Workflow */}
              <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-blue-300">
                  <span>Quotation</span>
                  <ArrowRight size={15} />
                  <span>Payment</span>
                  <ArrowRight size={15} />
                  <span>Verification</span>
                  <ArrowRight size={15} />
                  <span>Billing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingPayment) && (
        <PaymentFormModal
          title={
            editingPayment
              ? "Edit Payment"
              : "Add Payment"
          }
          form={form}
          updateForm={updateForm}
          onClose={() => {
            setShowAddModal(false);
            setEditingPayment(null);
          }}
          onSave={savePayment}
        />
      )}

      {/* Assign Employee */}
      {showAssignModal && assigningPayment && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0d111a] border border-white/10 rounded-2xl w-full max-w-lg">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  Assign Employee
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  {assigningPayment.paymentNo}
                </p>
              </div>

              <button
                onClick={() =>
                  setShowAssignModal(false)
                }
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
                      assigningPayment.assignedEmployeeId ===
                      employee.id;

                    return (
                      <button
                        key={employee.id}
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
                              (part) =>
                                part[0]
                            )
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {employee.name}
                          </div>

                          <div className="text-xs text-gray-500">
                            {
                              employee.department
                            }{" "}
                            · {employee.role}
                          </div>
                        </div>

                        {selected && (
                          <Check
                            size={18}
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

      {/* Delete */}
      {showDeleteModal && deletingPayment && (
        <div className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0d111a] border border-white/10 rounded-2xl w-full max-w-md p-5">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-4">
              <Trash2 size={22} />
            </div>

            <h2 className="text-lg font-bold">
              Delete Payment?
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete{" "}
              <span className="text-gray-300">
                {deletingPayment.paymentNo}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingPayment(null);
                }}
                className="px-4 py-2 rounded-lg border border-white/10 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={deletePayment}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verify */}
      {showVerifyModal && selectedPayment && (
        <div className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0d111a] border border-white/10 rounded-2xl w-full max-w-md p-5">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center mb-4">
              <CheckCircle2 size={22} />
            </div>

            <h2 className="text-lg font-bold">
              Verify Payment?
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Once verified, this payment can move to
              the Billing / Invoice workflow.
            </p>

            <div className="bg-[#080b12] border border-white/10 rounded-xl p-4 mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Payment
                </span>

                <span>
                  {selectedPayment.paymentNo}
                </span>
              </div>

              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">
                  Amount
                </span>

                <span className="font-semibold">
                  {formatCurrency(
                    selectedPayment.paidAmount
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() =>
                  setShowVerifyModal(false)
                }
                className="px-4 py-2 rounded-lg border border-white/10 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  verifyPayment(selectedPayment)
                }
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-sm"
              >
                Verify Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------
   Components
------------------------------------------------------- */

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

        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function AmountCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-[#080b12] border border-white/10 rounded-xl p-4">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="text-xl font-bold mt-1">
        {formatCurrency(value)}
      </p>
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

function PaymentFormModal({
  title,
  form,
  updateForm,
  onClose,
  onSave,
}: {
  title: string;
  form: Payment;
  updateForm: (
    field: keyof Payment,
    value: string | number | boolean | null
  ) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const dueAmount = Math.max(
    form.totalAmount - form.paidAmount,
    0
  );

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-[#0d111a] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-[#0d111a] p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {title}
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Payment and quotation details
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
          <div>
            <h3 className="font-semibold mb-3">
              Payment Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Payment Number"
                value={form.paymentNo}
                onChange={(value) =>
                  updateForm(
                    "paymentNo",
                    value
                  )
                }
              />

              <Input
                label="Quotation Number"
                value={form.quotationNo}
                onChange={(value) =>
                  updateForm(
                    "quotationNo",
                    value
                  )
                }
              />

              <Input
                label="Customer Name"
                value={form.customerName}
                onChange={(value) =>
                  updateForm(
                    "customerName",
                    value
                  )
                }
              />

              <Input
                label="Company"
                value={form.company}
                onChange={(value) =>
                  updateForm(
                    "company",
                    value
                  )
                }
              />

              <Input
                label="Email"
                value={form.email}
                onChange={(value) =>
                  updateForm(
                    "email",
                    value
                  )
                }
              />

              <Input
                label="Phone"
                value={form.phone}
                onChange={(value) =>
                  updateForm(
                    "phone",
                    value
                  )
                }
              />

              <Input
                label="Total Amount"
                type="number"
                value={String(
                  form.totalAmount
                )}
                onChange={(value) =>
                  updateForm(
                    "totalAmount",
                    Number(value) || 0
                  )
                }
              />

              <Input
                label="Paid Amount"
                type="number"
                value={String(
                  form.paidAmount
                )}
                onChange={(value) =>
                  updateForm(
                    "paidAmount",
                    Number(value) || 0
                  )
                }
              />

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Due Amount
                </label>

                <div className="bg-[#080b12] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-orange-300">
                  {formatCurrency(dueAmount)}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Payment Type
                </label>

                <select
                  value={form.paymentType}
                  onChange={(e) =>
                    updateForm(
                      "paymentType",
                      e.target.value
                    )
                  }
                  className="w-full bg-[#080b12] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none"
                >
                  <option value="ADVANCE">
                    Advance
                  </option>

                  <option value="PARTIAL">
                    Partial
                  </option>

                  <option value="FULL">
                    Full Payment
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Payment Method
                </label>

                <select
                  value={form.paymentMethod}
                  onChange={(e) =>
                    updateForm(
                      "paymentMethod",
                      e.target.value
                    )
                  }
                  className="w-full bg-[#080b12] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none"
                >
                  <option value="BANK_TRANSFER">
                    Bank Transfer
                  </option>

                  <option value="UPI">
                    UPI
                  </option>

                  <option value="CASH">
                    Cash
                  </option>

                  <option value="CHEQUE">
                    Cheque
                  </option>

                  <option value="CARD">
                    Card
                  </option>

                  <option value="OTHER">
                    Other
                  </option>
                </select>
              </div>

              <Input
                label="Payment Date"
                type="date"
                value={form.paymentDate}
                onChange={(value) =>
                  updateForm(
                    "paymentDate",
                    value
                  )
                }
              />

              <Input
                label="Due Date"
                type="date"
                value={form.dueDate}
                onChange={(value) =>
                  updateForm(
                    "dueDate",
                    value
                  )
                }
              />
            </div>
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
              placeholder="Payment notes..."
              className="w-full bg-[#080b12] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
            />
          </div>

          <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-300 text-sm">
              <CreditCard size={17} />
              Payment Workflow
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Accepted Quotation → Payment → Verification →
              Billing / Invoice
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
              Save Payment
            </button>
          </div>
        </div>
      </div>
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