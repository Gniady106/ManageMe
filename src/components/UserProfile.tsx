import { UserService } from "../services/userService"


export default function UserProfile() {
  const user = UserService.getCurrentUser();

  console.log("User profile rendered with user:", user)
  return (
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">User profile</h2>

      <p><b>Name:</b> {user.firstName}</p>
      <p><b>Last name:</b> {user.lastName}</p>
      <p><b>Email:</b> {user.email}</p>
    </div>
  )
}