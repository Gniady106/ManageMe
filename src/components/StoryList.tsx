import type { Status, Story } from "../models/Story";

interface Props {
  stories: Story[];
  onDelete: (id: string) => void;
  onStatusChange: (story: Story, status: Status) => void;
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
  { status: "doing", title: "⚙️ In Progress", color: "bg-blue-50 border-blue-200" },
  { status: "done", title: "✅ Done", color: "bg-green-50 border-green-200" },
];

const NEXT_STATUS: Record<Status, { label: string; next: Status } | null> = {
  todo: { label: "Start →", next: "doing" },
  doing: { label: "Complete →", next: "done" },
  done: null,
};

export function StoryList({ stories, onDelete, onStatusChange }: Props) {
  if (stories.length === 0) {
    return (
      <p className="text-center text-gray-400 mt-4">
        No stories yet. Add the first one above!
      </p>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4 text-center">User Stories</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map(({ status, title, color }) => {
          const col = stories.filter((s) => s.status === status);
          return (
            <div
              key={status}
              className={`border-2 rounded-lg p-4 min-h-[150px] ${color}`}
            >
              <h3 className="font-semibold text-lg mb-3">
                {title}{" "}
                <span className="text-sm font-normal text-gray-500">
                  ({col.length})
                </span>
              </h3>

              {col.length === 0 && (
                <p className="text-sm text-gray-400 italic">Empty</p>
              )}

              <div className="space-y-3">
                {col.map((story) => (
                  <div
                    key={story.id}
                    className="bg-white rounded-lg shadow-sm p-3 border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-sm">{story.name}</h4>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          PRIORITY_BADGE[story.priority]
                        }`}
                      >
                        {PRIORITY_LABEL[story.priority]}
                      </span>
                    </div>

                    {story.description && (
                      <p className="text-xs text-gray-500 mb-2">
                        {story.description}
                      </p>
                    )}

                    <p className="text-xs text-gray-400 mb-2">
                      {new Date(story.createdAt).toLocaleDateString("pl-PL")}
                    </p>

                    <div className="flex gap-2 flex-wrap">
                      {NEXT_STATUS[story.status] && (
                        <button
                          onClick={() =>
                            onStatusChange(story, NEXT_STATUS[story.status]!.next)
                          }
                          className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors"
                        >
                          {NEXT_STATUS[story.status]!.label}
                        </button>
                      )}
                      {story.status !== "todo" && (
                        <button
                          onClick={() => onStatusChange(story, "todo")}
                          className="text-xs bg-gray-300 hover:bg-gray-400 text-gray-700 px-2 py-1 rounded transition-colors"
                        >
                          ← Reset
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(story.id)}
                        className="text-xs bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded transition-colors ml-auto"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
