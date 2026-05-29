"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  ListTodo,
  Search,
  Settings,
  BookOpen,
  Bug,
  Lightbulb,
  Layers,
  LogOut,
  Moon,
  Sun,
  Monitor,
  Plug,
  X,
  Menu,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import { useRecentTasks } from "@/hooks/useTasks";
import { cn, truncate } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/search", label: "Search", icon: Search },
  { href: "/mcp", label: "MCP Setup", icon: Plug },
  { href: "/settings", label: "Settings", icon: Settings },
];

const TASK_TYPE_ICONS = { bug: Bug, story: Layers, spike: Lightbulb };
const TASK_TYPE_COLORS = {
  bug: "text-rose-500",
  story: "text-violet-500",
  spike: "text-amber-500",
};

interface SidebarContentProps {
  onClose?: () => void;
}

function SidebarContent({ onClose }: SidebarContentProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { tasks } = useRecentTasks(5);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  const handleNavClick = () => onClose?.();

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">Trace</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-md p-1 text-sidebar-foreground/40 hover:bg-sidebar-accent hover:text-sidebar-foreground md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
        <ul className="space-y-0.5" role="list">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={handleNavClick}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Recent Tasks */}
        {tasks.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-sidebar-foreground/35">
              Recent
            </p>
            <ul className="space-y-0.5" role="list">
              {tasks.map((task) => {
                const Icon = TASK_TYPE_ICONS[task.type];
                const colorClass = TASK_TYPE_COLORS[task.type];
                return (
                  <li key={task.id}>
                    <Link
                      href={`/tasks/${task.id}`}
                      onClick={handleNavClick}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    >
                      <Icon className={cn("h-3.5 w-3.5 flex-shrink-0", colorClass)} aria-hidden="true" />
                      <span className="truncate text-xs">{truncate(task.title, 28)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>

      {/* User Profile */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName ?? "User avatar"}
              className="h-7 w-7 rounded-full object-cover ring-1 ring-border"
            />
          ) : (
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary"
              aria-hidden="true"
            >
              {user?.displayName?.[0] ?? user?.email?.[0] ?? "U"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-medium text-sidebar-foreground">
              {user?.displayName ?? user?.email ?? "User"}
            </p>
            <p className="truncate text-[11px] text-sidebar-foreground/40">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            aria-label="Sign out"
            className="rounded-md p-1 text-sidebar-foreground/40 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Theme switcher */}
        <div
          className="mt-1 flex items-center justify-center gap-0.5 rounded-lg bg-sidebar-accent/40 p-1"
          role="group"
          aria-label="Color theme"
        >
          {(["light", "system", "dark"] as const).map((value) => {
            const Icon = value === "light" ? Sun : value === "system" ? Monitor : Moon;
            const label = value === "light" ? "Light theme" : value === "system" ? "System theme" : "Dark theme";
            return (
              <button
                key={value}
                onClick={() => setTheme(value)}
                aria-label={label}
                aria-pressed={theme === value}
                className={cn(
                  "flex flex-1 items-center justify-center rounded-md p-1.5 transition-colors",
                  theme === value
                    ? "bg-sidebar text-sidebar-foreground shadow-sm"
                    : "text-sidebar-foreground/40 hover:text-sidebar-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Desktop sidebar
export function Sidebar() {
  return (
    <aside className="hidden md:flex h-screen w-60 flex-shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <SidebarContent />
    </aside>
  );
}

// Mobile sidebar trigger button
export function MobileSidebarTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open navigation"
      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
    >
      <Menu className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}

// Mobile overlay sidebar
export function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            aria-hidden="true"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-60 bg-sidebar shadow-xl md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
          >
            <SidebarContent onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
