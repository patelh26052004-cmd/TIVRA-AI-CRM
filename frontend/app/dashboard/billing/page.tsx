"use client";

import { useMemo, useState, type ChangeEvent, type ReactNode } from "react";
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
  RotateCcw,
  Copy,
  Printer,
  Download,
  Palette,
  type LucideIcon,
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
  signatureDataUrl: string;
};

const employees: Employee[] = [
  { id: 1, name: "Riya Shah", department: "Sales", role: "Sales Manager" },
  { id: 2, name: "Saloni Mehta", department: "Sales", role: "Sales Executive" },
  { id: 3, name: "Hetvi Shah", department: "Sales", role: "Sales + Project" },
  { id: 4, name: "Dev Patel", department: "Development", role: "Developer" },
  { id: 5, name: "Kashis Patel", department: "Marketing", role: "Digital Marketing" },
  { id: 6, name: "Hinal Patel", department: "Marketing", role: "Digital Marketing" },
];

const statusConfig: Record<InvoiceStatus, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "bg-gray-500/10 text-gray-300 border-gray-500/20" },
  SENT: { label: "Sent", className: "bg-blue-500/10 text-blue-300 border-blue-500/20" },
  PARTIAL: { label: "Partial", className: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20" },
  PAID: { label: "Paid", className: "bg-green-500/10 text-green-300 border-green-500/20" },
  OVERDUE: { label: "Overdue", className: "bg-red-500/10 text-red-300 border-red-500/20" },
  CANCELLED: { label: "Cancelled", className: "bg-red-500/10 text-red-300 border-red-500/20" },
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
      { id: 1, description: "Healthcare Website Development", quantity: 1, rate: 95000, amount: 95000 },
      { id: 2, description: "Hosting & Deployment", quantity: 1, rate: 10000, amount: 10000 },
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
    signatureDataUrl: "",
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
      { id: 1, description: "Inventory Management Software", quantity: 1, rate: 97000, amount: 97000 },
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
    signatureDataUrl: "",
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
      { id: 1, description: "Business CRM Website", quantity: 1, rate: 105000, amount: 105000 },
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
    signatureDataUrl: "",
  },
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function formatCurrency(value: number) {
  return `₹${Math.max(value, 0).toLocaleString("en-IN")}`;
}

function employeeName(id: number | null) {
  if (!id) return "Unassigned";
  return employees.find((employee) => employee.id === id)?.name || "Unknown";
}

function getNextInvoiceNumber(invoices: Invoice[]) {
  const max = invoices.reduce((acc, item) => {
    const match = item.invoiceNo.match(/(\d+)$/);
    const number = match ? Number(match[1]) : 0;
    return Math.max(acc, number);
  }, 0);
  return `INV-2026-${String(max + 1).padStart(3, "0")}`;
}

function calculateInvoice(invoice: Invoice) {
  const items = invoice.items.map((item) => ({
    ...item,
    quantity: Math.max(Number(item.quantity) || 0, 0),
    rate: Math.max(Number(item.rate) || 0, 0),
    amount: Math.max(Number(item.quantity) || 0, 0) * Math.max(Number(item.rate) || 0, 0),
  }));

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const discount = Math.min(Math.max(Number(invoice.discount) || 0, 0), subtotal);
  const afterDiscount = Math.max(subtotal - discount, 0);
  const gstRate = Math.max(Number(invoice.gstRate) || 0, 0);
  const gstAmount = (afterDiscount * gstRate) / 100;
  const grandTotal = afterDiscount + gstAmount;
  const paidAmount = Math.min(Math.max(Number(invoice.paidAmount) || 0, 0), grandTotal);
  const dueAmount = Math.max(grandTotal - paidAmount, 0);

  return {
    ...invoice,
    items,
    subtotal,
    discount,
    gstRate,
    gstAmount,
    grandTotal,
    paidAmount,
    dueAmount,
  };
}

function getInvoiceStatus(invoice: Invoice): InvoiceStatus {
  if (invoice.status === "CANCELLED") return "CANCELLED";
  if (invoice.grandTotal > 0 && invoice.paidAmount >= invoice.grandTotal) return "PAID";
  if (invoice.paidAmount > 0) return "PARTIAL";
  if (invoice.dueDate && invoice.dueDate < today() && invoice.status !== "DRAFT") return "OVERDUE";
  return invoice.status === "DRAFT" ? "DRAFT" : "SENT";
}


type InvoiceTheme =
  | "professional"
  | "premium"
  | "minimal"
  | "modern"
  | "classic";

type InvoiceThemeConfig = {
  name: string;
  description: string;
  primary: string;
  secondary: string;
  soft: string;
  border: string;
  text: string;
  muted: string;
  total: string;
};

const BRANDING = {
  logoText: "TIVRA",
  logoMark: "T",
  headline: "AI Business & CRM Solutions",
  color: "#f97316",
  neutralText: "#0f172a",
  mutedText: "#64748b",
};

const invoiceThemes: Record<InvoiceTheme, InvoiceThemeConfig> = {
  professional: {
    name: "Professional Blue",
    description: "Clean corporate layout",
    primary: "#1d4ed8",
    secondary: "#0f172a",
    soft: "#eff6ff",
    border: "#bfdbfe",
    text: "#0f172a",
    muted: "#64748b",
    total: "#1e40af",
  },
  premium: {
    name: "Premium Dark",
    description: "Dark luxury business style",
    primary: "#f97316",
    secondary: "#111827",
    soft: "#1f2937",
    border: "#374151",
    text: "#f9fafb",
    muted: "#9ca3af",
    total: "#fb923c",
  },
  minimal: {
    name: "Minimal White",
    description: "Simple print-friendly design",
    primary: "#334155",
    secondary: "#0f172a",
    soft: "#f8fafc",
    border: "#cbd5e1",
    text: "#0f172a",
    muted: "#64748b",
    total: "#0f172a",
  },
  modern: {
    name: "Modern Orange",
    description: "Bold modern business look",
    primary: "#ea580c",
    secondary: "#7c2d12",
    soft: "#fff7ed",
    border: "#fdba74",
    text: "#431407",
    muted: "#9a3412",
    total: "#c2410c",
  },
  classic: {
    name: "Classic GST",
    description: "Traditional formal invoice",
    primary: "#0f766e",
    secondary: "#134e4a",
    soft: "#f0fdfa",
    border: "#99f6e4",
    text: "#134e4a",
    muted: "#64748b",
    total: "#0f766e",
  },
};

function createEmptyInvoice(invoiceNo: string): Invoice {
  return {
    id: 0,
    invoiceNo,
    quotationNo: "",
    paymentNo: "",
    customerName: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    items: [
      { id: Date.now(), description: "", quantity: 1, rate: 0, amount: 0 },
    ],
    subtotal: 0,
    discount: 0,
    gstRate: 18,
    gstAmount: 0,
    grandTotal: 0,
    paidAmount: 0,
    dueAmount: 0,
    invoiceDate: today(),
    dueDate: "",
    status: "DRAFT",
    assignedEmployeeId: null,
    paymentVerified: false,
    notes: "",
    signatureDataUrl: "",
  };
}

