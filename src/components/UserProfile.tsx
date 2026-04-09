import { UserService } from "../services/userService";

export default function UserProfile() {
  const user = UserService.getCurrentUser();

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold shrink-0">
        {user.firstName[0]}{user.lastName[0]}
      </div>
      <div className="text-right">
        <p className="font-semibold text-white text-sm">{user.firstName} {user.lastName}</p>
        <p className="text-xs text-red-200">{user.email}</p>
      </div>
    </div>
  );
}