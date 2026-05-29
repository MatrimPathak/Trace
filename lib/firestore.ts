import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Task, TaskInput, TaskType } from "@/types";

const TASKS = "tasks";

export async function createTask(userId: string, input: TaskInput): Promise<string> {
  const ref = await addDoc(collection(db, TASKS), {
    ...input,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateTask(taskId: string, updates: Partial<TaskInput>): Promise<void> {
  await updateDoc(doc(db, TASKS, taskId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTask(taskId: string): Promise<void> {
  await deleteDoc(doc(db, TASKS, taskId));
}

export async function getTask(taskId: string): Promise<Task | null> {
  const snap = await getDoc(doc(db, TASKS, taskId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Task;
}

export async function getUserTasks(userId: string, type?: TaskType): Promise<Task[]> {
  const constraints = [
    where("userId", "==", userId),
    orderBy("updatedAt", "desc"),
    limit(100),
  ];
  if (type) {
    constraints.splice(1, 0, where("type", "==", type));
  }
  const q = query(collection(db, TASKS), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task));
}

export async function getRecentTasks(userId: string, count = 5): Promise<Task[]> {
  const q = query(
    collection(db, TASKS),
    where("userId", "==", userId),
    orderBy("updatedAt", "desc"),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task));
}

export async function searchTasks(userId: string, searchQuery: string): Promise<Task[]> {
  const q = query(
    collection(db, TASKS),
    where("userId", "==", userId),
    orderBy("updatedAt", "desc"),
    limit(50)
  );
  const snap = await getDocs(q);
  const all = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task));
  const lower = searchQuery.toLowerCase();
  return all.filter(
    (t) =>
      t.title.toLowerCase().includes(lower) ||
      t.summary.toLowerCase().includes(lower) ||
      t.tags.some((tag) => tag.toLowerCase().includes(lower))
  );
}
