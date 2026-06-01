import { FileCode2, Shield, Component, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChangedItem } from "@/types";

const TYPE_CONFIG = {
  file: { icon: FileCode2, label: "file", class: "bg-blue-500/8 text-blue-600 dark:text-blue-400 border-blue-500/15" },
  rule: { icon: Shield, label: "rule", class: "bg-orange-500/8 text-orange-600 dark:text-orange-400 border-orange-500/15" },
  component: { icon: Component, label: "component", class: "bg-violet-500/8 text-violet-600 dark:text-violet-400 border-violet-500/15" },
  other: { icon: Package, label: "other", class: "bg-muted text-muted-foreground border-border" },
};

export function ChangedItemPills({ items }: { items: ChangedItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => {
        const config = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.other;
        const Icon = config.icon;
        return (
          <span
            key={i}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-mono font-medium",
              config.class
            )}
          >
            <Icon className="h-3 w-3 flex-shrink-0" />
            {item.name}
          </span>
        );
      })}
    </div>
  );
}
