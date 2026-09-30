"use client";

import { useMemo, useState } from "react";
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
} from "lucide-react";

type KnowledgeType =
  | "Product"
  | "FAQ"
  | "Sales Script"
  | "Policy"
  | "Company Info";

type KnowledgeItem = {
  id: number;
  title: string;
  type: KnowledgeType;
  category: string;
  content: string;
  status: "Approved" | "Draft";
  updated: string;
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
  },
];

const categories = [
  "All",
  "Products",
  "FAQs",
  "Sales",
  "Policies",
  "Company",
];

export default function KnowledgeBasePage() {
  const [items, setItems] = useState(initialKnowledge);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All Types");

  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState<KnowledgeItem | null>(null);
  const [showEdit, setShowEdit] = useState<KnowledgeItem | null>(null);
  const [showDelete, setShowDelete] = useState<KnowledgeItem | null>(null);

  const [newItem, setNewItem] = useState({
    title: "",
    type: "Product" as KnowledgeType,
    category: "Products",
    content: "",
  });

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || item.category === category;

      const matchesType =
        typeFilter === "All Types" || item.type === typeFilter;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [items, search, category, typeFilter]);

  const addKnowledge = () => {
    if (!newItem.title.trim() || !newItem.content.trim()) return;

    const item: KnowledgeItem = {
      id: Date.now(),
      title: newItem.title,
      type: newItem.type,
      category: newItem.category,
      content: newItem.content,
      status: "Draft",
      updated: "Just now",
    };

    setItems((prev) => [item, ...prev]);

    setNewItem({
      title: "",
      type: "Product",
      category: "Products",
      content: "",
    });

    setShowAdd(false);
  };

  const updateKnowledge = () => {
    if (!showEdit) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === showEdit.id ? showEdit : item
      )
    );

    setShowEdit(null);
  };

  const deleteKnowledge = () => {
    if (!showDelete) return;

    setItems((prev) =>
      prev.filter((item) => item.id !== showDelete.id)
    );

    setShowDelete(null);
  };

  const approveKnowledge = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Approved",
              updated: "Just now",
            }
          : item
      )
    );
  };

  const typeIcon = (type: KnowledgeType) => {
    if (type === "Product") {
      return <Package className="h-5 w-5" />;
    }

    if (type === "FAQ") {
      return <HelpCircle className="h-5 w-5" />;
    }

    if (type === "Sales Script") {
      return <MessageSquare className="h-5 w-5" />;
    }

    if (type === "Policy") {
      return <ShieldCheck className="h-5 w-5" />;
    }

    return <BookOpen className="h-5 w-5" />;
  };

  const typeStyle = (type: KnowledgeType) => {
    if (type === "Product") {
      return "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400";
    }

    if (type === "FAQ") {
      return "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400";
    }

    if (type === "Sales Script") {
      return "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400";
    }

    if (type === "Policy") {
      return "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400";
    }

    return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  };

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
                TIVRA AI should use approved company knowledge when answering
                customer questions. Draft information should be reviewed
                before it becomes available to the AI Sales Agent.
              </p>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500">Total Knowledge</p>
            <p className="mt-2 text-3xl font-bold">{items.length}</p>
            <p className="mt-1 text-xs text-slate-500">
              All knowledge records
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500">Approved</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {items.filter((item) => item.status === "Approved").length}
            </p>
            <p className="mt-1 text-xs text-emerald-600">
              Available to AI
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500">Drafts</p>
            <p className="mt-2 text-3xl font-bold text-orange-600">
              {items.filter((item) => item.status === "Draft").length}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Need approval
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500">Categories</p>
            <p className="mt-2 text-3xl font-bold">
              {new Set(items.map((item) => item.category)).size}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Information groups
            </p>
          </div>
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

        {/* SEARCH + FILTER */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search knowledge..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
            >
              <option>All Types</option>
              <option>Product</option>
              <option>FAQ</option>
              <option>Sales Script</option>
              <option>Policy</option>
              <option>Company Info</option>
            </select>
          </div>
        </section>

        {/* KNOWLEDGE CARDS */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`rounded-xl p-3 ${typeStyle(item.type)}`}
                >
                  {typeIcon(item.type)}
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    item.status === "Approved"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="mt-4">
                <h3 className="font-bold">{item.title}</h3>

                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`rounded-lg px-2 py-1 text-xs font-semibold ${typeStyle(
                      item.type
                    )}`}
                  >
                    {item.type}
                  </span>

                  <span className="text-xs text-slate-400">
                    {item.category}
                  </span>
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {item.content}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                <span className="text-xs text-slate-400">
                  Updated {item.updated}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowView(item)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setShowEdit({ ...item })}
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Edit"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setShowDelete(item)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {item.status === "Draft" && (
                <button
                  onClick={() => approveKnowledge(item.id)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve for AI
                </button>
              )}
            </div>
          ))}
        </section>

        {filteredItems.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
            <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 font-semibold">
              No knowledge found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try another search or add new knowledge.
            </p>
          </div>
        )}
      </main>

      {/* ADD MODAL */}
      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold">Add Knowledge</h2>
                <p className="text-sm text-slate-500">
                  Add information for the TIVRA knowledge base.
                </p>
              </div>

              <button
                onClick={() => setShowAdd(false)}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Title
                </label>

                <input
                  value={newItem.title}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      title: e.target.value,
                    })
                  }
                  placeholder="Example: Product Pricing"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Type
                  </label>

                  <select
                    value={newItem.type}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        type: e.target.value as KnowledgeType,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option>Product</option>
                    <option>FAQ</option>
                    <option>Sales Script</option>
                    <option>Policy</option>
                    <option>Company Info</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Category
                  </label>

                  <select
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        category: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option>Products</option>
                    <option>FAQs</option>
                    <option>Sales</option>
                    <option>Policies</option>
                    <option>Company</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Content
                </label>

                <textarea
                  value={newItem.content}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      content: e.target.value,
                    })
                  }
                  rows={6}
                  placeholder="Enter the approved company information..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                New knowledge will be saved as <strong>Draft</strong> until
                it is approved.
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 p-5 dark:border-slate-800">
              <button
                onClick={() => setShowAdd(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold dark:border-slate-700"
              >
                Cancel
              </button>

              <button
                onClick={addKnowledge}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
              >
                <Plus className="h-4 w-4" />
                Add Knowledge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {showView && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
            <div className="flex items-start justify-between border-b border-slate-200 p-5 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${typeStyle(
                      showView.type
                    )}`}
                  >
                    {showView.type}
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      showView.status === "Approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {showView.status}
                  </span>
                </div>

                <h2 className="mt-3 text-xl font-bold">
                  {showView.title}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {showView.category}
                </p>
              </div>

              <button
                onClick={() => setShowView(null)}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5">
              <div className="rounded-xl bg-slate-50 p-5 text-sm leading-7 text-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
                {showView.content}
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 p-5 dark:border-slate-800">
              <button
                onClick={() => setShowView(null)}
                className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEdit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold">Edit Knowledge</h2>
                <p className="text-sm text-slate-500">
                  Update the knowledge record.
                </p>
              </div>

              <button
                onClick={() => setShowEdit(null)}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Title
                </label>

                <input
                  value={showEdit.title}
                  onChange={(e) =>
                    setShowEdit({
                      ...showEdit,
                      title: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Type
                  </label>

                  <select
                    value={showEdit.type}
                    onChange={(e) =>
                      setShowEdit({
                        ...showEdit,
                        type: e.target.value as KnowledgeType,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option>Product</option>
                    <option>FAQ</option>
                    <option>Sales Script</option>
                    <option>Policy</option>
                    <option>Company Info</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Status
                  </label>

                  <select
                    value={showEdit.status}
                    onChange={(e) =>
                      setShowEdit({
                        ...showEdit,
                        status: e.target.value as "Approved" | "Draft",
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option>Draft</option>
                    <option>Approved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Content
                </label>

                <textarea
                  value={showEdit.content}
                  onChange={(e) =>
                    setShowEdit({
                      ...showEdit,
                      content: e.target.value,
                    })
                  }
                  rows={7}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 p-5 dark:border-slate-800">
              <button
                onClick={() => setShowEdit(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold dark:border-slate-700"
              >
                Cancel
              </button>

              <button
                onClick={updateKnowledge}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/10">
              <Trash2 className="h-5 w-5" />
            </div>

            <h2 className="mt-4 text-lg font-bold">
              Delete knowledge?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This will remove{" "}
              <strong>{showDelete.title}</strong> from the current
              knowledge list.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDelete(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold dark:border-slate-700"
              >
                Cancel
              </button>

              <button
                onClick={deleteKnowledge}
                className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
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