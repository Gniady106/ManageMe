import { useState } from "react";
import type { Priority, Story } from "../models/Story";

interface Props {
  projectId: string;
  onAdd: (story: Story) => void;
}

export function StoryForm({ projectId, onAdd }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const story: Story = {
      id: crypto.randomUUID(),
      name,
      description,
      priority,
      projectId,
      createdAt: new Date().toISOString(),
      status: "todo",
    };

    onAdd(story);
    setName("");
    setDescription("");
    setPriority("medium");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 
               border border-gray-300 dark:border-gray-700 
               p-6 rounded-lg shadow-md 
               max-w-md mx-auto mt-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
        Add User Story
      </h2>

      <input
        className="w-full mb-3 p-3 
                 border border-gray-300 dark:border-gray-600 
                 rounded 
                 bg-white dark:bg-gray-900 
                 text-gray-800 dark:text-gray-100
                 placeholder-gray-400 dark:placeholder-gray-500
                 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Story name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <textarea
        className="w-full mb-3 p-3 
                 border border-gray-300 dark:border-gray-600 
                 rounded 
                 bg-white dark:bg-gray-900 
                 text-gray-800 dark:text-gray-100
                 placeholder-gray-400 dark:placeholder-gray-500
                 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Description"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        className="w-full mb-4 p-3 
                 border border-gray-300 dark:border-gray-600 
                 rounded 
                 bg-white dark:bg-gray-900 
                 text-gray-800 dark:text-gray-100
                 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
      >
        <option value="low">🟢 Low priority</option>
        <option value="medium">🟡 Medium priority</option>
        <option value="high">🔴 High priority</option>
      </select>

      <button
        type="submit"
        className="w-full 
                 bg-blue-500 hover:bg-blue-600 
                dark:bg-blue-600 dark:hover:bg-blue-700
                 text-white font-semibold py-3 rounded 
                 transition-colors"
      >
        Add Story
      </button>
    </form>
  );
}
