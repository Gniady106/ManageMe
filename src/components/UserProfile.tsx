import { useEffect, useState } from "react";
import { UserService } from "../services/userService";
import { NotificationService } from "../services/notificationService";
import { useNotifications } from "../context/NotificationContext";

interface Props {
  onOpenNotifications: () => void;
}

export default function UserProfile({ onOpenNotifications }: Props) {
  const user = UserService.getCurrentUser();
  const { refreshKey } = useNotifications();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(NotificationService.getUnreadCount(user.id));
  }, [refreshKey, user.id]);

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold shrink-0">
        {user.firstName[0]}{user.lastName[0]}
      </div>
      <div className="text-right">
        <div className="flex items-center gap-2 justify-end">
          <p className="font-semibold text-white text-sm">
            {user.firstName} {user.lastName}
          </p>
          {unreadCount > 0 && (
            <button
              onClick={onOpenNotifications}
              className="bg-yellow-400 text-gray-900 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center hover:bg-yellow-300 transition-colors"
            >
              {unreadCount}
            </button>
          )}
        </div>
        <p className="text-xs text-red-200">{user.email}</p>
      </div>
    </div>
  );
}