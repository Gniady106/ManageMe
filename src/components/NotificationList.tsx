import { useState, useEffect } from "react";
import { NotificationService } from "../services/notificationService";
import { UserService } from "../services/userService";
import { useNotifications } from "../context/NotificationContext";
import type { Notification } from "../models/Notifications";

const PRIORITY_BADGE: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

const PRIORITY_LABEL: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function NotificationList({ onSelect }: { onSelect: (n: Notification) => void }) {
  const user = UserService.getCurrentUser();
  const { refreshKey, refresh } = useNotifications();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifications(NotificationService.getForUser(user.id));
  }, [refreshKey, user.id]);

  function handleMarkAllRead() {
    NotificationService.markAllAsRead(user.id);
    refresh();
  }

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    NotificationService.delete(id);
    refresh();
  }

  const unread = notifications.filter((n) => !n.isRead).length;

 return (
  <div className="w-full max-w-8xl mx-auto mt-6">
    
    
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
        Notifications
        {unread > 0 && (
          <span className="ml-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full">
            {unread} unread
          </span>
        )}
      </h2>

      {unread > 0 && (
        <button
          onClick={handleMarkAllRead}
          className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          Mark all as read
        </button>
      )}
    </div>

    
    {notifications.length === 0 ? (
      <p className="text-center text-gray-400 dark:text-gray-500 italic py-8">
        No notifications yet.
      </p>
    ) : (
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => onSelect(n)}
            className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all
            ${
              n.isRead
                ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
            }
            hover:shadow-md`}
          >
           
            <div className="mt-1.5 shrink-0">
              {!n.isRead ? (
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-transparent" />
              )}
            </div>

     
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p
                  className={`text-sm font-semibold truncate ${
                    n.isRead
                      ? "text-gray-700 dark:text-gray-300"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {n.title}
                </p>

                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${PRIORITY_BADGE[n.priority]}`}
                >
                  {PRIORITY_LABEL[n.priority]}
                </span>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {n.message}
              </p>

              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {new Date(n.date).toLocaleString("pl-PL")}
              </p>
            </div>

         
            <button
              onClick={(e) => handleDelete(n.id, e)}
              className="text-gray-300 dark:text-gray-500 hover:text-red-400 dark:hover:text-red-500 transition-colors text-lg leading-none shrink-0"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
)}