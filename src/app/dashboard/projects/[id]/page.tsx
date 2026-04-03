"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Project, Task } from "@/lib/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const PROJECT_STATUS_BADGE: Record<Project["status"], string> = {
  active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  completed: "bg-blue-50 text-blue-700 border border-blue-200",
  on_hold: "bg-amber-50 text-amber-700 border border-amber-200",
};

const PROJECT_STATUS_LABEL: Record<Project["status"], string> = {
  active: "Active",
  completed: "Completed",
  on_hold: "On Hold",
};

const TASK_STATUS_BADGE: Record<Task["status"], string> = {
  todo: "bg-slate-100 text-slate-600",
  in_progress: "bg-amber-50 text-amber-700",
  done: "bg-emerald-50 text-emerald-700",
};

const TASK_STATUS_LABEL: Record<Task["status"], string> = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
};

const TASK_STATUS_CYCLE: Record<Task["status"], Task["status"]> = {
  todo: "in_progress",
  in_progress: "done",
  done: "todo",
};

const PRIORITY_BADGE: Record<Task["priority"], string> = {
  low: "bg-slate-100 text-slate-500",
  medium: "bg-amber-50 text-amber-600",
  high: "bg-red-50 text-red-600",
};

const PRIORITY_LABEL: Record<Task["priority"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "No deadline";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectError, setProjectError] = useState<string | null>(null);

  // Add task form state
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<Task["priority"]>("medium");
  const [adding, setAdding] = useState(false);

  // ─── Data fetching ──────────────────────────────────────────────────────────

  const fetchTasks = useCallback(async () => {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("project_id", id)
      .order("created_at");
    setTasks(data ?? []);
  }, [id]);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);

      // Fetch project
      const { data: projectData, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !projectData) {
        setProjectError("Project not found.");
        setLoading(false);
        return;
      }

      setProject(projectData as Project);

      // Fetch tasks
      const { data: taskData } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", id)
        .order("created_at");

      setTasks(taskData ?? []);
      setLoading(false);
    }

    loadAll();
  }, [id]);

  // ─── Add task ───────────────────────────────────────────────────────────────

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;

    setAdding(true);
    await supabase.from("tasks").insert({
      title,
      priority: newPriority,
      project_id: id,
      status: "todo",
    });
    setNewTitle("");
    setNewPriority("medium");
    await fetchTasks();
    setAdding(false);
  }

  // ─── Toggle status ──────────────────────────────────────────────────────────

  async function handleToggleStatus(task: Task) {
    const next = TASK_STATUS_CYCLE[task.status];
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: next } : t))
    );
    await supabase.from("tasks").update({ status: next }).eq("id", task.id);
  }

  // ─── Delete task ────────────────────────────────────────────────────────────

  async function handleDeleteTask(taskId: string) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    await supabase.from("tasks").delete().eq("id", taskId);
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4">
        <p className="text-slate-600">{projectError ?? "Project not found."}</p>
        <Link
          href="/dashboard/projects"
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const doneCount = tasks.filter((t) => t.status === "done").length;
  const totalCount = tasks.length;
  const donePercent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-3xl">
      {/* Back link */}
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-6"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Projects
      </Link>

      {/* Project header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">
            {project.name}
          </h1>
          <span
            className={`flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              PROJECT_STATUS_BADGE[project.status]
            }`}
          >
            {PROJECT_STATUS_LABEL[project.status]}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
          {project.client_name && (
            <span className="flex items-center gap-1.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-slate-400"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {project.client_name}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-400"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            {formatCurrency(project.budget)}
          </span>
          <span className="flex items-center gap-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-400"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className={!project.deadline ? "italic text-slate-400" : ""}>
              {formatDate(project.deadline)}
            </span>
          </span>
        </div>
      </div>

      {/* Tasks section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        {/* Tasks header + stats */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-slate-900">
              Tasks ({totalCount})
            </h2>
            {totalCount > 0 && (
              <span className="text-sm text-slate-500">
                Done: {doneCount}/{totalCount} ({donePercent}%)
              </span>
            )}
          </div>

          {/* Progress bar */}
          {totalCount > 0 && (
            <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${donePercent}%` }}
              />
            </div>
          )}
        </div>

        {/* Add task form */}
        <form
          onSubmit={handleAddTask}
          className="flex items-center gap-2 px-6 py-4 border-b border-slate-100"
        >
          <input
            type="text"
            placeholder="New task title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as Task["priority"])}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            type="submit"
            disabled={adding || !newTitle.trim()}
            className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            {adding ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
            Add
          </button>
        </form>

        {/* Task list */}
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-6">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-slate-400"
              >
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-900 mb-0.5">No tasks yet</p>
            <p className="text-sm text-slate-500">Add your first task above.</p>
          </div>
        ) : (
          <ul>
            {tasks.map((task, idx) => (
              <li
                key={task.id}
                className={`flex items-center gap-3 px-6 py-3 ${
                  idx < tasks.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                {/* Status toggle checkbox */}
                <button
                  onClick={() => handleToggleStatus(task)}
                  aria-label={`Mark as ${TASK_STATUS_CYCLE[task.status]}`}
                  className="flex-shrink-0 w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center transition-colors hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1"
                  style={{
                    backgroundColor: task.status === "done" ? "#10b981" : undefined,
                    borderColor: task.status === "done" ? "#10b981" : task.status === "in_progress" ? "#f59e0b" : undefined,
                  }}
                >
                  {task.status === "done" && (
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {task.status === "in_progress" && (
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </button>

                {/* Title */}
                <span
                  className={`flex-1 text-sm font-medium min-w-0 truncate ${
                    task.status === "done"
                      ? "line-through text-slate-400"
                      : "text-slate-800"
                  }`}
                >
                  {task.title}
                </span>

                {/* Status badge */}
                <button
                  onClick={() => handleToggleStatus(task)}
                  className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-opacity hover:opacity-75 ${
                    TASK_STATUS_BADGE[task.status]
                  }`}
                  title="Click to cycle status"
                >
                  {TASK_STATUS_LABEL[task.status]}
                </button>

                {/* Priority badge */}
                <span
                  className={`flex-shrink-0 hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    PRIORITY_BADGE[task.priority]
                  }`}
                >
                  {PRIORITY_LABEL[task.priority]}
                </span>

                {/* Delete button */}
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  aria-label="Delete task"
                  className="flex-shrink-0 p-1 rounded text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
