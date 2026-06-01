"use client";

import { useState, useCallback } from "react";
import { searchTasks } from "@/lib/firestore";
import type { Task } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

export function useSearch() {
  const { user } = useAuth();
  const [results, setResults] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const search = useCallback(
    async (q: string) => {
      setQuery(q);
      if (!q.trim() || !user) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const data = await searchTasks(user.uid, q);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  return { results, loading, query, search };
}
