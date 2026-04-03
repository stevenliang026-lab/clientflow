"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Project, Task } from "@/lib/types";

interface Stats {
  total: number;
  active: number;
  completed: number;
  totalTasks: number;
}

const STATUS_BADGE: Record<Project["status"], string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-blue-50 text-blue-700 border-blue-200",
  on_hold: "bg-amber-50 text-amber-700 border-amber-200",
};

const STATUS_LABEL: Record<Project["status"], string> = {
  active: "Active",
  completed: "Completed",
  on_hold: "On Hold",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, completed: 0, totalTasks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: projectData } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const fetchedProjects: Project[] = projectData ?? [];

      const projectIds = fetchedProjects.map((p) => p.id);

      let tasks: Task[] = [];
      if (projectIds.length > 0) {
        const { data: taskData } = await supabase
          .from("tasks")
          .select("*")
          .in("project_id", projectIds);
        tasks = taskData ?? [];
      }

      setProjects(fetchedProjects);
      setStats({
        total: fetchedProjects.length,
        active: fetchedProjects.filter((p) => p.status === "active").length,
        completed: fetchedProjects.filter((p) => p.status === "completed").length,
        totalTasks: tasks.length,
      });
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const recentProjects = projects.slice(0, 5);

  const STAT_CARDS = [
    {
      label: "Total Projects",
      value: stats.total,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      label: "Active Projects",
      value: stats.active,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },
    {
      label: "Total Tasks",
      value: stats.totalTasks,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
        <p className="text-sm text-slate-500 mt-1">
          Here&apos;s a snapshot of your work
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-500">{card.label}</span>
              {card.icon}
            </div>
            <span className="text-3xl font-bold text-slate-900">{card.value}</span>
          </div>
        ))}
      </div>

      {/* Recent projects */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Recent Projects</h2>
          <Link
            href="/dashboard/projects"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            View all
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-900 mb-1">No projects yet</p>
            <p className="text-sm text-slate-500 mb-4">Get started by creating your first project</p>
            <Link
              href="/dashboard/projects"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create your first project
            </Link>
          </div>
        ) : (
          <ul>
            {recentProjects.map((project, idx) => (
              <li key={project.id}>
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className={`flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors ${
                    idx < recentProjects.length - 1 ? "border-b border-slate-100" : ""
                  }`}
                >
                  {/* Project name + client */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{project.name}</p>
                    {project.client_name && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">{project.client_name}</p>
                    )}
                  </div>

                  {/* Status badge */}
                  <span
                    className={`flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      STATUS_BADGE[project.status]
                    }`}
                  >
                    {STATUS_LABEL[project.status]}
                  </span>

                  {/* Date */}
                  <span className="flex-shrink-0 text-xs text-slate-400 hidden sm:block">
                    {formatDate(project.created_at)}
                  </span>

                  {/* Chevron */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0 text-slate-300"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
