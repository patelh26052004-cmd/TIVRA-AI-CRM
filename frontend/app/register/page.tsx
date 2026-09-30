"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

const initialForm: FormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validate(): string {
    if (!form.name.trim()) return "Please enter your full name.";
    if (!form.company.trim()) return "Please enter your company name.";
    if (!form.email.trim()) return "Please enter your email address.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email address.";
    if (form.phone && !/^[0-9+\-\s]{10,15}$/.test(form.phone))
      return "Please enter a valid phone number.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    if (!form.acceptTerms) return "Please accept the terms to continue.";
    return "";
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const saved = localStorage.getItem("tivra_users");
      const users: { email: string }[] = saved ? JSON.parse(saved) : [];

      if (users.some((u) => u.email.toLowerCase() === form.email.toLowerCase())) {
        setError("An account with this email already exists.");
        return;
      }

      // Demo only: the password is NOT stored. Real registration should
      // send the data to the backend, which hashes the password (bcrypt).
      users.push({
        email: form.email.trim(),
        name: form.name.trim(),
        company: form.company.trim(),
        phone: form.phone.trim(),
        role: "Admin",
        createdAt: new Date().toISOString(),
      } as { email: string });

      localStorage.setItem("tivra_users", JSON.stringify(users));
    } catch {
      setError("Could not save your account. Please try again.");
      return;
    }

    setSuccess("Account created successfully! Redirecting to sign in...");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-slate-900 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500";
  const iconClass =
    "absolute left-4 top-1/2 -translate-y-1/2 text-slate-600";
  const labelClass = "mb-2 block text-sm font-semibold text-slate-300";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE */}
        <section className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-orange-500/5" />
          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

          <div className="relative flex w-full flex-col justify-between p-10 xl:p-16">
            <Link
              href="/"
              className="flex w-fit items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              <ArrowLeft size={17} />
              Back to website
            </Link>

            <div className="max-w-xl">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 font-black">
                  T
                </div>
                <span className="text-2xl font-black">
                  TIVRA <span className="text-orange-500">AI</span>
                </span>
              </div>

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
                Get started
              </p>

              <h1 className="mt-5 text-5xl font-black leading-tight xl:text-6xl">
                Create your <span className="text-orange-500">sales workspace.</span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                Set up your account and start capturing, qualifying and
                following up with leads in minutes.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  ["Capture every enquiry", "Website, WhatsApp and campaigns in one place."],
                  ["AI lead scoring", "Know which opportunities need attention first."],
                  ["Quotations to projects", "Follow the full workflow from lead to handover."],
                ].map(([title, text]) => (
                  <div key={title} className="flex gap-4">
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                      <ShieldCheck size={15} />
                    </div>
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-slate-600">
              AI-powered sales &amp; lead automation platform.
            </p>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex items-center justify-center bg-slate-900 px-5 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 font-black">
                  T
                </div>
                <span className="text-xl font-black">
                  TIVRA <span className="text-orange-500">AI</span>
                </span>
              </Link>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950 p-7 shadow-2xl sm:p-9">
              <div className="mb-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                  <User size={23} />
                </div>
                <h2 className="text-3xl font-black">Create your account</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Register to access your TIVRA sales dashboard.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                {/* NAME */}
                <div>
                  <label className={labelClass}>Full name</label>
                  <div className="relative">
                    <User size={18} className={iconClass} />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="Your full name"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* COMPANY */}
                <div>
                  <label className={labelClass}>Company name</label>
                  <div className="relative">
                    <Building2 size={18} className={iconClass} />
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => updateField("company", e.target.value)}
                      placeholder="Your company"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label className={labelClass}>Email address</label>
                  <div className="relative">
                    <Mail size={18} className={iconClass} />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="you@company.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* PHONE */}
                <div>
                  <label className={labelClass}>
                    Phone <span className="font-normal text-slate-600">(optional)</span>
                  </label>
                  <div className="relative">
                    <Phone size={18} className={iconClass} />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="+91 98765 43210"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className={labelClass}>Password</label>
                  <div className="relative">
                    <LockKeyhole size={18} className={iconClass} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      placeholder="At least 6 characters"
                      className={`${inputClass} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className={labelClass}>Confirm password</label>
                  <div className="relative">
                    <LockKeyhole size={18} className={iconClass} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) => updateField("confirmPassword", e.target.value)}
                      placeholder="Re-enter your password"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* TERMS */}
                <label className="flex items-start gap-3 text-xs text-slate-400">
                  <input
                    type="checkbox"
                    checked={form.acceptTerms}
                    onChange={(e) => updateField("acceptTerms", e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-orange-500"
                  />
                  <span>I agree to the Terms of Service and Privacy Policy.</span>
                </label>

                {/* ERROR / SUCCESS */}
                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-400"
                >
                  Create Account
                  <Sparkles size={17} />
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-orange-500 hover:text-orange-400">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}