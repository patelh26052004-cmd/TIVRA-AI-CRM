"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileText,
  Flame,
  Globe2,
  LayoutDashboard,
  Menu,
  MessageCircle,
  Moon,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Sales Agent",
    text: "Understand customer intent, qualify enquiries and guide conversations.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp AI",
    text: "Turn WhatsApp conversations into organized sales opportunities.",
  },
  {
    icon: Users,
    title: "Lead CRM",
    text: "Manage contacts, requirements, owners, stages and activities.",
  },
  {
    icon: Target,
    title: "AI Lead Scoring",
    text: "Identify high-intent opportunities and prioritize your sales team.",
  },
  {
    icon: Clock3,
    title: "Smart Follow-ups",
    text: "Automate personalized follow-ups without losing the human touch.",
  },
  {
    icon: FileText,
    title: "AI Quotations",
    text: "Create quotation drafts from customer requirements for approval.",
  },
  {
    icon: TrendingUp,
    title: "AI Analytics",
    text: "Understand pipeline, conversion and sales performance.",
  },
  {
    icon: Globe2,
    title: "Campaign Manager",
    text: "Track campaigns, sources, leads and conversions in one place.",
  },
  {
    icon: BrainCircuit,
    title: "Knowledge Base",
    text: "Give AI access to approved products, pricing, FAQs and company information.",
  },
];

const steps = [
  ["01", "Customer Enquiry", "Capture enquiries from website, WhatsApp and campaigns."],
  ["02", "AI Qualification", "Understand intent, requirements, budget and timeline."],
  ["03", "Lead Scoring", "Identify which opportunities need attention first."],
  ["04", "Follow-up", "Automatically keep conversations moving."],
  ["05", "Salesperson Takes Over", "Hand high-intent opportunities to your sales team."],
  ["06", "Win & Grow", "Convert opportunities and understand what drives revenue."],
];

const faqs = [
  {
    q: "What is TIVRA AI?",
    a: "TIVRA AI is an AI-powered sales and lead automation platform that helps businesses capture, qualify, manage and follow up with sales opportunities.",
  },
  {
    q: "Can TIVRA AI work with WhatsApp?",
    a: "Yes. TIVRA is designed to connect with the official WhatsApp Business Platform so businesses can manage customer conversations and sales workflows.",
  },
  {
    q: "Does TIVRA replace salespeople?",
    a: "No. TIVRA is designed to support sales teams. AI handles repetitive qualification and follow-up tasks while salespeople can take over important conversations.",
  },
  {
    q: "Can AI create quotations?",
    a: "Yes. TIVRA can prepare quotation drafts based on approved product and pricing information. A salesperson or admin should approve the quotation before it is sent.",
  },
  {
    q: "Can I track my sales performance?",
    a: "Yes. TIVRA provides dashboards and analytics for leads, pipeline, follow-ups, quotations and conversions.",
  },
  {
    q: "Is TIVRA suitable for different businesses?",
    a: "TIVRA is designed for manufacturers, service businesses, software companies and sales teams that manage customer enquiries and opportunities.",
  },
];

