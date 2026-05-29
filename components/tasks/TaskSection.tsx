import { motion } from "framer-motion";
import type { Task } from "@/types";
import { TaskCard } from "./TaskCard";

interface TaskSectionProps {
  title: string;
  tasks: Task[];
  emptyMessage?: string;
}

export function TaskSection({ title, tasks, emptyMessage }: TaskSectionProps) {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
          {title}
        </h2>
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground/40">{tasks.length}</span>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-10 text-center">
          <p className="text-sm text-muted-foreground">
            {emptyMessage ?? `No ${title.toLowerCase()} yet`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tasks.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
            >
              <TaskCard task={task} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
