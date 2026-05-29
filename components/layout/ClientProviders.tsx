"use client";

import dynamic from "next/dynamic";

// Loaded only on client to prevent Firebase from initializing during SSR
const AuthProvider = dynamic(
  () => import("@/contexts/AuthContext").then((m) => ({ default: m.AuthProvider })),
  { ssr: false }
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
