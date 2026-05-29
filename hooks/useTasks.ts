"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserTasks, getRecentTasks } from "@/lib/firestore";
import type { Task, TaskType } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

export function useTasks(type?: TaskType) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getUserTasks(user.uid, type);
      setTasks(data);
    } catch (e) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [user, type]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { tasks, loading, error, refresh };
}

export function useRecentTasks(count = 5) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getRecentTasks(user.uid, count)
      .then(setTasks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, count]);

  return { tasks, loading };
}
