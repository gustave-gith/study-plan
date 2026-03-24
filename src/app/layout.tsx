import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Study Planner — Organise Your Academic Tasks",
  description:
    "Track assignments, set deadlines, and stay on top of your academic goals with Study Planner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950">
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
            <Link href="/" className="font-semibold text-white transition-colors hover:text-indigo-400">
              Home
            </Link>
            <Link href="/tasks" className="text-sm font-medium text-slate-300 transition-colors hover:text-indigo-400">
              Tasks
            </Link>
            <Link href="/tasks/new" className="text-sm font-medium text-slate-300 transition-colors hover:text-indigo-400">
              New Task
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
