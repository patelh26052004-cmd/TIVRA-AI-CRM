"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  CheckCheck,
  Check,
  Clock3,
  Bot,
  UserRound,
  FileText,
  UserPlus,
  Tag,
  MessageSquare,
  X,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Trash2,
  Archive,
  BellOff,
  Bell,
  CheckCircle2,
  User,
  FilePlus2,
} from "lucide-react";

type Conversation = {
  id: number;
  name: string;
  phone: string;
  message: string;
  time: string;
  unread: number;
  status: "Hot" | "Warm" | "Cold";
  online: boolean;
  avatar: string;
  company: string;
};

type ChatMessage = {
  id: number;
  sender: "customer" | "ai" | "human";
  text: string;
  time: string;
  status?: "sent" | "delivered" | "read";
};

type Template = {
  id: number;
  title: string;
  text: string;
};

const conversations: Conversation[] = [
  {
    id: 1,
    name: "Rajesh Mehta",
    phone: "+91 98765 43210",
    message: "Can you send me the quotation?",
    time: "10:42 AM",
    unread: 2,
    status: "Hot",
    online: true,
    avatar: "RM",
    company: "Mehta Industries",
  },
  {
    id: 2,
    name: "Priya Shah",
    phone: "+91 98251 23456",
    message: "I want to know more about pricing.",
    time: "10:18 AM",
    unread: 1,
    status: "Warm",
    online: true,
    avatar: "PS",
    company: "Shah Enterprises",
  },
  {
    id: 3,
    name: "Amit Patel",
    phone: "+91 99090 45678",
    message: "Okay, I will check and let you know.",
    time: "Yesterday",
    unread: 0,
    status: "Warm",
    online: false,
    avatar: "AP",
    company: "Patel Manufacturing",
  },
  {
    id: 4,
    name: "Neha Desai",
    phone: "+91 97123 67890",
    message: "Please share the product details.",
    time: "Yesterday",
    unread: 0,
    status: "Cold",
    online: false,
    avatar: "ND",
    company: "Desai Traders",
  },
  {
    id: 5,
    name: "Vikram Joshi",
    phone: "+91 98980 12345",
    message: "I need a demo this week.",
    time: "Mon",
    unread: 0,
    status: "Hot",
    online: false,
    avatar: "VJ",
    company: "Joshi Tech",
  },
];

const initialMessages: Record<number, ChatMessage[]> = {
  1: [
    {
      id: 1,
      sender: "customer",
      text: "Hello, I want to know about your CRM software.",
      time: "10:31 AM",
    },
    {
      id: 2,
      sender: "ai",
      text: "Hello Rajesh! Sure. TIVRA AI is an AI-powered sales and lead automation CRM. I can help you with features, pricing, demo and quotation.",
      time: "10:32 AM",
      status: "read",
    },
    {
      id: 3,
      sender: "customer",
      text: "We are a manufacturing company. We need lead management and WhatsApp automation.",
      time: "10:34 AM",
    },
    {
      id: 4,
      sender: "ai",
      text: "That sounds like a good use case. TIVRA can help your sales team manage leads, automate WhatsApp follow-ups, score leads with AI and track the complete sales pipeline.",
      time: "10:35 AM",
      status: "read",
    },
    {
      id: 5,
      sender: "customer",
      text: "Can you send me the quotation?",
      time: "10:42 AM",
    },
  ],
  2: [
    {
      id: 1,
      sender: "customer",
      text: "Hi, I want to know more about pricing.",
      time: "10:10 AM",
    },
    {
      id: 2,
      sender: "ai",
      text: "Sure! I can help you understand the available plans and arrange a demo with our sales team.",
      time: "10:11 AM",
      status: "read",
    },
  ],
  3: [
    {
      id: 1,
      sender: "customer",
      text: "Okay, I will check and let you know.",
      time: "Yesterday",
    },
    {
      id: 2,
      sender: "human",
      text: "Sure Amit. Please let me know if you have any questions.",
      time: "Yesterday",
      status: "read",
    },
  ],
  4: [
    {
      id: 1,
      sender: "customer",
      text: "Please share the product details.",
      time: "Yesterday",
    },
  ],
  5: [
    {
      id: 1,
      sender: "customer",
      text: "I need a demo this week.",
      time: "Mon",
    },
    {
      id: 2,
      sender: "ai",
      text: "Absolutely. I can help you schedule a demo with our sales team.",
      time: "Mon",
      status: "read",
    },
  ],
};

