import { MetadataRow } from "@/components/shared/MetadataRow";
import { ScreenshotGallery } from "@/components/shared/ScreenshotGallery";
import { ChangedItemPills } from "@/components/shared/ChangedItemPills";
import type { Task } from "@/types";

function Section({ title, children, accent = "default" }: {
  title: string;
  children: React.ReactNode;
  accent?: "default" | "violet" | "green" | "blue";
}) {
  const borderColors = {
    default: "border-border",
    violet: "border-violet-500/30",
    green: "border-green-500/30",
    blue: "border-blue-500/30",
  };
  return (
    <section>
      <div className={`mb-4 flex items-center gap-3 border-l-2 pl-3 ${borderColors[accent]}`}>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Prose({ text }: { text: string }) {
  if (!text) return <p className="text-sm text-muted-foreground italic">Not documented.</p>;
  return (
    <div className="space-y-3">
      {text.split("\n\n").map((para, i) => (
        <p key={i} className="text-sm leading-relaxed text-foreground/90">
          {para}
        </p>
      ))}
    </div>
  );
}

export function StoryDetailView({ task }: { task: Task }) {
  return (
    <article className="space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-600 dark:text-violet-400">
          Story
        </div>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground">
          {task.title}
        </h1>
        <MetadataRow task={task} />
        {task.summary && (
          <p className="text-base text-muted-foreground leading-relaxed border-l-2 border-violet-500/30 pl-4">
            {task.summary}
          </p>
        )}
      </div>

      <div className="h-px bg-border" />

      {/* User Value / Problem = "Why" */}
      <Section title="User Value" accent="violet">
        <Prose text={task.problem} />
      </Section>

      {/* Implementation Approach */}
      <Section title="Implementation Approach">
        <Prose text={task.implementation} />
      </Section>

      {/* Screenshots */}
      {task.screenshots.length > 0 && (
        <Section title="Screenshots">
          <ScreenshotGallery screenshots={task.screenshots} />
        </Section>
      )}

      {/* Systems Affected */}
      {task.changedItems.length > 0 && (
        <Section title="Systems Affected" accent="blue">
          <ChangedItemPills items={task.changedItems} />
        </Section>
      )}

      {/* Impact */}
      <Section title="Impact" accent="green">
        <Prose text={task.impact} />
      </Section>

      {/* Learnings */}
      <Section title="Learnings">
        <Prose text={task.learnings} />
      </Section>
    </article>
  );
}
