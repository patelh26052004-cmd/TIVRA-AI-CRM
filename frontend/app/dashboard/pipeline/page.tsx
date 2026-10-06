"use client";

import { useEffect, useMemo, useState } from "react";
import { usePersistentState } from "@/lib/persistence";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  Copy,
  DollarSign,
  Edit3,
  Eye,
  Filter,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Trash2,
  UserRound,
  Users,
  X,
  RotateCcw,
} from "lucide-react";

type PipelineStage =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "DEMO"
  | "QUOTATION"
  | "NEGOTIATION"
  | "WON"
  | "LOST";

type Priority = "HIGH" | "MEDIUM" | "LOW";

type Employee = {
  id: number;
  name: string;
  department: string;
  role: string;
};

type Deal = {
  id: number;
  leadId: number;
  dealName: string;
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  product: string;
  source: string;
  stage: PipelineStage;
  value: number;
  probability: number;
  priority: Priority;
  assignedEmployeeId: number;
  nextFollowUp: string;
  expectedCloseDate: string;
  notes: string;
  quotationNo: string;
  quotationStatus: "NOT_CREATED" | "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED";
  quotationAmount: number;
  createdAt: string;
};

type QuotationStatus =
  | "DRAFT"
  | "SENT"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "ACCEPTED"
  | "EXPIRED"
  | "CANCELLED";

type LocalQuotationItem = {
  id: number;
  name: string;
  description: string;
  quantity: number;
  rate: number;
};

