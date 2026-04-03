import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-4 bg-white border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 bg-[#2563EB] rounded-full" />
          <span className="text-lg font-bold text-[#1E293B]">ClientFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-[#64748B] hover:text-[#1E293B] transition-colors duration-200">
            Sign In
          </Link>
          <Link href="/login" className="bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors duration-200">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 lg:px-12 py-20 lg:py-32 max-w-5xl mx-auto text-center overflow-hidden">
        {/* Decorative bg elements */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-[#2563EB]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-56 h-56 bg-[#F97316]/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#DBEAFE] text-[#2563EB] text-xs font-semibold rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
            Full-Stack Demo Project
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-[#1E293B] leading-tight mb-6">
            Manage your freelance<br />
            <span className="text-[#2563EB]">projects with ease</span>
          </h1>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto mb-10 leading-relaxed">
            A complete project management app built with Next.js, Supabase, and TypeScript.
            Featuring authentication, CRUD operations, database modeling, and row-level security.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/login" className="bg-[#F97316] hover:bg-[#EA580C] text-white font-medium rounded-lg px-7 py-3 text-sm transition-all duration-200 active:scale-[0.98]">
              Try Demo
            </Link>
            <a href="https://portfolio-wine-six-95.vercel.app" className="border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[#1E293B] font-medium rounded-lg px-7 py-3 text-sm transition-all duration-200">
              View Portfolio
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 lg:px-12 pb-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Authentication",
              desc: "Secure email/password auth with Supabase, session management, and protected routes.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              ),
              accent: "#2563EB",
            },
            {
              title: "Full CRUD",
              desc: "Create, read, update, and delete projects and tasks with real-time database sync.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              ),
              accent: "#F97316",
            },
            {
              title: "Database Design",
              desc: "Relational schema with profiles, projects, and tasks. Foreign keys and constraints.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                </svg>
              ),
              accent: "#16A34A",
            },
            {
              title: "Row-Level Security",
              desc: "Supabase RLS policies ensure users can only access their own data.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              ),
              accent: "#8B5CF6",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white border border-[#E2E8F0] rounded-xl p-6 hover:border-[#2563EB] transition-colors duration-200 group"
              style={{ borderTopWidth: "4px", borderTopColor: f.accent }}
            >
              <div className="mb-4">{f.icon}</div>
              <h3 className="font-semibold text-[#1E293B] mb-1.5">{f.title}</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 lg:px-12 pb-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { value: "5+", label: "Demo Projects", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> },
            { value: "Auth", label: "Real Authentication", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
            { value: "CRUD", label: "Full Operations", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> },
            { value: "RLS", label: "Row-Level Security", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-[#E2E8F0] rounded-xl p-5 text-center">
              <div className="flex justify-center mb-2">{s.icon}</div>
              <p className="text-2xl font-bold text-[#1E293B]">{s.value}</p>
              <p className="text-xs text-[#64748B] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-6 lg:px-12 pb-20 max-w-5xl mx-auto">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 text-center">
          <h2 className="text-sm font-semibold text-[#1E293B] uppercase tracking-wider mb-4">Built With</h2>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-[#64748B]">
            {["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Supabase", "Vercel"].map((t) => (
              <span key={t} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2 hover:border-[#2563EB] hover:text-[#2563EB] transition-colors duration-200">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] px-6 py-6 text-center text-sm text-[#64748B]">
        Built by Steven Liang &middot;{" "}
        <a href="https://portfolio-wine-six-95.vercel.app" className="text-[#2563EB] hover:text-[#1D4ED8] transition-colors duration-200">
          Portfolio
        </a>
        {" "}&middot;{" "}
        <a href="https://github.com/stevenliang026-lab/clientflow" className="text-[#2563EB] hover:text-[#1D4ED8] transition-colors duration-200">
          GitHub
        </a>
      </footer>
    </div>
  );
}
