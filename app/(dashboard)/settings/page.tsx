"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Moon,
  Sun,
  Monitor,
  Github,
  Chrome,
  Plug,
  Download,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Key,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { getUserTasks } from "@/lib/firestore";
import { cn } from "@/lib/utils";

function Section({ title, description, children }: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-border bg-card p-6"
      aria-labelledby={`section-${title.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <div className="mb-5 border-b border-border pb-4">
        <h2
          id={`section-${title.replace(/\s+/g, "-").toLowerCase()}`}
          className="text-sm font-semibold text-foreground"
        >
          {title}
        </h2>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </div>
      {children}
    </motion.section>
  );
}

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
      aria-label={copied ? "Copied!" : (label ?? "Copy to clipboard")}
      className="ml-2 rounded-md p-1 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      )}
    </button>
  );
}

function McpTokenSection() {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const fetchToken = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const t = await user.getIdToken(true);
      setToken(t);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Generate your Firebase ID token to use as <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">TRACE_FIREBASE_TOKEN</code> in the MCP server.
        Tokens expire after 1 hour — regenerate as needed.
      </p>

      {!token ? (
        <button
          onClick={fetchToken}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Key className="h-4 w-4" aria-hidden="true" />
          )}
          {loading ? "Generating…" : "Generate Token"}
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-foreground">Your token</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? "Hide token" : "Show token"}
                className="rounded-md p-1 text-muted-foreground/60 hover:bg-muted hover:text-foreground"
              >
                {visible ? (
                  <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
              <CopyButton text={token} label="Copy token" />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 px-3 py-2.5">
            <code className="block break-all font-mono text-[11px] text-foreground/70">
              {visible ? token : "•".repeat(40) + "…"}
            </code>
          </div>
          <button
            onClick={fetchToken}
            disabled={loading}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Refresh token
          </button>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [exporting, setExporting] = useState(false);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://your-trace-app.vercel.app";
  const mcpEndpoint = `${appUrl}/api/mcp`;

  const handleExport = async () => {
    if (!user) return;
    setExporting(true);
    try {
      const tasks = await getUserTasks(user.uid);
      const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `trace-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-2 text-base text-muted-foreground">Manage your account and connections.</p>
      </motion.div>

      <div className="space-y-5">
        {/* Profile */}
        <Section title="Profile">
          <div className="flex items-center gap-4">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={`${user.displayName ?? "User"} avatar`}
                className="h-14 w-14 rounded-full object-cover ring-2 ring-border"
              />
            ) : (
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary"
                aria-hidden="true"
              >
                {user?.displayName?.[0] ?? user?.email?.[0] ?? "U"}
              </div>
            )}
            <div>
              <p className="font-medium text-foreground">{user?.displayName ?? "Anonymous"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="mt-0.5 text-xs text-muted-foreground/50">UID: {user?.uid}</p>
            </div>
          </div>
        </Section>

        {/* Theme */}
        <Section title="Appearance" description="Choose your preferred color theme.">
          <div className="flex gap-3" role="group" aria-label="Color theme">
            {[
              { value: "light", label: "Light", icon: Sun },
              { value: "system", label: "System", icon: Monitor },
              { value: "dark", label: "Dark", icon: Moon },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                aria-pressed={theme === value}
                className={cn(
                  "flex flex-1 flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                  theme === value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-border/80 hover:bg-muted/50"
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* Connected accounts */}
        <Section title="Connected Accounts" description="OAuth providers linked to your account.">
          <div className="space-y-3">
            {[
              { id: "google.com", label: "Google", icon: Chrome },
              { id: "github.com", label: "GitHub", icon: Github },
            ].map(({ id, label, icon: Icon }) => {
              const connected = user?.providerData.some((p) => p.providerId === id);
              return (
                <div
                  key={id}
                  className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-foreground" aria-hidden="true" />
                    <span className="text-sm font-medium text-foreground">{label}</span>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      connected ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                    )}
                    aria-label={`${label}: ${connected ? "Connected" : "Not connected"}`}
                  >
                    {connected ? "Connected" : "Not connected"}
                  </span>
                </div>
              );
            })}
          </div>
        </Section>

        {/* MCP Setup */}
        <Section
          title="MCP Setup"
          description="Connect GitHub Copilot to your Trace archive via the Model Context Protocol."
        >
          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3">
              <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
              <div>
                <p className="text-xs font-medium text-foreground">MCP Endpoint Active</p>
                <p className="text-xs text-muted-foreground">Your archive is accessible to GitHub Copilot</p>
              </div>
            </div>

            {/* Endpoint */}
            <div>
              <p className="mb-2 text-xs font-medium text-foreground">MCP Endpoint URL</p>
              <div className="flex items-center rounded-xl border border-border bg-muted/30 px-3 py-2.5">
                <code className="flex-1 truncate font-mono text-xs text-foreground">{mcpEndpoint}</code>
                <CopyButton text={mcpEndpoint} label="Copy endpoint URL" />
              </div>
            </div>

            {/* Steps */}
            <div>
              <p className="mb-3 text-xs font-medium text-foreground">Quick Setup</p>
              <div className="space-y-3">
                {[
                  { step: "1", title: "Open VS Code Settings", desc: "Go to Settings → GitHub Copilot → MCP Servers" },
                  { step: "2", title: "Add Trace as MCP Server", desc: "Paste the endpoint URL above into the MCP server configuration" },
                  { step: "3", title: "Generate your MCP token", desc: "Use the token section below to get your authentication token" },
                  { step: "4", title: "Start using Trace", desc: 'Ask Copilot: "Generate Trace document for this task"' },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary" aria-hidden="true">
                      {step}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{title}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="/mcp"
              className="flex items-center gap-2 text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              View full MCP connection guide
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        </Section>

        {/* MCP Token */}
        <Section
          title="MCP Authentication Token"
          description="Generate a token to authenticate the Trace MCP server with your account."
        >
          <McpTokenSection />
        </Section>

        {/* Data */}
        <Section title="Data & Storage" description="Export or manage your Trace data.">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:bg-muted/50 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Export all data as JSON"
          >
            <div className="flex items-center gap-3">
              {exporting ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />
              ) : (
                <Download className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              )}
              <span className="font-medium text-foreground">
                {exporting ? "Exporting…" : "Export all data"}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">JSON format</span>
          </button>
        </Section>
      </div>
    </div>
  );
}
