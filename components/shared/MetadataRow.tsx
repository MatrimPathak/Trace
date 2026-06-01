import { Bug, Layers, Lightbulb, Calendar } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { Task } from "@/types";

const TYPE_CONFIG = {
  bug: { icon: Bug, label: "Bug", badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  story: { icon: Layers, label: "Story", badgeClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  spike: { icon: Lightbulb, label: "Spike", badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
};

export function MetadataRow({ task }: { task: Task }) {
  const config = TYPE_CONFIG[task.type];
  const Icon = config.icon;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
          config.badgeClass
        )}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </span>

      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Calendar className="h-3 w-3" />
        {task.updatedAt ? formatDate(task.updatedAt) : "Unknown date"}
      </span>

      <span className="text-xs text-muted-foreground/50">via {task.source}</span>

      {task.tags.map((tag) => (
        <span
          key={tag}
          className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
