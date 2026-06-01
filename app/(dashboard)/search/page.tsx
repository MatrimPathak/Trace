"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, FileText } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { TaskCard } from "@/components/tasks/TaskCard";
import { cn } from "@/lib/utils";

export default function SearchPage() {
  const { results, loading, query, search } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Search</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Find any documented task instantly.
        </p>
      </motion.div>

      {/* Search input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.35 }}
        className="relative"
      >
        <div className="relative flex items-center">
          {loading ? (
            <Loader2 className="absolute left-4 h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
          )}
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by title, summary, or tag…"
            onChange={(e) => search(e.target.value)}
            className={cn(
              "w-full rounded-2xl border border-border bg-card py-4 pl-12 pr-5",
              "text-base text-foreground placeholder:text-muted-foreground/50",
              "shadow-sm transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            )}
          />
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {!query ? (
          <motion.div
            key="empty-prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-16 flex flex-col items-center gap-3 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Start typing to search your archive
            </p>
          </motion.div>
        ) : loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-10 grid grid-cols-1 gap-4"
          >
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5 animate-pulse">
                <div className="flex gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-muted" />
                  <div className="h-5 w-16 rounded-full bg-muted" />
                </div>
                <div className="mt-3 h-4 w-3/4 rounded bg-muted" />
                <div className="mt-2 h-3 w-full rounded bg-muted" />
              </div>
            ))}
          </motion.div>
        ) : results.length === 0 ? (
          <motion.div
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-16 flex flex-col items-center gap-3 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No results for &ldquo;{query}&rdquo;</p>
            <p className="text-xs text-muted-foreground">
              Try a different keyword or check the spelling.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8"
          >
            <p className="mb-5 text-xs text-muted-foreground">
              {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
            </p>
            <div className="grid grid-cols-1 gap-4">
              {results.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <TaskCard task={task} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
