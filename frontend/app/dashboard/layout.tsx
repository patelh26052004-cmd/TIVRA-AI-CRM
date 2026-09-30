"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  CheckSquare,
  ClipboardCheck,
  ChevronDown,
  CreditCard,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  Users,
  UsersRound,
  X,
} from "lucide-react";

const navigation = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "Sales",
    items: [
      {
        name: "Lead CRM",
        href: "/dashboard/leads",
        icon: Users,
      },
      {
        name: "AI Lead Scoring",
        href: "/dashboard/scoring",
        icon: Target,
      },
      {
        name: "AI Sales Agent",
        href: "/dashboard/ai-agent",
        icon: Bot,
      },
      {
        name: "WhatsApp AI",
        href: "/dashboard/whatsapp",
        icon: MessageCircle,
      },
      {
        name: "Smart Follow-ups",
        href: "/dashboard/followups",
        icon: CalendarDays,
      },
      {
        name: "Sales Pipeline",
        href: "/dashboard/pipeline",
        icon: TrendingUp,
      },
      {
        name: "Quotations",
        href: "/dashboard/quotations",
        icon: FileText,
      },
      {
        name: "Appointments",
        href: "/dashboard/appointments",
        icon: CalendarDays,
      },
      {
        name: "Payments",
        href: "/dashboard/payments",
        icon: CreditCard,
      },
      {
        name: "Billing / Invoices",
        href: "/dashboard/billing",
        icon: FileText,
      },
    ],
  },

  {
    title: "Marketing & Intelligence",
    items: [
      {
        name: "Campaigns",
        href: "/dashboard/campaigns",
        icon: BriefcaseBusiness,
      },
      {
        name: "AI Analytics",
        href: "/dashboard/analytics",
        icon: TrendingUp,
      },
      {
        name: "Ask TIVRA AI",
        href: "/dashboard/ask-tivra",
        icon: Sparkles,
      },
      {
        name: "Knowledge Base",
        href: "/dashboard/knowledge",
        icon: FileText,
      },
    ],
  },

  {
    title: "Management",
    items: [
      {
        name: "Project Handover",
        href: "/dashboard/project-handover",
        icon: ClipboardCheck,
      },
      {
        name: "Projects",
        href: "/dashboard/projects",
        icon: FolderKanban,
      },
      {
        name: "Tasks",
        href: "/dashboard/tasks",
        icon: CheckSquare,
      },
      {
        name: "Sales Team",
        href: "/dashboard/team",
        icon: Users,
      },
      {
        name: "Employees & Roles",
        href: "/dashboard/employees",
        icon: UsersRound,
      },
      {
        name: "Notifications",
        href: "/dashboard/notifications",
        icon: Bell,
      },
      {
        name: "Admin Panel",
        href: "/dashboard/admin",
        icon: ShieldCheck,
      },
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];

function Sidebar({
  dark,
  mobile = false,
  onClose,
}: {
  dark: boolean;
  mobile?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  const sidebarClass = dark
    ? "border-white/10 bg-[#0b1222]"
    : "border-slate-200 bg-white";

  const muted = dark ? "text-slate-400" : "text-slate-500";
  const border = dark ? "border-white/10" : "border-slate-200";

  function logout() {
    localStorage.removeItem("tivra_user");
    window.location.href = "/login";
  }

  return (
    <aside
      className={`flex h-screen w-72 flex-col border-r ${sidebarClass} ${
        mobile ? "fixed inset-y-0 left-0 z-[210]" : ""
      }`}
    >
      {/* LOGO */}
      <div
        className={`flex h-20 shrink-0 items-center justify-between border-b px-5 ${border}`}
      >
        <Link
          href="/dashboard"
          onClick={onClose}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 font-bold text-white shadow-lg shadow-orange-500/20">
            T
          </div>

          <div>
            <p className="text-lg font-bold tracking-tight">TIVRA AI</p>

            <p className={`text-[11px] ${muted}`}>AI Sales Engine</p>
          </div>
        </Link>

        {mobile && (
          <button
            type="button"
            onClick={onClose}
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${muted} hover:bg-orange-500/10 hover:text-orange-500`}
          >
            <X size={19} />
          </button>
        )}
      </div>

      {/* NAVIGATION */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        {navigation.map((section) => (
          <div key={section.title} className="mb-5">
            <p
              className={`mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] ${muted}`}
            >
              {section.title}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(`${item.href}/`));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                        : `${muted} hover:bg-orange-500/10 hover:text-orange-500`
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* USER / LOGOUT */}
      <div className={`shrink-0 border-t p-3 ${border}`}>
        <div
          className={`mb-2 flex items-center gap-3 rounded-xl px-3 py-3 ${
            dark ? "bg-white/5" : "bg-slate-50"
          }`}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
            A
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Admin</p>

            <p className={`truncate text-[10px] ${muted}`}>
              Administrator
            </p>
          </div>

          <ChevronDown size={15} className={muted} />
        </div>

        <button
          type="button"
          onClick={logout}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${muted} transition hover:bg-red-500/10 hover:text-red-500`}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dark, setDark] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("tivra_theme");

    if (savedTheme === "light") {
      setDark(false);
    } else {
      setDark(true);
    }
  }, []);

  function toggleTheme() {
    setDark((current) => {
      const next = !current;

      localStorage.setItem(
        "tivra_theme",
        next ? "dark" : "light"
      );

      return next;
    });
  }

  const bg = dark ? "bg-[#070c1b]" : "bg-slate-50";
  const border = dark ? "border-white/10" : "border-slate-200";
  const muted = dark ? "text-slate-400" : "text-slate-500";

  return (
    <div
      className={`min-h-screen ${
        dark ? "text-white" : "text-slate-950"
      } ${bg}`}
    >
      {/* DESKTOP SIDEBAR */}
      <div className="fixed inset-y-0 left-0 z-[100] hidden lg:block">
        <Sidebar dark={dark} />
      </div>

      {/* MOBILE SIDEBAR */}
      {mobileSidebar && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebar(false)}
          />

          <Sidebar
            dark={dark}
            mobile
            onClose={() => setMobileSidebar(false)}
          />
        </div>
      )}

      {/* MAIN AREA */}
      <div className="min-h-screen lg:pl-72">
        {/* COMMON TOPBAR */}
        <header
          className={`sticky top-0 z-50 flex h-20 items-center justify-between border-b px-4 sm:px-6 lg:px-8 ${border} ${
            dark ? "bg-[#070c1b]/95" : "bg-white/95"
          } backdrop-blur`}
        >
          <div className="flex items-center gap-3">
            {/* MOBILE MENU */}
            <button
              type="button"
              onClick={() => setMobileSidebar(true)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${border} ${muted} transition hover:border-orange-500/40 hover:text-orange-500 lg:hidden`}
            >
              <Menu size={19} />
            </button>

            <div className="lg:hidden">
              <p className="text-base font-bold">TIVRA AI</p>

              <p className={`text-[10px] ${muted}`}>
                AI Sales Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* THEME */}
            <button
              type="button"
              onClick={toggleTheme}
              title="Toggle theme"
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${border} ${muted} transition hover:border-orange-500/40 hover:text-orange-500`}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* NOTIFICATIONS */}
            <Link
              href="/dashboard/notifications"
              className={`relative flex h-10 w-10 items-center justify-center rounded-xl border ${border} ${muted} transition hover:border-orange-500/40 hover:text-orange-500`}
            >
              <Bell size={18} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500" />
            </Link>

            {/* PROFILE */}
            <div
              className={`hidden items-center gap-2 rounded-xl border px-3 py-2 sm:flex ${border}`}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                A
              </div>

              <div>
                <p className="text-xs font-semibold">Admin</p>

                <p className={`text-[9px] ${muted}`}>Online</p>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}