type LocalQuotationRecord = {
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
  items: LocalQuotationItem[];
  createdAt: string;
  versions: {
    version: number;
    date: string;
    createdBy: string;
    amount: number;
    status: QuotationStatus;
    note: string;
  }[];
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

const stages: {
  key: PipelineStage;
  label: string;
}[] = [
  { key: "NEW", label: "New" },
  { key: "CONTACTED", label: "Contacted" },
  { key: "QUALIFIED", label: "Qualified" },
  { key: "DEMO", label: "Demo" },
  { key: "QUOTATION", label: "Quotation" },
  { key: "NEGOTIATION", label: "Negotiation" },
  { key: "WON", label: "Won" },
  { key: "LOST", label: "Lost" },
];

const initialDeals: Deal[] = [
  {
    id: 1001,
    leadId: 101,
    dealName: "Joshi Enterprises CRM",
    company: "Joshi Enterprises",
    contactPerson: "Kunal Joshi",
    email: "kunal@joshienterprises.com",
    phone: "+91 98765 43210",
    product: "CRM Software",
    source: "Website",
    stage: "QUOTATION",
    value: 212400,
    probability: 70,
    priority: "HIGH",
    assignedEmployeeId: 1,
    nextFollowUp: "2026-09-25",
    expectedCloseDate: "2026-10-10",
    notes: "Customer requested CRM quotation and demo.",
    quotationNo: "QT-2026-001",
    quotationStatus: "SENT",
    quotationAmount: 212400,
    createdAt: "2026-09-12",
  },
  {
    id: 1002,
    leadId: 102,
    dealName: "VS Enterprises Inventory",
    company: "VS Enterprises",
    contactPerson: "Vivek Shah",
    email: "vivek@vsenterprises.com",
    phone: "+91 98250 12345",
    product: "Inventory Software",
    source: "Referral",
    stage: "NEGOTIATION",
    value: 88500,
    probability: 80,
    priority: "HIGH",
    assignedEmployeeId: 2,
    nextFollowUp: "2026-09-24",
    expectedCloseDate: "2026-09-30",
    notes: "Negotiating final pricing and support package.",
    quotationNo: "QT-2026-002",
    quotationStatus: "ACCEPTED",
    quotationAmount: 88500,
    createdAt: "2026-09-08",
  },
  {
    id: 1003,
    leadId: 103,
    dealName: "NP Boutique E-Commerce",
    company: "NP Boutique",
    contactPerson: "Nisha Patel",
    email: "nisha@npboutique.com",
    phone: "+91 98980 22334",
    product: "E-Commerce Website",
    source: "Instagram",
    stage: "WON",
    value: 106200,
    probability: 100,
    priority: "MEDIUM",
    assignedEmployeeId: 3,
    nextFollowUp: "2026-09-27",
    expectedCloseDate: "2026-09-27",
    notes: "Quotation accepted. Ready for payment and project handover.",
    quotationNo: "QT-2026-003",
    quotationStatus: "ACCEPTED",
    quotationAmount: 106200,
    createdAt: "2026-09-01",
  },
  {
    id: 1004,
    leadId: 104,
    dealName: "Pooja Healthcare Website",
    company: "Pooja Healthcare",
    contactPerson: "Pooja Patel",
    email: "pooja@poojahealthcare.com",
    phone: "+91 99090 44556",
    product: "Business Website",
    source: "Google",
    stage: "DEMO",
    value: 76700,
    probability: 55,
    priority: "MEDIUM",
    assignedEmployeeId: 5,
    nextFollowUp: "2026-09-26",
    expectedCloseDate: "2026-10-15",
    notes: "Demo scheduled. Client is reviewing website features.",
    quotationNo: "",
    quotationStatus: "NOT_CREATED",
    quotationAmount: 0,
    createdAt: "2026-09-10",
  },
  {
    id: 1005,
    leadId: 105,
    dealName: "Shree Manufacturing ERP",
    company: "Shree Manufacturing",
    contactPerson: "Amit Shah",
    email: "amit@shreemanufacturing.com",
    phone: "+91 98123 45678",
    product: "ERP Software",
    source: "LinkedIn",
    stage: "QUALIFIED",
    value: 350000,
    probability: 45,
    priority: "HIGH",
    assignedEmployeeId: 1,
    nextFollowUp: "2026-09-28",
    expectedCloseDate: "2026-11-05",
    notes: "Manufacturing ERP requirement qualified.",
    quotationNo: "",
    quotationStatus: "NOT_CREATED",
    quotationAmount: 0,
    createdAt: "2026-09-14",
  },
  {
    id: 1006,
    leadId: 106,
    dealName: "Royal Restaurant Website",
    company: "Royal Restaurant",
    contactPerson: "Rahul Mehta",
    email: "rahul@royalrestaurant.com",
    phone: "+91 98700 77889",
    product: "Restaurant Website",
    source: "Instagram",
    stage: "CONTACTED",
    value: 45000,
    probability: 25,
    priority: "LOW",
    assignedEmployeeId: 6,
    nextFollowUp: "2026-09-29",
    expectedCloseDate: "2026-10-25",
    notes: "Initial conversation completed.",
    quotationNo: "",
    quotationStatus: "NOT_CREATED",
    quotationAmount: 0,
    createdAt: "2026-09-15",
  },
  {
    id: 1007,
    leadId: 107,
    dealName: "TechWorld Computer Store",
    company: "TechWorld",
    contactPerson: "Jay Patel",
    email: "jay@techworld.com",
    phone: "+91 98244 11223",
    product: "E-Commerce Website",
    source: "Facebook",
    stage: "NEW",
    value: 95000,
    probability: 10,
    priority: "MEDIUM",
    assignedEmployeeId: 2,
    nextFollowUp: "2026-09-30",
    expectedCloseDate: "2026-11-10",
    notes: "New lead added to sales pipeline.",
    quotationNo: "",
    quotationStatus: "NOT_CREATED",
    quotationAmount: 0,
    createdAt: "2026-09-17",
  },
  {
    id: 1008,
    leadId: 108,
    dealName: "ABC Fashion Store",
    company: "ABC Fashion",
    contactPerson: "Neha Shah",
    email: "neha@abcfashion.com",
    phone: "+91 99001 22110",
    product: "E-Commerce Website",
    source: "Website",
    stage: "LOST",
    value: 125000,
    probability: 0,
    priority: "LOW",
    assignedEmployeeId: 3,
    nextFollowUp: "",
    expectedCloseDate: "2026-09-20",
    notes: "Client selected another vendor.",
    quotationNo: "QT-2026-004",
    quotationStatus: "REJECTED",
    quotationAmount: 125000,
    createdAt: "2026-08-25",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getEmployee(id: number) {
  return employees.find((employee) => employee.id === id);
}

function getStageLabel(stage: PipelineStage) {
  return stages.find((item) => item.key === stage)?.label || stage;
}

function getStageColor(stage: PipelineStage) {
  switch (stage) {
    case "NEW":
      return "bg-slate-500/10 text-slate-300 border-slate-500/20";
    case "CONTACTED":
      return "bg-blue-500/10 text-blue-300 border-blue-500/20";
    case "QUALIFIED":
      return "bg-cyan-500/10 text-cyan-300 border-cyan-500/20";
    case "DEMO":
      return "bg-purple-500/10 text-purple-300 border-purple-500/20";
    case "QUOTATION":
      return "bg-yellow-500/10 text-yellow-300 border-yellow-500/20";
    case "NEGOTIATION":
      return "bg-orange-500/10 text-orange-300 border-orange-500/20";
    case "WON":
      return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
    case "LOST":
      return "bg-red-500/10 text-red-300 border-red-500/20";
    default:
      return "bg-slate-500/10 text-slate-300 border-slate-500/20";
  }
}

function getPriorityColor(priority: Priority) {
  switch (priority) {
    case "HIGH":
      return "text-red-400";
    case "MEDIUM":
      return "text-yellow-400";
    case "LOW":
      return "text-slate-400";
  }
}

function clampProbability(value: number) {
  return Math.min(Math.max(Number(value) || 0, 0), 100);
}

function mapDealQuotationStatus(status: Deal["quotationStatus"]): QuotationStatus | null {
  switch (status) {
    case "DRAFT":
      return "DRAFT";
    case "SENT":
      return "SENT";
    case "ACCEPTED":
      return "ACCEPTED";
    case "REJECTED":
      return "REJECTED";
    case "NOT_CREATED":
    default:
      return null;
  }
}

function mapQuotationStatusToDeal(status: QuotationStatus): Deal["quotationStatus"] | null {
  switch (status) {
    case "DRAFT":
      return "DRAFT";
    case "SENT":
      return "SENT";
    case "ACCEPTED":
      return "ACCEPTED";
    case "REJECTED":
      return "REJECTED";
    default:
      return null;
  }
}

function calculateQuotationRecordTotal(quotation: LocalQuotationRecord) {
  const subtotal = quotation.items.reduce(
    (sum, item) =>
      sum + Math.max(Number(item.quantity) || 0, 0) * Math.max(Number(item.rate) || 0, 0),
    0
  );
  const taxable = Math.max(subtotal - Math.max(Number(quotation.discount) || 0, 0), 0);
  return taxable + (taxable * Math.max(Number(quotation.tax) || 0, 0)) / 100;
}

function getNextQuotationNumber(records: LocalQuotationRecord[]) {
  let maxNumber = 0;
  records.forEach((record) => {
    const match = record.quotationNo.match(/QT-\d{4}-(\d+)/);
    if (match) maxNumber = Math.max(maxNumber, Number(match[1]));
  });
  return `QT-${new Date().getFullYear()}-${String(maxNumber + 1).padStart(3, "0")}`;
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export default function SalesPipelinePage() {
  const [deals, setDeals] = usePersistentState<Deal[]>("tivra_pipeline", initialDeals);
  const [quotationRecords, setQuotationRecords] =
    usePersistentState<LocalQuotationRecord[]>("tivra_quotations", []);

  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<"ALL" | PipelineStage>("ALL");
  const [employeeFilter, setEmployeeFilter] = useState<number | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<"ALL" | Priority>("ALL");

  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showQuotationModal, setShowQuotationModal] = useState(false);

  const [assignEmployeeId, setAssignEmployeeId] = useState<number>(1);
  const [quotationForm, setQuotationForm] = useState({
    quotationNo: "",
    quotationStatus: "NOT_CREATED" as Deal["quotationStatus"],
    quotationAmount: "",
  });

  const [form, setForm] = useState({
    dealName: "",
    company: "",
    contactPerson: "",
    email: "",
    phone: "",
    product: "",
    source: "Website",
    stage: "NEW" as PipelineStage,
    value: "",
    probability: "10",
    priority: "MEDIUM" as Priority,
    assignedEmployeeId: "1",
    nextFollowUp: "",
    expectedCloseDate: "",
    notes: "",
  });

  const filteredDeals = useMemo(() => {
    const query = search.toLowerCase().trim();

    return deals.filter((deal) => {
      const matchesSearch =
        !query ||
        deal.dealName.toLowerCase().includes(query) ||
        deal.company.toLowerCase().includes(query) ||
        deal.contactPerson.toLowerCase().includes(query) ||
        deal.product.toLowerCase().includes(query) ||
        String(deal.id).includes(query);

      const matchesStage =
        stageFilter === "ALL" || deal.stage === stageFilter;

      const matchesEmployee =
        employeeFilter === "ALL" ||
        deal.assignedEmployeeId === employeeFilter;

      const matchesPriority =
        priorityFilter === "ALL" || deal.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStage &&
        matchesEmployee &&
        matchesPriority
      );
    });
  }, [deals, search, stageFilter, employeeFilter, priorityFilter]);

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);

  const activeDeals = deals.filter(
    (deal) => deal.stage !== "WON" && deal.stage !== "LOST"
  );

  const wonDeals = deals.filter((deal) => deal.stage === "WON");

  const pipelineValue = activeDeals.reduce(
    (sum, deal) => sum + deal.value,
    0
  );

  const weightedValue = activeDeals.reduce(
    (sum, deal) => sum + deal.value * (deal.probability / 100),
    0
  );

  const conversion =
    deals.length > 0
      ? Math.round((wonDeals.length / deals.length) * 100)
      : 0;

  useEffect(() => {
    if (!quotationRecords.length) return;

    const quotationByLead = new Map(
      quotationRecords.map((quotation) => [quotation.leadId, quotation])
    );

    setDeals((current) => {
      let changed = false;

      const nextDeals = current.map((deal) => {
        const quotation = quotationByLead.get(deal.leadId);
        if (!quotation) return deal;

        const nextQuotationStatus: Deal["quotationStatus"] =
          quotation.status === "ACCEPTED"
            ? "ACCEPTED"
            : quotation.status === "REJECTED"
              ? "REJECTED"
              : quotation.status === "SENT"
                ? "SENT"
                : quotation.status === "DRAFT"
                  ? "DRAFT"
                  : deal.quotationStatus;

        const nextStage =
          nextQuotationStatus === "ACCEPTED" &&
          deal.stage !== "WON" &&
          deal.stage !== "LOST"
            ? "NEGOTIATION"
            : deal.stage;

        if (
          deal.quotationNo === quotation.quotationNo &&
          deal.quotationStatus === nextQuotationStatus &&
          deal.quotationAmount === Math.round(calculateQuotationRecordTotal(quotation)) &&
          deal.stage === nextStage
        ) {
          return deal;
        }

        changed = true;
        return {
          ...deal,
          quotationNo: quotation.quotationNo,
          quotationStatus: nextQuotationStatus,
          quotationAmount: Math.round(calculateQuotationRecordTotal(quotation)),
          stage: nextStage,
        };
      });

      return changed ? nextDeals : current;
    });

  }, [quotationRecords, setDeals]);

  function resetFilters() {
    setSearch("");
    setStageFilter("ALL");
    setEmployeeFilter("ALL");
    setPriorityFilter("ALL");
  }

  function resetForm() {
    setForm({
      dealName: "",
      company: "",
      contactPerson: "",
      email: "",
      phone: "",
      product: "",
      source: "Website",
      stage: "NEW",
      value: "",
      probability: "10",
      priority: "MEDIUM",
      assignedEmployeeId: "1",
      nextFollowUp: "",
      expectedCloseDate: "",
      notes: "",
    });
  }

  function openAddModal() {
    resetForm();
    setShowAddModal(true);
  }

  function openEditModal(deal: Deal) {
    setSelectedDeal(deal);

    setForm({
      dealName: deal.dealName,
      company: deal.company,
      contactPerson: deal.contactPerson,
      email: deal.email,
      phone: deal.phone,
      product: deal.product,
      source: deal.source,
      stage: deal.stage,
      value: String(deal.value),
      probability: String(deal.probability),
      priority: deal.priority,
      assignedEmployeeId: String(deal.assignedEmployeeId),
      nextFollowUp: deal.nextFollowUp,
      expectedCloseDate: deal.expectedCloseDate,
      notes: deal.notes,
    });

    setShowEditModal(true);
  }

  function openViewModal(deal: Deal) {
    setSelectedDeal(deal);
    setShowViewModal(true);
  }

  function openAssignModal(deal: Deal) {
    setSelectedDeal(deal);
    setAssignEmployeeId(deal.assignedEmployeeId);
    setShowAssignModal(true);
  }

  function openDeleteModal(deal: Deal) {
    setSelectedDeal(deal);
    setShowDeleteModal(true);
  }

  function openQuotationModal(deal: Deal) {
    setSelectedDeal(deal);

    const linkedQuotation = quotationRecords.find(
      (quotation) =>
        quotation.leadId === deal.leadId ||
        (deal.quotationNo && quotation.quotationNo === deal.quotationNo)
    );

    const linkedStatus = linkedQuotation
      ? mapQuotationStatusToDeal(linkedQuotation.status)
      : null;

    setQuotationForm({
      quotationNo: linkedQuotation?.quotationNo || deal.quotationNo,
      quotationStatus: linkedStatus || deal.quotationStatus,
      quotationAmount: linkedQuotation
        ? String(Math.round(calculateQuotationRecordTotal(linkedQuotation)))
        : String(deal.quotationAmount || deal.value),
    });
    setShowQuotationModal(true);
  }

  function saveQuotationConnection() {
    if (!selectedDeal) return;

    const status = quotationForm.quotationStatus;
    const quotationNo = quotationForm.quotationNo.trim();
    const quotationAmount = Math.max(
      Number(quotationForm.quotationAmount) || 0,
      0
    );

    if (status !== "NOT_CREATED" && !quotationNo) {
      alert("Please enter Quotation Number.");
      return;
    }

    let amount = quotationAmount || selectedDeal.value;
    const mappedStatus = mapDealQuotationStatus(status);

    if (mappedStatus) {
      const quotationNumberConflict = quotationRecords.some(
        (quotation) =>
          quotation.quotationNo === quotationNo &&
          quotation.leadId !== selectedDeal.leadId
      );

      if (quotationNumberConflict) {
        alert("This quotation number is already linked to another lead.");
        return;
      }

      const existingQuotation = quotationRecords.find(
        (quotation) =>
          quotation.leadId === selectedDeal.leadId ||
          quotation.quotationNo === quotationNo
      );

      if (existingQuotation) {
        const existingTotal = Math.round(
          calculateQuotationRecordTotal(existingQuotation)
        );
        if (existingQuotation.items?.length && existingTotal > 0) {
          amount = existingTotal;
        }
        setQuotationRecords((current) =>
          current.map((quotation) =>
            quotation.id === existingQuotation.id
              ? {
                  ...quotation,
                  quotationNo,
                  customerName: selectedDeal.contactPerson || selectedDeal.company,
                  company: selectedDeal.company,
                  email: selectedDeal.email,
                  phone: selectedDeal.phone,
                  product: selectedDeal.product,
                  assignedEmployeeId: selectedDeal.assignedEmployeeId,
                  status: mappedStatus,
                  validUntil: quotation.validUntil || selectedDeal.expectedCloseDate,
                  discount: quotation.discount || 0,
                  tax: quotation.tax || 18,
                  notes: selectedDeal.notes,
                  items: quotation.items?.length
                    ? quotation.items
                    : [
                        {
                          id: Date.now(),
                          name: selectedDeal.product || "Project / Service",
                          description: selectedDeal.notes || "Sales pipeline quotation",
                          quantity: 1,
                          rate: amount,
                        },
                      ],
                }
              : quotation
          )
        );
      } else {
        const createdAt = todayString();
        const newQuotation: LocalQuotationRecord = {
          id: Date.now(),
          quotationNo,
          version: 1,
          leadId: selectedDeal.leadId,
          customerName: selectedDeal.contactPerson || selectedDeal.company,
          company: selectedDeal.company,
          email: selectedDeal.email,
          phone: selectedDeal.phone,
          product: selectedDeal.product,
          assignedEmployeeId: selectedDeal.assignedEmployeeId,
          status: mappedStatus,
          validUntil: selectedDeal.expectedCloseDate,
          paymentTerms: "50% advance, 50% after completion",
          discount: 0,
          tax: 18,
          notes: selectedDeal.notes || "Created from Sales Pipeline.",
          signatureDataUrl: "",
          items: [
            {
              id: Date.now() + 1,
              name: selectedDeal.product || "Project / Service",
              description: selectedDeal.notes || "Sales pipeline quotation",
              quantity: 1,
              rate: amount,
            },
          ],
          createdAt,
          versions: [
            {
              version: 1,
              date: createdAt,
              createdBy: "Current User",
              amount,
              status: mappedStatus,
              note: `Created from ${selectedDeal.dealName} in Sales Pipeline`,
            },
          ],
        };

        setQuotationRecords((current) => [newQuotation, ...current]);
      }
    }

    const updatedDeal: Deal = {
      ...selectedDeal,
      quotationNo: status === "NOT_CREATED" ? "" : quotationNo,
      quotationStatus: status,
      quotationAmount: status === "NOT_CREATED" ? 0 : amount,
      stage:
        status === "ACCEPTED" &&
        selectedDeal.stage !== "WON" &&
        selectedDeal.stage !== "LOST"
          ? "NEGOTIATION"
          : selectedDeal.stage,
    };

    setDeals((current) =>
      current.map((deal) =>
        deal.id === selectedDeal.id ? updatedDeal : deal
      )
    );

    setSelectedDeal(updatedDeal);
    setShowQuotationModal(false);
  }

  function saveNewDeal() {
    const safeValue = Math.max(Number(form.value) || 0, 0);

    if (!form.dealName.trim() || !form.company.trim() || safeValue <= 0) {
      alert("Please fill Deal Name, Company and a Deal Value greater than 0.");
      return;
    }

    const newDeal: Deal = {
      id: Math.floor(Math.random() * 9000) + 2000,
      leadId: Math.floor(Math.random() * 9000) + 1000,
      dealName: form.dealName.trim(),
      company: form.company.trim(),
      contactPerson: form.contactPerson.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      product: form.product.trim(),
      source: form.source.trim() || "Website",
      stage: form.stage,
      value: safeValue,
      probability: clampProbability(Number(form.probability)),
      priority: form.priority,
      assignedEmployeeId: Number(form.assignedEmployeeId) || 1,
      nextFollowUp: form.nextFollowUp,
      expectedCloseDate: form.expectedCloseDate,
      notes: form.notes.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
      quotationNo: "",
      quotationStatus: "NOT_CREATED",
      quotationAmount: 0
    };

    setDeals((current) => [newDeal, ...current]);
    setShowAddModal(false);
    resetForm();
  }

  function saveEditDeal() {
    if (!selectedDeal) return;

    const safeValue = Math.max(Number(form.value) || 0, 0);

    if (!form.dealName.trim() || !form.company.trim() || safeValue <= 0) {
      alert("Please fill Deal Name, Company and a Deal Value greater than 0.");
      return;
    }

    const safeProbability = clampProbability(Number(form.probability));

    setDeals((current) =>
      current.map((deal) =>
        deal.id === selectedDeal.id
          ? {
              ...deal,
              dealName: form.dealName.trim(),
              company: form.company.trim(),
              contactPerson: form.contactPerson.trim(),
              email: form.email.trim(),
              phone: form.phone.trim(),
              product: form.product.trim(),
              source: form.source.trim() || "Website",
              stage: form.stage,
              value: safeValue,
              probability: safeProbability,
              priority: form.priority,
              assignedEmployeeId: Number(form.assignedEmployeeId) || 1,
              nextFollowUp: form.nextFollowUp,
              expectedCloseDate: form.expectedCloseDate,
              notes: form.notes.trim(),
            }
          : deal
      )
    );

    setSelectedDeal((current) =>
      current
        ? {
            ...current,
            dealName: form.dealName.trim(),
            company: form.company.trim(),
            contactPerson: form.contactPerson.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            product: form.product.trim(),
            source: form.source.trim() || "Website",
            stage: form.stage,
            value: safeValue,
            probability: safeProbability,
            priority: form.priority,
            assignedEmployeeId: Number(form.assignedEmployeeId) || 1,
            nextFollowUp: form.nextFollowUp,
            expectedCloseDate: form.expectedCloseDate,
            notes: form.notes.trim(),
          }
        : current
    );

    setShowEditModal(false);
  }

  function duplicateDeal(deal: Deal) {
    const nextDealId = Math.max(...deals.map((item) => item.id), 1000) + 1;
    const nextLeadId = Math.max(...deals.map((item) => item.leadId), 1000) + 1;

    const duplicatedDeal: Deal = {
      ...deal,
      id: nextDealId,
      leadId: nextLeadId,
      dealName: `${deal.dealName} - Copy`,
      stage: "NEW",
      probability: 10,
      nextFollowUp: "",
      expectedCloseDate: "",
      quotationNo: "",
      quotationStatus: "NOT_CREATED",
      quotationAmount: 0,
      createdAt: todayString(),
    };

    setDeals((current) => [duplicatedDeal, ...current]);
  }

  function deleteDeal() {
    if (!selectedDeal) return;

    setDeals((current) =>
      current.filter((deal) => deal.id !== selectedDeal.id)
    );

    setShowDeleteModal(false);
    setSelectedDeal(null);
  }

  function updateStage(dealId: number, stage: PipelineStage) {
    setDeals((current) =>
      current.map((deal) => {
        if (deal.id !== dealId) return deal;

        let probability = deal.probability;

        if (stage === "NEW") probability = 10;
        if (stage === "CONTACTED") probability = 20;
        if (stage === "QUALIFIED") probability = 40;
        if (stage === "DEMO") probability = 55;
        if (stage === "QUOTATION") probability = 70;
        if (stage === "NEGOTIATION") probability = 80;
        if (stage === "WON") probability = 100;
        if (stage === "LOST") probability = 0;

        return {
          ...deal,
          stage,
          probability,
        };
      })
    );

    setSelectedDeal((current) =>
      current
        ? {
            ...current,
            stage,
            probability:
              stage === "NEW"
                ? 10
                : stage === "CONTACTED"
                  ? 20
                  : stage === "QUALIFIED"
                    ? 40
                    : stage === "DEMO"
                      ? 55
                      : stage === "QUOTATION"
                        ? 70
                        : stage === "NEGOTIATION"
                          ? 80
                          : stage === "WON"
                            ? 100
                            : 0,
          }
        : current
    );
  }

  function saveAssignment() {
    if (!selectedDeal) return;

    setDeals((current) =>
      current.map((deal) =>
        deal.id === selectedDeal.id
          ? {
              ...deal,
              assignedEmployeeId: assignEmployeeId,
            }
          : deal
      )
    );

    setSelectedDeal((current) =>
      current
        ? {
            ...current,
            assignedEmployeeId: assignEmployeeId,
          }
        : current
    );

    setShowAssignModal(false);
  }

  function moveToNextStage(deal: Deal) {
    const currentIndex = stages.findIndex(
      (stage) => stage.key === deal.stage
    );

    if (currentIndex < 0 || currentIndex >= stages.length - 2) {
      return;
    }

    const nextStage = stages[currentIndex + 1].key;
    updateStage(deal.id, nextStage);
  }

  return (
    <div className="min-h-screen bg-[#07090f] text-white">
      <div className="mx-auto max-w-[1600px] px-5 py-6">
        {/* HEADER */}
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
              <BriefcaseBusiness size={14} />
              <span>Sales</span>
              <span>›</span>
              <span>Sales Pipeline</span>
            </div>

            <h1 className="text-2xl font-bold">Sales Pipeline</h1>

            <p className="mt-1 text-sm text-slate-400">
              Manage deals from new lead to won or lost.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-purple-500"
          >
            <Plus size={17} />
            Add Deal
          </button>
        </div>

        {/* STATS */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard
            icon={<BriefcaseBusiness size={18} />}
            label="Total Deals"
            value={String(deals.length)}
          />

          <StatCard
            icon={<DollarSign size={18} />}
            label="Total Deal Value"
            value={formatCurrency(totalValue)}
          />

          <StatCard
            icon={<Users size={18} />}
            label="Active Deals"
            value={String(activeDeals.length)}
          />

          <StatCard
            icon={<DollarSign size={18} />}
            label="Pipeline Value"
            value={formatCurrency(pipelineValue)}
          />

          <StatCard
            icon={<Check size={18} />}
            label="Won Conversion"
            value={`${conversion}%`}
          />
        </div>

        {/* PIPELINE WORKFLOW */}
        <div className="mb-6 rounded-xl border border-slate-800 bg-[#0c1018] p-5">
          <div className="mb-4 flex flex-col justify-between gap-2 md:flex-row md:items-center">
            <div>
              <h2 className="text-sm font-semibold">Sales Workflow</h2>
              <p className="mt-1 text-xs text-slate-500">
                Lead → Sales → Quotation → Payment → Billing → Project
              </p>
            </div>

            <div className="text-xs text-slate-400">
              Weighted Pipeline:{" "}
              <span className="font-semibold text-purple-400">
                {formatCurrency(weightedValue)}
              </span>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {stages.map((stage, index) => {
              const count = deals.filter(
                (deal) => deal.stage === stage.key
              ).length;

              return (
                <div key={stage.key} className="flex min-w-[135px] items-center">
                  <div
                    className={`w-full rounded-lg border px-3 py-3 ${
                      stage.key === "WON"
                        ? "border-emerald-500/20 bg-emerald-500/5"
                        : stage.key === "LOST"
                          ? "border-red-500/20 bg-red-500/5"
                          : "border-slate-800 bg-[#0a0d14]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {stage.label}
                      </span>

                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                        {count}
                      </span>
                    </div>
                  </div>

                  {index < stages.length - 1 && (
                    <ArrowRight
                      size={15}
                      className="mx-2 shrink-0 text-slate-700"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FILTERS */}
        <div className="mb-5 rounded-xl border border-slate-800 bg-[#0c1018] p-3">
          <div className="flex flex-col gap-3 xl:flex-row">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search deal, company, contact, product..."
                className="w-full rounded-lg border border-slate-800 bg-[#080b11] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500/50"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <FilterSelect
                value={stageFilter}
                onChange={(value) =>
                  setStageFilter(value as "ALL" | PipelineStage)
                }
                options={[
                  { value: "ALL", label: "All Stages" },
                  ...stages.map((stage) => ({
                    value: stage.key,
                    label: stage.label,
                  })),
                ]}
              />

              <FilterSelect
                value={employeeFilter}
                onChange={(value) =>
                  setEmployeeFilter(
                    value === "ALL" ? "ALL" : Number(value)
                  )
                }
                options={[
                  { value: "ALL", label: "All Employees" },
                  ...employees.map((employee) => ({
                    value: employee.id,
                    label: employee.name,
                  })),
                ]}
              />

              <FilterSelect
                value={priorityFilter}
                onChange={(value) =>
                  setPriorityFilter(value as "ALL" | Priority)
                }
                options={[
                  { value: "ALL", label: "All Priority" },
                  { value: "HIGH", label: "High" },
                  { value: "MEDIUM", label: "Medium" },
                  { value: "LOW", label: "Low" },
                ]}
              />

              <button
                type="button"
                onClick={resetFilters}
                title="Reset all filters"
                className="flex items-center gap-2 rounded-lg border border-slate-800 bg-[#080b11] px-3 py-2.5 text-xs text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-slate-200"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0c1018]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Deal
                  </th>

                  <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Company
                  </th>

                  <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Product
                  </th>

                  <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Assigned
                  </th>

                  <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Value
                  </th>

                  <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Probability
                  </th>

                  <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Stage
                  </th>

                  <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Quotation
                  </th>

                  <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Follow-up
                  </th>

                  <th className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredDeals.map((deal) => {
                  const employee = getEmployee(deal.assignedEmployeeId);

                  return (
                    <tr
                      key={deal.id}
                      className="border-b border-slate-800/70 transition hover:bg-white/[0.015]"
                    >
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-semibold text-white">
                            {deal.dealName}
                          </div>

                          <div className="mt-1 text-[11px] text-slate-600">
                            Deal #{deal.id} • Lead #{deal.leadId}
                          </div>

                          <div
                            className={`mt-2 text-[11px] ${getPriorityColor(
                              deal.priority
                            )}`}
                          >
                            {deal.priority} PRIORITY
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="text-sm text-slate-200">
                          {deal.company}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          {deal.contactPerson}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="text-sm text-slate-300">
                          {deal.product}
                        </div>

                        <div className="mt-1 text-[11px] text-slate-600">
                          {deal.source}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <button
                          onClick={() => openAssignModal(deal)}
                          className="flex items-center gap-2 rounded-lg px-1 py-1 text-left transition hover:bg-slate-800"
                        >
                          <Avatar name={employee?.name || "Unassigned"} />

                          <div>
                            <div className="text-xs text-slate-300">
                              {employee?.name || "Unassigned"}
                            </div>

                            <div className="text-[10px] text-slate-600">
                              {employee?.department || "—"}
                            </div>
                          </div>
                        </button>
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-semibold text-white">
                          {formatCurrency(deal.value)}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="w-24">
                          <div className="mb-1 flex justify-between text-[10px]">
                            <span className="text-slate-500">
                              Probability
                            </span>
                            <span className="text-slate-300">
                              {deal.probability}%
                            </span>
                          </div>

                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                            <div
                              className="h-full rounded-full bg-purple-500"
                              style={{
                                width: `${deal.probability}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${getStageColor(
                            deal.stage
                          )}`}
                        >
                          {getStageLabel(deal.stage)}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <button
                          onClick={() => openQuotationModal(deal)}
                          className="text-left"
                          title="Manage quotation connection"
                        >
                          <div className="text-xs font-medium text-slate-300">
                            {deal.quotationNo || "Create Quotation"}
                          </div>
                          <div className={`mt-1 text-[10px] ${
                            deal.quotationStatus === "ACCEPTED"
                              ? "text-emerald-400"
                              : deal.quotationStatus === "SENT"
                                ? "text-yellow-400"
                                : deal.quotationStatus === "REJECTED"
                                  ? "text-red-400"
                                  : "text-slate-600"
                          }`}>
                            {deal.quotationStatus === "NOT_CREATED"
                              ? "Not created"
                              : deal.quotationStatus}
                          </div>
                        </button>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <CalendarDays size={13} />
                          {deal.nextFollowUp || "—"}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-1">
                          <ActionButton
                            title="View"
                            onClick={() => openViewModal(deal)}
                          >
                            <Eye size={15} />
                          </ActionButton>

                          <ActionButton
                            title="Edit"
                            onClick={() => openEditModal(deal)}
                          >
                            <Edit3 size={15} />
                          </ActionButton>

                          <ActionButton
                            title="Duplicate / New Deal"
                            onClick={() => duplicateDeal(deal)}
                          >
                            <Copy size={15} />
                          </ActionButton>

                          <ActionButton
                            title="Assign Employee"
                            onClick={() => openAssignModal(deal)}
                          >
                            <UserRound size={15} />
                          </ActionButton>

                          <ActionButton
                            title="Delete"
                            danger
                            onClick={() => openDeleteModal(deal)}
                          >
                            <Trash2 size={15} />
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredDeals.length === 0 && (
              <div className="px-6 py-16 text-center">
                <BriefcaseBusiness
                  size={30}
                  className="mx-auto mb-3 text-slate-700"
                />

                <h3 className="text-sm font-medium text-slate-300">
                  No deals found
                </h3>

                <p className="mt-1 text-xs text-slate-600">
                  Try changing your search or filters.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* VIEW MODAL */}
        {showViewModal && selectedDeal && (
          <Modal
            title="Deal Details"
            subtitle={`Deal #${selectedDeal.id}`}
            onClose={() => setShowViewModal(false)}
            width="max-w-3xl"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <InfoBox label="Deal Name" value={selectedDeal.dealName} />
              <InfoBox label="Company" value={selectedDeal.company} />
              <InfoBox
                label="Contact Person"
                value={selectedDeal.contactPerson}
              />
              <InfoBox label="Product" value={selectedDeal.product} />
              <InfoBox label="Deal Value" value={formatCurrency(selectedDeal.value)} />
              <InfoBox
                label="Expected Close"
                value={selectedDeal.expectedCloseDate || "—"}
              />
              <InfoBox label="Source" value={selectedDeal.source} />
              <InfoBox
                label="Assigned Employee"
                value={
                  getEmployee(selectedDeal.assignedEmployeeId)?.name ||
                  "Unassigned"
                }
              />
              <InfoBox
                label="Quotation No."
                value={selectedDeal.quotationNo || "Not created"}
              />
              <InfoBox
                label="Quotation Status"
                value={selectedDeal.quotationStatus.replace("_", " ")}
              />
              <InfoBox
                label="Quotation Amount"
                value={
                  selectedDeal.quotationAmount
                    ? formatCurrency(selectedDeal.quotationAmount)
                    : "—"
                }
              />
            </div>

            <div className="mt-5 rounded-lg border border-slate-800 bg-[#090c12] p-4">
              <div className="mb-3 text-xs font-semibold text-slate-300">
                Current Stage
              </div>

              <div className="flex flex-wrap gap-2">
                {stages.map((stage) => (
                  <button
                    key={stage.key}
                    onClick={() =>
                      updateStage(selectedDeal.id, stage.key)
                    }
                    className={`rounded-lg border px-3 py-2 text-xs transition ${
                      selectedDeal.stage === stage.key
                        ? "border-purple-500 bg-purple-500/10 text-purple-300"
                        : "border-slate-800 bg-[#0c1018] text-slate-500 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    {stage.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <InfoBox
                label="Probability"
                value={`${selectedDeal.probability}%`}
              />

              <InfoBox
                label="Priority"
                value={selectedDeal.priority}
              />

              <InfoBox
                label="Next Follow-up"
                value={selectedDeal.nextFollowUp || "—"}
              />
            </div>

            <div className="mt-4 rounded-lg border border-slate-800 bg-[#090c12] p-4">
              <div className="mb-2 text-xs font-semibold text-slate-300">
                Notes
              </div>

              <p className="text-sm leading-6 text-slate-500">
                {selectedDeal.notes || "No notes added."}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              {selectedDeal.stage !== "WON" &&
                selectedDeal.stage !== "LOST" && (
                  <button
                    onClick={() => moveToNextStage(selectedDeal)}
                    className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold hover:bg-purple-500"
                  >
                    Move to Next Stage
                  </button>
                )}

              <button
                onClick={() => openQuotationModal(selectedDeal)}
                className="rounded-lg bg-yellow-600 px-4 py-2 text-xs font-semibold hover:bg-yellow-500"
              >
                {selectedDeal.quotationStatus === "NOT_CREATED"
                  ? "Create Quotation"
                  : "Manage Quotation"}
              </button>

              <button
                onClick={() => {
                  setShowViewModal(false);
                  openEditModal(selectedDeal);
                }}
                className="rounded-lg border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800"
              >
                Edit Deal
              </button>

              <button
                onClick={() => {
                  setShowViewModal(false);
                  openAssignModal(selectedDeal);
                }}
                className="rounded-lg border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800"
              >
                Assign Employee
              </button>
            </div>
          </Modal>
        )}

        {/* ADD MODAL */}
        {showAddModal && (
          <Modal
            title="Add New Deal"
            subtitle="Create a new opportunity in the sales pipeline."
            onClose={() => setShowAddModal(false)}
            width="max-w-4xl"
          >
            <DealForm
              form={form}
              setForm={setForm}
              onCancel={() => setShowAddModal(false)}
              onSave={saveNewDeal}
              saveText="Create Deal"
            />
          </Modal>
        )}

        {/* EDIT MODAL */}
        {showEditModal && selectedDeal && (
          <Modal
            title="Edit Deal"
            subtitle={`Update Deal #${selectedDeal.id}`}
            onClose={() => setShowEditModal(false)}
            width="max-w-4xl"
          >
            <DealForm
              form={form}
              setForm={setForm}
              onCancel={() => setShowEditModal(false)}
              onSave={saveEditDeal}
              saveText="Save Changes"
            />
          </Modal>
        )}

        {/* ASSIGN EMPLOYEE MODAL */}
        {showAssignModal && selectedDeal && (
          <Modal
            title="Assign Employee"
            subtitle={`Assign an employee to ${selectedDeal.dealName}`}
            onClose={() => setShowAssignModal(false)}
            width="max-w-lg"
          >
            <div className="space-y-3">
              {employees.map((employee) => {
                const selected = assignEmployeeId === employee.id;

                return (
                  <button
                    key={employee.id}
                    onClick={() => setAssignEmployeeId(employee.id)}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
                      selected
                        ? "border-purple-500/50 bg-purple-500/10"
                        : "border-slate-800 bg-[#090c12] hover:border-slate-700"
                    }`}
                  >
                    <Avatar name={employee.name} />

                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-200">
                        {employee.name}
                      </div>

                      <div className="mt-0.5 text-xs text-slate-600">
                        {employee.department} • {employee.role}
                      </div>
                    </div>

                    {selected && (
                      <div className="rounded-full bg-purple-500 p-1">
                        <Check size={13} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowAssignModal(false)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                onClick={saveAssignment}
                className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold hover:bg-purple-500"
              >
                Save Assignment
              </button>
            </div>
          </Modal>
        )}

        {/* QUOTATION CONNECTION MODAL */}
        {showQuotationModal && selectedDeal && (
          <Modal
            title="Quotation Connection"
            subtitle={`Connect quotation with ${selectedDeal.dealName}`}
            onClose={() => setShowQuotationModal(false)}
            width="max-w-xl"
          >
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
              <div className="text-xs text-yellow-300">Sales Workflow</div>
              <div className="mt-1 text-sm text-slate-300">
                Lead → Sales Pipeline → Quotation
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-slate-800 bg-[#090c12] p-3 text-xs leading-5 text-slate-500">
              Saving here keeps the quotation linked to this deal and creates/updates the same quotation in the Quotations module.
            </div>

            <div className="mt-5 grid gap-4">
              <FormInput
                label="Quotation Number"
                value={quotationForm.quotationNo}
                onChange={(value) =>
                  setQuotationForm((current) => ({
                    ...current,
                    quotationNo: value,
                  }))
                }
                placeholder="QT-2026-001"
              />

              <FormSelect
                label="Quotation Status"
                value={quotationForm.quotationStatus}
                onChange={(value) =>
                  setQuotationForm((current) => ({
                    ...current,
                    quotationStatus: value as Deal["quotationStatus"],
                  }))
                }
                options={[
                  { value: "NOT_CREATED", label: "Not Created" },
                  { value: "DRAFT", label: "Draft" },
                  { value: "SENT", label: "Sent" },
                  { value: "ACCEPTED", label: "Accepted" },
                  { value: "REJECTED", label: "Rejected" },
                ]}
              />

              <FormInput
                label="Quotation Amount"
                value={quotationForm.quotationAmount}
                onChange={(value) =>
                  setQuotationForm((current) => ({
                    ...current,
                    quotationAmount: value.replace(/\D/g, ""),
                  }))
                }
                placeholder="50000"
                type="number"
              />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowQuotationModal(false)}
                className="rounded-lg border border-slate-700 px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                onClick={saveQuotationConnection}
                className="rounded-lg bg-yellow-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-yellow-500"
              >
                Save & Sync Quotation
              </button>
            </div>
          </Modal>
        )}

        {/* DELETE MODAL */}
        {showDeleteModal && selectedDeal && (
          <Modal
            title="Delete Deal"
            subtitle="This action will remove the deal from the current pipeline."
            onClose={() => setShowDeleteModal(false)}
            width="max-w-md"
          >
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
              <p className="text-sm text-slate-300">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-white">
                  {selectedDeal.dealName}
                </span>
                ?
              </p>

              <p className="mt-2 text-xs text-slate-600">
                Deal #{selectedDeal.id} • {selectedDeal.company}
              </p>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                onClick={deleteDeal}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold hover:bg-red-500"
              >
                Delete Deal
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#0c1018] p-4">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
        {icon}
      </div>

      <div className="text-xl font-bold text-white">{value}</div>

      <div className="mt-1 text-[11px] text-slate-600">{label}</div>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-[10px] font-semibold text-purple-300">
      {initials}
    </div>
  );
}

function ActionButton({
  children,
  title,
  onClick,
  danger = false,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
        danger
          ? "border-transparent text-slate-600 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
          : "border-transparent text-slate-500 hover:border-slate-800 hover:bg-slate-800 hover:text-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string | number;
  onChange: (value: string) => void;
  options: {
    value: string | number;
    label: string;
  }[];
}) {
  return (
    <div className="relative">
      <select
        value={String(value)}
        onChange={(event) => onChange(event.target.value)}
        className="appearance-none rounded-lg border border-slate-800 bg-[#080b11] py-2.5 pl-3 pr-8 text-xs text-slate-300 outline-none focus:border-purple-500/50"
      >
        {options.map((option) => (
          <option
            key={String(option.value)}
            value={String(option.value)}
          >
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={13}
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-600"
      />
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
    <div className="rounded-lg border border-slate-800 bg-[#090c12] p-3">
      <div className="text-[10px] uppercase tracking-wide text-slate-600">
        {label}
      </div>

      <div className="mt-1 text-sm font-medium text-slate-200">
        {value}
      </div>
    </div>
  );
}

function Modal({
  title,
  subtitle,
  onClose,
  children,
  width = "max-w-2xl",
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        className={`max-h-[90vh] w-full ${width} overflow-y-auto rounded-2xl border border-slate-800 bg-[#0c1018] shadow-2xl`}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-800 bg-[#0c1018] px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-white">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-200"
          >
            <X size={17} />
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function DealForm({
  form,
  setForm,
  onCancel,
  onSave,
  saveText,
}: {
  form: {
    dealName: string;
    company: string;
    contactPerson: string;
    email: string;
    phone: string;
    product: string;
    source: string;
    stage: PipelineStage;
    value: string;
    probability: string;
    priority: Priority;
    assignedEmployeeId: string;
    nextFollowUp: string;
    expectedCloseDate: string;
    notes: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      dealName: string;
      company: string;
      contactPerson: string;
      email: string;
      phone: string;
      product: string;
      source: string;
      stage: PipelineStage;
      value: string;
      probability: string;
      priority: Priority;
      assignedEmployeeId: string;
      nextFollowUp: string;
      expectedCloseDate: string;
      notes: string;
    }>
  >;
  onCancel: () => void;
  onSave: () => void;
  saveText: string;
}) {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormInput
          label="Deal Name *"
          value={form.dealName}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              dealName: value,
            }))
          }
          placeholder="e.g. ABC CRM Project"
        />

        <FormInput
          label="Company *"
          value={form.company}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              company: value,
            }))
          }
          placeholder="Company name"
        />

        <FormInput
          label="Contact Person"
          value={form.contactPerson}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              contactPerson: value,
            }))
          }
          placeholder="Contact name"
        />

        <FormInput
          label="Product / Service"
          value={form.product}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              product: value,
            }))
          }
          placeholder="CRM / Website / ERP..."
        />

        <FormInput
          label="Email"
          value={form.email}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              email: value,
            }))
          }
          placeholder="customer@example.com"
          type="email"
        />

        <FormInput
          label="Phone"
          value={form.phone}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              phone: value,
            }))
          }
          placeholder="+91..."
        />

        <FormInput
          label="Deal Value *"
          value={form.value}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              value: value.replace(/\D/g, ""),
            }))
          }
          placeholder="50000"
          type="number"
        />

        <FormInput
          label="Probability %"
          value={form.probability}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              probability: String(clampProbability(Number(value.replace(/\D/g, "")))),
            }))
          }
          placeholder="50"
          type="number"
        />

        <FormSelect
          label="Stage"
          value={form.stage}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              stage: value as PipelineStage,
            }))
          }
          options={stages.map((stage) => ({
            value: stage.key,
            label: stage.label,
          }))}
        />

        <FormSelect
          label="Priority"
          value={form.priority}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              priority: value as Priority,
            }))
          }
          options={[
            { value: "HIGH", label: "High" },
            { value: "MEDIUM", label: "Medium" },
            { value: "LOW", label: "Low" },
          ]}
        />

        <FormSelect
          label="Assigned Employee"
          value={form.assignedEmployeeId}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              assignedEmployeeId: value,
            }))
          }
          options={employees.map((employee) => ({
            value: String(employee.id),
            label: employee.name,
          }))}
        />

        <FormInput
          label="Lead Source"
          value={form.source}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              source: value,
            }))
          }
          placeholder="Website / Referral / Instagram"
        />

        <FormInput
          label="Next Follow-up"
          value={form.nextFollowUp}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              nextFollowUp: value,
            }))
          }
          type="date"
        />

        <FormInput
          label="Expected Close Date"
          value={form.expectedCloseDate}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              expectedCloseDate: value,
            }))
          }
          type="date"
        />
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-medium text-slate-400">
          Notes
        </label>

        <textarea
          value={form.notes}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              notes: event.target.value,
            }))
          }
          rows={4}
          placeholder="Add deal notes..."
          className="w-full resize-none rounded-lg border border-slate-800 bg-[#090c12] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-700 focus:border-purple-500/50"
        />
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="rounded-lg border border-slate-700 px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800"
        >
          Cancel
        </button>

        <button
          onClick={onSave}
          className="rounded-lg bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-purple-500"
        >
          {saveText}
        </button>
      </div>
    </div>
  );
}

function FormInput({
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
      <label className="mb-1.5 block text-xs font-medium text-slate-400">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-800 bg-[#090c12] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-700 focus:border-purple-500/50"
      />
    </div>
  );
}

function FormSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-400">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-800 bg-[#090c12] px-3 py-2.5 text-sm text-white outline-none focus:border-purple-500/50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}