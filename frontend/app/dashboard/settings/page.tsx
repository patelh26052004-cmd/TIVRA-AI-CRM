"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Bot,
  Users,
  MessageSquare,
  Bell,
  ShieldCheck,
  Save,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  UserRound,
  Lock,
  Globe,
  Clock3,
  Zap,
  Phone,
  Mail,
  KeyRound,
  Target,
  CalendarDays,
} from "lucide-react";

type Tab =
  | "general"
  | "ai"
  | "crm"
  | "whatsapp"
  | "notifications"
  | "security"
  | "users";

type SettingsState = {
  companyName: string;
  companyEmail: string;
  timezone: string;
  language: string;
  dateFormat: string;
  aiEnabled: boolean;
  autoReply: boolean;
  leadScoring: boolean;
  intentDetection: boolean;
  requirementExtraction: boolean;
  humanHandover: boolean;
  aiConfidence: string;
  defaultLeadStage: string;
  autoAssignLeads: boolean;
  duplicateDetection: boolean;
  hotLeadThreshold: string;
  followUpDays: string;
  whatsappEnabled: boolean;
  whatsappAutoReply: boolean;
  whatsappNotifications: boolean;
  businessHours: string;
  emailNotifications: boolean;
  leadNotifications: boolean;
  quotationNotifications: boolean;
  followUpNotifications: boolean;
  appointmentNotifications: boolean;
  twoFactor: boolean;
  loginAlerts: boolean;
  sessionTimeout: string;
  passwordExpiry: string;
  adminName: string;
  adminEmail: string;
  adminRole: string;
};

const DEFAULT_SETTINGS: SettingsState = {
  companyName: "TIVRA AI",
  companyEmail: "admin@tivra.ai",
  timezone: "Asia/Kolkata",
  language: "English",
  dateFormat: "DD/MM/YYYY",

  aiEnabled: true,
  autoReply: true,
  leadScoring: true,
  intentDetection: true,
  requirementExtraction: true,
  humanHandover: true,
  aiConfidence: "85",

  defaultLeadStage: "New",
  autoAssignLeads: true,
  duplicateDetection: true,
  hotLeadThreshold: "80",
  followUpDays: "2",

  whatsappEnabled: true,
  whatsappAutoReply: true,
  whatsappNotifications: true,
  businessHours: "9:00 AM - 6:00 PM",

  emailNotifications: true,
  leadNotifications: true,
  quotationNotifications: true,
  followUpNotifications: true,
  appointmentNotifications: true,

  twoFactor: false,
  loginAlerts: true,
  sessionTimeout: "30",
  passwordExpiry: "90",

  adminName: "Admin",
  adminEmail: "admin@tivra.ai",
  adminRole: "Administrator",
};

