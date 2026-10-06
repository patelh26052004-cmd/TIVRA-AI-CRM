"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Search,
  Trash2,
  Plus,
  MessageSquare,
  BarChart3,
  Users,
  FileText,
  CalendarDays,
  Target,
  ArrowUpRight,
  Copy,
  Check,
  X,
  Settings2,
  Lightbulb,
  RefreshCw,
  MoreHorizontal,
} from "lucide-react";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  time: string;
};

type ChatSession = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
};

const suggestions = [
  {
    title: "Sales summary",
    prompt: "Give me a summary of my sales performance this month.",
    icon: BarChart3,
  },
  {
    title: "Hot leads",
    prompt: "Which leads should my sales team contact first?",
    icon: Target,
  },
  {
    title: "Follow-ups",
    prompt: "Show me the follow-ups that need attention today.",
    icon: CalendarDays,
  },
  {
    title: "Quotations",
    prompt: "Which quotations need follow-up from the sales team?",
    icon: FileText,
  },
  {
    title: "Team performance",
    prompt: "How is my sales team performing against targets?",
    icon: Users,
  },
  {
    title: "Lead conversion",
    prompt: "Explain my current lead conversion performance.",
    icon: Sparkles,
  },
];

const seedSessions: ChatSession[] = [
  {
    id: "CHAT-001",
    title: "Sales performance",
    createdAt: "Today",
    updatedAt: "10 min ago",
    messages: [
      {
        id: "M-001",
        role: "user",
        content: "Give me a quick sales summary.",
        time: "10:20 AM",
      },
      {
        id: "M-002",
        role: "assistant",
        content:
          "Your demo data shows strong activity across leads and quotations. Revenue is being generated consistently, while a few hot leads and pending follow-ups need attention. I can break this down by salesperson, source, stage, or date range.",
        time: "10:20 AM",
      },
    ],
  },
  {
    id: "CHAT-002",
    title: "Hot lead analysis",
    createdAt: "Yesterday",
    updatedAt: "Yesterday",
    messages: [
      {
        id: "M-003",
        role: "user",
        content: "Which leads need immediate attention?",
        time: "Yesterday",
      },
      {
        id: "M-004",
        role: "assistant",
        content:
          "Prioritize hot leads with recent engagement, overdue follow-ups, or quotation activity. In your CRM demo data, these signals can be reviewed in Lead CRM, AI Lead Scoring, and Follow-ups.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: "CHAT-003",
    title: "Quotation follow-up",
    createdAt: "Sep 30",
    updatedAt: "Sep 30",
    messages: [
      {
        id: "M-005",
        role: "user",
        content: "Help me decide which quotations to follow up.",
        time: "Sep 30",
      },
      {
        id: "M-006",
        role: "assistant",
        content:
          "Start with quotations that were recently viewed, are close to expiry, or belong to high-intent leads. You can use the Quotations and Follow-ups modules to act on these opportunities.",
        time: "Sep 30",
      },
    ],
  },
];

function nowLabel() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function loadSessions(): ChatSession[] {
  if (typeof window === "undefined") return seedSessions;

  try {
    const raw = localStorage.getItem("tivra_ai_chats");
    if (!raw) return seedSessions;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : seedSessions;
  } catch {
    return seedSessions;
  }
}

function detectLanguage(prompt: string): "gu" | "hi" | "en" {
  // Automatic detection for native Gujarati / Hindi scripts.
  if (/[\u0A80-\u0AFF]/.test(prompt)) return "gu";
  if (/[\u0900-\u097F]/.test(prompt)) return "hi";

  // Lightweight detection for Roman Gujarati / Hindi, useful for mixed CRM language.
  const text = prompt.toLowerCase().replace(/[^a-z\s]/g, " ");
  const words = new Set(text.split(/\s+/).filter(Boolean));

  const gujaratiWords = [
    "mara", "mari", "maru", "mare", "mane", "maru", "tamara", "tamari",
    "tamne", "ketla", "ketli", "ketlu", "che", "chhe", "shu", "su", "aaje",
    "kaale", "kaya", "kayi", "kai", "kem", "kyaare", "batavo", "batav", "karo",
    "karvu", "karva", "joie", "joiy", "maate", "mate", "pan", "ane", "sathe",
    "nathi", "thase", "thay", "thai", "padse", "joiye", "aapsho", "aapo",
  ];

  const hindiWords = [
    "mera", "meri", "mere", "mujhe", "aapka", "aapki", "aapke", "kitna", "kitni",
    "kitne", "kya", "aaj", "kal", "kaun", "kaunsi", "kaunsa", "kaise", "dikhao",
    "batao", "bataiye", "chahiye", "karna", "karne", "karo", "hai", "hain", "mein",
    "ke", "ki", "ka", "aur", "se", "liye", "par", "ho", "raha", "rahi", "rahe",
    "karen", "dijiye", "pending", "turant",
  ];

  let guScore = 0;
  let hiScore = 0;

  for (const word of words) {
    if (gujaratiWords.includes(word)) guScore += 1;
    if (hindiWords.includes(word)) hiScore += 1;
  }

  if (guScore > hiScore && guScore > 0) return "gu";
  if (hiScore > guScore && hiScore > 0) return "hi";
  return "en";
}

function assistantReply(prompt: string) {
  const p = prompt.toLowerCase();
  const language = detectLanguage(prompt);

  const intent =
    p.includes("sales") || p.includes("revenue")
      ? "sales"
      : p.includes("hot") || p.includes("lead")
        ? "lead"
        : p.includes("follow") || p.includes("ફોલો") || p.includes("फॉलो")
          ? "follow"
          : p.includes("quotation") || p.includes("quote") || p.includes("ક્વોટ") || p.includes("कोट")
            ? "quotation"
            : p.includes("team") || p.includes("performance") || p.includes("salesperson")
              ? "team"
              : p.includes("appointment") || p.includes("meeting") || p.includes("મીટિંગ") || p.includes("मीटिंग")
                ? "appointment"
                : "general";

  // English stays aligned with the original frontend behavior.
  if (language === "en") {
    if (intent === "sales") {
      return "From the current frontend demo data, sales activity is healthy across leads, quotations and won opportunities. Open AI Analytics for the detailed revenue trend and funnel, or Sales Team to review individual performance. I can also explain a specific metric.";
    }

    if (intent === "lead") {
      return "For lead prioritization, focus first on hot leads with recent engagement, active follow-ups, quotation activity, or strong AI scores. Use Lead CRM and AI Lead Scoring to inspect the individual lead details before contacting them.";
    }

    if (intent === "follow") {
      return "Check Follow-ups for tasks due today or overdue. A practical order is: overdue hot-lead follow-ups, quotation follow-ups, then routine reminders. The current app can track the status and owner of each follow-up.";
    }

    if (intent === "quotation") {
      return "Start with quotations that have recent customer activity, are awaiting a response, or are nearing expiry. The Quotations module can be used to view details, update status, and continue the follow-up workflow.";
    }

    if (intent === "team") {
      return "Use Sales Team to compare leads, target progress, revenue, conversion and won deals by salesperson. Employees & Roles can be used to manage access and responsibilities.";
    }

    if (intent === "appointment") {
      return "For customer meetings, review Appointments for today's schedule, status, reminders and rescheduling needs. You can then use the related customer or lead record for follow-up actions.";
    }

    return "I can help you understand TIVRA CRM data, sales activity, leads, follow-ups, quotations, appointments, team performance and workflow. Ask a specific question and I’ll give you a focused answer based on the current frontend demo context.";
  }

  if (language === "gu") {
    if (intent === "sales") {
      return "Current frontend demo data pramane tamari sales activity leads, quotations ane won opportunities ma active che. Detailed revenue trend ane funnel mate AI Analytics kholo, athva salesperson-wise performance mate Sales Team kholo. Tame koi specific metric pan puchhi shako cho.";
    }

    if (intent === "lead") {
      return "Lead priority mate pehla hot leads par focus karo, khas kari ne recent engagement, active follow-up, quotation activity athva strong AI score vala leads. Individual details check karva Lead CRM ane AI Lead Scoring use karo.";
    }

    if (intent === "follow") {
      return "Aaje due athva overdue tasks check karva Follow-ups module kholo. Practical order: overdue hot-lead follow-ups, quotation follow-ups ane pachi routine reminders. Aa app ma follow-up nu status ane owner track kari shako cho.";
    }

    if (intent === "quotation") {
      return "Recent customer activity vala, response ni wait ma hoy athva expiry najik hoy te quotations thi follow-up sharu karo. Quotations module thi details joi, status update kari ane follow-up workflow continue kari shako cho.";
    }

    if (intent === "team") {
      return "Sales Team ma salesperson pramane leads, target progress, revenue, conversion ane won deals compare kari shako cho. Employees & Roles thi access ane responsibilities manage kari shako cho.";
    }

    if (intent === "appointment") {
      return "Customer meetings mate Appointments module ma aaj nu schedule, status, reminders ane rescheduling needs check karo. Pachhi related customer athva lead record mathi follow-up action lai shako cho.";
    }

    return "Hu tamne TIVRA CRM na leads, sales, follow-ups, quotations, appointments, team performance ane workflow vishe help kari shaku chu. Tamaro question naturally Gujarati athva Gujarati-English mix ma pucho.";
  }

  // Hindi
  if (intent === "sales") {
    return "Current frontend demo data ke hisaab se aapki sales activity leads, quotations aur won opportunities mein active hai. Detailed revenue trend aur funnel ke liye AI Analytics kholiye, ya salesperson-wise performance ke liye Sales Team dekhiye. Aap kisi specific metric ke baare mein bhi pooch sakte hain.";
  }

  if (intent === "lead") {
    return "Lead priority ke liye sabse pehle un hot leads par focus kijiye jahan recent engagement, active follow-ups, quotation activity ya strong AI score hai. Individual details check karne ke liye Lead CRM aur AI Lead Scoring use kijiye.";
  }

  if (intent === "follow") {
    return "Aaj ke due ya overdue tasks dekhne ke liye Follow-ups module check kijiye. Practical order: overdue hot-lead follow-ups, quotation follow-ups aur uske baad routine reminders. App mein follow-up ka status aur owner track kiya ja sakta hai.";
  }

  if (intent === "quotation") {
    return "Sabse pehle un quotations ka follow-up kijiye jahan recent customer activity hui hai, response pending hai ya expiry nazdeek hai. Quotations module se details dekhkar status update aur follow-up workflow continue kar sakte hain.";
  }

  if (intent === "team") {
    return "Sales Team mein salesperson ke hisaab se leads, target progress, revenue, conversion aur won deals dekh sakte hain. Employees & Roles se access aur responsibilities manage ki ja sakti hain.";
  }

  if (intent === "appointment") {
    return "Customer meetings ke liye Appointments module mein aaj ka schedule, status, reminders aur rescheduling needs check kijiye. Uske baad related customer ya lead record se follow-up action le sakte hain.";
  }

  return "Main TIVRA CRM ke leads, sales, follow-ups, quotations, appointments, team performance aur workflow mein help kar sakta hoon. Aap apna sawaal naturally Hindi ya Hindi-English mix mein pooch sakte hain.";
}

export default function AskTivraAIPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [typing, setTyping] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [compact, setCompact] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loaded = loadSessions();
    setSessions(loaded);
    setSelectedId(loaded[0]?.id || "");
  }, []);

  useEffect(() => {
    if (sessions.length) {
      localStorage.setItem("tivra_ai_chats", JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [sessions, selectedId, autoScroll, typing]);

  const selected = sessions.find((s) => s.id === selectedId) || null;

  const filteredSessions = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return sessions;
    return sessions.filter(
      (session) =>
        session.title.toLowerCase().includes(q) ||
        session.messages.some((msg) => msg.content.toLowerCase().includes(q))
    );
  }, [sessions, search]);

  const createSession = () => {
    const id = `CHAT-${Date.now()}`;
    const session: ChatSession = {
      id,
      title: "New conversation",
      createdAt: "Just now",
      updatedAt: "Just now",
      messages: [],
    };

    setSessions((current) => [session, ...current]);
    setSelectedId(id);
    setMessage("");
  };

  const clearSelectedChat = () => {
    if (!selected) return;

    const confirmed = window.confirm("Clear this conversation?");
    if (!confirmed) return;

    setSessions((current) =>
      current.map((session) =>
        session.id === selected.id
          ? {
              ...session,
              messages: [],
              title: "New conversation",
              updatedAt: "Just now",
            }
          : session
      )
    );
  };

  const deleteSelectedChat = () => {
    if (!selected) return;

    const confirmed = window.confirm("Delete this conversation?");
    if (!confirmed) return;

    const remaining = sessions.filter((session) => session.id !== selected.id);
    setSessions(remaining);
    setSelectedId(remaining[0]?.id || "");
  };

  const sendMessage = (textOverride?: string) => {
    const text = (textOverride ?? message).trim();
    if (!text || typing) return;

    let sessionId = selectedId;

    if (!sessionId) {
      const id = `CHAT-${Date.now()}`;
      const newSession: ChatSession = {
        id,
        title: text.slice(0, 34) || "New conversation",
        createdAt: "Just now",
        updatedAt: "Just now",
        messages: [],
      };
      setSessions((current) => [newSession, ...current]);
      setSelectedId(id);
      sessionId = id;
    }

    const userMessage: ChatMessage = {
      id: `M-${Date.now()}`,
      role: "user",
      content: text,
      time: nowLabel(),
    };

    setSessions((current) =>
      current.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              title:
                session.messages.length === 0
                  ? text.slice(0, 34)
                  : session.title,
              messages: [...session.messages, userMessage],
              updatedAt: "Just now",
            }
          : session
      )
    );

    setMessage("");
    setTyping(true);

    window.setTimeout(() => {
      const reply: ChatMessage = {
        id: `M-${Date.now()}-AI`,
        role: "assistant",
        content: assistantReply(text),
        time: nowLabel(),
      };

      setSessions((current) =>
        current.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                messages: [...session.messages, reply],
                updatedAt: "Just now",
              }
            : session
        )
      );
      setTyping(false);
    }, 700);
  };

  const copyMessage = async (msg: ChatMessage) => {
    try {
      await navigator.clipboard.writeText(msg.content);
      setCopiedId(msg.id);
      window.setTimeout(() => setCopiedId(null), 1500);
    } catch {
      alert("Could not copy this message.");
    }
  };

  return (
    <div className="min-h-screen bg-[#070c1b] text-white">
      <div className="flex min-h-[calc(100vh-80px)] flex-col">
        {/* HEADER */}
        <header className="border-b border-white/10 bg-[#0b1222]">
          <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold sm:text-2xl">
                    Ask TIVRA AI
                  </h1>
                  <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-1 text-[10px] font-semibold text-orange-400">
                    AI ASSISTANT
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                  Ask questions about your CRM, sales activity and workflow.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={createSession}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#111a2e] px-4 py-2.5 text-sm font-semibold hover:bg-white/[0.06]"
              >
                <Plus className="h-4 w-4" />
                New Chat
              </button>

              <button
                onClick={() => setShowSettings(true)}
                className="rounded-xl border border-white/10 bg-[#111a2e] p-2.5 text-zinc-400 hover:text-white"
                title="AI settings"
              >
                <Settings2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <div className="grid flex-1 lg:grid-cols-[290px_minmax(0,1fr)]">
          {/* SIDEBAR */}
          <aside className="border-b border-white/10 bg-[#0a1120] lg:border-r lg:border-b-0">
            <div className="flex h-full flex-col p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full rounded-xl border border-white/10 bg-[#0e1729] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-orange-500/50"
                />
              </div>

              <div className="mt-4 flex items-center justify-between px-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  Conversations
                </span>
                <span className="text-xs text-zinc-600">
                  {filteredSessions.length}
                </span>
              </div>

              <div className="mt-2 flex-1 space-y-1 overflow-y-auto">
                {filteredSessions.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/10 p-5 text-center text-xs text-zinc-600">
                    No conversations found.
                  </div>
                ) : (
                  filteredSessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => setSelectedId(session.id)}
                      className={`w-full rounded-xl p-3 text-left transition ${
                        selectedId === session.id
                          ? "bg-orange-500/10 text-orange-300"
                          : "text-zinc-400 hover:bg-white/[0.03] hover:text-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            selectedId === session.id
                              ? "bg-orange-500/15 text-orange-400"
                              : "bg-white/[0.04] text-zinc-500"
                          }`}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {session.title}
                          </p>
                          <p className="mt-1 truncate text-[11px] text-zinc-600">
                            {session.updatedAt}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>

              <div className="mt-4 rounded-xl border border-blue-500/15 bg-blue-500/5 p-4">
                <div className="flex gap-2.5">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                  <div>
                    <p className="text-xs font-semibold text-blue-300">
                      Ask naturally
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                      Ask about leads, sales, quotations, appointments,
                      follow-ups or team performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* CHAT AREA */}
          <main className="flex min-h-[620px] min-w-0 flex-col bg-[#070c1b]">
            {selected ? (
              <>
                {/* CHAT TOP BAR */}
                <div className="flex items-center justify-between border-b border-white/10 bg-[#0b1222] px-4 py-3 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white">
                      <Bot className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">TIVRA AI</p>
                      <p className="text-[11px] text-emerald-400">
                        Online · Ready to help
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={clearSelectedChat}
                      className="rounded-lg p-2 text-zinc-500 hover:bg-white/[0.04] hover:text-white"
                      title="Clear chat"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>

                    <button
                      onClick={deleteSelectedChat}
                      className="rounded-lg p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                      title="Delete chat"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* MESSAGES */}
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-10">
                  {selected.messages.length === 0 ? (
                    <EmptyChat onPrompt={sendMessage} />
                  ) : (
                    <div className="mx-auto max-w-4xl space-y-6">
                      {selected.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex gap-3 ${
                            msg.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          {msg.role === "assistant" && (
                            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                              <Bot className="h-4 w-4" />
                            </div>
                          )}

                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                              compact ? "py-2.5" : "py-3.5"
                            } ${
                              msg.role === "user"
                                ? "bg-blue-600 text-white"
                                : "border border-white/10 bg-[#111a2e] text-zinc-200"
                            }`}
                          >
                            <p className="whitespace-pre-wrap text-sm leading-6">
                              {msg.content}
                            </p>

                            <div className="mt-2 flex items-center justify-between gap-4">
                              <span
                                className={`text-[10px] ${
                                  msg.role === "user"
                                    ? "text-blue-100/70"
                                    : "text-zinc-600"
                                }`}
                              >
                                {msg.time}
                              </span>

                              {msg.role === "assistant" && (
                                <button
                                  onClick={() => copyMessage(msg)}
                                  className="text-zinc-600 hover:text-zinc-300"
                                  title="Copy"
                                >
                                  {copiedId === msg.id ? (
                                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>

                          {msg.role === "user" && (
                            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-bold text-blue-300">
                              YOU
                            </div>
                          )}
                        </div>
                      ))}

                      {typing && (
                        <div className="flex gap-3">
                          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                            <Bot className="h-4 w-4" />
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-[#111a2e] px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.3s]" />
                              <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.15s]" />
                              <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" />
                            </div>
                          </div>
                        </div>
                      )}

                      <div ref={bottomRef} />
                    </div>
                  )}
                </div>

                {/* INPUT */}
                <div className="border-t border-white/10 bg-[#0b1222] px-4 py-4 sm:px-6">
                  <div className="mx-auto max-w-4xl">
                    <div className="rounded-2xl border border-white/10 bg-[#0e1729] p-2 focus-within:border-orange-500/30">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        rows={2}
                        placeholder="Ask TIVRA AI anything about your CRM..."
                        className="max-h-32 w-full resize-none bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600"
                      />

                      <div className="flex items-center justify-between px-2 pb-1">
                        <div className="flex items-center gap-2 text-[10px] text-zinc-600">
                          <span>Enter to send</span>
                          <span>·</span>
                          <span>Shift + Enter for new line</span>
                        </div>

                        <button
                          onClick={() => sendMessage()}
                          disabled={!message.trim() || typing}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                          title="Send"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <p className="mt-2 text-center text-[10px] text-zinc-700">
                      Frontend demo AI · Connect your real AI service later.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-6">
                <div className="max-w-md text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
                    <Bot className="h-8 w-8" />
                  </div>
                  <h2 className="mt-5 text-xl font-bold">
                    Start a conversation with TIVRA AI
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    Ask a question and TIVRA AI will help you navigate your CRM workflow.
                  </p>
                  <button
                    onClick={createSession}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold hover:bg-orange-600"
                  >
                    <Plus className="h-4 w-4" />
                    Start New Chat
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1222] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h2 className="font-semibold">AI Chat Settings</h2>
                <p className="mt-1 text-xs text-zinc-600">
                  Customize the frontend chat experience.
                </p>
              </div>

              <button
                onClick={() => setShowSettings(false)}
                className="rounded-lg p-2 text-zinc-500 hover:bg-white/[0.04] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <SettingToggle
                title="Auto-scroll"
                description="Keep the latest message in view automatically."
                enabled={autoScroll}
                onChange={setAutoScroll}
              />

              <SettingToggle
                title="Compact messages"
                description="Reduce spacing in the conversation view."
                enabled={compact}
                onChange={setCompact}
              />

              <div className="rounded-xl border border-blue-500/15 bg-blue-500/5 p-4">
                <div className="flex gap-3">
                  <Bot className="mt-0.5 h-4 w-4 text-blue-400" />
                  <p className="text-xs leading-5 text-zinc-500">
                    Current responses are simulated on the frontend. No external
                    AI API is called from this module.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-white/10 p-4">
              <button
                onClick={() => setShowSettings(false)}
                className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold hover:bg-orange-600"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyChat({ onPrompt }: { onPrompt: (prompt: string) => void }) {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center py-10 text-center sm:py-16">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
        <Bot className="h-8 w-8" />
      </div>

      <h2 className="mt-5 text-2xl font-bold">How can I help?</h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
        Ask TIVRA AI about your CRM data, sales workflow, lead priorities,
        quotations, follow-ups or appointments.
      </p>

      <div className="mt-8 grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              onClick={() => onPrompt(item.prompt)}
              className="rounded-2xl border border-white/10 bg-[#0d1527] p-4 text-left transition hover:border-orange-500/25 hover:bg-[#101a2e]"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/[0.04] p-2 text-orange-400">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold">{item.title}</span>
              </div>
              <p className="mt-3 text-xs leading-5 text-zinc-600">
                {item.prompt}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[10px] text-zinc-700">
        <span className="rounded-full border border-white/5 px-3 py-1.5">
          CRM insights
        </span>
        <span className="rounded-full border border-white/5 px-3 py-1.5">
          Sales workflow
        </span>
        <span className="rounded-full border border-white/5 px-3 py-1.5">
          AI recommendations
        </span>
      </div>
    </div>
  );
}

function SettingToggle({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#0e1729] p-4">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs leading-5 text-zinc-600">{description}</p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-orange-500" : "bg-zinc-700"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
