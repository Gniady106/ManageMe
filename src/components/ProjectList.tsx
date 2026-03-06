import { useState } from "react"
import type { Project } from "../models/Project"

interface Props {
  projects: Project[]
  onDelete: (id: string) => void
  onEdit: (updatedProject: Project) => void
  currentProjectId: string | null
  onSelectProject: (id: string) => void
}

export default function ProjectList({
  projects,
  onDelete,
  onEdit,
  currentProjectId,
  onSelectProject,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")

  function startEdit(project: Project) {
    setEditingId(project.id)
    setEditName(project.name)
    setEditDescription(project.description)
  }

  function saveEdit(id: string) {
    onEdit({ id, name: editName, description: editDescription })
    setEditingId(null)
    setEditName("")
    setEditDescription("")
  }

  return (
    <div className="max-w-md mx-auto mt-6 space-y-3">
      {projects.length === 0 ? (
        <p className="text-center text-gray-500">No projects added yet.</p>
      ) : (
        projects.map(project => {
          const isActive = currentProjectId === project.id
          return (
            <div
              key={project.id}
              className={`bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center
                ${isActive ? "border-2 border-blue-500" : ""}
              `}
            >
              <div className="flex-1 w-full cursor-pointer" onClick={() => onSelectProject(project.id)}>
                {editingId === project.id ? (
                  <div className="space-y-2">
                    <input
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                    />
                    <input
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value)}
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-lg">{project.name}</h3>

                
                    {isActive && (
                      <p className="text-gray-600 mt-1">{project.description}</p>
                    )}

                
                  </>
                )}
              </div>


              <div className="flex mt-2 md:mt-0 md:ml-4 space-x-2">
                {editingId === project.id ? (
                  <button
                    onClick={() => saveEdit(project.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      startEdit(project)
                      onSelectProject(project.id)
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => onDelete(project.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}