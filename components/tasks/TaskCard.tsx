"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bug, Layers, Lightbulb, ArrowRight } from "lucide-react";
import { cn, formatRelativeDate, truncate } from "@/lib/utils";
import type { Task } from "@/types";

const TYPE_CONFIG = {
  bug: {
    icon: Bug,
    label: "Bug",
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    iconClass: "text-rose-500",
    borderClass: "hover:border-rose-500/20",
  },
  story: {
    icon: Layers,
    label: "Story",
    badgeClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    iconClass: "text-violet-500",
    borderClass: "hover:border-violet-500/20",
  },
  spike: {
    icon: Lightbulb,
    label: "Spike",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    iconClass: "text-amber-500",
    borderClass: "hover:border-amber-500/20",
  },
};

interface TaskCardProps {
  task: Task;
  compact?: boolean;
}

export function TaskCard({ task, compact = false }: TaskCardProps) {
  const config = TYPE_CONFIG[task.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={`/tasks/${task.id}`}
        className={cn(
          "group block rounded-2xl border border-border bg-card p-5",
          "transition-all duration-200",
          "hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20",
          config.borderClass
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={cn(
                "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg",
                "bg-muted"
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", config.iconClass)} />
            </div>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                config.badgeClass
              )}
            >
              {config.label}
            </span>
          </div>
          <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground/30 transition-all duration-200 group-hover:text-muted-foreground group-hover:translate-x-0.5" />
        </div>

        {/* Title */}
        <h3 className="mt-3 text-sm font-semibold text-foreground leading-snug">
          {compact ? truncate(task.title, 60) : task.title}
        </h3>

        {/* Summary */}
        {task.summary && (
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {task.summary}
          </p>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {task.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="flex-shrink-0 text-[11px] text-muted-foreground/50">
            {task.updatedAt ? formatRelativeDate(task.updatedAt) : ""}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
