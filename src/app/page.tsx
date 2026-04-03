import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          <span className="text-lg font-bold text-slate-900">ClientFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Sign In
          </Link>
          <Link href="/login" className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 lg:px-12 py-20 lg:py-32 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full px-3 py-1 mb-6">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          Full-Stack Demo Project
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
          Manage your freelance<br />
          <span className="text-emerald-500">projects with ease</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10">
          A complete project management app built with Next.js, Supabase, and TypeScript.
          Featuring authentication, CRUD operations, database modeling, and row-level security.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/login" className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg px-6 py-3 text-sm transition-colors">
            Try Demo
          </Link>
          <a href="https://portfolio-wine-six-95.vercel.app" className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg px-6 py-3 text-sm transition-colors">
            View Portfolio
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 lg:px-12 pb-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Authentication", desc: "Secure email/password auth with Supabase, session management, and protected routes.", icon: "🔐" },
            { title: "Full CRUD", desc: "Create, read, update, and delete projects and tasks with real-time database sync.", icon: "📝" },
            { title: "Database Design", desc: "Relational schema with profiles, projects, and tasks. Foreign keys and constraints.", icon: "🗄️" },
            { title: "Row-Level Security", desc: "Supabase RLS policies ensure users can only access their own data.", icon: "🛡️" },
          ].map((f) => (
            <div key={f.title} className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-slate-900 mb-1">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-6 lg:px-12 pb-20 max-w-5xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Built With</h2>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            {["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Supabase", "Vercel"].map((t) => (
              <span key={t} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-6 py-6 text-center text-sm text-slate-400">
        Built by Steven Liang &middot;{" "}
        <a href="https://portfolio-wine-six-95.vercel.app" className="text-emerald-500 hover:text-emerald-600">
          Portfolio
        </a>
      </footer>
    </div>
  );
}
