import { useState } from "react";
import type { Task, TaskStatus } from "../models/Task";
import type { Story } from "../models/Story";
import { UserService } from "../services/userService";
import { TaskDetail } from "./TaskDetail";

const PRIORITY_BADGE: Record<string, string> = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

const COLUMNS: { status: TaskStatus; title: string; color: string }[] = [
  { status: "todo", title: "📋 To Do", color: "bg-gray-50 border-gray-200" },
  { status: "doing", title: "⚙️ In Progress", color: "bg-blue-50 border-blue-200" },
  { status: "done", title: "✅ Done", color: "bg-green-50 border-green-200" },
];

interface Props {
  tasks: Task[];
  story: Story;
  onDelete: (taskId: string) => void;
  onAssign: (taskId: string, userId: string) => void;
  onComplete: (taskId: string) => void;
}

export function TaskList({ tasks, story, onDelete, onAssign, onComplete }: Props) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (tasks.length === 0) {
    return (
      <p className="text-center text-gray-400 text-sm mt-3 italic">
        No tasks yet. Add the first one above!
      </p>
    );
  }


  const currentSelected = selectedTask
    ? tasks.find((t) => t.id === selectedTask.id) ?? null
    : null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 bg">
        {COLUMNS.map(({ status, title, color }) => {
          const col = tasks.filter((t) => t.status === status);
          return (
            <div
              key={status}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-lg p-4 border  shadow-sm flex flex-col"
            >
              <h4 className="font-semibold text-sm mb-2 bg">
                {title}{" "}
                <span className="text-xs font-normal text-gray-500">
                  ({col.length})
                </span>
              </h4>

              {col.length === 0 && (
                <p className="text-xs text-gray-400 italic">Empty</p>
              )}

              <div className="space-y-2">
                {col.map((task) => {
                  const assignedUser = task.assignedUserId
                    ? UserService.getById(task.assignedUserId)
                    : null;

                  return (
                    <div
                      key={task.id}
                      className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg p-2 border border-gray-300 dark:border-gray-700 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-xs font-semibold flex-1">
                          {task.name}
                        </p>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full ml-1 ${PRIORITY_BADGE[task.priority]}`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      {assignedUser && (
                        <p className="text-xs text-gray-400 mb-1">
                          👤 {assignedUser.firstName} {assignedUser.lastName}
                        </p>
                      )}

                      <p className="text-xs text-gray-400 mb-2">
                        ⏱ {task.estimatedHours}h
                      </p>

                      <div className="flex gap-1">
                        <button
                          onClick={() => setSelectedTask(task)}
                          className="flex-1 text-xs bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onDelete(task.id)}
                          className="text-xs bg-red-400 hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-700 text-white px-2 py-1 rounded transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {currentSelected && (
        <TaskDetail
          task={currentSelected}
          story={story}
          onAssign={onAssign}
          onComplete={onComplete}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  );
}