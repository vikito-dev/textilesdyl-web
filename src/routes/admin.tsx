import { createFileRoute } from "@tanstack/react-router";
import { StoreProvider } from "@/lib/store";
import { AdminPanel } from "@/components/admin/AdminPanel";

export const Route = createFileRoute("/admin")({
  head: () => ({ 
    meta: [
      { title: "Admin · TEXTILES DYL" }, 
      { name: "robots", content: "noindex" } // Esto evita que Google indexe tu panel
    ] 
  }),
  component: AdminRoute,
});

function AdminRoute() {
  return (
    <StoreProvider>
      <AdminPanel />
    </StoreProvider>
  );
}