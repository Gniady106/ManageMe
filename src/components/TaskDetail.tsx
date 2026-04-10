import type { Task } from "../models/Task";
import type { Story } from "../models/Story";
import { UserService } from "../services/userService";

const PRIORITY_BADGE: Record<string, string> = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

const PRIORITY_LABEL: Record<string, string> = {
  low: "🟢 Low",
  medium: "🟡 Medium",
  high: "🔴 High",
};

interface Props {
  task: Task;
  story: Story;
  onAssign: (taskId: string, userId: string) => void;
  onComplete: (taskId: string) => void;
  onClose: () => void;
}

export function TaskDetail({ task, story, onAssign, onComplete, onClose }: Props) {
  const assignableUsers = UserService.getAssignable();
  const assignedUser = task.assignedUserId
    ? UserService.getById(task.assignedUserId)
    : null;

  return (
  <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-900 
                    border border-gray-300 dark:border-gray-700  
                    rounded-xl shadow-xl w-full max-w-lg">

      {/* HEADER */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {task.name}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      {/* BODY */}
      <div className="p-6 space-y-4">

        {/* STORY */}
        <div>
          <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Story</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{story.name}</p>
        </div>

        {/* DESCRIPTION */}
        {task.description && (
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Description</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{task.description}</p>
          </div>
        )}

        {/* META */}
        <div className="flex gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Priority</p>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium 
              ${PRIORITY_BADGE[task.priority]} 
              dark:bg-opacity-20`}
            >
              {PRIORITY_LABEL[task.priority]}
            </span>
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Estimated</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {task.estimatedHours}h
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Status</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 capitalize">
              {task.status}
            </p>
          </div>
        </div>

        {/* DATES */}
        <div className="flex gap-4 flex-wrap">
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Created</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {new Date(task.createdAt).toLocaleDateString("pl-PL")}
            </p>
          </div>

          {task.startedAt && (
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Started</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {new Date(task.startedAt).toLocaleDateString("pl-PL")}
              </p>
            </div>
          )}

          {task.finishedAt && (
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Finished</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {new Date(task.finishedAt).toLocaleDateString("pl-PL")}
              </p>
            </div>
          )}
        </div>

        {/* ASSIGNED */}
        <div>
          <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Assigned to</p>
          {assignedUser ? (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {assignedUser.firstName} {assignedUser.lastName}
              <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
                ({assignedUser.role})
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">Not assigned</p>
          )}
        </div>

        {/* ASSIGN LIST */}
        {task.status !== "done" && (
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold mb-2">
              Assign person
            </p>

            <div className="flex flex-col gap-2">
              {assignableUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => onAssign(task.id, user.id)}
                  className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors
                  ${
                    task.assignedUserId === user.id
                      ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <span className="font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
                    ({user.role})
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-between">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          Close
        </button>

        {task.status === "doing" && (
          <button
            onClick={() => onComplete(task.id)}
            className="px-4 py-2 
                       bg-green-500 hover:bg-green-600 
                       dark:bg-green-600 dark:hover:bg-green-700
                       text-white text-sm font-semibold rounded-lg transition-colors"
          >
            ✅ Mark as Done
          </button>
        )}
      </div>
    </div>
  </div>
);
}