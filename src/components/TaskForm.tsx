import { useState } from "react";
import type { Task, TaskPriority } from "../models/Task";

interface Props {
  storyId: string;
  onAdd: (task: Task) => void;
}

export function TaskForm({ storyId, onAdd }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [estimatedHours, setEstimatedHours] = useState(1);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const task: Task = {
      id: crypto.randomUUID(),
      name,
      description,
      priority,
      storyId,
      estimatedHours,
      status: "todo",
      createdAt: new Date().toISOString(),
    };

    onAdd(task);
    setName("");
    setDescription("");
    setPriority("medium");
    setEstimatedHours(1);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mt-4"
    >
      <h3 className="text-lg font-bold mb-3">Add Task</h3>

      <input
        className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        placeholder="Task name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <textarea
        className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        placeholder="Description"
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex gap-2 mb-3">
        <select
          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
        >
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>

        <input
          type="number"
          min={1}
          className="w-32 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          placeholder="Est. hours"
          value={estimatedHours}
          onChange={(e) => setEstimatedHours(Number(e.target.value))}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition-colors text-sm"
      >
        Add Task
      </button>
    </form>
  );
}