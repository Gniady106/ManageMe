import { mockUser } from "../data/mockUser"


export default function UserProfile() {
  return (
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">User profile</h2>

      <p><b>Name:</b> {mockUser.name}</p>
      <p><b>Last name:</b> {mockUser.lastName}</p>
      <p><b>Email:</b> {mockUser.email}</p>
    </div>
  )
}