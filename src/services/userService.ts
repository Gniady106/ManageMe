import type { User } from "../models/User"

export class UserService {
  static getCurrentUser(): User {
    return {
      id: "1",
      firstName: "Michał",
      lastName: "Gniadek",
      email: "user@mail.com"
    };
  }
}