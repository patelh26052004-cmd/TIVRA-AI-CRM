"use client";

import { useMemo, useState } from "react";
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
} from "lucide-react";

type Sender = "customer" | "ai";

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

const aiReplies = [
  "Sure! I can help with that. Would you like me to arrange a demo with our sales team?",
  "Thanks for sharing that. Based on your requirement, TIVRA AI can help automate lead qualification and follow-ups.",
  "I understand. I can capture your requirement and pass it to our sales team for the next step.",
  "Absolutely. Let me help you with the next step and make sure your requirement is recorded.",
];

export default function AISalesAgentPage() {
  const [conversations, setConversations] =
    useState<Conversation[]>(conversationsData);

  const [selectedConversationId, setSelectedConversationId] = useState(1);

  const [message, setMessage] = useState("");

  const [humanTakeover, setHumanTakeover] = useState(false);

  const [showCapabilities, setShowCapabilities] = useState(false);

  const [showLeadDetails, setShowLeadDetails] = useState(false);

  const selectedConversation =
    conversations.find(
      (conversation) => conversation.id === selectedConversationId
    ) ?? conversations[0];

  const messages = selectedConversation.messages;

  const customerMessages = useMemo(
    () => messages.filter((item) => item.sender === "customer"),
    [messages]
  );

  const selectConversation = (id: number) => {
    setSelectedConversationId(id);
    setMessage("");
    setHumanTakeover(false);
  };

  const handleSend = () => {
    const trimmed = message.trim();

    if (!trimmed) return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const customerMessage: Message = {
      id: Date.now(),
      sender: "customer",
      text: trimmed,
      time: currentTime,
    };

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === selectedConversationId
          ? {
              ...conversation,
              lastMessage: trimmed,
              time: currentTime,
              messages: [...conversation.messages, customerMessage],
            }
          : conversation
      )
    );

    setMessage("");

    if (!humanTakeover) {
      setTimeout(() => {
        const reply =
          aiReplies[Math.floor(Math.random() * aiReplies.length)];

        const aiMessage: Message = {
          id: Date.now() + 1,
          sender: "ai",
          text: reply,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.id === selectedConversationId
              ? {
                  ...conversation,
                  lastMessage: reply,
                  time: aiMessage.time,
                  messages: [...conversation.messages, aiMessage],
                }
              : conversation
          )
        );
      }, 700);
    }
  };

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-4 py-6 text-slate-950 dark:bg-[#070c1b] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        {/* HEADER */}
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
              Let TIVRA AI qualify leads, understand requirements and assist
              your sales team.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowCapabilities(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:border-orange-300 hover:text-orange-500 dark:border-white/10 dark:bg-[#111a2e]"
            >
              <Sparkles size={17} />
              AI Capabilities
            </button>

            <button
              type="button"
              onClick={() => setHumanTakeover((prev) => !prev)}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                humanTakeover
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              <UserRound size={17} />

              {humanTakeover ? "Human Mode Active" : "Take Over"}
            </button>
          </div>
        </div>

        {/* STATUS CARDS */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatusCard
            icon={<MessageSquare size={18} />}
            title="Conversation"
            value="Active"
            description="Customer is responding"
            type="green"
          />

          <StatusCard
            icon={<Flame size={18} />}
            title="Lead Temperature"
            value={
              selectedConversation.score >= 80
                ? "Hot"
                : selectedConversation.score >= 60
                ? "Warm"
                : "Cold"
            }
            description="Based on AI lead scoring"
            type="orange"
          />

          <StatusCard
            icon={<Target size={18} />}
            title="AI Confidence"
            value={`${Math.min(
              98,
              selectedConversation.score + 2
            )}%`}
            description="AI confidence level"
            type="blue"
          />

          <StatusCard
            icon={<Clock3 size={18} />}
            title="Response Time"
            value="< 1 min"
            description="AI response speed"
            type="purple"
          />
        </section>

        {/* MAIN AREA */}
        <section className="grid min-h-[680px] grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111a2e] xl:grid-cols-[300px_minmax(0,1fr)_330px]">
          {/* LEFT CONVERSATIONS */}
          <aside className="hidden border-r border-slate-200 dark:border-white/10 xl:block">
            <div className="border-b border-slate-200 p-4 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">AI Conversations</h2>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {conversations.length} active conversations
                  </p>
                </div>

                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-orange-500 dark:hover:bg-white/5"
                >
                  <Settings2 size={17} />
                </button>
              </div>
            </div>

            <div className="space-y-1 p-2">
              {conversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  name={conversation.name}
                  company={conversation.company}
                  message={conversation.lastMessage}
                  time={conversation.time}
                  score={conversation.score.toString()}
                  active={conversation.id === selectedConversationId}
                  onClick={() => selectConversation(conversation.id)}
                />
              ))}
            </div>
          </aside>

          {/* CHAT */}
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
                      {selectedConversation.name}
                    </h2>

                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                      {selectedConversation.score >= 80
                        ? "HOT"
                        : selectedConversation.score >= 60
                        ? "WARM"
                        : "COLD"}
                    </span>
                  </div>

                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {selectedConversation.company} ·{" "}
                    {selectedConversation.phone}
                  </p>
                </div>
              </div>

              <div className="hidden items-center gap-2 sm:flex">
                <a
                  href={`tel:${selectedConversation.phone}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-orange-500 dark:hover:bg-white/5"
                  title="Call lead"
                >
                  <Phone size={17} />
                </a>

                <button
                  type="button"
                  onClick={() => setShowLeadDetails(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-orange-500 dark:hover:bg-white/5"
                  title="Lead details"
                >
                  <FileText size={17} />
                </button>
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
                      ? "AI replies are paused until you switch back to AI."
                      : "AI will automatically respond to customer messages."}
                  </p>
                </div>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/70 p-4 dark:bg-[#0b1222]/50 sm:p-5">
              <div className="flex justify-center">
                <span className="rounded-full bg-slate-200 px-3 py-1 text-[10px] text-slate-500 dark:bg-white/5 dark:text-slate-400">
                  Today
                </span>
              </div>

              {messages.map((item) => (
                <MessageBubble key={item.id} message={item} />
              ))}

              {!humanTakeover && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-orange-500 dark:bg-orange-500/10">
                    <Bot size={14} />
                  </div>

                  TIVRA AI is ready
                </div>
              )}
            </div>

            {/* INPUT */}
            <div className="border-t border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-[#111a2e] sm:p-4">
              {humanTakeover && (
                <div className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700 dark:bg-green-500/5 dark:text-green-400">
                  You are replying as a salesperson. AI responses are
                  currently paused.
                </div>
              )}

              <div className="flex items-end gap-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={2}
                  placeholder={
                    humanTakeover
                      ? `Reply to ${selectedConversation.name}...`
                      : `Type a message for ${selectedConversation.name}...`
                  }
                  className="min-h-[48px] flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 dark:border-white/10 dark:bg-[#0b1222]"
                />

                <button
                  type="button"
                  onClick={handleSend}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition hover:bg-orange-600"
                  title="Send message"
                >
                  <Send size={18} />
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                <span>
                  Press Enter to send · Shift + Enter for new line
                </span>

                <span className="hidden sm:block">
                  {customerMessages.length} customer messages
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT INTELLIGENCE */}
          <aside className="hidden border-l border-slate-200 dark:border-white/10 xl:block">
            <div className="border-b border-slate-200 p-4 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles size={17} className="text-orange-500" />

                <h2 className="font-semibold">Lead Intelligence</h2>
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
                    className="h-full rounded-full bg-orange-500"
                    style={{
                      width: `${selectedConversation.score}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs font-semibold text-orange-600 dark:text-orange-400">
                  {selectedConversation.score >= 80
                    ? "HOT LEAD"
                    : selectedConversation.score >= 60
                    ? "WARM LEAD"
                    : "COLD LEAD"}
                </p>
              </div>

              {/* INTENT */}
              <IntelligenceItem
                title="Detected Intent"
                value={selectedConversation.intent}
                icon={<Target size={16} />}
              />

              {/* BUYING SIGNALS */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Buying Signals
                </p>

                <div className="space-y-2">
                  {selectedConversation.score >= 80 && (
                    <>
                      <Signal text="Strong buying interest" />
                      <Signal text="High conversation engagement" />
                      <Signal text="Potential demo requirement" />
                    </>
                  )}

                  {selectedConversation.score >= 60 &&
                    selectedConversation.score < 80 && (
                      <>
                        <Signal text="Customer is interested" />
                        <Signal text="Product information requested" />
                      </>
                    )}

                  {selectedConversation.score < 60 && (
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
                    value={selectedConversation.requirement}
                  />

                  <Requirement
                    label="Timeline"
                    value={selectedConversation.timeline}
                  />

                  <Requirement
                    label="Stage"
                    value={selectedConversation.stage}
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
                      {Math.min(
                        98,
                        selectedConversation.score + 2
                      )}
                      %
                    </p>
                  </div>

                  <ShieldCheck
                    className="text-green-500"
                    size={22}
                  />
                </div>

                <div className="mt-3 h-1.5 rounded-full bg-slate-100 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{
                      width: `${Math.min(
                        98,
                        selectedConversation.score + 2
                      )}%`,
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
                  {selectedConversation.score >= 80
                    ? "Schedule a product demo and prepare a quotation."
                    : selectedConversation.score >= 60
                    ? "Follow up with product details and pricing."
                    : "Continue nurturing the lead and understand requirements."}
                </p>
              </div>
            </div>
          </aside>
        </section>
      </div>

      {/* AI CAPABILITIES MODAL */}
      {showCapabilities && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setShowCapabilities(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111a2e]"
            onClick={(e) => e.stopPropagation()}
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
                    What the AI Sales Agent can do
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCapabilities(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-2">
              <Capability
                icon={<MessageSquare size={18} />}
                title="Understand Intent"
                description="Detect product enquiries, pricing requests, demo requests and other customer intents."
              />

              <Capability
                icon={<Target size={18} />}
                title="Qualify Leads"
                description="Ask relevant questions to understand customer needs, budget and timeline."
              />

              <Capability
                icon={<FileText size={18} />}
                title="Extract Requirements"
                description="Capture product, quantity, business type, requirements and other useful details."
              />

              <Capability
                icon={<Flame size={18} />}
                title="Detect Buying Signals"
                description="Identify signals such as pricing questions, demo requests and purchase urgency."
              />

              <Capability
                icon={<ShieldCheck size={18} />}
                title="Use Approved Knowledge"
                description="Answer customer questions using approved company information and knowledge."
              />

              <Capability
                icon={<UserRound size={18} />}
                title="Human Handover"
                description="Pause AI responses and transfer the conversation to a salesperson when needed."
              />
            </div>
          </div>
        </div>
      )}

      {/* LEAD DETAILS MODAL */}
      {showLeadDetails && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setShowLeadDetails(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111a2e]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-orange-500">
                  Lead Details
                </p>

                <h2 className="mt-1 font-bold">
                  {selectedConversation.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowLeadDetails(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 p-5">
              <DetailRow
                label="Company"
                value={selectedConversation.company}
              />

              <DetailRow
                label="Email"
                value={selectedConversation.email}
              />

              <DetailRow
                label="Phone"
                value={selectedConversation.phone}
              />

              <DetailRow
                label="Lead Score"
                value={`${selectedConversation.score} / 100`}
              />

              <DetailRow
                label="Stage"
                value={selectedConversation.stage}
              />

              <DetailRow
                label="Timeline"
                value={selectedConversation.timeline}
              />

              <DetailRow
                label="Requirement"
                value={selectedConversation.requirement}
              />

              <DetailRow
                label="Intent"
                value={selectedConversation.intent}
              />
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
  const isCustomer = message.sender === "customer";

  return (
    <div
      className={`flex ${
        isCustomer ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-[85%] flex-col ${
          isCustomer ? "items-end" : "items-start"
        } sm:max-w-[72%]`}
      >
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
            isCustomer
              ? "rounded-br-md bg-orange-500 text-white"
              : "rounded-bl-md border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-[#111a2e] dark:text-slate-300"
          }`}
        >
          {!isCustomer && (
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-orange-500">
              <Bot size={14} />
              TIVRA AI
            </div>
          )}

          {message.text}
        </div>

        <span className="mt-1 px-1 text-[10px] text-slate-400">
          {message.time}
        </span>
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
  score: string;
  active?: boolean;
  onClick: () => void;
}) {
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
                Number(score) >= 80
                  ? "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                  : Number(score) >= 60
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
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  type: "green" | "orange" | "blue" | "purple";
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

        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="mt-0.5 font-bold">{value}</p>
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
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span className="text-orange-500">{icon}</span>

        {title}
      </div>

      <p className="mt-2 text-sm font-semibold">{value}</p>
    </div>
  );
}

/* =========================================================
   SIGNAL
========================================================= */

function Signal({ text }: { text: string }) {
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

      <span className="text-right text-xs font-semibold">
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
  icon: React.ReactNode;
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