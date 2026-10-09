"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@tivra.ai");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

    async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      if (!data.success || !data.user) {
        setError("Login could not be completed. Please try again.");
        return;
      }

      localStorage.setItem("tivra_user", data.user.email);
      localStorage.setItem("tivra_user_id", data.user.id);
      localStorage.setItem("tivra_user_name", data.user.name);
      localStorage.setItem("tivra_role", data.user.role);
      localStorage.setItem("tivra_tenant_id", data.user.tenantId);
      localStorage.setItem("tivra_company_name", data.tenant?.name || "");

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login error:", error);
      setError(
        "Unable to connect to TIVRA server. Please make sure the backend is running."
      );
    }
  }

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
                AI Sales Engine
              </p>

              <h1 className="mt-5 text-5xl font-black leading-tight xl:text-6xl">
                Welcome back to your{" "}
                <span className="text-orange-500">sales engine.</span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                Manage leads, conversations, follow-ups, quotations and sales
                opportunities from one intelligent platform.
              </p>

              <div className="mt-10 space-y-4">
                <LoginFeature
                  title="Manage your leads"
                  text="Keep customer information and sales activity organized."
                />

                <LoginFeature
                  title="Prioritize opportunities"
                  text="Identify high-intent leads and focus on the next action."
                />

                <LoginFeature
                  title="Automate follow-ups"
                  text="Keep sales conversations moving with smart workflows."
                />
              </div>
            </div>

            <p className="text-sm text-slate-600">
              AI-powered sales & lead automation platform.
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
                  <LockKeyhole size={23} />
                </div>

                <h2 className="text-3xl font-black">
                  Sign in to TIVRA
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Access your sales dashboard and manage your opportunities.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {/* EMAIL */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full rounded-xl border border-white/10 bg-slate-900 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-white/10 bg-slate-900 py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* ERROR */}
                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-400"
                >
                  Sign In
                  <Sparkles size={17} />
                </button>
              </form>

              {/* DEMO LOGIN */}
              <div className="mt-7 rounded-2xl border border-orange-500/10 bg-orange-500/5 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
                  Demo access
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Email:{" "}
                  <span className="text-slate-300">
                    admin@tivra.ai
                  </span>
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Password:{" "}
                  <span className="text-slate-300">123456</span>
                </p>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-600">
                <ShieldCheck size={14} />
                Protected sales workspace
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="text-sm text-slate-500 transition hover:text-orange-500"
                >
                  ← Back to TIVRA AI website
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function LoginFeature({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
        <ShieldCheck size={15} />
      </div>

      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}