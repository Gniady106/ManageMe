import { NotificationService } from "./notificationService";
import { UserService } from "./userService";
import type { Notification } from "../models/Notifications";

function getAdminIds(): string[] {
  return UserService.getAll()
    .filter((u) => u.role === "admin")
    .map((u) => u.id);
}

function sendToMany(
  recipientIds: string[],
  title: string,
  message: string,
  priority: "low" | "medium" | "high"
): Notification[] {
  return recipientIds.map((id) =>
    NotificationService.send(id, title, message, priority)
  );
}

export const NotificationTriggers = {
  
  onProjectCreated(projectName: string): Notification[] {
    return sendToMany(
      getAdminIds(),
      "New project created",
      `Project "${projectName}" has been created.`,
      "high"
    );
  },

  
  onTaskAssigned(taskName: string, recipientId: string): Notification[] {
    return sendToMany(
      [recipientId],
      "You have been assigned to a task",
      `You have been assigned to task "${taskName}".`,
      "high"
    );
  },

  
  onStoryAssigned(storyName: string, recipientId: string): Notification[] {
    return sendToMany(
      [recipientId],
      "You have been assigned to a story",
      `You have been assigned to story "${storyName}".`,
      "high"
    );
  },

 
  onTaskCreated(taskName: string, storyName: string, ownerId: string): Notification[] {
    return sendToMany(
      [ownerId],
      "New task in your story",
      `Task "${taskName}" was added to story "${storyName}".`,
      "medium"
    );
  },

  
  onTaskDeleted(taskName: string, storyName: string, ownerId: string): Notification[] {
    return sendToMany(
      [ownerId],
      "Task removed from your story",
      `Task "${taskName}" was removed from story "${storyName}".`,
      "medium"
    );
  },

  
  onTaskDoing(taskName: string, storyName: string, ownerId: string): Notification[] {
    return sendToMany(
      [ownerId],
      "Task started",
      `Task "${taskName}" in story "${storyName}" is now in progress.`,
      "low"
    );
  },


  onTaskDone(taskName: string, storyName: string, ownerId: string): Notification[] {
    return sendToMany(
      [ownerId],
      "Task completed",
      `Task "${taskName}" in story "${storyName}" has been completed.`,
      "medium"
    );
  },
};