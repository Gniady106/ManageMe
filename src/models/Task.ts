export type TaskStatus = "todo" | "doing" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  name: string;
  description: string;
  priority: TaskPriority;
  storyId: string;
  estimatedHours: number;
  status: TaskStatus;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  assignedUserId?: string;
}