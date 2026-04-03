"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
      }
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: "demo@clientflow.app",
        password: "demo123456",
      });
      if (error) throw error;
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Left branded panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1e40af] flex-col items-center justify-center px-12">
        {/* SVG geometric pattern overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.07]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Decorative floating circles */}
        <div className="absolute top-16 left-16 w-32 h-32 rounded-full border border-white/10" />
        <div className="absolute top-24 left-24 w-32 h-32 rounded-full border border-white/[0.06]" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full border border-white/10" />
        <div className="absolute bottom-28 right-28 w-48 h-48 rounded-full border border-white/[0.06]" />
        <div className="absolute top-1/3 right-12 w-20 h-20 rounded-full bg-white/[0.04]" />
        <div className="absolute bottom-1/3 left-10 w-16 h-16 rounded-full bg-white/[0.05]" />

        {/* Diagonal accent lines */}
        <svg
          className="absolute bottom-0 left-0 w-full h-64 opacity-[0.05]"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 800 256"
        >
          <line x1="0" y1="256" x2="800" y2="0" stroke="white" strokeWidth="1.5" />
          <line x1="0" y1="256" x2="600" y2="0" stroke="white" strokeWidth="1" />
          <line x1="200" y1="256" x2="800" y2="0" stroke="white" strokeWidth="1" />
        </svg>

        {/* Content */}
        <div className="relative z-10 max-w-md text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <span className="w-3.5 h-3.5 bg-white rounded-full shadow-lg shadow-white/20" />
            <span className="text-3xl font-bold text-white font-[family-name:var(--font-heading)]">
              ClientFlow
            </span>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)] leading-tight">
            Manage your freelance business with clarity
          </h2>
          <p className="text-blue-100/80 text-lg leading-relaxed">
            Track projects, invoices, and client relationships in one streamlined workspace.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {["Projects", "Invoices", "Clients", "Time Tracking"].map((feature) => (
              <span
                key={feature}
                className="px-4 py-1.5 rounded-full text-sm text-white/90 bg-white/10 backdrop-blur-sm border border-white/10"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-8 sm:p-10">
            {/* Logo - visible on mobile, hidden on desktop (shown in left panel) */}
            <div className="animate-fade-in-up flex items-center gap-2 mb-8 lg:mb-10">
              <span className="w-2.5 h-2.5 bg-[#2563EB] rounded-full" />
              <span className="text-xl font-bold text-[#1E293B] font-[family-name:var(--font-heading)]">
                ClientFlow
              </span>
            </div>

            <div className="animate-fade-in-up delay-1">
              <h1 className="text-2xl font-bold text-[#1E293B] mb-1 font-[family-name:var(--font-heading)]">
                {mode === "login" ? "Welcome back" : "Create account"}
              </h1>
              <p className="text-sm text-[#64748B] mb-6">
                {mode === "login"
                  ? "Sign in to manage your projects"
                  : "Start managing your freelance projects"}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm animate-fade-in-up">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="animate-fade-in-up delay-2">
                  <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Steven Liang"
                    required
                    className="w-full border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-sm text-[#1E293B] placeholder:text-[#94a3b8] bg-white focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition-all duration-200 hover:border-[#cbd5e1]"
                  />
                </div>
              )}

              <div className="animate-fade-in-up delay-2">
                <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-sm text-[#1E293B] placeholder:text-[#94a3b8] bg-white focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition-all duration-200 hover:border-[#cbd5e1]"
                />
              </div>

              <div className="animate-fade-in-up delay-3">
                <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    className="w-full border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 pr-11 text-sm text-[#1E293B] placeholder:text-[#94a3b8] bg-white focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition-all duration-200 hover:border-[#cbd5e1]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1E293B] transition-colors duration-200"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="animate-fade-in-up delay-4 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-2.5 text-sm transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
                </button>
              </div>
            </form>

            <div className="animate-fade-in-up delay-5 flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[#E2E8F0]" />
              <span className="text-xs text-[#64748B]">or</span>
              <div className="flex-1 h-px bg-[#E2E8F0]" />
            </div>

            <div className="animate-fade-in-up delay-5">
              <button
                onClick={handleDemo}
                disabled={loading}
                className="w-full border border-[#F97316] bg-white hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed text-[#F97316] font-medium rounded-lg px-4 py-2.5 text-sm transition-all duration-200 active:scale-[0.98]"
              >
                Try Demo Account
              </button>
            </div>

            <p className="animate-fade-in-up delay-5 text-center text-sm text-[#64748B] mt-6">
              {mode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => { setMode("signup"); setError(""); }}
                    className="text-[#2563EB] hover:text-[#1D4ED8] font-medium transition-colors duration-200"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => { setMode("login"); setError(""); }}
                    className="text-[#2563EB] hover:text-[#1D4ED8] font-medium transition-colors duration-200"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>

          <p className="text-center text-xs text-[#64748B] mt-6">
            Built by Steven Liang &middot; Full-Stack Developer
          </p>
        </div>
      </div>
    </div>
  );
}
