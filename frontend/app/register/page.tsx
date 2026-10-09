"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  User,
  X,
  Zap,
} from "lucide-react";

type RegistrationData = {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const passwordChecks = useMemo(
    () => ({
      length: form.password.length >= 8,
      upper: /[A-Z]/.test(form.password),
      lower: /[a-z]/.test(form.password),
      number: /\d/.test(form.password),
    }),
    [form.password]
  );

  const passwordScore = Object.values(passwordChecks).filter(Boolean).length;

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (error) setError("");
  }

  function validate() {
    if (!form.fullName.trim()) {
      return "Please enter your full name.";
    }

    if (!form.companyName.trim()) {
      return "Please enter your company name.";
    }

    if (!form.email.trim()) {
      return "Please enter your work email.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }

    if (!form.phone.trim()) {
      return "Please enter your phone number.";
    }

    if (!/^[+0-9()\-\s]{8,20}$/.test(form.phone.trim())) {
      return "Please enter a valid phone number.";
    }

    if (passwordScore < 4) {
      return "Password must be at least 8 characters with uppercase, lowercase and a number.";
    }

    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }

    if (!acceptedTerms) {
      return "Please accept the Terms & Privacy Policy.";
    }

    return "";
  }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          companyName: form.companyName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration could not be completed.");
        setSubmitting(false);
        return;
      }

      localStorage.setItem(
        "tivra_registration_success",
        JSON.stringify({
          fullName: form.fullName.trim(),
          companyName: form.companyName.trim(),
          email: form.email.trim().toLowerCase(),
          createdAt: new Date().toISOString(),
        })
      );

      router.push("/login?registered=1");
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        "Unable to connect to TIVRA server. Please make sure the backend is running."
      );
      setSubmitting(false);
    }
  }

  const progress = Math.round((passwordScore / 4) * 100);

  return (
    <main className="min-h-screen bg-[#070c1b] text-white">
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute left-[12%] top-[8%] h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute bottom-[10%] right-[8%] h-80 w-80 rounded-full bg-orange-500/5 blur-3xl" />

        <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-5 py-10 lg:grid-cols-[1fr_520px] lg:px-8">
          {/* LEFT / BRAND */}
          <section className="hidden lg:block">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 font-black text-white">
                T
              </div>

              <span className="text-2xl font-black">
                TIVRA <span className="text-orange-500">AI</span>
              </span>
            </Link>

            <div className="mt-14 max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-bold text-orange-400">
                <Zap size={14} />
                AI-powered sales automation
              </div>

              <h1 className="text-5xl font-black leading-tight">
                Start building a smarter sales process.
              </h1>

              <p className="mt-5 max-w-lg text-base leading-8 text-slate-400">
                Create your TIVRA AI account and bring leads, conversations,
                follow-ups, quotations and sales analytics into one workspace.
              </p>

              <div className="mt-9 space-y-4">
                {[
                  "Centralize your customer enquiries",
                  "Prioritize high-intent opportunities",
                  "Automate follow-ups and sales workflows",
                  "Keep quotations and pipeline connected",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/10 text-orange-400">
                      <Check size={14} />
                    </div>
                    <span className="text-sm text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* REGISTER CARD */}
          <section className="w-full">
            <div className="mb-5 lg:hidden">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 font-black text-white">
                  T
                </div>
                <span className="text-xl font-black">
                  TIVRA <span className="text-orange-500">AI</span>
                </span>
              </Link>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0d1426]/95 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
              <div className="mb-7">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
                  Create account
                </p>

                <h2 className="mt-3 text-3xl font-black">
                  Register for TIVRA AI
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Create your account to continue to the TIVRA AI login.
                </p>
              </div>

              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-300">
                  <X className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Field
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={(value) => updateField("fullName", value)}
                  icon={<User className="h-4 w-4" />}
                  required
                />

                <Field
                  label="Company Name"
                  placeholder="Enter your company name"
                  value={form.companyName}
                  onChange={(value) => updateField("companyName", value)}
                  icon={<Building2 className="h-4 w-4" />}
                  required
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Work Email"
                    type="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(value) => updateField("email", value)}
                    icon={<Mail className="h-4 w-4" />}
                    required
                  />

                  <Field
                    label="Phone Number"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(value) => updateField("phone", value)}
                    icon={<Phone className="h-4 w-4" />}
                    required
                  />
                </div>

                <PasswordField
                  label="Password"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(value) => updateField("password", value)}
                  visible={showPassword}
                  onToggle={() => setShowPassword((current) => !current)}
                />

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Password strength
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {passwordScore}/4
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-orange-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                    <PasswordRule
                      active={passwordChecks.length}
                      text="8+ characters"
                    />
                    <PasswordRule
                      active={passwordChecks.upper}
                      text="Uppercase letter"
                    />
                    <PasswordRule
                      active={passwordChecks.lower}
                      text="Lowercase letter"
                    />
                    <PasswordRule
                      active={passwordChecks.number}
                      text="One number"
                    />
                  </div>
                </div>

                <PasswordField
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={(value) =>
                    updateField("confirmPassword", value)
                  }
                  visible={showConfirmPassword}
                  onToggle={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                />

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-[#080b14] p-3.5">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) =>
                      setAcceptedTerms(event.target.checked)
                    }
                    className="mt-0.5 h-4 w-4 accent-orange-500"
                  />

                  <span className="text-xs leading-5 text-slate-400">
                    I agree to the{" "}
                    <span className="font-semibold text-slate-200">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="font-semibold text-slate-200">
                      Privacy Policy
                    </span>
                    .
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Creating Account..." : "Create Account"}
                  {!submitting && <ArrowRight size={17} />}
                </button>
              </form>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-orange-500 hover:text-orange-400"
                  >
                    Login
                  </Link>
                </p>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-slate-600">
                <ShieldCheck size={13} />
                <span>Secure account setup · TIVRA AI</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  icon: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-400">
        {label}
      </span>

      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">
          {icon}
        </div>

        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-xl border border-white/10 bg-[#080b14] py-3 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-orange-500/50"
        />
      </div>
    </label>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  visible,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-400">
        {label}
      </span>

      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">
          <LockKeyhole className="h-4 w-4" />
        </div>

        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required
          className="w-full rounded-xl border border-white/10 bg-[#080b14] py-3 pl-10 pr-11 text-sm text-white outline-none placeholder:text-slate-700 focus:border-orange-500/50"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-600 hover:bg-white/5 hover:text-slate-300"
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </label>
  );
}

function PasswordRule({
  active,
  text,
}: {
  active: boolean;
  text: string;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 ${
        active ? "text-orange-400" : "text-slate-600"
      }`}
    >
      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-current">
        {active && <Check className="h-2.5 w-2.5" />}
      </span>
      <span>{text}</span>
    </div>
  );
}
