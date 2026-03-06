
import ProjectForm from "./components/ProjectForm"
import ProjectList from "./components/ProjectList"
import { useProjects } from "./hooks/useProjects"
import UserProfile from "./components/UserProfile"
import { useState } from "react"
import { ActiveProjectService } from "./services/activeProjectService"




function App() {

 const handleSelectProject = (id: string) => {
  ActiveProjectService.setActiveProjectId(id)
  setCurrentProjectId(id)
}
  const { projects, addProject, deleteProject, updateProject } = useProjects()
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(ActiveProjectService.getActiveProjectId())
   
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-2xl mx-auto">

        <h1 className="bg-red-500 text-white p-10 text-4xl text-center mb-10 rounded-lg">
          ManageMe
        </h1>

        <UserProfile>

        </UserProfile>

        <ProjectForm onAdd={addProject} />

        <ProjectList
          projects={projects}
          onDelete={deleteProject}
          onEdit={updateProject}
          currentProjectId={currentProjectId}
          onSelectProject={handleSelectProject}
        />

      </div>

    </div>
  )
}

export default App