const templates: Template[] = [
  {
    id: 1,
    title: "Welcome Message",
    text: "Hello {{name}}, thank you for contacting TIVRA AI. How can we help you today?",
  },
  {
    id: 2,
    title: "Demo Invitation",
    text: "Hi {{name}}, would you like to schedule a quick demo of TIVRA AI?",
  },
  {
    id: 3,
    title: "Quotation Follow-up",
    text: "Hello {{name}}, just checking if you had a chance to review the quotation we shared.",
  },
  {
    id: 4,
    title: "Thank You",
    text: "Thank you for your interest in TIVRA AI. Our team will contact you shortly.",
  },
];

const emojis = [
  "😀",
  "😂",
  "😍",
  "👍",
  "❤️",
  "🔥",
  "🎉",
  "😊",
  "🙏",
  "👏",
  "😎",
  "🤝",
  "💯",
  "✨",
  "📞",
  "📄",
  "🚀",
  "✅",
  "❌",
  "😉",
  "😢",
];

export default function WhatsAppPage() {
  const [selectedId, setSelectedId] = useState(1);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const [aiMode, setAiMode] = useState(true);
  const [optIn, setOptIn] = useState(true);

  const [showTemplates, setShowTemplates] = useState(false);
  const [showLeadDetails, setShowLeadDetails] = useState(true);
  const [showAssign, setShowAssign] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  const [showChatMenu, setShowChatMenu] = useState(false);
  const [showListMenu, setShowListMenu] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const [toast, setToast] = useState("");

  const [messages, setMessages] =
    useState<Record<number, ChatMessage[]>>(initialMessages);

  const [readState, setReadState] = useState<Record<number, boolean>>({});

  const [mutedState, setMutedState] =
    useState<Record<number, boolean>>({});

  const [archivedState, setArchivedState] =
    useState<Record<number, boolean>>({});

  const [assignedPerson, setAssignedPerson] = useState<
    Record<number, string>
  >({
    1: "Rahul Shah",
    2: "Neha Patel",
    3: "Amit Joshi",
    4: "Rahul Shah",
    5: "Neha Patel",
  });

  const notify = (text: string) => {
    setToast(text);

    window.setTimeout(() => {
      setToast("");
    }, 2200);
  };

  const selectedConversation =
    conversations.find((item) => item.id === selectedId) ??
    conversations[0];

  const filteredConversations = useMemo(() => {
    const term = search.toLowerCase().trim();

    return conversations.filter((conversation) => {
      if (archivedState[conversation.id]) return false;

      if (!term) return true;

      return (
        conversation.name.toLowerCase().includes(term) ||
        conversation.company.toLowerCase().includes(term) ||
        conversation.phone.toLowerCase().includes(term)
      );
    });
  }, [search, archivedState]);

  const selectConversation = (id: number) => {
    setSelectedId(id);
    setReadState((prev) => ({
      ...prev,
      [id]: true,
    }));

    setShowChatMenu(false);
    setShowListMenu(false);
    setShowEmoji(false);
    setShowTemplates(false);
  };

  const markAllAsRead = () => {
    const next: Record<number, boolean> = {};

    conversations.forEach((conversation) => {
      next[conversation.id] = true;
    });

    setReadState(next);
    setShowListMenu(false);

    notify("All conversations marked as read");
  };

  const toggleAllMute = () => {
    const allMuted = conversations.every(
      (conversation) => mutedState[conversation.id]
    );

    const next: Record<number, boolean> = {};

    conversations.forEach((conversation) => {
      next[conversation.id] = !allMuted;
    });

    setMutedState(next);
    setShowListMenu(false);

    notify(
      !allMuted
        ? "All notifications muted"
        : "All notifications unmuted"
    );
  };

  const archiveAll = () => {
    const next: Record<number, boolean> = {};

    conversations.forEach((conversation) => {
      next[conversation.id] = true;
    });

    setArchivedState(next);
    setShowListMenu(false);

    notify("All conversations archived");
  };

  const toggleSelectedMute = () => {
    const nextValue = !mutedState[selectedId];

    setMutedState((prev) => ({
      ...prev,
      [selectedId]: nextValue,
    }));

    setShowChatMenu(false);

    notify(
      nextValue
        ? "Notifications muted for this chat"
        : "Notifications unmuted for this chat"
    );
  };

  const archiveSelected = () => {
    const currentId = selectedId;

    setArchivedState((prev) => ({
      ...prev,
      [currentId]: true,
    }));

    setShowChatMenu(false);

    const nextConversation = conversations.find(
      (conversation) =>
        conversation.id !== currentId &&
        !archivedState[conversation.id]
    );

    if (nextConversation) {
      setSelectedId(nextConversation.id);
    }

    notify("Chat archived");
  };

  const clearChat = () => {
    setMessages((prev) => ({
      ...prev,
      [selectedId]: [],
    }));

    setShowChatMenu(false);

    notify("Chat cleared successfully");
  };

  const sendMessage = () => {
    const trimmed = message.trim();

    if (!trimmed) {
      notify("Please type a message");
      return;
    }

    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: "human",
      text: trimmed,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
    };

    setMessages((prev) => ({
      ...prev,
      [selectedId]: [
        ...(prev[selectedId] || []),
        newMessage,
      ],
    }));

    setMessage("");

    notify("Message sent");
  };

  const useTemplate = (templateText: string) => {
    const customerName =
      selectedConversation.name.split(" ")[0];

    const finalMessage = templateText.replace(
      "{{name}}",
      customerName
    );

    setMessage(finalMessage);
    setShowTemplates(false);

    notify("Approved template added");
  };

  const handleFile = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setMessage(`📎 ${file.name}`);

    notify(`${file.name} attached`);

    event.target.value = "";
  };

  const addEmoji = (emoji: string) => {
    setMessage((prev) => `${prev}${emoji}`);
    setShowEmoji(false);
  };

  const handleCall = () => {
    setShowChatMenu(false);
    notify(`Calling ${selectedConversation.name}...`);
  };

  const handleVideoCall = () => {
    setShowChatMenu(false);
    notify(`Starting video call with ${selectedConversation.name}...`);
  };

  const handleViewLead = () => {
    setShowLeadDetails(true);
    notify(`Lead opened: ${selectedConversation.name}`);
  };

  const handleCreateQuote = () => {
    notify(
      `Quotation creation started for ${selectedConversation.name}`
    );
  };

  const handleAssign = (person: string) => {
    setAssignedPerson((prev) => ({
      ...prev,
      [selectedId]: person,
    }));

    setShowAssign(false);

    notify(`Lead assigned to ${person}`);
  };

  const currentUnread =
    readState[selectedId] ? 0 : selectedConversation.unread;

  const currentMuted = !!mutedState[selectedId];

  const currentScore =
    selectedConversation.status === "Hot"
      ? 92
      : selectedConversation.status === "Warm"
        ? 68
        : 38;

  return (
    <div className="h-[calc(100vh-0px)] min-h-[650px] bg-slate-50 text-slate-900 dark:bg-[#070d19] dark:text-white">
      <div className="flex h-full overflow-hidden">

        {/* =========================================================
            LEFT SIDEBAR
        ========================================================== */}

        <aside className="flex w-[330px] shrink-0 flex-col border-r border-slate-200 bg-white dark:border-white/10 dark:bg-[#0b1222]">

          {/* Header */}
          <div className="border-b border-slate-200 p-4 dark:border-white/10">

            <div className="mb-4 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366]">
                  <MessageSquare size={21} />
                </div>

                <div>
                  <h1 className="text-lg font-bold">
                    WhatsApp AI
                  </h1>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Customer conversations
                  </p>
                </div>

              </div>

              {/* Conversation Menu */}
              <div className="relative">

                <button
                  type="button"
                  title="Conversation options"
                  onClick={() => {
                    setShowListMenu((prev) => !prev);
                    setShowChatMenu(false);
                  }}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-orange-500 dark:hover:bg-white/10"
                >
                  <MoreVertical size={19} />
                </button>

                {showListMenu && (
                  <div className="absolute right-0 top-full z-[999] mt-2 w-60 rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl dark:border-white/10 dark:bg-[#111a2e]">

                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium hover:bg-orange-50 dark:hover:bg-white/10"
                    >
                      <CheckCircle2 size={15} />
                      Mark all as read
                    </button>

                    <button
                      type="button"
                      onClick={toggleAllMute}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium hover:bg-orange-50 dark:hover:bg-white/10"
                    >
                      {conversations.every(
                        (conversation) =>
                          mutedState[conversation.id]
                      ) ? (
                        <Bell size={15} />
                      ) : (
                        <BellOff size={15} />
                      )}

                      {conversations.every(
                        (conversation) =>
                          mutedState[conversation.id]
                      )
                        ? "Unmute notifications"
                        : "Mute notifications"}
                    </button>

                    <button
                      type="button"
                      onClick={archiveAll}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium hover:bg-orange-50 dark:hover:bg-white/10"
                    >
                      <Archive size={15} />
                      Archive conversations
                    </button>

                  </div>
                )}

              </div>
            </div>

            {/* Search */}
            <div className="relative">

              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search conversations..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-orange-400 dark:border-white/10 dark:bg-white/5"
              />

            </div>

          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">

            {filteredConversations.map((conversation) => {

              const active =
                conversation.id === selectedId;

              const unread =
                readState[conversation.id]
                  ? 0
                  : conversation.unread;

              const muted =
                !!mutedState[conversation.id];

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() =>
                    selectConversation(conversation.id)
                  }
                  className={`flex w-full gap-3 border-b border-slate-100 p-4 text-left transition dark:border-white/5 ${
                    active
                      ? "bg-orange-50 dark:bg-orange-500/10"
                      : "hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >

                  <div className="relative shrink-0">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-bold text-white">
                      {conversation.avatar}
                    </div>

                    {conversation.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-[#0b1222]" />
                    )}

                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex items-center justify-between gap-2">

                      <p className="truncate text-sm font-semibold">
                        {conversation.name}
                      </p>

                      <span className="shrink-0 text-[11px] text-slate-400">
                        {conversation.time}
                      </span>

                    </div>

                    <div className="mt-1 flex items-center justify-between gap-2">

                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {conversation.message}
                      </p>

                      <div className="flex shrink-0 items-center gap-1">

                        {muted && (
                          <BellOff
                            size={12}
                            className="text-slate-400"
                          />
                        )}

                        {unread > 0 && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white">
                            {unread}
                          </span>
                        )}

                      </div>

                    </div>

                    <div className="mt-2 flex items-center gap-2">

                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          conversation.status === "Hot"
                            ? "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                            : conversation.status === "Warm"
                              ? "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                              : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                        }`}
                      >
                        {conversation.status}
                      </span>

                      <span className="truncate text-[10px] text-slate-400">
                        {conversation.company}
                      </span>

                    </div>

                  </div>

                </button>
              );
            })}

            {filteredConversations.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-500">
                No conversations found.
              </div>
            )}

          </div>

        </aside>

        {/* =========================================================
            CENTER CHAT
        ========================================================== */}

        <main className="flex min-w-0 flex-1 flex-col bg-[#efeae2] dark:bg-[#0e1726]">

          {/* Chat Header */}
          <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 dark:border-white/10 dark:bg-[#111a2e]">

            <div className="flex items-center gap-3">

              <div className="relative">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-bold text-white">
                  {selectedConversation.avatar}
                </div>

                {selectedConversation.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-[#111a2e]" />
                )}

              </div>

              <div>

                <div className="flex items-center gap-2">

                  <h2 className="font-semibold">
                    {selectedConversation.name}
                  </h2>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      selectedConversation.status === "Hot"
                        ? "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                        : selectedConversation.status === "Warm"
                          ? "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                          : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                    }`}
                  >
                    {selectedConversation.status}
                  </span>

                  {currentMuted && (
                    <BellOff
                      size={13}
                      className="text-slate-400"
                    />
                  )}

                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedConversation.phone}
                  {selectedConversation.online &&
                    " • online"}
                </p>

              </div>

            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1">

              <button
                type="button"
                title="Call"
                onClick={handleCall}
                className="rounded-lg p-2.5 text-slate-500 hover:bg-slate-100 hover:text-orange-500 dark:hover:bg-white/10"
              >
                <Phone size={18} />
              </button>

              <button
                type="button"
                title="Video call"
                onClick={handleVideoCall}
                className="rounded-lg p-2.5 text-slate-500 hover:bg-slate-100 hover:text-orange-500 dark:hover:bg-white/10"
              >
                <Video size={18} />
              </button>

              {/* Chat More Menu */}
              <div className="relative">

                <button
                  type="button"
                  title="More options"
                  onClick={() => {
                    setShowChatMenu((prev) => !prev);
                    setShowListMenu(false);
                  }}
                  className="rounded-lg p-2.5 text-slate-500 hover:bg-slate-100 hover:text-orange-500 dark:hover:bg-white/10"
                >
                  <MoreVertical size={18} />
                </button>

                {showChatMenu && (
                  <div className="absolute right-0 top-full z-[999] mt-2 w-60 rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl dark:border-white/10 dark:bg-[#111a2e]">

                    <button
                      type="button"
                      onClick={handleViewLead}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium hover:bg-orange-50 dark:hover:bg-white/10"
                    >
                      <User size={15} />
                      View contact
                    </button>

                    <button
                      type="button"
                      onClick={toggleSelectedMute}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium hover:bg-orange-50 dark:hover:bg-white/10"
                    >
                      {currentMuted ? (
                        <Bell size={15} />
                      ) : (
                        <BellOff size={15} />
                      )}

                      {currentMuted
                        ? "Unmute notifications"
                        : "Mute notifications"}
                    </button>

                    <button
                      type="button"
                      onClick={archiveSelected}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium hover:bg-orange-50 dark:hover:bg-white/10"
                    >
                      <Archive size={15} />
                      Archive chat
                    </button>

                    <div className="my-1 border-t border-slate-100 dark:border-white/10" />

                    <button
                      type="button"
                      onClick={clearChat}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <Trash2 size={14} />
                      Clear chat
                    </button>

                  </div>
                )}

              </div>

            </div>

          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto px-5 py-6">

            <div className="mx-auto max-w-3xl space-y-3">

              <div className="mb-5 text-center">

                <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] text-slate-500 shadow-sm dark:bg-white/10 dark:text-slate-400">
                  Today
                </span>

              </div>

              {(messages[selectedId] || []).map(
                (msg) => {

                  const isCustomer =
                    msg.sender === "customer";

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isCustomer
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >

                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${
                          isCustomer
                            ? "rounded-tl-sm bg-white text-slate-800 dark:bg-[#1b2639] dark:text-slate-100"
                            : msg.sender === "ai"
                              ? "rounded-tr-sm bg-orange-100 text-slate-800 dark:bg-orange-500/20 dark:text-orange-50"
                              : "rounded-tr-sm bg-orange-500 text-white"
                        }`}
                      >

                        {!isCustomer && (
                          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold">

                            {msg.sender === "ai" ? (
                              <>
                                <Bot size={12} />
                                AI Sales Agent
                              </>
                            ) : (
                              <>
                                <UserRound size={12} />
                                Sales Team
                              </>
                            )}

                          </div>
                        )}

                        <p className="whitespace-pre-wrap text-sm leading-6">
                          {msg.text}
                        </p>

                        <div
                          className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                            isCustomer
                              ? "text-slate-400"
                              : msg.sender === "human"
                                ? "text-orange-100"
                                : "text-slate-500"
                          }`}
                        >

                          <span>{msg.time}</span>

                          {!isCustomer &&
                            (msg.status === "read" ? (
                              <CheckCheck size={13} />
                            ) : msg.status === "sent" ? (
                              <Check size={13} />
                            ) : (
                              <Clock3 size={12} />
                            ))}

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

              {(!messages[selectedId] ||
                messages[selectedId].length === 0) && (
                <div className="py-20 text-center">

                  <MessageSquare
                    size={35}
                    className="mx-auto text-slate-400"
                  />

                  <p className="mt-3 text-sm text-slate-500">
                    No messages in this conversation.
                  </p>

                </div>
              )}

            </div>

          </div>

          {/* Message Composer */}
          <div className="relative shrink-0 border-t border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-[#111a2e]">

            <div className="mx-auto flex max-w-3xl items-end gap-2">

              {/* Attachment */}
              <label
                title="Attach file"
                className="cursor-pointer rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
              >

                <Paperclip size={19} />

                <input
                  type="file"
                  className="hidden"
                  onChange={handleFile}
                />

              </label>

              <div className="relative flex-1">

                <textarea
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  onKeyDown={(event) => {

                    if (
                      event.key === "Enter" &&
                      !event.shiftKey
                    ) {
                      event.preventDefault();
                      sendMessage();
                    }

                  }}
                  rows={1}
                  placeholder={
                    aiMode
                      ? "AI is handling this conversation..."
                      : "Type a message..."
                  }
                  className="max-h-28 min-h-[44px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-24 text-sm outline-none transition focus:border-orange-400 dark:border-white/10 dark:bg-white/5"
                />

                {/* Emoji */}
                <button
                  type="button"
                  title="Emoji"
                  onClick={() =>
                    setShowEmoji((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-orange-500"
                >
                  <Smile size={18} />
                </button>

                {showEmoji && (
                  <div className="absolute bottom-12 right-0 z-[300] grid w-56 grid-cols-7 gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-white/10 dark:bg-[#111a2e]">

                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => addEmoji(emoji)}
                        className="rounded-lg p-1.5 text-lg hover:bg-orange-50 dark:hover:bg-white/10"
                      >
                        {emoji}
                      </button>
                    ))}

                  </div>
                )}

              </div>

              {/* Send */}
              <button
                type="button"
                onClick={sendMessage}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
                title="Send"
              >
                <Send size={18} />
              </button>

            </div>

            {/* Approved Templates */}
            <div className="mx-auto mt-2 flex max-w-3xl items-center justify-between">

              <div className="flex items-center gap-2 text-[10px] text-slate-400">

                <ShieldCheck size={13} />

                WhatsApp Business messaging

              </div>

              <div className="relative">

                <button
                  type="button"
                  onClick={() =>
                    setShowTemplates((prev) => !prev)
                  }
                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/10"
                  title="Approved message templates"
                >
                  <FileText size={16} />
                  Approved Message Templates
                </button>

                {showTemplates && (
                  <div className="absolute bottom-full right-0 z-[500] mb-3 w-96 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-white/10 dark:bg-[#111a2e]">

                    <div className="flex items-center justify-between border-b border-slate-100 px-2 py-2 dark:border-white/10">

                      <div>

                        <p className="text-sm font-semibold">
                          Approved Message Templates
                        </p>

                        <p className="text-[10px] text-slate-400">
                          Select an approved WhatsApp message
                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setShowTemplates(false)
                        }
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                      >
                        <X size={15} />
                      </button>

                    </div>

                    <div className="mt-1 max-h-72 overflow-y-auto">

                      {templates.map((template) => (
                        <button
                          key={template.id}
                          type="button"
                          onClick={() =>
                            useTemplate(template.text)
                          }
                          className="w-full rounded-lg p-3 text-left transition hover:bg-orange-50 dark:hover:bg-orange-500/10"
                        >

                          <div className="flex items-center gap-2">

                            <FilePlus2
                              size={14}
                              className="text-orange-500"
                            />

                            <p className="text-xs font-semibold text-orange-500">
                              {template.title}
                            </p>

                          </div>

                          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            {template.text}
                          </p>

                        </button>
                      ))}

                    </div>

                  </div>
                )}

              </div>

              <span className="text-[10px] text-slate-400">
                Enter to send • Shift + Enter for new line
              </span>

            </div>

          </div>

        </main>

        {/* =========================================================
            RIGHT LEAD PANEL
        ========================================================== */}

        {showLeadDetails && (
          <aside className="block w-[300px] shrink-0 overflow-y-auto border-l border-slate-200 bg-white dark:border-white/10 dark:bg-[#0b1222]">

            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-white/10">

              <h3 className="font-semibold">
                Lead Information
              </h3>

              <button
                type="button"
                onClick={() =>
                  setShowLeadDetails(false)
                }
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                title="Close"
              >
                <X size={17} />
              </button>

            </div>

            <div className="p-4">

              {/* Profile */}
              <div className="text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-lg font-bold text-white">
                  {selectedConversation.avatar}
                </div>

                <h3 className="mt-3 font-semibold">
                  {selectedConversation.name}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedConversation.company}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {selectedConversation.phone}
                </p>

              </div>

              {/* Score */}
              <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 dark:border-red-500/10 dark:bg-red-500/5">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      AI Lead Score
                    </p>

                    <p className="mt-1 text-2xl font-bold text-red-500">
                      {currentScore}
                    </p>

                  </div>

                  <div className="rounded-full bg-red-100 p-2 text-red-500 dark:bg-red-500/10">
                    <Sparkles size={18} />
                  </div>

                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-red-100 dark:bg-white/10">

                  <div
                    className="h-full rounded-full bg-red-500 transition-all"
                    style={{
                      width: `${currentScore}%`,
                    }}
                  />

                </div>

                <p className="mt-2 text-[10px] font-semibold text-red-500">

                  {selectedConversation.status === "Hot"
                    ? "High buying intent"
                    : selectedConversation.status === "Warm"
                      ? "Moderate buying intent"
                      : "Low buying intent"}

                </p>

              </div>

              {/* AI Mode */}
              <div className="mt-4 rounded-xl border border-slate-200 p-4 dark:border-white/10">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <div className="rounded-lg bg-orange-100 p-2 text-orange-500 dark:bg-orange-500/10">
                      <Bot size={17} />
                    </div>

                    <div>

                      <p className="text-xs font-semibold">
                        AI Sales Agent
                      </p>

                      <p className="text-[10px] text-slate-400">
                        {aiMode
                          ? "Handling conversation"
                          : "Human takeover"}
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setAiMode((prev) => !prev)
                    }
                    className={`relative h-6 w-11 rounded-full transition ${
                      aiMode
                        ? "bg-orange-500"
                        : "bg-slate-300 dark:bg-white/20"
                    }`}
                  >

                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                        aiMode ? "left-6" : "left-1"
                      }`}
                    />

                  </button>

                </div>

                <div
                  className={`mt-3 rounded-lg p-2.5 text-[10px] leading-4 ${
                    aiMode
                      ? "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300"
                      : "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-300"
                  }`}
                >
                  {aiMode
                    ? "AI will continue replying based on approved knowledge and conversation context."
                    : "Human takeover is active. AI replies are paused."}
                </div>

              </div>

              {/* Opt In */}
              <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-white/10">

                <div>

                  <p className="text-xs font-semibold">
                    WhatsApp Opt-in
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Marketing messages allowed
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setOptIn((prev) => !prev)
                  }
                  className={`relative h-6 w-11 rounded-full transition ${
                    optIn
                      ? "bg-green-500"
                      : "bg-slate-300 dark:bg-white/20"
                  }`}
                >

                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                      optIn ? "left-6" : "left-1"
                    }`}
                  />

                </button>

              </div>

              {/* Customer Details */}
              <div className="mt-4">

                <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Customer Details
                </p>

                <div className="space-y-2 rounded-xl border border-slate-200 p-3 dark:border-white/10">

                  <InfoRow
                    label="Company"
                    value={selectedConversation.company}
                  />

                  <InfoRow
                    label="Business Type"
                    value="Manufacturing"
                  />

                  <InfoRow
                    label="Requirement"
                    value="CRM + WhatsApp Automation"
                  />

                  <InfoRow
                    label="Budget"
                    value="₹50,000 – ₹1,00,000"
                  />

                  <InfoRow
                    label="Timeline"
                    value="Within 30 days"
                  />

                  <InfoRow
                    label="Source"
                    value="WhatsApp Campaign"
                  />

                </div>

              </div>

              {/* Tags */}
              <div className="relative mt-4">

                <button
                  type="button"
                  onClick={() =>
                    setShowTags((prev) => !prev)
                  }
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
                >

                  <span className="flex items-center gap-2 text-xs font-semibold">

                    <Tag
                      size={15}
                      className="text-orange-500"
                    />

                    Tags

                  </span>

                  <ChevronDown
                    size={15}
                    className={`transition ${
                      showTags ? "rotate-180" : ""
                    }`}
                  />

                </button>

                {showTags && (
                  <div className="mt-2 rounded-xl border border-slate-200 p-3 dark:border-white/10">

                    <div className="flex flex-wrap gap-2">

                      <span className="rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                        Hot Lead
                      </span>

                      <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        Manufacturing
                      </span>

                      <span className="rounded-full bg-purple-100 px-2.5 py-1 text-[10px] font-semibold text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                        WhatsApp
                      </span>

                    </div>

                  </div>
                )}

              </div>

              {/* Assignment */}
              <div className="relative mt-4">

                <button
                  type="button"
                  onClick={() =>
                    setShowAssign((prev) => !prev)
                  }
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
                >

                  <span className="flex items-center gap-2 text-xs font-semibold">

                    <UserPlus
                      size={15}
                      className="text-orange-500"
                    />

                    Assigned To

                  </span>

                  <span className="text-xs text-slate-500">
                    {assignedPerson[selectedId] ||
                      "Unassigned"}
                  </span>

                </button>

                {showAssign && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-[#111a2e]">

                    {[
                      "Rahul Shah",
                      "Neha Patel",
                      "Amit Joshi",
                    ].map((person) => (
                      <button
                        key={person}
                        type="button"
                        onClick={() =>
                          handleAssign(person)
                        }
                        className="w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-orange-50 dark:hover:bg-orange-500/10"
                      >
                        {person}
                      </button>
                    ))}

                  </div>
                )}

              </div>

              {/* Timeline */}
              <div className="mt-4">

                <button
                  type="button"
                  onClick={() =>
                    setShowTimeline((prev) => !prev)
                  }
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
                >

                  <span className="flex items-center gap-2 text-xs font-semibold">

                    <Clock3
                      size={15}
                      className="text-orange-500"
                    />

                    Conversation Timeline

                  </span>

                  <ChevronDown
                    size={15}
                    className={`transition ${
                      showTimeline ? "rotate-180" : ""
                    }`}
                  />

                </button>

                {showTimeline && (
                  <div className="mt-2 rounded-xl border border-slate-200 p-4 dark:border-white/10">

                    <TimelineItem
                      time="10:31 AM"
                      title="Lead contacted"
                      text="Customer started WhatsApp conversation"
                    />

                    <TimelineItem
                      time="10:35 AM"
                      title="AI qualification"
                      text="Requirement identified"
                    />

                    <TimelineItem
                      time="10:38 AM"
                      title="Buying signal"
                      text="Customer showed interest in CRM"
                    />

                    <TimelineItem
                      time="10:42 AM"
                      title="Quotation requested"
                      text="Customer asked for quotation"
                      last
                    />

                  </div>
                )}

              </div>

              {/* Actions */}
              <div className="mt-5 grid grid-cols-2 gap-2">

                <button
                  type="button"
                  onClick={handleViewLead}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
                >
                  <User size={14} />
                  View Lead
                </button>

                <button
                  type="button"
                  onClick={handleCreateQuote}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-orange-500 px-3 py-2.5 text-xs font-semibold text-white hover:bg-orange-600"
                >
                  <FilePlus2 size={14} />
                  Create Quote
                </button>

              </div>

              <div className="mt-3 text-center text-[10px] text-slate-400">
                {currentUnread > 0
                  ? `${currentUnread} unread message${
                      currentUnread > 1 ? "s" : ""
                    }`
                  : "All messages read"}
              </div>

            </div>

          </aside>
        )}

        {!showLeadDetails && (
          <button
            type="button"
            onClick={() => setShowLeadDetails(true)}
            className="fixed right-4 top-24 z-40 rounded-xl bg-orange-500 px-3 py-2 text-xs font-semibold text-white shadow-lg"
          >
            Show Lead Info
          </button>
        )}

      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[2000] -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-2xl dark:bg-white dark:text-slate-900">
          {toast}
        </div>
      )}

    </div>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-slate-100 py-2 last:border-0 dark:border-white/5">

      <span className="text-[10px] text-slate-400">
        {label}
      </span>

      <span className="text-right text-[11px] font-medium text-slate-700 dark:text-slate-200">
        {value}
      </span>

    </div>
  );
}

function TimelineItem({
  time,
  title,
  text,
  last = false,
}: {
  time: string;
  title: string;
  text: string;
  last?: boolean;
}) {
  return (
    <div className="flex gap-3">

      <div className="flex flex-col items-center">

        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-500" />

        {!last && (
          <span className="mt-1 h-full w-px bg-slate-200 dark:bg-white/10" />
        )}

      </div>

      <div className="pb-4">

        <p className="text-[10px] text-slate-400">
          {time}
        </p>

        <p className="mt-0.5 text-xs font-semibold">
          {title}
        </p>

        <p className="mt-0.5 text-[10px] leading-4 text-slate-500 dark:text-slate-400">
          {text}
        </p>

      </div>

    </div>
  );
}