export default function BillingPage() {
  const [invoices, setInvoices] = usePersistentState<Invoice[]>("tivra_invoices", initialInvoices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | InvoiceStatus>("ALL");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [assigningInvoice, setAssigningInvoice] = useState<Invoice | null>(null);
  const [deletingInvoice, setDeletingInvoice] = useState<Invoice | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [invoiceToPrint, setInvoiceToPrint] = useState<Invoice | null>(null);
  const [invoiceTheme, setInvoiceTheme] = useState<InvoiceTheme>("professional");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [form, setForm] = useState<Invoice>(createEmptyInvoice(getNextInvoiceNumber(initialInvoices)));

  const filteredInvoices = useMemo(() => {
    const q = search.trim().toLowerCase();
    return invoices.filter((invoice) => {
      const matchesSearch =
        !q ||
        invoice.invoiceNo.toLowerCase().includes(q) ||
        invoice.quotationNo.toLowerCase().includes(q) ||
        invoice.paymentNo.toLowerCase().includes(q) ||
        invoice.customerName.toLowerCase().includes(q) ||
        invoice.company.toLowerCase().includes(q) ||
        invoice.email.toLowerCase().includes(q) ||
        invoice.phone.toLowerCase().includes(q) ||
        employeeName(invoice.assignedEmployeeId).toLowerCase().includes(q);
      const matchesStatus = statusFilter === "ALL" || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, search, statusFilter]);

  const stats = useMemo(() => {
    const total = invoices.reduce((sum, invoice) => sum + invoice.grandTotal, 0);
    const paid = invoices.reduce((sum, invoice) => sum + invoice.paidAmount, 0);
    const due = invoices.reduce((sum, invoice) => sum + invoice.dueAmount, 0);
    const overdue = invoices
      .filter((invoice) => invoice.status === "OVERDUE")
      .reduce((sum, invoice) => sum + invoice.dueAmount, 0);
    return { total, paid, due, overdue };
  }, [invoices]);

  const filteredEmployees = employees.filter((employee) => {
    const q = employeeSearch.trim().toLowerCase();
    return (
      !q ||
      employee.name.toLowerCase().includes(q) ||
      employee.department.toLowerCase().includes(q) ||
      employee.role.toLowerCase().includes(q)
    );
  });

  function updateForm(field: keyof Invoice, value: unknown) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openAdd() {
    setForm(createEmptyInvoice(getNextInvoiceNumber(invoices)));
    setEditingInvoice(null);
    setShowAdd(true);
  }

  function openEdit(invoice: Invoice) {
    setForm({
      ...invoice,
      items: invoice.items.map((item) => ({ ...item })),
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
    if (!form.invoiceDate) {
      alert("Please select invoice date.");
      return;
    }
    if (form.dueDate && form.dueDate < form.invoiceDate) {
      alert("Due date cannot be before invoice date.");
      return;
    }
    if (form.items.length === 0) {
      alert("Please add at least one invoice item.");
      return;
    }
    if (form.items.some((item) => !item.description.trim())) {
      alert("Please enter description for every invoice item.");
      return;
    }
    if (form.items.some((item) => item.quantity <= 0)) {
      alert("Item quantity must be greater than 0.");
      return;
    }
    if (form.items.some((item) => item.rate < 0)) {
      alert("Item rate cannot be negative.");
      return;
    }

    const duplicate = invoices.some(
      (invoice) =>
        invoice.invoiceNo.trim().toLowerCase() === form.invoiceNo.trim().toLowerCase() &&
        invoice.id !== form.id
    );
    if (duplicate) {
      alert("Invoice number already exists. Please use a unique invoice number.");
      return;
    }

    const calculated = calculateInvoice(form);
    const updated = { ...calculated, status: getInvoiceStatus(calculated) };

    if (editingInvoice) {
      setInvoices((current) =>
        current.map((invoice) => (invoice.id === editingInvoice.id ? updated : invoice))
      );
      setSelectedInvoice(updated);
      setEditingInvoice(null);
    } else {
      const newInvoice = { ...updated, id: Date.now() };
      setInvoices((current) => [newInvoice, ...current]);
      setShowAdd(false);
      setSelectedInvoice(newInvoice);
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

  function updateItem(itemId: number, field: keyof InvoiceItem, value: unknown) {
    setForm((current) => ({
      ...current,
      items: current.items.map((item) => {
        if (item.id !== itemId) return item;
        const updated = { ...item, [field]: value } as InvoiceItem;
        const quantity = Math.max(Number(updated.quantity) || 0, 0);
        const rate = Math.max(Number(updated.rate) || 0, 0);
        return {
          ...updated,
          quantity,
          rate,
          amount: quantity * rate,
        };
      }),
    }));
  }

  function removeItem(itemId: number) {
    if (form.items.length <= 1) {
      alert("At least one invoice item is required.");
      return;
    }
    setForm((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== itemId),
    }));
  }

  function deleteInvoice() {
    if (!deletingInvoice) return;

    setInvoices((current) => current.filter((invoice) => invoice.id !== deletingInvoice.id));
    setSelectedInvoice((current) =>
      current?.id === deletingInvoice.id ? null : current
    );
    setDeletingInvoice(null);
    setShowDelete(false);
  }

  function markAsSent(invoice: Invoice) {
    if (invoice.status === "CANCELLED") return;
    const updated = { ...invoice, status: "SENT" as InvoiceStatus };
    setInvoices((current) => current.map((item) => item.id === invoice.id ? updated : item));
    setSelectedInvoice(updated);
  }

  function markAsPaid(invoice: Invoice) {
    if (!invoice.paymentVerified) {
      alert("Payment must be verified before marking the invoice as paid.");
      return;
    }
    const updated = {
      ...invoice,
      paidAmount: invoice.grandTotal,
      dueAmount: 0,
      status: "PAID" as InvoiceStatus,
    };
    setInvoices((current) => current.map((item) => item.id === invoice.id ? updated : item));
    setSelectedInvoice(updated);
  }

  function assignEmployee(employeeId: number | null) {
    if (!assigningInvoice) return;
    const updated = { ...assigningInvoice, assignedEmployeeId: employeeId };
    setInvoices((current) => current.map((invoice) => invoice.id === assigningInvoice.id ? updated : invoice));
    setSelectedInvoice(updated);
    setAssigningInvoice(null);
    setShowAssign(false);
  }

  function cancelInvoice(invoice: Invoice) {
    const updated = { ...invoice, status: "CANCELLED" as InvoiceStatus };
    setInvoices((current) => current.map((item) => item.id === invoice.id ? updated : item));
    setSelectedInvoice(updated);
  }

  function duplicateInvoice(invoice: Invoice) {
    const copy = {
      ...invoice,
      id: Date.now(),
      invoiceNo: getNextInvoiceNumber(invoices),
      status: "DRAFT" as InvoiceStatus,
      paidAmount: 0,
      dueAmount: invoice.grandTotal,
      paymentNo: "",
      paymentVerified: false,
      items: invoice.items.map((item) => ({ ...item, id: Date.now() + item.id })),
    };
    setInvoices((current) => [copy, ...current]);
    setSelectedInvoice(copy);
  }

  function openInvoicePreview(invoice: Invoice) {
    setInvoiceToPrint(invoice);
    setShowInvoicePreview(true);
    setInvoiceTheme("professional");
  }

  function printInvoice() {
    if (!invoiceToPrint) return;

    // Use a dedicated, fixed-size A4 print document instead of cloning the
    // responsive preview. Cloning computed desktop styles was causing the
    // right side of the invoice to overflow/clamp during printing.
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.title = `${invoiceToPrint.invoiceNo} - TIVRA Invoice`;
    iframe.style.position = "fixed";
    iframe.style.left = "-10000px";
    iframe.style.top = "0";
    iframe.style.width = "210mm";
    iframe.style.height = "297mm";
    iframe.style.border = "0";
    iframe.style.opacity = "0.01";
    iframe.style.pointerEvents = "none";
    iframe.style.zIndex = "-1";

    document.body.appendChild(iframe);

    const printDocument = iframe.contentDocument;
    const printWindow = iframe.contentWindow;

    if (!printDocument || !printWindow) {
      iframe.remove();
      window.alert("Unable to prepare the invoice for printing. Please try again.");
      return;
    }

    const config = invoiceThemes[invoiceTheme];
    const invoice = invoiceToPrint;
    const isDark = invoiceTheme === "premium";
    const paper = isDark ? "#111827" : "#ffffff";
    const panel = isDark ? "#182033" : config.soft;
    const ink = isDark ? "#f9fafb" : config.text;
    const muted = isDark ? "#9ca3af" : config.muted;
    const border = isDark ? "#374151" : config.border;
    const primary = config.primary;
    const brand = BRANDING.color;

    const escapeHtml = (value: unknown) =>
      String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

    const itemsHtml = invoice.items
      .map(
        (item) => `
          <tr>
            <td>${escapeHtml(item.description || "Item")}</td>
            <td class="center">${escapeHtml(item.quantity)}</td>
            <td class="right">${formatCurrency(item.rate)}</td>
            <td class="right strong">${formatCurrency(item.amount)}</td>
          </tr>
        `
      )
      .join("");

    const status = getInvoiceStatus(invoice);
    const statusText =
      status === "PAID"
        ? "PAID"
        : status === "PARTIAL"
        ? "PARTIAL PAYMENT"
        : status === "OVERDUE"
        ? "OVERDUE"
        : status === "CANCELLED"
        ? "CANCELLED"
        : "INVOICE";

    printDocument.open();
    printDocument.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${escapeHtml(invoice.invoiceNo)} - TIVRA Invoice</title>
          <style>
            * { box-sizing: border-box; }

            @page {
              size: A4 portrait;
              margin: 0;
            }

            html, body {
              width: 210mm;
              height: 297mm;
              margin: 0;
              padding: 0;
              background: #e5e7eb;
              overflow: hidden;
            }

            body {
              font-family: Arial, Helvetica, sans-serif;
              color: ${ink};
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .page {
              width: 190mm;
              height: 277mm;
              margin: 10mm auto;
              padding: 8mm;
              overflow: hidden;
              background: ${paper};
              color: ${ink};
            }

            .header {
              height: 31mm;
              border-radius: 4mm;
              background: ${panel};
              border-bottom: 1.1mm solid ${primary};
              padding: 5mm;
              display: flex;
              justify-content: space-between;
              gap: 6mm;
            }

            .brand { min-width: 0; }
            .brand-row {
              display: flex;
              align-items: center;
              gap: 3mm;
            }
            .mark {
              width: 14mm;
              height: 14mm;
              border-radius: 3mm;
              background: ${brand};
              color: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 11pt;
              font-weight: 800;
            }
            .brand-name {
              font-size: 16pt;
              line-height: 1;
              font-weight: 800;
              letter-spacing: -0.3pt;
            }
            .headline {
              margin-top: 1.5mm;
              max-width: 74mm;
              color: ${BRANDING.mutedText};
              font-size: 7pt;
              line-height: 1.25;
            }

            .invoice-meta {
              min-width: 63mm;
              text-align: right;
            }
            .invoice-label {
              color: ${brand};
              font-size: 7pt;
              font-weight: 800;
              letter-spacing: 1.5pt;
            }
            .invoice-number {
              margin-top: 1.5mm;
              font-size: 15pt;
              font-weight: 800;
              white-space: nowrap;
            }
            .meta-line {
              margin-top: 1mm;
              color: ${muted};
              font-size: 6.8pt;
            }

            .grid2 {
              margin-top: 5mm;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 4mm;
            }

            .box {
              border: 0.35mm solid ${border};
              border-radius: 3mm;
              padding: 4mm;
              min-width: 0;
              background: ${isDark ? "#182033" : "#fff"};
            }

            .box-title {
              color: ${muted};
              font-size: 6.5pt;
              font-weight: 800;
              letter-spacing: 1pt;
              text-transform: uppercase;
              margin-bottom: 2mm;
            }
            .customer {
              font-size: 8.5pt;
              font-weight: 800;
            }
            .small {
              margin-top: 0.9mm;
              color: ${muted};
              font-size: 6.8pt;
              line-height: 1.25;
            }
            .ref-row {
              display: flex;
              justify-content: space-between;
              gap: 4mm;
              font-size: 6.8pt;
              line-height: 1.25;
              margin-top: 1.2mm;
            }
            .ref-row span:first-child { color: ${muted}; }
            .strong { font-weight: 800; }

            .status {
              margin-top: 4mm;
              height: 7mm;
              border-radius: 2mm;
              background: ${primary};
              color: #fff;
              padding: 0 4mm;
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 6.8pt;
              font-weight: 800;
            }

            .section-title {
              margin: 4mm 0 2mm;
              font-size: 7pt;
              font-weight: 800;
              color: ${ink};
              letter-spacing: .7pt;
              text-transform: uppercase;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              table-layout: fixed;
              border: 0.35mm solid ${border};
              border-radius: 3mm;
              overflow: hidden;
              font-size: 6.8pt;
            }
            th {
              background: ${panel};
              color: ${muted};
              text-align: left;
              padding: 2.5mm 3mm;
              font-size: 6.3pt;
              text-transform: uppercase;
              letter-spacing: .6pt;
            }
            td {
              padding: 2.5mm 3mm;
              border-top: 0.25mm solid ${border};
              line-height: 1.2;
              word-break: break-word;
            }
            th:nth-child(1), td:nth-child(1) { width: 52%; }
            th:nth-child(2), td:nth-child(2) { width: 12%; }
            th:nth-child(3), td:nth-child(3) { width: 18%; }
            th:nth-child(4), td:nth-child(4) { width: 18%; }
            .center { text-align: center; }
            .right { text-align: right; }

            .bottom-grid {
              margin-top: 4mm;
              display: grid;
              grid-template-columns: 1fr 71mm;
              gap: 4mm;
              align-items: start;
            }

            .summary {
              border: 0.35mm solid ${border};
              border-radius: 3mm;
              background: ${panel};
              padding: 3.5mm;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              gap: 4mm;
              font-size: 6.8pt;
              margin-top: 1.6mm;
            }
            .summary-row:first-child { margin-top: 0; }
            .summary-row .label { color: ${muted}; }
            .total {
              margin-top: 2mm;
              padding: 2.7mm 3mm;
              border-radius: 2mm;
              background: ${primary};
              color: #fff;
              display: flex;
              justify-content: space-between;
              gap: 3mm;
              font-size: 8pt;
              font-weight: 800;
            }
            .due {
              margin-top: 1.8mm;
              display: flex;
              justify-content: space-between;
              font-size: 7pt;
              font-weight: 800;
            }
            .due-value { color: ${config.total}; }

            .notes-grid {
              margin-top: 4mm;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 4mm;
            }

            .footer {
              margin-top: 4mm;
              padding-top: 4mm;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              gap: 8mm;
            }
            .footer-copy { color: ${muted}; font-size: 6.5pt; line-height: 1.35; }
            .footer-brand { color: ${BRANDING.neutralText}; font-weight: 800; }
            .signature {
              width: 48mm;
              text-align: center;
              color: ${muted};
              font-size: 6.5pt;
            }
            .signature-line {
              width: 48mm;
              margin: 0 auto 2mm;
              border-bottom: 0.35mm solid ${border};
            }

            .no-break { page-break-inside: avoid; break-inside: avoid-page; }

            @media print {
              html, body {
                width: 210mm !important;
                height: 297mm !important;
                overflow: hidden !important;
                background: ${paper} !important;
              }
              .page {
                margin: 10mm auto !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="header no-break">
              <div class="brand">
                <div class="brand-row">
                  <div class="mark">${escapeHtml(BRANDING.logoMark)}</div>
                  <div>
                    <div class="brand-name">${escapeHtml(BRANDING.logoText)}</div>
                    <div class="headline">${escapeHtml(BRANDING.headline)}</div>
                  </div>
                </div>
              </div>
              <div class="invoice-meta">
                <div class="invoice-label">TAX INVOICE</div>
                <div class="invoice-number">${escapeHtml(invoice.invoiceNo)}</div>
                <div class="meta-line">Invoice Date: ${escapeHtml(invoice.invoiceDate || "-")}</div>
                <div class="meta-line">Due Date: ${escapeHtml(invoice.dueDate || "-")}</div>
              </div>
            </div>

            <div class="grid2 no-break">
              <div class="box">
                <div class="box-title">Bill To</div>
                <div class="customer">${escapeHtml(invoice.customerName || "Customer")}</div>
                <div class="small">${escapeHtml(invoice.company || "-")}</div>
                <div class="small">${escapeHtml(invoice.address || "Address not provided")}</div>
                <div class="small">${escapeHtml(invoice.email || "-")}</div>
                <div class="small">${escapeHtml(invoice.phone || "-")}</div>
              </div>

              <div class="box">
                <div class="box-title">Reference</div>
                <div class="ref-row"><span>Quotation No.</span><strong>${escapeHtml(invoice.quotationNo || "-")}</strong></div>
                <div class="ref-row"><span>Payment No.</span><strong>${escapeHtml(invoice.paymentNo || "-")}</strong></div>
                <div class="ref-row"><span>Assigned To</span><strong>${escapeHtml(employeeName(invoice.assignedEmployeeId))}</strong></div>
              </div>
            </div>

            <div class="status no-break">
              <span>${escapeHtml(statusText)}</span>
              <span>${invoice.paymentVerified ? "Payment Verified" : "Payment Verification Pending"}</span>
            </div>

            <div class="section-title">Items / Services</div>
            <table class="no-break">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th class="right">Rate</th>
                  <th class="right">Amount</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>

            <div class="bottom-grid no-break">
              <div class="box">
                <div class="box-title">Payment Verification</div>
                <div class="small">
                  ${invoice.paymentVerified ? "Payment verified by TIVRA." : "Payment verification is pending."}
                </div>
              </div>

              <div class="summary">
                <div class="summary-row"><span class="label">Subtotal</span><span>${formatCurrency(invoice.subtotal)}</span></div>
                <div class="summary-row"><span class="label">Discount</span><span>${formatCurrency(invoice.discount)}</span></div>
                <div class="summary-row"><span class="label">GST (${escapeHtml(invoice.gstRate)}%)</span><span>${formatCurrency(invoice.gstAmount)}</span></div>
                <div class="total"><span>Grand Total</span><span>${formatCurrency(invoice.grandTotal)}</span></div>
                <div class="due"><span>Paid Amount</span><span>${formatCurrency(invoice.paidAmount)}</span></div>
                <div class="due"><span>Balance Due</span><span class="due-value">${formatCurrency(invoice.dueAmount)}</span></div>
              </div>
            </div>

            <div class="notes-grid no-break">
              <div class="box">
                <div class="box-title">Notes / Terms</div>
                <div class="small">${escapeHtml(invoice.notes || "Thank you for your business.")}</div>
              </div>
              <div class="box">
                <div class="box-title">Billing Reference</div>
                <div class="small">Quotation: ${escapeHtml(invoice.quotationNo || "-")}</div>
                <div class="small">Payment: ${escapeHtml(invoice.paymentNo || "-")}</div>
              </div>
            </div>

            <div class="footer no-break">
              <div class="footer-copy">
                <div class="footer-brand">${escapeHtml(BRANDING.logoText)}</div>
                ${escapeHtml(BRANDING.headline)}<br />
                This is a system-generated invoice document.
              </div>
              <div class="signature">
                <div class="signature-line"></div>
                Authorized Signature
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printDocument.close();

    const cleanup = () => {
      window.setTimeout(() => iframe.remove(), 800);
    };

    printWindow.onafterprint = cleanup;
    window.setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      cleanup();
    }, 350);
  }

  async function downloadInvoicePdf() {
    if (!invoiceToPrint) return;

    try {
      const { jsPDF } = await import("jspdf");
      const doc = createInvoicePdf(jsPDF, invoiceToPrint, invoiceTheme);
      doc.save(`${invoiceToPrint.invoiceNo.replace(/[^a-zA-Z0-9-_]/g, "_")}.pdf`);
    } catch (error) {
      console.error("Unable to generate invoice PDF:", error);
      window.alert("PDF generation needs the jspdf package. Run: npm install jspdf");
    }
  }


  return (
    <div className="min-h-screen bg-[#080b12] p-4 text-white md:p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-sm text-blue-400">
            <FileText size={16} />
            Sales / Billing
          </div>
          <h1 className="text-2xl font-bold md:text-3xl">Billing &amp; Invoices</h1>
          <p className="mt-1 text-sm text-gray-400">
            Manage invoices, GST, payments and outstanding customer balances.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium hover:bg-blue-500"
        >
          <Plus size={18} />
          Create Invoice
        </button>
      </div>

      <div className="mb-6 overflow-x-auto rounded-2xl border border-white/10 bg-[#0d111a] p-4">
        <div className="flex min-w-[760px] items-center">
          {["Quotation Accepted", "Payment", "Verified", "Invoice", "Project Handover"].map((step, index, arr) => (
            <div key={step} className="flex flex-1 items-center">
              <div className="flex min-w-[130px] flex-col items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                    index === 3
                      ? "border-blue-500/30 bg-blue-500/15 text-blue-400"
                      : "border-white/10 bg-white/5 text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="mt-2 text-center text-xs text-gray-400">{step}</span>
              </div>
              {index < arr.length - 1 && <div className="mx-2 h-px flex-1 bg-white/10" />}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Invoiced" value={formatCurrency(stats.total)} icon={FileText} />
        <StatCard label="Paid" value={formatCurrency(stats.paid)} icon={CheckCircle2} />
        <StatCard label="Outstanding" value={formatCurrency(stats.due)} icon={Wallet} />
        <StatCard label="Overdue" value={formatCurrency(stats.overdue)} icon={AlertCircle} />
      </div>

      <div className="mb-4 rounded-2xl border border-white/10 bg-[#0d111a] p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoice, customer, quotation..."
              className="w-full rounded-xl border border-white/10 bg-[#080b12] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500/50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "ALL" | InvoiceStatus)}
            className="rounded-xl border border-white/10 bg-[#080b12] px-4 py-2.5 text-sm outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
            <option value="PARTIAL">Partial</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {(search || statusFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d111a]">
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
                <tr key={invoice.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <div className="font-medium">{invoice.invoiceNo}</div>
                    <div className="mt-1 text-xs text-gray-500">{invoice.invoiceDate}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium">{invoice.customerName}</div>
                    <div className="text-xs text-gray-500">{invoice.company}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-blue-300">{invoice.quotationNo}</td>
                  <td className="px-5 py-4 font-semibold">{formatCurrency(invoice.grandTotal)}</td>
                  <td className="px-5 py-4 text-green-300">{formatCurrency(invoice.paidAmount)}</td>
                  <td className="px-5 py-4 text-orange-300">{formatCurrency(invoice.dueAmount)}</td>
                  <td className="px-5 py-4 text-sm">{employeeName(invoice.assignedEmployeeId)}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-lg border px-2.5 py-1 text-xs ${statusConfig[invoice.status].className}`}>
                      {statusConfig[invoice.status].label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button title="View" onClick={() => setSelectedInvoice(invoice)} className="rounded-lg p-2 text-gray-300 hover:bg-white/10">
                        <Eye size={16} />
                      </button>
                      <button title="Print / Save PDF" onClick={() => openInvoicePreview(invoice)} className="rounded-lg p-2 text-orange-400 hover:bg-white/10">
                        <Printer size={16} />
                      </button>
                      <button title="Edit" onClick={() => openEdit(invoice)} className="rounded-lg p-2 text-blue-400 hover:bg-white/10">
                        <Pencil size={16} />
                      </button>
                      <button
                        title="Duplicate"
                        onClick={() => duplicateInvoice(invoice)}
                        className="rounded-lg p-2 text-purple-400 hover:bg-white/10"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        title="Assign Employee"
                        onClick={() => {
                          setAssigningInvoice(invoice);
                          setEmployeeSearch("");
                          setShowAssign(true);
                        }}
                        className="rounded-lg p-2 text-green-400 hover:bg-white/10"
                      >
                        <UserPlus size={16} />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => {
                          setDeletingInvoice(invoice);
                          setShowDelete(true);
                        }}
                        className="rounded-lg p-2 text-red-400 hover:bg-white/10"
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
            <div className="py-16 text-center text-gray-500">No invoices found.</div>
          )}
        </div>
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d111a]">
            <div className="flex items-center justify-between border-b border-white/10 bg-[#0d111a] p-5">
              <div>
                <h2 className="text-xl font-bold">{selectedInvoice.invoiceNo}</h2>
                <p className="mt-1 text-xs text-gray-500">{selectedInvoice.company}</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="rounded-lg p-2 hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <InfoBox label="Customer" value={selectedInvoice.customerName} />
                <InfoBox label="Company" value={selectedInvoice.company} />
                <InfoBox label="Quotation" value={selectedInvoice.quotationNo} />
                <InfoBox label="Payment" value={selectedInvoice.paymentNo} />
                <InfoBox label="Email" value={selectedInvoice.email} />
                <InfoBox label="Assigned Employee" value={employeeName(selectedInvoice.assignedEmployeeId)} />
              </div>

              <div className={`rounded-xl border p-4 ${
                selectedInvoice.paymentVerified
                  ? "border-green-500/10 bg-green-500/5"
                  : "border-yellow-500/10 bg-yellow-500/5"
              }`}>
                <div className="flex items-start gap-3">
                  {selectedInvoice.paymentVerified ? (
                    <CheckCircle2 size={19} className="mt-0.5 text-green-400" />
                  ) : (
                    <Clock3 size={19} className="mt-0.5 text-yellow-400" />
                  )}
                  <div>
                    <p className="text-sm font-semibold">
                      Payment {selectedInvoice.paymentVerified ? "Verified" : "Not Verified"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Payment verification is required before the billing workflow is completed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-white/10">
                <div className="border-b border-white/10 px-4 py-3 font-semibold">Invoice Items</div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px]">
                    <thead>
                      <tr className="border-b border-white/10 text-xs text-gray-500">
                        <th className="px-4 py-3 text-left">Description</th>
                        <th className="px-4 py-3">Qty</th>
                        <th className="px-4 py-3">Rate</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items.map((item) => (
                        <tr key={item.id} className="border-b border-white/5">
                          <td className="px-4 py-3 text-sm">{item.description}</td>
                          <td className="px-4 py-3 text-center text-sm">{item.quantity}</td>
                          <td className="px-4 py-3 text-center text-sm">{formatCurrency(item.rate)}</td>
                          <td className="px-4 py-3 text-right text-sm font-medium">{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="w-full space-y-2 rounded-xl border border-white/10 bg-[#080b12] p-4 md:w-96">
                  <AmountRow label="Subtotal" value={selectedInvoice.subtotal} />
                  <AmountRow label="Discount" value={-selectedInvoice.discount} />
                  <AmountRow label={`GST (${selectedInvoice.gstRate}%)`} value={selectedInvoice.gstAmount} />
                  <div className="border-t border-white/10 pt-2">
                    <AmountRow label="Grand Total" value={selectedInvoice.grandTotal} bold />
                    <AmountRow label="Paid" value={selectedInvoice.paidAmount} />
                    <AmountRow label="Due" value={selectedInvoice.dueAmount} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <InfoBox label="Invoice Date" value={selectedInvoice.invoiceDate} />
                <InfoBox label="Due Date" value={selectedInvoice.dueDate || "-"} />
                <InfoBox label="Status" value={statusConfig[selectedInvoice.status].label} />
              </div>

              <div className="rounded-xl border border-white/10 bg-[#080b12] p-4">
                <p className="mb-2 text-xs text-gray-500">Notes</p>
                <p className="whitespace-pre-wrap text-sm text-gray-300">
                  {selectedInvoice.notes || "No notes."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-white/10 bg-[#0d111a] p-5">
              <button
                onClick={() => openInvoicePreview(selectedInvoice)}
                className="flex items-center gap-2 rounded-lg bg-orange-500/15 px-4 py-2 text-sm text-orange-300 hover:bg-orange-500/20"
              >
                <Printer size={16} />
                Print / Save PDF
              </button>
              <button
                onClick={() => {
                  setSelectedInvoice(null);
                  openEdit(selectedInvoice);
                }}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm hover:bg-blue-500"
              >
                <Pencil size={16} />
                Edit
              </button>

              {selectedInvoice.status === "DRAFT" && (
                <button
                  onClick={() => markAsSent(selectedInvoice)}
                  className="flex items-center gap-2 rounded-lg bg-blue-600/20 px-4 py-2 text-sm text-blue-300 hover:bg-blue-600/30"
                >
                  <Send size={16} />
                  Mark as Sent
                </button>
              )}

              {selectedInvoice.dueAmount > 0 && selectedInvoice.paymentVerified && (
                <button
                  onClick={() => markAsPaid(selectedInvoice)}
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm hover:bg-green-500"
                >
                  <CheckCircle2 size={16} />
                  Mark as Paid
                </button>
              )}

              <button
                onClick={() => {
                  setAssigningInvoice(selectedInvoice);
                  setEmployeeSearch("");
                  setShowAssign(true);
                }}
                className="flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-2 text-sm text-green-300 hover:bg-green-500/20"
              >
                <UserPlus size={16} />
                Assign Employee
              </button>

              {selectedInvoice.status !== "CANCELLED" && selectedInvoice.status !== "PAID" && (
                <button
                  onClick={() => cancelInvoice(selectedInvoice)}
                  className="flex items-center gap-2 rounded-lg bg-yellow-500/10 px-4 py-2 text-sm text-yellow-300 hover:bg-yellow-500/20"
                >
                  Cancel Invoice
                </button>
              )}

              <button
                onClick={() => {
                  setDeletingInvoice(selectedInvoice);
                  setShowDelete(true);
                }}
                className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-300 hover:bg-red-500/20"
              >
                <Trash2 size={16} />
                Delete
              </button>

              <button
                onClick={() => setSelectedInvoice(null)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {showInvoicePreview && invoiceToPrint && (
        <InvoicePreviewModal
          invoice={invoiceToPrint}
          theme={invoiceTheme}
          onThemeChange={setInvoiceTheme}
          onPrint={printInvoice}
          onDownloadPdf={downloadInvoicePdf}
          onClose={() => setShowInvoicePreview(false)}
        />
      )}

      {(showAdd || editingInvoice) && (
        <InvoiceForm
          title={editingInvoice ? "Edit Invoice" : "Create Invoice"}
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

      {showAssign && assigningInvoice && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d111a]">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <h2 className="text-lg font-bold">Assign Employee</h2>
                <p className="mt-1 text-xs text-gray-500">{assigningInvoice.invoiceNo}</p>
              </div>
              <button onClick={() => setShowAssign(false)} className="rounded-lg p-2 hover:bg-white/10">
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="relative mb-4">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  placeholder="Search employee..."
                  className="w-full rounded-xl border border-white/10 bg-[#080b12] py-2.5 pl-10 pr-4 text-sm outline-none"
                />
              </div>

              <div className="max-h-72 space-y-2 overflow-y-auto">
                {filteredEmployees.map((employee) => (
                  <button
                    key={employee.id}
                    onClick={() => assignEmployee(employee.id)}
                    className={`w-full rounded-xl border p-3 text-left hover:bg-white/5 ${
                      assigningInvoice.assignedEmployeeId === employee.id
                        ? "border-blue-500/50 bg-blue-500/10"
                        : "border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-sm font-semibold text-blue-300">
                        {employee.name.split(" ").map((x) => x[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{employee.name}</div>
                        <div className="text-xs text-gray-500">
                          {employee.department} · {employee.role}
                        </div>
                      </div>
                      {assigningInvoice.assignedEmployeeId === employee.id && (
                        <Check size={18} className="text-blue-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => assignEmployee(null)}
                className="mt-3 w-full rounded-xl border border-white/10 py-2.5 text-sm text-gray-400 hover:bg-white/5"
              >
                Remove Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {showDelete && deletingInvoice && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d111a] p-5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <Trash2 size={22} />
            </div>
            <h2 className="text-lg font-bold">Delete Invoice?</h2>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete{" "}
              <span className="text-gray-300">{deletingInvoice.invoiceNo}</span>?
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDelete(false);
                  setDeletingInvoice(null);
                }}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={deleteInvoice}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm hover:bg-red-500"
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



function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const normalized = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  return [
    parseInt(normalized.slice(0, 2), 16),
    parseInt(normalized.slice(2, 4), 16),
    parseInt(normalized.slice(4, 6), 16),
  ];
}

function createInvoicePdf(JsPDFCtor: any, invoice: Invoice, theme: InvoiceTheme) {
  const doc = new JsPDFCtor({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
    compress: true,
  });

  const pageW = 210;
  const pageH = 297;
  const margin = 9;
  const contentW = pageW - margin * 2;
  const config = invoiceThemes[theme];
  const isDark = theme === "premium";

  const bg = isDark ? hexToRgb("#111827") : [255, 255, 255] as [number, number, number];
  const text = isDark ? [249, 250, 251] as [number, number, number] : hexToRgb(config.text);
  const muted = isDark ? [156, 163, 175] as [number, number, number] : hexToRgb(config.muted);
  const primary = hexToRgb(config.primary);
  const soft = isDark ? hexToRgb("#1f2937") : hexToRgb(config.soft);
  const border = isDark ? hexToRgb("#374151") : hexToRgb(config.border);
  const brand = hexToRgb(BRANDING.color);
  const brandText = hexToRgb(BRANDING.neutralText);
  const brandMuted = hexToRgb(BRANDING.mutedText);
  const white: [number, number, number] = [255, 255, 255];

  const fill = (rgb: [number, number, number]) => doc.setFillColor(rgb[0], rgb[1], rgb[2]);
  const ink = (rgb: [number, number, number]) => doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  const stroke = (rgb: [number, number, number]) => doc.setDrawColor(rgb[0], rgb[1], rgb[2]);

  fill(bg);
  doc.rect(0, 0, pageW, pageH, "F");

  // Fixed A4 one-page layout. No addPage()/ensure() calls are used here.
  let y = margin;

  // HEADER — branding stays locked; theme changes only the surrounding treatment.
  fill(soft);
  doc.roundedRect(margin, y, contentW, 30, 3, 3, "F");

  fill(brand);
  doc.roundedRect(margin + 5, y + 5, 14, 14, 3, 3, "F");
  ink(white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(BRANDING.logoMark, margin + 10, y + 14.5, { align: "center" });

  ink(brandText);
  doc.setFontSize(17);
  doc.text(BRANDING.logoText, margin + 24, y + 12);
  ink(brandMuted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.4);
  doc.text(BRANDING.headline, margin + 24, y + 18);

  ink(brand);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("TAX INVOICE", pageW - margin - 5, y + 7, { align: "right" });
  ink(text);
  doc.setFontSize(14);
  doc.text(invoice.invoiceNo, pageW - margin - 5, y + 14.5, { align: "right" });
  ink(muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.text(`Invoice Date: ${invoice.invoiceDate || "-"}`, pageW - margin - 5, y + 20.5, { align: "right" });
  doc.text(`Due Date: ${invoice.dueDate || "-"}`, pageW - margin - 5, y + 26, { align: "right" });

  y += 35;

  // BILL TO + REFERENCES.
  const gap = 4;
  const halfW = (contentW - gap) / 2;
  fill(isDark ? hexToRgb("#182033") : white);
  stroke(border);
  doc.roundedRect(margin, y, halfW, 31, 3, 3, "FD");
  doc.roundedRect(margin + halfW + gap, y, halfW, 31, 3, 3, "FD");

  ink(muted);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("BILL TO", margin + 5, y + 6.5);
  ink(text);
  doc.setFontSize(9.2);
  doc.text(invoice.customerName || "Customer", margin + 5, y + 12.5);
  ink(muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.text(invoice.company || "-", margin + 5, y + 17.5);
  doc.text(invoice.address || "Address not provided", margin + 5, y + 22.5, { maxWidth: halfW - 10 });
  doc.text(`${invoice.email || "-"}  |  ${invoice.phone || "-"}`, margin + 5, y + 27, { maxWidth: halfW - 10 });

  const refX = margin + halfW + gap + 5;
  ink(muted);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("REFERENCE", refX, y + 6.5);
  ink(text);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.4);
  doc.text(`Quotation No.  ${invoice.quotationNo || "-"}`, refX, y + 13);
  doc.text(`Payment No.    ${invoice.paymentNo || "-"}`, refX, y + 19);
  doc.text(`Assigned To    ${employeeName(invoice.assignedEmployeeId)}`, refX, y + 25);

  y += 36;

  // STATUS STRIP.
  fill(primary);
  doc.roundedRect(margin, y, contentW, 8, 2, 2, "F");
  ink(white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.9);
  const status = getInvoiceStatus(invoice);
  const statusText = status === "PAID"
    ? "PAID"
    : status === "PARTIAL"
    ? "PARTIAL PAYMENT"
    : status === "OVERDUE"
    ? "OVERDUE"
    : status === "CANCELLED"
    ? "CANCELLED"
    : status === "DRAFT"
    ? "DRAFT"
    : "SENT";
  doc.text(statusText, margin + 4, y + 5.4);
  doc.text(
    invoice.paymentVerified ? "Payment Verified" : "Payment Verification Pending",
    pageW - margin - 4,
    y + 5.4,
    { align: "right" }
  );

  y += 13;

  // ITEMS TABLE.
  ink(text);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("ITEMS / SERVICES", margin, y);
  y += 4;

  const tableX = margin;
  const descW = 104;
  const qtyW = 16;
  const rateW = 32;
  const headerH = 7;
  const rowH = 8;

  fill(soft);
  stroke(border);
  doc.roundedRect(tableX, y, contentW, headerH, 1.7, 1.7, "FD");
  ink(muted);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("DESCRIPTION", tableX + 4, y + 4.7);
  doc.text("QTY", tableX + descW + qtyW / 2, y + 4.7, { align: "center" });
  doc.text("RATE", tableX + descW + qtyW + rateW - 4, y + 4.7, { align: "right" });
  doc.text("AMOUNT", tableX + contentW - 4, y + 4.7, { align: "right" });
  y += headerH;

  const maxRows = 10;
  invoice.items.slice(0, maxRows).forEach((item, index) => {
    if (index % 2 === 1) {
      fill(isDark ? hexToRgb("#141c2d") : [250, 250, 250]);
      doc.rect(tableX, y, contentW, rowH, "F");
    }
    stroke(border);
    doc.line(tableX, y + rowH, tableX + contentW, y + rowH);
    ink(text);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);

    let description = item.description || "Item";
    if (description.length > 66) description = `${description.slice(0, 63)}...`;
    doc.text(description, tableX + 4, y + 5);
    doc.text(String(item.quantity), tableX + descW + qtyW / 2, y + 5, { align: "center" });
    doc.text(formatCurrency(item.rate), tableX + descW + qtyW + rateW - 4, y + 5, { align: "right" });
    doc.text(formatCurrency(item.amount), tableX + contentW - 4, y + 5, { align: "right" });
    y += rowH;
  });

  if (invoice.items.length > maxRows) {
    ink(muted);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(6.2);
    doc.text(`+ ${invoice.items.length - maxRows} additional item(s)`, tableX + 4, y + 4.5);
    y += 6;
  }

  y += 5;

  // TOTALS — compact so everything remains on one A4 page.
  const totalsY = y;
  const totalsX = margin + 109;
  const totalsW = contentW - 109;
  fill(soft);
  stroke(border);
  doc.roundedRect(totalsX, totalsY, totalsW, 46, 3, 3, "FD");

  const trow = (label: string, value: string, top: number, bold = false) => {
    ink(bold ? text : muted);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 8 : 7);
    doc.text(label, totalsX + 5, totalsY + top);
    doc.text(value, totalsX + totalsW - 5, totalsY + top, { align: "right" });
  };

  trow("Subtotal", formatCurrency(invoice.subtotal), 7);
  trow("Discount", formatCurrency(invoice.discount), 13);
  trow(`GST (${invoice.gstRate}%)`, formatCurrency(invoice.gstAmount), 19);

  fill(primary);
  doc.roundedRect(totalsX + 3, totalsY + 22, totalsW - 6, 8, 2, 2, "F");
  ink(white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.6);
  doc.text("GRAND TOTAL", totalsX + 7, totalsY + 27.2);
  doc.text(formatCurrency(invoice.grandTotal), totalsX + totalsW - 7, totalsY + 27.2, { align: "right" });

  trow("Paid Amount", formatCurrency(invoice.paidAmount), 36);
  trow("Balance Due", formatCurrency(invoice.dueAmount), 42, true);

  y = totalsY + 51;

  // PAYMENT + NOTES.
  const lowerW = (contentW - 4) / 2;
  fill(isDark ? hexToRgb("#182033") : soft);
  stroke(border);
  doc.roundedRect(margin, y, lowerW, 24, 3, 3, "FD");
  doc.roundedRect(margin + lowerW + 4, y, lowerW, 24, 3, 3, "FD");

  ink(text);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.text("PAYMENT VERIFICATION", margin + 5, y + 7);
  ink(muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.7);
  const verificationText = invoice.paymentVerified
    ? "Payment verified by TIVRA."
    : "Payment verification pending.";
  doc.text(verificationText, margin + 5, y + 13, { maxWidth: lowerW - 10 });

  const notesX = margin + lowerW + 9;
  ink(text);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.text("NOTES / TERMS", notesX, y + 7);
  ink(muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.7);
  let noteText = invoice.notes || "Thank you for your business.";
  const noteLines = doc.splitTextToSize(noteText, lowerW - 10).slice(0, 2);
  doc.text(noteLines, notesX, y + 13);

  y += 31;

  // FOOTER + SIGNATURE.
  y += 6;
  ink(brandText);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.text(BRANDING.logoText, margin, y);
  ink(brandMuted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.3);
  doc.text(BRANDING.headline, margin, y + 4.5);
  doc.text("This is a system-generated invoice document.", margin, y + 9);

  if (invoice.signatureDataUrl) {
    try {
      const properties = doc.getImageProperties(invoice.signatureDataUrl);
      const maxW = 42;
      const maxH = 14;
      const ratio = properties.width / properties.height || 2.5;
      let sigW = maxW;
      let sigH = sigW / ratio;
      if (sigH > maxH) {
        sigH = maxH;
        sigW = sigH * ratio;
      }
      const sigX = pageW - margin - sigW;
      const sigY = y - 7;
      doc.addImage(
        invoice.signatureDataUrl,
        invoice.signatureDataUrl.toLowerCase().startsWith("data:image/png") ? "PNG" : "JPEG",
        sigX,
        sigY,
        sigW,
        sigH
      );
      stroke(border);
      doc.line(pageW - margin - 43, y + 8, pageW - margin, y + 8);
      ink(muted);
      doc.setFontSize(6.7);
      doc.text("Authorized Signature", pageW - margin - 21.5, y + 15, { align: "center" });
    } catch {
      stroke(border);
      doc.line(pageW - margin - 43, y + 8, pageW - margin, y + 8);
      ink(muted);
      doc.setFontSize(6.7);
      doc.text("Authorized Signature", pageW - margin - 21.5, y + 15, { align: "center" });
    }
  } else {
    stroke(border);
    doc.line(pageW - margin - 43, y + 8, pageW - margin, y + 8);
    ink(muted);
    doc.setFontSize(6.7);
    doc.text("Authorized Signature", pageW - margin - 21.5, y + 15, { align: "center" });
  }

  // Keep everything strictly within A4. There is intentionally only one page.
  void pageH;
  return doc;
}

function InvoicePreviewModal({
  invoice,
  theme,
  onThemeChange,
  onPrint,
  onDownloadPdf,
  onClose,
}: {
  invoice: Invoice;
  theme: InvoiceTheme;
  onThemeChange: (theme: InvoiceTheme) => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  onClose: () => void;
}) {
  const config = invoiceThemes[theme];
  const isDark = theme === "premium";
  const paid = invoice.paidAmount >= invoice.grandTotal && invoice.grandTotal > 0;
  const statusLabel = paid ? "PAID" : invoice.dueAmount > 0 ? "BALANCE DUE" : "DRAFT";

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }

          html,
          body {
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body * {
            visibility: hidden !important;
          }

          .invoice-print-surface,
          .invoice-print-surface * {
            visibility: visible !important;
          }

          .invoice-print-surface {
            position: absolute !important;
            top: 0 !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: 190mm !important;
            max-width: 190mm !important;
            min-height: 277mm !important;
            margin: 10mm 0 !important;
            box-shadow: none !important;
            border: none !important;
            overflow: hidden !important;
            page-break-inside: avoid !important;
          }

          /* Keep the modal wrapper in the print tree because it contains the invoice itself.
             Only the invoice surface is made visible for printing. */
          .invoice-preview-controls {
            background: transparent !important;
            padding: 0 !important;
            position: static !important;
            inset: auto !important;
          }
        }
      `}</style>

      <div className="invoice-preview-controls fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4">
        <div className="flex max-h-[96vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f17] shadow-2xl">
          <div className="flex flex-col gap-4 border-b border-white/10 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-400">
                <Palette size={15} /> Customer PDF / Print Preview
              </div>
              <h2 className="mt-1 text-xl font-bold">{invoice.invoiceNo}</h2>
              <p className="mt-1 text-sm text-gray-500">
                Choose an invoice theme, then print or save it as PDF.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={onDownloadPdf}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold hover:bg-orange-500"
              >
                <Download size={17} />
                Download PDF
              </button>
              <button
                onClick={onPrint}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold hover:bg-blue-500"
              >
                <Printer size={17} />
                Print Invoice
              </button>
              <button
                onClick={onClose}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5"
              >
                Close
              </button>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 lg:grid-cols-[250px_1fr]">
            <div className="overflow-y-auto border-b border-white/10 p-4 lg:border-b-0 lg:border-r">
              <div className="mb-3 text-sm font-semibold">Invoice Theme</div>
              <div className="space-y-2">
                {(Object.entries(invoiceThemes) as [InvoiceTheme, InvoiceThemeConfig][]).map(([key, item]) => (
                  <button
                    key={key}
                    onClick={() => onThemeChange(key)}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      theme === key
                        ? "border-blue-500/60 bg-blue-500/10"
                        : "border-white/10 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                        style={{ backgroundColor: item.soft, color: item.primary }}
                      >
                        PDF
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{item.name}</div>
                        <div className="mt-0.5 text-xs text-gray-500">{item.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-blue-500/10 bg-blue-500/5 p-3">
                <div className="flex items-start gap-2">
                  <Download size={15} className="mt-0.5 shrink-0 text-blue-400" />
                  <p className="text-xs leading-5 text-gray-400">
                    <span className="font-semibold text-gray-200">Download PDF</span> creates a real invoice PDF file. Use <span className="font-semibold text-gray-200">Print Invoice</span> for paper printing.
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-orange-500/15 bg-orange-500/5 p-3">
                <div className="text-xs font-semibold text-orange-300">Branding locked</div>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Logo, brand color, TIVRA name and headline stay unchanged across every invoice theme.
                </p>
              </div>
            </div>

            <div className="min-h-0 overflow-auto bg-[#161b25] p-4 md:p-8">
              <div
                className="invoice-print-surface mx-auto w-full max-w-[820px] overflow-hidden rounded-lg shadow-2xl"
                style={{
                  color: config.text,
                  backgroundColor: isDark ? "#111827" : "#ffffff",
                }}
              >
                <div
                  className="p-6"
                  style={{
                    background: config.soft,
                    borderBottom: `4px solid ${config.primary}`,
                  }}
                >
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div
                        className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-lg font-black"
                        style={{ backgroundColor: BRANDING.color, color: "#ffffff" }}
                      >
                        {BRANDING.logoMark}
                      </div>
                      <div
                        className="text-2xl font-black"
                        style={{ color: isDark ? "#f9fafb" : BRANDING.neutralText }}
                      >
                        {BRANDING.logoText}
                      </div>
                      <div
                        className="mt-1 text-sm"
                        style={{ color: isDark ? "#cbd5e1" : BRANDING.mutedText }}
                      >
                        {BRANDING.headline}
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <div
                        className="text-xs font-bold uppercase tracking-[0.2em]"
                        style={{ color: BRANDING.color }}
                      >
                        Tax Invoice
                      </div>
                      <div className="mt-2 text-2xl font-black">{invoice.invoiceNo}</div>
                      <div className="mt-2 text-sm" style={{ color: config.muted }}>
                        Invoice Date: {invoice.invoiceDate || "-"}
                      </div>
                      <div className="text-sm" style={{ color: config.muted }}>
                        Due Date: {invoice.dueDate || "-"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div
                      className="rounded-xl border p-4"
                      style={{
                        borderColor: config.border,
                        backgroundColor: isDark ? "#182033" : "#ffffff",
                        color: config.text,
                      }}
                    >
                      <div className="mb-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: config.muted }}>
                        Bill To
                      </div>
                      <div className="font-bold">{invoice.customerName || "Customer"}</div>
                      <div className="mt-1 text-sm" style={{ color: config.muted }}>{invoice.company || "-"}</div>
                      <div className="mt-1 text-sm" style={{ color: config.muted }}>{invoice.address || "Address not provided"}</div>
                      <div className="mt-1 text-sm" style={{ color: config.muted }}>{invoice.email || "-"}</div>
                      <div className="text-sm" style={{ color: config.muted }}>{invoice.phone || "-"}</div>
                    </div>

                    <div
                      className="rounded-xl border p-4"
                      style={{
                        borderColor: config.border,
                        backgroundColor: isDark ? "#182033" : "#ffffff",
                        color: config.text,
                      }}
                    >
                      <div className="mb-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: config.muted }}>
                        Reference
                      </div>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span style={{ color: config.muted }}>Quotation No.</span>
                        <span className="font-semibold">{invoice.quotationNo || "-"}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                        <span style={{ color: config.muted }}>Payment No.</span>
                        <span className="font-semibold">{invoice.paymentNo || "-"}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                        <span style={{ color: config.muted }}>Assigned To</span>
                        <span className="font-semibold">{employeeName(invoice.assignedEmployeeId)}</span>
                      </div>
                      <div className="mt-3">
                        <span
                          className="inline-flex rounded-full px-3 py-1 text-[11px] font-bold"
                          style={{ backgroundColor: config.primary, color: "#ffffff" }}
                        >
                          {statusLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="overflow-hidden rounded-xl border" style={{ borderColor: config.border }}>
                    <table
                      className="w-full text-sm"
                      style={{
                        color: config.text,
                        backgroundColor: isDark ? "#111827" : "#ffffff",
                      }}
                    >
                      <thead>
                        <tr style={{ background: config.soft }}>
                          <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide" style={{ color: config.muted }}>Description</th>
                          <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wide" style={{ color: config.muted }}>Qty</th>
                          <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide" style={{ color: config.muted }}>Rate</th>
                          <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide" style={{ color: config.muted }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.items.map((item) => (
                          <tr key={item.id} className="border-t" style={{ borderColor: config.border }}>
                            <td className="px-4 py-3 font-medium">{item.description || "Item"}</td>
                            <td className="px-4 py-3 text-center">{item.quantity}</td>
                            <td className="px-4 py-3 text-right">{formatCurrency(item.rate)}</td>
                            <td className="px-4 py-3 text-right font-semibold">{formatCurrency(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <div className="w-full max-w-sm space-y-2">
                      <div className="flex justify-between gap-4 text-sm">
                        <span style={{ color: config.muted }}>Subtotal</span>
                        <span>{formatCurrency(invoice.subtotal)}</span>
                      </div>
                      <div className="flex justify-between gap-4 text-sm">
                        <span style={{ color: config.muted }}>Discount</span>
                        <span>{formatCurrency(invoice.discount)}</span>
                      </div>
                      <div className="flex justify-between gap-4 text-sm">
                        <span style={{ color: config.muted }}>GST ({invoice.gstRate}%)</span>
                        <span>{formatCurrency(invoice.gstAmount)}</span>
                      </div>
                      <div className="my-2 border-t" style={{ borderColor: config.border }} />
                      <div
                        className="flex justify-between gap-4 rounded-xl px-4 py-3 text-base font-black"
                        style={{ backgroundColor: config.primary, color: "#ffffff" }}
                      >
                        <span>Grand Total</span>
                        <span>{formatCurrency(invoice.grandTotal)}</span>
                      </div>
                      <div className="flex justify-between gap-4 pt-2 text-sm">
                        <span style={{ color: config.muted }}>Paid Amount</span>
                        <span>{formatCurrency(invoice.paidAmount)}</span>
                      </div>
                      <div className="flex justify-between gap-4 text-sm font-bold">
                        <span>Balance Due</span>
                        <span style={{ color: config.total }}>{formatCurrency(invoice.dueAmount)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border p-4" style={{ borderColor: config.border, backgroundColor: config.soft }}>
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <CheckCircle2 size={16} style={{ color: invoice.paymentVerified ? config.primary : config.muted }} />
                        Payment Verification
                      </div>
                      <p className="mt-2 text-sm" style={{ color: config.muted }}>
                        {invoice.paymentVerified ? "Payment verified by TIVRA." : "Payment verification pending."}
                      </p>
                    </div>

                    <div
                      className="rounded-xl border p-4"
                      style={{
                        borderColor: config.border,
                        backgroundColor: isDark ? "#182033" : "#ffffff",
                        color: config.text,
                      }}
                    >
                      <div className="mb-1 text-sm font-bold">Notes / Terms</div>
                      <p className="whitespace-pre-wrap text-sm leading-6" style={{ color: config.muted }}>
                        {invoice.notes || "Thank you for your business."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-10 flex flex-col gap-8 pt-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="text-xs leading-5" style={{ color: config.muted }}>
                      <div
                        className="font-bold"
                        style={{ color: isDark ? "#f9fafb" : BRANDING.neutralText }}
                      >
                        {BRANDING.logoText}
                      </div>
                      {BRANDING.headline}
                      <br />
                      This is a system-generated invoice document.
                    </div>
                    <div className="w-48 text-center">
                      <div className="flex h-16 items-end justify-center">
                        {invoice.signatureDataUrl ? (
                          <img
                            src={invoice.signatureDataUrl}
                            alt="Authorized signature"
                            className="max-h-14 max-w-40 object-contain"
                          />
                        ) : null}
                      </div>
                      <div className="mt-2 border-b" style={{ borderColor: config.border }} />
                      <div className="pt-2 text-xs font-semibold" style={{ color: config.muted }}>
                        Authorized Signature
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SignatureUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!/^image\/(png|jpeg|jpg)$/i.test(file.type)) {
      window.alert("Please upload a PNG or JPG signature image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      window.alert("Signature image must be 2 MB or smaller.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (result) onChange(result);
    };
    reader.onerror = () => window.alert("Unable to read the signature image.");
    reader.readAsDataURL(file);
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#080b12] p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-white">Authorized Signature</div>
          <p className="mt-1 text-xs leading-5 text-gray-500">
            Upload a PNG or JPG signature. It will appear on invoice preview, print and PDF.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium hover:bg-blue-500">
            <UploadIcon />
            {value ? "Change Signature" : "Upload Signature"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFile}
              className="hidden"
            />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {value ? (
        <div className="mt-4 flex min-h-24 items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/[0.02] p-4">
          <img src={value} alt="Authorized signature preview" className="max-h-20 max-w-[260px] object-contain" />
        </div>
      ) : (
        <div className="mt-4 flex min-h-24 items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/[0.02] text-center text-xs text-gray-600">
          No signature uploaded — the invoice will show a blank signature line.
        </div>
      )}
    </div>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2">
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M5 20h14" />
    </svg>
  );
}

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
  updateItem: (id: number, field: keyof InvoiceItem, value: any) => void;
  addItem: () => void;
  removeItem: (id: number) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const calculated = calculateInvoice(form);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d111a]">
        <div className="flex items-center justify-between border-b border-white/10 bg-[#0d111a] p-5">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="mt-1 text-xs text-gray-500">
              Create and manage customer invoice
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <FormSection
            title="Customer & Invoice Information"
            subtitle="Basic invoice identity and customer details."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Input label="Invoice Number" value={form.invoiceNo} onChange={(value) => updateForm("invoiceNo", value)} />
              <Input label="Quotation Number" value={form.quotationNo} onChange={(value) => updateForm("quotationNo", value)} />
              <Input label="Payment Number" value={form.paymentNo} onChange={(value) => updateForm("paymentNo", value)} />
              <Input label="Customer Name" value={form.customerName} onChange={(value) => updateForm("customerName", value)} />
              <Input label="Company" value={form.company} onChange={(value) => updateForm("company", value)} />
              <Input label="Email" value={form.email} onChange={(value) => updateForm("email", value)} />
              <Input label="Phone" value={form.phone} onChange={(value) => updateForm("phone", value)} />
              <Input label="Invoice Date" type="date" value={form.invoiceDate} onChange={(value) => updateForm("invoiceDate", value)} />
              <Input label="Due Date" type="date" value={form.dueDate} onChange={(value) => updateForm("dueDate", value)} />
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-xs text-gray-500">Address</label>
              <textarea
                value={form.address}
                onChange={(e) => updateForm("address", e.target.value)}
                rows={2}
                className="w-full resize-none rounded-xl border border-white/10 bg-[#080b12] px-3 py-2.5 text-sm outline-none"
              />
            </div>
          </FormSection>

          <FormSection
            title="Invoice Items"
            subtitle="Add products or services included in the invoice."
            action={
              <button
                onClick={addItem}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm hover:bg-blue-500"
              >
                <Plus size={16} />
                Add Item
              </button>
            }
          >
            <div className="overflow-hidden rounded-xl border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px]">
                  <thead>
                    <tr className="border-b border-white/10 text-xs text-gray-500">
                      <th className="px-4 py-3 text-left">Description</th>
                      <th className="px-4 py-3">Qty</th>
                      <th className="px-4 py-3">Rate</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.items.map((item) => (
                      <tr key={item.id} className="border-b border-white/5">
                        <td className="px-4 py-3">
                          <input
                            value={item.description}
                            onChange={(e) => updateItem(item.id, "description", e.target.value)}
                            placeholder="Service / product"
                            className="w-full rounded-lg border border-white/10 bg-[#080b12] px-3 py-2 text-sm outline-none"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value) || 1)}
                            className="w-20 rounded-lg border border-white/10 bg-[#080b12] px-3 py-2 text-sm outline-none"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            value={item.rate}
                            onChange={(e) => updateItem(item.id, "rate", Number(e.target.value) || 0)}
                            className="w-32 rounded-lg border border-white/10 bg-[#080b12] px-3 py-2 text-sm outline-none"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {formatCurrency(item.quantity * item.rate)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
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
          </FormSection>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
            <FormSection
              title="Tax & Notes"
              subtitle="Apply discount, GST and optional invoice notes."
            >
              <div className="space-y-4">
                <Input
                  label="Discount"
                  type="number"
                  value={String(form.discount)}
                  onChange={(value) => updateForm("discount", Number(value) || 0)}
                />

                <div>
                  <label className="mb-1.5 block text-xs text-gray-500">GST Rate (%)</label>
                  <select
                    value={form.gstRate}
                    onChange={(e) => updateForm("gstRate", Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-[#080b12] px-3 py-2.5 text-sm outline-none"
                  >
                    {[0, 5, 12, 18, 28].map((rate) => (
                      <option key={rate} value={rate}>
                        {rate}%
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs text-gray-500">Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => updateForm("notes", e.target.value)}
                    rows={6}
                    placeholder="Invoice notes..."
                    className="w-full resize-none rounded-xl border border-white/10 bg-[#080b12] px-3 py-2.5 text-sm outline-none"
                  />
                </div>
              </div>
            </FormSection>

            <div className="h-fit rounded-2xl border border-white/10 bg-[#080b12] p-5">
              <div className="mb-4">
                <h3 className="font-semibold">Invoice Summary</h3>
                <p className="mt-1 text-xs text-gray-500">Calculated automatically from items, discount and GST.</p>
              </div>

              <AmountRow label="Subtotal" value={calculated.subtotal} />
              <AmountRow label="Discount" value={-calculated.discount} />
              <AmountRow label={`GST (${calculated.gstRate}%)`} value={calculated.gstAmount} />

              <div className="mt-3 border-t border-white/10 pt-3">
                <AmountRow label="Grand Total" value={calculated.grandTotal} bold />
                <AmountRow label="Paid" value={form.paidAmount} />
                <AmountRow label="Due" value={calculated.grandTotal - Math.min(form.paidAmount, calculated.grandTotal)} />
              </div>
            </div>
          </div>

          <FormSection
            title="Authorized Signature"
            subtitle="Upload the signature that should appear on the customer-facing invoice."
          >
            <SignatureUpload
              value={form.signatureDataUrl || ""}
              onChange={(value) => updateForm("signatureDataUrl", value)}
            />
          </FormSection>

          <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
            <div className="flex items-center gap-2 text-sm text-blue-300">
              <FileText size={17} />
              Billing Workflow
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Accepted Quotation → Payment → Payment Verified → Billing / Invoice → Project Handover
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 bg-[#0d111a] p-5">
          <button onClick={onClose} className="rounded-xl border border-white/10 px-5 py-2.5 text-sm hover:bg-white/5">
            Cancel
          </button>
          <button onClick={onSave} className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium hover:bg-blue-500">
            <Check size={17} />
            Save Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

function FormSection({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0d111a]">
      <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d111a] p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="mt-1 text-xl font-bold">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
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
    <div className="rounded-xl border border-white/10 bg-[#080b12] p-3">
      <p className="mb-1 text-xs text-gray-500">{label}</p>
      <p className="break-words text-sm text-gray-200">{value || "-"}</p>
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
    <div className={`flex justify-between gap-4 ${bold ? "text-base font-bold" : "text-sm text-gray-400"}`}>
      <span>{label}</span>
      <span className={value < 0 ? "text-red-300" : bold ? "text-white" : "text-gray-200"}>
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
      <label className="mb-1.5 block text-xs text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-[#080b12] px-3 py-2.5 text-sm outline-none focus:border-blue-500/50"
      />
    </div>
  );
}

