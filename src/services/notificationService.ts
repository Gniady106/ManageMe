import type {
  Notification,
  NotificationPriority,
} from "../models/Notifications";

const STORAGE_KEY = "manageme_notifications";

export const NotificationService = {
  getAll(): Notification[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveAll(notifications: Notification[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  },

  getForUser(userId: string): Notification[] {
    return this.getAll().filter((n) => n.recipientId === userId);
  },

  getUnreadCount(userId: string): number {
    return this.getForUser(userId).filter((n) => !n.isRead).length;
  },

  getById(id: string): Notification | undefined {
    return this.getAll().find((n) => n.id === id);
  },

  send(
    recipientId: string,
    title: string,
    message: string,
    priority: NotificationPriority,
  ): Notification {
    const notification: Notification = {
      id: crypto.randomUUID(),
      title,
      message,
      date: new Date().toISOString(),
      priority,
      isRead: false,
      recipientId,
    };
    const all = this.getAll();
    all.unshift(notification);
    this.saveAll(all);
    return notification;
  },

  markAsRead(id: string) {
    const all = this.getAll().map((n) =>
      n.id === id ? { ...n, isRead: true } : n,
    );
    this.saveAll(all);
  },

  markAllAsRead(userId: string) {
    const all = this.getAll().map((n) =>
      n.recipientId === userId ? { ...n, isRead: true } : n,
    );
    this.saveAll(all);
  },

  delete(id: string) {
    const all = this.getAll().filter((n) => n.id !== id);
    this.saveAll(all);
  },
};
