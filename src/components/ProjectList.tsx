import { useState } from "react";
import type { Project } from "../models/Project";
import type { Story, Status } from "../models/Story";
import { StoryService } from "../services/storyService";
import { StoryForm } from "./StoryForm";
import { StoryList } from "./StoryList";

interface Props {
  projects: Project[];
  onDelete: (id: string) => void;
  onEdit: (updatedProject: Project) => void;
}

export default function ProjectList({ projects, onDelete, onEdit }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [storiesMap, setStoriesMap] = useState<Record<string, Story[]>>({});

  function toggleExpand(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      setStoriesMap((prev) => ({
        ...prev,
        [id]: StoryService.getByProject(id),
      }));
    }
  }

  function refreshStories(projectId: string) {
    setStoriesMap((prev) => ({
      ...prev,
      [projectId]: StoryService.getByProject(projectId),
    }));
  }

  function startEdit(project: Project, e: React.MouseEvent) {
    e.stopPropagation();
    setEditingId(project.id);
    setEditName(project.name);
    setEditDescription(project.description);
  }

  function saveEdit(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    onEdit({ id, name: editName, description: editDescription });
    setEditingId(null);
  }

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    onDelete(id);
    if (expandedId === id) setExpandedId(null);
  }

  function handleAddStory(story: Story) {
    StoryService.create(story);
    refreshStories(story.projectId);
  }

  function handleDeleteStory(id: string, projectId: string) {
    StoryService.delete(id);
    refreshStories(projectId);
  }

  function handleStatusChange(story: Story, status: Status) {
    StoryService.update({ ...story, status });
    refreshStories(story.projectId);
  }

  if (projects.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-6">No projects added yet.</p>
    );
  }

  return (
    <div className="max-w-8xl mx-auto mt-6 space-y-3">
      {projects.map((project) => {
        const isExpanded = expandedId === project.id;
        const isEditing = editingId === project.id;
        const stories = storiesMap[project.id] ?? [];

        return (
          <div
            key={project.id}
            className={`bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 rounded-lg shadow transition-all ${
              isExpanded
                ? "border-2 border-gray-300"
                : "border border-gray-200"
            }`}
          >
            <div
              className="flex items-center justify-between p-4 cursor-pointer select-none"
              onClick={() => !isEditing && toggleExpand(project.id)}
            >
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div
                    className="space-y-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      className="w-full p-2 border border border-gray-300 dark:border-gray-600 
                 rounded 
                 bg-white dark:bg-gray-900 
                 text-gray-800 dark:text-gray-100
                 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 "
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <input
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 
                 rounded 
                 bg-white dark:bg-gray-900 
                 text-gray-800 dark:text-gray-100
                 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 "
                      value={editDescription}
                      placeholder="Description"
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-lg truncate">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-gray-500 truncate">
                        {project.description}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center ml-4 gap-2 shrink-0">
                {isEditing ? (
                  <button
                    onClick={(e) => saveEdit(project.id, e)}
                    className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={(e) => startEdit(project, e)}
                    className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={(e) => handleDelete(project.id, e)}
                  className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Delete
                </button>
                <span className="text-gray-400 text-lg ml-1">
                  {isExpanded ? "▲" : "▼"}
                </span>
              </div>
            </div>

            {isExpanded && (
              <div className="border-t border-gray-100 p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-b-lg">
                <StoryForm projectId={project.id} onAdd={handleAddStory} />
                <StoryList
                  stories={stories}
                  onDelete={(id) => handleDeleteStory(id, project.id)}
                  onStatusChange={handleStatusChange}
                  onStoriesUpdate={() => refreshStories(project.id)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
