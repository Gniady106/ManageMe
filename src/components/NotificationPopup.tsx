import { useNotifications } from "../context/NotificationContext";
import { NotificationService } from "../services/notificationService";

const PRIORITY_STYLES: Record<string, string> = {
  medium: "border-yellow-400 bg-yellow-50",
  high: "border-red-400 bg-red-50",
};

const PRIORITY_LABEL: Record<string, string> = {
  medium: "🟡 Medium",
  high: "🔴 High",
};

export function NotificationPopup() {
  const { pendingPopup, clearPopup, refresh } = useNotifications();

  if (pendingPopup.length === 0) return null;

  function handleMarkRead(id: string) {
    NotificationService.markAsRead(id);
    refresh();
  }

  function handleDismiss() {
    // oznacz wszystkie z popupa jako przeczytane
    pendingPopup.forEach((n) => {
      NotificationService.markAsRead(n.id);
    });
    refresh();
    clearPopup();
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full">
      {pendingPopup.map((n) => (
        <div
          key={n.id}
          className={`border-l-4 rounded-lg shadow-lg p-4 ${PRIORITY_STYLES[n.priority]}`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-bold text-gray-800">{n.title}</p>
                <span className="text-xs text-gray-500">
                  {PRIORITY_LABEL[n.priority]}
                </span>
              </div>
              <p className="text-xs text-gray-600">{n.message}</p>
            </div>
            <button
              onClick={() => {
                handleMarkRead(n.id);
                clearPopup();
              }}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none shrink-0"
            >
              ×
            </button>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              onClick={() => {
                handleMarkRead(n.id);
                clearPopup();
              }}
              className="text-xs bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1 rounded transition-colors"
            >
              Mark as read
            </button>
          </div>
        </div>
      ))}

      {pendingPopup.length > 1 && (
        <button
          onClick={handleDismiss}
          className="text-xs text-center text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-lg py-2 shadow transition-colors"
        >
          Dismiss all ({pendingPopup.length})
        </button>
      )}
    </div>
  );
}