"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getTask } from "@/lib/firestore";
import type { Task } from "@/types";
import { BugDetailView } from "@/components/tasks/BugDetailView";
import { StoryDetailView } from "@/components/tasks/StoryDetailView";
import { SpikeDetailView } from "@/components/tasks/SpikeDetailView";

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getTask(id)
      .then((t) => {
        if (!t) setNotFound(true);
        else setTask(t);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound || !task) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-foreground">Task not found</p>
        <p className="text-sm text-muted-foreground">
          This document may have been deleted or you don&apos;t have access.
        </p>
        <button
          onClick={() => router.push("/tasks")}
          className="mt-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back navigation */}
      <div className="sticky top-0 z-10 flex h-14 items-center border-b border-border bg-background/80 px-8 backdrop-blur-sm">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <div className="mx-auto max-w-3xl px-8 py-10">
        {task.type === "bug" && <BugDetailView task={task} />}
        {task.type === "story" && <StoryDetailView task={task} />}
        {task.type === "spike" && <SpikeDetailView task={task} />}
      </div>
    </motion.div>
  );
}
