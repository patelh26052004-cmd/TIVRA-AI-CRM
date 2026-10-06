"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  FileText,
  HelpCircle,
  Package,
  MessageSquare,
  ShieldCheck,
  Edit3,
  Trash2,
  Eye,
  X,
  Save,
  Sparkles,
  CheckCircle2,
  Copy,
  Archive,
  ArchiveRestore,
  Brain,
  Tag,
  FileArchive,
  Megaphone,
  WalletCards,
  Building2,
  ListChecks,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

type KnowledgeType =
  | "Product"
  | "Feature"
  | "Pricing"
  | "FAQ"
  | "Sales Script"
  | "Objection Handling"
  | "Policy"
  | "Brochure"
  | "Company Info"
  | "Approved Template";

type KnowledgeStatus = "Approved" | "Draft";

type KnowledgeItem = {
  id: number;
  title: string;
  type: KnowledgeType;
  category: string;
  content: string;
  status: KnowledgeStatus;
  updated: string;
  aiReady: boolean;
  archived: boolean;
  tags: string[];
  sourceFile?: string;
};

const STORAGE_KEY = "tivra_knowledge_base";

const categories = [
  "All",
  "Products",
  "Features",
  "Pricing",
  "FAQs",
  "Sales",
  "Objections",
  "Policies",
  "Brochures",
  "Company",
  "Templates",
];

const typeOptions: KnowledgeType[] = [
  "Product",
  "Feature",
  "Pricing",
  "FAQ",
  "Sales Script",
  "Objection Handling",
  "Policy",
  "Brochure",
  "Company Info",
  "Approved Template",
];

const typeToCategory: Record<KnowledgeType, string> = {
  Product: "Products",
  Feature: "Features",
  Pricing: "Pricing",
  FAQ: "FAQs",
  "Sales Script": "Sales",
  "Objection Handling": "Objections",
  Policy: "Policies",
  Brochure: "Brochures",
  "Company Info": "Company",
  "Approved Template": "Templates",
};

const typeStyles: Record<KnowledgeType, string> = {
  Product:
    "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  Feature:
    "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400",
  Pricing:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  FAQ: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  "Sales Script":
    "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  "Objection Handling":
    "bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400",
  Policy:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  Brochure:
    "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
  "Company Info":
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  "Approved Template":
    "bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400",
};

const initialKnowledge: KnowledgeItem[] = [
  {
    id: 1,
    title: "TIVRA AI CRM",
    type: "Product",
    category: "Products",
    content:
      "TIVRA AI is an AI-powered sales and lead automation CRM that helps businesses manage leads, qualification, follow-ups, WhatsApp conversations, quotations and sales analytics.",
    status: "Approved",
    updated: "Today",
    aiReady: true,
    archived: false,
    tags: ["CRM", "AI", "Sales Automation"],
  },
  {
    id: 2,
    title: "Lead Qualification FAQ",
    type: "FAQ",
    category: "FAQs",
    content:
      "TIVRA AI can collect customer requirements such as name, company, product, budget, quantity, location and purchase timeline.",
    status: "Approved",
    updated: "Yesterday",
    aiReady: true,
    archived: false,
    tags: ["Leads", "Qualification", "FAQ"],
  },
  {
    id: 3,
    title: "Product Enquiry Script",
    type: "Sales Script",
    category: "Sales",
    content:
      "Hello! Thank you for contacting us. I would be happy to understand your requirement. Could you please tell me which product or service you are looking for?",
    status: "Approved",
    updated: "2 days ago",
    aiReady: true,
    archived: false,
    tags: ["Opening", "Sales", "Enquiry"],
  },
  {
    id: 4,
    title: "Quotation Policy",
    type: "Policy",
    category: "Policies",
    content:
      "AI may prepare a quotation draft, but a salesperson or administrator must approve the quotation before it is sent to the customer.",
    status: "Approved",
    updated: "3 days ago",
    aiReady: true,
    archived: false,
    tags: ["Quotation", "Approval", "Policy"],
  },
  {
    id: 5,
    title: "Company Information",
    type: "Company Info",
    category: "Company",
    content:
      "TIVRA AI provides sales automation, AI lead qualification, follow-up automation, WhatsApp sales assistance and CRM capabilities for businesses.",
    status: "Approved",
    updated: "5 days ago",
    aiReady: true,
    archived: false,
    tags: ["Company", "About", "TIVRA AI"],
  },
  {
    id: 6,
    title: "TIVRA AI Pricing Plans",
    type: "Pricing",
    category: "Pricing",
    content:
      "Pricing and plan details should be maintained here as approved business information. Do not let AI invent prices, discounts or commitments that are not present in approved pricing data.",
    status: "Draft",
    updated: "Just now",
    aiReady: false,
    archived: false,
    tags: ["Pricing", "Plans"],
  },
];

