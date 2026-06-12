import { Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { Sparkles } from "lucide-react";

export function Header() {
  const { brand } = useStore();
  const isImg = brand.logo?.startsWith("data:") || brand.logo?.startsWith("http");
  return (
    <header className="sticky top-0 z-40 glass">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="size-9 rounded-full grid place-items-center overflow-hidden bg-gradient-to-br from-[var(--plum)] to-[var(--gold)] text-white font-display text-lg shadow-lg shadow-[color:var(--plum)]/30 group-hover:scale-105 transition">
            {isImg ? <img src={brand.logo} alt="logo" className="size-full object-cover" /> : (brand.logo?.slice(0, 3) || "DYL")}
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg tracking-wide">{brand.name}</div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Tejido Premium</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#catalogo" className="hover:text-[var(--plum)] transition">Catálogo</a>
          <a href="#colecciones" className="hover:text-[var(--plum)] transition">Colecciones</a>
          <a href="#testimonios" className="hover:text-[var(--plum)] transition">Testimonios</a>
          <a href="#faqs" className="hover:text-[var(--plum)] transition">FAQs</a>
        </nav>
        <a
          href="#catalogo"
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm bg-foreground text-background hover:bg-[var(--plum)] transition"
        >
          <Sparkles className="size-3.5" /> Explorar
        </a>
      </div>
    </header>
  );
}
