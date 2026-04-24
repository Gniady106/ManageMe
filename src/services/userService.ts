import type { User, Role } from "../models/User";

const STORAGE_KEY = "manageme_users";
const SUPER_ADMIN_EMAIL = "michalgniadek123123@gmail.com"; // ← wpisz swój email

export const UserService = {
  getAll(): User[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveAll(users: User[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  },

  getById(id: string): User | undefined {
    return this.getAll().find((u) => u.id === id);
  },

  getByEmail(email: string): User | undefined {
    return this.getAll().find((u) => u.email === email);
  },

  getAssignable(): User[] {
    return this.getAll().filter(
      (u) => u.role === "developer" || u.role === "devops"
    );
  },

  
  loginOrCreate(googleUser: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  }): { user: User; isNew: boolean } {
    const existing = this.getByEmail(googleUser.email);
    if (existing) {
      return { user: existing, isNew: false };
    }

    const role: Role =
      googleUser.email === SUPER_ADMIN_EMAIL ? "admin" : "guest";

    const newUser: User = {
      id: googleUser.id,
      firstName: googleUser.firstName,
      lastName: googleUser.lastName,
      email: googleUser.email,
      role,
      blocked: false,
    };

    const users = this.getAll();
    users.push(newUser);
    this.saveAll(users);

    return { user: newUser, isNew: true };
  },

  updateRole(userId: string, role: Role) {
    const users = this.getAll().map((u) =>
      u.id === userId ? { ...u, role } : u
    );
    this.saveAll(users);
  },

  toggleBlock(userId: string) {
    const users = this.getAll().map((u) =>
      u.id === userId ? { ...u, blocked: !u.blocked } : u
    );
    this.saveAll(users);
  },

  getCurrentUser(): User | null {
    const data = localStorage.getItem("manageme_current_user");
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser(user: User) {
    localStorage.setItem("manageme_current_user", JSON.stringify(user));
  },

  clearCurrentUser() {
    localStorage.removeItem("manageme_current_user");
  },
};