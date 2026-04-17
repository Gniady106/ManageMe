import { useState } from "react";
import type { Status, Story } from "../models/Story";
import type { Task } from "../models/Task";
import { TaskService } from "../services/taskService";
import { StoryService } from "../services/storyService";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";
import { NotificationTriggers } from "../services/notificationTriggers";
import { useNotifications } from "../context/NotificationContext";
import { UserService } from "../services/userService";

interface Props {
  stories: Story[];
  onDelete: (id: string) => void;
  onStatusChange: (story: Story, status: Status) => void;
  onStoriesUpdate: () => void;
}

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

const COLUMNS: { status: Status; title: string; color: string }[] = [
  { status: "todo", title: "📋 To Do", color: "bg-gray-50 border-gray-200" },
  {
    status: "doing",
    title: "⚙️ In Progress",
    color: "bg-blue-50 border-blue-200",
  },
  { status: "done", title: "✅ Done", color: "bg-green-50 border-green-200" },
];

export function StoryList({
  stories,
  onDelete,
  onStatusChange,
  onStoriesUpdate,
}: Props) {
  const [expandedStoryId, setExpandedStoryId] = useState<string | null>(null);
  const [tasksMap, setTasksMap] = useState<Record<string, Task[]>>({});
  const { pushPopup, refresh: refreshNotifications } = useNotifications();
const currentUser = UserService.getCurrentUser();

  function toggleStory(storyId: string) {
    if (expandedStoryId === storyId) {
      setExpandedStoryId(null);
    } else {
      setExpandedStoryId(storyId);
      refreshTasks(storyId);
    }
  }

  function refreshTasks(storyId: string) {
    setTasksMap((prev) => ({
      ...prev,
      [storyId]: TaskService.getByStory(storyId),
    }));
  }
  function handleAddTask(task: Task) {
    TaskService.create(task);
    refreshTasks(task.storyId);
    const story = stories.find((s) => s.id === task.storyId);
    if (story) {
      const sent = NotificationTriggers.onTaskCreated(
        task.name,
        story.name,
        currentUser.id,
      );
      pushPopup(sent);
      refreshNotifications();
    }
  }

  function handleDeleteTask(taskId: string, storyId: string) {
  const task = TaskService.getById(taskId);
  const story = stories.find((s) => s.id === storyId);
  TaskService.delete(taskId);
  refreshTasks(storyId);
  if (task && story) {
    const sent = NotificationTriggers.onTaskDeleted(task.name, story.name, currentUser.id);
    pushPopup(sent);
    refreshNotifications();
  }
}

  function handleAssign(taskId: string, userId: string, storyId: string) {
  const task = TaskService.getById(taskId);
  TaskService.assign(taskId, userId);
  refreshTasks(storyId);
  if (task) {
    const sent = NotificationTriggers.onTaskAssigned(task.name, userId);
    pushPopup(sent);
    refreshNotifications();
  }
}

  function handleComplete(taskId: string, storyId: string) {
  const task = TaskService.getById(taskId);
  const story = stories.find((s) => s.id === storyId);
  TaskService.complete(taskId);
  refreshTasks(storyId);
  if (task && story) {
    const sent = NotificationTriggers.onTaskDone(task.name, story.name, currentUser.id);
    pushPopup(sent);
    refreshNotifications();
  }
  const updatedTasks = TaskService.getByStory(storyId);
  const allDone = updatedTasks.length > 0 && updatedTasks.every((t) => t.status === "done");
  if (story && allDone) {
    onStatusChange(story, "done");
    onStoriesUpdate();
  }
}

  if (stories.length === 0) {
    return (
      <p className="text-center text-gray-400 mt-4">
        No stories yet. Add the first one above!
      </p>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
        User Stories
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map(({ status, title, color }) => {
          const col = stories.filter((s) => s.status === status);

          return (
            <div
              key={status}
              className={`border-2 rounded-lg p-4 min-h-[150px]
              bg-gray-50 border-gray-200
              dark:bg-gray-800 dark:border-gray-700`}
            >
              <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-100">
                {title}{" "}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({col.length})
                </span>
              </h3>

              {col.length === 0 && (
                <p className="text-sm text-gray-400 italic">Empty</p>
              )}

              <div className="space-y-3">
                {col.map((story) => {
                  const isExpanded = expandedStoryId === story.id;
                  const tasks = tasksMap[story.id] ?? [];

                  return (
                    <div
                      key={story.id}
                      className="bg-white dark:bg-gray-900
                               rounded-lg shadow-sm 
                               border border-gray-100 dark:border-gray-700"
                    >
                      <div
                        className="p-3 cursor-pointer"
                        onClick={() => toggleStory(story.id)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-sm flex-1 text-gray-800 dark:text-gray-100">
                            {story.name}
                          </h4>

                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ml-1 
                          ${PRIORITY_BADGE[story.priority]}
                          dark:bg-opacity-20`}
                          >
                            {PRIORITY_LABEL[story.priority]}
                          </span>
                        </div>

                        {story.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            {story.description}
                          </p>
                        )}

                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {new Date(story.createdAt).toLocaleDateString(
                              "pl-PL",
                            )}
                          </p>

                          <span className="text-gray-400 dark:text-gray-500 text-xs">
                            {isExpanded ? "▲ hide tasks" : "▼ show tasks"}
                          </span>
                        </div>
                      </div>

                      {/* DELETE BUTTON */}
                      <div className="px-3 pb-3 flex justify-end">
                        <button
                          onClick={() => onDelete(story.id)}
                          className="text-xs bg-red-400 hover:bg-red-500 
                                   dark:bg-red-600 dark:hover:bg-red-700
                                   text-white px-2 py-1 rounded transition-colors"
                        >
                          Delete story
                        </button>
                      </div>

                      {/* TASKS */}
                      {isExpanded && (
                        <div
                          className="border-t border-gray-100 dark:border-gray-700 
                                   p-3 bg-gray-50 dark:bg-gray-800 rounded-b-lg"
                        >
                          <TaskForm storyId={story.id} onAdd={handleAddTask} />
                          <TaskList
                            tasks={tasks}
                            story={story}
                            onDelete={(taskId) =>
                              handleDeleteTask(taskId, story.id)
                            }
                            onAssign={(taskId, userId) =>
                              handleAssign(taskId, userId, story.id)
                            }
                            onComplete={(taskId) =>
                              handleComplete(taskId, story.id)
                            }
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
