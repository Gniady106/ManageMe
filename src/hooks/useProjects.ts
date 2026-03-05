import { useState, useEffect } from "react"
import type { Project } from "../models/Project"
import { projectService } from "../services/projectService"

export function useProjects() {

  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    setProjects(projectService.getAll())
  }, [])

  function addProject(project: Project) {
    projectService.create(project)
    setProjects(projectService.getAll())
  }

  function deleteProject(id: string) {
    projectService.delete(id)
    setProjects(projectService.getAll())
  }

  function updateProject(project: Project) {
    projectService.update(project)
    setProjects(projectService.getAll())
  }

  return {
    projects,
    addProject,
    deleteProject,
    updateProject
  }
}