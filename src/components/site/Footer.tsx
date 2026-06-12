import { useStore } from "@/lib/store";
import { Instagram, Facebook, Music2, MessageCircle } from "lucide-react";

export function Footer() {
  const { brand, contact } = useStore();
  return (
    <footer id="contacto" className="relative mt-16">
      <div className="absolute inset-0 weave-bg opacity-30" aria-hidden />
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${brand.bannerTo}, transparent)` }}
      />
      <div className="relative max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="font-display text-3xl">{brand.name}</div>
          <p className="mt-3 text-muted-foreground max-w-sm">{brand.tagline}</p>
          <a
            href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent("Hola Textiles DYL, quisiera más información.")}`}
            target="_blank" rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-foreground text-background hover:bg-[var(--plum)] transition"
          >
            <MessageCircle className="size-4" /> Escríbenos por WhatsApp
          </a>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">Navegación</div>
          <ul className="space-y-2 text-sm">
            <li><a href="#catalogo" className="hover:text-[var(--plum)]">Catálogo</a></li>
            <li><a href="#colecciones" className="hover:text-[var(--plum)]">Colecciones</a></li>
            <li><a href="#testimonios" className="hover:text-[var(--plum)]">Testimonios</a></li>
            <li><a href="#faqs" className="hover:text-[var(--plum)]">FAQs</a></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">Síguenos</div>
          <div className="flex gap-3">
            <Social href={contact.instagram} icon={<Instagram className="size-4" />} />
            <Social href={contact.tiktok} icon={<Music2 className="size-4" />} />
            <Social href={contact.facebook} icon={<Facebook className="size-4" />} />
          </div>
        </div>
      </div>
      <div className="relative border-t border-border/60">
        <div className="max-w-7xl mx-auto px-6 py-5 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} {brand.name}. Hilado con amor.</span>
          <span className="tracking-[0.25em] uppercase">Tejido · Futuro · Mujer</span>
        </div>
      </div>
    </footer>
  );
}

function Social({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="size-10 grid place-items-center glass rounded-full hover:bg-[color:var(--gold)]/30 transition">
      {icon}
    </a>
  );
}
