import { useState, useEffect } from "react";
import ProjectForm from "./components/ProjectForm";
import ProjectList from "./components/ProjectList";
import UserProfile from "./components/UserProfile";
import {StoryForm} from "./components/StoryForm";
import { StoryList } from "./components/StoryList";

import { useProjects } from "./hooks/useProjects";
import { ActiveProjectService } from "./services/activeProjectService";
import { StoryService } from "./services/storyService";

import type { Story, Status } from "./models/Story";

function App() {
  const activeProjectId = ActiveProjectService.getActiveProjectId();

  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    if (activeProjectId) {
      setStories(StoryService.getByProject(activeProjectId));
    }
  }, [activeProjectId]);
  const handleSelectProject = (id: string) => {
    ActiveProjectService.setActiveProjectId(id);
    setCurrentProjectId(id);
  };

  const handleAddStory = (story: Story) => {
    StoryService.create(story);
    setStories(StoryService.getByProject(story.projectId));
  };

  const { projects, addProject, deleteProject, updateProject } = useProjects();
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(
    ActiveProjectService.getActiveProjectId(),
  );

  const handleDeleteStory = (id: string) => {
  StoryService.delete(id);

  // odśwież listę story dla aktualnego projektu
  if (currentProjectId) {
    setStories(StoryService.getByProject(currentProjectId));
  }
};

  const handleStatusChange = (story: Story, status: Status) => {
  const updated = { ...story, status };
  StoryService.update(updated);
  setStories(StoryService.getByProject(story.projectId));
};

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="bg-red-500 text-white p-10 text-4xl text-center mb-10 rounded-lg">
          ManageMe
        </h1>

        <UserProfile></UserProfile>

        <ProjectForm onAdd={addProject} />


        <ProjectList
          projects={projects}
          onDelete={deleteProject}
          onEdit={updateProject}
          currentProjectId={currentProjectId}
          onSelectProject={handleSelectProject}
        />
        {currentProjectId ? (
  <>
    <StoryForm projectId={currentProjectId} onAdd={handleAddStory} />

    <StoryList
      stories={stories}
      onDelete={handleDeleteStory}
      onStatusChange={handleStatusChange}
    />
  </>
) : (
  <p className="text-center mt-6">
    Select a project to see stories
  </p>
)}
      </div>
    </div>
    
  );
}

export default App;
