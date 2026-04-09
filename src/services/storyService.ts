import type { Story } from "../models/Story";

const STORAGE_KEY = "manageme_stories";

export class StoryService {

  static getAll(): Story[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveAll(stories: Story[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  }

  static getByProject(projectId: string): Story[] {
    return this.getAll().filter(s => s.projectId === projectId);
  }

  static create(story: Story) {
    const stories = this.getAll();
    stories.push(story);
    this.saveAll(stories);
  }

  static update(updatedStory: Story) {
    const stories = this.getAll().map(s =>
      s.id === updatedStory.id ? updatedStory : s
    );
    this.saveAll(stories);
  }

  static delete(id: string) {
    const stories = this.getAll().filter(s => s.id !== id);
    this.saveAll(stories);
  }
}