export default function Home() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("tivra_theme");

    if (saved === "light") {
      setDark(false);
    }
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("tivra_theme", next ? "dark" : "light");
  }

  const bg = dark ? "bg-[#070c1b]" : "bg-white";
  const section = dark ? "bg-[#0d1426]" : "bg-slate-50";
  const card = dark
    ? "border-white/10 bg-[#111a2e]"
    : "border-slate-200 bg-white";
  const text = dark ? "text-white" : "text-slate-950";
  const muted = dark ? "text-slate-400" : "text-slate-600";
  const soft = dark ? "text-slate-500" : "text-slate-500";
  const border = dark ? "border-white/10" : "border-slate-200";

  return (
    <main className={`${bg} ${text} min-h-screen transition-colors duration-300`}>
      {/* NAVBAR */}
      <header
        className={`fixed left-0 right-0 top-0 z-50 border-b ${border} ${
          dark ? "bg-[#070c1b]/90" : "bg-white/90"
        } backdrop-blur-xl`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 font-black text-white">
              T
            </div>

            <span className="text-xl font-black">
              TIVRA <span className="text-orange-500">AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            <a href="#features" className={`text-sm ${muted} hover:text-orange-500`}>
              Features
            </a>
            <a href="#how-it-works" className={`text-sm ${muted} hover:text-orange-500`}>
              How It Works
            </a>
            <a href="#solutions" className={`text-sm ${muted} hover:text-orange-500`}>
              Solutions
            </a>
            <a href="#faq" className={`text-sm ${muted} hover:text-orange-500`}>
              FAQ
            </a>
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <button
              onClick={toggleTheme}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${border} ${
                dark ? "bg-slate-900" : "bg-slate-100"
              }`}
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <Link
              href="/login"
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${muted} hover:text-orange-500`}
            >
              Login
            </Link>

            <Link
              href="/login"
              className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-400"
            >
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-xl border border-white/10 p-2 lg:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div
            className={`border-t ${border} px-5 py-5 lg:hidden ${
              dark ? "bg-[#070c1b]" : "bg-white"
            }`}
          >
            <div className="flex flex-col gap-4">
              <a href="#features" onClick={() => setMenuOpen(false)}>
                Features
              </a>
              <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
                How It Works
              </a>
              <a href="#solutions" onClick={() => setMenuOpen(false)}>
                Solutions
              </a>
              <a href="#faq" onClick={() => setMenuOpen(false)}>
                FAQ
              </a>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={toggleTheme}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border ${border}`}
                >
                  {dark ? <Sun size={17} /> : <Moon size={17} />}
                </button>

                <Link
                  href="/login"
                  className="rounded-xl border border-orange-500 px-5 py-2.5 text-sm font-bold text-orange-500"
                >
                  Login
                </Link>

                <Link
                  href="/login"
                  className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden pt-32">
        <div className="absolute left-1/4 top-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-bold text-orange-500">
              <Sparkles size={14} />
              AI-powered sales automation
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Turn Every Enquiry Into a{" "}
              <span className="text-orange-500">Sales Opportunity.</span>
            </h1>

            <p className={`mt-7 max-w-2xl text-base leading-8 ${muted} sm:text-lg`}>
              TIVRA AI helps businesses capture, qualify, engage and follow up
              with leads — so sales teams can focus on closing deals.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-500/20 hover:bg-orange-400"
              >
                Get Started
                <ArrowRight size={17} />
              </Link>

              <a
                href="#how-it-works"
                className={`rounded-xl border ${border} px-6 py-3.5 text-sm font-bold ${muted} hover:text-orange-500`}
              >
                See How It Works
              </a>
            </div>
          </div>

          {/* DASHBOARD PREVIEW */}
          <div className={`relative rounded-3xl border ${border} ${card} p-4 shadow-2xl`}>
            <div className="rounded-2xl bg-slate-950 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-500">TIVRA AI</p>
                  <p className="text-sm font-bold text-white">Sales Dashboard</p>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-xs font-black">
                  T
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <MiniStat title="Total Leads" value="1,248" />
                <MiniStat title="Hot Leads" value="86" />
                <MiniStat title="Follow-ups" value="42" />
                <MiniStat title="Conversion" value="18.4%" />
              </div>

              <div className="mt-3 rounded-xl bg-[#111a2e] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white">Hot Lead</p>
                  <span className="text-xs font-bold text-orange-500">
                    🔥 92/100
                  </span>
                </div>

                <p className="mt-2 text-[10px] text-slate-500">
                  Customer requested pricing and a demo.
                </p>

                <div className="mt-4 h-1.5 rounded-full bg-slate-800">
                  <div className="h-full w-[92%] rounded-full bg-orange-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className={`border-y ${border} ${section}`}>
        <div className="mx-auto max-w-4xl px-5 py-16 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
            One intelligent sales platform
          </p>

          <h2 className="mt-4 text-3xl font-black sm:text-4xl">
            Your leads deserve more than a spreadsheet.
          </h2>

          <p className={`mx-auto mt-5 max-w-2xl leading-7 ${muted}`}>
            TIVRA brings lead capture, AI qualification, follow-ups,
            conversations, quotations and analytics together in one sales
            workspace.
          </p>
        </div>
      </section>

      {/* PROBLEM */}
      <section className={`py-24 ${bg}`}>
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
                The real problem
              </p>

              <h2 className="mt-4 max-w-xl text-4xl font-black leading-tight sm:text-5xl">
                Are valuable leads getting lost?
              </h2>

              <p className={`mt-5 max-w-xl leading-7 ${muted}`}>
                Sales teams often lose opportunities because enquiries are
                scattered, follow-ups are missed and high-intent customers are
                not identified quickly enough.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Leads are coming from multiple channels.",
                  "Salespeople do not know which lead needs attention first.",
                  "Follow-ups are forgotten or delayed.",
                  "Customer requirements are difficult to track.",
                  "Quotations are prepared manually.",
                  "Managers lack a complete view of the pipeline.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                      <Check size={12} />
                    </div>
                    <p className={`text-sm ${muted}`}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                ["Lead overload", "Too many enquiries to manually prioritize."],
                ["Missed follow-ups", "Potential customers go cold."],
                ["Scattered data", "Customer information lives in different places."],
                ["Slow response", "Sales teams spend time on repetitive work."],
                ["Poor visibility", "Managers cannot see the complete pipeline."],
                ["Lost revenue", "Good opportunities are missed."],
              ].map(([title, description], i) => (
                <div
                  key={title}
                  className={`rounded-2xl border ${border} ${card} p-5`}
                >
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                    <Zap size={17} />
                  </div>

                  <h3 className="font-bold">{title}</h3>
                  <p className={`mt-2 text-xs leading-5 ${soft}`}>
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI ENGINE */}
      <section className={`py-24 ${section}`}>
        <div className="mx-auto max-w-5xl px-5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
            Your intelligent sales engine
          </p>

          <h2 className="mt-4 text-4xl font-black">
            AI that understands the sales journey.
          </h2>

          <p className={`mx-auto mt-5 max-w-2xl ${muted}`}>
            TIVRA connects every important step between the first enquiry and
            the final sale.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            {[
              "Lead",
              "AI Conversation",
              "Qualification",
              "Lead Score",
              "Follow-up",
              "Quotation",
              "Sale",
            ].map((item, index) => (
              <div key={item} className="flex items-center gap-2">
                <div
                  className={`rounded-xl border ${border} ${
                    dark ? "bg-[#111a2e]" : "bg-white"
                  } px-4 py-3 text-xs font-semibold`}
                >
                  {item}
                </div>

                {index < 6 && <ChevronRight size={14} className={soft} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className={`py-24 ${bg}`}>
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
            Powerful tools
          </p>

          <h2 className="mt-4 max-w-2xl text-4xl font-black sm:text-5xl">
            Everything your sales team needs.
          </h2>

          <p className={`mt-5 max-w-2xl ${muted}`}>
            From lead capture to quotation and conversion, TIVRA gives your
            team one intelligent sales workspace.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className={`group rounded-2xl border ${border} ${card} p-6 transition hover:-translate-y-1 hover:border-orange-500/30`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-6 font-bold">{feature.title}</h3>

                  <p className={`mt-2 text-sm leading-6 ${soft}`}>
                    {feature.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className={`py-24 ${section}`}>
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              Simple sales workflow
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              From lead to customer, step by step.
            </h2>

            <p className={`mx-auto mt-5 max-w-2xl ${muted}`}>
              TIVRA helps your team understand what happened, what matters
              and what should happen next.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map(([number, title, description]) => (
              <div
                key={number}
                className={`rounded-2xl border ${border} ${card} p-6`}
              >
                <p className="text-sm font-black text-orange-500">
                  {number}
                </p>

                <h3 className="mt-6 font-bold">{title}</h3>

                <p className={`mt-2 text-sm leading-6 ${soft}`}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEAD SCORING */}
      <section className={`py-24 ${bg}`}>
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              AI lead scoring
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              Know which leads need attention first.
            </h2>

            <p className={`mt-5 max-w-xl leading-7 ${muted}`}>
              TIVRA can analyze intent, engagement, fit, budget and timeline
              to help your team prioritize opportunities.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Intent and buying signals",
                "Customer engagement",
                "Budget and timeline",
                "Product and business fit",
                "Inactivity and disqualification signals",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Check size={16} className="text-orange-500" />
                  <span className={`text-sm ${muted}`}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-3xl border ${border} ${card} p-6`}>
            <div className="rounded-2xl bg-slate-950 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">AI Lead Score</p>
                  <p className="mt-2 text-5xl font-black text-white">92</p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500">
                  <Flame size={22} />
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Opportunity strength</span>
                  <span className="font-bold text-orange-500">HOT</span>
                </div>

                <div className="mt-3 h-2 rounded-full bg-slate-800">
                  <div className="h-full w-[92%] rounded-full bg-orange-500" />
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-[#111a2e] p-4">
                <p className="text-sm font-bold text-white">
                  Customer requested pricing + demo
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Purchase timeline appears to be within 7 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHATSAPP + AI */}
      <section className={`py-24 ${section}`}>
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
          <div className={`rounded-3xl border ${border} ${card} p-5`}>
            <div className="rounded-2xl bg-slate-950 p-5">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
                  <MessageCircle size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    TIVRA AI
                  </p>
                  <p className="text-[10px] text-slate-500">
                    AI Sales Agent
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-orange-500 p-3 text-xs text-white">
                  I need pricing for your ERP software.
                </div>

                <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-[#111a2e] p-3 text-xs text-slate-300">
                  Sure! I can help. Could you tell me your company size and
                  which modules you need?
                </div>

                <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-orange-500 p-3 text-xs text-white">
                  We need inventory, sales and accounting.
                </div>

                <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-[#111a2e] p-3 text-xs text-slate-300">
                  Great. I can prepare the relevant product information and
                  arrange a demo for you.
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              AI sales conversations
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              Let AI handle the first conversation.
            </h2>

            <p className={`mt-5 leading-7 ${muted}`}>
              TIVRA can understand customer intent, ask relevant questions,
              use approved company knowledge and identify when a salesperson
              should take over.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Understand customer intent",
                "Extract useful lead information",
                "Answer using approved knowledge",
                "Detect buying signals and objections",
                "Hand over to a human when needed",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                    <Check size={13} />
                  </div>

                  <span className={`text-sm ${muted}`}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOLLOW UP */}
      <section className={`py-24 ${bg}`}>
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              Smart follow-ups
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              Never lose track of the next action.
            </h2>

            <p className={`mx-auto mt-5 max-w-2xl ${muted}`}>
              Build follow-up sequences based on product, stage, campaign,
              segment or lead score.
            </p>
          </div>

          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["Day 1", "Welcome", "Respond quickly"],
              ["Day 2", "Requirement Help", "Understand needs"],
              ["Day 4", "Product Info", "Share relevant details"],
              ["Day 6", "Demo Invite", "Move toward meeting"],
              ["Day 8", "Quotation Follow-up", "Drive next action"],
            ].map(([day, title, text]) => (
              <div
                key={day}
                className={`rounded-2xl border ${border} ${card} p-5`}
              >
                <p className="text-xs font-black text-orange-500">{day}</p>
                <h3 className="mt-5 font-bold">{title}</h3>
                <p className={`mt-2 text-xs ${soft}`}>{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5 text-center">
            <p className="text-sm font-bold text-orange-500">
              Customer replies → follow-up sequence pauses automatically.
            </p>
          </div>
        </div>
      </section>

      {/* QUOTATION */}
      <section className={`py-24 ${section}`}>
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              AI quotations
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              Keep the sales process visible.
            </h2>

            <p className={`mt-5 leading-7 ${muted}`}>
              Generate quotation drafts from customer requirements and move
              them through a clear sales lifecycle.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {["Draft", "Sent", "Viewed", "Accepted", "Rejected", "Expired"].map(
                (status) => (
                  <span
                    key={status}
                    className="rounded-full border border-orange-500/20 bg-orange-500/5 px-3 py-2 text-xs font-semibold text-orange-500"
                  >
                    {status}
                  </span>
                )
              )}
            </div>
          </div>

          <div className={`rounded-3xl border ${border} ${card} p-5`}>
            <div className="rounded-2xl bg-white p-5 text-slate-950">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">QUOTATION</p>
                  <p className="mt-1 text-lg font-black">TIVRA AI Business Plan</p>
                </div>

                <FileText className="text-orange-500" size={24} />
              </div>

              <div className="mt-7 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Software</span>
                  <span className="font-bold">₹50,000</span>
                </div>

                <div className="flex justify-between">
                  <span>Setup</span>
                  <span className="font-bold">₹5,000</span>
                </div>

                <div className="flex justify-between border-t pt-3">
                  <span>GST</span>
                  <span className="font-bold">₹9,900</span>
                </div>

                <div className="flex justify-between border-t pt-3 text-lg font-black">
                  <span>Total</span>
                  <span>₹64,900</span>
                </div>
              </div>

              <button className="mt-6 w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-white">
                View Quotation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section id="solutions" className={`py-24 ${bg}`}>
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              Built for sales teams
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              One sales platform. Multiple business needs.
            </h2>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Manufacturers", "Manage enquiries, products, quotations and sales opportunities."],
              ["Service Businesses", "Capture service enquiries and automate follow-ups."],
              ["Software Companies", "Qualify demos, pricing enquiries and sales opportunities."],
              ["Sales Teams", "Give managers and salespeople a shared sales workspace."],
            ].map(([title, description]) => (
              <div
                key={title}
                className={`rounded-2xl border ${border} ${card} p-6`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                  <Building2 size={18} />
                </div>

                <h3 className="mt-6 font-bold">{title}</h3>
                <p className={`mt-2 text-sm leading-6 ${soft}`}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ASK TIVRA */}
      <section className={`py-24 ${section}`}>
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              AI sales intelligence
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              Ask your sales data in plain language.
            </h2>

            <p className={`mt-5 leading-7 ${muted}`}>
              Ask TIVRA questions about your authorized business records and
              get useful sales insights.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
                <Search size={18} />
              </div>

              <div
                className={`flex-1 rounded-xl border ${border} ${
                  dark ? "bg-[#111a2e]" : "bg-white"
                } px-4 py-3 text-sm ${soft}`}
              >
                Which leads need attention today?
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {[
              "Who are my hottest leads?",
              "Which quotations have no response?",
              "Which salesperson has overdue follow-ups?",
              "Why did conversion drop this month?",
              "What should my sales team focus on today?",
            ].map((question) => (
              <div
                key={question}
                className={`flex items-center gap-3 rounded-xl border ${border} ${card} p-4`}
              >
                <Sparkles size={16} className="text-orange-500" />
                <span className={`text-sm ${muted}`}>{question}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section className={`py-24 ${bg}`}>
        <div className="mx-auto max-w-5xl px-5 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
            <ShieldCheck size={27} />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
            Control & security
          </p>

          <h2 className="mt-4 text-4xl font-black">
            Your team stays in control.
          </h2>

          <p className={`mx-auto mt-5 max-w-2xl leading-7 ${muted}`}>
            TIVRA is designed with role-based access, audit logging,
            controlled AI knowledge and human approval for important sales
            actions.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {[
              "Role-based access",
              "Audit logs",
              "Approved knowledge",
              "Human takeover",
              "Data isolation",
            ].map((item) => (
              <div
                key={item}
                className={`rounded-full border ${border} ${card} px-4 py-2 text-xs font-semibold`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={`py-24 ${section}`}>
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              FAQ
            </p>

            <h2 className="mt-4 text-4xl font-black">
              Questions, answered.
            </h2>
          </div>

          <div className="mt-12 space-y-3">
            {faqs.map((faq, index) => {
              const open = openFaq === index;

              return (
                <div
                  key={faq.q}
                  className={`overflow-hidden rounded-2xl border ${border} ${card}`}
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : index)}
                    className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left"
                  >
                    <span className="text-sm font-bold">{faq.q}</span>

                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-orange-500 transition ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {open && (
                    <div className={`border-t ${border} px-5 py-5`}>
                      <p className={`text-sm leading-7 ${muted}`}>
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 py-8 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-orange-500 px-6 py-16 text-center text-white sm:px-10">
          <Quote className="mx-auto mb-5 opacity-70" size={28} />

          <h2 className="text-4xl font-black sm:text-5xl">
            Ready to build a smarter sales process?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-orange-50">
            Start with TIVRA AI and organize your sales process in one
            intelligent platform.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/login"
              className="rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-orange-500 hover:bg-orange-50"
            >
              Get Started
            </Link>

            <a
              href="#features"
              className="rounded-xl border border-white/30 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10"
            >
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`border-t ${border} ${bg}`}>
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-10 sm:flex-row lg:px-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-sm font-black text-white">
                T
              </div>

              <span className="font-black">
                TIVRA <span className="text-orange-500">AI</span>
              </span>
            </div>

            <p className={`mt-3 text-xs ${soft}`}>
              AI-powered sales & lead automation platform.
            </p>
          </div>

          <div className="flex items-center gap-5 text-xs">
            <a href="#features" className={`${soft} hover:text-orange-500`}>
              Features
            </a>
            <a href="#how-it-works" className={`${soft} hover:text-orange-500`}>
              How It Works
            </a>
            <a href="#faq" className={`${soft} hover:text-orange-500`}>
              FAQ
            </a>
            <span className={soft}>© {new Date().getFullYear()} TIVRA AI</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function MiniStat({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-[#111a2e] p-4">
      <p className="text-[9px] text-slate-500">{title}</p>
      <p className="mt-2 text-xl font-black text-white">{value}</p>
    </div>
  );
}