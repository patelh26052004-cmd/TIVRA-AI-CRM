"use client";

import { useMemo, useState, type ChangeEvent } from "react";
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
  Printer,
  Download,
  Palette,
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
  signatureDataUrl: string;
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
  {
    label: string;
    className: string;
  }
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
  id: Date.now() + Math.floor(Math.random() * 100000),
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
    signatureDataUrl: "",
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
    signatureDataUrl: "",
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
    signatureDataUrl: "",
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
    paymentTerms:
      "30% advance, 40% development, 30% completion",
    discount: 10000,
    tax: 18,
    notes:
      "ERP modules will be finalized during requirement discussion.",
    signatureDataUrl: "",
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
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function calculateSubtotal(items: QuotationItem[]) {
  return items.reduce(
    (total, item) =>
      total +
      Math.max(Number(item.quantity) || 0, 0) *
        Math.max(Number(item.rate) || 0, 0),
    0
  );
}

function calculateTotal(quotation: Quotation) {
  const subtotal = calculateSubtotal(quotation.items);

  const discount = Math.max(
    Number(quotation.discount) || 0,
    0
  );

  const taxable = Math.max(subtotal - discount, 0);

  const taxAmount =
    (taxable * (Number(quotation.tax) || 0)) / 100;

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
    const match = quotation.quotationNo.match(
      /QT-\d{4}-(\d+)/
    );

    if (match) {
      maxNumber = Math.max(
        maxNumber,
        Number(match[1])
      );
    }
  });

  return `QT-${new Date().getFullYear()}-${String(
    maxNumber + 1
  ).padStart(3, "0")}`;
}

type QuotationTheme =
  | "professional"
  | "premium"
  | "minimal"
  | "modern"
  | "classic";

