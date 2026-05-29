import { Timestamp } from "firebase/firestore";

export type TaskType = "bug" | "story" | "spike";

export interface ChangedItem {
  name: string;
  type: "file" | "rule" | "component" | "other";
}

export interface Task {
  id: string;
  userId: string;
  type: TaskType;
  title: string;
  summary: string;
  problem: string;
  implementation: string;
  impact: string;
  learnings: string;
  screenshots: string[];
  changedItems: ChangedItem[];
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  source: "AgileStudio" | "manual";
}

export type TaskInput = Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">;

export interface TraceUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  providers: string[];
}

export interface SearchResult {
  tasks: Task[];
  query: string;
}
