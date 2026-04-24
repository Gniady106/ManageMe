import { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../models/User";
import { UserService } from "../services/userService";

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(
    UserService.getCurrentUser()
  );

  function setCurrentUser(user: User | null) {
    if (user) {
      UserService.setCurrentUser(user);
    } else {
      UserService.clearCurrentUser();
    }
    setCurrentUserState(user);
  }

  function logout() {
    UserService.clearCurrentUser();
    setCurrentUserState(null);
  }

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}