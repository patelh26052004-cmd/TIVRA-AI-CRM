"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { usePersistentState } from "@/lib/persistence";

import {
  Bot,
  CheckCircle2,
  CircleUserRound,
  Clock3,
  FileText,
  Flame,
  MessageSquare,
  Phone,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  X,
  Zap,
  MoreHorizontal,
  Trash2,
  RotateCcw,
  Menu,
  Info,
} from "lucide-react";

type Sender = "customer" | "ai" | "human";

type Message = {
  id: number;
  sender: Sender;
  text: string;
  time: string;
};

type Conversation = {
  id: number;
  name: string;
  company: string;
  phone: string;
  email: string;
  score: number;
  stage: string;
  timeline: string;
  requirement: string;
  intent: string;
  lastMessage: string;
  time: string;
  messages: Message[];
};

const conversationsData: Conversation[] = [
  {
    id: 1,
    name: "Rajesh Mehta",
    company: "Mehta Industries",
    phone: "+91 98765 43210",
    email: "rajesh@mehtaindustries.com",
    score: 92,
    stage: "Qualified",
    timeline: "Within 7 days",
    requirement: "Lead CRM + WhatsApp Automation",
    intent: "Product + Pricing + Demo",
    lastMessage: "Yes, I would like a demo...",
    time: "10:33 AM",
    messages: [
      {
        id: 1,
        sender: "customer",
        text: "Hi, I want to know more about TIVRA AI CRM.",
        time: "10:31 AM",
      },
      {
        id: 2,
        sender: "ai",
        text: "Hello Rajesh! 👋 I can help you understand TIVRA AI. Are you mainly looking for lead management, WhatsApp automation, or sales follow-up?",
        time: "10:31 AM",
      },
      {
        id: 3,
        sender: "customer",
        text: "We need lead management and WhatsApp automation. Can you tell me the pricing?",
        time: "10:32 AM",
      },
      {
        id: 4,
        sender: "ai",
        text: "Absolutely. TIVRA AI combines Lead CRM, AI lead scoring, WhatsApp conversations and smart follow-ups in one platform. I can also arrange a demo so our sales team can understand your requirements.",
        time: "10:32 AM",
      },
      {
        id: 5,
        sender: "customer",
        text: "Yes, I would like a demo this week.",
        time: "10:33 AM",
      },
    ],
  },
  {
    id: 2,
    name: "Priya Shah",
    company: "Shah Manufacturing",
    phone: "+91 98250 12345",
    email: "priya@shahmanufacturing.com",
    score: 86,
    stage: "Contacted",
    timeline: "This month",
    requirement: "CRM + Sales Automation",
    intent: "Pricing + Product",
    lastMessage: "Can you send pricing?",
    time: "10:19 AM",
    messages: [
      {
        id: 1,
        sender: "customer",
        text: "Hello, I want to know about your CRM.",
        time: "10:15 AM",
      },
      {
        id: 2,
        sender: "ai",
        text: "Hello Priya! 👋 I can help you understand TIVRA AI CRM and its features.",
        time: "10:15 AM",
      },
      {
        id: 3,
        sender: "customer",
        text: "Can you send pricing?",
        time: "10:19 AM",
      },
      {
        id: 4,
        sender: "ai",
        text: "Sure. TIVRA AI provides lead management, AI lead scoring, WhatsApp automation and sales follow-ups.",
        time: "10:19 AM",
      },
    ],
  },
  {
    id: 3,
    name: "Amit Patel",
    company: "Patel Engineering",
    phone: "+91 99090 45678",
    email: "amit@patelengineering.com",
    score: 74,
    stage: "Contacted",
    timeline: "This month",
    requirement: "Lead Management",
    intent: "Product Information",
    lastMessage: "We need more information.",
    time: "9:54 AM",
    messages: [
      {
        id: 1,
        sender: "customer",
        text: "Hi, can you tell me more about TIVRA AI?",
        time: "9:50 AM",
      },
      {
        id: 2,
        sender: "ai",
        text: "Of course! TIVRA AI helps businesses manage leads and automate sales activities.",
        time: "9:51 AM",
      },
      {
        id: 3,
        sender: "customer",
        text: "We need more information.",
        time: "9:54 AM",
      },
    ],
  },
  {
    id: 4,
    name: "Neha Desai",
    company: "Desai Traders",
    phone: "+91 98790 67890",
    email: "neha@desaitraders.com",
    score: 61,
    stage: "New",
    timeline: "Not decided",
    requirement: "Sales CRM",
    intent: "General Enquiry",
    lastMessage: "Will discuss internally.",
    time: "Yesterday",
    messages: [
      {
        id: 1,
        sender: "customer",
        text: "Can TIVRA AI help our sales team?",
        time: "Yesterday",
      },
      {
        id: 2,
        sender: "ai",
        text: "Yes. TIVRA AI can help your team manage leads, follow-ups, quotations and customer conversations.",
        time: "Yesterday",
      },
      {
        id: 3,
        sender: "customer",
        text: "Will discuss internally.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: 5,
    name: "Karan Joshi",
    company: "Joshi Enterprises",
    phone: "+91 98123 45678",
    email: "karan@joshienterprises.com",
    score: 48,
    stage: "New",
    timeline: "Not decided",
    requirement: "CRM",
    intent: "General Enquiry",
    lastMessage: "Please share details.",
    time: "Yesterday",
    messages: [
      {
        id: 1,
        sender: "customer",
        text: "Hello, please share details about TIVRA AI.",
        time: "Yesterday",
      },
      {
        id: 2,
        sender: "ai",
        text: "Sure Karan! TIVRA AI is an AI-powered CRM designed to help businesses manage leads and sales.",
        time: "Yesterday",
      },
      {
        id: 3,
        sender: "customer",
        text: "Please share details.",
        time: "Yesterday",
      },
    ],
  },
];

const DEFAULT_AI_REPLIES = [
  "Sure! I can help with that. Would you like me to arrange a demo with our sales team?",
  "Thanks for sharing that. Based on your requirement, TIVRA AI can help automate lead qualification and follow-ups.",
  "I understand. I can capture your requirement and pass it to our sales team for the next step.",
  "Absolutely. Let me help you with the next step and make sure your requirement is recorded.",
];

function formatTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function generateAiReply(
  message: string,
  conversation: Conversation
) {
  const text = message.toLowerCase();

  if (
    text.includes("price") ||
    text.includes("pricing") ||
    text.includes("cost") ||
    text.includes("plan")
  ) {
    return `Thanks for asking about pricing. TIVRA AI can be configured based on your business requirements. I can arrange a demo so our sales team can understand your needs and share the suitable plan.`;
  }

  if (
    text.includes("demo") ||
    text.includes("meeting") ||
    text.includes("show me")
  ) {
    return `Absolutely. I can help arrange a TIVRA AI demo for you. Based on your current requirement of ${conversation.requirement.toLowerCase()}, a demo would be a good next step.`;
  }

  if (
    text.includes("whatsapp") ||
    text.includes("automation")
  ) {
    return `Yes. TIVRA AI supports WhatsApp-focused sales workflows including customer conversations, follow-ups and lead management. I can also help capture your exact automation requirement.`;
  }

  if (
    text.includes("lead") ||
    text.includes("crm")
  ) {
    return `TIVRA AI helps sales teams manage leads, track the sales pipeline, score leads with AI and manage follow-ups in one CRM platform.`;
  }

  if (
    text.includes("quotation") ||
    text.includes("quote")
  ) {
    return `I can help with quotation-related requirements as well. We can understand your requirements and prepare the next step with the sales team.`;
  }

  if (
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey")
  ) {
    return `Hello! 👋 Welcome to TIVRA AI. I can help you with CRM, lead management, WhatsApp automation, follow-ups, quotations and demos. What would you like to know?`;
  }

  return DEFAULT_AI_REPLIES[
    conversation.messages.length %
      DEFAULT_AI_REPLIES.length
  ];
}

export default function AISalesAgentPage() {
  const [conversations, setConversations] =
    usePersistentState<Conversation[]>(
      "tivra_ai_sales_conversations",
      conversationsData
    );

  const [selectedConversationId, setSelectedConversationId] =
    useState(1);

  const [message, setMessage] = useState("");

  const [humanTakeover, setHumanTakeover] =
    useState(false);

  const [autoReplyEnabled, setAutoReplyEnabled] =
    useState(true);

  const [showCapabilities, setShowCapabilities] =
    useState(false);

  const [showLeadDetails, setShowLeadDetails] =
    useState(false);

  const [showSettings, setShowSettings] =
    useState(false);

  const [showChatMenu, setShowChatMenu] =
    useState(false);

  const [showMobileConversations, setShowMobileConversations] =
    useState(false);

  const [isGenerating, setIsGenerating] =
    useState(false);

  const aiTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  useEffect(() => {
    return () => {
      if (aiTimerRef.current) {
        clearTimeout(aiTimerRef.current);
      }
    };
  }, []);

  const selectedConversation =
    conversations.find(
      (conversation) =>
        conversation.id ===
        selectedConversationId
    ) ?? conversations[0];

  const messages =
    selectedConversation?.messages ?? [];

  const customerMessages = useMemo(
    () =>
      messages.filter(
        (item) =>
          item.sender === "customer"
      ),
    [messages]
  );

  const selectedTemperature =
    selectedConversation.score >= 80
      ? "Hot"
      : selectedConversation.score >= 60
      ? "Warm"
      : "Cold";

  const aiConfidence = Math.min(
    98,
    selectedConversation.score + 2
  );

  const selectConversation = (
    id: number
  ) => {
    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }

    setSelectedConversationId(id);
    setMessage("");
    setHumanTakeover(false);
    setIsGenerating(false);
    setShowMobileConversations(false);
    setShowChatMenu(false);
  };

  const addMessageToConversation = (
    conversationId: number,
    newMessage: Message
  ) => {
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id ===
        conversationId
          ? {
              ...conversation,
              lastMessage:
                newMessage.text,
              time: newMessage.time,
              messages: [
                ...conversation.messages,
                newMessage,
              ],
            }
          : conversation
      )
    );
  };

  const handleSend = () => {
    const trimmed = message.trim();

    if (
      !trimmed ||
      !selectedConversation ||
      isGenerating
    ) {
      return;
    }

    const conversationId =
      selectedConversation.id;

    const sendAsHuman =
      humanTakeover;

    const currentTime =
      formatTime();

    const outgoingMessage: Message = {
      id:
        Date.now() +
        Math.floor(
          Math.random() * 1000
        ),
      sender: sendAsHuman
        ? "human"
        : "customer",
      text: trimmed,
      time: currentTime,
    };

    addMessageToConversation(
      conversationId,
      outgoingMessage
    );

    setMessage("");

    if (
      sendAsHuman ||
      !autoReplyEnabled
    ) {
      return;
    }

    const currentConversation =
      conversations.find(
        (conversation) =>
          conversation.id ===
          conversationId
      );

    if (!currentConversation) {
      return;
    }

    setIsGenerating(true);

    aiTimerRef.current =
      setTimeout(() => {
        const reply =
          generateAiReply(
            trimmed,
            currentConversation
          );

        const aiMessage: Message = {
          id:
            Date.now() +
            Math.floor(
              Math.random() * 1000
            ),
          sender: "ai",
          text: reply,
          time: formatTime(),
        };

        addMessageToConversation(
          conversationId,
          aiMessage
        );

        setIsGenerating(false);
        aiTimerRef.current = null;
      }, 800);
  };

  const clearSelectedConversation =
    () => {
      if (!selectedConversation) {
        return;
      }

      const confirmed =
        window.confirm(
          `Clear conversation with ${selectedConversation.name}?`
        );

      if (!confirmed) {
        return;
      }

      if (aiTimerRef.current) {
        clearTimeout(aiTimerRef.current);
        aiTimerRef.current = null;
      }

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id ===
          selectedConversation.id
            ? {
                ...conversation,
                lastMessage:
                  "Conversation cleared",
                time: formatTime(),
                messages: [],
              }
            : conversation
        )
      );

      setShowChatMenu(false);
      setIsGenerating(false);
    };

  const resetDemoData = () => {
    const confirmed =
      window.confirm(
        "Reset all AI Sales Agent demo conversations?"
      );

    if (!confirmed) {
      return;
    }

    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }

    const resetData =
      conversationsData.map(
        (conversation) => ({
          ...conversation,
          messages:
            conversation.messages.map(
              (item) => ({
                ...item,
              })
            ),
        })
      );

    setConversations(resetData);
    setSelectedConversationId(1);
    setMessage("");
    setHumanTakeover(false);
    setIsGenerating(false);
    setShowSettings(false);
  };

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-4 py-6 text-slate-950 dark:bg-[#070c1b] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                <Bot size={21} />
              </div>

              <span className="text-sm font-medium text-orange-500">
                AI Sales Engine
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              AI Sales Agent
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Qualify leads, understand customer requirements and assist your sales team.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">

            {/* MOBILE CONVERSATIONS */}
            <button
              type="button"
              onClick={() =>
                setShowMobileConversations(
                  true
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:border-orange-300 hover:text-orange-500 dark:border-white/10 dark:bg-[#111a2e] xl:hidden"
            >
              <Menu size={17} />
              Conversations
            </button>

            {/* AI CAPABILITIES */}
            <button
              type="button"
              onClick={() =>
                setShowCapabilities(true)
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:border-orange-300 hover:text-orange-500 dark:border-white/10 dark:bg-[#111a2e]"
            >
              <Sparkles size={17} />

              <span className="hidden sm:inline">
                AI Capabilities
              </span>

              <span className="sm:hidden">
                AI
              </span>
            </button>

            {/* SETTINGS */}
            <button
              type="button"
              onClick={() =>
                setShowSettings(true)
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-orange-300 hover:text-orange-500 dark:border-white/10 dark:bg-[#111a2e]"
              title="AI Settings"
            >
              <Settings2 size={17} />
            </button>

            {/* HUMAN TAKEOVER */}
            <button
              type="button"
              onClick={() =>
                setHumanTakeover(
                  (prev) => !prev
                )
              }
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                humanTakeover
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              <UserRound size={17} />

              {humanTakeover
                ? "Return to AI"
                : "Take Over"}
            </button>
          </div>
        </div>

        {/* =====================================================
            STATUS CARDS
        ===================================================== */}

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatusCard
            icon={
              <MessageSquare size={18} />
            }
            title="Conversation"
            value={
              isGenerating
                ? "AI Replying"
                : "Active"
            }
            description={
              isGenerating
                ? "AI is generating a response"
                : "Customer conversation is active"
            }
            type="green"
          />

          <StatusCard
            icon={<Flame size={18} />}
            title="Lead Temperature"
            value={
              selectedTemperature
            }
            description="Based on lead score"
            type="orange"
          />

          <StatusCard
            icon={<Target size={18} />}
            title="AI Confidence"
            value={`${aiConfidence}%`}
            description="Current AI confidence level"
            type="blue"
          />

          <StatusCard
            icon={<Clock3 size={18} />}
            title="Response Time"
            value="< 1 min"
            description="Typical AI response speed"
            type="purple"
          />
        </section>

        {/* =====================================================
            MAIN AREA
        ===================================================== */}

        <section className="grid min-h-[680px] grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111a2e] xl:grid-cols-[300px_minmax(0,1fr)_330px]">

          {/* ===================================================
              LEFT CONVERSATIONS
          =================================================== */}

          <aside className="hidden border-r border-slate-200 dark:border-white/10 xl:block">
            <div className="border-b border-slate-200 p-4 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">
                    AI Conversations
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {conversations.length} conversations
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowSettings(true)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-orange-500 dark:hover:bg-white/5"
                  title="Conversation settings"
                >
                  <Settings2 size={17} />
                </button>
              </div>
            </div>

            <div className="space-y-1 p-2">
              {conversations.map(
                (conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    name={
                      conversation.name
                    }
                    company={
                      conversation.company
                    }
                    message={
                      conversation.lastMessage
                    }
                    time={
                      conversation.time
                    }
                    score={
                      conversation.score
                    }
                    active={
                      conversation.id ===
                      selectedConversationId
                    }
                    onClick={() =>
                      selectConversation(
                        conversation.id
                      )
                    }
                  />
                )
              )}
            </div>
          </aside>

          {/* ===================================================
              CHAT
          =================================================== */}

          <div className="flex min-h-[680px] min-w-0 flex-col">

            {/* CHAT HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-white/10 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">

                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                  <CircleUserRound size={22} />

                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-[#111a2e]" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">

                    <h2 className="truncate font-semibold">
                      {
                        selectedConversation.name
                      }
                    </h2>

                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                      {selectedTemperature.toUpperCase()}
                    </span>

                  </div>

                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {
                      selectedConversation.company
                    }{" "}
                    ·{" "}
                    {
                      selectedConversation.phone
                    }
                  </p>
                </div>
              </div>

              {/* ONLY ONE CALL + ONE LEAD DETAILS */}
              <div className="flex items-center gap-1">

                <a
                  href={`tel:${selectedConversation.phone}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-orange-500 dark:hover:bg-white/5"
                  title={`Call ${selectedConversation.name}`}
                >
                  <Phone size={17} />
                </a>

                <button
                  type="button"
                  onClick={() =>
                    setShowLeadDetails(
                      true
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-orange-500 dark:hover:bg-white/5"
                  title="Lead details"
                >
                  <Info size={17} />
                </button>

                {/* THREE DOTS - ONLY CLEAR */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setShowChatMenu(
                        (prev) => !prev
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-orange-500 dark:hover:bg-white/5"
                    title="More options"
                  >
                    <MoreHorizontal
                      size={18}
                    />
                  </button>

                  {showChatMenu && (
                    <div className="absolute right-0 top-10 z-40 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl dark:border-white/10 dark:bg-[#111a2e]">

                      <button
                        type="button"
                        onClick={
                          clearSelectedConversation
                        }
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        <Trash2 size={14} />
                        Clear Conversation
                      </button>

                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AI / HUMAN STATUS */}
            <div
              className={`border-b px-4 py-3 ${
                humanTakeover
                  ? "border-green-200 bg-green-50 dark:border-green-500/20 dark:bg-green-500/5"
                  : "border-orange-200 bg-orange-50 dark:border-orange-500/20 dark:bg-orange-500/5"
              }`}
            >
              <div className="flex items-center gap-3">

                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    humanTakeover
                      ? "bg-green-500 text-white"
                      : "bg-orange-500 text-white"
                  }`}
                >
                  {humanTakeover ? (
                    <UserRound size={16} />
                  ) : (
                    <Bot size={16} />
                  )}
                </div>

                <div className="min-w-0">

                  <p className="text-xs font-semibold">
                    {humanTakeover
                      ? "Human takeover is active"
                      : "TIVRA AI is handling this conversation"}
                  </p>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {humanTakeover
                      ? "You are replying as the salesperson."
                      : autoReplyEnabled
                      ? "Customer test messages receive an AI response automatically."
                      : "Automatic AI replies are currently disabled."}
                  </p>

                </div>
              </div>
            </div>

            {/* MOBILE SUMMARY */}
            <div className="border-b border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-[#111a2e] xl:hidden">
              <div className="grid grid-cols-3 gap-2">

                <MiniInfo
                  label="Score"
                  value={`${selectedConversation.score}/100`}
                />

                <MiniInfo
                  label="Stage"
                  value={
                    selectedConversation.stage
                  }
                />

                <MiniInfo
                  label="Intent"
                  value={
                    selectedConversation.intent
                  }
                />

              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/70 p-4 dark:bg-[#0b1222]/50 sm:p-5">

              <div className="flex justify-center">
                <span className="rounded-full bg-slate-200 px-3 py-1 text-[10px] text-slate-500 dark:bg-white/5 dark:text-slate-400">
                  Conversation
                </span>
              </div>

              {messages.length === 0 ? (
                <div className="flex min-h-[300px] items-center justify-center">
                  <div className="text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500 dark:bg-orange-500/10">
                      <MessageSquare size={20} />
                    </div>

                    <p className="mt-3 text-sm font-semibold">
                      No messages
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Start a new conversation below.
                    </p>

                  </div>
                </div>
              ) : (
                messages.map(
                  (item) => (
                    <MessageBubble
                      key={item.id}
                      message={item}
                    />
                  )
                )
              )}

              {isGenerating && (
                <TypingIndicator />
              )}
            </div>

            {/* INPUT */}
            <div className="border-t border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-[#111a2e] sm:p-4">

              {humanTakeover && (
                <div className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700 dark:bg-green-500/5 dark:text-green-400">
                  Human mode active. Your message will appear as the Sales Team.
                </div>
              )}

              {!humanTakeover &&
                !autoReplyEnabled && (
                  <div className="mb-3 rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-700 dark:bg-yellow-500/5 dark:text-yellow-400">
                    Auto AI reply is OFF. Enable it from AI Settings.
                  </div>
                )}

              <div className="flex items-end gap-2">

                <textarea
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key ===
                        "Enter" &&
                      !e.shiftKey
                    ) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={2}
                  placeholder={
                    humanTakeover
                      ? `Reply to ${selectedConversation.name}...`
                      : `Test a customer message for ${selectedConversation.name}...`
                  }
                  className="min-h-[48px] flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 dark:border-white/10 dark:bg-[#0b1222]"
                />

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={
                    !message.trim() ||
                    isGenerating
                  }
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                  title="Send message"
                >
                  <Send size={18} />
                </button>

              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">

                <span>
                  Enter to send · Shift + Enter for new line
                </span>

                <span className="hidden sm:block">
                  {customerMessages.length} customer messages
                </span>

              </div>
            </div>
          </div>

          {/* ===================================================
              RIGHT LEAD INTELLIGENCE
          =================================================== */}

          <aside className="hidden border-l border-slate-200 dark:border-white/10 xl:block">

            <div className="border-b border-slate-200 p-4 dark:border-white/10">
              <div className="flex items-center gap-2">

                <Sparkles
                  size={17}
                  className="text-orange-500"
                />

                <h2 className="font-semibold">
                  Lead Intelligence
                </h2>

              </div>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                AI-generated customer insights
              </p>
            </div>

            <div className="space-y-5 p-4">

              {/* SCORE */}
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-500/20 dark:bg-orange-500/5">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      AI Lead Score
                    </p>

                    <p className="mt-1 text-3xl font-bold text-orange-500">
                      {selectedConversation.score}

                      <span className="text-sm font-medium text-slate-400">
                        /100
                      </span>
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-white">
                    <Flame size={20} />
                  </div>

                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-orange-500 transition-all duration-500"
                    style={{
                      width: `${selectedConversation.score}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs font-semibold text-orange-600 dark:text-orange-400">
                  {selectedTemperature.toUpperCase()} LEAD
                </p>

              </div>

              {/* INTENT */}
              <IntelligenceItem
                title="Detected Intent"
                value={
                  selectedConversation.intent
                }
                icon={
                  <Target size={16} />
                }
              />

              {/* BUYING SIGNALS */}
              <div>

                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Buying Signals
                </p>

                <div className="space-y-2">

                  {selectedConversation.score >=
                    80 && (
                    <>
                      <Signal text="Strong buying interest" />
                      <Signal text="High conversation engagement" />
                      <Signal text="Potential demo requirement" />
                    </>
                  )}

                  {selectedConversation.score >=
                    60 &&
                    selectedConversation.score <
                      80 && (
                      <>
                        <Signal text="Customer is interested" />
                        <Signal text="Product information requested" />
                      </>
                    )}

                  {selectedConversation.score <
                    60 && (
                    <Signal text="Early-stage enquiry" />
                  )}

                </div>
              </div>

              {/* REQUIREMENTS */}
              <div>

                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Extracted Requirements
                </p>

                <div className="space-y-2">

                  <Requirement
                    label="Product"
                    value="TIVRA AI CRM"
                  />

                  <Requirement
                    label="Requirement"
                    value={
                      selectedConversation.requirement
                    }
                  />

                  <Requirement
                    label="Timeline"
                    value={
                      selectedConversation.timeline
                    }
                  />

                  <Requirement
                    label="Stage"
                    value={
                      selectedConversation.stage
                    }
                  />

                </div>
              </div>

              {/* CONFIDENCE */}
              <div className="rounded-xl border border-slate-200 p-4 dark:border-white/10">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      AI Confidence
                    </p>

                    <p className="mt-1 text-lg font-bold">
                      {aiConfidence}%
                    </p>
                  </div>

                  <ShieldCheck
                    className="text-green-500"
                    size={22}
                  />

                </div>

                <div className="mt-3 h-1.5 rounded-full bg-slate-100 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all duration-500"
                    style={{
                      width: `${aiConfidence}%`,
                    }}
                  />
                </div>

              </div>

              {/* NEXT ACTION */}
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-500/20 dark:bg-orange-500/5">

                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">

                  <Zap size={16} />

                  <p className="text-xs font-bold uppercase tracking-wide">
                    Suggested Next Action
                  </p>

                </div>

                <p className="mt-2 text-sm leading-5 text-slate-700 dark:text-slate-300">
                  {selectedConversation.score >=
                  80
                    ? "Schedule a product demo and prepare a quotation."
                    : selectedConversation.score >=
                      60
                    ? "Follow up with product details and pricing."
                    : "Continue nurturing the lead and understand requirements."}
                </p>

              </div>

            </div>
          </aside>
        </section>
      </div>

      {/* =====================================================
          MOBILE CONVERSATIONS
      ===================================================== */}

      {showMobileConversations && (
        <div
          className="fixed inset-0 z-[120] bg-slate-950/60 backdrop-blur-sm xl:hidden"
          onClick={() =>
            setShowMobileConversations(
              false
            )
          }
        >
          <div
            className="absolute left-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-white shadow-2xl dark:bg-[#0b1222]"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-white/10">

              <div>
                <h2 className="font-bold">
                  AI Conversations
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Select a conversation
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowMobileConversations(
                    false
                  )
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <X size={18} />
              </button>

            </div>

            <div className="space-y-1 p-2">

              {conversations.map(
                (conversation) => (
                  <ConversationItem
                    key={
                      conversation.id
                    }
                    name={
                      conversation.name
                    }
                    company={
                      conversation.company
                    }
                    message={
                      conversation.lastMessage
                    }
                    time={
                      conversation.time
                    }
                    score={
                      conversation.score
                    }
                    active={
                      conversation.id ===
                      selectedConversationId
                    }
                    onClick={() =>
                      selectConversation(
                        conversation.id
                      )
                    }
                  />
                )
              )}

            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          AI CAPABILITIES MODAL
      ===================================================== */}

      {showCapabilities && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() =>
            setShowCapabilities(
              false
            )
          }
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111a2e]"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
                  <Sparkles size={19} />
                </div>

                <div>
                  <h2 className="font-bold">
                    TIVRA AI Capabilities
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    AI Sales Agent capabilities
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowCapabilities(
                    false
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <X size={18} />
              </button>

            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-2">

              <Capability
                icon={
                  <MessageSquare
                    size={18}
                  />
                }
                title="Understand Intent"
                description="Detect product, pricing, demo and support-related customer intent."
              />

              <Capability
                icon={
                  <Target size={18} />
                }
                title="Qualify Leads"
                description="Understand customer needs, buying timeline and sales requirements."
              />

              <Capability
                icon={
                  <FileText size={18} />
                }
                title="Extract Requirements"
                description="Capture product, business requirements, timeline and lead stage."
              />

              <Capability
                icon={
                  <Flame size={18} />
                }
                title="Detect Buying Signals"
                description="Identify pricing requests, demo requests and strong purchase signals."
              />

              <Capability
                icon={
                  <ShieldCheck
                    size={18}
                  />
                }
                title="Approved Knowledge"
                description="Respond using approved company information and conversation context."
              />

              <Capability
                icon={
                  <UserRound
                    size={18}
                  />
                }
                title="Human Handover"
                description="Pause AI replies and allow a salesperson to take control."
              />

            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          LEAD DETAILS MODAL
      ===================================================== */}

      {showLeadDetails && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() =>
            setShowLeadDetails(
              false
            )
          }
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111a2e]"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-orange-500">
                  Lead Details
                </p>

                <h2 className="mt-1 font-bold">
                  {
                    selectedConversation.name
                  }
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {
                    selectedConversation.company
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowLeadDetails(
                    false
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <X size={18} />
              </button>

            </div>

            <div className="space-y-3 p-5">

              <div className="mb-4 rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-500/20 dark:bg-orange-500/5">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      AI Lead Score
                    </p>

                    <p className="mt-1 text-3xl font-bold text-orange-500">
                      {
                        selectedConversation.score
                      }

                      <span className="text-sm text-slate-400">
                        /100
                      </span>
                    </p>
                  </div>

                  <Flame
                    size={25}
                    className="text-orange-500"
                  />

                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-orange-500"
                    style={{
                      width: `${selectedConversation.score}%`,
                    }}
                  />
                </div>

              </div>

              <DetailRow
                label="Company"
                value={
                  selectedConversation.company
                }
              />

              <DetailRow
                label="Email"
                value={
                  selectedConversation.email
                }
              />

              <DetailRow
                label="Phone"
                value={
                  selectedConversation.phone
                }
              />

              <DetailRow
                label="Lead Score"
                value={`${selectedConversation.score} / 100`}
              />

              <DetailRow
                label="Lead Temperature"
                value={selectedTemperature}
              />

              <DetailRow
                label="Stage"
                value={
                  selectedConversation.stage
                }
              />

              <DetailRow
                label="Timeline"
                value={
                  selectedConversation.timeline
                }
              />

              <DetailRow
                label="Requirement"
                value={
                  selectedConversation.requirement
                }
              />

              <DetailRow
                label="Intent"
                value={
                  selectedConversation.intent
                }
              />

            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          SETTINGS MODAL
      ===================================================== */}

      {showSettings && (
        <div
          className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() =>
            setShowSettings(false)
          }
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111a2e]"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                  <Settings2 size={19} />
                </div>

                <div>
                  <h2 className="font-bold">
                    AI Sales Agent Settings
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Frontend demo controls
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowSettings(
                    false
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <X size={18} />
              </button>

            </div>

            <div className="space-y-4 p-5">

              {/* AUTOMATIC AI REPLY */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-white/10">

                <div className="pr-4">

                  <p className="text-sm font-semibold">
                    Automatic AI Replies
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Automatically generate a test AI response after a customer message.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setAutoReplyEnabled(
                      (prev) => !prev
                    )
                  }
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    autoReplyEnabled
                      ? "bg-orange-500"
                      : "bg-slate-300 dark:bg-white/20"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                      autoReplyEnabled
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>

              </div>

              {/* CURRENT MODE */}
              <div className="rounded-xl border border-slate-200 p-4 dark:border-white/10">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Current Mode
                </p>

                <div className="mt-2 flex items-center gap-2">

                  {humanTakeover ? (
                    <>
                      <UserRound
                        size={16}
                        className="text-green-500"
                      />

                      <span className="text-sm font-semibold">
                        Human Takeover
                      </span>
                    </>
                  ) : (
                    <>
                      <Bot
                        size={16}
                        className="text-orange-500"
                      />

                      <span className="text-sm font-semibold">
                        AI Sales Agent
                      </span>
                    </>
                  )}

                </div>
              </div>

              {/* RESET */}
              <button
                type="button"
                onClick={
                  resetDemoData
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                <RotateCcw
                  size={16}
                />
                Reset Demo Conversations
              </button>

            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* =========================================================
   MESSAGE BUBBLE
========================================================= */

function MessageBubble({
  message,
}: {
  message: Message;
}) {
  const isCustomer =
    message.sender ===
    "customer";

  const isHuman =
    message.sender === "human";

  const isAi =
    message.sender === "ai";

  return (
    <div
      className={`flex ${
        isCustomer
          ? "justify-start"
          : "justify-end"
      }`}
    >
      <div
        className={`flex max-w-[88%] flex-col ${
          isCustomer
            ? "items-start"
            : "items-end"
        } sm:max-w-[75%]`}
      >

        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
            isCustomer
              ? "rounded-tl-md border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-[#111a2e] dark:text-slate-300"
              : isAi
              ? "rounded-tr-md border border-orange-200 bg-orange-50 text-slate-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-50"
              : "rounded-tr-md bg-orange-500 text-white"
          }`}
        >

          {!isCustomer && (
            <div
              className={`mb-2 flex items-center gap-2 text-xs font-semibold ${
                isAi
                  ? "text-orange-500"
                  : "text-white/90"
              }`}
            >
              {isAi ? (
                <>
                  <Bot size={14} />
                  TIVRA AI
                </>
              ) : (
                <>
                  <UserRound size={14} />
                  Sales Team
                </>
              )}
            </div>
          )}

          {isCustomer && (
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Customer
            </div>
          )}

          <p className="whitespace-pre-wrap">
            {message.text}
          </p>

        </div>

        <span className="mt-1 px-1 text-[10px] text-slate-400">
          {message.time}
        </span>

      </div>
    </div>
  );
}

/* =========================================================
   TYPING INDICATOR
========================================================= */

function TypingIndicator() {
  return (
    <div className="flex justify-end">
      <div className="rounded-2xl rounded-tr-md border border-orange-200 bg-orange-50 px-4 py-3 dark:border-orange-500/20 dark:bg-orange-500/10">

        <div className="flex items-center gap-2 text-xs text-orange-500">

          <Bot size={14} />

          <span>
            TIVRA AI is typing
          </span>

          <span className="flex gap-1">

            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-500 [animation-delay:-0.3s]" />

            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-500 [animation-delay:-0.15s]" />

            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-500" />

          </span>

        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CONVERSATION ITEM
========================================================= */

function ConversationItem({
  name,
  company,
  message,
  time,
  score,
  active = false,
  onClick,
}: {
  name: string;
  company: string;
  message: string;
  time: string;
  score: number;
  active?: boolean;
  onClick: () => void;
}) {
  const temperature =
    score >= 80
      ? "hot"
      : score >= 60
      ? "warm"
      : "cold";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl p-3 text-left transition ${
        active
          ? "bg-orange-50 ring-1 ring-orange-200 dark:bg-orange-500/10 dark:ring-orange-500/20"
          : "hover:bg-slate-50 dark:hover:bg-white/[0.03]"
      }`}
    >

      <div className="flex gap-3">

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
            active
              ? "bg-orange-500 text-white"
              : "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300"
          }`}
        >
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex items-center justify-between gap-2">

            <p className="truncate text-sm font-semibold">
              {name}
            </p>

            <span className="shrink-0 text-[10px] text-slate-400">
              {time}
            </span>

          </div>

          <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
            {company}
          </p>

          <div className="mt-1 flex items-center justify-between gap-2">

            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {message}
            </p>

            <span
              className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                temperature === "hot"
                  ? "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                  : temperature === "warm"
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
                  : "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400"
              }`}
            >
              {score}
            </span>

          </div>
        </div>
      </div>
    </button>
  );
}

/* =========================================================
   STATUS CARD
========================================================= */

function StatusCard({
  icon,
  title,
  value,
  description,
  type,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  description: string;
  type:
    | "green"
    | "orange"
    | "blue"
    | "purple";
}) {
  const iconClass = {
    green:
      "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400",

    orange:
      "bg-orange-100 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400",

    blue:
      "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",

    purple:
      "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  }[type];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111a2e]">

      <div className="flex items-center gap-3">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <div className="min-w-0">

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="mt-0.5 truncate font-bold">
            {value}
          </p>

        </div>
      </div>

      <p className="mt-3 text-[11px] text-slate-400">
        {description}
      </p>

    </div>
  );
}

/* =========================================================
   INTELLIGENCE ITEM
========================================================= */

function IntelligenceItem({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-white/10">

      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">

        <span className="text-orange-500">
          {icon}
        </span>

        {title}

      </div>

      <p className="mt-2 text-sm font-semibold">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   SIGNAL
========================================================= */

function Signal({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 dark:bg-green-500/5">

      <CheckCircle2
        size={15}
        className="shrink-0 text-green-500"
      />

      <span className="text-xs text-slate-700 dark:text-slate-300">
        {text}
      </span>

    </div>
  );
}

/* =========================================================
   REQUIREMENT
========================================================= */

function Requirement({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2.5 dark:border-white/10">

      <span className="text-xs text-slate-500 dark:text-slate-400">
        {label}
      </span>

      <span className="max-w-[65%] text-right text-xs font-semibold">
        {value}
      </span>

    </div>
  );
}

/* =========================================================
   CAPABILITY
========================================================= */

function Capability({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-white/10">

      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-500/10">
        {icon}
      </div>

      <h3 className="mt-3 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
        {description}
      </p>

    </div>
  );
}

/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-5 rounded-xl border border-slate-200 p-3 dark:border-white/10">

      <span className="text-xs text-slate-500 dark:text-slate-400">
        {label}
      </span>

      <span className="max-w-[65%] text-right text-sm font-semibold">
        {value}
      </span>

    </div>
  );
}

/* =========================================================
   MINI INFO
========================================================= */

function MiniInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/[0.03]">

      <p className="text-[9px] uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-[11px] font-semibold">
        {value}
      </p>

    </div>
  );
}