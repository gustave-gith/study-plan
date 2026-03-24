import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Tasks — Study Planner",
  description:
    "View and manage your academic tasks, assignments, and deadlines.",
};

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
