"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground antialiased">
        <div className="flex flex-col items-center gap-4 text-center px-6">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="max-w-sm text-sm text-muted-foreground">{error.message}</p>
          <button
            onClick={reset}
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
