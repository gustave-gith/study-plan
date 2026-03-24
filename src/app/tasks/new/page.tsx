"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      dueDate: formData.get("dueDate"),
      subject: formData.get("subject"),
      priority: formData.get("priority"),
    };

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create task");
      }

      router.push("/tasks");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-300">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl px-6 py-4">
          <Link
            href="/tasks"
            className="flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
          >
            ← Back to Tasks
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Create a New Task
          </h1>
          <p className="mt-2 text-slate-400">
            Add an assignment, test, or to-do item to your planner.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8"
        >
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-medium text-white">
              Task Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="e.g., Read Chapter 5"
              className="rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:bg-black/40"
            />
          </div>

          {/* Subject & Due Date Row */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="subject"
                className="text-sm font-medium text-white"
              >
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                placeholder="e.g., Biology"
                className="rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:bg-black/40"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="dueDate"
                className="text-sm font-medium text-white"
              >
                Due Date
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                required
                className="rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:bg-black/40 [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-2">
            <label htmlFor="priority" className="text-sm font-medium text-white">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              className="rounded-lg border border-white/10 bg-slate-900 px-4 py-2.5 text-white outline-none transition-colors focus:border-indigo-500 focus:bg-black/40"
            >
              <option value="low">Low Priority</option>
              <option value="medium" selected>
                Medium Priority
              </option>
              <option value="high">High Priority</option>
            </select>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/tasks"
              className="flex justify-center rounded-lg px-6 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center rounded-lg bg-indigo-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving…
                </>
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
