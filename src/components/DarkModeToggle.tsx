import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  function toggleDarkMode() {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDark(!dark);
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="relative w-14 h-7 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full p-1 transition-colors duration-300"
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center
        transform transition-transform duration-300
        ${dark ? "translate-x-7" : "translate-x-0"}`}
      >
       {dark ? <Moon size={16} color="#4B5563" /> : <Sun size={16} color="#ffd363ff" />}
      </div>
    </button>
  );
}