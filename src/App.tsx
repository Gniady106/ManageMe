import { useState, useEffect } from "react";
import ProjectForm from "./components/ProjectForm";
import ProjectList from "./components/ProjectList";
import UserProfile from "./components/UserProfile";
import { useAuth } from "./context/AuthContext";
import { LoginPage } from "./components/LoginPage";
import { GuestPage } from "./components/GuestPage";
import { UserList } from "./components/UserList";
import { Mail, Users } from "lucide-react";
import { DarkModeToggle } from "./components/DarkModeToggle";
import { useProjects } from "./hooks/useProjects";
import { NotificationList } from "./components/NotificationList";
import { NotificationDetail } from "./components/NotificationDetail";
import { NotificationPopup } from "./components/NotificationPopup";
import { NotificationTriggers } from "./services/notificationTriggers";
import { useNotifications } from "./context/NotificationContext";
import type { Notification } from "./models/Notifications";

type View = "projects" | "notifications" | "users";

function App() {
  const { currentUser, logout } = useAuth();
  const { projects, addProject, deleteProject, updateProject } = useProjects();
  const { pushPopup, refresh } = useNotifications();
  const [view, setView] = useState<View>("projects");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);


  if (!currentUser) return <LoginPage />;

 
  if (currentUser.blocked) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Account blocked</h1>
          <p className="text-gray-500 text-sm mb-8">
            Your account has been blocked. Contact an administrator.
          </p>
          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }


  if (currentUser.role === "guest") return <GuestPage />;

  function handleAddProject(project: Parameters<typeof addProject>[0]) {
    addProject(project);
    const sent = NotificationTriggers.onProjectCreated(project.name);
    pushPopup(sent);
    refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 p-8">
      <div className="max-w-8xl mx-auto">

        
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
              className="text-white/80 hover:text-white transition-colors"
            >
              <Mail size={20} />
            </button>

           
            {currentUser.role === "admin" && (
              <button
                onClick={() => setView("users")}
                className="text-white/80 hover:text-white transition-colors"
              >
                <Users size={20} />
              </button>
            )}

            <UserProfile
              onOpenNotifications={() => {
                setView("notifications");
                setSelectedNotification(null);
              }}
            />

            <DarkModeToggle />

            <button
              onClick={logout}
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              Sign out
            </button>
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
                onBack={() => { setSelectedNotification(null); refresh(); }}
              />
            ) : (
              <NotificationList onSelect={setSelectedNotification} />
            )}
          </div>
        )}

        
        {view === "users" && currentUser.role === "admin" && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow p-6">
            <UserList />
          </div>
        )}
      </div>

      <NotificationPopup />
    </div>
  );
}

export default App;