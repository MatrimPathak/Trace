"use client";

import { motion } from "framer-motion";
import { useTasks } from "@/hooks/useTasks";
import { TaskSection } from "@/components/tasks/TaskSection";

function SkeletonSection() {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <div className="h-3 w-16 rounded bg-muted animate-pulse" />
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 animate-pulse">
            <div className="flex gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-muted" />
              <div className="h-5 w-16 rounded-full bg-muted" />
            </div>
            <div className="mt-3 h-4 w-3/4 rounded bg-muted" />
            <div className="mt-2 h-3 w-full rounded bg-muted" />
            <div className="mt-4 flex gap-1.5">
              <div className="h-5 w-12 rounded-md bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function TasksPage() {
  const { tasks, loading } = useTasks();

  const bugs = tasks.filter((t) => t.type === "bug");
  const stories = tasks.filter((t) => t.type === "story");
  const spikes = tasks.filter((t) => t.type === "spike");

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Tasks</h1>
        <p className="mt-2 text-base text-muted-foreground">
          All documented engineering work, organized by type.
        </p>
      </motion.div>

      <div className="mt-10 space-y-12">
        {loading ? (
          <>
            <SkeletonSection />
            <SkeletonSection />
            <SkeletonSection />
          </>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.35 }}
            >
              <TaskSection
                title="Bugs"
                tasks={bugs}
                emptyMessage="No bugs documented yet"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, duration: 0.35 }}
            >
              <TaskSection
                title="Stories"
                tasks={stories}
                emptyMessage="No stories documented yet"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.20, duration: 0.35 }}
            >
              <TaskSection
                title="Spikes"
                tasks={spikes}
                emptyMessage="No spikes documented yet"
              />
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
