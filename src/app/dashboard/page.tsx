"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Project, Task } from "@/lib/types";

interface Stats {
  total: number;
  active: number;
  completed: number;
  onHold: number;
  totalTasks: number;
  doneTasks: number;
  inProgressTasks: number;
}

const STATUS_BADGE: Record<Project["status"], string> = {
  active: "bg-[#DBEAFE] text-[#2563EB]",
  completed: "bg-green-50 text-green-700",
  on_hold: "bg-amber-50 text-amber-700",
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
  const [stats, setStats] = useState<Stats>({
    total: 0, active: 0, completed: 0, onHold: 0,
    totalTasks: 0, doneTasks: 0, inProgressTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
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
        onHold: fetchedProjects.filter((p) => p.status === "on_hold").length,
        totalTasks: tasks.length,
        doneTasks: tasks.filter((t) => t.status === "done").length,
        inProgressTasks: tasks.filter((t) => t.status === "in_progress").length,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const recentProjects = projects.slice(0, 5);
  const taskDonePercent = stats.totalTasks > 0 ? Math.round((stats.doneTasks / stats.totalTasks) * 100) : 0;

  const STAT_CARDS = [
    {
      label: "Total Projects",
      value: stats.total,
      change: "+2 this month",
      borderColor: "#2563EB",
      iconBg: "bg-[#DBEAFE]",
      iconColor: "text-[#2563EB]",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
    },
    {
      label: "Active",
      value: stats.active,
      change: "In progress",
      borderColor: "#F97316",
      iconBg: "bg-orange-50",
      iconColor: "text-[#F97316]",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    },
    {
      label: "Completed",
      value: stats.completed,
      change: "Delivered",
      borderColor: "#16A34A",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    },
    {
      label: "Total Tasks",
      value: stats.totalTasks,
      change: `${stats.doneTasks} done`,
      borderColor: "#8B5CF6",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-[#1E293B]">Overview</h1>
        <p className="text-sm text-[#64748B] mt-1">Here&apos;s a snapshot of your work</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map((card, idx) => (
          <div
            key={card.label}
            className="animate-fade-in-up bg-white border border-[#E2E8F0] rounded-xl p-5 relative overflow-hidden"
            style={{ animationDelay: `${idx * 60}ms`, borderLeftWidth: "4px", borderLeftColor: card.borderColor }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#64748B]">{card.label}</span>
              <div className={`w-9 h-9 rounded-lg ${card.iconBg} ${card.iconColor} flex items-center justify-center`}>
                {card.icon}
              </div>
            </div>
            <span className="text-3xl font-[family-name:var(--font-heading)] font-bold text-[#1E293B]">{card.value}</span>
            <p className="text-xs text-[#64748B] mt-1">{card.change}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Project Status Distribution */}
        <div className="animate-fade-in-up delay-4 bg-white border border-[#E2E8F0] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#1E293B] mb-4">Project Status Distribution</h3>
          {stats.total > 0 ? (
            <>
              <div className="flex h-8 rounded-lg overflow-hidden mb-4">
                {stats.active > 0 && (
                  <div
                    className="bg-[#2563EB] transition-all duration-500"
                    style={{ width: `${(stats.active / stats.total) * 100}%` }}
                  />
                )}
                {stats.completed > 0 && (
                  <div
                    className="bg-[#16A34A] transition-all duration-500"
                    style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                  />
                )}
                {stats.onHold > 0 && (
                  <div
                    className="bg-[#D97706] transition-all duration-500"
                    style={{ width: `${(stats.onHold / stats.total) * 100}%` }}
                  />
                )}
              </div>
              <div className="flex items-center gap-5 text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#2563EB]" />
                  <span className="text-[#64748B]">Active ({stats.active})</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#16A34A]" />
                  <span className="text-[#64748B]">Completed ({stats.completed})</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#D97706]" />
                  <span className="text-[#64748B]">On Hold ({stats.onHold})</span>
                </span>
              </div>
            </>
          ) : (
            <p className="text-sm text-[#64748B]">No projects yet</p>
          )}
        </div>

        {/* Task Completion Donut */}
        <div className="animate-fade-in-up delay-5 bg-white border border-[#E2E8F0] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#1E293B] mb-4">Task Completion</h3>
          {stats.totalTasks > 0 ? (
            <div className="flex items-center gap-8">
              {/* CSS conic-gradient donut */}
              <div className="relative w-28 h-28 flex-shrink-0">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background: `conic-gradient(
                      #2563EB 0deg ${(stats.doneTasks / stats.totalTasks) * 360}deg,
                      #F97316 ${(stats.doneTasks / stats.totalTasks) * 360}deg ${((stats.doneTasks + stats.inProgressTasks) / stats.totalTasks) * 360}deg,
                      #E2E8F0 ${((stats.doneTasks + stats.inProgressTasks) / stats.totalTasks) * 360}deg 360deg
                    )`,
                  }}
                />
                <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center">
                  <span className="text-xl font-[family-name:var(--font-heading)] font-bold text-[#1E293B]">{taskDonePercent}%</span>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#2563EB]" />
                  <span className="text-[#64748B]">Done ({stats.doneTasks})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#F97316]" />
                  <span className="text-[#64748B]">In Progress ({stats.inProgressTasks})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#E2E8F0]" />
                  <span className="text-[#64748B]">Todo ({stats.totalTasks - stats.doneTasks - stats.inProgressTasks})</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#64748B]">No tasks yet</p>
          )}
        </div>
      </div>

      {/* Recent projects */}
      <div className="animate-fade-in-up delay-6 bg-white border border-[#E2E8F0] rounded-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-base font-semibold text-[#1E293B]">Recent Projects</h2>
          <Link
            href="/dashboard/projects"
            className="text-sm text-[#2563EB] hover:text-[#1D4ED8] font-medium transition-colors duration-200"
          >
            View all
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-12 h-12 bg-[#DBEAFE] rounded-full flex items-center justify-center mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#2563EB]">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-[#1E293B] mb-1">No projects yet</p>
            <p className="text-sm text-[#64748B] mb-4">Get started by creating your first project</p>
            <Link
              href="/dashboard/projects"
              className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
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
              <li key={project.id} className="animate-fade-in-up" style={{ animationDelay: `${(idx + 7) * 40}ms` }}>
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className={`group flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors duration-200 ${
                    idx < recentProjects.length - 1 ? "border-b border-slate-100" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1E293B] truncate">{project.name}</p>
                    {project.client_name && (
                      <p className="text-xs text-[#64748B] truncate mt-0.5">{project.client_name}</p>
                    )}
                  </div>

                  <span className={`flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[project.status]}`}>
                    {STATUS_LABEL[project.status]}
                  </span>

                  <span className="flex-shrink-0 text-xs text-slate-400 hidden sm:block">
                    {formatDate(project.created_at)}
                  </span>

                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="flex-shrink-0 text-slate-300 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all duration-200"
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
