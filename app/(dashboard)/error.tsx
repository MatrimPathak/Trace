"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[DashboardError]", error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
          <AlertCircle className="h-7 w-7 text-destructive" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Something went wrong</h2>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          Try again
        </button>
      </motion.div>
    </div>
  );
}