function nowLabel() {
  return new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function loadKnowledge(): KnowledgeItem[] {
  if (typeof window === "undefined") return initialKnowledge;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialKnowledge;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return initialKnowledge;

    return parsed.map((item: KnowledgeItem) => ({
      ...item,
      aiReady: Boolean(item.aiReady),
      archived: Boolean(item.archived),
      tags: Array.isArray(item.tags) ? item.tags : [],
    }));
  } catch {
    return initialKnowledge;
  }
}

function typeIcon(type: KnowledgeType) {
  switch (type) {
    case "Product":
      return <Package className="h-5 w-5" />;
    case "Feature":
      return <Sparkles className="h-5 w-5" />;
    case "Pricing":
      return <WalletCards className="h-5 w-5" />;
    case "FAQ":
      return <HelpCircle className="h-5 w-5" />;
    case "Sales Script":
      return <MessageSquare className="h-5 w-5" />;
    case "Objection Handling":
      return <AlertCircle className="h-5 w-5" />;
    case "Policy":
      return <ShieldCheck className="h-5 w-5" />;
    case "Brochure":
      return <FileArchive className="h-5 w-5" />;
    case "Company Info":
      return <Building2 className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
}

export default function KnowledgeBasePage() {
  const [items, setItems] = useState<KnowledgeItem[]>(initialKnowledge);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [viewMode, setViewMode] = useState<"active" | "archived">("active");

  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState<KnowledgeItem | null>(null);
  const [showEdit, setShowEdit] = useState<KnowledgeItem | null>(null);
  const [showDelete, setShowDelete] = useState<KnowledgeItem | null>(null);

  const [newItem, setNewItem] = useState({
    title: "",
    type: "Product" as KnowledgeType,
    category: "Products",
    content: "",
    tags: "",
    sourceFile: "",
  });

  useEffect(() => {
    setItems(loadKnowledge());
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        item.sourceFile?.toLowerCase().includes(q);

      const matchesCategory =
        category === "All" || item.category === category;

      const matchesType =
        typeFilter === "All Types" || item.type === typeFilter;

      const matchesStatus =
        statusFilter === "All Status" || item.status === statusFilter;

      const matchesArchive = viewMode === "archived" ? item.archived : !item.archived;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType &&
        matchesStatus &&
        matchesArchive
      );
    });
  }, [items, search, category, typeFilter, statusFilter, viewMode]);

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setTypeFilter("All Types");
    setStatusFilter("All Status");
  };

  const addKnowledge = () => {
    const title = newItem.title.trim();
    const content = newItem.content.trim();
    if (!title || !content) return;

    const item: KnowledgeItem = {
      id: Date.now(),
      title,
      type: newItem.type,
      category: newItem.category,
      content,
      status: "Draft",
      updated: "Just now",
      aiReady: false,
      archived: false,
      tags: newItem.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      sourceFile: newItem.sourceFile.trim() || undefined,
    };

    setItems((prev) => [item, ...prev]);
    setNewItem({
      title: "",
      type: "Product",
      category: "Products",
      content: "",
      tags: "",
      sourceFile: "",
    });
    setShowAdd(false);
    setViewMode("active");
  };

  const updateKnowledge = () => {
    if (!showEdit) return;

    if (!showEdit.title.trim() || !showEdit.content.trim()) return;

    const updatedItem: KnowledgeItem = {
      ...showEdit,
      title: showEdit.title.trim(),
      content: showEdit.content.trim(),
      updated: "Just now",
      aiReady: showEdit.status === "Approved" ? showEdit.aiReady : false,
    };

    setItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setShowEdit(null);
  };

  const deleteKnowledge = () => {
    if (!showDelete) return;

    setItems((prev) => prev.filter((item) => item.id !== showDelete.id));
    setShowDelete(null);
  };

  const approveKnowledge = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Approved",
              aiReady: true,
              archived: false,
              updated: "Just now",
            }
          : item
      )
    );
  };

  const toggleAIReady = (id: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (item.status !== "Approved") return item;

        return {
          ...item,
          aiReady: !item.aiReady,
          updated: "Just now",
        };
      })
    );
  };

  const duplicateKnowledge = (item: KnowledgeItem) => {
    const duplicate: KnowledgeItem = {
      ...item,
      id: Date.now(),
      title: `${item.title} (Copy)`,
      status: "Draft",
      aiReady: false,
      archived: false,
      updated: "Just now",
    };

    setItems((prev) => [duplicate, ...prev]);
    setViewMode("active");
  };

  const toggleArchive = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              archived: !item.archived,
              updated: "Just now",
            }
          : item
      )
    );
  };

  const editItem = (item: KnowledgeItem) => {
    setShowEdit({
      ...item,
      tags: [...item.tags],
    });
  };

  const updateNewType = (type: KnowledgeType) => {
    setNewItem((prev) => ({
      ...prev,
      type,
      category: typeToCategory[type],
    }));
  };

  const approvedCount = items.filter((item) => item.status === "Approved" && !item.archived).length;
  const draftCount = items.filter((item) => item.status === "Draft" && !item.archived).length;
  const aiReadyCount = items.filter((item) => item.status === "Approved" && item.aiReady && !item.archived).length;
  const archivedCount = items.filter((item) => item.archived).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* HEADER */}
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-orange-500" />
                <h1 className="text-2xl font-bold">Knowledge Base</h1>
              </div>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Manage the approved information used by TIVRA AI.
              </p>
            </div>

            <button
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
            >
              <Plus className="h-4 w-4" />
              Add Knowledge
            </button>
          </div>
        </div>
      </div>

      <main className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* INFO BANNER */}
        <section className="rounded-2xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-500/20 dark:bg-orange-500/10">
          <div className="flex gap-4">
            <div className="rounded-xl bg-orange-500 p-3 text-white">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-bold text-orange-900 dark:text-orange-300">
                AI Knowledge Control
              </h2>
              <p className="mt-1 max-w-4xl text-sm leading-6 text-orange-800/80 dark:text-orange-200/80">
                TIVRA AI should use approved company knowledge when answering customer questions. Draft information must be reviewed before it becomes AI-ready.
              </p>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            label="Total Knowledge"
            value={items.filter((item) => !item.archived).length}
            helper="Active knowledge records"
          />
          <StatCard
            label="Approved"
            value={approvedCount}
            helper="Approved records"
            valueClass="text-emerald-600"
          />
          <StatCard
            label="Drafts"
            value={draftCount}
            helper="Need review"
            valueClass="text-orange-600"
          />
          <StatCard
            label="AI Ready"
            value={aiReadyCount}
            helper="Available to AI"
            valueClass="text-blue-600"
          />
          <StatCard
            label="Archived"
            value={archivedCount}
            helper="Inactive records"
            valueClass="text-slate-500"
          />
        </section>

        {/* CATEGORY TABS */}
        <section className="overflow-x-auto">
          <div className="flex min-w-max gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  category === item
                    ? "bg-orange-500 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* VIEW + SEARCH + FILTER */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setViewMode("active")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${
                viewMode === "active"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Active Knowledge
            </button>

            <button
              onClick={() => setViewMode("archived")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${
                viewMode === "archived"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
              }`}
            >
              <Archive className="h-4 w-4" />
              Archived ({archivedCount})
            </button>
          </div>

          <div className="flex flex-col gap-3 xl:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, content, tags or source file..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
            >
              <option>All Types</option>
              {typeOptions.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
            >
              <option>All Status</option>
              <option>Approved</option>
              <option>Draft</option>
            </select>

            {(search || category !== "All" || typeFilter !== "All Types" || statusFilter !== "All Status") && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            )}
          </div>
        </section>

        {/* KNOWLEDGE CARDS */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <KnowledgeCard
              key={item.id}
              item={item}
              onView={() => setShowView(item)}
              onEdit={() => editItem(item)}
              onDelete={() => setShowDelete(item)}
              onApprove={() => approveKnowledge(item.id)}
              onToggleAI={() => toggleAIReady(item.id)}
              onDuplicate={() => duplicateKnowledge(item)}
              onArchive={() => toggleArchive(item.id)}
            />
          ))}
        </section>

        {filteredItems.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
            <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 font-semibold">No knowledge found</h3>
            <p className="mt-1 text-sm text-slate-500">
              Try another search, filter or add new knowledge.
            </p>
          </div>
        )}
      </main>

      {/* ADD MODAL */}
      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            {/* ADD HEADER */}
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold sm:text-xl">Add Knowledge</h2>
                  <p className="mt-1 max-w-xl text-sm text-slate-500 dark:text-slate-400">
                    Create a new knowledge record for products, FAQs, sales content, policies or company information.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAdd(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="Close add knowledge"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* ADD FORM */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              <div className="space-y-6">
                {/* BASIC INFORMATION */}
                <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                  <div className="mb-4 flex items-start gap-3">
                    <div className="rounded-lg bg-white p-2 text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Basic Information
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        Give this knowledge item a clear title and classify what type of information it contains.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <FormField label="Title" required>
                      <input
                        value={newItem.title}
                        onChange={(e) =>
                          setNewItem({ ...newItem, title: e.target.value })
                        }
                        placeholder="Example: Product Pricing"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-orange-400"
                      />
                    </FormField>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField label="Knowledge Type" required>
                        <select
                          value={newItem.type}
                          onChange={(e) =>
                            updateNewType(e.target.value as KnowledgeType)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-orange-400"
                        >
                          {typeOptions.map((type) => (
                            <option key={type}>{type}</option>
                          ))}
                        </select>
                      </FormField>

                      <FormField label="Category" required>
                        <select
                          value={newItem.category}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              category: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-orange-400"
                        >
                          {categories
                            .filter((item) => item !== "All")
                            .map((item) => (
                              <option key={item}>{item}</option>
                            ))}
                        </select>
                      </FormField>
                    </div>
                  </div>
                </section>

                {/* CONTENT */}
                <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                  <div className="mb-4 flex items-start gap-3">
                    <div className="rounded-lg bg-orange-50 p-2 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Knowledge Content
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        Add the exact information that TIVRA AI should know and use.
                      </p>
                    </div>
                  </div>

                  <FormField label="Content" required>
                    <textarea
                      value={newItem.content}
                      onChange={(e) =>
                        setNewItem({ ...newItem, content: e.target.value })
                      }
                      rows={9}
                      placeholder="Enter the approved company information, answer, sales script or policy..."
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-orange-400"
                    />
                  </FormField>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Keep the information clear, accurate and approved.</span>
                    <span>{newItem.content.length} characters</span>
                  </div>
                </section>

                {/* ORGANIZATION */}
                <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                  <div className="mb-4 flex items-start gap-3">
                    <div className="rounded-lg bg-white p-2 text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                      <Tag className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Organization & Source
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        Add tags and the source file so this knowledge can be found easily later.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField label="Tags">
                      <input
                        value={newItem.tags}
                        onChange={(e) =>
                          setNewItem({ ...newItem, tags: e.target.value })
                        }
                        placeholder="sales, crm, pricing"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-orange-400"
                      />
                      <p className="mt-1.5 text-[11px] text-slate-400">
                        Separate multiple tags with commas.
                      </p>
                    </FormField>

                    <FormField label="Source file / brochure">
                      <input
                        value={newItem.sourceFile}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            sourceFile: e.target.value,
                          })
                        }
                        placeholder="brochure.pdf"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-orange-400"
                      />
                      <p className="mt-1.5 text-[11px] text-slate-400">
                        Optional reference document name.
                      </p>
                    </FormField>
                  </div>
                </section>

                {/* AI WORKFLOW NOTICE */}
                <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <div>
                      <p className="text-sm font-bold text-amber-900 dark:text-amber-300">
                        Review before AI use
                      </p>
                      <p className="mt-1 text-xs leading-5 text-amber-800/80 dark:text-amber-200/80">
                        New knowledge will be created as <strong>Draft</strong>. After review, approve it and enable AI Ready when it should become an AI knowledge source.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* ADD FOOTER */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowAdd(false)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={addKnowledge}
                disabled={!newItem.title.trim() || !newItem.content.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Save className="h-4 w-4" />
                Add Knowledge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {showView && (
        <ModalShell
          title="Knowledge Details"
          subtitle="Review the complete knowledge record before using it with TIVRA AI."
          onClose={() => setShowView(null)}
          maxWidth="max-w-5xl"
        >
          <div>
            {/* DETAIL HEADER */}
            <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${typeStyles[showView.type]}`}>
                    {typeIcon(showView.type)}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-xl font-bold leading-tight text-slate-900 dark:text-white sm:text-2xl">
                      {showView.title}
                    </h2>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${typeStyles[showView.type]}`}>
                        {showView.type}
                      </span>
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {showView.category}
                      </span>
                      <StatusBadge status={showView.status} />
                      {showView.aiReady && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                          <Brain className="h-3.5 w-3.5" />
                          AI Ready
                        </span>
                      )}
                      {showView.archived && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          Archived
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/60 lg:min-w-[180px]">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Last updated
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {showView.updated}
                  </p>
                </div>
              </div>
            </div>

            {/* DETAIL BODY */}
            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[280px_minmax(0,1fr)]">
              {/* LEFT: METADATA */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Knowledge status</p>

                  <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Approval</span>
                      <StatusBadge status={showView.status} />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-500 dark:text-slate-400">AI availability</span>
                      <span className={`text-sm font-semibold ${showView.aiReady ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`}>
                        {showView.aiReady ? "Enabled" : "Disabled"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Record state</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {showView.archived ? "Archived" : "Active"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Category</p>
                  <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {showView.category}
                  </p>
                </div>

                {showView.tags.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tags</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {showView.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          <Tag className="h-3.5 w-3.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {showView.sourceFile && (
                  <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-500/20 dark:bg-orange-500/10">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-700 dark:text-orange-300">
                      <FileArchive className="h-4 w-4" />
                      Source file
                    </div>
                    <p className="mt-2 break-all text-sm font-medium text-orange-900 dark:text-orange-200">
                      {showView.sourceFile}
                    </p>
                  </div>
                )}
              </div>

              {/* RIGHT: CONTENT */}
              <div className="min-w-0">
                <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Knowledge Content</p>
                      <p className="mt-0.5 text-xs text-slate-400">The information stored for TIVRA AI.</p>
                    </div>
                    {showView.aiReady && (
                      <div className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                        <Brain className="h-3.5 w-3.5" />
                        AI Ready
                      </div>
                    )}
                  </div>

                  <div className="max-h-[430px] overflow-y-auto p-5 sm:p-6">
                    <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-300">
                      {showView.content}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50/70 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">AI usage</p>
                      <p className="mt-1 text-xs leading-5 text-blue-800/75 dark:text-blue-200/75">
                        {showView.status === "Approved" && showView.aiReady
                          ? "This approved record is enabled as an AI-ready knowledge source."
                          : showView.status === "Approved"
                            ? "This record is approved, but AI usage is currently disabled."
                            : "This draft is not available to TIVRA AI until it is approved."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ModalFooter>
            <button
              onClick={() => setShowView(null)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
            >
              <X className="h-4 w-4" />
              Close
            </button>
            <button
              onClick={() => {
                editItem(showView);
                setShowView(null);
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 sm:w-auto"
            >
              <Edit3 className="h-4 w-4" />
              Edit Knowledge
            </button>
          </ModalFooter>
        </ModalShell>
      )}

      {/* EDIT MODAL */}
      {showEdit && (
        <ModalShell
          title="Edit Knowledge"
          subtitle="Update the record details, source information and AI availability."
          onClose={() => setShowEdit(null)}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-5 p-5 sm:p-6">
            {/* RECORD HEADER */}
            <section className="rounded-2xl border border-orange-200 bg-orange-50/70 p-4 dark:border-orange-500/20 dark:bg-orange-500/10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${typeStyles[showEdit.type]}`}
                  >
                    {typeIcon(showEdit.type)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-orange-700 dark:text-orange-300">
                      Editing record
                    </p>
                    <p className="mt-1 truncate text-base font-bold text-slate-900 dark:text-white">
                      {showEdit.title || "Untitled knowledge"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={showEdit.status} />
                  {showEdit.aiReady && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                      <Brain className="h-3.5 w-3.5" />
                      AI Ready
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* BASIC INFORMATION */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-5">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Basic Information
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Keep the title, type and category organized so this knowledge can be found easily.
                </p>
              </div>

              <div className="space-y-4">
                <FormField label="Title" required>
                  <input
                    value={showEdit.title}
                    onChange={(e) =>
                      setShowEdit({ ...showEdit, title: e.target.value })
                    }
                    placeholder="Example: Product Pricing"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-orange-400"
                  />
                </FormField>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField label="Type" required>
                    <select
                      value={showEdit.type}
                      onChange={(e) => {
                        const type = e.target.value as KnowledgeType;
                        setShowEdit({
                          ...showEdit,
                          type,
                          category: typeToCategory[type],
                        });
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-orange-400"
                    >
                      {typeOptions.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Category" required>
                    <select
                      value={showEdit.category}
                      onChange={(e) =>
                        setShowEdit({
                          ...showEdit,
                          category: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-orange-400"
                    >
                      {categories
                        .filter((item) => item !== "All")
                        .map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                    </select>
                  </FormField>
                </div>
              </div>
            </section>

            {/* STATUS & SOURCE */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-5">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Status & Source
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Control approval and keep the source of the information visible.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Status" required>
                  <select
                    value={showEdit.status}
                    onChange={(e) => {
                      const status = e.target.value as KnowledgeStatus;
                      setShowEdit({
                        ...showEdit,
                        status,
                        aiReady:
                          status === "Approved" ? showEdit.aiReady : false,
                      });
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-orange-400"
                  >
                    <option>Draft</option>
                    <option>Approved</option>
                  </select>
                </FormField>

                <FormField label="Source file / brochure">
                  <div className="relative">
                    <FileArchive className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={showEdit.sourceFile ?? ""}
                      onChange={(e) =>
                        setShowEdit({
                          ...showEdit,
                          sourceFile: e.target.value || undefined,
                        })
                      }
                      placeholder="brochure.pdf"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-orange-400"
                    />
                  </div>
                </FormField>
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-700 dark:bg-slate-800/60">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Approved knowledge can be enabled for AI. Draft knowledge remains unavailable to AI until approved.
                </p>
              </div>
            </section>

            {/* TAGS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-5">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Tags</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Use short searchable labels separated by commas.
                </p>
              </div>

              <div className="relative">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={showEdit.tags.join(", ")}
                  onChange={(e) =>
                    setShowEdit({
                      ...showEdit,
                      tags: e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-orange-400"
                  placeholder="sales, crm, pricing"
                />
              </div>

              {showEdit.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {showEdit.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* CONTENT */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-5">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Knowledge Content
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    This is the actual information TIVRA AI will use as its knowledge source.
                  </p>
                </div>
                <span
                  className={`text-xs font-medium ${
                    showEdit.content.length > 5000
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-slate-400"
                  }`}
                >
                  {showEdit.content.length.toLocaleString()} characters
                </span>
              </div>

              <textarea
                value={showEdit.content}
                onChange={(e) =>
                  setShowEdit({
                    ...showEdit,
                    content: e.target.value,
                  })
                }
                rows={12}
                placeholder="Enter the complete knowledge content..."
                className="w-full min-h-[280px] resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-orange-400"
              />
            </section>

            {/* AI CONTROL */}
            <section className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 dark:border-blue-500/20 dark:bg-blue-500/10 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-900 dark:text-blue-300">
                      AI Availability
                    </p>
                    <p className="mt-1 text-xs leading-5 text-blue-800/70 dark:text-blue-200/70">
                      Enable this approved knowledge record for TIVRA AI responses.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={showEdit.status !== "Approved"}
                  onClick={() =>
                    setShowEdit({
                      ...showEdit,
                      aiReady: !showEdit.aiReady,
                    })
                  }
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    showEdit.aiReady
                      ? "bg-blue-600"
                      : "bg-slate-300 dark:bg-slate-700"
                  } ${
                    showEdit.status !== "Approved"
                      ? "cursor-not-allowed opacity-50"
                      : "hover:opacity-90"
                  }`}
                  aria-label="Toggle AI availability"
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                      showEdit.aiReady ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-blue-200/70 bg-white/70 p-3 dark:border-blue-500/15 dark:bg-slate-900/40">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-700/70 dark:text-blue-300/70">
                    Current status
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {showEdit.status}
                  </p>
                </div>
                <div className="rounded-xl border border-blue-200/70 bg-white/70 p-3 dark:border-blue-500/15 dark:bg-slate-900/40">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-700/70 dark:text-blue-300/70">
                    AI access
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {showEdit.aiReady ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>

              {showEdit.status !== "Approved" && (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs leading-5 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Approve this record first, then enable AI availability.</span>
                </div>
              )}
            </section>
          </div>

          <ModalFooter>
            <button
              onClick={() => setShowEdit(null)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={updateKnowledge}
              disabled={!showEdit.title.trim() || !showEdit.content.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </ModalFooter>
        </ModalShell>
      )}

      {/* DELETE MODAL */}
      {showDelete && (
        <ModalShell title="Delete knowledge?" subtitle="This action cannot be undone." onClose={() => setShowDelete(null)} maxWidth="max-w-md">
          <div className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/10">
              <Trash2 className="h-5 w-5" />
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              This will permanently remove <strong>{showDelete.title}</strong> from the current knowledge list.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowDelete(null)} className="secondary-button">
                Cancel
              </button>
              <button onClick={deleteKnowledge} className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600">
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  helper,
  valueClass = "",
}: {
  label: string;
  value: number;
  helper: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${valueClass}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: KnowledgeStatus }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        status === "Approved"
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
      }`}
    >
      {status}
    </span>
  );
}

function KnowledgeCard({
  item,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onToggleAI,
  onDuplicate,
  onArchive,
}: {
  item: KnowledgeItem;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onApprove: () => void;
  onToggleAI: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className={`rounded-xl p-3 ${typeStyles[item.type]}`}>
          {typeIcon(item.type)}
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <StatusBadge status={item.status} />
          {item.aiReady && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
              <Brain className="h-3.5 w-3.5" />
              AI Ready
            </span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-bold">{item.title}</h3>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className={`rounded-lg px-2 py-1 text-xs font-semibold ${typeStyles[item.type]}`}>
            {item.type}
          </span>
          <span className="text-xs text-slate-400">{item.category}</span>
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {item.content}
        </p>

        {item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {item.sourceFile && (
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <FileText className="h-3.5 w-3.5" />
            <span className="truncate">{item.sourceFile}</span>
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <span className="text-xs text-slate-400">Updated {item.updated}</span>

        <div className="flex items-center gap-1">
          <button onClick={onView} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" title="View">
            <Eye className="h-4 w-4" />
          </button>
          <button onClick={onEdit} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" title="Edit">
            <Edit3 className="h-4 w-4" />
          </button>
          <button onClick={onDuplicate} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" title="Duplicate">
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={onArchive}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            title={item.archived ? "Restore" : "Archive"}
          >
            {item.archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
          </button>
          <button onClick={onDelete} className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10" title="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {item.status === "Draft" && !item.archived && (
        <button onClick={onApprove} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          Approve for AI
        </button>
      )}

      {item.status === "Approved" && !item.archived && (
        <button
          onClick={onToggleAI}
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold ${
            item.aiReady
              ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          <Brain className="h-4 w-4" />
          {item.aiReady ? "AI Ready · Click to Disable" : "Enable for AI"}
        </button>
      )}
    </div>
  );
}

function ModalShell({
  title,
  subtitle,
  onClose,
  children,
  maxWidth = "max-w-xl",
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className={`flex w-full ${maxWidth} max-h-[92vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900`}>
        <div className="shrink-0 flex items-center justify-between border-b border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="relative min-h-0 flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

function ModalFooter({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/95 p-4 shadow-[0_-8px_20px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-[0_-8px_20px_rgba(0,0,0,0.18)] sm:p-5">
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {children}
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-orange-500">*</span>}
      </label>
      {children}
    </div>
  );
}
