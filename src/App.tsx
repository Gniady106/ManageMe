
import ProjectForm from "./components/ProjectForm"
import ProjectList from "./components/ProjectList"
import { useProjects } from "./hooks/useProjects"



function App() {

 
   const { projects, addProject, deleteProject, updateProject } = useProjects()
 
   
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-2xl mx-auto">

        <h1 className="bg-red-500 text-white p-10 text-4xl text-center mb-10 rounded-lg">
          ManageMe
        </h1>

        <ProjectForm onAdd={addProject} />

        <ProjectList
          projects={projects}
          onDelete={deleteProject}
          onEdit={updateProject}
        />

      </div>

    </div>
  )
}

export default App
