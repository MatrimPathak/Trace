"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plug,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Zap,
  Shield,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className={cn(
        "flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-all",
        copied
          ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied!" : (label ?? "Copy")}
    </button>
  );
}

const STEPS = [
  {
    icon: BookOpen,
    title: "Open VS Code",
    description: "Open your project in VS Code with GitHub Copilot extension installed.",
    done: false,
  },
  {
    icon: Plug,
    title: "Open Copilot MCP Settings",
    description: "Go to Settings → Search for 'MCP Servers' → Edit settings.json",
    done: false,
  },
  {
    icon: Zap,
    title: "Add Trace MCP Endpoint",
    description: "Paste the Trace MCP server config into your VS Code settings.",
    done: false,
  },
  {
    icon: Shield,
    title: "Authenticate with OAuth",
    description: "VS Code will prompt you to authorize Trace. Sign in with the same account.",
    done: false,
  },
  {
    icon: CheckCircle2,
    title: "Start using Trace",
    description: 'Ask Copilot: "Generate Trace document for this task"',
    done: false,
  },
];

export default function McpPage() {
  const { user } = useAuth();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://your-trace-app.vercel.app";
  const mcpEndpoint = `${appUrl}/api/mcp`;

  const toggleStep = (i: number) => {
    setCompletedSteps((prev) =>
      prev.includes(i) ? prev.filter((s) => s !== i) : [...prev, i]
    );
  };

  const vsCodeConfig = `{
  "github.copilot.mcp.servers": {
    "trace": {
      "url": "${mcpEndpoint}",
      "type": "http"
    }
  }
}`;

  const copilotPrompt = `Generate Trace document for this task`;

  return (
    <div className="mx-auto max-w-2xl px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Plug className="h-4.5 w-4.5 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">MCP Connection</h1>
        </div>
        <p className="mt-2 text-base text-muted-foreground">
          Connect GitHub Copilot to your Trace archive in minutes.
        </p>
      </motion.div>

      {/* Status banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mt-8 flex items-center gap-4 rounded-2xl border border-border bg-card p-5"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">MCP Server Active</p>
            <p className="text-xs text-muted-foreground">Ready to receive connections from GitHub Copilot</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-green-600 dark:text-green-400">Online</span>
        </div>
      </motion.div>

      {/* MCP Endpoint */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="mt-5 rounded-2xl border border-border bg-card p-5"
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
          MCP Endpoint
        </p>
        <div className="flex items-center justify-between gap-3">
          <code className="flex-1 truncate font-mono text-sm text-foreground">{mcpEndpoint}</code>
          <CopyButton text={mcpEndpoint} />
        </div>
      </motion.div>

      {/* Setup steps */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="mt-8"
      >
        <h2 className="mb-5 text-sm font-semibold text-foreground">Setup Guide</h2>
        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const isComplete = completedSteps.includes(i);
            const Icon = step.icon;
            return (
              <motion.button
                key={i}
                onClick={() => toggleStep(i)}
                whileHover={{ x: 2 }}
                className={cn(
                  "flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-all",
                  isComplete
                    ? "border-green-500/20 bg-green-500/5"
                    : "border-border bg-card hover:bg-muted/30"
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
                  isComplete ? "bg-green-500/15" : "bg-muted"
                )}>
                  {isComplete ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground/40" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/40">
                      Step {i + 1}
                    </span>
                  </div>
                  <p className={cn(
                    "text-sm font-medium mt-0.5",
                    isComplete ? "text-muted-foreground line-through" : "text-foreground"
                  )}>
                    {step.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{step.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* VS Code config */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.3 }}
        className="mt-8 rounded-2xl border border-border bg-card p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">VS Code Configuration</h2>
          <CopyButton text={vsCodeConfig} label="Copy config" />
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          Add this to your VS Code <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">settings.json</code>:
        </p>
        <pre className="overflow-x-auto rounded-xl bg-muted/50 p-4 font-mono text-[12px] text-foreground/80 leading-relaxed">
          {vsCodeConfig}
        </pre>
      </motion.div>

      {/* Copilot prompts */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.33, duration: 0.3 }}
        className="mt-5 rounded-2xl border border-border bg-card p-6"
      >
        <h2 className="mb-4 text-sm font-semibold text-foreground">Example Copilot Prompts</h2>
        <div className="space-y-2.5">
          {[
            "Generate Trace document for this task",
            "Connect to Trace and answer my review questions",
            "Search Trace for authentication bugs",
            "What did we learn from the last spike?",
          ].map((prompt) => (
            <div
              key={prompt}
              className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
            >
              <code className="flex-1 font-mono text-xs text-foreground/80">&ldquo;{prompt}&rdquo;</code>
              <CopyButton text={prompt} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Link to settings */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-center"
      >
        <a
          href="/settings"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          View full settings
          <ArrowRight className="h-3 w-3" />
        </a>
      </motion.div>
    </div>
  );
}
