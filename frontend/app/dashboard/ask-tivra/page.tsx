"use client";

import { useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Trash2,
  Plus,
  Lightbulb,
  Target,
  Users,
  CalendarDays,
  FileText,
  TrendingUp,
  ArrowUpRight,
  MessageCircle,
  Brain,
  Zap,
  X,
} from "lucide-react";

type Message = {
  id: number;
  role: "user" | "ai";
  text: string;
  time: string;
};

const initialMessages: Message[] = [
  {
    id: 1,
    role: "ai",
    text: "Hello! I'm TIVRA AI. I can help you understand your leads, sales pipeline, follow-ups, quotations and overall sales activity. What would you like to know?",
    time: "Now",
  },
];

const suggestedQuestions = [
  {
    icon: Target,
    title: "Analyze my leads",
    question: "Which leads should I contact first?",
  },
  {
    icon: TrendingUp,
    title: "Sales insight",
    question: "Give me today's sales insight.",
  },
  {
    icon: CalendarDays,
    title: "Follow-ups",
    question: "Which follow-ups need my attention today?",
  },
  {
    icon: FileText,
    title: "Quotations",
    question: "Which quotations are most likely to convert?",
  },
  {
    icon: Users,
    title: "Hot leads",
    question: "Show me the most important hot leads.",
  },
  {
    icon: Lightbulb,
    title: "Next action",
    question: "What should I do next to improve sales?",
  },
];

function getAIResponse(question: string): string {
  const q = question.toLowerCase();

  if (
    q.includes("lead") ||
    q.includes("contact") ||
    q.includes("hot")
  ) {
    return "Based on the current CRM data, you should focus first on high-score Hot Leads. Rajesh Industries has a high buying signal, while Priya Shah has an important follow-up due today. I recommend contacting the highest-score lead first and then completing today's overdue follow-ups.";
  }

  if (
    q.includes("follow") ||
    q.includes("today") ||
    q.includes("attention")
  ) {
    return "You currently have follow-up activity that needs attention today. Priya Shah has a scheduled follow-up at 2:30 PM and should be contacted on time. I also recommend checking overdue follow-ups before starting new prospecting.";
  }

  if (
    q.includes("quotation") ||
    q.includes("quote")
  ) {
    return "Quotation #QT-1024 has already been viewed by the customer. This is a useful buying signal. A timely follow-up can help move the opportunity toward negotiation or acceptance. You can also review pending quotations and prioritize recently viewed ones.";
  }

  if (
    q.includes("sales") ||
    q.includes("revenue") ||
    q.includes("insight")
  ) {
    return "Today's sales focus should be on converting existing high-intent opportunities rather than only adding new leads. Review Hot Leads, complete due follow-ups, and follow up on viewed quotations. These actions can help move active opportunities further through the sales pipeline.";
  }

  if (
    q.includes("next") ||
    q.includes("action")
  ) {
    return "Your recommended next actions are: 1) Contact high-score Hot Leads, 2) complete today's follow-ups, 3) follow up on viewed quotations, and 4) review opportunities currently in Negotiation or Demo stages.";
  }

  if (
    q.includes("campaign") ||
    q.includes("marketing")
  ) {
    return "For campaign optimization, compare lead volume with qualified leads and revenue generated. TIVRA should prioritize campaigns producing higher-quality leads rather than only looking at total lead count.";
  }

  if (
    q.includes("appointment") ||
    q.includes("meeting")
  ) {
    return "Review today's scheduled appointments first. Confirm important meetings, check the lead score of each customer, and prepare the relevant quotation or product information before the meeting.";
  }

  return "I can help with your CRM data, leads, sales pipeline, follow-ups, quotations, appointments, campaigns and AI sales insights. Try asking me something like: 'Which leads should I contact first?'";
}

