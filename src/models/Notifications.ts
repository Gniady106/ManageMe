export type NotificationPriority = "low" | "medium" | "high";

type ISOString = string // lub np. number
type UserID = string

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  priority: NotificationPriority;
  isRead: boolean;
  recipientId: string;
}