type QuotationThemeConfig = {
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

const quotationThemes: Record<QuotationTheme, QuotationThemeConfig> = {
  professional: {
    name: "Professional Blue",
    description: "Clean corporate quotation",
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
    description: "Traditional formal quotation",
    primary: "#0f766e",
    secondary: "#134e4a",
    soft: "#f0fdfa",
    border: "#99f6e4",
    text: "#134e4a",
    muted: "#64748b",
    total: "#0f766e",
  },
};

function calculateQuotationTotals(quotation: Quotation) {
  const subtotal = calculateSubtotal(quotation.items);
  const discount = Math.min(
    Math.max(Number(quotation.discount) || 0, 0),
    subtotal
  );
  const taxable = Math.max(subtotal - discount, 0);
  const taxAmount =
    (taxable * Math.max(Number(quotation.tax) || 0, 0)) / 100;
  const total = taxable + taxAmount;

  return {
    subtotal,
    discount,
    taxable,
    taxAmount,
    total,
  };
}

function displayDate(value: string) {
  if (!value) return "-";
  const parts = value.split("-");
  if (parts.length !== 3) return value;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function createQuotationPdf(JsPDFCtor: any, quotation: Quotation, theme: QuotationTheme) {
  const doc = new JsPDFCtor({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const config = quotationThemes[theme];
  const isDark = theme === "premium";
  const pageW = 210;
  const pageH = 297;
  const margin = 10;
  const contentW = pageW - margin * 2;
  const paper = isDark ? "#111827" : "#ffffff";
  const panel = isDark ? "#182033" : config.soft;
  const ink = isDark ? "#f9fafb" : config.text;
  const muted = isDark ? "#9ca3af" : config.muted;
  const border = isDark ? "#374151" : config.border;
  const primary = config.primary;
  const totals = calculateQuotationTotals(quotation);

  const rgb = (hex: string) => {
    const value = hex.replace("#", "");
    return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16),
    };
  };

  const fill = (hex: string) => {
    const c = rgb(hex);
    doc.setFillColor(c.r, c.g, c.b);
  };
  const stroke = (hex: string) => {
    const c = rgb(hex);
    doc.setDrawColor(c.r, c.g, c.b);
  };
  const inkColor = (hex: string) => {
    const c = rgb(hex);
    doc.setTextColor(c.r, c.g, c.b);
  };
  const line = (x1: number, y1: number, x2: number, y2: number) => {
    doc.line(x1, y1, x2, y2);
  };

  fill(paper);
  doc.rect(0, 0, pageW, pageH, "F");

  // Header
  fill(panel);
  doc.roundedRect(margin, margin, contentW, 31, 3, 3, "F");
  fill(primary);
  doc.roundedRect(margin, margin + 31 - 2.2, contentW, 2.2, 1, 1, "F");

  fill(BRANDING.color);
  doc.roundedRect(margin + 5, margin + 5, 14, 14, 3, 3, "F");
  inkColor("#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(BRANDING.logoMark, margin + 12, margin + 14.5, { align: "center" });

  inkColor(ink);
  doc.setFontSize(16);
  doc.text(BRANDING.logoText, margin + 23, margin + 11);
  inkColor(BRANDING.mutedText);
  doc.setFontSize(7);
  doc.text(BRANDING.headline, margin + 23, margin + 15);

  inkColor(BRANDING.color);
  doc.setFontSize(7);
  doc.text("QUOTATION", pageW - margin, margin + 7, { align: "right" });
  inkColor(ink);
  doc.setFontSize(15);
  doc.text(quotation.quotationNo || "QT-XXXX-XXX", pageW - margin, margin + 14);
  inkColor(muted);
  doc.setFontSize(6.8);
  doc.text(`Created: ${displayDate(quotation.createdAt)}`, pageW - margin, margin + 20, { align: "right" });
  doc.text(`Valid Until: ${displayDate(quotation.validUntil)}`, pageW - margin, margin + 25.5, { align: "right" });

  // Customer + reference boxes
  const boxY = margin + 36;
  const boxH = 34;
  const gap = 4;
  const boxW = (contentW - gap) / 2;

  fill(isDark ? "#182033" : "#ffffff");
  stroke(border);
  doc.roundedRect(margin, boxY, boxW, boxH, 3, 3, "FD");
  doc.roundedRect(margin + boxW + gap, boxY, boxW, boxH, 3, 3, "FD");

  inkColor(muted);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("BILL TO", margin + 4, boxY + 7);
  inkColor(ink);
  doc.setFontSize(8.5);
  doc.text(quotation.customerName || "Customer", margin + 4, boxY + 13);
  inkColor(muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.text(quotation.company || "-", margin + 4, boxY + 18);
  doc.text(quotation.email || "-", margin + 4, boxY + 23);
  doc.text(quotation.phone || "-", margin + 4, boxY + 28);

  const refX = margin + boxW + gap;
  inkColor(muted);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("REFERENCE", refX + 4, boxY + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  const refRows = [
    ["Product / Service", quotation.product || "-"],
    ["Lead ID", String(quotation.leadId || "-")],
    ["Assigned To", employeeName(quotation.assignedEmployeeId)],
    ["Payment Terms", quotation.paymentTerms || "-"],
  ];
  refRows.forEach((row, index) => {
    const yy = boxY + 13 + index * 5.2;
    inkColor(muted);
    doc.text(row[0], refX + 4, yy);
    inkColor(ink);
    const maxWidth = boxW - 34;
    const wrapped = doc.splitTextToSize(String(row[1]), maxWidth);
    doc.text(wrapped.slice(0, 1), refX + 36, yy);
  });

  // Status bar
  const statusY = boxY + boxH + 4;
  fill(primary);
  doc.roundedRect(margin, statusY, contentW, 7, 2, 2, "F");
  inkColor("#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.text(statusConfig[quotation.status].label.toUpperCase(), margin + 4, statusY + 4.6);
  doc.text(
    quotation.assignedEmployeeId
      ? `Assigned to ${employeeName(quotation.assignedEmployeeId)}`
      : "Assignment pending",
    pageW - margin - 4,
    statusY + 4.6,
    { align: "right" }
  );

  // Items section
  let y = statusY + 12;
  inkColor(ink);
  doc.setFontSize(7);
  doc.text("ITEMS / SERVICES", margin, y);
  y += 3;

  const tableX = margin;
  const tableW = contentW;
  const headerH = 8;
  const rowH = quotation.items.length > 7 ? 7 : 8;
  const col1 = tableW * 0.50;
  const col2 = tableW * 0.12;
  const col3 = tableW * 0.18;
  const col4 = tableW * 0.20;

  fill(panel);
  stroke(border);
  doc.roundedRect(tableX, y, tableW, headerH, 3, 3, "FD");
  fill(panel);
  doc.rect(tableX, y + 3, tableW, headerH - 3, "F");
  inkColor(muted);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  doc.text("ITEM / DESCRIPTION", tableX + 3, y + 5.3);
  doc.text("QTY", tableX + col1 + 2, y + 5.3);
  doc.text("RATE", tableX + col1 + col2 + col3 - 2, y + 5.3, { align: "right" });
  doc.text("AMOUNT", tableX + tableW - 3, y + 5.3, { align: "right" });

  y += headerH;
  stroke(border);
  doc.setFont("helvetica", "normal");
  quotation.items.forEach((item, index) => {
    const rowY = y + index * rowH;
    fill(isDark ? "#111827" : "#ffffff");
    doc.rect(tableX, rowY, tableW, rowH, "F");
    stroke(border);
    line(tableX, rowY, tableX + tableW, rowY);

    inkColor(ink);
    doc.setFontSize(6.6);
    doc.setFont("helvetica", "bold");
    doc.text(item.name || "Item", tableX + 3, rowY + 3.2);
    inkColor(muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.7);
    const desc = item.description || "-";
    const shortDesc = desc.length > 58 ? `${desc.slice(0, 55)}...` : desc;
    doc.text(shortDesc, tableX + 3, rowY + 6);

    inkColor(ink);
    doc.setFontSize(6.6);
    doc.text(String(item.quantity), tableX + col1 + col2 / 2, rowY + 4.8, { align: "center" });
    doc.text(formatCurrency(item.rate), tableX + col1 + col2 + col3 - 2, rowY + 4.8, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(item.quantity * item.rate), tableX + tableW - 3, rowY + 4.8, { align: "right" });
  });
  y += quotation.items.length * rowH;
  stroke(border);
  line(tableX, y, tableX + tableW, y);
  doc.roundedRect(tableX, y - quotation.items.length * rowH - headerH, tableW, quotation.items.length * rowH + headerH, 3, 3);

  // Bottom section
  y += 5;
  const bottomW = 71;
  const leftW = contentW - bottomW - gap;
  const bottomY = y;
  const bottomH = 41;

  fill(isDark ? "#182033" : "#ffffff");
  stroke(border);
  doc.roundedRect(margin, bottomY, leftW, bottomH, 3, 3, "FD");
  fill(panel);
  doc.roundedRect(margin + leftW + gap, bottomY, bottomW, bottomH, 3, 3, "F");

  inkColor(muted);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("NOTES / TERMS", margin + 4, bottomY + 7);
  inkColor(ink);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.4);
  const noteLines = doc.splitTextToSize(
    quotation.notes || "Thank you for your business.",
    leftW - 8
  );
  doc.text(noteLines.slice(0, 5), margin + 4, bottomY + 13);
  inkColor(muted);
  doc.setFontSize(6.1);
  doc.text(`Payment Terms: ${quotation.paymentTerms || "-"}`, margin + 4, bottomY + 35);

  const sumX = margin + leftW + gap;
  const rowStart = bottomY + 7;
  const summaryRows: Array<[string, number]> = [
    ["Subtotal", totals.subtotal],
    ["Discount", -totals.discount],
    [`GST (${quotation.tax || 0}%)`, totals.taxAmount],
  ];
  summaryRows.forEach((row, index) => {
    const yy = rowStart + index * 7;
    inkColor(muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.6);
    doc.text(row[0], sumX + 4, yy);
    inkColor(ink);
    doc.text(formatCurrency(row[1]), sumX + bottomW - 4, yy, { align: "right" });
  });

  fill(primary);
  doc.roundedRect(sumX + 3, bottomY + 27, bottomW - 6, 8, 2, 2, "F");
  inkColor("#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.6);
  doc.text("GRAND TOTAL", sumX + 6, bottomY + 32.3);
  doc.text(formatCurrency(totals.total), sumX + bottomW - 6, bottomY + 32.3, { align: "right" });

  // Footer + single signature line (no full-width extra line)
  const footerY = bottomY + bottomH + 6;
  inkColor(muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.2);
  doc.text(BRANDING.logoText, margin, footerY + 3.5);
  doc.text(BRANDING.headline, margin, footerY + 7.5);
  doc.text("This is a system-generated quotation document.", margin, footerY + 11.5);

  const sigCenterX = pageW - margin - 24;
  const sigLeft = sigCenterX - 24;
  const sigRight = sigCenterX + 24;
  stroke(border);

  if (quotation.signatureDataUrl) {
    try {
      const props = doc.getImageProperties(quotation.signatureDataUrl);
      const maxW = 38;
      const maxH = 15;
      let imgW = maxW;
      let imgH = (props.height / props.width) * imgW;
      if (imgH > maxH) {
        imgH = maxH;
        imgW = (props.width / props.height) * imgH;
      }
      const imgX = sigCenterX - imgW / 2;
      const imgY = footerY - 2 - imgH;
      doc.addImage(
        quotation.signatureDataUrl,
        quotation.signatureDataUrl.toLowerCase().startsWith("data:image/png") ? "PNG" : "JPEG",
        imgX,
        imgY,
        imgW,
        imgH,
      );
    } catch {
      // Keep the signature line even if the image cannot be embedded.
    }
  }

  line(sigLeft, footerY + 7, sigRight, footerY + 7);
  inkColor(muted);
  doc.setFontSize(6.3);
  doc.text("Authorized Signature", sigCenterX, footerY + 11.5, { align: "center" });

  return doc;
}

function buildQuotationPrintHtml(quotation: Quotation, theme: QuotationTheme) {
  const config = quotationThemes[theme];
  const isDark = theme === "premium";
  const paper = isDark ? "#111827" : "#ffffff";
  const panel = isDark ? "#182033" : config.soft;
  const ink = isDark ? "#f9fafb" : config.text;
  const muted = isDark ? "#9ca3af" : config.muted;
  const border = isDark ? "#374151" : config.border;
  const primary = config.primary;
  const totals = calculateQuotationTotals(quotation);

  const escapeHtml = (value: unknown) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const itemsHtml = quotation.items
    .map(
      (item) => `
        <tr>
          <td>
            <div class="item-name">${escapeHtml(item.name || "Item")}</div>
            <div class="item-desc">${escapeHtml(item.description || "-")}</div>
          </td>
          <td class="center">${escapeHtml(item.quantity)}</td>
          <td class="right">${formatCurrency(item.rate)}</td>
          <td class="right strong">${formatCurrency(item.quantity * item.rate)}</td>
        </tr>
      `,
    )
    .join("");

  const signatureHtml = quotation.signatureDataUrl
    ? `<img class="signature-image" src="${quotation.signatureDataUrl}" alt="Authorized signature" />`
    : `<div class="signature-placeholder"></div>`;

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(quotation.quotationNo)} - TIVRA Quotation</title>
        <style>
          * { box-sizing: border-box; }
          @page { size: A4 portrait; margin: 0; }
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
          .brand-row { display:flex; align-items:center; gap:3mm; }
          .mark {
            width:14mm; height:14mm; border-radius:3mm;
            background:${BRANDING.color}; color:#fff;
            display:flex; align-items:center; justify-content:center;
            font-size:11pt; font-weight:800;
          }
          .brand-name { font-size:16pt; line-height:1; font-weight:800; letter-spacing:-.3pt; }
          .headline { margin-top:1.5mm; color:${BRANDING.mutedText}; font-size:7pt; line-height:1.25; }
          .quotation-meta { min-width:63mm; text-align:right; }
          .quotation-label { color:${BRANDING.color}; font-size:7pt; font-weight:800; letter-spacing:1.5pt; }
          .quotation-number { margin-top:1.5mm; font-size:15pt; font-weight:800; white-space:nowrap; }
          .meta-line { margin-top:1mm; color:${muted}; font-size:6.8pt; }
          .grid2 { margin-top:5mm; display:grid; grid-template-columns:1fr 1fr; gap:4mm; }
          .box {
            border:.35mm solid ${border}; border-radius:3mm; padding:4mm;
            min-width:0; background:${isDark ? "#182033" : "#fff"};
          }
          .box-title { color:${muted}; font-size:6.5pt; font-weight:800; letter-spacing:1pt; text-transform:uppercase; margin-bottom:2mm; }
          .customer { font-size:8.5pt; font-weight:800; }
          .small { margin-top:.9mm; color:${muted}; font-size:6.8pt; line-height:1.25; }
          .ref-row { display:flex; justify-content:space-between; gap:4mm; font-size:6.8pt; line-height:1.25; margin-top:1.2mm; }
          .ref-row span:first-child { color:${muted}; }
          .strong { font-weight:800; }
          .status {
            margin-top:4mm; height:7mm; border-radius:2mm; background:${primary}; color:#fff;
            padding:0 4mm; display:flex; align-items:center; justify-content:space-between;
            font-size:6.8pt; font-weight:800;
          }
          .section-title { margin:4mm 0 2mm; font-size:7pt; font-weight:800; color:${ink}; letter-spacing:.7pt; text-transform:uppercase; }
          table {
            width:100%; border-collapse:collapse; table-layout:fixed;
            border:.35mm solid ${border}; border-radius:3mm; overflow:hidden; font-size:6.6pt;
          }
          th { background:${panel}; color:${muted}; text-align:left; padding:2.4mm 3mm; font-size:6.2pt; text-transform:uppercase; letter-spacing:.6pt; }
          td { padding:2.2mm 3mm; border-top:.25mm solid ${border}; line-height:1.15; height:9mm; overflow:hidden; }
          th:nth-child(1), td:nth-child(1) { width:50%; }
          th:nth-child(2), td:nth-child(2) { width:12%; }
          th:nth-child(3), td:nth-child(3) { width:18%; }
          th:nth-child(4), td:nth-child(4) { width:20%; }
          .item-name { font-size:6.8pt; font-weight:800; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
          .item-desc { margin-top:0.7mm; color:${muted}; font-size:5.8pt; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
          .center { text-align:center; }
          .right { text-align:right; }
          .bottom-grid { margin-top:4mm; display:grid; grid-template-columns:1fr 71mm; gap:4mm; align-items:start; }
          .notes-box { min-height:41mm; }
          .summary { border:.35mm solid ${border}; border-radius:3mm; background:${panel}; padding:3.5mm; min-height:41mm; }
          .summary-row { display:flex; justify-content:space-between; gap:4mm; font-size:6.8pt; margin-top:1.6mm; }
          .summary-row:first-child { margin-top:0; }
          .summary-row .label { color:${muted}; }
          .total { margin-top:2mm; padding:2.7mm 3mm; border-radius:2mm; background:${primary}; color:#fff; display:flex; justify-content:space-between; gap:3mm; font-size:8pt; font-weight:800; }
          .terms { margin-top:2.5mm; color:${muted}; font-size:6.1pt; line-height:1.25; }
          .footer { margin-top:4mm; display:flex; justify-content:space-between; align-items:flex-end; gap:8mm; }
          .footer-copy { color:${muted}; font-size:6.5pt; line-height:1.35; }
          .footer-brand { color:${isDark ? "#f9fafb" : BRANDING.neutralText}; font-weight:800; }
          .signature { width:48mm; text-align:center; color:${muted}; font-size:6.5pt; }
          .signature-image-wrap { height:16mm; display:flex; align-items:flex-end; justify-content:center; margin-bottom:1.5mm; }
          .signature-image { max-width:38mm; max-height:14mm; object-fit:contain; display:block; }
          .signature-placeholder { height:16mm; }
          .signature-line { width:48mm; margin:0 auto 2mm; border-bottom:.35mm solid ${border}; }
          .no-break { page-break-inside:avoid; break-inside:avoid-page; }
          @media print {
            html, body { width:210mm !important; height:297mm !important; overflow:hidden !important; background:${paper} !important; }
            .page { margin:10mm auto !important; }
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
            <div class="quotation-meta">
              <div class="quotation-label">QUOTATION</div>
              <div class="quotation-number">${escapeHtml(quotation.quotationNo || "QT-XXXX-XXX")}</div>
              <div class="meta-line">Created: ${escapeHtml(displayDate(quotation.createdAt))}</div>
              <div class="meta-line">Valid Until: ${escapeHtml(displayDate(quotation.validUntil))}</div>
            </div>
          </div>

          <div class="grid2 no-break">
            <div class="box">
              <div class="box-title">Bill To</div>
              <div class="customer">${escapeHtml(quotation.customerName || "Customer")}</div>
              <div class="small">${escapeHtml(quotation.company || "-")}</div>
              <div class="small">${escapeHtml(quotation.email || "-")}</div>
              <div class="small">${escapeHtml(quotation.phone || "-")}</div>
            </div>

            <div class="box">
              <div class="box-title">Reference</div>
              <div class="ref-row"><span>Product / Service</span><strong>${escapeHtml(quotation.product || "-")}</strong></div>
              <div class="ref-row"><span>Lead ID</span><strong>${escapeHtml(String(quotation.leadId || "-"))}</strong></div>
              <div class="ref-row"><span>Assigned To</span><strong>${escapeHtml(employeeName(quotation.assignedEmployeeId))}</strong></div>
              <div class="ref-row"><span>Payment Terms</span><strong>${escapeHtml(quotation.paymentTerms || "-")}</strong></div>
            </div>
          </div>

          <div class="status no-break">
            <span>${escapeHtml(statusConfig[quotation.status].label.toUpperCase())}</span>
            <span>${quotation.assignedEmployeeId ? `Assigned to ${escapeHtml(employeeName(quotation.assignedEmployeeId))}` : "Assignment pending"}</span>
          </div>

          <div class="section-title">Items / Services</div>
          <table class="no-break">
            <thead>
              <tr>
                <th>Item / Description</th>
                <th>Qty</th>
                <th class="right">Rate</th>
                <th class="right">Amount</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <div class="bottom-grid no-break">
            <div class="box notes-box">
              <div class="box-title">Notes / Terms</div>
              <div class="small">${escapeHtml(quotation.notes || "Thank you for your business.")}</div>
              <div class="terms">Payment Terms: ${escapeHtml(quotation.paymentTerms || "-")}</div>
            </div>

            <div class="summary">
              <div class="summary-row"><span class="label">Subtotal</span><span>${formatCurrency(totals.subtotal)}</span></div>
              <div class="summary-row"><span class="label">Discount</span><span>${formatCurrency(totals.discount)}</span></div>
              <div class="summary-row"><span class="label">GST (${escapeHtml(quotation.tax)}%)</span><span>${formatCurrency(totals.taxAmount)}</span></div>
              <div class="total"><span>Grand Total</span><span>${formatCurrency(totals.total)}</span></div>
            </div>
          </div>

          <div class="footer no-break">
            <div class="footer-copy">
              <div class="footer-brand">${escapeHtml(BRANDING.logoText)}</div>
              ${escapeHtml(BRANDING.headline)}<br />
              This is a system-generated quotation document.
            </div>
            <div class="signature">
              <div class="signature-image-wrap">${signatureHtml}</div>
              <div class="signature-line"></div>
              Authorized Signature
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
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

  const [quotationTheme, setQuotationTheme] =
    useState<QuotationTheme>("professional");

  const [showQuotationPreview, setShowQuotationPreview] =
    useState(false);

  const createEmptyQuotation = (): Quotation => ({
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
    signatureDataUrl: "",
    items: [emptyItem()],
    createdAt: new Date()
      .toISOString()
      .slice(0, 10),
    versions: [],
  });

  const [form, setForm] = useState<Quotation>(
    createEmptyQuotation()
  );

  const filteredQuotations = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return quotations.filter((quotation) => {
      const matchesSearch =
        !query ||
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

      return matchesSearch && matchesStatus;
    });
  }, [
    quotations,
    search,
    statusFilter,
  ]);

  const stats = useMemo(() => {
    const total = quotations.length;

    const totalValue = quotations.reduce(
      (sum, quotation) =>
        sum + calculateTotal(quotation),
      0
    );

    const accepted = quotations.filter(
      (quotation) =>
        quotation.status === "ACCEPTED"
    ).length;

    const pending = quotations.filter(
      (quotation) =>
        [
          "DRAFT",
          "SENT",
          "UNDER_REVIEW",
          "APPROVED",
        ].includes(quotation.status)
    ).length;

    const rejected = quotations.filter(
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
      ...createEmptyQuotation(),
      quotationNo:
        getNextQuotationNumber(quotations),
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
        (item) => ({ ...item })
      ),
      versions: quotation.versions.map(
        (version) => ({ ...version })
      ),
    });

    setSelectedQuotation(null);
    setShowAddModal(false);
    setEditingQuotation(quotation);
  }

  function closeForm() {
    setShowAddModal(false);
    setEditingQuotation(null);
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

    const cleanedItems = form.items
      .filter(
        (item) =>
          item.name.trim() !== ""
      )
      .map((item) => ({
        ...item,
        quantity: Math.max(
          Number(item.quantity) || 0,
          0
        ),
        rate: Math.max(
          Number(item.rate) || 0,
          0
        ),
      }));

    if (cleanedItems.length === 0) {
      alert(
        "Please add at least one item."
      );
      return;
    }

    const today = new Date()
      .toISOString()
      .slice(0, 10);

    if (editingQuotation) {
      const updated: Quotation = {
        ...form,
        items: cleanedItems,
        discount: Math.max(
          Number(form.discount) || 0,
          0
        ),
        tax: Math.max(
          Number(form.tax) || 0,
          0
        ),
        versions:
          editingQuotation.versions.length
            ? editingQuotation.versions
            : [
                {
                  version:
                    editingQuotation.version,
                  date: today,
                  createdBy: "Current User",
                  amount:
                    calculateTotal({
                      ...form,
                      items: cleanedItems,
                    }),
                  status: form.status,
                  note: "Quotation updated",
                },
              ],
      };

      setQuotations((current) =>
        current.map((item) =>
          item.id ===
          editingQuotation.id
            ? updated
            : item
        )
      );

      setSelectedQuotation(updated);
      closeForm();
      return;
    }

    const newQuotation: Quotation = {
      ...form,
      id:
        Date.now() +
        Math.floor(
          Math.random() * 1000000
        ),
      items: cleanedItems,
      discount: Math.max(
        Number(form.discount) || 0,
        0
      ),
      tax: Math.max(
        Number(form.tax) || 0,
        0
      ),
      versions: [
        {
          version: 1,
          date: today,
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

    setSelectedQuotation(newQuotation);
    closeForm();
  }

  function duplicateQuotation(
    quotation: Quotation
  ) {
    const today = new Date()
      .toISOString()
      .slice(0, 10);

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
      id:
        Date.now() +
        Math.floor(
          Math.random() * 1000000
        ),
      quotationNo:
        getNextQuotationNumber(
          quotations
        ),
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

    setSelectedQuotation((current) =>
      current?.id === deletingQuotation.id
        ? null
        : current
    );

    setDeletingQuotation(null);
    setShowDeleteModal(false);
  }

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
      current?.id === quotationId
        ? updatedQuotation
        : current
    );
  }

  function moveToNextStatus(
    quotation: Quotation
  ) {
    const next = nextStatus(
      quotation.status
    );

    if (!next) return;

    updateStatus(
      quotation.id,
      next
    );
  }

  function openAssignModal(
    quotation: Quotation
  ) {
    setAssigningQuotation(quotation);
    setEmployeeSearch("");
    setShowAssignModal(true);
  }

  function assignEmployee(
    employeeId: number | null
  ) {
    if (!assigningQuotation) return;

    const updatedQuotation: Quotation = {
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

    setSelectedQuotation((current) =>
      current?.id ===
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
        (item) => {
          if (item.id !== itemId) {
            return item;
          }

          if (
            field === "quantity" ||
            field === "rate"
          ) {
            return {
              ...item,
              [field]: Math.max(
                Number(value) || 0,
                0
              ),
            };
          }

          return {
            ...item,
            [field]: value,
          };
        }
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
          employeeSearch
            .trim()
            .toLowerCase();

        if (!query) return true;

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


  function openQuotationPreview(quotation: Quotation) {
    setSelectedQuotation(quotation);
    setShowHistoryModal(false);
    setShowPaymentModal(false);
    setShowQuotationPreview(true);
  }

  function printQuotation(quotation: Quotation) {
    // Use a dedicated fixed-size A4 print document, matching the Billing flow.
    // This avoids printing the dashboard/page URL and prevents responsive layout clipping.
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.title = `${quotation.quotationNo} - TIVRA Quotation`;
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
      window.alert("Unable to prepare the quotation for printing. Please try again.");
      return;
    }

    printDocument.open();
    printDocument.write(buildQuotationPrintHtml(quotation, quotationTheme));
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

  async function downloadQuotationPdf(quotation: Quotation) {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = createQuotationPdf(jsPDF, quotation, quotationTheme);
      const safeName = quotation.quotationNo.replace(/[^a-zA-Z0-9-_]/g, "_");
      doc.save(`${safeName}.pdf`);
    } catch (error) {
      console.error("Unable to generate quotation PDF:", error);
      window.alert(
        "PDF generation needs the jspdf package. Run: npm install jspdf"
      );
    }
  }

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
                  array.length - 1 && (
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

      {/* FILTER */}

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
              ([value, config]) => (
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
                          <UserPlus size={16} />
                        </button>

                        <button
                          title="Print / Save PDF"
                          onClick={() => openQuotationPreview(quotation)}
                          className="p-2 rounded-lg hover:bg-orange-500/10 text-orange-400 transition"
                        >
                          <Printer size={16} />
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
                          <Trash2 size={16} />
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

      {/* VIEW DETAILS */}

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
                  setSelectedQuotation(null)
                }
                className="p-2 rounded-lg hover:bg-white/10"
              >
                <X size={20} />
              </button>

            </div>

            <div className="p-5 space-y-5">

              {/* CUSTOMER */}

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
                    className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm"
                  >
                    Move to{" "}
                    {
                      statusConfig[
                        nextStatus(
                          selectedQuotation.status
                        )!
                      ].label
                    }

                    <ChevronRight size={16} />
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
                              {item.quantity}
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

              {/* TOTAL */}

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
                  onClick={() => openQuotationPreview(selectedQuotation)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600/15 text-orange-300 hover:bg-orange-600/25 text-sm"
                >
                  <Printer size={16} />
                  Print / PDF
                </button>

                <button
                  onClick={() => downloadQuotationPdf(selectedQuotation)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm"
                >
                  <Download size={16} />
                  Save PDF
                </button>

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
                    setShowHistoryModal(true)
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
                      setShowPaymentModal(true)
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm"
                  >
                    <CreditCard size={16} />
                    Create Payment
                  </button>
                )}

                <button
                  onClick={() => {
                    setDeletingQuotation(
                      selectedQuotation
                    );
                    setShowDeleteModal(true);
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
                Accepted quotation → Payment verification → Billing / Invoice → Project Handover.

              </div>

            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT */}

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
          onClose={closeForm}
          onSave={saveQuotation}
          onAddItem={addItem}
          onUpdateItem={updateItem}
          onRemoveItem={removeItem}
        />
      )}

      {showQuotationPreview && selectedQuotation && (
        <QuotationPreviewModal
          quotation={selectedQuotation}
          theme={quotationTheme}
          onThemeChange={setQuotationTheme}
          onClose={() => setShowQuotationPreview(false)}
          onPrint={() => printQuotation(selectedQuotation)}
          onDownloadPdf={() => downloadQuotationPdf(selectedQuotation)}
        />
      )}

      {/* ASSIGN */}

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
                    setShowAssignModal(false);
                    setAssigningQuotation(null);
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
                        assigningQuotation.assignedEmployeeId ===
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

      {/* DELETE */}

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
                Are you sure you want to delete{" "}
                <span className="text-gray-300">
                  {
                    deletingQuotation.quotationNo
                  }
                </span>
                ?
              </p>

              <div className="flex justify-end gap-2 mt-6">

                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingQuotation(null);
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

      {/* HISTORY */}

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
                    setShowHistoryModal(false)
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
                  .map(
                    (version, index) => (
                      <div
                        key={`${version.version}-${version.date}-${version.note}-${index}`}
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
                    )
                  )}

              </div>

            </div>
          </div>
        )}

      {/* PAYMENT */}

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
                This accepted quotation can move to the Payment module.
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
                    setShowPaymentModal(false)
                  }
                  className="px-4 py-2 rounded-lg border border-white/10 text-sm"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    setShowPaymentModal(false);

                    alert(
                      "Payment module connection is ready."
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

/* =====================================================
   INFO BOX
===================================================== */

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

/* =====================================================
   QUOTATION FORM
===================================================== */

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
    calculateSubtotal(form.items);

  const taxable = Math.max(
    subtotal -
      Math.max(
        Number(form.discount) || 0,
        0
      ),
    0
  );

  const taxAmount =
    (taxable *
      Math.max(
        Number(form.tax) || 0,
        0
      )) /
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
                value={form.quotationNo}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    quotationNo: value,
                  }))
                }
              />

              <Input
                label="Customer Name"
                value={form.customerName}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    customerName: value,
                  }))
                }
              />

              <Input
                label="Company"
                value={form.company}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    company: value,
                  }))
                }
              />

              <Input
                label="Email"
                value={form.email}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    email: value,
                  }))
                }
              />

              <Input
                label="Phone"
                value={form.phone}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    phone: value,
                  }))
                }
              />

              <Input
                label="Product / Service"
                value={form.product}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    product: value,
                  }))
                }
              />

              <Input
                label="Lead ID"
                value={String(
                  form.leadId || ""
                )}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    leadId:
                      Number(value) || 0,
                  }))
                }
                type="number"
              />

              <Input
                label="Valid Until"
                value={form.validUntil}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    validUntil: value,
                  }))
                }
                type="date"
              />

              <div>

                <label className="block text-xs text-gray-500 mb-1.5">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      status:
                        e.target
                          .value as QuotationStatus,
                    }))
                  }
                  className="w-full bg-[#080b12] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none"
                >

                  {Object.entries(
                    statusConfig
                  ).map(
                    ([value, config]) => (
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
                  value={form.paymentTerms}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      paymentTerms:
                        e.target.value,
                    }))
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
                        Item {index + 1}
                      </span>

                      {form.items.length >
                        1 && (
                        <button
                          onClick={() =>
                            onRemoveItem(
                              item.id
                            )
                          }
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">

                      <Input
                        label="Item Name"
                        value={item.name}
                        onChange={(value) =>
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
                        onChange={(value) =>
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
                        onChange={(value) =>
                          onUpdateItem(
                            item.id,
                            "quantity",
                            Number(value)
                          )
                        }
                      />

                      <Input
                        label="Rate"
                        type="number"
                        value={String(
                          item.rate
                        )}
                        onChange={(value) =>
                          onUpdateItem(
                            item.id,
                            "rate",
                            Number(value)
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
                value={form.notes}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    notes:
                      e.target.value,
                  }))
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
                    min="0"
                    value={form.discount}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        discount:
                          Math.max(
                            Number(
                              e.target
                                .value
                            ) || 0,
                            0
                          ),
                      }))
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
                    min="0"
                    max="100"
                    value={form.tax}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        tax:
                          Math.min(
                            Math.max(
                              Number(
                                e.target
                                  .value
                              ) || 0,
                              0
                            ),
                            100
                          ),
                      }))
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

          {/* AUTHORIZED SIGNATURE */}

          <FormSection
            title="Authorized Signature"
            subtitle="Upload the signature that should appear on the customer-facing quotation."
          >
            <SignatureUpload
              value={form.signatureDataUrl || ""}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  signatureDataUrl: value,
                }))
              }
            />
          </FormSection>

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

