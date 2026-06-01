"use client";

import { motion } from "framer-motion";
import { BookOpen, Bug, Layers, Lightbulb } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/tasks/TaskCard";

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 animate-pulse">
      <div className="flex gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-muted" />
        <div className="h-5 w-16 rounded-full bg-muted" />
      </div>
      <div className="mt-3 h-4 w-3/4 rounded bg-muted" />
      <div className="mt-1.5 h-3 w-full rounded bg-muted" />
      <div className="mt-1 h-3 w-2/3 rounded bg-muted" />
      <div className="mt-4 flex gap-1.5">
        <div className="h-5 w-12 rounded-md bg-muted" />
        <div className="h-5 w-16 rounded-md bg-muted" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const { tasks, loading } = useTasks();

  const firstName = user?.displayName?.split(" ")[0] ?? "there";
  const bugs = tasks.filter((t) => t.type === "bug");
  const stories = tasks.filter((t) => t.type === "story");
  const spikes = tasks.filter((t) => t.type === "spike");
  const recent = [...tasks].sort(
    (a, b) => b.updatedAt?.toDate().getTime() - a.updatedAt?.toDate().getTime()
  ).slice(0, 6);

  const hasAny = tasks.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Good to see you, {firstName}
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Your engineering archive — beautifully organized.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mt-8 grid grid-cols-3 gap-4"
      >
        {[
          { label: "Bugs", count: bugs.length, icon: Bug, color: "text-rose-500", bg: "bg-rose-500/8" },
          { label: "Stories", count: stories.length, icon: Layers, color: "text-violet-500", bg: "bg-violet-500/8" },
          { label: "Spikes", count: spikes.length, icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-500/8" },
        ].map(({ label, count, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl border border-border bg-card px-5 py-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${bg}`}>
              <Icon className={`h-4.5 w-4.5 ${color}`} />
            </div>
            <p className="mt-3 text-2xl font-semibold text-foreground">{count}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Recent tasks */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.4 }}
        className="mt-10"
      >
        <div className="mb-5 flex items-center gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
            Recently Updated
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : !hasAny ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {recent.map((task) => (
              <TaskCard key={task.id} task={task} compact />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
        <BookOpen className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-sm font-medium text-foreground">Your archive is empty</h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Ask GitHub Copilot to generate a Trace document for your next task.
      </p>
      <div className="mt-5 rounded-xl bg-muted px-4 py-3 text-left">
        <p className="font-mono text-xs text-muted-foreground">
          &ldquo;Generate Trace document for this task&rdquo;
        </p>
      </div>
    </motion.div>
  );
}