export default function AskTivraAIPage() {
  const [messages, setMessages] =
    useState<Message[]>(initialMessages);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showInsights, setShowInsights] = useState(true);

  const sendMessage = (message?: string) => {
    const text = (message ?? input).trim();

    if (!text || isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text,
      time: "Now",
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response: Message = {
        id: Date.now() + 1,
        role: "ai",
        text: getAIResponse(text),
        time: "Now",
      };

      setMessages((current) => [...current, response]);
      setIsTyping(false);
    }, 700);
  };

  const clearChat = () => {
    setMessages(initialMessages);
    setInput("");
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 dark:bg-[#0b1020] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
              <Bot size={25} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Ask TIVRA AI
                </h1>

                <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Online
                </span>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your AI sales assistant for smarter decisions
              </p>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-[#151b2d] dark:text-gray-200 dark:hover:bg-[#1b2338]"
          >
            <Trash2 size={17} />
            Clear chat
          </button>
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-6 xl:grid-cols-[1fr_330px]">

          {/* CHAT */}
          <div className="flex min-h-[680px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#111827]">

            {/* CHAT HEADER */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white">
                  <Sparkles size={19} />
                </div>

                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    TIVRA AI Assistant
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    AI-powered sales intelligence
                  </p>
                </div>
              </div>

              <div className="hidden items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500 dark:bg-[#0b1020] dark:text-gray-400 sm:flex">
                <Zap size={14} className="text-yellow-500" />
                Smart Sales Mode
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  {/* AI ICON */}
                  {message.role === "ai" && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                      <Bot size={18} />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${
                      message.role === "user"
                        ? "rounded-br-md bg-indigo-600 text-white"
                        : "rounded-bl-md bg-gray-100 text-gray-800 dark:bg-[#1b2338] dark:text-gray-200"
                    }`}
                  >
                    <p className="whitespace-pre-line text-sm leading-6">
                      {message.text}
                    </p>

                    <p
                      className={`mt-2 text-[10px] ${
                        message.role === "user"
                          ? "text-indigo-200"
                          : "text-gray-400"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>

                  {/* USER ICON */}
                  {message.role === "user" && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      <User size={17} />
                    </div>
                  )}
                </div>
              ))}

              {/* TYPING */}
              {isTyping && (
                <div className="flex gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                    <Bot size={18} />
                  </div>

                  <div className="rounded-2xl rounded-bl-md bg-gray-100 px-5 py-4 dark:bg-[#1b2338]">
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SUGGESTIONS */}
            <div className="border-t border-gray-200 px-4 pt-4 dark:border-gray-800 sm:px-5">

              <p className="mb-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                Try asking
              </p>

              <div className="flex gap-2 overflow-x-auto pb-3">
                {suggestedQuestions.slice(0, 4).map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.title}
                      onClick={() => sendMessage(item.question)}
                      className="flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-700 dark:bg-[#151b2d] dark:text-gray-300 dark:hover:border-indigo-700 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                    >
                      <Icon size={14} />
                      {item.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* INPUT */}
            <div className="border-t border-gray-200 p-4 dark:border-gray-800">

              <div className="flex items-end gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 dark:border-gray-700 dark:bg-[#0b1020]">

                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ask TIVRA anything about your sales..."
                  rows={1}
                  className="max-h-32 min-h-[42px] flex-1 resize-none bg-transparent px-2 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
                />

                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isTyping}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send size={18} />
                </button>
              </div>

              <p className="mt-2 text-center text-[10px] text-gray-400">
                TIVRA AI can make mistakes. Verify important business information.
              </p>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-5">

            {/* AI STATUS */}
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-900/40 dark:bg-indigo-500/5">

              <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                    <Brain size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-indigo-900 dark:text-indigo-300">
                      TIVRA Intelligence
                    </h3>

                    <p className="text-xs text-indigo-700 dark:text-indigo-400">
                      Sales assistant is ready
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowInsights(false)}
                  className="rounded-lg p-1 text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-500/10"
                >
                  <X size={16} />
                </button>
              </div>

              {showInsights && (
                <div className="mt-4 space-y-3">

                  <div className="rounded-lg bg-white/70 p-3 dark:bg-[#111827]/60">
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      Current focus
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-600 dark:text-gray-400">
                      Convert high-intent leads and complete important follow-ups.
                    </p>
                  </div>

                  <div className="rounded-lg bg-white/70 p-3 dark:bg-[#111827]/60">
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      AI recommendation
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-600 dark:text-gray-400">
                      Review Hot Leads before starting new prospecting activity.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* QUICK QUESTIONS */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-[#111827]">

              <div className="mb-4 flex items-center gap-2">
                <Lightbulb size={18} className="text-yellow-500" />

                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Quick Questions
                </h3>
              </div>

              <div className="space-y-2">

                {suggestedQuestions.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.question}
                      onClick={() => sendMessage(item.question)}
                      className="flex w-full items-start gap-3 rounded-xl border border-gray-100 p-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50 dark:border-gray-800 dark:hover:border-indigo-800 dark:hover:bg-indigo-500/5"
                    >

                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        <Icon size={15} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                          {item.title}
                        </p>

                        <p className="mt-0.5 text-[11px] leading-4 text-gray-500 dark:text-gray-400">
                          {item.question}
                        </p>
                      </div>

                      <ArrowUpRight
                        size={14}
                        className="ml-auto mt-1 shrink-0 text-gray-400"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI CAPABILITIES */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-[#111827]">

              <div className="mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-500" />

                <h3 className="font-semibold text-gray-900 dark:text-white">
                  What TIVRA AI can help with
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2">

                {[
                  "Lead Analysis",
                  "Sales Insights",
                  "Follow-ups",
                  "Quotations",
                  "Appointments",
                  "Campaigns",
                  "Next Actions",
                  "Customer Insights",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-lg bg-gray-50 px-3 py-2.5 text-center text-[11px] font-medium text-gray-600 dark:bg-[#0b1020] dark:text-gray-400"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* CHAT TIP */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-[#111827]">

              <div className="flex gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                  <MessageCircle size={17} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    Pro Tip
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                    Ask TIVRA questions in natural language. You don't need to
                    know CRM filters or reports.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DEMO NOTICE */}
        <div className="mt-5 rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900/40 dark:bg-indigo-500/5">

          <div className="flex gap-3">

            <Sparkles
              size={18}
              className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400"
            />

            <div>
              <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-300">
                TIVRA AI Demo Mode
              </p>

              <p className="mt-1 text-xs leading-5 text-indigo-700 dark:text-indigo-400">
                This interface currently uses demo AI responses. In the
                production version, TIVRA AI will connect with your CRM data,
                PostgreSQL, Knowledge Base and AI provider to generate
                real-time business insights.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}