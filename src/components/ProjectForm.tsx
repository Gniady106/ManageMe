import { useState } from "react"
import type { Project } from "../models/Project"

interface Props {
  onAdd: (project: Project) => void
}

export default function ProjectForm({ onAdd }: Props) {

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const project: Project = {
      id: crypto.randomUUID(),
      name,
      description
    }

    onAdd(project)

    setName("")
    setDescription("")
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Add New Project</h2>

      <input
        className="w-full mb-3 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Project name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        className="w-full mb-3 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <button 
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded transition-colors"
      >
        Add Project
      </button>
    </form>
  )
}