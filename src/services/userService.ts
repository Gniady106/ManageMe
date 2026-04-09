import type { User } from "../models/User"


const USERS: User[] = [
  {
    id: "1",
    firstName: "Michał",
    lastName: "Gniadek",
    email: "michal@manageme.com",
    role: "admin",
  },
  {
    id: "2",
    firstName: "Anna",
    lastName: "Kowalska",
    email: "anna@manageme.com",
    role: "developer",
  },
  {
    id: "3",
    firstName: "Piotr",
    lastName: "Nowak",
    email: "piotr@manageme.com",
    role: "devops",
  },
];

export class UserService {
  static getCurrentUser(): User {
    return USERS[0];
  }

  static getAll(): User[] {
    return USERS;
  }

  static getAssignable(): User[] {
    return USERS.filter((u) => u.role === "developer" || u.role === "devops");
  }

  static getById(id: string): User | undefined {
    return USERS.find((u) => u.id === id);
  }
}