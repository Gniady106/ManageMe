import type { Task, TaskStatus } from "../models/Task";

const STORAGE_KEY = "manageme_tasks";

export const TaskService = {
  getAll(): Task[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveAll(tasks: Task[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },

  getByStory(storyId: string): Task[] {
    return this.getAll().filter((t) => t.storyId === storyId);
  },

  getById(id: string): Task | undefined {
    return this.getAll().find((t) => t.id === id);
  },

  create(task: Task) {
    const tasks = this.getAll();
    tasks.push(task);
    this.saveAll(tasks);
  },

  update(updated: Task) {
    const tasks = this.getAll().map((t) =>
      t.id === updated.id ? updated : t
    );
    this.saveAll(tasks);
  },

  delete(id: string) {
    const tasks = this.getAll().filter((t) => t.id !== id);
    this.saveAll(tasks);
  },

  deleteByStory(storyId: string) {
    const tasks = this.getAll().filter((t) => t.storyId !== storyId);
    this.saveAll(tasks);
  },

  assign(taskId: string, userId: string): Task | undefined {
    const task = this.getById(taskId);
    if (!task) return undefined;

    const updated: Task = {
      ...task,
      assignedUserId: userId,
      status: "doing" as TaskStatus,
      startedAt: new Date().toISOString(),
    };

    this.update(updated);
    return updated;
  },

  complete(taskId: string): Task | undefined {
    const task = this.getById(taskId);
    if (!task) return undefined;

    const updated: Task = {
      ...task,
      status: "done" as TaskStatus,
      finishedAt: new Date().toISOString(),
    };

    this.update(updated);
    return updated;
  },

  allDoneForStory(storyId: string): boolean {
    const tasks = this.getByStory(storyId);
    return tasks.length > 0 && tasks.every((t) => t.status === "done");
  },
};