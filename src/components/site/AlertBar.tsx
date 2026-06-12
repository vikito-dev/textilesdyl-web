import { useStore } from "@/lib/store";

export function AlertBar() {
  const { alert } = useStore();
  if (!alert.enabled || !alert.text) return null;
  return (
    <div
      className="w-full text-center text-xs sm:text-sm py-2 px-4 font-medium tracking-wide"
      style={{ background: alert.bg, color: alert.fg }}
    >
      {alert.text}
    </div>
  );
}
