import { createContext, useContext, useState, useCallback } from "react";
import type { Notification } from "../models/Notifications";

interface NotificationContextType {
  pendingPopup: Notification[];
  clearPopup: () => void;
  pushPopup: (notifications: Notification[]) => void;
  refreshKey: number;
  refresh: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  pendingPopup: [],
  clearPopup: () => {},
  pushPopup: () => {},
  refreshKey: 0,
  refresh: () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [pendingPopup, setPendingPopup] = useState<Notification[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const pushPopup = useCallback((notifications: Notification[]) => {
    const toShow = notifications.filter(
      (n) => n.priority === "medium" || n.priority === "high"
    );
    if (toShow.length > 0) {
      setPendingPopup((prev) => [...prev, ...toShow]);
    }
  }, []);

  const clearPopup = useCallback(() => {
    setPendingPopup([]);
  }, []);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <NotificationContext.Provider value={{ pendingPopup, clearPopup, pushPopup, refreshKey, refresh }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}