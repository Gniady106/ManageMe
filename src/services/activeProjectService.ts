const ACTIVE_PROJECT_KEY = "manageme_active_project";

export class ActiveProjectService {
  static setActiveProjectId(id: string) {
    localStorage.setItem(ACTIVE_PROJECT_KEY, id);
  }

  static getActiveProjectId(): string | null {
    return localStorage.getItem(ACTIVE_PROJECT_KEY);
  }

  static clearActiveProject() {
    localStorage.removeItem(ACTIVE_PROJECT_KEY);
  }
}