/* =====================================================
   QUOTATION PREVIEW / PRINT / PDF
===================================================== */

function QuotationPreviewModal({
  quotation,
  theme,
  onThemeChange,
  onClose,
  onPrint,
  onDownloadPdf,
}: {
  quotation: Quotation;
  theme: QuotationTheme;
  onThemeChange: (theme: QuotationTheme) => void;
  onClose: () => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
}) {
  const config = quotationThemes[theme];
  const isDark = theme === "premium";
  const totals = calculateQuotationTotals(quotation);

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 p-3 sm:p-5 flex items-center justify-center">
      <div className="w-full max-w-7xl max-h-[95vh] overflow-hidden rounded-2xl border border-white/10 bg-[#0d111a] shadow-2xl flex flex-col">
        <div className="flex flex-col gap-4 border-b border-white/10 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-orange-400">
              <Palette size={16} />
              Customer-facing quotation
            </div>
            <h2 className="mt-1 text-xl font-bold sm:text-2xl">
              {quotation.quotationNo}
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Choose a theme, then print or save the quotation as a PDF.
            </p>
          </div>

          <button
            onClick={onClose}
            className="self-end rounded-lg p-2 hover:bg-white/10 lg:self-auto"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            {(Object.keys(quotationThemes) as QuotationTheme[]).map((key) => {
              const item = quotationThemes[key];
              return (
                <button
                  key={key}
                  onClick={() => onThemeChange(key)}
                  className={`rounded-xl border px-3 py-2 text-left transition ${
                    theme === key
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  <div className="text-sm font-semibold text-gray-100">
                    {item.name}
                  </div>
                  <div className="mt-0.5 text-[11px] text-gray-500">
                    {item.description}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mb-4 rounded-xl border border-orange-500/10 bg-orange-500/5 p-3 text-xs text-gray-400">
            <span className="font-semibold text-orange-300">Branding locked:</span>{" "}
            TIVRA logo, original orange logo color, company name and “AI Business & CRM Solutions” headline remain unchanged across all themes.
          </div>

          <div className="overflow-auto rounded-xl bg-gray-200 p-3 sm:p-5">
            <div
              className="mx-auto overflow-hidden shadow-xl"
              style={{
                width: "794px",
                minHeight: "1123px",
                backgroundColor: isDark ? "#111827" : "#ffffff",
                color: isDark ? "#f9fafb" : config.text,
                fontFamily: "Arial, Helvetica, sans-serif",
              }}
            >
              <div
                className="m-8 rounded-2xl px-7 py-6"
                style={{
                  backgroundColor: isDark ? "#182033" : config.soft,
                  borderBottom: `6px solid ${config.primary}`,
                }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-extrabold text-white"
                      style={{ backgroundColor: BRANDING.color }}
                    >
                      {BRANDING.logoMark}
                    </div>
                    <div>
                      <div className="text-[26px] font-extrabold leading-none tracking-tight">
                        {BRANDING.logoText}
                      </div>
                      <div
                        className="mt-1 text-[11px]"
                        style={{ color: BRANDING.mutedText }}
                      >
                        {BRANDING.headline}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className="text-[11px] font-extrabold tracking-[0.24em]"
                      style={{ color: BRANDING.color }}
                    >
                      QUOTATION
                    </div>
                    <div className="mt-1 text-2xl font-extrabold">
                      {quotation.quotationNo}
                    </div>
                    <div className="mt-2 text-[10px]" style={{ color: config.muted }}>
                      Created: {displayDate(quotation.createdAt)}
                    </div>
                    <div className="mt-1 text-[10px]" style={{ color: config.muted }}>
                      Valid Until: {displayDate(quotation.validUntil)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 px-8">
                <div
                  className="rounded-xl border p-4"
                  style={{
                    backgroundColor: isDark ? "#182033" : "#ffffff",
                    borderColor: config.border,
                  }}
                >
                  <div className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: config.muted }}>
                    Bill To
                  </div>
                  <div className="mt-2 text-sm font-extrabold">
                    {quotation.customerName || "Customer"}
                  </div>
                  <div className="mt-1 text-xs" style={{ color: config.muted }}>
                    {quotation.company || "-"}
                  </div>
                  <div className="mt-1 text-xs" style={{ color: config.muted }}>
                    {quotation.email || "-"}
                  </div>
                  <div className="mt-1 text-xs" style={{ color: config.muted }}>
                    {quotation.phone || "-"}
                  </div>
                </div>

                <div
                  className="rounded-xl border p-4"
                  style={{
                    backgroundColor: isDark ? "#182033" : "#ffffff",
                    borderColor: config.border,
                  }}
                >
                  <div className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: config.muted }}>
                    Reference
                  </div>
                  {[
                    ["Product / Service", quotation.product || "-"],
                    ["Lead ID", String(quotation.leadId || "-")],
                    ["Assigned To", employeeName(quotation.assignedEmployeeId)],
                    ["Payment Terms", quotation.paymentTerms || "-"],
                  ].map(([label, value]) => (
                    <div key={label} className="mt-2 flex justify-between gap-4 text-xs">
                      <span style={{ color: config.muted }}>{label}</span>
                      <span className="text-right font-semibold break-words">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="mx-8 mt-4 flex items-center justify-between rounded-xl px-4 py-2.5 text-xs font-bold text-white"
                style={{ backgroundColor: config.primary }}
              >
                <span>{statusConfig[quotation.status].label.toUpperCase()}</span>
                <span>
                  {quotation.assignedEmployeeId
                    ? `Assigned to ${employeeName(quotation.assignedEmployeeId)}`
                    : "Assignment pending"}
                </span>
              </div>

              <div className="px-8 pt-5">
                <div className="mb-2 text-xs font-extrabold uppercase tracking-wider">
                  Items / Services
                </div>
                <div className="overflow-hidden rounded-xl border" style={{ borderColor: config.border }}>
                  <table className="w-full table-fixed text-xs">
                    <thead style={{ backgroundColor: isDark ? "#182033" : config.soft }}>
                      <tr className="text-left">
                        <th className="w-[50%] px-3 py-3 text-[10px] uppercase tracking-wider" style={{ color: config.muted }}>Item / Description</th>
                        <th className="w-[12%] px-2 py-3 text-center text-[10px] uppercase tracking-wider" style={{ color: config.muted }}>Qty</th>
                        <th className="w-[18%] px-2 py-3 text-right text-[10px] uppercase tracking-wider" style={{ color: config.muted }}>Rate</th>
                        <th className="w-[20%] px-3 py-3 text-right text-[10px] uppercase tracking-wider" style={{ color: config.muted }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotation.items.map((item) => (
                        <tr key={item.id} className="border-t" style={{ borderColor: config.border }}>
                          <td className="px-3 py-3 align-top">
                            <div className="font-bold">{item.name || "Item"}</div>
                            <div className="mt-1 text-[10px]" style={{ color: config.muted }}>{item.description || "-"}</div>
                          </td>
                          <td className="px-2 py-3 text-center align-top">{item.quantity}</td>
                          <td className="px-2 py-3 text-right align-top">{formatCurrency(item.rate)}</td>
                          <td className="px-3 py-3 text-right font-bold align-top">{formatCurrency(item.quantity * item.rate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_280px] gap-4 px-8 pt-5">
                <div
                  className="rounded-xl border p-4"
                  style={{
                    backgroundColor: isDark ? "#182033" : "#ffffff",
                    borderColor: config.border,
                    minHeight: "164px",
                  }}
                >
                  <div className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: config.muted }}>
                    Notes / Terms
                  </div>
                  <div className="mt-3 text-xs leading-relaxed">
                    {quotation.notes || "Thank you for your business."}
                  </div>
                  <div className="mt-8 text-[10px]" style={{ color: config.muted }}>
                    Payment Terms: {quotation.paymentTerms || "-"}
                  </div>
                </div>

                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: isDark ? "#182033" : config.soft }}
                >
                  <div className="flex justify-between text-xs">
                    <span style={{ color: config.muted }}>Subtotal</span>
                    <span>{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="mt-3 flex justify-between text-xs">
                    <span style={{ color: config.muted }}>Discount</span>
                    <span>{formatCurrency(totals.discount)}</span>
                  </div>
                  <div className="mt-3 flex justify-between text-xs">
                    <span style={{ color: config.muted }}>GST ({quotation.tax || 0}%)</span>
                    <span>{formatCurrency(totals.taxAmount)}</span>
                  </div>
                  <div
                    className="mt-4 flex justify-between rounded-lg px-3 py-3 text-sm font-extrabold text-white"
                    style={{ backgroundColor: config.primary }}
                  >
                    <span>Grand Total</span>
                    <span>{formatCurrency(totals.total)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between gap-8 px-8 pb-8 pt-7">
                <div className="text-[10px] leading-relaxed" style={{ color: config.muted }}>
                  <div className="font-extrabold" style={{ color: isDark ? "#f9fafb" : BRANDING.neutralText }}>
                    {BRANDING.logoText}
                  </div>
                  {BRANDING.headline}
                  <br />
                  This is a system-generated quotation document.
                </div>

                <div className="w-48 text-center text-[10px]" style={{ color: config.muted }}>
                  <div className="flex h-16 items-end justify-center">
                    {quotation.signatureDataUrl ? (
                      <img
                        src={quotation.signatureDataUrl}
                        alt="Authorized Signature"
                        className="max-h-14 max-w-40 object-contain"
                      />
                    ) : null}
                  </div>
                  <div className="border-b" style={{ borderColor: config.border }} />
                  <div className="pt-2">Authorized Signature</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-white/10 bg-[#0d111a] p-4 sm:p-5">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm hover:bg-white/5"
          >
            Close
          </button>
          <button
            onClick={onPrint}
            className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-medium hover:bg-orange-500"
          >
            <Printer size={16} />
            Print Quotation
          </button>
          <button
            onClick={onDownloadPdf}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium hover:bg-blue-500"
          >
            <Download size={16} />
            Save PDF
          </button>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   AUTHORIZED SIGNATURE UPLOAD
===================================================== */

function FormSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 mb-3 text-xs text-gray-500">{subtitle}</p>
      {children}
    </section>
  );
}

function SignatureUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.alert("Please upload a PNG or JPG signature image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      window.alert("Signature image must be 2MB or smaller.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#080b12] p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold">Authorized Signature</div>
          <p className="mt-1 text-xs text-gray-500">
            Upload PNG/JPG. The signature appears in quotation preview, print and PDF.
          </p>
        </div>

        <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300 hover:bg-blue-500/20">
          <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleFileChange}
            className="hidden"
          />
          {value ? "Change Signature" : "Upload Signature"}
        </label>
      </div>

      <div className="mt-4 rounded-xl border border-dashed border-white/10 bg-black/10 p-4">
        {value ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-24 w-full items-center justify-center rounded-lg bg-white">
              <img
                src={value}
                alt="Authorized signature preview"
                className="max-h-20 max-w-[260px] object-contain"
              />
            </div>
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-lg px-3 py-2 text-xs text-red-300 hover:bg-red-500/10"
            >
              Remove Signature
            </button>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-gray-500">
            No signature uploaded. A blank signature line will be shown.
          </div>
        )}
      </div>
    </div>
  );
}

/* =====================================================
   INPUT
===================================================== */

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