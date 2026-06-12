import { useStore } from "@/lib/store";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useStore();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Cambiar tema"
      className="fixed bottom-6 right-6 z-50 size-12 grid place-items-center rounded-full glass shadow-xl shadow-[color:var(--plum)]/30 hover:scale-110 transition"
    >
      {theme === "light" ? <Moon className="size-5" /> : <Sun className="size-5" />}
    </button>
  );
}
