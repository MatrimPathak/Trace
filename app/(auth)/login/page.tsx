"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Github, Chrome, BookOpen, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithGitHub } = useAuth();
  const router = useRouter();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) router.replace("/home");
  }, [user, loading, router]);

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      router.replace("/home");
    } catch (e: unknown) {
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGitHub = async () => {
    setError(null);
    setGithubLoading(true);
    try {
      await signInWithGitHub();
      router.replace("/home");
    } catch (e: unknown) {
      setError("Failed to sign in with GitHub. Please try again.");
    } finally {
      setGithubLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-7 w-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background overflow-hidden">
      {/* Subtle background gradient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-primary/3 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm px-6"
      >
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Trace</h1>
            <p className="mt-1 text-sm text-muted-foreground">Your engineering archive</p>
          </div>
        </div>

        {/* Auth card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-medium text-foreground">Welcome back</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to access your archive
            </p>
          </div>

          <div className="space-y-3">
            <AuthButton
              onClick={handleGoogle}
              loading={googleLoading}
              disabled={githubLoading}
              icon={<Chrome className="h-4 w-4" />}
              label="Continue with Google"
            />
            <AuthButton
              onClick={handleGitHub}
              loading={githubLoading}
              disabled={googleLoading}
              icon={<Github className="h-4 w-4" />}
              label="Continue with GitHub"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center text-xs text-destructive"
            >
              {error}
            </motion.p>
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-muted-foreground/60">
          Documentation lives here. Intelligence lives in Copilot.
        </p>
      </motion.div>
    </div>
  );
}

function AuthButton({
  onClick,
  loading,
  disabled,
  icon,
  label,
}: {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={cn(
        "relative flex w-full items-center justify-center gap-3 rounded-xl",
        "border border-border bg-background px-4 py-3",
        "text-sm font-medium text-foreground",
        "transition-all duration-150",
        "hover:bg-muted hover:border-border/80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:opacity-50 disabled:cursor-not-allowed"
      )}
    >
      {loading ? (
        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />
      ) : (
        icon
      )}
      {label}
    </button>
  );
}
