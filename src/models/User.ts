export type Role = "admin" | "developer" | "devops" | "guest";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  blocked: boolean;
}