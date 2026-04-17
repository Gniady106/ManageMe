import { useEffect } from "react";
import type { Notification } from "../models/Notifications";
import { NotificationService } from "../services/notificationService";
import { useNotifications } from "../context/NotificationContext";

const PRIORITY_BADGE: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

const PRIORITY_LABEL: Record<string, string> = {
  low: "🔵 Low",
  medium: "🟡 Medium",
  high: "🔴 High",
};

interface Props {
  notification: Notification;
  onBack: () => void;
}

export function NotificationDetail({ notification, onBack }: Props) {
  const { refresh } = useNotifications();

  // oznacz jako przeczytane automatycznie przy wejściu
  useEffect(() => {
    if (!notification.isRead) {
      NotificationService.markAsRead(notification.id);
      refresh();
    }
  }, [notification.id]);

  return (
    <div className="w-full">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700 mb-6 transition-colors"
      >
        ← Back to notifications
      </button>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex-1">
            {notification.title}
          </h2>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ml-3 shrink-0 ${PRIORITY_BADGE[notification.priority]}`}>
            {PRIORITY_LABEL[notification.priority]}
          </span>
        </div>

        {/* Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {notification.message}
        </p>

        {/* Meta */}
        <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {new Date(notification.date).toLocaleString("pl-PL")}
          </p>
          <span className={`text-sm font-medium ${notification.isRead ? "text-gray-400" : "text-blue-500"}`}>
            {notification.isRead ? "✓ Read" : "● Unread"}
          </span>
        </div>
      </div>
    </div>
  );
}