function loadSettings(): SettingsState {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;

  try {
    const raw = localStorage.getItem("tivra_settings");
    if (!raw) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(raw) as Partial<SettingsState>;

    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const updateSetting = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setSaved(false);
  };

  const handleSave = () => {
    try {
      localStorage.setItem("tivra_settings", JSON.stringify(settings));
      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch {
      alert("Unable to save settings in this browser.");
    }
  };

  const handleReset = () => {
    // Remove the saved values first so they cannot be restored on reload.
    try {
      localStorage.removeItem("tivra_settings");
    } catch {
      // Ignore storage errors and still reset the visible React state.
    }

    // Create a fresh object so every controlled input receives new default values.
    const resetValue: SettingsState = JSON.parse(
      JSON.stringify(DEFAULT_SETTINGS)
    );

    setSettings(resetValue);
    setSaved(false);

    // Force a clean client render to guarantee every tab/control is reset.
    window.setTimeout(() => {
      window.location.reload();
    }, 50);
  };

  const tabs = [
    {
      id: "general" as Tab,
      label: "General",
      icon: Settings,
      description: "Company preferences",
    },
    {
      id: "ai" as Tab,
      label: "AI Settings",
      icon: Bot,
      description: "AI Sales Agent",
    },
    {
      id: "crm" as Tab,
      label: "CRM",
      icon: Users,
      description: "Lead management",
    },
    {
      id: "whatsapp" as Tab,
      label: "WhatsApp",
      icon: MessageSquare,
      description: "WhatsApp automation",
    },
    {
      id: "notifications" as Tab,
      label: "Notifications",
      icon: Bell,
      description: "Alerts & updates",
    },
    {
      id: "security" as Tab,
      label: "Security",
      icon: ShieldCheck,
      description: "Security controls",
    },
    {
      id: "users" as Tab,
      label: "Users & Roles",
      icon: UserRound,
      description: "Team access",
    },
  ];

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50 text-slate-950 dark:bg-[#070c1b] dark:text-white">
      <div className="mx-auto max-w-[1500px] space-y-6 p-4 sm:p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                <Settings size={21} />
              </div>

              <span className="text-sm font-semibold text-orange-500">
                System Configuration
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Settings
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your TIVRA AI CRM preferences, automation and security.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:border-orange-300 hover:text-orange-500 dark:border-white/10 dark:bg-[#111a2e]"
            >
              <RotateCcw size={16} />
              Reset
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              {saved ? (
                <>
                  <CheckCircle2 size={17} />
                  Saved
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* SUCCESS MESSAGE */}
        {saved && (
          <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
            <CheckCircle2 size={18} />
            Your settings have been saved successfully.
          </div>
        )}

        {/* SETTINGS LAYOUT */}
        <section className="grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
          {/* SIDEBAR */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-[#111a2e]">
            <div className="p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Settings Menu
              </p>
            </div>

            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                      active
                        ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.03]"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        active
                          ? "bg-orange-500 text-white"
                          : "bg-slate-100 text-slate-500 dark:bg-white/5"
                      }`}
                    >
                      <Icon size={17} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{tab.label}</p>
                      <p className="truncate text-[10px] text-slate-400">
                        {tab.description}
                      </p>
                    </div>

                    <ChevronRight
                      size={15}
                      className={active ? "text-orange-500" : "text-slate-300"}
                    />
                  </button>
                );
              })}
            </div>
          </aside>

          {/* CONTENT */}
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111a2e]">
            {/* GENERAL */}
            {activeTab === "general" && (
              <SettingsSection
                icon={<Settings size={19} />}
                title="General Settings"
                description="Manage basic company and application preferences."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Company Name"
                    value={settings.companyName}
                    onChange={(value) => updateSetting("companyName", value)}
                  />

                  <InputField
                    label="Company Email"
                    type="email"
                    value={settings.companyEmail}
                    onChange={(value) => updateSetting("companyEmail", value)}
                  />

                  <SelectField
                    label="Timezone"
                    value={settings.timezone}
                    onChange={(value) => updateSetting("timezone", value)}
                    options={[
                      "Asia/Kolkata",
                      "Asia/Dubai",
                      "Asia/Singapore",
                      "Europe/London",
                    ]}
                  />

                  <SelectField
                    label="Language"
                    value={settings.language}
                    onChange={(value) => updateSetting("language", value)}
                    options={["English", "Hindi", "Gujarati"]}
                  />

                  <SelectField
                    label="Date Format"
                    value={settings.dateFormat}
                    onChange={(value) => updateSetting("dateFormat", value)}
                    options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]}
                  />
                </div>

                <InfoBox
                  icon={<Globe size={17} />}
                  title="Regional Preferences"
                  text="Timezone and date format will be used throughout the CRM."
                />
              </SettingsSection>
            )}

            {/* AI SETTINGS */}
            {activeTab === "ai" && (
              <SettingsSection
                icon={<Bot size={19} />}
                title="AI Settings"
                description="Control how TIVRA AI handles sales conversations."
              >
                <ToggleRow
                  icon={<Bot size={18} />}
                  title="Enable AI Sales Agent"
                  description="Allow TIVRA AI to automatically handle customer conversations."
                  enabled={settings.aiEnabled}
                  onChange={(value) => updateSetting("aiEnabled", value)}
                />

                <ToggleRow
                  icon={<MessageSquare size={18} />}
                  title="Automatic AI Replies"
                  description="Automatically respond to incoming customer messages."
                  enabled={settings.autoReply}
                  onChange={(value) => updateSetting("autoReply", value)}
                />

                <ToggleRow
                  icon={<Target size={18} />}
                  title="AI Lead Scoring"
                  description="Automatically calculate lead scores from customer activity."
                  enabled={settings.leadScoring}
                  onChange={(value) => updateSetting("leadScoring", value)}
                />

                <ToggleRow
                  icon={<Sparkles size={18} />}
                  title="Intent Detection"
                  description="Detect pricing, demo, product and other customer intents."
                  enabled={settings.intentDetection}
                  onChange={(value) => updateSetting("intentDetection", value)}
                />

                <ToggleRow
                  icon={<Zap size={18} />}
                  title="Requirement Extraction"
                  description="Extract product requirements and useful customer information."
                  enabled={settings.requirementExtraction}
                  onChange={(value) =>
                    updateSetting("requirementExtraction", value)
                  }
                />

                <ToggleRow
                  icon={<UserRound size={18} />}
                  title="Human Handover"
                  description="Allow AI to transfer conversations to a salesperson."
                  enabled={settings.humanHandover}
                  onChange={(value) => updateSetting("humanHandover", value)}
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <SelectField
                    label="Minimum AI Confidence"
                    value={settings.aiConfidence}
                    onChange={(value) => updateSetting("aiConfidence", value)}
                    options={["70", "75", "80", "85", "90", "95"]}
                  />

                  <InfoBox
                    icon={<ShieldCheck size={17} />}
                    title="AI Safety"
                    text="AI should use only approved company information when answering customers."
                  />
                </div>
              </SettingsSection>
            )}

            {/* CRM */}
            {activeTab === "crm" && (
              <SettingsSection
                icon={<Users size={19} />}
                title="CRM Settings"
                description="Configure lead management and sales workflow."
              >
                <SelectField
                  label="Default Lead Stage"
                  value={settings.defaultLeadStage}
                  onChange={(value) => updateSetting("defaultLeadStage", value)}
                  options={[
                    "New",
                    "Contacted",
                    "Qualified",
                    "Demo / Meeting",
                    "Quotation",
                    "Negotiation",
                  ]}
                />

                <ToggleRow
                  icon={<Users size={18} />}
                  title="Auto Assign Leads"
                  description="Automatically assign new leads to available sales users."
                  enabled={settings.autoAssignLeads}
                  onChange={(value) => updateSetting("autoAssignLeads", value)}
                />

                <ToggleRow
                  icon={<ShieldCheck size={18} />}
                  title="Duplicate Lead Detection"
                  description="Check existing leads before creating a new lead."
                  enabled={settings.duplicateDetection}
                  onChange={(value) =>
                    updateSetting("duplicateDetection", value)
                  }
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <SelectField
                    label="Hot Lead Threshold"
                    value={settings.hotLeadThreshold}
                    onChange={(value) =>
                      updateSetting("hotLeadThreshold", value)
                    }
                    options={["60", "70", "75", "80", "85", "90"]}
                  />

                  <SelectField
                    label="Default Follow-up After"
                    value={settings.followUpDays}
                    onChange={(value) => updateSetting("followUpDays", value)}
                    options={["1", "2", "3", "5", "7"]}
                  />
                </div>
              </SettingsSection>
            )}

            {/* WHATSAPP */}
            {activeTab === "whatsapp" && (
              <SettingsSection
                icon={<MessageSquare size={19} />}
                title="WhatsApp Settings"
                description="Manage WhatsApp communication and automation."
              >
                <ToggleRow
                  icon={<MessageSquare size={18} />}
                  title="Enable WhatsApp"
                  description="Enable WhatsApp communication for your CRM."
                  enabled={settings.whatsappEnabled}
                  onChange={(value) => updateSetting("whatsappEnabled", value)}
                />

                <ToggleRow
                  icon={<Bot size={18} />}
                  title="WhatsApp Auto Reply"
                  description="Allow AI to respond automatically to WhatsApp messages."
                  enabled={settings.whatsappAutoReply}
                  onChange={(value) =>
                    updateSetting("whatsappAutoReply", value)
                  }
                />

                <ToggleRow
                  icon={<Bell size={18} />}
                  title="WhatsApp Notifications"
                  description="Notify sales users about important WhatsApp conversations."
                  enabled={settings.whatsappNotifications}
                  onChange={(value) =>
                    updateSetting("whatsappNotifications", value)
                  }
                />

                <SelectField
                  label="Business Hours"
                  value={settings.businessHours}
                  onChange={(value) => updateSetting("businessHours", value)}
                  options={[
                    "9:00 AM - 6:00 PM",
                    "9:00 AM - 7:00 PM",
                    "10:00 AM - 6:00 PM",
                    "24 Hours",
                  ]}
                />

                <InfoBox
                  icon={<Phone size={17} />}
                  title="WhatsApp Integration"
                  text="Connect your official WhatsApp Business account to enable real customer conversations."
                />
              </SettingsSection>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <SettingsSection
                icon={<Bell size={19} />}
                title="Notification Settings"
                description="Choose which CRM events should generate notifications."
              >
                <ToggleRow
                  icon={<Mail size={18} />}
                  title="Email Notifications"
                  description="Receive important CRM updates by email."
                  enabled={settings.emailNotifications}
                  onChange={(value) => updateSetting("emailNotifications", value)}
                />

                <ToggleRow
                  icon={<Users size={18} />}
                  title="New Lead Notifications"
                  description="Notify users when a new lead is created."
                  enabled={settings.leadNotifications}
                  onChange={(value) => updateSetting("leadNotifications", value)}
                />

                <ToggleRow
                  icon={<MessageSquare size={18} />}
                  title="Quotation Notifications"
                  description="Notify sales users about quotation activity."
                  enabled={settings.quotationNotifications}
                  onChange={(value) =>
                    updateSetting("quotationNotifications", value)
                  }
                />

                <ToggleRow
                  icon={<Clock3 size={18} />}
                  title="Follow-up Notifications"
                  description="Notify users about upcoming and overdue follow-ups."
                  enabled={settings.followUpNotifications}
                  onChange={(value) =>
                    updateSetting("followUpNotifications", value)
                  }
                />

                <ToggleRow
                  icon={<CalendarDays size={18} />}
                  title="Appointment Notifications"
                  description="Notify users about upcoming customer appointments."
                  enabled={settings.appointmentNotifications}
                  onChange={(value) =>
                    updateSetting("appointmentNotifications", value)
                  }
                />
              </SettingsSection>
            )}

            {/* SECURITY */}
            {activeTab === "security" && (
              <SettingsSection
                icon={<ShieldCheck size={19} />}
                title="Security Settings"
                description="Protect your CRM account and user access."
              >
                <ToggleRow
                  icon={<KeyRound size={18} />}
                  title="Two-Factor Authentication"
                  description="Require an additional verification step during login."
                  enabled={settings.twoFactor}
                  onChange={(value) => updateSetting("twoFactor", value)}
                />

                <ToggleRow
                  icon={<Bell size={18} />}
                  title="Login Alerts"
                  description="Receive an alert when a new login is detected."
                  enabled={settings.loginAlerts}
                  onChange={(value) => updateSetting("loginAlerts", value)}
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <SelectField
                    label="Session Timeout"
                    value={settings.sessionTimeout}
                    onChange={(value) => updateSetting("sessionTimeout", value)}
                    options={["15", "30", "60", "120"]}
                  />

                  <SelectField
                    label="Password Expiry"
                    value={settings.passwordExpiry}
                    onChange={(value) => updateSetting("passwordExpiry", value)}
                    options={["30", "60", "90", "180", "Never"]}
                  />
                </div>

                <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-500/20 dark:bg-orange-500/5">
                  <div className="flex gap-3">
                    <Lock
                      className="mt-0.5 shrink-0 text-orange-500"
                      size={18}
                    />

                    <div>
                      <p className="text-sm font-semibold">
                        Security Recommendation
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                        Enable two-factor authentication for administrator accounts
                        to provide an additional layer of protection.
                      </p>
                    </div>
                  </div>
                </div>
              </SettingsSection>
            )}

            {/* USERS */}
            {activeTab === "users" && (
              <SettingsSection
                icon={<Users size={19} />}
                title="Users & Roles"
                description="Manage users and their access levels."
              >
                <div className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                        {settings.adminName
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase() || "AD"}
                      </div>

                      <div>
                        <p className="font-semibold">{settings.adminName}</p>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {settings.adminEmail}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                      {settings.adminRole}
                    </span>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Admin Name"
                    value={settings.adminName}
                    onChange={(value) => updateSetting("adminName", value)}
                  />

                  <InputField
                    label="Admin Email"
                    type="email"
                    value={settings.adminEmail}
                    onChange={(value) => updateSetting("adminEmail", value)}
                  />
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-white/10">
                  <div className="border-b border-slate-200 p-4 dark:border-white/10">
                    <h3 className="text-sm font-bold">Role Permissions</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Administrator has full CRM access.
                    </p>
                  </div>

                  <div className="grid gap-3 p-4 sm:grid-cols-2">
                    <Permission label="Dashboard" />
                    <Permission label="Lead CRM" />
                    <Permission label="AI Lead Scoring" />
                    <Permission label="WhatsApp AI" />
                    <Permission label="Follow-ups" />
                    <Permission label="Quotations" />
                    <Permission label="Appointments" />
                    <Permission label="Analytics" />
                  </div>
                </div>
              </SettingsSection>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

/* -------------------------------------------------- */
/* COMPONENTS */
/* -------------------------------------------------- */

function SettingsSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="border-b border-slate-200 p-5 sm:p-6 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-500 dark:bg-orange-500/10">
            {icon}
          </div>

          <div>
            <h2 className="font-bold">{title}</h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">{children}</div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 dark:border-white/10 dark:bg-[#0b1222]"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 dark:border-white/10 dark:bg-[#0b1222]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleRow({
  icon,
  title,
  description,
  enabled,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 dark:border-white/10">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            enabled
              ? "bg-orange-100 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400"
              : "bg-slate-100 text-slate-400 dark:bg-white/5"
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold">{title}</p>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        aria-pressed={enabled}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-orange-500" : "bg-slate-300 dark:bg-slate-700"
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

function InfoBox({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-500/5">
      <div className="mt-0.5 shrink-0 text-blue-500">{icon}</div>

      <div>
        <p className="text-sm font-semibold">{title}</p>

        <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
          {text}
        </p>
      </div>
    </div>
  );
}

function Permission({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2.5 dark:bg-green-500/5">
      <CheckCircle2 size={15} className="text-green-500" />

      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}
