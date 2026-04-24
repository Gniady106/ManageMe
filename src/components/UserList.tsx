import { useState, useEffect } from "react";
import { UserService } from "../services/userService";
import type { User, Role } from "../models/User";

const ROLE_OPTIONS: Role[] = ["admin", "developer", "devops", "guest"];

const ROLE_BADGE: Record<Role, string> = {
  admin: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  developer: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  devops: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  guest: "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300",
};

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setUsers(UserService.getAll());
  }, []);

  function handleRoleChange(userId: string, role: Role) {
    UserService.updateRole(userId, role);
    setUsers(UserService.getAll());
  }

  function handleToggleBlock(userId: string) {
    UserService.toggleBlock(userId);
    setUsers(UserService.getAll());
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Users
      </h2>

      {users.length === 0 ? (
        <p className="text-center text-gray-400 dark:text-gray-500 italic py-8">
          No users yet.
        </p>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className={`bg-white dark:bg-gray-800 
                          border rounded-lg p-4 flex items-center gap-4 transition-all
                          ${
                            user.blocked
                              ? "opacity-50 border-red-200 dark:border-red-700"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
            >
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {user.email}
                </p>
              </div>

              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${ROLE_BADGE[user.role]}`}
              >
                {user.role}
              </span>

              <select
                value={user.role}
                onChange={(e) =>
                  handleRoleChange(user.id, e.target.value as Role)
                }
                className="text-sm 
                           border border-gray-300 dark:border-gray-600 
                           rounded p-1 
                           bg-white dark:bg-gray-900 
                           text-gray-800 dark:text-gray-100
                           focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              <button
                onClick={() => handleToggleBlock(user.id)}
                className={`text-xs px-3 py-1 rounded-lg font-semibold transition-colors
                ${
                  user.blocked
                    ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
                    : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                }`}
              >
                {user.blocked ? "Unblock" : "Block"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}