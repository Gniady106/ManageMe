import { useAuth } from "../context/AuthContext";

export function GuestPage() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 
                      border border-gray-200 dark:border-gray-700
                      rounded-xl shadow-lg p-10 max-w-md w-full text-center">
        
        <div className="text-6xl mb-4">⏳</div>

        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Waiting for approval
        </h1>

        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Your account has been created but is waiting for an administrator to
          assign you a role. Please check back later.
        </p>

        <button
          onClick={logout}
          className="w-full 
                     bg-red-500 hover:bg-red-600 
                     dark:bg-red-600 dark:hover:bg-red-700
                     text-white font-semibold py-3 rounded-lg 
                     transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}