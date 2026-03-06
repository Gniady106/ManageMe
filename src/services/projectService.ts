import type { Project } from "../models/Project";

const STORAGE_KEY = "projects"


export const projectService = {
  
  

  getAll(): Project[] {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  },

  saveAll(projects: Project[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  },

  create(project: Project) {
    const projects = this.getAll()
    projects.push(project)
    this.saveAll(projects)
  },

  update(updatedProject: Project) {
    const projects = this.getAll().map(p =>
      p.id === updatedProject.id ? updatedProject : p
    )
    this.saveAll(projects)
  },

  delete(id: string) {
    const projects = this.getAll().filter(p => p.id !== id)
    this.saveAll(projects)
  }

}