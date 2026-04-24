import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { UserService } from "../services/userService";
import { NotificationTriggers } from "../services/notificationTriggers";
import { useNotifications } from "../context/NotificationContext";

export function LoginPage() {
  const { setCurrentUser } = useAuth();
  const { pushPopup, refresh } = useNotifications();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {

      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      const data = await res.json();

      const { user, isNew } = UserService.loginOrCreate({
        id: data.sub,
        email: data.email,
        firstName: data.given_name ?? data.name ?? "User",
        lastName: data.family_name ?? "",
      });

     
      if (isNew) {
        const sent = NotificationTriggers.onNewUserRegistered(
          `${user.firstName} ${user.lastName}`,
          user.email
        );
        pushPopup(sent);
        refresh();
      }

      setCurrentUser(user);
    },
    onError: () => {
      console.error("Google login failed");
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
      <div className="rounded-xl bg-blue-500 shadow-lg p-10 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-white mb-2">ManageMe</h1>
        <p className="text-white/80 mb-8 text-sm">Project management app</p>

        <button
          onClick={() => login()}
          className="flex items-center justify-center gap-3 w-full border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all shadow-sm"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}