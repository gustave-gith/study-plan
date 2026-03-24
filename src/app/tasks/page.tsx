"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Task {
  id: number;
  title: string;
  dueDate: string;
  completed: boolean;
  subject: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysUntil(iso: string) {
  const diff = Math.ceil(
    (new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (diff < 0) return "Overdue";
  if (diff === 0) return "Due today";
  if (diff === 1) return "Due tomorrow";
  return `${diff} days left`;
}

function urgencyColor(iso: string, completed: boolean) {
  if (completed) return "text-emerald-400";
  const diff = Math.ceil(
    (new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (diff < 0) return "text-red-400";
  if (diff <= 2) return "text-amber-400";
  return "text-slate-400";
}

/* ------------------------------------------------------------------ */
/*  Subject badge colours                                              */
/* ------------------------------------------------------------------ */

const subjectColors: Record<string, string> = {
  Mathematics: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  History: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Physics: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Psychology: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  "Computer Science": "bg-violet-500/20 text-violet-300 border-violet-500/30",
  Languages: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tasks");
        return res.json();
      })
      .then((data: Task[]) => setTasks(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setSuccessMsg("Task deleted successfully!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggle(id: number, currentStatus: boolean) {
    const newStatus = !currentStatus;
    
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: newStatus } : t))
    );

    try {
      const res = await fetch(`/api/tasks?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
    } catch (err: any) {
      // Revert state if failed
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: currentStatus } : t))
      );
      setError("Failed to update task status.");
    }
  }

  const pending = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  /* ---- Loading state ---- */
  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
        </div>

        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-4">
          {/* Animated spinner */}
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-400" />
          <p className="text-sm font-medium text-slate-400">
            Loading your tasks…
          </p>
        </div>
      </div>
    );
  }

  /* ---- Error state ---- */
  if (error) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-3">
          <p className="text-lg font-semibold text-red-400">
            Something went wrong
          </p>
          <p className="text-sm text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold text-white transition-colors hover:text-indigo-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
            Study Planner
          </Link>

          {/* Stats pill */}
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300 backdrop-blur-sm">
            <span>
              <span className="font-semibold text-indigo-400">
                {pending.length}
              </span>{" "}
              pending
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span>
              <span className="font-semibold text-emerald-400">
                {completed.length}
              </span>{" "}
              done
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 mx-auto max-w-5xl px-6 py-12">
        {successMsg && (
          <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-400">
            {successMsg}
          </div>
        )}

        {/* Page title */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              My{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Tasks
              </span>
            </h1>
            <p className="mt-2 text-slate-400">
              {pending.length} task{pending.length !== 1 && "s"} remaining ·{" "}
              {completed.length} completed
            </p>
          </div>
          <Link
            href="/tasks/new"
            className="flex shrink-0 items-center justify-center rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Task
          </Link>
        </div>

        {/* Pending tasks */}
        {pending.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
              <span className="inline-block h-2 w-2 rounded-full bg-indigo-500" />
              Pending
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pending.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={handleDelete}
                  isDeleting={deletingId === task.id}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </section>
        )}

        {/* Completed tasks */}
        {completed.length > 0 && (
          <section>
            <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Completed
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {completed.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={handleDelete}
                  isDeleting={deletingId === task.id}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Task Card                                                          */
/* ------------------------------------------------------------------ */

interface TaskCardProps {
  task: Task;
  onDelete: (id: number) => void;
  isDeleting: boolean;
  onToggle: (id: number, currentStatus: boolean) => void;
}

function TaskCard({ task, onDelete, isDeleting, onToggle }: TaskCardProps) {
  const badge =
    subjectColors[task.subject] ??
    "bg-slate-500/20 text-slate-300 border-slate-500/30";

  return (
    <div
      className={`group relative flex flex-col gap-4 rounded-2xl border p-5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/10 ${
        task.completed
          ? "border-emerald-500/20 bg-emerald-500/5"
          : "border-white/10 bg-white/5 hover:border-indigo-500/30 hover:bg-white/10"
      }`}
    >
      {/* Status & subject row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Checkbox icon */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggle(task.id, task.completed);
            }}
            title={task.completed ? "Mark as incomplete" : "Mark as complete"}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
              task.completed
                ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                : "border-white/20 bg-white/5 text-slate-500 hover:border-emerald-500/50 hover:bg-white/10"
            }`}
          >
            {task.completed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <span className="h-2.5 w-2.5 rounded-full bg-slate-600 transition-colors hover:bg-slate-400" />
            )}
          </button>

          {/* Subject badge */}
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${badge}`}
          >
            {task.subject}
          </span>
        </div>

        {/* Delete Action */}
        <button
          onClick={() => onDelete(task.id)}
          disabled={isDeleting}
          title="Delete task"
          className="rounded-md p-1.5 text-slate-500 transition-all hover:bg-red-500/20 hover:text-red-400 focus:bg-red-500/20 focus:text-red-400 focus:outline-none disabled:opacity-50"
        >
          {isDeleting ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Title */}
      <h3
        className={`text-base font-semibold leading-snug ${
          task.completed
            ? "text-slate-400 line-through decoration-slate-600"
            : "text-white"
        }`}
      >
        {task.title}
      </h3>

      {/* Due date */}
      <div className="mt-auto flex items-center justify-between text-sm">
        <span className="text-slate-500">{formatDate(task.dueDate)}</span>
        <span
          className={`font-medium ${urgencyColor(task.dueDate, task.completed)}`}
        >
          {task.completed ? "Completed" : daysUntil(task.dueDate)}
        </span>
      </div>
    </div>
  );
}
