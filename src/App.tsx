import { useState, useEffect } from "react";
import ProjectForm from "./components/ProjectForm";
import ProjectList from "./components/ProjectList";
import UserProfile from "./components/UserProfile";
import {StoryForm} from "./components/StoryForm";
import { StoryList } from "./components/StoryList";
import { Mail } from "lucide-react";
import { DarkModeToggle } from "./components/DarkModeToggle";
import { useProjects } from "./hooks/useProjects";
import { ActiveProjectService } from "./services/activeProjectService";
import { StoryService } from "./services/storyService";
import type { Story, Status } from "./models/Story";
import { NotificationList } from "./components/NotificationList";
import { NotificationDetail } from "./components/NotificationDetail";
import { NotificationPopup } from "./components/NotificationPopup";
import { NotificationTriggers } from "./services/notificationTriggers";
import { useNotifications } from "./context/NotificationContext";
import type { Notification } from "./models/Notifications";


type View = "projects" | "notifications";

function App() {
  const activeProjectId = ActiveProjectService.getActiveProjectId();

  const [stories, setStories] = useState<Story[]>([]);
  const { projects, addProject, deleteProject, updateProject } = useProjects();
  const { pushPopup, refresh } = useNotifications();
  const [view, setView] = useState<View>("projects");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

function handleAddProject(project: Parameters<typeof addProject>[0]) {
    addProject(project);
    const sent = NotificationTriggers.onProjectCreated(project.name);
    pushPopup(sent);
    refresh();
  }

  function handleSelectNotification(n: Notification) {
    setSelectedNotification(n);
  }

  function handleBackToList() {
    setSelectedNotification(null);
    refresh();
  }

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

  const [currentProjectId, setCurrentProjectId] = useState<string | null>(
    ActiveProjectService.getActiveProjectId(),
  );

  const handleDeleteStory = (id: string) => {
  StoryService.delete(id);

  
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 p-8">
      <div className="max-w-8xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between bg-blue-500 dark:bg-blue-600 text-white px-8 py-6 rounded-lg shadow-md mb-6">
          <h1
            className="text-4xl font-bold cursor-pointer"
            onClick={() => { setView("projects"); setSelectedNotification(null); }}
          >
            ManageMe
          </h1>
                <div className="flex items-center gap-6">
            <button
              onClick={() => { setView("notifications"); setSelectedNotification(null); }}
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              <Mail size={20} />
            </button>
            <UserProfile onOpenNotifications={() => { setView("notifications"); setSelectedNotification(null); }} />
            <DarkModeToggle />
          </div>
        </div>

        {view === "projects" && (
          <>
            <ProjectForm onAdd={handleAddProject} />
            <ProjectList
              projects={projects}
              onDelete={deleteProject}
              onEdit={updateProject}
            />
          </>
        )}

        {view === "notifications" && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow p-6">
            {selectedNotification ? (
              <NotificationDetail
                notification={selectedNotification}
                onBack={handleBackToList}
              />
            ) : (
              <NotificationList onSelect={handleSelectNotification} />
            )}
          </div>
        )}
      </div>

      <NotificationPopup />
    </div>
  );
}

export default App;